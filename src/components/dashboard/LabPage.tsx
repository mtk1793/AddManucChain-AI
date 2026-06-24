'use client'

import { useState } from 'react'
import {
  FlaskConical,
  Microscope,
  Beaker,
  TestTubeDiagonal,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  Download,
  Plus,
  Search,
  ChevronDown,
  X,
  BarChart3,
  Shield,
  Layers,
  Thermometer,
  Gauge,
  ClipboardList,
  Users,
  TrendingUp,
  AlertCircle,
  TrendingDown,
  DollarSign,
  Zap,
  Flag,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  History,
  Filter,
  Copy,
  ChevronRight,
  Zap as ZapIcon,
  AlertTriangle as AlertIcon,
  CheckCircle,
  User,
  Inbox,
  Settings,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type TestStatus = 'pending' | 'in_progress' | 'passed' | 'failed' | 'review'
type TestType = 'mechanical' | 'chemical' | 'thermal' | 'dimensional' | 'ndt' | 'fatigue'

interface TestRequest {
  id: string
  partName: string
  partNumber: string
  submittedBy: string
  organization: string
  testTypes: TestType[]
  priority: 'standard' | 'expedited' | 'critical'
  status: TestStatus
  submittedDate: string
  dueDate: string
  technician: string
  sampleCount: number
  certRequired: string
  source: 'customer' | 'inhouse'
}

interface InHouseTest {
  id: string
  name: string
  testType: TestType
  description: string
  protocol: string
  equipmentRequired: string[]
  estimatedDays: number
  costPerSample: number
  certifications: string[]
  createdBy: string
  createdDate: string
  active: boolean
}

interface LabDRMRecord {
  id: string
  protocolName: string
  licensor: string
  standard: string
  accessToken: string
  grantedDate: string
  expiryDate: string
  usageCount: number
  maxUsage: number | null
  status: 'active' | 'expiring_soon' | 'expired'
}

interface Equipment {
  id: string
  name: string
  type: string
  status: 'available' | 'in_use' | 'maintenance' | 'offline'
  nextAvailable?: string
  currentJob?: string
  utilization: number
}

interface TestReport {
  id: string
  partName: string
  partNumber: string
  testDate: string
  result: 'pass' | 'fail' | 'conditional'
  issuer: string
  certStandard: string
  fileReady: boolean
}

interface Technician {
  id: string
  name: string
  email: string
  activeTests: number
  completedThisMonth: number
  avgCompletionTime: string
  utilization: number
  slaCompliance: number
  certifications: string[]
  skillMatrixScore: number
}

interface WorkloadAlert {
  technicianId: string
  technicianName: string
  type: 'overload' | 'expedited' | 'sla-risk'
  message: string
  severity: 'info' | 'warning' | 'critical'
}

interface AnalyticsTrendPoint {
  date: string
  turnaroundTime: number
  passRate: number
  testCount: number
  revenue: number
}

interface TestTypeStats {
  testType: TestType
  completed: number
  passRate: number
  avgTime: number
  estimatedRevenue: number
}

interface EquipmentUtilization {
  equipmentName: string
  utilization: number
  currentJob?: string
  efficiency: number
}

interface AuditLog {
  id: string
  timestamp: string
  actor: string
  actorRole: string
  actionType: 'created' | 'modified' | 'completed' | 'failed' | 'assigned' | 'reassigned' | 'reported' | 'exported'
  targetEntity: string
  targetId: string
  changes: { field: string; oldValue: string; newValue: string }[]
  description: string
  ipAddress: string
}

interface TestService {
  id: string
  name: string
  type: TestType
  description: string
  baseTurnaroundDays: number
  expeditedTurnaroundDays: number
  costPerSample: number
  sampleRequirements: string
  certificationsIncluded: string[]
  equipment: string[]
  capacity: number
  currentQueue: number
  acceptingOrders: boolean
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockTestRequests: TestRequest[] = [
  {
    id: 'TR-2026-041',
    partName: 'Pump Impeller — Marine Grade',
    partNumber: 'WRT-PI-3300',
    submittedBy: 'Johann Weber',
    organization: 'Wärtsilä Marine OEM',
    testTypes: ['mechanical', 'dimensional', 'ndt'],
    priority: 'critical',
    status: 'in_progress',
    submittedDate: 'Feb 24, 2026',
    dueDate: 'Mar 3, 2026',
    technician: 'Dr. Ahmad Osman',
    sampleCount: 3,
    certRequired: 'DNV GL',
    source: 'customer',
  },
  {
    id: 'TR-2026-038',
    partName: 'Shaft Seal Assembly',
    partNumber: 'RR-SS-770B',
    submittedBy: 'OEM Portal',
    organization: 'Rolls-Royce Power Systems',
    testTypes: ['mechanical', 'thermal', 'fatigue'],
    priority: 'expedited',
    status: 'pending',
    submittedDate: 'Feb 25, 2026',
    dueDate: 'Mar 5, 2026',
    technician: 'Unassigned',
    sampleCount: 5,
    certRequired: "Lloyd's Register",
    source: 'customer',
  },
  {
    id: 'TR-2026-035',
    partName: 'Valve Body — High Pressure',
    partNumber: 'CAT-VB-1120',
    submittedBy: 'PolyUnity NL',
    organization: 'Print Facility',
    testTypes: ['dimensional', 'chemical'],
    priority: 'standard',
    status: 'review',
    submittedDate: 'Feb 20, 2026',
    dueDate: 'Mar 1, 2026',
    technician: 'Li Wei',
    sampleCount: 2,
    certRequired: 'ISO 9001',
    source: 'customer',
  },
  {
    id: 'TR-2026-031',
    partName: 'Heat Exchanger Fin Array',
    partNumber: 'SIE-HEX-550',
    submittedBy: 'Capt. Sarah Leblanc',
    organization: 'Horizon Maritime',
    testTypes: ['thermal', 'dimensional'],
    priority: 'standard',
    status: 'passed',
    submittedDate: 'Feb 15, 2026',
    dueDate: 'Feb 22, 2026',
    technician: 'Dr. Ahmad Osman',
    sampleCount: 4,
    certRequired: 'Bureau Veritas',
    source: 'customer',
  },
  {
    id: 'TR-2026-028',
    partName: 'Rudder Bearing Housing',
    partNumber: 'MAN-RB-800X',
    submittedBy: 'OEM Portal',
    organization: 'MAN Energy Solutions',
    testTypes: ['mechanical', 'ndt', 'fatigue'],
    priority: 'expedited',
    status: 'failed',
    submittedDate: 'Feb 10, 2026',
    dueDate: 'Feb 18, 2026',
    technician: 'Li Wei',
    sampleCount: 3,
    certRequired: 'ClassNK',
    source: 'customer',
  },
  // In-house requests
  {
    id: 'IH-2026-012',
    partName: 'Ti-6Al-4V Coupon Batch #7',
    partNumber: 'IH-TI-007',
    submittedBy: 'Dr. Ahmad Osman',
    organization: 'Dalhousie AM Lab',
    testTypes: ['mechanical', 'chemical'],
    priority: 'standard',
    status: 'in_progress',
    submittedDate: 'Mar 10, 2026',
    dueDate: 'Mar 17, 2026',
    technician: 'Dr. Ahmad Osman',
    sampleCount: 6,
    certRequired: 'Internal',
    source: 'inhouse',
  },
  {
    id: 'IH-2026-010',
    partName: 'Inconel 718 Microstructure Study',
    partNumber: 'IH-IN-010',
    submittedBy: 'Li Wei',
    organization: 'Dalhousie AM Lab',
    testTypes: ['thermal', 'ndt'],
    priority: 'standard',
    status: 'pending',
    submittedDate: 'Mar 12, 2026',
    dueDate: 'Mar 20, 2026',
    technician: 'Unassigned',
    sampleCount: 4,
    certRequired: 'Internal',
    source: 'inhouse',
  },
]

const mockInHouseTests: InHouseTest[] = [
  {
    id: 'IHT-001',
    name: 'Post-Print Tensile Verification',
    testType: 'mechanical',
    description: 'Standard tensile test protocol for AM-produced coupons to verify UTS, yield strength, and elongation.',
    protocol: 'DAL-AM-MECH-001',
    equipmentRequired: ['Instron 5985 UTM', 'Digital Extensometer'],
    estimatedDays: 2,
    costPerSample: 180,
    certifications: ['DNV GL', "Lloyd's Register", 'ISO 9001'],
    createdBy: 'Dr. Ahmad Osman',
    createdDate: 'Jan 12, 2026',
    active: true,
  },
  {
    id: 'IHT-002',
    name: 'Porosity & Microstructure CT Scan',
    testType: 'ndt',
    description: 'High-resolution CT scanning to detect internal voids, inclusions, and delamination in AM parts.',
    protocol: 'DAL-AM-NDT-003',
    equipmentRequired: ['Nikon XT H 225 CT', 'VGStudio MAX Software'],
    estimatedDays: 3,
    costPerSample: 350,
    certifications: ['Bureau Veritas', 'DNV GL'],
    createdBy: 'Li Wei',
    createdDate: 'Jan 28, 2026',
    active: true,
  },
  {
    id: 'IHT-003',
    name: 'Dimensional GD&T Verification',
    testType: 'dimensional',
    description: 'Full GD&T inspection using CMM to verify critical tolerances against CAD nominal.',
    protocol: 'DAL-AM-DIM-002',
    equipmentRequired: ['Zeiss CMM Contura', 'Calypso Software'],
    estimatedDays: 1,
    costPerSample: 120,
    certifications: ['ISO 9001', 'ClassNK'],
    createdBy: 'Dr. Ahmad Osman',
    createdDate: 'Feb 3, 2026',
    active: true,
  },
  {
    id: 'IHT-004',
    name: 'Corrosion Resistance Salt Fog',
    testType: 'chemical',
    description: '500-hour salt fog exposure per ASTM B117 to evaluate corrosion resistance of marine-grade AM alloys.',
    protocol: 'DAL-AM-CHEM-005',
    equipmentRequired: ['Q-FOG Salt Spray Chamber'],
    estimatedDays: 22,
    costPerSample: 420,
    certifications: ['Bureau Veritas', 'ABS'],
    createdBy: 'Li Wei',
    createdDate: 'Feb 14, 2026',
    active: false,
  },
]

const mockLabDRM: LabDRMRecord[] = [
  {
    id: 'DRM-LAB-001',
    protocolName: 'DNV GL Tensile Test Method — AM Parts',
    licensor: 'DNV GL SE',
    standard: 'DNVGL-ST-0183',
    accessToken: 'drm-dnv-9a3f2b1c-4d5e',
    grantedDate: 'Jan 1, 2026',
    expiryDate: 'Dec 31, 2026',
    usageCount: 47,
    maxUsage: null,
    status: 'active',
  },
  {
    id: 'DRM-LAB-002',
    protocolName: "Lloyd's Register NDT Protocol v4.2",
    licensor: "Lloyd's Register Group",
    standard: 'LR NDT-AM-2025',
    accessToken: 'drm-lr-b4e9c3d2-5e6f',
    grantedDate: 'Feb 1, 2026',
    expiryDate: 'Apr 1, 2026',
    usageCount: 12,
    maxUsage: 50,
    status: 'expiring_soon',
  },
  {
    id: 'DRM-LAB-003',
    protocolName: 'ISO 6892-1 Metallic Tensile Procedure',
    licensor: 'ISO / BSI',
    standard: 'ISO 6892-1:2019',
    accessToken: 'drm-iso-c5f0d4e3-6f7a',
    grantedDate: 'Mar 15, 2025',
    expiryDate: 'Mar 14, 2026',
    usageCount: 88,
    maxUsage: null,
    status: 'expired',
  },
  {
    id: 'DRM-LAB-004',
    protocolName: 'Bureau Veritas AM Quality Procedure',
    licensor: 'Bureau Veritas SA',
    standard: 'BV NR 600',
    accessToken: 'drm-bv-d6a1e5f4-7a8b',
    grantedDate: 'Jan 15, 2026',
    expiryDate: 'Jan 14, 2027',
    usageCount: 9,
    maxUsage: 100,
    status: 'active',
  },
]

const mockEquipment: Equipment[] = [
  {
    id: 'EQ-001',
    name: 'Instron 5985 UTM',
    type: 'Tensile / Compression',
    status: 'in_use',
    currentJob: 'TR-2026-041',
    utilization: 82,
  },
  {
    id: 'EQ-002',
    name: 'Zeiss CMM Contura',
    type: 'Coordinate Measurement',
    status: 'available',
    utilization: 45,
  },
  {
    id: 'EQ-003',
    name: 'Industrial CT Scanner',
    type: 'Non-Destructive Testing',
    status: 'in_use',
    currentJob: 'TR-2026-038',
    utilization: 91,
  },
  {
    id: 'EQ-004',
    name: 'DSC 3+ Calorimeter',
    type: 'Thermal Analysis',
    status: 'available',
    utilization: 33,
  },
  {
    id: 'EQ-005',
    name: 'SEM / EDS Hitachi SU5000',
    type: 'Surface & Chemical Analysis',
    status: 'maintenance',
    nextAvailable: 'Mar 2, 2026',
    utilization: 0,
  },
  {
    id: 'EQ-006',
    name: 'MTS 810 Fatigue Tester',
    type: 'Fatigue / Cyclic Loading',
    status: 'available',
    utilization: 60,
  },
]

const mockReports: TestReport[] = [
  {
    id: 'RPT-2026-031',
    partName: 'Heat Exchanger Fin Array',
    partNumber: 'SIE-HEX-550',
    testDate: 'Feb 22, 2026',
    result: 'pass',
    issuer: 'Dr. Ahmad Osman',
    certStandard: 'Bureau Veritas',
    fileReady: true,
  },
  {
    id: 'RPT-2026-028',
    partName: 'Rudder Bearing Housing',
    partNumber: 'MAN-RB-800X',
    testDate: 'Feb 18, 2026',
    result: 'fail',
    issuer: 'Li Wei',
    certStandard: 'ClassNK',
    fileReady: true,
  },
  {
    id: 'RPT-2026-025',
    partName: 'Turbocharger Rotor',
    partNumber: 'MAN-TCR-330',
    testDate: 'Feb 12, 2026',
    result: 'conditional',
    issuer: 'Dr. Ahmad Osman',
    certStandard: 'DNV GL',
    fileReady: true,
  },
]

const mockTechnicians: Technician[] = [
  {
    id: 'TECH-001',
    name: 'Dr. Ahmad Osman',
    email: 'a.osman@dal.ca',
    activeTests: 5,
    completedThisMonth: 12,
    avgCompletionTime: '4.2 days',
    utilization: 85,
    slaCompliance: 96,
    certifications: ['ISO 9001', 'DNV GL', "Lloyd's Register", 'Bureau Veritas'],
    skillMatrixScore: 94,
  },
  {
    id: 'TECH-002',
    name: 'Li Wei',
    email: 'l.wei@dal.ca',
    activeTests: 7,
    completedThisMonth: 14,
    avgCompletionTime: '3.8 days',
    utilization: 92,
    slaCompliance: 89,
    certifications: ['ISO 9001', 'ClassNK', 'ABS'],
    skillMatrixScore: 88,
  },
  {
    id: 'TECH-003',
    name: 'Maria Goez',
    email: 'm.goez@dal.ca',
    activeTests: 3,
    completedThisMonth: 9,
    avgCompletionTime: '5.1 days',
    utilization: 62,
    slaCompliance: 94,
    certifications: ['ISO 9001', 'DNV GL'],
    skillMatrixScore: 75,
  },
  {
    id: 'TECH-004',
    name: 'Jacob Turner',
    email: 'j.turner@dal.ca',
    activeTests: 4,
    completedThisMonth: 11,
    avgCompletionTime: '4.5 days',
    utilization: 78,
    slaCompliance: 92,
    certifications: ['ISO 9001', 'Bureau Veritas', 'ABS'],
    skillMatrixScore: 82,
  },
]

const mockWorkloadAlerts: WorkloadAlert[] = [
  {
    technicianId: 'TECH-002',
    technicianName: 'Li Wei',
    type: 'overload',
    message: 'Approaching capacity with 7 active tests (92% utilization)',
    severity: 'warning',
  },
  {
    technicianId: 'TECH-002',
    technicianName: 'Li Wei',
    type: 'expedited',
    message: 'Currently handling 2 critical-priority tests',
    severity: 'warning',
  },
  {
    technicianId: 'TECH-003',
    technicianName: 'Maria Goez',
    type: 'expedited',
    message: 'Performance below average - consider skill development',
    severity: 'info',
  },
]

const mockAnalyticsTrends: AnalyticsTrendPoint[] = [
  { date: 'Mar 1', turnaroundTime: 4.8, passRate: 92, testCount: 12, revenue: 4800 },
  { date: 'Mar 5', turnaroundTime: 4.5, passRate: 94, testCount: 14, revenue: 5200 },
  { date: 'Mar 10', turnaroundTime: 4.2, passRate: 93, testCount: 16, revenue: 5600 },
  { date: 'Mar 12', turnaroundTime: 4.0, passRate: 95, testCount: 18, revenue: 6000 },
  { date: 'Mar 15', turnaroundTime: 3.9, passRate: 96, testCount: 17, revenue: 5800 },
  { date: 'Mar 17', turnaroundTime: 3.8, passRate: 97, testCount: 19, revenue: 6400 },
  { date: 'Mar 20', turnaroundTime: 3.7, passRate: 96, testCount: 21, revenue: 6800 },
]

const mockTestTypeStats: TestTypeStats[] = [
  { testType: 'mechanical', completed: 32, passRate: 97, avgTime: 3.8, estimatedRevenue: 8000 },
  { testType: 'dimensional', completed: 28, passRate: 95, avgTime: 3.2, estimatedRevenue: 7000 },
  { testType: 'thermal', completed: 18, passRate: 94, avgTime: 4.5, estimatedRevenue: 4500 },
  { testType: 'ndt', completed: 22, passRate: 96, avgTime: 4.0, estimatedRevenue: 5500 },
  { testType: 'chemical', completed: 15, passRate: 93, avgTime: 5.2, estimatedRevenue: 3750 },
  { testType: 'fatigue', completed: 12, passRate: 92, avgTime: 6.1, estimatedRevenue: 3600 },
]

const mockEquipmentUtilization: EquipmentUtilization[] = [
  { equipmentName: 'Instron 5985 UTM', utilization: 82, currentJob: 'TR-2026-041', efficiency: 88 },
  { equipmentName: 'Zeiss CMM Contura', utilization: 45, efficiency: 92 },
  { equipmentName: 'Industrial CT Scanner', utilization: 91, currentJob: 'TR-2026-038', efficiency: 85 },
  { equipmentName: 'DSC 3+ Calorimeter', utilization: 33, efficiency: 94 },
  { equipmentName: 'SEM / EDS Hitachi', utilization: 0, efficiency: 0 },
  { equipmentName: 'MTS 810 Fatigue Tester', utilization: 60, efficiency: 89 },
]

const mockAuditLogs: AuditLog[] = [
  {
    id: 'AL-2026-0847',
    timestamp: 'Mar 20, 2026 - 14:32 UTC',
    actor: 'Li Wei',
    actorRole: 'Technician',
    actionType: 'completed',
    targetEntity: 'Test Request',
    targetId: 'TR-2026-038',
    changes: [
      { field: 'status', oldValue: 'in_progress', newValue: 'passed' },
      { field: 'result', oldValue: 'pending', newValue: 'PASS' },
    ],
    description: 'Completed fatigue testing for Shaft Seal Assembly - all specs met',
    ipAddress: '192.168.1.45',
  },
  {
    id: 'AL-2026-0846',
    timestamp: 'Mar 20, 2026 - 13:15 UTC',
    actor: 'Dr. Ahmad Osman',
    actorRole: 'Lab Manager',
    actionType: 'reported',
    targetEntity: 'Test Report',
    targetId: 'RPT-2026-031',
    changes: [
      { field: 'fileReady', oldValue: 'false', newValue: 'true' },
      { field: 'issuer', oldValue: 'pending_review', newValue: 'Dr. Ahmad Osman' },
    ],
    description: 'Generated final test report for Heat Exchanger Fin Array (DNV GL certification)',
    ipAddress: '192.168.1.52',
  },
  {
    id: 'AL-2026-0845',
    timestamp: 'Mar 20, 2026 - 11:48 UTC',
    actor: 'System',
    actorRole: 'Automated',
    actionType: 'assigned',
    targetEntity: 'Test Request',
    targetId: 'TR-2026-041',
    changes: [
      { field: 'technician', oldValue: 'Unassigned', newValue: 'Dr. Ahmad Osman' },
      { field: 'status', oldValue: 'pending', newValue: 'in_progress' },
    ],
    description: 'Auto-assigned critical priority test to Dr. Ahmad Osman based on skill matrix',
    ipAddress: '10.0.0.1',
  },
  {
    id: 'AL-2026-0844',
    timestamp: 'Mar 20, 2026 - 09:22 UTC',
    actor: 'Johann Weber',
    actorRole: 'OEM Partner',
    actionType: 'created',
    targetEntity: 'Test Request',
    targetId: 'TR-2026-041',
    changes: [
      { field: 'id', oldValue: 'null', newValue: 'TR-2026-041' },
      { field: 'status', oldValue: 'null', newValue: 'pending' },
    ],
    description: 'Submitted new critical-priority test request for Pump Impeller from Wärtsilä Marine OEM',
    ipAddress: '203.45.67.89',
  },
  {
    id: 'AL-2026-0843',
    timestamp: 'Mar 19, 2026 - 16:45 UTC',
    actor: 'Li Wei',
    actorRole: 'Technician',
    actionType: 'modified',
    targetEntity: 'Test Request',
    targetId: 'TR-2026-035',
    changes: [
      { field: 'notes', oldValue: 'Standard dimensions', newValue: 'Standard dimensions, expedited due to customer SLA' },
      { field: 'priority', oldValue: 'standard', newValue: 'expedited' },
    ],
    description: 'Updated test priority and notes after customer escalation',
    ipAddress: '192.168.1.45',
  },
  {
    id: 'AL-2026-0842',
    timestamp: 'Mar 19, 2026 - 14:12 UTC',
    actor: 'Dr. Ahmad Osman',
    actorRole: 'Lab Manager',
    actionType: 'exported',
    targetEntity: 'Audit Log',
    targetId: 'AL-export-001',
    changes: [
      { field: 'format', oldValue: 'none', newValue: 'CSV' },
      { field: 'dateRange', oldValue: 'none', newValue: 'Mar 1-19, 2026' },
    ],
    description: 'Exported audit logs for compliance review (Q1 2026)',
    ipAddress: '192.168.1.52',
  },
  {
    id: 'AL-2026-0841',
    timestamp: 'Mar 19, 2026 - 10:30 UTC',
    actor: 'Maria Goez',
    actorRole: 'Technician',
    actionType: 'failed',
    targetEntity: 'Test Request',
    targetId: 'TR-2026-028',
    changes: [
      { field: 'status', oldValue: 'in_progress', newValue: 'failed' },
      { field: 'result', oldValue: 'pending', newValue: 'FAIL - Bearing surface defect' },
    ],
    description: 'Test failed - defect found in bearing surface (non-conformance logged)',
    ipAddress: '192.168.1.40',
  },
  {
    id: 'AL-2026-0840',
    timestamp: 'Mar 18, 2026 - 15:20 UTC',
    actor: 'System',
    actorRole: 'Automated',
    actionType: 'reassigned',
    targetEntity: 'Test Request',
    targetId: 'TR-2026-035',
    changes: [
      { field: 'technician', oldValue: 'Maria Goez', newValue: 'Li Wei' },
      { field: 'reassignmentReason', oldValue: 'none', newValue: 'Workload balancing' },
    ],
    description: 'Test reassigned to Li Wei due to workload optimization',
    ipAddress: '10.0.0.1',
  },
]

const mockTestServices: TestService[] = [
  {
    id: 'TS-001',
    name: 'Tensile & Compression Testing',
    type: 'mechanical',
    description: 'Tensile strength, yield strength, elastic modulus, and compression testing for AM parts up to 100mm diameter',
    baseTurnaroundDays: 3,
    expeditedTurnaroundDays: 1,
    costPerSample: 450,
    sampleRequirements: '10-50g samples, cleaned, no surface coatings',
    certificationsIncluded: ['ISO 9001', 'DNV GL', 'Bureau Veritas'],
    equipment: ['Instron 5985 UTM'],
    capacity: 12,
    currentQueue: 5,
    acceptingOrders: true,
  },
  {
    id: 'TS-002',
    name: 'Dimensional & CMM Scanning',
    type: 'dimensional',
    description: 'Coordinate Measurement Machine (CMM) scanning for precision dimensional analysis, tolerances, and 3D geometry verification',
    baseTurnaroundDays: 2,
    expeditedTurnaroundDays: 1,
    costPerSample: 350,
    sampleRequirements: 'Parts up to 500x500x300mm, prepared for measurement fixtures',
    certificationsIncluded: ['ISO 9001', 'ClassNK', 'ABS'],
    equipment: ['Zeiss CMM Contura'],
    capacity: 10,
    currentQueue: 4,
    acceptingOrders: true,
  },
  {
    id: 'TS-003',
    name: 'Non-Destructive Testing (CT Scan)',
    type: 'ndt',
    description: 'Industrial CT scanning for internal defect detection, porosity analysis, and quality assessment without part damage',
    baseTurnaroundDays: 4,
    expeditedTurnaroundDays: 2,
    costPerSample: 800,
    sampleRequirements: 'Parts up to 200mm diameter, metallic and composite friendly',
    certificationsIncluded: ['DNV GL', 'Lloyd\'s Register', 'ISO 9001'],
    equipment: ['Industrial CT Scanner'],
    capacity: 8,
    currentQueue: 6,
    acceptingOrders: true,
  },
  {
    id: 'TS-004',
    name: 'Thermal Analysis (DSC/TGA)',
    type: 'thermal',
    description: 'Differential Scanning Calorimetry and Thermogravimetric Analysis for thermal stability, decomposition, and phase transitions',
    baseTurnaroundDays: 5,
    expeditedTurnaroundDays: 3,
    costPerSample: 600,
    sampleRequirements: '5-50mg powder or small samples, in sealed pans',
    certificationsIncluded: ['ISO 9001', 'Bureau Veritas'],
    equipment: ['DSC 3+ Calorimeter'],
    capacity: 6,
    currentQueue: 2,
    acceptingOrders: true,
  },
  {
    id: 'TS-005',
    name: 'Chemical Analysis (SEM/EDS)',
    type: 'chemical',
    description: 'Scanning Electron Microscope with Energy Dispersive Spectroscopy for elemental composition and microstructure analysis',
    baseTurnaroundDays: 6,
    expeditedTurnaroundDays: 4,
    costPerSample: 950,
    sampleRequirements: 'Polished samples <3mm thick, conductive or coated',
    certificationsIncluded: ['ISO 9001', 'DNV GL', 'ClassNK'],
    equipment: ['SEM / EDS Hitachi SU5000'],
    capacity: 5,
    currentQueue: 0,
    acceptingOrders: false,
  },
  {
    id: 'TS-006',
    name: 'Fatigue & Cyclic Loading',
    type: 'fatigue',
    description: 'High-cycle and low-cycle fatigue testing with stress-life and strain-life analysis for durability assessment',
    baseTurnaroundDays: 7,
    expeditedTurnaroundDays: 5,
    costPerSample: 1200,
    sampleRequirements: '10-50g samples with defined geometry, pre-stress relieved',
    certificationsIncluded: ['DNV GL', 'Lloyd\'s Register', 'ABS'],
    equipment: ['MTS 810 Fatigue Tester'],
    capacity: 4,
    currentQueue: 3,
    acceptingOrders: true,
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const testTypeLabel: Record<TestType, string> = {
  mechanical: 'Mechanical',
  chemical: 'Chemical',
  thermal: 'Thermal',
  dimensional: 'Dimensional',
  ndt: 'NDT',
  fatigue: 'Fatigue',
}

const testTypeColor: Record<TestType, string> = {
  mechanical: 'bg-blue-100 text-blue-700',
  chemical: 'bg-purple-100 text-purple-700',
  thermal: 'bg-orange-100 text-orange-700',
  dimensional: 'bg-teal-100 text-teal-700',
  ndt: 'bg-pink-100 text-pink-700',
  fatigue: 'bg-red-100 text-red-700',
}

const statusConfig: Record<TestStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: {
    label: 'Pending',
    color: 'bg-slate-100 text-slate-600',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-700',
    icon: <FlaskConical className="w-3.5 h-3.5" />,
  },
  review: {
    label: 'Under Review',
    color: 'bg-amber-100 text-amber-700',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  passed: {
    label: 'Passed',
    color: 'bg-green-100 text-green-700',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  failed: {
    label: 'Failed',
    color: 'bg-red-100 text-red-700',
    icon: <X className="w-3.5 h-3.5" />,
  },
}

const eqStatusConfig = {
  available: { label: 'Available', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  in_use: { label: 'In Use', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  maintenance: { label: 'Maintenance', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  offline: { label: 'Offline', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
}

const priorityBadge = {
  critical: 'bg-red-100 text-red-700 border border-red-200',
  expedited: 'bg-amber-100 text-amber-700 border border-amber-200',
  standard: 'bg-slate-100 text-slate-600 border border-slate-200',
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function LabPage({ role = 'admin' }: { role?: string }) {
  const [activeTab, setActiveTab] = useState<'requests' | 'equipment' | 'analytics' | 'workload' | 'reports' | 'drm' | 'audit'>('requests')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'customer' | 'inhouse'>('all')
  const [showAddTestForm, setShowAddTestForm] = useState(false)
  const [newTest, setNewTest] = useState({ partName: '', testType: 'mechanical' as TestType, priority: 'standard' as 'standard' | 'expedited' | 'critical', sampleCount: 1, certRequired: '', dueDate: '' })
  const [addTestSubmitted, setAddTestSubmitted] = useState(false)

  // Stats
  const total = mockTestRequests.length
  const inProgress = mockTestRequests.filter(r => r.status === 'in_progress').length
  const pendingCount = mockTestRequests.filter(r => r.status === 'pending').length
  const passedCount = mockTestRequests.filter(r => r.status === 'passed').length
  const eqAvailable = mockEquipment.filter(e => e.status === 'available').length

  const filteredRequests = mockTestRequests.filter(r => {
    const matchSearch =
      !searchQuery ||
      r.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.organization.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = filterStatus === 'all' || r.status === filterStatus
    const matchSource = sourceFilter === 'all' || r.source === sourceFilter
    return matchSearch && matchStatus && matchSource
  })

  const customerPendingCount = mockTestRequests.filter(r => r.status === 'pending' && r.source === 'customer').length

  const handleAddTest = () => {
    if (!newTest.partName || !newTest.testType || !newTest.dueDate) return
    setAddTestSubmitted(true)
    setTimeout(() => {
      setAddTestSubmitted(false)
      setShowAddTestForm(false)
      setNewTest({ partName: '', testType: 'mechanical', priority: 'standard', sampleCount: 1, certRequired: '', dueDate: '' })
    }, 1800)
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Request Test Modal */}
      {showAddTestForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">Request Lab Test</h3>
              </div>
              <button
                onClick={() => setShowAddTestForm(false)}
                className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Part Name *</label>
                <input
                  type="text"
                  value={newTest.partName}
                  onChange={(e) => setNewTest({...newTest, partName: e.target.value})}
                  placeholder="e.g., Pump Impeller"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Test Type *</label>
                <select
                  value={newTest.testType}
                  onChange={(e) => setNewTest({...newTest, testType: e.target.value as TestType})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                >
                  <option value="mechanical">Mechanical</option>
                  <option value="chemical">Chemical</option>
                  <option value="thermal">Thermal</option>
                  <option value="dimensional">Dimensional</option>
                  <option value="ndt">NDT</option>
                  <option value="fatigue">Fatigue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Priority</label>
                <select
                  value={newTest.priority}
                  onChange={(e) => setNewTest({...newTest, priority: e.target.value as 'standard' | 'expedited' | 'critical'})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                >
                  <option value="standard">Standard (7-10 days)</option>
                  <option value="expedited">Expedited (3-5 days)</option>
                  <option value="critical">Critical (24-48 hrs)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Sample Count</label>
                <input
                  type="number"
                  value={newTest.sampleCount}
                  onChange={(e) => setNewTest({...newTest, sampleCount: parseInt(e.target.value) || 1})}
                  min="1"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Certification Required</label>
                <input
                  type="text"
                  value={newTest.certRequired}
                  onChange={(e) => setNewTest({...newTest, certRequired: e.target.value})}
                  placeholder="e.g., DNV GL, Lloyd's"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Due Date *</label>
                <input
                  type="date"
                  value={newTest.dueDate}
                  onChange={(e) => setNewTest({...newTest, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                />
              </div>

              <button
                onClick={handleAddTest}
                disabled={!newTest.partName || !newTest.testType || !newTest.dueDate || addTestSubmitted}
                className={`w-full py-2 rounded-lg font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all ${
                  addTestSubmitted
                    ? 'bg-green-600'
                    : 'bg-[#0EA5E9] hover:bg-[#0284C7]'
                }`}
              >
                {addTestSubmitted ? (
                  <><CheckCircle className="w-4 h-4" /> Request Submitted!</>
                ) : (
                  <><Plus className="w-4 h-4" /> Submit Test Request</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-900 p-6 text-white mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/10 rounded-lg">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">🔬 Lab Portal</h2>
              <p className="text-emerald-200 text-sm">Additive Manufacturing Test Facility —Material Qualification & Part Validation</p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Active Tests</p>
                <p className="text-2xl font-bold text-[#0F172A]">{mockTestRequests.filter(r => r.status === 'in_progress' || r.status === 'pending').length}</p>
              </div>
              <ZapIcon className="w-6 h-6 text-[#0EA5E9]" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Equipment Online</p>
                <p className="text-2xl font-bold text-[#0F172A]">{mockEquipment.filter(e => e.status === 'available' || e.status === 'in_use').length}/{mockEquipment.length}</p>
              </div>
              <Gauge className="w-6 h-6 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Pass Rate</p>
                <p className="text-2xl font-bold text-emerald-600">92%</p>
              </div>
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Monthly Revenue</p>
                <p className="text-2xl font-bold text-[#0EA5E9]">$48.5K</p>
              </div>
              <DollarSign className="w-6 h-6 text-[#0EA5E9]" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-0">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-all ${activeTab === 'requests' ? 'border-[#0EA5E9] text-[#0EA5E9]' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
          >
            📋 Test Requests ({mockTestRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-all ${activeTab === 'equipment' ? 'border-[#0EA5E9] text-[#0EA5E9]' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
          >
            ⚙️ Equipment ({mockEquipment.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-all ${activeTab === 'reports' ? 'border-[#0EA5E9] text-[#0EA5E9]' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
          >
            📊 Results
          </button>
          <button
            onClick={() => setActiveTab('workload')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-all ${activeTab === 'workload' ? 'border-[#0EA5E9] text-[#0EA5E9]' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
          >
            👥 Technicians
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-all ${activeTab === 'analytics' ? 'border-[#0EA5E9] text-[#0EA5E9]' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
          >
            📈 Analytics
          </button>
          <button
            onClick={() => setActiveTab('drm')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-all ${activeTab === 'drm' ? 'border-[#0EA5E9] text-[#0EA5E9]' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
          >
            🔐 DRM
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-all ${activeTab === 'audit' ? 'border-[#0EA5E9] text-[#0EA5E9]' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
          >
            📋 Audit
          </button>
        </div>

        {/* Test Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {/* Header with Add Test Button */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#0F172A]">Test Requests</h3>
              <button
                onClick={() => setShowAddTestForm(true)}
                className="px-4 py-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Test
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by part name, order..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
                <option value="review">Review</option>
              </select>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value as 'all' | 'customer' | 'inhouse')}
                className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium"
              >
                <option value="all">All Sources</option>
                <option value="customer">Customer Requests</option>
                <option value="inhouse">In-House Tests</option>
              </select>
            </div>

            {/* Test Request Cards */}
            <div className="grid grid-cols-1 gap-3">
              {mockTestRequests.filter(r => {
                const matchSearch = !searchQuery || r.partName.toLowerCase().includes(searchQuery.toLowerCase()) || r.partNumber.toLowerCase().includes(searchQuery.toLowerCase())
                const matchStatus = filterStatus === 'all' || r.status === filterStatus
                const matchSource = sourceFilter === 'all' || r.source === sourceFilter
                return matchSearch && matchStatus && matchSource
              }).map(request => (
                <div key={request.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:border-[#0EA5E9]/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-[#0EA5E9] font-bold">{request.id}</code>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${request.priority === 'critical' ? 'bg-red-100 text-red-700' : request.priority === 'expedited' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                          {request.priority}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${request.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : request.status === 'pending' ? 'bg-slate-100 text-slate-600' : request.status === 'passed' ? 'bg-green-100 text-green-700' : request.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="font-semibold text-[#0F172A]">{request.partName}</p>
                      <p className="text-xs text-slate-500 mt-1">{request.organization} • {request.testTypes.join(', ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Assigned to</p>
                      <p className="font-semibold text-[#0F172A]">{request.technician === 'Unassigned' ? '⭕ Unassigned' : request.technician}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <span>Due: {request.dueDate} • Qty: {request.sampleCount}</span>
                    <button className="px-2 py-1 rounded hover:bg-slate-50 text-[#0EA5E9] font-medium">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Equipment Tab */}
        {activeTab === 'equipment' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockEquipment.map(eq => (
              <div key={eq.id} className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-[#0F172A]">{eq.name}</p>
                    <p className="text-xs text-slate-500">{eq.type}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${eq.status === 'available' ? 'bg-green-100 text-green-700' : eq.status === 'in_use' ? 'bg-blue-100 text-blue-700' : eq.status === 'maintenance' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                    {eq.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Utilization</span>
                    <span className="font-semibold text-[#0F172A]">{eq.utilization}%</span>
                  </div>
                  <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#0EA5E9] h-full" style={{ width: `${eq.utilization}%` }}></div>
                  </div>
                  {eq.currentJob && <p className="text-[10px] text-slate-500 mt-1">Current: {eq.currentJob}</p>}
                  {eq.nextAvailable && <p className="text-[10px] text-slate-500">Available: {eq.nextAvailable}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 gap-3">
            {mockReports.map(report => (
              <div key={report.id} className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-[#0F172A]">{report.partName}</p>
                    <p className="text-xs text-slate-500">{report.partNumber} • {report.testDate}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${report.result === 'pass' ? 'bg-green-100 text-green-700' : report.result === 'fail' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {report.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Workload Tab - Placeholder */}
        {activeTab === 'workload' && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 text-center text-slate-600">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Technician workload insights — coming soon</p>
          </div>
        )}

        {/* Analytics Tab - Placeholder */}
        {activeTab === 'analytics' && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 text-center text-slate-600">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Performance analytics — coming soon</p>
          </div>
        )}

        {/* DRM Tab - Placeholder */}
        {activeTab === 'drm' && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 text-center text-slate-600">
            <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>DRM protocol management — coming soon</p>
          </div>
        )}

        {/* Audit Tab - Issued Certifications */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#0F172A]">Certification History</h3>
            <div className="grid grid-cols-1 gap-3">
              {mockAuditLogs.filter(log => log.actionType === 'reported' || log.actionType === 'completed').map(log => (
                <div key={log.id} className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-[#0EA5E9]">{log.id}</code>
                        <p className="text-sm font-semibold text-[#0F172A]">{log.description}</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-600 mt-2">
                        <span>{log.timestamp}</span>
                        <span>By: {log.actor}</span>
                        <span className="text-emerald-600 font-medium">Issued</span>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-xs rounded hover:bg-slate-50 text-[#0EA5E9] font-medium whitespace-nowrap">
                      View Certificate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

