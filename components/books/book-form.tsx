"use client";

import { useState, useEffect } from "react";
import { useLibrary } from "@/context/library-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Book } from "@/types";
import { Loader2 } from "lucide-react";

interface BookFormProps {
  book?: Book;
  onSubmit: (bookData: Omit<Book, "id">) => Promise<void>;
  isSubmitting?: boolean;
}

export function BookForm({
  book,
  onSubmit,
  isSubmitting = false,
}: BookFormProps) {
  const { categories } = useLibrary();

  // Estados para todos los campos del libro
  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [coverImage, setCoverImage] = useState(book?.coverImage || "");
  const [categoryId, setCategoryId] = useState(book?.categoryId || "");
  const [subCategoryId, setSubCategoryId] = useState(book?.subCategoryId || "");
  const [subSubCategoryId, setSubSubCategoryId] = useState(
    book?.subSubCategoryId || ""
  );
  const [shelfLocation, setShelfLocation] = useState(book?.shelfLocation || "");

  // Estados para las opciones disponibles según la categoría seleccionada
  const [subCategories, setSubCategories] = useState(
    categories.find((c) => c.id === categoryId)?.subCategories || []
  );
  const [subSubCategories, setSubSubCategories] = useState(
    subCategories.find((sc) => sc.id === subCategoryId)?.subSubCategories || []
  );

  // Actualizar subcategorías cuando cambia la categoría
  useEffect(() => {
    if (categoryId) {
      const category = categories.find((c) => c.id === categoryId);
      setSubCategories(category?.subCategories || []);
      if (!category?.subCategories.some((sc) => sc.id === subCategoryId)) {
        setSubCategoryId("");
        setSubSubCategoryId("");
      }
    } else {
      setSubCategories([]);
      setSubCategoryId("");
      setSubSubCategoryId("");
    }
  }, [categoryId, categories, subCategoryId]);

  // Actualizar sub-subcategorías cuando cambia la subcategoría
  useEffect(() => {
    if (subCategoryId) {
      const subCategory = subCategories.find((sc) => sc.id === subCategoryId);
      setSubSubCategories(subCategory?.subSubCategories || []);
      if (
        !subCategory?.subSubCategories.some(
          (ssc) => ssc.id === subSubCategoryId
        )
      ) {
        setSubSubCategoryId("");
      }
    } else {
      setSubSubCategories([]);
      setSubSubCategoryId("");
    }
  }, [subCategoryId, subCategories, subSubCategoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Construir el objeto con los campos básicos obligatorios
    const bookData = {
      title,
      author,
      coverImage,
      categoryId,
      // Asegurarse de que subCategoryId y subSubCategoryId no sean undefined
      // Si no tienen valor, usar cadenas vacías como fallback
      subCategoryId: subCategoryId,
      subSubCategoryId: subSubCategoryId,
      shelfLocation,
    } as Omit<Book, "id">;

    await onSubmit(bookData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="author">Autor *</Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="coverImage">URL de portada</Label>
          <Input
            id="coverImage"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            type="url"
            placeholder="https://..."
            disabled={isSubmitting}
          />
          {coverImage && (
            <div className="mt-2 relative w-24 h-36 overflow-hidden rounded border">
              <img
                src={coverImage}
                alt="Portada del libro"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-cover.jpg";
                }}
              />
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="shelfLocation">Ubicación en Estante *</Label>
          <Input
            id="shelfLocation"
            value={shelfLocation}
            onChange={(e) => setShelfLocation(e.target.value)}
            required
            disabled={isSubmitting}
            placeholder="Ej: Estante 3, Fila 2"
          />
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="category">Categoría *</Label>
            <Select
              value={categoryId}
              onValueChange={setCategoryId}
              disabled={isSubmitting}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="w-full flex flex-row gap-2 justify-center items-center">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}></div>

                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {categoryId && subCategories.length > 0 && (
            <div>
              <Label htmlFor="subcategory">Subcategoría</Label>
              <Select
                value={subCategoryId}
                onValueChange={setSubCategoryId}
                disabled={isSubmitting}>
                <SelectTrigger id="subcategory">
                  <SelectValue placeholder="Seleccionar subcategoría" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((subCategory) => (
                    <SelectItem key={subCategory.id} value={subCategory.id}>
                      <div className="w-full flex flex-row gap-2 justify-center items-center">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subCategory.color }}></div>

                        {subCategory.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {subCategoryId && subSubCategories.length > 0 && (
            <div>
              <Label htmlFor="subsubcategory">Sub-subcategoría</Label>
              <Select
                value={subSubCategoryId}
                onValueChange={setSubSubCategoryId}
                disabled={isSubmitting}>
                <SelectTrigger id="subsubcategory">
                  <SelectValue placeholder="Seleccionar sub-subcategoría" />
                </SelectTrigger>
                <SelectContent>
                  {subSubCategories.map((subSubCategory) => (
                    <SelectItem
                      key={subSubCategory.id}
                      value={subSubCategory.id}>
                      <div className="w-full flex flex-row gap-2 justify-center items-center">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: subSubCategory.color,
                          }}></div>

                        {subSubCategory.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting || !categoryId}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {book ? "Actualizando..." : "Guardando..."}
            </>
          ) : book ? (
            "Actualizar Libro"
          ) : (
            "Crear Libro"
          )}
        </Button>
      </div>
    </form>
  );
}
