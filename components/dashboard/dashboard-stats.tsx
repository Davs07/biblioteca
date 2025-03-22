"use client"

import { useLibrary } from "@/context/library-context"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { BookOpen, Layers, Library, Tag } from "lucide-react"

export function DashboardStats() {
  const { books, categories } = useLibrary()

  // Calcular el número total de subcategorías
  const totalSubCategories = categories.reduce((acc, category) => acc + category.subCategories.length, 0)

  // Calcular el número total de sub-subcategorías
  const totalSubSubCategories = categories.reduce(
    (acc, category) =>
      acc + category.subCategories.reduce((subAcc, subCategory) => subAcc + subCategory.subSubCategories.length, 0),
    0,
  )

  const stats = [
    {
      title: "Total de Libros",
      value: books.length,
      icon: <BookOpen className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Categorías",
      value: categories.length,
      icon: <Layers className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Subcategorías",
      value: totalSubCategories,
      icon: <Tag className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Sub-subcategorías",
      value: totalSubSubCategories,
      icon: <Library className="h-5 w-5 text-muted-foreground" />,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

