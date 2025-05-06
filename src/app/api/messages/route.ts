import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { messages } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    const messagesList = await db.query.messages.findMany({
      orderBy: [desc(messages.createdAt)],
    })

    return NextResponse.json(messagesList, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error)
    return NextResponse.json({ error: 'Erro ao buscar mensagens' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { name, message } = body

    // Validação básica
    if (!name || !message) {
      return NextResponse.json({ error: 'Nome e mensagem são obrigatórios' }, { status: 400 })
    }

    const newMessage = await db.insert(messages).values({
      name,
      content: message,
    })

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar mensagem:', error)
    return NextResponse.json({ error: 'Erro ao enviar mensagem' }, { status: 500 })
  }
}
