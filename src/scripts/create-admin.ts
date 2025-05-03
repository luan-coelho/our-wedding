import { hash } from 'bcryptjs'
import { prisma } from '../lib/prisma'

async function createAdminUser() {
  const adminEmail = 'admin@gmail.com'
  
  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (existingUser) {
      // Atualizar o usuário existente
      console.log('Atualizando usuário administrador existente...')
      const hashedPassword = await hash('admin', 10)
      
      await prisma.user.update({
        where: { email: adminEmail },
        data: {
          name: 'Administrador',
          password: hashedPassword,
          role: 'admin',
        },
      })
      
      console.log('Usuário administrador atualizado com sucesso!')
    } else {
      // Criar novo usuário administrador
      console.log('Criando novo usuário administrador...')
      const hashedPassword = await hash('admin', 10)
      
      await prisma.user.create({
        data: {
          email: adminEmail,
          name: 'Administrador',
          password: hashedPassword,
          role: 'admin',
        },
      })
      
      console.log('Usuário administrador criado com sucesso!')
    }
  } catch (error) {
    console.error('Erro ao criar/atualizar usuário administrador:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar a função
createAdminUser() 