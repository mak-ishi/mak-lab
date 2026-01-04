@echo off
chcp 65001 > nul
echo.
echo ============================================
echo AI Chat Application Startup
echo ============================================
echo.
set /p API_KEY="Google Gemini API Key: "

if "%API_KEY%"=="" (
    echo.
    echo [ERROR] API key is required.
    echo.
    pause
    exit /b 1
)

echo.
echo [OK] API key configured. Starting application...
echo.

set GOOGLE_GENERATIVE_AI_API_KEY=%API_KEY%
npm run dev:next
