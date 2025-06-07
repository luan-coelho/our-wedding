import { db } from '@/db'
import { usersTable } from '@/db/schema'
import { isAdmin } from '@/lib/auth-types'
import { asc, eq, not } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Busca todos os usuários
  const allUsers = await db
    .select()
    .from(usersTable)
    .where(not(eq(usersTable.id, session?.user.id!)))
    .orderBy(asc(usersTable.name))

  return NextResponse.json(allUsers)
}

// POST para conceder/atualizar permissão
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Verifica se o usuário está autenticado e é um administrador
  if (!session || !(await isAdmin())) {
    return new NextResponse(JSON.stringify({ error: 'Não autorizado' }), {
      status: 403,
    })
  }

  try {
    // Recebe os dados do corpo da requisição
    const body = await request.json()

    const permissionSchema = z.object({
      name: z.string().min(1, 'Nome é obrigatório'),
      email: z.string().email('Email inválido'),
      role: z.enum(['admin', 'planner', 'guest']),
    })

    // Valida os dados com o schema
    const { email, role, name } = permissionSchema.parse(body)

    // Verifica se já existe um usuário com este email
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email))

    if (existingUser.length > 0) {
      // Atualiza a role do usuário existente e ativa a conta se estiver inativa
      const [updatedUser] = await db
        .update(usersTable)
        .set({
          name,
          role,
          active: true,
          updatedAt: new Date(),
        })
        .where(eq(usersTable.email, email))
        .returning()

      return NextResponse.json({ ...updatedUser, message: 'Permissão atualizada' }, { status: 200 })
    }

    // Insere o novo usuário com permissão pré-definida
    const [newUser] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        role,
        active: true,
      })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        role: usersTable.role,
      })

    return NextResponse.json({ ...newUser, message: 'Permissão concedida' }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ error: error.errors }), {
        status: 400,
      })
    }

    return new NextResponse(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
    })
  }
}
