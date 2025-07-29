'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { routes } from '@/lib/routes'

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
              <p className="text-lg text-wedding-accent font-light leading-relaxed wedding-subtitle">
                <span className="text-wedding-primary wedding-accent-text text-xl">&ldquo;</span>O amor é a ponte entre
                duas almas que se encontraram para caminhar juntas pela eternidade
                <span className="text-wedding-primary wedding-accent-text text-xl">&rdquo;</span>
              </p>
            </div>
          </div>
        </div>

        {/* Seção principal do footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Links principais */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link href={routes.frontend.home} className="text-gray-600 hover:text-gray-900 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="#gifts" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Lista de Presentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Outras seções do footer */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Informações</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#ceremony"
                  className="text-gray-600 hover:text-gray-900 transition-colors">
                  Localização
                </Link>
              </li>
            </ul>
          </div>

          {/* Link do Admin */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Área Restrita</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={routes.frontend.admin.home}
                  className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Administração
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-8 text-center text-gray-600">
          <p>&copy; 2025 Nosso Casamento. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
