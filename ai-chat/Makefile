# ========================================
# AI Chat アプリケーション - Makefile
# ========================================

.PHONY: help install setup dev build start deploy clean test lint prisma-generate prisma-push prisma-studio env-check

# デフォルトターゲット: ヘルプを表示
help:
	@echo "========================================="
	@echo "AI Chat アプリケーション - 利用可能なコマンド"
	@echo "========================================="
	@echo ""
	@echo "📦 初期セットアップ:"
	@echo "  make install          - 依存関係をインストール"
	@echo "  make setup            - 初回セットアップ（install + prisma-generate + prisma-push）"
	@echo "  make env-check        - 環境変数の確認"
	@echo ""
	@echo "🗄️  データベース:"
	@echo "  make prisma-generate  - Prismaクライアントを生成"
	@echo "  make prisma-push      - Prismaスキーマをデータベースに反映"
	@echo "  make prisma-studio    - Prisma Studioを起動（データベースGUI）"
	@echo "  make db-reset         - データベースをリセット"
	@echo ""
	@echo "🚀 開発:"
	@echo "  make dev              - 開発サーバーを起動（localhost:3000）"
	@echo "  make dev-https        - HTTPS開発サーバーを起動"
	@echo ""
	@echo "🏗️  ビルド:"
	@echo "  make build            - 本番用ビルドを作成"
	@echo "  make start            - 本番サーバーを起動"
	@echo ""
	@echo "🧪 テスト:"
	@echo "  make test             - テストを実行"
	@echo "  make test-watch       - テストをウォッチモードで実行"
	@echo "  make test-coverage    - カバレッジ付きでテストを実行"
	@echo "  make lint             - ESLintでコードをチェック"
	@echo "  make lint-fix         - ESLintで自動修正"
	@echo ""
	@echo "☁️  デプロイ:"
	@echo "  make deploy           - Vercelに本番デプロイ"
	@echo "  make deploy-preview   - Vercelにプレビューデプロイ"
	@echo "  make vercel-login     - Vercel CLIにログイン"
	@echo "  make vercel-env       - Vercel環境変数を設定"
	@echo ""
	@echo "🧹 クリーンアップ:"
	@echo "  make clean            - ビルドファイルを削除"
	@echo "  make clean-all        - すべての生成ファイルを削除"
	@echo ""
	@echo "📝 その他:"
	@echo "  make git-commit       - 変更をコミット"
	@echo "  make git-push         - GitHubにプッシュ"
	@echo ""

# ========================================
# 📦 初期セットアップ
# ========================================

# 依存関係のインストール
install:
	@echo "📦 依存関係をインストール中..."
	npm install
	@echo "✅ インストール完了"

# 初回セットアップ（すべての初期化処理）
setup: install prisma-generate prisma-push
	@echo ""
	@echo "🎉 セットアップ完了！"
	@echo ""
	@echo "次のステップ:"
	@echo "  1. .env ファイルを作成して環境変数を設定"
	@echo "  2. make dev で開発サーバーを起動"
	@echo ""

# 環境変数の確認
env-check:
	@echo "🔍 環境変数を確認中..."
	@if [ ! -f .env ]; then \
		echo "⚠️  .env ファイルが見つかりません"; \
		echo ""; \
		echo ".env.example をコピーして .env を作成してください:"; \
		echo "  cp .env.example .env"; \
		echo ""; \
		exit 1; \
	fi
	@echo "✅ .env ファイルが存在します"
	@echo ""
	@echo "設定されている環境変数:"
	@grep -v '^#' .env | grep -v '^$$' || true

# ========================================
# 🗄️  データベース
# ========================================

# Prismaクライアントを生成
prisma-generate:
	@echo "🔧 Prismaクライアントを生成中..."
	npx prisma generate
	@echo "✅ Prismaクライアント生成完了"

# Prismaスキーマをデータベースに反映
prisma-push:
	@echo "📤 Prismaスキーマをデータベースに反映中..."
	npx prisma db push
	@echo "✅ データベース反映完了"

# Prisma Studioを起動
prisma-studio:
	@echo "🎨 Prisma Studioを起動中..."
	@echo "ブラウザで http://localhost:5555 を開いてください"
	npx prisma studio

# データベースをリセット
db-reset:
	@echo "⚠️  データベースをリセットします（すべてのデータが削除されます）"
	@read -p "続行しますか? [y/N] " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		npx prisma db push --force-reset; \
		echo "✅ データベースリセット完了"; \
	else \
		echo "❌ キャンセルされました"; \
	fi

# ========================================
# 🚀 開発
# ========================================

# 開発サーバーを起動
dev: env-check
	@echo "🚀 開発サーバーを起動中..."
	@echo "アクセス: http://localhost:3000"
	npm run dev

# HTTPS開発サーバーを起動
dev-https:
	@echo "🔒 HTTPS開発サーバーを起動中..."
	@echo "アクセス: https://localhost:3000"
	npm run dev -- --experimental-https

# ========================================
# 🏗️  ビルド
# ========================================

# 本番用ビルドを作成
build: env-check
	@echo "🏗️  本番用ビルドを作成中..."
	npm run build
	@echo "✅ ビルド完了"

# 本番サーバーを起動
start:
	@echo "🚀 本番サーバーを起動中..."
	@echo "アクセス: http://localhost:3000"
	npm start

# ========================================
# 🧪 テスト
# ========================================

# テストを実行
test:
	@echo "🧪 テストを実行中..."
	npm test

# テストをウォッチモードで実行
test-watch:
	@echo "👀 テストをウォッチモードで実行中..."
	npm test -- --watch

# カバレッジ付きでテストを実行
test-coverage:
	@echo "📊 カバレッジ付きでテストを実行中..."
	npm test -- --coverage

# ESLintでコードをチェック
lint:
	@echo "🔍 ESLintでコードをチェック中..."
	npm run lint

# ESLintで自動修正
lint-fix:
	@echo "🔧 ESLintで自動修正中..."
	npx eslint . --fix

# ========================================
# ☁️  デプロイ
# ========================================

# Vercel CLIにログイン
vercel-login:
	@echo "🔐 Vercel CLIにログイン中..."
	vercel login

# Vercel環境変数を設定
vercel-env:
	@echo "⚙️  Vercel環境変数を設定します"
	@echo ""
	@echo "以下の環境変数を設定してください:"
	@echo "  - GOOGLE_GENERATIVE_AI_API_KEY"
	@echo "  - DATABASE_URL"
	@echo "  - NEXT_PUBLIC_APP_URL"
	@echo ""
	@echo "コマンド:"
	@echo "  vercel env add GOOGLE_GENERATIVE_AI_API_KEY"
	@echo "  vercel env add DATABASE_URL"
	@echo "  vercel env add NEXT_PUBLIC_APP_URL"
	@echo ""
	@read -p "環境変数設定を開始しますか? [y/N] " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		vercel env add GOOGLE_GENERATIVE_AI_API_KEY; \
		vercel env add DATABASE_URL; \
		vercel env add NEXT_PUBLIC_APP_URL; \
		echo "✅ 環境変数設定完了"; \
	else \
		echo "手動で設定してください"; \
	fi

# Vercelに本番デプロイ
deploy: build
	@echo "☁️  Vercelに本番デプロイ中..."
	vercel --prod --yes
	@echo "✅ デプロイ完了"

# Vercelにプレビューデプロイ
deploy-preview:
	@echo "👀 Vercelにプレビューデプロイ中..."
	vercel --yes
	@echo "✅ プレビューデプロイ完了"

# ========================================
# 🧹 クリーンアップ
# ========================================

# ビルドファイルを削除
clean:
	@echo "🧹 ビルドファイルを削除中..."
	rm -rf .next
	rm -rf .vercel
	rm -rf out
	@echo "✅ クリーンアップ完了"

# すべての生成ファイルを削除
clean-all: clean
	@echo "🧹 すべての生成ファイルを削除中..."
	rm -rf node_modules
	rm -rf package-lock.json
	@echo "✅ 完全クリーンアップ完了"
	@echo ""
	@echo "次のステップ: make setup"

# ========================================
# 📝 Git操作
# ========================================

# 変更をコミット
git-commit:
	@echo "📝 変更をコミット中..."
	@read -p "コミットメッセージを入力してください: " msg; \
	git add .; \
	git commit -m "$$msg"; \
	echo "✅ コミット完了"

# GitHubにプッシュ
git-push:
	@echo "📤 GitHubにプッシュ中..."
	git push origin master
	@echo "✅ プッシュ完了"

# コミット & プッシュ
git-sync: git-commit git-push
	@echo "✅ Git同期完了"

# ========================================
# 📊 便利なコマンド
# ========================================

# すべての情報を表示
info:
	@echo "========================================="
	@echo "AI Chat アプリケーション - プロジェクト情報"
	@echo "========================================="
	@echo ""
	@echo "📦 Node.js バージョン:"
	@node --version
	@echo ""
	@echo "📦 npm バージョン:"
	@npm --version
	@echo ""
	@echo "📦 Next.js バージョン:"
	@npx next --version 2>/dev/null || echo "Next.js未インストール"
	@echo ""
	@echo "📦 Vercel CLI バージョン:"
	@vercel --version 2>/dev/null || echo "Vercel CLI未インストール"
	@echo ""
	@echo "📁 プロジェクトディレクトリ:"
	@pwd
	@echo ""

# ========================================
# 🔄 完全ワークフロー
# ========================================

# 開発ワークフロー（初回）
workflow-first:
	@echo "🚀 初回開発ワークフローを開始..."
	make setup
	make dev

# 開発ワークフロー（通常）
workflow-dev:
	@echo "🚀 開発ワークフローを開始..."
	make install
	make prisma-generate
	make dev

# デプロイワークフロー
workflow-deploy:
	@echo "🚀 デプロイワークフローを開始..."
	make lint
	make test
	make build
	make deploy
	@echo "✅ すべて完了！"
