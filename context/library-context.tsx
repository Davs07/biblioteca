"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Book, Category } from "@/types";
import { isDatabaseAvailable } from "../lib/db";
import { fetchAPI, postAPI, putAPI, deleteAPI } from "@/lib/api";

interface LibraryContextType {
  categories: Category[];
  books: Book[];
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addSubCategory: (
    categoryId: string,
    subCategory: Omit<Category["subCategories"][0], "id">
  ) => void;
  updateSubCategory: (
    categoryId: string,
    subCategoryId: string,
    subCategory: Partial<Category["subCategories"][0]>
  ) => void;
  deleteSubCategory: (categoryId: string, subCategoryId: string) => void;
  addSubSubCategory: (
    categoryId: string,
    subCategoryId: string,
    subSubCategory: Omit<
      Category["subCategories"][0]["subSubCategories"][0],
      "id"
    >
  ) => void;
  updateSubSubCategory: (
    categoryId: string,
    subCategoryId: string,
    subSubCategoryId: string,
    subSubCategory: Partial<Category["subCategories"][0]["subSubCategories"][0]>
  ) => void;
  deleteSubSubCategory: (
    categoryId: string,
    subCategoryId: string,
    subSubCategoryId: string
  ) => void;
  addBook: (book: Omit<Book, "id">) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  searchBooks: (query: string) => Promise<Book[]>;
  getCategory: (categoryId: string) => Category | undefined;
  getSubCategory: (
    categoryId: string,
    subCategoryId: string
  ) => Category["subCategories"][0] | undefined;
  getSubSubCategory: (
    categoryId: string,
    subCategoryId: string,
    subSubCategoryId: string
  ) => Category["subCategories"][0]["subSubCategories"][0] | undefined;
  isLoading: boolean;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    async function loadInitialData() {
      try {
        // Cargar categorías desde la API
        const dbCategories = await fetchAPI<Category[]>("categories");
        setCategories(dbCategories);

        // Cargar libros desde la API
        const dbBooks = await fetchAPI<Book[]>("books");
        setBooks(dbBooks);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        // En caso de error, usar arrays vacíos como fallback
        setCategories([]);
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const addCategory = async (category: Omit<Category, "id">) => {
    try {
      if (isDatabaseAvailable()) {
        // Usar la API en lugar del servicio directo
        const newCategory = await postAPI<Category>("categories", {
          name: category.name,
          color: category.color,
        });
        setCategories([...categories, newCategory]);
      } else {
        const newCategory: Category = {
          ...category,
          id: crypto.randomUUID(),
          subCategories: [],
        };
        setCategories([...categories, newCategory]);
      }
    } catch (error) {
      console.error("Error al añadir categoría:", error);
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      if (isDatabaseAvailable()) {
        // Usar la API en lugar del servicio directo
        await putAPI("categories", {
          id,
          name: category.name,
          color: category.color,
        });
      }
      setCategories(
        categories.map((c) => (c.id === id ? { ...c, ...category } : c))
      );
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      if (isDatabaseAvailable()) {
        // Usar la API en lugar del servicio directo
        await deleteAPI("categories", { id });
      }
      setCategories(categories.filter((c) => c.id !== id));
      // También eliminar todos los libros en esta categoría
      setBooks(books.filter((b) => b.categoryId !== id));
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
    }
  };

  const addSubCategory = async (
    categoryId: string,
    subCategory: Omit<Category["subCategories"][0], "id">
  ) => {
    try {
      if (isDatabaseAvailable()) {
        // Usar la API en lugar del servicio directo
        const newSubCategory = await postAPI<Category["subCategories"][0]>("categories", {
          type: "subcategory",
          categoryId,
          name: subCategory.name,
          color: subCategory.color,
        });

        // Actualizar categorías con tipado explícito
        setCategories(
          categories.map((c) => {
            if (c.id === categoryId) {
              return {
                ...c,
                subCategories: [...c.subCategories, newSubCategory] as Category["subCategories"]
              };
            }
            return c;
          })
        );
      } else {
        const newSubCategory: Category["subCategories"][0] = {
          ...subCategory,
          id: crypto.randomUUID(),
          subSubCategories: [],
        };
        
        setCategories(
          categories.map((c) => {
            if (c.id === categoryId) {
              return {
                ...c,
                subCategories: [...c.subCategories, newSubCategory]
              };
            }
            return c;
          })
        );
      }
    } catch (error) {
      console.error("Error al añadir subcategoría:", error);
    }
  };

  const updateSubCategory = async (
    categoryId: string,
    subCategoryId: string,
    subCategory: Partial<Category["subCategories"][0]>
  ) => {
    try {
      if (isDatabaseAvailable()) {
        // Usar la API en lugar del servicio directo
        await putAPI("categories", {
          type: "subcategory",
          categoryId,
          id: subCategoryId,
          name: subCategory.name,
          color: subCategory.color,
        });
      }
      setCategories(
        categories.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                subCategories: c.subCategories.map((sc) =>
                  sc.id === subCategoryId ? { ...sc, ...subCategory } : sc
                ),
              }
            : c
        )
      );
    } catch (error) {
      console.error("Error al actualizar subcategoría:", error);
    }
  };

  const deleteSubCategory = async (
    categoryId: string,
    subCategoryId: string
  ) => {
    try {
      if (isDatabaseAvailable()) {
        // Usar la API en lugar del servicio directo
        await deleteAPI("categories", { 
          type: "subcategory",
          categoryId,
          id: subCategoryId 
        });
      }
      setCategories(
        categories.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                subCategories: c.subCategories.filter(
                  (sc) => sc.id !== subCategoryId
                ),
              }
            : c
        )
      );
      // También eliminar todos los libros en esta subcategoría
      setBooks(
        books.filter(
          (b) =>
            !(b.categoryId === categoryId && b.subCategoryId === subCategoryId)
        )
      );
    } catch (error) {
      console.error("Error al eliminar subcategoría:", error);
    }
  };

  const addSubSubCategory = async (
    categoryId: string,
    subCategoryId: string,
    subSubCategory: Omit<
      Category["subCategories"][0]["subSubCategories"][0],
      "id"
    >
  ) => {
    try {
      if (isDatabaseAvailable()) {
        // Usar la API en lugar del servicio directo
        const newSubSubCategory = await postAPI<Category["subCategories"][0]["subSubCategories"][0]>("categories", {
          type: "subsubcategory",
          categoryId,
          subcategoryId: subCategoryId,
          name: subSubCategory.name,
          color: subSubCategory.color,
        });
        
        // Actualizar categorías con tipado explícito
        setCategories(
          categories.map((c) => {
            if (c.id === categoryId) {
              return {
                ...c,
                subCategories: c.subCategories.map((sc) => {
                  if (sc.id === subCategoryId) {
                    return {
                      ...sc,
                      subSubCategories: [
                        ...sc.subSubCategories, 
                        newSubSubCategory
                      ] as Category["subCategories"][0]["subSubCategories"]
                    };
                  }
                  return sc;
                })
              };
            }
            return c;
          })
        );
      } else {
        const newSubSubCategory: Category["subCategories"][0]["subSubCategories"][0] = {
          ...subSubCategory,
          id: crypto.randomUUID(),
        };
        
        setCategories(
          categories.map((c) => {
            if (c.id === categoryId) {
              return {
                ...c,
                subCategories: c.subCategories.map((sc) => {
                  if (sc.id === subCategoryId) {
                    return {
                      ...sc,
                      subSubCategories: [
                        ...sc.subSubCategories, 
                        newSubSubCategory
                      ]
                    };
                  }
                  return sc;
                })
              };
            }
            return c;
          })
        );
      }
    } catch (error) {
      console.error("Error al añadir sub-subcategoría:", error);
    }
  };

  const updateSubSubCategory = async (
    categoryId: string,
    subCategoryId: string,
    subSubCategoryId: string,
    subSubCategory: Partial<Category["subCategories"][0]["subSubCategories"][0]>
  ) => {
    try {
      if (isDatabaseAvailable()) {
        // Usar la API en lugar del servicio directo
        await putAPI("categories", {
          type: "subsubcategory",
          categoryId,
          subcategoryId: subCategoryId,
          id: subSubCategoryId,
          name: subSubCategory.name,
          color: subSubCategory.color,
        });
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
                          ssc.id === subSubCategoryId
                            ? { ...ssc, ...subSubCategory }
                            : ssc
                        ),
                      }
                    : sc
                ),
              }
            : c
        )
      );
    } catch (error) {
      console.error("Error al actualizar sub-subcategoría:", error);
    }
  };

  const deleteSubSubCategory = async (
    categoryId: string,
    subCategoryId: string,
    subSubCategoryId: string
  ) => {
    try {
      if (isDatabaseAvailable()) {
        // Usar la API en lugar del servicio directo
        await deleteAPI("categories", {
          type: "subsubcategory",
          categoryId,
          subcategoryId: subCategoryId,
          id: subSubCategoryId
        });
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
                        subSubCategories: sc.subSubCategories.filter(
                          (ssc) => ssc.id !== subSubCategoryId
                        ),
                      }
                    : sc
                ),
              }
            : c
        )
      );
      // También eliminar todos los libros en esta sub-subcategoría
      setBooks(
        books.filter(
          (b) =>
            !(
              b.categoryId === categoryId &&
              b.subCategoryId === subCategoryId &&
              b.subSubCategoryId === subSubCategoryId
            )
        )
      );
    } catch (error) {
      console.error("Error al eliminar sub-subcategoría:", error);
    }
  };

  const addBook = async (book: Omit<Book, "id">) => {
    try {
      if (isDatabaseAvailable()) {
        // Usar la API en lugar del servicio directo
        const newBook = await postAPI<Book>("books", book);
        setBooks([...books, newBook]);
      } else {
        const newBook: Book = {
          ...book,
          id: crypto.randomUUID(),
        };
        setBooks([...books, newBook]);
      }
    } catch (error) {
      console.error("Error al añadir libro:", error);
    }
  };

  const updateBook = async (id: string, book: Partial<Book>) => {
    try {
      if (isDatabaseAvailable()) {
        // Usar la API en lugar del servicio directo
        await putAPI("books", { id, ...book });
      }
      setBooks(books.map((b) => (b.id === id ? { ...b, ...book } : b)));
    } catch (error) {
      console.error("Error al actualizar libro:", error);
    }
  };

  const deleteBook = async (id: string) => {
    try {
      if (isDatabaseAvailable()) {
        // Usar la API en lugar del servicio directo
        await deleteAPI("books", { id });
      }
      setBooks(books.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error al eliminar libro:", error);
    }
  };

  const searchBooks = async (query: string): Promise<Book[]> => {
    if (!query) return books;
    
    if (isDatabaseAvailable()) {
      try {
        // Usar la API para buscar libros cuando la base de datos está disponible
        const searchResults = await fetchAPI<Book[]>("books", { query });
        return searchResults;
      } catch (error) {
        console.error("Error al buscar libros a través de la API:", error);
        // Si hay un error en la API, hacer la búsqueda localmente como fallback
        const lowerQuery = query.toLowerCase();
        return books.filter((book) =>
          book.title.toLowerCase().includes(lowerQuery) || 
          book.author.toLowerCase().includes(lowerQuery)
        );
      }
    } else {
      // Cuando la base de datos no está disponible, hacer la búsqueda localmente
      const lowerQuery = query.toLowerCase();
      return books.filter((book) =>
        book.title.toLowerCase().includes(lowerQuery) || 
        book.author.toLowerCase().includes(lowerQuery)
      );
    }
  };

  const getCategory = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

  const getSubCategory = (categoryId: string, subCategoryId: string) => {
    const category = getCategory(categoryId);
    return category?.subCategories.find((sc) => sc.id === subCategoryId);
  };

  const getSubSubCategory = (
    categoryId: string,
    subCategoryId: string,
    subSubCategoryId: string
  ) => {
    const subCategory = getSubCategory(categoryId, subCategoryId);
    return subCategory?.subSubCategories.find(
      (ssc) => ssc.id === subSubCategoryId
    );
  };

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
      }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
}