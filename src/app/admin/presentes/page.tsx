'use client'

import { AdminProtected } from '@/components/roles'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { queryClient } from '@/lib/query-client'
import { giftsService } from '@/services'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { routes } from '@/lib/routes'

export default function AdminGiftsPage() {
  const router = useRouter()

  // Query para buscar presentes
  const {
    data: gifts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['gifts'],
    queryFn: giftsService.getAll,
  })

  // Mutation para excluir presentes
  const deleteMutation = useMutation({
    mutationFn: giftsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] })
      toast.success('Presente excluído com sucesso')
    },
    onError: () => {
      toast.error('Erro ao excluir presente')
    },
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este presente?')) {
      return
    }
    deleteMutation.mutate(id)
  }

  const handleEdit = (id: string) => {
    router.push(routes.frontend.admin.presentes.edit(id))
  }

  const handleAdd = () => {
    router.push(routes.frontend.admin.presentes.create)
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
