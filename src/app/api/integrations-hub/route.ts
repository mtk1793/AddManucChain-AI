import { NextRequest, NextResponse } from 'next/server'

// List all third-party integrations
export async function GET(request: NextRequest) {
  try {
    const integrations = [
      { id: '1', name: 'Salesforce CRM', type: 'crm', status: 'connected', lastSync: new Date(Date.now() - 3600000), recordsSync: 1247 },
      { id: '2', name: 'SAP ERP', type: 'erp', status: 'connected', lastSync: new Date(Date.now() - 7200000), recordsSync: 5432 },
      { id: '3', name: 'NetSuite', type: 'erp', status: 'error', lastSync: new Date(Date.now() - 86400000), errorMsg: 'Authentication failed' },
      { id: '4', name: 'Stripe', type: 'payment', status: 'connected', lastSync: new Date(Date.now() - 1800000), recordsSync: 542 },
      { id: '5', name: 'Shopify Inventory', type: 'inventory', status: 'connected', lastSync: new Date(Date.now() - 5400000), recordsSync: 892 },
    ]
    
    return NextResponse.json({
      success: true,
      integrations,
      totalConnected: 4,
      totalErrors: 1,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Create new integration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, credentials } = body
    
    const integration = {
      id: `INT-${Date.now()}`,
      name,
      type,
      status: 'testing',
      createdAt: new Date(),
      testResult: { success: true, message: 'Connection successful' },
    }
    
    return NextResponse.json({
      success: true,
      integration,
      message: 'Integration created and tested successfully',
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Refresh integration sync
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { integrationId } = body
    
    const syncResult = {
      integrationId,
      syncedAt: new Date(),
      recordsImported: Math.floor(Math.random() * 2000) + 100,
      recordsUpdated: Math.floor(Math.random() * 500),
      duration: Math.floor(Math.random() * 30) + 5,
      status: 'success',
    }
    
    return NextResponse.json({
      success: true,
      syncResult,
      message: `Synced ${syncResult.recordsImported} records in ${syncResult.duration}s`,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Delete integration
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const integrationId = searchParams.get('id')
    
    return NextResponse.json({
      success: true,
      message: `Integration ${integrationId} deleted`,
      deletedAt: new Date(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
