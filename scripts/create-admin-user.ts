#!/usr/bin/env tsx

import 'dotenv/config'
import { eq } from 'drizzle-orm'
import { db } from '../src/db'
import { tableUsers } from '../src/db/schema/users'
import { UserRole } from '../src/lib/auth-types'

/**
 * Script para criar um usuário administrador
 *
 * Uso:
 * npx tsx scripts/create-admin-user.ts
 *
 * Ou com nome customizado:
 * npx tsx scripts/create-admin-user.ts "Nome do Admin"
 */

async function createAdminUser() {
  const email = 'lumyth.br@gmail.com'
  const name = 'Administrador'

  try {
    console.log('🔍 Verificando se o usuário já existe...')

    // Verifica se já existe um usuário com este email
    const existingUser = await db.select().from(tableUsers).where(eq(tableUsers.email, email)).limit(1)

    if (existingUser.length > 0) {
      console.log('Usuário já existe. Atualizando para administrador...')

      // Atualiza o usuário existente para admin
      const [updatedUser] = await db
        .update(tableUsers)
        .set({
          role: UserRole.ADMIN,
          active: true,
          name: name,
          updatedAt: new Date(),
        })
        .where(eq(tableUsers.email, email))
        .returning()

      console.log('Usuário atualizado com sucesso!')
      console.log('Dados do usuário:')
      console.log(`ID: ${updatedUser.id}`)
      console.log(`Nome: ${updatedUser.name}`)
      console.log(`Email: ${updatedUser.email}`)
      console.log(`Role: ${updatedUser.role}`)
      console.log(`Ativo: ${updatedUser.active}`)
    } else {
      console.log('Criando novo usuário administrador...')

      // Cria um novo usuário admin
      const [newUser] = await db
        .insert(tableUsers)
        .values({
          name: name,
          email: email,
          role: UserRole.ADMIN,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()

      console.log('Usuário criado com sucesso!')
      console.log('Dados do usuário:')
      console.log(`ID: ${newUser.id}`)
      console.log(`Nome: ${newUser.name}`)
      console.log(`Email: ${newUser.email}`)
      console.log(`Role: ${newUser.role}`)
      console.log(`Ativo: ${newUser.active}`)
    }

    console.log('\nOperação concluída com sucesso!')
    console.log('O usuário agora pode fazer login com Google usando este email.')
  } catch (error) {
    console.error('Erro ao criar/atualizar usuário administrador:')
    console.error(error)
    process.exit(1)
  } finally {
    // Encerra a conexão com o banco
    process.exit(0)
  }
}

// Executa o script
if (require.main === module) {
  createAdminUser()
}

export { createAdminUser }
