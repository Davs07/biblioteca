import { prisma } from "./prisma"
import { initialCategories } from "@/data/categories"
import { initialBooks } from "@/data/books"

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

    // Crear categorías
    console.log("Creando categorías...")
    for (const category of initialCategories) {
      // Verificar si la categoría ya existe
      const existingCategory = await prisma.category.findFirst({
        where: { name: category.name },
      })

      if (!existingCategory) {
        const newCategory = await prisma.category.create({
          data: {
            name: category.name,
            color: category.color,
          },
        })
        console.log(`Categoría ${category.name} creada`)

        // Crear subcategorías
        for (const subCategory of category.subCategories) {
          const newSubCategory = await prisma.subcategory.create({
            data: {
              name: subCategory.name,
              color: subCategory.color,
              categoryId: newCategory.id,
            },
          })
          console.log(`Subcategoría ${subCategory.name} creada`)

          // Crear sub-subcategorías
          for (const subSubCategory of subCategory.subSubCategories) {
            const newSubSubCategory = await prisma.subsubcategory.create({
              data: {
                name: subSubCategory.name,
                color: subSubCategory.color,
                subcategoryId: newSubCategory.id,
              },
            })
            console.log(`Sub-subcategoría ${subSubCategory.name} creada`)
          }
        }
      } else {
        console.log(`Categoría ${category.name} ya existe, omitiendo...`)
      }
    }

    // Crear libros
    console.log("Creando libros...")
    for (const book of initialBooks) {
      // Obtener IDs de categorías de la base de datos
      const category = await prisma.category.findFirst({
        where: { name: initialCategories.find((c) => c.id === book.categoryId)?.name },
      })

      if (!category) {
        console.log(`Categoría para el libro ${book.title} no encontrada, omitiendo...`)
        continue
      }

      const subCategory = await prisma.subcategory.findFirst({
        where: {
          name: initialCategories
            .find((c) => c.id === book.categoryId)
            ?.subCategories.find((sc) => sc.id === book.subCategoryId)?.name,
          categoryId: category.id,
        },
      })

      if (!subCategory) {
        console.log(`Subcategoría para el libro ${book.title} no encontrada, omitiendo...`)
        continue
      }

      const subSubCategory = await prisma.subsubcategory.findFirst({
        where: {
          name: initialCategories
            .find((c) => c.id === book.categoryId)
            ?.subCategories.find((sc) => sc.id === book.subCategoryId)
            ?.subSubCategories.find((ssc) => ssc.id === book.subSubCategoryId)?.name,
          subcategoryId: subCategory.id,
        },
      })

      if (!subSubCategory) {
        console.log(`Sub-subcategoría para el libro ${book.title} no encontrada, omitiendo...`)
        continue
      }

      // Verificar si el libro ya existe
      const existingBook = await prisma.book.findFirst({
        where: {
          title: book.title,
          author: book.author,
        },
      })

      if (!existingBook) {
        await prisma.book.create({
          data: {
            title: book.title,
            author: book.author,
            categoryId: category.id,
            subcategoryId: subCategory.id,
            subsubcategoryId: subSubCategory.id,
            shelfLocation: book.shelfLocation,
            coverImage: book.coverImage,
          },
        })
        console.log(`Libro ${book.title} creado`)
      } else {
        console.log(`Libro ${book.title} ya existe, omitiendo...`)
      }
    }

    console.log("Siembra de la base de datos completada con éxito")
  } catch (error) {
    console.error("Error al sembrar la base de datos:", error)
    throw error
  }
}

