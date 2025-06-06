import { auth } from '@/auth'
import { db } from '@/db'
import { tablePixKeys } from '@/db/schema'
import { asc } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth-types'

// GET /api/pixkeys - Listar todas as chaves PIX
export async function GET() {
  const session = await auth()

  try {
    // Verificar autorização
    if (!session?.user || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const pixKeysList = await db.select().from(tablePixKeys).orderBy(asc(tablePixKeys.name))

    return NextResponse.json(pixKeysList)
  } catch (error) {
    console.error('Erro ao buscar chaves PIX:', error)
    return NextResponse.json({ error: 'Erro ao buscar chaves PIX' }, { status: 500 })
  }
}

// POST /api/pixkeys - Criar uma nova chave PIX
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    // Verificar autorização
    if (!session?.user || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const data = await request.json()

    // Criar nova chave PIX
    const pixKey = await db.insert(tablePixKeys).values({
      name: data.name,
      key: data.key,
      type: data.type,
    })

    return NextResponse.json(pixKey)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar chave PIX' }, { status: 500 })
  }
}


