
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
      <body className={geist.variable}>
        <Providers>
          <AuthProvider>{children}</AuthProvider>
          <Toaster
            toastOptions={{
              duration: 5000,
              classNames: {
                error: 'bg-red-500 text-white border border-red-500',
                success: 'bg-green-500 text-white border border-green-500',
                warning: 'bg-yellow-400 text-black border border-yellow-400',
                info: 'bg-blue-500 text-white border border-blue-500',
              },
            }}
            icons={{
              success: <CircleCheckBig />,
              info: <Info />,
              warning: <TriangleAlert />,
              error: <Ban />,
              loading: <CircleEllipsis />,
            }}
            position="top-right"
            theme="dark"
          />
        </Providers>
      </body>
    </html>
  )
}
