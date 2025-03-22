import { BookList } from "@/components/books/book-list"
import { BookSearch } from "@/components/books/book-search"
import { Button } from "../../../components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function BooksPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Libros</h1>
        <Link href="/dashboard/books/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Libro
          </Button>
        </Link>
      </div>

      {/* <BookSearch /> */}

      <BookList />
    </div>
  )
}

