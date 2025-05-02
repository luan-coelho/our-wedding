'use client'

import AdminProtected from '@/components/AdminProtected'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Gift {
  id: number
  name: string
  description: string
  price: number | null
  pixKey: string | null
  imageUrl: string | null
}

export default function AdminGiftsPage() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchGifts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/gifts')
      if (!response.ok) {
        throw new Error('Falha ao buscar presentes')
      }
      const data = await response.json()
      setGifts(data)
    } catch (error) {
      setError('Erro ao carregar presentes')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGifts()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este presente?')) {
      return
    }

    try {
      const response = await fetch(`/api/gifts/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Falha ao excluir presente')
      }

      await fetchGifts()
    } catch (error) {
      console.error('Erro ao excluir presente:', error)
      setError('Erro ao excluir presente')
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/admin/presentes/${id}/editar`)
  }

  const handleAdd = () => {
    router.push('/admin/presentes/novo')
  }

  return (
    <AdminProtected>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Presentes</h1>
          <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Adicionar Presente
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        {loading ? (
          <div className="text-center py-4">Carregando...</div>
        ) : gifts.length === 0 ? (
          <div className="text-center py-4">Nenhum presente encontrado</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Nome</th>
                  <th className="py-2 px-4 border-b text-left">Descrição</th>
                  <th className="py-2 px-4 border-b text-left">Preço</th>
                  <th className="py-2 px-4 border-b text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {gifts.map(gift => (
                  <tr key={gift.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{gift.name}</td>
                    <td className="py-2 px-4 border-b">{gift.description}</td>
                    <td className="py-2 px-4 border-b">{gift.price ? `R$ ${gift.price.toFixed(2)}` : '-'}</td>
                    <td className="py-2 px-4 border-b text-center">
                      <button
                        onClick={() => handleEdit(gift.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(gift.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminProtected>
  )
}
