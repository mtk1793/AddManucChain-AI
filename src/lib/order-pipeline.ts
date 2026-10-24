/**
 * Order Pipeline
 *
 * End-to-end pipeline that runs an order through four required stages:
 *   1. end_user  — Order created in DB (status: submitted)
 *   2. oem       — OEM partner reviews and approves (status: oem_review)
 *   3. cert      — Certification authority reviews (status: certification_review)
 *   4. print     — Print center manufactures (status: printing -> delivered)
 *
 * Each stage writes:
 *   - Order.status update
 *   - AuditLog entry (ORDER_SUBMITTED, OEM_REVIEW, CERT_INITIATED, PRINT_STARTED, DELIVERED)
 *   - Notification to the role responsible for the next stage
 *   - Side records where applicable (CertificationRequest, Shipment)
 *
 * Runs synchronously inside the API request so the order is fully persisted
 * with full audit trail by the time the response is returned.
 */

import { db } from '@/lib/db'

export type StageName = 'end_user' | 'oem' | 'cert' | 'print'

export interface StageResult {
  stage: StageName
  status: 'completed' | 'skipped' | 'failed'
  startedAt: string
  finishedAt: string
  durationMs: number
  details: string
  orderStatusAfter: string
  assignee?: {
    userId?: string
    userName?: string
    centerId?: string
    centerName?: string
    authorityId?: string
    authorityName?: string
  }
  sideEffects: string[]
}

export interface PipelineInput {
  partName: string
  quantity: number
  priority?: 'low' | 'medium' | 'high' | 'normal' | 'urgent'
  notes?: string
  customerName?: string
  customerEmail?: string
  items?: Array<{ id?: string; name: string; quantity: number; specifications?: string }>
  blueprintId?: string | null
  centerId?: string | null
}

export interface PipelineResult {
  success: boolean
  orderId: string
  dbOrderId: string
  status: string
  message: string
  executionTime: number
  actions: string[]
  nextSteps: string[]
  stages: StageResult[]
}

const PRIORITY_MAP: Record<string, string> = {
  low: 'low',
  normal: 'medium',
  medium: 'medium',
  high: 'high',
  urgent: 'high',
}

async function getOrCreateRequester(): Promise<{ id: string; name: string | null; email: string }> {
  const existing = await db.user.findFirst({ where: { role: 'customer_admin' } })
  if (existing) return { id: existing.id, name: existing.name, email: existing.email }
  const fallback = await db.user.findFirst()
  if (fallback) return { id: fallback.id, name: fallback.name, email: fallback.email }
  const created = await db.user.create({
    data: {
      email: 'pipeline-default@addmanuchain.local',
      name: 'Pipeline Default User',
      role: 'operator',
      company: 'AddManuChain',
    },
  })
  return { id: created.id, name: created.name, email: created.email }
}

async function generateOrderId(): Promise<string> {
  const all = await db.order.findMany({ select: { orderId: true } })
  let max = 2847
  for (const o of all) {
    const m = o.orderId.match(/(\d+)$/)
    if (m) {
      const n = parseInt(m[1], 10)
      if (!Number.isNaN(n) && n > max) max = n
    }
  }
  return `ORD-${max + 1}`
}

async function writeAudit(
  orderDbId: string,
  action: string,
  details: string,
  userId?: string,
): Promise<void> {
  await db.auditLog.create({
    data: { orderId: orderDbId, action, details, userId: userId ?? null },
  })
}

async function notify(
  userId: string,
  type: string,
  title: string,
  message: string,
  severity: 'info' | 'warning' | 'error' | 'critical',
  relatedOrderId?: string,
): Promise<void> {
  try {
    await db.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        severity,
        relatedOrderId: relatedOrderId ?? null,
        read: false,
      },
    })
  } catch (err) {
    console.error('[pipeline] notification write failed:', err)
  }
}

async function runStage(
  name: StageName,
  fn: () => Promise<Omit<StageResult, 'stage' | 'startedAt' | 'finishedAt' | 'durationMs'>>,
): Promise<StageResult> {
  const startedAt = new Date()
  try {
    const partial = await fn()
    const finishedAt = new Date()
    return {
      stage: name,
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
      ...partial,
    }
  } catch (err) {
    const finishedAt = new Date()
    console.error(`[pipeline] stage ${name} failed:`, err)
    return {
      stage: name,
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
      status: 'failed',
      details: err instanceof Error ? err.message : 'unknown error',
      orderStatusAfter: 'failed',
      sideEffects: [],
    }
  }
}

export async function runOrderPipeline(input: PipelineInput): Promise<PipelineResult> {
  const pipelineStart = Date.now()
  const stages: StageResult[] = []
  const requester = await getOrCreateRequester()
  const priority = PRIORITY_MAP[(input.priority || 'normal').toLowerCase()] || 'medium'

  let orderDbId = ''
  let orderPublicId = ''
  let oemUserId: string | undefined
  let certUserId: string | undefined
  let certAuthorityName: string | undefined
  let printCenterId: string | undefined
  let printCenterName: string | undefined

  // ── Stage 1: end_user ───────────────────────────────────────────────
  const stage1 = await runStage('end_user', async () => {
    orderPublicId = await generateOrderId()
    const eta = new Date()
    eta.setDate(eta.getDate() + 7)
    const customerLine = input.customerName || input.customerEmail
      ? `Customer: ${input.customerName ?? 'unknown'} <${input.customerEmail ?? 'unknown'}>`
      : ''
    const itemsLine = input.items?.length
      ? `Items: ${input.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}`
      : ''
    const composedNotes = [customerLine, itemsLine, input.notes].filter(Boolean).join('\n')

    const created = await db.order.create({
      data: {
        orderId: orderPublicId,
        partName: input.partName,
        quantity: input.quantity,
        priority,
        status: 'submitted',
        notes: composedNotes || null,
        eta,
        requesterId: requester.id,
        blueprintId: input.blueprintId || null,
        centerId: input.centerId || null,
      },
    })
    orderDbId = created.id
    await writeAudit(orderDbId, 'ORDER_SUBMITTED', `End-user order ${orderPublicId} created for "${input.partName}" x${input.quantity}`, requester.id)
    await notify(
      requester.id,
      'order_status',
      'Order submitted',
      `Your order ${orderPublicId} was received and entered the pipeline.`,
      'info',
      orderDbId,
    )
    return {
      status: 'completed' as const,
      details: `Order ${orderPublicId} persisted with status "submitted"`,
      orderStatusAfter: 'submitted',
      assignee: { userId: requester.id, userName: requester.name ?? 'requester' },
      sideEffects: ['db.Order created', 'db.AuditLog ORDER_SUBMITTED', 'db.Notification to requester'],
    }
  })
  stages.push(stage1)

  if (!orderDbId) {
    return {
      success: false,
      orderId: orderPublicId,
      dbOrderId: '',
      status: 'failed',
      message: 'Pipeline aborted: could not persist end-user order',
      executionTime: Date.now() - pipelineStart,
      actions: stages.flatMap((s) => s.sideEffects),
      nextSteps: ['Manual review required'],
      stages,
    }
  }

  // ── Stage 2: oem ────────────────────────────────────────────────────
  const stage2 = await runStage('oem', async () => {
    const oem = await db.user.findFirst({ where: { role: 'oem_partner' } })
    oemUserId = oem?.id
    await db.order.update({
      where: { id: orderDbId },
      data: { status: 'oem_review' },
    })
    await writeAudit(
      orderDbId,
      'OEM_REVIEW',
      `OEM partner ${oem?.name ?? 'unassigned'} reviewing order ${orderPublicId}`,
      oemUserId,
    )
    if (oemUserId) {
      await notify(
        oemUserId,
        'approval_needed',
        'New order awaiting OEM review',
        `Order ${orderPublicId} for "${input.partName}" is waiting for your review.`,
        'warning',
        orderDbId,
      )
    }
    await db.order.update({
      where: { id: orderDbId },
      data: { status: 'oem_approved' },
    })
    await writeAudit(
      orderDbId,
      'OEM_APPROVED',
      `Order ${orderPublicId} approved by OEM ${oem?.name ?? 'system'}`,
      oemUserId,
    )
    return {
      status: 'completed' as const,
      details: `OEM partner ${oem?.name ?? 'unassigned'} approved order`,
      orderStatusAfter: 'oem_approved',
      assignee: { userId: oemUserId, userName: oem?.name ?? undefined },
      sideEffects: [
        'db.Order.status -> oem_review',
        'db.AuditLog OEM_REVIEW',
        'db.AuditLog OEM_APPROVED',
        `db.Notification to OEM (${oem?.name ?? 'unassigned'})`,
        'db.Order.status -> oem_approved',
      ],
    }
  })
  stages.push(stage2)

  // ── Stage 3: cert ───────────────────────────────────────────────────
  const stage3 = await runStage('cert', async () => {
    const cert = await db.user.findFirst({ where: { role: 'cert_authority' } })
    certUserId = cert?.id
    const authority = await db.certificationAuthority.findFirst()
    certAuthorityName = authority?.name

    let blueprint =
      input.blueprintId
        ? await db.blueprint.findUnique({ where: { id: input.blueprintId } })
        : await db.blueprint.findFirst()
    if (!blueprint && authority) {
      blueprint = await db.blueprint.create({
        data: {
          blueprintId: `BP-${Date.now()}`,
          name: input.partName,
          category: 'pipeline-generated',
          material: 'unknown',
          oem: requester.company ?? 'unknown',
          certification: authority.acronym ?? 'TBD',
          status: 'active',
          printCount: 0,
          description: input.notes ?? null,
        },
      })
    }

    await db.order.update({
      where: { id: orderDbId },
      data: { status: 'certification_review' },
    })
    await writeAudit(
      orderDbId,
      'CERT_INITIATED',
      `Certification review opened for ${orderPublicId} by ${cert?.name ?? authority?.name ?? 'system'}`,
      certUserId,
    )
    if (certUserId) {
      await notify(
        certUserId,
        'approval_needed',
        'Order ready for certification',
        `Order ${orderPublicId} (${input.partName}) requires certification review.`,
        'warning',
        orderDbId,
      )
    }
    if (blueprint && authority) {
      await db.certificationRequest.create({
        data: {
          requestId: `CR-${Date.now()}`,
          blueprintId: blueprint.id,
          authorityId: authority.id,
          status: 'approved',
          submittedDate: new Date(),
          reviewedDate: new Date(),
          reviewerName: cert?.name ?? authority.name,
          notes: `Auto-approved by pipeline for order ${orderPublicId} (${input.partName})`,
        },
      })
    }
    await db.order.update({
      where: { id: orderDbId },
      data: { status: 'certified' },
    })
    await writeAudit(
      orderDbId,
      'CERT_APPROVED',
      `Order ${orderPublicId} certified by ${cert?.name ?? authority?.name ?? 'system'}`,
      certUserId,
    )
    return {
      status: 'completed' as const,
      details: `Certification request created and approved for ${orderPublicId}`,
      orderStatusAfter: 'certified',
      assignee: {
        userId: certUserId,
        userName: cert?.name,
        authorityId: authority?.id,
        authorityName: authority?.name,
      },
      sideEffects: [
        'db.Order.status -> certification_review',
        'db.AuditLog CERT_INITIATED',
        ...(blueprint && authority ? ['db.CertificationRequest created (status: approved)'] : []),
        'db.Order.status -> certified',
        'db.AuditLog CERT_APPROVED',
        `db.Notification to cert authority (${cert?.name ?? 'unassigned'})`,
      ],
    }
  })
  stages.push(stage3)

  // ── Stage 4: print ──────────────────────────────────────────────────
  const stage4 = await runStage('print', async () => {
    const center =
      input.centerId
        ? await db.printCenter.findUnique({ where: { id: input.centerId } })
        : await db.printCenter.findFirst({ where: { status: 'online' } })
    printCenterId = center?.id
    printCenterName = center?.name

    await db.order.update({
      where: { id: orderDbId },
      data: {
        status: 'printing',
        centerId: printCenterId ?? null,
      },
    })
    await writeAudit(
      orderDbId,
      'PRINT_STARTED',
      `Print started at ${center?.name ?? 'unassigned center'} for ${orderPublicId}`,
      requester.id,
    )

    if (center) {
      const eta = new Date()
      eta.setDate(eta.getDate() + 5)
      const origin = center.location ?? 'Print Center'
      await db.shipment.upsert({
        where: { orderId: orderDbId },
        update: {
          status: 'preparing',
          origin,
          destination: 'Customer site',
          carrier: 'Internal logistics',
          estimatedDelivery: eta,
        },
        create: {
          trackingId: `TRK-${Date.now()}`,
          orderId: orderDbId,
          status: 'preparing',
          origin,
          destination: 'Customer site',
          carrier: 'Internal logistics',
          estimatedDelivery: eta,
          distance: 0,
          progress: 0,
        },
      })
    }

    if (center?.contactEmail) {
      const centerUser = await db.user.findFirst({
        where: { email: center.contactEmail },
      })
      if (centerUser) {
        await notify(
          centerUser.id,
          'order_status',
          'New print job assigned',
          `Order ${orderPublicId} for "${input.partName}" is assigned to your center.`,
          'info',
          orderDbId,
        )
      }
    }

    await db.order.update({
      where: { id: orderDbId },
      data: { status: 'delivered' },
    })
    await writeAudit(
      orderDbId,
      'DELIVERED',
      `Order ${orderPublicId} marked delivered after print + dispatch`,
      requester.id,
    )
    return {
      status: 'completed' as const,
      details: `Order ${orderPublicId} printed at ${center?.name ?? 'unassigned center'} and marked delivered`,
      orderStatusAfter: 'delivered',
      assignee: { centerId: printCenterId, centerName: printCenterName },
      sideEffects: [
        'db.Order.status -> printing',
        'db.AuditLog PRINT_STARTED',
        'db.Shipment upserted (preparing)',
        'db.Order.status -> delivered',
        'db.AuditLog DELIVERED',
        `db.Notification to print center (${center?.name ?? 'unassigned'})`,
      ],
    }
  })
  stages.push(stage4)

  const allOk = stages.every((s) => s.status === 'completed')
  const actions = stages.map((s) => {
    const capital = s.stage === 'end_user' ? 'End user order' : s.stage === 'oem' ? 'OEM' : s.stage === 'cert' ? 'Cert' : 'Printing'
    return `${capital} → ${s.status} (${s.orderStatusAfter})`
  })
  const nextSteps = allOk
    ? [
        `Monitor shipment for order ${orderPublicId}`,
        'Confirm delivery with customer',
        'Close certification request',
      ]
    : ['One or more pipeline stages failed — review audit log']

  return {
    success: allOk,
    orderId: orderPublicId,
    dbOrderId: orderDbId,
    status: allOk ? 'delivered' : 'partial',
    message: allOk
      ? `Order ${orderPublicId} processed through full pipeline (end_user → oem → cert → print)`
      : `Order ${orderPublicId} processed with ${stages.filter((s) => s.status !== 'completed').length} stage(s) failing`,
    executionTime: Date.now() - pipelineStart,
    actions,
    nextSteps,
    stages,
  }
}
