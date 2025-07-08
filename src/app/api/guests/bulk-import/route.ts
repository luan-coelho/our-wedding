import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { tableGuests } from '@/db/schema'
import { sql } from 'drizzle-orm'
import { generateUniqueConfirmationCode } from '@/lib/confirmation-code'

export async function POST(request: NextRequest) {
  try {
    const { names } = await request.json()

    if (!Array.isArray(names) || names.length === 0) {
      return NextResponse.json({ error: 'Lista de nomes é obrigatória' }, { status: 400 })
    }

    // Validate and clean names
    const cleanedNames: string[] = []
    const errors: { name: string; error: string }[] = []

    for (const name of names) {
      if (!name || typeof name !== 'string') {
        errors.push({ name: String(name), error: 'Nome inválido' })
        continue
      }

      const trimmedName = name.trim()

      if (trimmedName.length === 0) {
        continue // Skip empty names
      }

      if (trimmedName.length < 2) {
        errors.push({ name: trimmedName, error: 'Nome deve ter pelo menos 2 caracteres' })
        continue
      }

      if (trimmedName.length > 100) {
        errors.push({ name: trimmedName, error: 'Nome deve ter no máximo 100 caracteres' })
        continue
      }

      cleanedNames.push(trimmedName)
    }

    if (cleanedNames.length === 0) {
      return NextResponse.json(
        {
          imported: [],
          duplicates: [],
          errors,
        },
        { status: 200 },
      )
    }

    // Check for duplicates against existing guests (case-insensitive)
    const existingGuests = await db.query.tableGuests.findMany({
      columns: { name: true },
      where: sql`LOWER(${tableGuests.name}) IN (${sql.join(
        cleanedNames.map(name => sql`LOWER(${name})`),
        sql`, `,
      )})`,
    })

    const existingNamesLower = existingGuests.map(guest => guest.name.toLowerCase())
    const duplicates: string[] = []
    const namesToImport: string[] = []

    for (const name of cleanedNames) {
      if (existingNamesLower.includes(name.toLowerCase())) {
        duplicates.push(name)
      } else {
        namesToImport.push(name)
      }
    }

    // Import new guests
    const imported = []
    if (namesToImport.length > 0) {
      const guestData = await Promise.all(
        namesToImport.map(async name => ({
          name,
          spouse: null,
          children: [],
          companions: [],
          confirmationCode: await generateUniqueConfirmationCode(),
        })),
      )

      const newGuests = await db.insert(tableGuests).values(guestData).returning()
      imported.push(...newGuests)
    }

    return NextResponse.json(
      {
        imported,
        duplicates,
        errors,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Erro ao importar convidados:', error)
    return NextResponse.json({ error: 'Erro ao importar convidados' }, { status: 500 })
  }
}
