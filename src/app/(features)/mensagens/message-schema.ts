import { z } from 'zod'

export const messageFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
})

export type MessageFormValues = z.infer<typeof messageFormSchema>
