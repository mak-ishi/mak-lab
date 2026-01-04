import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/conversations
 * 全会話を取得（新しい順）
 */
export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        messages: {
          take: 1, // 最新のメッセージ1件のみ
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("会話取得エラー:", error);
    return NextResponse.json(
      { error: "会話の取得に失敗しました" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/conversations
 * 新規会話を作成
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title } = body;

    const conversation = await prisma.conversation.create({
      data: {
        title: title || "新しい会話",
      },
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error("会話作成エラー:", error);
    return NextResponse.json(
      { error: "会話の作成に失敗しました" },
      { status: 500 }
    );
  }
}
