import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { routes } from './lib/routes'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Verifica se é uma rota administrativa
  if (pathname.startsWith('/admin')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // Se não estiver autenticado, redireciona para a página de login
    if (!token) {
      const url = new URL(routes.frontend.auth.login, request.url)
      url.searchParams.set('callbackUrl', encodeURI(request.url))
      return NextResponse.redirect(url)
    }

    // Se estiver autenticado, permite o acesso
    return NextResponse.next()
  }

  return NextResponse.next()
}

// Configuração para aplicar o middleware apenas nas rotas administrativas
export const config = {
  matcher: '/admin/:path*',
}
