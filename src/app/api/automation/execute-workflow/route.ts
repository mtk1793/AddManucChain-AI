import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/require-auth'
import { getOrderAutomationAgent } from '@/lib/order-automation-agent'
import { executeWorkflowWithAI } from '@/lib/ai-workflow-executor'

/**
 * Execute workflow with AI and log execution history
 * POST /api/automation/execute-workflow
 */
export async function POST(req: NextRequest) {
  try {
    const { session, error } = await requireAuth()
    if (error) return error
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { workflowId, workflowName, trigger, data, orderId } = await req.json()

    if (!workflowId || !workflowName) {
      return NextResponse.json(
        { error: 'Missing required fields: workflowId, workflowName' },
        { status: 400 }
      )
    }

    const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Execute workflow with AI
    const result = await executeWorkflowWithAI({
      workflowId,
      workflowName,
      trigger: trigger || 'manual',
      data,
      userId: session.user.id,
      executionId,
      timestamp: new Date(),
    })

    // Log execution to database
    const logEntry = await prisma.workflowExecution.create({
      data: {
        executionId: result.executionId,
        workflowId,
        workflowName,
        trigger: trigger || 'manual',
        orderId: orderId || null,
        status: result.status,
        aiDecision: JSON.stringify(result),
        actions: JSON.stringify(result.actions),
        nextSteps: JSON.stringify(result.nextSteps),
        duration: result.duration,
      },
    })

    return NextResponse.json({
      success: true,
      executionId: result.executionId,
      status: result.status,
      message: result.message,
      actions: result.actions,
      nextSteps: result.nextSteps,
      duration: result.duration,
      logId: logEntry.id,
    })
  } catch (error) {
    console.error('[EXECUTE_WORKFLOW]', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Execution failed',
      },
      { status: 500 }
    )
  }
}

/**
 * Get execution history
 * GET /api/automation/execute-workflow?workflowId=...&limit=50
 */
export async function GET(req: NextRequest) {
  try {
    const { session, error } = await requireAuth()
    if (error) return error
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const workflowId = searchParams.get('workflowId')
    const orderId = searchParams.get('orderId')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200)
    const status = searchParams.get('status')

    const where: any = {}
    if (workflowId) where.workflowId = workflowId
    if (orderId) where.orderId = orderId
    if (status) where.status = status

    const executions = await prisma.workflowExecution.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({
      success: true,
      count: executions.length,
      executions: executions.map((exec) => ({
        ...exec,
        aiDecision: exec.aiDecision ? JSON.parse(exec.aiDecision) : null,
        actions: exec.actions ? JSON.parse(exec.actions) : [],
        nextSteps: exec.nextSteps ? JSON.parse(exec.nextSteps) : [],
      })),
    })
  } catch (error) {
    console.error('[GET_EXECUTIONS]', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch executions',
      },
      { status: 500 }
    )
  }
}
