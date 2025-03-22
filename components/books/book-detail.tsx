"use client"

import type { Book } from "@/types"
import { useLibrary } from "@/context/library-context"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"

interface BookDetailProps {
  book: Book
}

export function BookDetail({ book }: BookDetailProps) {
  const { getCategory, getSubCategory, getSubSubCategory, deleteBook } = useLibrary()
  const router = useRouter()

  const category = getCategory(book.categoryId)
  const subCategory = getSubCategory(book.categoryId, book.subCategoryId)
  const subSubCategory = getSubSubCategory(book.categoryId, book.subCategoryId, book.subSubCategoryId)

  const handleDelete = () => {
    deleteBook(book.id)
    router.push("/books")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{book.title}</h1>
        <div className="flex gap-2">
          <Link href={`/books/${book.id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. El libro será eliminado permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <img
            src={book.coverImage || "/placeholder.svg?height=400&width=300"}
            alt={book.title}
            className="w-full h-auto object-cover rounded-md shadow-md"
          />
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Información del Libro</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Autor</p>
                      <p className="font-medium">{book.author}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ubicación</p>
                      <p className="font-medium">{book.shelfLocation}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">Clasificación</h2>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: category?.color }}></div>
                      <div>
                        <p className="text-sm text-muted-foreground">Categoría</p>
                        <p className="font-medium">{category?.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: subCategory?.color }}></div>
                      <div>
                        <p className="text-sm text-muted-foreground">Subcategoría</p>
                        <p className="font-medium">{subCategory?.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: subSubCategory?.color }}
                      ></div>
                      <div>
                        <p className="text-sm text-muted-foreground">Sub-subcategoría</p>
                        <p className="font-medium">{subSubCategory?.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

