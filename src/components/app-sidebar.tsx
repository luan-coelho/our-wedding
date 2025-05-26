'use client'

import {
  IconCreditCard,
  IconDashboard,
  IconGift,
  IconHeart,
  IconMessageCircle,
  IconUsers,
  IconUserPlus,
  IconHome,
  IconChevronRight,
  IconSparkles,
} from '@tabler/icons-react'
import * as React from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { routes } from '@/lib/routes'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from 'next-auth/react'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const isAdmin = session?.user?.role === 'admin'

  const adminItems = [
    {
      title: 'Dashboard',
      url: routes.frontend.admin.home,
      icon: IconDashboard,
      description: 'Visão geral do sistema',
    },
    {
      title: 'Lista de Presentes',
      url: routes.frontend.admin.presentes.index,
      icon: IconGift,
      description: 'Gerenciar presentes',
      requireAdmin: true,
      badge: 'Novo',
    },
    {
      title: 'Convidados',
      url: routes.frontend.admin.convidados.index,
      icon: IconUsers,
      description: 'Lista de convidados',
    },
    {
      title: 'Chaves PIX',
      url: routes.frontend.admin.chavesPix.index,
      icon: IconCreditCard,
      description: 'Configurar pagamentos',
      requireAdmin: true,
    },
    {
      title: 'Usuários',
      url: routes.frontend.admin.usuarios.index,
      icon: IconUserPlus,
      description: 'Gerenciar usuários',
      requireAdmin: true,
    },
  ]

  const publicItems = [
    {
      title: 'Portal do Casamento',
      url: routes.frontend.home,
      icon: IconHome,
      description: 'Página principal',
    },
    {
      title: 'Mensagens',
      url: routes.frontend.mensagens,
      icon: IconMessageCircle,
      description: 'Mensagens dos convidados',
    },
  ]

  // Filtra os itens do menu com base no papel do usuário
  const filteredAdminItems = adminItems.filter(item => !item.requireAdmin || isAdmin)

  const isActiveRoute = (url: string) => {
    if (url === routes.frontend.admin.home) {
      return pathname === url
    }
    return pathname.startsWith(url)
  }

  const getUserInitials = (name?: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Sidebar 
      className="border-r border-gray-800 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 overflow-hidden" 
      collapsible="icon" 
      {...props}
    >
      <SidebarHeader className="border-b border-gray-800 bg-gradient-to-r from-wedding-primary to-wedding-secondary p-4 flex-shrink-0 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 text-white h-14 w-full group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:justify-center">
          <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-white/20 text-white group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:bg-transparent flex-shrink-0">
            <IconHeart className="size-5 group-data-[collapsible=icon]:size-5" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold text-white text-base">Ester & Luan</span>
            <span className="truncate text-sm text-white/80">Casamento 2025</span>
          </div>
          <IconSparkles className="size-5 text-white/60 flex-shrink-0 group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gray-900 py-4 overflow-y-auto overflow-x-hidden flex-1">
        {/* Seção Administrativa */}
        <SidebarGroup className="px-3 group-data-[collapsible=icon]:px-2">
          <SidebarGroupLabel className="text-wedding-light font-semibold flex items-center gap-2 px-3 py-2 mb-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
            <IconDashboard className="size-4 flex-shrink-0" />
            <span className="truncate group-data-[collapsible=icon]:hidden">Administração</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {filteredAdminItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActiveRoute(item.url)}
                    tooltip={item.description}
                    className="group relative data-[active=true]:bg-wedding-primary data-[active=true]:text-white text-gray-300 h-12 px-3 rounded-lg w-full group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                  >
                    <Link href={item.url} className="flex items-center gap-3 w-full min-w-0 group-data-[collapsible=icon]:justify-center">
                      <item.icon className="size-5 group-data-[active=true]:text-white flex-shrink-0 group-data-[collapsible=icon]:size-5" />
                      <div className="flex flex-1 flex-col min-w-0 overflow-hidden group-data-[collapsible=icon]:hidden">
                        <span className="font-medium text-sm truncate">{item.title}</span>
                        <span className="text-xs text-gray-500 group-data-[active=true]:text-white/80 truncate">
                          {item.description}
                        </span>
                      </div>
                      {item.badge && (
                        <Badge variant="secondary" className="bg-wedding-accent text-white text-xs flex-shrink-0 group-data-[collapsible=icon]:hidden">
                          {item.badge}
                        </Badge>
                      )}
                      <IconChevronRight className="size-4 opacity-0 text-gray-400 flex-shrink-0 group-data-[collapsible=icon]:hidden" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-gray-800 my-4 mx-3 group-data-[collapsible=icon]:mx-2" />

        {/* Seção Pública */}
        <SidebarGroup className="px-3 group-data-[collapsible=icon]:px-2">
          <SidebarGroupLabel className="text-wedding-secondary font-semibold flex items-center gap-2 px-3 py-2 mb-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
            <IconHome className="size-4 flex-shrink-0" />
            <span className="truncate group-data-[collapsible=icon]:hidden">Portal Público</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {publicItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActiveRoute(item.url)}
                    tooltip={item.description}
                    className="group relative data-[active=true]:bg-wedding-secondary data-[active=true]:text-white text-gray-300 h-12 px-3 rounded-lg w-full group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                  >
                    <Link href={item.url} className="flex items-center gap-3 w-full min-w-0 group-data-[collapsible=icon]:justify-center">
                      <item.icon className="size-5 group-data-[active=true]:text-white flex-shrink-0 group-data-[collapsible=icon]:size-5" />
                      <div className="flex flex-1 flex-col min-w-0 overflow-hidden group-data-[collapsible=icon]:hidden">
                        <span className="font-medium text-sm truncate">{item.title}</span>
                        <span className="text-xs text-gray-500 group-data-[active=true]:text-white/80 truncate">
                          {item.description}
                        </span>
                      </div>
                      <IconChevronRight className="size-4 opacity-0 text-gray-400 flex-shrink-0 group-data-[collapsible=icon]:hidden" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-800 bg-gray-900 p-4 flex-shrink-0 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-gray-800/80 group text-gray-300 h-16 px-3 rounded-lg w-full group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                >
                  <Avatar className="size-10 border-2 border-wedding-primary/50 flex-shrink-0 group-data-[collapsible=icon]:size-8">
                    <AvatarFallback className="bg-wedding-primary text-white font-semibold text-sm group-data-[collapsible=icon]:text-xs">
                      {getUserInitials(session?.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight min-w-0 overflow-hidden group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold text-white">
                      {session?.user?.name || 'Usuário'}
                    </span>
                    <span className="truncate text-xs text-gray-400">
                      {session?.user?.email}
                    </span>
                  </div>
                  {isAdmin && (
                    <Badge variant="outline" className="border-wedding-primary text-wedding-primary text-xs bg-wedding-primary/10 flex-shrink-0 group-data-[collapsible=icon]:hidden">
                      Admin
                    </Badge>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-gray-900 border-gray-700"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-3 px-2 py-3 text-left text-sm">
                    <Avatar className="size-10 border border-wedding-primary/50 flex-shrink-0">
                      <AvatarFallback className="bg-wedding-primary text-white text-sm">
                        {getUserInitials(session?.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                      <span className="truncate font-semibold text-white">{session?.user?.name}</span>
                      <span className="truncate text-xs text-gray-400">
                        {session?.user?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  className="cursor-pointer text-gray-300 py-3 px-2"
                  onClick={() => signOut({ redirectTo: routes.frontend.auth.login })}
                >
                  Sair da conta
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
