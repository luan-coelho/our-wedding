import { auth } from '@/lib/auth'
import { db } from '@/db'
import { usersTable } from '@/db/schema'
import { isAdmin } from '@/lib/auth-types'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { headers } from 'next/headers'

// Schema para validação do ID
const idSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
})

// Schema para atualização completa do usuário (PUT)
const updateUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  role: z.enum(['admin', 'planner', 'guest']),
  active: z.boolean().optional().default(true),
})

// Schema para atualização parcial do usuário (PATCH)
const partialUpdateUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').optional(),
  email: z.string().email('Email inválido').optional(),
  role: z.enum(['admin', 'planner', 'guest']).optional(),
  active: z.boolean().optional(),
})

// GET - Buscar um usuário específico por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const { id } = await params

    // Valida o ID
    const validatedId = idSchema.parse({ id })

    // Busca o usuário no banco de dados
    const user = await db.select().from(usersTable).where(eq(usersTable.id, validatedId.id)).limit(1)

    if (user.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Usuário não encontrado' }), {
        status: 404,
      })
    }

    return NextResponse.json(user[0])
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

// PUT - Atualização completa do usuário
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const { id } = await params
    const body = await request.json()

    // Valida o ID e os dados do corpo da requisição
    const validatedId = idSchema.parse({ id })
    const validatedData = updateUserSchema.parse(body)

    // Verifica se o usuário existe
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.id, validatedId.id)).limit(1)

    if (existingUser.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Usuário não encontrado' }), {
        status: 404,
      })
    }

    // Verifica se já existe outro usuário com o mesmo email
    if (validatedData.email !== existingUser[0].email) {
      const emailExists = await db.select().from(usersTable).where(eq(usersTable.email, validatedData.email)).limit(1)

      if (emailExists.length > 0) {
        return new NextResponse(JSON.stringify({ error: 'Email já está em uso' }), {
          status: 409,
        })
      }
    }

    // Atualiza o usuário
    const [updatedUser] = await db
      .update(usersTable)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, validatedId.id))
      .returning()

    return NextResponse.json({ ...updatedUser, message: 'Usuário atualizado com sucesso' })
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

// PATCH - Atualização parcial do usuário
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const { id } = await params
    const body = await request.json()

    // Valida o ID e os dados do corpo da requisição
    const validatedId = idSchema.parse({ id })
    const validatedData = partialUpdateUserSchema.parse(body)

    // Verifica se há dados para atualizar
    if (Object.keys(validatedData).length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Nenhum dado fornecido para atualização' }), {
        status: 400,
      })
    }

    // Verifica se o usuário existe
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.id, validatedId.id)).limit(1)

    if (existingUser.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Usuário não encontrado' }), {
        status: 404,
      })
    }

    // Verifica se já existe outro usuário com o mesmo email (se email está sendo atualizado)
    if (validatedData.email && validatedData.email !== existingUser[0].email) {
      const emailExists = await db.select().from(usersTable).where(eq(usersTable.email, validatedData.email)).limit(1)

      if (emailExists.length > 0) {
        return new NextResponse(JSON.stringify({ error: 'Email já está em uso' }), {
          status: 409,
        })
      }
    }

    // Atualiza o usuário
    const [updatedUser] = await db
      .update(usersTable)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, validatedId.id))
      .returning()

    return NextResponse.json({ ...updatedUser, message: 'Usuário atualizado com sucesso' })
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

// DELETE - Desativar usuário (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const { id } = await params

    // Valida o ID
    const validatedId = idSchema.parse({ id })

    // Verifica se o usuário existe
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.id, validatedId.id)).limit(1)

    if (existingUser.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Usuário não encontrado' }), {
        status: 404,
      })
    }

    // Não permitir remover o próprio acesso
    if (validatedId.id === session.user.id) {
      return new NextResponse(JSON.stringify({ error: 'Não é possível remover seu próprio acesso' }), {
        status: 400,
      })
    }

    // Desativa o usuário em vez de remover (soft delete)
    await db
      .update(usersTable)
      .set({
        active: false,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, validatedId.id))

    return NextResponse.json({ message: 'Usuário desativado com sucesso' })
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
