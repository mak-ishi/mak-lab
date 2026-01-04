#!/usr/bin/env node

const { spawn } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔐 AI Chat アプリケーション起動\n');

rl.question('Google Gemini APIキーを入力してください: ', (apiKey) => {
  rl.close();

  if (!apiKey || apiKey.trim() === '') {
    console.error('❌ APIキーが入力されていません。');
    process.exit(1);
  }

  console.log('✅ APIキーを設定しました。アプリを起動します...\n');

  // 環境変数を設定してNext.jsを起動
  const env = { ...process.env, GOOGLE_GENERATIVE_AI_API_KEY: apiKey.trim() };

  const nextDev = spawn('npm', ['run', 'dev:next'], {
    env,
    stdio: 'inherit',
    shell: true
  });

  nextDev.on('close', (code) => {
    console.log('\n🛑 アプリケーションを終了しました。APIキーはメモリから削除されました。');
    process.exit(code);
  });

  // Ctrl+Cでの終了をハンドル
  process.on('SIGINT', () => {
    console.log('\n\n🛑 アプリケーションを終了しています...');
    nextDev.kill('SIGINT');
  });
});
