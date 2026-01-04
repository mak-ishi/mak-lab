# AI Chat

Google Gemini APIを使用したAIチャットボットアプリケーション

## 🚀 技術スタック

- **Next.js 16** - App Router
- **TypeScript** - 型安全な開発
- **Chakra UI** - UIコンポーネント
- **Prisma** - ORM
- **MongoDB** - データベース
- **Mastra** - AIエージェントフレームワーク
- **Google Gemini API** - AI推論エンジン

## ⚡ クイックスタート（Makefile使用）

プロジェクトにはMakefileが含まれており、開発・デプロイのコマンドを簡単に実行できます。

### 初回セットアップ

```bash
# 完全セットアップ（依存関係 + Prisma初期化）
make setup

# 環境変数を設定
cp .env.example .env
# .env を編集して必要な値を設定

# 開発サーバー起動
make dev
```

### よく使うコマンド

```bash
make help              # すべてのコマンドを表示
make dev               # 開発サーバー起動
make build             # 本番ビルド
make test              # テスト実行
make deploy            # Vercelにデプロイ
make prisma-studio     # Prisma Studio起動
```

詳細は [MAKEFILE_GUIDE.md](./MAKEFILE_GUIDE.md) を参照してください。

## 📦 セットアップ（手動）

### 1. リポジトリのクローンと依存関係のインストール

```bash
cd ai-chat
npm install
```

### 2. MongoDB の準備

#### オプション A: MongoDB Atlas（推奨）

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) でアカウント作成
2. 無料のクラスターを作成
3. Database Access でユーザーを作成
4. Network Access で IP アドレスを追加（`0.0.0.0/0` で全て許可）
5. 接続文字列をコピー

#### オプション B: ローカルMongoDB

```bash
# Dockerを使用する場合
docker run -d -p 27017:27017 --name mongodb mongo:latest

# または、MongoDBを直接インストール
# https://www.mongodb.com/try/download/community
```

### 3. 環境変数の設定

`.env.local`ファイルを編集：

```bash
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB接続文字列
# MongoDB Atlasの場合
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/ai-chat"
# ローカルの場合
# DATABASE_URL="mongodb://localhost:27017/ai-chat"

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Prismaセットアップ

```bash
# Prismaクライアントを生成（既に実行済み）
npx prisma generate

# データベースにスキーマを反映
npx prisma db push
```

### 5. 開発サーバー起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開く

## 🔧 Prismaコマンド

```bash
# Prisma Studio（GUIでデータ確認）
npx prisma studio

# スキーマをデータベースに反映
npx prisma db push

# クライアント再生成
npx prisma generate
```

## 📝 開発状況

進捗状況は [TODO.md](./TODO.md) を参照してください。

現在の状況：
- ✅ フェーズ1: プロジェクト初期設定
- ✅ フェーズ2: データベースとPrisma設定
- ✅ フェーズ3: Chakra UIとテーマ設定
- ✅ フェーズ4: UIコンポーネント開発
- ✅ フェーズ5: バックエンドAPI開発
- ✅ フェーズ6: Mastra + Gemini API統合
- ✅ フェーズ7: ストリーミング応答実装
- ✅ フェーズ8: ファイルアップロード機能
- ✅ フェーズ9: 会話エクスポート機能
- ✅ フェーズ10: メインページ統合
- ✅ フェーズ11: スタイリングと仕上げ
- ✅ フェーズ12: テストとデバッグ
- ✅ フェーズ13: デプロイ準備
- 🚧 フェーズ14: ドキュメント整備

## 🌐 デプロイ

### Makefileを使用（推奨）

```bash
# Vercelにログイン
make vercel-login

# 本番デプロイ
make deploy

# または完全デプロイフロー（lint + test + build + deploy）
make workflow-deploy
```

### Vercel CLIを直接使用

```bash
# Vercel CLIをインストール
npm i -g vercel

# デプロイ
vercel --prod
```

環境変数（`GOOGLE_GENERATIVE_AI_API_KEY`、`DATABASE_URL`、`NEXT_PUBLIC_APP_URL`）をVercel Dashboardで設定してください。

**詳細なデプロイ手順は [DEPLOYMENT.md](./DEPLOYMENT.md) を参照してください。**

## 📚 ドキュメント

- **[CLAUDE.md](./CLAUDE.md)** - 詳細な仕様とアーキテクチャ
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - デプロイ手順（MongoDB Atlas、Vercel）
- **[MAKEFILE_GUIDE.md](./MAKEFILE_GUIDE.md)** - Makefileコマンドリファレンス
- **[TODO.md](./TODO.md)** - 開発進捗状況

## 🐛 トラブルシューティング

### MongoDBに接続できない

- `.env.local`の`DATABASE_URL`が正しいか確認
- MongoDB Atlasの場合、IPアドレスがホワイトリストに追加されているか確認
- ローカルの場合、MongoDBが起動しているか確認

### Prismaエラー

```bash
# Prismaクライアントを再生成
npx prisma generate

# node_modulesをクリーンインストール
rm -rf node_modules package-lock.json
npm install
```

## 📄 ライセンス

このプロジェクトは学習・実験用のプライベートリポジトリです。
