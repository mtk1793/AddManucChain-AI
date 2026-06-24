'use client'

import React, { useState, useCallback, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, Cell,
} from 'recharts'
import { Plus, Play, Pause, Settings, AlertCircle, CheckCircle, Clock, Trash2, Edit2 } from 'lucide-react'

interface WorkflowStep {
  id: string
  name: string
  type: 'trigger' | 'condition' | 'action' | 'notification'
  config: Record<string, unknown>
}

interface AutomationRule {
  id: string
  name: string
  enabled: boolean
  steps: WorkflowStep[]
  createdAt: Date
  lastExecuted?: Date
  executionCount: number
}

interface AutomationMetrics {
  totalRules: number
  activeRules: number
  executionsToday: number
  successRate: number
  averageExecutionTime: number
}

interface ExecutionResult {
  success: boolean
  message: string
  executionTime?: number
}

export default function WorkflowAutomationBuilder() {
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [metrics, setMetrics] = useState<AutomationMetrics>({
    totalRules: 0,
    activeRules: 0,
    executionsToday: 0,
    successRate: 100,
    averageExecutionTime: 0,
  })
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null)
  const [showBuilder, setShowBuilder] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)
  const [loading, setLoading] = useState(false)
  const [executionResults, setExecutionResults] = useState<ExecutionResult | null>(null)
  const [newRuleName, setNewRuleName] = useState('')

  // Load metrics on component mount
  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/automation/submit-order?action=stats')
      const data = await response.json()
      
      if (data.success && data.stats) {
        setMetrics(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    }
  }

  const executeWorkflow = useCallback(async (rule: AutomationRule) => {
    setLoading(true)
    const startTime = performance.now()
    
    try {
      // Submit the workflow for automation
      const response = await fetch('/api/automation/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submit_order',
          order: {
            orderId: `WORKFLOW-${rule.id}-${Date.now()}`,
            customerId: 'automation',
            items: rule.steps.map((step, idx) => ({
              id: step.id,
              name: step.name,
              type: step.type,
              order: idx,
            })),
            priority: 'high',
            notes: `Automated workflow: ${rule.name}`,
          },
        }),
      })

      const data = await response.json()
      const executionTime = performance.now() - startTime

      if (data.success) {
        setExecutionResults({
          success: true,
          message: `Workflow "${rule.name}" executed successfully`,
          executionTime: Math.round(executionTime),
        })

        // Update rule execution count
        const updatedRules = rules.map((r) =>
          r.id === rule.id
            ? {
                ...r,
                lastExecuted: new Date(),
                executionCount: r.executionCount + 1,
              }
            : r
        )
        setRules(updatedRules)

        // Refresh metrics
        await new Promise((resolve) => setTimeout(resolve, 500))
        fetchMetrics()
      } else {
        setExecutionResults({
          success: false,
          message: data.error || 'Workflow execution failed',
        })
      }
    } catch (error) {
      setExecutionResults({
        success: false,
        message: error instanceof Error ? error.message : 'Workflow execution failed',
      })
    } finally {
      setLoading(false)
    }
  }, [rules])

  const toggleRuleEnabled = (ruleId: string) => {
    setRules(
      rules.map((rule) =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    )
  }

  const deleteRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule.id !== ruleId))
  }

  const createNewRule = () => {
    if (!newRuleName.trim()) return

    const newRule: AutomationRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName,
      enabled: true,
      steps: [],
      createdAt: new Date(),
      executionCount: 0,
    }

    setRules([...rules, newRule])
    setNewRuleName('')
    setSelectedRule(newRule)
    setShowBuilder(true)
  }

  const addStepToRule = (type: WorkflowStep['type']) => {
    if (!selectedRule) return

    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      name: `${type} step`,
      type,
      config: {},
    }

    const updatedRule = {
      ...selectedRule,
      steps: [...selectedRule.steps, newStep],
    }

    setSelectedRule(updatedRule)
    const updatedRules = rules.map((r) => (r.id === updatedRule.id ? updatedRule : r))
    setRules(updatedRules)
  }

  const executionTimeData = rules
    .filter((r) => r.lastExecuted)
    .slice(-10)
    .map((r) => ({
      name: r.name,
      time: Math.random() * 1000 + 100, // Simulated execution time
      status: r.enabled ? 'active' : 'inactive',
    }))

  const metricsData = [
    { name: 'Total Rules', value: metrics.totalRules, color: '#3b82f6' },
    { name: 'Active', value: metrics.activeRules, color: '#10b981' },
    { name: 'Executions Today', value: metrics.executionsToday, color: '#f59e0b' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Workflow Automation</h1>
          <p className="text-slate-400">Build and manage automated order workflows</p>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Rules</p>
                <p className="text-3xl font-bold text-white">{metrics.totalRules}</p>
              </div>
              <Settings className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Rules</p>
                <p className="text-3xl font-bold text-white">{metrics.activeRules}</p>
              </div>
              <Play className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Executions Today</p>
                <p className="text-3xl font-bold text-white">{metrics.executionsToday}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Success Rate</p>
                <p className="text-3xl font-bold text-white">{metrics.successRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Rules List */}
          <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Automation Rules</h2>
              <button
                onClick={() => setShowBuilder(!showBuilder)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                <Plus className="w-4 h-4" />
                New Rule
              </button>
            </div>

            {/* New Rule Input */}
            {showBuilder && (
              <div className="mb-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    placeholder="Enter rule name..."
                    className="flex-1 bg-slate-600 text-white px-3 py-2 rounded border border-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={createNewRule}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                  >
                    Create
                  </button>
                </div>

                {/* Selected Rule Steps */}
                {selectedRule && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">{selectedRule.name}</h3>
                    <div className="space-y-2">
                      {selectedRule.steps.map((step) => (
                        <div
                          key={step.id}
                          className="flex items-center justify-between bg-slate-800 p-3 rounded border border-slate-600"
                        >
                          <span className="text-slate-300">{step.name}</span>
                          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                            {step.type}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Add Step Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={() => addStepToRule('trigger')}
                        className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded transition"
                      >
                        + Trigger
                      </button>
                      <button
                        onClick={() => addStepToRule('condition')}
                        className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded transition"
                      >
                        + Condition
                      </button>
                      <button
                        onClick={() => addStepToRule('action')}
                        className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded transition"
                      >
                        + Action
                      </button>
                      <button
                        onClick={() => addStepToRule('notification')}
                        className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded transition"
                      >
                        + Notification
                      </button>
                    </div>

                    {/* Save Rule */}
                    <button
                      onClick={() => {
                        setShowBuilder(false)
                        setSelectedRule(null)
                      }}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                    >
                      Save & Close
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Rules List */}
            <div className="space-y-2">
              {rules.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No automation rules yet</p>
              ) : (
                rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-4 bg-slate-700 rounded border border-slate-600 hover:border-slate-500 transition"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{rule.name}</h3>
                      <p className="text-sm text-slate-400">
                        {rule.steps.length} steps • {rule.executionCount} executions
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleRuleEnabled(rule.id)}
                        className={`px-3 py-1 rounded text-sm transition ${
                          rule.enabled
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-slate-600 hover:bg-slate-500 text-slate-300'
                        }`}
                      >
                        {rule.enabled ? 'Active' : 'Inactive'}
                      </button>

                      <button
                        onClick={() => executeWorkflow(rule)}
                        disabled={loading || !rule.enabled}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-3 py-1 rounded text-sm transition"
                      >
                        <Play className="w-3 h-3" />
                        Run
                      </button>

                      <button
                        onClick={() => {
                          setSelectedRule(rule)
                          setShowBuilder(true)
                        }}
                        className="flex items-center gap-1 bg-slate-600 hover:bg-slate-500 text-slate-300 px-3 py-1 rounded text-sm transition"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Execution Results Panel */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Execution Status</h2>

            {executionResults && (
              <div
                className={`p-4 rounded-lg border ${
                  executionResults.success
                    ? 'bg-green-900 border-green-700'
                    : 'bg-red-900 border-red-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  {executionResults.success ? (
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  )}
                  <div>
                    <p className={executionResults.success ? 'text-green-200' : 'text-red-200'}>
                      {executionResults.message}
                    </p>
                    {executionResults.executionTime && (
                      <p className="text-sm text-slate-300 mt-2">
                        Execution time: {executionResults.executionTime}ms
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              {showMetrics ? 'Hide' : 'Show'} Metrics
            </button>
          </div>
        </div>

        {/* Charts */}
        {showMetrics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Execution Time Chart */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Recent Execution Times</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={executionTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  />
                  <Bar dataKey="time" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Metrics Overview Chart */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Metrics Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metricsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {metricsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
