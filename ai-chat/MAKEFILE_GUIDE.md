# Makefile クイックリファレンス

AI Chatアプリケーションの開発・デプロイを簡単にするMakefileコマンド集です。

---

## 📖 目次

- [基本的な使い方](#基本的な使い方)
- [初回セットアップ](#初回セットアップ)
- [日常的な開発フロー](#日常的な開発フロー)
- [デプロイフロー](#デプロイフロー)
- [全コマンドリファレンス](#全コマンドリファレンス)

---

## 基本的な使い方

### ヘルプを表示

```bash
make
# または
make help
```

すべての利用可能なコマンドが表示されます。

---

## 初回セットアップ

### 1. プロジェクトのクローン後

```bash
# 完全セットアップ（依存関係インストール + Prisma初期化）
make setup
```

これで以下が自動実行されます：
- `npm install` - 依存関係のインストール
- `npx prisma generate` - Prismaクライアント生成
- `npx prisma db push` - データベーススキーマ反映

### 2. 環境変数の設定

```bash
# .env.example をコピー
cp .env.example .env

# 環境変数を編集（エディタで開く）
# 必要な値を設定:
# - GOOGLE_GENERATIVE_AI_API_KEY
# - DATABASE_URL
# - NEXT_PUBLIC_APP_URL
```

### 3. 環境変数の確認

```bash
make env-check
```

### 4. 開発サーバー起動

```bash
make dev
```

ブラウザで http://localhost:3000 を開く

---

## 日常的な開発フロー

### 朝のルーティン（開発開始）

```bash
# リポジトリを最新化
git pull

# 依存関係を更新（package.jsonが変更されている場合）
make install

# Prismaクライアントを再生成（スキーマが変更されている場合）
make prisma-generate

# 開発サーバー起動
make dev
```

**ショートカット:**
```bash
make workflow-dev
```

### コーディング中

```bash
# 開発サーバーはバックグラウンドで起動したまま...

# 別のターミナルでテストをウォッチモードで実行
make test-watch

# コードをリント
make lint

# 自動修正
make lint-fix
```

### データベース操作

```bash
# Prisma Studioでデータを可視化・編集
make prisma-studio

# スキーマ変更後、データベースに反映
make prisma-push
```

### 夕方のルーティン（作業終了）

```bash
# 変更をコミット
make git-commit
# → コミットメッセージを入力

# GitHubにプッシュ
make git-push
```

**ショートカット:**
```bash
make git-sync
```

---

## デプロイフロー

### 初回デプロイ

#### 1. Vercel CLIにログイン

```bash
make vercel-login
```

ブラウザで認証を完了する。

#### 2. 環境変数をVercelに設定

```bash
make vercel-env
```

または手動で：
```bash
vercel env add GOOGLE_GENERATIVE_AI_API_KEY
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_APP_URL
```

#### 3. 本番デプロイ

```bash
make deploy
```

### 通常のデプロイ

```bash
# 完全デプロイフロー（リント → テスト → ビルド → デプロイ）
make workflow-deploy
```

または個別に：

```bash
# 1. コードをチェック
make lint

# 2. テストを実行
make test

# 3. ビルドを確認
make build

# 4. デプロイ
make deploy
```

### プレビューデプロイ

```bash
# プレビュー環境にデプロイ（本番に影響なし）
make deploy-preview
```

---

## 全コマンドリファレンス

### 📦 初期セットアップ

| コマンド | 説明 |
|---------|------|
| `make install` | 依存関係をインストール |
| `make setup` | 初回セットアップ（install + prisma-generate + prisma-push） |
| `make env-check` | 環境変数の確認 |

### 🗄️ データベース

| コマンド | 説明 |
|---------|------|
| `make prisma-generate` | Prismaクライアントを生成 |
| `make prisma-push` | Prismaスキーマをデータベースに反映 |
| `make prisma-studio` | Prisma Studioを起動（localhost:5555） |
| `make db-reset` | データベースをリセット（⚠️ データ削除） |

### 🚀 開発

| コマンド | 説明 |
|---------|------|
| `make dev` | 開発サーバーを起動（localhost:3000） |
| `make dev-https` | HTTPS開発サーバーを起動 |

### 🏗️ ビルド

| コマンド | 説明 |
|---------|------|
| `make build` | 本番用ビルドを作成 |
| `make start` | 本番サーバーを起動 |

### 🧪 テスト

| コマンド | 説明 |
|---------|------|
| `make test` | テストを実行 |
| `make test-watch` | テストをウォッチモードで実行 |
| `make test-coverage` | カバレッジ付きでテストを実行 |
| `make lint` | ESLintでコードをチェック |
| `make lint-fix` | ESLintで自動修正 |

### ☁️ デプロイ

| コマンド | 説明 |
|---------|------|
| `make deploy` | Vercelに本番デプロイ |
| `make deploy-preview` | Vercelにプレビューデプロイ |
| `make vercel-login` | Vercel CLIにログイン |
| `make vercel-env` | Vercel環境変数を設定 |

### 🧹 クリーンアップ

| コマンド | 説明 |
|---------|------|
| `make clean` | ビルドファイルを削除（.next, .vercel, out） |
| `make clean-all` | すべての生成ファイルを削除（node_modules含む） |

### 📝 Git操作

| コマンド | 説明 |
|---------|------|
| `make git-commit` | 変更をコミット（メッセージ入力あり） |
| `make git-push` | GitHubにプッシュ |
| `make git-sync` | コミット + プッシュ |

### 📊 便利なコマンド

| コマンド | 説明 |
|---------|------|
| `make info` | プロジェクト情報を表示 |
| `make help` | ヘルプを表示 |

### 🔄 ワークフロー

| コマンド | 説明 |
|---------|------|
| `make workflow-first` | 初回開発ワークフロー（setup + dev） |
| `make workflow-dev` | 通常開発ワークフロー（install + prisma-generate + dev） |
| `make workflow-deploy` | デプロイワークフロー（lint + test + build + deploy） |

---

## 💡 使用例

### ケース1: 新しいチームメンバーが参加

```bash
# 1. リポジトリをクローン
git clone https://github.com/mak-ishi/mak-lab.git
cd mak-lab/ai-chat

# 2. 環境変数を設定
cp .env.example .env
# .env を編集

# 3. 初回セットアップ
make setup

# 4. 開発サーバー起動
make dev
```

### ケース2: 機能開発

```bash
# 1. 最新コードを取得
git pull

# 2. 新しいブランチを作成
git checkout -b feature/new-feature

# 3. 開発サーバー起動
make dev

# （開発中...）

# 4. テスト実行
make test

# 5. リント
make lint-fix

# 6. コミット
make git-commit

# 7. プッシュ
make git-push
```

### ケース3: 本番デプロイ前の最終チェック

```bash
# 1. すべてのテストを実行
make test

# 2. カバレッジ確認
make test-coverage

# 3. リント
make lint

# 4. 本番ビルド確認
make build

# 5. 問題なければデプロイ
make deploy
```

### ケース4: データベーススキーマ変更

```bash
# 1. prisma/schema.prisma を編集

# 2. Prismaクライアントを再生成
make prisma-generate

# 3. データベースに反映
make prisma-push

# 4. Prisma Studioで確認
make prisma-studio

# 5. 変更をコミット
git add prisma/schema.prisma
make git-commit
```

### ケース5: トラブルシューティング

```bash
# ビルドエラーが出た場合
make clean
make install
make build

# 完全にクリーンアップしてやり直す
make clean-all
make setup
```

---

## ⚙️ カスタマイズ

Makefileを編集して、プロジェクト固有のコマンドを追加できます：

```makefile
# カスタムコマンド例
custom-task:
	@echo "カスタムタスクを実行中..."
	# あなたのコマンド
```

---

## 🔧 トラブルシューティング

### `make: command not found`

**Windows:**
- Git Bash、WSL、またはMakeをインストール
- Chocolatey: `choco install make`

**macOS:**
- Xcode Command Line Tools: `xcode-select --install`

**Linux:**
- `sudo apt install make` (Debian/Ubuntu)
- `sudo yum install make` (RedHat/CentOS)

### 環境変数が読み込まれない

```bash
# .env ファイルの存在確認
make env-check

# .env ファイルがない場合
cp .env.example .env
# その後、.env を編集
```

### Prismaエラー

```bash
# Prismaクライアントを再生成
make prisma-generate

# データベース接続を確認
make env-check
# DATABASE_URL を確認

# Prisma Studioで確認
make prisma-studio
```

---

## 📚 関連ドキュメント

- **README.md** - プロジェクト概要
- **DEPLOYMENT.md** - デプロイ詳細ガイド
- **CLAUDE.md** - 開発者向けドキュメント
- **.env.example** - 環境変数テンプレート

---

**最終更新**: 2026-01-05
