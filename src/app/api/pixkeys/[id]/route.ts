import { auth } from '@/auth'
import { db } from '@/db'
import { tableGifts, tablePixKeys } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth-types'
import { validate as isValidUUID } from 'uuid'

// GET /api/pixkeys/[id] - Buscar uma chave PIX específica
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!isValidUUID(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const session = await auth()

    // Verificar autorização
    if (!session?.user || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const pixKey = await db
      .select()
      .from(tablePixKeys)
      .where(eq(tablePixKeys.id, id))
      .limit(1)
      .then(results => results[0] || null)

    if (!pixKey) {
      return NextResponse.json({ error: 'Chave PIX não encontrada' }, { status: 404 })
    }

    return NextResponse.json(pixKey)
  } catch (error) {
    console.error('Erro ao buscar chave PIX:', error)
    return NextResponse.json({ error: 'Erro ao buscar chave PIX' }, { status: 500 })
  }
}

// PUT /api/pixkeys/[id] - Atualizar uma chave PIX existente
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!isValidUUID(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const session = await auth()

    // Verificar autorização
    if (!session?.user || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const data = await request.json()

    // Verificar se a chave PIX existe
    const existingKey = await db
      .select()
      .from(tablePixKeys)
      .where(eq(tablePixKeys.id, id))
      .limit(1)
      .then(results => results[0] || null)

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
      .where(eq(tablePixKeys.id, id))

    return NextResponse.json(updatedPixKey)
  } catch (error) {
    console.error('Erro ao atualizar chave PIX:', error)
    return NextResponse.json({ error: 'Erro ao atualizar chave PIX' }, { status: 500 })
  }
}

// DELETE /api/pixkeys/[id] - Remover uma chave PIX
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!isValidUUID(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const session = await auth()

    // Verificar autorização
    if (!session?.user || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    // Verificar se a chave está sendo usada nalgum presente
    const giftsUsingPixKey = await db.select().from(tableGifts).where(eq(tableGifts.pixKeyId, id))

    if (giftsUsingPixKey.length > 0) {
      return NextResponse.json(
        {
          error: 'Esta chave PIX está sendo usada em presentes e não pode ser excluída',
          giftsCount: giftsUsingPixKey.length,
        },
        { status: 400 },
      )
    }

    // Verificar se a chave PIX existe
    const existingKey = await db
      .select()
      .from(tablePixKeys)
      .where(eq(tablePixKeys.id, id))
      .limit(1)
      .then(results => results[0] || null)

    if (!existingKey) {
      return NextResponse.json({ error: 'Chave PIX não encontrada' }, { status: 404 })
    }

    // Remover chave PIX
    await db.delete(tablePixKeys).where(eq(tablePixKeys.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir chave PIX:', error)
    return NextResponse.json({ error: 'Erro ao excluir chave PIX' }, { status: 500 })
  }
}
