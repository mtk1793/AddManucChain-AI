'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Database, Cloud, Server, Zap, RefreshCw } from 'lucide-react'

// Endpoints to probe — each represents a subsystem of the platform.
const HEALTH_CHECKS = [
  { id: 'api', label: 'API Gateway', endpoint: '/api/stats', icon: Server },
  { id: 'db', label: 'Database', endpoint: '/api/orders?limit=1', icon: Database },
  { id: 'orders', label: 'Orders Service', endpoint: '/api/orders', icon: Zap },
  { id: 'blueprints', label: 'Blueprints', endpoint: '/api/blueprints', icon: Cloud },
  { id: 'centers', label: 'Print Centers', endpoint: '/api/centers', icon: Activity },
  { id: 'shipments', label: 'Shipments', endpoint: '/api/shipments', icon: Cloud },
] as const

type Status = 'ok' | 'slow' | 'down' | 'checking'

interface CheckResult {
  id: string
  label: string
  status: Status
  latencyMs: number | null
}

const STATUS_STYLES: Record<Status, { dot: string; text: string; bg: string; label: string }> = {
  ok: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', label: 'Operational' },
  slow: { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', label: 'Degraded' },
  down: { dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', label: 'Down' },
  checking: { dot: 'bg-slate-300', text: 'text-slate-500', bg: 'bg-slate-50', label: 'Checking…' },
}

export function SystemHealthWidget() {
  const [results, setResults] = useState<CheckResult[]>(
    HEALTH_CHECKS.map((c) => ({ id: c.id, label: c.label, status: 'checking', latencyMs: null })),
  )
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const runChecks = async () => {
    setIsRefreshing(true)
    // Reset to checking state
    setResults(HEALTH_CHECKS.map((c) => ({ id: c.id, label: c.label, status: 'checking', latencyMs: null })))

    const checks = await Promise.all(
      HEALTH_CHECKS.map(async (c) => {
        const start = performance.now()
        try {
          const res = await fetch(c.endpoint, { cache: 'no-store' })
          const elapsed = Math.round(performance.now() - start)
          let status: Status = 'ok'
          if (!res.ok) status = 'down'
          else if (elapsed > 800) status = 'slow'
          return { id: c.id, label: c.label, status, latencyMs: elapsed } as CheckResult
        } catch {
          return { id: c.id, label: c.label, status: 'down', latencyMs: null } as CheckResult
        }
      }),
    )
    setResults(checks)
    setLastChecked(new Date())
    setIsRefreshing(false)
  }

  useEffect(() => {
    runChecks()
    // Re-run every 60s
    const interval = setInterval(runChecks, 60_000)
    return () => clearInterval(interval)
  }, [])

  const upCount = results.filter((r) => r.status === 'ok').length
  const slowCount = results.filter((r) => r.status === 'slow').length
  const downCount = results.filter((r) => r.status === 'down').length
  const overall = downCount > 0 ? 'down' : slowCount > 0 ? 'slow' : 'ok'
  const overallStyle = STATUS_STYLES[overall]

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader className="pb-2 pt-4 px-5">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#0EA5E9]" />
            System Health
          </CardTitle>
          <button
            onClick={runChecks}
            disabled={isRefreshing}
            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 disabled:opacity-50 transition-colors"
            title="Re-run health checks"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-4 space-y-3">
        {/* Overall status banner */}
        <motion.div
          key={overall}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className={`flex items-center justify-between rounded-lg px-3 py-2 ${overallStyle.bg}`}
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${overallStyle.dot} ${overall === 'down' ? 'animate-pulse' : ''}`} />
            <span className={`text-xs font-semibold ${overallStyle.text}`}>
              {overall === 'ok' ? 'All Systems Operational' : overall === 'slow' ? 'Some Systems Degraded' : 'Partial Outage'}
            </span>
          </div>
          <span className={`text-[10px] font-medium ${overallStyle.text}`}>
            {upCount}/{results.length} up
          </span>
        </motion.div>

        {/* Individual checks */}
        <div className="grid grid-cols-2 gap-2">
          {results.map((r) => {
            const style = STATUS_STYLES[r.status]
            const Icon = HEALTH_CHECKS.find((c) => c.id === r.id)?.icon ?? Activity
            return (
              <div
                key={r.id}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-2 border border-slate-100 ${style.bg} transition-colors`}
              >
                <Icon className={`w-3.5 h-3.5 ${style.text} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-slate-700 truncate">{r.label}</p>
                  <p className={`text-[9px] ${style.text}`}>
                    {style.label}
                    {r.latencyMs !== null && ` · ${r.latencyMs}ms`}
                  </p>
                </div>
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot} ${r.status === 'down' ? 'animate-pulse' : ''} shrink-0`} />
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <span className="text-[9px] text-slate-400">
            {lastChecked ? `Checked ${lastChecked.toLocaleTimeString()}` : 'Running checks…'}
          </span>
          <span className="text-[9px] text-slate-400">Auto-refresh 60s</span>
        </div>
      </CardContent>
    </Card>
  )
}
