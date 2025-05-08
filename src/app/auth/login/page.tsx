'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useGoogleLogin } from '@/hooks/auth/use-google-login'
import { routes } from '@/lib/routes'
import { AlertCircle, HeartHandshake } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || routes.frontend.admin.home
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Captura erros da URL
  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      // Mensagens específicas para cada tipo de erro
      if (error === 'AccessDenied') {
        setErrorMessage(
          'Você não está cadastrado no sistema. Entre em contato com um administrador para solicitar acesso.',
        )
      } else if (error === 'Callback') {
        setErrorMessage('Houve um problema durante o login. Tente novamente.')
      } else if (error === 'OAuthSignin') {
        setErrorMessage('Erro ao iniciar autenticação com Google. Tente novamente.')
      } else if (error === 'OAuthCallback') {
        setErrorMessage('Erro na resposta de autenticação do Google. Tente novamente.')
      } else if (error === 'SessionRequired') {
        setErrorMessage('Você precisa estar autenticado para acessar esse recurso.')
      } else {
        setErrorMessage(`Erro de autenticação: ${error}`)
      }
    }
  }, [searchParams])

  const { mutate: loginWithGoogle, isPending } = useGoogleLogin({
    callbackUrl,
  })

  function handleGoogleLogin() {
    setErrorMessage(null)
    loginWithGoogle(undefined, {
      onError: error => {
        console.error('Login error:', error)
        setErrorMessage('Ocorreu um erro ao tentar fazer login com Google. Tente novamente.')
      },
      onSuccess: data => {
        if (data?.error) {
          setErrorMessage(data?.error)
        }
      },
    })
  }

  return (
    <div className="space-y-6">
      {errorMessage && (
        <Alert variant="destructive" className="bg-red-100 border-red-600 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleGoogleLogin}
        className="w-full h-14 text-lg flex items-center justify-center gap-3 bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 shadow-md transition-all hover:shadow-lg"
        disabled={isPending}>
        <Image src="/images/google-logo.svg" alt="Google logo" width={24} height={24} />
        {isPending ? 'Processando...' : 'Entrar com Google'}
      </Button>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full">
      {/* Imagem de fundo (2/3 da largura em telas grandes) */}
      <div className="w-full lg:w-2/3 relative h-[45vh] lg:h-full overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10 flex flex-col items-center justify-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-center mb-4 font-serif">Luan & Ester</h1>
          <p className="text-xl md:text-2xl italic opacity-90">Nosso Casamento</p>
        </div>
        <Image src="/images/church.png" alt="Interior da igreja" fill priority className="object-cover" />
      </div>

      {/* Formulário de login (1/3 da largura em telas grandes) */}
      <div className="w-full lg:w-1/3 flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-8">
        <div className="w-full max-w-lg space-y-8">
          <div className="text-center space-y-3">
            <HeartHandshake className="h-14 w-14 mx-auto text-rose-500" />
            <h2 className="text-3xl font-bold text-gray-800">Área Administrativa</h2>
            <p className="text-gray-600">Acesse o painel de gerenciamento do casamento</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
            <Suspense fallback={<div className="text-center py-4">Carregando...</div>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
