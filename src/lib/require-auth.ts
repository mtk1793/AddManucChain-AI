import { NextResponse } from 'next/server'

// Always return a fallback admin session so all API routes work without auth
const FALLBACK_SESSION = {
  user: {
    id: 'admin',
    email: 'admin@almatech.com',
    name: 'Platform Admin',
    role: 'admin',
    company: 'Alma-Tech',
    image: null as string | null,
  },
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
} as const

export async function requireAuth() {
  return { session: FALLBACK_SESSION as any, error: null }
}
