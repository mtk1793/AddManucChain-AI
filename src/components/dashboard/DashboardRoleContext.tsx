'use client'

import { createContext, useContext } from 'react'

export type DashboardRole = 'admin' | 'oem_partner' | 'end_user' | 'cert_authority' | 'lab' | 'print_center'

export const DashboardRoleContext = createContext<DashboardRole>('admin')

export function useDashboardRole() {
  return useContext(DashboardRoleContext)
}
