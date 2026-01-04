import { describe, it, expect, beforeEach } from 'vitest';
import { GET, PATCH, DELETE } from '@/app/api/conversations/[id]/route';
import { prismaMock, resetMocks } from '@/__tests__/helpers/prisma-mock';

const createMockContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

describe('GET /api/conversations/[id]', () => {
  beforeEach(() => {
    resetMocks();
  });

  it('指定されたIDの会話とメッセージを取得できる', async () => {
    const mockConversation = {
      id: '1',
      title: 'テスト会話',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      messages: [
        {
          id: 'm1',
          conversationId: '1',
          role: 'user',
          content: 'こんにちは',
          attachments: null,
          createdAt: new Date('2024-01-01T10:00:00'),
        },
        {
          id: 'm2',
          conversationId: '1',
          role: 'assistant',
          content: 'こんにちは！お手伝いできることはありますか？',
          attachments: null,
          createdAt: new Date('2024-01-01T10:00:05'),
        },
      ],
    };

    prismaMock.conversation.findUnique.mockResolvedValue(mockConversation as any);

    const request = new Request('http://localhost:3000/api/conversations/1');
    const context = createMockContext('1');
    const response = await GET(request, context);
    const data = await response.json();

    expect(prismaMock.conversation.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.conversation.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    expect(response.status).toBe(200);
    expect(data.id).toBe('1');
    expect(data.messages).toHaveLength(2);
    expect(data.messages[0].role).toBe('user');
    expect(data.messages[1].role).toBe('assistant');
  });

  it('存在しないIDの場合は404エラーを返す', async () => {
    prismaMock.conversation.findUnique.mockResolvedValue(null);

    const request = new Request('http://localhost:3000/api/conversations/999');
    const context = createMockContext('999');
    const response = await GET(request, context);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('見つかりません');
  });

  it('データベースエラーが発生した場合は500エラーを返す', async () => {
    prismaMock.conversation.findUnique.mockRejectedValue(
      new Error('Database error')
    );

    const request = new Request('http://localhost:3000/api/conversations/1');
    const context = createMockContext('1');
    const response = await GET(request, context);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
  });
});

describe('PATCH /api/conversations/[id]', () => {
  beforeEach(() => {
    resetMocks();
  });

  it('会話のタイトルを更新できる', async () => {
    const updatedConversation = {
      id: '1',
      title: '更新されたタイトル',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-06'),
    };

    prismaMock.conversation.update.mockResolvedValue(updatedConversation as any);

    const request = new Request('http://localhost:3000/api/conversations/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '更新されたタイトル' }),
    });
    const context = createMockContext('1');
    const response = await PATCH(request, context);
    const data = await response.json();

    expect(prismaMock.conversation.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.conversation.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { title: '更新されたタイトル' },
    });
    expect(response.status).toBe(200);
    expect(data.title).toBe('更新されたタイトル');
  });

  it('タイトルが空の場合でも更新できる', async () => {
    const updatedConversation = {
      id: '1',
      title: '',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-06'),
    };

    prismaMock.conversation.update.mockResolvedValue(updatedConversation as any);

    const request = new Request('http://localhost:3000/api/conversations/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' }),
    });
    const context = createMockContext('1');
    const response = await PATCH(request, context);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.title).toBe('');
  });

  it('存在しないIDの場合はPrismaがエラーをスローする', async () => {
    prismaMock.conversation.update.mockRejectedValue(
      new Error('Record to update not found')
    );

    const request = new Request('http://localhost:3000/api/conversations/999', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '存在しない' }),
    });
    const context = createMockContext('999');
    const response = await PATCH(request, context);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
  });
});

describe('DELETE /api/conversations/[id]', () => {
  beforeEach(() => {
    resetMocks();
  });

  it('指定されたIDの会話を削除できる', async () => {
    const deletedConversation = {
      id: '1',
      title: '削除される会話',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    };

    prismaMock.conversation.delete.mockResolvedValue(deletedConversation as any);

    const request = new Request('http://localhost:3000/api/conversations/1', {
      method: 'DELETE',
    });
    const context = createMockContext('1');
    const response = await DELETE(request, context);
    const data = await response.json();

    expect(prismaMock.conversation.delete).toHaveBeenCalledTimes(1);
    expect(prismaMock.conversation.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('message');
    expect(data.message).toContain('削除しました');
  });

  it('存在しないIDの場合はPrismaがエラーをスローする', async () => {
    prismaMock.conversation.delete.mockRejectedValue(
      new Error('Record to delete does not exist')
    );

    const request = new Request('http://localhost:3000/api/conversations/999', {
      method: 'DELETE',
    });
    const context = createMockContext('999');
    const response = await DELETE(request, context);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
  });

  it('データベースエラーが発生した場合は500エラーを返す', async () => {
    prismaMock.conversation.delete.mockRejectedValue(
      new Error('Database connection lost')
    );

    const request = new Request('http://localhost:3000/api/conversations/1', {
      method: 'DELETE',
    });
    const context = createMockContext('1');
    const response = await DELETE(request, context);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
  });
});
