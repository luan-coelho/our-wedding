import '@/app/globals.css'
import Footer from '@/components/footer'
import Header from '@/components/header'
import React from 'react'

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <React.Fragment>
      <Header />
      <main className="flex-grow bg-gradient-to-b from-white to-wedding-light/20 min-h-screen">{children}</main>
      <Footer />
    </React.Fragment>
  )
}
