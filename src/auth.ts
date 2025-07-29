import { tableUsers, User } from '@/db/schema'
import { eq } from 'drizzle-orm'
import NextAuth from 'next-auth'
import authConfig from './auth.config'
import { db } from './db'
import { UserRoleType } from './lib/auth-types'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        // Verifica se o usuário existe no banco de dados
        const [existingUser]: User[] | [] = await db
          .select()
          .from(tableUsers)
          .where(eq(tableUsers.email, user.email ?? ''))
          .execute()

        // Se o usuário não existir no sistema, bloqueia o acesso
        if (!existingUser) {
          throw new Error(
            'Você não está cadastrado no sistema. Entre em contato com um administrador para solicitar acesso.',
          )
        }

        // Verifica se o usuário está ativo
        if (!existingUser.active) {
          throw new Error(
            'Seu acesso foi revogado. Entre em contato com um administrador se acredita que isso é um erro.',
          )
        }

        // Atualiza informações do usuário caso necessário
        if ((!existingUser.name && user.name) || (!existingUser.image && user.image)) {
          await db
            .update(tableUsers)
            .set({
              name: existingUser.name || user.name,
              image: existingUser.image || user.image,
              updatedAt: new Date(),
            })
            .where(eq(tableUsers.id, existingUser.id))
        }

        // Atribui os dados do banco de dados ao usuário
        user.id = existingUser.id
        user.role = existingUser.role as UserRoleType
        return true
      }
      return false
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session?.user) {
        // Se a sessão for atualizada, atualiza também o token
        token.role = session.user.role
        return token
      }

      // Passa as informações do usuário para o token durante o login
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      return token
    },
    async session({ session, token }) {
      // Passa os dados do token para a sessão
      if (token) {
        if (token.id) session.user.id = token.id as string
        if (token.role) session.user.role = token.role as UserRoleType
      }
      return session
    },
  },
})
