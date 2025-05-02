import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ConfirmationForm from './confirmation-form'

export default async function ConfirmacaoTokenPage({params}: {params: Promise<{ token: string }>}) {
  const { token: slug } = await params
  const token = slug as string
  if (!token) {
    notFound()
  }

  const guest = await prisma.guest.findUnique({
    where: { token },
  })

  if (!guest) {
    notFound()
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Confirmação de Presença</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-xl mb-4 text-center">Olá, {guest.name}!</p>
        <p className="text-gray-600 mb-6 text-center">Gostaríamos de confirmar sua presença em nosso casamento.</p>
        <ConfirmationForm guest={guest} />
      </div>
    </div>
  )
}
