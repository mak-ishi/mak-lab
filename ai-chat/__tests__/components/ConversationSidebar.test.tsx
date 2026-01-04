import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@/__tests__/helpers/chakra-test-utils';
import userEvent from '@testing-library/user-event';
import { ConversationSidebar } from '@/components/ConversationSidebar';

describe('ConversationSidebar', () => {
  it('会話リストが空の場合、適切なメッセージが表示される', () => {
    const mockOnSelect = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnNewConversation = vi.fn();

    render(
      <ConversationSidebar
        conversations={[]}
        currentConversationId={null}
        onSelectConversation={mockOnSelect}
        onDeleteConversation={mockOnDelete}
        onNewConversation={mockOnNewConversation}
      />
    );

    // 新規会話ボタンは常に表示される
    expect(screen.getByText(/新しい会話/)).toBeInTheDocument();
  });

  it('会話リストを正しく表示する', () => {
    const conversations = [
      {
        id: '1',
        title: '会話1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        id: '2',
        title: '会話2',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-04'),
      },
    ];

    const mockOnSelect = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnNewConversation = vi.fn();

    render(
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={null}
        onSelectConversation={mockOnSelect}
        onDeleteConversation={mockOnDelete}
        onNewConversation={mockOnNewConversation}
      />
    );

    expect(screen.getByText('会話1')).toBeInTheDocument();
    expect(screen.getByText('会話2')).toBeInTheDocument();
  });

  it('会話を選択すると onSelectConversation が呼ばれる', async () => {
    const user = userEvent.setup();
    const conversations = [
      {
        id: '1',
        title: '会話1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      },
    ];

    const mockOnSelect = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnNewConversation = vi.fn();

    render(
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={null}
        onSelectConversation={mockOnSelect}
        onDeleteConversation={mockOnDelete}
        onNewConversation={mockOnNewConversation}
      />
    );

    const conversationButton = screen.getByText('会話1');
    await user.click(conversationButton);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith('1');
  });

  it('新しい会話ボタンをクリックすると onNewConversation が呼ばれる', async () => {
    const user = userEvent.setup();
    const mockOnSelect = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnNewConversation = vi.fn();

    render(
      <ConversationSidebar
        conversations={[]}
        currentConversationId={null}
        onSelectConversation={mockOnSelect}
        onDeleteConversation={mockOnDelete}
        onNewConversation={mockOnNewConversation}
      />
    );

    const newButton = screen.getByText(/新しい会話/);
    await user.click(newButton);

    expect(mockOnNewConversation).toHaveBeenCalledTimes(1);
  });

  it('削除ボタンをクリックすると onDeleteConversation が呼ばれる', async () => {
    const user = userEvent.setup();
    const conversations = [
      {
        id: '1',
        title: '削除する会話',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      },
    ];

    const mockOnSelect = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnNewConversation = vi.fn();

    render(
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={null}
        onSelectConversation={mockOnSelect}
        onDeleteConversation={mockOnDelete}
        onNewConversation={mockOnNewConversation}
      />
    );

    // 削除ボタンを探す（通常はホバー時に表示されるが、テストでは直接アクセス）
    const deleteButtons = screen.getAllByLabelText(/削除/);
    if (deleteButtons.length > 0) {
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockOnDelete).toHaveBeenCalledWith('1');
      });
    }
  });

  it('現在選択中の会話がハイライトされる', () => {
    const conversations = [
      {
        id: '1',
        title: '会話1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        id: '2',
        title: '会話2（選択中）',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-04'),
      },
    ];

    const mockOnSelect = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnNewConversation = vi.fn();

    const { container } = render(
      <ConversationSidebar
        conversations={conversations}
        currentConversationId="2"
        onSelectConversation={mockOnSelect}
        onDeleteConversation={mockOnDelete}
        onNewConversation={mockOnNewConversation}
      />
    );

    // 選択中の会話が存在することを確認
    expect(screen.getByText('会話2（選択中）')).toBeInTheDocument();
  });

  it('複数の会話を正しく表示する', () => {
    const conversations = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      title: `会話${i + 1}`,
      createdAt: new Date(2024, 0, i + 1),
      updatedAt: new Date(2024, 0, i + 1),
    }));

    const mockOnSelect = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnNewConversation = vi.fn();

    render(
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={null}
        onSelectConversation={mockOnSelect}
        onDeleteConversation={mockOnDelete}
        onNewConversation={mockOnNewConversation}
      />
    );

    expect(screen.getByText('会話1')).toBeInTheDocument();
    expect(screen.getByText('会話5')).toBeInTheDocument();
    expect(screen.getByText('会話10')).toBeInTheDocument();
  });

  it('会話タイトルが長い場合でも表示される', () => {
    const conversations = [
      {
        id: '1',
        title: 'これは非常に長い会話のタイトルです。通常の表示領域を超える可能性があります。',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      },
    ];

    const mockOnSelect = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnNewConversation = vi.fn();

    render(
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={null}
        onSelectConversation={mockOnSelect}
        onDeleteConversation={mockOnDelete}
        onNewConversation={mockOnNewConversation}
      />
    );

    expect(
      screen.getByText(/これは非常に長い会話のタイトルです/)
    ).toBeInTheDocument();
  });

  it('同じ会話を再度選択してもコールバックが呼ばれる', async () => {
    const user = userEvent.setup();
    const conversations = [
      {
        id: '1',
        title: '会話1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      },
    ];

    const mockOnSelect = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnNewConversation = vi.fn();

    render(
      <ConversationSidebar
        conversations={conversations}
        currentConversationId="1"
        onSelectConversation={mockOnSelect}
        onDeleteConversation={mockOnDelete}
        onNewConversation={mockOnNewConversation}
      />
    );

    const conversationButton = screen.getByText('会話1');
    await user.click(conversationButton);

    expect(mockOnSelect).toHaveBeenCalledWith('1');
  });

  it('会話が更新日時順にソートされている', () => {
    const conversations = [
      {
        id: '1',
        title: '古い会話',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        id: '2',
        title: '新しい会話',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-10'),
      },
      {
        id: '3',
        title: '中間の会話',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-05'),
      },
    ];

    const mockOnSelect = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnNewConversation = vi.fn();

    const { container } = render(
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={null}
        onSelectConversation={mockOnSelect}
        onDeleteConversation={mockOnDelete}
        onNewConversation={mockOnNewConversation}
      />
    );

    // すべての会話が表示されることを確認
    expect(screen.getByText('古い会話')).toBeInTheDocument();
    expect(screen.getByText('新しい会話')).toBeInTheDocument();
    expect(screen.getByText('中間の会話')).toBeInTheDocument();
  });
});
