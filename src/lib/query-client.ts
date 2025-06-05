import { QueryClient } from '@tanstack/react-query'

// Configuração global do QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache por 5 minutos por padrão
      staleTime: 1000 * 60 * 5,
      // Manter dados em cache por 10 minutos
      gcTime: 1000 * 60 * 10,
      // Retry automático em caso de erro
      retry: 2,
      // Refetch quando a janela ganha foco
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Retry automático para mutations em caso de erro de rede
      retry: 1,
    },
  },
})
