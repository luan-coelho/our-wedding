import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import authConfig from './auth.config'
import { routes } from './lib/routes'

// Usar configuração básica sem adapter para compatibilidade com Edge Runtime
const { auth: middleware } = NextAuth(authConfig)

export default middleware(req => {
  const { pathname } = req.nextUrl

  // === MODO DE MANUTENÇÃO ===
  // Verificar se o modo de manutenção está ativo primeiro
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true'

  if (isMaintenanceMode) {
    // Permitir acesso apenas a rotas essenciais durante manutenção
    const allowedDuringMaintenance = ['/manutencao', '/api/auth', '/_next', '/favicon.ico']

    const isAllowedPath = allowedDuringMaintenance.some(path => pathname.startsWith(path))

    if (!isAllowedPath) {
      const maintenanceUrl = new URL(routes.frontend.manutencao, req.nextUrl.origin)
      return NextResponse.redirect(maintenanceUrl)
    }

    // Se estiver na página de manutenção, permitir acesso
    if (pathname.startsWith('/manutencao')) {
      return NextResponse.next()
    }
  }

  // Se não estiver em modo de manutenção, mas estiver tentando acessar a página de manutenção
  // redirecionar para a home
  if (!isMaintenanceMode && pathname.startsWith('/manutencao')) {
    const homeUrl = new URL(routes.frontend.home, req.nextUrl.origin)
    return NextResponse.redirect(homeUrl)
  }

  // === ROTAS PÚBLICAS ===
  // Rotas que não precisam de autenticação
  const publicRoutes = [
    '/',
    '/auth/login',
    '/api/auth',
  ]

  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))

  // Permitir acesso a rotas públicas e de autenticação
  if (isPublicRoute || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // === VERIFICAÇÃO DE AUTENTICAÇÃO ===
  // Se não estiver autenticado, redireciona para login
  if (!req.auth) {
    const loginUrl = new URL(routes.frontend.auth.login, req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', encodeURI(req.url))
    return NextResponse.redirect(loginUrl)
  }

  // === CONTROLE DE ACESSO POR ROLE ===
  const userRole = req.auth.user?.role

  // Visitantes (guests) só podem acessar confirmação
  if (userRole === 'guest') {
    // Permitir apenas rotas de confirmação para guests
    const guestAllowedRoutes = ['/confirmacao']

    const isGuestAllowed = guestAllowedRoutes.some(route => pathname.startsWith(route))

    if (!isGuestAllowed) {
      const confirmationUrl = new URL('/confirmacao', req.nextUrl.origin)
      return NextResponse.redirect(confirmationUrl)
    }
  }

  // Planejadores (planners) têm acesso limitado ao admin
  if (userRole === 'planner') {
    // Se tentar acessar área admin
    if (pathname.startsWith('/admin')) {
      // Só pode acessar convidados (apenas visualização)
      if (!pathname.startsWith(routes.frontend.admin.convidados.index)) {
        const guestsUrl = new URL(routes.frontend.admin.convidados.index, req.nextUrl.origin)
        return NextResponse.redirect(guestsUrl)
      }

      // Bloquear operações de criação/edição/exclusão
      const restrictedOperations = ['/novo', '/editar', '/excluir']
      const hasRestrictedOperation = restrictedOperations.some(op => pathname.includes(op))

      if (hasRestrictedOperation) {
        const guestsUrl = new URL(routes.frontend.admin.convidados.index, req.nextUrl.origin)
        return NextResponse.redirect(guestsUrl)
      }
    }
  }

  // === HEADERS PERSONALIZADOS ===
  // Adicionar headers de segurança e informações úteis
  const response = NextResponse.next()

  // Header com informação do usuário (para debug em desenvolvimento)
  if (process.env.NODE_ENV === 'development' && req.auth?.user) {
    response.headers.set('x-user-role', req.auth.user.role || 'unknown')
    response.headers.set('x-user-id', req.auth.user.id || 'unknown')
  }

  // Headers de segurança básicos
  response.headers.set('x-frame-options', 'DENY')
  response.headers.set('x-content-type-options', 'nosniff')
  response.headers.set('referrer-policy', 'strict-origin-when-cross-origin')

  // Administradores têm acesso total - permitir acesso
  return response
})

// Configuração do matcher - aplicar middleware em todas as rotas relevantes
export const config = {
  matcher: [
    /*
     * Aplica middleware em todas as rotas exceto:
     * - API routes (exceto auth que precisamos processar)
     * - Arquivos estáticos (_next/static)
     * - Otimização de imagens (_next/image)
     * - Arquivos de metadata (favicon, sitemap, robots)
     */
    '/((?!api(?!/auth)|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
