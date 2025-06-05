import { auth } from '@/auth'
import { db } from '@/db'
import { tableUsers } from '@/db/schema'
import { isAdmin } from '@/lib/auth-types'
import { asc, eq, not } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Schema para remoção de acesso
export async function GET() {
  const session = await auth()

  // Busca todos os usuários
  const allUsers = await db
    .select()
    .from(tableUsers)
    .where(not(eq(tableUsers.id, session?.user.id!)))
    .orderBy(asc(tableUsers.name))

  return NextResponse.json(allUsers)
}

// POST para conceder/atualizar permissão
export async function POST(request: NextRequest) {
  const session = await auth()

  // Verifica se o usuário está autenticado e é um administrador
  if (!session || !isAdmin(session)) {
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
    const existingUser = await db.select().from(tableUsers).where(eq(tableUsers.email, email))

    if (existingUser.length > 0) {
      // Atualiza a role do usuário existente e ativa a conta se estiver inativa
      const [updatedUser] = await db
        .update(tableUsers)
        .set({
          name,
          role,
          active: true,
          updatedAt: new Date(),
        })
        .where(eq(tableUsers.email, email))
        .returning()

      return NextResponse.json({ ...updatedUser, message: 'Permissão atualizada' }, { status: 200 })
    }

    // Insere o novo usuário com permissão pré-definida
    const [newUser] = await db
      .insert(tableUsers)
      .values({
        name,
        email,
        role,
        active: true,
        updatedAt: new Date(),
      })
      .returning({
        id: tableUsers.id,
        email: tableUsers.email,
        role: tableUsers.role,
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

// DELETE para remover acesso de um usuário
export async function DELETE(request: NextRequest) {
  const session = await auth()

  // Verifica se o usuário está autenticado e é um administrador
  if (!session || !isAdmin(session)) {
    return new NextResponse(JSON.stringify({ error: 'Não autorizado' }), {
      status: 403,
    })
  }

  try {
    // Obtém o email da URL
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return new NextResponse(JSON.stringify({ error: 'Email é obrigatório' }), {
        status: 400,
      })
    }

    const removeAccessSchema = z.object({
      email: z.string().email('Email inválido'),
    })

    // Valida o email
    removeAccessSchema.parse({ email })

    // Verifica se o usuário existe
    const existingUser = await db.select().from(tableUsers).where(eq(tableUsers.email, email))

    if (existingUser.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Usuário não encontrado' }), {
        status: 404,
      })
    }

    // Não permitir remover o próprio acesso
    if (email === session.user.email) {
      return new NextResponse(JSON.stringify({ error: 'Não é possível remover seu próprio acesso' }), {
        status: 400,
      })
    }

    // Desativa o usuário em vez de remover
    await db
      .update(tableUsers)
      .set({
        active: false,
        updatedAt: new Date(),
      })
      .where(eq(tableUsers.email, email))

    return NextResponse.json({ message: 'Acesso removido com sucesso' })
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
