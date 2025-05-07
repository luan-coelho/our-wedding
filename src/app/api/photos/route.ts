import { NextResponse } from 'next/server'
import { db } from '@/db'
import { tablePhotos } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    const photosList = await db.query.tablePhotos.findMany({
      orderBy: [desc(tablePhotos.createdAt)],
    })

    return NextResponse.json(photosList, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar fotos' }, { status: 500 })
  }
}
