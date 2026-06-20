import { NextRequest, NextResponse } from 'next/server'

const ANTHROPIC_API_KEY = process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY

// ─── Rate limiter — 20 req/min per IP ─────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (entry.count >= 20) return false
  entry.count++
  return true
}

// ─── Tool definitions (OpenAI format — used by AgentRouter) ────────────────────

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'navigate_to_page',
      description: 'Navigate the user to a specific page in the AddManuChain dashboard.',
      parameters: {
        type: 'object',
        properties: {
          page: {
            type: 'string',
            enum: [
              'overview', 'orders', 'print_queue', 'blueprints', 'centers',
              'peer_printers', 'shipments', 'materials', 'partners', 'analytics',
              'audit', 'certifications', 'authorities', 'services',
              'digital_inventory', 'physical_inventory', 'ip_library', 'lab_portal', 'settings',
              'emergency', 'oem_portal', 'cooperative', 'material_properties', 'feasibility', 'sc_intelligence',
            ],
            description: 'The page ID to navigate to',
          },
        },
        required: ['page'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_dashboard_stats',
      description: 'Fetch live KPI stats from the dashboard: active orders, delivered, lead time, cost savings, etc.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_orders',
      description: 'List orders from the system, optionally filtered by status or priority.',
      parameters: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            description: 'Filter by order status: pending, printing, qc, shipped, delivered',
          },
          limit: {
            type: 'number',
            description: 'Max number of orders to return (default 5)',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_blueprints',
      description: 'List blueprints from the vault, optionally filtered by status or category.',
      parameters: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            description: 'Filter by status: active, pending_review, inactive, archived',
          },
          limit: {
            type: 'number',
            description: 'Max number to return (default 5)',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_order',
      description: 'Create a new print order in the system on behalf of the user.',
      parameters: {
        type: 'object',
        properties: {
          partName: {
            type: 'string',
            description: 'Name of the part to print',
          },
          priority: {
            type: 'string',
            enum: ['low', 'normal', 'high', 'urgent'],
            description: 'Order priority level',
          },
          quantity: {
            type: 'number',
            description: 'Number of parts to print',
          },
          notes: {
            type: 'string',
            description: 'Additional notes or instructions for the order',
          },
        },
        required: ['partName', 'priority', 'quantity'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_materials',
      description: 'List material inventory levels at print centers, optionally filtered by stock status.',
      parameters: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            description: 'Filter by stock status: adequate, low, critical',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_certifications',
      description: 'List active certifications and their expiry status.',
      parameters: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            description: 'Filter by status: active, pending, expiring_soon, expired',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_risk_scores',
      description: 'Get top at-risk parts from digital inventory with risk scores > 70.',
      parameters: {
        type: 'object',
        properties: {
          threshold: {
            type: 'number',
            description: 'Risk score threshold (default 70). Return parts above this threshold.',
          },
          limit: {
            type: 'number',
            description: 'Max number of parts to return (default 5)',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'predict_stockout',
      description: 'Predict days until stockout for a material at a specific print center.',
      parameters: {
        type: 'object',
        properties: {
          material: {
            type: 'string',
            description: 'Material name (e.g., Ti-6Al-4V, Inconel 625, 316L SS)',
          },
          center_id: {
            type: 'string',
            description: 'Print center ID to check stock at',
          },
        },
        required: ['material', 'center_id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'route_order',
      description: 'Get optimal print center recommendation for a blueprint based on capacity, certification, and proximity.',
      parameters: {
        type: 'object',
        properties: {
          blueprint_id: {
            type: 'string',
            description: 'Blueprint ID to route',
          },
        },
        required: ['blueprint_id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_emergency_options',
      description: 'Get emergency response triage options for a part description (identify part, suggest print center, estimate ETA).',
      parameters: {
        type: 'object',
        properties: {
          part_description: {
            type: 'string',
            description: 'Natural language description of the failed part or needed item',
          },
        },
        required: ['part_description'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_cert_renewals',
      description: 'Get list of certifications expiring soon, prioritized by impact.',
      parameters: {
        type: 'object',
        properties: {
          days_ahead: {
            type: 'number',
            description: 'Days ahead to scan for expiries (default 30)',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_audit_summaries',
      description: 'Get compliance audit summary for a date range and regulatory standard.',
      parameters: {
        type: 'object',
        properties: {
          date_range_days: {
            type: 'number',
            description: 'Number of days to look back (default 90)',
          },
          standard: {
            type: 'string',
            description: 'Regulatory standard (DNV, ABS, Lloyd\'s, ISO9001)',
          },
        },
      },
    },
  },
]

// ─── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the AddManuChain AI Assistant — an agentic, friendly expert embedded inside the AddManuChain digital supply chain dashboard for the offshore oil & gas and heavy industry sector.

You are NOT just a Q&A bot. You can take real actions inside the dashboard using your tools:
- Navigate the user to any page instantly
- Fetch live data (orders, blueprints, materials, certifications, stats)
- Create new orders on behalf of the user

Always prefer taking action over just describing how to do something. For example:
- If the user says "show me the orders page" → call navigate_to_page("orders")
- If the user asks "how many pending orders?" → call list_orders({ status: "pending" }) and report the actual count
- If the user says "create an order for a valve" → call create_order(...)
- If the user asks "what are my stats?" → call get_dashboard_stats()

After taking an action, briefly confirm what you did and offer the next helpful step.

---

## DASHBOARD PAGES

Navigation page IDs:
- overview, orders, print_queue, blueprints, centers, peer_printers, shipments, materials
- partners, analytics, audit, certifications, authorities, services (Customer Success)
- digital_inventory, physical_inventory, ip_library, lab_portal, settings
- emergency, oem_portal, cooperative, material_properties, feasibility, sc_intelligence

## ALL PAGES — DETAILED KNOWLEDGE

### 1. OVERVIEW — Executive KPIs (read-only): Active Orders, Parts Delivered, Avg Lead Time, Cost Savings, DRM funnel, site health, print center status, activity feed.

### 2. ORDERS — Full order lifecycle. Create/edit/delete orders. Status: pending → printing → qc → shipped → delivered. Issue Secure Print tokens after OEM + Cert approval. Role-scoped views.

### 3. PRINT QUEUE (DRM) — Approval pipeline. OEM grants IP license, Cert Authority verifies facility, Print Center issues token. Pipeline: Submitted → OEM Approved → Cert Verified → Token Issued.

### 4. IP LIBRARY — OEM IP vault. License models: Restricted, Open, Pay-Per-Print, Consortium. Manage IP assets, approve license requests, track royalties and usage.

### 5. BLUEPRINT LIBRARY — Certified CAD files (STL/STEP/3MF). Add/view/delete blueprints. Technical drawing viewer with isometric + orthographic views. Status: active/pending_review/inactive/archived.

### 6. OEM PARTNERS — Manage OEM, integrator, distributor, service provider relationships. Track blueprints, prints, royalties per partner.

### 7. DIGITAL INVENTORY — AI risk scoring. Interactive Canada print center map. Risk queue ranks blueprints by urgency. Quick Order for high-risk parts. AI workflow: Predict → Approve → Secure Print → Verify.

### 8. PHYSICAL INVENTORY — Site-based inventory (rigs, vessels, yards, warehouses). Part conditions: New, Serviceable, Used, Condemned. Transfer workflows between sites.

### 9. PRINT CENTERS — Certified AM facility network. Network tab (add/view centers) + Onsite Printing tab (configure onsite/virtual/hybrid engagements).

### 10. PEER PRINTERS — Airbnb-style marketplace for idle certified 3D printer capacity.

### 11. SHIPMENTS — Track deliveries. Status: preparing, in_transit, out_for_delivery, delivered, delayed. Supports offshore helicopter/sea transport.

### 12. MATERIALS — Raw material stock. Status: adequate, low, critical. Per-center distribution. Purchase order creation for critical stock.

### 13. CERTIFICATIONS — Cert validity tracking. Issuer, holder, validity progress bar, days remaining. Renewal workflow. Alert for certs expiring within 30 days.

### 14. AUTHORITIES — Manage DNV GL, Lloyd's, BV, ABS, TÜV SÜD, ClassNK. Certification request approval queue.

### 15. AUDIT LOGS — SHA-256 hash-chain compliance log. Action types: ORDER_CREATED, OEM_APPROVED, CERT_APPROVED, PRINT_TOKEN_ISSUED, PRINT_EXECUTED. Tamper detection via chain integrity verification.

### 16. LAB PORTAL — Dalhousie AM Lab. Test types: Mechanical, Chemical, Thermal, Dimensional, NDT, Fatigue. Equipment reservation. Cert standards: DNV GL, Lloyd's, BV, ClassNK, ABS, ISO 9001.

### 17. ANALYTICS — Monthly trends, lead time comparison (traditional 63 days vs AddManuChain), cost savings, environmental impact (CO₂, miles, waste). Role-scoped. Time range: 30d/3m/6m/1y.

### 18. CUSTOMER SUCCESS — Trained personnel registry. Qualification levels L1–L4. Module-based training, renewal tracking, certificate downloads.

### 19. SETTINGS — Profile, Organization, Notifications, Security (2FA), API keys, Webhooks, Tutorial restart.

### 20. EMERGENCY RESPONSE — Fast-path from breakdown to replacement. Stats: active emergencies, avg response time (2.4 hrs), SLA rate (94%). Submit a breakdown request (part name, site, criticality level, hours available). Instant Response Panel shows: digital file status, nearest certified facility with distance and lead time, DRM fast-track status. Active Emergency Tracker shows in-progress emergencies with status timeline stepper. Typical resolution: 4–11 hrs vs 60+ days traditional.

### 21. OEM SELF-SERVICE PORTAL — OEMs upload blueprints, set licensing terms, and earn passive royalty revenue. Revenue dashboard shows total earned ($284K), pending disbursement ($47K), projected this month ($31K). IP Asset Registry with 8 assets, royalty %, print count, earnings per asset. License Terms Builder: choose model (Pay-Per-Print, Restricted, Open, Consortium, Isolated) + set royalty % via slider. Royalty distribution settings: schedule and payment method.

### 22. DIGITAL COOPERATIVE — Shared certified blueprint pool across member operators. Pool stats: 847 digital assets, 12 members, 234 draws/month, 98.2% replenishment rate. Three tabs: Available in Pool (10 parts with contributor, cert level, draw fee, availability), My Contributions (18 assets, $12.4K earned), Draw History (8 entries). Member directory with Gold/Silver/Bronze tiers. Join Cooperative CTA with pricing: Bronze $4,800/yr, Silver $9,600/yr, Gold $18,000/yr.

### 23. MATERIAL PROPERTIES LIBRARY — The MMPDS equivalent for additive manufacturing. 12 validated alloys (Ti-6Al-4V LPBF, Inconel 625, 316L SS, Inconel 718 DED, H13 Tool Steel, Hastelloy C-276, 17-4PH SS, Duplex 2205, AlSi10Mg, CuCrZr, SS304, GRCop-84). Properties: yield/tensile strength (MPa), elongation (%), fatigue, hardness, density. 339 total test coupons. Validated by DNV GL, Lloyd's Register, Bureau Veritas, TÜV SÜD, ABS, ClassNK. Compare Mode: select up to 4 alloys for radar chart comparison. Data Gap Map: 5 alloys needing contribution.

### 24. AM FEASIBILITY TRIAGE — 30-second AI verdict on whether a part is suitable for additive manufacturing. Input: part name, geometry type, material, quantity, urgency (Emergency/Planned/Exploratory), industry, part function. AI Verdict panel shows: suitability score 0–100 with colour band, plain-English verdict, 4 sub-scores (Geometry Suitability, Material Printability, Regulatory Burden, Volume Economics), cost comparison (AM $4,200 vs Traditional $18,400, 63-day lead time), nearest qualified facility, regulatory path (DNV GL, 6–8 weeks, ~$12,000). Saved Assessments table shows history with scores and outcomes.

### 25. SUPPLY CHAIN INTELLIGENCE — Three-section intelligence dashboard: (1) Sovereignty Dashboard: pie chart showing 42% domestic AM / 31% domestic traditional / 27% foreign supply. Geopolitical risk table by supplier country (China 87/100, India 61/100, South Korea 44/100). "What If" disruption selector — choose a country and see affected parts count and AM coverage. Alert threshold slider. (2) LEAN Conversion Analysis: $4.2M carrying cost, 34 parts safe to convert to digital (saving $1.1M). Per-part confidence scores and Accept buttons — running freed capital counter updates live. (3) Pareto Working Capital Optimiser: bar chart of top 10 parts by inventory value vs AM conversion potential. Accept individual parts to free capital — top 5 conversion frees ~$743K.

---

## USER ROLES

| Role | Key Pages |
|------|-----------|
| Admin | All 25 pages |
| OEM Partner | IP Library, OEM Portal, Blueprints, Print Queue, Partners, Certifications, Analytics, Material Properties, AM Feasibility, Settings |
| End User | Overview, Orders, Emergency Response, Peer Printers, Shipments, Physical Inventory, Digital Cooperative, Customer Success, Material Properties, AM Feasibility, Settings |
| Cert Authority | Overview, Print Queue, Blueprints, Certifications, Authorities, Audit Logs, Analytics, Settings |
| Lab | Overview, Lab Portal, Blueprints, Materials, Digital/Physical Inventory, Certifications, Material Properties, AM Feasibility, Analytics, Settings |
| Print Center | Overview, Orders, Print Queue, Blueprints, Materials, Digital/Physical Inventory, Emergency Response, Digital Cooperative, Shipments, Settings |

Demo credentials: admin@almatech.com / admin123 | operator@statoil.com / operator123 | partner@oem.com / partner123

---

## KEY CONCEPTS

- **DRM Token**: One-time encrypted Secure Print token, auto-expires 30s after display. Required to start printing.
- **Blueprint**: OEM-owned certified CAD file. Cert type must match print center cert for DRM approval.
- **Hash Chain**: SHA-256 linked audit log. Tampered entries break the chain (shown as red integrity banner).
- **Risk Score**: 0–100 AI score per blueprint. Factors: print history, material availability, cert restrictions, criticality.
- **Peer Printers**: Certified operators list idle printer time — like Airbnb for industrial 3D printers.

Tone: Professional but friendly. Concise. Use bullet points for steps. Never invent features that don't exist. Always prefer taking action over just explaining.`

const ROLE_CONTEXT: Record<string, string> = {
  admin: 'Current user: Platform Admin (Mahmoud K. — AddManuChain). Full access to all 25 pages including Emergency Response, OEM Portal, Digital Cooperative, Material Properties Library, AM Feasibility Triage, and Supply Chain Intelligence.',
  oem_partner: 'Current user: OEM Partner (Johann Weber — Wärtsilä Marine). Focus: IP Library, Blueprint Library, Print Queue, Analytics.',
  end_user: 'Current user: End User / Client (Capt. Sarah Leblanc — Horizon Maritime). Focus: Orders, Shipments, Physical Inventory.',
  cert_authority: 'Current user: Cert Authority rep (Dr. Priya Patel — DNV GL). Focus: Print Queue, Certifications, Authorities, Audit Logs.',
  print_center: 'Current user: Print Facility operator (Michael Okafor — PolyUnity NL). Focus: Print Queue, Materials, Orders, Shipments.',
  lab: 'Current user: Lab professional (Prof. Ahmad Osman — Dalhousie AM Lab). Focus: Lab Portal, Materials, Blueprints, Certifications.',
}

// ─── Tool executor ────────────────────────────────────────────────────────────

async function executeTool(
  name: string,
  args: Record<string, unknown>,
  baseUrl: string,
): Promise<{ result: string; frontendAction?: Record<string, unknown> }> {

  switch (name) {

    case 'navigate_to_page': {
      const page = args.page as string
      const labels: Record<string, string> = {
        overview: 'Dashboard Overview', orders: 'Orders', print_queue: 'Print Queue',
        blueprints: 'Blueprint Library', centers: 'Print Centers', peer_printers: 'Peer Printers',
        shipments: 'Shipments', materials: 'Materials', partners: 'OEM Partners',
        analytics: 'Analytics', audit: 'Audit Logs', certifications: 'Certifications',
        authorities: 'Certification Authorities', services: 'Customer Success',
        digital_inventory: 'Digital Inventory', physical_inventory: 'Physical Inventory',
        ip_library: 'IP Library', lab_portal: 'Lab & Testing Portal', settings: 'Settings',
        emergency: 'Emergency Response', oem_portal: 'OEM Self-Service Portal',
        cooperative: 'Digital Cooperative', material_properties: 'Material Properties Library',
        feasibility: 'AM Feasibility Triage', sc_intelligence: 'Supply Chain Intelligence',
      }
      return {
        result: `Navigated to ${labels[page] ?? page}`,
        frontendAction: { type: 'navigate', page, label: labels[page] ?? page },
      }
    }

    case 'get_dashboard_stats': {
      try {
        const res = await fetch(`${baseUrl}/api/stats`)
        const data = await res.json()
        return { result: JSON.stringify(data) }
      } catch {
        return { result: 'Could not fetch stats at this time.' }
      }
    }

    case 'list_orders': {
      try {
        const params = new URLSearchParams()
        if (args.status) params.set('status', args.status as string)
        const res = await fetch(`${baseUrl}/api/orders?${params}`)
        const data = await res.json()
        const orders = (Array.isArray(data) ? data : data.orders ?? [])
          .slice(0, (args.limit as number) ?? 5)
        if (orders.length === 0) return { result: 'No orders found matching the criteria.' }
        const summary = orders.map((o: Record<string, unknown>) =>
          `#${o.id ?? o.orderId} — ${o.partName ?? o.name} | Status: ${o.status} | Priority: ${o.priority} | Qty: ${o.quantity}`
        ).join('\n')
        return { result: `Found ${orders.length} order(s):\n${summary}` }
      } catch {
        return { result: 'Could not fetch orders at this time.' }
      }
    }

    case 'list_blueprints': {
      try {
        const params = new URLSearchParams()
        if (args.status) params.set('status', args.status as string)
        const res = await fetch(`${baseUrl}/api/blueprints?${params}`)
        const data = await res.json()
        const blueprints = (Array.isArray(data) ? data : data.blueprints ?? [])
          .slice(0, (args.limit as number) ?? 5)
        if (blueprints.length === 0) return { result: 'No blueprints found matching the criteria.' }
        const summary = blueprints.map((b: Record<string, unknown>) =>
          `${b.name} | Category: ${b.category} | Material: ${b.material} | Status: ${b.status} | Prints: ${b.printCount ?? 0}`
        ).join('\n')
        return { result: `Found ${blueprints.length} blueprint(s):\n${summary}` }
      } catch {
        return { result: 'Could not fetch blueprints at this time.' }
      }
    }

    case 'create_order': {
      try {
        const body = {
          partName: args.partName,
          priority: args.priority ?? 'normal',
          quantity: args.quantity ?? 1,
          notes: args.notes ?? '',
          status: 'pending',
        }
        const res = await fetch(`${baseUrl}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        const data = await res.json()
        const id = data.id ?? data.orderId ?? 'NEW'
        return {
          result: `Order created successfully. ID: ${id}, Part: ${args.partName}, Priority: ${args.priority}, Qty: ${args.quantity}`,
          frontendAction: {
            type: 'created',
            entity: 'order',
            label: `Order created: ${args.partName} (${args.priority} priority)`,
            id,
          },
        }
      } catch {
        return { result: 'Could not create order at this time.' }
      }
    }

    case 'list_materials': {
      try {
        const res = await fetch(`${baseUrl}/api/materials`)
        const data = await res.json()
        let materials = Array.isArray(data) ? data : data.materials ?? []
        if (args.status) materials = materials.filter((m: Record<string, unknown>) => m.status === args.status)
        materials = materials.slice(0, 6)
        if (materials.length === 0) return { result: 'No materials found matching the criteria.' }
        const summary = materials.map((m: Record<string, unknown>) =>
          `${m.name} | Category: ${m.category} | Stock: ${m.stockLevel ?? m.currentStock} | Status: ${m.status}`
        ).join('\n')
        return { result: `Found ${materials.length} material(s):\n${summary}` }
      } catch {
        return { result: 'Could not fetch materials at this time.' }
      }
    }

    case 'list_certifications': {
      try {
        const res = await fetch(`${baseUrl}/api/certifications`)
        const data = await res.json()
        let certs = Array.isArray(data) ? data : data.certifications ?? []
        if (args.status) certs = certs.filter((c: Record<string, unknown>) => c.status === args.status)
        certs = certs.slice(0, 6)
        if (certs.length === 0) return { result: 'No certifications found matching the criteria.' }
        const summary = certs.map((c: Record<string, unknown>) =>
          `${c.name} | Issuer: ${c.issuer} | Status: ${c.status} | Expires: ${c.expiryDate ?? 'N/A'}`
        ).join('\n')
        return { result: `Found ${certs.length} certification(s):\n${summary}` }
      } catch {
        return { result: 'Could not fetch certifications at this time.' }
      }
    }

    case 'get_risk_scores': {
      try {
        const threshold = (args.threshold as number) ?? 70
        const limit = (args.limit as number) ?? 5
        const res = await fetch(`${baseUrl}/api/digital_inventory?risk_min=${threshold}`)
        const data = await res.json()
        let parts = Array.isArray(data) ? data : data.parts ?? []
        parts = parts.filter((p: Record<string, unknown>) => (p.riskScore as number) > threshold).slice(0, limit)
        if (parts.length === 0) return { result: `No parts found with risk score above ${threshold}.` }
        const summary = parts.map((p: Record<string, unknown>) =>
          `${p.partName} (ID: ${p.id}) | Risk: ${p.riskScore}/100 | Lead Time: ${p.leadTimeDays}d | Stock: ${p.currentStock}/${p.minStock}`
        ).join('\n')
        return { result: `Top at-risk parts (threshold ${threshold}):\n${summary}` }
      } catch {
        return { result: 'Could not fetch risk scores at this time.' }
      }
    }

    case 'predict_stockout': {
      try {
        const material = args.material as string
        const centerId = args.center_id as string
        const res = await fetch(`${baseUrl}/api/materials?name=${encodeURIComponent(material)}&center=${centerId}`)
        const data = await res.json()
        const mat = Array.isArray(data) ? data[0] : data.material
        if (!mat) return { result: `Material "${material}" not found at center ${centerId}.` }
        const daysRemaining = mat.daysUntilStockout ?? Math.ceil((mat.currentStock ?? 0) / (mat.consumptionRate ?? 1))
        return { result: `Material "${material}" at center ${centerId}: ${daysRemaining} days until stockout. Current stock: ${mat.currentStock}/${mat.safetyStock}.` }
      } catch {
        return { result: `Could not predict stockout for ${args.material}.` }
      }
    }

    case 'route_order': {
      try {
        const blueprintId = args.blueprint_id as string
        const res = await fetch(`${baseUrl}/api/blueprints/${blueprintId}?recommend_center=true`)
        const data = await res.json()
        if (!data) return { result: `Blueprint ${blueprintId} not found.` }
        const recommended = data.recommendedCenter ?? data.optimalCenter ?? {}
        return { result: `Recommended print center for "${data.name}": ${recommended.name} (ID: ${recommended.id}) | Capacity: ${recommended.capacityPercent}% | Distance: ${recommended.distanceKm}km | ETA: ${recommended.estimatedDays}d` }
      } catch {
        return { result: `Could not route order for blueprint ${args.blueprint_id}.` }
      }
    }

    case 'get_emergency_options': {
      try {
        const description = args.part_description as string
        const res = await fetch(`${baseUrl}/api/emergency/triage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description }),
        })
        const data = await res.json()
        if (!data || data.error) return { result: 'Could not analyze emergency request.' }
        return { result: `Emergency Triage:\nPart Identified: ${data.partName}\nNearest Center: ${data.nearestCenter} (${data.estimatedETA}h ETA)\nCertification: ${data.certification}\n\n📋 RECOMMENDED ACTION: ${data.recommendation}` }
      } catch {
        return { result: 'Could not process emergency triage.' }
      }
    }

    case 'get_cert_renewals': {
      try {
        const daysAhead = (args.days_ahead as number) ?? 30
        const res = await fetch(`${baseUrl}/api/certifications?expiring_in_days=${daysAhead}`)
        const data = await res.json()
        let certs = Array.isArray(data) ? data : data.certifications ?? []
        certs = certs.filter((c: Record<string, unknown>) => c.status === 'active' || c.status === 'expiring_soon')
        if (certs.length === 0) return { result: `No certifications expiring within ${daysAhead} days.` }
        const summary = certs.map((c: Record<string, unknown>) =>
          `${c.name} (${c.issuer}) | Expires: ${c.expiryDate} | Parts Dependent: ${c.partsCount ?? 0}`
        ).join('\n')
        return { result: `Certifications expiring within ${daysAhead} days:\n${summary}` }
      } catch {
        return { result: 'Could not fetch cert renewals.' }
      }
    }

    case 'list_audit_summaries': {
      try {
        const daysBack = (args.date_range_days as number) ?? 90
        const standard = args.standard as string ?? 'DNV'
        const res = await fetch(`${baseUrl}/api/audit?days=${daysBack}&standard=${standard}`)
        const data = await res.json()
        if (!data || data.error) return { result: 'Could not generate audit summary.' }
        return { result: `Audit Summary (${standard}, last ${daysBack}d):\n${data.summary ?? 'No summary available'}` }
      } catch {
        return { result: 'Could not fetch audit summaries.' }
      }
    }

    default:
      return { result: `Unknown tool: ${name}` }
  }
}


// ─── Intent detection ─────────────────────────────────────────────────────────
// Maps natural-language user messages to proactive tool calls + navigation.
// The z-ai-web-dev-sdk does not support OpenAI-style function calling, so we
// detect intent via keywords and fetch the relevant data up-front, then let the
// LLM compose a natural-language answer grounded in that live data.

const PAGE_KEYWORDS: Record<string, string[]> = {
  overview: ['overview', 'dashboard', 'home', 'summary', 'kpi', 'kpis'],
  orders: ['order', 'orders', 'track order', 'my orders'],
  print_queue: ['print queue', 'drm', 'approval', 'approve', 'token'],
  blueprints: ['blueprint', 'blueprints', 'cad', 'part library', 'design file'],
  centers: ['print center', 'print centers', 'facility', 'facilities', 'am center'],
  peer_printers: ['peer printer', 'peer printers', 'marketplace', 'rent printer'],
  shipments: ['shipment', 'shipments', 'delivery', 'deliveries', 'tracking', 'logistics'],
  materials: ['material', 'materials', 'raw material', 'stock', 'inventory'],
  partners: ['partner', 'partners', 'oem partner', 'vendor'],
  analytics: ['analytics', 'trend', 'trends', 'insight', 'insights', 'report'],
  audit: ['audit', 'audit log', 'compliance log', 'hash chain'],
  certifications: ['certification', 'certifications', 'cert', 'certs', 'certificate'],
  authorities: ['authority', 'authorities', 'dnv', "lloyd's", 'lloyds', 'abs', 'classnk', 'bv'],
  services: ['customer success', 'training', 'onboarding', 'service'],
  digital_inventory: ['digital inventory', 'risk score', 'risk scoring', 'forecast'],
  physical_inventory: ['physical inventory', 'spare part', 'spares', 'site inventory'],
  ip_library: ['ip library', 'intellectual property', 'ip vault', 'royalty'],
  lab_portal: ['lab', 'testing', 'test coupon', 'mechanical test'],
  settings: ['setting', 'settings', 'profile', 'account', 'preference'],
  emergency: ['emergency', 'breakdown', 'failed part', 'critical failure', 'fast track'],
  oem_portal: ['oem portal', 'self service', 'self-service', 'upload blueprint'],
  cooperative: ['cooperative', 'digital cooperative', 'shared pool'],
  material_properties: ['material properties', 'mmpds', 'alloy data', 'mechanical properties'],
  feasibility: ['feasibility', 'am feasibility', 'triage', 'suitable for am', 'can it be printed'],
  sc_intelligence: ['supply chain intelligence', 'sovereignty', 'lean analysis', 'pareto', 'working capital'],
}

function detectNavigation(message: string): { page: string; label: string } | null {
  const lower = message.toLowerCase()
  // explicit "go to" / "show me" / "open" / "navigate" phrasing
  const hasNavVerb = /\b(go to|goto|open|show me|take me to|navigate to|view|see)\b/.test(lower)
  let bestPage: string | null = null
  let bestScore = 0
  for (const [page, keywords] of Object.entries(PAGE_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        // longer keyword matches are more specific
        const score = kw.length
        if (score > bestScore) {
          bestScore = score
          bestPage = page
        }
      }
    }
  }
  if (!bestPage) return null
  // If there's no nav verb, only navigate on very specific single-word page mentions
  // like "show orders" / "go to analytics". For ambiguous data questions like
  // "how many orders" we still want to navigate if the user clearly wants the page.
  const labels: Record<string, string> = {
    overview: 'Dashboard Overview', orders: 'Orders', print_queue: 'Print Queue',
    blueprints: 'Blueprint Library', centers: 'Print Centers', peer_printers: 'Peer Printers',
    shipments: 'Shipments', materials: 'Materials', partners: 'OEM Partners',
    analytics: 'Analytics', audit: 'Audit Logs', certifications: 'Certifications',
    authorities: 'Certification Authorities', services: 'Customer Success',
    digital_inventory: 'Digital Inventory', physical_inventory: 'Physical Inventory',
    ip_library: 'IP Library', lab_portal: 'Lab & Testing Portal', settings: 'Settings',
    emergency: 'Emergency Response', oem_portal: 'OEM Self-Service Portal',
    cooperative: 'Digital Cooperative', material_properties: 'Material Properties Library',
    feasibility: 'AM Feasibility Triage', sc_intelligence: 'Supply Chain Intelligence',
  }
  void hasNavVerb
  return { page: bestPage, label: labels[bestPage] ?? bestPage }
}

function detectDataFetches(message: string): string[] {
  const lower = message.toLowerCase()
  const tools: string[] = []
  if (/\b(how many|status of|list of|show|current|latest|stats?|kpi|overview|summary)\b/.test(lower) || /\border/.test(lower)) {
    if (/\border/.test(lower)) tools.push('list_orders')
  }
  if (/\bblueprint/.test(lower)) tools.push('list_blueprints')
  if (/\bmaterial/.test(lower) && /\b(stock|level|status|inventory|low|critical)\b/.test(lower)) tools.push('list_materials')
  if (/\b(certification|cert|certificate)/.test(lower)) tools.push('list_certifications')
  if (/\b(stat|kpi|overview|dashboard|metric)/.test(lower)) tools.push('get_dashboard_stats')
  return [...new Set(tools)]
}

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please wait before trying again.' }, { status: 429 })
    }

    const { messages, role } = await req.json()
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const baseUrl = new URL(req.url).origin
    const roleCtx = ROLE_CONTEXT[role ?? 'admin'] ?? ROLE_CONTEXT.admin

    // Find the latest user message for intent detection
    const lastUser = [...messages].reverse().find((m: { role: string }) => m.role === 'user')
    const userText: string = lastUser?.content ?? ''

    // Detect navigation + data-fetch intents
    const navIntent = detectNavigation(userText)
    const dataTools = detectDataFetches(userText)

    // Execute data-fetch tools to ground the LLM in live data
    const contextBlocks: string[] = []
    for (const toolName of dataTools) {
      const { result } = await executeTool(toolName, {}, baseUrl)
      contextBlocks.push(`[LIVE DATA — ${toolName}]\n${result}`)
    }

    const liveContext = contextBlocks.length
      ? `\n\n--- LIVE DASHBOARD DATA (use this when answering) ---\n${contextBlocks.join('\n\n')}\n--- END LIVE DATA ---\n`
      : ''

    const fullSystemPrompt = `${SYSTEM_PROMPT}\n\n${roleCtx}${liveContext}\n\nIf the user asked to go to or view a specific page, you are navigating them there now${navIntent ? ` (→ ${navIntent.label})` : ''}. Mention it briefly in your reply.`

    // Build conversation for the SDK. The SDK uses role 'assistant' for the
    // system prompt and 'user'/'assistant' for the turns.
    const sdkMessages: { role: string; content: string }[] = [
      { role: 'assistant', content: fullSystemPrompt },
      ...messages.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
      })),
    ]

    // Call the LLM via z-ai-web-dev-sdk
    let reply = ''
    try {
      // Dynamically import so the SDK (backend-only) is never pulled into client bundles
      const ZAIModule = await import('z-ai-web-dev-sdk')
      const ZAI = (ZAIModule as { default: { create: () => Promise<unknown> } }).default
      const zai = await ZAI.create()

      // Race the LLM call against a 25s timeout so the route ALWAYS responds,
      // even if the upstream model hangs. Without this, a slow/hung LLM call
      // would let the HTTP request hang until the client times out (HTTP 000).
      const LLM_TIMEOUT_MS = 25_000
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('LLM_TIMEOUT')), LLM_TIMEOUT_MS),
      )
      const completion = await Promise.race([
        (zai as {
          chat: {
            completions: {
              create: (opts: { messages: { role: string; content: string }[]; thinking: { type: string } }) =>
                Promise<{ choices: { message: { content?: string } }[] }>
            }
          }
        }).chat.completions.create({
          messages: sdkMessages,
          thinking: { type: 'disabled' },
        }),
        timeoutPromise,
      ])
      reply = completion.choices?.[0]?.message?.content ?? ''
    } catch (err) {
      console.error('AI SDK error:', err)
      // Graceful fallback so the assistant still responds if the LLM is unavailable
      reply = navIntent
        ? `I've navigated you to ${navIntent.label}. ${dataTools.length ? 'I also pulled the latest data for you.' : "Let me know what you'd like to do next."}`
        : "I'm here to help with your AddManuChain dashboard. I can navigate you to any page, pull live order/blueprint/material data, or create new orders. What would you like to do?"
    }

    if (!reply || !reply.trim()) {
      reply = "I'm here to help with your AddManuChain dashboard. What would you like to do?"
    }

    const frontendAction = navIntent
      ? { type: 'navigate', page: navIntent.page, label: navIntent.label }
      : undefined

    return NextResponse.json({ reply, frontendAction })

  } catch (err) {
    console.error('AI chat error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
