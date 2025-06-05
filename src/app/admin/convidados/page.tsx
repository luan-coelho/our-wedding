
'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useState, useMemo } from 'react'

import { CopyToClipboard } from '@/components/copy-to-clipboard'
import { AdminProtected } from '@/components/roles'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'

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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  // Filter states
  const [nameFilter, setNameFilter] = useState('')
  const [confirmationFilter, setConfirmationFilter] = useState<'all' | 'confirmed' | 'unconfirmed'>('all')

  // Query to fetch guests
  const { data: allGuests = [], isLoading } = useQuery({
    queryKey: ['guests'],
    queryFn: async () => {
      const response = await fetch('/api/guests')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch guests')
      }
      return response.json() as Promise<Guest[]>
    },
  })

  // Filter guests based on search criteria
  const filteredGuests = useMemo(() => {
    return allGuests.filter(guest => {
      // Name filter (case-insensitive partial match)
      const matchesName = guest.name.toLowerCase().includes(nameFilter.toLowerCase())
      
      // Confirmation status filter
      const matchesConfirmation = 
        confirmationFilter === 'all' ||
        (confirmationFilter === 'confirmed' && guest.isConfirmed) ||
        (confirmationFilter === 'unconfirmed' && !guest.isConfirmed)
      
      return matchesName && matchesConfirmation
    })
  }, [allGuests, nameFilter, confirmationFilter])

  // Mutation to delete a guest
  const deleteGuestMutation = useMutation({
    mutationFn: async (guestId: number) => {
      const response = await fetch(`/api/guests/${guestId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete guest')
      }

      return data
    },
    onSuccess: data => {
      toast.success(data.message || 'Convidado excluído com sucesso')
      queryClient.invalidateQueries({ queryKey: ['guests'] })
      setIsDeleteDialogOpen(false)
      setGuestToDelete(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao excluir convidado')
    },
  })

  // Guest statistics
  const totalGuests = filteredGuests.length
  const confirmedGuests = filteredGuests.filter(guest => guest.isConfirmed).length
  const pendingGuests = totalGuests - confirmedGuests
  const confirmationRate = totalGuests > 0 ? Math.round((confirmedGuests / totalGuests) * 100) : 0

  function handleDeleteClick(guest: Guest) {
    setGuestToDelete(guest)
    setIsDeleteDialogOpen(true)
  }

  function handleConfirmDelete() {
    if (!guestToDelete) return
    deleteGuestMutation.mutate(guestToDelete.id)
  }

  const statsCards = [
    {
      title: 'Total',
      value: totalGuests,
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-600',
      textColor: 'text-blue-600',
    },
    {
      title: 'Confirmados',
      value: confirmedGuests,
      bgColor: 'bg-green-100',
      borderColor: 'border-green-600',
      textColor: 'text-green-600',
    },
    {
      title: 'Pendentes',
      value: pendingGuests,
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-600',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Taxa de Confirmação',
      value: `${confirmationRate}%`,
      bgColor: 'bg-white',
      borderColor: 'border-zinc-600',
      textColor: 'text-zinc-600',
    },
  ]

  return (
    <>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o convidado &ldquo;{guestToDelete?.name}&rdquo;? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 justify-end">
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleteGuestMutation.isPending}>
              {deleteGuestMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 mt-10">
        {/* Guest Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {statsCards.map((card, index) => (
            <Card key={index} className={`${card.bgColor} ${card.borderColor} ${card.textColor}`}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-3xl font-bold">{card.value}</h3>
                  <p className="text-sm">{card.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl font-bold">Convidados</CardTitle>
            <AdminProtected>
              <Button asChild>
                <Link href="/admin/convidados/novo">Adicionar Convidado</Link>
              </Button>
            </AdminProtected>
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
                      <AdminProtected>
                        <TableHead className="text-center">Ações</TableHead>
                      </AdminProtected>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGuests.length > 0 ? (
                      filteredGuests.map(guest => (
                        <TableRow key={guest.id}>
                          <TableCell>{guest.name}</TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`inline-block w-3 h-3 rounded-full ${guest.isConfirmed ? 'bg-green-500' : 'bg-red-500'}`}
                              aria-label={guest.isConfirmed ? 'Confirmado' : 'Não confirmado'}
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
                          <AdminProtected>
                            <TableCell className="text-center flex gap-2 justify-center">
                              <Button asChild variant="outline" size="sm">
                                <Link href={`/admin/convidados/${guest.id}/editar`}>Editar</Link>
                              </Button>
                              <Button onClick={() => handleDeleteClick(guest)} variant="destructive" size="sm">
                                Excluir
                              </Button>
                            </TableCell>
                          </AdminProtected>
                        </TableRow>
                      ))
                    ) : (
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
    </>
  )
}
