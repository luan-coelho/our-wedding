'use client'

import { CopyToClipboard } from '@/components/copy-to-clipboard'
import { AdminProtected } from '@/components/roles'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { routes } from '@/lib/routes'
import { Guest } from '@/types'
import { Baby, Check, ChevronDown, ChevronUp, Eye, EyeOff, Heart, HelpCircle, UserPlus, Users, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface DesktopGuestTableProps {
  guests: Guest[]
  baseUrl: string
  onDeleteClick: (guest: Guest) => void
  nameFilter: string
  statusFilter: string
  onClearFilters: () => void
}

export function DesktopGuestTable({
  guests,
  baseUrl,
  onDeleteClick,
  nameFilter,
  statusFilter,
  onClearFilters,
}: DesktopGuestTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRowExpansion = (guestId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(guestId)) {
        newSet.delete(guestId)
      } else {
        newSet.add(guestId)
      }
      return newSet
    })
  }

  if (guests.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        <div className="flex flex-col items-center gap-2">
          <div className="text-gray-400 text-lg">
            {nameFilter || statusFilter !== 'all'
              ? 'Nenhum convidado encontrado com os filtros aplicados'
              : 'Nenhum convidado cadastrado'}
          </div>
          {(nameFilter || statusFilter !== 'all') && (
            <Button variant="outline" size="sm" onClick={onClearFilters} className="mt-2 border-black">
              Limpar filtros
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow className="border-black">
            <TableHead className="font-semibold text-gray-700 px-6">Convidado</TableHead>
            <TableHead className="text-center font-semibold text-gray-700">Código</TableHead>
            <TableHead className="text-center font-semibold text-gray-700">Confirmações</TableHead>
            <AdminProtected>
              <TableHead className="text-center font-semibold text-gray-700">Ações</TableHead>
            </AdminProtected>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map(guest => {
            const isExpanded = expandedRows.has(guest.id)
            const partySize =
              1 + (guest.spouse ? 1 : 0) + (guest.children?.length || 0) + (guest.companions?.length || 0)

            // Calculate confirmed people in this group
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

            // Build list of main people (main guest and spouse)
            const mainPeople = [
              {
                name: guest.name,
                confirmed: guest.isConfirmed,
                type: 'main',
                icon: <Users className="w-3 h-3" />,
              },
              ...(guest.spouse
                ? [
                    {
                      name: guest.spouse,
                      confirmed: guest.spouseConfirmation || false,
                      type: 'spouse',
                      icon: <Heart className="w-3 h-3" />,
                    },
                  ]
                : []),
            ]

            // Build list of additional people (children and companions)
            const additionalPeople = [
              ...(guest.children?.map(child => ({
                name: child,
                confirmed: guest.childrenConfirmations?.[child] || false,
                type: 'child',
                icon: <Baby className="w-3 h-3" />,
              })) || []),
              ...(guest.companions?.map(companion => ({
                name: companion,
                confirmed: guest.companionsConfirmations?.[companion] || false,
                type: 'companion',
                icon: <UserPlus className="w-3 h-3" />,
              })) || []),
            ]

            const hasAdditionalPeople = additionalPeople.length > 0

            return (
              <TableRow key={guest.id} className="border-black hover:bg-gray-50/50 transition-colors">
                <TableCell className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900 mb-2">{guest.name}</div>

                    {/* Main People (always visible) */}
                    {guest.spouse && (
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <Heart className="w-3 h-3 text-pink-600" />
                        <span className="text-gray-600">{guest.spouse}</span>
                      </div>
                    )}

                    {/* Expand/Collapse Button for Additional People */}
                    {hasAdditionalPeople && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(guest.id)}
                        className="text-xs text-gray-600 hover:text-gray-900 h-6 px-2 mb-1">
                        <div className="flex items-center gap-1">
                          {isExpanded ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>
                            {isExpanded ? 'Ocultar' : 'Mostrar'} {additionalPeople.length}{' '}
                            {additionalPeople.length === 1 ? 'pessoa adicional' : 'pessoas adicionais'}
                          </span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </div>
                      </Button>
                    )}

                    {/* Additional People (expandable) */}
                    {hasAdditionalPeople && isExpanded && (
                      <div className="space-y-1 pl-4 border-l-2 border-gray-200">
                        {additionalPeople.map((person, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <span className={`${person.type === 'child' ? 'text-purple-600' : 'text-amber-600'}`}>
                              {person.icon}
                            </span>
                            <span className="text-gray-600">{person.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-center py-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="font-mono text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                      {guest.confirmationCode}
                    </div>
                    <div className="text-xs text-gray-500">Código de 6 dígitos</div>
                    <div className="flex gap-1">
                      <CopyToClipboard text={guest.confirmationCode} />
                      <CopyToClipboard text={`${baseUrl}/?code=${guest.confirmationCode}`} label="Link" />
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-center py-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        {confirmedInGroup}/{partySize}
                      </span>
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold border ${
                          confirmedInGroup === partySize
                            ? 'bg-green-200 text-green-800 border-green-300'
                            : confirmedInGroup > 0
                              ? 'bg-yellow-200 text-yellow-800 border-yellow-300'
                              : 'bg-red-200 text-red-800 border-red-300'
                        }`}>
                        {confirmedInGroup === partySize ? (
                          <Check className="w-3 h-3" />
                        ) : confirmedInGroup > 0 ? (
                          <HelpCircle className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                      </span>
                    </div>

                    {/* Individual confirmation status */}
                    <div className="grid grid-cols-1 gap-1 w-full max-w-[200px]">
                      {/* Main People */}
                      {mainPeople.map((person, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between text-xs p-1.5 rounded border ${
                            person.confirmed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                          }`}>
                          <div className="flex items-center gap-1.5">
                            <span className={`${person.type === 'main' ? 'text-blue-600' : 'text-pink-600'}`}>
                              {person.icon}
                            </span>
                            <span
                              className={`truncate max-w-[100px] font-medium ${
                                person.confirmed ? 'text-green-800' : 'text-red-800'
                              }`}>
                              {person.name}
                            </span>
                          </div>
                          <span
                            className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold ${
                              person.confirmed
                                ? 'bg-green-200 text-green-800 border border-green-300'
                                : 'bg-red-200 text-red-800 border border-red-300'
                            }`}>
                            {person.confirmed ? <Check className="w-2 h-2" /> : <X className="w-2 h-2" />}
                          </span>
                        </div>
                      ))}

                      {/* Additional People (only when expanded) */}
                      {isExpanded &&
                        additionalPeople.map((person, index) => (
                          <div
                            key={`additional-${index}`}
                            className={`flex items-center justify-between text-xs p-1.5 rounded border ${
                              person.confirmed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                            }`}>
                            <div className="flex items-center gap-1.5">
                              <span className={`${person.type === 'child' ? 'text-purple-600' : 'text-amber-600'}`}>
                                {person.icon}
                              </span>
                              <span
                                className={`truncate max-w-[100px] font-medium ${
                                  person.confirmed ? 'text-green-800' : 'text-red-800'
                                }`}>
                                {person.name}
                              </span>
                            </div>
                            <span
                              className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold ${
                                person.confirmed
                                  ? 'bg-green-200 text-green-800 border border-green-300'
                                  : 'bg-red-200 text-red-800 border border-red-300'
                              }`}>
                              {person.confirmed ? <Check className="w-2 h-2" /> : <X className="w-2 h-2" />}
                            </span>
                          </div>
                        ))}
                    </div>
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
                        onClick={() => onDeleteClick(guest)}
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
          })}
        </TableBody>
      </Table>
    </div>
  )
}
