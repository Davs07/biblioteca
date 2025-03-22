"use client"

import { BookFormContainer } from "@/components/books/book-form-container"
import { Button } from "../../../../components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function AddBookPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Link href="/dashboard/books">
          <Button variant="ghost" className="pl-0">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver a Libros
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Agregar Nuevo Libro</h1>

      <div className="max-w-2xl mx-auto">
        <BookFormContainer />
      </div>
    </div>
  )
}

