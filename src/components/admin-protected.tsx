import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { routes } from '@/lib/routes'

interface AdminProtectedProps {
  children: ReactNode
  requireAdmin?: boolean
}

export default function AdminProtected({ children, requireAdmin = false }: AdminProtectedProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      // Se não estiver autenticado, redireciona para login
      router.push(routes.frontend.auth.login)
    } else if (requireAdmin && session.user.role !== 'admin') {
      // Se a página requer admin e o usuário não é admin, redireciona para admin home
      router.push(routes.frontend.admin.home)
    } else if (session.user.role !== 'admin' && session.user.role !== 'cerimonialista') {
      // Se não for nem admin nem cerimonialista, redireciona para home
      router.push(routes.frontend.home)
    }
  }, [session, status, router, requireAdmin])

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (requireAdmin && session.user.role !== 'admin') {
    return null
  }

  if (session.user.role !== 'admin' && session.user.role !== 'cerimonialista') {
    return null
  }

  return <>{children}</>
}
