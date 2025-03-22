export interface SubSubCategory {
  id: string
  name: string
  color: string
}

export interface SubCategory {
  id: string
  name: string
  color: string
  subSubCategories: SubSubCategory[]
}

export interface Category {
  id: string
  name: string
  color: string
  subCategories: SubCategory[]
}

export interface Book {
  id: string
  title: string
  author: string
  categoryId: string
  subCategoryId: string
  subSubCategoryId: string
  shelfLocation: string
  coverImage?: string
}

