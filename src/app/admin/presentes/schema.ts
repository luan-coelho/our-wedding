import { z } from 'zod'

export const giftSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.string().optional(),
  pixKey: z.string().optional(),
  imageUrl: z.string().min(1, 'URL da imagem é obrigatória'),
})

export type GiftFormData = z.infer<typeof giftSchema>
