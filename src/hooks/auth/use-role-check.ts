import { useSession } from 'next-auth/react'
import { UserRole, UserRoleType } from '@/lib/auth-types'

/**
 * Custom hook to check if the current user has specific roles
 */
export function useRoleCheck() {
  const { data: session } = useSession()
  const userRole = session?.user?.role

  /**
   * Check if user has one of the allowed roles
   * @param roles Array of allowed roles
   * @returns boolean indicating if user has permission
   */
  const hasRole = (roles: UserRoleType[]): boolean => {
    return !!userRole && roles.includes(userRole)
  }

  /**
   * Check if user is an admin
   * @returns boolean indicating if user is admin
   */
  const isAdmin = (): boolean => {
    return hasRole([UserRole.ADMIN])
  }

  /**
   * Check if user is a planner
   * @returns boolean indicating if user is planner
   */
  const isPlanner = (): boolean => {
    return hasRole([UserRole.PLANNER])
  }

  /**
   * Check if user is a guest
   * @returns boolean indicating if user is guest
   */
  const isGuest = (): boolean => {
    return hasRole([UserRole.GUEST])
  }

  /**
   * Check if user is an admin or planner
   * @returns boolean indicating if user is admin or planner
   */
  const isAdminOrPlanner = (): boolean => {
    return hasRole([UserRole.ADMIN, UserRole.PLANNER])
  }

  return {
    userRole,
    hasRole,
    isAdmin,
    isPlanner,
    isGuest,
    isAdminOrPlanner
  }
} 