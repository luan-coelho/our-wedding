import { Message, MessageFormData, ApiError } from '@/types'

// ============================================================================
// MESSAGES SERVICE - Centralized API calls for messages domain
// ============================================================================

const BASE_URL = '/api/messages'

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
 * Busca todas as mensagens
 */
export async function getMessages(): Promise<Message[]> {
  const response = await fetch(BASE_URL)
  return handleApiResponse<Message[]>(response)
}

/**
 * Busca uma mensagem específica por ID
 */
export async function getMessageById(id: string): Promise<Message> {
  const response = await fetch(`${BASE_URL}/${id}`)
  return handleApiResponse<Message>(response)
}

/**
 * Cria uma nova mensagem
 */
export async function createMessage(data: MessageFormData): Promise<Message> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return handleApiResponse<Message>(response)
}

/**
 * Atualiza uma mensagem existente
 */
export async function updateMessage(id: string, data: Partial<MessageFormData>): Promise<Message> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return handleApiResponse<Message>(response)
}

/**
 * Exclui uma mensagem
 */
export async function deleteMessage(id: string): Promise<{ message: string }> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
  return handleApiResponse<{ message: string }>(response)
}

// ============================================================================
// MESSAGES SERVICE OBJECT - Exportação organizada de todas as funções
// ============================================================================

export const messagesService = {
  getAll: getMessages,
  getById: getMessageById,
  create: createMessage,
  update: updateMessage,
  delete: deleteMessage,
} as const
