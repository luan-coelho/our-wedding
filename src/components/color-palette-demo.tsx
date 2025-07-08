'use client'

import { Heart, Sparkles, Star, Palette } from 'lucide-react'

export default function ColorPaletteDemo() {
  const colors = [
    {
      name: 'Lavender',
      class: 'bg-wedding-lavender',
      hex: '#e8d8f5',
      description: 'Lavanda suave do convite',
    },
    {
      name: 'Purple Light',
      class: 'bg-wedding-purple-light',
      hex: '#b8a6cc',
      description: 'Roxo claro das flores',
    },
    {
      name: 'Sage',
      class: 'bg-wedding-sage',
      hex: '#a8b5a0',
      description: 'Verde sálvia das folhas',
    },
    {
      name: 'Purple Deep',
      class: 'bg-wedding-purple-deep',
      hex: '#6b4d8a',
      description: 'Roxo profundo do texto',
    },
    {
      name: 'Charcoal',
      class: 'bg-wedding-charcoal',
      hex: '#3d2757',
      description: 'Carvão escuro para contraste',
    },
    {
      name: 'Lilac',
      class: 'bg-wedding-lilac',
      hex: '#d8c7e8',
      description: 'Lilás delicado',
    },
    {
      name: 'Forest',
      class: 'bg-wedding-forest',
      hex: '#7a8f73',
      description: 'Verde floresta',
    },
    {
      name: 'Mint',
      class: 'bg-wedding-mint',
      hex: '#b5c7a8',
      description: 'Verde menta',
    },
    {
      name: 'Sky',
      class: 'bg-wedding-sky',
      hex: '#9bb0d1',
      description: 'Azul céu suave',
    },
    {
      name: 'Amethyst',
      class: 'bg-wedding-amethyst',
      hex: '#9b7db8',
      description: 'Ametista',
    },
  ]

  const primaryColors = [
    {
      name: 'Primary',
      class: 'bg-wedding-primary',
      hex: '#6b4d8a',
      description: 'Cor principal',
    },
    {
      name: 'Secondary',
      class: 'bg-wedding-secondary',
      hex: '#d8c7e8',
      description: 'Cor secundária',
    },
    {
      name: 'Accent',
      class: 'bg-wedding-accent',
      hex: '#b8a6cc',
      description: 'Cor de destaque',
    },
    {
      name: 'Light',
      class: 'bg-wedding-light',
      hex: '#e8d8f5',
      description: 'Cor clara',
    },
    {
      name: 'Dark',
      class: 'bg-wedding-dark',
      hex: '#3d2757',
      description: 'Cor escura',
    },
  ]

  return (
    <section className="py-32 bg-gradient-to-br from-wedding-lavender/20 via-white to-wedding-lilac/20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">
          <Palette className="w-8 h-8 text-wedding-purple-light/20 fill-current" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <Sparkles className="w-6 h-6 text-wedding-lilac/20 fill-current" />
        </div>
        <div className="absolute bottom-32 left-20 animate-float">
          <Star className="w-7 h-7 text-wedding-purple-light/20 fill-current" />
        </div>
        <div className="absolute top-60 right-1/4 animate-float-delayed">
          <Heart className="w-5 h-5 text-wedding-lilac/20 fill-current" />
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center mb-8">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-wedding-purple-light"></div>
            <Palette className="w-6 h-6 mx-4 text-wedding-primary animate-pulse" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-wedding-purple-light"></div>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-wedding-dark mb-8 wedding-heading tracking-wide">
            Paleta de Cores
          </h2>

          <p className="text-xl md:text-2xl text-wedding-charcoal/80 max-w-3xl mx-auto leading-relaxed font-light">
            Cores inspiradas no nosso convite de casamento
          </p>
        </div>

        {/* Typography Demo */}
        <div className="mb-20 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
            <h3 className="text-4xl wedding-script text-wedding-primary mb-6">Luan & Ester</h3>
            <p className="text-2xl wedding-heading text-wedding-dark mb-4">Demonstração de Tipografia</p>
            <p className="text-lg text-wedding-charcoal/80 max-w-2xl mx-auto">
              Esta é uma demonstração das fontes personalizadas: Dancing Script para títulos elegantes, Playfair Display
              para cabeçalhos e Lora para textos corridos.
            </p>
          </div>
        </div>

        {/* Primary Colors */}
        <div className="mb-16">
          <h3 className="text-3xl wedding-heading text-wedding-dark mb-8 text-center">Cores Principais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {primaryColors.map((color, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`w-full h-24 rounded-xl ${color.class} shadow-inner mb-4`}></div>
                <h4 className="text-lg font-semibold text-wedding-dark mb-2 wedding-heading">{color.name}</h4>
                <p className="text-sm text-wedding-charcoal/70 mb-2">{color.hex}</p>
                <p className="text-xs text-wedding-charcoal/60">{color.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* All Colors */}
        <div className="mb-16">
          <h3 className="text-3xl wedding-heading text-wedding-dark mb-8 text-center">Paleta Completa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {colors.map((color, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`w-full h-20 rounded-xl ${color.class} shadow-inner mb-4`}></div>
                <h4 className="text-lg font-semibold text-wedding-dark mb-2 wedding-heading">{color.name}</h4>
                <p className="text-sm text-wedding-charcoal/70 mb-2">{color.hex}</p>
                <p className="text-xs text-wedding-charcoal/60">{color.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gradient Examples */}
        <div className="mb-16">
          <h3 className="text-3xl wedding-heading text-wedding-dark mb-8 text-center">Gradientes Personalizados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="w-full h-24 rounded-xl gradient-lavender-sage shadow-inner mb-4"></div>
              <h4 className="text-lg font-semibold text-wedding-dark mb-2 wedding-heading">Lavender Sage</h4>
              <p className="text-sm text-wedding-charcoal/70">Lavanda para Verde Sálvia</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="w-full h-24 rounded-xl gradient-purple-lilac shadow-inner mb-4"></div>
              <h4 className="text-lg font-semibold text-wedding-dark mb-2 wedding-heading">Purple Lilac</h4>
              <p className="text-sm text-wedding-charcoal/70">Roxo Profundo para Lilás</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="w-full h-24 rounded-xl gradient-invitation shadow-inner mb-4"></div>
              <h4 className="text-lg font-semibold text-wedding-dark mb-2 wedding-heading">Invitation</h4>
              <p className="text-sm text-wedding-charcoal/70">Gradiente do Convite</p>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="text-center">
          <h3 className="text-3xl wedding-heading text-wedding-dark mb-8">Exemplos de Uso</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Button Examples */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <h4 className="text-xl wedding-heading text-wedding-dark mb-6">Botões</h4>
              <div className="space-y-4">
                <button className="wedding-button w-full">
                  <Heart className="w-5 h-5 mr-2" />
                  Botão Principal
                </button>
                <button className="bg-wedding-secondary hover:bg-wedding-secondary/80 text-wedding-dark px-6 py-3 rounded-full transition-all duration-300 w-full">
                  Botão Secundário
                </button>
                <button className="bg-wedding-accent hover:bg-wedding-accent/80 text-wedding-dark px-6 py-3 rounded-full transition-all duration-300 w-full">
                  Botão de Destaque
                </button>
              </div>
            </div>

            {/* Card Examples */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <h4 className="text-xl wedding-heading text-wedding-dark mb-6">Cards</h4>
              <div className="space-y-4">
                <div className="wedding-card">
                  <div className="flex items-center mb-3">
                    <Star className="w-5 h-5 text-wedding-primary mr-2" />
                    <h5 className="text-lg wedding-heading text-wedding-dark">Título do Card</h5>
                  </div>
                  <p className="text-wedding-charcoal/80 text-sm">Exemplo de um card usando a nova paleta de cores.</p>
                </div>
                <div className="wedding-info-box">
                  <div className="flex items-center mb-3">
                    <Sparkles className="w-5 h-5 text-wedding-accent mr-2" />
                    <h5 className="text-lg wedding-heading text-wedding-dark">Info Box</h5>
                  </div>
                  <p className="text-wedding-charcoal/80 text-sm">Caixa de informações com hover effects.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
