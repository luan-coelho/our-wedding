import { auth } from '@/auth'
import { routes } from './lib/routes'

export default auth(req => {
  const pathname = req.nextUrl.pathname

  // Ignorar rotas de autenticação
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/auth/login')) {
    return
  }

  // Se não estiver autenticado, redireciona para login
  if (!req.auth) {
    const loginUrl = new URL(routes.frontend.auth.login, req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', encodeURI(req.url))
    return Response.redirect(loginUrl)
  }

  // Visitantes não têm acesso às rotas administrativas
  if (req.auth.user?.role === 'guest') {
    return Response.redirect(new URL(routes.frontend.home, req.nextUrl.origin))
  }

  // Planner só pode visualizar a lista de convidados
  if (req.auth.user?.role === 'planner') {
    // Se tentar acessar outra rota além de /admin/convidados, redireciona para a área de convidados
    if (!pathname.startsWith(routes.frontend.admin.convidados.index)) {
      return Response.redirect(new URL(routes.frontend.admin.convidados.index, req.nextUrl.origin))
    }

    // Se estiver tentando acessar operações de criação/edição/exclusão, bloqueia acesso
    if (pathname.includes('/novo') || pathname.includes('/editar') || pathname.includes('/excluir')) {
      return Response.redirect(new URL(routes.frontend.admin.convidados.index, req.nextUrl.origin))
    }
  }

  // Administrador tem acesso total
  // Não retorna nada, permitindo que a requisição continue
})

// Configuração para aplicar o middleware apenas nas rotas administrativas
export const config = {
  matcher: ['/admin/:path*'],
}
