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
import { Shield, Search, Filter, Plus, Eye, Clock, CheckCircle, XCircle, Mail, Phone, Globe } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthorities, useCertRequests } from '@/hooks/use-dashboard'

const authorityTypes = ['Marine & Offshore', 'Marine & Industrial', 'Marine & Aerospace', 'Quality Standards', 'Oil & Gas', 'Aerospace']

const statusColors: Record<string, string> = {
  active: 'bg-[#14B8A6]/10 text-[#14B8A6]',
  inactive: 'bg-slate-100 text-slate-500',
}

const requestStatusColors: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-600',
  under_review: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  approved: 'bg-[#14B8A6]/10 text-[#14B8A6]',
  rejected: 'bg-red-100 text-red-600',
}

export function AuthoritiesPage({ role = 'admin' }: { role?: string }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedAuthority, setSelectedAuthority] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    acronym: '',
    type: 'Marine & Offshore',
    contactEmail: '',
    contactPhone: '',
    specializations: '',
    websiteUrl: '',
  })

  const { authorities, isLoading, mutate } = useAuthorities(typeFilter, statusFilter, searchQuery)
  const { certRequests } = useCertRequests()

  const filteredAuthorities = authorities || []

  const stats = {
    total: filteredAuthorities.length,
    active: filteredAuthorities.filter((a: any) => a.status === 'active').length,
    totalApproved: filteredAuthorities.reduce((sum: number, a: any) => sum + a.approvedParts, 0),
    avgLeadTime: filteredAuthorities.length > 0 
      ? Math.round(filteredAuthorities.reduce((sum: number, a: any) => sum + a.averageLeadTime, 0) / filteredAuthorities.length)
      : 0,
  }

  const requestStats = {
    total: certRequests.length,
    pending: certRequests.filter((r: any) => r.status === 'submitted' || r.status === 'under_review').length,
    approved: certRequests.filter((r: any) => r.status === 'approved').length,
    rejected: certRequests.filter((r: any) => r.status === 'rejected').length,
  }

  const handleCreateAuthority = async () => {
    if (!formData.name || !formData.acronym || !formData.contactEmail) {
      toast.error('Name, acronym, and contact email are required')
      return
    }

    try {
      const specializations = formData.specializations
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)

      const response = await fetch('/api/authorities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          specializations: JSON.stringify(specializations),
        }),
      })

      if (!response.ok) throw new Error('Failed to create authority')

      toast.success('Certification authority created successfully')
      setIsCreateOpen(false)
      setFormData({ name: '', acronym: '', type: 'Marine & Offshore', contactEmail: '', contactPhone: '', specializations: '', websiteUrl: '' })
      mutate()
    } catch (error) {
      toast.error('Failed to create authority')
      console.error(error)
    }
  }

  const handleDeleteAuthority = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification authority?')) return

    try {
      const response = await fetch(`/api/authorities?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete authority')

      toast.success('Authority deleted')
      mutate()
    } catch (error) {
      toast.error('Failed to delete authority')
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
                <Shield className="w-5 h-5 text-[#0EA5E9]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.total}</p>
                <p className="text-sm text-slate-500">Authorities</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#14B8A6]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.totalApproved}</p>
                <p className="text-sm text-slate-500">Parts Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.avgLeadTime} days</p>
                <p className="text-sm text-slate-500">Avg Lead Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{requestStats.pending}</p>
                <p className="text-sm text-slate-500">Pending Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search authorities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {authorityTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Authority
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Authorities Table */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead className="font-semibold text-[#0F172A]">Authority</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Type</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Contact</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Approved Parts</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Avg Lead Time</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Status</TableHead>
                <TableHead className="font-semibold text-[#0F172A] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    Loading authorities...
                  </TableCell>
                </TableRow>
              ) : filteredAuthorities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    No certification authorities found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAuthorities.map((authority: any) => (
                  <TableRow key={authority.id} className="border-slate-200">
                    <TableCell>
                      <div>
                        <div className="font-medium text-[#0F172A]">{authority.name}</div>
                        <div className="text-sm text-slate-500">{authority.acronym}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-[#0EA5E9]/10 text-[#0EA5E9] hover:bg-[#0EA5E9]/20">
                        {authority.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-600">{authority.contactEmail}</span>
                        </div>
                        {authority.contactPhone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-600">{authority.contactPhone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-[#0F172A]">{authority.approvedParts}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-[#0F172A]">{authority.averageLeadTime} days</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[authority.status]}>
                        {authority.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAuthority(authority)
                            setIsViewOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAuthority(authority.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Authority Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Certification Authority</DialogTitle>
            <DialogDescription>Create a new certification authority entry</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Authority Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Det Norske Veritas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="acronym">Acronym *</Label>
              <Input
                id="acronym"
                value={formData.acronym}
                onChange={(e) => setFormData({ ...formData, acronym: e.target.value })}
                placeholder="DNV"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {authorityTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="certification@dnv.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+1-555-0100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://www.dnv.com"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="specializations">Specializations (comma-separated)</Label>
              <Textarea
                id="specializations"
                value={formData.specializations}
                onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                placeholder="Marine Engineering, Offshore Structures, Pressure Vessels"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateAuthority} className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90">
              Create Authority
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Authority Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedAuthority?.name}</DialogTitle>
            <DialogDescription>{selectedAuthority?.acronym}</DialogDescription>
          </DialogHeader>
          {selectedAuthority && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Type</p>
                  <p className="text-sm text-[#0F172A]">{selectedAuthority.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Status</p>
                  <Badge variant="secondary" className={statusColors[selectedAuthority.status]}>
                    {selectedAuthority.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Approved Parts</p>
                  <p className="text-sm text-[#0F172A]">{selectedAuthority.approvedParts}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Average Lead Time</p>
                  <p className="text-sm text-[#0F172A]">{selectedAuthority.averageLeadTime} days</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500">Contact Information</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-[#0F172A]">{selectedAuthority.contactEmail}</span>
                  </div>
                  {selectedAuthority.contactPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-[#0F172A]">{selectedAuthority.contactPhone}</span>
                    </div>
                  )}
                  {selectedAuthority.websiteUrl && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <a href={selectedAuthority.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-[#0EA5E9] hover:underline">
                        {selectedAuthority.websiteUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              {selectedAuthority.specializations && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500">Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(selectedAuthority.specializations).map((spec: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-700">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
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
