'use client'

import { Guest } from '@/types'
import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CopyToClipboard } from '@/components/copy-to-clipboard'
import { AdminProtected } from '@/components/roles'
import { routes } from '@/lib/routes'
import { Check, HelpCircle, Users, Heart, Baby, UserPlus, X, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react'

interface MobileGuestCardProps {
  guest: Guest
  baseUrl: string
  onDeleteClick: (guest: Guest) => void
}

export function MobileGuestCard({ guest, baseUrl, onDeleteClick }: MobileGuestCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const partySize = 1 + (guest.spouse ? 1 : 0) + (guest.children?.length || 0) + (guest.companions?.length || 0)

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

  // Build list of main people (only main guest and spouse)
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
    <Card className="border-2 hover:shadow-lg transition-all">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 text-sm">{guest.name}</h3>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {partySize} {partySize === 1 ? 'pessoa' : 'pessoas'}
            </span>
          </div>
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
        </div>

        {/* Confirmation Code */}
        <div className="mb-3 text-center">
          <div className="inline-flex flex-col items-center gap-1">
            <div className="font-mono text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
              {guest.confirmationCode}
            </div>
            <div className="text-xs text-gray-500">Código de confirmação</div>
            <div className="flex gap-1">
              <CopyToClipboard text={guest.confirmationCode} />
              <CopyToClipboard text={`${baseUrl}/?code=${guest.confirmationCode}`} label="Link" />
            </div>
          </div>
        </div>

        {/* Main People (always visible) */}
        <div className="space-y-2 mb-3">
          {mainPeople.map((person, index) => (
            <div
              key={index}
              className={`flex items-center justify-between text-sm p-2 rounded border ${
                person.confirmed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
              <div className="flex items-center gap-2">
                <span className={`${person.type === 'main' ? 'text-blue-600' : 'text-pink-600'}`}>{person.icon}</span>
                <span
                  className={`font-medium truncate max-w-[150px] ${
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

        {/* Expand/Collapse Button for Additional People */}
        {hasAdditionalPeople && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mb-3 text-sm text-gray-600 hover:text-gray-900 h-8">
            <div className="flex items-center justify-center gap-2">
              {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>
                {isExpanded ? 'Ocultar' : 'Mostrar'} {additionalPeople.length}{' '}
                {additionalPeople.length === 1 ? 'pessoa adicional' : 'pessoas adicionais'}
              </span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </Button>
        )}

        {/* Additional People (expandable) */}
        {hasAdditionalPeople && isExpanded && (
          <div className="space-y-2 mb-3 pl-4 border-l-2 border-gray-200">
            {additionalPeople.map((person, index) => (
              <div
                key={index}
                className={`flex items-center justify-between text-sm p-2 rounded border ${
                  person.confirmed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                <div className="flex items-center gap-2">
                  <span className={`${person.type === 'child' ? 'text-purple-600' : 'text-amber-600'}`}>
                    {person.icon}
                  </span>
                  <span
                    className={`font-medium truncate max-w-[150px] ${
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
        )}

        {/* Link de Convite */}
        <div className="mb-3">
          <label className="text-xs text-gray-500 mb-1 block">Link de Convite</label>
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={`${baseUrl}/confirmacao/${guest.token}`}
              className="flex-1 text-xs bg-gray-50 border-gray-300 text-gray-600"
            />
            <CopyToClipboard text={`${baseUrl}/confirmacao/${guest.token}`} />
          </div>
        </div>

        {/* Action Buttons */}
        <AdminProtected>
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1 shadow-sm hover:shadow-md transition-shadow border-black">
              <Link href={routes.frontend.admin.convidados.edit(guest.id)}>Editar</Link>
            </Button>
            <Button
              onClick={() => onDeleteClick(guest)}
              variant="destructive"
              size="sm"
              className="flex-1 shadow-sm hover:shadow-md transition-shadow border-black">
              Excluir
            </Button>
          </div>
        </AdminProtected>
      </CardContent>
    </Card>
  )
}
