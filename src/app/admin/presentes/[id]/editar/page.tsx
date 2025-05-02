'use client'

import AdminProtected from '@/components/AdminProtected'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GiftFormData, giftSchema } from '../../schema'

export default function EditGiftPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<GiftFormData>({
    resolver: zodResolver(giftSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      pixKey: '',
      imageUrl: '',
    },
  })

  // Busca os dados do presente
  useEffect(() => {
    const fetchGift = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/gifts/${params?.id}`)

        if (!response.ok) {
          throw new Error('Falha ao carregar o presente')
        }

        const gift = await response.json()

        // Formata o preço para o formato brasileiro
        const formattedPrice = gift.price
          ? gift.price.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : ''

        // Preenche o formulário com os dados do presente
        reset({
          name: gift.name || '',
          description: gift.description || '',
          price: formattedPrice,
          pixKey: gift.pixKey || '',
          imageUrl: gift.imageUrl || '',
        })
      } catch (error) {
        console.error('Erro ao buscar presente:', error)
        setError('Não foi possível carregar os dados do presente')
      } finally {
        setIsLoading(false)
      }
    }

    fetchGift()
  }, [params.id, reset])

  // Função para formatar valor como moeda
  const formatAsCurrency = (value: string) => {
    // Remove qualquer caractere que não seja número
    const numericValue = value.replace(/\D/g, '')

    // Converte para número e formata como moeda brasileira
    if (numericValue) {
      const floatValue = parseInt(numericValue) / 100
      return floatValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    }
    return ''
  }

  // Manipulador para o campo de preço
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatAsCurrency(e.target.value)
    setValue('price', formattedValue)
  }

  const onSubmit = (formData: GiftFormData) => {
    setLoading(true)
    setError('')

    // Converter preço para número
    const processedData = {
      ...formData,
      price: formData.price ? parseFloat(formData.price.replace(/\./g, '').replace(',', '.')) : null,
    }

    updateGift(processedData)
  }

  const updateGift = async (data: any) => {
    try {
      const response = await fetch(`/api/gifts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar presente')
      }

      // Redirecionar para a página de gerenciamento após sucesso
      router.push('/admin/presentes')
    } catch (error) {
      console.error('Erro ao atualizar presente:', error)
      setError(error instanceof Error ? error.message : 'Ocorreu um erro ao atualizar o presente')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <AdminProtected>
        <div className="container mx-auto p-4">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Carregando...</p>
          </div>
        </div>
      </AdminProtected>
    )
  }

  return (
    <AdminProtected>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Editar Presente</h1>
          <button
            onClick={() => router.push('/admin/presentes')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Voltar
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
              Nome *
            </label>
            <input
              id="name"
              {...register('name')}
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
              Descrição
            </label>
            <textarea
              id="description"
              {...register('description')}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
              Preço (R$)
            </label>
            <input
              type="text"
              id="price"
              {...register('price')}
              onChange={handlePriceChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.price ? 'border-red-500' : ''}`}
              placeholder="0,00"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="pixKey" className="block text-gray-700 font-bold mb-2">
              Chave PIX
            </label>
            <input type="text" id="pixKey" {...register('pixKey')} className="w-full px-3 py-2 border rounded-md" />
            {errors.pixKey && <p className="text-red-500 text-sm mt-1">{errors.pixKey.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-gray-700 font-bold mb-2">
              URL da Imagem
            </label>
            <input type="text" id="imageUrl" {...register('imageUrl')} className="w-full px-3 py-2 border rounded-md" />
            {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => router.push('/admin/presentes')}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
              disabled={loading}>
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </AdminProtected>
  )
}
