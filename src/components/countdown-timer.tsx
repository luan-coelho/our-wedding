'use client'

import { useEffect, useState } from 'react'

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
    { label: 'Dias', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Minutos', value: timeLeft.minutes },
    { label: 'Segundos', value: timeLeft.seconds },
  ]

  return (
    <div className="bg-wedding-light p-6 md:p-8 rounded-lg shadow-md">
      <h3 className="text-center text-xl md:text-2xl font-medium mb-6 text-wedding-accent">
        Contagem Regressiva para o Grande Dia
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {timeUnits.map(unit => (
          <div key={unit.label} className="text-center">
            <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border-l-4 border-l-wedding-primary">
              <span className="block text-3xl md:text-4xl font-bold text-wedding-primary">{unit.value}</span>
              <span className="block text-sm font-medium text-wedding-accent mt-1">{unit.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
