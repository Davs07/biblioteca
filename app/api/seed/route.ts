import { NextResponse } from "next/server"
import { seedDatabase } from "../../../lib/seed"
import { isDatabaseAvailable } from "../../../lib/db"

export async function GET() {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json(
        { error: "Las variables de entorno de la base de datos no están configuradas" },
        { status: 500 },
      )
    }

    await seedDatabase()
    return NextResponse.json({ success: true, message: "Base de datos sembrada con éxito" })
  } catch (error) {
    console.error("Error al sembrar la base de datos:", error)
    return NextResponse.json({ error: "Error al sembrar la base de datos", details: error }, { status: 500 })
  }
}

