'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Copy, Play, Pause, Code, Zap, Check } from 'lucide-react'

// Mock workflow templates
const WORKFLOW_TEMPLATES = [
  {
    id: 'template_1',
    name: 'Auto-Approve Orders',
    description: 'Automatically approve orders meeting criteria',
    trigger: 'order_created',
    actions: ['validate_order', 'check_inventory', 'approve'],
    icon: '✓',
  },
  {
    id: 'template_2',
    name: 'Low Stock Alert',
    description: 'Alert team when inventory drops below threshold',
    trigger: 'inventory_update',
    actions: ['check_threshold', 'notify_team', 'suggest_reorder'],
    icon: '📊',
  },
  {
    id: 'template_3',
    name: 'Quality Failed Process',
    description: 'Escalate and notify on quality failures',
    trigger: 'quality_check_failed',
    actions: ['log_failure', 'notify_lab', 'halt_production'],
    icon: '⚠️',
  },
  {
    id: 'template_4',
    name: 'Daily Digest Report',
    description: 'Generate and email daily summary',
    trigger: 'scheduled_daily_8am',
    actions: ['aggregate_data', 'generate_report', 'send_email'],
    icon: '📧',
  },
]

const WORKFLOW_BUILDER_DEMO = [
  {
    id: 'wf_1',
    name: 'High-Value Order Processing',
    status: 'active',
    trigger: 'order_value > $50000',
    steps: [
      { id: 'step_1', type: 'trigger', name: 'Order Created', config: 'Value > $50K' },
      { id: 'step_2', type: 'condition', name: 'Check Approvals', config: 'Require 2 signatures' },
      { id: 'step_3', type: 'action', name: 'Send Notification', config: 'To: Finance Team' },
      { id: 'step_4', type: 'action', name: 'Log Audit', config: 'Store approval chain' },
    ],
    executions: 245,
    successRate: 98.5,
    lastRun: '2 minutes ago',
  },
  {
    id: 'wf_2',
    name: 'Material Shortage Escalation',
    status: 'active',
    trigger: 'inventory_level < threshold',
    steps: [
      { id: 'step_1', type: 'trigger', name: 'Inventory Alert', config: 'Below threshold' },
      { id: 'step_2', type: 'condition', name: 'Check Lead Time', config: '> 2 weeks' },
      { id: 'step_3', type: 'action', name: 'Auto-Reorder', config: 'Standard qty' },
      { id: 'step_4', type: 'action', name: 'Notify Team', config: 'Email + Slack' },
    ],
    executions: 127,
    successRate: 99.2,
    lastRun: '1 hour ago',
  },
  {
    id: 'wf_3',
    name: 'Non-Conformance Report',
    status: 'paused',
    trigger: 'quality_failure',
    steps: [
      { id: 'step_1', type: 'trigger', name: 'QC Failure', config: 'Any category' },
      { id: 'step_2', type: 'action', name: 'Create Ticket', config: 'Type: NCR' },
      { id: 'step_3', type: 'action', name: 'Assign to Lab', config: 'Queue: RCA' },
      { id: 'step_4', type: 'action', name: 'Alert Compliance', config: 'Email override list' },
    ],
    executions: 89,
    successRate: 94.1,
    lastRun: '1 day ago',
  },
]

const STEP_TYPES = [
  { type: 'trigger', label: 'Trigger', icon: 'lightning', color: 'bg-purple-100 text-purple-700' },
  { type: 'condition', label: 'Condition', icon: 'branch', color: 'bg-blue-100 text-blue-700' },
  { type: 'action', label: 'Action', icon: 'play', color: 'bg-green-100 text-green-700' },
]

export function WorkflowAutomationBuilder() {
  const [workflows, setWorkflows] = useState(WORKFLOW_BUILDER_DEMO)
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)
  const [showBuilder, setShowBuilder] = useState(false)

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows(workflows.map(wf => 
      wf.id === id ? { ...wf, status: wf.status === 'active' ? 'paused' : 'active' } : wf
    ))
  }

  const currentWorkflow = selectedWorkflow ? workflows.find(w => w.id === selectedWorkflow) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Workflow Automation Builder</h1>
          <p className="text-sm text-gray-500">Create and manage automated business processes</p>
        </div>
        <Button onClick={() => setShowBuilder(!showBuilder)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Workflow
        </Button>
      </div>

      {/* Templates Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Templates</CardTitle>
          <CardDescription>Start with pre-built templates or create custom workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {WORKFLOW_TEMPLATES.map((template) => (
              <div key={template.id} className="p-4 border rounded-lg hover:shadow-md transition cursor-pointer hover:bg-gray-50">
                <div className="text-3xl mb-2">{template.icon}</div>
                <h3 className="font-semibold text-sm">{template.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <h3 className="font-semibold">Active Workflows</h3>
          {workflows.map((wf) => (
            <div
              key={wf.id}
              onClick={() => setSelectedWorkflow(wf.id)}
              className={`p-3 border rounded-lg cursor-pointer transition ${
                selectedWorkflow === wf.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{wf.name}</p>
                  <p className="text-xs text-gray-600">{wf.executions} executions</p>
                </div>
                <Badge variant={wf.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                  {wf.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow Details */}
        {currentWorkflow && (
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{currentWorkflow.name}</CardTitle>
                    <CardDescription>Last run: {currentWorkflow.lastRun}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleWorkflowStatus(currentWorkflow.id)}
                    >
                      {currentWorkflow.status === 'active' ? (
                        <>
                          <Pause className="w-3 h-3 mr-1" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 mr-1" /> Resume
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Steps Flow */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Workflow Steps</h4>
                  {currentWorkflow.steps.map((step, idx) => (
                    <div key={step.id}>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded text-xs font-semibold ${
                          step.type === 'trigger' ? 'bg-purple-100 text-purple-700' :
                          step.type === 'condition' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {step.type === 'trigger' && <Zap className="w-4 h-4" />}
                          {step.type === 'condition' && '?'}
                          {step.type === 'action' && <Check className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{step.name}</p>
                          <p className="text-xs text-gray-600">{step.config}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Code className="w-4 h-4" />
                        </Button>
                      </div>
                      {idx < currentWorkflow.steps.length - 1 && (
                        <div className="flex justify-center py-1">
                          <div className="text-gray-400">↓</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-600">Success Rate</p>
                    <p className="text-lg font-bold text-green-600">{currentWorkflow.successRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total Executions</p>
                    <p className="text-lg font-bold">{currentWorkflow.executions}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" size="sm">
                    <Play className="w-3 h-3 mr-1" /> Run Now
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm">
                    <Code className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
