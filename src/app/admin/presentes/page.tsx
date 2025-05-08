'use client'

import AdminProtected from '@/components/roles/admin-protected'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Gift {
  id: number
  name: string
  description: string
  price: number | null
  pixKey: string | null
  imageUrl: string | null
}

export default function AdminGiftsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  // Função para buscar presentes
  const fetchGifts = async (): Promise<Gift[]> => {
    const response = await fetch('/api/gifts')
    if (!response.ok) {
      throw new Error('Falha ao buscar presentes')
    }
    return response.json()
  }

  // Query para buscar presentes
  const {
    data: gifts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['gifts'],
    queryFn: fetchGifts,
  })

  // Mutation para excluir presentes
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/gifts/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Falha ao excluir presente')
      }
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] })
      toast.success('Presente excluído com sucesso')
    },
    onError: () => {
      toast.error('Erro ao excluir presente')
    },
  })

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este presente?')) {
      return
    }
    deleteMutation.mutate(id)
  }

  const handleEdit = (id: number) => {
    router.push(`/admin/presentes/${id}/editar`)
  }

  const handleAdd = () => {
    router.push('/admin/presentes/novo')
  }

  return (
    <AdminProtected>
      <div className="container mx-auto px-4 mt-10">
        <Card className="rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl font-bold">Presentes</CardTitle>
            <Button onClick={handleAdd} variant="default">
              Adicionar Presente
            </Button>
          </CardHeader>

          <CardContent>
            {error instanceof Error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error.message}</div>}

            {isLoading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : gifts.length === 0 ? (
              <div className="text-center py-4">Nenhum presente encontrado</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gifts.map(gift => (
                      <TableRow key={gift.id}>
                        <TableCell>{gift.name}</TableCell>
                        <TableCell>{gift.description}</TableCell>
                        <TableCell>{gift.price ? `R$ ${gift.price.toFixed(2)}` : '-'}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button onClick={() => handleEdit(gift.id)} variant="outline" size="sm">
                              Editar
                            </Button>
                            <Button onClick={() => handleDelete(gift.id)} variant="destructive" size="sm">
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
    </AdminProtected>
  )
}
