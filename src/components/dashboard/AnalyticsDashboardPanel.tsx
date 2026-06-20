'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, RefreshCw, BarChart3, AlertCircle } from 'lucide-react'

interface Metric {
  label: string
  value: string | number
  trend: 'up' | 'down' | 'stable'
  trendPercent: number
  narrative: string
}

interface AnalyticsData {
  metrics: Metric[]
  executiveSummary: string
  forecastTrendline: string
  topInsights: string[]
  generatedAt: string
}

export function AnalyticsDashboardPanel() {
  const [loading, setLoading] = useState(false)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null)

  const handleGenerateAnalytics = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/analytics/narratives', {
        method: 'GET',
      })

      if (!response.ok) throw new Error('Failed to generate analytics')
      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              AI Analytics Dashboard
            </CardTitle>
            <Button
              onClick={handleGenerateAnalytics}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-8 px-3 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Analyzing...' : 'Generate Analytics'}
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

          {analytics && (
            <>
              {/* Executive Summary */}
              <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
                <p className="text-xs font-mono text-slate-700 whitespace-pre-line leading-relaxed">
                  {analytics.executiveSummary}
                </p>
              </div>

              {/* Top KPIs Grid */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Key Performance Indicators</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {analytics.metrics.map((metric, idx) => {
                    const isExpanded = expandedMetric === metric.label
                    return (
                      <div
                        key={idx}
                        onClick={() => setExpandedMetric(isExpanded ? null : metric.label)}
                        className="p-3 border border-slate-100 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-xs font-semibold text-[#0F172A]">{metric.label}</p>
                          <div className="flex items-center gap-1">
                            {metric.trend === 'up' ? (
                              <TrendingUp className="w-3 h-3 text-emerald-600" />
                            ) : metric.trend === 'down' ? (
                              <TrendingDown className="w-3 h-3 text-red-600" />
                            ) : (
                              <TrendingUp className="w-3 h-3 text-slate-400 opacity-50" />
                            )}
                            <span
                              className={`text-xs font-bold ${
                                metric.trend === 'up'
                                  ? 'text-emerald-700'
                                  : metric.trend === 'down'
                                    ? 'text-red-700'
                                    : 'text-slate-500'
                              }`}
                            >
                              {metric.trendPercent > 0 ? '+' : ''}
                              {metric.trendPercent}%
                            </span>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-[#0F172A] mb-1">{metric.value}</p>
                        {isExpanded && (
                          <div className="mt-2 pt-2 border-t border-slate-200">
                            <p className="text-xs text-slate-600">{metric.narrative}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Forecast Trendline */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">30-Day Forecast & Trends</p>
                <p className="text-xs text-slate-700 font-mono whitespace-pre-line leading-relaxed">{analytics.forecastTrendline}</p>
              </div>

              {/* Top Insights */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">AI-Generated Insights</p>
                <div className="space-y-2">
                  {analytics.topInsights.map((insight, idx) => (
                    <div key={idx} className="p-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-purple-100 rounded-lg">
                      <p className="text-xs text-slate-700">
                        <span className="font-semibold text-purple-700">•</span> {insight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-2 border-t border-slate-200">
                <p className="text-[10px] text-slate-400">
                  Analytics generated: {new Date(analytics.generatedAt).toLocaleString()}
                </p>
              </div>
            </>
          )}

          {!loading && !analytics && !error && (
            <div className="py-8 text-center text-slate-400">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">Click "Generate Analytics" to see KPI narratives</p>
              <p className="text-xs mt-1 text-slate-400">AI analyzes trends, forecasts, and generates recommendations</p>
            </div>
          )}

          {loading && (
            <div className="py-8 text-center">
              <div className="inline-block">
                <div className="animate-spin">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-3">Analyzing metrics...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
