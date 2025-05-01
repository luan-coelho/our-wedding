import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(photos, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar fotos:', error)
    return NextResponse.json({ error: 'Erro ao buscar fotos' }, { status: 500 })
  }
}
