'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Printer, ShieldCheck, ShieldAlert, Zap, Clock, CheckCircle2,
  AlertTriangle, Play, Pause, Plus, Settings, Wrench, Package,
  BarChart3, ChevronDown, ChevronUp, Trash2, GripVertical, FlaskConical,
  TestTubeDiagonal, Download,
} from 'lucide-react'
import { toast } from 'sonner'

// ── Static printer data ───────────────────────────────────────────────────────

interface PrintJob {
  id: string
  partName: string
  orderId: string
  material: string
  qty: number
  estDuration: string
  scheduledAt: string | null
  status: 'printing' | 'queued' | 'paused' | 'done'
  pct: number
}

interface OnSitePrinter {
  id: string
  model: string
  location: string
  certified: boolean
  certBody: string | null
  certNumber: string | null
  status: 'online' | 'busy' | 'offline' | 'paused'
  tech: string
  printVolume: string
  materials: { name: string; stock: number; unit: string }[]
  completedJobs: number
  nextMaintenance: string
  lastService: string
  availableHours: string
  jobs: PrintJob[]
}

const INITIAL_PRINTERS: OnSitePrinter[] = [
  {
    id: 'OSP-01',
    model: 'Markforged X7',
    location: 'Engine Room — Deck 3',
    certified: true, certBody: 'DNV GL', certNumber: 'DNV-GL-2024-0041',
    status: 'busy',
    tech: 'FFF + Continuous Fiber',
    printVolume: '330 × 270 × 200 mm',
    completedJobs: 47,
    nextMaintenance: '2026-03-24',
    lastService: '2026-02-10',
    availableHours: '06:00 – 22:00',
    materials: [
      { name: 'Onyx FR',       stock: 68,  unit: '%' },
      { name: 'Carbon Fiber',  stock: 42,  unit: '%' },
      { name: 'Kevlar',        stock: 15,  unit: '%' },
    ],
    jobs: [
      { id: 'J-001', partName: 'Bearing Cap Std',     orderId: 'ORD-7738', material: 'Onyx FR',      qty: 2, estDuration: '3h 20m', scheduledAt: null,          status: 'printing', pct: 62 },
      { id: 'J-002', partName: 'Pump Bracket Mk2',    orderId: 'ORD-7745', material: 'Carbon Fiber', qty: 1, estDuration: '5h 10m', scheduledAt: '14:30 today', status: 'queued',   pct: 0  },
      { id: 'J-003', partName: 'Valve Seat DN40',     orderId: 'ORD-7752', material: 'Onyx FR',      qty: 4, estDuration: '7h 00m', scheduledAt: '20:00 today', status: 'queued',   pct: 0  },
    ],
  },
  {
    id: 'OSP-02',
    model: 'HP Jet Fusion 580',
    location: 'Workshop Bay A',
    certified: true, certBody: 'DNV GL', certNumber: 'DNV-GL-2023-0089',
    status: 'online',
    tech: 'Multi Jet Fusion',
    printVolume: '332 × 190 × 248 mm',
    completedJobs: 112,
    nextMaintenance: '2026-04-01',
    lastService: '2026-03-01',
    availableHours: '00:00 – 23:59',
    materials: [
      { name: 'HP 3D HR PA12',    stock: 80, unit: '%' },
      { name: 'HP 3D HR PA12 GB', stock: 55, unit: '%' },
      { name: 'HP 3D HR TPA',     stock: 30, unit: '%' },
    ],
    jobs: [
      { id: 'J-004', partName: 'Impeller Housing',    orderId: 'ORD-7741', material: 'HP 3D HR PA12', qty: 1, estDuration: '8h 30m', scheduledAt: '09:00 Mar 18', status: 'queued', pct: 0 },
    ],
  },
  {
    id: 'OSP-03',
    model: 'Ultimaker S5',
    location: 'Maintenance Storage',
    certified: false, certBody: null, certNumber: null,
    status: 'online',
    tech: 'FFF (Dual Extrusion)',
    printVolume: '330 × 240 × 300 mm',
    completedJobs: 23,
    nextMaintenance: '2026-03-20',
    lastService: '2026-01-15',
    availableHours: '08:00 – 18:00',
    materials: [
      { name: 'Nylon',   stock: 90, unit: '%' },
      { name: 'TPU 95A', stock: 70, unit: '%' },
      { name: 'PETG',    stock: 45, unit: '%' },
      { name: 'ABS',     stock: 20, unit: '%' },
    ],
    jobs: [],
  },
  {
    id: 'OSP-04',
    model: 'Formlabs Form 3',
    location: 'Lab / QC Station',
    certified: true, certBody: 'Bureau Veritas', certNumber: 'BV-AM-2024-0012',
    status: 'offline',
    tech: 'SLA (LFS)',
    printVolume: '145 × 145 × 185 mm',
    completedJobs: 8,
    nextMaintenance: '2026-03-18',
    lastService: '2025-12-01',
    availableHours: '09:00 – 17:00',
    materials: [
      { name: 'Tough 1500',  stock: 60, unit: '%' },
      { name: 'Grey Pro',    stock: 35, unit: '%' },
      { name: 'Flexible 80A',stock: 10, unit: '%' },
    ],
    jobs: [],
  },
]

const STATUS_COLOR: Record<string, string> = {
  online:  '#10b981',
  busy:    '#0ea5e9',
  paused:  '#f59e0b',
  offline: '#94a3b8',
}
const STATUS_LABEL: Record<string, string> = {
  online: 'Online', busy: 'Printing', paused: 'Paused', offline: 'Offline',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function StockBar({ pct, name }: { pct: number; name: string }) {
  const color = pct > 50 ? '#10b981' : pct > 20 ? '#f59e0b' : '#ef4444'
  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-600">{name}</span>
        <span className="text-[10px] font-semibold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export function MyPrintersPage({ role = 'end_user' }: { role?: string }) {
  const [printers, setPrinters] = useState<OnSitePrinter[]>(INITIAL_PRINTERS)
  const [expandedId, setExpandedId] = useState<string | null>('OSP-01')
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [schedulingPrinterId, setSchedulingPrinterId] = useState<string | null>(null)
  const [newJob, setNewJob] = useState({ partName: '', orderId: '', material: '', qty: 1, estDuration: '', scheduledAt: '' })

  // Aggregate stats
  const totalOnline = printers.filter(p => p.status !== 'offline').length
  const totalPrinting = printers.filter(p => p.status === 'busy').length
  const totalQueued = printers.flatMap(p => p.jobs).filter(j => j.status === 'queued').length
  const maintenanceSoon = printers.filter(p => {
    const days = Math.ceil((new Date(p.nextMaintenance).getTime() - Date.now()) / 86400000)
    return days <= 7
  }).length

  const openSchedule = (printerId: string) => {
    const p = printers.find(x => x.id === printerId)
    setNewJob({ partName: '', orderId: '', material: p?.materials[0]?.name ?? '', qty: 1, estDuration: '', scheduledAt: '' })
    setSchedulingPrinterId(printerId)
    setScheduleOpen(true)
  }

  const addJob = () => {
    if (!newJob.partName || !schedulingPrinterId) { toast.error('Part name required'); return }
    const printer = printers.find(p => p.id === schedulingPrinterId)!
    const job: PrintJob = {
      id: `J-${Date.now()}`,
      partName: newJob.partName,
      orderId: newJob.orderId || '—',
      material: newJob.material,
      qty: newJob.qty,
      estDuration: newJob.estDuration || 'TBD',
      scheduledAt: newJob.scheduledAt || null,
      status: 'queued',
      pct: 0,
    }
    setPrinters(prev => prev.map(p =>
      p.id === schedulingPrinterId ? { ...p, jobs: [...p.jobs, job] } : p
    ))
    toast.success(`Job scheduled on ${printer.model}`)
    setScheduleOpen(false)
  }

  const removeJob = (printerId: string, jobId: string) => {
    setPrinters(prev => prev.map(p =>
      p.id === printerId ? { ...p, jobs: p.jobs.filter(j => j.id !== jobId) } : p
    ))
    toast.success('Job removed from queue')
  }

  const togglePrinter = (printerId: string) => {
    setPrinters(prev => prev.map(p => {
      if (p.id !== printerId) return p
      if (p.status === 'offline') return p  // can't toggle offline
      const next = p.status === 'paused' ? 'online' : 'paused'
      toast.success(`${p.model} ${next === 'paused' ? 'paused' : 'resumed'}`)
      return { ...p, status: next }
    }))
  }

  const moveJob = (printerId: string, jobId: string, dir: 'up' | 'down') => {
    setPrinters(prev => prev.map(p => {
      if (p.id !== printerId) return p
      const jobs = [...p.jobs]
      const idx = jobs.findIndex(j => j.id === jobId)
      const target = dir === 'up' ? idx - 1 : idx + 1
      if (target < 0 || target >= jobs.length) return p
      ;[jobs[idx], jobs[target]] = [jobs[target], jobs[idx]]
      return { ...p, jobs }
    }))
  }

  return (
    <div className="p-4 sm:p-6 space-y-5">

      {/* Role Banner */}
      {role === 'print_center' && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-teal-50 border-teal-200 text-teal-800 text-sm font-medium">
          🏭 Your Facility Printers — Schedule jobs, monitor queues, and manage material stock
        </div>
      )}

      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Printers Online',   value: `${totalOnline} / ${printers.length}`, color: '#10b981', Icon: Printer },
          { label: 'Currently Printing', value: totalPrinting, color: '#0ea5e9', Icon: Zap },
          { label: 'Jobs Queued',        value: totalQueued,   color: '#8b5cf6', Icon: Clock },
          { label: 'Maintenance Due',    value: maintenanceSoon, color: maintenanceSoon > 0 ? '#f59e0b' : '#10b981', Icon: Wrench },
        ].map(s => (
          <Card key={s.label} className="bg-white border-slate-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${s.color}15` }}>
                <s.Icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xl font-bold text-[#0F172A]">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Printer cards */}
      <div className="space-y-4">
        {printers.map(printer => {
          const statusColor = STATUS_COLOR[printer.status]
          const activeJob = printer.jobs.find(j => j.status === 'printing')
          const queuedJobs = printer.jobs.filter(j => j.status === 'queued')
          const isExpanded = expandedId === printer.id
          const daysToMaintenance = Math.ceil((new Date(printer.nextMaintenance).getTime() - Date.now()) / 86400000)

          return (
            <Card key={printer.id} className={`bg-white border-2 transition-all ${
              printer.status === 'offline' ? 'border-slate-200 opacity-70' :
              printer.status === 'busy'   ? 'border-sky-200' :
              printer.status === 'paused' ? 'border-amber-200' :
              'border-slate-200'
            }`}>
              {/* ── Card header ── */}
              <CardHeader className="pb-0 pt-4 px-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${statusColor}12` }}>
                      <Printer className="w-5 h-5" style={{ color: statusColor }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-[#0F172A]">{printer.model}</h3>
                        <Badge className="text-[10px] px-2 py-0.5" style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30` }}>
                          <span className="w-1.5 h-1.5 rounded-full mr-1 inline-block" style={{ background: statusColor }} />
                          {STATUS_LABEL[printer.status]}
                        </Badge>
                        {printer.certified ? (
                          <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                            <ShieldCheck className="w-2.5 h-2.5" />{printer.certBody}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                            <ShieldAlert className="w-2.5 h-2.5" />Uncertified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{printer.location} · {printer.tech} · {printer.printVolume}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {printer.status !== 'offline' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePrinter(printer.id)}
                        className="text-xs h-7 px-2.5 gap-1"
                      >
                        {printer.status === 'paused'
                          ? <><Play className="w-3 h-3 text-emerald-600" />Resume</>
                          : <><Pause className="w-3 h-3 text-amber-500" />Pause</>
                        }
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => openSchedule(printer.id)}
                      disabled={printer.status === 'offline'}
                      className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white text-xs h-7 px-2.5 gap-1"
                    >
                      <Plus className="w-3 h-3" />Schedule Job
                    </Button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : printer.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Active job progress */}
                {activeJob && (
                  <div className="mt-3 bg-sky-50 border border-sky-200 rounded-xl px-4 py-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-[#0EA5E9]" />
                        <span className="text-xs font-semibold text-[#0F172A]">{activeJob.partName}</span>
                        <span className="text-[10px] font-mono text-slate-400">{activeJob.orderId}</span>
                      </div>
                      <span className="text-xs font-bold text-[#0EA5E9]">{activeJob.pct}%</span>
                    </div>
                    <div className="h-2 bg-sky-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0EA5E9] rounded-full transition-all" style={{ width: `${activeJob.pct}%` }} />
                    </div>
                    <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-500">
                      <span>Material: <strong>{activeJob.material}</strong> · Qty: {activeJob.qty}</span>
                      <span>Est. {activeJob.estDuration} total</span>
                    </div>
                  </div>
                )}
              </CardHeader>

              {/* ── Expanded body ── */}
              {isExpanded && (
                <CardContent className="px-5 pt-4 pb-5 space-y-5">
                  <div className="grid md:grid-cols-3 gap-5">

                    {/* Job Queue */}
                    <div className="md:col-span-2 space-y-2">
                      <p className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#8b5cf6]" />Job Queue
                        {queuedJobs.length > 0 && (
                          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-violet-100 text-violet-700">{queuedJobs.length}</span>
                        )}
                      </p>
                      {queuedJobs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                          <Package className="w-6 h-6 mb-2 opacity-40" />
                          <p className="text-xs">No jobs queued</p>
                          <button onClick={() => openSchedule(printer.id)} className="text-[10px] text-[#0EA5E9] mt-1 hover:underline">
                            + Schedule a job
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {queuedJobs.map((job, idx) => (
                            <div key={job.id} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                              <div className="flex flex-col gap-0.5">
                                <button onClick={() => moveJob(printer.id, job.id, 'up')} disabled={idx === 0} className="text-slate-300 hover:text-slate-500 disabled:opacity-20">
                                  <ChevronUp className="w-3 h-3" />
                                </button>
                                <button onClick={() => moveJob(printer.id, job.id, 'down')} disabled={idx === queuedJobs.length - 1} className="text-slate-300 hover:text-slate-500 disabled:opacity-20">
                                  <ChevronDown className="w-3 h-3" />
                                </button>
                              </div>
                              <GripVertical className="w-3 h-3 text-slate-300 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-[#0F172A] truncate">{job.partName}</p>
                                <p className="text-[10px] text-slate-500">
                                  {job.material} · Qty {job.qty} · ~{job.estDuration}
                                </p>
                              </div>
                              {job.scheduledAt && (
                                <span className="text-[10px] bg-violet-50 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-full shrink-0">
                                  {job.scheduledAt}
                                </span>
                              )}
                              <button
                                onClick={() => removeJob(printer.id, job.id)}
                                className="text-slate-300 hover:text-red-400 transition-colors shrink-0"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right column: Materials + Info */}
                    <div className="space-y-4">

                      {/* Material stock */}
                      <div>
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                          <BarChart3 className="w-3.5 h-3.5 text-[#0EA5E9]" />Material Stock
                        </p>
                        <div className="space-y-2">
                          {printer.materials.map(m => (
                            <StockBar key={m.name} name={m.name} pct={m.stock} />
                          ))}
                        </div>
                      </div>

                      {/* Printer info */}
                      <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Printer Info</p>
                        {[
                          { label: 'Available Hours', val: printer.availableHours },
                          { label: 'Jobs Completed',  val: `${printer.completedJobs} total` },
                          { label: 'Last Service',    val: new Date(printer.lastService).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
                          { label: 'Next Maintenance', val: new Date(printer.nextMaintenance).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
                        ].map(item => (
                          <div key={item.label} className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">{item.label}</span>
                            <span className={`font-medium ${
                              item.label === 'Next Maintenance' && daysToMaintenance <= 7 ? 'text-amber-600' : 'text-[#0F172A]'
                            }`}>{item.val}</span>
                          </div>
                        ))}
                        {printer.certified && (
                          <div className="pt-1.5 border-t border-slate-200">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500">Cert No.</span>
                              <span className="font-mono text-[10px] text-emerald-700">{printer.certNumber}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Maintenance warning */}
                      {daysToMaintenance <= 7 && printer.status !== 'offline' && (
                        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                          <Wrench className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-amber-800">Maintenance in {daysToMaintenance}d</p>
                            <p className="text-[10px] text-amber-600 mt-0.5">Schedule downtime before {new Date(printer.nextMaintenance).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* End User Materials Section */}
      <div className="space-y-4">
        <div className="px-4 py-2.5 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2">
          <Package className="w-4 h-4" />
          📦 Available Materials
        </div>
        
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="space-y-2.5">
              <div className="pl-4 py-2 border-l-4 border-emerald-400 bg-emerald-50">
                <p className="font-semibold text-slate-800">Stainless Steel 316L</p>
                <p className="text-xs text-slate-600 mt-0.5">Marine, chemical, high-temperature applications</p>
              </div>
              <div className="pl-4 py-2 border-l-4 border-emerald-400 bg-emerald-50">
                <p className="font-semibold text-slate-800">Titanium Grade 5 (Ti-6Al-4V)</p>
                <p className="text-xs text-slate-600 mt-0.5">Aerospace, lightweight structural components</p>
              </div>
              <div className="pl-4 py-2 border-l-4 border-emerald-400 bg-emerald-50">
                <p className="font-semibold text-slate-800">Aluminum Al2139</p>
                <p className="text-xs text-slate-600 mt-0.5">Lightweight, corrosion resistant structures</p>
              </div>
              <div className="pl-4 py-2 border-l-4 border-emerald-400 bg-emerald-50">
                <p className="font-semibold text-slate-800">Inconel X750</p>
                <p className="text-xs text-slate-600 mt-0.5">Super-alloy for extreme temperature conditions</p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
                <p className="font-medium text-slate-800 mb-1">✓ Requirements:</p>
                <ul className="space-y-0.5 list-disc list-inside text-slate-600">
                  <li>Material traceability documentation required</li>
                  <li>Test coupons must be retained for lab analysis</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* End User Printers Section */}
      <div className="space-y-4">
        <div className="px-4 py-2.5 rounded-xl border bg-blue-50 border-blue-200 text-blue-800 text-sm font-medium flex items-center gap-2">
          <Printer className="w-4 h-4" />
          🏭 Option: Bring Your Own Printer
        </div>
        
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="space-y-2.5">
              <div className="pl-4 py-2 border-l-4 border-blue-400 bg-blue-50">
                <p className="font-semibold text-slate-800">EOS M 290/300/400</p>
                <p className="text-xs text-slate-600 mt-0.5">Laser Powder Bed Fusion · Metal printing, industrial grade</p>
              </div>
              <div className="pl-4 py-2 border-l-4 border-blue-400 bg-blue-50">
                <p className="font-semibold text-slate-800">3D Systems ProX 200</p>
                <p className="text-xs text-slate-600 mt-0.5">Selective Laser Sintering · Polymers & composites</p>
              </div>
              <div className="pl-4 py-2 border-l-4 border-blue-400 bg-blue-50">
                <p className="font-semibold text-slate-800">Stratasys F900</p>
                <p className="text-xs text-slate-600 mt-0.5">Fused Deposition Modeling · Thermoplastics</p>
              </div>
              <div className="pl-4 py-2 border-l-4 border-blue-400 bg-blue-50">
                <p className="font-semibold text-slate-800">HP Metal Jet</p>
                <p className="text-xs text-slate-600 mt-0.5">Binder Jet · High-speed metal printing</p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
                <p className="font-medium text-slate-800 mb-1">✓ Requirements:</p>
                <ul className="space-y-0.5 list-disc list-inside text-slate-600">
                  <li>Printer must be DNV GL Part 6 certified</li>
                  <li>Lab testing is mandatory (not optional)</li>
                  <li>Same audit trail & certification apply</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Job Dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Print Job</DialogTitle>
            <DialogDescription>
              {schedulingPrinterId && (
                <>Adding to <strong>{printers.find(p => p.id === schedulingPrinterId)?.model}</strong> — {printers.find(p => p.id === schedulingPrinterId)?.location}</>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <div className="space-y-2">
              <Label>Part Name *</Label>
              <Input
                placeholder="e.g., Valve Body DN50"
                value={newJob.partName}
                onChange={e => setNewJob({ ...newJob, partName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Order ID (optional)</Label>
                <Input
                  placeholder="ORD-XXXX"
                  value={newJob.orderId}
                  onChange={e => setNewJob({ ...newJob, orderId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number" min={1}
                  value={newJob.qty}
                  onChange={e => setNewJob({ ...newJob, qty: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Material *</Label>
              <Select value={newJob.material} onValueChange={v => setNewJob({ ...newJob, material: v })}>
                <SelectTrigger><SelectValue placeholder="Select material" /></SelectTrigger>
                <SelectContent>
                  {(printers.find(p => p.id === schedulingPrinterId)?.materials ?? []).map(m => (
                    <SelectItem key={m.name} value={m.name}>
                      {m.name} — {m.stock}% stock
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Est. Duration</Label>
                <Input
                  placeholder="e.g., 4h 30m"
                  value={newJob.estDuration}
                  onChange={e => setNewJob({ ...newJob, estDuration: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Scheduled Time</Label>
                <Input
                  placeholder="e.g., 14:00 today"
                  value={newJob.scheduledAt}
                  onChange={e => setNewJob({ ...newJob, scheduledAt: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>Cancel</Button>
            <Button onClick={addJob} className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white">
              <Plus className="w-4 h-4 mr-1.5" />Add to Queue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
