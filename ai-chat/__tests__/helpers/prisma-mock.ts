import { vi } from 'vitest';
import { PrismaClient } from '@prisma/client';

// Prismaクライアントのモック
export const prismaMock = {
  conversation: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  message: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
} as unknown as PrismaClient;

// lib/prisma.tsのモック設定
vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}));

export const resetMocks = () => {
  vi.clearAllMocks();
};
