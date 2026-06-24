'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { TrendingUp, DollarSign, Clock, Package, Factory, ArrowRight, Leaf } from 'lucide-react'
import { useStats, useOrders, useBlueprints, useCenters, useComparativeMetrics, useEnvironmentalImpact } from '@/hooks/use-dashboard'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'

const categoryColors: Record<string, string> = {
  'Structural': '#0EA5E9',
  'Hydraulic': '#14B8A6',
  'Rotating': '#F59E0B',
  'Thermal': '#10B981',
  'Seals': '#6366F1',
  'Coupling': '#EC4899',
  'Electrical': '#8B5CF6',
}

export function AnalyticsPage({ role = 'admin' }: { role?: string }) {
  // Role-specific default customer / view scope
  const defaultCustomer = role === 'end_user' ? 'CUST-001'
    : role === 'manager' ? 'CUST-002'
    : 'CUST-001'
  const [selectedCustomer, setSelectedCustomer] = useState(defaultCustomer)
  const { stats, isLoading: statsLoading } = useStats()
  const { orders } = useOrders()
  const { blueprints } = useBlueprints()
  const { centers } = useCenters()
  const { comparativeMetrics } = useComparativeMetrics(selectedCustomer)
  const { environmentalImpact } = useEnvironmentalImpact()

  // Calculate environmental totals
  const envTotals = {
    co2Saved: environmentalImpact.reduce((sum: number, record: any) => sum + record.co2SavedKg, 0),
    milesAvoided: environmentalImpact.reduce((sum: number, record: any) => sum + record.milesAvoided, 0),
    wasteReduced: environmentalImpact.reduce((sum: number, record: any) => sum + record.wasteReduced, 0),
  }

  // Calculate comparative averages from metrics
  const comparativeAvg = comparativeMetrics.length > 0 ? {
    leadTimeReduction: comparativeMetrics.reduce((sum: number, m: any) => sum + m.leadTimeReduction, 0) / comparativeMetrics.length,
    warehouseSavings: comparativeMetrics.reduce((sum: number, m: any) => sum + m.warehouseSavings, 0) / comparativeMetrics.length,
    traditionalLeadTime: comparativeMetrics.reduce((sum: number, m: any) => sum + m.traditionalLeadTime, 0) / comparativeMetrics.length,
    almatechLeadTime: comparativeMetrics.reduce((sum: number, m: any) => sum + m.almatechLeadTime, 0) / comparativeMetrics.length,
    partsRepaired: comparativeMetrics.reduce((sum: number, m: any) => sum + m.partsRepaired, 0),
    partsReplaced: comparativeMetrics.reduce((sum: number, m: any) => sum + m.partsReplaced, 0),
    designIterations: comparativeMetrics.reduce((sum: number, m: any) => sum + m.designIterations, 0),
  } : null

  if (statsLoading) {
    return (
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    )
  }

  // Calculate real stats from data
  const kpis = [
    {
      title: 'Total Orders',
      value: stats?.kpis?.totalOrders?.toString() || '0',
      change: '+15.2%',
      trend: 'up',
      icon: Package,
    },
    {
      title: 'Avg Lead Time',
      value: `${stats?.kpis?.avgLeadTime || 0} days`,
      change: '-33% vs traditional',
      trend: 'up',
      icon: Clock,
    },
    {
      title: 'Cost Savings',
      value: `$${Math.round((stats?.kpis?.costSavings || 0) / 1000)}K`,
      change: 'YTD',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Print Efficiency',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: Factory,
    },
  ]

  // Group orders by status
  const ordersByStatus = [
    { status: 'Pending', count: orders.filter((o: any) => o.status === 'pending').length, color: '#64748B' },
    { status: 'Printing', count: orders.filter((o: any) => o.status === 'printing').length, color: '#0EA5E9' },
    { status: 'QC', count: orders.filter((o: any) => o.status === 'quality_check').length, color: '#F59E0B' },
    { status: 'Shipped', count: orders.filter((o: any) => o.status === 'shipped').length, color: '#14B8A6' },
    { status: 'Delivered', count: orders.filter((o: any) => o.status === 'delivered').length, color: '#10B981' },
  ]

  // Group blueprints by category
  const blueprintCategories = blueprints.reduce((acc: any, bp: any) => {
    const cat = bp.category
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {})

  const categoryData = Object.entries(blueprintCategories).map(([name, value]) => ({
    name,
    value,
    color: categoryColors[name] || '#64748B',
  }))

  // Center performance
  const centerPerformance = centers.map((center: any) => ({
    center: center.name,
    jobs: center.currentJobs + center.completedToday * 7,
    avgTime: 3.5 + Math.random() * 2,
    quality: 95 + Math.random() * 4,
  }))

  // Monthly trend data (simulated based on actual counts)
  const monthlyData = [
    { month: 'Aug', orders: Math.floor((stats?.kpis?.totalOrders || 0) * 0.12), delivered: Math.floor((stats?.kpis?.deliveredParts || 0) * 0.1) },
    { month: 'Sep', orders: Math.floor((stats?.kpis?.totalOrders || 0) * 0.14), delivered: Math.floor((stats?.kpis?.deliveredParts || 0) * 0.12) },
    { month: 'Oct', orders: Math.floor((stats?.kpis?.totalOrders || 0) * 0.16), delivered: Math.floor((stats?.kpis?.deliveredParts || 0) * 0.15) },
    { month: 'Nov', orders: Math.floor((stats?.kpis?.totalOrders || 0) * 0.18), delivered: Math.floor((stats?.kpis?.deliveredParts || 0) * 0.18) },
    { month: 'Dec', orders: Math.floor((stats?.kpis?.totalOrders || 0) * 0.2), delivered: Math.floor((stats?.kpis?.deliveredParts || 0) * 0.22) },
    { month: 'Jan', orders: Math.floor((stats?.kpis?.totalOrders || 0) * 0.2), delivered: Math.floor((stats?.kpis?.deliveredParts || 0) * 0.23) },
  ]

  const leadTimeData = [
    { month: 'Aug', traditional: 63, amchain: 5.8 },
    { month: 'Sep', traditional: 63, amchain: 5.2 },
    { month: 'Oct', traditional: 63, amchain: 4.8 },
    { month: 'Nov', traditional: 63, amchain: 4.5 },
    { month: 'Dec', traditional: 63, amchain: 4.3 },
    { month: 'Jan', traditional: 63, amchain: 4.2 },
  ]

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Role Context Banner */}
      {role === 'end_user' && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-sky-50 border-sky-200 text-sky-800 text-sm font-medium">
          📦 Your Impact Dashboard — showing cost savings, lead time reductions, and environmental metrics for your orders.
        </div>
      )}
      {role === 'print_center' && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-teal-50 border-teal-200 text-teal-800 text-sm font-medium">
          🏭 Facility Analytics — utilization, throughput, and quality metrics for your print center.
        </div>
      )}
      {role === 'oem_partner' && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-purple-50 border-purple-200 text-purple-800 text-sm font-medium">
          🔑 IP Performance — royalty revenue, print counts by blueprint, and partner adoption trends.
        </div>
      )}
      {(role === 'manager' || role === 'admin') && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-amber-50 border-amber-200 text-amber-800 text-sm font-medium">
          📊 Platform-wide analytics — all customers, centers, and partners.
        </div>
      )}

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#0F172A]">Performance Analytics</h2>
        <Select defaultValue="6months">
          <SelectTrigger className="w-40 bg-white border-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{kpi.title}</p>
                  <p className="text-2xl font-bold text-[#0F172A]">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-[#14B8A6]" />
                    <span className="text-sm text-[#14B8A6]">{kpi.change}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
                  <kpi.icon className="w-5 h-5 text-[#0EA5E9]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#0F172A]">Orders & Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="orders" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="delivered" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#0EA5E9]" />
                <span className="text-sm text-slate-600">Orders</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#14B8A6]" />
                <span className="text-sm text-slate-600">Delivered</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lead Time Comparison */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#0F172A]">
              Lead Time: Traditional vs AddManuChain (days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={leadTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="traditional"
                    stroke="#94A3B8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="amchain"
                    stroke="#0EA5E9"
                    strokeWidth={3}
                    dot={{ fill: '#0EA5E9', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-slate-400" style={{ borderStyle: 'dashed' }} />
                <span className="text-sm text-slate-600">Traditional (63 days)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-[#0EA5E9]" />
                <span className="text-sm text-slate-600">AddManuChain</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parts by Category */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#0F172A]">Blueprints by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#0F172A]">Orders by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersByStatus} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" stroke="#64748B" fontSize={12} />
                  <YAxis dataKey="status" type="category" stroke="#64748B" fontSize={12} width={60} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {ordersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Print Center Performance */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#0F172A]">Center Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {centerPerformance.map((center: any, index: number) => (
                <div key={index} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-[#0F172A]">{center.center}</span>
                    <span className="text-sm text-[#14B8A6]">{center.quality.toFixed(1)}% quality</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Jobs:</span>
                      <span className="ml-2 font-medium text-[#0F172A]">{center.jobs}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Avg Time:</span>
                      <span className="ml-2 font-medium text-[#0F172A]">{center.avgTime.toFixed(1)} days</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparative Analysis Section */}
      {comparativeAvg && (
        <>
          <div className="flex items-center justify-between mt-8">
            <h2 className="text-lg font-semibold text-[#0F172A]">Just-on-Time vs Just-in-Case Comparison</h2>
            <Badge className="bg-[#14B8A6]/10 text-[#14B8A6] hover:bg-[#14B8A6]/20">
              Avg {comparativeAvg.leadTimeReduction.toFixed(1)}% faster
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lead Time Comparison Card */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#0F172A]">Lead Time Reduction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Traditional (OEM)</p>
                      <p className="text-3xl font-bold text-slate-600">{Math.round(comparativeAvg.traditionalLeadTime)} days</p>
                    </div>
                    <ArrowRight className="w-8 h-8 text-[#0EA5E9]" />
                    <div>
                      <p className="text-sm text-slate-500 mb-1">AddManuChain</p>
                      <p className="text-3xl font-bold text-[#0EA5E9]">{Math.round(comparativeAvg.almatechLeadTime)} days</p>
                    </div>
                  </div>
                  <div className="p-4 bg-[#14B8A6]/10 rounded-lg">
                    <p className="text-sm font-medium text-[#14B8A6] mb-1">Time Saved</p>
                    <p className="text-2xl font-bold text-[#14B8A6]">
                      {Math.round(comparativeAvg.traditionalLeadTime - comparativeAvg.almatechLeadTime)} days
                      <span className="text-sm font-normal ml-2">({comparativeAvg.leadTimeReduction.toFixed(1)}% reduction)</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warehouse Cost Savings Card */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#0F172A]">Warehouse Cost Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Traditional Inventory</p>
                      <p className="text-3xl font-bold text-slate-600">
                        ${Math.round(comparativeMetrics[comparativeMetrics.length - 1]?.traditionalWarehouseCost / 1000)}K
                      </p>
                    </div>
                    <ArrowRight className="w-8 h-8 text-[#0EA5E9]" />
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Digital Inventory</p>
                      <p className="text-3xl font-bold text-[#0EA5E9]">
                        ${Math.round(comparativeMetrics[comparativeMetrics.length - 1]?.almatechWarehouseCost / 1000)}K
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-[#14B8A6]/10 rounded-lg">
                    <p className="text-sm font-medium text-[#14B8A6] mb-1">Monthly Savings</p>
                    <p className="text-2xl font-bold text-[#14B8A6]">
                      ${Math.round((comparativeMetrics[comparativeMetrics.length - 1]?.traditionalWarehouseCost - comparativeMetrics[comparativeMetrics.length - 1]?.almatechWarehouseCost) / 1000)}K
                      <span className="text-sm font-normal ml-2">({comparativeAvg.warehouseSavings.toFixed(1)}% reduction)</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Comparative Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Part Repair vs Replace */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#0F172A]">Part Repair Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Repaired</span>
                    <span className="text-2xl font-bold text-[#14B8A6]">{comparativeAvg.partsRepaired}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Replaced</span>
                    <span className="text-2xl font-bold text-[#0EA5E9]">{comparativeAvg.partsReplaced}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-sm text-slate-500">Material Savings</p>
                    <p className="text-lg font-bold text-[#0F172A]">
                      {((comparativeAvg.partsRepaired / (comparativeAvg.partsRepaired + comparativeAvg.partsReplaced)) * 100).toFixed(1)}% repaired
                    </p>
                  </div>
                  <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                    <p className="text-xs text-[#F59E0B]">
                      Traditional OEM model requires 100% replacement. AddManuChain enables selective repair.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Design Flexibility */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#0F172A]">Design Flexibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <p className="text-4xl font-bold text-[#0EA5E9]">{comparativeAvg.designIterations}</p>
                    <p className="text-sm text-slate-500 mt-2">Custom Design Iterations</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-600 mb-2">Traditional OEM</p>
                    <p className="text-xs text-slate-600">❌ No design flexibility</p>
                    <p className="text-xs text-slate-600">❌ Fixed specifications</p>
                  </div>
                  <div className="p-3 bg-[#14B8A6]/10 rounded-lg">
                    <p className="text-sm font-medium text-[#14B8A6] mb-2">AddManuChain</p>
                    <p className="text-xs text-[#0F172A]">✓ Custom modifications</p>
                    <p className="text-xs text-[#0F172A]">✓ Rapid iteration</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Environmental Impact */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-[#14B8A6]" />
                  Environmental Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-[#14B8A6]/10 rounded-lg">
                    <p className="text-sm text-slate-500">CO₂ Saved</p>
                    <p className="text-2xl font-bold text-[#14B8A6]">{Math.round(envTotals.co2Saved)} kg</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-slate-500">Miles Avoided</p>
                    <p className="text-2xl font-bold text-[#0EA5E9]">{envTotals.milesAvoided.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-slate-500">Waste Reduced</p>
                    <p className="text-2xl font-bold text-[#F59E0B]">{envTotals.wasteReduced.toFixed(1)} kg</p>
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs text-slate-600">
                      On-site production eliminates long-distance transportation and reduces environmental footprint.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
