import { NextResponse } from "next/server"
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../../../services/user-service"
import { isDatabaseAvailable } from "../../../lib/db"

// GET: Obtener todos los usuarios o un usuario específico por ID
export async function GET(request: Request) {
  try {
    // Verificar si hay un parámetro de ID
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (id) {
      // Si hay un ID, obtener el usuario específico
      const user = await getUserById(id)
      if (!user) {
        return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
      }
      return NextResponse.json(user)
    } else {
      // Si no hay ID, obtener todos los usuarios
      const users = await getAllUsers()
      return NextResponse.json(users)
    }
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}

// POST: Crear un nuevo usuario
export async function POST(request: Request) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json(
        { error: "Las variables de entorno de la base de datos no están configuradas" },
        { status: 500 },
      )
    }

    const data = await request.json()
    
    // Validar datos requeridos
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json(
        { error: "Se requiere nombre, correo electrónico y contraseña" },
        { status: 400 },
      )
    }

    try {
      const user = await createUser(data)
      return NextResponse.json(user, { status: 201 })
    } catch (error: any) {
      if (error.message === "El correo electrónico ya está registrado") {
        return NextResponse.json({ error: error.message }, { status: 409 })
      }
      throw error
    }
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}

// PUT: Actualizar un usuario existente
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
      return NextResponse.json({ error: "Se requiere un ID para actualizar el usuario" }, { status: 400 })
    }

    const user = await updateUser(id, updateData)
    return NextResponse.json(user)
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}

// DELETE: Eliminar un usuario
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
      return NextResponse.json({ error: "Se requiere un ID para eliminar el usuario" }, { status: 400 })
    }

    await deleteUser(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
  }
}