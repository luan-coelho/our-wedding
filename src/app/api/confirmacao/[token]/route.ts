import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params
    const { isConfirmed } = await request.json()

    // Verifique se o convidado existe com o token fornecido
    const guest = await prisma.guest.findUnique({
      where: { token },
    })

    if (!guest) {
      return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 })
    }

    // Atualize o status de confirmação
    const updatedGuest = await prisma.guest.update({
      where: { token },
      data: {
        isConfirmed,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedGuest, { status: 200 })
  } catch (error) {
    console.error('Erro ao atualizar confirmação:', error)
    return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 })
  }
}
