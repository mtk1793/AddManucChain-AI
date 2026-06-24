'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Toggle } from '@/components/ui/toggle'
import { Play, Pause, Plus, TrendingUp } from 'lucide-react'

const MOCK_WORKFLOWS = [
  { id: '1', name: 'Auto-Approve Small Orders', status: 'active', triggers: 1, actions: 2, executionCount: 847, lastRun: new Date(Date.now() - 300000) },
  { id: '2', name: 'Material Shortage Alert', status: 'active', triggers: 1, actions: 3, executionCount: 24, lastRun: new Date(Date.now() - 7200000) },
  { id: '3', name: 'End-of-Day Report', status: 'active', triggers: 1, actions: 2, executionCount: 92, lastRun: new Date(Date.now() - 86400000) },
  { id: '4', name: 'Order Reassignment', status: 'paused', triggers: 2, actions: 4, executionCount: 156, lastRun: new Date(Date.now() - 604800000) },
  { id: '5', name: 'Quality Check Escalation', status: 'active', triggers: 1, actions: 3, executionCount: 32, lastRun: new Date(Date.now() - 3600000) },
]

export function AutomationPanel() {
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null)
  const [workflowStates, setWorkflowStates] = useState<Record<string, string>>(
    Object.fromEntries(MOCK_WORKFLOWS.map(w => [w.id, w.status]))
  )

  const toggleWorkflow = (id: string) => {
    setWorkflowStates(prev => ({
      ...prev,
      [id]: prev[id] === 'active' ? 'paused' : 'active'
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Workflow Automation</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Workflow
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Active Workflows</p>
            <p className="text-3xl font-bold">4</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Executions</p>
            <p className="text-3xl font-bold">1,151</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Success Rate</p>
            <p className="text-3xl font-bold text-green-600">99.2%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Time Saved</p>
            <p className="text-3xl font-bold">847h</p>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      <Card>
        <CardHeader>
          <CardTitle>Workflows</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {MOCK_WORKFLOWS.map((workflow) => (
            <div
              key={workflow.id}
              className="p-4 border rounded hover:bg-gray-50 cursor-pointer transition"
              onClick={() => setExpandedWorkflow(expandedWorkflow === workflow.id ? null : workflow.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Toggle
                    pressed={workflowStates[workflow.id] === 'active'}
                    onPressedChange={() => toggleWorkflow(workflow.id)}
                    className="h-6 w-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </Toggle>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{workflow.name}</h4>
                    <p className="text-xs text-gray-500">
                      {workflow.triggers} trigger • {workflow.actions} actions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={workflowStates[workflow.id] === 'active' ? 'default' : 'secondary'}>
                    {workflowStates[workflow.id]}
                  </Badge>
                  <Badge variant="outline">{workflow.executionCount}</Badge>
                </div>
              </div>

              {expandedWorkflow === workflow.id && (
                <div className="mt-3 pt-3 border-t space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Last Run</span>
                    <span className="text-gray-800">
                      {workflow.lastRun?.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Run Now
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      View Logs
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
