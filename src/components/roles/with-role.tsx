'use client'

import { useSession } from 'next-auth/react'
import { ComponentType, ReactNode } from 'react'
import { UserRoleType } from '@/lib/auth-types'

interface WithRoleProps {
  children: ReactNode
  allowedRoles: UserRoleType[]
}

export default function WithRole({ children, allowedRoles }: WithRoleProps) {
  const { data: session, status } = useSession()

  // Exibe um indicador de carregamento enquanto verifica a sessão
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  // Não renderiza nada se o usuário não estiver autenticado ou não tiver permissão
  if (!session || !session.user || !allowedRoles.includes(session.user.role)) {
    return null
  }

  // Renderiza o conteúdo protegido se o usuário tiver permissão
  return <>{children}</>
}

// HOC para criar componentes protegidos por role
export function withRole<P extends object>(Component: ComponentType<P>, allowedRoles: UserRoleType[]) {
  return function WithRoleComponent(props: P) {
    return (
      <WithRole allowedRoles={allowedRoles}>
        <Component {...props} />
      </WithRole>
    )
  }
}
