'use client'

import AdminProtected from '@/components/AdminProtected'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { GiftFormData, giftSchema } from '../schema'
import { useState } from 'react'
import { Eye, X } from 'lucide-react'

type PixKey = {
  id: number
  name: string
  key: string
  type: string
}

export default function AddGiftPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const form = useForm<GiftFormData>({
    resolver: zodResolver(giftSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      pixKey: '',
      selectedPixKeyId: undefined,
      imageUrl: '',
    },
  })

  const watchUseCustomPixKey = form.watch('pixKey')

  // Consulta para buscar as chaves PIX
  const { data: pixKeys = [], isLoading: isLoadingPixKeys } = useQuery({
    queryKey: ['pixKeys'],
    queryFn: async () => {
      const response = await fetch('/api/pixkeys')
      if (!response.ok) {
        throw new Error('Erro ao buscar chaves PIX')
      }
      return response.json() as Promise<PixKey[]>
    },
  })

  // Mutação para criar um novo presente
  const createGiftMutation = useMutation({
    mutationFn: async (data: GiftFormData) => {
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
      toast.success('Presente criado com sucesso')
      router.push('/admin/presentes')
    },
    onError: error => {
      console.error('Erro ao criar presente:', error)
      toast.error('Erro ao criar presente')
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
      // Se estiver usando chave personalizada, limpar o ID de chave selecionada
      pixKeyId: formData.pixKey ? null : formData.selectedPixKeyId,
    }

    createGiftMutation.mutate(processedData as unknown as GiftFormData)
  }

  // Função para exibir a prévia da imagem
  const handleShowImagePreview = () => {
    const imageUrl = form.getValues('imageUrl')
    if (imageUrl) {
      setImagePreview(imageUrl)
    } else {
      toast.error('Por favor, insira uma URL de imagem para visualizar')
      setImagePreview(null)
    }
  }

  // Função para limpar a prévia da imagem
  const handleClearImagePreview = () => {
    setImagePreview(null)
  }

  // Função para lidar com erros de carregamento de imagem
  const handleImageError = () => {
    if (imagePreview) {
      toast.error('Não foi possível carregar a imagem a partir da URL fornecida')
      setImagePreview(null)
    }
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

                <div className="space-y-4">
                  <FormLabel>Chave PIX para Transferência</FormLabel>

                  {/* Opção para usar chave personalizada */}
                  <FormField
                    control={form.control}
                    name="pixKey"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Input placeholder="Informar chave PIX personalizada" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Ou selecionar entre chaves cadastradas */}
                  {!watchUseCustomPixKey && (
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground mb-3">Ou selecione uma chave cadastrada:</p>

                      {isLoadingPixKeys ? (
                        <p className="text-sm text-muted-foreground">Carregando chaves PIX...</p>
                      ) : pixKeys.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Nenhuma chave PIX cadastrada.{' '}
                          <a href="/admin/chaves-pix" className="text-primary hover:underline">
                            Cadastrar Chaves PIX
                          </a>
                        </p>
                      ) : (
                        <FormField
                          control={form.control}
                          name="selectedPixKeyId"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select
                                  onValueChange={value => field.onChange(parseInt(value))}
                                  value={field.value?.toString()}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione uma chave PIX" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {pixKeys.map(pixKey => (
                                      <SelectItem key={pixKey.id} value={pixKey.id.toString()}>
                                        {pixKey.name} ({pixKey.key})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleShowImagePreview}
                          title="Visualizar imagem">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                      {imagePreview && (
                        <div className="mt-2 border rounded-md p-2 relative">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 z-10"
                            onClick={handleClearImagePreview}>
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="relative w-full h-48">
                            <img
                              src={imagePreview}
                              alt="Prévia da imagem"
                              className="rounded-md object-contain w-full h-full"
                              onError={handleImageError}
                            />
                          </div>
                        </div>
                      )}
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
