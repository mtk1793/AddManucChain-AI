import { NextRequest, NextResponse } from 'next/server'

// Get all users
export async function GET(request: NextRequest) {
  try {
    const users = [
      { id: '1', name: 'John Smith', email: 'john@company.com', role: 'admin', status: 'active', lastLogin: new Date(Date.now() - 3600000) },
      { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'manager', status: 'active', lastLogin: new Date(Date.now() - 7200000) },
      { id: '3', name: 'Mike Chen', email: 'mike@company.com', role: 'operator', status: 'active', lastLogin: new Date(Date.now() - 86400000) },
      { id: '4', name: 'Lisa Wang', email: 'lisa@company.com', role: 'viewer', status: 'inactive', lastLogin: new Date(Date.now() - 604800000) },
      { id: '5', name: 'David Brown', email: 'david@company.com', role: 'analyst', status: 'active', lastLogin: new Date(Date.now() - 300000) },
    ]
    
    return NextResponse.json({
      success: true,
      users,
      totalUsers: 5,
      activeUsers: 4,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, role, permissions } = body
    
    const user = {
      id: `USER-${Date.now()}`,
      name,
      email,
      role,
      permissions: permissions || [],
      createdAt: new Date(),
      status: 'active',
      inviteSent: true,
    }
    
    return NextResponse.json({
      success: true,
      user,
      message: 'User created and invitation sent',
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Update user permissions
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, permissions, role } = body
    
    return NextResponse.json({
      success: true,
      userId,
      role,
      permissions,
      updatedAt: new Date(),
      message: 'User permissions updated',
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Update user status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, status } = body
    
    return NextResponse.json({
      success: true,
      userId,
      status,
      updatedAt: new Date(),
      message: `User ${status}`,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Delete user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')
    
    return NextResponse.json({
      success: true,
      userId,
      deletedAt: new Date(),
      message: 'User removed from organization',
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
