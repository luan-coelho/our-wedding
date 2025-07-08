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
import { Search, Upload, Check, Users, Heart, Baby, UserPlus, X } from 'lucide-react'
import { toast } from 'sonner'
import { ImportGuestsDialog } from './import-guests-dialog'
import { MobileGuestCard } from './components/mobile-guest-card'
import { DesktopGuestTable } from './components/desktop-guest-table'

export default function AdminGuestsPage() {
  const queryClient = useQueryClient()
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

  // Filter states
  const [nameFilter, setNameFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'unconfirmed' | 'partial'>('all')

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

  // Calculate total attendees (including family members)
  const totalAttendees = useMemo(() => {
    return filteredGuests.reduce((total, guest) => {
      let guestCount = 1 // Main guest
      if (guest.spouse) guestCount += 1
      if (guest.children) guestCount += guest.children.length
      if (guest.companions) guestCount += guest.companions.length
      return total + guestCount
    }, 0)
  }, [filteredGuests])

  // Calculate confirmed attendees (considering individual confirmations)
  const confirmedAttendees = useMemo(() => {
    return filteredGuests.reduce((total, guest) => {
      let confirmedCount = 0

      // Main guest
      if (guest.isConfirmed) confirmedCount += 1

      // Spouse
      if (guest.spouse && guest.spouseConfirmation) confirmedCount += 1

      // Children
      if (guest.children && guest.childrenConfirmations) {
        guest.children.forEach(child => {
          if (guest.childrenConfirmations?.[child]) confirmedCount += 1
        })
      }

      // Companions
      if (guest.companions && guest.companionsConfirmations) {
        guest.companions.forEach(companion => {
          if (guest.companionsConfirmations?.[companion]) confirmedCount += 1
        })
      }

      return total + confirmedCount
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

  function handleDeleteClick(guest: Guest) {
    setGuestToDelete(guest)
    setIsDeleteDialogOpen(true)
  }

  function handleConfirmDelete() {
    if (!guestToDelete) return
    deleteGuestMutation.mutate(guestToDelete.id)
  }

  function handleClearFilters() {
    setNameFilter('')
    setStatusFilter('all')
  }

  // Calculate statistics
  const fullyConfirmedGuests = useMemo(() => {
    return filteredGuests.filter(guest => {
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

      return confirmedInGroup === totalInGroup
    }).length
  }, [filteredGuests])

  const partiallyConfirmedGuests = useMemo(() => {
    return filteredGuests.filter(guest => {
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

      return confirmedInGroup > 0 && confirmedInGroup < totalInGroup
    }).length
  }, [filteredGuests])

  const notConfirmedGuests = useMemo(() => {
    return filteredGuests.filter(guest => {
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

      return confirmedInGroup === 0
    }).length
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
      title: 'Totalmente Confirmados',
      value: fullyConfirmedGuests,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Parcialmente Confirmados',
      value: partiallyConfirmedGuests,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Não Confirmados',
      value: notConfirmedGuests,
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-8">
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

        <Card className="rounded-lg shadow-sm border-black bg-white">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-black space-y-4 sm:space-y-0">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">Convidados</CardTitle>
            <AdminProtected>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => setIsImportDialogOpen(true)}
                  variant="outline"
                  size="sm"
                  className="shadow-sm hover:shadow-md transition-shadow border-black">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar
                </Button>
                <Button asChild size="sm" className="shadow-sm hover:shadow-md transition-shadow border-black">
                  <Link href={routes.frontend.admin.convidados.create}>Adicionar</Link>
                </Button>
              </div>
            </AdminProtected>
          </CardHeader>

          {/* Legenda do Sistema de Confirmações - Hidden on mobile */}
          <div className="hidden sm:block px-6 py-4 bg-blue-50 border-b border-gray-200">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-sm">Sistema de Confirmações</h3>

              {/* Códigos de Confirmação */}
              <div className="bg-white p-3 rounded-lg border border-blue-200">
                <h4 className="font-medium text-gray-800 text-xs mb-2">💡 Códigos de Confirmação</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="font-mono text-sm bg-blue-100 px-2 py-1 rounded border">123456</div>
                    <div>
                      <div className="font-medium text-gray-800">Código de 6 dígitos</div>
                      <div className="text-gray-600">Para digitar na página inicial</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded border">🔗 Link</div>
                    <div>
                      <div className="font-medium text-gray-800">URL direta</div>
                      <div className="text-gray-600">Para enviar por WhatsApp/Email</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-amber-50 rounded border border-amber-200">
                  <div className="text-xs text-amber-800">
                    <span className="font-medium">📋 Como funciona:</span> O convidado acessa a página inicial e:
                    <br />• <strong>Digita o código de 6 dígitos</strong> OU
                    <br />• <strong>Clica no link direto</strong> (exemplo:{' '}
                    <span className="font-mono">/?code=123456</span>)
                    <br />• <strong>Confirma a presença</strong> de cada pessoa individualmente
                  </div>
                </div>
              </div>

              {/* Tipos de Pessoas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-gray-600" />
                    <span className="text-gray-700">Principal</span>
                  </div>
                  <Heart className="w-3 h-3 text-pink-600" />
                  <span className="text-gray-700">Cônjuge</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Baby className="w-3 h-3 text-blue-600" />
                    <span className="text-gray-700">Filhos</span>
                  </div>
                  <UserPlus className="w-3 h-3 text-purple-600" />
                  <span className="text-gray-700">Outros</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-600" />
                    <span className="text-gray-700">Confirmado</span>
                  </div>
                  <X className="w-3 h-3 text-red-600" />
                  <span className="text-gray-700">Não confirmado</span>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">Formato:</span> Confirmados/Total - Cada pessoa do grupo pode confirmar
                individualmente
              </div>
            </div>
          </div>

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

          <CardContent className="p-0">
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
    </>
  )
}
