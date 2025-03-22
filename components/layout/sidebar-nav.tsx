"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../ui/sidebar"
import { BookOpen, Home, Layers, Search, User } from "lucide-react"
import { ThemeToggle } from "@/components/layout/theme-toggle"

export function SidebarNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <Home className="h-4 w-4" />,
    },
    {
      href: "/dashboard/books",
      label: "Libros",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      href: "/dashboard/categories",
      label: "Categorías",
      icon: <Layers className="h-4 w-4" />,
    },
    {
      href: "/dashboard/search",
      label: "Búsqueda",
      icon: <Search className="h-4 w-4" />,
    },
    {
      href: "/dashboard/profile",
      label: "Mi Perfil",
      icon: <User className="h-4 w-4" />,
    },
  ]

  return (
    <Sidebar collapsible="icon" className="flex-1 w-48">
      <SidebarHeader>
        <div className="flex items-center justify-center p-2">
          <BookOpen className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">BiblioSystem</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2 text-xs text-center text-muted-foreground">
          <ThemeToggle />
          <div className="mt-2">BiblioSystem v1.0</div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

