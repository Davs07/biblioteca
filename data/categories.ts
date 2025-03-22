import type { Category } from "@/types"

export const initialCategories: Category[] = [
  {
    id: "cat-1",
    name: "Literatura",
    color: "#FF5733",
    subCategories: [
      {
        id: "subcat-1-1",
        name: "Ficción",
        color: "#FFC300",
        subSubCategories: [
          {
            id: "subsubcat-1-1-1",
            name: "Novela",
            color: "#DAF7A6",
          },
          {
            id: "subsubcat-1-1-2",
            name: "Cuento",
            color: "#C70039",
          },
        ],
      },
      {
        id: "subcat-1-2",
        name: "No Ficción",
        color: "#900C3F",
        subSubCategories: [
          {
            id: "subsubcat-1-2-1",
            name: "Ensayo",
            color: "#581845",
          },
          {
            id: "subsubcat-1-2-2",
            name: "Biografía",
            color: "#FFC300",
          },
        ],
      },
    ],
  },
  {
    id: "cat-2",
    name: "Ciencias",
    color: "#3498DB",
    subCategories: [
      {
        id: "subcat-2-1",
        name: "Física",
        color: "#2ECC71",
        subSubCategories: [
          {
            id: "subsubcat-2-1-1",
            name: "Mecánica",
            color: "#F1C40F",
          },
          {
            id: "subsubcat-2-1-2",
            name: "Cuántica",
            color: "#E74C3C",
          },
        ],
      },
      {
        id: "subcat-2-2",
        name: "Biología",
        color: "#9B59B6",
        subSubCategories: [
          {
            id: "subsubcat-2-2-1",
            name: "Genética",
            color: "#1ABC9C",
          },
          {
            id: "subsubcat-2-2-2",
            name: "Ecología",
            color: "#D35400",
          },
        ],
      },
    ],
  },
  {
    id: "cat-3",
    name: "Historia",
    color: "#8E44AD",
    subCategories: [
      {
        id: "subcat-3-1",
        name: "Antigua",
        color: "#27AE60",
        subSubCategories: [
          {
            id: "subsubcat-3-1-1",
            name: "Egipto",
            color: "#F39C12",
          },
          {
            id: "subsubcat-3-1-2",
            name: "Grecia",
            color: "#C0392B",
          },
        ],
      },
      {
        id: "subcat-3-2",
        name: "Moderna",
        color: "#16A085",
        subSubCategories: [
          {
            id: "subsubcat-3-2-1",
            name: "Siglo XX",
            color: "#2980B9",
          },
          {
            id: "subsubcat-3-2-2",
            name: "Contemporánea",
            color: "#7D3C98",
          },
        ],
      },
    ],
  },
]

