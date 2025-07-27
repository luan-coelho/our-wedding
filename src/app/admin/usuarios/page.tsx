'use client'

import { AdminProtected } from '@/components/roles'
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit, XCircle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { usersService } from '@/services'
import { User, UserFormData } from '@/types'

const permissionSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  role: z.enum(['admin', 'planner', 'guest'], {
    required_error: 'Selecione um perfil',
  }),
})

type FormValues = z.infer<typeof permissionSchema>

export default function UsuariosPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditingUser, setIsEditingUser] = useState<User | null>(null)
  const [userToRemove, setUserToRemove] = useState<User | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'guest',
    },
  })

  // Query para buscar usuários
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAll,
  })

  // Mutation para criar usuário
  const createUserMutation = useMutation({
    mutationFn: usersService.create,
    onSuccess: () => {
      toast.success('Permissão concedida com sucesso')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      handleCloseDialog()
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    },
  })

  // Mutation para atualizar usuário (usando a API atual)
  const updateUserMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar permissão')
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Permissão atualizada com sucesso')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      handleCloseDialog()
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  // Mutation para remover acesso
  const removeAccessMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao remover acesso')
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Acesso removido com sucesso')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setUserToRemove(null)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  // Função para abrir o modal de edição
  const handleEdit = (user: User) => {
    setIsEditingUser(user)
    form.reset({
      name: user.name || '',
      email: user.email || '',
      role: user.role as 'admin' | 'planner' | 'guest',
    })
    setIsDialogOpen(true)
  }

  // Função para fechar o modal
  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setIsEditingUser(null)
    form.reset({
      name: '',
      email: '',
      role: 'guest',
    })
  }

  // Função para remover acesso
  const handleRemoveAccess = (user: User) => {
    setUserToRemove(user)
  }

  const confirmRemoveAccess = () => {
    if (userToRemove && userToRemove.email) {
      removeAccessMutation.mutate(userToRemove.email)
    }
  }

  function onSubmit(data: FormValues) {
    if (isEditingUser) {
      updateUserMutation.mutate(data)
    } else {
      createUserMutation.mutate(data)
    }
  }

  function formatDateTime(dateStr: string) {
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function getRoleName(role: string) {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'planner':
        return 'Cerimonialista'
      case 'guest':
        return 'Visitante'
      default:
        return role
    }
  }

  return (
    <AdminProtected>
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditingUser ? 'Editar Permissão' : 'Gerenciar Permissões'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>O nome do usuário será exibido no sistema</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@exemplo.com"
                        {...field}
                        readOnly={!!isEditingUser}
                        className={isEditingUser ? 'bg-gray-100' : ''}
                      />
                    </FormControl>
                    <FormDescription>
                      O usuário receberá permissão para acessar o sistema com este email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de Acesso</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um nível de acesso" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full">
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="planner">Cerimonialista</SelectItem>
                        <SelectItem value="guest">Visitante</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Cerimonialistas podem apenas visualizar a lista de convidados. Visitantes não têm acesso à área
                      administrativa.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2 justify-end mt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit">{isEditingUser ? 'Salvar Alterações' : 'Conceder Permissão'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!userToRemove} onOpenChange={open => !open && setUserToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover acesso</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o acesso de <strong>{userToRemove?.email || 'este usuário'}</strong>? O
              usuário não poderá mais acessar o sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveAccess} className="bg-red-600 hover:bg-red-700">
              Remover Acesso
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container mx-auto px-4 mt-10">
        <Card className="rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl font-bold">Permissões de Acesso</CardTitle>
            <Button onClick={() => setIsDialogOpen(true)}>Adicionar Permissão</Button>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Nível de Acesso</TableHead>
                      <TableHead>Adicionado em</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id} className={!user.active ? 'opacity-60' : ''}>
                        <TableCell>{user.name || '-'}</TableCell>
                        <TableCell>{user.email || '-'}</TableCell>
                        <TableCell>{getRoleName(user.role)}</TableCell>
                        <TableCell>{user.createdAt ? formatDateTime(user.createdAt) : '-'}</TableCell>
                        <TableCell className="text-center">
                          {user.active ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                              Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                              Inativo
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              {user.active && (
                                <DropdownMenuItem
                                  onClick={() => handleRemoveAccess(user)}
                                  className="text-red-600 focus:text-red-600">
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Remover Acesso
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500">
                          Nenhuma permissão configurada
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminProtected>
  )
}
