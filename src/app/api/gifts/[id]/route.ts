import { auth } from '@/auth'
import { db } from '@/db'
import { tableGifts } from '@/db/schema'
import { isAdmin } from '@/lib/auth-types'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { validate as isValidUUID } from 'uuid'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!isValidUUID(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    const gift = await db.query.tableGifts.findFirst({
      where: eq(tableGifts.id, id),
      with: {
        selectedPixKey: true,
      },
    })

    if (!gift) {
      return NextResponse.json({ error: 'Presente não encontrado' }, { status: 404 })
    }

    return NextResponse.json(gift, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar presente:', error)
    return NextResponse.json({ error: 'Erro ao buscar presente' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!isValidUUID(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const session = await auth()

  try {
    // Verificar autorização
    if (!session?.user || !isAdmin(session)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const body = await request.json()

    // Sanitizar dados - converter strings vazias para null em campos UUID opcionais
    const sanitizedData = {
      name: body.name,
      description: body.description,
      price: body.price,
      pixKey: body.pixKey || null,
      pixKeyId: body.pixKeyId && body.pixKeyId.trim() !== '' ? body.pixKeyId : null,
      imageUrl: body.imageUrl,
    }

    // Validar pixKeyId se fornecido
    if (sanitizedData.pixKeyId && !isValidUUID(sanitizedData.pixKeyId)) {
      return NextResponse.json({ error: 'pixKeyId inválido' }, { status: 400 })
    }

    console.log('Dados sanitizados para atualização:', {
      id,
      pixKeyId: sanitizedData.pixKeyId,
      pixKey: sanitizedData.pixKey,
    })

    const updatedGift = await db
      .update(tableGifts)
      .set(sanitizedData)
      .where(eq(tableGifts.id, id))

    return NextResponse.json(updatedGift, { status: 200 })
  } catch (error) {
    console.error('Erro ao atualizar presente:', error)
    return NextResponse.json({ error: 'Erro ao atualizar presente' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!isValidUUID(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const session = await auth()

  try {
    // Verificar autorização
    if (!session?.user || !isAdmin(session)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    await db.delete(tableGifts).where(eq(tableGifts.id, id))

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Erro ao excluir presente:', error)
    return NextResponse.json({ error: 'Erro ao excluir presente' }, { status: 500 })
  }
}
