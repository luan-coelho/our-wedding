import { auth } from '@/auth'
import { db } from '@/db'
import { tableUsers } from '@/db/schema'
import { compare, hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Schema para validação da troca de senha quando é obrigatório
const fullChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
})

// POST para trocar a senha
export async function POST(request: NextRequest) {
  // Obter a sessão do usuário
  const session = await auth()

  // Verifica se o usuário está autenticado
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { error: 'Não autorizado' },
      {
        status: 401,
      },
    )
  }

  try {
    // Recebe os dados do corpo da requisição
    const body = await request.json()

    // Busca o usuário no banco de dados
    const existingUser = await db.query.tableUsers.findFirst({
      where: eq(tableUsers.id, session.user.id),
    })

    if (!existingUser) {
      console.error(`Usuário não encontrado no banco. ID: ${session.user.id}`)
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        {
          status: 404,
        },
      )
    }

    // Para trocas normais, precisamos da senha atual
    const validatedData = fullChangePasswordSchema.parse(body)

    // Verifica se a senha atual está correta
    const isPasswordCorrect = await compare(validatedData.currentPassword, existingUser.password || '')

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: 'Senha atual incorreta' },
        {
          status: 400,
        },
      )
    }

    // Hash da nova senha
    const hashedPassword = await hash(validatedData.newPassword, 10)

    // Atualiza a senha do usuário
    await db
      .update(tableUsers)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(tableUsers.id, session.user.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        {
          status: 400,
        },
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      {
        status: 500,
      },
    )
  }
}
