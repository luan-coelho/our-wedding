'use client'

import { Sparkles, Calendar, Clock, Heart } from 'lucide-react'
import CountdownTimer from '@/components/countdown-timer'

interface CountdownProps {
  weddingDate: Date
}

export default function Countdown({ weddingDate }: CountdownProps) {
  return (
    <section
      id="countdown"
      className="py-32 bg-gradient-to-r from-wedding-lavender/80 via-wedding-light/80 to-wedding-lilac/80 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d946ef' fill-opacity='0.4'%3E%3Cpath d='M60 60l30-30v60l-30-30zm0 0l-30-30v60l30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">
          <Clock className="w-8 h-8 text-wedding-purple-light/30 fill-current" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <Calendar className="w-6 h-6 text-wedding-lilac/30 fill-current" />
        </div>
        <div className="absolute bottom-32 left-20 animate-float">
          <Sparkles className="w-7 h-7 text-wedding-purple-light/30 fill-current" />
        </div>
        <div className="absolute top-60 right-1/4 animate-float-delayed">
          <Heart className="w-5 h-5 text-wedding-lilac/30 fill-current" />
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-8">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-wedding-purple-light"></div>
            <Sparkles className="w-6 h-6 mx-4 text-wedding-primary animate-pulse" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-wedding-purple-light"></div>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-wedding-dark mb-8 wedding-heading tracking-wide">
            Contagem Regressiva
          </h2>

          <p className="text-xl md:text-2xl text-wedding-charcoal/80 max-w-3xl mx-auto leading-relaxed font-light">
            Faltam poucos dias para o nosso grande momento
          </p>

          <div className="mt-8 flex justify-center">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-wedding-purple-light to-transparent"></div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="max-w-4xl mx-auto">
          <CountdownTimer targetDate={weddingDate} />
        </div>

        {/* Additional decorative elements */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 px-8 py-4 bg-white/60 backdrop-blur-sm rounded-full shadow-lg">
            <Calendar className="w-5 h-5 text-wedding-primary" />
            <span className="text-lg font-medium text-wedding-dark">12 de Setembro de 2025</span>
            <Heart className="w-5 h-5 text-wedding-accent fill-current" />
          </div>
        </div>
      </div>
    </section>
  )
}
