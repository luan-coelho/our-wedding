'use client'

import { useState } from 'react'
import { MapPin, Copy, Navigation, Clock, AlertCircle, CheckCircle2, Calendar, Heart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function Ceremony() {
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
    <section
      id="ceremony"
      className="py-32 bg-gradient-to-b from-white via-wedding-light/10 to-wedding-light/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d946ef' fill-opacity='0.3'%3E%3Cpath d='M30 30m-10 0a10 10 0 1 1 20 0a10 10 0 1 1-20 0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">
          <MapPin className="w-6 h-6 text-wedding-primary/30 fill-current" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <Calendar className="w-5 h-5 text-purple-300/30 fill-current" />
        </div>
        <div className="absolute bottom-32 left-20 animate-float">
          <Clock className="w-7 h-7 text-wedding-primary/30 fill-current" />
        </div>
        <div className="absolute top-60 right-1/4 animate-float-delayed">
          <Heart className="w-5 h-5 text-rose-300/30 fill-current" />
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-wedding-primary/10 rounded-full text-wedding-primary mb-6">
            <MapPin className="size-5" />
            <span className="font-medium">Cerimônia</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-wedding-dark mb-8 wedding-heading tracking-wide">
            Nossa Cerimônia
          </h2>
          <p className="text-xl md:text-2xl text-wedding-accent max-w-3xl mx-auto leading-relaxed font-light wedding-subtitle">
            Venha celebrar conosco este momento único e especial de nossas vidas
          </p>
          <div className="mt-10 flex justify-center">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-wedding-primary/30 to-transparent"></div>
          </div>
        </div>

        {/* Wedding Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Data */}
          <Card className="border border-gray-200 bg-white hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-0 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center mb-6 mx-auto">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-medium mb-3 text-gray-900">Data</h3>
              <p className="text-gray-700 mb-2">12 de Setembro de 2025</p>
              <p className="text-sm text-gray-500">Sexta-feira</p>
            </CardContent>
          </Card>

          {/* Horário */}
          <Card className="border border-gray-200 bg-white hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-0 text-center items-center">
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center mb-6 mx-auto">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-medium mb-3 text-gray-900">Horário</h3>
              <p className="text-gray-700 mb-2">10:00</p>
              <p className="text-sm text-gray-500">Manhã</p>
            </CardContent>
          </Card>

          {/* Local */}
          <Card className="border border-gray-200 bg-white hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-0 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center mb-6 mx-auto">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-medium mb-3 text-gray-900">Local</h3>
              <p className="text-gray-700 mb-1">Paróquia Nossa Senhora</p>
              <p className="text-gray-700 mb-2">do Monte do Carmo</p>
              <p className="text-sm text-gray-500">Palmas - TO</p>
            </CardContent>
          </Card>
        </div>

        {/* Map and Location Details */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-wedding-light/30 shadow-lg">
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
          </div>

          {/* Location Details */}
          <div className="space-y-6">
            <Card className="border-wedding-light/30 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-wedding-primary to-wedding-secondary rounded-lg flex items-center justify-center">
                    <MapPin className="size-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-wedding-dark">Local</CardTitle>
                    <CardDescription>Endereço da cerimônia</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg text-wedding-dark mb-2">{churchName}</h4>
                  <p className="text-wedding-accent text-sm leading-relaxed mb-4">{cerimonyAddress}</p>

                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={copyAddressToClipboard}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 border-wedding-primary/30 text-wedding-primary hover:bg-wedding-primary/10">
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
                      size="sm"
                      className="flex items-center gap-2 bg-wedding-accent hover:bg-wedding-accent/90">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(cerimonyAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        <Navigation className="size-4" />
                        Como chegar
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                  <p className="text-wedding-dark mt-2 font-medium">Não haverá recepção ou festa</p>
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
              <h3 className="font-semibold text-lg mb-4 wedding-subtitle">Observações Importantes</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-wedding-primary/20 rounded-full flex items-center justify-center text-xs font-semibold text-wedding-primary mt-0.5 flex-shrink-0">
                    1
                  </div>
                  <p className="text-wedding-accent">
                    Recomendamos chegar com pelo menos <strong>30 minutos de antecedência</strong> para encontrar um bom
                    lugar.
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
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-wedding-primary/20 rounded-full flex items-center justify-center text-xs font-semibold text-wedding-primary mt-0.5 flex-shrink-0">
                    3
                  </div>
                  <p className="text-wedding-accent">
                    A cerimônia será <strong>exclusivamente religiosa</strong>, sem festa ou recepção posterior.
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </section>
  )
}
