'use client'

import ColorPaletteDemo from '@/components/color-palette-demo'
import { ArrowLeft, Heart, Sparkles, Star } from 'lucide-react'
import Link from 'next/link'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-lavender/10 via-white to-wedding-lilac/10">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-wedding-purple-light/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center text-wedding-dark hover:text-wedding-primary transition-colors duration-300">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Voltar ao Site</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-wedding-primary" />
              <span className="text-lg wedding-heading text-wedding-dark">Demo da Nova Paleta</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 animate-float">
            <Heart className="w-8 h-8 text-wedding-purple-light/20 fill-current" />
          </div>
          <div className="absolute top-40 right-20 animate-float-delayed">
            <Sparkles className="w-6 h-6 text-wedding-lilac/20 fill-current" />
          </div>
          <div className="absolute bottom-32 left-20 animate-float">
            <Star className="w-7 h-7 text-wedding-purple-light/20 fill-current" />
          </div>
        </div>

        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-8">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-wedding-purple-light"></div>
              <Heart className="w-6 h-6 mx-4 text-wedding-primary animate-pulse" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-wedding-purple-light"></div>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-wedding-dark mb-8 wedding-script tracking-wide">
              Luan & Ester
            </h1>

            <p className="text-2xl md:text-3xl text-wedding-charcoal/80 max-w-3xl mx-auto leading-relaxed font-light mb-8">
              Nova Identidade Visual
            </p>

            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-12">
              <h2 className="text-3xl wedding-heading text-wedding-dark mb-6">Inspiração do Convite</h2>
              <p className="text-lg text-wedding-charcoal/80 max-w-2xl mx-auto mb-6">
                A paleta de cores foi cuidadosamente criada baseada no design elegante e romântico do nosso convite de
                casamento, com tons de lavanda, roxo e lilás que transmitem delicadeza e sofisticação.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-wedding-lavender rounded-full"></div>
                  <span className="text-sm text-wedding-charcoal/70">Lavanda</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-wedding-purple-deep rounded-full"></div>
                  <span className="text-sm text-wedding-charcoal/70">Roxo Profundo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-wedding-lilac rounded-full"></div>
                  <span className="text-sm text-wedding-charcoal/70">Lilás</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-2xl wedding-script text-wedding-primary mb-4">Dancing Script</h3>
                <p className="text-wedding-charcoal/80 text-sm">
                  Fonte elegante e fluida para títulos especiais e nomes dos noivos
                </p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-2xl wedding-heading text-wedding-dark mb-4">Playfair Display</h3>
                <p className="text-wedding-charcoal/80 text-sm">
                  Fonte serif sofisticada para cabeçalhos e títulos de seção
                </p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-2xl text-wedding-dark mb-4">Lora</h3>
                <p className="text-wedding-charcoal/80 text-sm">
                  Fonte serif legível e elegante para textos corridos e parágrafos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Color Palette Demo */}
      <ColorPaletteDemo />

      {/* Footer */}
      <footer className="py-12 bg-wedding-dark text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="w-5 h-5 text-wedding-accent fill-current" />
            <span className="text-lg wedding-script">Luan & Ester</span>
            <Heart className="w-5 h-5 text-wedding-accent fill-current" />
          </div>
          <p className="text-wedding-light/80 text-sm">12 de Setembro de 2025 • Demonstração da Nova Paleta de Cores</p>
        </div>
      </footer>
    </div>
  )
}
