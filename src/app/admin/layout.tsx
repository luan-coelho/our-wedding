'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FaComments, FaGift, FaHome, FaImages, FaUsers } from 'react-icons/fa'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  // Menu com links para diferentes áreas administrativas
  const menuItems = [
    { path: '/admin', label: 'Início', icon: <FaHome /> },
    { path: '/admin/presentes', label: 'Presentes', icon: <FaGift /> },
    { path: '/admin/convidados', label: 'Convidados', icon: <FaUsers /> },
    { path: '/admin/mensagens', label: 'Mensagens', icon: <FaComments /> },
    { path: '/admin/galeria', label: 'Galeria', icon: <FaImages /> },
  ]

  // Mostra um indicador de carregamento enquanto verifica a sessão
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-wedding-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar / Menu lateral */}
      <div className="bg-white md:w-64 shadow-md md:min-h-screen p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium text-wedding-dark">Administração</h1>
          <button onClick={handleLogout} className="text-sm text-wedding-accent hover:underline">
            Sair
          </button>
        </div>

        <div className="mb-6 px-4 py-2 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">Logado como:</p>
          <p className="font-medium truncate">{session?.user?.email}</p>
        </div>

        <nav>
          <ul className="space-y-2">
            {menuItems.map(item => (
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
          <Link href="/" className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
            Voltar para o site
          </Link>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
