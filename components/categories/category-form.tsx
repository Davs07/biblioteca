"use client"

import type React from "react"
import { useState } from "react"
import { useLibrary } from "@/context/library-context"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import type { Category, SubCategory } from "@/types" // Asegúrate de importar los tipos

interface CategoryFormProps {
  type: "category" | "subCategory" | "subSubCategory"
  categoryId?: string
  subCategoryId?: string
  subSubCategoryId?: string
  initialData?: {
    name: string
    color: string
  }
  onComplete: () => void
}

export function CategoryForm({
  type,
  categoryId,
  subCategoryId,
  subSubCategoryId,
  initialData,
  onComplete,
}: CategoryFormProps) {
  // Extraemos las funciones necesarias del contexto
  const { 
    addCategory, 
    updateCategory, 
    addSubCategory, 
    updateSubCategory, 
    addSubSubCategory, 
    updateSubSubCategory 
  } = useLibrary()

  const [name, setName] = useState(initialData?.name || "")
  const [color, setColor] = useState(initialData?.color || "#000000")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Datos básicos que siempre tendremos
    const basicData = { name, color }
    
    try {
      if (type === "category") {
        if (categoryId) {
          // Actualizar categoría principal usando el contexto
          await updateCategory(categoryId, basicData)
        } else {
          // Crear nueva categoría principal usando el contexto
          // Proporcionar subCategories vacío para cumplir con el tipo
          const categoryData: Omit<Category, "id"> = {
            ...basicData,
            subCategories: []
          }
          await addCategory(categoryData)
        }
      } else if (type === "subCategory" && categoryId) {
        if (subCategoryId) {
          // Actualizar subcategoría usando el contexto
          await updateSubCategory(categoryId, subCategoryId, basicData)
        } else {
          // Crear nueva subcategoría usando el contexto
          // Proporcionar subSubCategories vacío para cumplir con el tipo
          const subCategoryData: Omit<SubCategory, "id"> = {
            ...basicData,
            subSubCategories: []
          }
          await addSubCategory(categoryId, subCategoryData)
        }
      } else if (type === "subSubCategory" && categoryId && subCategoryId) {
        if (subSubCategoryId) {
          // Actualizar sub-subcategoría usando el contexto
          await updateSubSubCategory(
            categoryId,
            subCategoryId,
            subSubCategoryId,
            basicData
          )
        } else {
          // Crear nueva sub-subcategoría usando el contexto
          // Para SubSubCategory solo necesitamos name y color
          await addSubSubCategory(categoryId, subCategoryId, basicData)
        }
      }
      
      onComplete()
    } catch (error) {
      console.error("Error al guardar la categoría:", error)
      // Aquí se podría implementar un manejo de errores más sofisticado
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-2 bg-muted/50 rounded-md">
      <div className="space-y-1">
        <Label htmlFor="name" className="text-xs">
          Nombre
        </Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-8" required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="color" className="text-xs">
          Color
        </Label>
        <div className="flex gap-2">
          <Input
            id="color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-8 p-1"
            required
          />
          <Input value={color} onChange={(e) => setColor(e.target.value)} className="h-8 flex-1" required />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onComplete}>
          Cancelar
        </Button>
        <Button type="submit" size="sm">
          {initialData ? "Actualizar" : "Agregar"}
        </Button>
      </div>
    </form>
  )
}