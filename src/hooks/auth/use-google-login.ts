import { signIn } from 'next-auth/react'
import { useMutation } from '@tanstack/react-query'

interface UseGoogleLoginProps {
  callbackUrl: string
}

export function useGoogleLogin({ callbackUrl }: UseGoogleLoginProps) {
  return useMutation({
    mutationFn: async () => {
      return await signIn('google', {
        callbackUrl: process.env.AUTH_URL ?? callbackUrl,
      })
    },
  })
}
