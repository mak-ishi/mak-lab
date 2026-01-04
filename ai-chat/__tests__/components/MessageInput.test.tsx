import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/__tests__/helpers/chakra-test-utils';
import userEvent from '@testing-library/user-event';
import { MessageInput } from '@/components/MessageInput';

describe('MessageInput', () => {
  it('初期状態では入力欄が空である', () => {
    const mockOnSend = vi.fn();
    render(<MessageInput onSend={mockOnSend} disabled={false} />);

    const textarea = screen.getByPlaceholderText(/メッセージを入力/);
    expect(textarea).toHaveValue('');
  });

  it('テキストを入力できる', async () => {
    const user = userEvent.setup();
    const mockOnSend = vi.fn();
    render(<MessageInput onSend={mockOnSend} disabled={false} />);

    const textarea = screen.getByPlaceholderText(/メッセージを入力/);
    await user.type(textarea, 'こんにちは');

    expect(textarea).toHaveValue('こんにちは');
  });

  it('送信ボタンをクリックするとメッセージが送信される', async () => {
    const user = userEvent.setup();
    const mockOnSend = vi.fn();
    render(<MessageInput onSend={mockOnSend} disabled={false} />);

    const textarea = screen.getByPlaceholderText(/メッセージを入力/);
    await user.type(textarea, 'テストメッセージ');

    const sendButton = screen.getByLabelText(/送信/);
    await user.click(sendButton);

    expect(mockOnSend).toHaveBeenCalledTimes(1);
    expect(mockOnSend).toHaveBeenCalledWith('テストメッセージ', undefined);
  });

  it('送信後、入力欄がクリアされる', async () => {
    const user = userEvent.setup();
    const mockOnSend = vi.fn();
    render(<MessageInput onSend={mockOnSend} disabled={false} />);

    const textarea = screen.getByPlaceholderText(/メッセージを入力/);
    await user.type(textarea, 'テストメッセージ');

    const sendButton = screen.getByLabelText(/送信/);
    await user.click(sendButton);

    await waitFor(() => {
      expect(textarea).toHaveValue('');
    });
  });

  it('空のメッセージは送信できない', async () => {
    const user = userEvent.setup();
    const mockOnSend = vi.fn();
    render(<MessageInput onSend={mockOnSend} disabled={false} />);

    const sendButton = screen.getByLabelText(/送信/);
    await user.click(sendButton);

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('空白のみのメッセージは送信できない', async () => {
    const user = userEvent.setup();
    const mockOnSend = vi.fn();
    render(<MessageInput onSend={mockOnSend} disabled={false} />);

    const textarea = screen.getByPlaceholderText(/メッセージを入力/);
    await user.type(textarea, '   ');

    const sendButton = screen.getByLabelText(/送信/);
    await user.click(sendButton);

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('Enterキーで送信される（Shift+Enterは除く）', async () => {
    const mockOnSend = vi.fn();
    render(<MessageInput onSend={mockOnSend} disabled={false} />);

    const textarea = screen.getByPlaceholderText(/メッセージを入力/);

    // テキストを入力
    fireEvent.change(textarea, { target: { value: 'テスト' } });

    // Enterキーを押す
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

    await waitFor(() => {
      expect(mockOnSend).toHaveBeenCalledWith('テスト', undefined);
    });
  });

  it('Shift+Enterでは送信されず改行される', async () => {
    const mockOnSend = vi.fn();
    render(<MessageInput onSend={mockOnSend} disabled={false} />);

    const textarea = screen.getByPlaceholderText(/メッセージを入力/);

    // テキストを入力
    fireEvent.change(textarea, { target: { value: 'テスト' } });

    // Shift+Enterを押す
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('disabled状態では送信ボタンが無効になる', () => {
    const mockOnSend = vi.fn();
    render(<MessageInput onSend={mockOnSend} disabled={true} />);

    const sendButton = screen.getByLabelText(/送信/);
    expect(sendButton).toBeDisabled();
  });

  it('disabled状態ではテキストエリアも無効になる', () => {
    const mockOnSend = vi.fn();
    render(<MessageInput onSend={mockOnSend} disabled={true} />);

    const textarea = screen.getByPlaceholderText(/メッセージを入力/);
    expect(textarea).toBeDisabled();
  });

  it('ファイル選択ボタンが表示される', () => {
    const mockOnSend = vi.fn();
    render(<MessageInput onSend={mockOnSend} disabled={false} />);

    const fileButton = screen.getByLabelText(/ファイルを添付/);
    expect(fileButton).toBeInTheDocument();
  });

  it('ファイルを選択すると表示される', async () => {
    const user = userEvent.setup();
    const mockOnSend = vi.fn();
    render(<MessageInput onSend={mockOnSend} disabled={false} />);

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/ファイルを添付/).querySelector('input[type="file"]') as HTMLInputElement;

    if (input) {
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText('test.txt')).toBeInTheDocument();
      });
    }
  });

  it('複数のファイルを選択できる', async () => {
    const user = userEvent.setup();
    const mockOnSend = vi.fn();
    render(<MessageInput onSend={mockOnSend} disabled={false} />);

    const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
    const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/ファイルを添付/).querySelector('input[type="file"]') as HTMLInputElement;

    if (input) {
      await user.upload(input, [file1, file2]);

      await waitFor(() => {
        expect(screen.getByText('test1.txt')).toBeInTheDocument();
        expect(screen.getByText('test2.txt')).toBeInTheDocument();
      });
    }
  });

  it('選択したファイルを削除できる', async () => {
    const user = userEvent.setup();
    const mockOnSend = vi.fn();
    render(<MessageInput onSend={mockOnSend} disabled={false} />);

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/ファイルを添付/).querySelector('input[type="file"]') as HTMLInputElement;

    if (input) {
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText('test.txt')).toBeInTheDocument();
      });

      // 削除ボタンをクリック
      const removeButtons = screen.getAllByLabelText(/削除/);
      if (removeButtons.length > 0) {
        await user.click(removeButtons[0]);

        await waitFor(() => {
          expect(screen.queryByText('test.txt')).not.toBeInTheDocument();
        });
      }
    }
  });

  it('ファイル付きメッセージを送信できる', async () => {
    const user = userEvent.setup();
    const mockOnSend = vi.fn();
    render(<MessageInput onSend={mockOnSend} disabled={false} />);

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/ファイルを添付/).querySelector('input[type="file"]') as HTMLInputElement;

    if (input) {
      await user.upload(input, file);

      const textarea = screen.getByPlaceholderText(/メッセージを入力/);
      await user.type(textarea, 'ファイル付きメッセージ');

      const sendButton = screen.getByLabelText(/送信/);
      await user.click(sendButton);

      await waitFor(() => {
        expect(mockOnSend).toHaveBeenCalledWith(
          'ファイル付きメッセージ',
          expect.arrayContaining([expect.objectContaining({ name: 'test.txt' })])
        );
      });
    }
  });

  it('長いテキストを入力できる', async () => {
    const user = userEvent.setup();
    const mockOnSend = vi.fn();
    render(<MessageInput onSend={mockOnSend} disabled={false} />);

    const longText = 'あ'.repeat(1000);
    const textarea = screen.getByPlaceholderText(/メッセージを入力/);
    await user.type(textarea, longText);

    expect(textarea).toHaveValue(longText);
  });
});
