'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  IconGift,
  IconUsers,
  IconCreditCard,
  IconMessageCircle,
  IconTrendingUp,
  IconCalendar,
  IconHeart,
} from '@tabler/icons-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { giftsService, guestsService, messagesService } from '@/services'
import { DashboardStats } from '@/types'

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    gifts: 0,
    guests: 0,
    messages: 0,
    confirmedGuests: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true)

        // Buscar dados usando os services
        const [giftsRes, guestsRes, messagesRes] = await Promise.all([
          giftsService.getAll().catch(() => []),
          guestsService.getAll().catch(() => []),
          messagesService.getAll().catch(() => []),
        ])

        const confirmedGuests = Array.isArray(guestsRes)
          ? guestsRes.filter((guest: any) => guest.isConfirmed).length
          : 0

        setStats({
          gifts: Array.isArray(giftsRes) ? giftsRes.length : 0,
          guests: Array.isArray(guestsRes) ? guestsRes.length : 0,
          messages: Array.isArray(messagesRes) ? messagesRes.length : 0,
          confirmedGuests,
        })
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statsCards = [
    {
      title: 'Total de Convidados',
      value: stats.guests,
      description: `${stats.confirmedGuests} confirmados`,
      icon: IconUsers,
      color: 'text-wedding-primary',
      bgColor: 'bg-wedding-light/20',
    },
    {
      title: 'Lista de Presentes',
      value: stats.gifts,
      description: 'Itens cadastrados',
      icon: IconGift,
      color: 'text-wedding-secondary',
      bgColor: 'bg-wedding-secondary/20',
    },
    {
      title: 'Mensagens',
      value: stats.messages,
      description: 'Dos convidados',
      icon: IconMessageCircle,
      color: 'text-wedding-accent',
      bgColor: 'bg-wedding-accent/20',
    },
    {
      title: 'Taxa de Confirmação',
      value: stats.guests > 0 ? `${Math.round((stats.confirmedGuests / stats.guests) * 100)}%` : '0%',
      description: 'Convidados confirmados',
      icon: IconTrendingUp,
      color: 'text-wedding-sage',
      bgColor: 'bg-wedding-sage/20',
    },
  ]

  const adminModules = [
    {
      title: 'Convidados',
      description: 'Gerencie a lista de convidados e acompanhe confirmações',
      icon: IconUsers,
      href: '/admin/convidados',
      gradient: 'from-wedding-primary to-wedding-secondary',
      badge: `${stats.guests} total`,
    },
    {
      title: 'Lista de Presentes',
      description: 'Adicione e edite itens na lista de presentes',
      icon: IconGift,
      href: '/admin/presentes',
      gradient: 'from-wedding-secondary to-wedding-accent',
      badge: `${stats.gifts} itens`,
    },
    {
      title: 'Chaves PIX',
      description: 'Gerencie as chaves PIX para recebimento de presentes',
      icon: IconCreditCard,
      href: '/admin/chaves-pix',
      gradient: 'from-wedding-accent to-wedding-sage',
      badge: 'Configurar',
    },
  ]

  const weddingDate = new Date('2025-09-12')
  const today = new Date()
  const daysUntilWedding = Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-8">
      {/* Header com countdown */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-wedding-primary to-wedding-secondary rounded-full text-white mb-4">
          <IconHeart className="size-5" />
          <span className="font-semibold">Luan & Ester</span>
        </div>
        <h1 className="text-4xl font-bold text-wedding-primary mb-2">Painel Administrativo</h1>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <IconCalendar className="size-4" />
          <span>{daysUntilWedding > 0 ? `${daysUntilWedding} dias para o grande dia!` : 'O grande dia chegou!'}</span>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map(stat => (
          <Card key={stat.title} className="border-wedding-light/30 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`size-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{isLoading ? '...' : stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Módulos administrativos */}
      <div>
        <h2 className="text-2xl font-semibold text-wedding-primary mb-6">Módulos Administrativos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map(module => (
            <Link key={module.title} href={module.href}>
              <Card className="group border-wedding-light/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${module.gradient}`} />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${module.gradient} text-white`}>
                      <module.icon className="size-6" />
                    </div>
                    <Badge variant="secondary" className="bg-wedding-light/50 text-wedding-primary">
                      {module.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-wedding-primary transition-colors">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">{module.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Informações adicionais */}
      <Card className="border-wedding-light/30 bg-gradient-to-r from-wedding-light/10 to-wedding-sage/10">
        <CardHeader>
          <CardTitle className="text-wedding-primary flex items-center gap-2">
            <IconHeart className="size-5" />
            Bem-vindo ao Painel Administrativo
          </CardTitle>
          <CardDescription>
            Gerencie todos os aspectos do seu casamento em um só lugar. Use os módulos acima para organizar convidados,
            presentes e muito mais.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
