import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Dados simulados
const gifts = [
  {
    name: 'Liquidificador',
    description: 'Liquidificador potente para nossa nova cozinha.',
    price: 179.9,
    pixKey: '12345678900',
    imageUrl: '/images/liquidificador.jpg',
  },
  {
    name: 'Jogo de Panelas',
    description: 'Kit com 5 panelas de cerâmica antiaderente.',
    price: 499.9,
    pixKey: '12345678901',
    imageUrl: '/images/panelas.jpg',
  },
  {
    name: 'Smart TV',
    description: 'TV 4K de 50 polegadas para nossa sala.',
    price: 2499.9,
    pixKey: '12345678902',
    imageUrl: '/images/tv.jpg',
  },
  {
    name: 'Aspirador de Pó',
    description: 'Aspirador de pó sem fio e 2 em 1.',
    price: 599.9,
    pixKey: '12345678903',
    imageUrl: '/images/aspirador.jpg',
  },
  {
    name: 'Máquina de Lavar',
    description: 'Máquina de lavar roupa com capacidade de 11kg.',
    price: 1899.9,
    pixKey: '12345678904',
    imageUrl: '/images/maquina-lavar.jpg',
  },
]

const photos = [
  {
    url: '/images/photo1.jpg',
    description: 'Nosso primeiro encontro',
  },
  {
    url: '/images/photo2.jpg',
    description: 'Viagem a Paris',
  },
  {
    url: '/images/photo3.jpg',
    description: 'Aniversário de namoro',
  },
  {
    url: '/images/photo4.jpg',
    description: 'Pedido de casamento',
  },
  {
    url: '/images/photo5.jpg',
    description: 'Férias na praia',
  },
]

async function main() {
  console.log('Iniciando seed do banco de dados...')

  // Limpar dados existentes
  await prisma.guest.deleteMany()
  await prisma.message.deleteMany()
  await prisma.gift.deleteMany()
  await prisma.photo.deleteMany()

  console.log('Dados existentes removidos.')

  // Adicionar mensagens iniciais
  const messages = [
    {
      name: 'Tiago e Ana',
      content: 'Que a felicidade de vocês seja eterna como o amor que compartilham!',
      email: 'tiago.ana@exemplo.com',
    },
    {
      name: 'Carlos Silva',
      content: 'Desejo a vocês uma vida repleta de momentos inesquecíveis. Parabéns pelo casamento!',
      email: 'carlos.silva@exemplo.com',
    },
    {
      name: 'Família Santos',
      content: 'Que Deus abençoe essa união e vocês sejam muito felizes juntos!',
      email: null,
    },
  ]

  for (const message of messages) {
    await prisma.message.create({
      data: message,
    })
  }

  console.log(`${messages.length} mensagens adicionadas.`)

  // Adicionar presentes
  for (const gift of gifts) {
    await prisma.gift.create({
      data: {
        name: gift.name,
        description: gift.description,
        price: gift.price,
        pixKey: gift.pixKey,
        imageUrl: gift.imageUrl,
      },
    })
  }

  console.log(`${gifts.length} presentes adicionados.`)

  // Adicionar fotos
  for (const photo of photos) {
    await prisma.photo.create({
      data: {
        url: photo.url,
        description: photo.description,
      },
    })
  }

  console.log(`${photos.length} fotos adicionadas.`)

  console.log('Seed concluído com sucesso!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
