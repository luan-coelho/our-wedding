import { notFound } from 'next/navigation'
import { db } from '@/db'
import { guests } from '@/db/schema'
import { eq } from 'drizzle-orm'
import ConfirmationForm from './confirmation-form'

export default async function ConfirmacaoTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token: slug } = await params
  const token = slug as string
  if (!token) {
    notFound()
  }

  const guest = await db.query.guests.findFirst({
    where: eq(guests.token, token),
  })

  if (!guest) {
    notFound()
  }

  return (
    <div className="flex items-center justify-center bg-gradient-to-b from-amber-50 to-amber-100 py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-amber-800">Confirmação de Presença</h1>
          <p className="text-xl mb-4 text-center font-medium">Olá, {guest.name}!</p>
          <p className="text-gray-600 mb-8 text-center">Gostaríamos de confirmar sua presença em nosso casamento.</p>
          <ConfirmationForm guest={guest} />
        </div>
      </div>
    </div>
  )
}
