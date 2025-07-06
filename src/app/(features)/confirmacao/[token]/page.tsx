import { notFound } from 'next/navigation'
import { db } from '@/db'
import { tableGuests } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Sparkles } from 'lucide-react'
import ConfirmationForm from './confirmation-form'

export default async function ConfirmacaoTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token: slug } = await params
  const token = slug as string
  if (!token) {
    notFound()
  }

  const guest = await db.query.tableGuests.findFirst({
    where: eq(tableGuests.token, token),
  })

  if (!guest) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-lavender via-wedding-light to-wedding-sage">
      {/* Mobile Layout */}
      <div className="block lg:hidden p-3 sm:p-4">
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-3 pb-4 px-4">
              <div className="flex justify-center items-center gap-2 mb-1">
                <Heart className="h-5 w-5 text-wedding-primary fill-wedding-primary" />
                <Sparkles className="h-4 w-4 text-wedding-secondary fill-wedding-secondary" />
                <Heart className="h-5 w-5 text-wedding-primary fill-wedding-primary" />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-wedding-primary to-wedding-secondary bg-clip-text text-transparent">
                Confirmação de Presença
              </CardTitle>
              <CardDescription className="text-base sm:text-lg font-semibold text-wedding-charcoal">
                Olá, {guest.name}! 💜
              </CardDescription>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Confirme sua presença em nosso casamento. Sua resposta é muito importante!
              </p>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <ConfirmationForm guest={guest} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-6xl">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 pb-4 px-6 lg:px-8">
              <div className="flex justify-center items-center gap-2 mb-2">
                <Heart className="h-6 w-6 text-wedding-primary fill-wedding-primary" />
                <Sparkles className="h-5 w-5 text-wedding-secondary fill-wedding-secondary" />
                <Heart className="h-6 w-6 text-wedding-primary fill-wedding-primary" />
              </div>
              <CardTitle className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-wedding-primary to-wedding-secondary bg-clip-text text-transparent">
                Confirmação de Presença
              </CardTitle>
              <CardDescription className="text-lg lg:text-xl font-semibold text-wedding-charcoal">
                Olá, {guest.name}! 💜
              </CardDescription>
              <p className="text-muted-foreground text-base leading-relaxed max-w-lg mx-auto">
                Gostaríamos de confirmar sua presença em nosso casamento. Sua resposta é muito importante para nós!
              </p>
            </CardHeader>
            <CardContent className="pt-0 px-6 lg:px-8 pb-6">
              <ConfirmationForm guest={guest} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
