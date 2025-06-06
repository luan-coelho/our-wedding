import AuthProvider from '@/components/auth-provider'
import { Ban, CircleCheckBig, CircleEllipsis, Info, TriangleAlert } from 'lucide-react'
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import Providers from './Providers'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Luan & Ester - Nosso Casamento',
  description: 'Site do casamento de Luan e Ester - Venha celebrar conosco!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={geist.variable}>
        <Providers>
          <AuthProvider>{children}</AuthProvider>
          <Toaster
            toastOptions={{
              duration: 5000,
            }}
            icons={{
              success: <CircleCheckBig />,
              info: <Info />,
              warning: <TriangleAlert />,
              error: <Ban />,
              loading: <CircleEllipsis />,
            }}
            theme={'light'}
            position="top-right"
            expand
            richColors
          />
        </Providers>
      </body>
    </html>
  )
}
