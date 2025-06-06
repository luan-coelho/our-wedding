'use client'

import { ReactNode } from 'react'
import { UserRoleType } from '@/lib/auth-types'
import { authClient } from '@/lib/auth-client'

interface RoleCheckProps {
  children: ReactNode
  allowedRoles: UserRoleType[]
  fallback?: ReactNode
}

/**
 * Component that conditionally renders content based on user role
 *
 * @param children Content to show if user has permission
 * @param allowedRoles Array of roles that have permission to see the content
 * @param fallback Optional content to show if user doesn't have permission
 */
export default function RoleCheck({ children, allowedRoles, fallback = null }: RoleCheckProps) {
  const { data: session } = authClient.useSession()

  // Verifica se o usuário está autenticado e tem uma das roles permitidas
  const hasPermission = session?.user && allowedRoles.includes(session.user.role)

  // Renderiza o conteúdo principal ou o fallback baseado na permissão
  return hasPermission ? <>{children}</> : <>{fallback}</>
}
