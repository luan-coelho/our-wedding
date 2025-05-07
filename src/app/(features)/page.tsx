'use client'

import Image from 'next/image'
import Link from 'next/link'
import CountdownTimer from '@/components/countdown-timer'
import { FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import { MdChecklist } from 'react-icons/md'
import { routes } from '@/lib/routes'

export default function Home() {
  // Definindo a data do casamento (12 de setembro de 2025)
  const weddingDate = new Date('2025-09-12T16:00:00')

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="absolute inset-0">
          <Image
            src="/images/hero-wedding.jpg"
            alt="Ester e Luan"
            fill
            priority
            style={{ objectFit: 'cover' }}
            className="brightness-90"
          />
        </div>
        <div className="z-20 text-center text-white px-4 md:px-0">
          <h1 className="text-4xl md:text-6xl mb-4 font-light">
            Ester <span className="font-serif">&</span> Luan
          </h1>
          <p className="text-lg md:text-2xl mb-8">Vamos nos casar em 12 de Setembro de 2025</p>
          <Link
            href={routes.frontend.confirmacao}
            className="inline-block bg-wedding-accent text-white px-6 py-3 rounded-md font-medium hover:bg-wedding-accent/90 transition-colors">
            Confirmar Presença
          </Link>
        </div>
      </section>

      {/* Wedding Info Section */}
      <section className="py-16 bg-wedding-secondary">
        <div className="wedding-container">
          <h2 className="text-3xl md:text-4xl text-center mb-12 font-light text-wedding-primary">Nosso Grande Dia</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-wedding-primary/20 rounded-full flex items-center justify-center mb-4">
                <FaCalendarAlt className="text-2xl text-wedding-primary" />
              </div>
              <h3 className="text-xl font-medium text-wedding-primary mb-2">Data</h3>
              <p className="text-wedding-accent">12 de Setembro de 2025</p>
              <p className="text-sm text-gray-500 mt-1">Sexta-feira</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-wedding-primary/20 rounded-full flex items-center justify-center mb-4">
                <FaClock className="text-2xl text-wedding-primary" />
              </div>
              <h3 className="text-xl font-medium text-wedding-primary mb-2">Horário</h3>
              <p className="text-wedding-accent">Cerimônia: 16:00</p>
              <p className="text-sm text-gray-500 mt-1">Recepção: 18:00</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-wedding-primary/20 rounded-full flex items-center justify-center mb-4">
                <FaMapMarkerAlt className="text-2xl text-wedding-primary" />
              </div>
              <h3 className="text-xl font-medium text-wedding-primary mb-2">Local</h3>
              <p className="text-wedding-accent">Espaço Villa Jardim</p>
              <p className="text-sm text-gray-500 mt-1">R. das Flores, 123 - Jardim Primavera</p>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-16 bg-wedding-light">
        <div className="wedding-container">
          <CountdownTimer targetDate={weddingDate} />
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16">
        <div className="wedding-container">
          <h2 className="text-3xl md:text-4xl text-center mb-12 font-light text-wedding-primary">
            Informações Importantes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              href={routes.frontend.confirmacao}
              className="block bg-wedding-secondary p-8 rounded-lg hover:bg-wedding-secondary/90 transition-colors">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-wedding-primary/20 rounded-full flex items-center justify-center mr-4">
                  <MdChecklist className="text-2xl text-wedding-primary" />
                </div>
                <h3 className="text-xl font-medium text-wedding-primary">Confirmação de Presença</h3>
              </div>
              <p className="text-wedding-accent">
                Confirme sua presença até 12 de agosto de 2025. É muito importante para nós!
              </p>
            </Link>

            <Link
              href={routes.frontend.presentes}
              className="block bg-wedding-secondary p-8 rounded-lg hover:bg-wedding-secondary/90 transition-colors">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-wedding-primary/20 rounded-full flex items-center justify-center mr-4">
                  <FaMapMarkerAlt className="text-2xl text-wedding-primary" />
                </div>
                <h3 className="text-xl font-medium text-wedding-primary">Lista de Presentes</h3>
              </div>
              <p className="text-wedding-accent">
                Confira nossa lista de presentes sugeridos. Sua contribuição é um gesto de carinho.
              </p>
            </Link>

            <Link
              href={routes.frontend.localizacao}
              className="block bg-wedding-secondary p-8 rounded-lg hover:bg-wedding-secondary/90 transition-colors">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-wedding-primary/20 rounded-full flex items-center justify-center mr-4">
                  <FaMapMarkerAlt className="text-2xl text-wedding-primary" />
                </div>
                <h3 className="text-xl font-medium text-wedding-primary">Como Chegar</h3>
              </div>
              <p className="text-wedding-accent">Encontre facilmente o local da cerimônia.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
