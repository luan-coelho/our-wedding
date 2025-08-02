import { z } from 'zod'

// Helper function to validate image URLs
const isValidImageUrl = (url: string): boolean => {
  // Check if it's a valid URL format
  try {
    const urlObj = new URL(url)
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false
    }
  } catch {
    return false
  }

  // Check if URL ends with common image extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  const lowercaseUrl = url.toLowerCase()

  // Check for direct image extensions
  if (imageExtensions.some(ext => lowercaseUrl.endsWith(ext))) {
    return true
  }

  // Check for image extensions with query parameters
  const urlWithoutQuery = lowercaseUrl.split('?')[0]
  return imageExtensions.some(ext => urlWithoutQuery.endsWith(ext))
}

export const giftSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.string().optional(),
  pixKey: z.string().optional(),
  selectedPixKeyId: z.string().optional(),
  imageUrl: z
    .string()
    .min(1, 'URL da imagem é obrigatória')
    .refine(
      url => {
        try {
          new URL(url)
          return true
        } catch {
          return false
        }
      },
      {
        message: 'URL deve ser válida e começar com http:// ou https://',
      },
    )
    .refine(
      url => {
        try {
          const urlObj = new URL(url)
          return ['http:', 'https:'].includes(urlObj.protocol)
        } catch {
          return false
        }
      },
      {
        message: 'URL deve começar com http:// ou https://',
      },
    )
    .refine(url => isValidImageUrl(url), {
      message: 'URL deve apontar para um arquivo de imagem (.jpg, .jpeg, .png, .gif, .webp, .svg)',
    }),
})

export type GiftFormData = z.infer<typeof giftSchema>

export const pixKeySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  key: z.string().min(1, 'Chave PIX é obrigatória'),
  type: z.enum(['CPF', 'CNPJ', 'EMAIL', 'TELEFONE', 'ALEATORIA']),
})

export type PixKeyFormData = z.infer<typeof pixKeySchema>
