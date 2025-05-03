import { z } from 'zod'

export const giftSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.string().optional(),
  pixKey: z.string().optional(),
  selectedPixKeyId: z.number().optional(),
  imageUrl: z.string().min(1, 'URL da imagem é obrigatória'),
})

export type GiftFormData = z.infer<typeof giftSchema>

export const pixKeySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  key: z.string().min(1, 'Chave PIX é obrigatória'),
  type: z.enum(['CPF', 'CNPJ', 'EMAIL', 'TELEFONE', 'ALEATORIA']),
})

export type PixKeyFormData = z.infer<typeof pixKeySchema>
