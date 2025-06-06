import { z } from 'zod'

export const guestSchema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .trim()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  spouse: z.string()
    .trim()
    .max(100, 'Nome do cônjuge deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  children: z.array(z.string()
    .trim()
    .min(1, 'Nome do filho não pode estar vazio')
    .max(100, 'Nome do filho deve ter no máximo 100 caracteres')
  ).default([]),
  companions: z.array(z.string()
    .trim()
    .min(1, 'Nome do acompanhante não pode estar vazio')
    .max(100, 'Nome do acompanhante deve ter no máximo 100 caracteres')
  ).default([]),

})

export type GuestFormData = z.infer<typeof guestSchema>
