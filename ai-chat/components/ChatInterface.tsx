"use client";

import { Box, Container, Flex, Heading } from "@chakra-ui/react";
import { useState, useCallback, useEffect } from "react";
import { ConversationSidebar } from "./ConversationSidebar";
import { MessageList, Message } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ThemeToggle } from "./ThemeToggle";

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

interface UploadedFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

/**
 * メインチャットインターフェースコンポーネント
 * サイドバー、メッセージリスト、入力欄を統合
 */
export function ChatInterface() {
  // 状態管理
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初期ロード: 会話一覧を取得
  useEffect(() => {
    fetchConversations();
  }, []);

  // 会話一覧を取得
  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/conversations");
      if (!response.ok) throw new Error("会話の取得に失敗しました");
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error("会話取得エラー:", error);
    }
  };

  // 特定の会話のメッセージを取得
  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`);
      if (!response.ok) throw new Error("メッセージの取得に失敗しました");
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("メッセージ取得エラー:", error);
      setMessages([]);
    }
  };

  // 新規会話作成
  const handleNewConversation = useCallback(async () => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "新しい会話" }),
      });

      if (!response.ok) throw new Error("会話の作成に失敗しました");

      const newConversation = await response.json();
      setConversations((prev) => [newConversation, ...prev]);
      setCurrentConversationId(newConversation.id);
      setMessages([]);
    } catch (error) {
      console.error("会話作成エラー:", error);
    }
  }, []);

  // 会話選択
  const handleSelectConversation = useCallback((id: string) => {
    setCurrentConversationId(id);
    fetchMessages(id);
  }, []);

  // 会話削除
  const handleDeleteConversation = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/conversations/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("会話の削除に失敗しました");

        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (currentConversationId === id) {
          setCurrentConversationId(null);
          setMessages([]);
        }
      } catch (error) {
        console.error("会話削除エラー:", error);
      }
    },
    [currentConversationId]
  );

  // 会話エクスポート
  const handleExportConversation = useCallback(
    async (id: string, format: "json" | "markdown") => {
      try {
        // 会話とメッセージを取得
        const response = await fetch(`/api/conversations/${id}`);
        if (!response.ok) throw new Error("会話の取得に失敗しました");

        const data = await response.json();
        const conversation = {
          id: data.id,
          title: data.title,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
        const messages = data.messages || [];

        let content: string;
        let filename: string;
        let mimeType: string;

        if (format === "json") {
          // JSON形式でエクスポート
          content = JSON.stringify(
            {
              conversation,
              messages,
            },
            null,
            2
          );
          filename = `${conversation.title}_${new Date().toISOString().split("T")[0]}.json`;
          mimeType = "application/json";
        } else {
          // Markdown形式でエクスポート
          content = `# ${conversation.title}\n\n`;
          content += `**作成日**: ${new Date(conversation.createdAt).toLocaleString("ja-JP")}\n`;
          content += `**更新日**: ${new Date(conversation.updatedAt).toLocaleString("ja-JP")}\n\n`;
          content += `---\n\n`;

          messages.forEach((msg: Message) => {
            const role = msg.role === "user" ? "👤 ユーザー" : "🤖 AI";
            const timestamp = new Date(msg.createdAt).toLocaleString("ja-JP");

            content += `## ${role}\n`;
            content += `*${timestamp}*\n\n`;

            // 添付ファイル
            if (msg.attachments && msg.attachments.length > 0) {
              content += `**添付ファイル**:\n`;
              msg.attachments.forEach((att) => {
                content += `- [${att.name}](${att.url})\n`;
              });
              content += `\n`;
            }

            content += `${msg.content}\n\n`;
            content += `---\n\n`;
          });

          filename = `${conversation.title}_${new Date().toISOString().split("T")[0]}.md`;
          mimeType = "text/markdown";
        }

        // Blobを作成してダウンロード
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("会話エクスポートエラー:", error);
        alert("エクスポートに失敗しました");
      }
    },
    []
  );

  // メッセージ送信
  const handleSendMessage = useCallback(
    async (content: string, files?: UploadedFile[]) => {
      // 会話がない場合は新規作成
      let conversationId = currentConversationId;
      if (!conversationId) {
        try {
          const response = await fetch("/api/conversations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "新しい会話" }),
          });

          if (!response.ok) throw new Error("会話の作成に失敗しました");

          const newConversation = await response.json();
          conversationId = newConversation.id;
          setConversations((prev) => [newConversation, ...prev]);
          setCurrentConversationId(conversationId);
        } catch (error) {
          console.error("会話作成エラー:", error);
          return;
        }
      }

      // ユーザーメッセージを保存
      try {
        const attachments = files?.map((file) => ({
          type: file.type,
          url: file.url,
          name: file.name,
        }));

        const userMessageResponse = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId,
            role: "user",
            content,
            attachments,
          }),
        });

        if (!userMessageResponse.ok) {
          throw new Error("ユーザーメッセージの保存に失敗しました");
        }

        const userMessage = await userMessageResponse.json();
        setMessages((prev) => [...prev, userMessage]);

        // 会話タイトルを更新（最初のメッセージの場合）
        if (messages.length === 0) {
          const title = content.slice(0, 30) + (content.length > 30 ? "..." : "");
          await fetch(`/api/conversations/${conversationId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
          });

          // 会話リストを更新
          setConversations((prev) =>
            prev.map((c) =>
              c.id === conversationId
                ? { ...c, title, updatedAt: new Date().toISOString() }
                : c
            )
          );
        }

        // AIの応答をストリーミングで生成
        setIsLoading(true);

        // 会話履歴をMastra形式に変換
        const chatMessages = [
          ...messages.map((msg) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            attachments: msg.attachments,
          })),
          {
            id: userMessage.id,
            role: "user",
            content,
            attachments,
          },
        ];

        // ストリーミングAPIを呼び出し
        const chatResponse = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: chatMessages,
            conversationId,
          }),
        });

        if (!chatResponse.ok) {
          throw new Error("AI応答の生成に失敗しました");
        }

        // ストリーミングレスポンスを処理
        const reader = chatResponse.body?.getReader();
        const decoder = new TextDecoder();
        let assistantContent = "";
        let tempMessageId = `temp-${Date.now()}`;

        // 一時的なアシスタントメッセージを追加
        const tempMessage: Message = {
          id: tempMessageId,
          role: "assistant",
          content: "",
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempMessage]);

        if (reader) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value);
              const lines = chunk.split("\n");

              for (const line of lines) {
                if (line.startsWith("0:")) {
                  try {
                    const jsonStr = line.slice(2);
                    const data = JSON.parse(jsonStr);

                    // テキストチャンクを抽出
                    if (data.type === "text-delta" && data.value) {
                      assistantContent += data.value;
                      // UIを更新
                      setMessages((prev) =>
                        prev.map((msg) =>
                          msg.id === tempMessageId
                            ? { ...msg, content: assistantContent }
                            : msg
                        )
                      );
                    }
                  } catch (e) {
                    // JSON解析エラーは無視
                  }
                }
              }
            }
          } finally {
            reader.releaseLock();
          }
        }

        // ストリーミング完了後、MongoDBに保存
        const assistantMessageResponse = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId,
            role: "assistant",
            content: assistantContent,
          }),
        });

        if (!assistantMessageResponse.ok) {
          throw new Error("AIメッセージの保存に失敗しました");
        }

        const assistantMessage = await assistantMessageResponse.json();
        // 一時メッセージを実際のメッセージに置き換え
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMessageId ? assistantMessage : msg
          )
        );
      } catch (error) {
        console.error("メッセージ送信エラー:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentConversationId, messages]
  );

  return (
    <Flex direction="column" h="100vh">
      {/* ヘッダー */}
      <Box
        as="header"
        bg="white"
        borderBottomWidth="1px"
        borderColor="gray.200"
        _dark={{ bg: "gray.800", borderColor: "gray.700" }}
        py={3}
        px={4}
      >
        <Container maxW="full">
          <Flex justify="space-between" align="center">
            <Heading size="md" color="purple.600" _dark={{ color: "purple.300" }}>
              AI Chat
            </Heading>
            <ThemeToggle />
          </Flex>
        </Container>
      </Box>

      {/* メインコンテンツ */}
      <Flex flex={1} overflow="hidden">
        {/* サイドバー */}
        <ConversationSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          onExportConversation={handleExportConversation}
        />

        {/* チャットエリア */}
        <Flex direction="column" flex={1} overflow="hidden">
          {/* メッセージリスト */}
          <MessageList messages={messages} isLoading={isLoading} />

          {/* 入力エリア */}
          <MessageInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={false}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
