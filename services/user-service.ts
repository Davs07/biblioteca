import { prisma } from "../lib/prisma"
import { isDatabaseAvailable } from "../lib/db"
import { User } from "../context/auth-context"

// Obtener todos los usuarios
export async function getAllUsers() {
  if (isDatabaseAvailable()) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      return users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }))
    } catch (error) {
      console.error("Error al obtener usuarios:", error)
      throw error
    }
  } else {
    // Datos de demostración cuando no hay base de datos
    return [
      {
        id: "1",
        name: "Administrador",
        email: "admin@biblioteca.com",
        role: "admin",
        avatar: "/placeholder.svg?height=40&width=40",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Bibliotecario",
        email: "bibliotecario@biblioteca.com",
        role: "librarian",
        avatar: "/placeholder.svg?height=40&width=40",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Usuario",
        email: "usuario@biblioteca.com",
        role: "user",
        avatar: "/placeholder.svg?height=40&width=40",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }
}

// Obtener un usuario por ID
export async function getUserById(id: string) {
  if (isDatabaseAvailable()) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      if (!user) return null

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error)
      throw error
    }
  } else {
    // Simular búsqueda en datos de demostración
    const demoUsers = [
      {
        id: "1",
        name: "Administrador",
        email: "admin@biblioteca.com",
        role: "admin",
        avatar: "/placeholder.svg?height=40&width=40",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Bibliotecario",
        email: "bibliotecario@biblioteca.com",
        role: "librarian",
        avatar: "/placeholder.svg?height=40&width=40",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Usuario",
        email: "usuario@biblioteca.com",
        role: "user",
        avatar: "/placeholder.svg?height=40&width=40",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    return demoUsers.find((user) => user.id === id) || null
  }
}

// Crear un nuevo usuario
export async function createUser(data: {
  name: string
  email: string
  password: string
  role?: string
  avatarUrl?: string
}) {
  if (isDatabaseAvailable()) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      })

      if (existingUser) {
        throw new Error("El correo electrónico ya está registrado")
      }

      // En producción, deberías usar bcrypt o similar para hashear la contraseña
      const newUser = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash: data.password, // En producción, hashear la contraseña
          role: data.role || "user",
          avatarUrl: data.avatarUrl || "/placeholder.svg?height=40&width=40",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatarUrl,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      }
    } catch (error) {
      console.error("Error al crear usuario:", error)
      throw error
    }
  } else {
    // Simular creación cuando no hay base de datos
    return {
      id: "4",
      name: data.name,
      email: data.email,
      role: data.role || "user",
      avatar: data.avatarUrl || "/placeholder.svg?height=40&width=40",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
}

// Actualizar un usuario existente
export async function updateUser(id: string, data: Partial<User> & { password?: string }) {
  if (isDatabaseAvailable()) {
    try {
      // Preparar los datos para actualizar
      const updateData: any = {}
      if (data.name) updateData.name = data.name
      if (data.email) updateData.email = data.email
      if (data.role) updateData.role = data.role
      if (data.avatar) updateData.avatarUrl = data.avatar
      if (data.password) updateData.passwordHash = data.password // En producción, hashear la contraseña

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatarUrl,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      }
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${id}:`, error)
      throw error
    }
  } else {
    // Simular actualización cuando no hay base de datos
    const demoUsers = [
      {
        id: "1",
        name: "Administrador",
        email: "admin@biblioteca.com",
        role: "admin",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "2",
        name: "Bibliotecario",
        email: "bibliotecario@biblioteca.com",
        role: "librarian",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "3",
        name: "Usuario",
        email: "usuario@biblioteca.com",
        role: "user",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ]

    const userIndex = demoUsers.findIndex((user) => user.id === id)
    if (userIndex === -1) throw new Error("Usuario no encontrado")

    // Actualizar los datos del usuario demo
    const updatedUser = {
      ...demoUsers[userIndex],
      ...data,
      avatar: data.avatar || demoUsers[userIndex].avatar,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return updatedUser
  }
}

// Eliminar un usuario
export async function deleteUser(id: string) {
  if (isDatabaseAvailable()) {
    try {
      await prisma.user.delete({
        where: { id },
      })
      return true
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error)
      throw error
    }
  } else {
    // Simular eliminación cuando no hay base de datos
    return true
  }
}