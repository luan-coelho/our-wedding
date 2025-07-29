import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

import { routes } from '@/lib/routes'

// Configuração básica do Auth.js sem adapter (compatível com Edge Runtime)
export default {
  debug: true,
  trustHost: true,
  providers: [
    Google({
      profile(profile) {
        return { ...profile }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  pages: {
    signIn: routes.frontend.auth.login,
    signOut: routes.frontend.home,
    newUser: routes.frontend.auth.login,
    error: routes.frontend.auth.login,
  },
} satisfies NextAuthConfig
