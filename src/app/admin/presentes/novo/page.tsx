'use client'

import AdminProtected from '@/components/AdminProtected'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { GiftFormData, giftSchema } from '../schema'
import { Textarea } from '@/components/ui/textarea'

export default function AddGiftPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<GiftFormData>({
    resolver: zodResolver(giftSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      pixKey: '',
      imageUrl: '',
    },
  })

  // Mutação para criar um novo presente
  const createGiftMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/gifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar presente')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidar queries para forçar recarregamento de dados
      queryClient.invalidateQueries({ queryKey: ['gifts'] })
      // Redirecionar para a página de gerenciamento após sucesso
      router.push('/admin/presentes')
    },
    onError: error => {
      console.error('Erro ao criar presente:', error)
    },
  })

  // Função para formatar valor como moeda
  const formatAsCurrency = (value: string) => {
    // Remove qualquer caractere que não seja número
    const numericValue = value.replace(/\D/g, '')

    // Converte para número e formata como moeda brasileira
    if (numericValue) {
      const floatValue = parseInt(numericValue) / 100
      return floatValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    }
    return ''
  }

  // Handler para submissão do formulário
  const onSubmit = (formData: GiftFormData) => {
    // Converter preço para número
    const processedData = {
      ...formData,
      price: formData.price ? parseFloat(formData.price.replace(/\./g, '').replace(',', '.')) : null,
    }

    createGiftMutation.mutate(processedData)
  }

  return (
    <AdminProtected>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Adicionar Novo Presente</h1>
          <Button variant="secondary" onClick={() => router.push('/admin/presentes')}>
            Voltar
          </Button>
        </div>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Informações do Presente</CardTitle>
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="0,00"
                          onChange={e => {
                            const formattedValue = formatAsCurrency(e.target.value)
                            field.onChange(formattedValue)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pixKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chave PIX</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push('/admin/presentes')}
                    disabled={createGiftMutation.isPending}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createGiftMutation.isPending}>
                    {createGiftMutation.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AdminProtected>
  )
}
