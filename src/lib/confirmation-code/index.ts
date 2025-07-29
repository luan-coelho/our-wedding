import { db } from '@/db'
import { tableGuests } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Gera um código de confirmação de 6 dígitos
 */
function generateRandomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Verifica se o código já existe no banco de dados
 */
async function codeExists(code: string): Promise<boolean> {
  const existingGuest = await db
    .select()
    .from(tableGuests)
    .where(eq(tableGuests.confirmationCode, code))
    .limit(1)
    .then(results => results[0] || null)

  return !!existingGuest
}

/**
 * Gera um código de confirmação único
 * Tenta até 10 vezes antes de falhar
 */
export async function generateUniqueConfirmationCode(): Promise<string> {
  let attempts = 0
  const maxAttempts = 10

  while (attempts < maxAttempts) {
    const code = generateRandomCode()
    const exists = await codeExists(code)

    if (!exists) {
      return code
    }

    attempts++
  }

  throw new Error('Não foi possível gerar um código de confirmação único após 10 tentativas')
}

/**
 * Valida se o código tem o formato correto (6 dígitos)
 */
export function validateConfirmationCode(code: string): boolean {
  return /^\d{6}$/.test(code)
}
