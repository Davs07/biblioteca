"use client"

import { useRouter } from "next/navigation"
import type { Book } from "@/types"
import { BookForm } from "@/components/books/book-form"

interface BookFormContainerProps {
  book?: Book
}

export function BookFormContainer({ book }: BookFormContainerProps) {
  const router = useRouter()

  const handleComplete = () => {
    if (book) {
      router.push(`/books/${book.id}`)
    } else {
      router.push("/books")
    }
  }

  return <BookForm book={book} onComplete={handleComplete} />
}

