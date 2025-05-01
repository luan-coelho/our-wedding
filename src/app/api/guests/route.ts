import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const guests = await prisma.guest.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(guests, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar convidados:', error)
    return NextResponse.json({ error: 'Erro ao buscar convidados' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { nome, email, telefone, acompanhantes, presenca, mensagem } = body

    // Validação básica
    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }

    const guest = await prisma.guest.create({
      data: {
        name: nome,
        email: email || null,
        companions: acompanhantes || 0,
        isConfirmed: presenca === 'sim',
      },
    })

    return NextResponse.json(guest, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar convidado:', error)
    return NextResponse.json({ error: 'Erro ao registrar presença' }, { status: 500 })
  }
}
