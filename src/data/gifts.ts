export interface Gift {
  id: number
  name: string
  description: string
  price: number
  pixKey: string
  imageUrl?: string
}

export const gifts: Gift[] = [
  {
    id: 1,
    name: 'Liquidificador',
    description: 'Liquidificador potente para nossa nova cozinha.',
    price: 179.9,
    pixKey: '12345678900',
    imageUrl: 'https://jcsbrasil.vteximg.com.br/arquivos/ids/216833-1000-1000/LIQ200--1-.jpg?v=638282217512000000',
  },
]
