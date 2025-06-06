import { PixKey, PixKeyFormData, ApiError } from '@/types'

// ============================================================================
// PIXKEYS SERVICE - Centralized API calls for pixkeys domain
// ============================================================================

const BASE_URL = '/api/pixkeys'

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
 * Busca todas as chaves PIX
 */
export async function getPixKeys(): Promise<PixKey[]> {
  const response = await fetch(BASE_URL)
  return handleApiResponse<PixKey[]>(response)
}

/**
 * Busca uma chave PIX específica por ID
 */
export async function getPixKeyById(id: string): Promise<PixKey> {
  const response = await fetch(`${BASE_URL}/${id}`)
  return handleApiResponse<PixKey>(response)
}

/**
 * Cria uma nova chave PIX
 */
export async function createPixKey(data: PixKeyFormData): Promise<PixKey> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return handleApiResponse<PixKey>(response)
}

/**
 * Atualiza uma chave PIX existente
 */
export async function updatePixKey(id: string, data: PixKeyFormData): Promise<PixKey> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return handleApiResponse<PixKey>(response)
}

/**
 * Exclui uma chave PIX
 */
export async function deletePixKey(id: string): Promise<{ message: string }> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
  return handleApiResponse<{ message: string }>(response)
}

// ============================================================================
// PIXKEYS SERVICE OBJECT - Exportação organizada de todas as funções
// ============================================================================

export const pixKeysService = {
  getAll: getPixKeys,
  getById: getPixKeyById,
  create: createPixKey,
  update: updatePixKey,
  delete: deletePixKey,
} as const
