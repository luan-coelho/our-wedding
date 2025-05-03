'use client'

import AdminProtected from '@/components/AdminProtected'
import Link from 'next/link'
import { CopyToClipboard } from '@/components/CopyToClipboard'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'

interface Guest {
  id: number
  name: string
  isConfirmed: boolean
  token: string
}

export default function AdminGuestsPage() {
  const queryClient = useQueryClient()
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Função para buscar convidados
  const fetchGuests = async (): Promise<Guest[]> => {
    const response = await fetch('/api/guests')
    if (!response.ok) {
      throw new Error('Falha ao buscar convidados')
    }
    return response.json()
  }

  // Query para buscar convidados
  const { data: guests = [], isLoading } = useQuery({
    queryKey: ['guests'],
    queryFn: fetchGuests,
  })

  // Cálculo das estatísticas
  const totalGuests = guests.length
  const confirmedGuests = guests.filter(guest => guest.isConfirmed).length
  const pendingGuests = totalGuests - confirmedGuests
  const confirmationRate = totalGuests > 0 ? Math.round((confirmedGuests / totalGuests) * 100) : 0

  const handleDeleteClick = (guest: Guest) => {
    setGuestToDelete(guest)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!guestToDelete) return

    try {
      const response = await fetch(`/api/guests/${guestToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Falha ao excluir convidado')
      }

      toast.success('Convidado excluído com sucesso')
      queryClient.invalidateQueries({ queryKey: ['guests'] })
    } catch (error) {
      toast.error('Erro ao excluir convidado')
    } finally {
      setIsDeleteDialogOpen(false)
      setGuestToDelete(null)
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  return (
    <AdminProtected>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o convidado "{guestToDelete?.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 justify-end">
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 mt-10">
        {/* Estatísticas de Convidados */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-100 border-blue-600 text-blue-600">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold">{totalGuests}</h3>
                <p className="text-sm">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-100 border-green-600 text-green-600">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold">{confirmedGuests}</h3>
                <p className="text-sm">Confirmados</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-100 border-yellow-600 text-yellow-600">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold">{pendingGuests}</h3>
                <p className="text-sm">Pendentes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-100 border-zinc-600 text-zinc-600">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold">{confirmationRate}%</h3>
                <p className="text-sm">Taxa de Confirmação</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl font-bold">Convidados</CardTitle>
            <Button asChild>
              <Link href="/admin/convidados/novo">Adicionar Convidado</Link>
            </Button>
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
                      <TableHead className="text-center">Confirmado</TableHead>
                      <TableHead>Link de Convite</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guests.map(guest => (
                      <TableRow key={guest.id}>
                        <TableCell>{guest.name}</TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-block w-3 h-3 rounded-full ${guest.isConfirmed ? 'bg-green-500' : 'bg-red-500'}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input
                              readOnly
                              value={`${baseUrl}/confirmacao/${guest.token}`}
                              className="flex-1 text-sm bg-gray-50"
                            />
                            <CopyToClipboard text={`${baseUrl}/confirmacao/${guest.token}`} />
                          </div>
                        </TableCell>
                        <TableCell className="text-center flex gap-2 justify-center">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/convidados/${guest.id}/editar`}>Editar</Link>
                          </Button>
                          <Button onClick={() => handleDeleteClick(guest)} variant="destructive" size="sm">
                            Excluir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {guests.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500">
                          Nenhum convidado cadastrado
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
