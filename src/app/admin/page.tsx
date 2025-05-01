'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaGift, FaUsers, FaComments, FaImages } from 'react-icons/fa'

interface DashboardCard {
  title: string
  count: number
  icon: React.ReactNode
  link: string
  color: string
}

export default function AdminPage() {
  const [stats, setStats] = useState({
    gifts: 0,
    guests: 0,
    messages: 0,
    photos: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true)
        
        // Em uma implementação real, você buscaria os dados de uma API
        const [giftsRes, guestsRes, messagesRes, photosRes] = await Promise.all([
          fetch('/api/gifts').then(res => res.json()),
          fetch('/api/guests').then(res => res.json()).catch(() => []),
          fetch('/api/messages').then(res => res.json()).catch(() => []),
          fetch('/api/photos').then(res => res.json()).catch(() => []),
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

  const cards: DashboardCard[] = [
    {
      title: 'Presentes',
      count: stats.gifts,
      icon: <FaGift size={28} />,
      link: '/admin/presentes',
      color: 'bg-blue-50 text-blue-500',
    },
    {
      title: 'Convidados',
      count: stats.guests,
      icon: <FaUsers size={28} />,
      link: '/admin/convidados',
      color: 'bg-green-50 text-green-500',
    },
    {
      title: 'Mensagens',
      count: stats.messages,
      icon: <FaComments size={28} />,
      link: '/admin/mensagens',
      color: 'bg-purple-50 text-purple-500',
    },
    {
      title: 'Fotos',
      count: stats.photos,
      icon: <FaImages size={28} />,
      link: '/admin/galeria',
      color: 'bg-amber-50 text-amber-500',
    },
  ]

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-light mb-8">Painel de Administração</h1>
      
      {isLoading ? (
        <div className="text-center py-8">Carregando estatísticas...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Link key={card.title} href={card.link}>
              <div className="bg-white rounded-lg shadow-sm p-6 transition-transform hover:scale-105">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">{card.title}</h3>
                  <div className={`p-3 rounded-full ${card.color}`}>{card.icon}</div>
                </div>
                <p className="text-3xl font-semibold text-wedding-dark">{card.count}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-light mb-4">Guia de Administração</h2>
        <p className="text-gray-600 mb-4">
          Bem-vindo à área administrativa do site do seu casamento. Aqui você pode gerenciar todos os aspectos do
          seu site, incluindo presentes, convidados, mensagens e fotos.
        </p>
        
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>
            <strong>Presentes</strong>: Adicione, edite ou remova itens da sua lista de presentes. Você pode
            definir nome, descrição, preço e uma chave PIX para cada presente.
          </li>
          <li>
            <strong>Convidados</strong>: Gerencie sua lista de convidados e acompanhe as confirmações de presença.
          </li>
          <li>
            <strong>Mensagens</strong>: Veja as mensagens deixadas pelos seus convidados no site.
          </li>
          <li>
            <strong>Galeria</strong>: Adicione ou remova fotos da galeria do seu casamento.
          </li>
        </ul>
      </div>
    </div>
  )
} 