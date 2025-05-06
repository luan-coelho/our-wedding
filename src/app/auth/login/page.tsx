'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { routes } from '@/lib/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoginFormValues, loginSchema } from './login-schema'
function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    setError('')

    try {
      await signIn('credentials', {
        redirectTo: routes.frontend.admin.home ?? callbackUrl,
        email: data.email,
        password: data.password,
      })
    } catch (error) {
      setError('Credenciais inválidas. Por favor, verifique seu email e senha.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="w-full bg-white px-4 py-2 h-12 text-base"
                  placeholder="seuemail@exemplo.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  className="w-full bg-white px-4 py-2 h-12 text-base"
                  placeholder="Sua senha"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <Alert variant="destructive" className="bg-red-100 border-red-600 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </Form>
  )
}

export default function LoginPage() {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full">
      {/* Imagem da igreja (2/3 da largura em telas grandes) */}
      <div className="w-full lg:w-2/3 relative h-[40vh] lg:h-full overflow-hidden">
        <Image src="/images/church.png" alt="Interior da igreja" fill priority className="object-cover" />
      </div>

      {/* Formulário de login (1/3 da largura em telas grandes) */}
      <div className="w-full lg:w-1/3 flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
        <div className="w-full max-w-lg space-y-6">
          <h2 className="text-3xl font-bold text-center">Área Administrativa</h2>
          <Suspense fallback={<div className="text-center">Carregando...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
