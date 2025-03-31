import { prisma } from "../lib/prisma"
import { isDatabaseAvailable } from "../lib/db"

// Obtener todas las categorías con sus subcategorías y sub-subcategorías
export async function getAllCategories() {
  if (isDatabaseAvailable()) {
    try {
      const categories = await prisma.category.findMany({
        include: {
          subcategories: {
            include: {
              subsubcategories: true,
            },
          },
        },
      })

      // Transformar los datos para que coincidan con el formato esperado por la aplicación
      return categories.map((category) => ({
        id: category.id,
        name: category.name,
        color: category.color,
        subCategories: category.subcategories.map((subcategory) => ({
          id: subcategory.id,
          name: subcategory.name,
          color: subcategory.color,
          subSubCategories: subcategory.subsubcategories.map((subsubcategory) => ({
            id: subsubcategory.id,
            name: subsubcategory.name,
            color: subsubcategory.color,
          })),
        })),
      }))
    } catch (error: any) {
      // Mejorar el manejo de errores con mensajes más descriptivos
      if (error?.message?.includes('FATAL: Tenant or user not found')) {
        console.error("Error de autenticación con la base de datos: Verifica las credenciales en el archivo .env.local")
      } else {
        console.error("Error al obtener categorías:", error)
      }
      // Devolver un array vacío en caso de error para evitar que la aplicación se rompa
      return []
    }
  } else {
    // Cuando la base de datos no está disponible, devolver un array vacío
    console.log("Base de datos no disponible, usando datos de demostración")
    return []
  }
}

// Crear una nueva categoría
export async function createCategory(data: { name: string; color: string }) {
  if (isDatabaseAvailable()) {
    try {
      const category = await prisma.category.create({
        data,
      })
      return {
        id: category.id,
        name: category.name,
        color: category.color,
        subCategories: [],
      }
    } catch (error) {
      console.error("Error al crear categoría:", error)
      throw error
    }
  } else {
    // Simular creación cuando no hay base de datos
    return {
      id: crypto.randomUUID(),
      name: data.name,
      color: data.color,
      subCategories: [],
    }
  }
}

// Actualizar una categoría
export async function updateCategory(id: string, data: { name?: string; color?: string }) {
  if (isDatabaseAvailable()) {
    try {
      const category = await prisma.category.update({
        where: { id },
        data,
      })
      return {
        id: category.id,
        name: category.name,
        color: category.color,
      }
    } catch (error) {
      console.error("Error al actualizar categoría:", error)
      throw error
    }
  } else {
    // Simular actualización cuando no hay base de datos
    return {
      id,
      name: data.name || "",
      color: data.color || "",
    }
  }
}

// Eliminar una categoría
export async function deleteCategory(id: string) {
  if (isDatabaseAvailable()) {
    try {
      await prisma.category.delete({
        where: { id },
      })
      return true
    } catch (error) {
      console.error("Error al eliminar categoría:", error)
      throw error
    }
  } else {
    // Simular eliminación cuando no hay base de datos
    return true
  }
}

// Crear una subcategoría
export async function createSubcategory(categoryId: string, data: { name: string; color: string }) {
  if (isDatabaseAvailable()) {
    try {
      const subcategory = await prisma.subcategory.create({
        data: {
          ...data,
          categoryId,
        },
      })
      return {
        id: subcategory.id,
        name: subcategory.name,
        color: subcategory.color,
        subSubCategories: [],
      }
    } catch (error) {
      console.error("Error al crear subcategoría:", error)
      throw error
    }
  } else {
    // Simular creación cuando no hay base de datos
    return {
      id: crypto.randomUUID(),
      name: data.name,
      color: data.color,
      subSubCategories: [],
    }
  }
}

// Actualizar una subcategoría
export async function updateSubcategory(
  categoryId: string,
  subcategoryId: string,
  data: { name?: string; color?: string },
) {
  if (isDatabaseAvailable()) {
    try {
      const subcategory = await prisma.subcategory.update({
        where: { id: subcategoryId },
        data,
      })
      return {
        id: subcategory.id,
        name: subcategory.name,
        color: subcategory.color,
      }
    } catch (error) {
      console.error("Error al actualizar subcategoría:", error)
      throw error
    }
  } else {
    // Simular actualización cuando no hay base de datos
    return {
      id: subcategoryId,
      name: data.name || "",
      color: data.color || "",
    }
  }
}

// Eliminar una subcategoría
export async function deleteSubcategory(categoryId: string, subcategoryId: string) {
  if (isDatabaseAvailable()) {
    try {
      await prisma.subcategory.delete({
        where: { id: subcategoryId },
      })
      return true
    } catch (error) {
      console.error("Error al eliminar subcategoría:", error)
      throw error
    }
  } else {
    // Simular eliminación cuando no hay base de datos
    return true
  }
}

// Crear una sub-subcategoría
export async function createSubsubcategory(
  categoryId: string,
  subcategoryId: string,
  data: { name: string; color: string },
) {
  if (isDatabaseAvailable()) {
    try {
      const subsubcategory = await prisma.subsubcategory.create({
        data: {
          ...data,
          subcategoryId,
        },
      })
      return {
        id: subsubcategory.id,
        name: subsubcategory.name,
        color: subsubcategory.color,
      }
    } catch (error) {
      console.error("Error al crear sub-subcategoría:", error)
      throw error
    }
  } else {
    // Simular creación cuando no hay base de datos
    return {
      id: crypto.randomUUID(),
      name: data.name,
      color: data.color,
    }
  }
}

// Actualizar una sub-subcategoría
export async function updateSubsubcategory(
  categoryId: string,
  subcategoryId: string,
  subsubcategoryId: string,
  data: { name?: string; color?: string },
) {
  if (isDatabaseAvailable()) {
    try {
      const subsubcategory = await prisma.subsubcategory.update({
        where: { id: subsubcategoryId },
        data,
      })
      return {
        id: subsubcategory.id,
        name: subsubcategory.name,
        color: subsubcategory.color,
      }
    } catch (error) {
      console.error("Error al actualizar sub-subcategoría:", error)
      throw error
    }
  } else {
    // Simular actualización cuando no hay base de datos
    return {
      id: subsubcategoryId,
      name: data.name || "",
      color: data.color || "",
    }
  }
}

// Eliminar una sub-subcategoría
export async function deleteSubsubcategory(categoryId: string, subcategoryId: string, subsubcategoryId: string) {
  if (isDatabaseAvailable()) {
    try {
      await prisma.subsubcategory.delete({
        where: { id: subsubcategoryId },
      })
      return true
    } catch (error) {
      console.error("Error al eliminar sub-subcategoría:", error)
      throw error
    }
  } else {
    // Simular eliminación cuando no hay base de datos
    return true
  }
}

