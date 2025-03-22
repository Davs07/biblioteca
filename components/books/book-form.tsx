"use client"

import type React from "react"

import { useState } from "react"
import { useLibrary } from "@/context/library-context"
import type { Book } from "@/types"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent } from "../ui/card"

interface BookFormProps {
  book?: Book
  onComplete: () => void
}

export function BookForm({ book, onComplete }: BookFormProps) {
  const { categories, addBook, updateBook } = useLibrary()

  const [title, setTitle] = useState(book?.title || "")
  const [author, setAuthor] = useState(book?.author || "")
  const [categoryId, setCategoryId] = useState(book?.categoryId || "")
  const [subCategoryId, setSubCategoryId] = useState(book?.subCategoryId || "")
  const [subSubCategoryId, setSubSubCategoryId] = useState(book?.subSubCategoryId || "")
  const [shelfLocation, setShelfLocation] = useState(book?.shelfLocation || "")

  const selectedCategory = categories.find((c) => c.id === categoryId)
  const subCategories = selectedCategory?.subCategories || []

  const selectedSubCategory = subCategories.find((sc) => sc.id === subCategoryId)
  const subSubCategories = selectedSubCategory?.subSubCategories || []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const bookData = {
      title,
      author,
      categoryId,
      subCategoryId,
      subSubCategoryId,
      shelfLocation,
      coverImage: book?.coverImage || "/placeholder.svg?height=200&width=150",
    }

    if (book) {
      updateBook(book.id, bookData)
    } else {
      addBook(bookData)
    }

    onComplete()
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Autor</Label>
            <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select
              value={categoryId}
              onValueChange={(value) => {
                setCategoryId(value)
                setSubCategoryId("")
                setSubSubCategoryId("")
              }}
              required
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subCategory">Subcategoría</Label>
            <Select
              value={subCategoryId}
              onValueChange={(value) => {
                setSubCategoryId(value)
                setSubSubCategoryId("")
              }}
              disabled={!categoryId}
              required
            >
              <SelectTrigger id="subCategory">
                <SelectValue placeholder="Seleccionar subcategoría" />
              </SelectTrigger>
              <SelectContent>
                {subCategories.map((subCategory) => (
                  <SelectItem key={subCategory.id} value={subCategory.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subCategory.color }}></div>
                      {subCategory.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subSubCategory">Sub-subcategoría</Label>
            <Select value={subSubCategoryId} onValueChange={setSubSubCategoryId} disabled={!subCategoryId} required>
              <SelectTrigger id="subSubCategory">
                <SelectValue placeholder="Seleccionar sub-subcategoría" />
              </SelectTrigger>
              <SelectContent>
                {subSubCategories.map((subSubCategory) => (
                  <SelectItem key={subSubCategory.id} value={subSubCategory.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subSubCategory.color }}></div>
                      {subSubCategory.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shelfLocation">Ubicación en estante</Label>
            <Input
              id="shelfLocation"
              value={shelfLocation}
              onChange={(e) => setShelfLocation(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onComplete}>
              Cancelar
            </Button>
            <Button type="submit">{book ? "Actualizar" : "Agregar"} Libro</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

