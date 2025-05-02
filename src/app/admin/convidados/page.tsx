import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { CopyToClipboard } from '@/components/CopyToClipboard'

// Impede a pré-renderização desta página durante o build
export const dynamic = 'force-dynamic'

export default async function AdminGuestsPage() {
  const guests = await prisma.guest.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Convidados</h1>

      <div className="mb-8">
        <Link
          href="/admin/convidados/novo"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Adicionar Convidado
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left border">Nome</th>
              <th className="py-3 px-4 text-center border">Confirmado</th>
              <th className="py-3 px-4 text-left border">Link de Convite</th>
              <th className="py-3 px-4 text-center border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {guests.map(guest => (
              <tr key={guest.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border">{guest.name}</td>
                <td className="py-3 px-4 text-center border">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${guest.isConfirmed ? 'bg-green-500' : 'bg-red-500'}`}
                  />
                </td>
                <td className="py-3 px-4 border">
                  <div className="flex items-center">
                    <input
                      type="text"
                      readOnly
                      value={`${baseUrl}/confirmacao/${guest.token}`}
                      className="flex-1 p-1 border rounded text-sm bg-gray-50"
                    />
                    <CopyToClipboard text={`${baseUrl}/confirmacao/${guest.token}`} />
                  </div>
                </td>
                <td className="py-3 px-4 text-center border">
                  <Link
                    href={`/admin/convidados/${guest.id}/editar`}
                    className="text-blue-600 hover:text-blue-800 mr-3">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {guests.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500 border">
                  Nenhum convidado cadastrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
