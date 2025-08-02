import { Gift, GiftFormData, ApiError } from '@/types'

// ============================================================================
// GIFTS SERVICE - Centralized API calls for gifts domain
// ============================================================================

const BASE_URL = '/api/gifts'

/**
 * Tratamento de erro padronizado para todas as chamadas de API
 */
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const error: ApiError = {
      error: errorData.error || `HTTP Error: ${response.status}`,
      status: response.status,
    }
    throw error
  }
  return response.json()
}

/**
 * Busca todos os presentes
 */
export async function getGifts(): Promise<Gift[]> {
  const response = await fetch(BASE_URL)
  return handleApiResponse<Gift[]>(response)
}

/**
 * Busca um presente específico por ID
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getGiftById(id: string): Promise<any> {
  const response = await fetch(`${BASE_URL}/${id}`)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return handleApiResponse<any>(response)
}

/**
 * Cria um novo presente
 */
export async function createGift(data: GiftFormData): Promise<Gift> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return handleApiResponse<Gift>(response)
}

/**
 * Atualiza um presente existente
 */
export async function updateGift(id: string, data: GiftFormData): Promise<Gift> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return handleApiResponse<Gift>(response)
}

/**
 * Exclui um presente
 */
export async function deleteGift(id: string): Promise<{ message: string }> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
  return handleApiResponse<{ message: string }>(response)
}

// ============================================================================
// GIFTS SERVICE OBJECT - Exportação organizada de todas as funções
// ============================================================================

export const giftsService = {
  getAll: getGifts,
  getById: getGiftById,
  create: createGift,
  update: updateGift,
  delete: deleteGift,
} as const
