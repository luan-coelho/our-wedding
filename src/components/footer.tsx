'use client'

import Link from 'next/link'
import { FaHeart, FaInstagram } from 'react-icons/fa'
import { routes } from '@/lib/routes'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-wedding-accent text-white py-8">
      <div className="wedding-container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-wedding-light text-lg font-semibold mb-2">Ester & Luan</h3>
            <p className="text-sm opacity-80">Celebrando nosso amor em {currentYear}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm mb-6 md:mb-0">
            <Link href={routes.frontend.home} className="hover:text-wedding-light transition-colors">
              Home
            </Link>
            <Link href={routes.frontend.nossamistoria} className="hover:text-wedding-light transition-colors">
              Nossa História
            </Link>
            <Link href={routes.frontend.confirmacao} className="hover:text-wedding-light transition-colors">
              Confirmação
            </Link>
            <Link href={routes.frontend.presentes} className="hover:text-wedding-light transition-colors">
              Presentes
            </Link>
            <Link href={routes.frontend.localizacao} className="hover:text-wedding-light transition-colors">
              Localização
            </Link>
            <Link href={routes.frontend.mensagens} className="hover:text-wedding-light transition-colors">
              Mensagens
            </Link>
          </div>

          <div className="flex items-center">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-wedding-light transition-colors text-2xl"
              aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/20 text-center text-xs opacity-70">
          <p className="flex items-center justify-center">
            Feito com <FaHeart className="mx-1 text-wedding-secondary" /> para nosso grande dia
          </p>
          <p className="mt-1">&copy; {currentYear} Ester & Luan. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
