import '@/app/globals.css'
import React from 'react'

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <React.Fragment>{children}</React.Fragment>
}
