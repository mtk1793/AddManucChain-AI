import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// Create workflow
export async function POST(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { name, description, entityType, trigger, steps } = await request.json()
    
    const workflowId = `WF-${Date.now()}`
    const workflow = await db.workflow.create({
      data: {
        workflowId,
        name,
        description,
        entityType,
        trigger,
        createdBy: session.user.id,
        isActive: true,
      },
    })
    
    // Create workflow steps
    if (steps && Array.isArray(steps)) {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        await db.workflowStep.create({
          data: {
            workflowId: workflow.id,
            stepOrder: i + 1,
            action: step.action,
            parameters: JSON.stringify(step.parameters),
            onSuccess: step.onSuccess,
            onFailure: step.onFailure,
            timeout: step.timeout,
          },
        })
      }
    }
    
    return NextResponse.json({ success: true, workflow })
  } catch (error) {
    console.error('Workflow creation failed:', error)
    return NextResponse.json({ error: 'Failed to create workflow' }, { status: 500 })
  }
}

// Get workflows
export async function GET(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get('entityType')
    const status = searchParams.get('status')
    
    const workflows = await db.workflow.findMany({
      where: {
        entityType: entityType || undefined,
        isActive: status === 'active' ? true : status === 'inactive' ? false : undefined,
      },
      include: { steps: { orderBy: { stepOrder: 'asc' } } },
    })
    
    return NextResponse.json({ workflows })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch workflows' }, { status: 500 })
  }
}

// Update workflow
export async function PUT(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { workflowId, name, description, isActive, steps } = await request.json()
    
    const workflow = await db.workflow.update({
      where: { id: workflowId },
      data: {
        name,
        description,
        isActive,
      },
    })
    
    // Update steps if provided
    if (steps && Array.isArray(steps)) {
      await db.workflowStep.deleteMany({ where: { workflowId } })
      
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        await db.workflowStep.create({
          data: {
            workflowId,
            stepOrder: i + 1,
            action: step.action,
            parameters: JSON.stringify(step.parameters),
            onSuccess: step.onSuccess,
            onFailure: step.onFailure,
            timeout: step.timeout,
          },
        })
      }
    }
    
    return NextResponse.json({ success: true, workflow })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update workflow' }, { status: 500 })
  }
}

// Execute workflow
export async function PATCH(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { workflowId, entityId } = await request.json()
    
    const workflow = await db.workflow.findUnique({
      where: { id: workflowId },
      include: { steps: { orderBy: { stepOrder: 'asc' } } },
    })
    
    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }
    
    const execution = await db.workflowExecution.create({
      data: {
        workflowId,
        entityId,
        status: 'running',
        log: JSON.stringify([]),
      },
    })
    
    // Execute workflow steps asynchronously
    executeWorkflowSteps(execution.id, workflow, entityId).catch(err => {
      console.error('Workflow execution failed:', err)
    })
    
    return NextResponse.json({
      success: true,
      executionId: execution.id,
      status: 'running',
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to execute workflow' }, { status: 500 })
  }
}

// Delete workflow
export async function DELETE(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { workflowId } = await request.json()
    
    await db.workflowStep.deleteMany({ where: { workflowId } })
    await db.workflow.delete({ where: { id: workflowId } })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete workflow' }, { status: 500 })
  }
}

// Execute workflow steps
async function executeWorkflowSteps(executionId: string, workflow: any, entityId: string) {
  try {
    const log: any[] = []
    let currentStep = 1
    let shouldContinue = true
    
    while (shouldContinue && currentStep <= workflow.steps.length) {
      const step = workflow.steps[currentStep - 1]
      
      try {
        log.push({
          step: currentStep,
          action: step.action,
          status: 'executing',
          timestamp: new Date().toISOString(),
        })
        
        // Execute step based on action
        switch (step.action) {
          case 'send_notification':
            const params = JSON.parse(step.parameters)
            await db.notification.create({
              data: {
                userId: params.userId,
                type: 'system_alert',
                title: params.title,
                message: params.message,
                severity: 'info',
                relatedEntity: entityId,
              },
            })
            break
            
          case 'update_status':
            const statusParams = JSON.parse(step.parameters)
            await db.order.updateMany({
              where: { id: entityId },
              data: { status: statusParams.newStatus },
            })
            break
            
          case 'call_api':
            // Call external API
            const apiParams = JSON.parse(step.parameters)
            // Implementation would go here
            break
        }
        
        log[log.length - 1].status = 'completed'
        
        // Move to next step
        if (step.onSuccess) {
          currentStep = parseInt(step.onSuccess) || currentStep + 1
        } else {
          currentStep++
        }
      } catch (stepError) {
        log[log.length - 1].status = 'failed'
        log[log.length - 1].error = String(stepError)
        
        if (step.onFailure) {
          currentStep = parseInt(step.onFailure) || currentStep + 1
        } else {
          shouldContinue = false
        }
      }
    }
    
    // Update execution
    await db.workflowExecution.update({
      where: { id: executionId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        log: JSON.stringify(log),
      },
    })
  } catch (error) {
    await db.workflowExecution.update({
      where: { id: executionId },
      data: {
        status: 'failed',
        completedAt: new Date(),
        log: JSON.stringify([{ error: String(error) }]),
      },
    })
  }
}
