import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const gift = await prisma.gift.findUnique({
      where: {
        id: parseInt(params.id)
      }
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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  
  try {
    // Verificar autorização
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const body = await request.json()
    
    const updatedGift = await prisma.gift.update({
      where: {
        id: parseInt(params.id)
      },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        pixKey: body.pixKey,
        imageUrl: body.imageUrl
      }
    })
    
    return NextResponse.json(updatedGift, { status: 200 })
  } catch (error) {
    console.error('Erro ao atualizar presente:', error)
    return NextResponse.json({ error: 'Erro ao atualizar presente' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  
  try {
    // Verificar autorização
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }
    
    await prisma.gift.delete({
      where: {
        id: parseInt(params.id)
      }
    })
    
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Erro ao excluir presente:', error)
    return NextResponse.json({ error: 'Erro ao excluir presente' }, { status: 500 })
  }
} 