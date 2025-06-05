import { db } from '@/db'
import { tableGuests } from '@/db/schema'
import { eq, and, ne } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { validate as isValidUUID } from 'uuid'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id: string = (await params).id

    if (!isValidUUID(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const guest = await db.query.tableGuests.findFirst({
      where: eq(tableGuests.id, id),
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

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id: string = (await params).id

    if (!isValidUUID(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const existingGuest = await db.query.tableGuests.findFirst({
      where: eq(tableGuests.id, id),
    })

    if (!existingGuest) {
      return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 })
    }

    await db.delete(tableGuests).where(eq(tableGuests.id, id))

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Erro ao excluir convidado:', error)
    return NextResponse.json({ error: 'Erro ao excluir convidado' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id: string = (await params).id

    if (!isValidUUID(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const data = await request.json()

    const existingGuest = await db.query.tableGuests.findFirst({
      where: eq(tableGuests.id, id),
    })

    if (!existingGuest) {
      return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 })
    }

    // Se o nome está sendo atualizado, verificar se já existe outro convidado com o mesmo nome
    if (data.name && typeof data.name === 'string') {
      const nameToCheck = data.name.trim()

      if (nameToCheck.length === 0) {
        return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
      }

      const duplicateGuest = await db.query.tableGuests.findFirst({
        where: and(
          eq(tableGuests.name, nameToCheck),
          ne(tableGuests.id, id)
        ),
      })

      if (duplicateGuest) {
        return NextResponse.json({ error: 'Já existe um convidado com este nome' }, { status: 409 })
      }

      data.name = nameToCheck
    }

    await db.update(tableGuests).set(data).where(eq(tableGuests.id, id))

    const updatedGuest = await db.query.tableGuests.findFirst({
      where: eq(tableGuests.id, id),
    })

    return NextResponse.json(updatedGuest)
  } catch (error) {
    console.error('Erro ao atualizar convidado:', error)
    return NextResponse.json({ error: 'Erro ao atualizar convidado' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id: string = (await params).id

    if (!isValidUUID(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const data = await request.json()

    const existingGuest = await db.query.tableGuests.findFirst({
      where: eq(tableGuests.id, id),
    })

    if (!existingGuest) {
      return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 })
    }

    // Se o nome está sendo atualizado, verificar se já existe outro convidado com o mesmo nome
    if (data.name && typeof data.name === 'string') {
      const nameToCheck = data.name.trim()

      if (nameToCheck.length === 0) {
        return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
      }

      const duplicateGuest = await db.query.tableGuests.findFirst({
        where: and(
          eq(tableGuests.name, nameToCheck),
          ne(tableGuests.id, id)
        ),
      })

      if (duplicateGuest) {
        return NextResponse.json({ error: 'Já existe um convidado com este nome' }, { status: 409 })
      }

      data.name = nameToCheck
    }

    await db.update(tableGuests).set(data).where(eq(tableGuests.id, id))

    const updatedGuest = await db.query.tableGuests.findFirst({
      where: eq(tableGuests.id, id),
    })

    return NextResponse.json(updatedGuest)
  } catch (error) {
    console.error('Erro ao atualizar convidado:', error)
    return NextResponse.json({ error: 'Erro ao atualizar convidado' }, { status: 500 })
  }
}
