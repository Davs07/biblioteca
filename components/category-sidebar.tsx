"use client"

import { useState } from "react"
import { useLibrary } from "@/context/library-context"
import { Button } from "./ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { CategoryForm } from "./categories/category-form"
import { ChevronRight, Edit, Plus, Trash2 } from "lucide-react"

export function CategorySidebar() {
  const { categories } = useLibrary()
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingSubCategory, setEditingSubCategory] = useState<{
    categoryId: string
    subCategoryId: string
  } | null>(null)
  const [editingSubSubCategory, setEditingSubSubCategory] = useState<{
    categoryId: string
    subCategoryId: string
    subSubCategoryId: string
  } | null>(null)
  const [showAddSubCategory, setShowAddSubCategory] = useState<string | null>(null)
  const [showAddSubSubCategory, setShowAddSubSubCategory] = useState<{
    categoryId: string
    subCategoryId: string
  } | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Categorías</h2>
        <Button variant="outline" size="sm" onClick={() => setShowAddCategory(!showAddCategory)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {showAddCategory && <CategoryForm type="category" onComplete={() => setShowAddCategory(false)} />}

      <Accordion type="multiple" className="w-full">
        {categories.map((category) => (
          <AccordionItem key={category.id} value={category.id}>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
              <AccordionTrigger className="flex-1 hover:no-underline">
                {editingCategory === category.id ? (
                  <CategoryForm
                    type="category"
                    categoryId={category.id}
                    initialData={{
                      name: category.name,
                      color: category.color,
                    }}
                    onComplete={() => setEditingCategory(null)}
                  />
                ) : (
                  <span>{category.name}</span>
                )}
              </AccordionTrigger>
              {editingCategory !== category.id && (
                <div className="flex gap-1 mr-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingCategory(category.id)
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm("¿Estás seguro de eliminar esta categoría?")) {
                        // Delete category logic
                      }
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            <AccordionContent>
              <div className="pl-4 border-l-2 border-muted ml-1.5 mt-2">
                {category.subCategories.map((subCategory) => (
                  <div key={subCategory.id} className="mb-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: subCategory.color }}></div>
                      <div
                        className="flex-1 font-medium cursor-pointer flex items-center"
                        onClick={() => {
                          // Toggle subcategory
                        }}
                      >
                        {editingSubCategory?.categoryId === category.id &&
                        editingSubCategory?.subCategoryId === subCategory.id ? (
                          <CategoryForm
                            type="subCategory"
                            categoryId={category.id}
                            subCategoryId={subCategory.id}
                            initialData={{
                              name: subCategory.name,
                              color: subCategory.color,
                            }}
                            onComplete={() => setEditingSubCategory(null)}
                          />
                        ) : (
                          <>
                            <span>{subCategory.name}</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </>
                        )}
                      </div>
                      {!(
                        editingSubCategory?.categoryId === category.id &&
                        editingSubCategory?.subCategoryId === subCategory.id
                      ) && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingSubCategory({
                                categoryId: category.id,
                                subCategoryId: subCategory.id,
                              })
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (confirm("¿Estás seguro de eliminar esta subcategoría?")) {
                                // Delete subcategory logic
                              }
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="pl-4 border-l-2 border-muted ml-1.5 mt-1">
                      {subCategory.subSubCategories.map((subSubCategory) => (
                        <div key={subSubCategory.id} className="flex items-center mt-1">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: subSubCategory.color }}
                          ></div>
                          {editingSubSubCategory?.categoryId === category.id &&
                          editingSubSubCategory?.subCategoryId === subCategory.id &&
                          editingSubSubCategory?.subSubCategoryId === subSubCategory.id ? (
                            <CategoryForm
                              type="subSubCategory"
                              categoryId={category.id}
                              subCategoryId={subCategory.id}
                              subSubCategoryId={subSubCategory.id}
                              initialData={{
                                name: subSubCategory.name,
                                color: subSubCategory.color,
                              }}
                              onComplete={() => setEditingSubSubCategory(null)}
                            />
                          ) : (
                            <span className="flex-1">{subSubCategory.name}</span>
                          )}
                          {!(
                            editingSubSubCategory?.categoryId === category.id &&
                            editingSubSubCategory?.subCategoryId === subCategory.id &&
                            editingSubSubCategory?.subSubCategoryId === subSubCategory.id
                          ) && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditingSubSubCategory({
                                    categoryId: category.id,
                                    subCategoryId: subCategory.id,
                                    subSubCategoryId: subSubCategory.id,
                                  })
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (confirm("¿Estás seguro de eliminar esta sub-subcategoría?")) {
                                    // Delete sub-subcategory logic
                                  }
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}

                      {showAddSubSubCategory?.categoryId === category.id &&
                      showAddSubSubCategory?.subCategoryId === subCategory.id ? (
                        <div className="mt-2">
                          <CategoryForm
                            type="subSubCategory"
                            categoryId={category.id}
                            subCategoryId={subCategory.id}
                            onComplete={() => setShowAddSubSubCategory(null)}
                          />
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-1"
                          onClick={() =>
                            setShowAddSubSubCategory({
                              categoryId: category.id,
                              subCategoryId: subCategory.id,
                            })
                          }
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Agregar Sub-subcategoría
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {showAddSubCategory === category.id ? (
                  <div className="mt-2">
                    <CategoryForm
                      type="subCategory"
                      categoryId={category.id}
                      onComplete={() => setShowAddSubCategory(null)}
                    />
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" className="mt-1" onClick={() => setShowAddSubCategory(category.id)}>
                    <Plus className="h-3 w-3 mr-1" />
                    Agregar Subcategoría
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

