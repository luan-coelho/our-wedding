'use client'

import { AdminProtected } from '@/components/roles'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { queryClient } from '@/lib/query-client'
import { routes } from '@/lib/routes'
import { giftsService, pixKeysService } from '@/services'
import { Gift, PixKey } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Eye, X } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { GiftFormData, giftSchema } from '../../schema'

// Tipo para a resposta da API que inclui o join com pix-key
type GiftWithPixKey = {
  gift: Gift
  'pix-key': PixKey | null
}

export default function EditGiftPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const id = params.id as string

  const form = useForm<GiftFormData>({
    resolver: zodResolver(giftSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      pixKey: '',
      selectedPixKeyId: '',
      imageUrl: '',
    },
  })

  // Consulta para buscar os dados do presente
  const {
    data: gift,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['gift', id],
    queryFn: () => giftsService.getById(id),
    enabled: !!id, // Só executa a query se tiver o ID
  })

  // Consulta para buscar as chaves PIX
  const { data: pixKeys = [], isLoading: isLoadingPixKeys } = useQuery({
    queryKey: ['pixKeys'],
    queryFn: pixKeysService.getAll,
  })

  // Atualiza o formulário quando os dados são carregados
  useEffect(() => {
    if (gift) {
      // A API retorna uma estrutura com leftJoin: { gift: {...}, "pix-key": {...} }
      // Vamos acessar o objeto gift corretamente
      const giftData = (gift as GiftWithPixKey).gift

      // Formata o preço para o formato brasileiro
      const formattedPrice = giftData.price
        ? giftData.price.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : ''

      // Preenche o formulário com os dados do presente
      const formData = {
        name: giftData.name || '',
        description: giftData.description || '',
        price: formattedPrice,
        pixKey: giftData.pixKey || '',
        selectedPixKeyId: giftData.pixKeyId ? String(giftData.pixKeyId) : '',
        imageUrl: giftData.imageUrl || '',
      }

      form.reset(formData)

      // Mostra a prévia da imagem se houver uma URL
      if (giftData.imageUrl) {
        setImagePreview(giftData.imageUrl)
      }
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
    mutationFn: (data: GiftFormData) => giftsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] })
      queryClient.invalidateQueries({ queryKey: ['gift', id] })
      toast.success('Presente atualizado com sucesso')
      router.push(routes.frontend.admin.presentes.index)
    },
    onError: (error: Error) => {
      console.error('Erro ao atualizar presente:', error)
      toast.error(error.message || 'Ocorreu um erro ao atualizar o presente')
    },
  })

  // Função para formatar valor como moeda
  function formatAsCurrency(value: string) {
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

  function onSubmit(formData: GiftFormData) {
    // Converter preço para número
    const processedData = {
      ...formData,
      price: formData.price ? parseFloat(formData.price.replace(/\./g, '').replace(',', '.')) : null,
      // Se estiver usando chave personalizada, limpar o ID de chave selecionada
      // Garantir que pixKeyId seja null se for string vazia ou undefined
      pixKeyId: formData.pixKey
        ? null
        : formData.selectedPixKeyId && formData.selectedPixKeyId.trim() !== ''
          ? formData.selectedPixKeyId
          : null,
    }

    console.log('Dados do formulário antes do processamento:', formData)
    console.log('Dados processados para envio:', processedData)

    updateMutation.mutate(processedData as unknown as GiftFormData)
  }

  // Função para exibir a prévia da imagem
  function handleShowImagePreview() {
    const imageUrl = form.getValues('imageUrl')
    const fieldError = form.formState.errors.imageUrl

    if (!imageUrl) {
      toast.error('Por favor, insira uma URL de imagem para visualizar')
      setImagePreview(null)
      return
    }

    if (fieldError) {
      toast.error('Por favor, corrija os erros na URL antes de visualizar')
      setImagePreview(null)
      return
    }

    // Trigger validation before showing preview
    form.trigger('imageUrl').then(isValid => {
      if (isValid) {
        setImagePreview(imageUrl)
        toast.success('Carregando prévia da imagem...')
      } else {
        toast.error('URL de imagem inválida')
        setImagePreview(null)
      }
    })
  }

  // Função para limpar a prévia da imagem
  function handleClearImagePreview() {
    setImagePreview(null)
  }

  // Função para lidar com erros de carregamento de imagem
  function handleImageError() {
    if (imagePreview) {
      toast.error('Não foi possível carregar a imagem. Verifique se a URL está correta e acessível.')
      setImagePreview(null)
    }
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
          <Button variant="secondary" onClick={() => router.push(routes.frontend.admin.presentes.index)}>
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
                          <Input
                            placeholder="Informar chave PIX personalizada"
                            {...field}
                            onChange={e => {
                              field.onChange(e)
                              // Limpa a seleção de chave PIX quando usar chave personalizada
                              if (e.target.value) {
                                form.setValue('selectedPixKeyId', '')
                              }
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Ou selecionar entre chaves cadastradas */}
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-3">Ou selecione uma chave cadastrada:</p>

                    {isLoadingPixKeys ? (
                      <p className="text-sm text-muted-foreground">Carregando chaves PIX...</p>
                    ) : pixKeys.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Nenhuma chave PIX cadastrada.{' '}
                        <a href={routes.frontend.admin.chavesPix.index} className="text-primary hover:underline">
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
                                onValueChange={value => {
                                  field.onChange(value || '')
                                  // Limpa a chave personalizada quando selecionar uma chave
                                  if (value) {
                                    form.setValue('pixKey', '')
                                  }
                                }}
                                value={field.value || ''}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Selecione uma chave PIX" />
                                </SelectTrigger>
                                <SelectContent>
                                  {pixKeys.map(pixKey => (
                                    <SelectItem key={pixKey.id} value={String(pixKey.id)}>
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
                </div>

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => {
                    const fieldError = form.formState.errors.imageUrl
                    const hasError = !!fieldError
                    const isValid = field.value && !hasError && field.value.length > 0

                    return (
                      <FormItem>
                        <FormLabel>URL da Imagem *</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://exemplo.com/imagem.jpg"
                              className={hasError ? 'border-red-500' : isValid ? 'border-green-500' : ''}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleShowImagePreview}
                            disabled={!field.value || hasError}
                            title="Visualizar imagem">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Validation feedback */}
                        <div className="text-sm space-y-1">
                          {hasError ? (
                            <FormMessage />
                          ) : field.value && field.value.length > 0 ? (
                            <p className="text-green-600 flex items-center gap-1">
                              <span className="w-1 h-1 bg-green-600 rounded-full"></span>
                              URL válida
                            </p>
                          ) : (
                            <div className="text-gray-500 space-y-1">
                              <p>A URL deve:</p>
                              <ul className="text-xs space-y-0.5 ml-4">
                                <li>• Começar com http:// ou https://</li>
                                <li>• Apontar para um arquivo de imagem (.jpg, .jpeg, .png, .gif, .webp, .svg)</li>
                                <li>• Exemplo: https://exemplo.com/imagem.jpg</li>
                              </ul>
                            </div>
                          )}
                        </div>

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
                              <Image
                                src={imagePreview}
                                alt="Prévia da imagem"
                                className="rounded-md object-contain w-full h-full"
                                onError={handleImageError}
                                width={1920}
                                height={1080}
                              />
                            </div>
                          </div>
                        )}
                      </FormItem>
                    )
                  }}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push(routes.frontend.admin.presentes.index)}
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
