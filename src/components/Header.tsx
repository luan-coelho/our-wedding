'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { IoMenuOutline, IoCloseOutline } from 'react-icons/io5'

const Header = () => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Nossa História', path: '/nossa-historia' },
    { name: 'Confirmação', path: '/confirmacao' },
    { name: 'Presentes', path: '/presentes' },
    { name: 'Localização', path: '/localizacao' },
    { name: 'Galeria', path: '/galeria' },
    { name: 'Mensagens', path: '/mensagens' },
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-wedding-secondary shadow-md sticky top-0 z-50">
      <div className="wedding-container py-4 px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="font-bold text-2xl text-wedding-primary">
            João & Maria
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-wedding-primary"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}>
            {isMenuOpen ? <IoCloseOutline size={28} /> : <IoMenuOutline size={28} />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              {navItems.map(item => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`text-sm font-medium hover:text-wedding-accent transition-colors ${
                      pathname === item.path ? 'text-wedding-accent' : 'text-wedding-primary'
                    }`}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-2">
            <ul className="flex flex-col space-y-3">
              {navItems.map(item => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`block text-sm font-medium hover:text-wedding-accent transition-colors ${
                      pathname === item.path ? 'text-wedding-accent' : 'text-wedding-primary'
                    }`}
                    onClick={() => setIsMenuOpen(false)}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
