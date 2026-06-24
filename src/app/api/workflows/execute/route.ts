import { NextRequest } from 'next/server'
import { executeWorkflowWithAI, processOrderWithAI, ExecutionResult } from '@/lib/ai-workflow-executor'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// In-memory store for execution history (replace with DB in production)
const executionHistory: ExecutionResult[] = []

export async function GET(request: NextRequest) {
  const workflowId = request.nextUrl.searchParams.get('workflowId')
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10')

  try {
    // Filter executions
    const results = workflowId
      ? executionHistory.filter((e) => e.workflowId === workflowId).slice(-limit)
      : executionHistory.slice(-limit)

    return Response.json({
      success: true,
      executions: results,
      total: executionHistory.length,
      responseTime: `${Date.now()} ms`,
    })
  } catch (error) {
    return Response.json({ success: false, error: error }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, workflowId, workflowName, trigger, data } = body

    // Trigger workflow execution with AI
    if (action === 'execute_workflow') {
      const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      const result = await executeWorkflowWithAI({
        workflowId,
        workflowName,
        trigger,
        data,
        executionId,
        timestamp: new Date(),
      })

      executionHistory.push(result)

      return Response.json({
        success: true,
        execution: result,
        message: `Workflow executed in ${result.duration}ms`,
      })
    }

    // Process order through AI workflows
    if (action === 'process_order') {
      const order = data
      const results = await processOrderWithAI(order)

      results.forEach((r) => executionHistory.push(r))

      return Response.json({
        success: true,
        order: {
          orderId: order.orderId,
          status: 'processed',
          workflowsExecuted: results.length,
        },
        executions: results,
        totalTime: results.reduce((sum, r) => sum + r.duration, 0),
        message: `Order processed through ${results.length} workflows`,
      })
    }

    // Get execution status
    if (action === 'get_execution_status') {
      const execution = executionHistory.find((e) => e.executionId === data.executionId)

      if (!execution) {
        return Response.json({ success: false, error: 'Execution not found' }, { status: 404 })
      }

      return Response.json({
        success: true,
        execution,
      })
    }

    return Response.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Workflow execution error:', error)
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : 'Execution failed' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, executionId, status } = body

    if (action === 'update_execution') {
      const execution = executionHistory.find((e) => e.executionId === executionId)

      if (!execution) {
        return Response.json({ success: false, error: 'Execution not found' }, { status: 404 })
      }

      execution.status = status
      execution.timestamp = new Date()

      return Response.json({
        success: true,
        execution,
        message: 'Execution status updated',
      })
    }

    return Response.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : 'Update failed' },
      { status: 500 }
    )
  }
}

// Clear execution history (admin only)
export async function DELETE(request: NextRequest) {
  executionHistory.length = 0
  return Response.json({
    success: true,
    message: 'Execution history cleared',
  })
}
