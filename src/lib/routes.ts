/**
 * Rotas centralizadas da aplicação
 *
 * Este arquivo centraliza todas as rotas da aplicação (frontend e API) para facilitar
 * manutenção e refatoração. Sempre use estas rotas em vez de strings hardcoded.
 */

// Tipos para melhor suporte TypeScript
export type RouteParams = Record<string, string | number>

// Função utilitária para validar IDs
const validateId = (id: string): string => {
  if (!id || id.trim() === '') {
    throw new Error('ID é obrigatório')
  }
  return id.trim()
}

// Função utilitária para validar tokens
const validateToken = (token: string): string => {
  if (!token || token.trim() === '') {
    throw new Error('Token é obrigatório')
  }
  return token.trim()
}

export const routes = {
  // Rotas do Frontend (páginas)
  frontend: {
    home: '/',
    localizacao: '/localizacao',
    presentes: '/presentes',
    mensagens: '/mensagens',
    confirmacao: '/confirmacao',
    nossamistoria: '/nossa-historia',
    manutencao: '/manutencao',
    confirmacaoToken: (token: string) => `/confirmacao/${validateToken(token)}`,
    // Área administrativa
    admin: {
      home: '/admin',
      convidados: {
        index: '/admin/convidados',
        create: '/admin/convidados/novo',
        edit: (id: string) => `/admin/convidados/${validateId(id)}/editar`,
      },
      presentes: {
        index: '/admin/presentes',
        create: '/admin/presentes/novo',
        edit: (id: string) => `/admin/presentes/${validateId(id)}/editar`,
      },
      chavesPix: {
        index: '/admin/chaves-pix',
        create: '/admin/chaves-pix/novo',
        edit: (id: string) => `/admin/chaves-pix/${validateId(id)}/editar`,
      },
      usuarios: {
        index: '/admin/usuarios',
        create: '/admin/usuarios/novo',
        edit: (id: string) => `/admin/usuarios/${validateId(id)}/editar`,
      },
    },

    // Autenticação
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
    },
  },

  // Rotas da API (backend)
  api: {
    auth: '/api/auth',
    gifts: {
      base: '/api/gifts',
      byId: (id: string) => `/api/gifts/${validateId(id)}`,
    },
    guests: {
      base: '/api/guests',
      byId: (id: string) => `/api/guests/${validateId(id)}`,
      confirm: (token: string) => `/api/guests/${validateToken(token)}/confirm`,
    },
    messages: {
      base: '/api/messages',
      byId: (id: string) => `/api/messages/${validateId(id)}`,
    },
    users: {
      base: '/api/users',
      byId: (id: string) => `/api/users/${validateId(id)}`,
      changePassword: '/api/users/change-password',
    },
    pixkeys: {
      base: '/api/pixkeys',
      byId: (id: string) => `/api/pixkeys/${validateId(id)}`,
    },
  },
}

// Tipos para as rotas
export type FrontendRoutes = typeof routes.frontend
export type ApiRoutes = typeof routes.api
export type AdminRoutes = typeof routes.frontend.admin

// Utilitários para navegação
export const routeUtils = {
  /**
   * Verifica se uma rota é uma rota administrativa
   */
  isAdminRoute: (pathname: string): boolean => {
    return pathname.startsWith('/admin')
  },

  /**
   * Verifica se uma rota é uma rota de API
   */
  isApiRoute: (pathname: string): boolean => {
    return pathname.startsWith('/api')
  },

  /**
   * Extrai o ID de uma rota dinâmica
   * Ex: "/admin/presentes/123/editar" -> "123"
   */
  extractIdFromPath: (pathname: string, baseRoute: string): string | null => {
    const regex = new RegExp(`${baseRoute.replace(/\//g, '\\/')}\\/([^/]+)`)
    const match = pathname.match(regex)
    return match ? match[1] : null
  },

  /**
   * Constrói uma URL com query parameters
   */
  buildUrlWithParams: (baseUrl: string, params: Record<string, string | number>): string => {
    const url = new URL(baseUrl, 'http://localhost') // Base temporária para construção
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value))
    })
    return url.pathname + url.search
  },

  /**
   * Mapeia nomes de páginas para breadcrumbs
   */
  getPageDisplayName: (routeSegment: string): string => {
    const pageMap: Record<string, string> = {
      admin: 'Administração',
      convidados: 'Convidados',
      presentes: 'Lista de Presentes',
      'chaves-pix': 'Chaves PIX',
      usuarios: 'Usuários',
      novo: 'Novo',
      editar: 'Editar',
      mensagens: 'Mensagens',
      localizacao: 'Localização',
      confirmacao: 'Confirmação',
      'nossa-historia': 'Nossa História',
    }
    return pageMap[routeSegment] || routeSegment
  },

  /**
   * Gera breadcrumbs automaticamente baseado no pathname
   */
  generateBreadcrumbs: (pathname: string): Array<{ label: string; href: string }> => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: Array<{ label: string; href: string }> = []

    if (segments[0] === 'admin') {
      breadcrumbs.push({ label: 'Administração', href: routes.frontend.admin.home })

      if (segments[1]) {
        const pageLabel = routeUtils.getPageDisplayName(segments[1])
        breadcrumbs.push({ label: pageLabel, href: `/admin/${segments[1]}` })

        if (segments[2] === 'novo') {
          breadcrumbs.push({ label: 'Novo', href: pathname })
        } else if (segments[3] === 'editar') {
          breadcrumbs.push({ label: 'Editar', href: pathname })
        }
      }
    }

    return breadcrumbs
  },
}

// Constantes para facilitar o uso
export const ADMIN_ROUTES = routes.frontend.admin
export const API_ROUTES = routes.api
export const PUBLIC_ROUTES = {
  home: routes.frontend.home,
  localizacao: routes.frontend.localizacao,
  presentes: routes.frontend.presentes,
  mensagens: routes.frontend.mensagens,
  confirmacao: routes.frontend.confirmacao,
  nossamistoria: routes.frontend.nossamistoria,
  manutencao: routes.frontend.manutencao,
} as const
