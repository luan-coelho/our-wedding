'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
    id: number
    name: string
    isConfirmed: boolean
  }
}

export default function GuestForm({ guest }: GuestFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const isEditing = !!guest

  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      name: guest?.name || '',
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (data: GuestFormData) => {
      const url = isEditing ? `/api/guests/${guest.id}` : '/api/guests'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ocorreu um erro ao salvar o convidado')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] })
      toast.success(isEditing ? 'Convidado atualizado com sucesso' : 'Convidado adicionado com sucesso')
      router.push('/admin/convidados')
      router.refresh()
    },
    onError: error => {
      toast.error(error instanceof Error ? error.message : 'Ocorreu um erro inesperado')
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
                <Link href="/admin/convidados">Cancelar</Link>
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
