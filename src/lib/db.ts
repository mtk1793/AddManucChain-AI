import { PrismaClient } from '@prisma/client'

// Use a cache-busting approach for development
const GLOBAL_KEY = 'prisma_client_v3'

const globalForPrisma = globalThis as unknown as {
  [key: string]: PrismaClient | undefined
}

export const db =
  globalForPrisma[GLOBAL_KEY] ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma[GLOBAL_KEY] = db