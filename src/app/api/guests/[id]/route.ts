import { db } from '@/db'
import { tableGuests } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    
    const guest = await db.query.tableGuests.findFirst({
      where: eq(tableGuests.id, id)
    })
    
    if (!guest) {
      return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 })
    }
    
    return NextResponse.json(guest)
  } catch (error) {
    console.error('Erro ao buscar convidado:', error)
    return NextResponse.json({ error: 'Erro ao buscar convidado' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id);
    console.log('id', id)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    
    // Verify if guest exists before deletion
    const existingGuest = await db.query.tableGuests.findFirst({
      where: eq(tableGuests.id, id)
    })
    
    if (!existingGuest) {
      return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 })
    }
    
    // Delete the guest
    await db.delete(tableGuests)
      .where(eq(tableGuests.id, id))
    
    return NextResponse.json({ success: true, message: 'Convidado excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir convidado:', error)
    return NextResponse.json({ error: 'Erro ao excluir convidado' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    
    const data = await request.json()
    
    // Verify if guest exists before updating
    const existingGuest = await db.query.tableGuests.findFirst({
      where: eq(tableGuests.id, id)
    })
    
    if (!existingGuest) {
      return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 })
    }
    
    // Update the guest
    await db.update(tableGuests)
      .set(data)
      .where(eq(tableGuests.id, id))
    
    const updatedGuest = await db.query.tableGuests.findFirst({
      where: eq(tableGuests.id, id)
    })
    
    return NextResponse.json(updatedGuest)
  } catch (error) {
    console.error('Erro ao atualizar convidado:', error)
    return NextResponse.json({ error: 'Erro ao atualizar convidado' }, { status: 500 })
  }
}
