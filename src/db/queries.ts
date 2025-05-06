import { asc, desc, eq } from 'drizzle-orm'
import { db } from './index'
import { gifts, guests, messages, photos, pixKeys, users } from './schema'

// Exemplos de consultas utilizando o Drizzle ORM

// Usuários
export async function getUserByEmail(email: string) {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  })
}

export async function createUser(userData: any) {
  return await db.insert(users).values(userData).returning()
}

// Convidados
export async function getGuestByToken(token: string) {
  return await db.query.guests.findFirst({
    where: eq(guests.token, token),
  })
}

export async function confirmGuest(token: string, isConfirmed: boolean) {
  return await db.update(guests).set({ isConfirmed, updatedAt: new Date() }).where(eq(guests.token, token)).returning()
}

export async function getAllGuests() {
  return await db.select().from(guests).orderBy(asc(guests.name))
}

// Mensagens
export async function getAllMessages() {
  return await db.select().from(messages).orderBy(desc(messages.createdAt))
}

export async function createMessage(messageData: any) {
  return await db.insert(messages).values(messageData).returning()
}

// Presentes
export async function getAllGifts() {
  return await db.select().from(gifts).orderBy(asc(gifts.name))
}

export async function getGiftById(id: number) {
  return await db.query.gifts.findFirst({
    where: eq(gifts.id, id),
  })
}

// Chaves Pix
export async function getAllPixKeys() {
  return await db.select().from(pixKeys)
}

// Fotos
export async function getAllPhotos() {
  return await db.select().from(photos).orderBy(desc(photos.createdAt))
}

export async function createPhoto(photoData: any) {
  return await db.insert(photos).values(photoData).returning()
}
