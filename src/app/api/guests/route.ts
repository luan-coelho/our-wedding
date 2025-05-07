import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { tableUsers } from '@/db/schema'
import { asc } from 'drizzle-orm'

// Garante que as rotas da API sejam processadas dinamicamente
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const guestsList = await db.query.tableUsers.findMany({
      orderBy: [asc(tableUsers.name)],
    })

    return NextResponse.json(guestsList)
  } catch (error) {
    console.error('Erro ao listar convidados:', error)
    return NextResponse.json({ error: 'Erro ao listar convidados' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    const newGuest = await db.insert(tableUsers).values({
      name,
    })

    return NextResponse.json(newGuest, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar convidado' }, { status: 500 })
  }
}
