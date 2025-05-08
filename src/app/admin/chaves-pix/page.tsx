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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PixKeyFormData, pixKeySchema } from '../presentes/schema'

type PixKey = {
  id: number
  name: string
  key: string
  type: string
  createdAt: string
}

export default function ChavesPixPage() {
  const queryClient = useQueryClient()
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

  // Consulta para buscar as chaves PIX
  const { data: pixKeys = [], isLoading } = useQuery<PixKey[]>({
    queryKey: ['pixKeys'],
    queryFn: async () => {
      const response = await fetch('/api/pixkeys')
      if (!response.ok) {
        throw new Error('Erro ao buscar chaves PIX')
      }
      return response.json()
    },
  })

  // Mutação para criar nova chave PIX
  const createPixKeyMutation = useMutation({
    mutationFn: async (data: PixKeyFormData) => {
      const response = await fetch('/api/pixkeys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar chave PIX')
      }

      return response.json()
    },
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
    mutationFn: async (data: PixKeyFormData & { id: number }) => {
      const response = await fetch('/api/pixkeys', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar chave PIX')
      }

      return response.json()
    },
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
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/pixkeys?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao excluir chave PIX')
      }

      return response.json()
    },
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
                            <Input placeholder="Digite a chave PIX" {...field} />
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
                      <Input placeholder="Digite a chave PIX" {...field} />
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
