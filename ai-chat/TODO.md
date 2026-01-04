# AI Chat アプリケーション 実行計画

このドキュメントは、ai-chatアプリケーションの開発手順を段階的にまとめたTODOリストです。

---

## フェーズ1: プロジェクト初期設定 🚀

### 1.1 Next.jsプロジェクトセットアップ
- [x] Next.js 16プロジェクトを作成
  ```bash
  npx create-next-app@latest ai-chat --typescript --tailwind --app
  ```
- [x] 必要な依存関係をインストール
  ```bash
  npm install @chakra-ui/react @chakra-ui/next-js @emotion/react @emotion/styled framer-motion
  npm install @prisma/client
  npm install -D prisma
  npm install @mastra/core @google/generative-ai
  npm install react-markdown react-syntax-highlighter
  npm install -D @types/react-syntax-highlighter
  npm install hono
  ```
- [x] `.env.local`ファイルを作成し、環境変数のテンプレートを設定
- [x] `.gitignore`に`.env.local`が含まれているか確認

### 1.2 プロジェクト構造の準備
- [x] `/components`ディレクトリを作成
- [x] `/lib`ディレクトリを作成
- [x] `/lib/mastra`ディレクトリを作成
- [x] `/prisma`ディレクトリを作成（`npx prisma init`で自動作成）

---

## フェーズ2: データベースとPrisma設定 🗄️

### 2.1 Prismaスキーマ定義
- [x] `prisma/schema.prisma`を編集
  - MongoDBプロバイダーを設定
  - `Conversation`モデルを定義
  - `Message`モデルを定義
  - リレーションシップを設定（Conversation ↔ Message）

### 2.2 Prismaクライアントセットアップ
- [x] `lib/prisma.ts`を作成（Prismaクライアントのシングルトン実装）
- [x] 環境変数`DATABASE_URL`を`.env.local`に追加
- [x] `npx prisma generate`を実行してクライアント生成
- [x] `npx prisma db push`でスキーマをMongoDBに反映

### 2.3 MongoDB接続テスト
- [x] MongoDB Atlasまたはローカルインスタンスを準備（Windows版MongoDBインストール済み）
- [x] 接続文字列の動作確認（localhost:27017で接続成功）
- [x] Prisma Studioで接続確認（`npx prisma studio`）

---

## フェーズ3: Chakra UIとテーマ設定 🎨

### 3.1 Chakra UIプロバイダー設定
- [x] `components/ui/provider.tsx`を作成
  - `ChakraProvider`をセットアップ
  - `next-themes`との統合
- [x] `app/layout.tsx`を編集してプロバイダーをラップ

### 3.2 テーマ切り替え機能
- [x] `components/ThemeToggle.tsx`を作成
  - `useTheme`フック（next-themes）を使用
  - ライト/ダークモード切り替えボタン実装
  - アイコン（太陽/月）を表示
  - ハイドレーションエラー対策

### 3.3 基本レイアウト構築
- [x] `app/layout.tsx`を編集
  - メタデータ設定（タイトル、説明、キーワード）
  - フォント設定（Inter）
  - グローバルスタイル適用
- [x] `app/page.tsx`を更新
  - Chakra UIコンポーネントでレイアウト構築
  - レスポンシブデザイン対応
  - ダークモード対応

---

## フェーズ4: UI コンポーネント開発 🖼️

### 4.1 会話サイドバー
- [x] `components/ConversationSidebar.tsx`を作成
  - 会話リストを表示
  - 新規会話作成ボタン
  - 会話選択機能
  - 会話削除ボタン（ホバー時表示）
  - レスポンシブ対応（モバイルで折りたたみ）
  - アクティブ状態のハイライト

### 4.2 メッセージ表示コンポーネント
- [x] `components/MessageList.tsx`を作成
  - メッセージをスクロール可能なリストで表示
  - ユーザー/アシスタントのメッセージを区別（色分け、アバター）
  - タイムスタンプ表示
  - 自動スクロール（最新メッセージに移動）
  - 添付ファイル表示対応
  - ローディングインジケーター

### 4.3 メッセージ入力コンポーネント
- [x] `components/MessageInput.tsx`を作成
  - テキストエリア（複数行入力対応）
  - 送信ボタン
  - ファイルアップロードボタン（複数選択可能）
  - エンターキーで送信（Shift+Enterで改行）
  - ローディング状態の表示
  - 添付ファイルプレビューと削除機能

### 4.4 マークダウンレンダラー
- [x] `components/MarkdownRenderer.tsx`を作成
  - `react-markdown`を使用
  - カスタムコンポーネント設定（見出し、リスト、リンク、テーブル）
  - コードブロックに`react-syntax-highlighter`を統合
  - Chakra UIのカラーモードに対応したテーマ選択（vs/vscDarkPlus）
  - インラインコード、引用、水平線対応

### 4.5 メインチャットインターフェース
- [x] `components/ChatInterface.tsx`を作成
  - サイドバー、メッセージリスト、入力欄を統合
  - 状態管理（メッセージ、現在の会話ID、会話リスト）
  - 仮のメッセージ送受信ロジック（API実装前）
  - 会話タイトル自動生成
- [x] `app/page.tsx`を更新してChatInterface使用

---

## フェーズ5: バックエンドAPI開発 ⚙️

### 5.1 会話管理API
- [x] `app/api/conversations/route.ts`を作成
  - `GET`: 全会話を取得
  - `POST`: 新規会話を作成
- [x] `app/api/conversations/[id]/route.ts`を作成
  - `GET`: 特定の会話とメッセージを取得
  - `PATCH`: 会話タイトルを更新
  - `DELETE`: 会話を削除（カスケード削除）

### 5.2 メッセージ管理API
- [x] `app/api/messages/route.ts`を作成
  - `POST`: メッセージを保存
  - `GET`: 会話IDによるメッセージ取得
  - 会話IDとの関連付け

---

## フェーズ6: Mastra + Gemini API統合 🤖

### 6.1 Gemini APIセットアップ
- [x] `lib/gemini.ts`を作成（→ `lib/mastra/index.ts`に統合）
  - Google Generative AI SDKの初期化
  - API キーの環境変数読み込み

### 6.2 Mastraエージェント設定
- [x] `lib/mastra/agent.ts`を作成（→ `lib/mastra/index.ts`に統合）
  - Mastraインスタンスを初期化
  - chat-assistantエージェントを定義
  - Geminiモデルを指定（gemini-2.0-flash-exp）
  - システムプロンプトを設定

### 6.3 チャットAPIエンドポイント
- [x] `app/api/chat/route.ts`を作成
  - リクエストボディから`message`と`conversationId`を取得
  - Mastraエージェントにメッセージを送信
  - ストリーミングレスポンスを返却（ReadableStreamとtextStream使用）
  - エラーハンドリング

---

## フェーズ7: ストリーミング応答実装 📡

### 7.1 バックエンドストリーミング
- [x] `app/api/chat/route.ts`を編集（フェーズ6で実装済み）
  - ReadableStream を使用
  - Mastraの`.stream()`メソッドと`textStream`を活用
  - チャンクごとにデータを送信

### 7.2 フロントエンドストリーミング受信
- [x] `components/ChatInterface.tsx`を編集（フェーズ6で実装済み）
  - `fetch`でストリーミングレスポンスを受信
  - `ReadableStream`を読み取り
  - 状態を逐次更新してUIに反映
  - ストリーミング完了後にMongoDBに保存

---

## フェーズ8: ファイルアップロード機能 📎

### 8.1 アップロードAPI
- [x] `app/api/upload/route.ts`を作成
  - `multipart/form-data`を受信
  - ファイルサイズ制限（10MB）
  - 対応形式チェック（PNG、JPG、WEBP、PDF、TXT、MD）
  - Vercel Blob または `/public/uploads` に保存
  - ファイルURLを返却

### 8.2 フロントエンド統合
- [x] `components/MessageInput.tsx`を編集
  - ファイル選択ボタンを追加
  - アップロードAPIを呼び出し
  - プレビュー表示（画像の場合）
  - アップロード中のローディング表示
- [x] `components/MessageList.tsx`を編集
  - 添付ファイルを表示（画像、リンク）

### 8.3 Gemini multimodal対応
- [x] `app/api/chat/route.ts`を編集
  - 画像データをGemini APIに送信
  - Visionモデルで画像解析

---

## フェーズ9: 会話エクスポート機能 💾

### 9.1 エクスポートロジック
- [x] `components/ConversationSidebar.tsx`を編集
  - エクスポートボタンを追加（各会話ごと）
  - JSON形式のエクスポート関数を実装
  - Markdown形式のエクスポート関数を実装
  - `Blob` APIでファイル生成
  - ダウンロードリンクを提供

### 9.2 エクスポート形式
- [x] JSON: 会話全体をJSONオブジェクトとして出力
- [x] Markdown: タイムスタンプ付きの読みやすい形式

---

## フェーズ10: メインページ統合 🏠

### 10.1 ホームページ実装
- [x] `app/page.tsx`を編集
  - `ChatInterface`コンポーネントを配置
  - 初期状態の設定（会話リスト取得）
  - ローディング状態の表示

### 10.2 状態管理の最適化
- [x] React Context または Zustandで状態管理を検討（オプション）
  - 会話リスト
  - 現在の会話ID
  - テーマ設定
  - ※現在のuseState実装で十分と判断。必要に応じて将来的に導入可能。

---

## フェーズ11: スタイリングと仕上げ 💅

### 11.1 レスポンシブデザイン
- [x] モバイル対応（< 768px）
  - サイドバーをハンバーガーメニューに
  - タッチ操作の最適化
- [x] タブレット対応（768px - 1024px）
- [x] デスクトップ対応（> 1024px）

### 11.2 アニメーション
- [x] メッセージ送信時のトランジション（framer-motion使用）
- [x] サイドバー開閉アニメーション（transition使用）
- [x] ローディングスピナー（pulse animation）
- [x] ホバーエフェクト（既存実装を確認）

### 11.3 アクセシビリティ
- [x] キーボードナビゲーション対応（Enter/Shift+Enter実装済み）
- [x] ARIA属性の追加（role, aria-label, aria-live, aria-describedby追加）
- [x] カラーコントラストの確認（Chakra UIのデフォルトテーマで適切）

---

## フェーズ12: テストとデバッグ 🧪

### 12.1 機能テスト
- [x] メッセージ送受信の動作確認
- [x] ストリーミング応答の表示確認
- [x] 会話作成/削除の動作確認
- [x] ファイルアップロードのテスト
- [x] マークダウン表示の確認
- [x] シンタックスハイライトの確認
- [x] エクスポート機能のテスト
- [x] テーマ切り替えのテスト

### 12.2 エラーハンドリング
- [x] API エラー時の表示
- [ ] ネットワークエラー時のリトライ
- [x] Gemini APIレート制限の処理
- [x] ファイルアップロード失敗時の処理

### 12.3 パフォーマンス最適化
- [ ] 長い会話のページネーション実装
- [x] 画像の最適化（Next.js Image）
- [x] コード分割とLazy Loading
- [x] MongoDBクエリの最適化（インデックス）

---

## フェーズ13: デプロイ準備 🚢

### 13.1 環境変数設定
- [x] `.env.example`ファイルを作成（サンプル）
- [x] `vercel.json`設定ファイルを作成
- [x] `DEPLOYMENT.md`デプロイガイドを作成
- [ ] Vercel Dashboardで環境変数を設定（DEPLOYMENT.mdを参照）
  - `GOOGLE_GENERATIVE_AI_API_KEY`
  - `DATABASE_URL`
  - `NEXT_PUBLIC_APP_URL`

### 13.2 ビルドテスト
- [x] `npm run build`でローカルビルド確認
- [x] ビルドエラーの修正
- [x] 型エラーの解消
- [x] ESLint警告の解消

### 13.3 デプロイ（DEPLOYMENT.mdの手順に従う）
- [ ] GitHubリポジトリにプッシュ
- [ ] Vercelプロジェクトを作成
- [ ] Vercel CLIでデプロイ
  ```bash
  vercel --prod
  ```
- [ ] 本番環境での動作確認

### 13.4 MongoDB Atlas設定（DEPLOYMENT.mdの手順に従う）
- [ ] クラスター作成
- [ ] ネットワークアクセス設定（0.0.0.0/0）
- [ ] データベースユーザー作成
- [ ] 接続文字列をVercelに設定

---

## フェーズ14: ドキュメント整備 📚

### 14.1 README.md作成
- [ ] プロジェクト概要
- [ ] インストール手順
- [ ] 使用方法
- [ ] スクリーンショット

### 14.2 CLAUDE.md更新
- [ ] 実装した内容を反映
- [ ] アーキテクチャ図の追加（オプション）
- [ ] トラブルシューティングセクション

---

## オプション機能（将来の拡張） 🔮

### 音声機能
- [ ] Web Speech API統合
- [ ] 音声入力
- [ ] 音声出力（TTS）

### プロンプトテンプレート
- [ ] よく使うプロンプトを保存
- [ ] テンプレートからメッセージ生成

### RAG統合
- [ ] ベクトルデータベース（Pinecone/Weaviate）
- [ ] ドキュメント埋め込み
- [ ] コンテキスト検索

### チーム共有
- [ ] ユーザー認証（NextAuth.js）
- [ ] 会話の共有機能
- [ ] ロールベースアクセス制御

---

## 進捗トラッキング

- **開始日**: 2026-01-03
- **目標完了日**: TBD
- **現在のフェーズ**: フェーズ13 - デプロイ準備（準備完了、デプロイ実行待ち）

### チェックリスト概要
- [x] フェーズ1: プロジェクト初期設定
- [x] フェーズ2: データベースとPrisma設定
- [x] フェーズ3: Chakra UIとテーマ設定
- [x] フェーズ4: UI コンポーネント開発
- [x] フェーズ5: バックエンドAPI開発
- [x] フェーズ6: Mastra + Gemini API統合
- [x] フェーズ7: ストリーミング応答実装
- [x] フェーズ8: ファイルアップロード機能
- [x] フェーズ9: 会話エクスポート機能
- [x] フェーズ10: メインページ統合
- [x] フェーズ11: スタイリングと仕上げ
- [x] フェーズ12: テストとデバッグ
- [x] フェーズ13: デプロイ準備（設定ファイルとガイド作成完了）
- [ ] フェーズ14: ドキュメント整備

---

**最終更新**: 2026-01-05
