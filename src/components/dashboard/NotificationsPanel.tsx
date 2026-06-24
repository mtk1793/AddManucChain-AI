'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, CheckCircle2, AlertCircle, InfoIcon, Trash2 } from 'lucide-react'
import useSWR from 'swr'

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Order #ORD-2025-142 Ready', message: 'Your order has been approved and is ready for production', severity: 'info', read: false, createdAt: new Date() },
  { id: '2', title: 'Critical: Material Shortage', message: 'Material "Titanium Grade-A" stock is running low. Current stock: 15 units', severity: 'critical', read: false, createdAt: new Date(Date.now() - 1*60*60*1000) },
  { id: '3', title: 'Batch Job #BATCH-001 Completed', message: '245 orders successfully processed and exported to Excel', severity: 'info', read: true, createdAt: new Date(Date.now() - 3*60*60*1000) },
  { id: '4', title: 'Warning: Center 3 Capacity', message: 'Center 3 is operating at 92% capacity. Consider load balancing.', severity: 'warning', read: true, createdAt: new Date(Date.now() - 6*60*60*1000) },
  { id: '5', title: 'System Maintenance Scheduled', message: 'Scheduled maintenance on April 10, 2026 from 2:00 AM - 4:00 AM UTC', severity: 'info', read: true, createdAt: new Date(Date.now() - 24*60*60*1000) },
]

export function NotificationsPanel() {
  const [data, setData] = useState({ notifications: MOCK_NOTIFICATIONS, unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.read).length })
  const mutate = () => setData({ notifications: MOCK_NOTIFICATIONS, unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.read).length })
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  const handleMarkAsRead = async (notificationId: string) => {
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId, read: true }),
    })
    mutate()
  }
  
  const handleClearAll = async () => {
    await fetch('/api/notifications', { method: 'DELETE' })
    mutate()
  }
  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <InfoIcon className="w-5 h-5 text-blue-500" />
    }
  }
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
      case 'critical':
        return 'destructive'
      case 'warning':
        return 'secondary'
      default:
        return 'default'
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <div className="flex gap-2">
          {data?.unreadCount > 0 && (
            <Badge variant="destructive">{data.unreadCount} new</Badge>
          )}
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            Clear All
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[500px] border rounded-lg p-4">
        <div className="space-y-2">
          {data?.notifications?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-2" />
              <p className="text-sm text-gray-500">All caught up!</p>
            </div>
          ) : (
            data?.notifications?.map((notification: any) => (
              <div
                key={notification.id}
                className={`p-3 rounded border cursor-pointer transition ${
                  notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                }`}
                onClick={() => setExpandedId(expandedId === notification.id ? null : notification.id)}
              >
                <div className="flex items-start gap-3">
                  {getSeverityIcon(notification.severity)}
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">{notification.title}</h3>
                      <Badge variant={getSeverityColor(notification.severity)}>
                        {notification.severity}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    
                    {expandedId === notification.id && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        <p className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            {notification.read ? 'Mark as unread' : 'Mark as read'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
