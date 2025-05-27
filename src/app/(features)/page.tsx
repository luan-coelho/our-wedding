'use client'

import Image from 'next/image'
import Link from 'next/link'
import CountdownTimer from '@/components/countdown-timer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Gift,
  MessageCircle,
  Navigation,
  Sparkles,
  Users,
  Camera,
  ArrowDown,
} from 'lucide-react'
import { routes } from '@/lib/routes'

export default function Home() {
  // Definindo a data do casamento (12 de setembro de 2025)
  const weddingDate = new Date('2025-09-12T16:00:00')

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      {/* Hero Section Romântico */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d946ef' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Floating Hearts Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
              }}>
              <Heart className="w-4 h-4 text-rose-400 fill-current" />
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          {/* Date Badge */}
          <div className="mb-8 flex justify-center animate-fade-in">
            <Badge className="bg-gradient-to-r from-rose-100 to-purple-100 text-rose-800 border-rose-200 px-6 py-3 text-sm font-medium rounded-full shadow-lg backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              12 de Setembro de 2025
            </Badge>
          </div>

          {/* Names */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-wider text-gray-800 mb-4">
              <span className="block font-serif italic text-rose-600">Ester</span>
              <span className="text-4xl md:text-6xl lg:text-7xl text-purple-400 font-light mx-8">&</span>
              <span className="block font-serif italic text-purple-600">Luan</span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
              Dois corações, uma só alma
            </p>
            <p className="text-lg md:text-xl text-gray-500 mt-4 font-light">
              Celebrando o amor que nos une para sempre
            </p>
          </div>

          {/* CTA Button */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white px-8 py-6 text-lg font-medium rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"></Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center text-gray-400">
            <span className="text-sm mb-2 font-light">Role para baixo</span>
            <ArrowDown className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Wedding Details Section */}
      <section className="py-24 bg-gradient-to-b from-white to-rose-50">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light text-gray-800 mb-6 font-serif">Nosso Grande Dia</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Venha celebrar conosco este momento único e especial de nossas vidas
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent"></div>
            </div>
          </div>

          {/* Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Data */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:-translate-y-2">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 font-serif">Data</h3>
                <p className="text-lg mb-3 text-gray-600">12 de Setembro de 2025</p>
                <Badge className="bg-rose-100 text-rose-700 border-rose-200">Sexta-feira</Badge>
              </CardContent>
            </Card>

            {/* Horário */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:-translate-y-2">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 font-serif">Horário</h3>
                <p className="text-lg mb-2 text-gray-600">Cerimônia: 16:00</p>
                <p className="text-lg mb-3 text-gray-600">Recepção: 18:00</p>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">Tarde/Noite</Badge>
              </CardContent>
            </Card>

            {/* Local */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:-translate-y-2">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 font-serif">Local</h3>
                <p className="text-lg mb-2 text-gray-600">Espaço Villa Jardim</p>
                <p className="text-sm mb-3 text-gray-500">R. das Flores, 123</p>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Jardim Primavera</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-24 bg-gradient-to-r from-rose-50 via-purple-50 to-rose-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-4 font-serif">Contagem Regressiva</h2>
            <p className="text-lg text-gray-600">Faltam poucos dias para o nosso grande momento</p>
          </div>
          <CountdownTimer targetDate={weddingDate} />
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light text-gray-800 mb-6 font-serif">Informações Importantes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Tudo que você precisa saber para nosso grande dia
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Presentes */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-8">
                <Link href={routes.frontend.presentes} className="block">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Gift className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800 font-serif">Presentes</h3>
                    <p className="text-sm mb-6 text-gray-600 leading-relaxed">Nossa lista de presentes especiais</p>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full transition-all duration-300">
                      Ver Lista
                    </Button>
                  </div>
                </Link>
              </CardContent>
            </Card>

            {/* Localização */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-gradient-to-br from-emerald-50 to-white">
              <CardContent className="p-8">
                <Link href={routes.frontend.localizacao} className="block">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Navigation className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800 font-serif">Localização</h3>
                    <p className="text-sm mb-6 text-gray-600 leading-relaxed">Como chegar ao local da festa</p>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full transition-all duration-300">
                      Ver Mapa
                    </Button>
                  </div>
                </Link>
              </CardContent>
            </Card>

            {/* Mensagens */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-8">
                <Link href={routes.frontend.mensagens} className="block">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800 font-serif">Mensagens</h3>
                    <p className="text-sm mb-6 text-gray-600 leading-relaxed">Deixe uma mensagem especial</p>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full transition-all duration-300">
                      Enviar
                    </Button>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Love Story Section */}
      <section className="py-24 bg-gradient-to-b from-rose-50 to-purple-50">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light text-gray-800 mb-6 font-serif">Nossa História de Amor</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Uma jornada que começou com um olhar e se transformou em para sempre
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Story Cards */}
            <div className="space-y-8">
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500">
                <CardContent className="p-10">
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Heart className="w-8 h-8 text-white fill-current" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-4 text-gray-800 font-serif">Como nos conhecemos</h3>
                      <p className="leading-relaxed text-gray-600 text-lg">
                        Foi em uma tarde de primavera que nossos caminhos se cruzaram. Um encontro que mudou nossas
                        vidas para sempre, transformando dois corações em um só.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500">
                <CardContent className="p-10">
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-4 text-gray-800 font-serif">O pedido</h3>
                      <p className="leading-relaxed text-gray-600 text-lg">
                        Em um momento mágico, sob as estrelas, fizemos a promessa de caminharmos juntos para o resto de
                        nossas vidas, selando nosso amor eterno.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Photo */}
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative group">
                <Image
                  src="/images/couple-home.png"
                  alt="Ester e Luan - Nossa História"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 to-purple-600 flex items-center justify-center shadow-2xl">
                <Camera className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-rose-500 via-purple-500 to-rose-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0 5.5 4.5 10 10 10s10-4.5 10-10-4.5-10-10-10-10 4.5-10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-light text-white mb-8 font-serif">Celebre Conosco</h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Sua presença é o presente mais especial que poderíamos receber. Venha fazer parte deste momento único em
            nossas vidas.
          </p>
        </div>
      </section>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  )
}
