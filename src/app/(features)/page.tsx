'use client'

import Image from 'next/image'
import Link from 'next/link'
import CountdownTimer from '@/components/countdown-timer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, MapPin, Heart, Gift, MessageCircle, Navigation, Sparkles, Users, Camera } from 'lucide-react'
import { routes } from '@/lib/routes'

export default function Home() {
  // Definindo a data do casamento (12 de setembro de 2025)
  const weddingDate = new Date('2025-09-12T16:00:00')

  return (
    <div className="min-h-screen">
      {/* Hero Section com Parallax Effect */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background com overlay gradiente usando a paleta */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#20222f]/30 via-[#5f5597]/40 to-[#20222f]/70 z-10"></div>
        <div className="absolute inset-0">
          <Image
            src="/images/couple-home.png"
            alt="Ester e Luan"
            fill
            priority
            style={{ objectFit: 'cover' }}
            className="brightness-110 contrast-105 scale-105 hover:scale-100 transition-transform duration-[3000ms] ease-out"
          />
        </div>

        {/* Conteúdo Hero */}
        <div className="z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="mb-6 flex justify-center">
            <Badge
              variant="secondary"
              className="bg-[#d3cfe4]/20 text-white border-[#b7a0d8]/30 backdrop-blur-sm px-4 py-2"
              style={{ backgroundColor: 'rgba(211, 207, 228, 0.2)', borderColor: 'rgba(183, 160, 216, 0.3)' }}>
              <Sparkles className="w-4 h-4 mr-2" />
              12 de Setembro de 2025
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 font-light tracking-wide">
            Ester
            <span className="mx-4 font-serif italic text-6xl md:text-8xl lg:text-9xl" style={{ color: '#b7a0d8' }}>
              &
            </span>
            Luan
          </h1>

          <p className="text-xl md:text-2xl lg:text-3xl mb-8 font-light opacity-90 max-w-2xl mx-auto leading-relaxed">
            Dois corações se tornando um só
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-white hover:bg-gray-100 px-8 py-6 text-lg font-medium rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              style={{ color: '#5f5597' }}>
              <Link href={routes.frontend.confirmacao}>
                <Heart className="w-5 h-5 mr-2" />
                Confirmar Presença
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white px-8 py-6 text-lg font-medium rounded-full backdrop-blur-sm transition-all duration-300"
              style={{
                borderColor: '#b7a0d8',
                color: 'white',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#b7a0d8'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'white'
              }}>
              <Link href={routes.frontend.presentes}>
                <Gift className="w-5 h-5 mr-2" />
                Lista de Presentes
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Details Section */}
      <section className="py-20" style={{ background: 'linear-gradient(to bottom, #d3cfe4, #ffffff)' }}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-4" style={{ color: '#20222f' }}>
              Nosso Grande Dia
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#5f5597' }}>
              Venha celebrar conosco este momento único e especial
            </p>
            <Separator className="w-24 mx-auto mt-8" style={{ backgroundColor: '#b7a0d8' }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Data */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
                  style={{ background: 'linear-gradient(135deg, #b7a0d8, #d3cfe4)' }}>
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3" style={{ color: '#20222f' }}>
                  Data
                </h3>
                <p className="text-lg mb-2" style={{ color: '#5f5597' }}>
                  12 de Setembro de 2025
                </p>
                <Badge variant="secondary" style={{ backgroundColor: '#d3cfe4', color: '#5f5597' }}>
                  Sexta-feira
                </Badge>
              </CardContent>
            </Card>

            {/* Horário */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
                  style={{ background: 'linear-gradient(135deg, #678EBB, #B1C095)' }}>
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3" style={{ color: '#20222f' }}>
                  Horário
                </h3>
                <p className="text-lg mb-1" style={{ color: '#5f5597' }}>
                  Cerimônia: 16:00
                </p>
                <p className="text-lg mb-2" style={{ color: '#5f5597' }}>
                  Recepção: 18:00
                </p>
                <Badge variant="secondary" style={{ backgroundColor: '#B1C095', color: '#67877a' }}>
                  Tarde/Noite
                </Badge>
              </CardContent>
            </Card>

            {/* Local */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
                  style={{ background: 'linear-gradient(135deg, #67877a, #A4B99B)' }}>
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3" style={{ color: '#20222f' }}>
                  Local
                </h3>
                <p className="text-lg mb-1" style={{ color: '#5f5597' }}>
                  Espaço Villa Jardim
                </p>
                <p className="text-sm mb-2" style={{ color: '#776BA8' }}>
                  R. das Flores, 123
                </p>
                <Badge variant="secondary" style={{ backgroundColor: '#A4B99B', color: '#67877a' }}>
                  Jardim Primavera
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-20" style={{ background: 'linear-gradient(to right, #d3cfe4, #ffffff, #b9cebb)' }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <CountdownTimer targetDate={weddingDate} />
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-4" style={{ color: '#20222f' }}>
              Informações Importantes
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#5f5597' }}>
              Tudo que você precisa saber para nosso grande dia
            </p>
            <Separator className="w-24 mx-auto mt-8" style={{ backgroundColor: '#b7a0d8' }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Confirmação */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-6">
                <Link href={routes.frontend.confirmacao} className="block">
                  <div className="text-center">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300"
                      style={{ background: 'linear-gradient(135deg, #b7a0d8, #d3cfe4)' }}>
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#20222f' }}>
                      Confirmação
                    </h3>
                    <p className="text-sm mb-4" style={{ color: '#5f5597' }}>
                      Confirme sua presença até 12 de agosto
                    </p>
                    <Button
                      size="sm"
                      className="w-full text-white hover:opacity-90 transition-opacity"
                      style={{ background: 'linear-gradient(135deg, #5f5597, #b7a0d8)' }}>
                      Confirmar
                    </Button>
                  </div>
                </Link>
              </CardContent>
            </Card>

            {/* Presentes */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-6">
                <Link href={routes.frontend.presentes} className="block">
                  <div className="text-center">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300"
                      style={{ background: 'linear-gradient(135deg, #776BA8, #a59dcc)' }}>
                      <Gift className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#20222f' }}>
                      Presentes
                    </h3>
                    <p className="text-sm mb-4" style={{ color: '#5f5597' }}>
                      Nossa lista de presentes especiais
                    </p>
                    <Button
                      size="sm"
                      className="w-full text-white hover:opacity-90 transition-opacity"
                      style={{ background: 'linear-gradient(135deg, #776BA8, #a59dcc)' }}>
                      Ver Lista
                    </Button>
                  </div>
                </Link>
              </CardContent>
            </Card>

            {/* Localização */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-6">
                <Link href={routes.frontend.localizacao} className="block">
                  <div className="text-center">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300"
                      style={{ background: 'linear-gradient(135deg, #67877a, #A4B99B)' }}>
                      <Navigation className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#20222f' }}>
                      Localização
                    </h3>
                    <p className="text-sm mb-4" style={{ color: '#5f5597' }}>
                      Como chegar ao local da festa
                    </p>
                    <Button
                      size="sm"
                      className="w-full text-white hover:opacity-90 transition-opacity"
                      style={{ background: 'linear-gradient(135deg, #67877a, #A4B99B)' }}>
                      Ver Mapa
                    </Button>
                  </div>
                </Link>
              </CardContent>
            </Card>

            {/* Mensagens */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-6">
                <Link href={routes.frontend.mensagens} className="block">
                  <div className="text-center">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300"
                      style={{ background: 'linear-gradient(135deg, #678EBB, #B1C095)' }}>
                      <MessageCircle className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#20222f' }}>
                      Mensagens
                    </h3>
                    <p className="text-sm mb-4" style={{ color: '#5f5597' }}>
                      Deixe uma mensagem especial
                    </p>
                    <Button
                      size="sm"
                      className="w-full text-white hover:opacity-90 transition-opacity"
                      style={{ background: 'linear-gradient(135deg, #678EBB, #B1C095)' }}>
                      Enviar
                    </Button>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Love Story Preview Section */}
      <section className="py-20" style={{ background: 'linear-gradient(to bottom, #f8f9fa, #d3cfe4)' }}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-4" style={{ color: '#20222f' }}>
              Nossa História de Amor
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#5f5597' }}>
              Uma jornada que começou com um olhar e se transformou em para sempre
            </p>
            <Separator className="w-24 mx-auto mt-8" style={{ backgroundColor: '#b7a0d8' }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #b7a0d8, #d3cfe4)' }}>
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2" style={{ color: '#20222f' }}>
                        Como nos conhecemos
                      </h3>
                      <p className="leading-relaxed" style={{ color: '#5f5597' }}>
                        Foi em uma tarde de primavera que nossos caminhos se cruzaram. Um encontro que mudou nossas
                        vidas para sempre.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #678EBB, #B1C095)' }}>
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2" style={{ color: '#20222f' }}>
                        O pedido
                      </h3>
                      <p className="leading-relaxed" style={{ color: '#5f5597' }}>
                        Em um momento mágico, sob as estrelas, fizemos a promessa de caminharmos juntos para o resto de
                        nossas vidas.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/couple-home.png"
                  alt="Ester e Luan - Nossa História"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div
                className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full flex items-center justify-center shadow-xl"
                style={{ background: 'linear-gradient(135deg, #776BA8, #b7a0d8)' }}>
                <Camera className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #5f5597, #b7a0d8, #678EBB)' }}>
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">Celebre Conosco</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Sua presença é o presente mais especial que poderíamos receber. Venha fazer parte deste momento único em
            nossas vidas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white hover:bg-gray-100 px-8 py-6 text-lg font-medium rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              style={{ color: '#5f5597' }}>
              <Link href={routes.frontend.confirmacao}>
                <Heart className="w-5 h-5 mr-2" />
                Confirmar Presença Agora
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
