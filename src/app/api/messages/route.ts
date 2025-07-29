import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { tableMessages } from '@/db/schema/messages'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    const messagesList = await db.select().from(tableMessages).orderBy(desc(tableMessages.createdAt))

    // Garantir que todas as datas sejam strings ISO
    const messagesWithFormattedDates = messagesList.map(message => ({
      ...message,
      createdAt: message.createdAt?.toISOString() || new Date().toISOString(),
    }))

    return NextResponse.json(messagesWithFormattedDates, { status: 200 })
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

    const [newMessage] = await db
      .insert(tableMessages)
      .values({
        name,
        content: message,
      })
      .returning()

    // Garantir que createdAt seja uma string ISO
    const messageWithFormattedDate = {
      ...newMessage,
      createdAt: newMessage.createdAt?.toISOString() || new Date().toISOString(),
    }

    return NextResponse.json(messageWithFormattedDate, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'Erro ao enviar mensagem' }, { status: 500 })
  }
}
