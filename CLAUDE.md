# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## リポジトリ概要

`mak-lab` - 開発プロジェクトの実験・学習用プライベートリポジトリ

## プロジェクト一覧

### 📝 Todoアプリ (Vanilla JS版) - `todo/`

Vanilla JavaScriptで作成されたシンプルなTodoアプリケーション。CRUD操作、フィルタリング、優先度設定、localStorageによる永続化機能を実装。

#### 🚀 実行方法

ブラウザで `todo/index.html` を開くだけ。ビルドプロセスや依存関係のインストールは不要。

#### 📁 ファイル構成

- `todo/index.html` - メインHTML（入力フォーム、フィルターボタン、タスクリスト）
- `todo/styles.css` - モダンなグラデーションUI、優先度別カラーコーディング
- `todo/app.js` - TodoAppクラスによる状態管理、localStorage、DOM操作
- `todo/README.md` - プロジェクトドキュメント

#### 🏗️ アーキテクチャ

**クラスベース設計**
単一の `TodoApp` クラスですべての機能をカプセル化。

**データモデル**
各todoオブジェクトの構造：
- `id`: タイムスタンプベースの一意識別子
- `text`: タスクの説明
- `completed`: 完了状態（boolean）
- `priority`: 優先度 ('high' | 'medium' | 'low')
- `createdAt`: ISO形式のタイムスタンプ

**状態管理**
- クラスインスタンス内でtodosを管理 (`this.todos`)
- 変更のたびにlocalStorageへ自動保存
- フィルター状態 (`all`, `active`, `completed`) を別途管理

**レンダリング**
完全再レンダリング方式 - 状態変更のたびにtodoリスト全体を再構築。イベントリスナーは再レンダリング後に再アタッチ。

---

### 📝 Todoアプリ (Next.js版) - `todo-next/`

Next.js 16、TypeScript、Tailwind CSSで構築されたモダンなTodoアプリケーション。App Routerを使用。

#### 🚀 実行方法

**開発サーバー起動**
```bash
cd todo-next
npm run dev
```
その後、http://localhost:3000 にアクセス

**本番ビルド**
```bash
npm run build
npm start
```

#### 🛠️ 技術スタック

- **Next.js 16** - App Router搭載のReactフレームワーク
- **TypeScript** - 型安全な開発環境
- **Tailwind CSS** - ユーティリティファーストCSSフレームワーク
- **React Hooks** - useState/useEffectによる状態管理

#### 📁 ファイル構成

- `app/page.tsx` - メインTodoアプリコンポーネント（クライアントコンポーネント）
- `app/layout.tsx` - ルートレイアウト（メタデータ、フォント設定）
- `app/globals.css` - グローバルスタイル、Tailwindディレクティブ

#### 🏗️ アーキテクチャ

**クライアントサイドレンダリング**
インタラクティブ機能のために `'use client'` ディレクティブを使用。

**データモデル**
Vanilla版と同様、TypeScriptインターフェースで型安全性を確保：
```typescript
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  dueDate?: string; // 期限（オプション）
}
```

**状態管理**
- React useStateでtodoリスト、入力、フィルター、優先度を管理
- useEffectでlocalStorage同期（ハイドレーションミスマッチ防止機能付き）
- Vanilla版との競合を避けるため、別のlocalStorageキー (`todos-next`) を使用

**スタイリング**
Tailwind CSSによる実装：
- グラデーション背景（紫テーマ）
- 優先度別カラーコーディング（赤/オレンジ/緑）
- レスポンシブデザイン
- スムーズなトランジションとホバーエフェクト

**期限機能**
- オプションの期限日設定
- ステータス別の視覚的表示：
  - 🔴 期限超過（赤バッジ）
  - 🟡 今日が期限（黄バッジ）
  - 🔵 近日中（青バッジ、3日以内）
- 日本語での分かりやすい日付表示（「今日」「明日」「X日後」「X日超過」）

#### 🌐 デプロイ

**Vercel本番環境**
https://todo-next-eight-zeta.vercel.app

**デプロイ方法**
```bash
cd todo-next
vercel --prod
```

---

### 📄 PDF Viewer - `pdf-viewer/`

モダンなPDFビューアアプリケーション。PDFファイルの表示、ナビゲーション、基本的な操作機能を提供。

#### 🚀 実行方法

**開発サーバー起動**
```bash
cd pdf-viewer
npm install
npm run dev
```

#### 🛠️ 技術スタック

- **React** - UIライブラリ
- **TypeScript** - 型安全な開発環境
- **PDF.js** - PDFレンダリングエンジン

#### 📁 ファイル構成

プロジェクト構造は開発中に追加されます。

#### 🏗️ アーキテクチャ

**コンポーネント設計**
モジュール化されたコンポーネント構造で、PDFビューア機能をカプセル化。

**主な機能（予定）**
- PDFファイルのアップロード・表示
- ページナビゲーション（前へ/次へ）
- ズーム機能（拡大/縮小）
- サムネイル表示
- ページ番号ジャンプ
- フルスクリーンモード

#### 📝 開発ステータス

🚧 プロジェクトセットアップ中

---

## 📚 共通情報

### 開発時の注意点

1. **localStorage**
   - Vanilla版: `todos` キー
   - Next.js版: `todos-next` キー
   - 両バージョンは独立して動作

2. **優先度システム**
   両バージョンで共通の3段階優先度：
   - 高 (high): 赤色
   - 中 (medium): オレンジ色
   - 低 (low): 緑色

3. **フィルタリング**
   両バージョンで共通の3種類のフィルター：
   - すべて (all)
   - 未完了 (active)
   - 完了 (completed)
