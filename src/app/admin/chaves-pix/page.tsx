'use client'

import { AdminProtected } from '@/components/roles'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { pixKeysService } from '@/services'
import { PixKey } from '@/types'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PixKeyFormData, pixKeySchema } from '../presentes/schema'

// Funções utilitárias para formatação de máscaras
const formatCPF = (value: string) => {
  const numericValue = value.replace(/\D/g, '')
  if (numericValue.length <= 11) {
    return numericValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  return numericValue.slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

const formatCNPJ = (value: string) => {
  const numericValue = value.replace(/\D/g, '')
  if (numericValue.length <= 14) {
    return numericValue
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
  }
  return numericValue.slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}

const formatPhone = (value: string) => {
  const numericValue = value.replace(/\D/g, '')
  if (numericValue.length <= 11) {
    return numericValue
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
  }
  return numericValue.slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
}

// Função para aplicar máscara baseada no tipo
const applyMask = (value: string, type: string) => {
  switch (type) {
    case 'CPF':
      return formatCPF(value)
    case 'CNPJ':
      return formatCNPJ(value)
    case 'TELEFONE':
      return formatPhone(value)
    case 'EMAIL':
    case 'ALEATORIA':
    default:
      return value
  }
}

// Função para obter placeholder baseado no tipo
const getPlaceholder = (type: string) => {
  switch (type) {
    case 'CPF':
      return '000.000.000-00'
    case 'CNPJ':
      return '00.000.000/0000-00'
    case 'TELEFONE':
      return '(00) 00000-0000'
    case 'EMAIL':
      return 'exemplo@email.com'
    case 'ALEATORIA':
      return 'Chave aleatória gerada pelo banco'
    default:
      return 'Digite a chave PIX'
  }
}

export default function ChavesPixPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPixKey, setSelectedPixKey] = useState<PixKey | null>(null)

  const form = useForm<PixKeyFormData>({
    resolver: zodResolver(pixKeySchema),
    defaultValues: {
      name: '',
      key: '',
      type: 'CPF',
    },
  })

  const editForm = useForm<PixKeyFormData>({
    resolver: zodResolver(pixKeySchema),
    defaultValues: {
      name: '',
      key: '',
      type: 'CPF',
    },
  })

  // Watch para mudanças no tipo de chave no formulário de criação
  const watchedType = form.watch('type')
  const watchedEditType = editForm.watch('type')

  // Limpar o campo de chave quando o tipo mudar no formulário de criação
  useEffect(() => {
    form.setValue('key', '')
  }, [watchedType, form])

  // Limpar o campo de chave quando o tipo mudar no formulário de edição
  useEffect(() => {
    if (isEditDialogOpen) {
      const currentKey = editForm.getValues('key')
      const maskedKey = applyMask(currentKey, watchedEditType)
      if (currentKey !== maskedKey) {
        editForm.setValue('key', maskedKey)
      }
    }
  }, [watchedEditType, editForm, isEditDialogOpen])

  // Consulta para buscar as chaves PIX
  const { data: pixKeys = [], isLoading } = useQuery<PixKey[]>({
    queryKey: ['pixKeys'],
    queryFn: pixKeysService.getAll,
  })

  // Mutação para criar nova chave PIX
  const createPixKeyMutation = useMutation({
    mutationFn: pixKeysService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pixKeys'] })
      setIsAddDialogOpen(false)
      form.reset()
      toast.success('Chave PIX cadastrada com sucesso')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao cadastrar chave PIX')
    },
  })

  // Mutação para atualizar chave PIX
  const updatePixKeyMutation = useMutation({
    mutationFn: (data: PixKeyFormData & { id: string | number }) =>
      pixKeysService.update(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pixKeys'] })
      setIsEditDialogOpen(false)
      setSelectedPixKey(null)
      editForm.reset()
      toast.success('Chave PIX atualizada com sucesso')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar chave PIX')
    },
  })

  // Mutação para excluir chave PIX
  const deletePixKeyMutation = useMutation({
    mutationFn: pixKeysService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pixKeys'] })
      setIsDeleteDialogOpen(false)
      setSelectedPixKey(null)
      toast.success('Chave PIX excluída com sucesso')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao excluir chave PIX')
    },
  })

  const onSubmit = (data: PixKeyFormData) => {
    createPixKeyMutation.mutate(data)
  }

  const onEditSubmit = (data: PixKeyFormData) => {
    if (selectedPixKey) {
      updatePixKeyMutation.mutate({ ...data, id: selectedPixKey.id })
    }
  }

  const handleEditClick = (pixKey: PixKey) => {
    setSelectedPixKey(pixKey)
    editForm.reset({
      name: pixKey.name,
      key: pixKey.key,
      type: pixKey.type as 'CPF' | 'CNPJ' | 'EMAIL' | 'TELEFONE' | 'ALEATORIA',
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (pixKey: PixKey) => {
    setSelectedPixKey(pixKey)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedPixKey) {
      deletePixKeyMutation.mutate(selectedPixKey.id)
    }
  }

  const getPixKeyTypeLabel = (type: string) => {
    const types = {
      CPF: 'CPF',
      CNPJ: 'CNPJ',
      EMAIL: 'E-mail',
      TELEFONE: 'Telefone',
      ALEATORIA: 'Aleatória',
    }
    return types[type as keyof typeof types] || type
  }

  return (
    <AdminProtected>
      <div className="container mx-auto px-4 mt-10">
        <Card className="rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl font-bold">Chaves PIX</CardTitle>
            <AlertDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button>Adicionar Chave PIX</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Nova Chave PIX</AlertDialogTitle>
                  <AlertDialogDescription>Preencha os dados para cadastrar uma nova chave PIX.</AlertDialogDescription>
                </AlertDialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: PIX Noivo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave PIX *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={getPlaceholder(form.watch('type'))}
                              {...field}
                              onChange={(e) => {
                                const maskedValue = applyMask(e.target.value, form.watch('type'))
                                field.onChange(maskedValue)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Chave *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo de chave" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="CPF">CPF</SelectItem>
                              <SelectItem value="CNPJ">CNPJ</SelectItem>
                              <SelectItem value="EMAIL">E-mail</SelectItem>
                              <SelectItem value="TELEFONE">Telefone</SelectItem>
                              <SelectItem value="ALEATORIA">Aleatória</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction type="submit" disabled={createPixKeyMutation.isPending}>
                        {createPixKeyMutation.isPending ? 'Salvando...' : 'Salvar'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </form>
                </Form>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : !pixKeys || pixKeys.length === 0 ? (
              <div className="text-center py-4">Nenhuma chave PIX cadastrada</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Chave</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pixKeys.map(pixKey => (
                      <TableRow key={pixKey.id}>
                        <TableCell>{pixKey.name}</TableCell>
                        <TableCell>{pixKey.key}</TableCell>
                        <TableCell>{getPixKeyTypeLabel(pixKey.type)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button onClick={() => handleEditClick(pixKey)} variant="outline" size="sm">
                              Editar
                            </Button>
                            <Button onClick={() => handleDeleteClick(pixKey)} variant="destructive" size="sm">
                              Excluir
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Edição */}
      <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Chave PIX</AlertDialogTitle>
            <AlertDialogDescription>Altere os dados da chave PIX.</AlertDialogDescription>
          </AlertDialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: PIX Noivo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chave PIX *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={getPlaceholder(editForm.watch('type'))}
                        {...field}
                        onChange={(e) => {
                          const maskedValue = applyMask(e.target.value, editForm.watch('type'))
                          field.onChange(maskedValue)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Chave *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de chave" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CPF">CPF</SelectItem>
                        <SelectItem value="CNPJ">CNPJ</SelectItem>
                        <SelectItem value="EMAIL">E-mail</SelectItem>
                        <SelectItem value="TELEFONE">Telefone</SelectItem>
                        <SelectItem value="ALEATORIA">Aleatória</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction type="submit" disabled={updatePixKeyMutation.isPending}>
                  {updatePixKeyMutation.isPending ? 'Salvando...' : 'Salvar'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a chave PIX "{selectedPixKey?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deletePixKeyMutation.isPending}
              className="bg-red-600 hover:bg-red-700">
              {deletePixKeyMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminProtected>
  )
}
