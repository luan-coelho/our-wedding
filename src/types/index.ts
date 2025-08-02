// ============================================================================
// DOMAIN TYPES - Centralized type definitions for all domains
// ============================================================================

// User Domain Types
export interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string
  active: boolean
  createdAt: string
  updatedAt: string | null
}

// Guest Domain Types
export interface Guest {
  id: string
  name: string
  spouse?: string | null
  children: string[]
  companions: string[]
  isConfirmed: boolean
  spouseConfirmation?: boolean
  childrenConfirmations?: Record<string, boolean>
  companionsConfirmations?: Record<string, boolean>
  token: string
  confirmationCode: string
  createdAt: string
  updatedAt: string | null
}

// Gift Domain Types
export interface Gift {
  id: string
  name: string
  description: string
  price: number | null
  pixKey: string | null
  pixKeyId: string | null
  imageUrl: string | null
  createdAt?: string
  updatedAt?: string | null
  selectedPixKey?: PixKey | null
}

// API Response type for gift with join
export interface GiftApiResponse {
  gift: Gift
  'pix-key'?: PixKey | null
}

// Message Domain Types
export interface Message {
  id: string
  name: string
  content: string
  createdAt: string
  updatedAt?: string | null
}

// PixKey Domain Types
export interface PixKey {
  id: string
  name: string
  key: string
  type: string
  createdAt: string
  updatedAt?: string | null
}

// ============================================================================
// FORM DATA TYPES - For form validation and submission
// ============================================================================

export interface GiftFormData {
  name: string
  description?: string
  price?: string
  pixKey?: string
  selectedPixKeyId?: string
  imageUrl: string
}

export interface GuestFormData {
  name: string
  spouse?: string
  children: string[]
  companions: string[]
}

export interface PixKeyFormData {
  name: string
  key: string
  type: 'CPF' | 'CNPJ' | 'EMAIL' | 'TELEFONE' | 'ALEATORIA'
}

export interface MessageFormData {
  name: string
  message: string
}

export interface UserFormData {
  name: string
  email: string
  role: string
}

// ============================================================================
// API RESPONSE TYPES - For API responses and error handling
// ============================================================================

export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  error?: string
}

export interface ApiError {
  error: string
  status?: number
}

// ============================================================================
// UTILITY TYPES - Common utility types used across the application
// ============================================================================

export type CreateRequest<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateRequest<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>> & { id: string }

// Statistics Types
export interface DashboardStats {
  gifts: number
  guests: number
  messages: number
  confirmedGuests: number
}
