'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Menu, X, Home, Smartphone, Inbox, Settings, ChevronLeft, ChevronRight } from 'lucide-react'

export function MobileResponsiveDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeView, setActiveView] = useState('overview')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const MOBILE_QUICKSTATS = [
    { label: 'Orders (30d)', value: '247', change: '+12%', trend: 'up' },
    { label: 'Revenue', value: '$124K', change: '+8%', trend: 'up' },
    { label: 'Efficiency', value: '87%', change: '-2%', trend: 'down' },
    { label: 'Queue', value: '23', change: '+5', trend: 'down' },
  ]

  const MOBILE_ACTIONS = [
    { id: 'new_order', label: 'New Order', icon: '➕', color: 'bg-blue-500' },
    { id: 'queue', label: 'Print Queue', icon: '🎯', color: 'bg-purple-500' },
    { id: 'report', label: 'Generate Report', icon: '📊', color: 'bg-green-500' },
    { id: 'alert', label: 'Alerts', icon: '⚠️', color: 'bg-red-500' },
  ]

  const RECENT_ACTIVITY = [
    { time: '2 min ago', text: 'Order #12847 completed', color: '✓' },
    { time: '15 min ago', text: 'Low stock alert: Materials', color: '📦' },
    { time: '1 hour ago', text: 'New certification approved', color: '✓' },
    { time: '2 hours ago', text: 'System backup completed', color: '💾' },
  ]

  const mobileNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'orders', label: 'Orders', icon: Inbox },
    { id: 'mobile-features', label: 'Mobile+', icon: Smartphone },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white border-b md:hidden">
        <div className="flex items-center justify-between p-4">
          <h1 className="font-bold text-lg">AddManuChain</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="border-t bg-gray-50 p-3 space-y-2">
            {mobileNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id)
                  setMobileMenuOpen(false)
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-blue-50 text-sm font-medium"
              >
                <item.icon className="w-4 h-4 inline mr-2" />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-3 md:p-6 space-y-4 md:space-y-6">
        {/* Quick Stats - Mobile Optimized */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-600">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {MOBILE_QUICKSTATS.map((stat, idx) => (
              <Card key={idx} className="p-3 md:p-4">
                <p className="text-xs text-gray-600">{stat.label}</p>
                <p className="text-lg md:text-xl font-bold mt-1">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions - Keyboard Friendly */}
        <Card className="md:hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {MOBILE_ACTIONS.map((action) => (
                <Button
                  key={action.id}
                  className={`h-16 flex flex-col items-center justify-center text-white ${action.color}`}
                  onClick={() => setActiveView(action.id)}
                >
                  <span className="text-xl">{action.icon}</span>
                  <span className="text-xs mt-1">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm md:text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {RECENT_ACTIVITY.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <span className="text-lg flex-shrink-0">{activity.color}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mobile Features Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm md:text-base">Mobile Features</CardTitle>
            <CardDescription>Optimized for on-the-go management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-xl">📱</span>
              <div>
                <p className="text-sm font-semibold">Offline Support</p>
                <p className="text-xs text-gray-600">Continue working without internet connection</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <span className="text-xl">🔔</span>
              <div>
                <p className="text-sm font-semibold">Push Notifications</p>
                <p className="text-xs text-gray-600">Real-time alerts and order updates</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <span className="text-xl">⚡</span>
              <div>
                <p className="text-sm font-semibold">Quick Actions</p>
                <p className="text-xs text-gray-600">Common tasks accessible from home screen</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
              <span className="text-xl">📊</span>
              <div>
                <p className="text-sm font-semibold">Mobile Dashboard</p>
                <p className="text-xs text-gray-600">Compact view optimized for touch interactions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Desktop Only - Advanced Features */}
        <div className="hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle>Desktop Features</CardTitle>
              <CardDescription>Additional capabilities available on larger screens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold">Multi-Tab Workflow</p>
                  <p className="text-sm text-gray-600 mt-2">Manage multiple workflows simultaneously</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold">Advanced Analytics</p>
                  <p className="text-sm text-gray-600 mt-2">Full dashboard with detailed metrics</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold">Custom Reports</p>
                  <p className="text-sm text-gray-600 mt-2">Build and schedule complex reports</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold">Batch Operations</p>
                  <p className="text-sm text-gray-600 mt-2">Process bulk items with keyboard shortcuts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
        <div className="flex justify-around">
          {mobileNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition ${
                activeView === item.id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile bottom spacing */}
      <div className="h-16 md:h-0" />
    </div>
  )
}
