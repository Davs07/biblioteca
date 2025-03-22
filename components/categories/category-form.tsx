"use client"

import type React from "react"

import { useState } from "react"
import { useLibrary } from "@/context/library-context"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Label } from "../ui/label"

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
  const { addCategory, updateCategory, addSubCategory, updateSubCategory, addSubSubCategory, updateSubSubCategory } =
    useLibrary()

  const [name, setName] = useState(initialData?.name || "")
  const [color, setColor] = useState(initialData?.color || "#000000")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const data = { name, color }

    if (type === "category") {
      if (categoryId) {
        updateCategory(categoryId, data)
      } else {
        addCategory(data)
      }
    } else if (type === "subCategory" && categoryId) {
      if (subCategoryId) {
        updateSubCategory(categoryId, subCategoryId, data)
      } else {
        addSubCategory(categoryId, data)
      }
    } else if (type === "subSubCategory" && categoryId && subCategoryId) {
      if (subSubCategoryId) {
        updateSubSubCategory(categoryId, subCategoryId, subSubCategoryId, data)
      } else {
        addSubSubCategory(categoryId, subCategoryId, data)
      }
    }

    onComplete()
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

