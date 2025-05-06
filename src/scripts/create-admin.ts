import { hash } from 'bcryptjs'
import { db } from '../db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'

async function createAdminUser() {
  const adminEmail = 'admin@gmail.com'
  const adminPassword = 'admin'

  try {
    // Verificar se o usuário já existe
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, adminEmail),
    })

    const hashedPassword = await hash(adminPassword, 10)

    if (existingUser) {
      // Atualizar o usuário existente
      console.log('Atualizando usuário administrador existente...')

      await db.update(users).set({
        name: 'Administrador',
        password: hashedPassword,
        role: 'admin',
      })

      console.log('Usuário administrador atualizado com sucesso!')
    } else {
      // Criar novo usuário administrador
      console.log('Criando novo usuário administrador...')

      await db.insert(users).values({
        email: adminEmail,
        name: 'Administrador',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      console.log('Usuário administrador criado com sucesso!')
    }
  } catch (error) {
    console.error('Erro ao criar/atualizar usuário administrador:', error)
  }
}

// Executar a função
createAdminUser()
