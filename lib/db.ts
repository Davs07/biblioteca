// Este archivo ahora solo contiene funciones de utilidad para la base de datos
// Se ha eliminado la integración con Supabase

// Función para verificar si las variables de entorno de la base de datos están disponibles
export const isDatabaseAvailable = () => {
  return !!(
    process.env.POSTGRES_URL &&
    process.env.POSTGRES_PRISMA_URL &&
    process.env.POSTGRES_URL_NON_POOLING &&
    process.env.DATABASE_URL &&
    process.env.DIRECT_URL
  )
}

