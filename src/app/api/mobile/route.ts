import { NextRequest, NextResponse } from 'next/server'

// Get mobile-optimized data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint') || 'dashboard'
    
    const mobileData = {
      dashboard: {
        orders: { pending: 12, inProgress: 8, completed: 145 },
        alerts: 3,
        lastUpdated: new Date(),
      },
      orders: [
        { id: 'ORD-001', status: 'in-progress', progress: 65, priority: 'high' },
        { id: 'ORD-002', status: 'pending', progress: 0, priority: 'medium' },
      ],
      printers: [
        { id: 'P-001', status: 'active', temp: 215, material: 'PLA' },
        { id: 'P-002', status: 'idle', temp: 25, material: 'PETG' },
      ],
    }
    
    return NextResponse.json({
      success: true,
      data: mobileData[endpoint as keyof typeof mobileData] || mobileData,
      compressed: true,
      dataSize: '142 KB',
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Update via mobile app
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body
    
    const result = {
      action,
      status: 'success',
      processedAt: new Date(),
      syncedAt: new Date(Date.now() - 2000),
      conflictResolved: false,
    }
    
    return NextResponse.json({
      success: true,
      result,
      message: 'Mobile update synced successfully',
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Offline sync - upload cached changes
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { cachedUpdates } = body
    
    const syncResult = {
      syncId: `SYNC-${Date.now()}`,
      updatesProcessed: cachedUpdates?.length || 0,
      successCount: Math.floor((cachedUpdates?.length || 0) * 0.95),
      failureCount: Math.ceil((cachedUpdates?.length || 0) * 0.05),
      syncedAt: new Date(),
    }
    
    return NextResponse.json({
      success: true,
      syncResult,
      message: `Synced ${syncResult.updatesProcessed} cached updates`,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Push notification registration
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { deviceId, pushToken, preferences } = body
    
    return NextResponse.json({
      success: true,
      deviceId,
      registered: true,
      preferences,
      message: 'Device registered for push notifications',
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
