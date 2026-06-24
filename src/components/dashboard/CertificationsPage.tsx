'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Shield, CheckCircle, AlertTriangle, Clock, RefreshCw, Download, ExternalLink } from 'lucide-react'
import { certifications } from '@/lib/static-data'

const statusColors: Record<string, string> = {
  active: 'bg-[#14B8A6]/10 text-[#14B8A6]',
  pending: 'bg-[#0EA5E9]/10 text-[#0EA5E9]',
  expiring_soon: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  expired: 'bg-red-100 text-red-600',
}

const statusLabels: Record<string, string> = {
  active: 'Active',
  pending: 'Pending',
  expiring_soon: 'Expiring Soon',
  expired: 'Expired',
}

export function CertificationsPage({ role = 'admin' }: { role?: string }) {
  const stats = {
    total: certifications.length,
    active: certifications.filter(c => c.status === 'active').length,
    pending: certifications.filter(c => c.status === 'pending').length,
    expiring: certifications.filter(c => c.status === 'expiring_soon').length,
    expired: certifications.filter(c => c.status === 'expired').length,
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const diff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const getValidityPercentage = (cert: typeof certifications[0]) => {
    const issue = new Date(cert.issueDate)
    const expiry = new Date(cert.expiryDate)
    const today = new Date()
    const total = expiry.getTime() - issue.getTime()
    const remaining = expiry.getTime() - today.getTime()
    return Math.max(0, Math.min(100, (remaining / total) * 100))
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#0EA5E9]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.total}</p>
                <p className="text-sm text-slate-500">Total Certs</p>
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
                <p className="text-2xl font-bold text-[#0F172A]">{stats.active}</p>
                <p className="text-sm text-slate-500">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#0EA5E9]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.pending}</p>
                <p className="text-sm text-slate-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.expiring}</p>
                <p className="text-sm text-slate-500">Expiring Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.expired}</p>
                <p className="text-sm text-slate-500">Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Soon Alert */}
      {stats.expiring > 0 && (
        <Card className="bg-[#F59E0B]/10 border-[#F59E0B]/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
              <div>
                <p className="font-medium text-[#0F172A]">
                  {stats.expiring} certification{stats.expiring > 1 ? 's' : ''} expiring within 90 days
                </p>
                <p className="text-sm text-slate-600">
                  Renewal recommended: {certifications.filter(c => c.status === 'expiring_soon').map(c => `${c.name} (${c.holder})`).join(', ')}
                </p>
              </div>
              <Button className="ml-auto" variant="outline">
                Start Renewal Process
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certifications Table */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[#0F172A]">Certification Registry</CardTitle>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-[#0F172A]">Certification</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Issuer</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Holder</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Validity</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Status</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certifications.map((cert) => {
                const daysLeft = getDaysUntilExpiry(cert.expiryDate)
                return (
                  <TableRow key={cert.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-[#0F172A]">{cert.name}</p>
                          <p className="text-xs text-slate-500">{cert.type}</p>
                          <p className="text-xs text-slate-400 mt-1 max-w-xs">{cert.scope}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{cert.issuer}</TableCell>
                    <TableCell className="text-slate-600">{cert.holder}</TableCell>
                    <TableCell>
                      <div className="w-40">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-500">
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                          </span>
                        </div>
                        <Progress 
                          value={getValidityPercentage(cert)} 
                          className={`h-2 ${
                            cert.status === 'expired' ? '[&>div]:bg-red-500' : 
                            cert.status === 'expiring_soon' ? '[&>div]:bg-[#F59E0B]' : ''
                          }`}
                        />
                        <p className="text-xs text-slate-400 mt-1">
                          Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[cert.status]}>
                        {statusLabels[cert.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {cert.documentUrl && (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
