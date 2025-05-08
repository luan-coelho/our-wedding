import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Obtém o token de autenticação e o usuário atual com tipagem correta
 */
export async function getAuthToken(req: NextRequest) {
  return await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })
}
