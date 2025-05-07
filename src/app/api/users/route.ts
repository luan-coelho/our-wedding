import { auth } from '@/auth'
import { db } from '@/db'
import { tableUsers } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Schema para validação da concessão de permissões
const permissionSchema = z.object({
  email: z.string().email('Email inválido'),
  role: z.enum(['admin', 'planner', 'guest']),
  name: z.string().optional(),
})

// Schema para remoção de acesso
const removeAccessSchema = z.object({
  email: z.string().email('Email inválido'),
})

// GET para listar todos os usuários com permissões
export async function GET() {
  const session = await auth()

  // Verifica se o usuário está autenticado e é um administrador
  if (!session || session.user.role !== 'admin') {
    return new NextResponse(JSON.stringify({ error: 'Não autorizado' }), {
      status: 403,
    })
  }

  // Busca todos os usuários
  const allUsers = await db.query.tableUsers.findMany({
    columns: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      active: true,
    },
  })

  return NextResponse.json(allUsers)
}

// POST para conceder/atualizar permissão
export async function POST(request: NextRequest) {
  const session = await auth()

  // Verifica se o usuário está autenticado e é um administrador
  if (!session || session.user.role !== 'admin') {
    return new NextResponse(JSON.stringify({ error: 'Não autorizado' }), {
      status: 403,
    })
  }

  try {
    // Recebe os dados do corpo da requisição
    const body = await request.json()

    // Valida os dados com o schema
    const { email, role, name } = permissionSchema.parse(body)

    // Verifica se já existe um usuário com este email
    const existingUser = await db.query.tableUsers.findFirst({
      where: eq(tableUsers.email, email),
    })

    if (existingUser) {
      // Atualiza a role do usuário existente e ativa a conta se estiver inativa
      await db
        .update(tableUsers)
        .set({ 
          role,
          active: true,
          updatedAt: new Date()
        })
        .where(eq(tableUsers.email, email))
        .returning()

      return NextResponse.json({ message: 'Permissão atualizada' }, { status: 200 })
    }

    // Insere o novo usuário com permissão pré-definida
    const [newUser] = await db
      .insert(tableUsers)
      .values({
        name: name || email.split('@')[0], // Se não for fornecido um nome, usa parte do email
        email,
        role,
        active: true,
        updatedAt: new Date()
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
  if (!session || session.user.role !== 'admin') {
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
    
    // Valida o email
    removeAccessSchema.parse({ email })

    // Verifica se o usuário existe
    const existingUser = await db.query.tableUsers.findFirst({
      where: eq(tableUsers.email, email),
    })

    if (!existingUser) {
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
        updatedAt: new Date() 
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
