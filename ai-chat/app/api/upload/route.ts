import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

// ファイルサイズ制限: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// 許可するファイル形式
const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "application/pdf",
  "text/plain",
  "text/markdown",
];

const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".pdf", ".txt", ".md"];

/**
 * POST /api/upload
 * ファイルをアップロードして保存
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "ファイルが選択されていません" },
        { status: 400 }
      );
    }

    // ファイルサイズチェック
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "ファイルサイズが10MBを超えています" },
        { status: 400 }
      );
    }

    // ファイル形式チェック
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (
      !ALLOWED_TYPES.includes(file.type) &&
      !ALLOWED_EXTENSIONS.includes(fileExtension)
    ) {
      return NextResponse.json(
        { error: "サポートされていないファイル形式です" },
        { status: 400 }
      );
    }

    // ファイル名をユニークにする（タイムスタンプ + ランダム文字列）
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}-${randomString}-${originalName}`;

    // ファイルをpublic/uploadsに保存
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public", "uploads");
    const filePath = join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // ファイルのURLを生成
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("ファイルアップロードエラー:", error);
    return NextResponse.json(
      { error: "ファイルのアップロードに失敗しました" },
      { status: 500 }
    );
  }
}
