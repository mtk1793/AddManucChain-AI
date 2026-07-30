import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import type { Session } from 'next-auth'

const DEV_FALLBACK_SESSION: Session = {
  user: {
    id: 'dev-admin',
    email: 'admin@almatech.com',
    name: 'Platform Admin',
    role: 'admin',
    company: 'Alma-Tech',
    image: null as string | null,
  },
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
}

type AuthResult = { session: Session | null; error: NextResponse | null }

export async function requireAuth(): Promise<AuthResult> {
  const session = await getServerSession(authOptions)
  if (session?.user) {
    return { session, error: null }
  }

  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.ALLOW_DEV_AUTH_BYPASS === 'true'
  ) {
    return { session: DEV_FALLBACK_SESSION, error: null }
  }

  return {
    session: null,
    error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
  }
}
