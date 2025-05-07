'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaGift, FaImages, FaKey, FaUsers } from 'react-icons/fa'

export default function AdminPage() {
  const [_, setStats] = useState({
    gifts: 0,
    guests: 0,
    messages: 0,
    photos: 0,
  })
  const [__, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true)

        // Em uma implementação real, você buscaria os dados de uma API
        const [giftsRes, guestsRes, messagesRes, photosRes] = await Promise.all([
          fetch('/api/gifts').then(res => res.json()),
          fetch('/api/guests')
            .then(res => res.json())
            .catch(() => []),
          fetch('/api/messages')
            .then(res => res.json())
            .catch(() => []),
          fetch('/api/photos')
            .then(res => res.json())
            .catch(() => []),
        ])

        setStats({
          gifts: giftsRes.length || 0,
          guests: guestsRes.length || 0,
          messages: messagesRes.length || 0,
          photos: photosRes.length || 0,
        })
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const adminModules = [
    {
      title: 'Convidados',
      description: 'Gerencie a lista de convidados e acompanhe confirmações',
      icon: <FaUsers className="w-8 h-8" />,
      href: '/admin/convidados',
      color: 'bg-blue-50 text-blue-600',
      disabled: false,
    },
    {
      title: 'Presentes',
      description: 'Adicione e edite itens na lista de presentes',
      icon: <FaGift className="w-8 h-8" />,
      href: '/admin/presentes',
      color: 'bg-green-50 text-green-600',
      disabled: false,
    },
    {
      title: 'Chaves PIX',
      description: 'Gerencie as chaves PIX para recebimento de presentes',
      icon: <FaKey className="w-8 h-8" />,
      href: '/admin/chaves-pix',
      color: 'bg-purple-50 text-purple-600',
      disabled: false,
    },
    {
      title: 'Galeria',
      description: 'Gerencie as fotos exibidas na galeria',
      icon: <FaImages className="w-8 h-8" />,
      href: '/admin/galeria',
      color: 'bg-amber-50 text-amber-600',
      disabled: true,
    },
  ]

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminModules.map(module => (
            <Link
              key={module.title}
              href={module.disabled ? '#' : module.href}
              className={`block p-6 border rounded-lg hover:shadow-md transition-shadow group bg-white ${
                module.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}>
              <div className="flex items-start">
                <div className={`p-3 rounded-lg ${module.color} mr-4`}>{module.icon}</div>
                <div>
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {module.title}
                  </h2>
                  <p className="text-gray-600">{module.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
