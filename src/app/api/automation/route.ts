import { NextRequest, NextResponse } from 'next/server'

// List automation workflows
export async function GET(request: NextRequest) {
  try {
    const workflows = [
      { id: '1', name: 'Auto-Approve Small Orders', status: 'active', triggers: 1, actions: 2, executionCount: 847, lastRun: new Date(Date.now() - 300000) },
      { id: '2', name: 'Material Shortage Alert', status: 'active', triggers: 1, actions: 3, executionCount: 24, lastRun: new Date(Date.now() - 7200000) },
      { id: '3', name: 'End-of-Day Report', status: 'active', triggers: 1, actions: 2, executionCount: 92, lastRun: new Date(Date.now() - 86400000) },
      { id: '4', name: 'Order Reassignment', status: 'paused', triggers: 2, actions: 4, executionCount: 156, lastRun: new Date(Date.now() - 604800000) },
      { id: '5', name: 'Quality Check Escalation', status: 'active', triggers: 1, actions: 3, executionCount: 32, lastRun: new Date(Date.now() - 3600000) },
    ]
    
    return NextResponse.json({
      success: true,
      workflows,
      activeWorkflows: 4,
      totalExecutions: 1151,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Create automation workflow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, triggers, actions } = body
    
    const workflow = {
      id: `WF-${Date.now()}`,
      name,
      status: 'draft',
      triggers,
      actions,
      createdAt: new Date(),
      createdBy: 'admin@company.com',
    }
    
    return NextResponse.json({
      success: true,
      workflow,
      message: 'Workflow created successfully',
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Execute workflow manually
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { workflowId, triggerData } = body
    
    const execution = {
      executionId: `EXEC-${Date.now()}`,
      workflowId,
      status: 'success',
      startTime: new Date(Date.now() - 5000),
      endTime: new Date(),
      duration: 5234,
      stepsExecuted: 3,
      errors: 0,
    }
    
    return NextResponse.json({
      success: true,
      execution,
      message: 'Workflow executed successfully',
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Update workflow status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { workflowId, status } = body
    
    return NextResponse.json({
      success: true,
      workflowId,
      status,
      updatedAt: new Date(),
      message: `Workflow ${status}`,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
