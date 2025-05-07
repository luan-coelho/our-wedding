'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FaCheck, FaClipboard, FaGift, FaQrcode } from 'react-icons/fa'

interface Gift {
  id: number
  name: string
  description: string
  price: number | null
  pixKey: string | null
  imageUrl: string | null
  pixKeyId: number | null
  selectedPixKey?: {
    id: number
    name: string
    key: string
    type: string
  } | null
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

  // Função para obter a chave PIX efetiva (chave personalizada ou chave selecionada)
  const getEffectivePixKey = (gift: Gift): string | null => {
    // Usar a chave personalizada se estiver definida
    if (gift.pixKey) {
      return gift.pixKey
    }
    // Caso contrário, usar a chave selecionada se disponível
    if (gift.selectedPixKey) {
      return gift.selectedPixKey.key
    }
    // Se nenhuma chave estiver disponível, retornar null
    return null
  }

  // Função para copiar a chave PIX para o clipboard
  const copyToClipboard = (gift: Gift, id: number) => {
    const pixKey = getEffectivePixKey(gift)
    if (!pixKey) return

    navigator.clipboard.writeText(pixKey).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  // Função para gerar um QR Code (simulado)
  const getQRCodeUrl = (gift: Gift) => {
    const pixKey = getEffectivePixKey(gift)
    if (!pixKey) return ''

    // Em um caso real, você usaria uma API para gerar o QR Code
    // Aqui estamos usando um placeholder
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${pixKey}`
  }

  const selectedGift = showQRCode !== null ? gifts.find(g => g.id === showQRCode) : null

  return (
    <div className="py-16 px-4 wedding-container bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-serif mb-6 text-wedding-dark">Lista de Presentes</h1>
          <div className="w-24 h-0.5 bg-wedding-primary/50 mx-auto mb-6" />
          <p className="text-lg text-wedding-accent mb-2 max-w-2xl mx-auto">
            Sua presença é o nosso maior presente, mas se desejar nos presentear, aqui estão algumas sugestões.
          </p>
          <p className="text-wedding-accent max-w-2xl mx-auto">
            Você pode contribuir com o valor total ou parcial de qualquer item através do PIX.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-5 w-20 mb-6" />
                </CardContent>
                <CardFooter className="flex justify-between gap-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : gifts.length === 0 ? (
          <div className="text-center py-16 rounded-lg border border-dashed border-wedding-accent/30">
            <FaGift className="text-6xl text-wedding-accent/30 mx-auto mb-4" />
            <p className="text-xl text-wedding-accent">Nenhum presente cadastrado no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gifts &&
              gifts.map(gift => (
                <Card key={gift.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                  <div className="relative h-48 w-full bg-slate-100">
                    {gift.imageUrl ? (
                      <Image src={gift.imageUrl} alt={gift.name} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FaGift className="text-6xl text-wedding-primary/30" />
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-wedding-dark">{gift.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{gift.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="pb-4">
                    <p className="font-medium text-xl text-wedding-primary">{formatPrice(gift.price)}</p>
                  </CardContent>

                  <CardFooter className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(gift, gift.id)}
                      className="flex-1"
                      disabled={!getEffectivePixKey(gift)}>
                      {copiedId === gift.id ? (
                        <>
                          <FaCheck className="mr-2 h-4 w-4" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <FaClipboard className="mr-2 h-4 w-4" />
                          Copiar PIX
                        </>
                      )}
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => setShowQRCode(gift.id)}
                      disabled={!getEffectivePixKey(gift)}>
                      <FaQrcode className="mr-2 h-4 w-4" />
                      QR Code
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        )}

        {/* Dialog para QR Code */}
        <Dialog open={showQRCode !== null} onOpenChange={open => !open && setShowQRCode(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">QR Code PIX</DialogTitle>
              <DialogDescription className="text-center">
                Escaneie o código QR para realizar a transferência PIX
              </DialogDescription>
            </DialogHeader>

            {selectedGift && getEffectivePixKey(selectedGift) && (
              <div className="flex flex-col items-center p-4">
                <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border">
                  <Image src={getQRCodeUrl(selectedGift)} alt="QR Code PIX" width={200} height={200} />
                </div>

                <p className="text-sm text-gray-500 mb-4 text-center">
                  Chave PIX: {getEffectivePixKey(selectedGift)}
                  {selectedGift.selectedPixKey && (
                    <span className="block mt-1 text-xs">
                      {selectedGift.selectedPixKey.name} ({selectedGift.selectedPixKey.type})
                    </span>
                  )}
                </p>

                <Button onClick={() => copyToClipboard(selectedGift, selectedGift.id)} className="w-full">
                  {copiedId === selectedGift.id ? (
                    <>
                      <FaCheck className="mr-2 h-4 w-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <FaClipboard className="mr-2 h-4 w-4" />
                      Copiar Chave PIX
                    </>
                  )}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <div className="mt-16 max-w-2xl mx-auto text-center bg-wedding-accent/5 p-8 rounded-xl border border-wedding-accent/10">
          <h2 className="text-2xl font-serif text-wedding-dark mb-4">Obrigado pelo seu presente!</h2>
          <p className="text-wedding-accent">
            Seu carinho e generosidade significam muito para nós neste momento tão especial. Cada contribuição nos
            ajudará a construir nosso novo lar juntos.
          </p>
        </div>
      </div>
    </div>
  )
}
