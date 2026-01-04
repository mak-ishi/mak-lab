import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/messages
 * メッセージを保存
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, role, content, attachments } = body;

    // バリデーション
    if (!conversationId || !role || !content) {
      return NextResponse.json(
        { error: "conversationId, role, contentが必要です" },
        { status: 400 }
      );
    }

    if (role !== "user" && role !== "assistant") {
      return NextResponse.json(
        { error: "roleは'user'または'assistant'である必要があります" },
        { status: 400 }
      );
    }

    // メッセージを保存
    const message = await prisma.message.create({
      data: {
        conversationId,
        role,
        content,
        attachments: attachments || null,
      },
    });

    // 会話のupdatedAtを更新
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("メッセージ保存エラー:", error);
    return NextResponse.json(
      { error: "メッセージの保存に失敗しました" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/messages?conversationId=xxx
 * 特定の会話のメッセージを取得
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationIdが必要です" },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("メッセージ取得エラー:", error);
    return NextResponse.json(
      { error: "メッセージの取得に失敗しました" },
      { status: 500 }
    );
  }
}
