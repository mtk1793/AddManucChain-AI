import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// GET all orders
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { orderId: { contains: search } },
        { partName: { contains: search } },
      ]
    }

    const orders = await db.order.findMany({
      where,
      include: {
        requester: true,
        blueprint: true,
        center: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// POST create new order
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const body = await request.json()
    const { partName, quantity, priority, notes, blueprintId, centerId, requesterId } = body

    // Get or create default user
    let user = await db.user.findFirst()
    if (!user) {
      user = await db.user.create({
        data: {
          email: 'default@addmanuchain.com',
          name: 'Default User',
          role: 'operator',
          company: 'AddManuChain',
        },
      })
    }

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    // Calculate ETA (3-5 days from now)
    const eta = new Date()
    eta.setDate(eta.getDate() + 4)

    let validBlueprintId: string | null = null
    if (blueprintId) {
      const bp = await db.blueprint.findUnique({ where: { id: blueprintId } })
      if (bp) validBlueprintId = bp.id
    }
    let validCenterId: string | null = null
    if (centerId) {
      const ct = await db.printCenter.findUnique({ where: { id: centerId } })
      if (ct) validCenterId = ct.id
    }

    const order = await db.order.create({
      data: {
        orderId,
        partName,
        quantity: parseInt(quantity) || 1,
        priority: priority || 'medium',
        status: 'pending',
        notes,
        eta,
        requesterId: user.id,
        blueprintId: validBlueprintId,
        centerId: validCenterId,
      },
      include: {
        requester: true,
        blueprint: true,
        center: true,
      },
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        orderId: order.id,
        action: 'ORDER_CREATED',
        details: `Order ${orderId} created for ${partName}`,
        userId: user.id,
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
