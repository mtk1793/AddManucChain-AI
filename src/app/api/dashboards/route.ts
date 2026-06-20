import { NextRequest, NextResponse } from 'next/server'

// Get custom dashboards
export async function GET(request: NextRequest) {
  try {
    const dashboards = [
      { id: '1', name: 'Executive Overview', owner: 'CEO', widgets: 6, views: 342, lastModified: new Date(Date.now() - 86400000) },
      { id: '2', name: 'Production Manager', owner: 'ops@company.com', widgets: 8, views: 1247, lastModified: new Date(Date.now() - 3600000) },
      { id: '3', name: 'Sales Performance', owner: 'sales@company.com', widgets: 5, views: 654, lastModified: new Date(Date.now() - 172800000) },
      { id: '4', name: 'Supply Chain', owner: 'logistics@company.com', widgets: 7, views: 892, lastModified: new Date(Date.now() - 604800000) },
    ]
    
    return NextResponse.json({
      success: true,
      dashboards,
      totalDashboards: 4,
      sharedDashboards: 2,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Create custom dashboard
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, templateId, widgets } = body
    
    const dashboard = {
      id: `DB-${Date.now()}`,
      name,
      templateId,
      widgets: widgets || [],
      createdAt: new Date(),
      createdBy: 'admin@company.com',
      isPublic: false,
    }
    
    return NextResponse.json({
      success: true,
      dashboard,
      message: 'Dashboard created successfully',
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Update dashboard layout
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { dashboardId, widgets, layout } = body
    
    return NextResponse.json({
      success: true,
      dashboardId,
      widgetCount: widgets?.length || 0,
      updatedAt: new Date(),
      message: 'Dashboard layout updated',
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Add widget to dashboard
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { dashboardId, widget } = body
    
    return NextResponse.json({
      success: true,
      dashboardId,
      widgetId: `W-${Date.now()}`,
      widget,
      message: 'Widget added to dashboard',
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Delete dashboard
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dashboardId = searchParams.get('id')
    
    return NextResponse.json({
      success: true,
      dashboardId,
      deletedAt: new Date(),
      message: 'Dashboard deleted',
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
