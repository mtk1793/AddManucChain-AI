'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Download, FileText, MoreVertical } from 'lucide-react'
import useSWR from 'swr'

const MOCK_REPORTS = [
  { id: '1', reportId: 'RPT-2025-001', title: 'February Orders Summary', type: 'orders', format: 'pdf', status: 'ready', createdAt: new Date(Date.now() - 2*24*60*60*1000) },
  { id: '2', reportId: 'RPT-2025-002', title: 'Q1 Analytics Report', type: 'analytics', format: 'excel', status: 'ready', createdAt: new Date(Date.now() - 5*24*60*60*1000) },
  { id: '3', reportId: 'RPT-2025-003', title: 'Compliance Audit', type: 'compliance', format: 'pdf', status: 'ready', createdAt: new Date(Date.now() - 10*24*60*60*1000) },
  { id: '4', reportId: 'RPT-2025-004', title: 'Cost Analysis - March', type: 'cost_analysis', format: 'csv', status: 'ready', createdAt: new Date(Date.now() - 1*24*60*60*1000) },
]

export function ReportsPanel() {
  const [selectedFormat, setSelectedFormat] = useState('pdf')
  const [selectedType, setSelectedType] = useState('orders')
  const [isGenerating, setIsGenerating] = useState(false)
  const [reports, setReports] = useState(MOCK_REPORTS)
  
  const mutate = () => setReports(MOCK_REPORTS)
  
  const handleGenerateReport = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          format: selectedFormat,
          title: `${selectedType} Report`,
          filters: {},
        }),
      })
      
      const data = await res.json()
      if (data.success) {
        mutate()
      }
    } catch (error) {
      console.error('Report generation failed:', error)
    }
    setIsGenerating(false)
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>Create reports in PDF, Excel, or CSV format</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Report Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="cost_analysis">Cost Analysis</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Format</label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={handleGenerateReport} disabled={isGenerating} className="w-full">
                {isGenerating ? '...Generating' : 'Generate Report'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {reports?.map((report: any) => (
              <div key={report.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">{report.title}</p>
                    <p className="text-xs text-gray-500">{report.reportId} • {report.format.toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={report.status === 'ready' ? 'default' : 'secondary'}>
                    {report.status}
                  </Badge>
                  {report.fileUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={report.fileUrl} download>
                        <Download className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
