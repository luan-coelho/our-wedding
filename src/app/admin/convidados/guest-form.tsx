'use client'

import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { guestsService } from '@/services'
import { routes } from '@/lib/routes'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { GuestFormData, guestSchema } from './schema'

interface GuestFormProps {
  guest?: {
    id: string
    name: string
    isConfirmed: boolean
  }
}

export default function GuestForm({ guest }: GuestFormProps) {
  const router = useRouter()
  const isEditing = !!guest

  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      name: guest?.name || '',
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (data: GuestFormData) => {
      try {
        if (isEditing && guest?.id) {
          return await guestsService.update(guest.id, data)
        } else {
          return await guestsService.create(data)
        }
      } catch (error: any) {
        // Se for erro de nome duplicado (409), definir erro no campo específico
        if (error.status === 409) {
          form.setError('name', {
            type: 'manual',
            message: error.error,
          })
          throw new Error('Nome duplicado')
        }
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] })
      queryClient.invalidateQueries({ queryKey: ['guest'] })
      toast.success(isEditing ? 'Convidado atualizado com sucesso' : 'Convidado adicionado com sucesso')
      router.push(routes.frontend.admin.convidados.index)
      router.refresh()
    },
    onError: error => {
      // Só mostrar toast se não for erro de nome duplicado (que já é mostrado no campo)
      if (error instanceof Error && error.message !== 'Nome duplicado') {
        toast.error(error.message)
      }
    },
  })

  const onSubmit = (data: GuestFormData) => {
    saveMutation.mutate(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formulário</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome do convidado" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Button asChild variant="outline">
                <Link href={routes.frontend.admin.convidados.index}>Cancelar</Link>
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Salvando...' : isEditing ? 'Atualizar' : 'Adicionar'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
