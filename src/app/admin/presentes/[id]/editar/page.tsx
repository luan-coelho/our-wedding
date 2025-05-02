'use client'

import AdminProtected from '@/components/AdminProtected'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GiftFormData, giftSchema } from '../../schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useEffect } from 'react'

interface Gift {
  id: number
  name: string
  description: string
  price: number | null
  pixKey: string | null
  imageUrl: string | null
}

export default function EditGiftPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const id = parseInt(params.id as string)

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

  // Consulta para buscar os dados do presente
  const { data: gift, isLoading, error } = useQuery({
    queryKey: ['gift', id],
    queryFn: async (): Promise<Gift> => {
      const response = await fetch(`/api/gifts/${id}`)
      if (!response.ok) {
        throw new Error('Falha ao carregar o presente')
      }
      return response.json()
    }
  })

  // Atualiza o formulário quando os dados são carregados
  useEffect(() => {
    if (gift) {
      // Formata o preço para o formato brasileiro
      const formattedPrice = gift.price
        ? gift.price.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : ''

      // Preenche o formulário com os dados do presente
      form.reset({
        name: gift.name || '',
        description: gift.description || '',
        price: formattedPrice,
        pixKey: gift.pixKey || '',
        imageUrl: gift.imageUrl || '',
      })
    }
  }, [gift, form])

  // Exibe erro se houver problema ao carregar
  useEffect(() => {
    if (error) {
      console.error('Erro ao buscar presente:', error)
      toast.error('Não foi possível carregar os dados do presente')
    }
  }, [error])

  // Mutation para atualizar presente
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/gifts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar presente')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] })
      queryClient.invalidateQueries({ queryKey: ['gift', id] })
      toast.success('Presente atualizado com sucesso')
      router.push('/admin/presentes')
    },
    onError: (error: Error) => {
      console.error('Erro ao atualizar presente:', error)
      toast.error(error.message || 'Ocorreu um erro ao atualizar o presente')
    }
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

  const onSubmit = (formData: GiftFormData) => {
    // Converter preço para número
    const processedData = {
      ...formData,
      price: formData.price ? parseFloat(formData.price.replace(/\./g, '').replace(',', '.')) : null,
    }

    updateMutation.mutate(processedData)
  }

  if (isLoading) {
    return (
      <AdminProtected>
        <div className="container mx-auto p-4">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Carregando...</p>
          </div>
        </div>
      </AdminProtected>
    )
  }

  return (
    <AdminProtected>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Editar Presente</h1>
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
                    disabled={updateMutation.isPending}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
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
