'use client'

import { Heart, Sparkles, Star, ArrowDown, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface HeroProps {
  onScrollToNextAction: () => void
}

export default function Hero({ onScrollToNextAction }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-wedding-lavender/80 via-white to-wedding-lilac/80" />

      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">
          <Heart className="w-6 h-6 text-wedding-purple-light/40 fill-current" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <Sparkles className="w-4 h-4 text-wedding-lilac/40 fill-current" />
        </div>
        <div className="absolute bottom-32 left-20 animate-float">
          <Star className="w-5 h-5 text-wedding-purple-light/40 fill-current" />
        </div>
        <div className="absolute top-60 left-1/3 animate-float-delayed">
          <Heart className="w-4 h-4 text-wedding-lilac/40 fill-current" />
        </div>
        <div className="absolute bottom-40 right-1/3 animate-float">
          <Sparkles className="w-6 h-6 text-wedding-purple-light/40 fill-current" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
        {/* Date Badge */}
        <div className="mb-10 flex justify-center animate-fade-in">
          <Badge className="bg-gradient-to-r from-wedding-lavender/90 to-wedding-lilac/90 text-wedding-dark border-wedding-purple-light/50 px-8 py-4 text-base font-medium rounded-full shadow-xl backdrop-blur-md hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <Calendar className="w-5 h-5 mr-3" />
            12 de Setembro de 2025
          </Badge>
        </div>

        {/* Names */}
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-20">
              <div className="flex space-x-2">
                <Star className="w-3 h-3 text-wedding-purple-light fill-current" />
                <Star className="w-4 h-4 text-wedding-lilac fill-current" />
                <Star className="w-3 h-3 text-wedding-purple-light fill-current" />
              </div>
            </div>

            <h1 className="relative">
              <span className="block text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.02em] mb-2 wedding-script text-wedding-purple-deep drop-shadow-sm">
                Luan
              </span>
              <div className="flex items-center justify-center my-6">
                <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-wedding-purple-light to-transparent"></div>
                <span className="text-5xl md:text-7xl lg:text-8xl text-wedding-lilac font-light mx-8 drop-shadow-sm">
                  &
                </span>
                <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-wedding-lilac to-transparent"></div>
              </div>
              <span className="block text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.02em] wedding-script text-wedding-purple-deep drop-shadow-sm">
                Ester
              </span>
            </h1>

            {/* Decorative elements bottom */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-20">
              <div className="flex space-x-2">
                <Star className="w-3 h-3 text-wedding-lilac fill-current" />
                <Star className="w-4 h-4 text-wedding-purple-light fill-current" />
                <Star className="w-3 h-3 text-wedding-lilac fill-current" />
              </div>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-2xl md:text-3xl lg:text-4xl text-wedding-dark font-light leading-relaxed max-w-4xl mx-auto mb-6 tracking-wide wedding-heading">
            Dois corações, uma só alma
          </p>
          <p className="text-lg md:text-xl lg:text-2xl text-wedding-charcoal/80 font-light max-w-3xl mx-auto leading-relaxed">
            Celebrando o amor que nos une para sempre
          </p>
        </div>

        {/* CTA Button */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Button
            onClick={onScrollToNextAction}
            size="lg"
            className="bg-gradient-to-r from-wedding-purple-deep to-wedding-amethyst hover:from-wedding-purple-deep/90 hover:to-wedding-amethyst/90 text-white px-12 py-6 text-lg font-medium rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 border-0 backdrop-blur-sm">
            <Heart className="w-5 h-5 fill-current mr-3" />
            <span>Celebre Conosco</span>
            <Sparkles className="w-5 h-5 ml-3" />
          </Button>
        </div>
      </div>
    </section>
  )
}
