'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  PartyPopper,
  HeartHandshake,
  Users,
  Heart,
  Baby,
  UserPlus,
} from 'lucide-react'
import { Label } from '@/components/ui/label'

interface Guest {
  id: string
  name: string
  spouse?: string | null
  children?: string[]
  companions?: string[]
  isConfirmed: boolean
  spouseConfirmation?: boolean
  childrenConfirmations?: Record<string, boolean>
  companionsConfirmations?: Record<string, boolean>
  token: string
}

interface ConfirmationFormProps {
  guest: Guest
}

interface PersonConfirmation {
  name: string
  isConfirmed: boolean
  type: 'main' | 'spouse' | 'child' | 'companion'
}

export default function ConfirmationForm({ guest }: ConfirmationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmationStatus, setConfirmationStatus] = useState<'success' | 'error' | null>(null)
  const [hasChanged, setHasChanged] = useState(false)

  // Initialize confirmations state
  const [confirmations, setConfirmations] = useState<PersonConfirmation[]>(() => {
    const people: PersonConfirmation[] = [
      {
        name: guest.name,
        isConfirmed: guest.isConfirmed,
        type: 'main',
      },
    ]

    if (guest.spouse) {
      people.push({
        name: guest.spouse,
        isConfirmed: guest.spouseConfirmation || false,
        type: 'spouse',
      })
    }

    if (guest.children && guest.children.length > 0) {
      guest.children.forEach(child => {
        people.push({
          name: child,
          isConfirmed: guest.childrenConfirmations?.[child] || false,
          type: 'child',
        })
      })
    }

    if (guest.companions && guest.companions.length > 0) {
      guest.companions.forEach(companion => {
        people.push({
          name: companion,
          isConfirmed: guest.companionsConfirmations?.[companion] || false,
          type: 'companion',
        })
      })
    }

    return people
  })

  const handleConfirmationChange = (index: number, value: string) => {
    const newConfirmations = [...confirmations]
    newConfirmations[index].isConfirmed = value === 'true'
    setConfirmations(newConfirmations)
    setHasChanged(true)
    setConfirmationStatus(null)
  }

  const getPersonIcon = (type: PersonConfirmation['type']) => {
    switch (type) {
      case 'main':
        return <Users className="h-5 w-5" />
      case 'spouse':
        return <Heart className="h-5 w-5" />
      case 'child':
        return <Baby className="h-5 w-5" />
      case 'companion':
        return <UserPlus className="h-5 w-5" />
    }
  }

  const getPersonTypeLabel = (type: PersonConfirmation['type']) => {
    switch (type) {
      case 'main':
        return 'Convidado Principal'
      case 'spouse':
        return 'Cônjuge'
      case 'child':
        return 'Filho(a)'
      case 'companion':
        return 'Acompanhante'
    }
  }

  const getPersonTypeColor = (type: PersonConfirmation['type']) => {
    switch (type) {
      case 'main':
        return 'text-wedding-primary'
      case 'spouse':
        return 'text-pink-600'
      case 'child':
        return 'text-blue-600'
      case 'companion':
        return 'text-purple-600'
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const mainPerson = confirmations.find(p => p.type === 'main')
      const spousePerson = confirmations.find(p => p.type === 'spouse')
      const childrenPeople = confirmations.filter(p => p.type === 'child')
      const companionsPeople = confirmations.filter(p => p.type === 'companion')

      const childrenConfirmations: Record<string, boolean> = {}
      childrenPeople.forEach(child => {
        childrenConfirmations[child.name] = child.isConfirmed
      })

      const companionsConfirmations: Record<string, boolean> = {}
      companionsPeople.forEach(companion => {
        companionsConfirmations[companion.name] = companion.isConfirmed
      })

      const requestData = {
        isConfirmed: mainPerson?.isConfirmed || false,
        spouseConfirmation: spousePerson?.isConfirmed || false,
        childrenConfirmations,
        companionsConfirmations,
      }

      const response = await fetch(`/api/confirmacao/${guest.token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        throw new Error('Falha na confirmação')
      }

      setConfirmationStatus('success')
      setHasChanged(false)
      router.refresh()
    } catch (error) {
      setConfirmationStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalConfirmed = confirmations.filter(p => p.isConfirmed).length
  const totalPeople = confirmations.length

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-wedding-charcoal">Confirmação de Presença</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Confirme a presença de cada pessoa individualmente</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Confirmados: {totalConfirmed}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Não confirmados: {totalPeople - totalConfirmed}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>Total: {totalPeople}</span>
          </div>
        </div>
      </div>

      {/* Confirmations Grid */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {confirmations.map((person, index) => (
            <Card key={`${person.type}-${person.name}`} className="border-2 transition-all hover:shadow-lg h-full">
              <CardHeader className="pb-2 px-3 sm:px-4">
                <CardTitle className="text-sm sm:text-base font-semibold flex items-center gap-2">
                  <span className={getPersonTypeColor(person.type)}>{getPersonIcon(person.type)}</span>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-wedding-charcoal truncate">{person.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">{getPersonTypeLabel(person.type)}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-3 sm:px-4 pb-3 sm:pb-4">
                <RadioGroup
                  value={person.isConfirmed.toString()}
                  onValueChange={value => handleConfirmationChange(index, value)}
                  className="space-y-1.5 sm:space-y-2">
                  {/* Yes Option */}
                  <div
                    className={`flex items-center space-x-2 p-2 sm:p-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                      person.isConfirmed
                        ? 'bg-green-50 border-green-300 text-green-800 shadow-sm'
                        : 'bg-gray-50 border-gray-200 hover:bg-green-50/50 hover:border-green-200'
                    }`}>
                    <RadioGroupItem value="true" id={`${person.type}-${person.name}-yes`} />
                    <Label
                      htmlFor={`${person.type}-${person.name}-yes`}
                      className="cursor-pointer flex items-center gap-1.5 sm:gap-2 flex-1">
                      <PartyPopper className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="font-medium text-xs sm:text-sm">Sim, vai comparecer</span>
                    </Label>
                  </div>

                  {/* No Option */}
                  <div
                    className={`flex items-center space-x-2 p-2 sm:p-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                      !person.isConfirmed
                        ? 'bg-red-50 border-red-300 text-red-800 shadow-sm'
                        : 'bg-gray-50 border-gray-200 hover:bg-red-50/50 hover:border-red-200'
                    }`}>
                    <RadioGroupItem value="false" id={`${person.type}-${person.name}-no`} />
                    <Label
                      htmlFor={`${person.type}-${person.name}-no`}
                      className="cursor-pointer flex items-center gap-1.5 sm:gap-2 flex-1">
                      <HeartHandshake className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="font-medium text-xs sm:text-sm">Não poderá ir</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Status Messages */}
        {confirmationStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 font-medium">
              🎉 Confirmações registradas com sucesso!
              {totalConfirmed > 0 && (
                <span className="block mt-1">
                  {totalConfirmed} pessoa{totalConfirmed > 1 ? 's' : ''} confirmada{totalConfirmed > 1 ? 's' : ''} para
                  o casamento.
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {confirmationStatus === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Ocorreu um erro ao registrar as confirmações. Por favor, tente novamente.
            </AlertDescription>
          </Alert>
        )}

        {/* Current Status Summary */}
        {!confirmationStatus && !hasChanged && (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-center space-y-2 sm:space-y-3">
                <h3 className="font-semibold text-wedding-charcoal text-sm sm:text-base">
                  Status Atual das Confirmações
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs sm:text-sm">
                  {confirmations.map((person, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                      <span className="font-medium truncate flex-1 mr-2">{person.name}</span>
                      <span
                        className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0 ${
                          person.isConfirmed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {person.isConfirmed ? 'Confirmado ✓' : 'Não confirmado ✗'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full max-w-md h-11 sm:h-12 text-base sm:text-lg font-semibold bg-gradient-to-r from-wedding-primary to-wedding-secondary hover:from-wedding-primary/90 hover:to-wedding-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                <span className="hidden sm:inline">Salvando confirmações...</span>
                <span className="sm:hidden">Salvando...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Confirmar Presenças</span>
                <span className="sm:hidden">Confirmar</span>
              </>
            )}
          </Button>

          {hasChanged && (
            <p className="text-xs sm:text-sm text-muted-foreground text-center px-4">
              Você fez alterações. Clique em "Confirmar" para salvar.
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
