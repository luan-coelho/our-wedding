'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Heart } from 'lucide-react'

export default function ConfirmacaoTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter()

  useEffect(() => {
    const redirectToMain = async () => {
      try {
        const { token } = await params

        // Redireciona para a página principal com o token como parâmetro
        router.push(`/?token=${token}#confirmation`)
      } catch (error) {
        // Em caso de erro, redireciona para a página principal
        router.push('/')
      }
    }

    redirectToMain()
  }, [params, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/80 via-white to-purple-50/80 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-2">
          <Heart className="w-8 h-8 text-wedding-primary fill-current animate-pulse" />
          <Loader2 className="w-8 h-8 text-wedding-primary animate-spin" />
          <Heart className="w-8 h-8 text-wedding-primary fill-current animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-serif text-wedding-dark">Redirecionando...</h2>
          <p className="text-wedding-accent">Você será redirecionado para a página de confirmação</p>
        </div>
      </div>
    </div>
  )
}
