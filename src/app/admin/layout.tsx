'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { FaGift, FaUsers, FaComments, FaImages, FaHome } from 'react-icons/fa'

// Simulação de autenticação simples
// Em uma implementação real, você usaria um sistema de autenticação adequado
// como Next Auth ou similar
const ADMIN_PASSWORD = 'casamento2025'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Verificar se já está autenticado (usando sessionStorage)
    const auth = sessionStorage.getItem('admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true')
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Senha incorreta. Tente novamente.')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    setIsAuthenticated(false)
    router.push('/admin')
  }

  // Menu com links para diferentes áreas administrativas
  const menuItems = [
    { path: '/admin', label: 'Início', icon: <FaHome /> },
    { path: '/admin/presentes', label: 'Presentes', icon: <FaGift /> },
    { path: '/admin/convidados', label: 'Convidados', icon: <FaUsers /> },
    { path: '/admin/mensagens', label: 'Mensagens', icon: <FaComments /> },
    { path: '/admin/galeria', label: 'Galeria', icon: <FaImages /> },
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-light text-center mb-6">Área Administrativa</h1>
          
          {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha de Administração
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-wedding-primary text-wedding-dark rounded-md hover:bg-wedding-primary/90">
              Entrar
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <Link href="/" className="text-wedding-accent hover:underline text-sm">
              Voltar para o site
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar / Menu lateral */}
      <div className="bg-white md:w-64 shadow-md md:min-h-screen p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium text-wedding-dark">Administração</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-wedding-accent hover:underline">
            Sair
          </button>
        </div>
        
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    pathname === item.path
                      ? 'bg-wedding-primary/10 text-wedding-dark'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link
            href="/"
            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
            Voltar para o site
          </Link>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
} 