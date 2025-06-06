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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wedding-lavender via-wedding-light to-wedding-sage p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Heart className="h-6 w-6 text-wedding-primary fill-wedding-primary" />
              <Sparkles className="h-5 w-5 text-wedding-secondary fill-wedding-secondary" />
              <Heart className="h-6 w-6 text-wedding-primary fill-wedding-primary" />
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-wedding-primary to-wedding-secondary bg-clip-text text-transparent">
              Confirmação de Presença
            </CardTitle>
            <CardDescription className="text-lg sm:text-xl font-semibold text-wedding-charcoal">
              Olá, {guest.name}! 💜
            </CardDescription>
            <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
              Gostaríamos de confirmar sua presença em nosso casamento. Sua resposta é muito importante para nós!
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <ConfirmationForm guest={guest} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
