'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, Lock, Mail, ChevronDown, ChevronUp, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const DEMO_ACCOUNTS = [
  { role: 'Platform Admin', email: 'admin@almatech.com', password: 'admin123', color: 'bg-violet-500' },
  { role: 'Operator', email: 'operator@statoil.com', password: 'operator123', color: 'bg-sky-500' },
  { role: 'OEM Partner', email: 'partner@oem.com', password: 'partner123', color: 'bg-teal-500' },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDemo, setShowDemo] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password. Please try again.')
    } else {
      router.push('/')
      router.refresh()
    }
  }

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email)
    setPassword(acc.password)
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo & branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-400 shadow-lg shadow-sky-500/25 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AddManuChain</h1>
          <p className="text-slate-400 text-sm mt-1">Secure Supply Chain Platform</p>
        </div>

        {/* Card */}
        <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/40 p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Sign in to your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-300 text-sm">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="pl-9 bg-[#0F172A] border-slate-600 text-white placeholder:text-slate-600 focus:border-sky-500 focus:ring-sky-500/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-300 text-sm">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-9 bg-[#0F172A] border-slate-600 text-white placeholder:text-slate-600 focus:border-sky-500 focus:ring-sky-500/20"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-medium border-0 shadow-lg shadow-sky-500/20 mt-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in…</>
              ) : (
                'Sign in →'
              )}
            </Button>
          </form>

          {/* Demo accounts panel */}
          <div className="mt-6 border-t border-slate-700/60 pt-5">
            <button
              onClick={() => setShowDemo(v => !v)}
              className="flex items-center justify-between w-full text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span className="font-medium">Demo Access</span>
              {showDemo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDemo && (
              <div className="mt-3 space-y-2">
                {DEMO_ACCOUNTS.map(acc => (
                  <button
                    key={acc.email}
                    onClick={() => fillDemo(acc)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#0F172A] border border-slate-700/40 hover:border-slate-600 transition-colors text-left group"
                  >
                    <div className={`w-2 h-2 rounded-full ${acc.color} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">{acc.role}</p>
                      <p className="text-xs text-slate-500 truncate">{acc.email}</p>
                    </div>
                    <span className="text-xs text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0">
                      Use →
                    </span>
                  </button>
                ))}
                <p className="text-xs text-slate-600 text-center mt-1">
                  Click an account to auto-fill credentials
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          © 2026 AddManuChain. Private & Confidential.
        </p>
      </div>
    </div>
  )
}
