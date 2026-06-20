'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Edit, Share2, Trash2, Plus, Grid } from 'lucide-react'

const MOCK_DASHBOARDS = [
  { id: '1', name: 'Executive Overview', owner: 'CEO', widgets: 6, views: 342, lastModified: new Date(Date.now() - 86400000), isPublic: true },
  { id: '2', name: 'Production Manager', owner: 'ops@company.com', widgets: 8, views: 1247, lastModified: new Date(Date.now() - 3600000), isPublic: false },
  { id: '3', name: 'Sales Performance', owner: 'sales@company.com', widgets: 5, views: 654, lastModified: new Date(Date.now() - 172800000), isPublic: true },
  { id: '4', name: 'Supply Chain', owner: 'logistics@company.com', widgets: 7, views: 892, lastModified: new Date(Date.now() - 604800000), isPublic: false },
]

const DASHBOARD_TEMPLATES = [
  { id: 'tpl1', name: 'Executive Summary', description: 'KPIs, metrics, alerts' },
  { id: 'tpl2', name: 'Operations Hub', description: 'Real-time status, workflows' },
  { id: 'tpl3', name: 'Finance Dashboard', description: 'Revenue, costs, margins' },
  { id: 'tpl4', name: 'Support Center', description: 'Tickets, updates, metrics' },
]

export function CustomDashboardsPanel() {
  const [expandedDash, setExpandedDash] = useState<string | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Custom Dashboards</h2>
        <Button onClick={() => setShowTemplates(!showTemplates)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Dashboard
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Dashboards</p>
            <p className="text-3xl font-bold">4</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Personal</p>
            <p className="text-3xl font-bold">1</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Shared</p>
            <p className="text-3xl font-bold">2</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Views</p>
            <p className="text-3xl font-bold">3.1K</p>
          </CardContent>
        </Card>
      </div>

      {/* Templates (collapsible) */}
      {showTemplates && (
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DASHBOARD_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  className="p-3 border rounded hover:bg-blue-50 cursor-pointer transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <p className="text-xs text-gray-500">{template.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    Use Template
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboards List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Dashboards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {MOCK_DASHBOARDS.map((dashboard) => (
            <div
              key={dashboard.id}
              className="p-4 border rounded hover:bg-gray-50 cursor-pointer transition"
              onClick={() => setExpandedDash(expandedDash === dashboard.id ? null : dashboard.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Grid className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{dashboard.name}</h4>
                    <p className="text-xs text-gray-500">
                      {dashboard.widgets} widgets • {dashboard.views} views
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {dashboard.isPublic && (
                    <Badge variant="outline" className="text-xs">Public</Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    By {dashboard.owner}
                  </Badge>
                </div>
              </div>

              {expandedDash === dashboard.id && (
                <div className="mt-3 pt-3 border-t space-y-2">
                  <div className="text-xs text-gray-600">
                    Last modified: {dashboard.lastModified?.toLocaleString()}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Widget Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Available Widgets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['KPI Card', 'Line Chart', 'Bar Chart', 'Gauge', 'Table', 'Timeline', 'Filter Box', 'Summary'].map((widget) => (
              <div
                key={widget}
                className="p-2 border rounded hover:bg-gray-50 text-xs text-center cursor-pointer"
              >
                {widget}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
