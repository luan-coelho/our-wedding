import { Guest, GuestFormData } from '@/types'
import { routes } from '@/lib/routes'

// ============================================================================
// GUESTS SERVICE - Centralized API calls for guests domain
// ============================================================================

const BASE_URL = routes.api.guests.base

/**
 * Tratamento de erro padronizado para todas as chamadas de API
 */
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw {
      error: errorData.error || `HTTP Error: ${response.status}`,
      status: response.status,
    }
  }
  return response.json()
}

/**
 * Busca todos os convidados
 */
export async function getGuests(): Promise<Guest[]> {
  const response = await fetch(BASE_URL)
  return handleApiResponse<Guest[]>(response)
}

/**
 * Busca um convidado específico por ID
 */
export async function getGuestById(id: string): Promise<Guest> {
  const response = await fetch(`${BASE_URL}/${id}`)
  return handleApiResponse<Guest>(response)
}

/**
 * Cria um novo convidado
 */
export async function createGuest(data: GuestFormData): Promise<Guest> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return handleApiResponse<Guest>(response)
}

/**
 * Atualiza um convidado existente
 */
export async function updateGuest(id: string, data: GuestFormData): Promise<Guest> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return handleApiResponse<Guest>(response)
}

/**
 * Exclui um convidado
 */
export async function deleteGuest(id: string): Promise<{ message: string }> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
  return handleApiResponse<{ message: string }>(response)
}

/**
 * Confirma presença de um convidado usando token
 */
export async function confirmGuest(token: string): Promise<{ message: string }> {
  const response = await fetch(`${BASE_URL}/${token}/confirm`, {
    method: 'POST',
  })
  return handleApiResponse<{ message: string }>(response)
}

/**
 * Importa múltiplos convidados em lote
 */
export async function bulkImportGuests(names: string[]): Promise<{
  imported: Guest[]
  duplicates: string[]
  errors: { name: string; error: string }[]
}> {
  const response = await fetch(`${BASE_URL}/bulk-import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ names }),
  })
  return handleApiResponse<{
    imported: Guest[]
    duplicates: string[]
    errors: { name: string; error: string }[]
  }>(response)
}

// ============================================================================
// GUESTS SERVICE OBJECT - Exportação organizada de todas as funções
// ============================================================================

export const guestsService = {
  getAll: getGuests,
  getById: getGuestById,
  create: createGuest,
  update: updateGuest,
  delete: deleteGuest,
  confirm: confirmGuest,
  bulkImport: bulkImportGuests,
} as const
