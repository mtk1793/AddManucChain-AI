'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Printer, AlertTriangle, Activity, Zap, Clock, Wrench,
  TrendingUp, Package, ShieldAlert, CheckCircle2, AlertCircle, Pause, Play, Monitor
} from 'lucide-react'
import { toast } from 'sonner'

// Mock data for facility status
const FACILITY_STATUS = {
  name: 'PolyUnity NL — Atlantic XL',
  location: 'Rotterdam, Netherlands',
  activeOrders: 12,
  totalCapacity: 8,
  utilizationRate: 87,
  avgJobDuration: '4.5h',
  alertCount: 3,
  maintenanceDue: 1,
}

const PRINTERS = [
  {
    id: 'P-01',
    model: 'Markforged X7',
    location: 'Bay A',
    status: 'printing' as const,
    progress: 62,
    currentJob: 'ORD-7738: Bearing Cap',
    timeRemaining: '2h 05m',
    temperature: 42,
    health: 98,
    materialsLoaded: ['Onyx FR', 'Carbon Fiber'],
  },
  {
    id: 'P-02',
    model: 'HP Jet Fusion 580',
    location: 'Bay B',
    status: 'idle' as const,
    progress: 0,
    currentJob: null,
    timeRemaining: null,
    temperature: 28,
    health: 100,
    materialsLoaded: ['HP 3D HR PA12', 'HP 3D HR PA12 GB'],
  },
  {
    id: 'P-03',
    model: 'Ultimaker S5',
    location: 'Bay C',
    status: 'paused' as const,
    progress: 35,
    currentJob: 'ORD-7745: Pump Bracket',
    timeRemaining: '3h 20m remaining',
    temperature: 38,
    health: 95,
    materialsLoaded: ['PLA', 'PETG'],
  },
  {
    id: 'P-04',
    model: 'Formlabs Form 3',
    location: 'Lab',
    status: 'offline' as const,
    progress: 0,
    currentJob: null,
    timeRemaining: null,
    temperature: 20,
    health: 85,
    materialsLoaded: ['Standard Resin'],
  },
]

const MATERIAL_STOCK = [
  { name: 'Onyx FR', stock: 68, unit: '%', status: 'adequate' as const },
  { name: 'Carbon Fiber', stock: 42, unit: '%', status: 'adequate' as const },
  { name: 'HP 3D HR PA12', stock: 15, unit: '%', status: 'low' as const },
  { name: 'PLA', stock: 8, unit: '%', status: 'critical' as const },
]

const ACTIVE_ALERTS = [
  { id: 'A-001', severity: 'warning', title: 'Material Low: PLA', message: 'PLA stock at 8% — order refill', time: '15 min ago' },
  { id: 'A-002', severity: 'warning', title: 'Maintenance Due', message: 'Formlabs Form 3 maintenance scheduled in 2 days', time: '1h ago' },
  { id: 'A-003', severity: 'info', title: 'Job Complete', message: 'ORD-7741 printed successfully', time: '2h ago' },
]

function PrinterCard({ printer }: { printer: typeof PRINTERS[0] }) {
  const statusColors = {
    printing: { bg: '#0EA5E9', text: 'Printing', icon: '🟢' },
    idle: { bg: '#64748b', text: 'Idle', icon: '⚪' },
    paused: { bg: '#F59E0B', text: 'Paused', icon: '🟡' },
    offline: { bg: '#EF4444', text: 'Offline', icon: '🔴' },
  }
  const color = statusColors[printer.status]

  return (
    <Card className="bg-white border-slate-200 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Printer className="w-4 h-4 text-slate-600" />
              <h3 className="font-bold text-[#0F172A]">{printer.model}</h3>
            </div>
            <p className="text-xs text-slate-500">{printer.location}</p>
          </div>
          <Badge className="text-white" style={{ background: color.bg }}>
            {color.icon} {color.text}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Progress / Current Job */}
        {printer.status === 'printing' && (
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <p className="text-xs font-semibold text-slate-700">{printer.currentJob}</p>
              <span className="text-xs font-bold text-[#0EA5E9]">{printer.progress}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0EA5E9] transition-all"
                style={{ width: `${printer.progress}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 text-right">{printer.timeRemaining} remaining</p>
          </div>
        )}

        {printer.status === 'paused' && (
          <div className="space-y-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs font-semibold text-amber-900 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Paused: {printer.currentJob}
            </p>
            <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all"
                style={{ width: `${printer.progress}%` }}
              />
            </div>
            <p className="text-[10px] text-amber-700">{printer.timeRemaining}</p>
          </div>
        )}

        {printer.status === 'idle' && (
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-medium text-slate-600 text-center">Ready for next job</p>
          </div>
        )}

        {printer.status === 'offline' && (
          <div className="p-2 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs font-medium text-red-600 text-center">Offline — Service Required</p>
          </div>
        )}

        {/* Status Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
          <div className="text-center">
            <p className="text-[10px] text-slate-500">Temperature</p>
            <p className="font-bold text-sm text-slate-700">{printer.temperature}°C</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-500">Health</p>
            <p className={`font-bold text-sm ${printer.health >= 95 ? 'text-emerald-600' : printer.health >= 85 ? 'text-amber-600' : 'text-red-600'}`}>
              {printer.health}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-500">Materials</p>
            <p className="font-bold text-sm text-slate-700">{printer.materialsLoaded.length}</p>
          </div>
        </div>

        {/* Control Buttons */}
        {printer.status === 'printing' && (
          <Button size="sm" className="w-full text-xs h-8 bg-amber-500 hover:bg-amber-600 text-white">
            <Pause className="w-3 h-3 mr-1" /> Pause Job
          </Button>
        )}
        {printer.status === 'paused' && (
          <Button size="sm" className="w-full text-xs h-8 bg-emerald-500 hover:bg-emerald-600 text-white">
            <Play className="w-3 h-3 mr-1" /> Resume Job
          </Button>
        )}
        {printer.status === 'idle' && (
          <Button size="sm" className="w-full text-xs h-8 bg-slate-300 text-slate-700 cursor-not-allowed" disabled>
            Ready for Assignment
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function FacilityControlRoom({ role = 'admin' }: { role?: string }) {
  const [printers, setPrinters] = useState(PRINTERS)
  const printingCount = printers.filter(p => p.status === 'printing').length
  const idleCount = printers.filter(p => p.status === 'idle').length

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Facility Header */}
      <div>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
              <Monitor className="w-6 h-6 text-[#0EA5E9]" />
              {FACILITY_STATUS.name}
            </h1>
            <p className="text-sm text-slate-500">{FACILITY_STATUS.location}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#0EA5E9]">{FACILITY_STATUS.utilizationRate}%</div>
            <p className="text-xs text-slate-500">Current Utilization</p>
          </div>
        </div>
        {FACILITY_STATUS.alertCount > 0 && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {FACILITY_STATUS.alertCount} active alert{FACILITY_STATUS.alertCount > 1 ? 's' : ''}
            {FACILITY_STATUS.maintenanceDue > 0 && ` • ${FACILITY_STATUS.maintenanceDue} maintenance due`}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Printing Now', value: printingCount, icon: Activity, color: '#0EA5E9' },
          { label: 'Available', value: idleCount, icon: CheckCircle2, color: '#10B981' },
          { label: 'Active Orders', value: FACILITY_STATUS.activeOrders, icon: Package, color: '#8B5CF6' },
          { label: 'Avg Job Time', value: FACILITY_STATUS.avgJobDuration, icon: Clock, color: '#F59E0B' },
        ].map(stat => (
          <Card key={stat.label} className="bg-white border-slate-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                <p className="text-[10px] font-semibold text-slate-500 uppercase">{stat.label}</p>
              </div>
              <p className="text-xl font-bold text-[#0F172A]">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout: Printers & Materials */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Printers Column (Takes 2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0F172A]">Printer Fleet Status</h2>
            <span className="text-xs font-semibold text-slate-500">{printers.length} units</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {printers.map(printer => (
              <PrinterCard key={printer.id} printer={printer} />
            ))}
          </div>
        </div>

        {/* Right Sidebar: Materials & Alerts */}
        <div className="space-y-4">
          {/* Material Stock */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-[#8B5CF6]" />
                Material Stock
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {MATERIAL_STOCK.map(mat => {
                const statusColor = mat.status === 'adequate' ? '#10B981' : mat.status === 'low' ? '#F59E0B' : '#EF4444'
                return (
                  <div key={mat.name} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-700">{mat.name}</span>
                      <span className="text-xs font-bold" style={{ color: statusColor }}>
                        {mat.stock}{mat.unit}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${mat.stock}%`,
                          background: statusColor,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Active Alerts */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Alerts & Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {ACTIVE_ALERTS.map(alert => {
                const alertStyle = alert.severity === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : alert.severity === 'error'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
                return (
                  <div key={alert.id} className={`p-2 rounded-lg border text-xs space-y-0.5 ${alertStyle}`}>
                    <p className="font-semibold">{alert.title}</p>
                    <p className="text-[10px] opacity-85">{alert.message}</p>
                    <p className="text-[9px] opacity-60">{alert.time}</p>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Maintenance Schedule */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Wrench className="w-4 h-4 text-slate-600" />
                Maintenance Due
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="p-2 bg-orange-50 rounded border border-orange-200 text-orange-800">
                <p className="font-semibold">Formlabs Form 3</p>
                <p className="text-[10px]">In 2 days · Calibration</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
