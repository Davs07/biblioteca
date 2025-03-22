"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useLibrary } from "@/context/library-context"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { BookCard } from "@/components/books/book-card"
import { Search } from "lucide-react"
import type { Book } from "@/types"

export function AdvancedSearch() {
  const searchParams = useSearchParams()
  const { books, categories } = useLibrary()

  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [subCategoryId, setSubCategoryId] = useState("")
  const [subSubCategoryId, setSubSubCategoryId] = useState("")
  const [results, setResults] = useState<Book[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const selectedCategory = categories.find((c) => c.id === categoryId)
  const subCategories = selectedCategory?.subCategories || []

  const selectedSubCategory = subCategories.find((sc) => sc.id === subCategoryId)
  const subSubCategories = selectedSubCategory?.subSubCategories || []

  // Procesar parámetros de búsqueda iniciales
  useEffect(() => {
    const q = searchParams.get("q")
    if (q) {
      setTitle(q)
      handleSearch()
    }
  }, [searchParams])

  const handleSearch = () => {
    const filteredBooks = books.filter((book) => {
      const matchesTitle = title ? book.title.toLowerCase().includes(title.toLowerCase()) : true
      const matchesAuthor = author ? book.author.toLowerCase().includes(author.toLowerCase()) : true
      const matchesCategory = categoryId ? book.categoryId === categoryId : true
      const matchesSubCategory = subCategoryId ? book.subCategoryId === subCategoryId : true
      const matchesSubSubCategory = subSubCategoryId ? book.subSubCategoryId === subSubCategoryId : true

      return matchesTitle && matchesAuthor && matchesCategory && matchesSubCategory && matchesSubSubCategory
    })

    setResults(filteredBooks)
    setHasSearched(true)
  }

  const handleReset = () => {
    setTitle("")
    setAuthor("")
    setCategoryId("")
    setSubCategoryId("")
    setSubSubCategoryId("")
    setResults([])
    setHasSearched(false)
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="title" className="mb-2 block">
            Título
          </Label>
          <Input
            id="title"
            placeholder="Buscar por título..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="author" className="mb-2 block">
            Autor
          </Label>
          <Input
            id="author"
            placeholder="Buscar por autor..."
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="category" className="mb-2 block">
            Categoría
          </Label>
          <Select
            value={categoryId}
            onValueChange={(value) => {
              setCategoryId(value)
              setSubCategoryId("")
              setSubSubCategoryId("")
            }}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las categorías</SelectItem>
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

        <div>
          <Label htmlFor="subCategory" className="mb-2 block">
            Subcategoría
          </Label>
          <Select
            value={subCategoryId}
            onValueChange={(value) => {
              setSubCategoryId(value)
              setSubSubCategoryId("")
            }}
            disabled={!categoryId}
          >
            <SelectTrigger id="subCategory">
              <SelectValue placeholder="Todas las subcategorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las subcategorías</SelectItem>
              {subCategories.map((subCategory) => (
                <SelectItem key={subCategory.id} value={subCategory.id}>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: subCategory.color }}></div>
                    {subCategory.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="subSubCategory" className="mb-2 block">
            Sub-subcategoría
          </Label>
          <Select value={subSubCategoryId} onValueChange={setSubSubCategoryId} disabled={!subCategoryId}>
            <SelectTrigger id="subSubCategory">
              <SelectValue placeholder="Todas las sub-subcategorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las sub-subcategorías</SelectItem>
              {subSubCategories.map((subSubCategory) => (
                <SelectItem key={subSubCategory.id} value={subSubCategory.id}>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: subSubCategory.color }}></div>
                    {subSubCategory.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end gap-2">
          <Button onClick={handleSearch} className="flex-1">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Limpiar
          </Button>
        </div>
      </div>

      {hasSearched && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Resultados ({results.length})</h2>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg">
              <p className="text-muted-foreground">No se encontraron libros que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

