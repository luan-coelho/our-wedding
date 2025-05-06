import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { guests } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params
    const { isConfirmed } = await request.json()

    // Verifique se o convidado existe com o token fornecido
    const guest = await db.query.guests.findFirst({
      where: eq(guests.token, token),
    })

    if (!guest) {
      return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 })
    }

    // Atualize o status de confirmação
    const updatedGuest = await db.update(guests).set({
      isConfirmed,
      updatedAt: new Date(),
    }).where(eq(guests.token, token))

    return NextResponse.json(updatedGuest, { status: 200 })
  } catch (error) {
    console.error('Erro ao atualizar confirmação:', error)
    return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 })
  }
}
