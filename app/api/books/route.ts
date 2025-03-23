import { NextResponse } from "next/server"
import { getAllBooks, createBook, updateBook, deleteBook, searchBooks } from "../../../services/book-service"
import { isDatabaseAvailable } from "../../../lib/db"

// GET: Obtener todos los libros o buscar libros por query
export async function GET(request: Request) {
  try {
    // Verificar si hay un parámetro de búsqueda
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")

    if (query) {
      // Si hay un parámetro de búsqueda, buscar libros
      const books = await searchBooks(query)
      return NextResponse.json(books)
    } else {
      // Si no hay parámetro de búsqueda, obtener todos los libros
      const books = await getAllBooks()
      return NextResponse.json(books)
    }
  } catch (error) {
    console.error("Error al obtener libros:", error)
    return NextResponse.json({ error: "Error al obtener libros" }, { status: 500 })
  }
}

// POST: Crear un nuevo libro
export async function POST(request: Request) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json(
        { error: "Las variables de entorno de la base de datos no están configuradas" },
        { status: 500 },
      )
    }

    const data = await request.json()
    const book = await createBook(data)
    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    console.error("Error al crear libro:", error)
    return NextResponse.json({ error: "Error al crear libro" }, { status: 500 })
  }
}

// PUT: Actualizar un libro existente
export async function PUT(request: Request) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json(
        { error: "Las variables de entorno de la base de datos no están configuradas" },
        { status: 500 },
      )
    }

    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json({ error: "Se requiere un ID para actualizar el libro" }, { status: 400 })
    }

    const book = await updateBook(id, updateData)
    return NextResponse.json(book)
  } catch (error) {
    console.error("Error al actualizar libro:", error)
    return NextResponse.json({ error: "Error al actualizar libro" }, { status: 500 })
  }
}

// DELETE: Eliminar un libro
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

    if (!id) {
      return NextResponse.json({ error: "Se requiere un ID para eliminar el libro" }, { status: 400 })
    }

    await deleteBook(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar libro:", error)
    return NextResponse.json({ error: "Error al eliminar libro" }, { status: 500 })
  }
}