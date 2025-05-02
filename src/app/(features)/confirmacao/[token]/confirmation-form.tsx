'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Guest {
  id: number
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
      router.refresh()
    } catch (error) {
      console.error('Erro ao confirmar presença:', error)
      setConfirmationStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Você vai comparecer ao nosso casamento?</h2>
        <div className="flex space-x-4 justify-around items-center ">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="confirmation"
              checked={isConfirmed}
              onChange={() => setIsConfirmed(true)}
              className="w-4 h-4 mr-2"
            />
            <span>Sim</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="confirmation"
              checked={!isConfirmed}
              onChange={() => setIsConfirmed(false)}
              className="w-4 h-4 mr-2"
            />
            <span>Não</span>
          </label>
        </div>

        {confirmationStatus === 'success' && (
          <div className="p-3 bg-green-50 text-green-800 rounded-md">Sua resposta foi registrada com sucesso!</div>
        )}

        {confirmationStatus === 'error' && (
          <div className="p-3 bg-red-50 text-red-800 rounded-md">
            Ocorreu um erro ao registrar sua resposta. Por favor, tente novamente.
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg 
                  transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                  disabled:opacity-50 disabled:pointer-events-none">
        {isSubmitting ? 'Enviando...' : 'Confirmar'}
      </button>
    </form>
  )
}
