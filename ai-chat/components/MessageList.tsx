"use client";

import { Box, Flex, Text, VStack, Avatar } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const MotionFlex = motion.create(Flex);

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  attachments?: {
    type: string;
    url: string;
    name: string;
  }[];
}

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

/**
 * メッセージリストコンポーネント
 * チャットメッセージをスクロール可能なリストで表示
 */
export function MessageList({ messages, isLoading = false }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 新しいメッセージが追加されたら自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      flex={1}
      overflowY="auto"
      p={4}
      bg="gray.50"
      _dark={{ bg: "gray.900" }}
      role="log"
      aria-live="polite"
      aria-label="チャットメッセージリスト"
    >
      <VStack gap={4} align="stretch" maxW="4xl" mx="auto">
        {messages.length === 0 ? (
          <Flex
            h="full"
            align="center"
            justify="center"
            minH="400px"
            direction="column"
            gap={3}
          >
            <Text fontSize="4xl">💬</Text>
            <Text
              color="gray.500"
              _dark={{ color: "gray.400" }}
              fontSize="lg"
            >
              メッセージを送信して会話を始めましょう
            </Text>
          </Flex>
        ) : (
          messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))
        )}

        {/* ローディングインジケーター */}
        {isLoading && (
          <Flex gap={3} align="start">
            <Avatar.Root
              size="sm"
              bg="purple.500"
              color="white"
              mt={1}
            >
              <Avatar.Fallback>AI</Avatar.Fallback>
            </Avatar.Root>
            <Box
              bg="white"
              _dark={{ bg: "gray.800" }}
              p={4}
              borderRadius="lg"
              maxW="80%"
            >
              <Flex gap={2}>
                <Box
                  w={2}
                  h={2}
                  bg="gray.400"
                  borderRadius="full"
                  animation="pulse 1.4s ease-in-out infinite"
                />
                <Box
                  w={2}
                  h={2}
                  bg="gray.400"
                  borderRadius="full"
                  animation="pulse 1.4s ease-in-out 0.2s infinite"
                />
                <Box
                  w={2}
                  h={2}
                  bg="gray.400"
                  borderRadius="full"
                  animation="pulse 1.4s ease-in-out 0.4s infinite"
                />
              </Flex>
            </Box>
          </Flex>
        )}

        {/* 自動スクロール用の参照 */}
        <div ref={messagesEndRef} />
      </VStack>
    </Box>
  );
}

/**
 * 個別メッセージアイテムコンポーネント
 */
function MessageItem({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <MotionFlex
      gap={3}
      align="start"
      justify={isUser ? "flex-end" : "flex-start"}
      direction={isUser ? "row-reverse" : "row"}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* アバター */}
      <Avatar.Root
        size="sm"
        bg={isUser ? "blue.500" : "purple.500"}
        color="white"
        mt={1}
      >
        <Avatar.Fallback>{isUser ? "You" : "AI"}</Avatar.Fallback>
      </Avatar.Root>

      {/* メッセージ本体 */}
      <Box maxW="80%">
        <Box
          bg={isUser ? "blue.500" : "white"}
          color={isUser ? "white" : "gray.800"}
          _dark={{
            bg: isUser ? "blue.600" : "gray.800",
            color: isUser ? "white" : "gray.100",
          }}
          p={4}
          borderRadius="lg"
          boxShadow="sm"
        >
          {/* 添付ファイル */}
          {message.attachments && message.attachments.length > 0 && (
            <VStack gap={2} mb={3} align="start" w="full">
              {message.attachments.map((attachment, index) => {
                const isImage = attachment.type?.startsWith("image/");

                if (isImage) {
                  // 画像の場合は表示
                  return (
                    <Box
                      key={index}
                      borderRadius="md"
                      overflow="hidden"
                      maxW="400px"
                      position="relative"
                      cursor="pointer"
                      onClick={() => window.open(attachment.url, "_blank")}
                    >
                      <Image
                        src={attachment.url}
                        alt={attachment.name}
                        width={400}
                        height={300}
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "8px",
                          objectFit: "contain",
                        }}
                        unoptimized
                      />
                    </Box>
                  );
                } else {
                  // ファイルの場合はダウンロードリンク
                  return (
                    <a
                      key={index}
                      href={attachment.url}
                      download={attachment.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        padding: "8px",
                        backgroundColor: isUser ? "#63B3ED" : "#F7FAFC",
                        borderRadius: "6px",
                        fontSize: "14px",
                        cursor: "pointer",
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      📎 {attachment.name}
                    </a>
                  );
                }
              })}
            </VStack>
          )}

          {/* メッセージテキスト */}
          <Text whiteSpace="pre-wrap" fontSize="md">
            {message.content}
          </Text>
        </Box>

        {/* タイムスタンプ */}
        <Text
          fontSize="xs"
          color="gray.500"
          _dark={{ color: "gray.400" }}
          mt={1}
          textAlign={isUser ? "right" : "left"}
        >
          {new Date(message.createdAt).toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </Box>
    </MotionFlex>
  );
}
