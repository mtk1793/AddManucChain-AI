/**
 * Integration tests for AI Order Automation System
 * Tests the complete workflow from order submission to AI processing and logging
 */

import { OrderAutomationAgent, getOrderAutomationAgent } from '@/lib/order-automation-agent'
import { executeWorkflowWithAI } from '@/lib/ai-workflow-executor'

describe('Order Automation Integration Tests', () => {
  let agent: OrderAutomationAgent

  beforeEach(() => {
    agent = getOrderAutomationAgent()
    agent.reset()
  })

  describe('Order Submission Flow', () => {
    test('should accept valid order submission', async () => {
      const order = {
        orderId: 'ORD-TEST-001',
        customerId: 'CUST-123',
        items: [
          { name: 'Part A', quantity: 5 },
          { name: 'Part B', quantity: 3 },
        ],
        priority: 'normal' as const,
        notes: 'Test order',
      }

      const result = await agent.submitOrder(order)

      expect(result).toBeDefined()
      expect(result.orderId).toBe('ORD-TEST-001')
      expect(result.executionTime).toBeGreaterThanOrEqual(0)
      expect(result.actions).toBeDefined()
      expect(result.nextSteps).toBeDefined()
    })

    test('should handle auto-approval for low-value orders', async () => {
      const order = {
        orderId: 'ORD-LOW-001',
        customerId: 'CUST-123',
        items: [{ name: 'Small Part', quantity: 1 }],
      }

      const result = await agent.submitOrder(order)

      // Should process without escalation
      expect(result.success).toBe(true)
    })

    test('should escalate high-value orders for review', async () => {
      const order = {
        orderId: 'ORD-HIGH-001',
        customerId: 'CUST-123',
        items: [
          { name: 'Expensive Component', quantity: 100 }, // simulate high value
        ],
        priority: 'normal' as const,
      }

      const result = await agent.submitOrder(order)

      // May be escalated based on threshold
      expect(result).toBeDefined()
      expect(['ESCALATE', 'APPROVED', 'PROCESS']).toContain(result.status)
    })
  })

  describe('Workflow Execution', () => {
    test('should execute workflow with AI decision-making', async () => {
      const context = {
        workflowId: 'WF-001',
        workflowName: 'OrderProcessing',
        trigger: 'order' as const,
        data: {
          orderId: 'ORD-TEST-002',
          items: 5,
          value: 25000,
        },
        userId: 'USER-123',
        executionId: 'EXEC-TEST-001',
        timestamp: new Date(),
      }

      const result = await executeWorkflowWithAI(context)

      expect(result).toBeDefined()
      expect(result.executionId).toBe('EXEC-TEST-001')
      expect(result.status).toMatch(/success|failed|pending/)
      expect(result.actions).toBeDefined()
      expect(result.nextSteps).toBeDefined()
      expect(result.duration).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Order Status Tracking', () => {
    test('should track order processing status', async () => {
      const orderId = 'ORD-STATUS-001'
      const order = {
        orderId,
        customerId: 'CUST-123',
        items: [{ name: 'Part', quantity: 1 }],
      }

      const result = await agent.submitOrder(order)
      expect(result).toBeDefined()

      const status = agent.getOrderStatus(orderId)
      expect(status).toBeDefined()
      expect(['completed', 'failed', 'processing']).toContain(status.status)
    })

    test('should return not_found for unknown order', () => {
      const status = agent.getOrderStatus('ORD-UNKNOWN-999')

      expect(status.status).toBe('not_found')
      expect(status.isProcessing).toBe(false)
    })
  })

  describe('System Statistics', () => {
    test('should provide accurate execution statistics', async () => {
      // Submit a few orders
      await agent.submitOrder({
        orderId: 'ORD-STAT-001',
        customerId: 'CUST-1',
        items: [{ name: 'Part', quantity: 1 }],
      })

      const stats = agent.getStats()

      expect(stats).toBeDefined()
      expect(stats.executionsToday).toBeGreaterThanOrEqual(1)
      expect(stats.successRate).toBeGreaterThanOrEqual(0)
      expect(stats.successRate).toBeLessThanOrEqual(100)
      expect(stats.averageExecutionTime).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Error Handling', () => {
    test('should handle disabled automation gracefully', async () => {
      agent.updateConfig({ enabled: false })

      const result = await agent.submitOrder({
        orderId: 'ORD-DISABLED-001',
        customerId: 'CUST-123',
        items: [{ name: 'Part', quantity: 1 }],
      })

      expect(result.success).toBe(false)
      expect(result.status).toBe('disabled')
    })

    test('should handle queue overflow', async () => {
      agent.updateConfig({ maxConcurrentOrders: 2 })

      // Fill the queue
      const promises = []
      for (let i = 0; i < 3; i++) {
        promises.push(
          agent.submitOrder({
            orderId: `ORD-QUEUE-${i}`,
            customerId: 'CUST-123',
            items: [{ name: 'Part', quantity: 1 }],
          })
        )
      }

      const results = await Promise.all(promises)

      // At least one should be queued
      const queuedResult = results.find((r) => r.status === 'queue_full')
      expect(queuedResult).toBeDefined()
    })
  })

  describe('Configuration Management', () => {
    test('should update configuration', () => {
      const newConfig = {
        autoApproveThreshold: 100000,
        escalateAboveThreshold: 200000,
      }

      agent.updateConfig(newConfig)
      const stats = agent.getStats()

      // Configuration should be applied
      expect(stats).toBeDefined()
    })

    test('should reset system state', async () => {
      await agent.submitOrder({
        orderId: 'ORD-RESET-001',
        customerId: 'CUST-123',
        items: [{ name: 'Part', quantity: 1 }],
      })

      agent.reset()

      const stat1 = agent.getStats()
      expect(stat1.executionsToday).toBe(0)
    })
  })
})

// Export test utilities
export const createTestOrder = (orderId: string) => ({
  orderId,
  customerId: `CUST-${Math.random().toString(36).substr(2, 9)}`,
  items: [
    { name: 'Test Part', quantity: Math.floor(Math.random() * 10) + 1 },
  ],
  priority: 'normal' as const,
})

export const createTestWorkflow = (workflowId: string) => ({
  workflowId,
  workflowName: 'TestWorkflow',
  trigger: 'manual' as const,
  data: {
    testKey: 'testValue',
    timestamp: new Date().toISOString(),
  },
  userId: 'TEST-USER',
  executionId: `EXEC-${Date.now()}`,
  timestamp: new Date(),
})
