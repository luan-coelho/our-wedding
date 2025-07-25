'use client'

import { Heart, Sparkles, Star, Calendar, MapPin } from 'lucide-react'

export default function Footer() {
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

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="py-16">
          {/* Main Footer Content */}
          <div className="text-center space-y-8">
            {/* Couple Names */}
            <div className="space-y-4">
              <h3 className="text-3xl md:text-4xl wedding-heading text-wedding-dark">
                Luan <span className="text-wedding-secondary font-light">&</span> Ester
              </h3>

              <div className="flex items-center justify-center gap-2">
                <div className="w-12 h-px bg-wedding-primary/30" />
                <Heart className="text-wedding-primary/50 text-xs" />
                <div className="w-12 h-px bg-wedding-primary/30" />
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
          </div>
        </div>
      </div>
    </footer>
  )
}
