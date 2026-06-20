'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Button } from '@/components/ui/button'
import { TrendingUp, Download, Filter, MoreVertical } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Mock data for advanced analytics
const DEMAND_FORECAST = [
  { month: 'Jan', forecast: 4200, actual: 3800, predicted: 4100 },
  { month: 'Feb', forecast: 3900, actual: 4200, predicted: 4050 },
  { month: 'Mar', forecast: 4500, actual: 4100, predicted: 4300 },
  { month: 'Apr', forecast: 4800, actual: 4600, predicted: 4700 },
  { month: 'May', forecast: 5200, actual: 5100, predicted: 5150 },
  { month: 'Jun', forecast: 5500, actual: 5300, predicted: 5400 },
]

const COST_ANALYSIS = [
  { category: 'Materials', cost: 45000, savings: 5200 },
  { category: 'Labor', cost: 32000, savings: 3100 },
  { category: 'Equipment', cost: 28000, savings: 2800 },
  { category: 'Energy', cost: 18000, savings: 2500 },
  { category: 'Logistics', cost: 25000, savings: 3000 },
]

const PERFORMANCE_METRICS = [
  { metric: 'Efficiency', value: 87, target: 90 },
  { metric: 'Quality', value: 94, target: 95 },
  { metric: 'On-Time', value: 91, target: 95 },
  { metric: 'Utilization', value: 78, target: 85 },
  { metric: 'Safety', value: 99, target: 100 },
]

const REVENUE_BREAKDOWN = [
  { name: 'OEM Licenses', value: 240000, color: '#3B82F6' },
  { name: 'Print Services', value: 180000, color: '#8B5CF6' },
  { name: 'Lab Testing', value: 95000, color: '#10B981' },
  { name: 'Certifications', value: 75000, color: '#F59E0B' },
]

const PREDICTIVE_INSIGHTS = [
  { id: 1, title: 'Demand Spike Predicted', description: 'ML model predicts 23% increase in June', confidence: 94, risk: 'low' },
  { id: 2, title: 'Supply Chain Risk', description: 'Potential shortage in logistics partner capacity', confidence: 87, risk: 'medium' },
  { id: 3, title: 'Cost Optimization Opportunity', description: 'Energy consumption can be reduced by 15%', confidence: 91, risk: 'low' },
  { id: 4, title: 'Quality Drift Alert', description: 'Minor variance detected in material properties', confidence: 76, risk: 'medium' },
  { id: 5, title: 'Labor Productivity', description: 'Team efficiency trending +8% this quarter', confidence: 88, risk: 'low' },
]

export function AdvancedAnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState('6m')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444']

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Advanced Analytics</h1>
          <p className="text-sm text-gray-500">ML-powered insights and predictive analytics</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {PERFORMANCE_METRICS.map((m) => (
          <Card key={m.metric}>
            <CardContent className="pt-6">
              <p className="text-xs text-gray-500 mb-1">{m.metric}</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">{m.value}%</p>
                  <p className="text-xs text-gray-400">vs {m.target}% target</p>
                </div>
                <TrendingUp className={`w-5 h-5 ${m.value >= m.target ? 'text-green-500' : 'text-amber-500'}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demand Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>Demand Forecast vs Actual</CardTitle>
            <CardDescription>6-month projection with ML confidence intervals</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={DEMAND_FORECAST}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="forecast" stroke="#8B5CF6" strokeWidth={2} name="Forecast" />
                <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="predicted" stroke="#3B82F6" strokeDasharray="5 5" strokeWidth={2} name="AI Prediction" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Current period: $590,000 total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={REVENUE_BREAKDOWN} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {REVENUE_BREAKDOWN.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {REVENUE_BREAKDOWN.map((item) => (
                <div key={item.name} className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                    {item.name}
                  </span>
                  <span className="font-semibold">${(item.value / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Analysis & Savings</CardTitle>
          <CardDescription>Compare actual costs vs. optimization savings opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={COST_ANALYSIS}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cost" fill="#EF4444" name="Current Cost" />
              <Bar dataKey="savings" fill="#10B981" name="Potential Savings" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Predictive Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Predictive Insights</CardTitle>
          <CardDescription>Machine learning models analyzing trends and anomalies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {PREDICTIVE_INSIGHTS.map((insight) => (
              <div key={insight.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{insight.title}</p>
                  <p className="text-xs text-gray-600">{insight.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Confidence: {insight.confidence}%</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      insight.risk === 'low' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      Risk: {insight.risk}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
