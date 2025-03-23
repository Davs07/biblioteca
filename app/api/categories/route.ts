import { NextResponse } from "next/server"
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  createSubsubcategory,
  updateSubsubcategory,
  deleteSubsubcategory,
} from "../../../services/category-service"
import { isDatabaseAvailable } from "../../../lib/db"

// GET: Obtener todas las categorías
export async function GET() {
  try {
    const categories = await getAllCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 })
  }
}

// POST: Crear una nueva categoría, subcategoría o sub-subcategoría
export async function POST(request: Request) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json(
        { error: "Las variables de entorno de la base de datos no están configuradas" },
        { status: 500 },
      )
    }

    const data = await request.json()
    const { type, categoryId, subcategoryId, ...categoryData } = data

    // Determinar qué tipo de categoría crear
    if (type === "subcategory" && categoryId) {
      // Crear subcategoría
      const subcategory = await createSubcategory(categoryId, categoryData)
      return NextResponse.json(subcategory, { status: 201 })
    } else if (type === "subsubcategory" && categoryId && subcategoryId) {
      // Crear sub-subcategoría
      const subsubcategory = await createSubsubcategory(categoryId, subcategoryId, categoryData)
      return NextResponse.json(subsubcategory, { status: 201 })
    } else {
      // Crear categoría principal
      const category = await createCategory(categoryData)
      return NextResponse.json(category, { status: 201 })
    }
  } catch (error) {
    console.error("Error al crear categoría:", error)
    return NextResponse.json({ error: "Error al crear categoría" }, { status: 500 })
  }
}

// PUT: Actualizar una categoría, subcategoría o sub-subcategoría existente
export async function PUT(request: Request) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json(
        { error: "Las variables de entorno de la base de datos no están configuradas" },
        { status: 500 },
      )
    }

    const data = await request.json()
    const { id, type, categoryId, subcategoryId, ...updateData } = data

    if (!id) {
      return NextResponse.json({ error: "Se requiere un ID para actualizar la categoría" }, { status: 400 })
    }

    // Determinar qué tipo de categoría actualizar
    if (type === "subcategory" && categoryId) {
      // Actualizar subcategoría
      const subcategory = await updateSubcategory(categoryId, id, updateData)
      return NextResponse.json(subcategory)
    } else if (type === "subsubcategory" && categoryId && subcategoryId) {
      // Actualizar sub-subcategoría
      const subsubcategory = await updateSubsubcategory(categoryId, subcategoryId, id, updateData)
      return NextResponse.json(subsubcategory)
    } else {
      // Actualizar categoría principal
      const category = await updateCategory(id, updateData)
      return NextResponse.json(category)
    }
  } catch (error) {
    console.error("Error al actualizar categoría:", error)
    return NextResponse.json({ error: "Error al actualizar categoría" }, { status: 500 })
  }
}

// DELETE: Eliminar una categoría, subcategoría o sub-subcategoría
export async function DELETE(request: Request) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json(
        { error: "Las variables de entorno de la base de datos no están configuradas" },
        { status: 500 },
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const type = searchParams.get("type")
    const categoryId = searchParams.get("categoryId")
    const subcategoryId = searchParams.get("subcategoryId")

    if (!id) {
      return NextResponse.json({ error: "Se requiere un ID para eliminar la categoría" }, { status: 400 })
    }

    // Determinar qué tipo de categoría eliminar
    if (type === "subcategory" && categoryId) {
      // Eliminar subcategoría
      await deleteSubcategory(categoryId, id)
      return NextResponse.json({ success: true })
    } else if (type === "subsubcategory" && categoryId && subcategoryId) {
      // Eliminar sub-subcategoría
      await deleteSubsubcategory(categoryId, subcategoryId, id)
      return NextResponse.json({ success: true })
    } else {
      // Eliminar categoría principal
      await deleteCategory(id)
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error("Error al eliminar categoría:", error)
    return NextResponse.json({ error: "Error al eliminar categoría" }, { status: 500 })
  }
}