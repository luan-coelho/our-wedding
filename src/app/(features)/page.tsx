'use client'

import Image from 'next/image'
import Link from 'next/link'
import CountdownTimer from '@/components/countdown-timer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowDown,
  Calendar,
  Camera,
  Clock,
  Gift,
  Heart,
  MapPin,
  MessageCircle,
  Navigation,
  Sparkles,
  Star,
} from 'lucide-react'
import { routes } from '@/lib/routes'

export default function Home() {
  // Definindo a data do casamento (12 de setembro de 2025)
  const weddingDate = new Date('2025-09-12T16:00:00')

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/80 via-white to-purple-50/80">
      {/* Hero Section Romântico */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Floating Hearts Animation - Enhanced */}

        {/* Main Content */}
        <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
          {/* Date Badge - Enhanced */}
          <div className="mb-10 flex justify-center animate-fade-in">
            <Badge className="bg-gradient-to-r from-rose-100/90 to-purple-100/90 text-rose-800 border-rose-200/50 px-8 py-4 text-base font-medium rounded-full shadow-xl backdrop-blur-md hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <Sparkles className="w-5 h-5 mr-3 animate-pulse" />
              12 de Setembro de 2025
            </Badge>
          </div>

          {/* Names - Enhanced Typography */}
          <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-20">
                <div className="flex space-x-2">
                  <Star className="w-3 h-3 text-rose-400 fill-current" />
                  <Star className="w-4 h-4 text-purple-400 fill-current" />
                  <Star className="w-3 h-3 text-rose-400 fill-current" />
                </div>
              </div>

              <h1 className="relative">
                <span className="block text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-light tracking-[0.02em] text-gray-800 mb-2 font-serif italic text-rose-600 drop-shadow-sm">
                  Ester
                </span>
                <div className="flex items-center justify-center my-6">
                  <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent"></div>
                  <span className="text-5xl md:text-7xl lg:text-8xl text-purple-400 font-light mx-8 drop-shadow-sm">&</span>
                  <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
                </div>
                <span className="block text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-light tracking-[0.02em] text-gray-800 font-serif italic text-purple-600 drop-shadow-sm">
                  Luan
                </span>
              </h1>

              {/* Decorative elements bottom */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-20">
                <div className="flex space-x-2">
                  <Star className="w-3 h-3 text-purple-400 fill-current" />
                  <Star className="w-4 h-4 text-rose-400 fill-current" />
                  <Star className="w-3 h-3 text-purple-400 fill-current" />
                </div>
              </div>
            </div>
          </div>

          {/* Subtitle - Enhanced */}
          <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-2xl md:text-3xl lg:text-4xl text-gray-700 font-light leading-relaxed max-w-4xl mx-auto mb-6 tracking-wide">
              Dois corações, uma só alma
            </p>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-500 font-light max-w-3xl mx-auto leading-relaxed">
              Celebrando o amor que nos une para sempre
            </p>
          </div>

          {/* CTA Button - Fixed and Enhanced */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white px-12 py-6 text-lg font-medium rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 border-0 backdrop-blur-sm">
              <Link href="#details" className="inline-flex items-center space-x-3">
                <Heart className="w-5 h-5 fill-current" />
                <span>Celebre Conosco</span>
                <Sparkles className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator - Enhanced */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center text-gray-400 hover:text-gray-600 transition-colors duration-300 cursor-pointer">
            <span className="text-sm mb-3 font-light tracking-wide">Role para baixo</span>
            <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
              <ArrowDown className="w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Details Section - Enhanced */}
      <section id="details" className="py-32 bg-gradient-to-b from-white via-rose-50/30 to-purple-50/30 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d946ef' fill-opacity='0.3'%3E%3Ccircle cx='50' cy='50' r='4'/%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='80' cy='20' r='2'/%3E%3Ccircle cx='20' cy='80' r='2'/%3E%3Ccircle cx='80' cy='80' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Section Header - Enhanced */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-rose-300"></div>
              <Heart className="w-6 h-6 mx-4 text-rose-400 fill-current" />
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-rose-300"></div>
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-800 mb-8 font-serif tracking-wide">
              Nosso Grande Dia
            </h2>

            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              Venha celebrar conosco este momento único e especial de nossas vidas
            </p>

            <div className="mt-10 flex justify-center">
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent"></div>
            </div>
          </div>

          {/* Details Cards - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Data */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 shadow-xl bg-white/90 backdrop-blur-md hover:-translate-y-4 hover:rotate-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-12 text-center relative z-10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center mb-10 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-xl group-hover:shadow-2xl">
                  <Calendar className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-800 font-serif">Data</h3>
                <p className="text-xl mb-4 text-gray-700 font-medium">12 de Setembro de 2025</p>
                <Badge className="bg-rose-100 text-rose-700 border-rose-200 px-4 py-2 text-sm font-medium">
                  Sexta-feira
                </Badge>
              </CardContent>
            </Card>

            {/* Horário */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 shadow-xl bg-white/90 backdrop-blur-md hover:-translate-y-4 hover:-rotate-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-12 text-center relative z-10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-10 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-xl group-hover:shadow-2xl">
                  <Clock className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-800 font-serif">Horário</h3>
                <p className="text-lg mb-2 text-gray-700">Cerimônia: 16:00</p>
                <p className="text-lg mb-4 text-gray-700">Recepção: 18:00</p>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 px-4 py-2 text-sm font-medium">
                  Tarde/Noite
                </Badge>
              </CardContent>
            </Card>

            {/* Local */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 shadow-xl bg-white/90 backdrop-blur-md hover:-translate-y-4 hover:rotate-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-12 text-center relative z-10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-10 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-xl group-hover:shadow-2xl">
                  <MapPin className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-800 font-serif">Local</h3>
                <p className="text-xl mb-2 text-gray-700 font-medium">Espaço Villa Jardim</p>
                <p className="text-base mb-4 text-gray-500">R. das Flores, 123</p>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-4 py-2 text-sm font-medium">
                  Jardim Primavera
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Countdown Section - Enhanced */}
      <section className="py-32 bg-gradient-to-r from-rose-50/80 via-purple-50/80 to-rose-50/80 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d946ef' fill-opacity='0.4'%3E%3Cpath d='M60 60l30-30v60l-30-30zm0 0l-30-30v60l30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-8">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-purple-300"></div>
              <Sparkles className="w-6 h-6 mx-4 text-purple-400 animate-pulse" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-purple-300"></div>
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-800 mb-8 font-serif tracking-wide">
              Contagem Regressiva
            </h2>

            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Faltam poucos dias para o nosso grande momento
            </p>
          </div>

          <CountdownTimer targetDate={weddingDate} />
        </div>
      </section>

      {/* Quick Actions Section - Enhanced */}
      <section className="py-32 bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d946ef' fill-opacity='0.3'%3E%3Cpath d='M30 30m-10 0a10 10 0 1 1 20 0a10 10 0 1 1-20 0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Section Header - Enhanced */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center justify-center mb-8">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-purple-300"></div>
              <Star className="w-6 h-6 mx-4 text-purple-400 fill-current" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-purple-300"></div>
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-800 mb-8 font-serif tracking-wide">
              Informações Importantes
            </h2>

            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              Tudo que você precisa saber para nosso grande dia
            </p>

            <div className="mt-10 flex justify-center">
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
            </div>
          </div>

          {/* Action Cards - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Presentes */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 shadow-xl hover:-translate-y-6 bg-gradient-to-br from-purple-50/80 to-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-10 relative z-10">
                <Link href={routes.frontend.presentes} className="block">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-xl group-hover:shadow-2xl">
                      <Gift className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800 font-serif">Presentes</h3>
                    <p className="text-base mb-8 text-gray-600 leading-relaxed">Nossa lista de presentes especiais</p>
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full transition-all duration-500 hover:shadow-xl hover:-translate-y-1 py-3">
                      Ver Lista
                    </Button>
                  </div>
                </Link>
              </CardContent>
            </Card>

            {/* Localização */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 shadow-xl hover:-translate-y-6 bg-gradient-to-br from-emerald-50/80 to-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-10 relative z-10">
                <Link href={routes.frontend.localizacao} className="block">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-xl group-hover:shadow-2xl">
                      <Navigation className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800 font-serif">Localização</h3>
                    <p className="text-base mb-8 text-gray-600 leading-relaxed">Como chegar ao local da festa</p>
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full transition-all duration-500 hover:shadow-xl hover:-translate-y-1 py-3">
                      Ver Mapa
                    </Button>
                  </div>
                </Link>
              </CardContent>
            </Card>

            {/* Mensagens */}
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 shadow-xl hover:-translate-y-6 bg-gradient-to-br from-blue-50/80 to-white relative overflow-hidden md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-10 relative z-10">
                <Link href={routes.frontend.mensagens} className="block">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-xl group-hover:shadow-2xl">
                      <MessageCircle className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800 font-serif">Mensagens</h3>
                    <p className="text-base mb-8 text-gray-600 leading-relaxed">Deixe uma mensagem especial</p>
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full transition-all duration-500 hover:shadow-xl hover:-translate-y-1 py-3">
                      Enviar
                    </Button>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
