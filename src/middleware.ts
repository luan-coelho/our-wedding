import { NextRequest, NextResponse } from 'next/server'
import { getAuthToken } from './lib/auth-helpers'
import { routes } from './lib/routes'
import { auth } from '@/auth'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Ignorar rotas de autenticação
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/auth/login')) {
    return NextResponse.next()
  }

  const token = await getAuthToken(request)
  const session = await auth()

  console.log(`TOKEN ${token ? 'EXISTE' : 'NÃO EXISTE'}`)
  console.log(`SESSION ${session ? 'EXISTE' : 'NÃO EXISTE'}`)

  // Não autenticado → redireciona para login
  if (!token) {
    const loginUrl = new URL(routes.frontend.auth.login, request.url)
    loginUrl.searchParams.set('callbackUrl', encodeURIComponent(request.url))
    return NextResponse.redirect(loginUrl)
  }

  // Restrição por papel: guest
  if (token.role === 'guest') {
    return NextResponse.redirect(new URL(routes.frontend.home, request.url))
  }

  // Restrição por papel: planner
  if (token.role === 'planner') {
    if (!pathname.startsWith(routes.frontend.admin.convidados.index)) {
      return NextResponse.redirect(new URL(routes.frontend.admin.convidados.index, request.url))
    }

    if (pathname.includes('/novo') || pathname.includes('/editar') || pathname.includes('/excluir')) {
      return NextResponse.redirect(new URL(routes.frontend.admin.convidados.index, request.url))
    }
  }

  return NextResponse.next()
}

// Configuração para aplicar o middleware apenas nas rotas administrativas
export const config = {
  matcher: '/admin/:path*',
}
