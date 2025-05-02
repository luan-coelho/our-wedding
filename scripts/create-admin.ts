import { PrismaClient } from '@/generated/prisma'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@gmail.com'
  const password = process.env.ADMIN_PASSWORD

  if (!password) {
    console.error('Por favor, defina a variável de ambiente ADMIN_PASSWORD')
    process.exit(1)
  }

  try {
    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: 'admin',
      },
      create: {
        email,
        name: 'Administrador',
        password: hashedPassword,
        role: 'admin',
      },
    })

    console.log(`Usuário administrador criado/atualizado: ${user.email}`)
  } catch (error) {
    console.error('Erro ao criar/atualizar usuário administrador:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
