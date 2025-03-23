"use client"

import type React from "react"

import { useState } from "react"
import { useLibrary } from "@/context/library-context"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { postAPI, putAPI } from "@/lib/api"

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
  // Ya no necesitamos extraer estas funciones del contexto
  const { } = useLibrary()

  const [name, setName] = useState(initialData?.name || "")
  const [color, setColor] = useState(initialData?.color || "#000000")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = { name, color }
    
    try {
      if (type === "category") {
        if (categoryId) {
          // Actualizar categoría principal
          await putAPI("categories", {
            id: categoryId,
            ...data
          })
        } else {
          // Crear nueva categoría principal
          await postAPI("categories", data)
        }
      } else if (type === "subCategory" && categoryId) {
        if (subCategoryId) {
          // Actualizar subcategoría
          await putAPI("categories", {
            id: subCategoryId,
            type: "subcategory",
            categoryId,
            ...data
          })
        } else {
          // Crear nueva subcategoría
          await postAPI("categories", {
            type: "subcategory",
            categoryId,
            ...data
          })
        }
      } else if (type === "subSubCategory" && categoryId && subCategoryId) {
        if (subSubCategoryId) {
          // Actualizar sub-subcategoría
          await putAPI("categories", {
            id: subSubCategoryId,
            type: "subsubcategory",
            categoryId,
            subcategoryId: subCategoryId,
            ...data
          })
        } else {
          // Crear nueva sub-subcategoría
          await postAPI("categories", {
            type: "subsubcategory",
            categoryId,
            subcategoryId: subCategoryId,
            ...data
          })
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

