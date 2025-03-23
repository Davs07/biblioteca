"use client";

import { useRouter } from "next/navigation";
import type { Book } from "@/types";
import { BookForm } from "@/components/books/book-form";
import { postAPI, putAPI } from "@/lib/api";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface BookFormContainerProps {
  book?: Book;
}

export function BookFormContainer({ book }: BookFormContainerProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (bookData: Omit<Book, "id">) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (book) {
        // Actualizar libro existente
        await putAPI("books", {
          id: book.id,
          ...bookData,
        });

        toast({
          title: "Libro actualizado",
          description: "El libro se ha actualizado correctamente",
          variant: "success",
        });

        // Redirigir después de completar la operación
        router.push(`/dashboard/books/${book.id}`);
      } else {
        // Crear nuevo libro
        await postAPI("books", bookData);

        toast({
          title: "Libro creado",
          description: "El libro se ha creado correctamente",
          variant: "success",
        });

        router.push("/dashboard/books");
      }
    } catch (error) {
      console.error("Error al guardar el libro:", error);

      toast({
        title: "Error",
        description:
          "Ha ocurrido un error al guardar el libro. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminamos handleComplete ya que su funcionalidad está duplicada en handleSubmit
  // y las rutas no coinciden entre sí, lo que crea inconsistencia

  return (
    <BookForm book={book} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
  );
}
