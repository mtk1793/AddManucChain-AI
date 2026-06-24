'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Check, Clock, Plus, RefreshCw } from 'lucide-react'

const MOCK_INTEGRATIONS = [
  { id: '1', name: 'Salesforce CRM', type: 'crm', status: 'connected', lastSync: new Date(Date.now() - 3600000), recordsSync: 1247 },
  { id: '2', name: 'SAP ERP', type: 'erp', status: 'connected', lastSync: new Date(Date.now() - 7200000), recordsSync: 5432 },
  { id: '3', name: 'NetSuite', type: 'erp', status: 'error', lastSync: new Date(Date.now() - 86400000), errorMsg: 'Authentication failed' },
  { id: '4', name: 'Stripe', type: 'payment', status: 'connected', lastSync: new Date(Date.now() - 1800000), recordsSync: 542 },
  { id: '5', name: 'Shopify Inventory', type: 'inventory', status: 'connected', lastSync: new Date(Date.now() - 5400000), recordsSync: 892 },
]

export function IntegrationsPanel() {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Connected Integrations</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Connected</p>
            <p className="text-3xl font-bold text-blue-600">5</p>
            <p className="text-xs text-gray-500 mt-2">3 ERP, 1 CRM, 1 Payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Last Sync Activity</p>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-xs text-gray-500 mt-2">Active sync operations</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Errors</p>
            <p className="text-3xl font-bold text-red-600">1</p>
            <p className="text-xs text-red-600 mt-2">NetSuite auth failed</p>
          </CardContent>
        </Card>
      </div>

      {/* Integrations List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Connections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {MOCK_INTEGRATIONS.map((integration) => (
            <div
              key={integration.id}
              className="p-4 border rounded hover:bg-gray-50 cursor-pointer transition"
              onClick={() => setSelectedIntegration(selectedIntegration === integration.id ? null : integration.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      integration.status === 'connected'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  ></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{integration.name}</h4>
                    <p className="text-xs text-gray-500">{integration.type.toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{integration.status}</Badge>
                  {integration.status === 'connected' && (
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {selectedIntegration === integration.id && (
                <div className="mt-3 pt-3 border-t space-y-2">
                  {integration.status === 'connected' ? (
                    <>
                      <p className="text-xs text-gray-600">
                        Last Sync: {integration.lastSync?.toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-gray-600">
                        Records Synced: {integration.recordsSync}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">
                          Sync Now
                        </Button>
                        <Button variant="outline" size="sm">
                          Settings
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {integration.errorMsg}
                      </p>
                      <Button variant="outline" size="sm" className="text-red-600">
                        Reconnect
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
