import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

const DEV_FALLBACK_SESSION = {
  user: {
    id: 'dev-admin',
    email: 'admin@almatech.com',
    name: 'Platform Admin',
    role: 'admin',
    company: 'Alma-Tech',
    image: null as string | null,
  },
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
} as const

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  if (session?.user) {
    return { session, error: null }
  }

  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.ALLOW_DEV_AUTH_BYPASS === 'true'
  ) {
    return { session: DEV_FALLBACK_SESSION as unknown as Awaited<ReturnType<typeof getServerSession>>, error: null }
  }

  return {
    session: null,
    error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
  }
}
