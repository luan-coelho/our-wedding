'use client'

import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Image from 'next/image'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

type LoginFormValues = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()
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
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (result?.error) {
        setError('Credenciais inválidas. Por favor, verifique seu email e senha.')
      } else {
        router.push(callbackUrl)
      }
    } catch (error) {
      setError('Ocorreu um erro ao fazer login. Por favor, tente novamente.')
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
      <Alert variant="destructive">
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
        <Image 
          src="/images/igreja.png" 
          alt="Interior da igreja" 
          fill 
          priority
          className="object-cover"
        />
      </div>
      
      {/* Formulário de login (1/3 da largura em telas grandes) */}
      <div className="w-full lg:w-1/3 flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
        <div className="w-full max-w-lg space-y-6">
          <h2 className="text-3xl font-bold text-center">Área Administrativa</h2>
          <p className="text-center text-gray-600 mb-4">Acesse para gerenciar seu casamento</p>
          <Suspense fallback={<div className="text-center">Carregando...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
