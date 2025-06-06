import { useMutation } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'

interface UseGoogleLoginProps {
  callbackUrl: string
}

export function useGoogleLogin({ callbackUrl }: UseGoogleLoginProps) {
  return useMutation({
    mutationFn: async () => {
      try {
        return await authClient.signIn.social({
          /**
           * The social provider ID
           * @example "github", "google", "apple"
           */
          provider: 'google',
          /**
           * A URL to redirect after the user authenticates with the provider
           * @default "/"
           */
          callbackURL: process.env.AUTH_URL ?? callbackUrl,
          /**
           * A URL to redirect if an error occurs during the sign in process
           */
          errorCallbackURL: '/error',
          /**
           * A URL to redirect if the user is newly registered
           */
          newUserCallbackURL: '/auth/signin',
          /**
           * disable the automatic redirect to the provider.
           * @default false
           */
          disableRedirect: false,
        })
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
  })
}
