"use client"

import { useState } from "react"
import { useLibrary } from "@/context/library-context"
import { BookCard } from "@/components/books/book-card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export function BookList() {
  const { books, categories } = useLibrary()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  // Filtrar libros por búsqueda y categoría
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter ? book.categoryId === categoryFilter : true

    return matchesSearch && matchesCategory
  })

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Label htmlFor="search" className="mb-2 block">
            Buscar
          </Label>
          <Input
            id="search"
            placeholder="Buscar por título o autor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full md:w-64">
          <Label htmlFor="category" className="mb-2 block">
            Filtrar por categoría
          </Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}

        {filteredBooks.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No se encontraron libros que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  )
}

