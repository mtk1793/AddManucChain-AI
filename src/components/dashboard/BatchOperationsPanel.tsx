'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlayCircle, StopCircle, RefreshCw, CheckCircle2 } from 'lucide-react'
import useSWR from 'swr'

const MOCK_ORDERS = [
  { id: 'o1', orderId: 'ORD-2025-001', status: 'pending' },
  { id: 'o2', orderId: 'ORD-2025-002', status: 'approved' },
  { id: 'o3', orderId: 'ORD-2025-003', status: 'in-progress' },
  { id: 'o4', orderId: 'ORD-2025-004', status: 'pending' },
  { id: 'o5', orderId: 'ORD-2025-005', status: 'approved' },
]

const MOCK_BATCH_JOBS = [
  { id: '1', jobId: 'BATCH-001', operation: 'update_status', status: 'completed', itemCount: 245, completedCount: 245, failedCount: 0, progress: 100 },
  { id: '2', jobId: 'BATCH-002', operation: 'export', status: 'completed', itemCount: 100, completedCount: 100, failedCount: 0, progress: 100 },
  { id: '3', jobId: 'BATCH-003', operation: 'approve', status: 'in-progress', itemCount: 50, completedCount: 37, failedCount: 0, progress: 74 },
  { id: '4', jobId: 'BATCH-004', operation: 'assign', status: 'failed', itemCount: 20, completedCount: 12, failedCount: 8, progress: 60 },
]

export function BatchOperationsPanel() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [operation, setOperation] = useState('update_status')
  const [isProcessing, setIsProcessing] = useState(false)
  const [jobs, setJobs] = useState({ jobs: MOCK_BATCH_JOBS })
  const mutateJobs = () => setJobs({ jobs: MOCK_BATCH_JOBS })
  const orders = { orders: MOCK_ORDERS }
  
  const handleSelectAll = (checked: boolean) => {
    if (checked && orders?.orders) {
      setSelectedItems(orders.orders.map((o: any) => o.id))
    } else {
      setSelectedItems([])
    }
  }
  
  const handleToggleItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }
  
  const handleExecuteBatch = async () => {
    if (!selectedItems.length) {
      alert('Select items first')
      return
    }
    
    setIsProcessing(true)
    // Simulate batch execution
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert(`Successfully queued batch job with ${selectedItems.length} items for "${operation}"`)
    setSelectedItems([])
    setIsProcessing(false)
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Batch Operations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select Items</h3>
            <div className="flex items-center gap-2 p-2 border rounded bg-gray-50">
              <Checkbox
                checked={selectedItems.length === orders?.orders?.length && orders?.orders?.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-xs text-gray-600">Select All</span>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto border rounded p-2 space-y-1">
              {orders?.orders?.map((order: any) => (
                <div key={order.id} className="flex item-center gap-2 p-2 hover:bg-gray-50 rounded">
                  <Checkbox
                    checked={selectedItems.includes(order.id)}
                    onCheckedChange={() => handleToggleItem(order.id)}
                  />
                  <span className="text-xs">{order.orderId}</span>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-gray-500">{selectedItems.length} selected</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Operation</label>
            <Select value={operation} onValueChange={setOperation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="update_status">Update Status</SelectItem>
                <SelectItem value="export">Export</SelectItem>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="assign">Assign to Center</SelectItem>
                <SelectItem value="cancel">Cancel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleExecuteBatch} disabled={isProcessing || !selectedItems.length} className="w-full">
            <PlayCircle className="w-4 h-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Execute Batch'}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {jobs.jobs.length === 0 ? (
            <p className="text-sm text-gray-500">No batch jobs yet</p>
          ) : (
            jobs.jobs.slice(0, 10).map((job: any) => (
              <div key={job.id} className="p-3 border rounded">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-sm">{job.jobId}</h4>
                    <p className="text-xs text-gray-500">{job.operation} • {job.itemCount} items</p>
                  </div>
                  <Badge variant={
                    job.status === 'completed' ? 'default' :
                    job.status === 'failed' ? 'destructive' :
                    'secondary'
                  }>
                    {job.status}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <Progress value={job.progress} className="h-1" />
                  <p className="text-xs text-gray-500">
                    {job.completedCount}/{job.itemCount} completed
                    {job.failedCount > 0 && ` • ${job.failedCount} failed`}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
