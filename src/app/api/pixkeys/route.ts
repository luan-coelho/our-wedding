import { auth } from '@/auth'
import { db } from '@/db'
import { tableGifts, tablePixKeys } from '@/db/schema'
import { asc, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/pixkeys - Listar todas as chaves PIX
export async function GET() {
  const session = await auth()

  try {
    // Verificar autorização
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const pixKeysList = await db.query.tablePixKeys.findMany({
      orderBy: [asc(tablePixKeys.name)],
    })

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
    if (!session?.user || session.user.role !== 'admin') {
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

// PUT /api/pixkeys - Atualizar uma chave PIX existente
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    // Verificar autorização
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'ID da chave PIX não fornecido' }, { status: 400 })
    }

    // Verificar se a chave PIX existe
    const existingKey = await db.query.tablePixKeys.findFirst({
      where: eq(tablePixKeys.id, data.id),
    })

    if (!existingKey) {
      return NextResponse.json({ error: 'Chave PIX não encontrada' }, { status: 404 })
    }

    // Atualizar chave PIX
    const updatedPixKey = await db
      .update(tablePixKeys)
      .set({
        name: data.name,
        key: data.key,
        type: data.type,
      })
      .where(eq(tablePixKeys.id, data.id))

    return NextResponse.json(updatedPixKey)
  } catch (error) {
    console.error('Erro ao atualizar chave PIX:', error)
    return NextResponse.json({ error: 'Erro ao atualizar chave PIX' }, { status: 500 })
  }
}

// DELETE /api/pixkeys - Remover uma chave PIX
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const session = await auth()

    // Verificar autorização
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    if (!id) {
      return NextResponse.json({ error: 'ID da chave PIX não fornecido' }, { status: 400 })
    }

    // Verificar se a chave está sendo usada em algum presente
    const giftsUsingPixKey = await db.query.tableGifts.findMany({
      where: eq(tableGifts.pixKeyId, parseInt(id)),
    })

    if (giftsUsingPixKey.length > 0) {
      return NextResponse.json(
        {
          error: 'Esta chave PIX está sendo usada em presentes e não pode ser excluída',
          giftsCount: giftsUsingPixKey.length,
        },
        { status: 400 },
      )
    }

    // Remover chave PIX
    await db.delete(tablePixKeys).where(eq(tablePixKeys.id, parseInt(id)))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir chave PIX' }, { status: 500 })
  }
}
