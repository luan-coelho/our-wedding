'use client'

import { useState } from 'react'
import { FaCheck, FaEnvelope } from 'react-icons/fa'

export default function ConfirmacaoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    acompanhantes: 0,
    presenca: 'sim',
    mensagem: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: name === 'acompanhantes' ? parseInt(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao enviar confirmação')
      }

      setIsSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao enviar sua confirmação. Por favor, tente novamente.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="py-16 px-4 wedding-container">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FaCheck className="text-green-600 text-2xl" />
            </div>
            <h1 className="text-2xl font-medium text-wedding-dark mb-4">Confirmação Recebida!</h1>
            <p className="text-wedding-accent mb-6">
              Obrigado por confirmar sua presença em nosso casamento. Estamos ansiosos para celebrar com você!
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="inline-block bg-wedding-primary text-wedding-dark px-6 py-2 rounded-md font-medium hover:bg-wedding-primary/90 transition-colors">
              Enviar outra confirmação
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 px-4 wedding-container">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl text-center mb-4 font-light">Confirmação de Presença</h1>
        <p className="text-center text-wedding-accent mb-8">
          Por favor, preencha o formulário abaixo para confirmar sua presença em nosso casamento.
        </p>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="nome" className="block text-sm font-medium text-wedding-dark mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-primary/50"
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label htmlFor="email" className="block text-sm font-medium text-wedding-dark mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-primary/50"
                  placeholder="seu@email.com"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label htmlFor="telefone" className="block text-sm font-medium text-wedding-dark mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-primary/50"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label htmlFor="acompanhantes" className="block text-sm font-medium text-wedding-dark mb-2">
                  Número de Acompanhantes
                </label>
                <input
                  type="number"
                  id="acompanhantes"
                  name="acompanhantes"
                  value={formData.acompanhantes}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-primary/50"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="presenca" className="block text-sm font-medium text-wedding-dark mb-2">
                  Você comparecerá? *
                </label>
                <select
                  id="presenca"
                  name="presenca"
                  value={formData.presenca}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-primary/50">
                  <option value="sim">Sim, estarei presente</option>
                  <option value="nao">Infelizmente não poderei comparecer</option>
                  <option value="talvez">Talvez (confirmarei depois)</option>
                </select>
              </div>

              <div className="col-span-2">
                <label htmlFor="mensagem" className="block text-sm font-medium text-wedding-dark mb-2">
                  Mensagem ou Observações
                </label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-primary/50"
                  placeholder="Se desejar, deixe uma mensagem para os noivos ou alguma observação importante"></textarea>
              </div>
            </div>

            {error && <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md">{error}</div>}

            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center px-6 py-3 bg-wedding-primary text-wedding-dark rounded-md font-medium hover:bg-wedding-primary/90 transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}>
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-wedding-dark"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    <FaEnvelope className="mr-2" />
                    Confirmar Presença
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center text-wedding-accent text-sm">
          <p>Em caso de dúvidas, entre em contato conosco pelo e-mail: contato@joaoemaria.com</p>
        </div>
      </div>
    </div>
  )
}
