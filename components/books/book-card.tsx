"use client"

import type { Book } from "@/types"
import { useLibrary } from "@/context/library-context"
import { Card, CardContent, CardFooter } from "../ui/card"
import { Button } from "../ui/button"
import { Edit, Eye, Trash2 } from "lucide-react"
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

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const { getCategory, getSubCategory, getSubSubCategory, deleteBook } = useLibrary()
  const router = useRouter()

  const category = getCategory(book.categoryId)
  const subCategory = getSubCategory(book.categoryId, book.subCategoryId)
  const subSubCategory = getSubSubCategory(book.categoryId, book.subCategoryId, book.subSubCategoryId)

  const handleDelete = () => {
    deleteBook(book.id)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="w-1/3">
            <img
              src={book.coverImage || "/placeholder.svg?height=200&width=150"}
              alt={book.title}
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
          <div className="w-2/3">
            <h3 className="font-bold text-lg">{book.title}</h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>

            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category?.color }}></div>
                <span className="text-xs">{category?.name}</span>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subCategory?.color }}></div>
                <span className="text-xs">{subCategory?.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subSubCategory?.color }}></div>
                <span className="text-xs">{subSubCategory?.name}</span>
              </div>
            </div>

            <p className="text-xs mt-2">
              <span className="font-medium">Ubicación:</span> {book.shelfLocation}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-0">
        <Link href={`/dashboard/books/${book.id}`}>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
        </Link>
        <Link href={`/dashboard/books/${book.id}/edit`}>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />
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
      </CardFooter>
    </Card>
  )
}

