import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Garante que as rotas da API sejam processadas dinamicamente
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const guests = await prisma.guest.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(guests)
  } catch (error) {
    console.error('Erro ao listar convidados:', error)
    return NextResponse.json({ error: 'Erro ao listar convidados' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'O nome é obrigatório' }, { status: 400 })
    }

    const newGuest = await prisma.guest.create({
      data: {
        name,
      },
    })

    return NextResponse.json(newGuest, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar convidado:', error)
    return NextResponse.json({ error: 'Erro ao criar convidado' }, { status: 500 })
  }
}
