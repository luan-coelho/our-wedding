'use client'

import { useState, useEffect } from 'react'
import { FaHeart, FaCheck } from 'react-icons/fa'

interface Message {
  id: number
  name: string
  content: string
  createdAt: string
}

export default function MensagensPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/messages')

      if (!response.ok) {
        throw new Error('Erro ao carregar mensagens')
      }

      const data = await response.json()
      setMessages(data)
    } catch (err) {
      console.error('Erro ao buscar mensagens:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao enviar mensagem')
      }

      const newMessage = await response.json()

      setMessages(prev => [newMessage, ...prev])
      setFormData({ name: '', email: '', message: '' })
      setSubmitted(true)

      // Resetando o estado de submissão após alguns segundos
      setTimeout(() => {
        setSubmitted(false)
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="py-16 px-4 wedding-container">
      <h1 className="text-3xl md:text-4xl text-center mb-4 font-light">Mensagens para os Noivos</h1>
      <p className="text-center text-wedding-accent mb-12 max-w-2xl mx-auto">
        Deixe uma mensagem especial para João e Maria. Seu carinho será muito importante nesse momento!
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-light text-wedding-dark mb-6">Envie sua mensagem</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-wedding-dark mb-2">
                  Seu nome *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-primary/50"
                  placeholder="Como gostaria de ser identificado"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-wedding-dark mb-2">
                  Seu e-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-primary/50"
                  placeholder="seu@email.com (opcional)"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-wedding-dark mb-2">
                  Sua mensagem *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-primary/50"
                  placeholder="Compartilhe seus votos, desejos ou uma mensagem especial para os noivos"></textarea>
              </div>

              {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">{error}</div>}

              <button
                type="submit"
                disabled={isSubmitting || submitted}
                className={`w-full flex items-center justify-center px-6 py-3 bg-wedding-primary text-wedding-dark rounded-md font-medium transition-colors ${
                  isSubmitting || submitted ? 'opacity-70 cursor-not-allowed' : 'hover:bg-wedding-primary/90'
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
                ) : submitted ? (
                  <>
                    <FaCheck className="mr-2" />
                    Mensagem enviada!
                  </>
                ) : (
                  <>
                    <FaHeart className="mr-2" />
                    Enviar mensagem
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-light text-wedding-dark mb-6">Mensagens de carinho</h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <svg
                className="animate-spin h-8 w-8 text-wedding-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : messages.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-wedding-accent">Seja o primeiro a deixar uma mensagem para os noivos!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map(message => (
                <div key={message.id} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-wedding-primary/20 rounded-full flex items-center justify-center mr-4 mt-1">
                      <FaHeart className="text-wedding-primary" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium text-wedding-dark">{message.name}</h3>
                        <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
                      </div>
                      <p className="text-wedding-accent">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
