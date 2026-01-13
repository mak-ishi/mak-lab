# PDF Viewer

React + TypeScript + PDF.jsで構築されたモダンなPDFビューアアプリケーション。

## 🚀 実行方法

### 開発サーバー起動

```bash
cd pdf-viewer
npm install
npm run dev
```

ブラウザで http://localhost:5173 にアクセス

### 本番ビルド

```bash
npm run build
npm run preview
```

## ✨ 機能

- 📁 PDFファイルのアップロード・表示
- 📄 ページナビゲーション（前へ/次へ）
- 🔍 ズーム機能（拡大/縮小/リセット）
- 📊 ページ番号表示
- 🎨 モダンなUI（グラデーション背景）
- 📱 レスポンシブデザイン

## 🛠️ 技術スタック

- **React 18** - UIライブラリ
- **TypeScript** - 型安全な開発環境
- **Vite** - 高速ビルドツール
- **PDF.js** - PDFレンダリングエンジン

## 📁 ファイル構成

```
pdf-viewer/
├── src/
│   ├── App.tsx          # メインアプリケーションコンポーネント
│   ├── App.css          # アプリケーションスタイル
│   ├── main.tsx         # エントリーポイント
│   └── index.css        # グローバルスタイル
├── public/              # 静的ファイル
├── index.html           # HTMLテンプレート
├── vite.config.ts       # Vite設定
├── tsconfig.json        # TypeScript設定
└── package.json         # 依存関係とスクリプト
```

## 🎯 主な実装

### PDFレンダリング

PDF.jsを使用してPDFファイルを読み込み、Canvasにレンダリング:

```typescript
const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
const pdf = await loadingTask.promise
const page = await pdf.getPage(pageNum)
const viewport = page.getViewport({ scale })
await page.render(renderContext).promise
```

### 状態管理

React Hooksで状態を管理:

- `pdfDoc`: 読み込まれたPDFドキュメント
- `currentPage`: 現在のページ番号
- `totalPages`: 総ページ数
- `scale`: ズーム倍率
- `loading`: 読み込み状態
- `error`: エラーメッセージ

## 📝 使い方

1. 「PDFを開く」ボタンをクリックしてPDFファイルを選択
2. 「前へ」「次へ」ボタンでページを移動
3. 「＋」「－」ボタンでズームイン/アウト
4. 「リセット」ボタンでズームを元に戻す

## 🎨 デザイン

- グラデーション背景（紫テーマ）
- クリーンなホワイトカード
- スムーズなトランジション
- レスポンシブレイアウト
- 日本語UI

## 📦 依存関係

主な依存パッケージ:

- `react` ^18.2.0
- `react-dom` ^18.2.0
- `pdfjs-dist` ^3.11.174
- `vite` ^5.0.8
- `typescript` ^5.2.2

## 🔧 開発

### リント実行

```bash
npm run lint
```

### 型チェック

```bash
tsc --noEmit
```

## 📄 ライセンス

MIT
