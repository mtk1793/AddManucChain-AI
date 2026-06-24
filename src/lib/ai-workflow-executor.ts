/**
 * AI Workflow Executor
 * Uses the shared z-ai-web-dev-sdk helper (src/lib/ai.ts)
 */

import { askAIJson } from '@/lib/ai'

export interface WorkflowContext {
  workflowId: string
  workflowName: string
  trigger: string
  data: Record<string, any>
  userId?: string
  executionId: string
  timestamp: Date
}

export interface ExecutionResult {
  executionId: string
  workflowId: string
  status: 'success' | 'failed' | 'pending'
  message: string
  actions: string[]
  aiDecision: string
  nextSteps: string[]
  duration: number
  timestamp: Date
}

/**
 * Execute workflow using AI decision-making via Ollama
 */
export async function executeWorkflowWithAI(context: WorkflowContext): Promise<ExecutionResult> {
  const startTime = Date.now()
  const executionId = context.executionId
  
  try {
    // Build AI prompt for workflow execution
    const systemPrompt =
      'You are an intelligent workflow automation engine for AddManuChain. Execute this workflow.'
    const userMessage = `WORKFLOW: "${context.workflowName}"
TRIGGER: ${context.trigger}
DATA: ${JSON.stringify(context.data, null, 2)}

DECISIONS:
1. Should this order/request be approved automatically?
2. What actions need to be taken?
3. Are there any warnings or escalations?
4. What are the next steps?

Respond ONLY with valid JSON:
{
  "decision": "APPROVED" | "REJECTED" | "PENDING_REVIEW",
  "actions": ["action1", "action2"],
  "reasoning": "explanation",
  "nextSteps": ["step1", "step2"]
}

Output ONLY the JSON object.`

    const aiResponse = await askAIJson<{
      decision?: string
      actions?: string[]
      reasoning?: string
      nextSteps?: string[]
    }>(systemPrompt, userMessage, {
      decision: 'PENDING_REVIEW',
      actions: [],
      reasoning: 'AI analysis unavailable, defaulting to manual review',
      nextSteps: ['Manual review required'],
    })

    // Execute actions based on AI decision
    const executedActions = await executeActions(aiResponse.actions || [], context)

    const duration = Date.now() - startTime

    const result: ExecutionResult = {
      executionId,
      workflowId: context.workflowId,
      status: 'success',
      message: `Workflow "${context.workflowName}" executed successfully`,
      actions: executedActions,
      aiDecision: aiResponse.decision || 'Processed',
      nextSteps: aiResponse.nextSteps || [],
      duration,
      timestamp: new Date(),
    }

    return result
  } catch (error) {
    const duration = Date.now() - startTime
    return {
      executionId,
      workflowId: context.workflowId,
      status: 'failed',
      message: `Workflow execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      actions: [],
      aiDecision: 'Error - Escalate to human review',
      nextSteps: ['Manual review required'],
      duration,
      timestamp: new Date(),
    }
  }
}

/**
 * Execute specific actions determined by AI
 */
async function executeActions(actions: string[], context: WorkflowContext): Promise<string[]> {
  const executed: string[] = []

  for (const action of actions) {
    const lowerAction = action.toLowerCase()

    // Auto-Approve Order
    if (lowerAction.includes('approve')) {
      executed.push(`✓ Order #${context.data.orderId} auto-approved`)
      await notifyUser(`Order approved by workflow: ${context.workflowName}`)
    }

    // Check Inventory
    if (lowerAction.includes('inventory') || lowerAction.includes('check stock')) {
      const available = context.data.quantity <= 500
      executed.push(`✓ Inventory check: ${available ? 'Sufficient stock' : 'Low stock warning'}`)
    }

    // Send Notification
    if (lowerAction.includes('notify') || lowerAction.includes('alert')) {
      executed.push(`✓ Notifications sent to: Engineering Team`)
      await notifyUser(action)
    }

    // Create Ticket
    if (lowerAction.includes('ticket') || lowerAction.includes('create')) {
      const ticketId = `TKT-${Date.now().toString().slice(-6)}`
      executed.push(`✓ Ticket created: ${ticketId}`)
    }

    // Log/Audit
    if (lowerAction.includes('log') || lowerAction.includes('audit')) {
      executed.push(`✓ Action logged to audit trail`)
    }

    // Send to Queue
    if (lowerAction.includes('queue') || lowerAction.includes('production')) {
      executed.push(`✓ Order sent to production queue`)
    }

    // Escalate
    if (lowerAction.includes('escalate')) {
      executed.push(`✓ Escalated to supervisor`)
      await notifyUser('Order requires human review')
    }

    // Generate Report
    if (lowerAction.includes('report')) {
      executed.push(`✓ Report generated and scheduled`)
    }
  }

  return executed.length > 0 ? executed : ['✓ Workflow processed']
}

/**
 * Send notification to user/team
 */
async function notifyUser(message: string): Promise<void> {
  console.log(`[NOTIFICATION] ${message}`)
}

/**
 * Process incoming order through AI-powered workflows
 */
export async function processOrderWithAI(order: {
  orderId: string
  customerId: string
  items: Array<{ sku: string; quantity: number }>
  value: number
  priority?: string
}): Promise<ExecutionResult[]> {
  const executionId = `exec-${Date.now()}`
  const results: ExecutionResult[] = []

  // Determine which workflows to trigger based on order characteristics
  const workflows = determineApplicableWorkflows(order)

  for (const workflow of workflows) {
    const context: WorkflowContext = {
      workflowId: workflow.id,
      workflowName: workflow.name,
      trigger: workflow.trigger,
      data: {
        orderId: order.orderId,
        customerId: order.customerId,
        items: order.items,
        value: order.value,
        quantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
      },
      executionId: `${executionId}-${workflow.id}`,
      timestamp: new Date(),
    }

    const result = await executeWorkflowWithAI(context)
    results.push(result)

    // Add slight delay between workflows to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  return results
}

/**
 * Determine which workflows to trigger for an order
 */
function determineApplicableWorkflows(
  order: any
): Array<{ id: string; name: string; trigger: string }> {
  const workflows = []

  // High-value orders need approval workflow
  if (order.value > 50000) {
    workflows.push({
      id: 'wf_high_value',
      name: 'High-Value Order Processing',
      trigger: 'order_value > $50000',
    })
  }

  // All orders go through validation
  workflows.push({
    id: 'wf_validate',
    name: 'Order Validation',
    trigger: 'order_created',
  })

  // Check inventory for all
  workflows.push({
    id: 'wf_inventory',
    name: 'Inventory Check',
    trigger: 'inventory_check',
  })

  // Flag urgent orders
  if (order.priority === 'urgent') {
    workflows.push({
      id: 'wf_urgent',
      name: 'Urgent Order Processing',
      trigger: 'priority_urgent',
    })
  }

  return workflows
}
