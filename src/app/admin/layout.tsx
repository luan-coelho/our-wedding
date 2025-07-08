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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wedding-light/20 to-wedding-lavender/30">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-wedding-primary/20 border-t-wedding-primary"></div>
          <p className="text-wedding-primary font-medium">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          '--sidebar-width': '18rem',
          '--sidebar-width-mobile': '20rem',
        } as React.CSSProperties
      }>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col min-h-0">
          <div className="flex flex-1 flex-col bg-gradient-to-br from-wedding-light/10 via-white to-wedding-sage/5">
            <main className="flex-1 p-6 space-y-6 overflow-auto">
              <div className="max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
