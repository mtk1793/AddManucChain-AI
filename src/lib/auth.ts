import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const DEMO_USERS = [
  {
    id: 'demo-admin',
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL || 'admin@almatech.com',
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || 'admin123',
    name: 'Platform Admin',
    role: 'admin',
    company: 'Alma-Tech',
  },
  {
    id: 'demo-operator',
    email: process.env.NEXT_PUBLIC_DEMO_OPERATOR_EMAIL || 'operator@statoil.com',
    password: process.env.NEXT_PUBLIC_DEMO_OPERATOR_PASSWORD || 'operator123',
    name: 'Operator',
    role: 'operator',
    company: 'Statoil',
  },
  {
    id: 'demo-partner',
    email: process.env.NEXT_PUBLIC_DEMO_PARTNER_EMAIL || 'partner@oem.com',
    password: process.env.NEXT_PUBLIC_DEMO_PARTNER_PASSWORD || 'partner123',
    name: 'OEM Partner',
    role: 'oem_partner',
    company: 'OEM Partner',
  },
  {
    id: 'demo-cert',
    email: 'cert@authority.com',
    password: 'cert123',
    name: 'Certification Authority',
    role: 'cert_authority',
    company: 'Certification Authority',
  },
  {
    id: 'demo-center',
    email: 'print@center.com',
    password: 'print123',
    name: 'Print Center',
    role: 'print_center',
    company: 'Print Center',
  },
]

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (user?.password) {
            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password
            )

            if (isPasswordValid) {
              return {
                id: user.id,
                email: user.email,
                name: user.name || '',
                role: user.role,
                company: user.company || '',
                image: user.image || undefined,
              }
            }
          }
        } catch (error) {
          console.warn('Prisma auth unavailable, falling back to demo credentials', error)
        }

        const demoUser = DEMO_USERS.find(
          user => user.email === credentials.email && user.password === credentials.password
        )

        if (!demoUser) {
          return null
        }

        return {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
          company: demoUser.company,
          image: undefined,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.company = user.company
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.company = token.company as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}
