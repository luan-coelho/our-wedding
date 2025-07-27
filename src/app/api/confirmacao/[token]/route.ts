import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { tableGuests } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params
    const { isConfirmed, spouseConfirmation, childrenConfirmations, companionsConfirmations } = await request.json()

    // Verifique se o convidado existe com o token fornecido
    const guest = await db.query.tableGuests.findFirst({
      where: eq(tableGuests.token, token),
    })

    if (!guest) {
      return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 })
    }

    // Prepare os dados para atualização
    const updateData: {
      isConfirmed: boolean
      updatedAt: Date
      spouseConfirmation?: boolean
      childrenConfirmations?: Record<string, boolean>
      companionsConfirmations?: Record<string, boolean>
    } = {
      isConfirmed: Boolean(isConfirmed),
      updatedAt: new Date(),
    }

    // Adicione confirmação do cônjuge se existir
    if (guest.spouse && spouseConfirmation !== undefined) {
      updateData.spouseConfirmation = Boolean(spouseConfirmation)
    }

    // Adicione confirmações dos filhos se existirem
    if (guest.children && guest.children.length > 0 && childrenConfirmations) {
      // Valide que todas as confirmações dos filhos estão presentes
      const validChildrenConfirmations: Record<string, boolean> = {}
      guest.children.forEach(child => {
        if (childrenConfirmations[child] !== undefined) {
          validChildrenConfirmations[child] = Boolean(childrenConfirmations[child])
        }
      })
      updateData.childrenConfirmations = validChildrenConfirmations
    }

    // Adicione confirmações dos acompanhantes se existirem
    if (guest.companions && guest.companions.length > 0 && companionsConfirmations) {
      // Valide que todas as confirmações dos acompanhantes estão presentes
      const validCompanionsConfirmations: Record<string, boolean> = {}
      guest.companions.forEach(companion => {
        if (companionsConfirmations[companion] !== undefined) {
          validCompanionsConfirmations[companion] = Boolean(companionsConfirmations[companion])
        }
      })
      updateData.companionsConfirmations = validCompanionsConfirmations
    }

    // Atualize o registro no banco de dados
    await db.update(tableGuests).set(updateData).where(eq(tableGuests.token, token))

    // Busque o convidado atualizado para retornar
    const updatedGuest = await db.query.tableGuests.findFirst({
      where: eq(tableGuests.token, token),
    })

    return NextResponse.json(updatedGuest, { status: 200 })
  } catch (error) {
    console.error('Erro ao atualizar confirmação:', error)
    return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params

    // Busque o convidado pelo token
    const guest = await db.query.tableGuests.findFirst({
      where: eq(tableGuests.token, token),
    })

    if (!guest) {
      return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 })
    }

    return NextResponse.json(guest, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar convidado:', error)
    return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 })
  }
}
