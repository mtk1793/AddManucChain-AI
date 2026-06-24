'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Activity, AlertCircle, Zap, Server } from 'lucide-react'

const MOCK_HEALTH = {
  status: 'healthy',
  uptime: 672,
  cpu: { usage: 34, limit: 80 },
  memory: { usage: 5.2, limit: 8 },
  disk: { usage: 78, limit: 100 },
  database: { status: 'connected', latency: 12, connections: 24 },
  services: [
    { name: 'Auth Service', status: 'up', uptime: 672 },
    { name: 'Order Service', status: 'up', uptime: 672 },
    { name: 'Print Service', status: 'up', uptime: 671 },
    { name: 'Notification Service', status: 'up', uptime: 672 },
  ],
}

const MOCK_ALERTS = [
  { id: '1', severity: 'critical', title: 'High CPU Usage', message: 'CPU usage at 85%' },
  { id: '2', severity: 'warning', title: 'Database Latency', message: 'Database latency increased to 890ms' },
  { id: '3', severity: 'warning', title: 'Low Disk Space', message: 'Disk usage at 89%' },
]

export function MonitoringPanel() {
  const [expandedService, setExpandedService] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">System Status</p>
                <p className="text-lg font-bold text-green-600">Healthy</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-xs text-gray-500">Uptime</p>
              <p className="text-lg font-bold">{MOCK_HEALTH.uptime}h</p>
              <p className="text-xs text-gray-400">28 days</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-xs text-gray-500">API Response Time</p>
              <p className="text-lg font-bold">145ms</p>
              <p className="text-xs text-green-600">↓ 12%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-xs text-gray-500">Error Rate</p>
              <p className="text-lg font-bold">0.2%</p>
              <p className="text-xs text-green-600">Low</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium">CPU</label>
              <span className="text-sm font-bold">{MOCK_HEALTH.cpu.usage}%</span>
            </div>
            <Progress value={MOCK_HEALTH.cpu.usage} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium">Memory</label>
              <span className="text-sm font-bold">{MOCK_HEALTH.memory.usage}GB / {MOCK_HEALTH.memory.limit}GB</span>
            </div>
            <Progress value={(MOCK_HEALTH.memory.usage / MOCK_HEALTH.memory.limit) * 100} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium">Disk</label>
              <span className="text-sm font-bold">{MOCK_HEALTH.disk.usage}%</span>
            </div>
            <Progress value={MOCK_HEALTH.disk.usage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Services Status */}
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {MOCK_HEALTH.services.map((service) => (
            <div
              key={service.name}
              className="p-3 border rounded hover:bg-gray-50 cursor-pointer transition"
              onClick={() => setExpandedService(expandedService === service.name ? null : service.name)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">{service.name}</span>
                </div>
                <Badge variant="outline" className="text-xs">Up {service.uptime}h</Badge>
              </div>
              {expandedService === service.name && (
                <div className="mt-2 pt-2 border-t text-xs text-gray-500 space-y-1">
                  <p>✓ Last health check: 2 minutes ago</p>
                  <p>✓ Request latency: 45ms avg</p>
                  <p>✓ Error rate: 0.1%</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Active Alerts ({MOCK_ALERTS.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {MOCK_ALERTS.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded border-l-4 ${
                alert.severity === 'critical'
                  ? 'bg-red-50 border-l-red-500'
                  : 'bg-yellow-50 border-l-yellow-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-sm">{alert.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                </div>
                <Badge
                  variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}
                >
                  {alert.severity}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
