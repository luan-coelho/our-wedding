'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { FaCheck, FaClipboard, FaGift, FaQrcode, FaHeart, FaStar } from 'react-icons/fa'
import { Gift, Sparkles, Star, ShoppingBag } from 'lucide-react'
import { Gift as GiftType } from '@/types'

export default function Gifts() {
  const [gifts, setGifts] = useState<GiftType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showQRCode, setShowQRCode] = useState<string | null>(null)

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
  const getEffectivePixKey = (gift: GiftType): string | null => {
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
  const copyToClipboard = (gift: GiftType, id: string) => {
    const pixKey = getEffectivePixKey(gift)
    if (!pixKey) return

    navigator.clipboard.writeText(pixKey).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  // Função para gerar um QR Code (simulado)
  const getQRCodeUrl = (gift: GiftType) => {
    const pixKey = getEffectivePixKey(gift)
    if (!pixKey) return ''

    // Em um caso real, você usaria uma API para gerar o QR Code
    // Aqui estamos usando um placeholder
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${pixKey}`
  }

  const selectedGift = showQRCode !== null ? gifts.find(g => g.id === showQRCode) : null

  return (
    <section
      id="gifts"
      className="py-32 bg-gradient-to-b from-wedding-light/10 via-white to-wedding-light/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d946ef' fill-opacity='0.3'%3E%3Cpath d='M40 40l20-20v40l-20-20zm0 0l-20-20v40l20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">
          <Gift className="w-8 h-8 text-wedding-primary/30 fill-current" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <FaHeart className="text-6xl text-rose-300/30" />
        </div>
        <div className="absolute bottom-32 left-20 animate-float">
          <ShoppingBag className="w-7 h-7 text-wedding-primary/30 fill-current" />
        </div>
        <div className="absolute top-60 right-1/4 animate-float-delayed">
          <Sparkles className="w-6 h-6 text-purple-300/30 fill-current" />
        </div>
        <div className="absolute bottom-40 left-1/3 animate-float">
          <Star className="w-5 h-5 text-rose-300/30 fill-current" />
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <FaHeart className="text-wedding-primary/60 text-2xl animate-pulse" />
            <FaStar className="text-wedding-secondary/70 text-lg" />
            <FaGift className="text-wedding-accent/60 text-3xl" />
            <FaStar className="text-wedding-secondary/70 text-lg" />
            <FaHeart className="text-wedding-primary/60 text-2xl animate-pulse" />
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-wedding-dark mb-8 font-serif tracking-wide">
            Lista de Presentes
          </h2>

          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-16 h-px bg-wedding-primary/30" />
            <FaHeart className="text-wedding-primary/50 text-sm" />
            <div className="w-16 h-px bg-wedding-primary/30" />
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-xl md:text-2xl text-wedding-dark/80 leading-relaxed font-light">
              Sua presença é o nosso maior presente, mas se desejar nos presentear, aqui estão algumas sugestões
              especiais.
            </p>
            <p className="text-lg md:text-xl text-wedding-accent/90 leading-relaxed font-light">
              Você pode contribuir com o valor total ou parcial de qualquer item através do PIX.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-wedding-primary/30 to-transparent"></div>
          </div>
        </div>

        {/* Gifts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <div className="relative h-56 w-full">
                  <Skeleton className="h-full w-full rounded-t-xl" />
                </div>
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="pb-4">
                  <Skeleton className="h-7 w-24" />
                </CardContent>
                <CardFooter className="flex gap-3 pt-4">
                  <Skeleton className="h-11 flex-1" />
                  <Skeleton className="h-11 w-28" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : gifts.length === 0 ? (
          <div className="text-center py-20 lg:py-24 mb-20">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-wedding-accent/20 p-12 lg:p-16 max-w-md mx-auto shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-6">
                <FaHeart className="text-wedding-primary/40 text-2xl" />
                <FaGift className="text-wedding-accent/50 text-5xl" />
                <FaHeart className="text-wedding-primary/40 text-2xl" />
              </div>
              <h3 className="text-2xl font-serif text-wedding-dark mb-4">Em breve...</h3>
              <p className="text-lg text-wedding-accent/80 leading-relaxed">
                Nossa lista de presentes estará disponível em breve. Fique atento às novidades!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
            {gifts.map(gift => (
              <Card
                key={gift.id}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm hover:-translate-y-2">
                <div className="relative h-56 w-full bg-gradient-to-br from-wedding-light/30 to-wedding-secondary/20 overflow-hidden">
                  {gift.imageUrl ? (
                    <Image
                      src={gift.imageUrl}
                      alt={gift.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <FaGift className="text-6xl text-wedding-primary/40 mx-auto mb-2 group-hover:text-wedding-primary/60 transition-colors" />
                        <p className="text-sm text-wedding-accent/60 font-medium">Imagem em breve</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <CardHeader className="pb-3 px-6 pt-6">
                  <CardTitle className="text-xl font-serif text-wedding-dark group-hover:text-wedding-primary transition-colors duration-300 leading-tight">
                    {gift.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-wedding-accent/80 leading-relaxed">
                    {gift.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-6 px-6">
                  <div className="flex items-center gap-2">
                    <FaStar className="text-wedding-secondary/60 text-sm" />
                    <p className="font-semibold text-2xl text-wedding-primary">{formatPrice(gift.price)}</p>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-3 px-6 pb-6">
                  <Button
                    onClick={() => copyToClipboard(gift, gift.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
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
                    variant="outline"
                    onClick={() => setShowQRCode(gift.id)}
                    className="border-wedding-accent/30 text-wedding-accent hover:bg-wedding-accent/10 hover:border-wedding-accent/50 shadow-md hover:shadow-lg transition-all duration-300"
                    disabled={!getEffectivePixKey(gift)}>
                    <FaQrcode className="mr-2 h-4 w-4" />
                    QR Code
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Thank You Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-wedding-light/40 via-white/60 to-wedding-secondary/20 backdrop-blur-sm p-8 lg:p-12 rounded-3xl border border-wedding-accent/15 shadow-xl">
            <div className="flex items-center justify-center gap-2 mb-6">
              <FaHeart className="text-wedding-primary/60 text-2xl animate-pulse" />
              <FaStar className="text-wedding-secondary/70 text-lg" />
              <FaHeart className="text-wedding-primary/60 text-2xl animate-pulse" />
            </div>

            <h3 className="text-3xl lg:text-4xl font-serif text-wedding-dark mb-6 leading-tight text-center">
              Obrigado pelo seu carinho!
            </h3>

            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-px bg-wedding-primary/30" />
              <FaHeart className="text-wedding-primary/50 text-xs" />
              <div className="w-12 h-px bg-wedding-primary/30" />
            </div>

            <p className="text-lg lg:text-xl text-wedding-accent/90 leading-relaxed max-w-2xl mx-auto text-center">
              Sua generosidade e carinho significam muito para nós neste momento tão especial. Cada contribuição nos
              ajudará a construir nosso novo lar com muito amor e gratidão.
            </p>

            <div className="flex items-center justify-center gap-4 mt-8">
              <FaHeart className="text-wedding-primary/40 text-sm" />
              <span className="text-wedding-accent/60 font-medium">Com amor, Luan & Ester</span>
              <FaHeart className="text-wedding-primary/40 text-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Dialog para QR Code */}
      <Dialog open={showQRCode !== null} onOpenChange={open => !open && setShowQRCode(null)}>
        <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-sm border-wedding-accent/20">
          <DialogHeader className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaQrcode className="text-wedding-primary text-2xl" />
              <FaHeart className="text-wedding-secondary/60 text-lg" />
            </div>
            <DialogTitle className="text-2xl font-serif text-wedding-dark">QR Code PIX</DialogTitle>
            <DialogDescription className="text-wedding-accent/80 leading-relaxed">
              Escaneie o código QR com seu aplicativo bancário para realizar a transferência PIX
            </DialogDescription>
          </DialogHeader>

          {selectedGift && getEffectivePixKey(selectedGift) && (
            <div className="flex flex-col items-center p-6 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-wedding-accent/20">
                <Image
                  src={getQRCodeUrl(selectedGift)}
                  alt="QR Code PIX"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>

              <div className="text-center space-y-2 bg-wedding-light/30 p-4 rounded-xl border border-wedding-accent/10 w-full">
                <p className="text-sm font-medium text-wedding-dark">Chave PIX:</p>
                <p className="text-base font-mono text-wedding-primary break-all">{getEffectivePixKey(selectedGift)}</p>
                {selectedGift.selectedPixKey && (
                  <p className="text-xs text-wedding-accent/70">
                    {selectedGift.selectedPixKey.name} ({selectedGift.selectedPixKey.type})
                  </p>
                )}
              </div>

              <Button
                onClick={() => copyToClipboard(selectedGift, selectedGift.id)}
                className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                {copiedId === selectedGift.id ? (
                  <>
                    <FaCheck className="mr-2 h-4 w-4" />
                    Chave Copiada!
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
    </section>
  )
}
