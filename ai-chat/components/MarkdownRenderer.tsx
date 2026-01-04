"use client";

import { Box, Code, Heading, Link, Text } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useTheme } from "next-themes";
import { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

/**
 * マークダウンレンダラーコンポーネント
 * react-markdownとreact-syntax-highlighterを使用して
 * マークダウンをレンダリング
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // カスタムコンポーネント定義
  const components: Components = {
    // 見出し
    h1: ({ children }) => (
      <Heading as="h1" size="xl" mt={6} mb={4}>
        {children}
      </Heading>
    ),
    h2: ({ children }) => (
      <Heading as="h2" size="lg" mt={5} mb={3}>
        {children}
      </Heading>
    ),
    h3: ({ children }) => (
      <Heading as="h3" size="md" mt={4} mb={2}>
        {children}
      </Heading>
    ),
    h4: ({ children }) => (
      <Heading as="h4" size="sm" mt={3} mb={2}>
        {children}
      </Heading>
    ),
    h5: ({ children }) => (
      <Heading as="h5" size="xs" mt={3} mb={2}>
        {children}
      </Heading>
    ),
    h6: ({ children }) => (
      <Heading as="h6" size="xs" mt={2} mb={1}>
        {children}
      </Heading>
    ),

    // 段落
    p: ({ children }) => (
      <Text mb={3} lineHeight="tall">
        {children}
      </Text>
    ),

    // リンク
    a: ({ href, children }) => (
      <Link
        href={href}
        color="blue.500"
        textDecoration="underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </Link>
    ),

    // インラインコード
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";

      // コードブロックの場合
      if (language) {
        const SH = SyntaxHighlighter as any;
        return (
          <Box my={4} borderRadius="md" overflow="hidden">
            <SH
              style={isDark ? vscDarkPlus : vs}
              language={language}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SH>
          </Box>
        );
      }

      // インラインコードの場合
      return (
        <Code
          px={2}
          py={1}
          borderRadius="md"
          bg="gray.100"
          _dark={{ bg: "gray.700" }}
          fontSize="0.9em"
          {...props}
        >
          {children}
        </Code>
      );
    },

    // リスト
    ul: ({ children }) => (
      <Box as="ul" pl={6} mb={3}>
        {children}
      </Box>
    ),
    ol: ({ children }) => (
      <Box as="ol" pl={6} mb={3}>
        {children}
      </Box>
    ),
    li: ({ children }) => (
      <Box as="li" mb={1}>
        {children}
      </Box>
    ),

    // 引用
    blockquote: ({ children }) => (
      <Box
        borderLeftWidth="4px"
        borderLeftColor="gray.300"
        pl={4}
        py={2}
        my={3}
        fontStyle="italic"
        color="gray.600"
        _dark={{ borderLeftColor: "gray.600", color: "gray.400" }}
      >
        {children}
      </Box>
    ),

    // 水平線
    hr: () => (
      <Box
        as="hr"
        my={4}
        borderColor="gray.300"
        _dark={{ borderColor: "gray.600" }}
      />
    ),

    // テーブル
    table: ({ children }) => (
      <Box overflowX="auto" my={4}>
        <Box
          as="table"
          w="full"
          borderWidth="1px"
          borderColor="gray.300"
          _dark={{ borderColor: "gray.600" }}
          borderRadius="md"
        >
          {children}
        </Box>
      </Box>
    ),
    thead: ({ children }) => (
      <Box
        as="thead"
        bg="gray.100"
        _dark={{ bg: "gray.700" }}
        fontWeight="semibold"
      >
        {children}
      </Box>
    ),
    tbody: ({ children }) => <Box as="tbody">{children}</Box>,
    tr: ({ children }) => (
      <Box
        as="tr"
        borderBottomWidth="1px"
        borderColor="gray.200"
        _dark={{ borderColor: "gray.700" }}
      >
        {children}
      </Box>
    ),
    th: ({ children }) => (
      <Box as="th" px={4} py={2} textAlign="left">
        {children}
      </Box>
    ),
    td: ({ children }) => (
      <Box as="td" px={4} py={2}>
        {children}
      </Box>
    ),
  };

  return (
    <Box>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </Box>
  );
}
