'use client'

import AdminProtected from '@/components/AdminProtected'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Esquema de validação Zod
const giftSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.string().optional(),
  pixKey: z.string().optional(),
  imageUrl: z.string().min(1, 'URL da imagem é obrigatória'),
})

type GiftFormData = z.infer<typeof giftSchema>

export default function AddGiftPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
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

    saveGift(processedData)
  }

  const saveGift = async (data: any) => {
    try {
      const response = await fetch('/api/gifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar presente')
      }

      // Redirecionar para a página de gerenciamento após sucesso
      router.push('/admin/presentes')
    } catch (error) {
      console.error('Erro ao criar presente:', error)
      setError(error instanceof Error ? error.message : 'Ocorreu um erro ao criar o presente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminProtected>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Adicionar Novo Presente</h1>
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
