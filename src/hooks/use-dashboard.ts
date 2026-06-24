import useSWR from 'swr'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export function useOrders(status?: string, search?: string) {
  const params = new URLSearchParams()
  if (status && status !== 'all') params.append('status', status)
  if (search) params.append('search', search)
  
  const query = params.toString()
  const url = `/api/orders${query ? `?${query}` : ''}`
  
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)
  
  return {
    orders: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useBlueprints(category?: string, certification?: string, status?: string, search?: string) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.append('category', category)
  if (certification && certification !== 'all') params.append('certification', certification)
  if (status && status !== 'all') params.append('status', status)
  if (search) params.append('search', search)
  
  const query = params.toString()
  const url = `/api/blueprints${query ? `?${query}` : ''}`
  
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)
  
  return {
    blueprints: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useCenters() {
  const { data, error, isLoading, mutate } = useSWR('/api/centers', fetcher)
  
  return {
    centers: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useStats() {
  const { data, error, isLoading, mutate } = useSWR('/api/stats', fetcher)
  
  return {
    stats: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useOrder(id: string) {
  const { data, error, isLoading, mutate } = useSWR(id ? `/api/orders/${id}` : null, fetcher)
  
  return {
    order: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useBlueprint(id: string) {
  const { data, error, isLoading, mutate } = useSWR(id ? `/api/blueprints/${id}` : null, fetcher)
  
  return {
    blueprint: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useAuthorities(type?: string, status?: string, search?: string) {
  const params = new URLSearchParams()
  if (type && type !== 'all') params.append('type', type)
  if (status && status !== 'all') params.append('status', status)
  if (search) params.append('search', search)
  
  const query = params.toString()
  const url = `/api/authorities${query ? `?${query}` : ''}`
  
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)
  
  return {
    authorities: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useCertRequests(status?: string, authorityId?: string) {
  const params = new URLSearchParams()
  if (status && status !== 'all') params.append('status', status)
  if (authorityId) params.append('authorityId', authorityId)
  
  const query = params.toString()
  const url = `/api/cert-requests${query ? `?${query}` : ''}`
  
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)
  
  return {
    certRequests: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useEngagements(phase?: string, status?: string, search?: string) {
  const params = new URLSearchParams()
  if (phase && phase !== 'all') params.append('phase', phase)
  if (status && status !== 'all') params.append('status', status)
  if (search) params.append('search', search)
  
  const query = params.toString()
  const url = `/api/engagements${query ? `?${query}` : ''}`
  
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)
  
  return {
    engagements: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useTrainingSessions(customerId?: string, status?: string, type?: string) {
  const params = new URLSearchParams()
  if (customerId) params.append('customerId', customerId)
  if (status && status !== 'all') params.append('status', status)
  if (type && type !== 'all') params.append('type', type)
  
  const query = params.toString()
  const url = `/api/training${query ? `?${query}` : ''}`
  
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)
  
  return {
    trainingSessions: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useComparativeMetrics(customerId?: string, startDate?: string, endDate?: string) {
  const params = new URLSearchParams()
  if (customerId) params.append('customerId', customerId)
  if (startDate) params.append('startDate', startDate)
  if (endDate) params.append('endDate', endDate)
  
  const query = params.toString()
  const url = `/api/comparative${query ? `?${query}` : ''}`
  
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)
  
  return {
    comparativeMetrics: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useEnvironmentalImpact(orderId?: string) {
  const params = new URLSearchParams()
  if (orderId) params.append('orderId', orderId)
  
  const query = params.toString()
  const url = `/api/environmental${query ? `?${query}` : ''}`
  
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)
  
  return {
    environmentalImpact: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useCustomizationRequests(status?: string, blueprintId?: string) {
  const params = new URLSearchParams()
  if (status && status !== 'all') params.append('status', status)
  if (blueprintId) params.append('blueprintId', blueprintId)
  
  const query = params.toString()
  const url = `/api/customization${query ? `?${query}` : ''}`
  
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)
  
  return {
    customizationRequests: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

