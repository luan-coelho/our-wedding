import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Obtém o token de autenticação e o usuário atual com tipagem correta
 */
export async function getAuthToken(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })

  return token
}

/**
 * Interface para o usuário autenticado
 */
export interface AuthUser {
  id: string
  name?: string | null
  email?: string | null
  role?: string
}
