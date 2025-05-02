'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface GuestFormProps {
  guest?: {
    id: number
    name: string
    isConfirmed: boolean
  }
}

export default function GuestForm({ guest }: GuestFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(guest?.name || '')

  const isEditing = !!guest

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!name.trim()) {
      setError('O nome é obrigatório')
      setIsSubmitting(false)
      return
    }

    try {
      const url = isEditing ? `/api/guests/${guest.id}` : '/api/guests'

      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Ocorreu um erro ao salvar o convidado')
      }

      router.push('/admin/convidados')
      router.refresh()
    } catch (err) {
      console.error('Erro ao salvar convidado:', err)
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      {error && <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md">{error}</div>}

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nome*
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          placeholder="Nome do convidado"
          required
        />
      </div>

      <div className="flex justify-between">
        <Link
          href="/admin/convidados"
          className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                    disabled:opacity-50 disabled:pointer-events-none">
          {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar Convidado' : 'Adicionar Convidado'}
        </button>
      </div>
    </form>
  )
}
