import AuthProvider from '@/components/auth-provider'
import { Ban, CircleCheckBig, CircleEllipsis, Info, TriangleAlert } from 'lucide-react'
import type { Metadata } from 'next'
import { Dancing_Script, Playfair_Display, Lora } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import Providers from './Providers'
import { SpeedInsights } from '@vercel/speed-insights/next'

const dancingScript = Dancing_Script({
  variable: '--font-dancing-script',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
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
      <body className={`${dancingScript.variable} ${playfairDisplay.variable} ${lora.variable} font-serif antialiased`}>
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
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
}
