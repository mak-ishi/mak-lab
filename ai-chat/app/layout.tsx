import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "@/components/ui/provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Chat - Google Gemini搭載チャットボット",
  description: "Google Gemini APIを使用したAIチャットボットアプリケーション。会話履歴の保存、ストリーミング応答、ファイルアップロード機能を搭載。",
  keywords: ["AI", "Chat", "Gemini", "Chatbot", "Next.js"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
