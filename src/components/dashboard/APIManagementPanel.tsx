'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Copy, Eye, EyeOff, Key, Trash2 } from 'lucide-react'

const MOCK_API_KEYS = [
  { id: '1', name: 'Production API', keyPrefix: 'pk_live_', created: new Date(Date.now() - 2592000000), lastUsed: new Date(Date.now() - 60000), rateLimit: 1000, requests: 24567 },
  { id: '2', name: 'Development API', keyPrefix: 'pk_test_', created: new Date(Date.now() - 5184000000), lastUsed: new Date(Date.now() - 300000), rateLimit: 100, requests: 5234 },
  { id: '3', name: 'Partner Integration', keyPrefix: 'pk_partner_', created: new Date(Date.now() - 7776000000), lastUsed: new Date(Date.now() - 3600000), rateLimit: 500, requests: 12456 },
]

export function APIManagementPanel() {
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({})

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">API Keys & Integration</h2>
        <Button>
          <Key className="w-4 h-4 mr-2" />
          Generate New Key
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Active Keys</p>
            <p className="text-3xl font-bold">3</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Req (Month)</p>
            <p className="text-3xl font-bold">42.2K</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Success Rate</p>
            <p className="text-3xl font-bold text-green-600">99.8%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Avg Latency</p>
            <p className="text-3xl font-bold">145ms</p>
          </CardContent>
        </Card>
      </div>

      {/* API Keys List */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_API_KEYS.map((key) => (
            <div
              key={key.id}
              className="p-4 border rounded hover:bg-gray-50 cursor-pointer transition"
              onClick={() => setExpandedKey(expandedKey === key.id ? null : key.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{key.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                      {key.keyPrefix}••••••••••••
                    </code>
                  </div>
                </div>
                <Badge variant="outline">{key.requests} req</Badge>
              </div>

              {expandedKey === key.id && (
                <div className="mt-3 pt-3 border-t space-y-2">
                  <div className="text-xs space-y-1 mb-3">
                    <p className="text-gray-600">
                      Created: {key.created?.toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      Last Used: {key.lastUsed?.toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      Rate Limit: {key.rateLimit} req/min
                    </p>
                  </div>

                  <div className="p-2 bg-gray-50 rounded mb-3">
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-mono">
                        {visibleKeys[key.id]
                          ? `pk_live_${Math.random().toString(36).substring(7)}${Math.random().toString(36).substring(7)}`
                          : `pk_live_••••••••••••••••`}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(key.id)}
                      >
                        {visibleKeys[key.id] ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      Rotate
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-3 h-3 mr-1" />
                      Revoke
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            API Documentation
          </Button>
          <Button variant="outline" size="sm">
            Code Examples
          </Button>
          <Button variant="outline" size="sm">
            Rate Limit Info
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
