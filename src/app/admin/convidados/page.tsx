'use client'

import { Guest } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useMemo, useState } from 'react'

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { routes } from '@/lib/routes'
import { guestsService } from '@/services/guests.service'
import { Search, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { ImportGuestsDialog } from './import-guests-dialog'

export default function AdminGuestsPage() {
  const queryClient = useQueryClient()
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

  // Filter states
  const [nameFilter, setNameFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'unconfirmed'>('all')

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  // Query to fetch guests
  const { data: guests = [], isLoading } = useQuery({
    queryKey: ['guests'],
    queryFn: guestsService.getAll,
  })

  // Filtered guests based on search criteria
  const filteredGuests = useMemo(() => {
    return guests.filter(guest => {
      // Name filter - case insensitive partial matching
      const matchesName = guest.name.toLowerCase().includes(nameFilter.toLowerCase())

      // Status filter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'confirmed' && guest.isConfirmed) ||
        (statusFilter === 'unconfirmed' && !guest.isConfirmed)

      return matchesName && matchesStatus
    })
  }, [guests, nameFilter, statusFilter])

  // Calculate total attendees (including family members)
  const totalAttendees = useMemo(() => {
    return filteredGuests.reduce((total, guest) => {
      let guestCount = 1 // Main guest
      if (guest.spouse) guestCount += 1
      if (guest.children) guestCount += guest.children.length // filhos
      if (guest.companions) guestCount += guest.companions.length
      return total + guestCount
    }, 0)
  }, [filteredGuests])

  // Mutation to delete a guest
  const deleteGuestMutation = useMutation({
    mutationFn: guestsService.delete,
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

  // Guest statistics (based on filtered results)
  const totalGuests = filteredGuests.length
  const confirmedGuests = filteredGuests.filter(guest => guest.isConfirmed).length

  // Calculate confirmed attendees
  const confirmedAttendees = useMemo(() => {
    return filteredGuests
      .filter(guest => guest.isConfirmed)
      .reduce((total, guest) => {
        let guestCount = 1 // Main guest
        if (guest.spouse) guestCount += 1
        if (guest.children) guestCount += guest.children.length // filhos
        if (guest.companions) guestCount += guest.companions.length
        return total + guestCount
      }, 0)
  }, [filteredGuests])

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
      title: 'Convidados',
      value: totalGuests,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total de Pessoas',
      value: totalAttendees,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      title: 'Confirmados',
      value: confirmedGuests,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Pessoas Confirmadas',
      value: confirmedAttendees,
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-600',
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
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteGuestMutation.isPending}
              className="border-black">
              {deleteGuestMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
            <DialogClose asChild>
              <Button variant="outline" className="border-black">
                Cancelar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 mt-10">
        {/* Guest Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <Card
              key={index}
              className={`${card.bgColor} ${card.textColor} border-black shadow-sm hover:shadow-md transition-shadow duration-200`}>
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <h3 className="text-3xl font-bold mb-1">{card.value}</h3>
                  <p className="text-sm font-medium opacity-80">{card.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-lg shadow-sm border-black bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-black">
            <CardTitle className="text-2xl font-bold text-gray-900">Convidados</CardTitle>
            <AdminProtected>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsImportDialogOpen(true)}
                  variant="outline"
                  className="shadow-sm hover:shadow-md transition-shadow border-black">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Convidados
                </Button>
                <Button asChild className="shadow-sm hover:shadow-md transition-shadow border-black">
                  <Link href={routes.frontend.admin.convidados.create}>Adicionar Convidado</Link>
                </Button>
              </div>
            </AdminProtected>
          </CardHeader>

          {/* Filters Section */}
          <div className="px-6 py-4 border-b border-black bg-gray-50/50">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Name Filter */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por nome..."
                    value={nameFilter}
                    onChange={e => setNameFilter(e.target.value)}
                    className="pl-10 bg-white border-black focus:border-gray-900 focus:ring-gray-900/20 shadow-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="sm:w-48">
                <Select
                  value={statusFilter}
                  onValueChange={(value: 'all' | 'confirmed' | 'unconfirmed') => setStatusFilter(value)}>
                  <SelectTrigger className="bg-white border-black focus:border-gray-900 focus:ring-gray-900/20 shadow-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-black shadow">
                    <SelectItem value="all" className="hover:bg-gray-50">
                      Todos
                    </SelectItem>
                    <SelectItem value="confirmed" className="hover:bg-green-50 text-green-700">
                      Confirmados
                    </SelectItem>
                    <SelectItem value="unconfirmed" className="hover:bg-yellow-50 text-yellow-700">
                      Pendentes
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results count */}
            {(nameFilter || statusFilter !== 'all') && (
              <div className="mt-3 text-sm text-gray-600">
                Mostrando {filteredGuests.length} de {guests.length} convidados
              </div>
            )}
          </div>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-pulse">Carregando...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50/50">
                    <TableRow className="border-black">
                      <TableHead className="font-semibold text-gray-700 px-6">Nome</TableHead>
                      <TableHead className="text-center font-semibold text-gray-700">Grupo</TableHead>
                      <TableHead className="text-center font-semibold text-gray-700">Confirmado</TableHead>
                      <TableHead className="font-semibold text-gray-700">Link de Convite</TableHead>
                      <AdminProtected>
                        <TableHead className="text-center font-semibold text-gray-700">Ações</TableHead>
                      </AdminProtected>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGuests.length > 0 ? (
                      filteredGuests.map(guest => {
                        const partySize =
                          1 + (guest.spouse ? 1 : 0) + (guest.children?.length || 0) + (guest.companions?.length || 0)
                        const familyMembers = []
                        if (guest.spouse) familyMembers.push(guest.spouse)
                        if (guest.children?.length) familyMembers.push(...guest.children) // filhos
                        if (guest.companions?.length) familyMembers.push(...guest.companions)

                        return (
                          <TableRow key={guest.id} className="border-black hover:bg-gray-50/50 transition-colors">
                            <TableCell className="px-6 py-4">
                              <div>
                                <div className="font-medium text-gray-900">{guest.name}</div>
                                {familyMembers.length > 0 && (
                                  <div className="text-sm text-gray-500 mt-1">{familyMembers.join(', ')}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center py-4">
                              <div className="flex justify-center">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                  {partySize}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center py-4">
                              <div className="flex justify-center">
                                <span
                                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium border-black ${
                                    guest.isConfirmed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                  }`}
                                  aria-label={guest.isConfirmed ? 'Confirmado' : 'Não confirmado'}>
                                  {guest.isConfirmed ? '✓' : '?'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center gap-2">
                                <Input
                                  readOnly
                                  value={`${baseUrl}/confirmacao/${guest.token}`}
                                  className="flex-1 text-sm bg-gray-50 border-black text-gray-600"
                                />
                                <CopyToClipboard text={`${baseUrl}/confirmacao/${guest.token}`} />
                              </div>
                            </TableCell>
                            <AdminProtected>
                              <TableCell className="text-center py-4">
                                <div className="flex gap-2 justify-center">
                                  <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="shadow-sm hover:shadow-md transition-shadow border-black">
                                    <Link href={routes.frontend.admin.convidados.edit(guest.id)}>Editar</Link>
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteClick(guest)}
                                    variant="destructive"
                                    size="sm"
                                    className="shadow-sm hover:shadow-md transition-shadow border-black">
                                    Excluir
                                  </Button>
                                </div>
                              </TableCell>
                            </AdminProtected>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 py-12">
                          <div className="flex flex-col items-center gap-2">
                            <div className="text-gray-400 text-lg">
                              {nameFilter || statusFilter !== 'all'
                                ? 'Nenhum convidado encontrado com os filtros aplicados'
                                : 'Nenhum convidado cadastrado'}
                            </div>
                            {(nameFilter || statusFilter !== 'all') && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setNameFilter('')
                                  setStatusFilter('all')
                                }}
                                className="mt-2 border-black">
                                Limpar filtros
                              </Button>
                            )}
                          </div>
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

      {/* Import Guests Dialog */}
      <ImportGuestsDialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen} />
    </>
  )
}
