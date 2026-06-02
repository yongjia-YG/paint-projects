import { PrismaClient } from '@prisma/client';

// 單例 PrismaClient：避免開發時熱重載重複建立連線。
// Nitro 會自動匯入 server/utils 內的具名匯出，故其他 server 檔可直接使用 `prisma`。
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
