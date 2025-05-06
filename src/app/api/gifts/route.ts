import { NextResponse } from 'next/server'
import { db } from '@/db'
import { gifts } from '@/db/schema'
import { asc, eq } from 'drizzle-orm'
import { auth } from '@/auth'

export async function GET() {
  try {
    const giftsList = await db.query.gifts.findMany({
      orderBy: asc(gifts.name),
      with: {
        selectedPixKey: true,
      },
    })

    return NextResponse.json(giftsList, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar presentes:', error)
    return NextResponse.json({ error: 'Erro ao buscar presentes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()

  try {
    // Verificar autorização
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const body = await request.json()

    const newGift = await db.insert(gifts).values({
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

export async function PUT(request: Request) {
  const session = await auth()

  try {
    // Verificar autorização
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const body = await request.json()

    const updatedGift = await db.update(gifts).set({
      name: body.name,
      description: body.description,
      price: body.price,
      pixKey: body.pixKey,
      pixKeyId: body.pixKeyId,
      imageUrl: body.imageUrl,
    }).where(eq(gifts.id, body.id))

    return NextResponse.json(updatedGift, { status: 200 })
  } catch (error) {
    console.error('Erro ao atualizar presente:', error)
    return NextResponse.json({ error: 'Erro ao atualizar presente' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await auth()

  try {
    // Verificar autorização
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })
    }

    await db.delete(gifts).where(eq(gifts.id, parseInt(id)))

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Erro ao excluir presente:', error)
    return NextResponse.json({ error: 'Erro ao excluir presente' }, { status: 500 })
  }
}
