'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Zap, TrendingDown, AlertCircle, RefreshCw } from 'lucide-react'

interface ETAEstimate {
  partName: string
  material: string
  complexity: string
  centerLoad: string
  estimatedMins: number
  confidence: number
  breakdown: Record<string, number>
  completionTime: string
}

export function PrintQueueETAPanel() {
  const [loading, setLoading] = useState(false)
  const [estimates, setEstimates] = useState<ETAEstimate[]>([])
  const [error, setError] = useState<string | null>(null)

  // Sample print queue orders to estimate
  const sampleOrders = [
    { partName: 'Pump Impeller Type 316L', material: '316L Stainless', complexity: 'high', centerLoad: 'medium' },
    { partName: 'Valve Seat DN80', material: 'Cast iron', complexity: 'medium', centerLoad: 'low' },
    { partName: 'Bearing Housing', material: 'Aluminum 6061', complexity: 'low', centerLoad: 'high' },
  ]

  const handleEstimate = async () => {
    setLoading(true)
    setError(null)
    setEstimates([])

    try {
      const estimates: ETAEstimate[] = []

      for (const order of sampleOrders) {
        const response = await fetch('/api/drm/estimate-time', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order),
        })

        if (!response.ok) throw new Error(`Failed to estimate for ${order.partName}`)
        estimates.push(await response.json())
      }

      setEstimates(estimates)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to estimate print times')
    } finally {
      setLoading(false)
    }
  }

  const getTotalQueueTime = () => {
    return estimates.reduce((sum, e) => sum + e.estimatedMins, 0)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-emerald-100 text-emerald-700'
    if (confidence >= 75) return 'bg-blue-100 text-blue-700'
    if (confidence >= 60) return 'bg-amber-100 text-amber-700'
    return 'bg-red-100 text-red-700'
  }

  const formatTime = (mins: number) => {
    if (mins < 60) return `${mins}m`
    const hours = Math.floor(mins / 60)
    const minutes = mins % 60
    return `${hours}h ${minutes}m`
  }

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0EA5E9]" />
            DRM Queue ETA Predictor
          </CardTitle>
          <Button
            onClick={handleEstimate}
            disabled={loading}
            className="bg-[#0EA5E9] hover:bg-[#0d9cd9] text-white text-xs h-8 px-3 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Estimating...' : 'Estimate Queue Times'}
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

        {estimates.length > 0 && (
          <>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-gradient-to-br from-[#0EA5E9]/10 to-[#14B8A6]/10 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-1">Total Queue Time</p>
                <p className="text-xl font-bold text-[#0EA5E9]">{formatTime(getTotalQueueTime())}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-1">Orders in Queue</p>
                <p className="text-xl font-bold text-emerald-700">{estimates.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-1">Avg Confidence</p>
                <p className="text-xl font-bold text-purple-700">
                  {Math.round(estimates.reduce((sum, e) => sum + e.confidence, 0) / estimates.length)}%
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Queue Orders</p>
              {estimates.map((est, idx) => {
                const completionDate = new Date(est.completionTime)
                return (
                  <div key={idx} className="p-3 border border-slate-100 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-[#0F172A]">{est.partName}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span>{est.material}</span>
                          <span>•</span>
                          <span className="capitalize">{est.complexity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`text-xs mb-1 block ${getConfidenceColor(est.confidence)}`}>
                          {est.confidence}% confidence
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                      <div>
                        <span className="text-slate-500">Est. Time</span>
                        <p className="font-semibold text-[#0EA5E9]">{formatTime(est.estimatedMins)}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Print Time</span>
                        <p className="font-semibold">{formatTime(est.breakdown.printMins)}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Queue Wait</span>
                        <p className="font-semibold text-amber-600">{formatTime(est.breakdown.queueWaitMins)}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Ready At</span>
                        <p className="font-semibold">{completionDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>

                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#14B8A6] rounded-full" style={{ width: `${Math.min(est.confidence, 100)}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-800 flex items-center gap-1 mb-1">
                <Zap className="w-3 h-3" /> ETA Model Details
              </p>
              <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                <li>Estimates trained on 8 historical print jobs with similar materials & complexity</li>
                <li>Factors: material processing time, part complexity, center queue load</li>
                <li>Higher confidence (90%+) when similar jobs found in history</li>
              </ul>
            </div>
          </>
        )}

        {!loading && estimates.length === 0 && !error && (
          <div className="py-8 text-center text-slate-400">
            <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">Click "Estimate Queue Times" to predict print ETAs</p>
            <p className="text-xs mt-1 text-slate-400">AI learns from historical jobs to forecast completion</p>
          </div>
        )}

        {loading && (
          <div className="py-8 text-center">
            <div className="inline-block">
              <div className="animate-spin">
                <Clock className="w-8 h-8 text-[#0EA5E9]" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-3">Estimating print queue times...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
