import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { tableGuests } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params

    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: 'Código deve ter 6 dígitos numéricos' }, { status: 400 })
    }

    // Busque o convidado pelo código de confirmação
    const guest = await db.query.tableGuests.findFirst({
      where: eq(tableGuests.confirmationCode, code),
    })

    if (!guest) {
      return NextResponse.json({ error: 'Código de confirmação não encontrado' }, { status: 404 })
    }

    return NextResponse.json(guest, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar convidado por código:', error)
    return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params
    const { isConfirmed, spouseConfirmation, childrenConfirmations, companionsConfirmations } = await request.json()

    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: 'Código deve ter 6 dígitos numéricos' }, { status: 400 })
    }

    // Verifique se o convidado existe com o código fornecido
    const guest = await db.query.tableGuests.findFirst({
      where: eq(tableGuests.confirmationCode, code),
    })

    if (!guest) {
      return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 })
    }

    // Prepare os dados para atualização
    const updateData: any = {
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
    await db.update(tableGuests).set(updateData).where(eq(tableGuests.confirmationCode, code))

    // Busque o convidado atualizado para retornar
    const updatedGuest = await db.query.tableGuests.findFirst({
      where: eq(tableGuests.confirmationCode, code),
    })

    return NextResponse.json(updatedGuest, { status: 200 })
  } catch (error) {
    console.error('Erro ao atualizar confirmação:', error)
    return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 })
  }
}
