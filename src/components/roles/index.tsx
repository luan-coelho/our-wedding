import React from 'react'
import { UserRole } from '@/lib/auth-types'
import WithRole, { withRole } from './with-role'
import RoleCheck from './role-check'

// Re-exporting main components
export { WithRole, withRole, RoleCheck }

// Pre-configured components for each role
export function AdminProtected({ children }: { children: React.ReactNode }) {
  return <WithRole allowedRoles={[UserRole.ADMIN]}>{children}</WithRole>
}

export function PlannerProtected({ children }: { children: React.ReactNode }) {
  return <WithRole allowedRoles={[UserRole.PLANNER]}>{children}</WithRole>
}

export function GuestProtected({ children }: { children: React.ReactNode }) {
  return <WithRole allowedRoles={[UserRole.GUEST]}>{children}</WithRole>
}

export function AdminOrPlannerProtected({ children }: { children: React.ReactNode }) {
  return <WithRole allowedRoles={[UserRole.ADMIN, UserRole.PLANNER]}>{children}</WithRole>
}

// Pre-configured role checks
export function AdminOnly({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleCheck allowedRoles={[UserRole.ADMIN]} fallback={fallback}>
      {children}
    </RoleCheck>
  )
}

export function PlannerOnly({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleCheck allowedRoles={[UserRole.PLANNER]} fallback={fallback}>
      {children}
    </RoleCheck>
  )
}

export function GuestOnly({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleCheck allowedRoles={[UserRole.GUEST]} fallback={fallback}>
      {children}
    </RoleCheck>
  )
}

export function AdminOrPlannerOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  return (
    <RoleCheck allowedRoles={[UserRole.ADMIN, UserRole.PLANNER]} fallback={fallback}>
      {children}
    </RoleCheck>
  )
}

// Pre-configured HOCs for each role
export const withAdminRole = <P extends object>(Component: React.ComponentType<P>) =>
  withRole(Component, [UserRole.ADMIN])

export const withPlannerRole = <P extends object>(Component: React.ComponentType<P>) =>
  withRole(Component, [UserRole.PLANNER])

export const withGuestRole = <P extends object>(Component: React.ComponentType<P>) =>
  withRole(Component, [UserRole.GUEST])

export const withAdminOrPlannerRole = <P extends object>(Component: React.ComponentType<P>) =>
  withRole(Component, [UserRole.ADMIN, UserRole.PLANNER])
