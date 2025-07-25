'use client'

import { Calendar, Heart, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

interface CountdownProps {
  weddingDate: Date
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function Countdown({ weddingDate }: CountdownProps) {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +weddingDate - +new Date()

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
  return (
    <section
      id="countdown"
      className="py-20 bg-gradient-to-r from-wedding-lavender/80 via-wedding-light/80 to-wedding-lilac/80 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d946ef' fill-opacity='0.4'%3E%3Cpath d='M60 60l30-30v60l-30-30zm0 0l-30-30v60l30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div id="countdown-container" className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-8">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-wedding-purple-light"></div>
            <Sparkles className="w-6 h-6 mx-4 text-wedding-primary animate-pulse" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-wedding-purple-light"></div>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-wedding-dark mb-8 wedding-heading tracking-wide">
            Contagem Regressiva
          </h2>

          <p className="text-xl md:text-2xl text-wedding-charcoal/80 max-w-3xl mx-auto leading-relaxed font-light wedding-subtitle">
            Faltam poucos dias para o nosso grande momento
          </p>

          <div className="mt-8 flex justify-center">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-wedding-purple-light to-transparent"></div>
          </div>
        </div>

        {/* Countdown Timer - New Style */}
        <div className="flex justify-center items-center text-center">
          <div className="countdown-content flex justify-center items-center gap-4 md:gap-8">
            <div className="item flex flex-col items-center">
              <div className="relative flex items-center justify-center w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 border-2 border-wedding-purple-light rounded-full">
                <div className="number text-4xl md:text-6xl lg:text-7xl font-bold text-wedding-dark wedding-accent-text">
                  {timeLeft.days.toString().padStart(2, '0')}
                </div>
              </div>
              <div className="txt text-sm md:text-base font-medium text-wedding-charcoal/80 uppercase tracking-wide mt-2 wedding-subtitle">
                dias
              </div>
            </div>
            <div className="item flex flex-col items-center">
              <div className="relative flex items-center justify-center w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 border-2 border-wedding-purple-light rounded-full">
                <div className="number text-4xl md:text-6xl lg:text-7xl font-bold text-wedding-dark wedding-accent-text">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
              </div>
              <div className="txt text-sm md:text-base font-medium text-wedding-charcoal/80 uppercase tracking-wide mt-2 wedding-subtitle">
                horas
              </div>
            </div>
            <div className="item flex flex-col items-center">
              <div className="relative flex items-center justify-center w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 border-2 border-wedding-purple-light rounded-full">
                <div className="number text-4xl md:text-6xl lg:text-7xl font-bold text-wedding-dark wedding-accent-text">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
              </div>
              <div className="txt text-sm md:text-base font-medium text-wedding-charcoal/80 uppercase tracking-wide mt-2 wedding-subtitle">
                minutos
              </div>
            </div>
            <div className="item flex flex-col items-center">
              <div className="relative flex items-center justify-center w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 border-2 border-wedding-purple-light rounded-full">
                <div className="number text-4xl md:text-6xl lg:text-7xl font-bold text-wedding-dark wedding-accent-text">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
              </div>
              <div className="txt text-sm md:text-base font-medium text-wedding-charcoal/80 uppercase tracking-wide mt-2 wedding-subtitle">
                segundos
              </div>
            </div>
          </div>
        </div>

        {/* Additional decorative elements */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 px-8 py-4 bg-white/60 backdrop-blur-sm rounded-full shadow-lg">
            <Calendar className="w-5 h-5 text-wedding-primary" />
            <span className="text-lg font-medium text-wedding-dark wedding-accent-text">12 de Setembro de 2025</span>
            <Heart className="w-5 h-5 text-wedding-accent fill-current" />
          </div>
        </div>
      </div>
    </section>
  )
}
