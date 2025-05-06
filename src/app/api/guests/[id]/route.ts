import { db } from '@/db'
import { guests } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// Garante que as rotas da API sejam processadas dinamicamente
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params

  try {
    const id = parseInt(slug, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const guest = await db.query.guests.findFirst({
      where: eq(guests.id, id),
    })

    if (!guest) {
      return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 })
    }

    return NextResponse.json(guest)
  } catch (error) {
    console.error('Erro ao buscar convidado:', error)
    return NextResponse.json({ error: 'Erro ao buscar convidado' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params

  try {
    const id = parseInt(slug, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const { name } = await request.json()

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'O nome é obrigatório' }, { status: 400 })
    }

    // Verificar se o convidado existe
    const existingGuest = await db.query.guests.findFirst({
      where: eq(guests.id, id),
    })

    if (!existingGuest) {
      return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 })
    }

    // Atualizar o convidado
    const updatedGuest = await db.update(guests).set({
      name,
      updatedAt: new Date(),
    }).where(eq(guests.id, id))

    return NextResponse.json(updatedGuest)
  } catch (error) {
    console.error('Erro ao atualizar convidado:', error)
    return NextResponse.json({ error: 'Erro ao atualizar convidado' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params

  try {
    const id = parseInt(slug, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    // Verificar se o convidado existe
    const existingGuest = await db.query.guests.findFirst({
      where: eq(guests.id, id),
    })

    if (!existingGuest) {
      return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 })
    }

    // Excluir o convidado
    await db.delete(guests).where(eq(guests.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir convidado:', error)
    return NextResponse.json({ error: 'Erro ao excluir convidado' }, { status: 500 })
  }
}
