# Google Gemini APIキー設定ガイド

このガイドでは、Google Gemini APIキーを安全に設定する方法を説明します。

---

## 🔐 方法1: 起動時にプロンプトで入力（最も安全・推奨）

APIキーをファイルに保存せず、アプリ起動時に毎回入力する方法です。
アプリ停止時にメモリから自動的に削除されます。

### Node.jsスクリプト版（クロスプラットフォーム）

```bash
npm run dev:secure
```

### Windows バッチファイル版

コマンドプロンプトで実行：
```cmd
start-secure.bat
```

### Windows PowerShell版

PowerShellで実行：
```powershell
.\start-secure.ps1
```

**メリット:**
- ✅ APIキーがファイルに保存されない
- ✅ プロセス終了時に自動的にメモリから削除
- ✅ 誤ってGitにコミットするリスクがゼロ
- ✅ 最も安全

**デメリット:**
- ❌ 起動のたびにAPIキーを入力する必要がある

---

## 📝 方法2: .env.localファイル（開発時に便利）

`.env.local`ファイルにAPIキーを保存する標準的な方法です。

### 手順

1. プロジェクトルートに`.env.local`ファイルを作成：

```bash
# .env.local
GOOGLE_GENERATIVE_AI_API_KEY=あなたのAPIキーをここに入力
DATABASE_URL="mongodb://localhost:27017/ai-chat"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

2. 通常通り起動：

```bash
npm run dev
```

**メリット:**
- ✅ 起動が簡単（APIキー入力不要）
- ✅ Next.jsの標準的な方法
- ✅ `.gitignore`で除外されているため、Gitにコミットされない

**デメリット:**
- ❌ ローカルファイルに平文で保存される
- ❌ ファイル共有時に誤って公開するリスク

**セキュリティ対策:**
- `.gitignore`に`.env.local`が含まれていることを確認
- ファイルのアクセス権限を適切に設定
- 定期的にAPIキーをローテーション

---

## 🌐 方法3: システム環境変数（永続的）

OSレベルの環境変数として設定する方法です。

### Windows（システム環境変数）

1. Windowsキー + R → `sysdm.cpl` → Enter
2. 「詳細設定」タブ → 「環境変数」
3. 「ユーザー環境変数」で「新規」をクリック
4. 変数名: `GOOGLE_GENERATIVE_AI_API_KEY`
5. 変数値: あなたのAPIキー
6. PCを再起動（または、ターミナルを再起動）

### Windows（PowerShell - 現在のセッションのみ）

```powershell
$env:GOOGLE_GENERATIVE_AI_API_KEY = "あなたのAPIキー"
npm run dev
```

### Windows（コマンドプロンプト - 現在のセッションのみ）

```cmd
set GOOGLE_GENERATIVE_AI_API_KEY=あなたのAPIキー
npm run dev
```

**メリット:**
- ✅ 複数のプロジェクトで同じキーを使用可能
- ✅ アプリケーションコードから独立

**デメリット:**
- ❌ システム全体に影響（セッション限定の場合は除く）
- ❌ 設定方法がOSごとに異なる

---

## 🔑 Google Gemini APIキーの取得方法

1. [Google AI Studio](https://aistudio.google.com/app/apikey) にアクセス
2. Googleアカウントでログイン
3. 「Get API Key」をクリック
4. 新しいAPIキーを作成
5. APIキーをコピー

**重要:** APIキーは絶対に公開しないでください！

---

## 🛡️ セキュリティのベストプラクティス

1. **APIキーを公開リポジトリにコミットしない**
   - `.gitignore`に`.env.local`が含まれていることを確認
   - コミット前に`git status`で確認

2. **APIキーを定期的にローテーション**
   - 古いキーを無効化
   - 新しいキーを生成

3. **APIキーの使用量を監視**
   - [Google Cloud Console](https://console.cloud.google.com/) で使用状況を確認
   - 異常なアクティビティがないかチェック

4. **本番環境では環境変数を使用**
   - Vercelの場合: Dashboard > Settings > Environment Variables
   - 本番とプレビュー環境で異なるキーを使用

5. **APIキーの権限を最小限に**
   - 必要なAPIのみを有効化
   - IP制限を設定（可能な場合）

---

## ⚠️ トラブルシューティング

### エラー: `GOOGLE_GENERATIVE_AI_API_KEY is not defined`

**原因:** 環境変数が設定されていない

**解決方法:**
1. `.env.local`ファイルが存在するか確認
2. ファイル名が正確か確認（`.env.local.txt`などになっていないか）
3. Next.jsを再起動（`Ctrl+C` → `npm run dev`）

### エラー: `API key not valid`

**原因:** APIキーが無効または間違っている

**解決方法:**
1. [Google AI Studio](https://aistudio.google.com/app/apikey) でキーを再確認
2. 余分なスペースや改行がないか確認
3. 新しいAPIキーを生成して置き換え

### PowerShellスクリプトが実行できない

**原因:** 実行ポリシーの制限

**解決方法:**
管理者権限でPowerShellを開き、以下を実行：
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 📚 推奨される使用方法

**開発時:**
- `npm run dev:secure`（起動時に入力）
- または`.env.local`（便利さ優先）

**本番環境:**
- Vercel環境変数
- 絶対に`.env.local`をデプロイしない

**チーム開発:**
- `.env.example`をリポジトリに含める
- 各開発者が自分の`.env.local`を作成
- APIキーは個別に管理

---

**最終更新**: 2026-01-04
