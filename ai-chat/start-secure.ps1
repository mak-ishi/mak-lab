Write-Host ""
Write-Host "🔐 AI Chat アプリケーション起動" -ForegroundColor Cyan
Write-Host ""

$apiKey = Read-Host "Google Gemini APIキーを入力してください"

if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Host "❌ APIキーが入力されていません。" -ForegroundColor Red
    exit 1
}

Write-Host "✅ APIキーを設定しました。アプリを起動します..." -ForegroundColor Green
Write-Host ""

$env:GOOGLE_GENERATIVE_AI_API_KEY = $apiKey
npm run dev:next
