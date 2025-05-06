'use client'

import { IconLogout } from '@tabler/icons-react'
import { routes } from '@/lib/routes'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { signOut, useSession } from 'next-auth/react'
import { Button } from './ui/button'

export default function NavUser() {
  const { data: session } = useSession()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{session?.user?.name}</span>
            <span className="text-muted-foreground truncate text-xs">{session?.user?.email}</span>
          </div>
          <Button
            className="cursor-pointer"
            asChild
            variant="ghost"
            size="icon"
            onClick={() =>
              signOut({
                redirectTo: routes.frontend.auth.login,
              })
            }>
            <IconLogout className="size-5" />
          </Button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
