"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "../../lib/utils"
import { BookOpen, X } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { Button } from "../ui/button"
import { useAuth } from "@/context/auth-context"
import { ThemeToggle } from "@/components/layout/theme-toggle"

interface MobileNavProps {
  items: {
    href: string
    label: string
  }[]
  setIsOpen: (open: boolean) => void
}

export function MobileNav({ items, setIsOpen }: MobileNavProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <span className="font-bold">BiblioSystem</span>
        </div>
        <div className="flex items-center">
          <ThemeToggle className="mr-2" />
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="flex flex-col gap-2 py-4">
          {user && (
            <div className="mb-4 px-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  {user.name.substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/dashboard/profile"
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/dashboard/profile" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            Mi Perfil
          </Link>
        </div>
      </ScrollArea>
    </div>
  )
}

