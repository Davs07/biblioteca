import { prisma } from "./prisma"

// Función para sembrar la base de datos con datos iniciales
export async function seedDatabase() {
  try {
    console.log("Iniciando siembra de la base de datos...")

    // Crear usuarios de demostración
    const demoUsers = [
      {
        name: "Administrador",
        email: "admin@biblioteca.com",
        passwordHash: "password123", // En producción, usar bcrypt o similar
        role: "admin",
        avatarUrl: "/placeholder.svg?height=40&width=40",
      },
      {
        name: "Bibliotecario",
        email: "bibliotecario@biblioteca.com",
        passwordHash: "password123",
        role: "librarian",
        avatarUrl: "/placeholder.svg?height=40&width=40",
      },
      {
        name: "Usuario",
        email: "usuario@biblioteca.com",
        passwordHash: "password123",
        role: "user",
        avatarUrl: "/placeholder.svg?height=40&width=40",
      },
    ]

    console.log("Creando usuarios...")
    for (const user of demoUsers) {
      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      })

      if (!existingUser) {
        // Ya no necesitamos crear usuarios en Supabase Auth

        // Crear usuario en nuestra base de datos
        await prisma.user.create({
          data: user,
        })
        console.log(`Usuario ${user.email} creado en la base de datos`)
      } else {
        console.log(`Usuario ${user.email} ya existe, omitiendo...`)
      }
    }

    // Ya no creamos categorías desde datos inicializados
    console.log("Omitiendo creación de categorías predefinidas")
    // Nota: Las categorías ahora se crean a través de la interfaz de usuario
    // o mediante la API directamente

    // Ya no creamos libros desde datos inicializados
    console.log("Omitiendo creación de libros predefinidos")
    // Nota: Los libros ahora se crean a través de la interfaz de usuario
    // o mediante la API directamente

    console.log("Siembra de la base de datos completada con éxito")
  } catch (error) {
    console.error("Error al sembrar la base de datos:", error)
    throw error
  }
}

