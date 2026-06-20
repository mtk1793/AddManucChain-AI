import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting comprehensive seed...')

  // Hash passwords for demo accounts
  const adminPassword = await bcrypt.hash('admin123', 10)
  const operatorPassword = await bcrypt.hash('operator123', 10)
  const partnerPassword = await bcrypt.hash('partner123', 10)

  // ==================== USERS (with authentication) ====================
  const users = await Promise.all([
    // Demo Admin Account
    prisma.user.upsert({
      where: { email: 'admin@almatech.com' },
      update: {},
      create: {
        email: 'admin@almatech.com',
        name: 'Platform Admin',
        role: 'admin',
        company: 'Alma-Tech',
        password: adminPassword,
      },
    }),
    // Demo Operator Account
    prisma.user.upsert({
      where: { email: 'operator@statoil.com' },
      update: {},
      create: {
        email: 'operator@statoil.com',
        name: 'Rig Operator',
        role: 'operator',
        company: 'Statoil',
        password: operatorPassword,
      },
    }),
    // Demo Partner Account
    prisma.user.upsert({
      where: { email: 'partner@oem.com' },
      update: {},
      create: {
        email: 'partner@oem.com',
        name: 'OEM Partner',
        role: 'oem_partner',
        company: 'Baker Hughes',
        password: partnerPassword,
      },
    }),
    // Existing users
    prisma.user.upsert({
      where: { email: 'j.operator@horizonmaritime.com' },
      update: {},
      create: {
        email: 'j.operator@horizonmaritime.com',
        name: 'John Operator',
        role: 'operator',
        company: 'Horizon Maritime',
      },
    }),
    prisma.user.upsert({
      where: { email: 's.chen@noblecorp.com' },
      update: {},
      create: {
        email: 's.chen@noblecorp.com',
        name: 'Sarah Chen',
        role: 'customer_admin',
        company: 'Noble Corp',
      },
    }),
    prisma.user.upsert({
      where: { email: 'm.johnson@equinor.com' },
      update: {},
      create: {
        email: 'm.johnson@equinor.com',
        name: 'Mike Johnson',
        role: 'operator',
        company: 'Equinor',
      },
    }),
    prisma.user.upsert({
      where: { email: 'd.brown@rosenmaritime.com' },
      update: {},
      create: {
        email: 'd.brown@rosenmaritime.com',
        name: 'David Brown',
        role: 'customer_admin',
        company: 'Rosen Maritime',
      },
    }),
    prisma.user.upsert({
      where: { email: 'l.wang@thales.ca' },
      update: {},
      create: {
        email: 'l.wang@thales.ca',
        name: 'Lisa Wang',
        role: 'procurement',
        company: 'Thales Canada',
      },
    }),
  ])
  console.log(`Created ${users.length} users`)

  // ==================== BLUEPRINTS ====================
  const blueprints = await Promise.all([
    prisma.blueprint.upsert({
      where: { blueprintId: 'BP-1024' },
      update: {},
      create: {
        blueprintId: 'BP-1024',
        name: 'Thruster Bearing Housing',
        category: 'Structural',
        material: 'Titanium Ti-6Al-4V',
        oem: 'Rosen Maritime',
        certification: "Lloyd's Register",
        status: 'active',
        printCount: 47,
        description: 'High-performance thruster bearing housing for marine propulsion systems',
      },
    }),
    prisma.blueprint.upsert({
      where: { blueprintId: 'BP-0892' },
      update: {},
      create: {
        blueprintId: 'BP-0892',
        name: 'Hydraulic Valve Body',
        category: 'Hydraulic',
        material: 'Stainless Steel 316L',
        oem: 'Noble Corp',
        certification: 'DNV GL',
        status: 'active',
        printCount: 23,
        description: 'Precision hydraulic valve body for offshore equipment',
      },
    }),
    prisma.blueprint.upsert({
      where: { blueprintId: 'BP-0456' },
      update: {},
      create: {
        blueprintId: 'BP-0456',
        name: 'Sensor Mounting Bracket',
        category: 'Structural',
        material: 'Aluminum 6061-T6',
        oem: 'Equinor',
        certification: 'Self-certified',
        status: 'active',
        printCount: 156,
        description: 'Universal sensor mounting bracket for marine environments',
      },
    }),
    prisma.blueprint.upsert({
      where: { blueprintId: 'BP-0789' },
      update: {},
      create: {
        blueprintId: 'BP-0789',
        name: 'Impeller Shaft',
        category: 'Rotating',
        material: 'Inconel 718',
        oem: 'Thales',
        certification: "Lloyd's Register",
        status: 'pending_review',
        printCount: 12,
        description: 'High-strength impeller shaft for pump systems',
      },
    }),
    prisma.blueprint.upsert({
      where: { blueprintId: 'BP-0334' },
      update: {},
      create: {
        blueprintId: 'BP-0334',
        name: 'Heat Exchanger Plate',
        category: 'Thermal',
        material: 'Copper C18150',
        oem: 'Cove',
        certification: 'DNV GL',
        status: 'active',
        printCount: 89,
        description: 'Heat exchanger plate for thermal management systems',
      },
    }),
    prisma.blueprint.upsert({
      where: { blueprintId: 'BP-0667' },
      update: {},
      create: {
        blueprintId: 'BP-0667',
        name: 'Pressure Housing Seal',
        category: 'Seals',
        material: 'H13 Tool Steel',
        oem: 'Rosen Maritime',
        certification: 'DNV GL',
        status: 'active',
        printCount: 34,
        description: 'High-pressure housing seal for subsea applications',
      },
    }),
    prisma.blueprint.upsert({
      where: { blueprintId: 'BP-0123' },
      update: {},
      create: {
        blueprintId: 'BP-0123',
        name: 'Motor Coupling Flange',
        category: 'Coupling',
        material: 'Steel 4340',
        oem: 'Horizon Maritime',
        certification: 'Self-certified',
        status: 'active',
        printCount: 78,
        description: 'Motor coupling flange for power transmission',
      },
    }),
    prisma.blueprint.upsert({
      where: { blueprintId: 'BP-0555' },
      update: {},
      create: {
        blueprintId: 'BP-0555',
        name: 'Control Panel Enclosure',
        category: 'Electrical',
        material: 'Aluminum 6061-T6',
        oem: 'Ecotex',
        certification: 'CSA',
        status: 'inactive',
        printCount: 5,
        description: 'Control panel enclosure for electrical systems',
      },
    }),
    prisma.blueprint.upsert({
      where: { blueprintId: 'BP-0556' },
      update: {},
      create: {
        blueprintId: 'BP-0556',
        name: 'Hydraulic Cylinder Rod',
        category: 'Hydraulic',
        material: 'Steel 4340',
        oem: 'Bosch Rexroth',
        certification: 'DNV GL',
        status: 'active',
        printCount: 45,
        description: 'Hydraulic cylinder rod for offshore equipment',
      },
    }),
    prisma.blueprint.upsert({
      where: { blueprintId: 'BP-0557' },
      update: {},
      create: {
        blueprintId: 'BP-0557',
        name: 'Propeller Blade Tip',
        category: 'Rotating',
        material: 'Titanium Ti-6Al-4V',
        oem: 'Wärtsilä',
        certification: "Lloyd's Register",
        status: 'active',
        printCount: 67,
        description: 'Propeller blade tip for marine propulsion',
      },
    }),
    prisma.blueprint.upsert({
      where: { blueprintId: 'BP-0558' },
      update: {},
      create: {
        blueprintId: 'BP-0558',
        name: 'Exhaust Valve Seat',
        category: 'Thermal',
        material: 'Inconel 718',
        oem: 'MAN Energy',
        certification: 'DNV GL',
        status: 'active',
        printCount: 34,
        description: 'Exhaust valve seat for engine systems',
      },
    }),
    prisma.blueprint.upsert({
      where: { blueprintId: 'BP-0559' },
      update: {},
      create: {
        blueprintId: 'BP-0559',
        name: 'Anchor Chain Link',
        category: 'Structural',
        material: 'Stainless Steel 316L',
        oem: 'Viking Norsafe',
        certification: "Lloyd's Register",
        status: 'active',
        printCount: 89,
        description: 'Anchor chain link for mooring systems',
      },
    }),
    prisma.blueprint.upsert({
      where: { blueprintId: 'BP-0560' },
      update: {},
      create: {
        blueprintId: 'BP-0560',
        name: 'Navigation Light Bracket',
        category: 'Electrical',
        material: 'Aluminum 6061-T6',
        oem: 'Zenitel',
        certification: 'CSA',
        status: 'active',
        printCount: 56,
        description: 'Navigation light bracket for marine vessels',
      },
    }),
    prisma.blueprint.upsert({
      where: { blueprintId: 'BP-0561' },
      update: {},
      create: {
        blueprintId: 'BP-0561',
        name: 'Bilge Pump Impeller',
        category: 'Rotating',
        material: 'Bronze C95400',
        oem: 'Hamworthy',
        certification: 'DNV GL',
        status: 'active',
        printCount: 78,
        description: 'Bilge pump impeller for marine applications',
      },
    }),
    prisma.blueprint.upsert({
      where: { blueprintId: 'BP-0562' },
      update: {},
      create: {
        blueprintId: 'BP-0562',
        name: 'Winch Drum Sleeve',
        category: 'Structural',
        material: 'Steel 4340',
        oem: 'MacGregor',
        certification: "Lloyd's Register",
        status: 'active',
        printCount: 23,
        description: 'Winch drum sleeve for deck machinery',
      },
    }),
    prisma.blueprint.upsert({
      where: { blueprintId: 'BP-0563' },
      update: {},
      create: {
        blueprintId: 'BP-0563',
        name: 'Cooling Water Strainer',
        category: 'Thermal',
        material: 'Copper C18150',
        oem: 'Alfa Laval',
        certification: 'DNV GL',
        status: 'active',
        printCount: 45,
        description: 'Cooling water strainer for heat exchange systems',
      },
    }),
  ])
  console.log(`Created ${blueprints.length} blueprints`)

  // ==================== PRINT CENTERS ====================
  const centers = await Promise.all([
    prisma.printCenter.upsert({
      where: { centerId: 'PC-001' },
      update: {},
      create: {
        centerId: 'PC-001',
        name: 'Atlantic XL',
        location: 'Halifax, NS',
        status: 'online',
        certification: "Lloyd's Register",
        totalPrinters: 6,
        activePrinters: 5,
        capacity: 87,
        currentJobs: 8,
        completedToday: 12,
        contactName: 'Robert Mackenzie',
        contactEmail: 'rmackenzie@atlanticxl.ca',
        materials: JSON.stringify(['Titanium Ti-6Al-4V', 'Stainless Steel 316L', 'Aluminum 6061-T6']),
        specialties: JSON.stringify(['Marine Components', 'Structural Parts']),
      },
    }),
    prisma.printCenter.upsert({
      where: { centerId: 'PC-002' },
      update: {},
      create: {
        centerId: 'PC-002',
        name: 'DNV Calgary',
        location: 'Calgary, AB',
        status: 'online',
        certification: 'DNV GL',
        totalPrinters: 4,
        activePrinters: 4,
        capacity: 92,
        currentJobs: 6,
        completedToday: 8,
        contactName: 'Sarah Thompson',
        contactEmail: 'sthompson@dnvcalgary.com',
        materials: JSON.stringify(['Inconel 718', 'H13 Tool Steel', 'Steel 4340']),
        specialties: JSON.stringify(['Oil & Gas Components', 'High-temp Parts']),
      },
    }),
    prisma.printCenter.upsert({
      where: { centerId: 'PC-003' },
      update: {},
      create: {
        centerId: 'PC-003',
        name: 'LR Montreal',
        location: 'Montreal, QC',
        status: 'busy',
        certification: "Lloyd's Register",
        totalPrinters: 5,
        activePrinters: 5,
        capacity: 98,
        currentJobs: 12,
        completedToday: 5,
        contactName: 'Jean-Pierre Dubois',
        contactEmail: 'jpdubois@lrmontreal.ca',
        materials: JSON.stringify(['Titanium Ti-6Al-4V', 'Copper C18150', 'Stainless Steel 316L']),
        specialties: JSON.stringify(['Thermal Components', 'Heat Exchangers']),
      },
    }),
    prisma.printCenter.upsert({
      where: { centerId: 'PC-004' },
      update: {},
      create: {
        centerId: 'PC-004',
        name: "St. John's AM",
        location: "St. John's, NL",
        status: 'offline',
        certification: 'DNV GL',
        totalPrinters: 3,
        activePrinters: 0,
        capacity: 0,
        currentJobs: 0,
        completedToday: 0,
        contactName: "Michael O'Brien",
        contactEmail: 'mobrien@stjohnsam.ca',
        materials: JSON.stringify(['Aluminum 6061-T6', 'Steel 4340']),
        specialties: JSON.stringify(['Remote Support', 'Emergency Parts']),
      },
    }),
    prisma.printCenter.upsert({
      where: { centerId: 'PC-005' },
      update: {},
      create: {
        centerId: 'PC-005',
        name: 'Victoria Marine',
        location: 'Victoria, BC',
        status: 'online',
        certification: 'CSA',
        totalPrinters: 4,
        activePrinters: 3,
        capacity: 65,
        currentJobs: 4,
        completedToday: 6,
        contactName: 'Emily Wong',
        contactEmail: 'ewong@victoriamarine.ca',
        materials: JSON.stringify(['Stainless Steel 316L', 'Aluminum 6061-T6', 'Copper C18150']),
        specialties: JSON.stringify(['Naval Components', 'Electrical Enclosures']),
      },
    }),
  ])
  console.log(`Created ${centers.length} print centers`)

  // ==================== ORDERS ====================
  const orders = await Promise.all([
    prisma.order.upsert({
      where: { orderId: 'ORD-2847' },
      update: {},
      create: {
        orderId: 'ORD-2847',
        partName: 'Thruster Bearing Housing',
        status: 'printing',
        priority: 'high',
        quantity: 2,
        eta: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        requesterId: users[0].id,
        blueprintId: blueprints[0].id,
        centerId: centers[0].id,
      },
    }),
    prisma.order.upsert({
      where: { orderId: 'ORD-2846' },
      update: {},
      create: {
        orderId: 'ORD-2846',
        partName: 'Hydraulic Valve Body',
        status: 'quality_check',
        priority: 'medium',
        quantity: 1,
        eta: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        requesterId: users[1].id,
        blueprintId: blueprints[1].id,
        centerId: centers[1].id,
      },
    }),
    prisma.order.upsert({
      where: { orderId: 'ORD-2845' },
      update: {},
      create: {
        orderId: 'ORD-2845',
        partName: 'Sensor Mounting Bracket',
        status: 'shipped',
        priority: 'low',
        quantity: 5,
        eta: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        requesterId: users[2].id,
        blueprintId: blueprints[2].id,
        centerId: centers[0].id,
      },
    }),
    prisma.order.upsert({
      where: { orderId: 'ORD-2844' },
      update: {},
      create: {
        orderId: 'ORD-2844',
        partName: 'Impeller Shaft',
        status: 'pending',
        priority: 'high',
        quantity: 1,
        eta: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        requesterId: users[0].id,
        blueprintId: blueprints[3].id,
      },
    }),
    prisma.order.upsert({
      where: { orderId: 'ORD-2843' },
      update: {},
      create: {
        orderId: 'ORD-2843',
        partName: 'Heat Exchanger Plate',
        status: 'delivered',
        priority: 'medium',
        quantity: 3,
        eta: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        requesterId: users[1].id,
        blueprintId: blueprints[4].id,
        centerId: centers[2].id,
      },
    }),
    prisma.order.upsert({
      where: { orderId: 'ORD-2842' },
      update: {},
      create: {
        orderId: 'ORD-2842',
        partName: 'Pressure Housing Seal',
        status: 'printing',
        priority: 'medium',
        quantity: 4,
        eta: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        requesterId: users[0].id,
        blueprintId: blueprints[5].id,
        centerId: centers[0].id,
      },
    }),
    prisma.order.upsert({
      where: { orderId: 'ORD-2841' },
      update: {},
      create: {
        orderId: 'ORD-2841',
        partName: 'Motor Coupling Flange',
        status: 'delivered',
        priority: 'low',
        quantity: 2,
        eta: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        requesterId: users[2].id,
        blueprintId: blueprints[6].id,
        centerId: centers[1].id,
      },
    }),
    prisma.order.upsert({
      where: { orderId: 'ORD-2850' },
      update: {},
      create: {
        orderId: 'ORD-2850',
        partName: 'Flange Connector',
        status: 'pending',
        priority: 'medium',
        quantity: 3,
        eta: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        requesterId: users[3].id,
      },
    }),
    prisma.order.upsert({
      where: { orderId: 'ORD-2851' },
      update: {},
      create: {
        orderId: 'ORD-2851',
        partName: 'Gasket Seal Ring',
        status: 'printing',
        priority: 'high',
        quantity: 10,
        eta: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        requesterId: users[4].id,
        centerId: centers[4].id,
      },
    }),
    prisma.order.upsert({
      where: { orderId: 'ORD-2852' },
      update: {},
      create: {
        orderId: 'ORD-2852',
        partName: 'Bearing Housing Cap',
        status: 'quality_check',
        priority: 'high',
        quantity: 2,
        eta: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        requesterId: users[0].id,
        centerId: centers[2].id,
      },
    }),
    prisma.order.upsert({
      where: { orderId: 'ORD-2853' },
      update: {},
      create: {
        orderId: 'ORD-2853',
        partName: 'Pump Impeller',
        status: 'shipped',
        priority: 'medium',
        quantity: 1,
        eta: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        requesterId: users[1].id,
        centerId: centers[1].id,
      },
    }),
    prisma.order.upsert({
      where: { orderId: 'ORD-2854' },
      update: {},
      create: {
        orderId: 'ORD-2854',
        partName: 'Valve Stem',
        status: 'delivered',
        priority: 'low',
        quantity: 5,
        eta: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        requesterId: users[2].id,
        centerId: centers[0].id,
      },
    }),
    prisma.order.upsert({
      where: { orderId: 'ORD-2855' },
      update: {},
      create: {
        orderId: 'ORD-2855',
        partName: 'Shaft Coupling',
        status: 'pending',
        priority: 'medium',
        quantity: 2,
        eta: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        requesterId: users[3].id,
      },
    }),
    prisma.order.upsert({
      where: { orderId: 'ORD-2856' },
      update: {},
      create: {
        orderId: 'ORD-2856',
        partName: 'Pipe Fitting Adapter',
        status: 'printing',
        priority: 'low',
        quantity: 8,
        eta: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        requesterId: users[4].id,
        centerId: centers[4].id,
      },
    }),
    prisma.order.upsert({
      where: { orderId: 'ORD-2857' },
      update: {},
      create: {
        orderId: 'ORD-2857',
        partName: 'Heat Sink Plate',
        status: 'quality_check',
        priority: 'medium',
        quantity: 4,
        eta: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        requesterId: users[0].id,
        centerId: centers[2].id,
      },
    }),
    prisma.order.upsert({
      where: { orderId: 'ORD-2858' },
      update: {},
      create: {
        orderId: 'ORD-2858',
        partName: 'Enclosure Bracket',
        status: 'shipped',
        priority: 'low',
        quantity: 6,
        eta: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        requesterId: users[1].id,
        centerId: centers[0].id,
      },
    }),
  ])
  console.log(`Created ${orders.length} orders`)

  // ==================== SHIPMENTS ====================
  const shipments = await Promise.all([
    prisma.shipment.upsert({
      where: { trackingId: 'AMC-001-2024' },
      update: {},
      create: {
        trackingId: 'AMC-001-2024',
        orderId: orders[0].id,
        status: 'in_transit',
        origin: 'Atlantic XL, Halifax NS',
        destination: "Horizon Maritime, St. John's NL",
        carrier: 'FedEx Priority',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        distance: 1150,
        progress: 65,
      },
    }),
    prisma.shipment.upsert({
      where: { trackingId: 'AMC-002-2024' },
      update: {},
      create: {
        trackingId: 'AMC-002-2024',
        orderId: orders[1].id,
        status: 'out_for_delivery',
        origin: 'DNV Calgary, Calgary AB',
        destination: 'Noble Corp, Edmonton AB',
        carrier: 'Purolator Express',
        estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        distance: 300,
        progress: 90,
      },
    }),
    prisma.shipment.upsert({
      where: { trackingId: 'AMC-003-2024' },
      update: {},
      create: {
        trackingId: 'AMC-003-2024',
        orderId: orders[2].id,
        status: 'delivered',
        origin: 'Atlantic XL, Halifax NS',
        destination: "Equinor, St. John's NL",
        carrier: 'UPS Ground',
        estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        actualDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        distance: 1150,
        progress: 100,
      },
    }),
    prisma.shipment.upsert({
      where: { trackingId: 'AMC-004-2024' },
      update: {},
      create: {
        trackingId: 'AMC-004-2024',
        orderId: orders[4].id,
        status: 'delivered',
        origin: 'LR Montreal, Montreal QC',
        destination: 'Cove, Edmonton AB',
        carrier: 'FedEx Ground',
        estimatedDelivery: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        actualDelivery: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        distance: 3500,
        progress: 100,
      },
    }),
    prisma.shipment.upsert({
      where: { trackingId: 'AMC-005-2024' },
      update: {},
      create: {
        trackingId: 'AMC-005-2024',
        orderId: orders[5].id,
        status: 'in_transit',
        origin: 'Atlantic XL, Halifax NS',
        destination: "Rosen Maritime, St. John's NL",
        carrier: 'FedEx Priority',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        distance: 1150,
        progress: 45,
      },
    }),
    prisma.shipment.upsert({
      where: { trackingId: 'AMC-006-2024' },
      update: {},
      create: {
        trackingId: 'AMC-006-2024',
        orderId: orders[6].id,
        status: 'delivered',
        origin: 'DNV Calgary, Calgary AB',
        destination: 'Horizon Maritime, Halifax NS',
        carrier: 'Purolator',
        estimatedDelivery: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        actualDelivery: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        distance: 4500,
        progress: 100,
      },
    }),
    prisma.shipment.upsert({
      where: { trackingId: 'AMC-007-2024' },
      update: {},
      create: {
        trackingId: 'AMC-007-2024',
        orderId: orders[7].id,
        status: 'preparing',
        origin: 'Atlantic XL, Halifax NS',
        destination: "Equinor, St. John's NL",
        carrier: 'FedEx Priority',
        estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        distance: 1150,
        progress: 10,
      },
    }),
    prisma.shipment.upsert({
      where: { trackingId: 'AMC-008-2024' },
      update: {},
      create: {
        trackingId: 'AMC-008-2024',
        orderId: orders[8].id,
        status: 'delayed',
        origin: 'Victoria Marine, Victoria BC',
        destination: 'Thales, Ottawa ON',
        carrier: 'Canada Post',
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        distance: 4500,
        progress: 35,
      },
    }),
  ])
  console.log(`Created ${shipments.length} shipments`)

  // ==================== PARTNERS ====================
  const partners = await Promise.all([
    prisma.partner.upsert({
      where: { id: 'partner-1' },
      update: {},
      create: {
        id: 'partner-1',
        name: 'Rosen Maritime',
        email: 'partnerships@rosenmaritime.com',
        phone: '+1 902-555-0101',
        type: 'OEM',
        status: 'active',
        address: "St. John's, NL, Canada",
        notes: 'Key partner for thruster components',
        blueprints: 47,
        totalPrints: 1234,
        revenue: 185000,
        joinedDate: new Date('2024-01-15'),
      },
    }),
    prisma.partner.upsert({
      where: { id: 'partner-2' },
      update: {},
      create: {
        id: 'partner-2',
        name: 'Noble Corp',
        email: 'supply.chain@noblecorp.com',
        phone: '+1 403-555-0202',
        type: 'OEM',
        status: 'active',
        address: 'Calgary, AB, Canada',
        notes: 'Primary offshore drilling equipment supplier',
        blueprints: 32,
        totalPrints: 856,
        revenue: 128000,
        joinedDate: new Date('2024-02-20'),
      },
    }),
    prisma.partner.upsert({
      where: { id: 'partner-3' },
      update: {},
      create: {
        id: 'partner-3',
        name: 'Thales Canada',
        email: 'procurement@thales.ca',
        phone: '+1 416-555-0303',
        type: 'Integrator',
        status: 'active',
        address: 'Ottawa, ON, Canada',
        notes: 'Defense sector partner',
        blueprints: 28,
        totalPrints: 445,
        revenue: 95000,
        joinedDate: new Date('2024-03-10'),
      },
    }),
    prisma.partner.upsert({
      where: { id: 'partner-4' },
      update: {},
      create: {
        id: 'partner-4',
        name: 'Equinor Canada',
        email: 'sourcing@equinor.com',
        phone: '+1 709-555-0404',
        type: 'OEM',
        status: 'active',
        address: "St. John's, NL, Canada",
        notes: 'Bay du Nord project partner',
        blueprints: 23,
        totalPrints: 567,
        revenue: 85000,
        joinedDate: new Date('2024-03-25'),
      },
    }),
    prisma.partner.upsert({
      where: { id: 'partner-5' },
      update: {},
      create: {
        id: 'partner-5',
        name: 'Horizon Maritime',
        email: 'operations@horizonmaritime.ca',
        phone: '+1 902-555-0505',
        type: 'Service Provider',
        status: 'active',
        address: 'Halifax, NS, Canada',
        notes: 'Primary beta tester for pilot program',
        blueprints: 18,
        totalPrints: 324,
        revenue: 48500,
        joinedDate: new Date('2024-04-01'),
      },
    }),
    prisma.partner.upsert({
      where: { id: 'partner-6' },
      update: {},
      create: {
        id: 'partner-6',
        name: 'Cove Energy',
        email: 'supply@coveenergy.com',
        phone: '+1 780-555-0606',
        type: 'Distributor',
        status: 'pending',
        address: 'Edmonton, AB, Canada',
        notes: 'New partner - pending verification',
        blueprints: 12,
        totalPrints: 89,
        revenue: 13400,
        joinedDate: new Date('2024-06-15'),
      },
    }),
    prisma.partner.upsert({
      where: { id: 'partner-7' },
      update: {},
      create: {
        id: 'partner-7',
        name: 'Wärtsilä Canada',
        email: 'parts@wartsila.com',
        phone: '+1 604-555-0707',
        type: 'OEM',
        status: 'active',
        address: 'Vancouver, BC, Canada',
        notes: 'Marine propulsion systems specialist',
        blueprints: 35,
        totalPrints: 678,
        revenue: 102000,
        joinedDate: new Date('2024-02-01'),
      },
    }),
    prisma.partner.upsert({
      where: { id: 'partner-8' },
      update: {},
      create: {
        id: 'partner-8',
        name: 'Ecotex Industries',
        email: 'procurement@ecotex.ca',
        phone: '+1 867-555-0808',
        type: 'Integrator',
        status: 'inactive',
        address: 'Yellowknife, NT, Canada',
        notes: 'Arctic utility components - account on hold',
        blueprints: 8,
        totalPrints: 45,
        revenue: 6750,
        joinedDate: new Date('2024-01-20'),
      },
    }),
  ])
  console.log(`Created ${partners.length} partners`)

  // ==================== MATERIALS ====================
  const materials = await Promise.all([
    prisma.material.upsert({
      where: { id: 'material-1' },
      update: {},
      create: {
        id: 'material-1',
        name: 'Titanium Ti-6Al-4V',
        category: 'Metal Powder',
        totalStock: 450,
        unit: 'kg',
        minStock: 200,
        maxStock: 1000,
        reorderPoint: 300,
        status: 'adequate',
        unitCost: 450,
        leadTime: 14,
      },
    }),
    prisma.material.upsert({
      where: { id: 'material-2' },
      update: {},
      create: {
        id: 'material-2',
        name: 'Stainless Steel 316L',
        category: 'Metal Powder',
        totalStock: 680,
        unit: 'kg',
        minStock: 300,
        maxStock: 1500,
        reorderPoint: 400,
        status: 'adequate',
        unitCost: 120,
        leadTime: 7,
      },
    }),
    prisma.material.upsert({
      where: { id: 'material-3' },
      update: {},
      create: {
        id: 'material-3',
        name: 'Aluminum 6061-T6',
        category: 'Metal Powder',
        totalStock: 150,
        unit: 'kg',
        minStock: 200,
        maxStock: 800,
        reorderPoint: 250,
        status: 'low',
        unitCost: 85,
        leadTime: 5,
      },
    }),
    prisma.material.upsert({
      where: { id: 'material-4' },
      update: {},
      create: {
        id: 'material-4',
        name: 'Inconel 718',
        category: 'Metal Powder',
        totalStock: 280,
        unit: 'kg',
        minStock: 150,
        maxStock: 600,
        reorderPoint: 200,
        status: 'adequate',
        unitCost: 680,
        leadTime: 21,
      },
    }),
    prisma.material.upsert({
      where: { id: 'material-5' },
      update: {},
      create: {
        id: 'material-5',
        name: 'H13 Tool Steel',
        category: 'Metal Powder',
        totalStock: 90,
        unit: 'kg',
        minStock: 100,
        maxStock: 400,
        reorderPoint: 150,
        status: 'critical',
        unitCost: 220,
        leadTime: 10,
      },
    }),
    prisma.material.upsert({
      where: { id: 'material-6' },
      update: {},
      create: {
        id: 'material-6',
        name: 'Steel 4340',
        category: 'Metal Powder',
        totalStock: 520,
        unit: 'kg',
        minStock: 200,
        maxStock: 1000,
        reorderPoint: 300,
        status: 'adequate',
        unitCost: 95,
        leadTime: 7,
      },
    }),
    prisma.material.upsert({
      where: { id: 'material-7' },
      update: {},
      create: {
        id: 'material-7',
        name: 'Copper C18150',
        category: 'Metal Powder',
        totalStock: 120,
        unit: 'kg',
        minStock: 80,
        maxStock: 300,
        reorderPoint: 100,
        status: 'adequate',
        unitCost: 180,
        leadTime: 12,
      },
    }),
    prisma.material.upsert({
      where: { id: 'material-8' },
      update: {},
      create: {
        id: 'material-8',
        name: 'Bronze C95400',
        category: 'Metal Powder',
        totalStock: 75,
        unit: 'kg',
        minStock: 100,
        maxStock: 400,
        reorderPoint: 150,
        status: 'low',
        unitCost: 150,
        leadTime: 10,
      },
    }),
  ])
  console.log(`Created ${materials.length} materials`)

  // ==================== MATERIAL STOCKS ====================
  const materialStocks = await Promise.all([
    // Titanium at Atlantic XL, LR Montreal, Victoria Marine
    prisma.materialStock.create({ data: { materialId: materials[0].id, centerId: centers[0].id, stock: 200 } }),
    prisma.materialStock.create({ data: { materialId: materials[0].id, centerId: centers[2].id, stock: 150 } }),
    prisma.materialStock.create({ data: { materialId: materials[0].id, centerId: centers[4].id, stock: 100 } }),
    // Stainless Steel at Atlantic XL, DNV Calgary, LR Montreal
    prisma.materialStock.create({ data: { materialId: materials[1].id, centerId: centers[0].id, stock: 300 } }),
    prisma.materialStock.create({ data: { materialId: materials[1].id, centerId: centers[1].id, stock: 200 } }),
    prisma.materialStock.create({ data: { materialId: materials[1].id, centerId: centers[2].id, stock: 180 } }),
    // Aluminum at Atlantic XL, Victoria Marine
    prisma.materialStock.create({ data: { materialId: materials[2].id, centerId: centers[0].id, stock: 80 } }),
    prisma.materialStock.create({ data: { materialId: materials[2].id, centerId: centers[4].id, stock: 70 } }),
    // Inconel at DNV Calgary, LR Montreal
    prisma.materialStock.create({ data: { materialId: materials[3].id, centerId: centers[1].id, stock: 180 } }),
    prisma.materialStock.create({ data: { materialId: materials[3].id, centerId: centers[2].id, stock: 100 } }),
    // H13 Tool Steel at DNV Calgary, Atlantic XL
    prisma.materialStock.create({ data: { materialId: materials[4].id, centerId: centers[1].id, stock: 60 } }),
    prisma.materialStock.create({ data: { materialId: materials[4].id, centerId: centers[0].id, stock: 30 } }),
    // Steel 4340 at DNV Calgary, Atlantic XL
    prisma.materialStock.create({ data: { materialId: materials[5].id, centerId: centers[1].id, stock: 300 } }),
    prisma.materialStock.create({ data: { materialId: materials[5].id, centerId: centers[0].id, stock: 220 } }),
    // Copper at LR Montreal
    prisma.materialStock.create({ data: { materialId: materials[6].id, centerId: centers[2].id, stock: 120 } }),
    // Bronze at Victoria Marine
    prisma.materialStock.create({ data: { materialId: materials[7].id, centerId: centers[4].id, stock: 75 } }),
  ])
  console.log(`Created ${materialStocks.length} material stocks`)

  // ==================== CERTIFICATIONS ====================
  const certifications = await Promise.all([
    prisma.certification.upsert({
      where: { id: 'cert-1' },
      update: {},
      create: {
        id: 'cert-1',
        name: "Lloyd's Register Type Approval",
        type: 'Type Approval',
        issuer: "Lloyd's Register",
        holder: 'Atlantic XL',
        status: 'active',
        issueDate: new Date('2023-06-15'),
        expiryDate: new Date('2026-06-14'),
        scope: 'Marine structural and critical components - Metal AM',
        documentUrl: '/certs/lr-atlantic-xl.pdf',
      },
    }),
    prisma.certification.upsert({
      where: { id: 'cert-2' },
      update: {},
      create: {
        id: 'cert-2',
        name: 'DNV GL Part 6 Certification',
        type: 'Part Certification',
        issuer: 'DNV GL',
        holder: 'DNV Calgary',
        status: 'active',
        issueDate: new Date('2023-08-20'),
        expiryDate: new Date('2026-08-19'),
        scope: 'Offshore components - High-temperature materials',
        documentUrl: '/certs/dnv-calgary.pdf',
      },
    }),
    prisma.certification.upsert({
      where: { id: 'cert-3' },
      update: {},
      create: {
        id: 'cert-3',
        name: "Lloyd's Register Type Approval",
        type: 'Type Approval',
        issuer: "Lloyd's Register",
        holder: 'LR Montreal',
        status: 'active',
        issueDate: new Date('2024-01-10'),
        expiryDate: new Date('2027-01-09'),
        scope: 'Thermal components and heat exchangers',
        documentUrl: '/certs/lr-montreal.pdf',
      },
    }),
    prisma.certification.upsert({
      where: { id: 'cert-4' },
      update: {},
      create: {
        id: 'cert-4',
        name: 'CSA Certification',
        type: 'Product Certification',
        issuer: 'CSA Group',
        holder: 'Victoria Marine',
        status: 'active',
        issueDate: new Date('2023-09-01'),
        expiryDate: new Date('2025-08-31'),
        scope: 'Electrical enclosures and control panels',
        documentUrl: '/certs/csa-victoria.pdf',
      },
    }),
    prisma.certification.upsert({
      where: { id: 'cert-5' },
      update: {},
      create: {
        id: 'cert-5',
        name: 'DNV GL Part 6 Certification',
        type: 'Part Certification',
        issuer: 'DNV GL',
        holder: 'Atlantic XL',
        status: 'active',
        issueDate: new Date('2023-11-15'),
        expiryDate: new Date('2026-11-14'),
        scope: 'Subsea components - Titanium alloys',
        documentUrl: '/certs/dnv-atlantic-xl.pdf',
      },
    }),
    prisma.certification.upsert({
      where: { id: 'cert-6' },
      update: {},
      create: {
        id: 'cert-6',
        name: 'ISO 13485 Medical Devices',
        type: 'Quality Management',
        issuer: 'BSI',
        holder: 'Atlantic XL',
        status: 'pending',
        issueDate: new Date('2024-06-01'),
        expiryDate: new Date('2027-05-31'),
        scope: 'Medical device component manufacturing (pending audit)',
        documentUrl: null,
      },
    }),
    prisma.certification.upsert({
      where: { id: 'cert-7' },
      update: {},
      create: {
        id: 'cert-7',
        name: "Lloyd's Register Type Approval",
        type: 'Type Approval',
        issuer: "Lloyd's Register",
        holder: "St. John's AM",
        status: 'expired',
        issueDate: new Date('2021-03-20'),
        expiryDate: new Date('2024-03-19'),
        scope: 'Emergency marine components',
        documentUrl: '/certs/lr-stjohns.pdf',
      },
    }),
    prisma.certification.upsert({
      where: { id: 'cert-8' },
      update: {},
      create: {
        id: 'cert-8',
        name: 'AS9100D Aerospace',
        type: 'Quality Management',
        issuer: 'SAI Global',
        holder: 'DNV Calgary',
        status: 'expiring_soon',
        issueDate: new Date('2022-04-01'),
        expiryDate: new Date('2025-03-31'),
        scope: 'Aerospace component manufacturing',
        documentUrl: '/certs/as9100-calgary.pdf',
      },
    }),
  ])
  console.log(`Created ${certifications.length} certifications`)

  // ==================== AUDIT LOGS ====================
  for (const order of orders.slice(0, 5)) {
    await prisma.auditLog.create({
      data: {
        orderId: order.id,
        action: 'ORDER_CREATED',
        details: `Order ${order.orderId} created for ${order.partName}`,
        userId: order.requesterId,
      },
    })
    
    if (order.status !== 'pending') {
      await prisma.auditLog.create({
        data: {
          orderId: order.id,
          action: 'ORDER_UPDATED',
          details: `Order ${order.orderId} status changed to ${order.status}`,
          userId: null,
        },
      })
    }
  }
  console.log('Created audit logs')

  // ==================== DASHBOARD STATS ====================
  await prisma.dashboardStats.upsert({
    where: { id: 'stats-1' },
    update: {
      totalOrders: orders.length,
      activeOrders: orders.filter(o => ['pending', 'printing', 'quality_check'].includes(o.status)).length,
      deliveredParts: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.quantity, 0),
      avgLeadTime: 4.2,
      costSavings: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.quantity * 150, 0),
      totalBlueprints: blueprints.length,
      activeCenters: centers.filter(c => c.status === 'online').length,
    },
    create: {
      id: 'stats-1',
      totalOrders: orders.length,
      activeOrders: orders.filter(o => ['pending', 'printing', 'quality_check'].includes(o.status)).length,
      deliveredParts: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.quantity, 0),
      avgLeadTime: 4.2,
      costSavings: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.quantity * 150, 0),
      totalBlueprints: blueprints.length,
      activeCenters: centers.filter(c => c.status === 'online').length,
    },
  })
  console.log('Updated dashboard stats')

  // ==================== CERTIFICATION AUTHORITIES ====================
  const authorities = await Promise.all([
    prisma.certificationAuthority.upsert({
      where: { authorityId: 'CA-001' },
      update: {},
      create: {
        authorityId: 'CA-001',
        name: 'Det Norske Veritas',
        acronym: 'DNV',
        type: 'Marine & Offshore',
        contactEmail: 'certification@dnv.com',
        contactPhone: '+47-67-57-99-00',
        specializations: JSON.stringify(['Marine Engineering', 'Offshore Structures', 'Pressure Vessels']),
        approvedParts: 156,
        averageLeadTime: 45,
        websiteUrl: 'https://www.dnv.com',
        status: 'active',
      },
    }),
    prisma.certificationAuthority.upsert({
      where: { authorityId: 'CA-002' },
      update: {},
      create: {
        authorityId: 'CA-002',
        name: "Lloyd's Register",
        acronym: 'LR',
        type: 'Marine & Industrial',
        contactEmail: 'marine@lr.org',
        contactPhone: '+44-20-7709-9166',
        specializations: JSON.stringify(['Marine Classification', 'Quality Assurance', 'Industrial Equipment']),
        approvedParts: 203,
        averageLeadTime: 38,
        websiteUrl: 'https://www.lr.org',
        status: 'active',
      },
    }),
    prisma.certificationAuthority.upsert({
      where: { authorityId: 'CA-003' },
      update: {},
      create: {
        authorityId: 'CA-003',
        name: 'American Bureau of Shipping',
        acronym: 'ABS',
        type: 'Marine & Offshore',
        contactEmail: 'abs@eagle.org',
        contactPhone: '+1-281-877-5800',
        specializations: JSON.stringify(['Marine Vessels', 'Offshore Units', 'Structural Steel']),
        approvedParts: 178,
        averageLeadTime: 42,
        websiteUrl: 'https://www.eagle.org',
        status: 'active',
      },
    }),
    prisma.certificationAuthority.upsert({
      where: { authorityId: 'CA-004' },
      update: {},
      create: {
        authorityId: 'CA-004',
        name: 'Bureau Veritas',
        acronym: 'BV',
        type: 'Marine & Aerospace',
        contactEmail: 'marine@bureauveritas.com',
        contactPhone: '+33-1-55-24-70-00',
        specializations: JSON.stringify(['Marine Engineering', 'Aerospace Components', 'Material Testing']),
        approvedParts: 134,
        averageLeadTime: 50,
        websiteUrl: 'https://www.bureauveritas.com',
        status: 'active',
      },
    }),
    prisma.certificationAuthority.upsert({
      where: { authorityId: 'CA-005' },
      update: {},
      create: {
        authorityId: 'CA-005',
        name: 'International Organization for Standardization',
        acronym: 'ISO',
        type: 'Quality Standards',
        contactEmail: 'central@iso.org',
        contactPhone: '+41-22-749-01-11',
        specializations: JSON.stringify(['Quality Management', 'Environmental Standards', 'Safety Protocols']),
        approvedParts: 89,
        averageLeadTime: 60,
        websiteUrl: 'https://www.iso.org',
        status: 'active',
      },
    }),
  ])
  console.log(`Created ${authorities.length} certification authorities`)

  // ==================== CERTIFICATION REQUESTS ====================
  const certRequests = await Promise.all([
    prisma.certificationRequest.upsert({
      where: { requestId: 'CR-2024-001' },
      update: {},
      create: {
        requestId: 'CR-2024-001',
        blueprintId: blueprints[0].id,
        authorityId: authorities[0].id,
        status: 'approved',
        submittedDate: new Date('2024-11-15'),
        reviewedDate: new Date('2024-12-28'),
        notes: 'All material tests passed. Approved for marine use.',
        reviewerName: 'Dr. Hans Mueller',
        documentUrl: '/certs/CR-2024-001-approval.pdf',
      },
    }),
    prisma.certificationRequest.upsert({
      where: { requestId: 'CR-2025-012' },
      update: {},
      create: {
        requestId: 'CR-2025-012',
        blueprintId: blueprints[1].id,
        authorityId: authorities[1].id,
        status: 'under_review',
        submittedDate: new Date('2025-01-10'),
        notes: 'Awaiting final stress test results.',
        reviewerName: 'Sarah Mitchell',
      },
    }),
    prisma.certificationRequest.upsert({
      where: { requestId: 'CR-2026-003' },
      update: {},
      create: {
        requestId: 'CR-2026-003',
        blueprintId: blueprints[2].id,
        authorityId: authorities[2].id,
        status: 'submitted',
        submittedDate: new Date('2026-02-15'),
        notes: 'Initial submission for ABS review.',
        reviewerName: 'Michael Torres',
      },
    }),
    prisma.certificationRequest.upsert({
      where: { requestId: 'CR-2025-089' },
      update: {},
      create: {
        requestId: 'CR-2025-089',
        blueprintId: blueprints[3].id,
        authorityId: authorities[0].id,
        status: 'rejected',
        submittedDate: new Date('2025-10-05'),
        reviewedDate: new Date('2025-11-20'),
        notes: 'Material specification does not meet marine grade requirements. Resubmit with revised specs.',
        reviewerName: 'Dr. Hans Mueller',
      },
    }),
  ])
  console.log(`Created ${certRequests.length} certification requests`)

  // ==================== CUSTOMER ENGAGEMENTS ====================
  const engagements = await Promise.all([
    prisma.customerEngagement.upsert({
      where: { customerId: 'CUST-001' },
      update: {},
      create: {
        customerId: 'CUST-001',
        customerName: 'Horizon Maritime',
        industry: 'Offshore Oil & Gas',
        phase: 'maintenance',
        assessmentDate: new Date('2024-03-15'),
        adoptionDate: new Date('2024-05-20'),
        integrationDate: new Date('2024-07-10'),
        trainingDate: new Date('2024-08-05'),
        maintenanceStartDate: new Date('2024-09-01'),
        accountManager: 'Sarah Chen',
        healthScore: 92,
        rigCount: 12,
        status: 'active',
        notes: 'Excellent partnership. Exploring expansion to 8 more rigs.',
      },
    }),
    prisma.customerEngagement.upsert({
      where: { customerId: 'CUST-002' },
      update: {},
      create: {
        customerId: 'CUST-002',
        customerName: 'Noble Corp',
        industry: 'Offshore Drilling',
        phase: 'training',
        assessmentDate: new Date('2025-01-10'),
        adoptionDate: new Date('2025-03-15'),
        integrationDate: new Date('2025-05-20'),
        trainingDate: new Date('2026-01-15'),
        accountManager: 'Michael Torres',
        healthScore: 85,
        rigCount: 8,
        status: 'active',
        notes: 'On track for full deployment Q2 2026.',
      },
    }),
    prisma.customerEngagement.upsert({
      where: { customerId: 'CUST-003' },
      update: {},
      create: {
        customerId: 'CUST-003',
        customerName: 'Equinor',
        industry: 'Offshore Oil & Gas',
        phase: 'integration',
        assessmentDate: new Date('2025-06-01'),
        adoptionDate: new Date('2025-08-15'),
        integrationDate: new Date('2025-11-10'),
        accountManager: 'Lisa Wang',
        healthScore: 78,
        rigCount: 15,
        status: 'active',
        notes: 'Large-scale deployment in progress. Minor delays due to certification approvals.',
      },
    }),
    prisma.customerEngagement.upsert({
      where: { customerId: 'CUST-004' },
      update: {},
      create: {
        customerId: 'CUST-004',
        customerName: 'Transocean',
        industry: 'Offshore Drilling',
        phase: 'adoption',
        assessmentDate: new Date('2025-11-20'),
        adoptionDate: new Date('2026-01-15'),
        accountManager: 'David Reynolds',
        healthScore: 70,
        rigCount: 10,
        status: 'active',
        notes: 'Proof of concept successful. Moving to pilot program.',
      },
    }),
    prisma.customerEngagement.upsert({
      where: { customerId: 'CUST-005' },
      update: {},
      create: {
        customerId: 'CUST-005',
        customerName: 'Valaris',
        industry: 'Offshore Drilling',
        phase: 'assessment',
        assessmentDate: new Date('2026-02-01'),
        accountManager: 'Sarah Chen',
        healthScore: 65,
        rigCount: 6,
        status: 'active',
        notes: 'Initial assessment phase. Very interested in cost savings model.',
      },
    }),
  ])
  console.log(`Created ${engagements.length} customer engagements`)

  // ==================== TRAINING SESSIONS ====================
  const trainingSessions = await Promise.all([
    prisma.trainingSession.upsert({
      where: { sessionId: 'TS-2024-001' },
      update: {},
      create: {
        sessionId: 'TS-2024-001',
        customerId: engagements[0].id,
        title: 'Metal AM Operations Fundamentals',
        type: 'Operation',
        scheduledDate: new Date('2024-08-05'),
        duration: 480, // 8 hours
        trainer: 'Dr. Alireza Vahedi Nemani',
        location: 'Horizon Maritime - Halifax Facility',
        attendees: JSON.stringify(['John Operator', 'Mike Stevens', 'Rachel Adams', 'Tom Wilson']),
        status: 'completed',
        materials: '/training/operations-fundamentals.pdf',
        feedback: 'Excellent session. Very hands-on and practical.',
      },
    }),
    prisma.trainingSession.upsert({
      where: { sessionId: 'TS-2024-002' },
      update: {},
      create: {
        sessionId: 'TS-2024-002',
        customerId: engagements[0].id,
        title: 'Quality Control & Inspection',
        type: 'Quality Control',
        scheduledDate: new Date('2024-08-19'),
        duration: 360, // 6 hours
        trainer: 'Dr. Mahya Ghaffari',
        location: 'Horizon Maritime - Halifax Facility',
        attendees: JSON.stringify(['Sarah Chen', 'David Brown', 'Lisa Wang']),
        status: 'completed',
        materials: '/training/quality-control.pdf',
        feedback: 'Critical knowledge for maintaining certification compliance.',
      },
    }),
    prisma.trainingSession.upsert({
      where: { sessionId: 'TS-2026-015' },
      update: {},
      create: {
        sessionId: 'TS-2026-015',
        customerId: engagements[1].id,
        title: 'Advanced Maintenance Procedures',
        type: 'Maintenance',
        scheduledDate: new Date('2026-03-10'),
        duration: 420, // 7 hours
        trainer: 'Dr. Ali Nasiri',
        location: 'Noble Corp - Calgary Training Center',
        attendees: JSON.stringify(['Mike Johnson', 'Anna Peterson', 'Carlos Mendez']),
        status: 'scheduled',
        materials: '/training/maintenance-advanced.pdf',
      },
    }),
    prisma.trainingSession.upsert({
      where: { sessionId: 'TS-2026-020' },
      update: {},
      create: {
        sessionId: 'TS-2026-020',
        customerId: engagements[2].id,
        title: 'Safety Protocols for Additive Manufacturing',
        type: 'Safety',
        scheduledDate: new Date('2026-03-25'),
        duration: 240, // 4 hours
        trainer: 'Harsimran Malhi',
        location: 'Equinor - Stavanger Office',
        attendees: JSON.stringify(['Erik Hansen', 'Maria Silva', 'John Peterson', 'Emma Johnson']),
        status: 'scheduled',
        materials: '/training/safety-protocols.pdf',
      },
    }),
  ])
  console.log(`Created ${trainingSessions.length} training sessions`)

  // ==================== COMPARATIVE METRICS ====================
  const comparativeMetrics = await Promise.all([
    prisma.comparativeMetrics.create({
      data: {
        customerId: 'CUST-001',
        metricMonth: new Date('2025-12-01'),
        traditionalLeadTime: 21,
        almatechLeadTime: 4,
        leadTimeReduction: 81.0,
        traditionalWarehouseCost: 450000,
        almatechWarehouseCost: 85000,
        warehouseSavings: 81.1,
        partsRepaired: 12,
        partsReplaced: 45,
        designIterations: 8,
      },
    }),
    prisma.comparativeMetrics.create({
      data: {
        customerId: 'CUST-001',
        metricMonth: new Date('2026-01-01'),
        traditionalLeadTime: 18,
        almatechLeadTime: 3,
        leadTimeReduction: 83.3,
        traditionalWarehouseCost: 450000,
        almatechWarehouseCost: 82000,
        warehouseSavings: 81.8,
        partsRepaired: 15,
        partsReplaced: 52,
        designIterations: 11,
      },
    }),
    prisma.comparativeMetrics.create({
      data: {
        customerId: 'CUST-002',
        metricMonth: new Date('2026-01-01'),
        traditionalLeadTime: 25,
        almatechLeadTime: 5,
        leadTimeReduction: 80.0,
        traditionalWarehouseCost: 320000,
        almatechWarehouseCost: 65000,
        warehouseSavings: 79.7,
        partsRepaired: 8,
        partsReplaced: 28,
        designIterations: 5,
      },
    }),
  ])
  console.log(`Created ${comparativeMetrics.length} comparative metrics`)

  // ==================== ENVIRONMENTAL IMPACT ====================
  const envImpacts = await Promise.all([
    ...orders.slice(0, 10).map((order, idx) => 
      prisma.environmentalImpact.upsert({
        where: { orderId: order.id },
        update: {},
        create: {
          orderId: order.id,
          co2SavedKg: 45 + idx * 12,
          milesAvoided: 850 + idx * 200,
          transportMethod: idx % 3 === 0 ? 'helicopter' : idx % 3 === 1 ? 'vessel' : 'truck',
          wasteReduced: 2.5 + idx * 0.8,
          calculationMethod: 'EPA Carbon Footprint Calculator - Marine Transport',
        },
      })
    ),
  ])
  console.log(`Created ${envImpacts.length} environmental impact records`)

  // ==================== BLUEPRINT VERSIONS ====================
  const blueprintVersions = await Promise.all([
    prisma.blueprintVersion.create({
      data: {
        blueprintId: blueprints[0].id,
        version: 'v1.0',
        changes: 'Initial design',
        reason: 'Original OEM specifications',
        approvedBy: 'Engineering Team',
        approvedDate: new Date('2024-01-15'),
        filePath: '/blueprints/BP-1024/v1.0.step',
        status: 'approved',
      },
    }),
    prisma.blueprintVersion.create({
      data: {
        blueprintId: blueprints[0].id,
        version: 'v1.1',
        changes: 'Optimized bearing surface geometry for extended life',
        reason: 'Customer feedback - improved durability',
        approvedBy: 'Dr. Mahya Ghaffari',
        approvedDate: new Date('2024-06-10'),
        filePath: '/blueprints/BP-1024/v1.1.step',
        performanceData: JSON.stringify({ 'lifespan_improvement': '35%', 'weight_reduction': '8%' }),
        status: 'approved',
      },
    }),
    prisma.blueprintVersion.create({
      data: {
        blueprintId: blueprints[1].id,
        version: 'v2.0',
        changes: 'Redesigned flow channels for 20% higher efficiency',
        reason: 'Performance optimization request from Noble Corp',
        approvedBy: 'Engineering Team',
        approvedDate: new Date('2025-03-22'),
        filePath: '/blueprints/BP-0892/v2.0.step',
        performanceData: JSON.stringify({ 'flow_improvement': '20%', 'pressure_rating': '15% higher' }),
        status: 'approved',
      },
    }),
  ])
  console.log(`Created ${blueprintVersions.length} blueprint versions`)

  // ==================== CUSTOMIZATION REQUESTS ====================
  const customizationRequests = await Promise.all([
    prisma.customizationRequest.upsert({
      where: { requestId: 'CUST-REQ-001' },
      update: {},
      create: {
        requestId: 'CUST-REQ-001',
        blueprintId: blueprints[2].id,
        requesterId: users[0].id,
        requesterName: users[0].name,
        description: 'Modify sensor bracket to accommodate larger sensor housing (45mm vs 40mm)',
        justification: 'New sensor model required for upgraded monitoring system',
        status: 'approved',
        estimatedCost: 1200,
        estimatedTime: 5,
        assignedTo: 'Design Team Alpha',
      },
    }),
    prisma.customizationRequest.upsert({
      where: { requestId: 'CUST-REQ-002' },
      update: {},
      create: {
        requestId: 'CUST-REQ-002',
        blueprintId: blueprints[3].id,
        requesterId: users[1].id,
        requesterName: users[1].name,
        description: 'Add reinforcement ribs to impeller blades for high-vibration environment',
        justification: 'Operating conditions more severe than original design parameters',
        status: 'pending',
        estimatedCost: 2500,
        estimatedTime: 12,
        assignedTo: 'Dr. Ali Nasiri',
      },
    }),
    prisma.customizationRequest.upsert({
      where: { requestId: 'CUST-REQ-003' },
      update: {},
      create: {
        requestId: 'CUST-REQ-003',
        blueprintId: blueprints[0].id,
        requesterId: users[2].id,
        requesterName: users[2].name,
        description: 'Change material from Ti-6Al-4V to stainless steel 316L for cost reduction',
        justification: 'Application does not require titanium-grade corrosion resistance',
        status: 'implemented',
        estimatedCost: 800,
        estimatedTime: 3,
        assignedTo: 'Materials Engineering',
      },
    }),
  ])
  console.log(`Created ${customizationRequests.length} customization requests`)

  console.log('\n✅ Seed completed successfully!')
  console.log(`
    Summary:
    - ${users.length} users
    - ${blueprints.length} blueprints
    - ${centers.length} print centers
    - ${orders.length} orders
    - ${shipments.length} shipments
    - ${partners.length} partners
    - ${materials.length} materials
    - ${materialStocks.length} material stocks
    - ${certifications.length} certifications
    - ${authorities.length} certification authorities
    - ${certRequests.length} certification requests
    - ${engagements.length} customer engagements
    - ${trainingSessions.length} training sessions
    - ${comparativeMetrics.length} comparative metrics
    - ${envImpacts.length} environmental impact records
    - ${blueprintVersions.length} blueprint versions
    - ${customizationRequests.length} customization requests
  `)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
