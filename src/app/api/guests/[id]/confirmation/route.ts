import { db } from '@/db'
import { tableGuests } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { validate as isValidUUID } from 'uuid'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id: string = (await params).id

    if (!isValidUUID(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const confirmationData = await request.json()

    const existingGuest = await db
      .select()
      .from(tableGuests)
      .where(eq(tableGuests.id, id))
      .limit(1)
      .then(results => results[0] || null)

    if (!existingGuest) {
      return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 })
    }

    // Update confirmation data
    await db
      .update(tableGuests)
      .set({
        ...confirmationData,
        updatedAt: new Date(),
      })
      .where(eq(tableGuests.id, id))

    const updatedGuest = await db
      .select()
      .from(tableGuests)
      .where(eq(tableGuests.id, id))
      .limit(1)
      .then(results => results[0] || null)

    return NextResponse.json(updatedGuest)
  } catch (error) {
    console.error('Erro ao atualizar confirmação:', error)
    return NextResponse.json({ error: 'Erro ao atualizar confirmação' }, { status: 500 })
  }
}
