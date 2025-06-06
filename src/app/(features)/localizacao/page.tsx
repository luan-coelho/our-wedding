'use client'

import { useState } from 'react'
import { MapPin, Copy, Navigation, Clock, AlertCircle, CheckCircle2, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LocalizacaoPage() {
  const [copied, setCopied] = useState(false)

  const cerimonyAddress = 'Q. 108 Norte Alameda 2, 60 - Plano Diretor Norte, Palmas - TO'
  const churchName = 'Paróquia Nossa Senhora do Monte do Carmo'

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(cerimonyAddress).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-wedding-light/10 to-wedding-light/20">
      <div className="wedding-container py-12 lg:py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-wedding-primary/10 rounded-full text-wedding-primary mb-6">
            <MapPin className="size-5" />
            <span className="font-medium">Localização</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-wedding-dark mb-6">
            Como Chegar
          </h1>
          <p className="text-lg text-wedding-accent max-w-3xl mx-auto leading-relaxed">
            Estamos ansiosos para recebê-lo no nosso grande dia. Abaixo estão todas as informações
            para ajudá-lo a chegar ao local da cerimônia.
          </p>
        </div>

        {/* Map Section */}
        <Card className="mb-12 overflow-hidden border-wedding-light/30 shadow-lg">
          <div className="aspect-video w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3927.0228768090715!2d-48.3179763!3d-10.178795699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9324cc9e31431eef%3A0xc16bbff60feb6716!2sPar%C3%B3quia%20Nossa%20Senhora%20do%20Monte%20do%20Carmo!5e0!3m2!1spt-BR!2sbr!4v1746164865442!5m2!1spt-BR!2sbr"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da Paróquia Nossa Senhora do Monte do Carmo"
            />
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Location Details */}
          <div className="lg:col-span-2">
            <Card className="border-wedding-light/30 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-wedding-primary to-wedding-secondary rounded-xl flex items-center justify-center shadow-lg">
                    <MapPin className="size-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-wedding-dark">Local da Cerimônia</CardTitle>
                    <CardDescription className="text-wedding-accent mt-1">
                      Informações detalhadas sobre o local
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-xl text-wedding-dark mb-3">{churchName}</h3>
                  <p className="text-wedding-accent text-lg leading-relaxed mb-4">{cerimonyAddress}</p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={copyAddressToClipboard}
                      variant="outline"
                      className="flex items-center gap-2 border-wedding-primary/30 text-wedding-primary hover:bg-wedding-primary/10"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="size-4" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="size-4" />
                          Copiar endereço
                        </>
                      )}
                    </Button>
                    <Button
                      asChild
                      className="flex items-center gap-2 bg-wedding-accent hover:bg-wedding-accent/90"
                    >
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(cerimonyAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Navigation className="size-4" />
                        Como chegar
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Card */}
          <div className="space-y-6">
            <Card className="border-wedding-light/30 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-wedding-accent to-wedding-sky rounded-lg flex items-center justify-center">
                    <Clock className="size-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-wedding-dark">Horário</CardTitle>
                    <CardDescription>Programação do dia</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-wedding-primary/5 rounded-lg">
                  <Calendar className="size-5 text-wedding-primary" />
                  <div>
                    <p className="font-semibold text-wedding-dark">Cerimônia</p>
                    <p className="text-wedding-accent">10:00</p>
                  </div>
                </div>
                <Separator className="bg-wedding-light/50" />
                <div className="p-4 bg-wedding-accent/5 rounded-lg">
                  <Badge variant="outline" className="border-wedding-accent/30 text-wedding-accent">
                    Importante
                  </Badge>
                  <p className="text-wedding-dark mt-2 font-medium">
                    Não haverá recepção ou festa
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Notes */}
        <div className="max-w-4xl mx-auto">
          <Alert className="border-wedding-primary/30 bg-wedding-primary/5">
            <AlertCircle className="size-5 text-wedding-primary" />
            <AlertDescription className="text-wedding-dark">
              <h3 className="font-semibold text-lg mb-4">Observações Importantes</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-wedding-primary/20 rounded-full flex items-center justify-center text-xs font-semibold text-wedding-primary mt-0.5 flex-shrink-0">
                    1
                  </div>
                  <p className="text-wedding-accent">
                    Recomendamos chegar com pelo menos <strong>30 minutos de antecedência</strong> para encontrar um bom lugar.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-wedding-primary/20 rounded-full flex items-center justify-center text-xs font-semibold text-wedding-primary mt-0.5 flex-shrink-0">
                    2
                  </div>
                  <p className="text-wedding-accent">
                    Utilize <strong>vestimenta adequada</strong> para a cerimônia religiosa.
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
