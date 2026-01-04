import { NextRequest } from "next/server";
import { getChatAssistant } from "@/lib/mastra";
import { prisma } from "@/lib/prisma";

// ストリーミングレスポンスのタイムアウトを30秒に設定
export const maxDuration = 30;

/**
 * POST /api/chat
 * チャットメッセージを送信し、AIからのストリーミング応答を受信
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, conversationId } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "メッセージが必要です" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // エージェントを取得
    const agent = getChatAssistant();

    // 最後のメッセージを取得
    const lastMessage = messages[messages.length - 1];
    const messageText = lastMessage.content;
    const attachments = lastMessage.attachments || [];

    // マルチモーダルメッセージを構築
    let messageContent: any;

    if (attachments.length > 0) {
      // 添付ファイルがある場合はcontent配列形式
      const contentParts: any[] = [];

      // 画像を追加
      for (const attachment of attachments) {
        if (attachment.type?.startsWith("image/")) {
          // 相対URLを絶対URLに変換
          const imageUrl = attachment.url.startsWith("http")
            ? attachment.url
            : `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${attachment.url}`;

          contentParts.push({
            type: "image",
            image: imageUrl,
            mimeType: attachment.type,
          });
        }
      }

      // テキストを追加
      if (messageText) {
        contentParts.push({
          type: "text",
          text: messageText,
        });
      }

      messageContent = [
        {
          role: "user",
          content: contentParts,
        },
      ];
    } else {
      // テキストのみの場合
      messageContent = messageText;
    }

    // エージェントでストリーミング応答を生成
    const stream = await agent.stream(messageContent);

    // カスタムストリーミングレスポンスを作成
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // textStreamを使用してチャンクを取得
          for await (const chunk of stream.textStream) {
            if (chunk) {
              // AI SDK v5形式のデータを送信
              const data = {
                type: "text-delta",
                value: chunk,
              };
              const message = `0:${JSON.stringify(data)}\n`;
              controller.enqueue(encoder.encode(message));
            }
          }
          controller.close();
        } catch (error) {
          console.error("ストリーミングエラー:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("チャットAPI エラー:", error);
    return new Response(
      JSON.stringify({
        error: "チャット処理に失敗しました",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * GET /api/chat
 * 会話履歴を取得（オプション）
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return new Response(
        JSON.stringify({ error: "conversationIdが必要です" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // データベースから会話履歴を取得
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return new Response(
        JSON.stringify({ error: "会話が見つかりません" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Mastra形式のメッセージに変換
    const mastraMessages = conversation.messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      parts: [
        {
          type: "text",
          text: msg.content,
        },
      ],
    }));

    return new Response(JSON.stringify(mastraMessages), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("会話履歴取得エラー:", error);
    return new Response(
      JSON.stringify({
        error: "会話履歴の取得に失敗しました",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
