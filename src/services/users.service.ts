import { User, UserFormData, ApiError } from '@/types'

// ============================================================================
// USERS SERVICE - Centralized API calls for users domain
// ============================================================================

const BASE_URL = '/api/users'

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
 * Busca todos os usuários
 */
export async function getUsers(): Promise<User[]> {
  const response = await fetch(BASE_URL)
  return handleApiResponse<User[]>(response)
}

/**
 * Busca um usuário específico por ID
 */
export async function getUserById(id: string): Promise<User> {
  const response = await fetch(`${BASE_URL}/${id}`)
  return handleApiResponse<User>(response)
}

/**
 * Cria um novo usuário
 */
export async function createUser(data: UserFormData): Promise<User> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return handleApiResponse<User>(response)
}

/**
 * Atualiza um usuário existente
 */
export async function updateUser(id: string, data: Partial<UserFormData>): Promise<User> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return handleApiResponse<User>(response)
}

/**
 * Exclui um usuário
 */
export async function deleteUser(id: string): Promise<{ message: string }> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
  return handleApiResponse<{ message: string }>(response)
}

/**
 * Altera a senha de um usuário
 */
export async function changeUserPassword(data: {
  currentPassword: string
  newPassword: string
}): Promise<{ message: string }> {
  const response = await fetch(`${BASE_URL}/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return handleApiResponse<{ message: string }>(response)
}

/**
 * Atualiza permissões de um usuário
 */
export async function updateUserPermissions(id: string, data: { role: string }): Promise<User> {
  const response = await fetch(`${BASE_URL}/${id}/permissions`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return handleApiResponse<User>(response)
}

// ============================================================================
// USERS SERVICE OBJECT - Exportação organizada de todas as funções
// ============================================================================

export const usersService = {
  getAll: getUsers,
  getById: getUserById,
  create: createUser,
  update: updateUser,
  delete: deleteUser,
  changePassword: changeUserPassword,
  updatePermissions: updateUserPermissions,
} as const
