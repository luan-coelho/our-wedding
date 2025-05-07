import { NextRequest, NextResponse } from 'next/server'
import { getAuthToken } from './lib/auth-helpers'
import { routes } from './lib/routes'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Apenas verifica rotas administrativas
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const token = await getAuthToken(request)

  // Se não estiver autenticado, redireciona para login
  if (!token) {
    const loginUrl = new URL(routes.frontend.auth.login, request.url)
    loginUrl.searchParams.set('callbackUrl', encodeURI(request.url))
    return NextResponse.redirect(loginUrl)
  }

  // Visitantes não têm acesso às rotas administrativas
  if (token.role === 'guest' || token.role === 'visitante') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Planner só pode visualizar a lista de convidados
  if (token.role === 'planner') {
    // Se tentar acessar outra rota além de /admin/convidados, redireciona
    if (!pathname.startsWith('/admin/convidados')) {
      return NextResponse.redirect(new URL('/admin/convidados', request.url))
    }
    
    // Se estiver tentando acessar operações de criação/edição/exclusão, bloqueia acesso
    if (pathname.includes('/novo') || pathname.includes('/editar') || pathname.includes('/excluir')) {
      return NextResponse.redirect(new URL('/admin/convidados', request.url))
    }
  }

  // Administrador tem acesso total
  return NextResponse.next()
}

// Configuração para aplicar o middleware apenas nas rotas administrativas
export const config = {
  matcher: '/admin/:path*',
}
