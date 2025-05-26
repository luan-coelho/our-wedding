import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { usePathname } from 'next/navigation'

export function SiteHeader() {
  const pathname = usePathname()
  
  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = []
    
    if (segments[0] === 'admin') {
      breadcrumbs.push({ label: 'Administração', href: '/admin' })
      
      if (segments[1]) {
        const pageMap: Record<string, string> = {
          'convidados': 'Convidados',
          'presentes': 'Lista de Presentes',
          'chaves-pix': 'Chaves PIX',
          'usuarios': 'Usuários'
        }
        
        const pageLabel = pageMap[segments[1]] || segments[1]
        breadcrumbs.push({ label: pageLabel, href: `/admin/${segments[1]}` })
        
        if (segments[2] === 'novo') {
          breadcrumbs.push({ label: 'Novo', href: pathname })
        } else if (segments[3] === 'editar') {
          breadcrumbs.push({ label: 'Editar', href: pathname })
        }
      }
    }
    
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-wedding-light/20 bg-white/80 backdrop-blur-sm transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 text-wedding-primary hover:bg-wedding-light/20" />
        <Separator orientation="vertical" className="mr-2 h-4 bg-wedding-light/30" />
        
        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <BreadcrumbItem key={breadcrumb.href}>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage className="text-wedding-primary font-medium">
                      {breadcrumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <>
                      <BreadcrumbLink 
                        href={breadcrumb.href}
                        className="text-muted-foreground hover:text-wedding-primary transition-colors"
                      >
                        {breadcrumb.label}
                      </BreadcrumbLink>
                      <BreadcrumbSeparator className="text-wedding-light" />
                    </>
                  )}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        
        <div className="ml-auto flex items-center gap-2">
          {/* Espaço para futuras funcionalidades como notificações, busca, etc. */}
        </div>
      </div>
    </header>
  )
}
