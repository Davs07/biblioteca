"use client"

import { useLibrary } from "@/context/library-context"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function RecentBooks() {
  const { books } = useLibrary()

  // Obtener los 5 libros más recientes (simulado)
  const recentBooks = [...books].slice(0, 5)

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Libros Recientes</CardTitle>
        <Link href="/dashboard/books">
          <Button variant="ghost" size="sm">
            Ver todos
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentBooks.map((book) => (
            <div key={book.id} className="flex items-center">
              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center mr-3">
                <span className="text-xs font-medium">{book.title.substring(0, 2).toUpperCase()}</span>
              </div>
              <div className="flex-1 space-y-1">
                <Link href={`/dashboard/books/${book.id}`} className="font-medium hover:underline">
                  {book.title}
                </Link>
                <p className="text-xs text-muted-foreground">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

