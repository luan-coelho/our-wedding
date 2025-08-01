'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { guestsService } from '@/services/guests.service'
import {
  AlertCircle,
  Baby,
  CheckCircle,
  Heart,
  HeartHandshake,
  Loader2,
  PartyPopper,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { toast } from 'sonner'

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
  confirmationCode?: string
}

interface PersonConfirmation {
  name: string
  isConfirmed: boolean
  type: 'main' | 'spouse' | 'child' | 'companion'
}

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const [inputValue, setInputValue] = useState('')
  const [guest, setGuest] = useState<Guest | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmationStatus, setConfirmationStatus] = useState<'success' | 'error' | null>(null)
  const [hasChanged, setHasChanged] = useState(false)
  const [confirmations, setConfirmations] = useState<PersonConfirmation[]>([])

  // Check for token or code in URL params on component mount
  useEffect(() => {
    const urlToken = searchParams.get('token')
    const urlCode = searchParams.get('code')

    if (urlToken) {
      setInputValue(urlToken)
      fetchGuest(urlToken)
    } else if (urlCode) {
      setInputValue(urlCode)
      fetchGuest(urlCode)
    }
  }, [searchParams])

  // Detecta se o input é um código de 6 dígitos
  const isConfirmationCode = (value: string): boolean => {
    return /^\d{6}$/.test(value)
  }

  // Detecta se o input é um token UUID
  const isTokenUUID = (value: string): boolean => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  }

  // Extrai token de uma URL completa
  const extractTokenFromUrl = (value: string): string | null => {
    try {
      const url = new URL(value)
      // Verifica se é uma URL de confirmação
      const tokenMatch = url.pathname.match(/\/confirmacao\/([^\/]+)/)
      if (tokenMatch) {
        return tokenMatch[1]
      }

      // Verifica se há token como query param
      const tokenParam = url.searchParams.get('token')
      if (tokenParam) {
        return tokenParam
      }

      // Verifica se há code como query param
      const codeParam = url.searchParams.get('code')
      if (codeParam) {
        return codeParam
      }

      return null
    } catch {
      return null
    }
  }

  const fetchGuest = async (value: string) => {
    try {
      setIsLoading(true)
      let guestData: Guest

      if (isConfirmationCode(value)) {
        // Buscar por código de 6 dígitos
        guestData = await guestsService.getByCode(value)
      } else if (isTokenUUID(value)) {
        // Buscar por token UUID
        const response = await fetch(`/api/confirmacao/${value}`)
        if (!response.ok) {
          throw new Error('Token inválido ou expirado')
        }
        guestData = await response.json()
      } else {
        // Tentar extrair token de URL completa
        const extractedToken = extractTokenFromUrl(value)
        if (extractedToken) {
          if (isConfirmationCode(extractedToken)) {
            guestData = await guestsService.getByCode(extractedToken)
          } else if (isTokenUUID(extractedToken)) {
            const response = await fetch(`/api/confirmacao/${extractedToken}`)
            if (!response.ok) {
              throw new Error('Token inválido ou expirado')
            }
            guestData = await response.json()
          } else {
            throw new Error('Token extraído da URL é inválido.')
          }
        } else {
          throw new Error('Formato inválido. Use um código de 6 dígitos, um token válido ou uma URL completa.')
        }
      }

      setGuest(guestData)

      // Initialize confirmations
      const people: PersonConfirmation[] = [
        {
          name: guestData.name,
          isConfirmed: guestData.isConfirmed,
          type: 'main',
        },
      ]

      if (guestData.spouse) {
        people.push({
          name: guestData.spouse,
          isConfirmed: guestData.spouseConfirmation || false,
          type: 'spouse',
        })
      }

      if (guestData.children && guestData.children.length > 0) {
        guestData.children.forEach((child: string) => {
          people.push({
            name: child,
            isConfirmed: guestData.childrenConfirmations?.[child] || false,
            type: 'child',
          })
        })
      }

      if (guestData.companions && guestData.companions.length > 0) {
        guestData.companions.forEach((companion: string) => {
          people.push({
            name: companion,
            isConfirmed: guestData.companionsConfirmations?.[companion] || false,
            type: 'companion',
          })
        })
      }

      setConfirmations(people)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      fetchGuest(inputValue.trim())
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    // Auto-detect and process if it looks like a URL
    if (value.startsWith('http') && value.includes('/confirmacao/')) {
      const extractedToken = extractTokenFromUrl(value)
      if (extractedToken) {
        // Small delay to allow user to see the URL was processed
        setTimeout(() => {
          fetchGuest(extractedToken)
        }, 500)
      }
    }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!guest) return

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

      // Determinar o método de confirmação baseado no input original
      const originalInput = inputValue.trim()

      if (isConfirmationCode(originalInput)) {
        // Confirmar usando código de 6 dígitos
        await guestsService.confirmByCode(originalInput, requestData)
      } else {
        // Para tokens UUID ou URLs, sempre usar o token do guest
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
      }

      setConfirmationStatus('success')
      setHasChanged(false)
      toast.success('Confirmação registrada com sucesso!')
    } catch (error) {
      setConfirmationStatus('error')
      if (error instanceof Error) {
        toast.error(error.message || 'Falha ao confirmar presença. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalConfirmed = confirmations.filter(p => p.isConfirmed).length
  const totalPeople = confirmations.length

  const resetForm = () => {
    setInputValue('')
    setGuest(null)
    setConfirmations([])
    setConfirmationStatus(null)
    setHasChanged(false)
  }

  return (
    <section
      id="confirmation"
      className="py-32 bg-gradient-to-b from-white via-rose-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d946ef' fill-opacity='0.3'%3E%3Ccircle cx='50' cy='50' r='4'/%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='80' cy='20' r='2'/%3E%3Ccircle cx='20' cy='80' r='2'/%3E%3Ccircle cx='80' cy='80' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-wedding-primary"></div>
            <CheckCircle className="w-6 h-6 mx-4 text-wedding-primary" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-wedding-primary"></div>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-800 mb-8 wedding-heading tracking-wide">
            Confirmação de Presença
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light wedding-subtitle">
            Confirme sua presença em nosso casamento usando o código que você recebeu
          </p>

          <div className="mt-10 flex justify-center">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-wedding-primary/30 to-transparent"></div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="max-w-4xl mx-auto mb-12">
          <Alert className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-lg">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />

            <AlertDescription className="text-amber-800 font-medium">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <p className="font-semibold text-amber-900">
                    <strong>AVISO IMPORTANTE:</strong> Confirme sua presença até <strong>31/08/2025</strong>
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p>
                    Este convite é <strong>exclusivo</strong> para os nomes que aparecem na confirmação. Não será
                    permitida a entrada de pessoas não convidadas.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <HeartHandshake className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p>Por favor, respeite essa orientação para evitar constrangimentos no dia do evento.</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!guest ? (
            /* Token Input Form */
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-wedding-primary/5 to-purple-50/30"></div>
              <CardHeader className="text-center pb-4 relative z-10">
                <div className="w-20 h-20 bg-wedding-primary to-wedding-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserCheck className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl wedding-subtitle text-wedding-dark mb-4">
                  Digite seu Código de Confirmação
                </CardTitle>
                <CardDescription className="text-lg text-wedding-accent/80 max-w-lg mx-auto">
                  Você recebeu um código de 6 dígitos por email/WhatsApp ou um link único. Digite o código ou cole o
                  link abaixo para confirmar sua presença.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 relative z-10">
                <form onSubmit={handleInputSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="input" className="text-wedding-dark font-medium">
                      Código de Confirmação
                    </Label>
                    <Input
                      id="input"
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      placeholder="Digite seu código de 6 dígitos ou cole o link completo"
                      maxLength={200}
                      className="text-lg p-4 h-14 border-2 border-wedding-light/50 focus:border-wedding-primary"
                      disabled={isLoading}
                    />
                    <p className="text-sm text-wedding-accent mt-2">
                      Exemplos: <span className="font-mono">123456</span> ou{' '}
                      <span className="font-mono text-xs">https://www.casamento-luan-e-ester.com.br/?code=123456</span>
                    </p>
                    {inputValue.startsWith('http') && (
                      <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Processando URL...
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="w-full h-14 text-lg bg-wedding-primary to-wedding-secondary hover:from-wedding-primary/90 hover:to-wedding-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Confirmar Presença
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            /* Confirmation Form */
            <div className="space-y-8">
              {/* Guest Welcome */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Heart className="w-6 h-6 text-wedding-primary fill-current" />
                    <Sparkles className="w-5 h-5 text-wedding-secondary fill-current" />
                    <Heart className="w-6 h-6 text-wedding-primary fill-current" />
                  </div>
                  <CardTitle className="text-2xl wedding-accent-text text-wedding-dark">
                    Olá, {guest.name}! 💜
                  </CardTitle>
                  <CardDescription className="text-lg text-wedding-accent/80">
                    Confirme a presença de cada pessoa individualmente
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Status Summary */}
              {confirmations.length > 0 && (
                <div className="text-center space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
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
              )}

              {/* Confirmation Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {confirmations.map((person, index) => (
                    <Card key={`${person.type}-${person.name}`} className="border-2 transition-all hover:shadow-lg">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold flex items-center justify-center gap-2">
                          <span className={getPersonTypeColor(person.type)}>{getPersonIcon(person.type)}</span>
                          <span className="text-wedding-charcoal truncate">{person.name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <RadioGroup
                          value={person.isConfirmed.toString()}
                          onValueChange={value => handleConfirmationChange(index, value)}
                          className="space-y-2">
                          {/* Yes Option */}
                          <div
                            className={`flex items-center space-x-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                              person.isConfirmed
                                ? 'bg-green-50 border-green-300 text-green-800 shadow-sm'
                                : 'bg-gray-50 border-gray-200 hover:bg-green-50/50 hover:border-green-200'
                            }`}>
                            <RadioGroupItem value="true" id={`${person.type}-${person.name}-yes`} />
                            <Label
                              htmlFor={`${person.type}-${person.name}-yes`}
                              className="cursor-pointer flex items-center gap-2 flex-1">
                              <PartyPopper className="h-4 w-4 flex-shrink-0" />
                              <span className="font-medium text-sm">Sim, vai comparecer</span>
                            </Label>
                          </div>

                          {/* No Option */}
                          <div
                            className={`flex items-center space-x-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                              !person.isConfirmed
                                ? 'bg-red-50 border-red-300 text-red-800 shadow-sm'
                                : 'bg-gray-50 border-gray-200 hover:bg-red-50/50 hover:border-red-200'
                            }`}>
                            <RadioGroupItem value="false" id={`${person.type}-${person.name}-no`} />
                            <Label
                              htmlFor={`${person.type}-${person.name}-no`}
                              className="cursor-pointer flex items-center gap-2 flex-1">
                              <HeartHandshake className="h-4 w-4 flex-shrink-0" />
                              <span className="font-medium text-sm">Não poderá ir</span>
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
                          {totalConfirmed} pessoa{totalConfirmed > 1 ? 's' : ''} confirmada
                          {totalConfirmed > 1 ? 's' : ''} para o casamento.
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

                {/* Submit Button */}
                <div className="flex flex-col items-center gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full max-w-md h-12 text-lg font-semibold bg-gradient-to-r from-wedding-primary to-wedding-secondary hover:from-wedding-primary/90 hover:to-wedding-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Salvando confirmações...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Confirmar Presenças
                      </>
                    )}
                  </Button>

                  {hasChanged && (
                    <p className="text-sm text-muted-foreground text-center">
                      Você fez alterações. Clique em &ldquo;Confirmar&rdquo; para salvar.
                    </p>
                  )}

                  <Button
                    type="button"
                    onClick={resetForm}
                    variant="outline"
                    className="mt-4 border-wedding-accent/30 text-wedding-accent hover:bg-wedding-accent/10">
                    Usar outro código
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default function Confirmation() {
  return (
    <Suspense
      fallback={
        <section
          id="confirmation"
          className="py-32 bg-gradient-to-br from-wedding-lavender/20 via-white to-wedding-lilac/20 relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-4xl relative z-10">
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <Loader2 className="w-8 h-8 animate-spin text-wedding-primary" />
              </div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-wedding-dark mb-8 wedding-heading tracking-wide">
                Confirmação de Presença
              </h2>
              <p className="text-xl md:text-2xl text-wedding-charcoal/80 max-w-3xl mx-auto leading-relaxed font-light wedding-subtitle">
                Carregando...
              </p>
            </div>
          </div>
        </section>
      }>
      <ConfirmationContent />
    </Suspense>
  )
}
