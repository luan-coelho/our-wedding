import { auth } from '@/auth'

export enum UserRole {
  ADMIN = 'admin',
  PLANNER = 'planner',
  GUEST = 'guest',
}

export type UserRoleType = `${UserRole}`

// Funções utilitárias para verificação de roles
export async function isAdmin(): Promise<boolean> {
  return hasRole(UserRole.ADMIN)
}

export async function isPlanner(): Promise<boolean> {
  return hasRole(UserRole.PLANNER)
}

export async function isAdminOrPlanner(): Promise<boolean> {
  return isAdmin() || isPlanner()
}

export async function isGuest(): Promise<boolean> {
  return hasRole(UserRole.GUEST)
}

export async function hasRole(role: UserRoleType): Promise<boolean> {
  const session = await auth()

  if (!session) return false
  return session?.user.role === role
}
