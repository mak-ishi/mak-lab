"use client";

import { IconButton } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ColorModeButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ハイドレーションエラーを防ぐ
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleColorMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <IconButton
      aria-label="カラーモード切り替え"
      onClick={toggleColorMode}
      variant="ghost"
      size="md"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </IconButton>
  );
}
