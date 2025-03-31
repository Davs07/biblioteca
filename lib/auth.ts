import { prisma } from "./prisma"
import { isDatabaseAvailable, handleDatabaseError } from "./db"
import { User } from "../context/auth-context"

// Función para actualizar el perfil de un usuario
export async function updateUserProfile(userId: string, data: Partial<User>) {
  if (isDatabaseAvailable()) {
    try {
      // Verificar si el usuario existe
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!existingUser) {
        console.error("Usuario no encontrado")
        return null
      }

      // Actualizar el usuario en la base de datos
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name: data.name,
          avatarUrl: data.avatar,
          // No actualizamos el email ni la contraseña aquí por seguridad
          // Eso requeriría un flujo separado con verificación
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
        },
      })

      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role as "admin" | "librarian" | "user",
        avatar: updatedUser.avatarUrl,
      }
    } catch (error) {
      console.error("Error al actualizar perfil de usuario:", error)
      handleDatabaseError(error, 'Error updating user profile')
      return null
    }
  } else {
    // Simular actualización cuando no hay base de datos
    return {
      id: userId,
      name: data.name || "",
      email: data.email || "",
      role: data.role || "user",
      avatar: data.avatar || "/placeholder.svg?height=40&width=40",
    }
  }
}

// Función para autenticar un usuario
export async function authenticateUser(email: string, password: string) {
  if (isDatabaseAvailable()) {
    try {
      // Buscar el usuario por email en la base de datos
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          passwordHash: true,
          role: true,
          avatarUrl: true,
        },
      })

      if (!user) {
        console.error("Usuario no encontrado")
        return null
      }

      // En un entorno real, deberías verificar la contraseña con bcrypt o similar
      // Por ahora, comparamos directamente con el passwordHash
      if (user.passwordHash === password) {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
        }
      } else {
        console.error("Contraseña incorrecta")
        return null
      }
    } catch (error) {
      console.error("Error al autenticar usuario:", error)
      handleDatabaseError(error, 'Error authenticating user')
      return null
    }
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
        console.error("El correo electrónico ya está registrado")
        return null
      }

      // Crear el usuario en la base de datos
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash: password, // En producción, deberías usar bcrypt o similar para hashear
          role: "user",
          avatarUrl: "/placeholder.svg?height=40&width=40",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
        },
      })

      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatarUrl: newUser.avatarUrl,
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error)
      handleDatabaseError(error, 'Error registering user')
      return null
    }
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

