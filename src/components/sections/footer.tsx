'use client'

import { Heart, Sparkles, Star, Calendar, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-wedding-light/20 via-wedding-primary/5 to-wedding-primary/10 border-t border-wedding-light/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d946ef' fill-opacity='0.3'%3E%3Cpath d='M30 30m-10 0a10 10 0 1 1 20 0a10 10 0 1 1-20 0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 animate-float">
          <Heart className="w-4 h-4 text-wedding-primary/20 fill-current" />
        </div>
        <div className="absolute top-16 right-20 animate-float-delayed">
          <Sparkles className="w-3 h-3 text-wedding-secondary/20 fill-current" />
        </div>
        <div className="absolute bottom-8 left-20 animate-float">
          <Star className="w-4 h-4 text-wedding-primary/20 fill-current" />
        </div>
        <div className="absolute top-8 right-1/4 animate-float-delayed">
          <Heart className="w-3 h-3 text-wedding-secondary/20 fill-current" />
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="py-16">
          {/* Main Footer Content */}
          <div className="text-center space-y-8">
            {/* Couple Names */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-wedding-primary fill-current" />
                <Sparkles className="w-5 h-5 text-wedding-secondary fill-current" />
                <Heart className="w-6 h-6 text-wedding-primary fill-current" />
              </div>

              <h3 className="text-3xl md:text-4xl wedding-heading text-wedding-dark">
                Ester <span className="text-wedding-secondary font-light">&</span> Luan
              </h3>

              <div className="flex items-center justify-center gap-2">
                <div className="w-12 h-px bg-wedding-primary/30" />
                <Heart className="text-wedding-primary/50 text-xs" />
                <div className="w-12 h-px bg-wedding-primary/30" />
              </div>
            </div>

            {/* Wedding Details */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-wedding-accent">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-wedding-primary" />
                <span className="font-medium">12 de Setembro de 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-wedding-primary" />
                <span className="font-medium">Palmas - TO</span>
              </div>
            </div>

            {/* Love Quote */}
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-wedding-accent/80 font-light italic leading-relaxed wedding-subtitle">
                <span className="text-wedding-primary wedding-accent-text text-xl">&ldquo;</span>O amor é a ponte entre duas
                almas que se encontraram para caminhar juntas pela eternidade
                <span className="text-wedding-primary wedding-accent-text text-xl">&rdquo;</span>
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-4 py-6">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-wedding-primary/30 to-transparent" />
              <Sparkles className="w-4 h-4 text-wedding-primary/50" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent via-wedding-primary/30 to-transparent" />
            </div>

            {/* Footer Info */}
            <div className="space-y-4 text-sm text-wedding-accent/70">
              <p className="wedding-body">
                Feito com <Heart className="inline w-4 h-4 text-wedding-primary fill-current mx-1" />
                para celebrar nosso amor
              </p>
            </div>

            {/* Final decorative element */}
            <div className="flex items-center justify-center gap-2 pt-4">
              <Star className="w-3 h-3 text-wedding-secondary/40 fill-current" />
              <Heart className="w-4 h-4 text-wedding-primary/40 fill-current" />
              <Star className="w-3 h-3 text-wedding-secondary/40 fill-current" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
