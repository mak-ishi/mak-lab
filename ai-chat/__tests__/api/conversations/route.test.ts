import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/conversations/route';
import { prismaMock, resetMocks } from '@/__tests__/helpers/prisma-mock';

describe('GET /api/conversations', () => {
  beforeEach(() => {
    resetMocks();
  });

  it('全会話を取得できる', async () => {
    // モックデータ
    const mockConversations = [
      {
        id: '1',
        title: 'テスト会話1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        messages: [
          {
            id: 'm1',
            conversationId: '1',
            role: 'user',
            content: 'こんにちは',
            attachments: null,
            createdAt: new Date('2024-01-01'),
          },
        ],
      },
      {
        id: '2',
        title: 'テスト会話2',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-04'),
        messages: [
          {
            id: 'm2',
            conversationId: '2',
            role: 'user',
            content: 'テスト',
            attachments: null,
            createdAt: new Date('2024-01-03'),
          },
        ],
      },
    ];

    // findManyの動作を設定
    prismaMock.conversation.findMany.mockResolvedValue(mockConversations as any);

    // APIを呼び出し
    const response = await GET();
    const data = await response.json();

    // 検証
    expect(prismaMock.conversation.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.conversation.findMany).toHaveBeenCalledWith({
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    expect(response.status).toBe(200);
    expect(data).toEqual(mockConversations);
    expect(data).toHaveLength(2);
    expect(data[0].title).toBe('テスト会話1');
  });

  it('会話が存在しない場合は空配列を返す', async () => {
    // 空配列を返すように設定
    prismaMock.conversation.findMany.mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
    expect(data).toHaveLength(0);
  });

  it('データベースエラーが発生した場合は500エラーを返す', async () => {
    // エラーをスロー
    prismaMock.conversation.findMany.mockRejectedValue(
      new Error('Database connection failed')
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
  });
});

describe('POST /api/conversations', () => {
  beforeEach(() => {
    resetMocks();
  });

  it('新規会話を作成できる', async () => {
    const newConversation = {
      id: '123',
      title: '新しい会話',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05'),
    };

    prismaMock.conversation.create.mockResolvedValue(newConversation as any);

    // Requestオブジェクトを作成
    const request = new Request('http://localhost:3000/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '新しい会話' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(prismaMock.conversation.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.conversation.create).toHaveBeenCalledWith({
      data: { title: '新しい会話' },
    });
    expect(response.status).toBe(201);
    expect(data.id).toBe('123');
    expect(data.title).toBe('新しい会話');
  });

  it('タイトルが指定されていない場合はデフォルトタイトルで作成', async () => {
    const newConversation = {
      id: '456',
      title: '新しい会話',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.conversation.create.mockResolvedValue(newConversation as any);

    const request = new Request('http://localhost:3000/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(prismaMock.conversation.create).toHaveBeenCalledWith({
      data: { title: '新しい会話' },
    });
    expect(response.status).toBe(201);
    expect(data.title).toBe('新しい会話');
  });

  it('空のタイトルが指定された場合はデフォルトタイトルで作成', async () => {
    const newConversation = {
      id: '789',
      title: '新しい会話',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.conversation.create.mockResolvedValue(newConversation as any);

    const request = new Request('http://localhost:3000/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(prismaMock.conversation.create).toHaveBeenCalledWith({
      data: { title: '新しい会話' },
    });
    expect(response.status).toBe(201);
  });

  it('データベースエラーが発生した場合は500エラーを返す', async () => {
    prismaMock.conversation.create.mockRejectedValue(
      new Error('Failed to create conversation')
    );

    const request = new Request('http://localhost:3000/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'エラー会話' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
  });
});
