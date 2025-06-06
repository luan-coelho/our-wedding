'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useGoogleLogin } from '@/hooks/auth/use-google-login'
import { routes } from '@/lib/routes'
import { AlertCircle, HeartHandshake, Loader2 } from 'lucide-react'
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
        <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800 shadow-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm leading-relaxed">{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          size="lg"
          className="w-full h-12 text-base font-medium bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md transition-all duration-200 group"
          disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processando...</span>
            </>
          ) : (
            <>
              <Image
                src="/images/google-logo.svg"
                alt="Google logo"
                width={20}
                height={20}
                className="group-hover:scale-105 transition-transform duration-200"
              />
              <span>Entrar com Google</span>
            </>
          )}
        </Button>

        <div className="relative">
          <Separator className="bg-gray-200" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white px-3 text-xs text-gray-500 font-medium">
              Acesso seguro e protegido
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header da área administrativa */}
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full"></div>
            </div>
            <HeartHandshake className="relative h-10 w-10 mx-auto text-rose-600 z-10" />
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                Luan & Ester
              </h1>
              <p className="text-lg text-gray-600 italic font-light">
                Nosso Casamento
              </p>
            </div>
            <Separator className="bg-gray-200 w-24 mx-auto" />
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-gray-800">
                Área Administrativa
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Acesse o painel de gerenciamento do casamento
              </p>
            </div>
          </div>
        </div>

        {/* Card do formulário */}
        <Card className="border-gray-200 shadow-lg bg-white">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-xl font-semibold text-gray-900 text-center">
              Fazer Login
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Use sua conta Google para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Suspense fallback={
              <div className="flex items-center justify-center py-12 space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                <span className="text-gray-600">Carregando...</span>
              </div>
            }>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>

        {/* Footer informativo */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-500">
            Sistema protegido por autenticação Google
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
            <span>Dados seguros</span>
            <span>•</span>
            <span>Acesso controlado</span>
            <span>•</span>
            <span>Privacidade garantida</span>
          </div>
        </div>
      </div>
    </div>
  )
}
