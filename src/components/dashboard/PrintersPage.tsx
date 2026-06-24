'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Printer,
  MapPin,
  Zap,
  Shield,
  CheckCircle,
  AlertCircle,
  Settings,
  Plus,
  Heart,
  Wrench,
  Clock,
  AlertTriangle,
  Droplet,
  TrendingUp,
  ThumbsUp,
  X,
  Boxes,
} from 'lucide-react'
import { printCenters, userPrinters, facilityPrinters, orders } from '@/lib/static-data'

const statusColors: Record<string, string> = {
  online: 'bg-emerald-100 text-emerald-700',
  busy: 'bg-amber-100 text-amber-700',
  offline: 'bg-slate-100 text-slate-600',
  maintenance: 'bg-red-100 text-red-700',
}

const statusIcons: Record<string, React.ElementType> = {
  online: CheckCircle,
  busy: AlertCircle,
  offline: AlertCircle,
  maintenance: AlertTriangle,
}

const materialStatusColors: Record<string, string> = {
  good: 'bg-emerald-100 text-emerald-700',
  low: 'bg-amber-100 text-amber-700',
  critical: 'bg-red-100 text-red-700',
}

interface PrinterCardProps {
  type: 'own' | 'facility'
  name: string
  location: string
  status: 'online' | 'busy' | 'offline' | 'maintenance'
  materials: string[]
  capacity?: number
  activePrinters?: number
  totalPrinters?: number
  completedJobs?: number
  certification?: string | string[]
  specialties?: string[]
  warning?: string
  buildPlatform?: string
  contactEmail?: string
}

function PrinterCard({
  type,
  name,
  location,
  status,
  materials,
  capacity,
  activePrinters,
  totalPrinters,
  completedJobs,
  certification,
  specialties,
  warning,
  buildPlatform,
  contactEmail,
}: PrinterCardProps) {
  const StatusIcon = statusIcons[status]

  return (
    <Card className="bg-white border-slate-200 hover:border-slate-300 transition-all">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <Printer className="w-5 h-5 text-[#0EA5E9]" />
              <h3 className="font-bold text-lg text-[#0F172A]">{name}</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              {location}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={statusColors[status]}>
              <StatusIcon className="w-3 h-3 mr-1" />
              <span className="capitalize">{status}</span>
            </Badge>
            {warning && (
              <span className="text-xs text-amber-600 font-medium">⚠️ {warning}</span>
            )}
          </div>
        </div>

        {/* Materials & Specs */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-200 mb-4">
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1">Materials</p>
            <div className="flex flex-wrap gap-1">
              {materials.slice(0, 2).map((m, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {m}
                </Badge>
              ))}
              {materials.length > 2 && (
                <Badge variant="outline" className="text-xs text-slate-500">
                  +{materials.length - 2} more
                </Badge>
              )}
            </div>
          </div>
          {buildPlatform && (
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Build Platform</p>
              <p className="text-sm font-medium text-slate-700">{buildPlatform}</p>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {type === 'facility' ? (
            <>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-0.5">Active Printers</p>
                <p className="text-lg font-bold text-[#0EA5E9]">
                  {activePrinters}/{totalPrinters}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-0.5">Capacity</p>
                <p className="text-lg font-bold text-[#0EA5E9]">{capacity}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-0.5">Certification</p>
                <p className="text-xs font-medium text-emerald-700">{certification}</p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-0.5">Status</p>
                <p className="text-sm font-bold capitalize text-[#0EA5E9]">{status}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-0.5">Completed Jobs</p>
                <p className="text-lg font-bold text-[#0EA5E9]">{completedJobs}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-0.5">Certs</p>
                <div className="flex justify-center flex-wrap gap-0.5">
                  {Array.isArray(certification) ? (
                    certification.map((c, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {c}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-slate-600">{certification}</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Info */}
        {specialties && specialties.length > 0 && (
          <div className="mb-4 pb-3 border-b border-slate-200">
            <p className="text-xs text-slate-500 font-medium mb-1.5">Specialties</p>
            <div className="flex flex-wrap gap-1">
              {specialties.map((s, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {type === 'facility' && contactEmail && (
            <Button size="sm" variant="outline" className="flex-1">
              Contact
            </Button>
          )}
          <Button
            size="sm"
            variant={type === 'own' ? 'default' : 'outline'}
            className={type === 'own' ? 'flex-1 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90' : 'flex-1'}
          >
            <Heart className="w-4 h-4 mr-1" />
            {type === 'own' ? 'Manage' : 'Connect'}
          </Button>
          {type === 'facility' && (
            <Button size="sm" variant="outline">
              <Settings className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Detailed Facility Printer Card
function FacilityPrinterCard({ printer }: { printer: typeof facilityPrinters[0] }) {
  const StatusIcon = statusIcons[printer.status]

  return (
    <Card className="bg-white border-slate-200 hover:border-slate-300 transition-all">
      <CardContent className="p-5">
        {/* Header with Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Printer className="w-5 h-5 text-[#0EA5E9]" />
              <h3 className="font-bold text-lg text-[#0F172A]">{printer.name}</h3>
              {printer.status === 'busy' && (
                <Badge className="bg-emerald-100 text-emerald-700 text-xs">Printing</Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-2">{printer.location}</p>
            {printer.currentJob && (
              <div className="mb-2 p-2 bg-cyan-50 rounded border border-cyan-200">
                <p className="text-xs font-semibold text-cyan-900">{printer.currentJob.partName}</p>
                <div className="mt-1 h-1.5 bg-cyan-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all"
                    style={{ width: `${printer.currentJob.progress}%` }}
                  />
                </div>
                <p className="text-[10px] text-cyan-700 mt-1">{printer.currentJob.progress}% · {printer.currentJob.estimatedTime}</p>
              </div>
            )}
          </div>
          <Badge className={statusColors[printer.status]}>
            <StatusIcon className="w-3 h-3 mr-1" />
            <span className="capitalize">{printer.status}</span>
          </Badge>
        </div>

        <div className="border-t border-slate-200 pt-4 space-y-4">
          {/* Job Queue */}
          {printer.jobQueue.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <h4 className="text-xs font-semibold text-[#0F172A]">JOB QUEUE ({printer.jobQueue.length})</h4>
              </div>
              <div className="space-y-2">
                {printer.jobQueue.map((job, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded border border-slate-200">
                    <div>
                      <p className="font-medium text-[#0F172A]">{job.partName}</p>
                      <p className="text-slate-500">{job.material} • {job.duration}</p>
                    </div>
                    <Badge
                      className={
                        job.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : job.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }
                    >
                      {job.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Material Stock */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Droplet className="w-4 h-4 text-slate-500" />
              <h4 className="text-xs font-semibold text-[#0F172A]">MATERIAL STOCK</h4>
            </div>
            <div className="space-y-2">
              {printer.materialStock.map((mat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-medium text-slate-700">{mat.material}</p>
                    <p className="text-slate-500">{mat.quantity} {mat.unit}</p>
                  </div>
                  <Badge className={materialStatusColors[mat.status]}>
                    {mat.status === 'good' ? '✓' : mat.status === 'low' ? '⚠' : '🔴'} {mat.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Printer Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-slate-500" />
              <h4 className="text-xs font-semibold text-[#0F172A]">PRINTER INFO</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <p className="text-slate-500 font-medium">Available Hours</p>
                <p className="text-[#0F172A] font-semibold">{printer.availability.start} — {printer.availability.end}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <p className="text-slate-500 font-medium">Jobs Completed</p>
                <p className="text-[#0EA5E9] font-semibold">{printer.completedJobs} total</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <p className="text-slate-500 font-medium">Last Service</p>
                <p className="text-[#0F172A] font-semibold">{printer.lastService}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <p className="text-slate-500 font-medium">Next Maintenance</p>
                <p className="text-amber-600 font-semibold">{printer.nextMaintenance}</p>
              </div>
              <div className="col-span-2 bg-slate-50 p-2.5 rounded border border-slate-200">
                <p className="text-slate-500 font-medium">Certification</p>
                <p className="text-emerald-700 font-semibold text-[10px] break-all">{printer.certification}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" className="flex-1 text-[#0EA5E9]">
            <TrendingUp className="w-4 h-4 mr-1" />
            View Analytics
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Wrench className="w-4 h-4 mr-1" />
            Schedule Maint.
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function PrintersPage({ role, onNavigate }: { role?: string; onNavigate?: (tab: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'facility' | 'nearby' | 'approvals'>('facility')
  const [approvedJobs, setApprovedJobs] = useState<Set<string>>(new Set())

  const filteredNearby = printCenters.filter(
    c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredFacility = facilityPrinters.filter(
    p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const facilityOnline = facilityPrinters.filter(p => p.status === 'online' || p.status === 'busy').length
  const facilityPrinting = facilityPrinters.filter(p => !!p.currentJob).length
  const facilityQueued = facilityPrinters.reduce((sum, p) => sum + p.jobQueue.length, 0)
  const facilityMaintenance = facilityPrinters.filter(p => new Date(p.nextMaintenance) < new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)).length

  return (
    <div className="p-3 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0F172A]">🖨️ Printers</h1>
        <p className="text-slate-600 mt-1">Manage on-site printer schedules, monitor queues, and coordinate material stock</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'facility' | 'nearby' | 'approvals')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="facility">🏭 Your Facility Printers ({facilityPrinters.length})</TabsTrigger>
          <TabsTrigger value="nearby">🛰️ Nearby Facilities ({printCenters.length})</TabsTrigger>
          <TabsTrigger value="approvals">✋ Print Approvals ({orders.filter(o => o.status === 'pending' && !o.oemApproval.approved).length})</TabsTrigger>
        </TabsList>

        {/* Facility Printers Tab (Primary) */}
        <TabsContent value="facility" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-white border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Printers Online</p>
                    <p className="text-2xl font-bold text-emerald-600">{facilityOnline}/{facilityPrinters.length}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Currently Printing</p>
                    <p className="text-2xl font-bold text-[#0EA5E9]">{facilityPrinting}</p>
                  </div>
                  <Zap className="w-6 h-6 text-[#0EA5E9]" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Jobs Queued</p>
                    <p className="text-2xl font-bold text-amber-600">{facilityQueued}</p>
                  </div>
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Maintenance Due</p>
                    <p className="text-2xl font-bold text-red-600">{facilityMaintenance}</p>
                  </div>
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            <Button onClick={() => onNavigate?.('orders')} className="bg-[#0EA5E9] hover:bg-cyan-600 text-white rounded">
              <Plus className="w-4 h-4 mr-2" />
              Add Order
            </Button>
            <Button onClick={() => onNavigate?.('materials')} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded">
              <Boxes className="w-4 h-4 mr-2" />
              Order Materials
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search facility printers..."
              className="pl-10 bg-white border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Facility Printers Grid */}
          {filteredFacility.length === 0 ? (
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="p-8 text-center">
                <Printer className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium mb-2">No printers found</p>
                <p className="text-sm text-slate-400">Add facility printers to begin</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredFacility.map((printer) => (
                <FacilityPrinterCard key={printer.id} printer={printer} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Own Printers Tab */}
        {/* Nearby Facilities Tab */}
        <TabsContent value="nearby" className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-white border-slate-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-[#0EA5E9]">{printCenters.length}</p>
                <p className="text-xs text-slate-500">Nearby Facilities</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{printCenters.filter(c => c.status === 'online').length}</p>
                <p className="text-xs text-slate-500">Online</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">{printCenters.filter(c => c.status === 'busy').length}</p>
                <p className="text-xs text-slate-500">Busy</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-slate-600">{printCenters.filter(c => c.status === 'offline').length}</p>
                <p className="text-xs text-slate-500">Offline</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search facilities..."
              className="pl-10 bg-white border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredNearby.length === 0 ? (
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="p-8 text-center">
                <Zap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium mb-2">No facilities found</p>
                <p className="text-sm text-slate-400">There are no available facilities matching your search</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNearby.map((center) => (
                <PrinterCard
                  key={center.id}
                  type="facility"
                  name={center.name}
                  location={center.location}
                  status={center.status as 'online' | 'busy' | 'offline'}
                  materials={center.materials}
                  capacity={center.capacity}
                  activePrinters={center.activePrinters}
                  totalPrinters={center.totalPrinters}
                  certification={center.certification}
                  specialties={center.specialties}
                  contactEmail={center.contactEmail}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Print Approvals Tab */}
        <TabsContent value="approvals" className="space-y-6">
          {/* Approvals Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A]">Pending Print Approvals</h2>
              <p className="text-slate-600 mt-1">Review and approve orders for printing</p>
            </div>
          </div>

          {/* Filter Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-white border-slate-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">{orders.filter(o => o.status === 'pending' && !o.oemApproval.approved).length}</p>
                <p className="text-xs text-slate-500">Awaiting OEM Approval</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{orders.filter(o => o.oemApproval.approved && o.certApproval.approved).length}</p>
                <p className="text-xs text-slate-500">All Approvals Complete</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">{orders.filter(o => o.oemApproval.approved && !o.certApproval.approved).length}</p>
                <p className="text-xs text-slate-500">Cert Approval Pending</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-[#0EA5E9]">{approvedJobs.size}</p>
                <p className="text-xs text-slate-500">Approved This Session</p>
              </CardContent>
            </Card>
          </div>

          {/* Pending Approvals */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#0F172A]">Requests Requiring OEM Sign-Off</h3>
            {orders.filter(o => o.status === 'pending' && !o.oemApproval.approved).length === 0 ? (
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <p className="text-emerald-800 font-medium">All pending requests approved!</p>
                  <p className="text-sm text-emerald-700 mt-1">No requests require OEM approval at this time</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.filter(o => o.status === 'pending' && !o.oemApproval.approved).map((order) => (
                  <Card key={order.id} className="bg-white border-slate-200 hover:border-[#0EA5E9] transition">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-amber-100 text-amber-700">Pending OEM</Badge>
                            <Badge variant="outline" className="text-slate-600">{order.orderId}</Badge>
                          </div>
                          <h4 className="text-lg font-semibold text-[#0F172A]">{order.partName}</h4>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-200">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Quantity</p>
                          <p className="font-semibold text-[#0EA5E9]">{order.quantity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Priority</p>
                          <Badge className={order.priority === 'high' ? 'bg-red-100 text-red-700' : order.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}>
                            {order.priority}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Est. Delivery</p>
                          <p className="text-sm font-medium">{new Date(order.eta).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Cert Status</p>
                          <Badge className={order.certApproval.approved ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>
                            {order.certApproval.approved ? '✓ Approved' : 'Pending'}
                          </Badge>
                        </div>
                      </div>

                      {/* Notes */}
                      {order.notes && (
                        <div className="mb-4 p-3 bg-slate-50 rounded border-l-2 border-[#0EA5E9]">
                          <p className="text-xs text-slate-500 mb-1">Notes:</p>
                          <p className="text-sm text-slate-700">{order.notes}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          onClick={() => setApprovedJobs(prev => new Set([...prev, order.id]))}
                          disabled={approvedJobs.has(order.id)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
                        >
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          {approvedJobs.has(order.id) ? 'Approved ✓' : 'Approve'}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-red-200 text-red-700 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Approved & Ready to Print */}
          {orders.filter(o => o.oemApproval.approved && o.certApproval.approved).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#0F172A]">Ready for Printing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.filter(o => o.oemApproval.approved && o.certApproval.approved && o.status === 'pending').map((order) => (
                  <Card key={order.id} className="bg-emerald-50 border-emerald-200 hover:border-emerald-400 transition">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-emerald-100 text-emerald-700">Ready</Badge>
                            <Badge variant="outline" className="text-slate-600">{order.orderId}</Badge>
                          </div>
                          <h4 className="font-semibold text-[#0F172A]">{order.partName}</h4>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Qty: {order.quantity}</span>
                        <Button className="bg-[#0EA5E9] hover:bg-cyan-600 text-white h-8 text-xs rounded">
                          <Plus className="w-3 h-3 mr-1" /> Add to Queue
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
