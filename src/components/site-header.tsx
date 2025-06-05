'use client'

import * as React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { usePathname } from 'next/navigation'
import { routeUtils } from '@/lib/routes'

export function SiteHeader() {
  const pathname = usePathname()

  const breadcrumbs = routeUtils.generateBreadcrumbs(pathname)

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-wedding-light/20 bg-white/80 backdrop-blur-sm transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 text-wedding-primary hover:bg-wedding-light/20" />
        <Separator orientation="vertical" className="mr-2 h-4 bg-wedding-light/30" />

        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={breadcrumb.href}>
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage className="text-wedding-primary font-medium">{breadcrumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={breadcrumb.href}
                        className="text-muted-foreground hover:text-wedding-primary transition-colors">
                        {breadcrumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="text-wedding-light" />}
                </React.Fragment>
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
