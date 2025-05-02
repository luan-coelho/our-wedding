'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaGift, FaClipboard, FaCheck, FaQrcode } from 'react-icons/fa'
import { IoCloseOutline } from 'react-icons/io5'

interface Gift {
  id: number
  name: string
  description: string
  price: number | null
  pixKey: string | null
  imageUrl: string | null
}

export default function PresentesPage() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [showQRCode, setShowQRCode] = useState<number | null>(null)

  useEffect(() => {
    fetchGifts()
  }, [])

  const fetchGifts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/gifts')
      const data = await response.json()
      setGifts(data)
    } catch (error) {
      console.error('Erro ao buscar presentes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Função para formatar o preço em reais
  const formatPrice = (price: number | null) => {
    if (price === null) return '-'

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  // Função para copiar a chave PIX para o clipboard
  const copyToClipboard = (pixKey: string | null, id: number) => {
    if (!pixKey) return

    navigator.clipboard.writeText(pixKey).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  // Função para gerar um QR Code (simulado)
  const getQRCodeUrl = (pixKey: string | null) => {
    if (!pixKey) return ''

    // Em um caso real, você usaria uma API para gerar o QR Code
    // Aqui estamos usando um placeholder
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${pixKey}`
  }

  return (
    <div className="py-16 px-4 wedding-container">
      <h1 className="text-3xl md:text-4xl text-center mb-4 font-light">Lista de Presentes</h1>
      <p className="text-center text-wedding-accent mb-12 max-w-2xl mx-auto">
        Sua presença é o nosso maior presente, mas se desejar nos presentear, aqui estão algumas sugestões. Você pode
        contribuir com o valor total ou parcial de qualquer item através do PIX.
      </p>

      {isLoading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : gifts.length === 0 ? (
        <div className="text-center py-8 text-wedding-accent">Nenhum presente cadastrado no momento.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gifts &&
            gifts.map(gift => (
              <div key={gift.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative h-48 w-full bg-gray-100">
                  {gift.imageUrl ? (
                    <Image src={gift.imageUrl} alt={gift.name} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <FaGift className="text-6xl text-wedding-primary/30" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-medium text-lg text-wedding-dark mb-2">{gift.name}</h3>
                  <p className="text-wedding-accent mb-4 text-sm">{gift.description}</p>
                  <p className="font-medium text-wedding-primary mb-6">{formatPrice(gift.price)}</p>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => copyToClipboard(gift.pixKey, gift.id)}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-wedding-primary/10 text-wedding-dark rounded-md text-sm font-medium hover:bg-wedding-primary/20 transition-colors"
                      disabled={!gift.pixKey}>
                      {copiedId === gift.id ? (
                        <>
                          <FaCheck className="mr-2" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <FaClipboard className="mr-2" />
                          Copiar PIX
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setShowQRCode(gift.id)}
                      className="flex items-center justify-center px-4 py-2 bg-wedding-accent/10 text-wedding-dark rounded-md text-sm font-medium hover:bg-wedding-accent/20 transition-colors"
                      disabled={!gift.pixKey}>
                      <FaQrcode className="mr-2" />
                      QR Code
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-wedding-dark">QR Code PIX</h3>
              <button onClick={() => setShowQRCode(null)} className="text-wedding-dark hover:text-wedding-accent">
                <IoCloseOutline size={24} />
              </button>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-wedding-accent mb-4 text-center">
                Escaneie o código QR para realizar a transferência PIX
              </p>

              {(() => {
                const gift = gifts.find(g => g.id === showQRCode)
                if (!gift || !gift.pixKey) return null

                return (
                  <>
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                      <Image src={getQRCodeUrl(gift.pixKey)} alt="QR Code PIX" width={200} height={200} />
                    </div>

                    <p className="text-sm text-gray-500 mb-4 text-center">Chave PIX: {gift.pixKey}</p>

                    <button
                      onClick={() => copyToClipboard(gift.pixKey, gift.id)}
                      className="flex items-center px-4 py-2 bg-wedding-primary text-wedding-dark rounded-md text-sm font-medium hover:bg-wedding-primary/90 transition-colors">
                      {copiedId === showQRCode ? (
                        <>
                          <FaCheck className="mr-2" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <FaClipboard className="mr-2" />
                          Copiar Chave PIX
                        </>
                      )}
                    </button>
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-light text-wedding-dark mb-4">Obrigado pelo seu presente!</h2>
        <p className="text-wedding-accent">
          Seu carinho e generosidade significam muito para nós neste momento tão especial. Cada contribuição nos ajudará
          a construir nosso novo lar juntos.
        </p>
      </div>
    </div>
  )
}
