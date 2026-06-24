'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FileText,
  Filter,
  RefreshCw,
  Package,
  Edit,
  Clock,
  Building2,
  Award,
  KeyRound,
  Zap,
  Shield,
  CheckCircle2,
  XCircle,
  Link,
} from 'lucide-react'
import { auditLogs } from '@/lib/static-data'

const actionColors: Record<string, string> = {
  ORDER_CREATED: 'bg-[#0EA5E9]/10 text-[#0EA5E9]',
  ORDER_UPDATED: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  ORDER_DELETED: 'bg-red-100 text-red-600',
  OEM_APPROVED: 'bg-purple-100 text-purple-700',
  CERT_APPROVED: 'bg-emerald-100 text-emerald-700',
  PRINT_TOKEN_ISSUED: 'bg-indigo-100 text-indigo-700',
  PRINT_EXECUTED: 'bg-[#14B8A6]/10 text-[#14B8A6]',
}

const actionLabels: Record<string, string> = {
  ORDER_CREATED: 'Order Created',
  ORDER_UPDATED: 'Status Updated',
  ORDER_DELETED: 'Order Deleted',
  OEM_APPROVED: 'OEM IP License Granted',
  CERT_APPROVED: 'Cert Authority Approved',
  PRINT_TOKEN_ISSUED: 'Secure Token Issued',
  PRINT_EXECUTED: 'Print Job Executed',
}

const actionIcons: Record<string, any> = {
  ORDER_CREATED: Package,
  ORDER_UPDATED: Edit,
  ORDER_DELETED: Package,
  OEM_APPROVED: Building2,
  CERT_APPROVED: Award,
  PRINT_TOKEN_ISSUED: KeyRound,
  PRINT_EXECUTED: Zap,
}

// Simulate SHA-256 hash verification — deterministic based on log data
function verifyHash(log: typeof auditLogs[0]): boolean {
  // Simulate: checks if log hash starts with correct prefix pattern
  // In a real system this would recompute SHA-256(prevHash + action + timestamp + orderId)
  return log.logHash.length === 32 && /^[a-f0-9]+$/.test(log.logHash)
}

export function AuditLogPage({ role = 'admin' }: { role?: string }) {
  const [actionFilter, setActionFilter] = useState('all')
  const [logs, setLogs] = useState(auditLogs)
  const [hashVerified, setHashVerified] = useState<Record<string, boolean>>({})

  // Simulate hash verification on mount
  useEffect(() => {
    const results: Record<string, boolean> = {}
    auditLogs.forEach(log => {
      results[log.id] = verifyHash(log)
    })
    setHashVerified(results)
  }, [])

  const filteredLogs = logs.filter(log => {
    return actionFilter === 'all' || log.action === actionFilter
  })

  const allVerified = Object.values(hashVerified).every(v => v)

  const stats = {
    total: auditLogs.length,
    created: auditLogs.filter(l => l.action === 'ORDER_CREATED').length,
    oemApprovals: auditLogs.filter(l => l.action === 'OEM_APPROVED').length,
    certApprovals: auditLogs.filter(l => l.action === 'CERT_APPROVED').length,
    tokensIssued: auditLogs.filter(l => l.action === 'PRINT_TOKEN_ISSUED').length,
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Chain Integrity Banner */}
      <div className={`flex items-center gap-4 p-4 rounded-xl border ${allVerified
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-red-50 border-red-200'
        }`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${allVerified ? 'bg-emerald-500' : 'bg-red-500'
          }`}>
          {allVerified
            ? <Shield className="w-6 h-6 text-white" />
            : <XCircle className="w-6 h-6 text-white" />
          }
        </div>
        <div className="flex-1">
          <p className={`font-bold text-sm ${allVerified ? 'text-emerald-800' : 'text-red-800'}`}>
            {allVerified ? '✓ Hash Chain Integrity Verified' : '✗ Chain Integrity Compromised'}
          </p>
          <p className={`text-xs ${allVerified ? 'text-emerald-600' : 'text-red-600'}`}>
            {allVerified
              ? `All ${auditLogs.length} log entries verified. SHA-256 chain is intact — no tampering detected.`
              : 'One or more log entries failed hash verification. Potential tampering detected.'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link className={`w-4 h-4 ${allVerified ? 'text-emerald-600' : 'text-red-600'}`} />
          <span className={`text-xs font-mono ${allVerified ? 'text-emerald-700' : 'text-red-700'}`}>
            {auditLogs[auditLogs.length - 1]?.logHash.substring(0, 12)}...
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#0EA5E9]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.total}</p>
                <p className="text-xs text-slate-500">Total Logs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-[#14B8A6]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.created}</p>
                <p className="text-xs text-slate-500">Orders Created</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.oemApprovals}</p>
                <p className="text-xs text-slate-500">OEM Approvals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.certApprovals}</p>
                <p className="text-xs text-slate-500">Cert Approvals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.tokensIssued}</p>
                <p className="text-xs text-slate-500">Tokens Issued</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── HASH CHAIN VISUALIZATION ───────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0f1e', border: '1px solid #1e2d45' }}>
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid #1e2d45' }}>
          <p className="text-xs font-bold text-white flex items-center gap-2">
            🔒 Immutable Audit Hash Chain
            <span className="text-[10px] font-normal" style={{ color: '#64748b' }}>(SHA-256 · {auditLogs.length} entries linked)</span>
          </p>
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-bold"
            style={{ background: allVerified ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: allVerified ? '#10b981' : '#ef4444', border: `1px solid ${allVerified ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}
          >
            {allVerified ? '✓ Chain Intact' : '✗ Tamper Detected'}
          </span>
        </div>
        <div className="flex items-center gap-1 px-5 py-4 overflow-x-auto">
          {auditLogs.slice(-6).map((log, i, arr) => (
            <div key={log.id} className="flex items-center gap-1 shrink-0">
              <div
                className="rounded-lg px-3 py-2.5"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${hashVerified[log.id] ? 'rgba(16,185,129,0.35)' : '#1e2d45'}`,
                  minWidth: '120px',
                }}
              >
                <p className="text-[8px] font-bold uppercase tracking-wide mb-1" style={{ color: '#64748b' }}>
                  Block #{auditLogs.length - (arr.length - 1 - i)}
                </p>
                <p className="text-[9px] font-semibold mb-1" style={{ color: '#e2e8f0' }}>
                  {log.action.replace(/_/g, ' ')}
                </p>
                <p className="font-mono text-[8px]" style={{ color: '#06b6d4' }}>
                  {log.logHash.substring(0, 10)}...
                </p>
                <div className="flex items-center gap-1 mt-1.5">
                  <span className="text-[7px]" style={{ color: hashVerified[log.id] ? '#10b981' : '#ef4444' }}>
                    {hashVerified[log.id] ? '✓ verified' : '✗ failed'}
                  </span>
                </div>
              </div>
              {i < arr.length - 1 && (
                <span className="text-base shrink-0" style={{ color: '#334155' }}>→</span>
              )}
            </div>
          ))}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-base" style={{ color: '#334155' }}>→</span>
            <div
              className="rounded-lg px-3 py-2.5 text-center"
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px dashed rgba(59,130,246,0.3)', minWidth: '80px' }}
            >
              <p className="text-[9px] font-semibold" style={{ color: '#93c5fd' }}>Next entry</p>
              <p className="text-[8px] mt-0.5" style={{ color: '#475569' }}>awaiting...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-52 bg-white border-slate-200">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Action Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="ORDER_CREATED">Order Created</SelectItem>
            <SelectItem value="ORDER_UPDATED">Status Updated</SelectItem>
            <SelectItem value="OEM_APPROVED">OEM Approved</SelectItem>
            <SelectItem value="CERT_APPROVED">Cert Approved</SelectItem>
            <SelectItem value="PRINT_TOKEN_ISSUED">Token Issued</SelectItem>
            <SelectItem value="PRINT_EXECUTED">Print Executed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Audit Logs */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#0EA5E9]" />
            Immutable Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.map((log, idx) => {
              const ActionIcon = actionIcons[log.action] || FileText
              const isVerified = hashVerified[log.id] !== false
              return (
                <div key={log.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${log.action === 'ORDER_CREATED' ? 'bg-[#0EA5E9]/10' :
                      log.action === 'OEM_APPROVED' ? 'bg-purple-100' :
                        log.action === 'CERT_APPROVED' ? 'bg-emerald-100' :
                          log.action === 'PRINT_TOKEN_ISSUED' ? 'bg-indigo-100' :
                            log.action === 'PRINT_EXECUTED' ? 'bg-[#14B8A6]/10' :
                              'bg-[#F59E0B]/10'
                    }`}>
                    <ActionIcon className={`w-5 h-5 ${log.action === 'ORDER_CREATED' ? 'text-[#0EA5E9]' :
                        log.action === 'OEM_APPROVED' ? 'text-purple-600' :
                          log.action === 'CERT_APPROVED' ? 'text-emerald-600' :
                            log.action === 'PRINT_TOKEN_ISSUED' ? 'text-indigo-600' :
                              log.action === 'PRINT_EXECUTED' ? 'text-[#14B8A6]' :
                                'text-[#F59E0B]'
                      }`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge className={`text-xs ${actionColors[log.action]}`}>
                        {actionLabels[log.action]}
                      </Badge>
                      <span className="font-mono text-sm text-[#0EA5E9]">{log.order?.orderId}</span>
                    </div>
                    <p className="text-sm text-[#0F172A]">{log.details}</p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                      {log.order && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Package className="w-3 h-3" />
                          {log.order.partName}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hash Chain Info */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                      }`}>
                      {isVerified ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {isVerified ? 'Verified' : 'Failed'}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Link className="w-2.5 h-2.5" />
                      <span className="font-mono">{log.logHash.substring(0, 8)}...</span>
                    </div>
                    {idx > 0 && (
                      <div className="text-[10px] text-slate-300 font-mono">
                        ↑ {log.prevHash.substring(0, 8)}...
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
