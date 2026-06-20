'use client'

import { PrintQueueETAPanel } from './PrintQueueETAPanel'
import { DailyDigestPanel } from './DailyDigestPanel'
import { AnalyticsDashboardPanel } from './AnalyticsDashboardPanel'
import { Card, CardContent } from '@/components/ui/card'
import { Zap } from 'lucide-react'

export function Phase2Dashboard({ role = 'admin' }: { role?: string }) {
  return (
    <div className="p-3 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
          <Zap className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Phase 2 AI Features</h1>
          <p className="text-sm text-slate-500">
            2.3 Print Queue ETA Prediction • 2.4 Daily Inventory Digest • 2.5 Analytics Dashboard
          </p>
        </div>
      </div>

      {/* Phase 2.3: DRM Queue ETA Prediction */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0EA5E9] text-white text-xs font-bold">
            2.3
          </span>
          <h2 className="text-lg font-semibold text-[#0F172A]">DRM Queue ETA Prediction</h2>
          <span className="text-xs text-slate-500">AI-powered print time estimator</span>
        </div>
        <PrintQueueETAPanel />
      </div>

      {/* Phase 2.4: Daily Inventory Digest */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold">
            2.4
          </span>
          <h2 className="text-lg font-semibold text-[#0F172A]">Daily Inventory Digest</h2>
          <span className="text-xs text-slate-500">Scheduled alerts & recommendations</span>
        </div>
        <DailyDigestPanel />
      </div>

      {/* Phase 2.5: Analytics Dashboard */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold">
            2.5
          </span>
          <h2 className="text-lg font-semibold text-[#0F172A]">Analytics Dashboard</h2>
          <span className="text-xs text-slate-500">KPI narratives & trend forecasting</span>
        </div>
        <AnalyticsDashboardPanel />
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-none text-white">
        <CardContent className="p-6">
          <h3 className="text-sm font-bold mb-3">Phase 2 Completion Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-300 mb-1">✅ Phase 2.1</p>
              <p className="text-sm font-semibold">Emergency Triage UI</p>
              <p className="text-[10px] text-slate-400">Live on Emergency Response page</p>
            </div>
            <div>
              <p className="text-xs text-slate-300 mb-1">✅ Phase 2.2</p>
              <p className="text-sm font-semibold">AI Risk Scoring</p>
              <p className="text-[10px] text-slate-400">Integrated in Digital Inventory</p>
            </div>
            <div>
              <p className="text-xs text-slate-300 mb-1">✅ Phase 2.3-2.5</p>
              <p className="text-sm font-semibold">ETA • Digest • Analytics</p>
              <p className="text-[10px] text-slate-400">All endpoints & components ready</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
