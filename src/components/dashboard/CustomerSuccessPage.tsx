'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Users, Search, Filter, Plus, Eye, TrendingUp, Calendar, GraduationCap, CheckCircle2, Activity, ShieldCheck, AlertTriangle, Clock, XCircle, Download, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { useEngagements, useTrainingSessions } from '@/hooks/use-dashboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// ── Trained Personnel Registry ───────────────────────────────────────────────

type QualLevel = 'L1' | 'L2' | 'L3' | 'L4'
type PersonnelStatus = 'active' | 'pending_renewal' | 'expired' | 'suspended'

interface TrainedPerson {
  id: string
  fullName: string
  organization: string
  role: string
  qualLevel: QualLevel
  modulesCompleted: string[]
  authorizedActions: string[]
  qualifiedSince: string
  renewalDue: string      // ISO date
  status: PersonnelStatus
}

const TRAINING_MODULES = [
  'Platform Fundamentals',
  'DRM Workflow & IP Compliance',
  'Blueprint Management',
  'DRM Approver Certification',
  'Cert Authority Procedures',
  'Print Center Operations',
  'Quality Inspection Protocol',
  'Audit Log Interpretation',
  'Materials Traceability',
  'Lab & Testing Procedures',
]

const QUAL_LEVEL_META: Record<QualLevel, { label: string; color: string }> = {
  L1: { label: 'L1 · Awareness',    color: 'bg-slate-100 text-slate-600' },
  L2: { label: 'L2 · Operator',     color: 'bg-blue-100 text-blue-700' },
  L3: { label: 'L3 · Approver',     color: 'bg-purple-100 text-purple-700' },
  L4: { label: 'L4 · Administrator', color: 'bg-amber-100 text-amber-700' },
}

const PERSONNEL_STATUS_META: Record<PersonnelStatus, { color: string; icon: React.ReactNode }> = {
  active:          { color: 'bg-teal-100 text-teal-700',   icon: <ShieldCheck className="w-3 h-3" /> },
  pending_renewal: { color: 'bg-amber-100 text-amber-700', icon: <Clock className="w-3 h-3" /> },
  expired:         { color: 'bg-red-100 text-red-600',     icon: <XCircle className="w-3 h-3" /> },
  suspended:       { color: 'bg-slate-100 text-slate-500', icon: <AlertTriangle className="w-3 h-3" /> },
}

const INITIAL_PERSONNEL: TrainedPerson[] = [
  {
    id: 'p-001', fullName: 'Sarah Chen', organization: 'AddManuChain', role: 'admin',
    qualLevel: 'L4',
    modulesCompleted: TRAINING_MODULES,
    authorizedActions: ['All actions'],
    qualifiedSince: '2023-04-10', renewalDue: '2027-04-10', status: 'active',
  },
  {
    id: 'p-002', fullName: 'John Okafor', organization: 'Wärtsilä Marine', role: 'oem',
    qualLevel: 'L3',
    modulesCompleted: ['Platform Fundamentals', 'DRM Workflow & IP Compliance', 'Blueprint Management', 'DRM Approver Certification'],
    authorizedActions: ['DRM OEM Approval', 'Blueprint Upload', 'IP License Grant'],
    qualifiedSince: '2023-09-01', renewalDue: '2025-09-01', status: 'expired',
  },
  {
    id: 'p-003', fullName: 'Maria Torres', organization: 'DNV GL', role: 'cert_authority',
    qualLevel: 'L3',
    modulesCompleted: ['Platform Fundamentals', 'DRM Workflow & IP Compliance', 'Cert Authority Procedures', 'Audit Log Interpretation'],
    authorizedActions: ['DRM Cert Approval', 'Certification Issuance', 'Center Suspension'],
    qualifiedSince: '2024-01-15', renewalDue: '2026-03-20', status: 'pending_renewal',
  },
  {
    id: 'p-004', fullName: 'Amir Khaled', organization: 'Halifax Print Hub', role: 'print_center',
    qualLevel: 'L2',
    modulesCompleted: ['Platform Fundamentals', 'Print Center Operations', 'Quality Inspection Protocol', 'Materials Traceability'],
    authorizedActions: ['Print Job Execution', 'Quality Sign-off', 'Material Batch Recording'],
    qualifiedSince: '2024-03-22', renewalDue: '2026-09-22', status: 'active',
  },
  {
    id: 'p-005', fullName: 'Priya Nair', organization: 'Horizon Maritime', role: 'operator',
    qualLevel: 'L2',
    modulesCompleted: ['Platform Fundamentals', 'DRM Workflow & IP Compliance', 'Blueprint Management'],
    authorizedActions: ['Order Creation', 'Blueprint View', 'Shipment Tracking'],
    qualifiedSince: '2024-06-05', renewalDue: '2027-06-05', status: 'active',
  },
  {
    id: 'p-006', fullName: 'Lucas Bergmann', organization: 'Bureau Veritas', role: 'cert_authority',
    qualLevel: 'L3',
    modulesCompleted: ['Platform Fundamentals', 'Cert Authority Procedures', 'Audit Log Interpretation', 'Lab & Testing Procedures'],
    authorizedActions: ['DRM Cert Approval', 'Certification Issuance', 'Test Report Sign-off'],
    qualifiedSince: '2023-11-30', renewalDue: '2026-11-30', status: 'active',
  },
  {
    id: 'p-007', fullName: 'Fatima Al-Rashid', organization: 'Siemens Energy', role: 'oem',
    qualLevel: 'L1',
    modulesCompleted: ['Platform Fundamentals'],
    authorizedActions: ['View Only'],
    qualifiedSince: '2025-01-10', renewalDue: '2028-01-10', status: 'active',
  },
]

const phases = ['assessment', 'adoption', 'integration', 'training', 'maintenance']
const engagementStatuses = ['active', 'paused', 'completed']
const trainingTypes = ['Operation', 'Maintenance', 'Quality Control', 'Safety']

const phaseColors: Record<string, string> = {
  assessment: 'bg-blue-100 text-blue-600',
  adoption: 'bg-purple-100 text-purple-600',
  integration: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  training: 'bg-cyan-100 text-cyan-600',
  maintenance: 'bg-[#14B8A6]/10 text-[#14B8A6]',
}

const statusColors: Record<string, string> = {
  active: 'bg-[#14B8A6]/10 text-[#14B8A6]',
  paused: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  completed: 'bg-slate-100 text-slate-500',
  scheduled: 'bg-blue-100 text-blue-600',
  cancelled: 'bg-red-100 text-red-600',
}

export function CustomerSuccessPage({ role = 'admin' }: { role?: string }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [phaseFilter, setPhaseFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isTrainingCreateOpen, setIsTrainingCreateOpen] = useState(false)
  const [selectedEngagement, setSelectedEngagement] = useState<any>(null)

  // Personnel Registry state
  const [personnel, setPersonnel] = useState<TrainedPerson[]>(INITIAL_PERSONNEL)
  const [personnelSearch, setPersonnelSearch] = useState('')
  const [personnelLevelFilter, setPersonnelLevelFilter] = useState('all')
  const [personnelStatusFilter, setPersonnelStatusFilter] = useState('all')
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false)
  const [newPerson, setNewPerson] = useState({
    fullName: '', organization: '', role: 'operator', qualLevel: 'L2' as QualLevel,
    modulesCompleted: [] as string[], renewalDue: '',
  })
  const [formData, setFormData] = useState({
    customerName: '',
    industry: 'Offshore Oil & Gas',
    accountManager: '',
    rigCount: '0',
    notes: '',
  })
  const [trainingFormData, setTrainingFormData] = useState({
    customerId: '',
    title: '',
    type: 'Operation',
    scheduledDate: '',
    duration: '240',
    trainer: '',
    location: '',
  })

  const { engagements, isLoading, mutate } = useEngagements(phaseFilter, statusFilter, searchQuery)
  const { trainingSessions, mutate: mutateTraining } = useTrainingSessions()

  const filteredEngagements = engagements || []

  const stats = {
    total: filteredEngagements.length,
    active: filteredEngagements.filter((e: any) => e.status === 'active').length,
    totalRigs: filteredEngagements.reduce((sum: number, e: any) => sum + (e.rigCount || 0), 0),
    avgHealthScore: filteredEngagements.length > 0
      ? Math.round(filteredEngagements.reduce((sum: number, e: any) => sum + (e.healthScore || 0), 0) / filteredEngagements.length)
      : 0,
  }

  // Personnel stats
  const personnelFiltered = personnel.filter(p => {
    const matchSearch = p.fullName.toLowerCase().includes(personnelSearch.toLowerCase()) ||
      p.organization.toLowerCase().includes(personnelSearch.toLowerCase()) ||
      p.role.toLowerCase().includes(personnelSearch.toLowerCase())
    const matchLevel = personnelLevelFilter === 'all' || p.qualLevel === personnelLevelFilter
    const matchStatus = personnelStatusFilter === 'all' || p.status === personnelStatusFilter
    return matchSearch && matchLevel && matchStatus
  })
  const personnelStats = {
    total: personnel.length,
    active: personnel.filter(p => p.status === 'active').length,
    pendingRenewal: personnel.filter(p => p.status === 'pending_renewal').length,
    expired: personnel.filter(p => p.status === 'expired' || p.status === 'suspended').length,
  }

  const handleAddPerson = () => {
    if (!newPerson.fullName || !newPerson.organization || !newPerson.renewalDue) {
      toast.error('Name, organization and renewal date are required')
      return
    }
    const person: TrainedPerson = {
      id: `p-${String(personnel.length + 1).padStart(3, '0')}`,
      fullName: newPerson.fullName,
      organization: newPerson.organization,
      role: newPerson.role,
      qualLevel: newPerson.qualLevel,
      modulesCompleted: newPerson.modulesCompleted,
      authorizedActions: newPerson.qualLevel === 'L1' ? ['View Only'] :
        newPerson.qualLevel === 'L4' ? ['All actions'] : ['Per assigned role'],
      qualifiedSince: new Date().toISOString().slice(0, 10),
      renewalDue: newPerson.renewalDue,
      status: 'active',
    }
    setPersonnel(prev => [...prev, person])
    setIsAddPersonOpen(false)
    setNewPerson({ fullName: '', organization: '', role: 'operator', qualLevel: 'L2', modulesCompleted: [], renewalDue: '' })
    toast.success(`${person.fullName} added to the Personnel Registry`)
  }

  const trainingStats = {
    total: trainingSessions.length,
    scheduled: trainingSessions.filter((t: any) => t.status === 'scheduled').length,
    completed: trainingSessions.filter((t: any) => t.status === 'completed').length,
  }

  const handleCreateEngagement = async () => {
    if (!formData.customerName || !formData.accountManager) {
      toast.error('Customer name and account manager are required')
      return
    }

    try {
      const response = await fetch('/api/engagements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rigCount: parseInt(formData.rigCount) || 0,
        }),
      })

      if (!response.ok) throw new Error('Failed to create engagement')

      toast.success('Customer engagement created successfully')
      setIsCreateOpen(false)
      setFormData({ customerName: '', industry: 'Offshore Oil & Gas', accountManager: '', rigCount: '0', notes: '' })
      mutate()
    } catch (error) {
      toast.error('Failed to create engagement')
      console.error(error)
    }
  }

  const handleCreateTraining = async () => {
    if (!trainingFormData.customerId || !trainingFormData.title || !trainingFormData.scheduledDate) {
      toast.error('Customer, title, and scheduled date are required')
      return
    }

    try {
      const response = await fetch('/api/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...trainingFormData,
          duration: parseInt(trainingFormData.duration) || 240,
        }),
      })

      if (!response.ok) throw new Error('Failed to create training session')

      toast.success('Training session created successfully')
      setIsTrainingCreateOpen(false)
      setTrainingFormData({ customerId: '', title: '', type: 'Operation', scheduledDate: '', duration: '240', trainer: '', location: '' })
      mutateTraining()
    } catch (error) {
      toast.error('Failed to create training session')
      console.error(error)
    }
  }

  const handleUpdatePhase = async (id: string, newPhase: string) => {
    try {
      const response = await fetch('/api/engagements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, phase: newPhase }),
      })

      if (!response.ok) throw new Error('Failed to update phase')

      toast.success('Phase updated successfully')
      mutate()
    } catch (error) {
      toast.error('Failed to update phase')
      console.error(error)
    }
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#0EA5E9]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.total}</p>
                <p className="text-sm text-slate-500">Total Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#14B8A6]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.active}</p>
                <p className="text-sm text-slate-500">Active Engagements</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.totalRigs}</p>
                <p className="text-sm text-slate-500">Total Rigs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.avgHealthScore}/100</p>
                <p className="text-sm text-slate-500">Avg Health Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="engagements" className="w-full">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="engagements">Customer Engagements</TabsTrigger>
          <TabsTrigger value="training">Training Sessions ({trainingStats.total})</TabsTrigger>
          <TabsTrigger value="personnel" className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Personnel Registry ({personnelStats.total})
          </TabsTrigger>
        </TabsList>

        {/* Engagements Tab */}
        <TabsContent value="engagements" className="space-y-4">
          {/* Filters and Actions */}
          <Card className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-1 flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search customers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Phase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Phases</SelectItem>
                      {phases.map(phase => (
                        <SelectItem key={phase} value={phase}>
                          {phase.charAt(0).toUpperCase() + phase.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {engagementStatuses.map(status => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Engagements Table */}
          <Card className="bg-white border-slate-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="font-semibold text-[#0F172A]">Customer</TableHead>
                    <TableHead className="font-semibold text-[#0F172A]">Industry</TableHead>
                    <TableHead className="font-semibold text-[#0F172A]">Phase</TableHead>
                    <TableHead className="font-semibold text-[#0F172A]">Account Manager</TableHead>
                    <TableHead className="font-semibold text-[#0F172A]">Rigs</TableHead>
                    <TableHead className="font-semibold text-[#0F172A]">Health Score</TableHead>
                    <TableHead className="font-semibold text-[#0F172A]">Status</TableHead>
                    <TableHead className="font-semibold text-[#0F172A] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                        Loading engagements...
                      </TableCell>
                    </TableRow>
                  ) : filteredEngagements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                        No customer engagements found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEngagements.map((engagement: any) => (
                      <TableRow key={engagement.id} className="border-slate-200">
                        <TableCell>
                          <div>
                            <div className="font-medium text-[#0F172A]">{engagement.customerName}</div>
                            <div className="text-sm text-slate-500">{engagement.customerId}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-600">{engagement.industry}</span>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={engagement.phase}
                            onValueChange={(value) => handleUpdatePhase(engagement.id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <Badge variant="secondary" className={phaseColors[engagement.phase]}>
                                {engagement.phase}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              {phases.map(phase => (
                                <SelectItem key={phase} value={phase}>
                                  {phase.charAt(0).toUpperCase() + phase.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-600">{engagement.accountManager}</span>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-[#0F172A]">{engagement.rigCount}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  engagement.healthScore >= 80 ? 'bg-[#14B8A6]' :
                                  engagement.healthScore >= 60 ? 'bg-[#F59E0B]' : 'bg-red-500'
                                }`}
                                style={{ width: `${engagement.healthScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-[#0F172A]">{engagement.healthScore}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusColors[engagement.status]}>
                            {engagement.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedEngagement(engagement)
                              setIsViewOpen(true)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-4">
          {/* Training Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#0F172A]">{trainingStats.scheduled}</p>
                    <p className="text-sm text-slate-500">Scheduled</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[#14B8A6]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#0F172A]">{trainingStats.completed}</p>
                    <p className="text-sm text-slate-500">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200">
              <CardContent className="p-4 flex justify-end">
                <Button
                  onClick={() => setIsTrainingCreateOpen(true)}
                  className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Training
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Training Sessions Table */}
          <Card className="bg-white border-slate-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="font-semibold text-[#0F172A]">Session</TableHead>
                    <TableHead className="font-semibold text-[#0F172A]">Customer</TableHead>
                    <TableHead className="font-semibold text-[#0F172A]">Type</TableHead>
                    <TableHead className="font-semibold text-[#0F172A]">Trainer</TableHead>
                    <TableHead className="font-semibold text-[#0F172A]">Date</TableHead>
                    <TableHead className="font-semibold text-[#0F172A]">Duration</TableHead>
                    <TableHead className="font-semibold text-[#0F172A]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainingSessions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                        No training sessions scheduled
                      </TableCell>
                    </TableRow>
                  ) : (
                    trainingSessions.map((session: any) => (
                      <TableRow key={session.id} className="border-slate-200">
                        <TableCell>
                          <div className="font-medium text-[#0F172A]">{session.title}</div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-600">{session.customer?.customerName || 'N/A'}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-[#0EA5E9]/10 text-[#0EA5E9]">
                            {session.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-600">{session.trainer}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-600">
                            {new Date(session.scheduledDate).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-600">{Math.round(session.duration / 60)}h</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusColors[session.status]}>
                            {session.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Personnel Registry Tab ─────────────────────────────────────── */}
        <TabsContent value="personnel" className="space-y-4">
          {/* Personnel Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#0EA5E9]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#0F172A]">{personnelStats.total}</p>
                    <p className="text-xs text-slate-500">Total Registered</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#0F172A]">{personnelStats.active}</p>
                    <p className="text-xs text-slate-500">Active &amp; Qualified</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#0F172A]">{personnelStats.pendingRenewal}</p>
                    <p className="text-xs text-slate-500">Renewal Due</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#0F172A]">{personnelStats.expired}</p>
                    <p className="text-xs text-slate-500">Expired / Suspended</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters + Actions */}
          <Card className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30"
                    placeholder="Search by name, organization, or role…"
                    value={personnelSearch}
                    onChange={e => setPersonnelSearch(e.target.value)}
                  />
                </div>
                <Select value={personnelLevelFilter} onValueChange={setPersonnelLevelFilter}>
                  <SelectTrigger className="w-[170px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Qual Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="L1">L1 · Awareness</SelectItem>
                    <SelectItem value="L2">L2 · Operator</SelectItem>
                    <SelectItem value="L3">L3 · Approver</SelectItem>
                    <SelectItem value="L4">L4 · Administrator</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={personnelStatusFilter} onValueChange={setPersonnelStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending_renewal">Pending Renewal</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => setIsAddPersonOpen(true)}
                  className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Person
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Personnel Table */}
          <Card className="bg-white border-slate-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="font-semibold text-[#0F172A]">Name</TableHead>
                    <TableHead className="font-semibold text-[#0F172A]">Organization</TableHead>
                    <TableHead className="font-semibold text-[#0F172A]">Role</TableHead>
                    <TableHead className="font-semibold text-[#0F172A]">Qualification</TableHead>
                    <TableHead className="font-semibold text-[#0F172A]">Modules</TableHead>
                    <TableHead className="font-semibold text-[#0F172A]">Renewal Due</TableHead>
                    <TableHead className="font-semibold text-[#0F172A]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {personnelFiltered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-slate-400">
                        No personnel found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    personnelFiltered.map(person => {
                      const meta = QUAL_LEVEL_META[person.qualLevel]
                      const statusMeta = PERSONNEL_STATUS_META[person.status]
                      const renewalDate = new Date(person.renewalDue)
                      const daysUntilRenewal = Math.ceil((renewalDate.getTime() - Date.now()) / 86400000)
                      return (
                        <TableRow key={person.id} className="border-slate-200">
                          <TableCell>
                            <div>
                              <div className="font-medium text-[#0F172A]">{person.fullName}</div>
                              <div className="text-xs text-slate-400 font-mono">{person.id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-slate-600">{person.organization}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs bg-slate-100 text-slate-600 rounded px-1.5 py-0.5 font-mono">{person.role}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={`text-xs ${meta.color}`}>{meta.label}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <div className="flex gap-0.5">
                                {TRAINING_MODULES.map((mod, i) => (
                                  <div
                                    key={i}
                                    title={mod}
                                    className={`w-2 h-4 rounded-sm ${
                                      person.modulesCompleted.includes(mod)
                                        ? 'bg-teal-400'
                                        : 'bg-slate-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-slate-500">
                                {person.modulesCompleted.length}/{TRAINING_MODULES.length}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={`text-xs font-medium ${
                              daysUntilRenewal < 0 ? 'text-red-600' :
                              daysUntilRenewal < 30 ? 'text-amber-600' :
                              'text-slate-600'
                            }`}>
                              {renewalDate.toLocaleDateString()}
                              {daysUntilRenewal < 0 && (
                                <span className="ml-1 text-red-500">(Overdue)</span>
                              )}
                              {daysUntilRenewal >= 0 && daysUntilRenewal < 30 && (
                                <span className="ml-1 text-amber-500">({daysUntilRenewal}d)</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={`flex items-center gap-1 w-fit text-xs ${statusMeta.color}`}
                            >
                              {statusMeta.icon}
                              {person.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Module Legend */}
          <Card className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-semibold text-[#0F172A]">Training Module Legend</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {TRAINING_MODULES.map((mod, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-4 rounded-sm bg-teal-400 flex-shrink-0" />
                    <span className="text-xs text-slate-500 leading-tight">{mod}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Person Dialog */}
      <Dialog open={isAddPersonOpen} onOpenChange={setIsAddPersonOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add to Personnel Registry</DialogTitle>
            <DialogDescription>Register a trained person and their qualifications</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                value={newPerson.fullName}
                onChange={e => setNewPerson({ ...newPerson, fullName: e.target.value })}
                placeholder="Dr. Jane Smith"
              />
            </div>
            <div className="space-y-2">
              <Label>Organization *</Label>
              <Input
                value={newPerson.organization}
                onChange={e => setNewPerson({ ...newPerson, organization: e.target.value })}
                placeholder="Wärtsilä Marine"
              />
            </div>
            <div className="space-y-2">
              <Label>Platform Role</Label>
              <Select value={newPerson.role} onValueChange={v => setNewPerson({ ...newPerson, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="operator">Operator</SelectItem>
                  <SelectItem value="oem">OEM Partner</SelectItem>
                  <SelectItem value="cert_authority">Cert Authority</SelectItem>
                  <SelectItem value="print_center">Print Center</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Qualification Level</Label>
              <Select value={newPerson.qualLevel} onValueChange={v => setNewPerson({ ...newPerson, qualLevel: v as QualLevel })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="L1">L1 · Awareness</SelectItem>
                  <SelectItem value="L2">L2 · Operator</SelectItem>
                  <SelectItem value="L3">L3 · Approver</SelectItem>
                  <SelectItem value="L4">L4 · Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Renewal Due Date *</Label>
              <Input
                type="date"
                value={newPerson.renewalDue}
                onChange={e => setNewPerson({ ...newPerson, renewalDue: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Completed Training Modules</Label>
              <div className="grid grid-cols-2 gap-2">
                {TRAINING_MODULES.map(mod => (
                  <label key={mod} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded text-[#0EA5E9]"
                      checked={newPerson.modulesCompleted.includes(mod)}
                      onChange={e => {
                        setNewPerson(prev => ({
                          ...prev,
                          modulesCompleted: e.target.checked
                            ? [...prev.modulesCompleted, mod]
                            : prev.modulesCompleted.filter(m => m !== mod),
                        }))
                      }}
                    />
                    <span className="text-slate-600">{mod}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPersonOpen(false)}>Cancel</Button>
            <Button onClick={handleAddPerson} className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90">
              Add to Registry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Engagement Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Customer Engagement</DialogTitle>
            <DialogDescription>Start tracking a new customer's implementation journey</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Horizon Maritime"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="Offshore Oil & Gas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountManager">Account Manager *</Label>
              <Input
                id="accountManager"
                value={formData.accountManager}
                onChange={(e) => setFormData({ ...formData, accountManager: e.target.value })}
                placeholder="Sarah Chen"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rigCount">Number of Rigs</Label>
              <Input
                id="rigCount"
                type="number"
                value={formData.rigCount}
                onChange={(e) => setFormData({ ...formData, rigCount: e.target.value })}
                placeholder="12"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Initial assessment notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateEngagement} className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90">
              Create Engagement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Training Dialog */}
      <Dialog open={isTrainingCreateOpen} onOpenChange={setIsTrainingCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Training Session</DialogTitle>
            <DialogDescription>Plan a training session for customer personnel</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer *</Label>
              <Select value={trainingFormData.customerId} onValueChange={(value) => setTrainingFormData({ ...trainingFormData, customerId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {filteredEngagements.map((engagement: any) => (
                    <SelectItem key={engagement.id} value={engagement.id}>
                      {engagement.customerName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainingType">Type</Label>
              <Select value={trainingFormData.type} onValueChange={(value) => setTrainingFormData({ ...trainingFormData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {trainingTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="title">Session Title *</Label>
              <Input
                id="title"
                value={trainingFormData.title}
                onChange={(e) => setTrainingFormData({ ...trainingFormData, title: e.target.value })}
                placeholder="Metal AM Operations Fundamentals"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date *</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={trainingFormData.scheduledDate}
                onChange={(e) => setTrainingFormData({ ...trainingFormData, scheduledDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={trainingFormData.duration}
                onChange={(e) => setTrainingFormData({ ...trainingFormData, duration: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainer">Trainer</Label>
              <Input
                id="trainer"
                value={trainingFormData.trainer}
                onChange={(e) => setTrainingFormData({ ...trainingFormData, trainer: e.target.value })}
                placeholder="Dr. Alireza Vahedi Nemani"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={trainingFormData.location}
                onChange={(e) => setTrainingFormData({ ...trainingFormData, location: e.target.value })}
                placeholder="Halifax Facility"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTrainingCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTraining} className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90">
              Schedule Training
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Engagement Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedEngagement?.customerName}</DialogTitle>
            <DialogDescription>Customer Engagement Details</DialogDescription>
          </DialogHeader>
          {selectedEngagement && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Phase</p>
                  <Badge variant="secondary" className={phaseColors[selectedEngagement.phase]}>
                    {selectedEngagement.phase}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Status</p>
                  <Badge variant="secondary" className={statusColors[selectedEngagement.status]}>
                    {selectedEngagement.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Health Score</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          selectedEngagement.healthScore >= 80 ? 'bg-[#14B8A6]' :
                          selectedEngagement.healthScore >= 60 ? 'bg-[#F59E0B]' : 'bg-red-500'
                        }`}
                        style={{ width: `${selectedEngagement.healthScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{selectedEngagement.healthScore}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Industry</p>
                  <p className="text-sm text-[#0F172A]">{selectedEngagement.industry}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Account Manager</p>
                  <p className="text-sm text-[#0F172A]">{selectedEngagement.accountManager}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Number of Rigs</p>
                  <p className="text-sm text-[#0F172A]">{selectedEngagement.rigCount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Customer ID</p>
                  <p className="text-sm text-[#0F172A]">{selectedEngagement.customerId}</p>
                </div>
              </div>
              {selectedEngagement.notes && (
                <div>
                  <p className="text-sm font-medium text-slate-500">Notes</p>
                  <p className="text-sm text-[#0F172A] mt-1">{selectedEngagement.notes}</p>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500">Implementation Timeline</p>
                <div className="space-y-2">
                  {selectedEngagement.assessmentDate && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#14B8A6]" />
                      <span className="text-sm text-slate-600">Assessment: {new Date(selectedEngagement.assessmentDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {selectedEngagement.adoptionDate && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#14B8A6]" />
                      <span className="text-sm text-slate-600">Adoption: {new Date(selectedEngagement.adoptionDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {selectedEngagement.integrationDate && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#14B8A6]" />
                      <span className="text-sm text-slate-600">Integration: {new Date(selectedEngagement.integrationDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {selectedEngagement.trainingDate && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#14B8A6]" />
                      <span className="text-sm text-slate-600">Training: {new Date(selectedEngagement.trainingDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {selectedEngagement.maintenanceStartDate && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#14B8A6]" />
                      <span className="text-sm text-slate-600">Maintenance: {new Date(selectedEngagement.maintenanceStartDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
