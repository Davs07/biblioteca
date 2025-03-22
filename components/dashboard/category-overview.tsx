"use client"

import { useLibrary } from "@/context/library-context"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CategoryOverview() {
  const { categories, books } = useLibrary()

  // Calcular el número de libros por categoría
  const categoryStats = categories.map((category) => {
    const bookCount = books.filter((book) => book.categoryId === category.id).length
    return {
      id: category.id,
      name: category.name,
      color: category.color,
      bookCount,
    }
  })

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Distribución por Categorías</CardTitle>
        <Link href="/categories">
          <Button variant="ghost" size="sm">
            Gestionar
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryStats.map((category) => (
            <div key={category.id} className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: category.color }}></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-sm text-muted-foreground">{category.bookCount} libros</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full mt-1">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${Math.max(5, (category.bookCount / books.length) * 100)}%`,
                      backgroundColor: category.color,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

