import { UserRoleType } from '@/lib/auth-types'
import 'next-auth'

declare module 'next-auth' {
  interface User {
    role: UserRoleType
  }

  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: UserRoleType
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRoleType
  }
}
