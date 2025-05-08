import { db } from '@/db'
import { tableGifts, tablePixKeys } from '@/db/schema'
import { asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const giftsList = await db
      .select()
      .from(tableGifts)
      .orderBy(asc(tableGifts.name))
      .leftJoin(tablePixKeys, eq(tableGifts.pixKeyId, tablePixKeys.id))

    return NextResponse.json(giftsList, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar presentes:', error)
    return NextResponse.json({ error: 'Erro ao buscar presentes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const newGift = await db.insert(tableGifts).values({
      name: body.name,
      description: body.description,
      price: body.price,
      pixKey: body.pixKey,
      pixKeyId: body.pixKeyId,
      imageUrl: body.imageUrl,
    })

    return NextResponse.json(newGift, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar presente:', error)
    return NextResponse.json({ error: 'Erro ao criar presente' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const id: string = (await params).id

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })
    }

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
  try {
    const id: string = (await params).id

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })
    }

    await db.delete(tableGifts).where(eq(tableGifts.id, id))

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir presente' }, { status: 500 })
  }
}
