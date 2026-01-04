"use client";

import { Button } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * テーマ切り替えボタンコンポーネント
 * ライト/ダークモードを切り替える
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ハイドレーションエラーを防ぐ
  useEffect(() => {
    setMounted(true);
  }, []);

  // マウント前はnullを返す（ハイドレーションミスマッチ回避）
  if (!mounted) {
    return (
      <Button variant="ghost" size="md" disabled>
        <span style={{ fontSize: "1.2rem" }}>🌓</span>
      </Button>
    );
  }

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="md"
      aria-label={isDark ? "ライトモードに切り替え" : "ダークモードに切り替え"}
      title={isDark ? "ライトモードに切り替え" : "ダークモードに切り替え"}
    >
      <span style={{ fontSize: "1.2rem" }}>{isDark ? "☀️" : "🌙"}</span>
    </Button>
  );
}
