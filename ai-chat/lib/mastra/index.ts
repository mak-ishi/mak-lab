import { Mastra } from "@mastra/core/mastra";
import { Agent } from "@mastra/core/agent";

/**
 * Mastraインスタンスとエージェントの設定
 */

// チャットアシスタントエージェントを作成
const chatAssistant = new Agent({
  id: "chat-assistant",
  name: "AI Chat Assistant",
  instructions: `あなたは親切で知識豊富なAIアシスタントです。
ユーザーの質問に対して、丁寧で分かりやすい回答を提供してください。
コードを含む場合は、適切なマークダウン形式で記述してください。
日本語で自然な会話を心がけてください。`,
  model: "google/gemini-2.0-flash-exp",
});

// Mastraインスタンスを作成
export const mastra = new Mastra({
  agents: { 'chat-assistant': chatAssistant },
});

// エージェント取得用のヘルパー関数
export function getChatAssistant() {
  return mastra.getAgent("chat-assistant");
}
