# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのプロジェクトで作業する際のガイダンスを提供します。

## プロジェクト概要

**ai-chat** - Google Gemini APIを使用したAIチャットボットアプリケーション

Mastraエージェントフレームワークを活用し、会話履歴の永続化、ストリーミング応答、ファイルアップロードなどの機能を備えたモダンなチャットインターフェース。

---

## 🚀 技術スタック

### フロントエンド
- **Next.js 16** - App Routerベースのフレームワーク
- **TypeScript** - 型安全な開発環境
- **Chakra UI** - アクセシビリティ重視のUIコンポーネントライブラリ
- **React Markdown** - マークダウンレンダリング
- **React Syntax Highlighter** - コードのシンタックスハイライト

### バックエンド
- **Next.js API Routes** - App Router内のAPI実装
- **Hono** - 高速で軽量なWebフレームワーク
- **Prisma** - 型安全なORMツール
- **MongoDB** - NoSQLデータベース（会話履歴保存）

### AI/エージェント
- **Mastra** - AIエージェントフレームワーク
- **Google Gemini API** - AI推論エンジン

### デプロイ
- **Vercel** - Next.js最適化されたホスティングプラットフォーム

---

## 📦 セットアップ

### 前提条件
- Node.js 18.x以上
- npm または yarn
- MongoDB インスタンス（ローカルまたはMongoDB Atlas）
- Google Gemini API キー

### インストール

```bash
cd ai-chat
npm install
```

### 環境変数設定

`.env.local`ファイルを作成し、以下の環境変数を設定：

```bash
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB接続文字列
DATABASE_URL="mongodb://localhost:27017/ai-chat"
# または MongoDB Atlas
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/ai-chat"

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Prismaセットアップ

```bash
# Prismaクライアント生成
npx prisma generate

# データベースマイグレーション
npx prisma db push

# Prisma Studio起動（オプション）
npx prisma studio
```

### 開発サーバー起動

```bash
npm run dev
```

その後、http://localhost:3000 にアクセス

---

## 📁 ディレクトリ構成

```
ai-chat/
├── app/                          # Next.js App Router
│   ├── api/                      # APIルート
│   │   ├── chat/                 # チャットAPI（Mastra統合）
│   │   ├── conversations/        # 会話管理API
│   │   └── upload/               # ファイルアップロードAPI
│   ├── page.tsx                  # メインチャット画面
│   ├── layout.tsx                # ルートレイアウト
│   └── globals.css               # グローバルスタイル
├── components/                   # Reactコンポーネント
│   ├── ChatInterface.tsx         # チャットUI
│   ├── MessageList.tsx           # メッセージ表示
│   ├── MessageInput.tsx          # 入力フォーム
│   ├── ConversationSidebar.tsx   # 会話履歴サイドバー
│   ├── MarkdownRenderer.tsx      # マークダウン表示
│   └── ThemeToggle.tsx           # テーマ切り替え
├── lib/                          # ユーティリティ
│   ├── mastra/                   # Mastra設定
│   ├── prisma.ts                 # Prismaクライアント
│   └── gemini.ts                 # Gemini API設定
├── prisma/                       # Prismaスキーマ
│   └── schema.prisma             # データモデル定義
└── public/                       # 静的ファイル
```

---

## 🏗️ アーキテクチャ

### データモデル

**Conversation（会話）**
```prisma
model Conversation {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  messages  Message[]
}
```

**Message（メッセージ）**
```prisma
model Message {
  id             String       @id @default(auto()) @map("_id") @db.ObjectId
  conversationId String       @db.ObjectId
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  role           String       // 'user' | 'assistant'
  content        String
  attachments    Json?        // ファイルアップロード情報
  createdAt      DateTime     @default(now())
}
```

### 主要機能の実装

#### 1. 基本的なチャット機能
- **エンドポイント**: `POST /api/chat`
- **処理フロー**:
  1. ユーザーメッセージを受信
  2. Mastraエージェントに送信
  3. Gemini APIで推論
  4. ストリーミング応答を返却
  5. MongoDBに保存

#### 2. ストリーミング応答
- Server-Sent Events (SSE) またはNext.js StreamingResponse使用
- リアルタイムで応答を画面に表示
- ユーザー体験の向上

#### 3. 会話履歴管理
- **作成**: `POST /api/conversations`
- **取得**: `GET /api/conversations`
- **更新**: `PATCH /api/conversations/:id`
- **削除**: `DELETE /api/conversations/:id`
- サイドバーで会話一覧を表示、切り替え可能

#### 4. ファイルアップロード
- **エンドポイント**: `POST /api/upload`
- **対応形式**: 画像（PNG、JPG、WEBP）、ドキュメント（PDF、TXT、MD）
- **処理**:
  1. Next.js API Routeでファイル受信
  2. Vercel Blob または public/ ディレクトリに保存
  3. ファイルパスをメッセージに添付
  4. Gemini APIの multimodal 機能で解析

#### 5. マークダウン表示
- **ライブラリ**: `react-markdown`
- **機能**:
  - 見出し、リスト、リンク、テーブルのレンダリング
  - LaTeX数式対応（オプション）
  - カスタムスタイリング

#### 6. シンタックスハイライト
- **ライブラリ**: `react-syntax-highlighter`
- **テーマ**: Chakra UIのカラーモードに応じて切り替え
- **対応言語**: JavaScript、TypeScript、Python、Rust、Go、SQL、など

#### 7. 会話のエクスポート
- **形式**: JSON、Markdown
- **実装**:
  - クライアントサイドでデータ整形
  - `Blob` APIでファイル生成
  - ダウンロードリンクを提供

#### 8. テーマ切り替え
- **実装**: Chakra UI の `useColorMode` フック使用
- **モード**: ライト/ダーク
- **永続化**: localStorage に保存

---

## 🔧 Mastraの統合

### エージェント設定

```typescript
// lib/mastra/agent.ts
import { Mastra } from '@mastra/core';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const mastra = new Mastra({
  agents: [
    {
      name: 'chat-assistant',
      model: new GoogleGenerativeAI(process.env.GEMINI_API_KEY!),
      instructions: 'あなたは親切で知識豊富なAIアシスタントです。',
      tools: [], // 必要に応じてツールを追加
    },
  ],
});
```

### ストリーミング実装例

```typescript
// app/api/chat/route.ts
export async function POST(req: Request) {
  const { message, conversationId } = await req.json();

  const stream = await mastra.agents['chat-assistant'].stream({
    messages: [{ role: 'user', content: message }],
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

---

## 🎨 UIコンポーネント設計

### Chakra UIテーマカスタマイズ

```typescript
// app/providers.tsx
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#e3f2fd',
      500: '#2196f3',
      900: '#0d47a1',
    },
  },
});
```

### レスポンシブデザイン
- モバイル（< 768px）: サイドバー折りたたみ
- タブレット（768px - 1024px）: 2カラムレイアウト
- デスクトップ（> 1024px）: 3カラムレイアウト（サイドバー、チャット、詳細パネル）

---

## 🌐 デプロイ

### Vercelデプロイ

**前提条件**:
- GitHub/GitLabリポジトリにプッシュ済み
- Vercelアカウント作成済み
- MongoDBインスタンス（MongoDB Atlas推奨）

**手順**:

1. **Vercel CLIインストール**
   ```bash
   npm i -g vercel
   ```

2. **環境変数設定**
   Vercel Dashboard > Settings > Environment Variables で以下を設定:
   - `GEMINI_API_KEY`
   - `DATABASE_URL`

3. **デプロイ**
   ```bash
   vercel --prod
   ```

**本番URL**: https://ai-chat.vercel.app（デプロイ後に確認）

### MongoDB Atlas設定

1. https://cloud.mongodb.com/ でクラスター作成
2. Database Access でユーザー作成
3. Network Access でIPホワイトリスト設定（Vercelの場合は `0.0.0.0/0` 推奨）
4. 接続文字列を`DATABASE_URL`に設定

---

## 🧪 テスト（オプション）

### ユニットテスト
```bash
npm run test
```

### E2Eテスト（Playwright）
```bash
npx playwright test
```

##　テストコード作成時の厳守事項

###　絶対に守ってください！

####　テストコードの品質
- テストは必ず実際の機能を検証すること
- 'expext(true).toBe(true)'のような意味のないアサーションは絶対に書かない
- 各テストケースは具体的な入力と期待される出力を検証すること
- モックは必要最小限に留め、実際の動作に近い形でテストすること

####　ハードコーディングの禁止
- テストを通すためだけのハードコードは絶対に禁止
- 本番コードに'if(testMode)'のような条件分岐を入れない
- テスト用の特別な値（マジックナンバー）を本番コードに埋め込まない
- 環境変数や設定ファイルを使用して、テスト環境と本番環境を適切に分離すること

####　テスト実装の原則
- テストが失敗する状態から始めること（Red-Green-Refactor）
- 境界値、異常系、エラーケースも必ず実施すること
- カバレッジだけでなく、実際の品質を重視すること
- テストケース名は何をテストしているか明確に記述すること

####　実装前の確認
- 機能の仕様を正しく理解してからテストを書くこと
- 不明な点があれば、仮の実装ではなく、ユーザーに確認すること

---

## 📝 開発時の注意点

### 1. API制限
- **Gemini API**: 無料枠の制限に注意（RPM、TPMを確認）
- レート制限エラー時のリトライロジックを実装

### 2. セキュリティ
- **APIキー**: `.env.local`に保存し、絶対にGitにコミットしない
- **CORS**: 必要に応じて`next.config.js`で設定
- **入力検証**: ユーザー入力を必ずサニタイズ

### 3. パフォーマンス
- **会話履歴**: 長い会話はページネーション実装
- **ファイルアップロード**: サイズ制限（例: 10MB）を設定
- **画像最適化**: Next.js Image コンポーネント使用

### 4. Prisma使用時
- スキーマ変更後は必ず`npx prisma generate`実行
- 本番環境では`prisma db push`ではなく`prisma migrate deploy`推奨

### 5. ストリーミング
- Edge Runtimeの制約を理解する
- タイムアウト設定に注意（Vercelは最大60秒）

---

## 🔗 関連リソース

- [Mastra Documentation](https://mastra.dev/docs)
- [Google Gemini API](https://ai.google.dev/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Chakra UI](https://chakra-ui.com/)
- [Prisma](https://www.prisma.io/docs)
- [MongoDB](https://www.mongodb.com/docs/)

---

## 🎯 今後の拡張案

- [ ] 音声入力/出力機能
- [ ] マルチモーダル対応強化（動画解析など）
- [ ] プロンプトテンプレート機能
- [ ] カスタムツール/プラグインシステム
- [ ] チーム共有機能（認証実装後）
- [ ] RAG（Retrieval-Augmented Generation）統合

---

**最終更新**: 2026-01-03
