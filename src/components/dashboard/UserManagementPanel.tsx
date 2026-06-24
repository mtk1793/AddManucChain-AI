'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { UserPlus, Shield, Trash2, Clock } from 'lucide-react'

const MOCK_USERS = [
  { id: '1', name: 'John Smith', email: 'john@company.com', role: 'admin', status: 'active', lastLogin: new Date(Date.now() - 3600000) },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'manager', status: 'active', lastLogin: new Date(Date.now() - 7200000) },
  { id: '3', name: 'Mike Chen', email: 'mike@company.com', role: 'operator', status: 'active', lastLogin: new Date(Date.now() - 86400000) },
  { id: '4', name: 'Lisa Wang', email: 'lisa@company.com', role: 'viewer', status: 'inactive', lastLogin: new Date(Date.now() - 604800000) },
  { id: '5', name: 'David Brown', email: 'david@company.com', role: 'analyst', status: 'active', lastLogin: new Date(Date.now() - 300000) },
]

const ROLE_COLORS: Record<string, string> = {
  admin: 'destructive',
  manager: 'default',
  operator: 'secondary',
  analyst: 'outline',
  viewer: 'outline',
}

export function UserManagementPanel() {
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filteredUsers = MOCK_USERS.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">User Management</h2>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-3xl font-bold">5</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-3xl font-bold text-green-600">4</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Admins</p>
            <p className="text-3xl font-bold">1</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Pending Invites</p>
            <p className="text-3xl font-bold">2</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-4 border rounded hover:bg-gray-50 cursor-pointer transition"
              onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-bold">
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{user.name}</h4>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={ROLE_COLORS[user.role]}>{user.role}</Badge>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                </div>
              </div>

              {expandedUser === user.id && (
                <div className="mt-3 pt-3 border-t space-y-3">
                  <div className="text-xs">
                    <p className="text-gray-600 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Last Login: {user.lastLogin?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Shield className="w-3 h-3 mr-1" />
                      Change Role
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-3 h-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
