'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useSession } from 'next-auth/react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession()

  // Mostra um indicador de carregamento enquanto verifica a sessão
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-wedding-primary"></div>
      </div>
    )
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 bg-zinc-100">
            <main className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">{children}</main>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
