import { z } from 'zod'

export const guestSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
})

export type GuestFormData = z.infer<typeof guestSchema>
