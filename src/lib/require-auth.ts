import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

// Dev-mode fallback session.  When no real NextAuth session exists and we are
// running in development, we impersonate the platform admin so the dashboard is
// fully populated with seeded data without forcing a login.  In production this
// path is never taken and the real 401 is returned.
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

  // Development convenience: allow unauthenticated access as the demo admin so
  // every dashboard page renders with real seeded data out of the box.
  if (process.env.NODE_ENV !== 'production') {
    return { session: DEV_FALLBACK_SESSION as unknown as Awaited<ReturnType<typeof getServerSession>>, error: null }
  }

  return {
    session: null,
    error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
  }
}
