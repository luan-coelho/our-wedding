'use server'

import { authClient } from '@/lib/auth-client'
import { routes } from '@/lib/routes'
import { redirect } from 'next/navigation'

export async function signInWithGoogle(prevState: any, formData: FormData) {
  const callbackUrl = formData.get('callbackUrl') as string
  await authClient.signIn.social({
    provider: 'google',
    callbackURL: callbackUrl,
    errorCallbackURL: routes.frontend.auth.signin,
    newUserCallbackURL: routes.frontend.auth.signin,
    disableRedirect: true,
    fetchOptions: {
      onSuccess: () => {
        redirect(callbackUrl)
      },
      onError: error => {
        console.error('Error signing in:', error)
      },
    },
  })
  return { success: true }
}

export async function signOut() {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        redirect(routes.frontend.auth.signin)
      },
      onError: error => {
        console.error('Error signing out:', error)
      },
    },
  })
}
