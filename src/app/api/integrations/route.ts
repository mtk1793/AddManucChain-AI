import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'
import axios from 'axios'

// Create integration config
export async function POST(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { name, type, apiEndpoint, apiKey, config, webhookUrl } = await request.json()
    
    const integration = await db.integrationConfig.create({
      data: {
        name,
        type,
        apiEndpoint,
        apiKey, // In production, encrypt this
        config: JSON.stringify(config),
        webhookUrl,
        status: 'inactive',
      },
    })
    
    return NextResponse.json({ success: true, integration })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create integration' }, { status: 500 })
  }
}

// Get integrations
export async function GET(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    
    const integrations = await db.integrationConfig.findMany({
      where: {
        type: type || undefined,
        status: status || undefined,
      },
    })
    
    // Remove sensitive data
    return NextResponse.json({
      integrations: integrations.map(i => ({
        ...i,
        apiKey: i.apiKey ? '***' : undefined,
      })),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch integrations' }, { status: 500 })
  }
}

// Update integration status
export async function PUT(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { integrationId, status } = await request.json()
    
    const integration = await db.integrationConfig.update({
      where: { id: integrationId },
      data: { status },
    })
    
    if (status === 'active') {
      // Test connection
      await testIntegration(integration)
    }
    
    return NextResponse.json({ success: true, integration })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update integration' }, { status: 500 })
  }
}

// Sync data with integration
export async function PATCH(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { integrationId, operation, data } = await request.json()
    
    const integration = await db.integrationConfig.findUnique({
      where: { id: integrationId },
    })
    
    if (!integration) {
      return NextResponse.json({ error: 'Integration not found' }, { status: 404 })
    }
    
    const startTime = Date.now()
    let recordsProcessed = 0
    let recordsFailed = 0
    let responseData = ''
    
    try {
      // Make API call
      const response = await axios({
        method: operation === 'push' ? 'POST' : 'GET',
        url: integration.apiEndpoint,
        headers: {
          'Authorization': `Bearer ${integration.apiKey}`,
          'Content-Type': 'application/json',
        },
        data: operation === 'push' ? data : undefined,
        timeout: 30000,
      })
      
      recordsProcessed = Array.isArray(response.data) ? response.data.length : 1
      responseData = JSON.stringify(response.data).slice(0, 1000)
      
      // Log successful sync
      await db.integrationLog.create({
        data: {
          integrationId,
          operation,
          status: 'success',
          recordsProcessed,
          recordsFailed,
          executionTime: Date.now() - startTime,
          responseData,
        },
      })
      
      return NextResponse.json({
        success: true,
        recordsProcessed,
        recordsFailed,
        executionTime: Date.now() - startTime,
      })
    } catch (syncError) {
      const errorMessage = String(syncError)
      
      // Log failed sync
      await db.integrationLog.create({
        data: {
          integrationId,
          operation,
          status: 'failed',
          recordsProcessed,
          recordsFailed: 1,
          errorMessage,
          executionTime: Date.now() - startTime,
        },
      })
      
      // Update integration status
      await db.integrationConfig.update({
        where: { id: integrationId },
        data: {
          lastErrorAt: new Date(),
          lastErrorMsg: errorMessage,
        },
      })
      
      return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to sync' }, { status: 500 })
  }
}

// Test integration connection
async function testIntegration(integration: any) {
  try {
    const response = await axios({
      method: 'GET',
      url: integration.apiEndpoint,
      headers: {
        'Authorization': `Bearer ${integration.apiKey}`,
      },
      timeout: 10000,
    })
    
    await db.integrationConfig.update({
      where: { id: integration.id },
      data: {
        lastSyncAt: new Date(),
        status: 'active',
      },
    })
  } catch (error) {
    await db.integrationConfig.update({
      where: { id: integration.id },
      data: {
        lastErrorAt: new Date(),
        lastErrorMsg: String(error),
        status: 'error',
      },
    })
  }
}
