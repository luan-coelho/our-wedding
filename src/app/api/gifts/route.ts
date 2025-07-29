import { db } from '@/db'
import { tableGifts } from '@/db/schema'
import { asc } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { validate as isValidUUID } from 'uuid'

export async function GET() {
  try {
    const giftsList = await db.select().from(tableGifts).orderBy(asc(tableGifts.createdAt)).execute()

    return NextResponse.json(giftsList, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar presentes:', error)
    return NextResponse.json({ error: 'Erro ao buscar presentes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
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

    console.log('Dados sanitizados para criação:', {
      pixKeyId: sanitizedData.pixKeyId,
      pixKey: sanitizedData.pixKey,
    })

    const newGift = await db.insert(tableGifts).values(sanitizedData)

    return NextResponse.json(newGift, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar presente:', error)
    return NextResponse.json({ error: 'Erro ao criar presente' }, { status: 500 })
  }
}
