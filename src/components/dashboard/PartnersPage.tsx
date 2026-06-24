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
import { Users, Search, Filter, Plus, Eye, Edit, Trash2, Building, Mail, Phone, FileBox, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { partners as initialPartners } from '@/lib/static-data'

const partnerTypes = ['OEM', 'Integrator', 'Distributor', 'Service Provider']
const partnerStatuses = ['active', 'pending', 'inactive']

const statusColors: Record<string, string> = {
  active: 'bg-[#14B8A6]/10 text-[#14B8A6]',
  pending: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  inactive: 'bg-slate-100 text-slate-500',
}

const typeColors: Record<string, string> = {
  OEM: 'bg-[#0EA5E9]/10 text-[#0EA5E9]',
  Integrator: 'bg-purple-100 text-purple-600',
  Distributor: 'bg-[#14B8A6]/10 text-[#14B8A6]',
  'Service Provider': 'bg-orange-100 text-orange-600',
}

export function PartnersPage({ role = 'admin' }: { role?: string }) {
  const [partners, setPartners] = useState(initialPartners)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'OEM',
    address: '',
    notes: '',
  })

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         partner.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || partner.type === typeFilter
    const matchesStatus = statusFilter === 'all' || partner.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const stats = {
    total: partners.length,
    active: partners.filter(p => p.status === 'active').length,
    totalBlueprints: partners.reduce((sum, p) => sum + p.blueprints, 0),
    totalRevenue: partners.reduce((sum, p) => sum + p.revenue, 0),
  }

  const handleCreatePartner = () => {
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required')
      return
    }

    const newPartner = {
      id: `partner-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '',
      type: formData.type,
      status: 'pending',
      address: formData.address || '',
      notes: formData.notes || '',
      blueprints: 0,
      totalPrints: 0,
      revenue: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    }

    setPartners([newPartner, ...partners])
    toast.success('Partner created successfully')
    setIsCreateOpen(false)
    setFormData({ name: '', email: '', phone: '', type: 'OEM', address: '', notes: '' })
  }

  const handleDeletePartner = (id: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return
    setPartners(partners.filter(p => p.id !== id))
    toast.success('Partner deleted')
  }

  const handleUpdatePartner = () => {
    if (!selectedPartner) return
    setPartners(partners.map(p => p.id === selectedPartner.id ? selectedPartner : p))
    toast.success('Partner updated')
    setIsEditOpen(false)
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
                <p className="text-sm text-slate-500">Total Partners</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center">
                <Building className="w-5 h-5 text-[#14B8A6]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.active}</p>
                <p className="text-sm text-slate-500">Active Partners</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <FileBox className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.totalBlueprints}</p>
                <p className="text-sm text-slate-500">Total Blueprints</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">${(stats.totalRevenue / 1000).toFixed(0)}K</p>
                <p className="text-sm text-slate-500">Partner Royalties</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search partners..."
            className="pl-10 bg-white border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40 bg-white border-slate-200">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {partnerTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 bg-white border-slate-200">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {partnerStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
        </Button>
      </div>

      {/* Partners Table */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-[#0F172A]">Partner</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Type</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Status</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Blueprints</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Prints</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Royalties</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#0F172A] flex items-center justify-center">
                        <Building className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-[#0F172A]">{partner.name}</p>
                        <p className="text-xs text-slate-500">{partner.address}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={typeColors[partner.type]}>{partner.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[partner.status]}>
                      {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-[#0F172A]">{partner.blueprints}</TableCell>
                  <TableCell className="text-slate-600">{partner.totalPrints}</TableCell>
                  <TableCell className="font-medium text-[#14B8A6]">
                    ${(partner.revenue / 1000).toFixed(1)}K
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedPartner(partner)
                          setIsViewOpen(true)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedPartner(partner)
                          setIsEditOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleDeletePartner(partner.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Partner Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Partner</DialogTitle>
            <DialogDescription>Register a new OEM or integration partner</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Company Name *</Label>
              <Input
                placeholder="e.g., Rosen Maritime"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  placeholder="contact@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  placeholder="+1 555-0100"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Partner Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {partnerTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="City, Province"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional information..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePartner} className="bg-[#0EA5E9]">Add Partner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Partner Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Partner Details</DialogTitle>
          </DialogHeader>
          {selectedPartner && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 rounded-lg bg-[#0F172A] flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0F172A]">{selectedPartner.name}</h3>
                  <p className="text-sm text-slate-500">{selectedPartner.address}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-500">Type</Label>
                  <p><Badge className={typeColors[selectedPartner.type]}>{selectedPartner.type}</Badge></p>
                </div>
                <div>
                  <Label className="text-slate-500">Status</Label>
                  <p><Badge className={statusColors[selectedPartner.status]}>{selectedPartner.status}</Badge></p>
                </div>
                <div>
                  <Label className="text-slate-500">Email</Label>
                  <p className="font-medium">{selectedPartner.email}</p>
                </div>
                <div>
                  <Label className="text-slate-500">Phone</Label>
                  <p className="font-medium">{selectedPartner.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#0F172A]">{selectedPartner.blueprints}</p>
                  <p className="text-xs text-slate-500">Blueprints</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#0F172A]">{selectedPartner.totalPrints}</p>
                  <p className="text-xs text-slate-500">Total Prints</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#14B8A6]">${(selectedPartner.revenue / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-slate-500">Royalties</p>
                </div>
              </div>
              {selectedPartner.notes && (
                <div>
                  <Label className="text-slate-500">Notes</Label>
                  <p className="text-sm bg-slate-50 p-3 rounded-lg">{selectedPartner.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Partner Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Partner</DialogTitle>
          </DialogHeader>
          {selectedPartner && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={selectedPartner.status}
                  onValueChange={(v) => setSelectedPartner({ ...selectedPartner, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {partnerStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={selectedPartner.email}
                  onChange={(e) => setSelectedPartner({ ...selectedPartner, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={selectedPartner.phone}
                  onChange={(e) => setSelectedPartner({ ...selectedPartner, phone: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdatePartner} className="bg-[#0EA5E9]">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
