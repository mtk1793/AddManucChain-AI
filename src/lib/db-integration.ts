import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ── Workflow Integration ──────────────────────────────────────
export async function getWorkflows(userId?: string) {
  try {
    const workflows = await prisma.workflow.findMany({
      where: userId ? { userId } : {},
      include: { steps: true },
      orderBy: { createdAt: 'desc' },
    })
    return workflows
  } catch (error) {
    console.error('Error fetching workflows:', error)
    return []
  }
}

export async function createWorkflow(data: {
  name: string
  trigger: string
  description?: string
  userId?: string
}) {
  try {
    const workflow = await prisma.workflow.create({
      data: {
        name: data.name,
        trigger: data.trigger,
        description: data.description,
        status: 'draft',
        userId: data.userId,
      },
    })
    return workflow
  } catch (error) {
    console.error('Error creating workflow:', error)
    return null
  }
}

export async function updateWorkflowStatus(workflowId: string, status: 'active' | 'paused' | 'archived') {
  try {
    const workflow = await prisma.workflow.update({
      where: { id: workflowId },
      data: { status, updatedAt: new Date() },
    })
    return workflow
  } catch (error) {
    console.error('Error updating workflow:', error)
    return null
  }
}

// ── Integration Hub ──────────────────────────────────────────
export async function getIntegrations(userId?: string) {
  try {
    const integrations = await prisma.integration.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
    })
    return integrations
  } catch (error) {
    console.error('Error fetching integrations:', error)
    return []
  }
}

export async function createIntegration(data: {
  name: string
  type: string
  config: Record<string, any>
  userId?: string
}) {
  try {
    const integration = await prisma.integration.create({
      data: {
        name: data.name,
        type: data.type,
        config: data.config,
        status: 'connecting',
        userId: data.userId,
      },
    })
    return integration
  } catch (error) {
    console.error('Error creating integration:', error)
    return null
  }
}

export async function syncIntegration(integrationId: string) {
  try {
    const integration = await prisma.integration.update({
      where: { id: integrationId },
      data: {
        lastSyncAt: new Date(),
        status: 'syncing',
      },
    })
    return integration
  } catch (error) {
    console.error('Error syncing integration:', error)
    return null
  }
}

// ── API Key Management ───────────────────────────────────────
export async function getApiKeys(userId?: string) {
  try {
    const keys = await prisma.apiKey.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
    })
    return keys
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return []
  }
}

export async function createApiKey(data: {
  name: string
  userId?: string
}) {
  try {
    // Generate a random API key
    const key = `amk_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`
    
    const apiKey = await prisma.apiKey.create({
      data: {
        name: data.name,
        key: key,
        status: 'active',
        userId: data.userId,
      },
    })
    return apiKey
  } catch (error) {
    console.error('Error creating API key:', error)
    return null
  }
}

export async function revokeApiKey(keyId: string) {
  try {
    const key = await prisma.apiKey.update({
      where: { id: keyId },
      data: { status: 'revoked', revokedAt: new Date() },
    })
    return key
  } catch (error) {
    console.error('Error revoking API key:', error)
    return null
  }
}

// ── Dashboard Management ─────────────────────────────────────
export async function getDashboards(userId?: string) {
  try {
    const dashboards = await prisma.dashboard.findMany({
      where: userId ? { userId } : {},
      include: { widgets: true },
      orderBy: { createdAt: 'desc' },
    })
    return dashboards
  } catch (error) {
    console.error('Error fetching dashboards:', error)
    return []
  }
}

export async function createDashboard(data: {
  name: string
  description?: string
  userId?: string
}) {
  try {
    const dashboard = await prisma.dashboard.create({
      data: {
        name: data.name,
        description: data.description,
        layout: 'grid',
        userId: data.userId,
      },
    })
    return dashboard
  } catch (error) {
    console.error('Error creating dashboard:', error)
    return null
  }
}

export async function addWidgetToDashboard(dashboardId: string, widget: any) {
  try {
    const updatedDashboard = await prisma.dashboard.update({
      where: { id: dashboardId },
      data: {
        widgets: {
          push: widget,
        },
      },
    })
    return updatedDashboard
  } catch (error) {
    console.error('Error adding widget:', error)
    return null
  }
}

// ── User Management ──────────────────────────────────────────
export async function getTeamMembers(organizationId?: string) {
  try {
    const members = await prisma.user.findMany({
      where: organizationId ? { organizationId } : {},
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return members
  } catch (error) {
    console.error('Error fetching team members:', error)
    return []
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role, updatedAt: new Date() },
    })
    return user
  } catch (error) {
    console.error('Error updating user role:', error)
    return null
  }
}

// ── System Monitoring ────────────────────────────────────────
export async function createSystemMetric(data: {
  metricType: string
  value: number
  thresholdMin?: number
  thresholdMax?: number
}) {
  try {
    const metric = await prisma.systemMetric.create({
      data: {
        metricType: data.metricType,
        value: data.value,
        thresholdMin: data.thresholdMin,
        thresholdMax: data.thresholdMax,
        timestamp: new Date(),
      },
    })
    return metric
  } catch (error) {
    console.error('Error creating metric:', error)
    return null
  }
}

export async function getSystemHealthMetrics(hours: number = 24) {
  try {
    const metrics = await prisma.systemMetric.findMany({
      where: {
        timestamp: {
          gte: new Date(Date.now() - hours * 60 * 60 * 1000),
        },
      },
      orderBy: { timestamp: 'desc' },
    })
    return metrics
  } catch (error) {
    console.error('Error fetching health metrics:', error)
    return []
  }
}
