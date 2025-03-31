"use client"

import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { LogOut, User, Settings } from "lucide-react"
import { useSidebar } from "../ui/sidebar";
import { useEffect, useRef, useState } from "react"

export function UserNav() {
  const router = useRouter()

  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cierra el dropdown cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isAuthenticated) return null;

  if (!user) return null

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Admin
          </span>
        )
      case "librarian":
        return (
          <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Bibliotecario
          </span>
        )
      case "user":
        return (
          <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Usuario
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
    <Button
      variant="ghost"
      className="relative h-8 w-8 rounded-full"
      onClick={() => setDropdownOpen(!dropdownOpen)}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>
          {user.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </Button>
    
    {/* Dropdown menu implementado manualmente */}
    {dropdownOpen && (
      <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-zinc-900 ring-1 ring-black ring-opacity-5 z-50">
        <div className="py-2 px-4 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center">
              <p className="text-sm font-medium leading-none">
                {user.name}
              </p>
              {getRoleBadge(user.role)}
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        
        <div className="py-1">
          <button
            onClick={() => {
              router.push("/dashboard/profile");
              setDropdownOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-zinc-800">
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </button>
          <button
            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-zinc-800">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </button>
        </div>
        
        <div className="py-1 border-t border-gray-100 dark:border-zinc-800">
          <button
            onClick={() => {
              handleLogout();
              setDropdownOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-800">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    )}
  </div>
  )
}

