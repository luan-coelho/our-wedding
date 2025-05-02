import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { routes } from '@/lib/routes'

export default function AdminProtected({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push(routes.frontend.auth.login)
    } else if (session.user.role !== 'admin') {
      router.push(routes.frontend.home)
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!session || session.user.role !== 'admin') {
    return null
  }

  return <>{children}</>
}
