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
      <main className="flex-grow bg-gradient-to-b from-slate-50 to-white p-10">{children}</main>
      <Footer />
    </React.Fragment>
  )
}
