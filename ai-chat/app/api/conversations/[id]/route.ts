import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/conversations/:id
 * 特定の会話とそのメッセージを取得
 */
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "会話が見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("会話取得エラー:", error);
    return NextResponse.json(
      { error: "会話の取得に失敗しました" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/conversations/:id
 * 会話タイトルを更新
 */
export async function PATCH(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { title } = body;

    if (title === undefined) {
      return NextResponse.json(
        { error: "タイトルが必要です" },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.update({
      where: { id },
      data: { title },
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("会話更新エラー:", error);
    return NextResponse.json(
      { error: "会話の更新に失敗しました" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/conversations/:id
 * 会話を削除（メッセージも手動で削除）
 */
export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;

    // 先にメッセージを削除
    await prisma.message.deleteMany({
      where: { conversationId: id },
    });

    // 次に会話を削除
    await prisma.conversation.delete({
      where: { id },
    });

    return NextResponse.json({ message: "会話を削除しました" });
  } catch (error) {
    console.error("会話削除エラー:", error);
    return NextResponse.json(
      { error: "会話の削除に失敗しました" },
      { status: 500 }
    );
  }
}
