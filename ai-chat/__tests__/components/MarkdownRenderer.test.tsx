import { describe, it, expect } from 'vitest';
import { render, screen } from '@/__tests__/helpers/chakra-test-utils';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

describe('MarkdownRenderer', () => {
  it('プレーンテキストを正しくレンダリングする', () => {
    render(<MarkdownRenderer content="これはプレーンテキストです" />);
    expect(screen.getByText('これはプレーンテキストです')).toBeInTheDocument();
  });

  it('見出しを正しくレンダリングする', () => {
    const markdown = '# 見出し1\n## 見出し2\n### 見出し3';
    render(<MarkdownRenderer content={markdown} />);

    expect(screen.getByText('見出し1')).toBeInTheDocument();
    expect(screen.getByText('見出し2')).toBeInTheDocument();
    expect(screen.getByText('見出し3')).toBeInTheDocument();
  });

  it('太字を正しくレンダリングする', () => {
    render(<MarkdownRenderer content="**太字のテキスト**" />);
    const boldElement = screen.getByText('太字のテキスト');
    expect(boldElement.tagName).toBe('STRONG');
  });

  it('イタリックを正しくレンダリングする', () => {
    render(<MarkdownRenderer content="*イタリックのテキスト*" />);
    const italicElement = screen.getByText('イタリックのテキスト');
    expect(italicElement.tagName).toBe('EM');
  });

  it('リンクを正しくレンダリングする', () => {
    render(<MarkdownRenderer content="[リンク](https://example.com)" />);
    const linkElement = screen.getByText('リンク') as HTMLAnchorElement;
    expect(linkElement.tagName).toBe('A');
    expect(linkElement.href).toBe('https://example.com/');
  });

  it('順序付きリストを正しくレンダリングする', () => {
    const markdown = '1. 項目1\n2. 項目2\n3. 項目3';
    render(<MarkdownRenderer content={markdown} />);

    expect(screen.getByText('項目1')).toBeInTheDocument();
    expect(screen.getByText('項目2')).toBeInTheDocument();
    expect(screen.getByText('項目3')).toBeInTheDocument();
  });

  it('順序なしリストを正しくレンダリングする', () => {
    const markdown = '- 項目A\n- 項目B\n- 項目C';
    render(<MarkdownRenderer content={markdown} />);

    expect(screen.getByText('項目A')).toBeInTheDocument();
    expect(screen.getByText('項目B')).toBeInTheDocument();
    expect(screen.getByText('項目C')).toBeInTheDocument();
  });

  it('インラインコードを正しくレンダリングする', () => {
    render(<MarkdownRenderer content="`const x = 10;`" />);
    expect(screen.getByText('const x = 10;')).toBeInTheDocument();
  });

  it('JavaScriptコードブロックを正しくレンダリングする', () => {
    const code = '```javascript\nconst hello = "world";\nconsole.log(hello);\n```';
    render(<MarkdownRenderer content={code} />);

    expect(screen.getByText(/const hello = "world"/)).toBeInTheDocument();
    expect(screen.getByText(/console\.log\(hello\)/)).toBeInTheDocument();
  });

  it('Pythonコードブロックを正しくレンダリングする', () => {
    const code = '```python\ndef hello():\n    print("world")\n```';
    render(<MarkdownRenderer content={code} />);

    expect(screen.getByText(/def hello\(\):/)).toBeInTheDocument();
    expect(screen.getByText(/print\("world"\)/)).toBeInTheDocument();
  });

  it('TypeScriptコードブロックを正しくレンダリングする', () => {
    const code = '```typescript\ninterface User {\n  name: string;\n}\n```';
    render(<MarkdownRenderer content={code} />);

    expect(screen.getByText(/interface User/)).toBeInTheDocument();
    expect(screen.getByText(/name: string/)).toBeInTheDocument();
  });

  it('言語指定なしのコードブロックを正しくレンダリングする', () => {
    const code = '```\nplain code block\n```';
    render(<MarkdownRenderer content={code} />);

    expect(screen.getByText(/plain code block/)).toBeInTheDocument();
  });

  it('引用を正しくレンダリングする', () => {
    render(<MarkdownRenderer content="> これは引用です" />);
    expect(screen.getByText('これは引用です')).toBeInTheDocument();
  });

  it('水平線を正しくレンダリングする', () => {
    const { container } = render(
      <MarkdownRenderer content="上のテキスト\n\n---\n\n下のテキスト" />
    );

    expect(screen.getByText('上のテキスト')).toBeInTheDocument();
    expect(screen.getByText('下のテキスト')).toBeInTheDocument();
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('テーブルを正しくレンダリングする', () => {
    const table = `
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| A1  | A2  | A3  |
| B1  | B2  | B3  |
`;
    render(<MarkdownRenderer content={table} />);

    expect(screen.getByText('列1')).toBeInTheDocument();
    expect(screen.getByText('列2')).toBeInTheDocument();
    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('B2')).toBeInTheDocument();
  });

  it('複雑なマークダウンを正しくレンダリングする', () => {
    const complexMarkdown = `
# タイトル

これは**太字**と*イタリック*を含むテキストです。

## コードの例

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

- リスト項目1
- リスト項目2

[リンク](https://example.com)
`;

    render(<MarkdownRenderer content={complexMarkdown} />);

    expect(screen.getByText('タイトル')).toBeInTheDocument();
    expect(screen.getByText('太字')).toBeInTheDocument();
    expect(screen.getByText('イタリック')).toBeInTheDocument();
    expect(screen.getByText(/function greet/)).toBeInTheDocument();
    expect(screen.getByText('リスト項目1')).toBeInTheDocument();
    expect(screen.getByText('リンク')).toBeInTheDocument();
  });

  it('空の文字列を渡しても エラーにならない', () => {
    const { container } = render(<MarkdownRenderer content="" />);
    expect(container).toBeInTheDocument();
  });

  it('改行を正しく処理する', () => {
    const markdown = '1行目\n\n2行目\n\n3行目';
    render(<MarkdownRenderer content={markdown} />);

    expect(screen.getByText('1行目')).toBeInTheDocument();
    expect(screen.getByText('2行目')).toBeInTheDocument();
    expect(screen.getByText('3行目')).toBeInTheDocument();
  });

  it('特殊文字をエスケープせずに表示する', () => {
    render(<MarkdownRenderer content="<div>HTMLタグ</div>" />);
    expect(screen.getByText(/HTMLタグ/)).toBeInTheDocument();
  });

  it('長いコードブロックを正しくレンダリングする', () => {
    const longCode = `\`\`\`javascript
${Array(50)
  .fill(0)
  .map((_, i) => `const variable${i} = ${i};`)
  .join('\n')}
\`\`\``;

    render(<MarkdownRenderer content={longCode} />);

    expect(screen.getByText(/const variable0 = 0/)).toBeInTheDocument();
    expect(screen.getByText(/const variable49 = 49/)).toBeInTheDocument();
  });
});
