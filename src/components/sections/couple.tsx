'use client'

import { Heart, Sparkles, Star, Users, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function Couple() {
  return (
    <section
      id="couple"
      className="py-32 bg-gradient-to-b from-white via-rose-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d946ef' fill-opacity='0.3'%3E%3Ccircle cx='50' cy='50' r='4'/%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='80' cy='20' r='2'/%3E%3Ccircle cx='20' cy='80' r='2'/%3E%3Ccircle cx='80' cy='80' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">
          <Heart className="w-6 h-6 text-rose-300/40 fill-current" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <Sparkles className="w-4 h-4 text-purple-300/40 fill-current" />
        </div>
        <div className="absolute bottom-32 left-20 animate-float">
          <Star className="w-5 h-5 text-rose-300/40 fill-current" />
        </div>
        <div className="absolute top-60 right-1/4 animate-float-delayed">
          <Users className="w-6 h-6 text-purple-300/40 fill-current" />
        </div>
        <div className="absolute bottom-40 left-1/3 animate-float">
          <Heart className="w-4 h-4 text-rose-300/40 fill-current" />
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-rose-300"></div>
            <Users className="w-6 h-6 mx-4 text-rose-400 fill-current" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-rose-300"></div>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-800 mb-8 font-serif tracking-wide">
            O Casal
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Uma história de amor que começou há anos e agora se transforma em um novo capítulo
          </p>

          <div className="mt-10 flex justify-center">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent"></div>
          </div>
        </div>

        {/* Couple Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
          {/* Ester */}
          <div className="text-center lg:text-right">
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 shadow-xl bg-white/90 backdrop-blur-md hover:-translate-y-4 hover:rotate-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 relative z-10">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-rose-300 to-rose-500 flex items-center justify-center mb-6 mx-auto lg:ml-auto lg:mr-0 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                  <span className="text-4xl font-serif text-white">E</span>
                </div>
                <h3 className="text-3xl font-serif text-gray-800 mb-4">Ester</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Uma mulher de coração generoso, sorriso contagiante e sonhos grandes. Apaixonada pela vida, pela
                  família e por construir momentos especiais ao lado de quem ama.
                </p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                  <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm">Romântica</span>
                  <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm">Carinhosa</span>
                  <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm">Sonhadora</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Luan */}
          <div className="text-center lg:text-left">
            <Card className="group hover:shadow-2xl transition-all duration-700 border-0 shadow-xl bg-white/90 backdrop-blur-md hover:-translate-y-4 hover:-rotate-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 relative z-10">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-300 to-purple-500 flex items-center justify-center mb-6 mx-auto lg:mr-auto lg:ml-0 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                  <span className="text-4xl font-serif text-white">L</span>
                </div>
                <h3 className="text-3xl font-serif text-gray-800 mb-4">Luan</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Um homem de caráter, determinado e com um coração cheio de amor. Sempre disposto a cuidar e proteger
                  quem ama, construindo um futuro sólido baseado no respeito e companheirismo.
                </p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Dedicado</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Protetor</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Companheiro</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Love Story */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/90 to-purple-50/60 backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50/30 to-purple-50/30"></div>
            <CardContent className="p-12 relative z-10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center mb-6">
                  <Heart className="w-8 h-8 text-rose-400 fill-current" />
                  <Sparkles className="w-6 h-6 mx-3 text-purple-400 fill-current" />
                  <Heart className="w-8 h-8 text-rose-400 fill-current" />
                </div>
                <h3 className="text-4xl font-serif text-gray-800 mb-6">Nossa História</h3>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent mx-auto"></div>
              </div>

              <div className="space-y-8 text-lg text-gray-700 leading-relaxed">
                <p className="text-center">
                  <span className="text-2xl font-serif text-rose-600">&ldquo;</span>
                  Nossa história começou de forma simples, mas especial. Dois corações que se encontraram no momento
                  certo, descobrindo que juntos poderiam construir algo ainda mais bonito.
                  <span className="text-2xl font-serif text-rose-600">&rdquo;</span>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">Primeiro Encontro</h4>
                    <p className="text-gray-600">Um encontro casual que mudou nossas vidas para sempre</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-white fill-current" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">Amor Verdadeiro</h4>
                    <p className="text-gray-600">O amor cresceu naturalmente, baseado em respeito e companheirismo</p>
                  </div>
                </div>

                <p className="text-center text-xl font-light text-gray-600 mt-12">
                  E agora, estamos prontos para começar nossa jornada como marido e mulher, celebrando o amor que nos
                  une com todas as pessoas que amamos.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
