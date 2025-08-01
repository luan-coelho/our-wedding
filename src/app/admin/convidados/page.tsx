'use client'

import { Guest } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useMemo, useState } from 'react'

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
import { routes } from '@/lib/routes'
import { guestsService } from '@/services/guests.service'
import { Search, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { DesktopGuestTable } from './components/desktop-guest-table'
import { MobileGuestCard } from './components/mobile-guest-card'
import { ImportGuestsDialog } from './import-guests-dialog'
import { ManualConfirmationDialog } from './components/manual-confirmation-dialog'

export default function AdminGuestsPage() {
  const queryClient = useQueryClient()
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [guestToConfirm, setGuestToConfirm] = useState<Guest | null>(null)
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false)

  // Filter states
  const [nameFilter, setNameFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'unconfirmed' | 'partial'>('all')

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

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

      // Calculate confirmation status for this guest
      const totalInGroup = 1 + (guest.spouse ? 1 : 0) + (guest.children?.length || 0) + (guest.companions?.length || 0)
      let confirmedInGroup = 0

      if (guest.isConfirmed) confirmedInGroup += 1
      if (guest.spouse && guest.spouseConfirmation) confirmedInGroup += 1
      if (guest.children && guest.childrenConfirmations) {
        guest.children.forEach(child => {
          if (guest.childrenConfirmations?.[child]) confirmedInGroup += 1
        })
      }
      if (guest.companions && guest.companionsConfirmations) {
        guest.companions.forEach(companion => {
          if (guest.companionsConfirmations?.[companion]) confirmedInGroup += 1
        })
      }

      // Status filter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'confirmed' && confirmedInGroup === totalInGroup) ||
        (statusFilter === 'unconfirmed' && confirmedInGroup === 0) ||
        (statusFilter === 'partial' && confirmedInGroup > 0 && confirmedInGroup < totalInGroup)

      return matchesName && matchesStatus
    })
  }, [guests, nameFilter, statusFilter])

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

  // Mutation to update guest confirmation
  const updateConfirmationMutation = useMutation({
    mutationFn: ({ guestId, confirmationData }: {
      guestId: string
      confirmationData: {
        isConfirmed?: boolean
        spouseConfirmation?: boolean
        childrenConfirmations?: Record<string, boolean>
        companionsConfirmations?: Record<string, boolean>
      }
    }) => guestsService.updateConfirmation(guestId, confirmationData),
    onSuccess: () => {
      toast.success('Confirmação atualizada com sucesso')
      queryClient.invalidateQueries({ queryKey: ['guests'] })
      setIsConfirmationDialogOpen(false)
      setGuestToConfirm(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar confirmação')
    },
  })

  function handleDeleteClick(guest: Guest) {
    setGuestToDelete(guest)
    setIsDeleteDialogOpen(true)
  }

  function handleManualConfirmationClick(guest: Guest) {
    setGuestToConfirm(guest)
    setIsConfirmationDialogOpen(true)
  }

  function handleConfirmDelete() {
    if (!guestToDelete) return
    deleteGuestMutation.mutate(guestToDelete.id)
  }

  async function handleSaveConfirmation(
    guestId: string,
    confirmationData: {
      isConfirmed?: boolean
      spouseConfirmation?: boolean
      childrenConfirmations?: Record<string, boolean>
      companionsConfirmations?: Record<string, boolean>
    }
  ) {
    updateConfirmationMutation.mutate({ guestId, confirmationData })
  }

  function handleClearFilters() {
    setNameFilter('')
    setStatusFilter('all')
  }

  // Calculate statistics - now counting total people, not just main guests
  const totalPeople = useMemo(() => {
    return filteredGuests.reduce((total, guest) => {
      return total + 1 + (guest.spouse ? 1 : 0) + (guest.children?.length || 0) + (guest.companions?.length || 0)
    }, 0)
  }, [filteredGuests])

  const totalConfirmedPeople = useMemo(() => {
    return filteredGuests.reduce((total, guest) => {
      let confirmedInGroup = 0

      if (guest.isConfirmed) confirmedInGroup += 1
      if (guest.spouse && guest.spouseConfirmation) confirmedInGroup += 1
      if (guest.children && guest.childrenConfirmations) {
        guest.children.forEach(child => {
          if (guest.childrenConfirmations?.[child]) confirmedInGroup += 1
        })
      }
      if (guest.companions && guest.companionsConfirmations) {
        guest.companions.forEach(companion => {
          if (guest.companionsConfirmations?.[companion]) confirmedInGroup += 1
        })
      }

      return total + confirmedInGroup
    }, 0)
  }, [filteredGuests])

  const totalNotConfirmedPeople = useMemo(() => {
    return totalPeople - totalConfirmedPeople
  }, [totalPeople, totalConfirmedPeople])

  const totalChildren = useMemo(() => {
    return filteredGuests.reduce((total, guest) => {
      return total + (guest.children?.length || 0)
    }, 0)
  }, [filteredGuests])

  const totalGuests = filteredGuests.length

  const statsCards = [
    {
      title: 'Total de Convidados',
      value: totalGuests,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total de Pessoas',
      value: totalPeople,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      title: 'Total de Filhos',
      value: totalChildren,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
    {
      title: 'Pessoas Confirmadas',
      value: totalConfirmedPeople,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Pessoas Não Confirmadas',
      value: totalNotConfirmedPeople,
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
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

      <div className="container mx-auto px-2 sm:px-4 mt-4 sm:mt-10">
        {/* Guest Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 mb-4 sm:mb-8">
          {statsCards.map((card, index) => (
            <Card
              key={index}
              className={`${card.bgColor} ${card.textColor} border-black shadow-sm hover:shadow-md transition-shadow duration-200`}>
              <CardContent className="pt-3 pb-3 sm:pt-6 sm:pb-6">
                <div className="text-center">
                  <h3 className="text-xl sm:text-3xl font-bold mb-1">{card.value}</h3>
                  <p className="text-xs sm:text-sm font-medium opacity-80">{card.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-lg shadow-sm border-black bg-white gap-0">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-black space-y-4 sm:space-y-0">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">Convidados</CardTitle>
            <AdminProtected>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => setIsImportDialogOpen(true)}
                  variant="outline"
                  className="shadow-sm hover:shadow-md transition-shadow border-black">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar
                </Button>
                <Button asChild className="shadow-sm hover:shadow-md transition-shadow border-black">
                  <Link href={routes.frontend.admin.convidados.create}>Adicionar</Link>
                </Button>
              </div>
            </AdminProtected>
          </CardHeader>

          <CardContent className="p-0 gap-0">
            {/* Filters Section */}
            <div className="px-3 sm:px-6 py-4 border-b border-black bg-gray-50/50">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
                    onValueChange={(value: 'all' | 'confirmed' | 'unconfirmed' | 'partial') => setStatusFilter(value)}>
                    <SelectTrigger className="bg-white border-black focus:border-gray-900 focus:ring-gray-900/20 shadow-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-black shadow">
                      <SelectItem value="all" className="hover:bg-gray-50">
                        Todos
                      </SelectItem>
                      <SelectItem value="confirmed" className="hover:bg-green-50 text-green-700">
                        Totalmente Confirmados
                      </SelectItem>
                      <SelectItem value="partial" className="hover:bg-yellow-50 text-yellow-700">
                        Parcialmente Confirmados
                      </SelectItem>
                      <SelectItem value="unconfirmed" className="hover:bg-red-50 text-red-700">
                        Não Confirmados
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
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-pulse">Carregando...</div>
              </div>
            ) : (
              <>
                {/* Mobile View */}
                <div className="block sm:hidden">
                  {filteredGuests.length > 0 ? (
                    <div className="space-y-3 p-3">
                      {filteredGuests.map(guest => (
                        <MobileGuestCard
                          key={guest.id}
                          guest={guest}
                          baseUrl={baseUrl}
                          onDeleteClick={handleDeleteClick}
                          onManualConfirmationClick={handleManualConfirmationClick}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-12">
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
                            onClick={handleClearFilters}
                            className="mt-2 border-black">
                            Limpar filtros
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop View */}
                <div className="hidden sm:block">
                  <DesktopGuestTable
                    guests={filteredGuests}
                    baseUrl={baseUrl}
                    onDeleteClick={handleDeleteClick}
                    onManualConfirmationClick={handleManualConfirmationClick}
                    nameFilter={nameFilter}
                    statusFilter={statusFilter}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Import Guests Dialog */}
      <ImportGuestsDialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen} />

      {/* Manual Confirmation Dialog */}
      <ManualConfirmationDialog
        open={isConfirmationDialogOpen}
        onOpenChange={setIsConfirmationDialogOpen}
        guest={guestToConfirm}
        onSave={handleSaveConfirmation}
        isLoading={updateConfirmationMutation.isPending}
      />
    </>
  )
}
