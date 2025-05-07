import { signIn } from 'next-auth/react'
import { useMutation } from '@tanstack/react-query'

interface UseGoogleLoginProps {
  callbackUrl: string
}

export function useGoogleLogin({ callbackUrl }: UseGoogleLoginProps) {
  return useMutation({
    mutationFn: async () => {
      try {
        const result = await signIn('google', {
          callbackUrl: process.env.AUTH_URL ?? callbackUrl,
          redirect: false,
        })
        
        // Se não tiver erro e tiver uma URL para redirecionar, faça o redirecionamento manual
        if (result && !result.error && result.url) {
          window.location.href = result.url
        }
        
        return result
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
  })
}
