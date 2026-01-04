import { describe, it, expect, beforeEach } from 'vitest';
import { POST, GET } from '@/app/api/messages/route';
import { prismaMock, resetMocks } from '@/__tests__/helpers/prisma-mock';

describe('POST /api/messages', () => {
  beforeEach(() => {
    resetMocks();
  });

  it('新規メッセージを作成し、会話のupdatedAtを更新できる', async () => {
    const newMessage = {
      id: 'm1',
      conversationId: 'conv1',
      role: 'user',
      content: 'こんにちは',
      attachments: null,
      createdAt: new Date('2024-01-01T10:00:00'),
    };

    const updatedConversation = {
      id: 'conv1',
      title: 'テスト会話',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01T10:00:00'),
    };

    prismaMock.message.create.mockResolvedValue(newMessage as any);
    prismaMock.conversation.update.mockResolvedValue(updatedConversation as any);

    const request = new Request('http://localhost:3000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: 'conv1',
        role: 'user',
        content: 'こんにちは',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(prismaMock.message.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.message.create).toHaveBeenCalledWith({
      data: {
        conversationId: 'conv1',
        role: 'user',
        content: 'こんにちは',
        attachments: null,
      },
    });

    expect(prismaMock.conversation.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.conversation.update).toHaveBeenCalledWith({
      where: { id: 'conv1' },
      data: { updatedAt: expect.any(Date) },
    });

    expect(response.status).toBe(201);
    expect(data.id).toBe('m1');
    expect(data.content).toBe('こんにちは');
    expect(data.role).toBe('user');
  });

  it('添付ファイル付きメッセージを作成できる', async () => {
    const attachments = [
      { name: 'test.png', size: 12345, type: 'image/png', url: '/uploads/test.png' },
    ];

    const newMessage = {
      id: 'm2',
      conversationId: 'conv1',
      role: 'user',
      content: '画像を送ります',
      attachments,
      createdAt: new Date('2024-01-01T10:00:00'),
    };

    prismaMock.message.create.mockResolvedValue(newMessage as any);
    prismaMock.conversation.update.mockResolvedValue({} as any);

    const request = new Request('http://localhost:3000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: 'conv1',
        role: 'user',
        content: '画像を送ります',
        attachments,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(prismaMock.message.create).toHaveBeenCalledWith({
      data: {
        conversationId: 'conv1',
        role: 'user',
        content: '画像を送ります',
        attachments,
      },
    });

    expect(response.status).toBe(201);
    expect(data.attachments).toEqual(attachments);
  });

  it('アシスタントのメッセージを作成できる', async () => {
    const newMessage = {
      id: 'm3',
      conversationId: 'conv1',
      role: 'assistant',
      content: 'お手伝いできることはありますか？',
      attachments: null,
      createdAt: new Date('2024-01-01T10:00:05'),
    };

    prismaMock.message.create.mockResolvedValue(newMessage as any);
    prismaMock.conversation.update.mockResolvedValue({} as any);

    const request = new Request('http://localhost:3000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: 'conv1',
        role: 'assistant',
        content: 'お手伝いできることはありますか？',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.role).toBe('assistant');
  });

  it('必須フィールドが不足している場合はエラーを返す', async () => {
    prismaMock.message.create.mockRejectedValue(
      new Error('Required field missing')
    );

    const request = new Request('http://localhost:3000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: 'conv1',
        // roleとcontentが不足
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
  });

  it('存在しない会話IDの場合はエラーを返す', async () => {
    prismaMock.message.create.mockRejectedValue(
      new Error('Foreign key constraint failed')
    );

    const request = new Request('http://localhost:3000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: 'invalid-id',
        role: 'user',
        content: 'テスト',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
  });
});

describe('GET /api/messages', () => {
  beforeEach(() => {
    resetMocks();
  });

  it('会話IDでメッセージを取得できる', async () => {
    const mockMessages = [
      {
        id: 'm1',
        conversationId: 'conv1',
        role: 'user',
        content: 'こんにちは',
        attachments: null,
        createdAt: new Date('2024-01-01T10:00:00'),
      },
      {
        id: 'm2',
        conversationId: 'conv1',
        role: 'assistant',
        content: 'こんにちは！',
        attachments: null,
        createdAt: new Date('2024-01-01T10:00:05'),
      },
      {
        id: 'm3',
        conversationId: 'conv1',
        role: 'user',
        content: 'お元気ですか？',
        attachments: null,
        createdAt: new Date('2024-01-01T10:00:10'),
      },
    ];

    prismaMock.message.findMany.mockResolvedValue(mockMessages as any);

    const request = new Request(
      'http://localhost:3000/api/messages?conversationId=conv1'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(prismaMock.message.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.message.findMany).toHaveBeenCalledWith({
      where: { conversationId: 'conv1' },
      orderBy: { createdAt: 'asc' },
    });

    expect(response.status).toBe(200);
    expect(data).toHaveLength(3);
    expect(data[0].role).toBe('user');
    expect(data[1].role).toBe('assistant');
    expect(data[2].role).toBe('user');
  });

  it('conversationIdが指定されていない場合は400エラーを返す', async () => {
    const request = new Request('http://localhost:3000/api/messages');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('conversationId');
  });

  it('メッセージが存在しない会話の場合は空配列を返す', async () => {
    prismaMock.message.findMany.mockResolvedValue([]);

    const request = new Request(
      'http://localhost:3000/api/messages?conversationId=empty-conv'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
    expect(data).toHaveLength(0);
  });

  it('データベースエラーが発生した場合は500エラーを返す', async () => {
    prismaMock.message.findMany.mockRejectedValue(
      new Error('Database connection failed')
    );

    const request = new Request(
      'http://localhost:3000/api/messages?conversationId=conv1'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
  });
});
