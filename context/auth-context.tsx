"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authenticateUser, registerUser } from "../lib/auth"

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "librarian" | "user"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar si hay un usuario en localStorage al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const authUser = await authenticateUser(email, password)

      if (authUser) {
        const userData = {
          id: authUser.id,
          name: authUser.name,
          email: authUser.email,
          role: authUser.role as "admin" | "librarian" | "user",
          avatar: authUser.avatarUrl,
        }

        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        return true
      }
    } catch (error) {
      console.error("Error en login:", error)
    } finally {
      setIsLoading(false)
    }

    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const newUser = await registerUser(name, email, password)

      if (newUser) {
        const userData = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role as "admin" | "librarian" | "user",
          avatar: newUser.avatarUrl,
        }

        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        return true
      }
    } catch (error) {
      console.error("Error en registro:", error)
    } finally {
      setIsLoading(false)
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

