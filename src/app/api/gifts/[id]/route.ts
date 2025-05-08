import { NextResponse } from 'next/server'
import { db } from '@/db'
import { tableGifts } from '@/db/schema'
import { auth } from '@/auth'
import { eq } from 'drizzle-orm'
import { isAdmin } from '@/lib/auth-types'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  try {
    // Verificar autorização
    if (!session?.user || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const body = await request.json()

    const updatedGift = await db
      .update(tableGifts)
      .set({
        name: body.name,
        description: body.description,
        price: body.price,
        pixKey: body.pixKey,
        pixKeyId: body.pixKeyId,
        imageUrl: body.imageUrl,
      })
      .where(eq(tableGifts.id, id))

    return NextResponse.json(updatedGift, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar presente' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  try {
    // Verificar autorização
    if (!session?.user || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    await db.delete(tableGifts).where(eq(tableGifts.id, id))

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir presente' }, { status: 500 })
  }
}
