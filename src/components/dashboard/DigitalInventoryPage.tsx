'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Sparkles,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  KeyRound,
  Zap,
  Package,
  Building2,
  Award,
  ArrowRight,
  MapPin,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { toast } from 'sonner'
import { blueprints, orders, printCenters, materials } from '@/lib/static-data'
import { AIRiskAnalysisPanel } from './AIRiskAnalysisPanel'

// ─── Derived risk scoring ────────────────────────────────────────────────────
function getRiskScore(bp: typeof blueprints[0]) {
  // Simple risk model: high printCount + cert restricted → higher risk
  const printScore = Math.min(bp.printCount / 200, 1) // normalize to 0–1
  const certRisk = bp.certification !== 'Self-certified' ? 0.3 : 0
  const statusRisk = bp.status === 'pending_review' ? 0.4 : 0
  return Math.round((printScore * 0.4 + certRisk + statusRisk + Math.random() * 0.2) * 100)
}

function getRiskLevel(score: number): 'critical' | 'high' | 'medium' | 'low' {
  if (score >= 70) return 'critical'
  if (score >= 50) return 'high'
  if (score >= 30) return 'medium'
  return 'low'
}

const riskColors = {
  critical: { badge: 'bg-red-100 text-red-700', dot: 'bg-red-500', bar: 'bg-red-500', text: 'text-red-700' },
  high: { badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-400', bar: 'bg-orange-400', text: 'text-orange-700' },
  medium: { badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400', bar: 'bg-amber-400', text: 'text-amber-700' },
  low: { badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400', bar: 'bg-emerald-400', text: 'text-emerald-700' },
}

// ─── Blueprint risk data ─────────────────────────────────────────────────────
const blueprintRiskData = blueprints
  .filter(bp => bp.status !== 'inactive')
  .map(bp => {
    const score = getRiskScore(bp)
    const level = getRiskLevel(score)
    const relatedOrders = orders.filter(o => o.blueprintId === bp.id)
    const latestOrder = relatedOrders[relatedOrders.length - 1]
    const oemApproved = latestOrder?.oemApproval.approved ?? false
    const certApproved = latestOrder?.certApproval.approved ?? false
    const mat = materials.find(m => m.name === bp.material)
    const matStatus = mat?.status ?? 'unknown'

    let action = 'Monitor'
    if (level === 'critical') action = 'Pre-print now'
    else if (level === 'high') action = 'Queue order'
    else if (level === 'medium') action = 'Review stock'

    return { ...bp, score, level, oemApproved, certApproved, matStatus, latestOrder, action }
  })
  .sort((a, b) => b.score - a.score)

// ─── Canada SVG Map ──────────────────────────────────────────────────────────
const CANADA_CENTERS = [
  // Approximate SVG positions for each city within a simplified Canada outline
  { id: 'pc-1', name: 'Atlantic XL', city: 'Halifax, NS', x: 635, y: 230, status: 'online', capacity: 87, cert: "Lloyd's Register" },
  { id: 'pc-2', name: 'DNV Calgary', city: 'Calgary, AB', x: 290, y: 215, status: 'online', capacity: 92, cert: 'DNV GL' },
  { id: 'pc-3', name: 'LR Montreal', city: 'Montreal, QC', x: 590, y: 220, status: 'busy', capacity: 98, cert: "Lloyd's Register" },
  { id: 'pc-4', name: "St. John's AM", city: "St. John's, NL", x: 680, y: 210, status: 'offline', capacity: 0, cert: 'DNV GL' },
  { id: 'pc-5', name: 'Victoria Marine', city: 'Victoria, BC', x: 165, y: 235, status: 'online', capacity: 65, cert: 'CSA' },
]

type CenterPin = typeof CANADA_CENTERS[0]

function CanadaNetworkMap({ onSelectCenter }: { onSelectCenter: (c: CenterPin) => void }) {
  const [hovered, setHovered] = useState<string | null>(null)

  const pinColor = (center: CenterPin) =>
    center.status === 'online' ? '#10B981' :
      center.status === 'busy' ? '#F59E0B' : '#94A3B8'

  return (
    <div className="relative w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden" style={{ height: 320 }}>
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      {/* Canada outline SVG */}
      <svg viewBox="100 150 650 220" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Simplified Canada coastline path */}
        <path
          d="M 130 195 L 160 180 L 200 175 L 250 180 L 290 170 L 340 165 L 390 158 L 430 155 L 470 158 L 510 165 L 540 175 L 570 178 L 600 180 L 630 185 L 660 190 L 680 195 L 690 210 L 685 225 L 670 240 L 650 250 L 630 255 L 600 260 L 570 258 L 540 255 L 510 250 L 480 248 L 450 250 L 420 248 L 390 245 L 360 250 L 330 255 L 300 258 L 270 255 L 240 250 L 210 248 L 180 252 L 155 258 L 140 252 L 130 240 L 125 225 Z"
          fill="rgba(148, 163, 184, 0.08)"
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="1.5"
        />
        {/* Province dividers (simplified) */}
        <line x1="380" y1="165" x2="375" y2="255" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
        <line x1="475" y1="158" x2="470" y2="250" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
        <line x1="545" y1="175" x2="540" y2="256" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
        <line x1="620" y1="183" x2="615" y2="258" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />

        {/* Connection lines between centers */}
        {CANADA_CENTERS.filter(c => c.status !== 'offline').map((c, i) =>
          CANADA_CENTERS.filter(cc => cc.status !== 'offline' && cc.id !== c.id).map((cc, j) =>
            i < j ? (
              <line key={`${c.id}-${cc.id}`} x1={c.x} y1={c.y} x2={cc.x} y2={cc.y}
                stroke="rgba(14, 165, 233, 0.12)" strokeWidth="1" strokeDasharray="4 4" />
            ) : null
          )
        )}

        {/* Center pins */}
        {CANADA_CENTERS.map(center => {
          const isHovered = hovered === center.id
          const color = pinColor(center)
          return (
            <g key={center.id}
              className="cursor-pointer"
              onClick={() => onSelectCenter(center)}
              onMouseEnter={() => setHovered(center.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Pulse ring for online centers */}
              {center.status === 'online' && (
                <circle cx={center.x} cy={center.y} r={isHovered ? 18 : 14}
                  fill="none" stroke={color} strokeWidth="1" opacity="0.3"
                  style={{ transition: 'r 0.2s' }}
                />
              )}
              {/* Capacity arc */}
              {center.status !== 'offline' && (
                <circle cx={center.x} cy={center.y} r="10"
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeDasharray={`${(center.capacity / 100) * 62.8} 62.8`}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${center.x} ${center.y})`}
                  opacity="0.6"
                />
              )}
              {/* Pin dot */}
              <circle cx={center.x} cy={center.y} r={isHovered ? 7 : 5.5}
                fill={color}
                style={{ transition: 'r 0.15s' }}
                filter={isHovered ? 'url(#glow)' : undefined}
              />
              {/* Label */}
              <text x={center.x} y={center.y + 22} textAnchor="middle"
                fontSize="8" fill="rgba(255,255,255,0.75)" fontWeight="600">
                {center.name.split(' ')[0]}
              </text>
              {isHovered && (
                <text x={center.x} y={center.y + 32} textAnchor="middle"
                  fontSize="7" fill="rgba(255,255,255,0.5)">
                  {center.capacity}% cap
                </text>
              )}
            </g>
          )
        })}

        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 right-4 flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-slate-400">Online</span></div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-slate-400">Busy</span></div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-500" /><span className="text-slate-400">Offline</span></div>
      </div>

      {/* Title overlay */}
      <div className="absolute top-3 left-4">
        <p className="text-xs text-slate-400 font-medium">🇨🇦 Certified Print Network</p>
        <p className="text-lg font-bold text-white mt-0.5">
          {CANADA_CENTERS.filter(c => c.status === 'online').length} Online ·&nbsp;
          <span className="text-amber-400">{CANADA_CENTERS.filter(c => c.status === 'busy').length} Busy</span> ·&nbsp;
          <span className="text-slate-500">{CANADA_CENTERS.filter(c => c.status === 'offline').length} Offline</span>
        </p>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function DigitalInventoryPage({ role = 'admin' }: { role?: string }) {
  const [selectedBp, setSelectedBp] = useState<typeof blueprintRiskData[0] | null>(null)
  const [orderDialogOpen, setOrderDialogOpen] = useState(false)
  const [selectedCenter, setSelectedCenter] = useState<CenterPin | null>(null)
  const [centerDialogOpen, setCenterDialogOpen] = useState(false)

  // DRM status summary from live orders
  const drmStats = {
    locked: orders.filter(o => !o.oemApproval.approved && !o.certApproval.approved && !['delivered'].includes(o.status)).length,
    partiallyApproved: orders.filter(o => (o.oemApproval.approved || o.certApproval.approved) && !(o.oemApproval.approved && o.certApproval.approved) && !['delivered'].includes(o.status)).length,
    readyToPrint: orders.filter(o => o.oemApproval.approved && o.certApproval.approved && !o.printAuthToken && !['printing', 'quality_check', 'shipped', 'delivered'].includes(o.status)).length,
    printing: orders.filter(o => o.status === 'printing').length,
    tokensIssued: orders.filter(o => o.printAuthToken).length,
  }

  const criticalBps = blueprintRiskData.filter(b => b.level === 'critical' || b.level === 'high').length
  const matCritical = materials.filter(m => m.status === 'critical' || m.status === 'low').length

  const handleQuickOrder = (bp: typeof blueprintRiskData[0]) => {
    setSelectedBp(bp)
    setOrderDialogOpen(true)
  }

  const handleConfirmOrder = () => {
    if (!selectedBp) return
    toast.success(`Order queued for ${selectedBp.name}`, {
      description: 'Entering DRM approval pipeline — OEM & Cert Authority notified.',
      duration: 5000,
    })
    setOrderDialogOpen(false)
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">

      {/* ── Top Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-red-600 to-red-700 border-none text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200 text-xs">High-Risk Parts</p>
                <p className="text-3xl font-bold">{criticalBps}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-300" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-slate-700 to-slate-800 border-none text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-xs">DRM Locked</p>
                <p className="text-3xl font-bold">{drmStats.locked}</p>
              </div>
              <Lock className="w-8 h-8 text-slate-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 border-none text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-xs">Ready to Print</p>
                <p className="text-3xl font-bold">{drmStats.readyToPrint}</p>
              </div>
              <Zap className="w-8 h-8 text-emerald-300" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#0EA5E9] to-[#14B8A6] border-none text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sky-200 text-xs">Now Printing</p>
                <p className="text-3xl font-bold">{drmStats.printing}</p>
              </div>
              <Activity className="w-8 h-8 text-sky-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 border-none text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-xs">Material Alerts</p>
                <p className="text-3xl font-bold">{matCritical}</p>
              </div>
              <Package className="w-8 h-8 text-amber-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Network Map + DRM Status ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Canada Map */}
        <div className="xl:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-[#0EA5E9]" />
            <h2 className="font-bold text-[#0F172A]">Certified Print Network</h2>
            <p className="text-xs text-slate-400 ml-1">Click a pin to see center details</p>
          </div>
          <CanadaNetworkMap onSelectCenter={(c) => { setSelectedCenter(c); setCenterDialogOpen(true) }} />
        </div>

        {/* DRM Pipeline Funnel */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-[#0EA5E9]" />
            <h2 className="font-bold text-[#0F172A]">DRM Pipeline Status</h2>
          </div>
          {[
            { label: 'Orders Awaiting Approval', value: drmStats.locked, color: 'bg-slate-200', textColor: 'text-slate-700', icon: Lock, tip: 'No OEM or Cert approval yet' },
            { label: 'Partially Approved', value: drmStats.partiallyApproved, color: 'bg-amber-400', textColor: 'text-amber-700', icon: Clock, tip: 'One signature obtained' },
            { label: 'Both Approved — Ready', value: drmStats.readyToPrint, color: 'bg-emerald-500', textColor: 'text-emerald-700', icon: Unlock, tip: 'Awaiting Secure Print token' },
            { label: 'Tokens Issued', value: drmStats.tokensIssued, color: 'bg-[#0EA5E9]', textColor: 'text-[#0EA5E9]', icon: KeyRound, tip: 'Print token issued & logging' },
            { label: 'Active Print Jobs', value: drmStats.printing, color: 'bg-indigo-500', textColor: 'text-indigo-700', icon: Activity, tip: 'Currently on printer bed' },
          ].map((item, idx, arr) => {
            const Icon = item.icon
            const maxVal = arr[0].value || 1
            return (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${item.textColor}`} />
                    <span className="text-slate-600">{item.label}</span>
                  </div>
                  <span className={`font-bold text-base ${item.textColor}`}>{item.value}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                    style={{ width: `${Math.max((item.value / Math.max(maxVal, 1)) * 100, item.value > 0 ? 8 : 0)}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">{item.tip}</p>
              </div>
            )
          })}

          {/* AI recommendation pill */}
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <p className="text-xs font-bold text-purple-800">AI Insight</p>
            </div>
            <p className="text-xs text-purple-700">
              {drmStats.readyToPrint > 0
                ? `${drmStats.readyToPrint} order${drmStats.readyToPrint > 1 ? 's' : ''} cleared by all approvers. Issue Secure Print tokens to reduce queue lag.`
                : drmStats.locked > 0
                  ? `${drmStats.locked} pending orders blocking production. Submit to Print Queue for OEM sign-off.`
                  : 'Pipeline healthy. All approved orders are printing or delivered.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* ── AI-Powered Risk Scoring Analysis ── */}
      <AIRiskAnalysisPanel />

      {/* ── AI Risk Queue ── */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0EA5E9]" />
              AI-Ranked Blueprint Risk Queue
            </CardTitle>
            <Badge className="bg-[#0EA5E9]/10 text-[#0EA5E9] text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Ranked by downtime risk × demand × material stock
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-2.5">Risk</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-2.5">Blueprint</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-2.5">Material</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-2.5">Stock</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-2.5">OEM / Cert</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-2.5">Prints</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-2.5">Action</th>
                </tr>
              </thead>
              <tbody>
                {blueprintRiskData.map((bp, idx) => {
                  const risk = riskColors[bp.level]
                  const matColor =
                    bp.matStatus === 'critical' ? 'bg-red-100 text-red-700' :
                      bp.matStatus === 'low' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'

                  return (
                    <tr key={bp.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      {/* Risk score */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 text-right">
                            <span className={`text-sm font-bold ${risk.text}`}>{bp.score}</span>
                          </div>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${risk.bar}`} style={{ width: `${bp.score}%` }} />
                          </div>
                          <Badge className={`text-[10px] ${risk.badge}`}>{bp.level}</Badge>
                        </div>
                      </td>
                      {/* Blueprint */}
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#0F172A] text-sm">{bp.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{bp.blueprintId} · {bp.category}</p>
                      </td>
                      {/* Material */}
                      <td className="px-4 py-3">
                        <p className="text-xs text-slate-600">{bp.material}</p>
                      </td>
                      {/* Stock */}
                      <td className="px-4 py-3">
                        <Badge className={`text-[10px] ${matColor}`}>
                          {bp.matStatus === 'unknown' ? 'N/A' : bp.matStatus}
                        </Badge>
                      </td>
                      {/* DRM Status */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <div title="OEM" className={`flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full ${bp.oemApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                            }`}>
                            <Building2 className="w-2.5 h-2.5" />
                            {bp.oemApproved ? '✓' : '⏳'}
                          </div>
                          <div title="Cert" className={`flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full ${bp.certApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                            }`}>
                            <Award className="w-2.5 h-2.5" />
                            {bp.certApproved ? '✓' : '⏳'}
                          </div>
                        </div>
                      </td>
                      {/* Print count */}
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-[#0F172A]">{bp.printCount}</span>
                      </td>
                      {/* Action */}
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          onClick={() => handleQuickOrder(bp)}
                          className={`text-xs h-7 px-3 ${bp.level === 'critical' ? 'bg-red-600 hover:bg-red-700 text-white' :
                              bp.level === 'high' ? 'bg-orange-500 hover:bg-orange-600 text-white' :
                                bp.level === 'medium' ? 'bg-amber-500 hover:bg-amber-600 text-white' :
                                  'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                        >
                          {bp.action}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Material Low-Stock Alerts ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-500" />
              Material Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {materials.filter(m => m.status !== 'adequate').map(mat => {
              const pct = Math.round((mat.totalStock / mat.maxStock) * 100)
              const color = mat.status === 'critical' ? 'bg-red-500' : 'bg-amber-400'
              const badgeColor = mat.status === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
              return (
                <div key={mat.id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-[#0F172A] truncate">{mat.name}</p>
                      <Badge className={`text-[10px] ${badgeColor} ml-2 flex-shrink-0`}>{mat.status}</Badge>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{mat.totalStock}{mat.unit} · reorder at {mat.reorderPoint}{mat.unit} · {mat.leadTime}d lead</p>
                  </div>
                </div>
              )
            })}
            {materials.filter(m => m.status !== 'adequate').length === 0 && (
              <div className="py-6 text-center text-slate-400 text-sm">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                All materials at adequate levels
              </div>
            )}
          </CardContent>
        </Card>

        {/* Predict → Approve → Print */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-none text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0EA5E9]" />
              AI Inventory Workflow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { step: '01', label: 'Predict', desc: 'AI scores each blueprint by downtime risk, demand signals, and material availability', icon: Sparkles, color: 'text-purple-400 bg-purple-500/20' },
              { step: '02', label: 'Approve', desc: 'OEM grants IP license + Cert Authority verifies print center — all in the Print Queue', icon: Shield, color: 'text-[#0EA5E9] bg-[#0EA5E9]/20' },
              { step: '03', label: 'Secure Print', desc: 'One-time encrypted token streams G-code to printer. Token expires after job, logged to audit chain', icon: KeyRound, color: 'text-emerald-400 bg-emerald-500/20' },
              { step: '04', label: 'Verify & Close', desc: 'QA sign-off syncs back to digital inventory. Blueprint risk score recalculates automatically', icon: CheckCircle2, color: 'text-amber-400 bg-amber-500/20' },
            ].map((item, idx, arr) => {
              const Icon = item.icon
              return (
                <div key={item.step} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono text-slate-500">{item.step}</span>
                      <span className="text-sm font-bold text-white">{item.label}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="absolute left-10 mt-8">
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* ── Quick Order Dialog ── */}
      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#0EA5E9]" />
              Quick Order — {selectedBp?.blueprintId}
            </DialogTitle>
            <DialogDescription>
              Pre-filled order will enter the DRM approval pipeline immediately.
            </DialogDescription>
          </DialogHeader>
          {selectedBp && (
            <div className="py-4 space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Part</span>
                  <span className="font-semibold text-[#0F172A]">{selectedBp.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Material</span>
                  <span className="font-medium">{selectedBp.material}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">OEM</span>
                  <span className="font-medium">{selectedBp.oem}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Certification Required</span>
                  <span className="font-medium">{selectedBp.certification}</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${selectedBp.level === 'critical' ? 'bg-red-50 text-red-800' :
                  selectedBp.level === 'high' ? 'bg-orange-50 text-orange-800' :
                    'bg-amber-50 text-amber-800'
                }`}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                Risk level: <strong className="ml-1">{selectedBp.level.toUpperCase()}</strong> · Priority order recommended
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl text-xs text-indigo-800">
                <p className="font-semibold mb-1">What happens next:</p>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3" />Order created with High priority</div>
                  <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3" />Routed to best available certified print center</div>
                  <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3" />OEM & Cert Authority notified for approval</div>
                  <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3" />Audit trail entry created</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmOrder} className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white">
              <Zap className="w-4 h-4 mr-2" />
              Submit to Pipeline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Print Center Detail Dialog ── */}
      <Dialog open={centerDialogOpen} onOpenChange={setCenterDialogOpen}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#0EA5E9]" />
              {selectedCenter?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedCenter && (
            <div className="py-3 space-y-3">
              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Location</span>
                  <span className="font-medium">{selectedCenter.city}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <Badge className={
                    selectedCenter.status === 'online' ? 'bg-emerald-100 text-emerald-700' :
                      selectedCenter.status === 'busy' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-500'
                  }>{selectedCenter.status}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Certification</span>
                  <span className="font-medium">{selectedCenter.cert}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-slate-500">Capacity</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${selectedCenter.capacity > 90 ? 'bg-red-500' : selectedCenter.capacity > 70 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                        style={{ width: `${selectedCenter.capacity}%` }}
                      />
                    </div>
                    <span className="font-bold text-[#0F172A] text-sm">{selectedCenter.capacity}%</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 text-center">
                {selectedCenter.status === 'offline' ? '⚠️ Center offline — not available for routing' :
                  selectedCenter.capacity > 90 ? '⚠️ Near capacity — expect longer queue times' :
                    '✓ Available for new print jobs'}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
