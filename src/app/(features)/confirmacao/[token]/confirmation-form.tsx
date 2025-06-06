'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, XCircle, Loader2, AlertCircle, PartyPopper, HeartHandshake } from 'lucide-react'

interface Guest {
  id: string
  name: string
  isConfirmed: boolean
  token: string
}

interface ConfirmationFormProps {
  guest: Guest
}

export default function ConfirmationForm({ guest }: ConfirmationFormProps) {
  const router = useRouter()
  const [isConfirmed, setIsConfirmed] = useState(guest.isConfirmed)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmationStatus, setConfirmationStatus] = useState<'success' | 'error' | null>(null)
  const [hasChanged, setHasChanged] = useState(false)

  const handleConfirmationChange = (value: string) => {
    const newValue = value === 'true'
    setIsConfirmed(newValue)
    setHasChanged(newValue !== guest.isConfirmed)
    setConfirmationStatus(null)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/confirmacao/${guest.token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isConfirmed }),
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-wedding-charcoal mb-2">
            Você vai comparecer ao nosso casamento?
          </h2>
          <p className="text-sm text-muted-foreground">
            Selecione uma opção abaixo
          </p>
        </div>

        <RadioGroup
          value={isConfirmed.toString()}
          onValueChange={handleConfirmationChange}
          className="grid grid-cols-2 gap-4"
        >
          {/* Yes Option - Green Color Scheme */}
          <Card className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            isConfirmed
              ? 'ring-2 ring-green-500 bg-green-50 border-green-200'
              : 'hover:bg-green-50/50 hover:border-green-200/50'
          }`}>
            <CardContent className="flex items-center justify-center p-6">
              <div className="flex flex-col items-center space-y-3">
                <RadioGroupItem value="true" id="yes" className="sr-only" />
                <label htmlFor="yes" className="cursor-pointer flex flex-col items-center space-y-2">
                  <PartyPopper className={`h-8 w-8 transition-colors ${
                    isConfirmed ? 'text-green-600' : 'text-muted-foreground hover:text-green-500'
                  }`} />
                  <span className={`font-medium text-lg transition-colors ${
                    isConfirmed ? 'text-green-700' : 'text-foreground'
                  }`}>
                    Sim, estarei lá!
                  </span>
                  <span className={`text-xs text-center transition-colors ${
                    isConfirmed ? 'text-green-600' : 'text-muted-foreground'
                  }`}>
                    Mal posso esperar para celebrar com vocês
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* No Option - Red/Destructive Color Scheme */}
          <Card className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            !isConfirmed
              ? 'ring-2 ring-destructive bg-destructive/10 border-destructive/30'
              : 'hover:bg-destructive/5 hover:border-destructive/20'
          }`}>
            <CardContent className="flex items-center justify-center p-6">
              <div className="flex flex-col items-center space-y-3">
                <RadioGroupItem value="false" id="no" className="sr-only" />
                <label htmlFor="no" className="cursor-pointer flex flex-col items-center space-y-2">
                  <HeartHandshake className={`h-8 w-8 transition-colors ${
                    !isConfirmed ? 'text-destructive' : 'text-muted-foreground hover:text-destructive/70'
                  }`} />
                  <span className={`font-medium text-lg transition-colors ${
                    !isConfirmed ? 'text-destructive' : 'text-foreground'
                  }`}>
                    Não poderei ir
                  </span>
                  <span className={`text-xs text-center transition-colors ${
                    !isConfirmed ? 'text-destructive/80' : 'text-muted-foreground'
                  }`}>
                    Sentiremos sua falta
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>

        {confirmationStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 font-medium">
              🎉 Sua resposta foi registrada com sucesso! {isConfirmed ? 'Obrigado por confirmar sua presença.' : 'Agradecemos por nos informar.'}
            </AlertDescription>
          </Alert>
        )}

        {confirmationStatus === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Ocorreu um erro ao registrar sua resposta. Por favor, tente novamente.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-wedding-primary to-wedding-secondary hover:from-wedding-primary/90 hover:to-wedding-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Enviando...
          </>
        ) : (
          'Confirmar Presença'
        )}
      </Button>

      {!confirmationStatus && (
        <p className="text-center text-sm text-muted-foreground">
          {hasChanged ? (
            'Clique em "Confirmar Presença" para salvar sua resposta'
          ) : (
            <>
              Sua resposta atual: <span className={`font-medium ${
                isConfirmed ? 'text-green-600' : 'text-destructive'
              }`}>
                {isConfirmed ? 'Confirmado ✓' : 'Não confirmado ✗'}
              </span>
            </>
          )}
        </p>
      )}
    </form>
  )
}
