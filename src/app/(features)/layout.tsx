import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/app/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AuthProvider from '@/components/AuthProvider'
import Providers from '@/app/Providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Ester & Luan - Nosso Casamento',
  description: 'Site do casamento de Ester e Luan - Venha celebrar conosco!',
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Providers>
          <AuthProvider>
            <Header />
            <main className="flex-grow bg-gradient-to-b from-slate-50 to-white p-10">{children}</main>
            <Footer />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
