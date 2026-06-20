import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// Create batch job
export async function POST(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { operation, entityType, itemIds, parameters } = await request.json()
    
    // Validate input
    if (!['update_status', 'export', 'approve', 'assign', 'cancel'].includes(operation)) {
      return NextResponse.json({ error: 'Invalid operation' }, { status: 400 })
    }
    
    const jobId = `BATCH-${Date.now()}`
    const batchJob = await db.batchJob.create({
      data: {
        jobId,
        userId: session.user.id,
        operation,
        entityType,
        itemCount: itemIds.length,
        parameters: JSON.stringify(parameters || {}),
        status: 'pending',
      },
    })
    
    // Process batch asynchronously
    processBatchJob(batchJob.id, operation, entityType, itemIds, parameters).catch(err => {
      console.error('Batch job processing failed:', err)
    })
    
    return NextResponse.json({
      success: true,
      jobId,
      batchJobId: batchJob.id,
    })
  } catch (error) {
    console.error('Batch creation failed:', error)
    return NextResponse.json({ error: 'Failed to create batch job' }, { status: 500 })
  }
}

// Get batch job status
export async function GET(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')
    
    const batchJob = await db.batchJob.findUnique({
      where: { jobId: jobId || '' },
    })
    
    if (!batchJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }
    
    return NextResponse.json(batchJob)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 })
  }
}

// Cancel batch job
export async function DELETE(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { jobId } = await request.json()
    
    const batchJob = await db.batchJob.update({
      where: { jobId },
      data: { status: 'cancelled' },
    })
    
    return NextResponse.json({ success: true, batchJob })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to cancel job' }, { status: 500 })
  }
}

// Process batch job
async function processBatchJob(
  batchJobId: string,
  operation: string,
  entityType: string,
  itemIds: string[],
  parameters: any
) {
  try {
    // Update status
    await db.batchJob.update({
      where: { id: batchJobId },
      data: { status: 'processing', startedAt: new Date() },
    })
    
    let completed = 0
    let failed = 0
    const errors: any[] = []
    
    for (const itemId of itemIds) {
      try {
        switch (operation) {
          case 'update_status':
            if (entityType === 'order') {
              await db.order.update({
                where: { id: itemId },
                data: { status: parameters.newStatus },
              })
            }
            break
            
          case 'approve':
            if (entityType === 'blueprint') {
              await db.blueprint.update({
                where: { id: itemId },
                data: { status: 'active' },
              })
            }
            break
            
          case 'assign':
            if (entityType === 'order') {
              await db.order.update({
                where: { id: itemId },
                data: { centerId: parameters.centerId },
              })
            }
            break
        }
        
        completed++
      } catch (err) {
        failed++
        errors.push({ itemId, error: String(err) })
      }
      
      // Update progress
      const progress = Math.round((completed + failed) / itemIds.length * 100)
      await db.batchJob.update({
        where: { id: batchJobId },
        data: {
          completedCount: completed,
          failedCount: failed,
          progress,
        },
      })
    }
    
    // Mark as completed
    await db.batchJob.update({
      where: { id: batchJobId },
      data: {
        status: failed > 0 ? 'completed' : 'completed',
        completedAt: new Date(),
        errors: errors.length > 0 ? JSON.stringify(errors) : null,
      },
    })
  } catch (error) {
    console.error('Batch processing error:', error)
    await db.batchJob.update({
      where: { id: batchJobId },
      data: {
        status: 'failed',
        errors: JSON.stringify([{ error: String(error) }]),
      },
    })
  }
}
