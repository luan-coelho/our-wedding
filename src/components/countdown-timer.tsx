'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Heart, Sparkles } from 'lucide-react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +targetDate - +new Date()

    let timeLeft: TimeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearTimeout(timer)
  })

  const timeUnits = [
    {
      label: 'Dias',
      value: timeLeft.days,
      gradient: 'linear-gradient(135deg, #5f5597, #b7a0d8)', // Roxo profundo → Lilás
      bgGradient: 'linear-gradient(135deg, #d3cfe4, #ffffff)', // Lavanda → Branco
      textColor: '#5f5597',
    },
    {
      label: 'Horas',
      value: timeLeft.hours,
      gradient: 'linear-gradient(135deg, #776BA8, #a59dcc)', // Ametista → Roxo claro
      bgGradient: 'linear-gradient(135deg, #a59dcc, #ffffff)', // Roxo claro → Branco
      textColor: '#776BA8',
    },
    {
      label: 'Minutos',
      value: timeLeft.minutes,
      gradient: 'linear-gradient(135deg, #678EBB, #B1C095)', // Azul céu → Verde menta
      bgGradient: 'linear-gradient(135deg, #B1C095, #ffffff)', // Verde menta → Branco
      textColor: '#678EBB',
    },
    {
      label: 'Segundos',
      value: timeLeft.seconds,
      gradient: 'linear-gradient(135deg, #67877a, #A4B99B)', // Verde floresta → Verde oliva
      bgGradient: 'linear-gradient(135deg, #b9cebb, #ffffff)', // Verde sálvia → Branco
      textColor: '#67877a',
    },
  ]

  return (
    <div className="text-center">
      {/* Header */}
      <div className="mb-12">
        <div className="flex justify-center mb-4">
          <Badge
            variant="secondary"
            className="px-4 py-2 text-sm font-medium"
            style={{
              background: 'linear-gradient(135deg, #d3cfe4, #b7a0d8)',
              color: '#5f5597',
              border: 'none',
            }}>
            <Sparkles className="w-4 h-4 mr-2" />
            Contagem Regressiva
          </Badge>
        </div>

        <h3 className="text-3xl md:text-4xl font-light mb-4" style={{ color: '#20222f' }}>
          Faltam Poucos Dias!
        </h3>

        <p className="text-lg max-w-2xl mx-auto" style={{ color: '#5f5597' }}>
          Cada segundo nos aproxima mais do nosso grande dia. Mal podemos esperar para celebrar com vocês!
        </p>

        <Separator className="w-24 mx-auto mt-6" style={{ backgroundColor: '#b7a0d8' }} />
      </div>

      {/* Countdown Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {timeUnits.map((unit, index) => (
          <Card
            key={unit.label}
            className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 overflow-hidden">
            <CardContent className="p-6 md:p-8 relative">
              {/* Background Gradient */}
              <div className="absolute inset-0 opacity-30" style={{ background: unit.bgGradient }}></div>

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Number */}
                <div className="mb-4">
                  <span
                    className="block text-4xl md:text-5xl lg:text-6xl font-bold group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: unit.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                    {unit.value.toString().padStart(2, '0')}
                  </span>
                </div>

                {/* Label */}
                <div className="space-y-2">
                  <span
                    className="block text-sm md:text-base font-semibold uppercase tracking-wide"
                    style={{ color: unit.textColor }}>
                    {unit.label}
                  </span>

                  {/* Decorative line */}
                  <div
                    className="w-8 h-1 rounded-full mx-auto group-hover:w-12 transition-all duration-300"
                    style={{ background: unit.gradient }}></div>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ background: unit.gradient }}></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Message */}
      <div
        className="mt-12 p-6 rounded-2xl border"
        style={{
          background: 'linear-gradient(135deg, #d3cfe4, #ffffff, #b9cebb)',
          borderColor: '#b7a0d8',
        }}>
        <div className="flex items-center justify-center mb-3">
          <Heart className="w-5 h-5 mr-2" style={{ color: '#b7a0d8' }} />
          <span className="text-lg font-medium" style={{ color: '#20222f' }}>
            Nosso amor cresce a cada dia
          </span>
          <Heart className="w-5 h-5 ml-2" style={{ color: '#b7a0d8' }} />
        </div>
        <p className="text-sm" style={{ color: '#5f5597' }}>
          E em breve estaremos unidos para sempre!
        </p>
      </div>
    </div>
  )
}
