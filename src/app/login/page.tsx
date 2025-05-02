'use client'

import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
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
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border 
                      border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md 
                      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border 
                      border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md 
                      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">{error}</div>}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
                    text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                    disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">Área Administrativa</h1>
          <p className="mt-2 text-center text-sm text-gray-600">Acesse para gerenciar seu casamento</p>
        </div>
        <Suspense fallback={<div className="text-center">Carregando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
