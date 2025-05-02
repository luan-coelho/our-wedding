'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { IoMenuOutline, IoCloseOutline } from 'react-icons/io5'
import { useSession } from 'next-auth/react'

const Header = () => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()

  const navItems = [
    { name: 'Início', path: '/' },
    { name: 'Nossa História', path: '/nossa-historia' },
    { name: 'Localização', path: '/localizacao' },
    { name: 'Presentes', path: '/presentes' },
    { name: 'Galeria', path: '/galeria' },
    { name: 'Mensagens', path: '/mensagens' },
  ]

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold">
            Ester & Luan
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-8">
              {navItems.map(item => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`text-sm ${
                      pathname === item.path ? 'text-wedding-accent font-medium' : 'text-gray-600'
                    } hover:text-wedding-accent transition-colors`}>
                    {item.name}
                  </Link>
                </li>
              ))}
              {session && (
                <li>
                  <Link
                    href="/admin"
                    className="text-sm text-wedding-dark bg-wedding-accent/20 px-3 py-1 rounded-full hover:bg-wedding-accent/30 transition-colors">
                    Admin
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Mobile nav toggle */}
          <button onClick={toggleMenu} className="md:hidden">
            {isMenuOpen ? <IoCloseOutline size={24} /> : <IoMenuOutline size={24} />}
          </button>
        </div>

        {/* Mobile nav */}
        {isMenuOpen && (
          <nav className="pb-6 md:hidden">
            <ul className="space-y-4">
              {navItems.map(item => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`block py-2 ${
                      pathname === item.path ? 'text-wedding-accent font-medium' : 'text-gray-600'
                    } hover:text-wedding-accent transition-colors`}>
                    {item.name}
                  </Link>
                </li>
              ))}
              {session && (
                <li>
                  <Link href="/admin" className="block py-2 text-wedding-dark font-medium">
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

export default Header
