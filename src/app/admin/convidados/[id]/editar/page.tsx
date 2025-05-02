import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import GuestForm from '../../guest-form'

// Impede a pré-renderização desta página durante o build
export const dynamic = 'force-dynamic'

export default async function EditGuestPage({params}: {params: Promise<{ id: string }>}) {
  const { id: slug } = await params
  const id = parseInt(slug)

  if (isNaN(id)) {
    notFound()
  }

  const guest = await prisma.guest.findUnique({
    where: { id },
  })

  if (!guest) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Editar Convidado</h1>
      <GuestForm guest={guest} />
    </div>
  )
}
