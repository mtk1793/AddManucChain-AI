import useSWR, { mutate } from 'swr'
import useSWRImmutable from 'swr/immutable'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useApiOrders() {
  const { data, error, isLoading } = useSWR('/api/orders', fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 2000,
  })
  return { orders: data ?? [], error, isLoading }
}

export function useApiBlueprints() {
  const { data, error, isLoading } = useSWRImmutable('/api/blueprints', fetcher)
  return { blueprints: data ?? [], error, isLoading }
}

export function useApiCenters() {
  const { data, error, isLoading } = useSWRImmutable('/api/centers', fetcher)
  return { centers: data ?? [], error, isLoading }
}

export function useApiShipments() {
  const { data, error, isLoading } = useSWR('/api/shipments', fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 2000,
  })
  return { shipments: data ?? [], error, isLoading }
}

export function useApiMaterials() {
  const { data, error, isLoading } = useSWRImmutable('/api/materials', fetcher)
  return { materials: data ?? [], error, isLoading }
}

export function useApiCertifications() {
  const { data, error, isLoading } = useSWRImmutable('/api/certifications', fetcher)
  return { certifications: data ?? [], error, isLoading }
}

export function useApiPartners() {
  const { data, error, isLoading } = useSWRImmutable('/api/partners', fetcher)
  return { partners: data ?? [], error, isLoading }
}

export function useApiEmployees() {
  const { data, error, isLoading } = useSWRImmutable('/api/employees', fetcher)
  return { employees: data ?? [], error, isLoading }
}

export function useApiAuthorities() {
  const { data, error, isLoading } = useSWRImmutable('/api/authorities', fetcher)
  return { authorities: data ?? [], error, isLoading }
}

export function useApiNotifications() {
  const { data, error, isLoading } = useSWR('/api/notifications', fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 3000,
  })
  return { notifications: data ?? [], error, isLoading }
}

export function useApiDashboardStats() {
  const { data, error, isLoading } = useSWR('/api/stats', fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 3000,
  })
  return { stats: data, error, isLoading }
}

export async function createOrder(body: Record<string, unknown>) {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (res.ok) await mutate('/api/orders')
  return json
}

export async function submitPipelineOrder(body: Record<string, unknown>) {
  const res = await fetch('/api/automation/submit-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (res.ok) {
    await mutate('/api/orders')
    await mutate('/api/shipments')
    await mutate('/api/stats')
  }
  return json
}
