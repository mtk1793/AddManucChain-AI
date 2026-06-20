import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Get existing users
  const users = await prisma.user.findMany()
  if (users.length === 0) {
    console.log('No users found. Run seed.ts first.')
    return
  }

  // Get existing blueprints
  const blueprints = await prisma.blueprint.findMany()
  if (blueprints.length === 0) {
    console.log('No blueprints found. Run seed.ts first.')
    return
  }

  // Get existing centers
  const centers = await prisma.printCenter.findMany()
  if (centers.length === 0) {
    console.log('No centers found. Run seed.ts first.')
    return
  }

  // Get existing orders to find max order number
  const allOrders = await prisma.order.findMany({
    select: { orderId: true },
  })
  const maxOrderNum = allOrders.reduce((max, o) => {
    const num = parseInt(o.orderId.split('-')[1])
    return num > max ? num : max
  }, 2847)
  let orderNum = maxOrderNum + 1

  // Add more random orders
  const additionalOrders = [
    { partName: 'Flange Connector', status: 'pending', priority: 'medium', quantity: 3 },
    { partName: 'Gasket Seal Ring', status: 'printing', priority: 'high', quantity: 10 },
    { partName: 'Bearing Housing Cap', status: 'quality_check', priority: 'high', quantity: 2 },
    { partName: 'Pump Impeller', status: 'shipped', priority: 'medium', quantity: 1 },
    { partName: 'Valve Stem', status: 'delivered', priority: 'low', quantity: 5 },
    { partName: 'Shaft Coupling', status: 'pending', priority: 'medium', quantity: 2 },
    { partName: 'Pipe Fitting Adapter', status: 'printing', priority: 'low', quantity: 8 },
    { partName: 'Heat Sink Plate', status: 'quality_check', priority: 'medium', quantity: 4 },
    { partName: 'Enclosure Bracket', status: 'shipped', priority: 'low', quantity: 6 },
    { partName: 'Hydraulic Cylinder End', status: 'delivered', priority: 'high', quantity: 1 },
    { partName: 'Turbine Blade Mount', status: 'pending', priority: 'high', quantity: 3 },
    { partName: 'Gearbox Housing', status: 'printing', priority: 'medium', quantity: 1 },
    { partName: 'Lubrication Fitting', status: 'quality_check', priority: 'low', quantity: 15 },
    { partName: 'Pressure Gauge Mount', status: 'shipped', priority: 'medium', quantity: 2 },
    { partName: 'Exhaust Manifold Gasket', status: 'delivered', priority: 'high', quantity: 4 },
  ]

  const statuses = ['pending', 'printing', 'quality_check', 'shipped', 'delivered']
  const priorities = ['low', 'medium', 'high']

  for (let i = 0; i < additionalOrders.length; i++) {
    const order = additionalOrders[i]
    const randomUser = users[Math.floor(Math.random() * users.length)]
    const randomBlueprint = Math.random() > 0.3 ? blueprints[Math.floor(Math.random() * blueprints.length)] : null
    const randomCenter = order.status !== 'pending' ? centers.filter(c => c.status !== 'offline')[Math.floor(Math.random() * centers.filter(c => c.status !== 'offline').length)] : null

    // Calculate ETA
    const eta = new Date()
    eta.setDate(eta.getDate() + Math.floor(Math.random() * 5) + 2)

    await prisma.order.create({
      data: {
        orderId: `ORD-${orderNum++}`,
        partName: order.partName,
        status: order.status,
        priority: order.priority,
        quantity: order.quantity,
        eta: order.status !== 'delivered' ? eta : new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        notes: Math.random() > 0.7 ? 'Special instructions: Handle with care' : null,
        requesterId: randomUser.id,
        blueprintId: randomBlueprint?.id || null,
        centerId: randomCenter?.id || null,
      },
    })
  }

  console.log(`Added ${additionalOrders.length} more orders`)

  // Add more blueprints
  const additionalBlueprints = [
    { name: 'Hydraulic Cylinder Rod', category: 'Hydraulic', material: 'Steel 4340', oem: 'Bosch Rexroth', certification: 'DNV GL' },
    { name: 'Propeller Blade Tip', category: 'Rotating', material: 'Titanium Ti-6Al-4V', oem: 'Wärtsilä', certification: "Lloyd's Register" },
    { name: 'Exhaust Valve Seat', category: 'Thermal', material: 'Inconel 718', oem: 'MAN Energy', certification: 'DNV GL' },
    { name: 'Anchor Chain Link', category: 'Structural', material: 'Stainless Steel 316L', oem: 'Viking Norsafe', certification: "Lloyd's Register" },
    { name: 'Navigation Light Bracket', category: 'Electrical', material: 'Aluminum 6061-T6', oem: 'Zenitel', certification: 'CSA' },
    { name: 'Bilge Pump Impeller', category: 'Rotating', material: 'Bronze C95400', oem: 'Hamworthy', certification: 'DNV GL' },
    { name: 'Winch Drum Sleeve', category: 'Structural', material: 'Steel 4340', oem: 'MacGregor', certification: "Lloyd's Register" },
    { name: 'Cooling Water Strainer', category: 'Thermal', material: 'Copper C18150', oem: 'Alfa Laval', certification: 'DNV GL' },
  ]

  let bpNum = 556
  for (const bp of additionalBlueprints) {
    await prisma.blueprint.create({
      data: {
        blueprintId: `BP-${bpNum++}`,
        name: bp.name,
        category: bp.category,
        material: bp.material,
        oem: bp.oem,
        certification: bp.certification,
        status: 'active',
        printCount: Math.floor(Math.random() * 50) + 5,
        description: `${bp.name} for marine applications`,
      },
    })
  }

  console.log(`Added ${additionalBlueprints.length} more blueprints`)

  // Update dashboard stats
  const totalOrders = await prisma.order.count()
  const activeOrders = await prisma.order.count({ where: { status: { in: ['pending', 'printing', 'quality_check'] } } })
  const deliveredOrders = await prisma.order.findMany({ where: { status: 'delivered' } })
  const deliveredParts = deliveredOrders.reduce((sum, o) => sum + o.quantity, 0)
  const totalBlueprints = await prisma.blueprint.count()
  const onlineCenters = await prisma.printCenter.count({ where: { status: 'online' } })

  await prisma.dashboardStats.upsert({
    where: { id: 'stats-1' },
    update: {
      totalOrders,
      activeOrders,
      deliveredParts,
      avgLeadTime: 4.2,
      costSavings: deliveredParts * 150,
      totalBlueprints,
      activeCenters: onlineCenters,
    },
    create: {
      id: 'stats-1',
      totalOrders,
      activeOrders,
      deliveredParts,
      avgLeadTime: 4.2,
      costSavings: deliveredParts * 150,
      totalBlueprints,
      activeCenters: onlineCenters,
    },
  })

  console.log('Updated dashboard stats')
  console.log('Database populated successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
