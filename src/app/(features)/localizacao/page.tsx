'use client'

import { FaMapMarkerAlt, FaDirections, FaCar, FaUber, FaTaxi } from 'react-icons/fa'
import { MdContentCopy } from 'react-icons/md'
import { useState } from 'react'

export default function LocalizacaoPage() {
  const [copied, setCopied] = useState(false)

  const cerimonyAddress = 'Q. 108 Norte Alameda 2, 60 - Plano Diretor Norte, Palmas - TO'

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(cerimonyAddress).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="py-16 px-4 wedding-container">
      <h1 className="text-3xl md:text-4xl text-center mb-4 font-light">Como Chegar</h1>
      <p className="text-center text-wedding-accent mb-12 max-w-2xl mx-auto">
        Estamos ansiosos para recebê-lo no nosso grande dia. Abaixo estão todas as informações para ajudá-lo a chegar ao
        local da cerimônia e da festa.
      </p>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-12">
        <div className="aspect-video w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3927.0228768090715!2d-48.3179763!3d-10.178795699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9324cc9e31431eef%3A0xc16bbff60feb6716!2sPar%C3%B3quia%20Nossa%20Senhora%20do%20Monte%20do%20Carmo!5e0!3m2!1spt-BR!2sbr!4v1746164865442!5m2!1spt-BR!2sbr"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-wedding-primary/20 rounded-full flex items-center justify-center mr-4">
            <FaMapMarkerAlt className="text-xl text-wedding-primary" />
          </div>
          <h2 className="text-2xl font-light text-wedding-dark">Local da Cerimônia</h2>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-lg text-wedding-dark mb-2">Paróquia Nossa Senhora do Monte do Carmo</h3>
          <p className="text-wedding-accent mb-4">{cerimonyAddress}</p>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyAddressToClipboard}
              className="flex items-center text-sm bg-wedding-primary/10 hover:bg-wedding-primary/20 text-wedding-dark px-3 py-1 rounded-md transition-colors">
              <MdContentCopy className="mr-1" />
              {copied ? 'Copiado!' : 'Copiar endereço'}
            </button>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(cerimonyAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm bg-wedding-accent/10 hover:bg-wedding-accent/20 text-wedding-dark px-3 py-1 rounded-md transition-colors">
              <FaDirections className="mr-1" />
              Como chegar
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-lg text-wedding-dark mb-3">Horário</h3>
          <div className="space-y-2">
            <p className="text-wedding-accent">
              <span className="font-medium">Cerimônia:</span> 10:00
            </p>
            <p className="text-wedding-accent">
              <span className="font-medium">Não haverá recepção ou festa</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-wedding-primary/10 p-8 rounded-lg max-w-3xl mx-auto">
        <h2 className="text-2xl font-light text-center text-wedding-dark mb-4">Observações Importantes</h2>
        <ul className="text-wedding-accent space-y-3">
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 bg-wedding-primary/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
              1
            </span>
            <p>Recomendamos chegar com pelo menos 30 minutos de antecedência.</p>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 bg-wedding-primary/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
              2
            </span>
            <p>Utilize vestimenta adequada para a cerimônia</p>
          </li>
        </ul>
      </div>
    </div>
  )
}
