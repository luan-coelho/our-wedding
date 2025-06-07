import { db } from '@/db'
import { usersService } from '@/services'
import { User } from '@/types'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { customSession } from 'better-auth/plugins'

import * as schema from '@/db/schema/index'
import { nextCookies } from 'better-auth/next-js'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      account: schema.accountsTable,
      session: schema.sessionsTable,
      user: schema.usersTable,
      verification: schema.verificationsTable,
    },
  }),
  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  account: {
    accountLinking: {
      trustedProviders: ['google'],
    },
  },
  plugins: [
    nextCookies(),
    customSession(async ({ user, session }) => {
      const dataBaseUser: User = await usersService.getById(user.id)
      return {
        user: {
          ...user,
          role: dataBaseUser.role,
        },
        session,
      }
    }),
  ],
})
