// Static data for AddManuChain Dashboard
// Fixed base date for deterministic timestamps (prevents SSR hydration mismatches)
const BASE_DATE = new Date('2026-03-18T12:00:00Z').getTime()

export const users = [
  { id: 'user-1', email: 'j.operator@horizonmaritime.com', name: 'John Operator', role: 'operator', company: 'Horizon Maritime' },
  { id: 'user-2', email: 's.chen@noblecorp.com', name: 'Sarah Chen', role: 'manager', company: 'Noble Corp' },
  { id: 'user-3', email: 'm.johnson@equinor.com', name: 'Mike Johnson', role: 'operator', company: 'Equinor' },
  { id: 'user-4', email: 'd.brown@rosenmaritime.com', name: 'David Brown', role: 'manager', company: 'Rosen Maritime' },
  { id: 'user-5', email: 'l.wang@thales.ca', name: 'Lisa Wang', role: 'procurement', company: 'Thales Canada' },
  { id: 'user-oem', email: 'partner@oem.com', name: 'OEM Partner', role: 'oem_partner', company: 'Baker Hughes' },
  { id: 'user-cert', email: 'authority@certification.com', name: 'Cert Authority', role: 'cert_authority', company: "Lloyd's Register" },
]

export const blueprints = [
  { id: 'bp-1', blueprintId: 'BP-1024', name: 'Thruster Bearing Housing', category: 'Structural', material: 'Titanium Ti-6Al-4V', oem: 'Rosen Maritime', certification: "Lloyd's Register", status: 'active', printCount: 47, description: 'High-performance thruster bearing housing for marine propulsion systems' },
  { id: 'bp-2', blueprintId: 'BP-0892', name: 'Hydraulic Valve Body', category: 'Hydraulic', material: 'Stainless Steel 316L', oem: 'Noble Corp', certification: 'DNV GL', status: 'active', printCount: 23, description: 'Precision hydraulic valve body for offshore equipment' },
  { id: 'bp-3', blueprintId: 'BP-0456', name: 'Sensor Mounting Bracket', category: 'Structural', material: 'Aluminum 6061-T6', oem: 'Equinor', certification: 'Self-certified', status: 'active', printCount: 156, description: 'Universal sensor mounting bracket for marine environments' },
  { id: 'bp-4', blueprintId: 'BP-0789', name: 'Impeller Shaft', category: 'Rotating', material: 'Inconel 718', oem: 'Thales', certification: "Lloyd's Register", status: 'pending_review', printCount: 12, description: 'High-strength impeller shaft for pump systems' },
  { id: 'bp-5', blueprintId: 'BP-0334', name: 'Heat Exchanger Plate', category: 'Thermal', material: 'Copper C18150', oem: 'Cove', certification: 'DNV GL', status: 'active', printCount: 89, description: 'Heat exchanger plate for thermal management systems' },
  { id: 'bp-6', blueprintId: 'BP-0667', name: 'Pressure Housing Seal', category: 'Seals', material: 'H13 Tool Steel', oem: 'Rosen Maritime', certification: 'DNV GL', status: 'active', printCount: 34, description: 'High-pressure housing seal for subsea applications' },
  { id: 'bp-7', blueprintId: 'BP-0123', name: 'Motor Coupling Flange', category: 'Coupling', material: 'Steel 4340', oem: 'Horizon Maritime', certification: 'Self-certified', status: 'active', printCount: 78, description: 'Motor coupling flange for power transmission' },
  { id: 'bp-8', blueprintId: 'BP-0555', name: 'Control Panel Enclosure', category: 'Electrical', material: 'Aluminum 6061-T6', oem: 'Ecotex', certification: 'CSA', status: 'inactive', printCount: 5, description: 'Control panel enclosure for electrical systems' },
  { id: 'bp-9', blueprintId: 'BP-0556', name: 'Hydraulic Cylinder Rod', category: 'Hydraulic', material: 'Steel 4340', oem: 'Bosch Rexroth', certification: 'DNV GL', status: 'active', printCount: 45, description: 'Hydraulic cylinder rod for offshore equipment' },
  { id: 'bp-10', blueprintId: 'BP-0557', name: 'Propeller Blade Tip', category: 'Rotating', material: 'Titanium Ti-6Al-4V', oem: 'Wärtsilä', certification: "Lloyd's Register", status: 'active', printCount: 67, description: 'Propeller blade tip for marine propulsion' },
  { id: 'bp-11', blueprintId: 'BP-0558', name: 'Exhaust Valve Seat', category: 'Thermal', material: 'Inconel 718', oem: 'MAN Energy', certification: 'DNV GL', status: 'active', printCount: 34, description: 'Exhaust valve seat for engine systems' },
  { id: 'bp-12', blueprintId: 'BP-0559', name: 'Anchor Chain Link', category: 'Structural', material: 'Stainless Steel 316L', oem: 'Viking Norsafe', certification: "Lloyd's Register", status: 'active', printCount: 89, description: 'Anchor chain link for mooring systems' },
]

export const printCenters = [
  { id: 'pc-1', centerId: 'PC-001', name: 'Atlantic XL', location: 'Halifax, NS', status: 'online', certification: "Lloyd's Register", totalPrinters: 6, activePrinters: 5, capacity: 87, currentJobs: 8, completedToday: 12, contactName: 'Robert Mackenzie', contactEmail: 'rmackenzie@atlanticxl.ca', materials: ['Titanium Ti-6Al-4V', 'Stainless Steel 316L', 'Aluminum 6061-T6'], specialties: ['Marine Components', 'Structural Parts'] },
  { id: 'pc-2', centerId: 'PC-002', name: 'DNV Calgary', location: 'Calgary, AB', status: 'online', certification: 'DNV GL', totalPrinters: 4, activePrinters: 4, capacity: 92, currentJobs: 6, completedToday: 8, contactName: 'Sarah Thompson', contactEmail: 'sthompson@dnvcalgary.com', materials: ['Inconel 718', 'H13 Tool Steel', 'Steel 4340'], specialties: ['Oil & Gas Components', 'High-temp Parts'] },
  { id: 'pc-3', centerId: 'PC-003', name: 'LR Montreal', location: 'Montreal, QC', status: 'busy', certification: "Lloyd's Register", totalPrinters: 5, activePrinters: 5, capacity: 98, currentJobs: 12, completedToday: 5, contactName: 'Jean-Pierre Dubois', contactEmail: 'jpdubois@lrmontreal.ca', materials: ['Titanium Ti-6Al-4V', 'Copper C18150', 'Stainless Steel 316L'], specialties: ['Thermal Components', 'Heat Exchangers'] },
  { id: 'pc-4', centerId: 'PC-004', name: "St. John's AM", location: "St. John's, NL", status: 'offline', certification: 'DNV GL', totalPrinters: 3, activePrinters: 0, capacity: 0, currentJobs: 0, completedToday: 0, contactName: "Michael O'Brien", contactEmail: 'mobrien@stjohnsam.ca', materials: ['Aluminum 6061-T6', 'Steel 4340'], specialties: ['Remote Support', 'Emergency Parts'] },
  { id: 'pc-5', centerId: 'PC-005', name: 'Victoria Marine', location: 'Victoria, BC', status: 'online', certification: 'CSA', totalPrinters: 4, activePrinters: 3, capacity: 65, currentJobs: 4, completedToday: 6, contactName: 'Emily Wong', contactEmail: 'ewong@victoriamarine.ca', materials: ['Stainless Steel 316L', 'Aluminum 6061-T6', 'Copper C18150'], specialties: ['Naval Components', 'Electrical Enclosures'] },
]

// User's Own 3D Printers
export const userPrinters = [
  { id: 'upr-1', name: 'Markforged X7', status: 'online', location: 'Workshop A', certification: ['DNV GL', 'FFF'], materials: ['Onyx', 'Carbon Fiber', 'Continuous Fiber'], printingSpeed: 'Check 1', completedJobs: 23, buildPlatform: '330x184x200 mm' },
  { id: 'upr-2', name: 'HP Jet Fusion 580', status: 'busy', location: 'Workshop Day A', certification: ['DNV GL'], materials: ['HP PA 12', 'HP PA 12 GB', 'HP 3D HR PA 12'], printingSpeed: 'Multi-jet Fusion', completedJobs: 45, buildPlatform: '380x215x200 mm' },
  { id: 'upr-3', name: 'Ultimaker S5', status: 'online', location: 'Design Studio', certification: ['CSA', 'FFF'], materials: ['PLA', 'ABS', 'PETG', '+1 more'], printingSpeed: 'FFF (Dual Extrusion)', completedJobs: 67, buildPlatform: '330x240x300 mm' },
  { id: 'upr-4', name: 'Formlabs Form 3', status: 'offline', location: 'Lab', certification: undefined, materials: ['Standard Resin', 'Tough Resin'], printingSpeed: 'SLA', completedJobs: 12, buildPlatform: '145x81.5x100 mm', warning: 'Bureau Veritas' },
]

// Facility Printers (for print centers) - detailed dashboard view
export type FacilityPrinter = {
  id: string
  printerId: string
  name: string
  location: string
  status: 'online' | 'busy' | 'offline' | 'maintenance'
  availability: { start: string; end: string }
  completedJobs: number
  lastService: string
  nextMaintenance: string
  certification: string
  currentJob?: {
    orderId: string
    partName: string
    progress: number
    material: string
    estimatedTime: string
  }
  jobQueue: Array<{
    id: string
    orderId: string
    partName: string
    material: string
    duration: string
    priority: 'low' | 'medium' | 'high'
  }>
  materialStock: Array<{
    material: string
    quantity: number
    unit: string
    status: 'good' | 'low' | 'critical'
  }>
}

export const facilityPrinters: FacilityPrinter[] = [
  {
    id: 'fpr-1',
    printerId: 'MX7-001',
    name: 'Markforged X7',
    location: 'Engine Room — Deck 3 · FFF + Continuous Fiber',
    status: 'busy',
    availability: { start: '06:00', end: '22:00' },
    completedJobs: 47,
    lastService: 'Feb 9, 2026',
    nextMaintenance: 'Mar 23, 2026',
    certification: 'DNV-GL-2024-0541',
    currentJob: {
      orderId: 'ORD-2847',
      partName: 'Bearing Cap Std.',
      progress: 62,
      material: 'Onyx FR',
      estimatedTime: '3h 20m total',
    },
    jobQueue: [
      { id: 'jq-1', orderId: 'ORD-2848', partName: 'Pump Bracket', material: 'Carbon Fiber', duration: '2h 15m', priority: 'high' },
      { id: 'jq-2', orderId: 'ORD-2849', partName: 'Vibration Damper', material: 'Onyx GL', duration: '1h 45m', priority: 'medium' },
    ],
    materialStock: [
      { material: 'Onyx FR', quantity: 14, unit: 'kg', status: 'good' },
      { material: 'Carbon Fiber', quantity: 3, unit: 'kg', status: 'low' },
      { material: 'Continuous Fiber', quantity: 8, unit: 'spools', status: 'good' },
    ],
  },
  {
    id: 'fpr-2',
    printerId: 'HJF580-002',
    name: 'HP Jet Fusion 580',
    location: 'Production Floor — Deck 2 · Multi-jet Fusion (MJF)',
    status: 'online',
    availability: { start: '06:00', end: '22:00' },
    completedJobs: 89,
    lastService: 'Feb 15, 2026',
    nextMaintenance: 'Mar 29, 2026',
    certification: 'DNV-GL-2024-0542',
    currentJob: undefined,
    jobQueue: [
      { id: 'jq-3', orderId: 'ORD-2850', partName: 'Valve Housing', material: 'HP PA 12 GB', duration: '4h 30m', priority: 'high' },
      { id: 'jq-4', orderId: 'ORD-2851', partName: 'Sensor Mount', material: 'HP PA 12', duration: '2h', priority: 'medium' },
      { id: 'jq-5', orderId: 'ORD-2852', partName: 'Connector Block', material: 'HP PA 12', duration: '3h 15m', priority: 'low' },
    ],
    materialStock: [
      { material: 'HP PA 12', quantity: 45, unit: 'kg', status: 'good' },
      { material: 'HP PA 12 GB', quantity: 12, unit: 'kg', status: 'good' },
      { material: 'HP 3D HR PA 12', quantity: 5, unit: 'kg', status: 'low' },
    ],
  },
  {
    id: 'fpr-3',
    printerId: 'UMS5-003',
    name: 'Ultimaker S5',
    location: 'Prototyping Lab — Engineering Wing · FFF Dual Extrusion',
    status: 'offline',
    availability: { start: '08:00', end: '18:00' },
    completedJobs: 78,
    lastService: 'Feb 20, 2026',
    nextMaintenance: 'Mar 15, 2026',
    certification: 'CSA-Certified-2024',
    currentJob: undefined,
    jobQueue: [],
    materialStock: [
      { material: 'PLA', quantity: 22, unit: 'kg', status: 'good' },
      { material: 'ABS', quantity: 8, unit: 'kg', status: 'good' },
      { material: 'PETG', quantity: 2, unit: 'kg', status: 'critical' },
    ],
  },
  {
    id: 'fpr-4',
    printerId: 'FFF3-004',
    name: 'HP Jet Fusion 580',
    location: 'Secondary Lab — Deck 1 · Multi-jet Fusion (MJF)',
    status: 'online',
    availability: { start: '06:00', end: '22:00' },
    completedJobs: 56,
    lastService: 'Feb 18, 2026',
    nextMaintenance: 'Mar 25, 2026',
    certification: 'DNV-GL-2024-0543',
    currentJob: undefined,
    jobQueue: [
      { id: 'jq-6', orderId: 'ORD-2853', partName: 'Thermal Bracket', material: 'HP PA 12', duration: '2h 45m', priority: 'medium' },
    ],
    materialStock: [
      { material: 'HP PA 12', quantity: 35, unit: 'kg', status: 'good' },
      { material: 'HP PA 12 GB', quantity: 8, unit: 'kg', status: 'low' },
      { material: 'HP 3D HR PA 12', quantity: 2, unit: 'kg', status: 'critical' },
    ],
  },
]

// DRM Approval types
export type ApprovalState = {
  approved: boolean
  approvedAt: string | null
  approvedBy: string | null
}

export type Order = {
  id: string
  orderId: string
  partName: string
  status: string
  priority: string
  quantity: number
  eta: string
  requesterId: string
  blueprintId: string | null
  centerId: string | null
  printerType?: 'own_printer' | 'nearby_facilities'
  notes: string | null
  createdAt: string
  oemApproval: ApprovalState
  certApproval: ApprovalState
  printAuthToken: string | null
}

// ── Financial helper ─────────────────────────────────────────────────────────
// Derives a deterministic price from the order so no schema change is needed.
// Model: customer pays orderValue → 75% print centre · 15% OEM royalty · 10% platform fee
export function getOrderFinancials(order: Order) {
  const seed = order.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const unitPrice = Math.round((1800 + (seed % 6200)) / 100) * 100   // $1 800–$8 000
  const orderValue = unitPrice * order.quantity
  return {
    orderValue,
    printCost:   Math.round(orderValue * 0.75),   // → Print Centre
    oemRoyalty:  Math.round(orderValue * 0.15),   // → OEM (IP licence fee)
    platformFee: Math.round(orderValue * 0.10),   // → AddManuChain
  }
}

export const orders: Order[] = [
  // ORD-2847: Fully approved + token issued (printing)
  { id: 'ord-1', orderId: 'ORD-2847', partName: 'Thruster Bearing Housing', status: 'printing', priority: 'high', quantity: 2, eta: new Date(BASE_DATE + 2 * 24 * 60 * 60 * 1000).toISOString(), requesterId: 'user-1', blueprintId: 'bp-1', centerId: 'pc-1', notes: null, createdAt: new Date(BASE_DATE - 1 * 24 * 60 * 60 * 1000).toISOString(), oemApproval: { approved: true, approvedAt: new Date(BASE_DATE - 20 * 60 * 60 * 1000).toISOString(), approvedBy: 'OEM Partner (Baker Hughes)' }, certApproval: { approved: true, approvedAt: new Date(BASE_DATE - 18 * 60 * 60 * 1000).toISOString(), approvedBy: "Cert Authority (Lloyd's Register)" }, printAuthToken: 'drm-a3f8b2c1-4d5e-6f7a-8b9c-0d1e2f3a4b5c' },
  // ORD-DEMO-001: Same part name, pending both approvals - visible to all personas
  { id: 'ord-demo', orderId: 'ORD-DEMO-001', partName: 'Thruster Bearing Housing', status: 'pending', priority: 'high', quantity: 2, eta: new Date(BASE_DATE + 4 * 24 * 60 * 60 * 1000).toISOString(), requesterId: 'user-1', blueprintId: 'bp-1', centerId: 'pc-1', notes: 'Demo order - visible across all personas', createdAt: new Date(BASE_DATE - 0.5 * 24 * 60 * 60 * 1000).toISOString(), oemApproval: { approved: false, approvedAt: null, approvedBy: null }, certApproval: { approved: false, approvedAt: null, approvedBy: null }, printAuthToken: null },
  // ORD-2846: OEM approved, cert pending
  { id: 'ord-2', orderId: 'ORD-2846', partName: 'Hydraulic Valve Body', status: 'quality_check', priority: 'medium', quantity: 1, eta: new Date(BASE_DATE + 1 * 24 * 60 * 60 * 1000).toISOString(), requesterId: 'user-2', blueprintId: 'bp-2', centerId: 'pc-2', notes: null, createdAt: new Date(BASE_DATE - 2 * 24 * 60 * 60 * 1000).toISOString(), oemApproval: { approved: true, approvedAt: new Date(BASE_DATE - 30 * 60 * 60 * 1000).toISOString(), approvedBy: 'OEM Partner (Baker Hughes)' }, certApproval: { approved: false, approvedAt: null, approvedBy: null }, printAuthToken: null },
  // ORD-2845: Both approved, shipped
  { id: 'ord-3', orderId: 'ORD-2845', partName: 'Sensor Mounting Bracket', status: 'shipped', priority: 'low', quantity: 5, eta: new Date(BASE_DATE - 1 * 24 * 60 * 60 * 1000).toISOString(), requesterId: 'user-3', blueprintId: 'bp-3', centerId: 'pc-1', notes: null, createdAt: new Date(BASE_DATE - 3 * 24 * 60 * 60 * 1000).toISOString(), oemApproval: { approved: true, approvedAt: new Date(BASE_DATE - 60 * 60 * 60 * 1000).toISOString(), approvedBy: 'OEM Partner (Baker Hughes)' }, certApproval: { approved: true, approvedAt: new Date(BASE_DATE - 58 * 60 * 60 * 1000).toISOString(), approvedBy: "Cert Authority (Lloyd's Register)" }, printAuthToken: 'drm-b4e9c3d2-5e6f-7a8b-9c0d-1e2f3a4b5c6d' },
  // ORD-2844: No approvals yet — awaiting in queue
  { id: 'ord-4', orderId: 'ORD-2844', partName: 'Impeller Shaft', status: 'pending', priority: 'high', quantity: 1, eta: new Date(BASE_DATE + 5 * 24 * 60 * 60 * 1000).toISOString(), requesterId: 'user-1', blueprintId: 'bp-4', centerId: 'pc-2', notes: 'Rush order for offshore platform', createdAt: new Date(BASE_DATE - 0.5 * 24 * 60 * 60 * 1000).toISOString(), oemApproval: { approved: false, approvedAt: null, approvedBy: null }, certApproval: { approved: false, approvedAt: null, approvedBy: null }, printAuthToken: null },
  // ORD-2843: Both approved, delivered
  { id: 'ord-5', orderId: 'ORD-2843', partName: 'Heat Exchanger Plate', status: 'delivered', priority: 'medium', quantity: 3, eta: new Date(BASE_DATE - 3 * 24 * 60 * 60 * 1000).toISOString(), requesterId: 'user-2', blueprintId: 'bp-5', centerId: 'pc-3', notes: null, createdAt: new Date(BASE_DATE - 7 * 24 * 60 * 60 * 1000).toISOString(), oemApproval: { approved: true, approvedAt: new Date(BASE_DATE - 8 * 24 * 60 * 60 * 1000).toISOString(), approvedBy: 'OEM Partner (Baker Hughes)' }, certApproval: { approved: true, approvedAt: new Date(BASE_DATE - 7.8 * 24 * 60 * 60 * 1000).toISOString(), approvedBy: "Cert Authority (DNV GL)" }, printAuthToken: 'drm-c5f0d4e3-6f7a-8b9c-0d1e-2f3a4b5c6d7e' },
  // ORD-2842: Cert approved, OEM pending
  { id: 'ord-6', orderId: 'ORD-2842', partName: 'Pressure Housing Seal', status: 'pending', priority: 'medium', quantity: 4, eta: new Date(BASE_DATE + 2 * 24 * 60 * 60 * 1000).toISOString(), requesterId: 'user-1', blueprintId: 'bp-6', centerId: 'pc-1', notes: null, createdAt: new Date(BASE_DATE - 1 * 24 * 60 * 60 * 1000).toISOString(), oemApproval: { approved: false, approvedAt: null, approvedBy: null }, certApproval: { approved: true, approvedAt: new Date(BASE_DATE - 22 * 60 * 60 * 1000).toISOString(), approvedBy: "Cert Authority (DNV GL)" }, printAuthToken: null },
  // ORD-2841: Both approved, delivered
  { id: 'ord-7', orderId: 'ORD-2841', partName: 'Motor Coupling Flange', status: 'delivered', priority: 'low', quantity: 2, eta: new Date(BASE_DATE - 5 * 24 * 60 * 60 * 1000).toISOString(), requesterId: 'user-3', blueprintId: 'bp-7', centerId: 'pc-2', notes: null, createdAt: new Date(BASE_DATE - 10 * 24 * 60 * 60 * 1000).toISOString(), oemApproval: { approved: true, approvedAt: new Date(BASE_DATE - 11 * 24 * 60 * 60 * 1000).toISOString(), approvedBy: 'OEM Partner (Baker Hughes)' }, certApproval: { approved: true, approvedAt: new Date(BASE_DATE - 10.8 * 24 * 60 * 60 * 1000).toISOString(), approvedBy: "Cert Authority (Lloyd's Register)" }, printAuthToken: 'drm-d6a1e5f4-7a8b-9c0d-1e2f-3a4b5c6d7e8f' },
  // ORD-2850: No approvals — awaiting queue
  { id: 'ord-8', orderId: 'ORD-2850', partName: 'Flange Connector', status: 'pending', priority: 'medium', quantity: 3, eta: new Date(BASE_DATE + 4 * 24 * 60 * 60 * 1000).toISOString(), requesterId: 'user-4', blueprintId: null, centerId: 'pc-2', notes: null, createdAt: new Date(BASE_DATE).toISOString(), oemApproval: { approved: false, approvedAt: null, approvedBy: null }, certApproval: { approved: false, approvedAt: null, approvedBy: null }, printAuthToken: null },
  // ORD-2851: OEM approved only
  { id: 'ord-9', orderId: 'ORD-2851', partName: 'Gasket Seal Ring', status: 'pending', priority: 'high', quantity: 10, eta: new Date(BASE_DATE + 3 * 24 * 60 * 60 * 1000).toISOString(), requesterId: 'user-5', blueprintId: 'bp-9', centerId: 'pc-5', notes: null, createdAt: new Date(BASE_DATE - 0.5 * 24 * 60 * 60 * 1000).toISOString(), oemApproval: { approved: true, approvedAt: new Date(BASE_DATE - 10 * 60 * 60 * 1000).toISOString(), approvedBy: 'OEM Partner (Baker Hughes)' }, certApproval: { approved: false, approvedAt: null, approvedBy: null }, printAuthToken: null },
  // ORD-2852: Both approved — ready to print
  { id: 'ord-10', orderId: 'ORD-2852', partName: 'Bearing Housing Cap', status: 'pending', priority: 'high', quantity: 2, eta: new Date(BASE_DATE + 1 * 24 * 60 * 60 * 1000).toISOString(), requesterId: 'user-1', blueprintId: 'bp-12', centerId: 'pc-3', notes: null, createdAt: new Date(BASE_DATE - 2 * 24 * 60 * 60 * 1000).toISOString(), oemApproval: { approved: true, approvedAt: new Date(BASE_DATE - 5 * 60 * 60 * 1000).toISOString(), approvedBy: 'OEM Partner (Baker Hughes)' }, certApproval: { approved: true, approvedAt: new Date(BASE_DATE - 3 * 60 * 60 * 1000).toISOString(), approvedBy: "Cert Authority (Lloyd's Register)" }, printAuthToken: null },
  { id: 'ord-11', orderId: 'ORD-2853', partName: 'Pump Impeller', status: 'shipped', priority: 'medium', quantity: 1, eta: new Date(BASE_DATE - 1 * 24 * 60 * 60 * 1000).toISOString(), requesterId: 'user-2', blueprintId: null, centerId: 'pc-2', notes: null, createdAt: new Date(BASE_DATE - 4 * 24 * 60 * 60 * 1000).toISOString(), oemApproval: { approved: true, approvedAt: new Date(BASE_DATE - 5 * 24 * 60 * 60 * 1000).toISOString(), approvedBy: 'OEM Partner (Baker Hughes)' }, certApproval: { approved: true, approvedAt: new Date(BASE_DATE - 4.8 * 24 * 60 * 60 * 1000).toISOString(), approvedBy: "Cert Authority (DNV GL)" }, printAuthToken: 'drm-e7b2f6a5-8b9c-0d1e-2f3a-4b5c6d7e8f9a' },
  { id: 'ord-12', orderId: 'ORD-2854', partName: 'Valve Stem', status: 'delivered', priority: 'low', quantity: 5, eta: new Date(BASE_DATE - 4 * 24 * 60 * 60 * 1000).toISOString(), requesterId: 'user-3', blueprintId: null, centerId: 'pc-1', notes: null, createdAt: new Date(BASE_DATE - 8 * 24 * 60 * 60 * 1000).toISOString(), oemApproval: { approved: true, approvedAt: new Date(BASE_DATE - 9 * 24 * 60 * 60 * 1000).toISOString(), approvedBy: 'OEM Partner (Baker Hughes)' }, certApproval: { approved: true, approvedAt: new Date(BASE_DATE - 8.8 * 24 * 60 * 60 * 1000).toISOString(), approvedBy: "Cert Authority (Lloyd's Register)" }, printAuthToken: 'drm-f8c3a7b6-9c0d-1e2f-3a4b-5c6d7e8f9a0b' },
  { id: 'ord-13', orderId: 'ORD-2855', partName: 'Shaft Coupling', status: 'pending', priority: 'medium', quantity: 2, eta: new Date(BASE_DATE + 5 * 24 * 60 * 60 * 1000).toISOString(), requesterId: 'user-4', blueprintId: null, centerId: null, notes: null, createdAt: new Date(BASE_DATE).toISOString(), oemApproval: { approved: false, approvedAt: null, approvedBy: null }, certApproval: { approved: false, approvedAt: null, approvedBy: null }, printAuthToken: null },
  { id: 'ord-14', orderId: 'ORD-2856', partName: 'Pipe Fitting Adapter', status: 'printing', priority: 'low', quantity: 8, eta: new Date(BASE_DATE + 3 * 24 * 60 * 60 * 1000).toISOString(), requesterId: 'user-5', blueprintId: null, centerId: 'pc-5', notes: null, createdAt: new Date(BASE_DATE - 1 * 24 * 60 * 60 * 1000).toISOString(), oemApproval: { approved: true, approvedAt: new Date(BASE_DATE - 25 * 60 * 60 * 1000).toISOString(), approvedBy: 'OEM Partner (Baker Hughes)' }, certApproval: { approved: true, approvedAt: new Date(BASE_DATE - 23 * 60 * 60 * 1000).toISOString(), approvedBy: "Cert Authority (CSA)" }, printAuthToken: 'drm-a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
]

export const shipments = [
  { id: 'ship-1', trackingId: 'AMC-001-2024', orderId: 'ord-1', status: 'in_transit', origin: 'Atlantic XL, Halifax NS', destination: "Horizon Maritime, St. John's NL", carrier: 'FedEx Priority', estimatedDelivery: new Date(BASE_DATE + 2 * 24 * 60 * 60 * 1000).toISOString(), actualDelivery: null, distance: 1150, progress: 65 },
  { id: 'ship-2', trackingId: 'AMC-002-2024', orderId: 'ord-2', status: 'out_for_delivery', origin: 'DNV Calgary, Calgary AB', destination: 'Noble Corp, Edmonton AB', carrier: 'Purolator Express', estimatedDelivery: new Date(BASE_DATE + 1 * 24 * 60 * 60 * 1000).toISOString(), actualDelivery: null, distance: 300, progress: 90 },
  { id: 'ship-3', trackingId: 'AMC-003-2024', orderId: 'ord-3', status: 'delivered', origin: 'Atlantic XL, Halifax NS', destination: "Equinor, St. John's NL", carrier: 'UPS Ground', estimatedDelivery: new Date(BASE_DATE - 1 * 24 * 60 * 60 * 1000).toISOString(), actualDelivery: new Date(BASE_DATE - 1 * 24 * 60 * 60 * 1000).toISOString(), distance: 1150, progress: 100 },
  { id: 'ship-4', trackingId: 'AMC-004-2024', orderId: 'ord-5', status: 'delivered', origin: 'LR Montreal, Montreal QC', destination: 'Cove, Edmonton AB', carrier: 'FedEx Ground', estimatedDelivery: new Date(BASE_DATE - 5 * 24 * 60 * 60 * 1000).toISOString(), actualDelivery: new Date(BASE_DATE - 5 * 24 * 60 * 60 * 1000).toISOString(), distance: 3500, progress: 100 },
  { id: 'ship-5', trackingId: 'AMC-005-2024', orderId: 'ord-6', status: 'in_transit', origin: 'Atlantic XL, Halifax NS', destination: "Rosen Maritime, St. John's NL", carrier: 'FedEx Priority', estimatedDelivery: new Date(BASE_DATE + 2 * 24 * 60 * 60 * 1000).toISOString(), actualDelivery: null, distance: 1150, progress: 45 },
  { id: 'ship-6', trackingId: 'AMC-006-2024', orderId: 'ord-7', status: 'delivered', origin: 'DNV Calgary, Calgary AB', destination: 'Horizon Maritime, Halifax NS', carrier: 'Purolator', estimatedDelivery: new Date(BASE_DATE - 8 * 24 * 60 * 60 * 1000).toISOString(), actualDelivery: new Date(BASE_DATE - 8 * 24 * 60 * 60 * 1000).toISOString(), distance: 4500, progress: 100 },
  { id: 'ship-7', trackingId: 'AMC-007-2024', orderId: 'ord-8', status: 'preparing', origin: 'Atlantic XL, Halifax NS', destination: "Equinor, St. John's NL", carrier: 'FedEx Priority', estimatedDelivery: new Date(BASE_DATE + 4 * 24 * 60 * 60 * 1000).toISOString(), actualDelivery: null, distance: 1150, progress: 10 },
  { id: 'ship-8', trackingId: 'AMC-008-2024', orderId: 'ord-9', status: 'delayed', origin: 'Victoria Marine, Victoria BC', destination: 'Thales, Ottawa ON', carrier: 'Canada Post', estimatedDelivery: new Date(BASE_DATE + 3 * 24 * 60 * 60 * 1000).toISOString(), actualDelivery: null, distance: 4500, progress: 35 },
]

export const partners = [
  { id: 'partner-1', name: 'Rosen Maritime', email: 'partnerships@rosenmaritime.com', phone: '+1 902-555-0101', type: 'OEM', status: 'active', address: "St. John's, NL, Canada", notes: 'Key partner for thruster components', blueprints: 47, totalPrints: 1234, revenue: 185000, joinedDate: '2024-01-15' },
  { id: 'partner-2', name: 'Noble Corp', email: 'supply.chain@noblecorp.com', phone: '+1 403-555-0202', type: 'OEM', status: 'active', address: 'Calgary, AB, Canada', notes: 'Primary offshore drilling equipment supplier', blueprints: 32, totalPrints: 856, revenue: 128000, joinedDate: '2024-02-20' },
  { id: 'partner-3', name: 'Thales Canada', email: 'procurement@thales.ca', phone: '+1 416-555-0303', type: 'Integrator', status: 'active', address: 'Ottawa, ON, Canada', notes: 'Defense sector partner', blueprints: 28, totalPrints: 445, revenue: 95000, joinedDate: '2024-03-10' },
  { id: 'partner-4', name: 'Equinor Canada', email: 'sourcing@equinor.com', phone: '+1 709-555-0404', type: 'OEM', status: 'active', address: "St. John's, NL, Canada", notes: 'Bay du Nord project partner', blueprints: 23, totalPrints: 567, revenue: 85000, joinedDate: '2024-03-25' },
  { id: 'partner-5', name: 'Horizon Maritime', email: 'operations@horizonmaritime.ca', phone: '+1 902-555-0505', type: 'Service Provider', status: 'active', address: 'Halifax, NS, Canada', notes: 'Primary beta tester for pilot program', blueprints: 18, totalPrints: 324, revenue: 48500, joinedDate: '2024-04-01' },
  { id: 'partner-6', name: 'Cove Energy', email: 'supply@coveenergy.com', phone: '+1 780-555-0606', type: 'Distributor', status: 'pending', address: 'Edmonton, AB, Canada', notes: 'New partner - pending verification', blueprints: 12, totalPrints: 89, revenue: 13400, joinedDate: '2024-06-15' },
  { id: 'partner-7', name: 'Wärtsilä Canada', email: 'parts@wartsila.com', phone: '+1 604-555-0707', type: 'OEM', status: 'active', address: 'Vancouver, BC, Canada', notes: 'Marine propulsion systems specialist', blueprints: 35, totalPrints: 678, revenue: 102000, joinedDate: '2024-02-01' },
  { id: 'partner-8', name: 'Ecotex Industries', email: 'procurement@ecotex.ca', phone: '+1 867-555-0808', type: 'Integrator', status: 'inactive', address: 'Yellowknife, NT, Canada', notes: 'Arctic utility components - account on hold', blueprints: 8, totalPrints: 45, revenue: 6750, joinedDate: '2024-01-20' },
]

export const materials = [
  { id: 'mat-1', name: 'Titanium Ti-6Al-4V', category: 'Metal Powder', totalStock: 450, unit: 'kg', minStock: 200, maxStock: 1000, reorderPoint: 300, status: 'adequate', unitCost: 450, leadTime: 14, centerStocks: [{ centerName: 'Atlantic XL', stock: 200 }, { centerName: 'LR Montreal', stock: 150 }, { centerName: 'Victoria Marine', stock: 100 }] },
  { id: 'mat-2', name: 'Stainless Steel 316L', category: 'Metal Powder', totalStock: 680, unit: 'kg', minStock: 300, maxStock: 1500, reorderPoint: 400, status: 'adequate', unitCost: 120, leadTime: 7, centerStocks: [{ centerName: 'Atlantic XL', stock: 300 }, { centerName: 'DNV Calgary', stock: 200 }, { centerName: 'LR Montreal', stock: 180 }] },
  { id: 'mat-3', name: 'Aluminum 6061-T6', category: 'Metal Powder', totalStock: 150, unit: 'kg', minStock: 200, maxStock: 800, reorderPoint: 250, status: 'low', unitCost: 85, leadTime: 5, centerStocks: [{ centerName: 'Atlantic XL', stock: 80 }, { centerName: 'Victoria Marine', stock: 70 }] },
  { id: 'mat-4', name: 'Inconel 718', category: 'Metal Powder', totalStock: 280, unit: 'kg', minStock: 150, maxStock: 600, reorderPoint: 200, status: 'adequate', unitCost: 680, leadTime: 21, centerStocks: [{ centerName: 'DNV Calgary', stock: 180 }, { centerName: 'LR Montreal', stock: 100 }] },
  { id: 'mat-5', name: 'H13 Tool Steel', category: 'Metal Powder', totalStock: 90, unit: 'kg', minStock: 100, maxStock: 400, reorderPoint: 150, status: 'critical', unitCost: 220, leadTime: 10, centerStocks: [{ centerName: 'DNV Calgary', stock: 60 }, { centerName: 'Atlantic XL', stock: 30 }] },
  { id: 'mat-6', name: 'Steel 4340', category: 'Metal Powder', totalStock: 520, unit: 'kg', minStock: 200, maxStock: 1000, reorderPoint: 300, status: 'adequate', unitCost: 95, leadTime: 7, centerStocks: [{ centerName: 'DNV Calgary', stock: 300 }, { centerName: 'Atlantic XL', stock: 220 }] },
  { id: 'mat-7', name: 'Copper C18150', category: 'Metal Powder', totalStock: 120, unit: 'kg', minStock: 80, maxStock: 300, reorderPoint: 100, status: 'adequate', unitCost: 180, leadTime: 12, centerStocks: [{ centerName: 'LR Montreal', stock: 120 }] },
  { id: 'mat-8', name: 'Bronze C95400', category: 'Metal Powder', totalStock: 75, unit: 'kg', minStock: 100, maxStock: 400, reorderPoint: 150, status: 'low', unitCost: 150, leadTime: 10, centerStocks: [{ centerName: 'Victoria Marine', stock: 75 }] },
]

export const certifications = [
  { id: 'cert-1', name: "Lloyd's Register Type Approval", type: 'Type Approval', issuer: "Lloyd's Register", holder: 'Atlantic XL', status: 'active', issueDate: '2023-06-15', expiryDate: '2026-06-14', scope: 'Marine structural and critical components - Metal AM', documentUrl: '/certs/lr-atlantic-xl.pdf' },
  { id: 'cert-2', name: 'DNV GL Part 6 Certification', type: 'Part Certification', issuer: 'DNV GL', holder: 'DNV Calgary', status: 'active', issueDate: '2023-08-20', expiryDate: '2026-08-19', scope: 'Offshore components - High-temperature materials', documentUrl: '/certs/dnv-calgary.pdf' },
  { id: 'cert-3', name: "Lloyd's Register Type Approval", type: 'Type Approval', issuer: "Lloyd's Register", holder: 'LR Montreal', status: 'active', issueDate: '2024-01-10', expiryDate: '2027-01-09', scope: 'Thermal components and heat exchangers', documentUrl: '/certs/lr-montreal.pdf' },
  { id: 'cert-4', name: 'CSA Certification', type: 'Product Certification', issuer: 'CSA Group', holder: 'Victoria Marine', status: 'active', issueDate: '2023-09-01', expiryDate: '2025-08-31', scope: 'Electrical enclosures and control panels', documentUrl: '/certs/csa-victoria.pdf' },
  { id: 'cert-5', name: 'DNV GL Part 6 Certification', type: 'Part Certification', issuer: 'DNV GL', holder: 'Atlantic XL', status: 'active', issueDate: '2023-11-15', expiryDate: '2026-11-14', scope: 'Subsea components - Titanium alloys', documentUrl: '/certs/dnv-atlantic-xl.pdf' },
  { id: 'cert-6', name: 'ISO 13485 Medical Devices', type: 'Quality Management', issuer: 'BSI', holder: 'Atlantic XL', status: 'pending', issueDate: '2024-06-01', expiryDate: '2027-05-31', scope: 'Medical device component manufacturing (pending audit)', documentUrl: null },
  { id: 'cert-7', name: "Lloyd's Register Type Approval", type: 'Type Approval', issuer: "Lloyd's Register", holder: "St. John's AM", status: 'expired', issueDate: '2021-03-20', expiryDate: '2024-03-19', scope: 'Emergency marine components', documentUrl: '/certs/lr-stjohns.pdf' },
  { id: 'cert-8', name: 'AS9100D Aerospace', type: 'Quality Management', issuer: 'SAI Global', holder: 'DNV Calgary', status: 'expiring_soon', issueDate: '2022-04-01', expiryDate: '2025-03-31', scope: 'Aerospace component manufacturing', documentUrl: '/certs/as9100-calgary.pdf' },
]

// Extended audit logs with DRM events and hash chain fields
export const auditLogs = [
  { id: 'log-1', orderId: 'ord-1', action: 'ORDER_CREATED', details: 'Order ORD-2847 created for Thruster Bearing Housing', userId: 'user-1', createdAt: new Date(BASE_DATE - 25 * 60 * 60 * 1000).toISOString(), order: { orderId: 'ORD-2847', partName: 'Thruster Bearing Housing' }, prevHash: '0000000000000000', logHash: 'a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5' },
  { id: 'log-2', orderId: 'ord-1', action: 'OEM_APPROVED', details: 'OEM Partner (Baker Hughes) granted IP license for ORD-2847. Blueprint BP-1024 decryption rights authorized.', userId: 'user-oem', createdAt: new Date(BASE_DATE - 20 * 60 * 60 * 1000).toISOString(), order: { orderId: 'ORD-2847', partName: 'Thruster Bearing Housing' }, prevHash: 'a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5', logHash: 'b4e9c3d2e5f6a7b8c9d0e1f2a3b4c5d6' },
  { id: 'log-3', orderId: 'ord-1', action: 'CERT_APPROVED', details: "Lloyd's Register verified Print Center PC-001 (Atlantic XL) holds valid certification for Titanium Ti-6Al-4V. Authorization granted.", userId: 'user-cert', createdAt: new Date(BASE_DATE - 18 * 60 * 60 * 1000).toISOString(), order: { orderId: 'ORD-2847', partName: 'Thruster Bearing Housing' }, prevHash: 'b4e9c3d2e5f6a7b8c9d0e1f2a3b4c5d6', logHash: 'c5f0d4e3f6a7b8c9d0e1f2a3b4c5d6e7' },
  { id: 'log-4', orderId: 'ord-1', action: 'PRINT_TOKEN_ISSUED', details: 'Secure one-time print token drm-a3f8b2** issued to PC-001 (Atlantic XL). Token expires after single print job.', userId: 'user-cert', createdAt: new Date(BASE_DATE - 17 * 60 * 60 * 1000).toISOString(), order: { orderId: 'ORD-2847', partName: 'Thruster Bearing Housing' }, prevHash: 'c5f0d4e3f6a7b8c9d0e1f2a3b4c5d6e7', logHash: 'd6a1e5f4a7b8c9d0e1f2a3b4c5d6e7f8' },
  { id: 'log-5', orderId: 'ord-1', action: 'PRINT_EXECUTED', details: 'Print job initiated at Atlantic XL. Encrypted G-code streamed to printer. Physical access logged via IoT sensor.', userId: null, createdAt: new Date(BASE_DATE - 16 * 60 * 60 * 1000).toISOString(), order: { orderId: 'ORD-2847', partName: 'Thruster Bearing Housing' }, prevHash: 'd6a1e5f4a7b8c9d0e1f2a3b4c5d6e7f8', logHash: 'e7b2f6a5b8c9d0e1f2a3b4c5d6e7f8a9' },
  { id: 'log-6', orderId: 'ord-2', action: 'ORDER_CREATED', details: 'Order ORD-2846 created for Hydraulic Valve Body', userId: 'user-2', createdAt: new Date(BASE_DATE - 32 * 60 * 60 * 1000).toISOString(), order: { orderId: 'ORD-2846', partName: 'Hydraulic Valve Body' }, prevHash: 'e7b2f6a5b8c9d0e1f2a3b4c5d6e7f8a9', logHash: 'f8c3a7b6c9d0e1f2a3b4c5d6e7f8a9b0' },
  { id: 'log-7', orderId: 'ord-2', action: 'OEM_APPROVED', details: 'OEM Partner (Baker Hughes) granted IP license for ORD-2846. Blueprint BP-0892 decryption rights authorized.', userId: 'user-oem', createdAt: new Date(BASE_DATE - 30 * 60 * 60 * 1000).toISOString(), order: { orderId: 'ORD-2846', partName: 'Hydraulic Valve Body' }, prevHash: 'f8c3a7b6c9d0e1f2a3b4c5d6e7f8a9b0', logHash: 'a9d4b8c7d0e1f2a3b4c5d6e7f8a9b0c1' },
  { id: 'log-8', orderId: 'ord-4', action: 'ORDER_CREATED', details: 'Order ORD-2844 created for Impeller Shaft — awaiting DRM approval pipeline', userId: 'user-1', createdAt: new Date(BASE_DATE - 14 * 60 * 60 * 1000).toISOString(), order: { orderId: 'ORD-2844', partName: 'Impeller Shaft' }, prevHash: 'a9d4b8c7d0e1f2a3b4c5d6e7f8a9b0c1', logHash: 'b0e5c9d8e1f2a3b4c5d6e7f8a9b0c1d2' },
  { id: 'log-9', orderId: 'ord-6', action: 'ORDER_CREATED', details: 'Order ORD-2842 created for Pressure Housing Seal', userId: 'user-1', createdAt: new Date(BASE_DATE - 26 * 60 * 60 * 1000).toISOString(), order: { orderId: 'ORD-2842', partName: 'Pressure Housing Seal' }, prevHash: 'b0e5c9d8e1f2a3b4c5d6e7f8a9b0c1d2', logHash: 'c1f6d0e9f2a3b4c5d6e7f8a9b0c1d2e3' },
  { id: 'log-10', orderId: 'ord-6', action: 'CERT_APPROVED', details: 'DNV GL verified Print Center PC-001 (Atlantic XL) certification for H13 Tool Steel. Waiting for OEM approval.', userId: 'user-cert', createdAt: new Date(BASE_DATE - 22 * 60 * 60 * 1000).toISOString(), order: { orderId: 'ORD-2842', partName: 'Pressure Housing Seal' }, prevHash: 'c1f6d0e9f2a3b4c5d6e7f8a9b0c1d2e3', logHash: 'd2a7e1f0a3b4c5d6e7f8a9b0c1d2e3f4' },
  { id: 'log-11', orderId: 'ord-10', action: 'ORDER_CREATED', details: 'Order ORD-2852 created for Bearing Housing Cap', userId: 'user-1', createdAt: new Date(BASE_DATE - 50 * 60 * 60 * 1000).toISOString(), order: { orderId: 'ORD-2852', partName: 'Bearing Housing Cap' }, prevHash: 'd2a7e1f0a3b4c5d6e7f8a9b0c1d2e3f4', logHash: 'e3b8f2a1b4c5d6e7f8a9b0c1d2e3f4a5' },
  { id: 'log-12', orderId: 'ord-10', action: 'OEM_APPROVED', details: 'OEM Partner (Baker Hughes) granted IP license for ORD-2852. Blueprint BP-0559 decryption rights authorized.', userId: 'user-oem', createdAt: new Date(BASE_DATE - 5 * 60 * 60 * 1000).toISOString(), order: { orderId: 'ORD-2852', partName: 'Bearing Housing Cap' }, prevHash: 'e3b8f2a1b4c5d6e7f8a9b0c1d2e3f4a5', logHash: 'f4c9a3b2c5d6e7f8a9b0c1d2e3f4a5b6' },
  { id: 'log-13', orderId: 'ord-10', action: 'CERT_APPROVED', details: "Lloyd's Register verified Print Center PC-003 (LR Montreal) for Stainless Steel 316L. All conditions met — ready for Secure Print.", userId: 'user-cert', createdAt: new Date(BASE_DATE - 3 * 60 * 60 * 1000).toISOString(), order: { orderId: 'ORD-2852', partName: 'Bearing Housing Cap' }, prevHash: 'f4c9a3b2c5d6e7f8a9b0c1d2e3f4a5b6', logHash: 'a5d0b4c3d6e7f8a9b0c1d2e3f4a5b6c7' },
]

export const dashboardStats = {
  totalOrders: orders.length,
  activeOrders: orders.filter(o => ['pending', 'printing', 'quality_check'].includes(o.status)).length,
  deliveredParts: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.quantity, 0),
  avgLeadTime: 4.2,
  costSavings: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.quantity * 150, 0),
  totalBlueprints: blueprints.length,
  activeCenters: printCenters.filter(c => c.status === 'online').length,
}

// ─── Physical Inventory ────────────────────────────────────────────────────

export type PhysicalSite = {
  id: string
  name: string
  type: 'offshore_rig' | 'vessel' | 'onshore_yard' | 'warehouse'
  location: string
  operator: string
  status: 'active' | 'standby' | 'decommissioned'
}

export type PartCondition = 'new' | 'serviceable' | 'used' | 'condemned'

export type PhysicalPart = {
  id: string
  partNumber: string
  name: string
  category: string
  siteId: string
  quantity: number
  minStock: number
  unit: string
  condition: PartCondition
  blueprintId: string | null   // link to digital blueprint if available
  lastUsed: string | null
  lastInspected: string | null
  notes: string | null
  unitCost: number
}

export type InventoryTransaction = {
  id: string
  partId: string
  siteId: string
  action: 'received' | 'consumed' | 'condemned' | 'transferred_in' | 'transferred_out' | 'inspected'
  quantity: number
  performedBy: string
  timestamp: string
  notes: string | null
}

export const physicalSites: PhysicalSite[] = [
  { id: 'site-1', name: 'Rig Alpha — Bay du Nord', type: 'offshore_rig', location: 'Grand Banks, NL', operator: 'Equinor Canada', status: 'active' },
  { id: 'site-2', name: 'MV Rosen Explorer', type: 'vessel', location: 'Atlantic, NL', operator: 'Rosen Maritime', status: 'active' },
  { id: 'site-3', name: 'Halifax Yard — Atlantic XL', type: 'onshore_yard', location: 'Halifax, NS', operator: 'Atlantic XL', status: 'active' },
  { id: 'site-4', name: 'Thales Ottawa Warehouse', type: 'warehouse', location: 'Ottawa, ON', operator: 'Thales Canada', status: 'active' },
  { id: 'site-5', name: 'Horizon Platform 7', type: 'offshore_rig', location: 'Sable Island, NS', operator: 'Horizon Maritime', status: 'standby' },
]

export const physicalParts: PhysicalPart[] = [
  // Rig Alpha
  { id: 'pp-1', partNumber: 'PHY-1024-A', name: 'Thruster Bearing Housing', category: 'Structural', siteId: 'site-1', quantity: 3, minStock: 2, unit: 'pcs', condition: 'new', blueprintId: 'bp-1', lastUsed: null, lastInspected: new Date(BASE_DATE - 30 * 864e5).toISOString(), notes: null, unitCost: 4800 },
  { id: 'pp-2', partNumber: 'PHY-0892-B', name: 'Hydraulic Valve Body', category: 'Hydraulic', siteId: 'site-1', quantity: 1, minStock: 2, unit: 'pcs', condition: 'serviceable', blueprintId: 'bp-2', lastUsed: new Date(BASE_DATE - 14 * 864e5).toISOString(), lastInspected: new Date(BASE_DATE - 7 * 864e5).toISOString(), notes: 'Slight surface wear', unitCost: 3200 },
  { id: 'pp-3', partNumber: 'PHY-0456-C', name: 'Sensor Mounting Bracket', category: 'Structural', siteId: 'site-1', quantity: 0, minStock: 4, unit: 'pcs', condition: 'new', blueprintId: 'bp-3', lastUsed: new Date(BASE_DATE - 2 * 864e5).toISOString(), lastInspected: null, notes: 'Last batch consumed', unitCost: 450 },
  { id: 'pp-4', partNumber: 'PHY-0789-D', name: 'Impeller Shaft', category: 'Rotating', siteId: 'site-1', quantity: 1, minStock: 1, unit: 'pcs', condition: 'used', blueprintId: 'bp-4', lastUsed: new Date(BASE_DATE - 60 * 864e5).toISOString(), lastInspected: new Date(BASE_DATE - 30 * 864e5).toISOString(), notes: 'Scheduled for swap', unitCost: 9200 },
  { id: 'pp-5', partNumber: 'PHY-0667-E', name: 'Pressure Housing Seal', category: 'Seals', siteId: 'site-1', quantity: 8, minStock: 5, unit: 'pcs', condition: 'new', blueprintId: 'bp-6', lastUsed: null, lastInspected: new Date(BASE_DATE - 10 * 864e5).toISOString(), notes: null, unitCost: 780 },
  { id: 'pp-6', partNumber: 'PHY-MISC-F', name: 'Pipe Gasket Ring', category: 'Seals', siteId: 'site-1', quantity: 2, minStock: 10, unit: 'pcs', condition: 'serviceable', blueprintId: null, lastUsed: new Date(BASE_DATE - 5 * 864e5).toISOString(), lastInspected: null, notes: 'Low stock critical', unitCost: 120 },

  // MV Rosen Explorer
  { id: 'pp-7', partNumber: 'PHY-0123-G', name: 'Motor Coupling Flange', category: 'Coupling', siteId: 'site-2', quantity: 2, minStock: 1, unit: 'pcs', condition: 'new', blueprintId: 'bp-7', lastUsed: null, lastInspected: new Date(BASE_DATE - 45 * 864e5).toISOString(), notes: null, unitCost: 2100 },
  { id: 'pp-8', partNumber: 'PHY-0334-H', name: 'Heat Exchanger Plate', category: 'Thermal', siteId: 'site-2', quantity: 0, minStock: 2, unit: 'pcs', condition: 'condemned', blueprintId: 'bp-5', lastUsed: new Date(BASE_DATE - 1 * 864e5).toISOString(), lastInspected: new Date(BASE_DATE - 1 * 864e5).toISOString(), notes: 'Crack found in weld — condemned', unitCost: 2800 },
  { id: 'pp-9', partNumber: 'PHY-0556-I', name: 'Hydraulic Cylinder Rod', category: 'Hydraulic', siteId: 'site-2', quantity: 3, minStock: 2, unit: 'pcs', condition: 'new', blueprintId: 'bp-9', lastUsed: null, lastInspected: null, notes: null, unitCost: 3400 },

  // Halifax Yard
  { id: 'pp-10', partNumber: 'PHY-1024-B', name: 'Thruster Bearing Housing', category: 'Structural', siteId: 'site-3', quantity: 5, minStock: 2, unit: 'pcs', condition: 'new', blueprintId: 'bp-1', lastUsed: null, lastInspected: new Date(BASE_DATE - 20 * 864e5).toISOString(), notes: 'Surplus — transfer candidate', unitCost: 4800 },
  { id: 'pp-11', partNumber: 'PHY-0558-J', name: 'Exhaust Valve Seat', category: 'Thermal', siteId: 'site-3', quantity: 4, minStock: 2, unit: 'pcs', condition: 'serviceable', blueprintId: 'bp-11', lastUsed: new Date(BASE_DATE - 90 * 864e5).toISOString(), lastInspected: new Date(BASE_DATE - 30 * 864e5).toISOString(), notes: null, unitCost: 1900 },
  { id: 'pp-12', partNumber: 'PHY-0559-K', name: 'Anchor Chain Link', category: 'Structural', siteId: 'site-3', quantity: 24, minStock: 10, unit: 'pcs', condition: 'new', blueprintId: 'bp-12', lastUsed: null, lastInspected: null, notes: null, unitCost: 340 },

  // Thales Warehouse
  { id: 'pp-13', partNumber: 'PHY-0557-L', name: 'Propeller Blade Tip', category: 'Rotating', siteId: 'site-4', quantity: 2, minStock: 3, unit: 'pcs', condition: 'new', blueprintId: 'bp-10', lastUsed: null, lastInspected: new Date(BASE_DATE - 15 * 864e5).toISOString(), notes: 'Reorder pending', unitCost: 7600 },
  { id: 'pp-14', partNumber: 'PHY-0555-M', name: 'Control Panel Enclosure', category: 'Electrical', siteId: 'site-4', quantity: 1, minStock: 2, unit: 'pcs', condition: 'used', blueprintId: 'bp-8', lastUsed: new Date(BASE_DATE - 30 * 864e5).toISOString(), lastInspected: null, notes: null, unitCost: 1200 },
]

export const inventoryTransactions: InventoryTransaction[] = [
  { id: 'tx-1', partId: 'pp-3', siteId: 'site-1', action: 'consumed', quantity: 4, performedBy: 'Mike Johnson', timestamp: new Date(BASE_DATE - 2 * 864e5).toISOString(), notes: 'Replaced after vibration inspection' },
  { id: 'tx-2', partId: 'pp-8', siteId: 'site-2', action: 'condemned', quantity: 2, performedBy: 'David Brown', timestamp: new Date(BASE_DATE - 1 * 864e5).toISOString(), notes: 'Weld crack found — scrapped' },
  { id: 'tx-3', partId: 'pp-2', siteId: 'site-1', action: 'consumed', quantity: 1, performedBy: 'John Operator', timestamp: new Date(BASE_DATE - 14 * 864e5).toISOString(), notes: 'Emergency swap on valve line B' },
  { id: 'tx-4', partId: 'pp-5', siteId: 'site-1', action: 'received', quantity: 8, performedBy: 'John Operator', timestamp: new Date(BASE_DATE - 20 * 864e5).toISOString(), notes: 'Received from Halifax Yard transfer' },
  { id: 'tx-5', partId: 'pp-4', siteId: 'site-1', action: 'inspected', quantity: 1, performedBy: 'Sarah Chen', timestamp: new Date(BASE_DATE - 30 * 864e5).toISOString(), notes: 'Annual inspection — still within service limits' },
  { id: 'tx-6', partId: 'pp-1', siteId: 'site-1', action: 'received', quantity: 3, performedBy: 'John Operator', timestamp: new Date(BASE_DATE - 45 * 864e5).toISOString(), notes: 'New stock from print center' },
  { id: 'tx-7', partId: 'pp-10', siteId: 'site-3', action: 'transferred_out', quantity: 2, performedBy: 'Robert Mackenzie', timestamp: new Date(BASE_DATE - 21 * 864e5).toISOString(), notes: 'Transferred to Rig Alpha' },
  { id: 'tx-8', partId: 'pp-13', siteId: 'site-4', action: 'consumed', quantity: 1, performedBy: 'Lisa Wang', timestamp: new Date(BASE_DATE - 10 * 864e5).toISOString(), notes: 'Installed on UAV test platform' },
  { id: 'tx-9', partId: 'pp-6', siteId: 'site-1', action: 'consumed', quantity: 3, performedBy: 'Mike Johnson', timestamp: new Date(BASE_DATE - 5 * 864e5).toISOString(), notes: 'Replaced during scheduled maintenance window' },
]

