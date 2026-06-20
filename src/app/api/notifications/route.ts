import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// Get user notifications
export async function GET(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const notifications = await db.notification.findMany({
      where: {
        userId: session.user.id,
        read: unreadOnly ? false : undefined,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    
    const unreadCount = await db.notification.count({
      where: { userId: session.user.id, read: false },
    })
    
    return NextResponse.json({ notifications, unreadCount })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

// Create notification
export async function POST(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { userId, type, title, message, severity, relatedOrderId } = await request.json()
    
    const notification = await db.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        severity: severity || 'info',
        relatedOrderId,
      },
    })
    
    return NextResponse.json({ success: true, notification })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}

// Mark as read
export async function PUT(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { notificationId, read } = await request.json()
    
    const notification = await db.notification.update({
      where: { id: notificationId },
      data: {
        read,
        readAt: read ? new Date() : null,
      },
    })
    
    return NextResponse.json({ success: true, notification })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
  }
}

// Clear all notifications
export async function DELETE(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const deleted = await db.notification.deleteMany({
      where: { userId: session.user.id, read: true },
    })
    
    return NextResponse.json({ success: true, deletedCount: deleted.count })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear notifications' }, { status: 500 })
  }
}
