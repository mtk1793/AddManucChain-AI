/**
 * Order Automation Agent
 * Processes orders through AI workflows using the shared z-ai-web-dev-sdk helper
 */

import { askAIJson } from '@/lib/ai'

export interface AutomationConfig {
  enabled: boolean
  autoApproveThreshold: number
  escalateAboveThreshold: number
  autoAssignQueue: boolean
  notifyOnCompletion: boolean
  maxConcurrentOrders: number
  executionTimeout: number
  batchSize: number
}

export const DEFAULT_AUTOMATION_CONFIG: AutomationConfig = {
  enabled: true,
  autoApproveThreshold: 50000,
  escalateAboveThreshold: 100000,
  autoAssignQueue: true,
  notifyOnCompletion: true,
  maxConcurrentOrders: 10,
  executionTimeout: 30000,
  batchSize: 5,
}

export interface OrderResult {
  success: boolean
  orderId: string
  status: string
  message: string
  executionTime: number
  actions: string[]
  nextSteps: string[]
}

class OrderAutomationAgent {
  private config: AutomationConfig
  private processingQueue: Map<string, Promise<OrderResult>> = new Map()
  private completedOrders: Map<string, OrderResult> = new Map()
  private failedOrders: string[] = []
  private executionStats = {
    totalProcessed: 0,
    successful: 0,
    failed: 0,
    avgExecutionTime: 0,
  }

  constructor(config: Partial<AutomationConfig> = {}) {
    this.config = { ...DEFAULT_AUTOMATION_CONFIG, ...config }
  }

  /**
   * Submit order for automated processing
   */
  async submitOrder(order: {
    orderId: string
    customerId: string
    items: Array<{ id?: string; name: string; quantity: number; specifications?: string }>
    priority?: 'normal' | 'high' | 'urgent'
    notes?: string
    metadata?: Record<string,unknown>
  }): Promise<OrderResult> {
    if (!this.config.enabled) {
      return {
        success: false,
        orderId: order.orderId,
        status: 'disabled',
        message: 'Automation is currently disabled',
        executionTime: 0,
        actions: [],
        nextSteps: [],
      }
    }

    // Check concurrent limit
    if (this.processingQueue.size >= this.config.maxConcurrentOrders) {
      return {
        success: false,
        orderId: order.orderId,
        status: 'queue_full',
        message: 'Processing queue is at capacity. Please try again later.',
        executionTime: 0,
        actions: [],
        nextSteps: [],
      }
    }

    // Calculate order value for threshold decisions
    const orderValue = order.items.reduce((sum, item) => sum + (item.quantity * 100), 0)
    const priority = order.priority || 'normal'

    // Create processing promise
    const processingPromise = this.processOrder(order, orderValue, priority)
    this.processingQueue.set(order.orderId, processingPromise)

    try {
      const result = await processingPromise
      this.processingQueue.delete(order.orderId)
      
      if (result.success) {
        this.completedOrders.set(order.orderId, result)
        this.executionStats.successful++
      } else {
        this.failedOrders.push(order.orderId)
        this.executionStats.failed++
      }

      this.executionStats.totalProcessed++
      this.updateAverageExecutionTime(result.executionTime)

      return result
    } catch (error) {
      this.processingQueue.delete(order.orderId)
      this.failedOrders.push(order.orderId)
      this.executionStats.failed++
      this.executionStats.totalProcessed++

      return {
        success: false,
        orderId: order.orderId,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        executionTime: 0,
        actions: [],
        nextSteps: ['Manual review required'],
      }
    }
  }

  /**
   * Process order through AI workflow
   */
  private async processOrder(
    order: any,
    orderValue: number,
    priority: string,
  ): Promise<OrderResult> {
    const startTime = Date.now()

    try {
      // Build AI analysis prompt
      const systemPrompt = 'You are an order processing AI. Analyze and process this order.'
      const userMessage = `ORDER DETAILS:
- ID: ${order.orderId}
- Customer: ${order.customerId}
- Priority: ${priority}
- Value: $${orderValue.toLocaleString()}
- Items: ${order.items.map((i: any) => `${i.name} (${i.quantity})`).join(', ')}
- Notes: ${order.notes || 'None'}

DECISION RULES:
- Auto-approve if value < $50,000
- Escalate for review if value > $100,000
- Otherwise: process normally

Respond ONLY with valid JSON:
{
  "decision": "APPROVED" | "ESCALATE" | "PROCESS",
  "actions": ["action1", "action2"],
  "reasoning": "explanation",
  "nextSteps": ["step1", "step2"],
  "estimatedTime": number (hours)
}

Output ONLY the JSON.`

      // Call shared AI helper
      const aiDecision = await askAIJson<{
        decision: string
        actions: string[]
        reasoning: string
        nextSteps: string[]
        estimatedTime: number
      }>(systemPrompt, userMessage, {
        decision: 'PROCESS',
        actions: [],
        reasoning: 'AI analysis unavailable, defaulting to normal processing',
        nextSteps: ['Manual review recommended'],
        estimatedTime: 24,
      })
      const executionTime = Date.now() - startTime

      return {
        success: aiDecision.decision !== 'ESCALATE',
        orderId: order.orderId,
        status: aiDecision.decision,
        message: `Order ${aiDecision.decision.toLowerCase()}: ${aiDecision.reasoning}`,
        executionTime,
        actions: aiDecision.actions || [],
        nextSteps: aiDecision.nextSteps || [],
      }
    } catch (error) {
      const executionTime = Date.now() - startTime
      return {
        success: false,
        orderId: order.orderId,
        status: 'error',
        message: error instanceof Error ? error.message : 'Processing failed',
        executionTime,
        actions: [],
        nextSteps: ['Manual review required'],
      }
    }
  }

  /**
   * Get order status
   */
  getOrderStatus(orderId: string): {
    status: string
    result?: OrderResult
    isProcessing: boolean
  } {
    if (this.processingQueue.has(orderId)) {
      return { status: 'processing', isProcessing: true }
    }
    if (this.completedOrders.has(orderId)) {
      return { status: 'completed', result: this.completedOrders.get(orderId), isProcessing: false }
    }
    if (this.failedOrders.includes(orderId)) {
      return { status: 'failed', isProcessing: false }
    }
    return { status: 'not_found', isProcessing: false }
  }

  /**
   * Get orders needing attention
   */
  getOrdersNeedingAttention(): string[] {
    return this.failedOrders
  }

  /**
   * Get system statistics
   */
  getStats() {
    return {
      totalRules: 10, // Placeholder
      activeRules: 8,
      executionsToday: this.executionStats.totalProcessed,
      successRate: this.executionStats.totalProcessed > 0 
        ? Math.round((this.executionStats.successful / this.executionStats.totalProcessed) * 100)
        : 100,
      averageExecutionTime: Math.round(this.executionStats.avgExecutionTime),
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<AutomationConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Reset system
   */
  reset(): void {
    this.processingQueue.clear()
    this.completedOrders.clear()
    this.failedOrders = []
    this.executionStats = {
      totalProcessed: 0,
      successful: 0,
      failed: 0,
      avgExecutionTime: 0,
    }
  }

  /**
   * Update average execution time
   */
  private updateAverageExecutionTime(newTime: number): void {
    const total = this.executionStats.totalProcessed
    this.executionStats.avgExecutionTime =
      (this.executionStats.avgExecutionTime * (total - 1) + newTime) / total
  }
}

// Export singleton instance
let agentInstance: OrderAutomationAgent | null = null

export function getOrderAutomationAgent(): OrderAutomationAgent {
  if (!agentInstance) {
    agentInstance = new OrderAutomationAgent(DEFAULT_AUTOMATION_CONFIG)
  }
  return agentInstance
}

export { OrderAutomationAgent }
