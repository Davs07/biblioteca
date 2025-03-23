"use client"

import { useRouter } from "next/navigation"
import type { Book } from "@/types"
import { BookForm } from "@/components/books/book-form"
import { postAPI, putAPI } from "@/lib/api"

interface BookFormContainerProps {
  book?: Book
}

export function BookFormContainer({ book }: BookFormContainerProps) {
  const router = useRouter()

  const handleSubmit = async (bookData: Omit<Book, "id">) => {
    try {
      if (book) {
        // Actualizar libro existente
        await putAPI("books", {
          id: book.id,
          ...bookData
        })
      } else {
        // Crear nuevo libro
        await postAPI("books", bookData)
      }
      
      // Redirigir después de completar la operación
      if (book) {
        router.push(`/books/${book.id}`)
      } else {
        router.push("/books")
      }
    } catch (error) {
      console.error("Error al guardar el libro:", error)
      // Aquí se podría implementar un manejo de errores más sofisticado
    }
  }

  const handleComplete = () => {
    if (book) {
      router.push(`/books/${book.id}`)
    } else {
      router.push("/books")
    }
  }

  return <BookForm book={book} onComplete={handleComplete} onSubmit={handleSubmit} />
}

