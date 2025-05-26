/**
 * Rotas centralizadas da aplicação
 */

export const routes = {
  // Rotas do Frontend (páginas)
  frontend: {
    home: '/',
    localizacao: '/localizacao',
    presentes: '/presentes',
    mensagens: '/mensagens',
    confirmacao: '/confirmacao',
    // Área administrativa
    admin: {
      home: '/admin',
      convidados: {
        index: '/admin/convidados',
        create: '/admin/convidados/novo',
        edit: (id: string) => `/admin/convidados/${id}/editar`,
      },
      presentes: {
        index: '/admin/presentes',
        create: '/admin/presentes/novo',
        edit: (id: string) => `/admin/presentes/${id}/editar`,
      },
      chavesPix: {
        index: '/admin/chaves-pix',
      },
      usuarios: {
        index: '/admin/usuarios',
      },
    },

    // Autenticação
    auth: {
      login: '/auth/login',
    },
  },

  // Rotas da API (backend)
  api: {
    auth: '/api/auth',
    gifts: {
      base: '/api/gifts',
      byId: (id: string) => `/api/gifts/${id}`,
    },
    guests: {
      base: '/api/guests',
      byId: (id: string) => `/api/guests/${id}`,
      confirm: (token: string) => `/api/guests/${token}/confirm`,
    },
    messages: '/api/messages',
    confirmacao: {
      byToken: (token: string) => `/api/confirmacao/${token}`,
    },
    users: {
      base: '/api/users',
      changePassword: '/api/users/change-password',
    },
  },
}
