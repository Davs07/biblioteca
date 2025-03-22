import { prisma } from "./prisma"
import { isDatabaseAvailable } from "./db"

// Función para autenticar un usuario
export async function authenticateUser(email: string, password: string) {
  if (isDatabaseAvailable()) {
    try {
      // Autenticar directamente con Prisma
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        console.error("Usuario no encontrado")
        return null
      }

      // En un entorno real, deberías verificar la contraseña con bcrypt o similar
      // Por ahora, comparamos directamente con el passwordHash
      if (user.passwordHash === password) {
        return user
      } else {
        console.error("Contraseña incorrecta")
        return null
      }
    } catch (error) {
      console.error("Error al autenticar usuario:", error)
    }
    return null
  } else {
    // Usar datos de demostración cuando no hay base de datos
    const demoUsers = [
      {
        id: "1",
        name: "Administrador",
        email: "admin@biblioteca.com",
        passwordHash: "password123",
        role: "admin",
        avatarUrl: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "2",
        name: "Bibliotecario",
        email: "bibliotecario@biblioteca.com",
        passwordHash: "password123",
        role: "librarian",
        avatarUrl: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "3",
        name: "Usuario",
        email: "usuario@biblioteca.com",
        passwordHash: "password123",
        role: "user",
        avatarUrl: "/placeholder.svg?height=40&width=40",
      },
    ]

    const user = demoUsers.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password)
    return user || null
  }
}

// Función para registrar un nuevo usuario
export async function registerUser(name: string, email: string, password: string) {
  if (isDatabaseAvailable()) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return null
      }

      // Crear directamente el usuario con Prisma
      // Ya no necesitamos Supabase Auth
      // Crear el usuario en nuestra base de datos
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash: "hashed_password", // En producción, deberías usar bcrypt o similar
          role: "user",
          avatarUrl: "/placeholder.svg?height=40&width=40",
        },
      })

      return newUser
    } catch (error) {
      console.error("Error al registrar usuario:", error)
    }
    return null
  } else {
    // Simular registro cuando no hay base de datos
    return {
      id: "4",
      name,
      email,
      passwordHash: "password123",
      role: "user",
      avatarUrl: "/placeholder.svg?height=40&width=40",
    }
  }
}

