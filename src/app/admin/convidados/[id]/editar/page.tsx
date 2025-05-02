'use client'

import { useParams, notFound } from 'next/navigation'
import GuestForm from '../../guest-form'
import { useQuery } from '@tanstack/react-query'
import AdminProtected from '@/components/AdminProtected'

interface Guest {
  id: number
  name: string
  isConfirmed: boolean
}

export default function EditGuestPage() {
  const params = useParams()
  const id = parseInt(params.id as string)

  if (isNaN(id)) {
    notFound()
  }

  // Buscar convidado pelo ID
  const { data: guest, isLoading, error } = useQuery({
    queryKey: ['guest', id],
    queryFn: async (): Promise<Guest> => {
      const response = await fetch(`/api/guests/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          notFound()
        }
        throw new Error('Falha ao buscar detalhes do convidado')
      }
      return response.json()
    },
  })

  if (error) {
    console.error('Erro ao buscar convidado:', error)
    return <div>Erro ao carregar dados do convidado</div>
  }

  return (
    <AdminProtected>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Editar Convidado</h1>
        {isLoading ? (
          <div className="text-center py-4">Carregando...</div>
        ) : guest ? (
          <GuestForm guest={guest} />
        ) : null}
      </div>
    </AdminProtected>
  )
}
