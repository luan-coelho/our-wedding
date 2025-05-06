'use client'

import {
  IconCreditCard,
  IconDashboard,
  IconGift,
  IconInnerShadowTop,
  IconMessageCircle,
  IconUsers,
} from '@tabler/icons-react'
import * as React from 'react'

import { NavMain } from '@/components/nav-main'
import NavUser from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { routes } from '@/lib/routes'

const data = {
  navMain: [
    {
      title: 'Início',
      url: routes.frontend.admin.home,
      icon: IconDashboard,
    },
    {
      title: 'Lista de Presentes',
      url: routes.frontend.admin.presentes.index,
      icon: IconGift,
    },
    {
      title: 'Convidados',
      url: routes.frontend.admin.convidados.index,
      icon: IconUsers,
    },
    {
      title: 'Chaves PIX',
      url: routes.frontend.admin.chavesPix.index,
      icon: IconCreditCard,
    },
    {
      title: 'Portal',
      url: routes.frontend.home,
      icon: IconMessageCircle,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="bg-zinc-800" collapsible="offcanvas" {...props}>
      <SidebarHeader className="bg-zinc-800">
        <SidebarMenu>
          <SidebarMenuItem className="bg-zinc-800">
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5 text-white">
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="font-semibold">Ester & Luan</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-zinc-800">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
