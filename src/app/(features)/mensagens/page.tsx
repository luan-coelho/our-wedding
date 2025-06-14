'use client'

import { useState } from 'react'
import { FaHeart, FaCheck } from 'react-icons/fa'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { messagesService } from '@/services'
import { Message } from '@/types'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { messageFormSchema, MessageFormValues } from './message-schema'



export default function MensagensPage() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: messagesService.getAll,
  })

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      name: '',
      message: '',
    },
  })

  const messageMutation = useMutation({
    mutationFn: (values: MessageFormValues) => messagesService.create({
      name: values.name,
      message: values.message,
    }),
    onSuccess: newMessage => {
      // Atualiza o cache com a nova mensagem
      queryClient.setQueryData(['messages'], (oldData: Message[] = []) => {
        return [newMessage, ...oldData]
      })

      // Invalida e refetch para garantir sincronização
      queryClient.invalidateQueries({ queryKey: ['messages'] })

      form.reset()
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    },
    onError: (err: Error) => {
      setError(err.message || 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.')
    },
  })

  function handleSubmit(values: MessageFormValues) {
    setError('')
    messageMutation.mutate(values)
  }

  function formatDate(dateString: string) {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    
    // Verifica se a data é válida
    if (isNaN(date.getTime())) return ''
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const isSubmitting = form.formState.isSubmitting || messageMutation.isPending

  return (
    <div className="py-16 px-4 wedding-container">
      <h1 className="text-3xl md:text-4xl text-center mb-4 font-light">Mensagens para os Noivos</h1>
      <p className="text-center text-wedding-accent mb-12 max-w-2xl mx-auto">
        Deixe uma mensagem especial para Ester e Luan. Seu carinho será muito importante nesse momento!
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-light text-wedding-dark">Envie sua mensagem</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-wedding-dark">Seu nome *</FormLabel>
                        <FormControl>
                          <Input placeholder="Como gostaria de ser identificado" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-wedding-dark">Sua mensagem *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Compartilhe seus votos, desejos ou uma mensagem especial para os noivos"
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" disabled={isSubmitting || submitted} className="w-full">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
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
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-light text-wedding-dark mb-6">Mensagens de carinho</h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin h-8 w-8 text-wedding-primary" />
            </div>
          ) : messages.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-wedding-accent">Seja o primeiro a deixar uma mensagem para os noivos!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <Card key={message.id} className="py-2">
                  <CardContent className="px-6 py-4">
                    <div className="flex">
                      <div className="w-10 h-10 bg-wedding-primary/20 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <FaHeart className="text-wedding-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-medium text-wedding-dark">{message.name}</h3>
                          <span className="text-xs text-gray-500 ml-2">{formatDate(message.createdAt)}</span>
                        </div>
                        <p className="text-wedding-accent">{message.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
