"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Text,
  VStack,
  useDisclosure,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
} from "@chakra-ui/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion.create(Box);

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onExportConversation: (id: string, format: "json" | "markdown") => void;
}

/**
 * 会話サイドバーコンポーネント
 * 会話一覧を表示し、新規作成・選択・削除機能を提供
 */
export function ConversationSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onExportConversation,
}: ConversationSidebarProps) {
  const { open: isOpen, onToggle } = useDisclosure();

  return (
    <>
      {/* モバイル: ハンバーガーメニュー */}
      <Box display={{ base: "block", md: "none" }} p={4}>
        <IconButton
          aria-label="メニューを開く"
          onClick={onToggle}
          variant="ghost"
          size="lg"
        >
          ☰
        </IconButton>
      </Box>

      {/* サイドバー本体 */}
      <Box
        w={{ base: "full", md: "280px" }}
        h="full"
        bg="white"
        borderRightWidth="1px"
        borderColor="gray.200"
        _dark={{ bg: "gray.800", borderColor: "gray.700" }}
        display={{ base: isOpen ? "block" : "none", md: "block" }}
        position={{ base: "fixed", md: "relative" }}
        zIndex={10}
        overflowY="auto"
        transition="all 0.3s ease-in-out"
      >
        <VStack gap={4} p={4} align="stretch" h="full">
          {/* ヘッダー */}
          <Flex justify="space-between" align="center">
            <Heading size="md" color="gray.700" _dark={{ color: "gray.200" }}>
              会話履歴
            </Heading>
            {/* モバイル: 閉じるボタン */}
            <IconButton
              aria-label="メニューを閉じる"
              onClick={onToggle}
              variant="ghost"
              size="sm"
              display={{ base: "block", md: "none" }}
            >
              ✕
            </IconButton>
          </Flex>

          {/* 新規会話ボタン */}
          <Button
            colorScheme="purple"
            onClick={onNewConversation}
            w="full"
            size="md"
          >
            ➕ 新しい会話
          </Button>

          {/* 会話リスト */}
          <VStack gap={2} align="stretch" flex={1} overflowY="auto">
            {conversations.length === 0 ? (
              <Text
                color="gray.500"
                _dark={{ color: "gray.400" }}
                textAlign="center"
                py={8}
              >
                会話がありません
              </Text>
            ) : (
              conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={conversation.id === currentConversationId}
                  onSelect={() => onSelectConversation(conversation.id)}
                  onDelete={() => onDeleteConversation(conversation.id)}
                  onExport={(format) => onExportConversation(conversation.id, format)}
                />
              ))
            )}
          </VStack>
        </VStack>
      </Box>
    </>
  );
}

/**
 * 会話アイテムコンポーネント
 */
function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onExport,
}: {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onExport: (format: "json" | "markdown") => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      position="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        onClick={onSelect}
        w="full"
        variant={isActive ? "solid" : "ghost"}
        colorScheme={isActive ? "purple" : "gray"}
        justifyContent="flex-start"
        h="auto"
        py={3}
        px={3}
        fontWeight="normal"
      >
        <VStack align="start" gap={1} w="full">
          <Text
            fontSize="sm"
            fontWeight="semibold"
            lineClamp={1}
            color={isActive ? "white" : "gray.700"}
            _dark={{ color: isActive ? "white" : "gray.200" }}
          >
            {conversation.title}
          </Text>
          <Text
            fontSize="xs"
            color={isActive ? "purple.100" : "gray.500"}
            _dark={{ color: isActive ? "purple.100" : "gray.400" }}
          >
            {new Date(conversation.updatedAt).toLocaleDateString("ja-JP")}
          </Text>
        </VStack>
      </Button>

      {/* アクションボタン（ホバー時表示） */}
      {isHovered && !isActive && (
        <Flex
          position="absolute"
          right={2}
          top="50%"
          transform="translateY(-50%)"
          gap={1}
        >
          {/* エクスポートメニュー */}
          <MenuRoot>
            <MenuTrigger asChild>
              <IconButton
                aria-label="会話をエクスポート"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                size="xs"
                colorScheme="blue"
                variant="ghost"
              >
                💾
              </IconButton>
            </MenuTrigger>
            <MenuContent>
              <MenuItem
                value="json"
                onClick={(e) => {
                  e.stopPropagation();
                  onExport("json");
                }}
              >
                JSON形式
              </MenuItem>
              <MenuItem
                value="markdown"
                onClick={(e) => {
                  e.stopPropagation();
                  onExport("markdown");
                }}
              >
                Markdown形式
              </MenuItem>
            </MenuContent>
          </MenuRoot>

          {/* 削除ボタン */}
          <IconButton
            aria-label="会話を削除"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            size="xs"
            colorScheme="red"
            variant="ghost"
          >
            🗑️
          </IconButton>
        </Flex>
      )}
    </Box>
  );
}
