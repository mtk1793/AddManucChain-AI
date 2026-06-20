'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, TrendingUp, AlertTriangle, RefreshCw, Zap } from 'lucide-react'

interface RiskScore {
  partName: string
  riskScore: number
  leadTimeDays: number
  currentStock: number
  minStock: number
}

export function AIRiskAnalysisPanel() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [riskScores, setRiskScores] = useState<RiskScore[]>([])
  const [aiInsight, setAiInsight] = useState<string | null>(null)
  const [threshold, setThreshold] = useState(60)

  const handleRefreshRisks = async () => {
    setLoading(true)
    setError(null)
    setAiInsight(null)

    try {
      // Call the AI chat endpoint with get_risk_scores tool
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: `Analyze inventory risk scores to identify parts at highest risk of stockout or failure. Use threshold of ${threshold}.`,
          tools: [
            {
              name: 'get_risk_scores',
              args: {
                threshold: threshold,
                limit: 5,
              }
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      // Parse the AI response to extract risk scores
      if (data.result) {
        const insight = data.result
        setAiInsight(insight)
        
        // Extract risk scores from the response text
        // The response format is: "Top at-risk parts (threshold X):\nPart Name (ID: X) | Risk: Y/100 | Lead Time: Zd | Stock: A/B\n..."
        const lines = insight.toLowerCase().split('\n').slice(1) // Skip header
        const parsed: RiskScore[] = lines
          .filter(line => line.includes('|') && line.includes('risk:'))
          .map(line => {
            const parts = line.split('|')
            const nameMatch = parts[0]?.match(/^(.+?)\s*\(id:/) ?? []
            const riskMatch = parts[1]?.match(/risk:\s*(\d+)/) ?? []
            const leadMatch = parts[2]?.match(/lead time:\s*(\d+)d/) ?? []
            const stockMatch = parts[3]?.match(/stock:\s*(\d+)\/(\d+)/) ?? []

            return {
              partName: nameMatch[1]?.trim() || parts[0]?.trim() || 'Unknown',
              riskScore: parseInt(riskMatch[1] || '0'),
              leadTimeDays: parseInt(leadMatch[1] || '0'),
              currentStock: parseInt(stockMatch[1] || '0'),
              minStock: parseInt(stockMatch[2] || '0'),
            }
          })

        setRiskScores(parsed)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch risk scores')
    } finally {
      setLoading(false)
    }
  }

  const getRiskLevelColor = (score: number) => {
    if (score >= 70) return 'bg-red-100 text-red-700'
    if (score >= 50) return 'bg-orange-100 text-orange-700'
    if (score >= 30) return 'bg-amber-100 text-amber-700'
    return 'bg-emerald-100 text-emerald-700'
  }

  const getRiskLevelLabel = (score: number) => {
    if (score >= 70) return 'CRITICAL'
    if (score >= 50) return 'HIGH'
    if (score >= 30) return 'MEDIUM'
    return 'LOW'
  }

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            AI-Powered Risk Scoring
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-slate-500 font-medium">Risk Threshold:</label>
              <select
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                disabled={loading}
                className="text-xs px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value={30}>Low (≥30)</option>
                <option value={50}>Medium (≥50)</option>
                <option value={60}>High (≥60)</option>
                <option value={70}>Critical (≥70)</option>
              </select>
            </div>
            <Button
              onClick={handleRefreshRisks}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-8 px-3 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Analyzing...' : 'Refresh Scores'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {aiInsight && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs font-semibold text-purple-800 flex items-center gap-1 mb-2">
              <Zap className="w-3 h-3" /> AI Insight
            </p>
            <p className="text-xs text-purple-700 leading-relaxed whitespace-pre-line">{aiInsight}</p>
          </div>
        )}

        {riskScores.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Top At-Risk Parts</p>
            <div className="space-y-2">
              {riskScores.map((score, idx) => {
                const isStockLow = score.currentStock < score.minStock
                return (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-medium text-[#0F172A] truncate">{score.partName}</p>
                        <Badge className={`text-[10px] flex-shrink-0 ${getRiskLevelColor(score.riskScore)}`}>
                          {score.riskScore}/100 {getRiskLevelLabel(score.riskScore)}
                        </Badge>
                      </div>
                      <div className="flex gap-3 text-[10px] text-slate-500">
                        <span>Lead: {score.leadTimeDays}d</span>
                        <span className={isStockLow ? 'text-red-600 font-semibold' : ''}>
                          Stock: {score.currentStock}/{score.minStock}
                          {isStockLow && ' ⚠️'}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden mt-1.5">
                        <div
                          className={`h-full rounded-full ${
                            score.riskScore >= 70 ? 'bg-red-500' :
                            score.riskScore >= 50 ? 'bg-orange-400' :
                            score.riskScore >= 30 ? 'bg-amber-400' :
                            'bg-emerald-400'
                          }`}
                          style={{ width: `${score.riskScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {!aiInsight && !loading && riskScores.length === 0 && (
          <div className="py-8 text-center text-slate-400">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">Click "Refresh Scores" to fetch AI analysis of part risks</p>
            <p className="text-xs mt-1 text-slate-400">AI will identify parts with highest downtime risk × demand × material availability</p>
          </div>
        )}

        {loading && (
          <div className="py-8 text-center">
            <div className="inline-block">
              <div className="animate-spin">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-3">AI is analyzing inventory risk...</p>
            <p className="text-xs text-slate-400 mt-1">This may take 5-10 seconds</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
