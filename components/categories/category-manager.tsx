"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { CategoryForm } from "@/components/categories/category-form"
import { CategoryTree } from "@/components/categories/category-tree"
import { Plus } from "lucide-react"
import { Card, CardContent } from "../ui/card"

export function CategoryManager() {
  const [showAddCategory, setShowAddCategory] = useState(false)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Estructura de Categorías</h2>
          <Button onClick={() => setShowAddCategory(!showAddCategory)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Categoría
          </Button>
        </div>

        {showAddCategory && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <CategoryForm type="category" onComplete={() => setShowAddCategory(false)} />
            </CardContent>
          </Card>
        )}

        <CategoryTree />
      </div>

      <div className="lg:col-span-1">
        <h2 className="text-xl font-semibold mb-4">Guía de Colores</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-4">
              Los colores ayudan a identificar visualmente las categorías y coinciden con las etiquetas físicas de los
              libros.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Categorías Principales</h3>
                <p className="text-sm text-muted-foreground">
                  Colores distintivos para las categorías de nivel superior.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Subcategorías</h3>
                <p className="text-sm text-muted-foreground">
                  Tonos relacionados con la categoría principal para mantener coherencia visual.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Sub-subcategorías</h3>
                <p className="text-sm text-muted-foreground">
                  Variaciones más claras o oscuras de los colores de las subcategorías.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

