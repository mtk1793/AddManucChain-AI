'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, AlertTriangle, DollarSign, Zap } from 'lucide-react'

const MOCK_DEMAND_DATA = {
  forecastType: 'demand',
  baselineMetric: 1240,
  forecastedMetric: 1586,
  confidence: 87,
  predictions: [
    { date: 'Apr 1', quantity: 1200 },
    { date: 'Apr 2', quantity: 1320 },
    { date: 'Apr 3', quantity: 1450 },
    { date: 'Apr 4', quantity: 1586 },
    { date: 'Apr 5', quantity: 1720 },
  ],
  recommendations: [
    'Increase inventory by 25% to meet predicted demand surge',
    'Scale up production capacity in Center 1 and Center 3',
    'Consider pre-ordering materials 2 weeks in advance',
  ]
}

const MOCK_COST_SUGGESTIONS = [
  { id: '1', description: 'Consolidate supplier shipments', category: 'logistics', priority: 'high', potentialSavings: 8500, implementationDifficulty: 'medium', timeToImplement: 4 },
  { id: '2', description: 'Optimize printer maintenance schedule', category: 'operations', priority: 'medium', potentialSavings: 3200, implementationDifficulty: 'low', timeToImplement: 2 },
  { id: '3', description: 'Batch unused material waste reduction', category: 'waste', priority: 'high', potentialSavings: 12400, implementationDifficulty: 'high', timeToImplement: 8 },
  { id: '4', description: 'Route optimization for deliveries', category: 'logistics', priority: 'medium', potentialSavings: 5600, implementationDifficulty: 'medium', timeToImplement: 3 },
  { id: '5', description: 'Renegotiate material contracts', category: 'procurement', priority: 'high', potentialSavings: 22000, implementationDifficulty: 'high', timeToImplement: 6 },
]

const MOCK_RISK_DATA = {
  forecastType: 'risk',
  predictions: [
    { date: 'Apr 1', riskScore: 25 },
    { date: 'Apr 2', riskScore: 32 },
    { date: 'Apr 3', riskScore: 28 },
    { date: 'Apr 4', riskScore: 45 },
    { date: 'Apr 5', riskScore: 38 },
  ]
}

export function AnalyticsPanel() {
  const [predictions] = useState({ forecasts: [MOCK_DEMAND_DATA, MOCK_RISK_DATA] })
  const [optimizations] = useState({ 
    suggestions: MOCK_COST_SUGGESTIONS,
    totalPotentialSavings: MOCK_COST_SUGGESTIONS.reduce((sum, s) => sum + s.potentialSavings, 0)
  })
  
  const demandForecast = MOCK_DEMAND_DATA
  const riskForecast = MOCK_RISK_DATA
  
  return (
    <div className="space-y-6">
      {/* Demand Forecast */}
      {demandForecast && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Demand Forecast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-xs text-gray-600">Baseline</p>
                <p className="text-lg font-semibold">{demandForecast.baselineMetric}</p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <p className="text-xs text-gray-600">Forecast</p>
                <p className="text-lg font-semibold">{demandForecast.forecastedMetric}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <p className="text-xs text-gray-600">Confidence</p>
                <p className="text-lg font-semibold">{Math.round(demandForecast.confidence)}%</p>
              </div>
            </div>
            
            {demandForecast.predictions.length > 0 && (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={demandForecast.predictions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="quantity" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            )}
            
            {demandForecast.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recommendations:</h4>
                {demandForecast.recommendations.map((rec: string, i: number) => (
                  <p key={i} className="text-xs text-gray-600 pl-3 border-l-2 border-blue-300">
                    • {rec}
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Cost Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Cost Optimization Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_COST_SUGGESTIONS.slice(0, 5).map((suggestion: any) => (
            <div key={suggestion.id} className="p-3 border rounded">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-sm">{suggestion.description}</h4>
                  <p className="text-xs text-gray-500">{suggestion.category} • {suggestion.priority}</p>
                </div>
                <Badge variant="outline" className="ml-2">
                  ${suggestion.potentialSavings}
                </Badge>
              </div>
              
              <Progress
                value={Math.round((suggestion.potentialSavings / 1000) * 100)}
                className="h-1 mb-2"
              />
              
              <p className="text-xs text-gray-600">
                Implementation: {suggestion.implementationDifficulty} • ~{suggestion.timeToImplement}h
              </p>
            </div>
          ))}
          
          {optimizations.totalPotentialSavings > 0 && (
            <div className="p-3 bg-green-50 rounded border-2 border-green-200">
              <p className="text-xs text-gray-600">Total Potential Savings</p>
              <p className="text-2xl font-bold text-green-600">${optimizations.totalPotentialSavings}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Risk Analysis */}
      {riskForecast && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {riskForecast.predictions.length > 0 && (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={riskForecast.predictions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="riskScore" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
