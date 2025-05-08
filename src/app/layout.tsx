import AuthProvider from '@/components/auth-provider'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import Providers from './Providers'

const poppins = Poppins({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Ester & Luan - Nosso Casamento',
  description: 'Site do casamento de Ester e Luan - Venha celebrar conosco!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={poppins.variable}>
        <Providers>
          <AuthProvider>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
