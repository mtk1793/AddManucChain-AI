'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ChevronRight, ChevronLeft,
  LayoutDashboard, Package, Printer, Boxes, Cpu, FileBox,
  Factory, Radio, Truck, FlaskConical, Users, BarChart3,
  ClipboardList, ShieldCheck, BadgeCheck, HeartHandshake,
  Library, TestTube2, Settings, HelpCircle, Lightbulb,
  MousePointerClick, BarChart2, AlertTriangle, Search,
  Filter, Download, Plus, Eye, RefreshCw, Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TutorialStep {
  title: string
  description: string
  tip?: string
  icon: React.ElementType
  area?: string // visual label for highlighted area
}

interface SectionTutorialConfig {
  sectionId: string
  sectionLabel: string
  icon: React.ElementType
  color: string   // Tailwind gradient from/to
  steps: TutorialStep[]
}

// ─── Per-Section Tutorial Data ────────────────────────────────────────────────

export const SECTION_TUTORIALS: Record<string, SectionTutorialConfig> = {

  overview: {
    sectionId: 'overview',
    sectionLabel: 'Dashboard Overview',
    icon: LayoutDashboard,
    color: 'from-sky-500 to-teal-400',
    steps: [
      {
        title: 'Welcome to the Overview',
        description: 'The Overview is your command center. It surfaces the most critical metrics across all AddManuChain operations so you can spot issues and opportunities at a glance.',
        icon: LayoutDashboard,
        area: 'Entire Page',
      },
      {
        title: 'KPI Stat Cards',
        description: 'The colored stat cards at the top show live counts for active orders, blueprints, print centers, pending certifications, cost savings, and lead time reductions. Each card links to its full section.',
        tip: 'Click any stat card to jump directly to that section.',
        icon: BarChart2,
        area: 'Top Stat Cards',
      },
      {
        title: 'Recent Orders Panel',
        description: 'The Recent Orders table shows your latest 5 orders with their current status (Pending, Printing, Shipped, Delivered). Status badges are colour-coded for quick scanning.',
        tip: 'Click "View All Orders" to open the full Orders tab.',
        icon: Package,
        area: 'Recent Orders',
      },
      {
        title: 'Print Center Status',
        description: 'The Print Center tiles on the right display live capacity and queue depth for each certified AM facility — green means available, yellow means busy, red means at capacity.',
        tip: 'You can request a print job directly from any available center.',
        icon: Factory,
        area: 'Print Center Status',
      },
      {
        title: 'Activity Feed',
        description: 'The Activity Feed at the bottom tracks every system event in real time — new orders, certification approvals, blueprint uploads, and DRM token issuances.',
        tip: 'Use the filter icon to narrow activity by type or date range.',
        icon: Bell,
        area: 'Activity Feed',
      },
    ],
  },

  orders: {
    sectionId: 'orders',
    sectionLabel: 'Orders',
    icon: Package,
    color: 'from-blue-500 to-cyan-400',
    steps: [
      {
        title: 'Orders Management',
        description: 'The Orders section is your central hub for creating, tracking and managing all spare-part print requests. Every order moves through a defined lifecycle: Draft → Approved → Printing → QC → Shipped → Delivered.',
        icon: Package,
        area: 'Orders Page',
      },
      {
        title: 'Status & Priority Filters',
        description: 'Use the status tabs (All / Active / Pending / Completed) and the Priority drop-down to filter the list. Priority levels — Critical, High, Medium, Low — are colour-coded for instant triage.',
        tip: 'Combine status and priority filters to focus on what needs action today.',
        icon: Filter,
        area: 'Filter Bar',
      },
      {
        title: 'Order Cards',
        description: 'Each order card shows the part name, blueprint ID, assigned print center, estimated delivery date, and current status badge. Expand any card to view the full specification and audit trail.',
        tip: 'The progress bar inside a card shows % of print job completed.',
        icon: MousePointerClick,
        area: 'Order List',
      },
      {
        title: 'Creating a New Order',
        description: 'Click the "+ New Order" button in the top-right to open the order wizard. Select a certified blueprint, choose a print center, set priority, and confirm material requirements. The system auto-routes for DRM approval.',
        tip: 'You must select a certified blueprint — uncertified files are blocked automatically.',
        icon: Plus,
        area: 'New Order Button',
      },
      {
        title: 'Order Tracking & Communication',
        description: 'Open any order to see its real-time tracking timeline, DRM token status, certification sign-off log, and a message thread with the assigned print center.',
        tip: 'All communications are hash-logged for full compliance traceability.',
        icon: Eye,
        area: 'Order Detail View',
      },
    ],
  },

  print_queue: {
    sectionId: 'print_queue',
    sectionLabel: 'Print Queue',
    icon: Printer,
    color: 'from-violet-500 to-purple-400',
    steps: [
      {
        title: 'Print Queue & DRM Approval',
        description: 'This is the Digital Rights Management (DRM) approval pipeline. Every print job must receive multi-party sign-off from the Customer, OEM Partner, and Certification Authority before printing begins.',
        icon: Printer,
        area: 'Print Queue Page',
      },
      {
        title: 'Approval Stages',
        description: 'Each row shows the current approval stage: Customer Submitted → OEM Review → Cert Authority Review → Token Issued → Print Authorized. You can see who has approved and who is pending.',
        tip: 'Hover over any approval badge to see the timestamp and approver name.',
        icon: ShieldCheck,
        area: 'Approval Pipeline',
      },
      {
        title: 'DRM Token Status',
        description: 'Once all parties approve, a cryptographic DRM token is issued. This token defines the exact quantity, material, and print parameters. The printer will reject any deviations from the token spec.',
        tip: 'Tokens are single-use by default — re-printing requires a new approval cycle.',
        icon: BadgeCheck,
        area: 'DRM Token Column',
      },
      {
        title: 'Taking Action on Approvals',
        description: 'If you have the Approver role, use the "Approve" or "Reject" buttons on each row. Rejected items require the requester to make corrections before resubmission. Add a rejection note to speed up correction.',
        tip: 'Bulk-approve multiple low-risk items by ticking their checkboxes.',
        icon: MousePointerClick,
        area: 'Action Buttons',
      },
    ],
  },

  physical_inventory: {
    sectionId: 'physical_inventory',
    sectionLabel: 'Physical Inventory',
    icon: Boxes,
    color: 'from-orange-500 to-amber-400',
    steps: [
      {
        title: 'Physical Inventory',
        description: 'Track physical spare parts stored across all your rigs and shore-based warehouses. The system shows real-time stock levels, reorder points, and site assignments.',
        icon: Boxes,
        area: 'Physical Inventory Page',
      },
      {
        title: 'Sites & Locations',
        description: 'The left panel lists your registered sites (Hibernia Platform, Terra Nova FPSO, Shelf 7 Warehouse, etc.). Selecting a site filters the inventory table to that location only.',
        tip: 'Use "All Sites" to view aggregate stock and spot cross-site imbalances.',
        icon: Factory,
        area: 'Site Selector',
      },
      {
        title: 'Stock Level Indicators',
        description: 'The "Status" column uses colour-coded badges: In Stock (green), Low Stock (yellow — below reorder point), Out of Stock (red). Sort by Status to action urgent replenishments first.',
        tip: 'Set a custom reorder point for each part in the part detail view.',
        icon: AlertTriangle,
        area: 'Stock Status Column',
      },
      {
        title: 'Linking to Digital Blueprints',
        description: 'Every physical part has a "Blueprint Available" indicator. Parts with a certified blueprint can be re-ordered digitally via the Orders tab in minutes — no traditional procurement lead time.',
        tip: 'Parts without a blueprint are flagged for AM digitisation review.',
        icon: FileBox,
        area: 'Blueprint Link Column',
      },
    ],
  },

  digital_inventory: {
    sectionId: 'digital_inventory',
    sectionLabel: 'Digital Inventory',
    icon: Cpu,
    color: 'from-teal-500 to-emerald-400',
    steps: [
      {
        title: 'AI-Powered Digital Inventory',
        description: 'The Digital Inventory uses machine learning to forecast which spare parts carry the highest risk of stockout. It analyzes historical consumption, failure rates, and lead times to rank parts by urgency.',
        icon: Cpu,
        area: 'Digital Inventory Page',
      },
      {
        title: 'Risk Score & AI Forecast',
        description: 'Each part shows an AI Risk Score (0–100). A high score means the part is likely needed soon and either has low stock or no local digital blueprint. The system recommends actions: "Print Now", "Upload Blueprint", or "Monitor".',
        tip: 'Parts with Risk Score > 70 are automatically escalated to the Orders queue.',
        icon: BarChart3,
        area: 'Risk Score Column',
      },
      {
        title: 'Onsite Readiness',
        description: 'The "Onsite Readiness" metric shows whether a digital blueprint is certified, a print center is within range, and materials are available. Green = fully ready to print within 24 h.',
        tip: 'Readiness is recalculated every hour using live print center data.',
        icon: RefreshCw,
        area: 'Readiness Indicator',
      },
      {
        title: 'Uploading New Blueprints',
        description: 'Click "+ Upload Blueprint" to add a new CAD file to the digital library. The file goes through an automated geometry validation and is then queued for OEM review before certification.',
        tip: 'Supported formats: .STL, .STEP, .STP, .OBJ, .3MF.',
        icon: Plus,
        area: 'Upload Button',
      },
      {
        title: 'Consumption History',
        description: 'Expand any part to see a 12-month consumption chart, predicted failure curve, and comparable parts. This data feeds the AI model and improves forecast accuracy over time.',
        tip: 'Export the chart to include in your inventory audit reports.',
        icon: BarChart2,
        area: 'Consumption Chart',
      },
    ],
  },

  blueprints: {
    sectionId: 'blueprints',
    sectionLabel: 'Blueprint Library',
    icon: FileBox,
    color: 'from-indigo-500 to-blue-400',
    steps: [
      {
        title: 'Blueprint Library',
        description: 'The Blueprint Library stores all certified CAD files for every printable spare part. Each blueprint is versioned, cryptographically signed, and linked to its OEM certification and material specification.',
        icon: FileBox,
        area: 'Blueprint Library Page',
      },
      {
        title: 'Blueprint Cards',
        description: 'Each card shows the part name, blueprint ID, revision number, OEM owner, compatible materials, and certification status. A "Certified" badge means the blueprint has passed OEM and authority review.',
        tip: 'Only Certified blueprints can be selected when creating a new Order.',
        icon: Eye,
        area: 'Blueprint Cards',
      },
      {
        title: 'Search & Filter',
        description: 'Use the search bar to find blueprints by name, part number, or OEM reference. Filter by material (Titanium, Inconel, Nylon, etc.) or certification status to narrow your results.',
        tip: 'Administrators can tag blueprints with custom categories.',
        icon: Search,
        area: 'Search & Filter Bar',
      },
      {
        title: 'Blueprint Detail View',
        description: 'Click any blueprint to open the detail panel: 3D preview, full material spec, print parameter sheet, revision history, and linked certification documents. You can download the certified spec sheet as a PDF.',
        tip: 'The 3D preview is interactive — rotate and zoom using mouse drag.',
        icon: MousePointerClick,
        area: 'Blueprint Detail',
      },
      {
        title: 'Version Management',
        description: 'When an OEM releases a new revision, the old blueprint is archived and the new one enters the certification queue. Orders already in progress continue with the version locked at time of token issuance.',
        tip: 'You can compare two blueprint versions side-by-side in the detail view.',
        icon: RefreshCw,
        area: 'Version History',
      },
    ],
  },

  centers: {
    sectionId: 'centers',
    sectionLabel: 'Print Centers',
    icon: Factory,
    color: 'from-rose-500 to-pink-400',
    steps: [
      {
        title: 'Print Centers',
        description: 'This section shows all certified additive manufacturing facilities in the AddManuChain network. Each center is DNV GL or Lloyd\'s Register certified to print specific part categories.',
        icon: Factory,
        area: 'Print Centers Page',
      },
      {
        title: 'Capacity & Queue',
        description: 'The capacity bar shows how busy each center is right now. The queue count tells you how many jobs are waiting. "Available Now" means the center can start a new job within 4 hours.',
        tip: 'Capacity updates every 15 minutes via the center\'s API integration.',
        icon: BarChart2,
        area: 'Capacity Bar',
      },
      {
        title: 'Capability Matrix',
        description: 'Click a center to see which material types (metals, polymers, ceramics) and part categories they are certified for. Not all centers can print all materials — the system auto-routes orders to a capable center.',
        tip: 'You can set a preferred center per blueprint in the Blueprint Library.',
        icon: ShieldCheck,
        area: 'Capability Matrix',
      },
      {
        title: 'Requesting a Print',
        description: 'Use the "Request Print" button on a center\'s card to pre-assign an order to that facility. The request goes through the DRM approval pipeline before the center receives the print file.',
        tip: 'Priority orders automatically route to the nearest available certified center.',
        icon: Plus,
        area: 'Request Print Button',
      },
    ],
  },

  peer_printers: {
    sectionId: 'peer_printers',
    sectionLabel: 'Peer Printers',
    icon: Radio,
    color: 'from-amber-500 to-yellow-400',
    steps: [
      {
        title: 'Peer Printer Network',
        description: 'The Peer Printer network works like an Airbnb for industrial 3D printers. Companies share idle certified printing capacity with others on the platform, reducing overcapacity costs and improving network resilience.',
        icon: Radio,
        area: 'Peer Printers Page',
      },
      {
        title: 'Available Printers',
        description: 'Each listing shows the printer type, build volume, materials available, certification level, hourly rate, and real-time availability. Ratings are based on past job quality audits.',
        tip: 'Filter by your required material or part category to find the right printer fast.',
        icon: Search,
        area: 'Printer Listings',
      },
      {
        title: 'Booking a Peer Printer',
        description: 'Click "Book Slot" to reserve a printing window. You\'ll submit your DRM-approved token, and the printer owner receives the encrypted print file. Payment is handled automatically on job completion.',
        tip: 'Bookings are covered by AddManuChain\'s quality guarantee — failed prints are reprinted at no cost.',
        icon: MousePointerClick,
        area: 'Book Slot Button',
      },
      {
        title: 'Listing Your Printer',
        description: 'If you own a certified industrial printer with spare capacity, use "+ List My Printer" to add it to the network. Set your availability calendar, materials, and pricing. Earnings are transferred weekly.',
        tip: 'Printers must pass a certification audit before appearing in search results.',
        icon: Plus,
        area: 'List Printer Button',
      },
    ],
  },

  shipments: {
    sectionId: 'shipments',
    sectionLabel: 'Shipments',
    icon: Truck,
    color: 'from-cyan-500 to-sky-400',
    steps: [
      {
        title: 'Shipments & Logistics',
        description: 'Track all outbound and inbound shipments for your printed parts. The system integrates with major offshore logistics providers to give you real-time ETA and position tracking.',
        icon: Truck,
        area: 'Shipments Page',
      },
      {
        title: 'Shipment Timeline',
        description: 'Each shipment has a step-by-step timeline: Packaged → Collected → In Transit → Customs → On Board Vessel → Delivered. Click any step to see detailed carrier notes and timestamps.',
        tip: 'Enable push notifications to be alerted when a shipment reaches each milestone.',
        icon: Eye,
        area: 'Shipment Timeline',
      },
      {
        title: 'Live Tracking Map',
        description: 'The map view shows vessel or aircraft positions for active shipments. For offshore deliveries, helicopter transfer status is shown when within 50 NM of the destination rig.',
        tip: 'Switch between list and map view using the toggle in the top right.',
        icon: LayoutDashboard,
        area: 'Tracking Map',
      },
      {
        title: 'Customs & Compliance Docs',
        description: 'All required customs documentation (MSDS, certificates of origin, test reports) is auto-generated from the blueprint and certification data. Download a single PDF package for any shipment.',
        tip: 'Documents are pre-validated against destination country regulations.',
        icon: Download,
        area: 'Documentation Panel',
      },
    ],
  },

  materials: {
    sectionId: 'materials',
    sectionLabel: 'Materials Inventory',
    icon: FlaskConical,
    color: 'from-lime-500 to-green-400',
    steps: [
      {
        title: 'Materials Inventory',
        description: 'This section tracks the raw material stocks held at each print center — metal powders, polymers, composites, and wire feeds. Sufficient material stock is a prerequisite for approving print jobs.',
        icon: FlaskConical,
        area: 'Materials Inventory Page',
      },
      {
        title: 'Material Types & Grades',
        description: 'Materials are listed by type (Ti-6Al-4V, Inconel 625, 316L SS, PEEK, etc.), grade, and lot certificate. Each lot is traceable to its mill certificate, ensuring part material pedigree from powder to part.',
        tip: 'You can filter by center to see which materials are locally available.',
        icon: Search,
        area: 'Material List',
      },
      {
        title: 'Stock Levels & Reorder',
        description: 'The stock gauge shows kilograms or liters remaining vs. reorder point. When stock drops below the threshold, the system generates a procurement request automatically.',
        tip: 'Critical materials can be flagged for dual-source procurement to prevent delays.',
        icon: AlertTriangle,
        area: 'Stock Gauge',
      },
      {
        title: 'Material Consumption Forecast',
        description: 'Based on the current order pipeline, the system forecasts material consumption over the next 30/60/90 days and alerts you to potential shortages before they occur.',
        tip: 'Link material procurement lead times so forecasts include replenishment horizons.',
        icon: BarChart3,
        area: 'Consumption Forecast',
      },
    ],
  },

  partners: {
    sectionId: 'partners',
    sectionLabel: 'OEM Partners',
    icon: Users,
    color: 'from-purple-500 to-violet-400',
    steps: [
      {
        title: 'OEM Partner Management',
        description: 'This section manages relationships with Original Equipment Manufacturers (OEMs) who supply certified blueprints and approve print specifications. Each partner has a defined role and access level.',
        icon: Users,
        area: 'OEM Partners Page',
      },
      {
        title: 'Partner Profiles',
        description: 'Each partner card shows company name, certifications held, number of active blueprints, pending approvals, and SLA performance (average approval time). Click to expand the full partner profile.',
        tip: 'Partners with SLA breaches are flagged in red — follow up directly from this page.',
        icon: Eye,
        area: 'Partner Cards',
      },
      {
        title: 'Blueprint Submissions',
        description: 'From a partner\'s profile, you can see all blueprints they own, their certification status, and any pending review items. You can nudge the partner for overdue approvals with a single click.',
        tip: 'Set automated reminders for approvals that have been pending more than 48 hours.',
        icon: FileBox,
        area: 'Blueprint Submissions',
      },
      {
        title: 'Onboarding a New Partner',
        description: 'Click "+ New Partner" to start the OEM onboarding workflow. You\'ll enter company details, assign a portal user, define their blueprint approval rights, and specify royalty/licensing terms.',
        tip: 'New partners go through a one-time verification before they can upload blueprints.',
        icon: Plus,
        area: 'New Partner Button',
      },
    ],
  },

  analytics: {
    sectionId: 'analytics',
    sectionLabel: 'Analytics',
    icon: BarChart3,
    color: 'from-sky-600 to-blue-500',
    steps: [
      {
        title: 'Analytics & Insights',
        description: 'The Analytics section gives you full visibility into operational performance, cost savings, environmental impact, and SLA compliance across all AddManuChain activities.',
        icon: BarChart3,
        area: 'Analytics Page',
      },
      {
        title: 'KPI Summary Cards',
        description: 'The top row shows your headline numbers: total cost savings vs. traditional procurement, average lead time reduction, carbon footprint saved (kg CO₂), and print success rate.',
        tip: 'All figures are calculated over the selected date range — use the date picker in the top right.',
        icon: BarChart2,
        area: 'KPI Summary Row',
      },
      {
        title: 'Order Volume Chart',
        description: 'The bar chart shows monthly order volumes broken down by status (completed, in-progress, cancelled). Toggle between absolute numbers and % split using the chart legend.',
        tip: 'Export any chart as PNG or CSV using the download icon on hover.',
        icon: Download,
        area: 'Order Volume Chart',
      },
      {
        title: 'Cost vs. Traditional Procurement',
        description: 'The waterfall chart compares AddManuChain digital printing costs vs. traditional spare part ordering. Savings come from elimination of warehousing, reduced expediting fees, and shorter lead times.',
        tip: 'Hover over any bar to see the breakdown of cost components.',
        icon: BarChart3,
        area: 'Cost Comparison Chart',
      },
      {
        title: 'Downloadable Reports',
        description: 'Click "Generate Report" to create a full PDF analytics report for any date range. Reports include all charts, commentary, and a compliance summary suitable for executive presentation or audit submission.',
        tip: 'Schedule reports to be emailed to stakeholders automatically each month.',
        icon: Download,
        area: 'Report Generation',
      },
    ],
  },

  audit: {
    sectionId: 'audit',
    sectionLabel: 'Audit Logs',
    icon: ClipboardList,
    color: 'from-slate-600 to-slate-500',
    steps: [
      {
        title: 'Audit Logs',
        description: 'Every action in AddManuChain is recorded in an immutable, hash-chained audit log. This ensures full traceability for regulatory compliance (DNV GL, Lloyd\'s Register, ASTM, NORSOK).',
        icon: ClipboardList,
        area: 'Audit Log Page',
      },
      {
        title: 'Hash-Chain Integrity',
        description: 'Each log entry includes the previous entry\'s hash, creating a tamper-evident chain. The "Chain OK" badge at the top confirms the entire log is unmodified. Any tampering would break the chain and raise an alert.',
        tip: 'You can manually verify the chain integrity at any time by clicking "Verify Chain".',
        icon: ShieldCheck,
        area: 'Hash Chain Status',
      },
      {
        title: 'Filtering & Search',
        description: 'Filter logs by User, Action Type (Blueprint Upload, Order Created, DRM Token Issued, etc.), Date Range, or Severity (Info, Warning, Critical). Use the search bar to find specific event IDs.',
        tip: 'Bookmark frequently used filter combinations for quick auditor access.',
        icon: Filter,
        area: 'Filter Panel',
      },
      {
        title: 'Exporting for Compliance',
        description: 'Click "Export" to download the filtered log as a signed PDF or JSON file. Exported files include a platform-level digital signature to confirm authenticity when submitted to certification authorities.',
        tip: 'Routine quarterly exports are recommended as part of your compliance programme.',
        icon: Download,
        area: 'Export Button',
      },
    ],
  },

  certifications: {
    sectionId: 'certifications',
    sectionLabel: 'Certifications',
    icon: ShieldCheck,
    color: 'from-green-600 to-emerald-500',
    steps: [
      {
        title: 'Certifications & Compliance',
        description: 'Manage all certifications held by your organisation, your print centers, and individual blueprints. Certifications from DNV GL, Lloyd\'s Register, Bureau Veritas, ABS, and others are tracked here.',
        icon: ShieldCheck,
        area: 'Certifications Page',
      },
      {
        title: 'Certification Status Dashboard',
        description: 'Active certifications are shown in green, expiring within 90 days in amber, and expired in red. The system sends automated renewal reminders at 90, 30, and 7 days before expiry.',
        tip: 'Click any certification to see full details, issuing authority, and linked jobs.',
        icon: Eye,
        area: 'Status Dashboard',
      },
      {
        title: 'Blueprint Certifications',
        description: 'Each blueprint\'s certification panel shows which authority approved it, the standard (e.g. NORSOK M-650 for materials), issue date, revision it covers, and expiry. A blueprint cannot be used in production after its certification expires.',
        tip: 'Set up auto-renewal workflows to submit recertification requests 60 days before expiry.',
        icon: FileBox,
        area: 'Blueprint Certifications',
      },
      {
        title: 'Adding a New Certification',
        description: 'Click "+ Add Certification" to upload a certification document, link it to a blueprint or print center, and set its expiry date. The document is stored in the immutable audit record.',
        tip: 'You can bulk-import certifications via CSV for initial platform setup.',
        icon: Plus,
        area: 'Add Certification',
      },
    ],
  },

  authorities: {
    sectionId: 'authorities',
    sectionLabel: 'Certification Authorities',
    icon: BadgeCheck,
    color: 'from-red-500 to-rose-400',
    steps: [
      {
        title: 'Certification Authorities',
        description: 'This section manages your relationships with the bodies that certify blueprints, print centers, and materials — DNV GL, Lloyd\'s Register, Bureau Veritas, ABS, TÜV SÜD, and others.',
        icon: BadgeCheck,
        area: 'Authorities Page',
      },
      {
        title: 'Authority Profiles',
        description: 'Each authority card shows the standards they cover, their current engagement with your platform (active reviews, pending approvals, completed certifications), and your assigned account contact.',
        tip: 'Pin your primary authority to the top for quick access.',
        icon: Eye,
        area: 'Authority Cards',
      },
      {
        title: 'Approval Workflows',
        description: 'Each authority has a defined approval workflow. When a blueprint or process change is submitted, the system routes it automatically based on the required standard and tracks the review timeline against the SLA.',
        tip: 'Workflows can be customized per authority in the Settings section.',
        icon: RefreshCw,
        area: 'Workflow Status',
      },
      {
        title: 'Document Exchange',
        description: 'Use the Document Portal to securely share technical files, test reports, and samples with authority reviewers. All exchanges are logged and version-controlled.',
        tip: 'Large files (>100 MB) are automatically chunked and encrypted before transfer.',
        icon: Download,
        area: 'Document Portal',
      },
    ],
  },

  services: {
    sectionId: 'services',
    sectionLabel: 'Customer Success',
    icon: HeartHandshake,
    color: 'from-pink-500 to-fuchsia-400',
    steps: [
      {
        title: 'Customer Success Centre',
        description: 'The Customer Success section covers end-to-end service management — training programmes, onboarding status, support tickets, SLA performance, and health scores for each account.',
        icon: HeartHandshake,
        area: 'Customer Success Page',
      },
      {
        title: 'Training Modules',
        description: 'Browse the library of interactive training modules for operators, engineers, and managers. Completion status is tracked per user and feeds into the account health score.',
        tip: 'Assign mandatory modules to new users from the team management panel.',
        icon: Lightbulb,
        area: 'Training Modules',
      },
      {
        title: 'Support Tickets',
        description: 'Raise and track support tickets directly here. Tickets are categorised by type (Technical, Billing, Compliance, Training) and assigned to the relevant specialist. Priority tickets receive 2-hour SLA response.',
        tip: 'Attach screenshots and log exports directly to a ticket for faster resolution.',
        icon: HelpCircle,
        area: 'Support Tickets',
      },
      {
        title: 'Account Health Score',
        description: 'The health score (0–100) aggregates platform adoption, training completion, open tickets, and SLA compliance. A low score triggers a proactive check-in from your Customer Success Manager.',
        tip: 'Improve your score by completing outstanding training modules and resolving stale tickets.',
        icon: BarChart2,
        area: 'Health Score',
      },
    ],
  },

  ip_library: {
    sectionId: 'ip_library',
    sectionLabel: 'IP Library',
    icon: Library,
    color: 'from-violet-600 to-purple-500',
    steps: [
      {
        title: 'IP Library',
        description: 'The IP Library is a secure vault for OEM intellectual property — licensed blueprints, proprietary material formulations, and restricted print processes. Access is governed by per-file licensing agreements.',
        icon: Library,
        area: 'IP Library Page',
      },
      {
        title: 'Licensing & Royalties',
        description: 'Each IP asset has a licence type (per-print, perpetual, subscription). The system automatically meters usage and calculates royalty payments due to each OEM based on actual prints made.',
        tip: 'Royalty statements are generated monthly and sent directly to OEM partners.',
        icon: BadgeCheck,
        area: 'Licensing Panel',
      },
      {
        title: 'Access Control',
        description: 'IP is encrypted at rest and decrypted only within an authorised print session. Users can view part geometry and spec sheets, but the raw design file is never accessible outside a certified print environment.',
        tip: 'Request expanded access (e.g. for re-engineering studies) via the Access Request workflow.',
        icon: ShieldCheck,
        area: 'Access Control',
      },
      {
        title: 'Usage Analytics',
        description: 'Track how many times each IP asset has been printed, across which centers, and what royalties have been generated. OEM partners see their own usage dashboards in real time.',
        tip: 'Export usage reports as evidence of licensing compliance for OEM audits.',
        icon: BarChart3,
        area: 'Usage Analytics',
      },
      {
        title: 'Submitting New IP',
        description: 'OEM partners can upload new IP assets via the "+ Add IP Asset" button. Files are encrypted on upload, and the OEM sets access tiers, pricing, and approved print center restrictions before the asset goes live.',
        tip: 'IP submission triggers automated format validation and DRM key generation.',
        icon: Plus,
        area: 'Add IP Asset',
      },
    ],
  },

  lab_portal: {
    sectionId: 'lab_portal',
    sectionLabel: 'Lab & Testing Portal',
    icon: TestTube2,
    color: 'from-green-500 to-teal-400',
    steps: [
      {
        title: 'Lab & Testing Portal',
        description: 'The Lab Portal manages AM testing requests, equipment scheduling, and certification test reports. All printed parts for offshore use must pass mechanical and non-destructive testing before deployment.',
        icon: TestTube2,
        area: 'Lab Portal Page',
      },
      {
        title: 'Test Requests',
        description: 'Submit a test request by selecting a completed print job and specifying the required tests (tensile, hardness, CT scan, dye penetrant, etc.). The system routes to an available accredited lab automatically.',
        tip: 'Standard offshore test packages (NORSOK M-630, DNV SE-0472) are pre-configured as one-click bundles.',
        icon: Plus,
        area: 'Test Request Form',
      },
      {
        title: 'Equipment Scheduling',
        description: 'Book shared lab equipment (CT scanners, tensile test machines, CMMs) via the scheduling view. Slots are available in 4-hour blocks and can be reserved up to 30 days in advance.',
        tip: 'Urgent test bookings can be flagged to jump the queue with manager approval.',
        icon: RefreshCw,
        area: 'Equipment Schedule',
      },
      {
        title: 'Test Reports & Certification',
        description: 'Completed test reports are uploaded directly by the lab and linked to the print job and blueprint. A pass result automatically triggers a certification update; a fail triggers a non-conformance review.',
        tip: 'Reports are stored permanently in the audit log and accessible to certification authorities.',
        icon: ClipboardList,
        area: 'Test Reports',
      },
      {
        title: 'Non-Conformance Management',
        description: 'Failed tests open a Non-Conformance Report (NCR) automatically. The NCR workflow covers root cause analysis, corrective action, re-test scheduling, and final closure sign-off.',
        tip: 'NCR trends feed back into the AI model to improve print parameter recommendations.',
        icon: AlertTriangle,
        area: 'NCR Panel',
      },
    ],
  },

  settings: {
    sectionId: 'settings',
    sectionLabel: 'Settings',
    icon: Settings,
    color: 'from-slate-500 to-slate-400',
    steps: [
      {
        title: 'Settings',
        description: 'Configure your account, team, notifications, and platform integrations from the Settings section. Changes take effect immediately unless noted otherwise.',
        icon: Settings,
        area: 'Settings Page',
      },
      {
        title: 'Profile & Account',
        description: 'Update your name, email, role, and profile photo. Change your password and enable two-factor authentication (2FA) — required for all Admin and Approval roles.',
        tip: '2FA via authenticator app is mandatory for anyone in the Approval chain.',
        icon: Users,
        area: 'Profile Section',
      },
      {
        title: 'Notifications & Alerts',
        description: 'Choose which events trigger email, SMS, or in-app notifications. You can set different preferences for order status changes, DRM approvals, certification renewals, and system alerts.',
        tip: 'Enable "Critical Alerts" to receive SMS for any red-status events regardless of your other settings.',
        icon: Bell,
        area: 'Notifications Section',
      },
      {
        title: 'Restart Tutorial',
        description: 'Click "Restart Tutorial" at the bottom of the Settings page to replay the full platform walkthrough from the beginning. Individual section tutorials can also be restarted from this page.',
        tip: 'Use this when onboarding new team members — have them start in Settings → Restart Tutorial.',
        icon: RefreshCw,
        area: 'Tutorial Controls',
      },
    ],
  },
}

// ─── STORAGE KEY HELPERS ──────────────────────────────────────────────────────

const storageKey = (sectionId: string) =>
  `addmanuchain_tutorial_seen_${sectionId}`

export function markSectionSeen(sectionId: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(storageKey(sectionId), 'true')
  }
}

export function isSectionSeen(sectionId: string): boolean {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(storageKey(sectionId)) === 'true'
}

export function clearAllSectionTutorials() {
  if (typeof window === 'undefined') return
  Object.keys(SECTION_TUTORIALS).forEach(id => {
    localStorage.removeItem(storageKey(id))
  })
}

// ─── SECTION TUTORIAL COMPONENT ───────────────────────────────────────────────

interface SectionTutorialProps {
  sectionId: string
  visible: boolean
  onClose: () => void
}

export function SectionTutorial({ sectionId, visible, onClose }: SectionTutorialProps) {
  const config = SECTION_TUTORIALS[sectionId]
  const [step, setStep] = useState(0)
  const [internalVisible, setInternalVisible] = useState(false)

  // Sync with visible prop
  useEffect(() => {
    if (visible) {
      setStep(0)
      setInternalVisible(true)
    } else {
      setInternalVisible(false)
    }
  }, [visible, sectionId])

  const current = config?.steps[step]
  const total = config?.steps.length ?? 0
  const isFirst = step === 0
  const isLast = step === total - 1
  const progress = total > 0 ? ((step + 1) / total) * 100 : 0

  const handleNext = useCallback(() => {
    if (isLast) {
      handleClose()
    } else {
      setStep(s => s + 1)
    }
  }, [isLast])

  const handlePrev = useCallback(() => {
    if (!isFirst) setStep(s => s - 1)
  }, [isFirst])

  const handleClose = useCallback(() => {
    setInternalVisible(false)
    setTimeout(() => {
      markSectionSeen(sectionId)
      onClose()
    }, 300)
  }, [sectionId, onClose])

  if (!config || !current) return null

  const SectionIcon = config.icon
  const StepIcon = current.icon

  return (
    <AnimatePresence>
      {internalVisible && (
        <>
          {/* Semi-transparent backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50"
            onClick={handleClose}
          />

          {/* Tutorial card — bottom-right-ish, safe from sidebar */}
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.95 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="fixed z-50 bottom-6 right-6 w-full max-w-sm sm:max-w-md px-4 sm:px-0"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">

              {/* Section header strip */}
              <div className={`bg-gradient-to-r ${config.color} px-5 py-3 flex items-center gap-3`}>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <SectionIcon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium opacity-75 uppercase tracking-wide">
                    {config.sectionLabel} Tutorial
                  </p>
                  <p className="text-white text-xs opacity-60 mt-0.5">
                    Step {step + 1} of {total}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/25 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Progress bar */}
              <Progress value={progress} className="h-1 rounded-none" />

              {/* Step content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`step-${step}`}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.18 }}
                  className="px-5 py-4"
                >
                  {/* Area badge */}
                  {current.area && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mb-3">
                      <MousePointerClick className="w-3 h-3" />
                      {current.area}
                    </span>
                  )}

                  {/* Step icon + title */}
                  <div className="flex items-start gap-3 mb-2">
                    <div className={`flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center shadow`}>
                      <StepIcon className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug pt-1">
                      {current.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-sm leading-relaxed mb-3">
                    {current.description}
                  </p>

                  {/* Tip */}
                  {current.tip && (
                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                      <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-amber-800 text-xs leading-relaxed">{current.tip}</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="px-5 pb-4 flex items-center justify-between gap-3">
                {/* Step dots */}
                <div className="flex gap-1.5 items-center">
                  {config.steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setStep(i)}
                      aria-label={`Step ${i + 1}`}
                      className={`rounded-full transition-all duration-200 ${
                        i === step
                          ? 'w-5 h-2 bg-sky-500'
                          : i < step
                          ? 'w-2 h-2 bg-teal-400'
                          : 'w-2 h-2 bg-slate-200 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2">
                  {!isFirst && (
                    <Button variant="outline" size="sm" onClick={handlePrev} className="h-8 px-3 gap-1">
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Back
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={handleNext}
                    className={`h-8 px-4 gap-1 bg-gradient-to-r ${config.color} hover:opacity-90 text-white border-0`}
                  >
                    {isLast ? 'Done' : 'Next'}
                    {!isLast && <ChevronRight className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── HOOK: useSectionTutorial ─────────────────────────────────────────────────
// Tracks the currently active section tutorial and auto-shows it on first visit.

export function useSectionTutorial(activeSection: string) {
  const [tutorialSection, setTutorialSection] = useState<string | null>(null)

  // Auto-show disabled for a smoother demo experience. Tutorials remain
  // available on-demand via the "Show section tutorial" button in the header.
  useEffect(() => {
    void activeSection
  }, [activeSection])

  const showTutorial = (sectionId?: string) => {
    setTutorialSection(sectionId ?? activeSection)
  }

  const hideTutorial = () => {
    setTutorialSection(null)
  }

  return {
    tutorialSection,
    showTutorial,
    hideTutorial,
    isVisible: tutorialSection !== null,
  }
}
