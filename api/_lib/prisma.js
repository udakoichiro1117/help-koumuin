import { PrismaClient } from '@prisma/client'

// サーバーレス関数はコールドスタートのたびに再実行されるため、
// グローバルにキャッシュしてコネクション数の増加を防ぐ
const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
