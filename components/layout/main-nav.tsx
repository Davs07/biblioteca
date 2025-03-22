"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { BookOpen, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { UserNav } from "@/components/layout/user-nav"
import { useAuth } from "@/context/auth-context"
import { useSidebar } from "../ui/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"

export function MainNav() {
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuth()
  const { toggleSidebar } = useSidebar()
  const [isOpen, setIsOpen] = useState(false)

  if (!isAuthenticated) return null

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
    },
    {
      href: "/dashboard/books",
      label: "Libros",
    },
    {
      href: "/dashboard/categories",
      label: "Categorías",
    },
    {
      href: "/dashboard/search",
      label: "Búsqueda",
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" flex h-14 items-center w-full px-4 justify-between">
        {/* Mobile sidebar toggle */}
        {/* <div className="md:hidden mr-2">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div> */}

        {/* Logo */}
        <div className="hidden md:flex ">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold hidden sm:inline-block">BiblioSystem</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="mx-6 hidden md:flex md:flex-1 items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile navigation trigger */}
        <div className="flex md:hidden  justify-end">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
              <MobileNav items={navItems} setIsOpen={setIsOpen} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Right side items */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
}

