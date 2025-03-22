"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Book, Category } from "@/types"
import { initialCategories } from "@/data/categories"
import { initialBooks } from "@/data/books"
import { isDatabaseAvailable } from "../lib/db"
import * as CategoryService from "@/services/category-service"
import * as BookService from "@/services/book-service"

interface LibraryContextType {
  categories: Category[]
  books: Book[]
  addCategory: (category: Omit<Category, "id">) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void
  addSubCategory: (categoryId: string, subCategory: Omit<Category["subCategories"][0], "id">) => void
  updateSubCategory: (
    categoryId: string,
    subCategoryId: string,
    subCategory: Partial<Category["subCategories"][0]>,
  ) => void
  deleteSubCategory: (categoryId: string, subCategoryId: string) => void
  addSubSubCategory: (
    categoryId: string,
    subCategoryId: string,
    subSubCategory: Omit<Category["subCategories"][0]["subSubCategories"][0], "id">,
  ) => void
  updateSubSubCategory: (
    categoryId: string,
    subCategoryId: string,
    subSubCategoryId: string,
    subSubCategory: Partial<Category["subCategories"][0]["subSubCategories"][0]>,
  ) => void
  deleteSubSubCategory: (categoryId: string, subCategoryId: string, subSubCategoryId: string) => void
  addBook: (book: Omit<Book, "id">) => void
  updateBook: (id: string, book: Partial<Book>) => void
  deleteBook: (id: string) => void
  searchBooks: (query: string) => Book[]
  getCategory: (categoryId: string) => Category | undefined
  getSubCategory: (categoryId: string, subCategoryId: string) => Category["subCategories"][0] | undefined
  getSubSubCategory: (
    categoryId: string,
    subCategoryId: string,
    subSubCategoryId: string,
  ) => Category["subCategories"][0]["subSubCategories"][0] | undefined
  isLoading: boolean
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined)

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar datos iniciales
  useEffect(() => {
    async function loadInitialData() {
      try {
        if (isDatabaseAvailable()) {
          // Cargar categorías desde la base de datos
          const dbCategories = await CategoryService.getAllCategories()
          setCategories(dbCategories)

          // Cargar libros desde la base de datos
          const dbBooks = await BookService.getAllBooks()
          setBooks(dbBooks)
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [])

  const addCategory = async (category: Omit<Category, "id">) => {
    try {
      if (isDatabaseAvailable()) {
        const newCategory = await CategoryService.createCategory({
          name: category.name,
          color: category.color,
        })
        setCategories([...categories, newCategory])
      } else {
        const newCategory: Category = {
          ...category,
          id: crypto.randomUUID(),
          subCategories: [],
        }
        setCategories([...categories, newCategory])
      }
    } catch (error) {
      console.error("Error al añadir categoría:", error)
    }
  }

  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      if (isDatabaseAvailable()) {
        await CategoryService.updateCategory(id, {
          name: category.name,
          color: category.color,
        })
      }
      setCategories(categories.map((c) => (c.id === id ? { ...c, ...category } : c)))
    } catch (error) {
      console.error("Error al actualizar categoría:", error)
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      if (isDatabaseAvailable()) {
        await CategoryService.deleteCategory(id)
      }
      setCategories(categories.filter((c) => c.id !== id))
      // También eliminar todos los libros en esta categoría
      setBooks(books.filter((b) => b.categoryId !== id))
    } catch (error) {
      console.error("Error al eliminar categoría:", error)
    }
  }

  const addSubCategory = async (categoryId: string, subCategory: Omit<Category["subCategories"][0], "id">) => {
    try {
      if (isDatabaseAvailable()) {
        const newSubCategory = await CategoryService.createSubcategory(categoryId, {
          name: subCategory.name,
          color: subCategory.color,
        })
        setCategories(
          categories.map((c) =>
            c.id === categoryId ? { ...c, subCategories: [...c.subCategories, newSubCategory] } : c,
          ),
        )
      } else {
        const newSubCategory = {
          ...subCategory,
          id: crypto.randomUUID(),
          subSubCategories: [],
        }
        setCategories(
          categories.map((c) =>
            c.id === categoryId ? { ...c, subCategories: [...c.subCategories, newSubCategory] } : c,
          ),
        )
      }
    } catch (error) {
      console.error("Error al añadir subcategoría:", error)
    }
  }

  const updateSubCategory = async (
    categoryId: string,
    subCategoryId: string,
    subCategory: Partial<Category["subCategories"][0]>,
  ) => {
    try {
      if (isDatabaseAvailable()) {
        await CategoryService.updateSubcategory(categoryId, subCategoryId, {
          name: subCategory.name,
          color: subCategory.color,
        })
      }
      setCategories(
        categories.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                subCategories: c.subCategories.map((sc) => (sc.id === subCategoryId ? { ...sc, ...subCategory } : sc)),
              }
            : c,
        ),
      )
    } catch (error) {
      console.error("Error al actualizar subcategoría:", error)
    }
  }

  const deleteSubCategory = async (categoryId: string, subCategoryId: string) => {
    try {
      if (isDatabaseAvailable()) {
        await CategoryService.deleteSubcategory(categoryId, subCategoryId)
      }
      setCategories(
        categories.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                subCategories: c.subCategories.filter((sc) => sc.id !== subCategoryId),
              }
            : c,
        ),
      )
      // También eliminar todos los libros en esta subcategoría
      setBooks(books.filter((b) => !(b.categoryId === categoryId && b.subCategoryId === subCategoryId)))
    } catch (error) {
      console.error("Error al eliminar subcategoría:", error)
    }
  }

  const addSubSubCategory = async (
    categoryId: string,
    subCategoryId: string,
    subSubCategory: Omit<Category["subCategories"][0]["subSubCategories"][0], "id">,
  ) => {
    try {
      if (isDatabaseAvailable()) {
        const newSubSubCategory = await CategoryService.createSubsubcategory(categoryId, subCategoryId, {
          name: subSubCategory.name,
          color: subSubCategory.color,
        })
        setCategories(
          categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  subCategories: c.subCategories.map((sc) =>
                    sc.id === subCategoryId
                      ? {
                          ...sc,
                          subSubCategories: [...sc.subSubCategories, newSubSubCategory],
                        }
                      : sc,
                  ),
                }
              : c,
          ),
        )
      } else {
        const newSubSubCategory = {
          ...subSubCategory,
          id: crypto.randomUUID(),
        }
        setCategories(
          categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  subCategories: c.subCategories.map((sc) =>
                    sc.id === subCategoryId
                      ? {
                          ...sc,
                          subSubCategories: [...sc.subSubCategories, newSubSubCategory],
                        }
                      : sc,
                  ),
                }
              : c,
          ),
        )
      }
    } catch (error) {
      console.error("Error al añadir sub-subcategoría:", error)
    }
  }

  const updateSubSubCategory = async (
    categoryId: string,
    subCategoryId: string,
    subSubCategoryId: string,
    subSubCategory: Partial<Category["subCategories"][0]["subSubCategories"][0]>,
  ) => {
    try {
      if (isDatabaseAvailable()) {
        await CategoryService.updateSubsubcategory(categoryId, subCategoryId, subSubCategoryId, {
          name: subSubCategory.name,
          color: subSubCategory.color,
        })
      }
      setCategories(
        categories.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                subCategories: c.subCategories.map((sc) =>
                  sc.id === subCategoryId
                    ? {
                        ...sc,
                        subSubCategories: sc.subSubCategories.map((ssc) =>
                          ssc.id === subSubCategoryId ? { ...ssc, ...subSubCategory } : ssc,
                        ),
                      }
                    : sc,
                ),
              }
            : c,
        ),
      )
    } catch (error) {
      console.error("Error al actualizar sub-subcategoría:", error)
    }
  }

  const deleteSubSubCategory = async (categoryId: string, subCategoryId: string, subSubCategoryId: string) => {
    try {
      if (isDatabaseAvailable()) {
        await CategoryService.deleteSubsubcategory(categoryId, subCategoryId, subSubCategoryId)
      }
      setCategories(
        categories.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                subCategories: c.subCategories.map((sc) =>
                  sc.id === subCategoryId
                    ? {
                        ...sc,
                        subSubCategories: sc.subSubCategories.filter((ssc) => ssc.id !== subSubCategoryId),
                      }
                    : sc,
                ),
              }
            : c,
        ),
      )
      // También eliminar todos los libros en esta sub-subcategoría
      setBooks(
        books.filter(
          (b) =>
            !(
              b.categoryId === categoryId &&
              b.subCategoryId === subCategoryId &&
              b.subSubCategoryId === subSubCategoryId
            ),
        ),
      )
    } catch (error) {
      console.error("Error al eliminar sub-subcategoría:", error)
    }
  }

  const addBook = async (book: Omit<Book, "id">) => {
    try {
      if (isDatabaseAvailable()) {
        const newBook = await BookService.createBook(book)
        setBooks([...books, newBook])
      } else {
        const newBook: Book = {
          ...book,
          id: crypto.randomUUID(),
        }
        setBooks([...books, newBook])
      }
    } catch (error) {
      console.error("Error al añadir libro:", error)
    }
  }

  const updateBook = async (id: string, book: Partial<Book>) => {
    try {
      if (isDatabaseAvailable()) {
        await BookService.updateBook(id, book)
      }
      setBooks(books.map((b) => (b.id === id ? { ...b, ...book } : b)))
    } catch (error) {
      console.error("Error al actualizar libro:", error)
    }
  }

  const deleteBook = async (id: string) => {
    try {
      if (isDatabaseAvailable()) {
        await BookService.deleteBook(id)
      }
      setBooks(books.filter((b) => b.id !== id))
    } catch (error) {
      console.error("Error al eliminar libro:", error)
    }
  }

  const searchBooks = (query: string) => {
    if (!query) return books
    const lowerQuery = query.toLowerCase()
    return books.filter((book) => book.title.toLowerCase().includes(lowerQuery))
  }

  const getCategory = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)
  }

  const getSubCategory = (categoryId: string, subCategoryId: string) => {
    const category = getCategory(categoryId)
    return category?.subCategories.find((sc) => sc.id === subCategoryId)
  }

  const getSubSubCategory = (categoryId: string, subCategoryId: string, subSubCategoryId: string) => {
    const subCategory = getSubCategory(categoryId, subCategoryId)
    return subCategory?.subSubCategories.find((ssc) => ssc.id === subSubCategoryId)
  }

  return (
    <LibraryContext.Provider
      value={{
        categories,
        books,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubCategory,
        updateSubCategory,
        deleteSubCategory,
        addSubSubCategory,
        updateSubSubCategory,
        deleteSubSubCategory,
        addBook,
        updateBook,
        deleteBook,
        searchBooks,
        getCategory,
        getSubCategory,
        getSubSubCategory,
        isLoading,
      }}
    >
      {children}
    </LibraryContext.Provider>
  )
}

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (context === undefined) {
    throw new Error("useLibrary must be used within a LibraryProvider")
  }
  return context
}

