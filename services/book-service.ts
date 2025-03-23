// import { prisma } from "../lib/prisma";/*  */
import { isDatabaseAvailable } from "../lib/db";
import { PrismaClient } from "@prisma/client";

// Obtener todos los libros
const prisma = new PrismaClient();
export async function getAllBooks() {
  console.log("Obteniendo libros...", prisma.book.findMany());
  try {
    const books = (await prisma?.book.findMany()) ?? [];

    // Transformar los datos para que coincidan con el formato esperado por la aplicación
    return books.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      categoryId: book.categoryId,
      subCategoryId: book.subcategoryId,
      subSubCategoryId: book.subsubcategoryId,
      shelfLocation: book.shelfLocation,
      coverImage: book.coverImage || "/placeholder.svg?height=200&width=150",
    }));
  } catch (error) {
    console.error("Error al obtener libros:", error);
    throw error; // Lanzar el error para que sea manejado por el contexto
  }
}

// Crear un nuevo libro
export async function createBook(data: {
  title: string;
  author: string;
  categoryId: string;
  subCategoryId: string;
  subSubCategoryId: string;
  shelfLocation: string;
  coverImage?: string;
}) {
  if (isDatabaseAvailable()) {
    try {
      const book = await prisma.book.create({
        data: {
          title: data.title,
          author: data.author,
          categoryId: data.categoryId,
          subcategoryId: data.subCategoryId,
          subsubcategoryId: data.subSubCategoryId,
          shelfLocation: data.shelfLocation,
          coverImage:
            data.coverImage || "/placeholder.svg?height=200&width=150",
        },
      });

      return {
        id: book.id,
        title: book.title,
        author: book.author,
        categoryId: book.categoryId,
        subCategoryId: book.subcategoryId,
        subSubCategoryId: book.subsubcategoryId,
        shelfLocation: book.shelfLocation,
        coverImage: book.coverImage || "/placeholder.svg?height=200&width=150",
      };
    } catch (error) {
      console.error("Error al crear libro:", error);
      throw error;
    }
  } else {
    // Simular creación cuando no hay base de datos
    return {
      id: crypto.randomUUID(),
      title: data.title,
      author: data.author,
      categoryId: data.categoryId,
      subCategoryId: data.subCategoryId,
      subSubCategoryId: data.subSubCategoryId,
      shelfLocation: data.shelfLocation,
      coverImage: data.coverImage || "/placeholder.svg?height=200&width=150",
    };
  }
}

// Actualizar un libro
export async function updateBook(
  id: string,
  data: {
    title?: string;
    author?: string;
    categoryId?: string;
    subCategoryId?: string;
    subSubCategoryId?: string;
    shelfLocation?: string;
    coverImage?: string;
  }
) {
  if (isDatabaseAvailable()) {
    try {
      const book = await prisma.book.update({
        where: { id },
        data: {
          title: data.title,
          author: data.author,
          categoryId: data.categoryId,
          subcategoryId: data.subCategoryId,
          subsubcategoryId: data.subSubCategoryId,
          shelfLocation: data.shelfLocation,
          coverImage: data.coverImage,
        },
      });

      return {
        id: book.id,
        title: book.title,
        author: book.author,
        categoryId: book.categoryId,
        subCategoryId: book.subcategoryId,
        subSubCategoryId: book.subsubcategoryId,
        shelfLocation: book.shelfLocation,
        coverImage: book.coverImage || "/placeholder.svg?height=200&width=150",
      };
    } catch (error) {
      console.error("Error al actualizar libro:", error);
      throw error;
    }
  } else {
    // Simular actualización cuando no hay base de datos
    return {
      id,
      title: data.title || "",
      author: data.author || "",
      categoryId: data.categoryId || "",
      subCategoryId: data.subCategoryId || "",
      subSubCategoryId: data.subSubCategoryId || "",
      shelfLocation: data.shelfLocation || "",
      coverImage: data.coverImage || "/placeholder.svg?height=200&width=150",
    };
  }
}

// Eliminar un libro
export async function deleteBook(id: string) {
  if (isDatabaseAvailable()) {
    try {
      await prisma.book.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error al eliminar libro:", error);
      throw error;
    }
  } else {
    // Simular eliminación cuando no hay base de datos
    return true;
  }
}

// Buscar libros
export async function searchBooks(query: string) {
  if (isDatabaseAvailable()) {
    try {
      const books = await prisma.book.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { author: { contains: query, mode: "insensitive" } },
          ],
        },
      });

      return books.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        categoryId: book.categoryId,
        subCategoryId: book.subcategoryId,
        subSubCategoryId: book.subsubcategoryId,
        shelfLocation: book.shelfLocation,
        coverImage: book.coverImage || "/placeholder.svg?height=200&width=150",
      }));
    } catch (error) {
      console.error("Error al buscar libros:", error);

      // Si hay un error, devolver un array vacío
      console.error("Error al buscar libros, devolviendo array vacío");
      return [];
    }
  } else {
    // Cuando la base de datos no está disponible, devolver un array vacío
    console.log(
      "Base de datos no disponible para búsqueda, devolviendo array vacío"
    );
    return [];
  }
}
