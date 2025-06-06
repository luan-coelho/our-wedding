import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { tableGuests } from '@/db/schema'
import { asc, eq } from 'drizzle-orm'

export async function GET() {
  try {
    const guestsList = await db.query.tableGuests.findMany({
      orderBy: [asc(tableGuests.name)],
    })

    return NextResponse.json(guestsList)
  } catch (error) {
    console.error('Erro ao listar convidados:', error)
    return NextResponse.json({ error: 'Erro ao listar convidados' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, spouse, children, companions } = await request.json()

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }

    // Verificar se já existe um convidado com o mesmo nome
    const existingGuest = await db.query.tableGuests.findFirst({
      where: eq(tableGuests.name, name.trim()),
    })

    if (existingGuest) {
      return NextResponse.json({ error: 'Já existe um convidado com este nome' }, { status: 409 })
    }

    // Prepare data for insertion
    const guestData = {
      name: name.trim(),
      spouse: spouse && spouse.trim() ? spouse.trim() : null,
      children: Array.isArray(children) ? children.filter(child => child && child.trim()) : [], // filhos
      companions: Array.isArray(companions) ? companions.filter(companion => companion && companion.trim()) : [],
    }

    const [newGuest] = await db.insert(tableGuests).values(guestData).returning()

    return NextResponse.json(newGuest, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar convidado:', error)
    return NextResponse.json({ error: 'Erro ao criar convidado' }, { status: 500 })
  }
}
