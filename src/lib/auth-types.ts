import { authClient } from '@/lib/auth-client'

export enum UserRole {
  ADMIN = 'admin',
  PLANNER = 'planner',
  GUEST = 'guest',
}

export const userRolesList: string[] = Object.values(UserRole)

export type UserRoleType = `${UserRole}`

// Funções utilitárias para verificação de roles
export async function isAdmin(): Promise<boolean> {
  const { data: session } = authClient.useSession()
  return session?.user.role === UserRole.ADMIN
}

export async function isPlanner(): Promise<boolean> {
  const { data: session } = authClient.useSession()
  return session?.user.role === UserRole.PLANNER
}

export async function isAdminOrPlanner(): Promise<boolean> {
  return (await isAdmin()) || isPlanner()
}

export async function isGuest(): Promise<boolean> {
  const { data: session } = authClient.useSession()
  return session?.user.role === UserRole.GUEST
}
