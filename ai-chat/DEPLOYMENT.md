# AI Chat アプリケーション デプロイガイド

このガイドでは、AI Chatアプリケーションを本番環境にデプロイする手順を説明します。

---

## 📋 前提条件

デプロイを開始する前に、以下を準備してください：

- [x] Node.js 18.x以上がインストール済み
- [x] npmまたはyarnがインストール済み
- [x] Gitがインストール済み
- [ ] GitHubアカウント（リポジトリ管理用）
- [ ] Vercelアカウント（ホスティング用）
- [ ] MongoDB Atlasアカウント（データベース用）
- [ ] Google Gemini APIキー

---

## 🗄️ ステップ1: MongoDB Atlasのセットアップ

### 1.1 アカウント作成とクラスター作成

1. **MongoDB Atlasにアクセス**
   - https://cloud.mongodb.com/ を開く
   - "Start Free" をクリックしてアカウントを作成（既存アカウントでログイン）

2. **新しいクラスターを作成**
   - "Create" → "Shared" (無料のM0クラスター) を選択
   - **Provider**: AWS、GCP、Azureのいずれか
   - **Region**: 日本に近いリージョン（例: Tokyo、Singapore）を推奨
   - **Cluster Name**: `ai-chat-cluster` など任意の名前
   - "Create Cluster" をクリック

3. **セキュリティ設定完了まで待つ**
   - クラスターの作成には2〜3分かかります

### 1.2 データベースユーザーの作成

1. **Database Accessに移動**
   - 左メニューから "Security" → "Database Access" を選択

2. **新しいユーザーを追加**
   - "Add New Database User" をクリック
   - **Authentication Method**: Password
   - **Username**: 任意（例: `aichat-admin`）
   - **Password**: 強力なパスワードを生成（記録しておく）
   - **Database User Privileges**: "Read and write to any database" を選択
   - "Add User" をクリック

### 1.3 ネットワークアクセスの設定

1. **Network Accessに移動**
   - 左メニューから "Security" → "Network Access" を選択

2. **IPアドレスを許可**
   - "Add IP Address" をクリック
   - **Vercel用**: "Allow Access from Anywhere" を選択（`0.0.0.0/0`）
   - **注意**: これはVercelのような動的IPサービス用の設定です
   - "Confirm" をクリック

### 1.4 接続文字列の取得

1. **クラスターに接続**
   - "Database" → "Clusters" に戻る
   - クラスター名の横にある "Connect" をクリック

2. **接続方法を選択**
   - "Connect your application" を選択
   - **Driver**: Node.js
   - **Version**: 5.5 or later

3. **接続文字列をコピー**
   ```
   mongodb+srv://aichat-admin:<password>@ai-chat-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - `<password>` を実際のパスワードに置き換える
   - データベース名 `/ai-chat` を追加:
   ```
   mongodb+srv://aichat-admin:YOUR_PASSWORD@ai-chat-cluster.xxxxx.mongodb.net/ai-chat?retryWrites=true&w=majority
   ```

4. **接続文字列を保存**
   - この文字列を安全な場所に保存（後でVercelに設定します）

---

## 🚀 ステップ2: Vercelへのデプロイ

### 2.1 GitHubリポジトリの準備

1. **GitHubで新しいリポジトリを作成**
   - https://github.com/new にアクセス
   - **Repository name**: `ai-chat` など任意の名前
   - **Visibility**: Private または Public
   - "Create repository" をクリック

2. **ローカルでGit設定（初回のみ）**
   ```bash
   cd ai-chat
   git init
   git add .
   git commit -m "Initial commit: AI Chat application"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ai-chat.git
   git push -u origin main
   ```

   **注意**: このプロジェクトがmak-labリポジトリのサブディレクトリの場合、既存のリポジトリにコミットしてください。

### 2.2 Vercelアカウントとプロジェクト作成

1. **Vercelにログイン**
   - https://vercel.com/ にアクセス
   - "Sign Up" または "Log In" → GitHubアカウントで認証

2. **新しいプロジェクトを作成**
   - "Add New..." → "Project" をクリック
   - GitHubリポジトリから `ai-chat` を選択
   - "Import" をクリック

3. **プロジェクト設定**
   - **Framework Preset**: Next.js（自動検出される）
   - **Root Directory**: `./` または `ai-chat`（リポジトリ構成に応じて）
   - **Build Command**: `npm run build`（デフォルト）
   - **Output Directory**: `.next`（デフォルト）

### 2.3 環境変数の設定

1. **Environment Variablesセクションで以下を追加**

   **GOOGLE_GENERATIVE_AI_API_KEY**
   ```
   your_actual_gemini_api_key_here
   ```
   - Google AI Studioから取得したAPIキーを入力
   - https://aistudio.google.com/app/apikey

   **DATABASE_URL**
   ```
   mongodb+srv://aichat-admin:YOUR_PASSWORD@ai-chat-cluster.xxxxx.mongodb.net/ai-chat?retryWrites=true&w=majority
   ```
   - MongoDB Atlasから取得した接続文字列を入力

   **NEXT_PUBLIC_APP_URL**
   ```
   https://your-app-name.vercel.app
   ```
   - デプロイ後のVercel URLを入力（初回は空欄でOK、後で更新）

2. **環境の選択**
   - すべての環境変数で "Production", "Preview", "Development" にチェック

3. **Deploy をクリック**
   - ビルドとデプロイが開始されます（2〜3分）

### 2.4 デプロイの確認

1. **デプロイ成功を確認**
   - ビルドログで "✓ Build completed" を確認
   - "Visit" をクリックして本番環境にアクセス

2. **動作確認**
   - チャット機能が正常に動作するか確認
   - メッセージ送受信、ストリーミング応答をテスト
   - ファイルアップロード機能をテスト
   - 会話の保存と読み込みをテスト

3. **NEXT_PUBLIC_APP_URL を更新（初回デプロイ後）**
   - Vercelダッシュボード → Settings → Environment Variables
   - `NEXT_PUBLIC_APP_URL` を実際のURL（例: `https://ai-chat-xyz.vercel.app`）に更新
   - "Save" → "Redeploy" で反映

---

## 🔧 ステップ3: Prismaマイグレーション

### 3.1 本番データベースへのスキーマ適用

Vercelデプロイ時、Prismaスキーマは自動的にプッシュされますが、手動で確認する場合：

```bash
# ローカルで本番環境のDATABASE_URLを使用
DATABASE_URL="mongodb+srv://..." npx prisma db push

# または Prisma Studio で確認
DATABASE_URL="mongodb+srv://..." npx prisma studio
```

### 3.2 インデックスの確認

MongoDB Atlasのダッシュボードで、インデックスが正しく作成されているか確認：

1. "Database" → "Browse Collections"
2. `ai-chat` データベース → `conversations` / `messages` コレクション
3. "Indexes" タブでインデックスを確認

---

## 🔄 ステップ4: 継続的デプロイメント

### 4.1 自動デプロイの設定

Vercelは自動的にGitHubと連携されているため：

1. **mainブランチにプッシュ** → 本番環境に自動デプロイ
2. **他のブランチにプッシュ** → プレビュー環境に自動デプロイ

### 4.2 デプロイコマンド（オプション）

Vercel CLIを使用した手動デプロイ：

```bash
# Vercel CLIをインストール
npm i -g vercel

# 本番環境にデプロイ
vercel --prod

# プレビュー環境にデプロイ
vercel
```

---

## 🐛 トラブルシューティング

### エラー: "Cannot connect to MongoDB"

**原因**: MongoDB Atlas接続文字列が正しくない、またはIPホワイトリストが設定されていない

**解決策**:
1. `DATABASE_URL` の形式を確認（パスワードの特殊文字はURLエンコード）
2. MongoDB Atlas → Network Access で `0.0.0.0/0` が許可されているか確認
3. データベースユーザーの権限を確認

### エラー: "GOOGLE_GENERATIVE_AI_API_KEY is not defined"

**原因**: Gemini APIキーが設定されていない、または間違っている

**解決策**:
1. Vercel → Settings → Environment Variables で `GOOGLE_GENERATIVE_AI_API_KEY` を確認
2. Google AI Studio（https://aistudio.google.com/app/apikey）でAPIキーを再確認
3. 環境変数を更新後、必ず "Redeploy" を実行

### エラー: "Build failed"

**原因**: TypeScriptエラー、依存関係の問題

**解決策**:
1. ローカルで `npm run build` を実行してエラーを確認
2. `package.json` の依存関係を確認
3. Vercel ビルドログで詳細なエラーメッセージを確認

### ファイルアップロードが動作しない

**原因**: Vercelのファイルシステムは読み取り専用

**解決策**:
1. Vercel Blob Storage を使用（推奨）
2. 環境変数 `BLOB_READ_WRITE_TOKEN` を設定
3. `app/api/upload/route.ts` を更新

---

## 📊 モニタリングとログ

### Vercelダッシュボード

- **Analytics**: トラフィック、応答時間を確認
- **Logs**: エラーログ、リクエストログを確認
- **Deployments**: デプロイ履歴とロールバック

### MongoDB Atlas

- **Metrics**: データベースパフォーマンス、接続数を確認
- **Real-time Performance**: クエリのパフォーマンス分析

---

## ✅ デプロイチェックリスト

- [ ] MongoDB Atlas クラスター作成
- [ ] データベースユーザー作成
- [ ] ネットワークアクセス設定（0.0.0.0/0）
- [ ] 接続文字列の取得
- [ ] GitHubリポジトリ作成とプッシュ
- [ ] Vercelプロジェクト作成
- [ ] 環境変数設定（3つすべて）
- [ ] デプロイ実行
- [ ] 本番環境での動作確認
- [ ] NEXT_PUBLIC_APP_URL の更新
- [ ] 継続的デプロイメントの確認

---

## 🎉 完了！

デプロイが成功したら、以下を確認してください：

1. **本番URL**: https://your-app.vercel.app
2. **機能確認**: メッセージ送受信、ファイルアップロード、会話管理
3. **パフォーマンス**: 応答時間、ストリーミング速度
4. **エラー監視**: Vercelログ、MongoDB Atlasメトリクス

---

**注意**: セキュリティのため、APIキーやデータベース接続文字列は絶対にGitにコミットしないでください。
