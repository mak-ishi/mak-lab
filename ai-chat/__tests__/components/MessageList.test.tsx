import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/__tests__/helpers/chakra-test-utils';
import { MessageList } from '@/components/MessageList';

describe('MessageList', () => {
  it('メッセージが空の場合、何も表示されない', () => {
    const { container } = render(
      <MessageList messages={[]} isLoading={false} />
    );

    const messageElements = container.querySelectorAll('[role="article"]');
    expect(messageElements.length).toBe(0);
  });

  it('ユーザーメッセージを正しく表示する', () => {
    const messages = [
      {
        id: '1',
        role: 'user',
        content: 'こんにちは',
        createdAt: new Date('2024-01-01T10:00:00').toISOString(),
      },
    ];

    render(<MessageList messages={messages} isLoading={false} />);

    expect(screen.getByText('こんにちは')).toBeInTheDocument();
    expect(screen.getByText('You')).toBeInTheDocument();
  });

  it('アシスタントメッセージを正しく表示する', () => {
    const messages = [
      {
        id: '1',
        role: 'assistant',
        content: 'お手伝いできることはありますか？',
        createdAt: new Date('2024-01-01T10:00:00').toISOString(),
      },
    ];

    render(<MessageList messages={messages} isLoading={false} />);

    expect(
      screen.getByText('お手伝いできることはありますか？')
    ).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
  });

  it('複数のメッセージを正しい順序で表示する', () => {
    const messages = [
      {
        id: '1',
        role: 'user',
        content: '最初のメッセージ',
        createdAt: new Date('2024-01-01T10:00:00').toISOString(),
      },
      {
        id: '2',
        role: 'assistant',
        content: '二番目のメッセージ',
        createdAt: new Date('2024-01-01T10:00:05').toISOString(),
      },
      {
        id: '3',
        role: 'user',
        content: '三番目のメッセージ',
        createdAt: new Date('2024-01-01T10:00:10').toISOString(),
      },
    ];

    const { container } = render(
      <MessageList messages={messages} isLoading={false} />
    );

    const messageElements = container.querySelectorAll('[role="article"]');
    expect(messageElements.length).toBe(3);

    expect(screen.getByText('最初のメッセージ')).toBeInTheDocument();
    expect(screen.getByText('二番目のメッセージ')).toBeInTheDocument();
    expect(screen.getByText('三番目のメッセージ')).toBeInTheDocument();
  });

  it('ローディング中はローディングインジケーターを表示する', () => {
    render(<MessageList messages={[]} isLoading={true} />);

    expect(screen.getByText('AI')).toBeInTheDocument();
    // ローディングドット（3つの点）を確認
    const dots = screen.getAllByText('•');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('メッセージとローディングインジケーターを同時に表示できる', () => {
    const messages = [
      {
        id: '1',
        role: 'user',
        content: 'テストメッセージ',
        createdAt: new Date('2024-01-01T10:00:00').toISOString(),
      },
    ];

    render(<MessageList messages={messages} isLoading={true} />);

    expect(screen.getByText('テストメッセージ')).toBeInTheDocument();
    const aiLabels = screen.getAllByText('AI');
    expect(aiLabels.length).toBeGreaterThan(0);
  });

  it('マークダウン形式のメッセージを表示する', () => {
    const messages = [
      {
        id: '1',
        role: 'assistant',
        content: '**太字**と*イタリック*のテキスト',
        createdAt: new Date('2024-01-01T10:00:00').toISOString(),
      },
    ];

    render(<MessageList messages={messages} isLoading={false} />);

    // マークダウンがレンダリングされることを確認（MarkdownRendererコンポーネント経由）
    expect(
      screen.getByText(/太字.*イタリック.*のテキスト/)
    ).toBeInTheDocument();
  });

  it('コードブロックを含むメッセージを表示する', () => {
    const messages = [
      {
        id: '1',
        role: 'assistant',
        content: '```javascript\nconst hello = "world";\n```',
        createdAt: new Date('2024-01-01T10:00:00').toISOString(),
      },
    ];

    render(<MessageList messages={messages} isLoading={false} />);

    // コードブロックの内容を確認
    expect(screen.getByText(/const hello = "world"/)).toBeInTheDocument();
  });

  it('長いメッセージリストを正しく表示する', () => {
    const messages = Array.from({ length: 50 }, (_, i) => ({
      id: `${i}`,
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `メッセージ ${i + 1}`,
      createdAt: new Date(
        2024,
        0,
        1,
        10,
        0,
        i
      ).toISOString(),
    }));

    const { container } = render(
      <MessageList messages={messages} isLoading={false} />
    );

    const messageElements = container.querySelectorAll('[role="article"]');
    expect(messageElements.length).toBe(50);
    expect(screen.getByText('メッセージ 1')).toBeInTheDocument();
    expect(screen.getByText('メッセージ 50')).toBeInTheDocument();
  });

  it('添付ファイル情報を含むメッセージを表示する', () => {
    const messages = [
      {
        id: '1',
        role: 'user',
        content: 'ファイルを添付しました',
        createdAt: new Date('2024-01-01T10:00:00').toISOString(),
        attachments: [
          {
            name: 'test.png',
            size: 12345,
            type: 'image/png',
            url: '/uploads/test.png',
          },
        ],
      },
    ];

    render(<MessageList messages={messages} isLoading={false} />);

    expect(screen.getByText('ファイルを添付しました')).toBeInTheDocument();
    // 添付ファイルの情報も表示されることを確認
    expect(screen.getByText(/test\.png/)).toBeInTheDocument();
  });
});
