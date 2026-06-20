'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  AlertTriangle, Zap, Clock, CheckCircle, MapPin, Printer,
  FileBox, Shield, Package, Phone, ChevronRight, XCircle,
  Timer, Radio, Truck, UploadCloud,
} from 'lucide-react'

const ACTIVE_EMERGENCIES = [
  {
    id: 'EM-001',
    part: 'Pump Impeller — Type 316L',
    site: 'Hibernia Platform (Offshore)',
    criticality: 'production_stopped',
    hoursAvailable: 4,
    blueprintStatus: 'not_found',
    facility: null,
    progress: 15,
    status: 'Escalated — manual sourcing initiated',
    created: '2h 14m ago',
  },
  {
    id: 'EM-002',
    part: 'Valve Seat — DN80 Gate Valve',
    site: 'FPSO Atlantic Producer',
    criticality: 'degraded',
    hoursAvailable: 18,
    blueprintStatus: 'found',
    facility: { name: 'Atlantic XL Print Centre', distance: '340 km', leadTime: '9.5 hrs', cert: 'DNV GL' },
    progress: 62,
    status: 'Print queued — DRM fast-track active',
    created: '45m ago',
  },
]

const CRITICALITY_MAP: Record<string, { label: string; color: string; bg: string }> = {
  production_stopped: { label: 'Production Stopped', color: '#EF4444', bg: 'bg-red-50 border-red-200' },
  degraded:           { label: 'Degraded Operations', color: '#F59E0B', bg: 'bg-amber-50 border-amber-200' },
  safety_risk:        { label: 'Safety Risk', color: '#EF4444', bg: 'bg-red-50 border-red-200' },
  operational_risk:   { label: 'Operational Risk', color: '#0EA5E9', bg: 'bg-sky-50 border-sky-200' },
}

const BLUEPRINT_STATUS: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  not_found: { label: 'No Digital File Found', color: '#EF4444', icon: XCircle },
  found:     { label: 'Blueprint Available', color: '#10B981', icon: CheckCircle },
  similar:   { label: 'Similar Blueprint Found', color: '#F59E0B', icon: AlertTriangle },
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string; sub?: string; color: string
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          <p className="text-xs text-slate-500">{label}</p>
          {sub && <p className="text-xs font-medium" style={{ color }}>{sub}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

export function EmergencyResponsePage({ role = 'admin' }: { role?: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [triageResult, setTriageResult] = useState<any>(null)
  const [form, setForm] = useState({
    part: '', site: '', criticality: 'production_stopped', hours: '', photo: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Build natural language description from form inputs
      const description = `Failed part: ${form.part}. Location: ${form.site}. Criticality: ${form.criticality}. Max hours without this part: ${form.hours || 'unknown'}.`
      
      const response = await fetch('/api/emergency/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      setTriageResult(data)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit emergency request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <Zap className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Emergency Response</h1>
            <p className="text-sm text-slate-500">Fast-path from breakdown to replacement — every minute counts</p>
          </div>
        </div>
        <Badge className="bg-red-100 text-red-700 border-red-200 text-xs px-3 py-1">
          <Radio className="w-3 h-3 mr-1 animate-pulse" />
          3 Active
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={AlertTriangle} label="Active Emergencies" value="3" sub="1 critical" color="#EF4444" />
        <StatCard icon={Clock} label="Avg Response Time" value="2.4 hrs" sub="↓ 18% vs last month" color="#0EA5E9" />
        <StatCard icon={CheckCircle} label="Resolved Within SLA" value="94%" sub="Last 30 days" color="#10B981" />
        <StatCard icon={Timer} label="Unresolved &gt; 24h" value="0" sub="All current on track" color="#14B8A6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Emergency Request Form */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Submit Emergency Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Failed Part Name / Description</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                      placeholder="e.g. Pump Impeller, 316L stainless, DN150"
                      value={form.part}
                      onChange={e => setForm(f => ({ ...f, part: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Site / Vessel Name & Location</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                      placeholder="e.g. Hibernia Platform, Grand Banks"
                      value={form.site}
                      onChange={e => setForm(f => ({ ...f, site: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-2 block">Operational Criticality</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(CRITICALITY_MAP).map(([key, val]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, criticality: key }))}
                          className={`text-left px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                            form.criticality === key
                              ? `border-2 text-white`
                              : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                          style={form.criticality === key ? { borderColor: val.color, backgroundColor: val.color } : {}}
                        >
                          {val.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Max Operating Hours Without This Part</label>
                    <input
                      type="number"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                      placeholder="e.g. 8"
                      value={form.hours}
                      onChange={e => setForm(f => ({ ...f, hours: e.target.value }))}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, photo: !f.photo }))}
                      className={`w-full flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${
                        form.photo ? 'border-sky-400 bg-sky-50 text-sky-700' : 'border-dashed border-slate-300 text-slate-500 hover:border-slate-400'
                      }`}
                    >
                      <UploadCloud className="w-4 h-4" />
                      {form.photo ? 'photo_failed_part.jpg attached' : 'Upload photo of failed part (optional — AI attempts ID)'}
                    </button>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50">
                    {loading ? (
                      <>
                        <Radio className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Submit Emergency Request
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                /* Instant Response Panel */
                <div className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-800 font-medium">{error}</p>
                    </div>
                  )}
                  
                  {loading && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="animate-spin">
                        <Radio className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-sm text-blue-800 font-medium">AI analysing emergency details...</p>
                    </div>
                  )}
                  
                  {triageResult && !error && (
                    <>
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <p className="text-sm text-green-800 font-medium">Emergency analysed — routing to nearest facility</p>
                      </div>

                      {/* Part Extraction */}
                      {triageResult.partExtraction && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Extracted Part Information</p>
                          <div className="p-3 border border-slate-200 rounded-lg space-y-2 bg-slate-50">
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-slate-500 block">Part Name</span>
                                <span className="font-medium text-slate-800">{triageResult.partExtraction.partName || 'Unknown'}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block">Type</span>
                                <span className="font-medium text-slate-800">{triageResult.partExtraction.partType || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block">Material</span>
                                <span className="font-medium text-slate-800">{triageResult.partExtraction.material || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block">Criticality</span>
                                <span className="font-medium text-slate-800">{triageResult.partExtraction.criticality || 'High'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Nearest Facility */}
                      {triageResult.selectedCenter && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Nearest Certified Printer</p>
                          <div className="p-3 border border-slate-200 rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Printer className="w-4 h-4 text-sky-600" />
                                <span className="text-sm font-semibold text-slate-800">{triageResult.selectedCenter.name}</span>
                              </div>
                              <Badge className="bg-green-100 text-green-700 text-xs">Available</Badge>
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{triageResult.selectedCenter.distance || '~340 km'}</span>
                              {triageResult.selectedCenter.certification && (
                                <span className="flex items-center gap-1"><Shield className="w-3 h-3" />{triageResult.selectedCenter.certification}</span>
                              )}
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{triageResult.selectedCenter.eta}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* AI Recommendation */}
                      {triageResult.recommendation && (
                        <div className="p-3 bg-violet-50 border border-violet-200 rounded-lg">
                          <p className="text-xs font-semibold text-violet-800 flex items-center gap-1">
                            <Zap className="w-3 h-3" /> AI Recommendation
                          </p>
                          <p className="text-xs text-violet-700 mt-2">{triageResult.recommendation}</p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button className="flex-1 bg-sky-600 hover:bg-sky-700 text-white text-sm">
                          <Truck className="w-4 h-4 mr-2" />
                          Confirm & Trigger Priority Order
                        </Button>
                        <Button 
                          variant="outline" 
                          className="text-sm"
                          onClick={() => {
                            setSubmitted(false)
                            setTriageResult(null)
                            setForm({ part: '', site: '', criticality: 'production_stopped', hours: '', photo: false })
                          }}
                        >
                          New Request
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active Emergency Tracker */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-500" />
                Active Emergency Tracker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ACTIVE_EMERGENCIES.map(em => {
                const crit = CRITICALITY_MAP[em.criticality]
                const bpStatus = BLUEPRINT_STATUS[em.blueprintStatus]
                const BpIcon = bpStatus.icon
                return (
                  <div key={em.id} className={`border rounded-xl p-4 space-y-3 ${crit.bg}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-500">{em.id}</span>
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: crit.color }}
                          >
                            {crit.label}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 mt-1">{em.part}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />{em.site}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-slate-400">{em.created}</p>
                        <p className="text-xs font-medium text-orange-600 mt-0.5">
                          <Timer className="w-3 h-3 inline mr-0.5" />
                          {em.hoursAvailable}h window
                        </p>
                      </div>
                    </div>

                    {/* Blueprint status */}
                    <div className="flex items-center gap-2">
                      <BpIcon className="w-4 h-4 flex-shrink-0" style={{ color: bpStatus.color }} />
                      <span className="text-xs font-medium" style={{ color: bpStatus.color }}>{bpStatus.label}</span>
                    </div>

                    {/* Facility (if found) */}
                    {em.facility && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Printer className="w-3 h-3 text-sky-500" />
                        <span>{em.facility.name}</span>
                        <span className="text-slate-400">·</span>
                        <span>{em.facility.distance}</span>
                        <span className="text-slate-400">·</span>
                        <span>{em.facility.leadTime}</span>
                      </div>
                    )}

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Resolution progress</span>
                        <span>{em.progress}%</span>
                      </div>
                      <Progress value={em.progress} className="h-1.5" />
                      <p className="text-xs text-slate-500 mt-1">{em.status}</p>
                    </div>

                    {/* Timeline stepper */}
                    <div className="flex items-center gap-1 pt-1">
                      {['Request', 'Blueprint', 'DRM', 'Printing', 'Delivery'].map((step, i) => {
                        const done = em.progress > i * 20
                        const active = em.progress >= i * 20 && em.progress < (i + 1) * 20
                        return (
                          <div key={step} className="flex items-center gap-1 flex-1">
                            <div className={`flex flex-col items-center gap-0.5 flex-1`}>
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                done ? 'bg-green-500' : active ? 'bg-amber-400' : 'bg-slate-200'
                              }`}>
                                {done && <CheckCircle className="w-3 h-3 text-white" />}
                              </div>
                              <span className="text-[9px] text-slate-400 text-center">{step}</span>
                            </div>
                            {i < 4 && <div className={`flex-1 h-px mb-3 ${done ? 'bg-green-400' : 'bg-slate-200'}`} />}
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 text-xs bg-sky-600 hover:bg-sky-700 text-white">
                        <Phone className="w-3 h-3 mr-1" />
                        Contact Facility
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        Full Details <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                )
              })}

              {/* Third emergency — resolved */}
              <div className="border border-green-200 bg-green-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">EM-003</span>
                      <Badge className="bg-green-100 text-green-700 text-xs">Resolved</Badge>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 mt-1">Bearing Housing — Suncor Upgrader</p>
                    <p className="text-xs text-green-700 mt-0.5 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Delivered in 7.2 hrs — within 8h SLA
                    </p>
                  </div>
                  <Package className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
