'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { IoMenuOutline, IoCloseOutline } from 'react-icons/io5'
import { useSession } from 'next-auth/react'
import { routes } from '@/lib/routes'

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()

  const navItems = [
    { name: 'Início', path: routes.frontend.home },
    { name: 'Localização', path: routes.frontend.localizacao },
    { name: 'Presentes', path: routes.frontend.presentes },
    { name: 'Mensagens', path: routes.frontend.mensagens },
  ]

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-wedding-light/50">
      <div className="wedding-container">
        <div className="flex items-center justify-between py-4">
          <Link href={routes.frontend.home} className="text-2xl font-bold text-wedding-primary">
            Ester <span className="font-serif italic text-wedding-accent">&</span> Luan
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-8">
              {navItems.map(item => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`text-sm ${
                      pathname === item.path
                        ? 'text-wedding-primary font-medium after:content-[""] after:block after:w-1/2 after:h-0.5 after:bg-wedding-primary after:mx-auto after:mt-0.5'
                        : 'text-wedding-dark/80'
                    } hover:text-wedding-primary transition-colors`}>
                    {item.name}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  href={routes.frontend.admin.home}
                  className="text-sm text-white bg-wedding-accent px-4 py-1.5 rounded-md hover:bg-wedding-accent/90 transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile nav toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-wedding-accent hover:text-wedding-primary transition-colors">
            {isMenuOpen ? <IoCloseOutline size={28} /> : <IoMenuOutline size={28} />}
          </button>
        </div>

        {/* Mobile nav */}
        {isMenuOpen && (
          <nav className="pb-6 md:hidden border-t border-wedding-light/30 mt-2 pt-2">
            <ul className="space-y-4">
              {navItems.map(item => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`block py-2 ${pathname === item.path ? 'text-wedding-primary font-medium' : 'text-wedding-dark/80'} hover:text-wedding-primary transition-colors`}>
                    {item.name}
                  </Link>
                </li>
              ))}
              {session && (
                <li className="pt-2 border-t border-wedding-light/30">
                  <Link
                    href={routes.frontend.admin.home}
                    className="block py-2 text-wedding-accent font-medium hover:text-wedding-primary transition-colors">
                    Área Administrativa
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
