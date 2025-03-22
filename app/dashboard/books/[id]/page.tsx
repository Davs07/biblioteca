"use client"

import { useEffect, useState } from "react"
import { useLibrary } from "@/context/library-context"
import { BookDetail } from "@/components/books/book-detail"
import { Button } from "../../../../components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import type { Book } from "@/types"

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { books } = useLibrary()
  const [book, setBook] = useState<Book | null>(null)

  useEffect(() => {
    const bookId = params.id as string
    const foundBook = books.find((b) => b.id === bookId)

    if (foundBook) {
      setBook(foundBook)
    } else {
      router.push("/dashboard/books")
    }
  }, [params.id, books, router])

  if (!book) {
    return <div className="flex justify-center p-8">Cargando...</div>
  }

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

      <BookDetail book={book} />
    </div>
  )
}

