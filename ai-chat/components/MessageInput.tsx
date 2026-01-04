"use client";

import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Textarea,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import Image from "next/image";

interface UploadedFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

interface MessageInputProps {
  onSendMessage: (message: string, files?: UploadedFile[]) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

/**
 * メッセージ入力コンポーネント
 * テキスト入力、ファイルアップロード、送信機能を提供
 */
export function MessageInput({
  onSendMessage,
  isLoading = false,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() || files.length > 0) {
      onSendMessage(message.trim(), files.length > 0 ? files : undefined);
      setMessage("");
      setFiles([]);
      // テキストエリアにフォーカスを戻す
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enterキーで送信（Shift+Enterで改行）
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSend();
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setUploading(true);

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("ファイルアップロードエラー:", error);
          alert(`${file.name}のアップロードに失敗しました: ${error.error}`);
          continue;
        }

        const uploadedFile = await response.json();
        setFiles((prev) => [
          ...prev,
          {
            name: uploadedFile.filename,
            url: uploadedFile.url,
            type: uploadedFile.type,
            size: uploadedFile.size,
          },
        ]);
      }
    } catch (error) {
      console.error("ファイルアップロードエラー:", error);
      alert("ファイルのアップロードに失敗しました");
    } finally {
      setUploading(false);
      // inputをリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box
      borderTopWidth="1px"
      borderColor="gray.200"
      bg="white"
      _dark={{ borderColor: "gray.700", bg: "gray.800" }}
      p={4}
    >
      <VStack gap={3} maxW="4xl" mx="auto">
        {/* 添付ファイル表示 */}
        {files.length > 0 && (
          <Flex gap={2} flexWrap="wrap" w="full">
            {files.map((file, index) => (
              <Box
                key={index}
                position="relative"
                bg="gray.100"
                _dark={{ bg: "gray.700" }}
                borderRadius="md"
                overflow="hidden"
              >
                {file.type.startsWith("image/") ? (
                  /* 画像プレビュー */
                  <Box position="relative">
                    <Image
                      src={file.url}
                      alt={file.name}
                      width={200}
                      height={150}
                      style={{
                        maxWidth: "200px",
                        maxHeight: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                      unoptimized
                    />
                    <IconButton
                      aria-label="ファイルを削除"
                      size="sm"
                      variant="solid"
                      colorScheme="red"
                      position="absolute"
                      top={1}
                      right={1}
                      onClick={() => handleRemoveFile(index)}
                    >
                      ✕
                    </IconButton>
                  </Box>
                ) : (
                  /* ファイルアイコン */
                  <Flex align="center" gap={2} px={3} py={2} fontSize="sm">
                    <span>📎 {file.name}</span>
                    <IconButton
                      aria-label="ファイルを削除"
                      size="xs"
                      variant="ghost"
                      onClick={() => handleRemoveFile(index)}
                    >
                      ✕
                    </IconButton>
                  </Flex>
                )}
              </Box>
            ))}
          </Flex>
        )}

        {/* アップロード中のローディング */}
        {uploading && (
          <Box
            w="full"
            p={3}
            bg="blue.50"
            borderRadius="md"
            fontSize="sm"
            color="blue.700"
            _dark={{ bg: "blue.900", color: "blue.200" }}
          >
            📤 ファイルをアップロード中...
          </Box>
        )}

        {/* 入力エリア */}
        <Flex gap={2} w="full">
          {/* ファイル選択ボタン */}
          <IconButton
            aria-label="ファイルを添付"
            onClick={() => fileInputRef.current?.click()}
            variant="ghost"
            size="lg"
            disabled={disabled || isLoading || uploading}
          >
            📎
          </IconButton>

          {/* 隠しファイル入力 */}
          <Input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.txt,.md"
            display="none"
            onChange={handleFileSelect}
          />

          {/* テキストエリア */}
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力... (Shift+Enterで改行)"
            resize="none"
            minH="56px"
            maxH="200px"
            flex={1}
            disabled={disabled || isLoading}
            aria-label="メッセージ入力欄"
            aria-describedby="message-input-help"
          />

          {/* 送信ボタン */}
          <Button
            onClick={handleSend}
            colorScheme="purple"
            size="lg"
            loading={isLoading}
            disabled={disabled || (!message.trim() && files.length === 0)}
            px={8}
            aria-label="メッセージを送信"
          >
            {isLoading ? "送信中..." : "送信"}
          </Button>
        </Flex>

        {/* ヒント */}
        <Box
          id="message-input-help"
          fontSize="xs"
          color="gray.500"
          _dark={{ color: "gray.400" }}
        >
          Enterで送信 / Shift+Enterで改行
        </Box>
      </VStack>
    </Box>
  );
}
