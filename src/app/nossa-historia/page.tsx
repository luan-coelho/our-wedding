'use client'

import Image from 'next/image'
import { FaHeart, FaCalendarAlt } from 'react-icons/fa'

// Linha do tempo fictícia do casal
const timeline = [
  {
    id: 1,
    date: 'Janeiro de 2019',
    title: 'Primeiro Encontro',
    description:
      'Nos conhecemos em uma festa de amigos em comum. Foi uma conexão instantânea que nos deixou curiosos para nos conhecermos melhor.',
    image: '/images/first-date.jpg',
  },
  {
    id: 2,
    date: 'Março de 2019',
    title: 'Início do Namoro',
    description:
      'Após alguns encontros, percebemos que queríamos algo mais. Começamos a namorar oficialmente durante um jantar romântico.',
    image: '/images/dating.jpg',
  },
  {
    id: 3,
    date: 'Dezembro de 2019',
    title: 'Primeira Viagem Juntos',
    description:
      'Nossa primeira grande aventura juntos foi uma viagem para a praia. Descobrimos nosso amor por viajar e conhecer novos lugares.',
    image: '/images/travel.jpg',
  },
  {
    id: 4,
    date: 'Fevereiro de 2021',
    title: 'Mudança para o Mesmo Apartamento',
    description:
      'Decidimos dar um grande passo em nosso relacionamento e começamos a morar juntos, criando nosso próprio lar.',
    image: '/images/apartment.jpg',
  },
  {
    id: 5,
    date: 'Julho de 2023',
    title: 'Pedido de Casamento',
    description:
      'Durante um piquenique especial no parque onde costumamos passear, fiz o pedido de casamento. E ela disse sim!',
    image: '/images/proposal.jpg',
  },
  {
    id: 6,
    date: 'Dezembro de 2024',
    title: 'Nosso Casamento',
    description: 'Finalmente chegou o dia de celebrarmos nossa união rodeados por amigos e familiares queridos.',
    image: '/images/wedding.jpg',
  },
]

export default function NossaHistoriaPage() {
  return (
    <div className="py-16 px-4 wedding-container">
      <h1 className="text-3xl md:text-4xl text-center mb-4 font-light">Nossa História</h1>
      <p className="text-center text-wedding-accent mb-12 max-w-2xl mx-auto">
        A jornada de amor de João e Maria, dos primeiros encontros até o grande dia.
      </p>

      {/* Introdução */}
      <div className="bg-white p-8 rounded-lg shadow-sm mb-16">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2">
            <div className="relative h-80 w-full rounded-lg overflow-hidden">
              <Image src="/images/couple-main.jpg" alt="João e Maria" fill style={{ objectFit: 'cover' }} priority />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-light text-wedding-dark mb-4">O Nosso Amor</h2>
            <p className="text-wedding-accent mb-4">
              Nosso amor começou de forma inesperada, em uma festa de amigos em comum. O que parecia ser apenas mais um
              evento social se transformou no início de uma linda história. Desde o primeiro olhar, soubemos que havia
              algo especial entre nós.
            </p>
            <p className="text-wedding-accent">
              Ao longo dos anos, construímos uma relação baseada em respeito, companheirismo e muito amor.
              Compartilhamos sonhos, superamos desafios e crescemos juntos. Agora, estamos prontos para dar o próximo
              passo e iniciar um novo capítulo em nossas vidas como marido e mulher.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Linha central vertical */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-wedding-primary/30 z-0"></div>

        <div className="relative z-10">
          {timeline.map((event, index) => (
            <div
              key={event.id}
              className={`mb-16 flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
              {/* Ponto na linha do tempo */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-wedding-primary rounded-full flex items-center justify-center z-20">
                <FaHeart className="text-white" />
              </div>

              {/* Conteúdo */}
              <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-3">
                    <FaCalendarAlt className="text-wedding-primary mr-2" />
                    <span className="text-sm font-medium text-wedding-accent">{event.date}</span>
                  </div>
                  <h3 className="text-xl font-medium text-wedding-dark mb-3">{event.title}</h3>
                  <p className="text-wedding-accent text-sm">{event.description}</p>
                </div>
              </div>

              {/* Espaçador central */}
              <div className="mx-4 my-4 md:my-0 md:mx-0 md:w-2/12 flex justify-center">
                {/* Vazio para espaçamento */}
              </div>

              {/* Imagem */}
              <div className="w-full md:w-5/12 flex justify-center">
                <div className="relative h-48 w-full md:h-64 md:w-64 rounded-lg overflow-hidden">
                  <Image src={event.image} alt={event.title} fill style={{ objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Citação final */}
      <div className="mt-12 text-center max-w-3xl mx-auto">
        <blockquote className="italic text-xl text-wedding-dark">
          "O amor não consiste em olhar um para o outro, mas olhar juntos na mesma direção."
        </blockquote>
        <p className="mt-2 font-medium text-wedding-accent">Antoine de Saint-Exupéry</p>
      </div>
    </div>
  )
}
