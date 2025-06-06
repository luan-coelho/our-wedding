import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'
import { routes } from '@/lib/routes'

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  console.log('sessionCookie', sessionCookie)
  console.log('middleware', request.nextUrl.pathname)

  // Se não estiver autenticado, redireciona para login
  if (!sessionCookie) {
    const loginUrl = new URL(routes.frontend.auth.signin, request.url)
    loginUrl.searchParams.set('callbackUrl', encodeURI(request.url))
    return NextResponse.redirect(loginUrl)
  }

  // Visitantes não têm acesso às rotas administrativas
  /**if (sessionCookie.role === 'guest') {
   return NextResponse.redirect(new URL(routes.frontend.home, request.url))
   }

   // Planner só pode visualizar a lista de convidados
   if (token.role === 'planner') {
   // Se tentar acessar outra rota além de /admin/convidados, redireciona para a área de convidados
   if (!pathname.startsWith(routes.frontend.admin.convidados.index)) {
   return NextResponse.redirect(new URL(routes.frontend.admin.convidados.index, request.url))
   }

   // Se estiver tentando acessar operações de criação/edição/exclusão, bloqueia acesso
   if (pathname.includes('/novo') || pathname.includes('/editar') || pathname.includes('/excluir')) {
   return NextResponse.redirect(new URL(routes.frontend.admin.convidados.index, request.url))
   }
   }**/

  // Administrador tem acesso total
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
