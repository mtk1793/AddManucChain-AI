'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, RefreshCw, Heart, AlertCircle, CheckCircle2, Calendar } from 'lucide-react'

interface DigestData {
  summaryNarrative: string
  items: Array<{
    type: string
    title: string
    description: string
    priority: string
    timestamp: string
  }>
  topMetrics: Record<string, string | number>
  recommendations: string[]
  generatedAt: string
}

export function DailyDigestPanel() {
  const [loading, setLoading] = useState(false)
  const [digest, setDigest] = useState<DigestData | null>(null)
  const [email, setEmail] = useState('admin@addmanuchain.com')
  const [error, setError] = useState<string | null>(null)

  const handleGenerateDigest = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/digest/generate', {
        method: 'GET',
      })

      if (!response.ok) throw new Error('Failed to generate digest')
      const data = await response.json()
      setDigest(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch digest')
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleEmail = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/digest/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'schedule_email', email }),
      })

      if (!response.ok) throw new Error('Failed to schedule email')
      const data = await response.json()
      setDigest(data.digest)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule email')
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-700'
      case 'high':
        return 'bg-orange-100 text-orange-700'
      case 'medium':
        return 'bg-amber-100 text-amber-700'
      default:
        return 'bg-emerald-100 text-emerald-700'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'critical_part':
        return <AlertCircle className="w-4 h-4" />
      case 'low_stock':
        return <AlertCircle className="w-4 h-4" />
      case 'completed_order':
        return <CheckCircle2 className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-600" />
            Daily Inventory Digest
          </CardTitle>
          <Button
            onClick={handleGenerateDigest}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 px-3 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Generating...' : 'Generate Today\'s Digest'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {digest && (
          <>
            {/* Narrative */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-xs font-mono text-slate-700 whitespace-pre-line leading-relaxed">
                {digest.summaryNarrative}
              </p>
            </div>

            {/* Top Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(digest.topMetrics).map(([key, value]) => (
                <div key={key} className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-[10px] text-slate-500 font-medium uppercase mb-1">{key.replace(/_/g, ' ')}</p>
                  <p className="text-sm font-bold text-[#0F172A]">{value}</p>
                </div>
              ))}
            </div>

            {/* Alert Items */}
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">Today's Alerts & Updates</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {digest.items.map((item, idx) => (
                  <div key={idx} className="p-3 border border-slate-100 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-start gap-2">
                      <div className={`p-1.5 rounded flex-shrink-0 ${getPriorityColor(item.priority)}`}>
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-xs font-semibold text-[#0F172A]">{item.title}</p>
                          <Badge className={`text-[9px] flex-shrink-0 ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">Recommended Actions</p>
              <ul className="space-y-1.5">
                {digest.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex gap-2">
                    <span className="text-emerald-600 font-bold flex-shrink-0">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Email Scheduling */}
            <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
              <p className="text-xs font-semibold text-emerald-800 mb-2 flex items-center gap-1">
                <Mail className="w-3 h-3" /> Schedule Daily Email
              </p>
              <div className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="email@company.com"
                />
                <Button
                  onClick={handleScheduleEmail}
                  disabled={loading}
                  className="w-full text-xs h-7 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Schedule Daily at 08:00 UTC
                </Button>
              </div>
            </div>
          </>
        )}

        {!loading && !digest && !error && (
          <div className="py-8 text-center text-slate-400">
            <Mail className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">Click "Generate Today's Digest" to see daily summary</p>
            <p className="text-xs mt-1 text-slate-400">Includes alerts, metrics, and AI recommendations</p>
          </div>
        )}

        {loading && (
          <div className="py-8 text-center">
            <div className="inline-block">
              <div className="animate-spin">
                <Mail className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-3">Generating digest...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
