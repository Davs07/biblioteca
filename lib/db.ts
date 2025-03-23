// Este archivo ahora solo contiene funciones de utilidad para la base de datos
// Se ha eliminado la integración con Supabase

// Función para verificar si la base de datos está disponible
// Ahora también verifica si estamos en un entorno de navegador
export const isDatabaseAvailable = () => {
  // Verificar si estamos en el navegador
  const isBrowser = typeof window !== 'undefined';
  
  // Si estamos en el navegador, la base de datos no está disponible
  if (isBrowser) {
    // Reducir la verbosidad del log en producción
    if (process.env.NODE_ENV !== 'production') {
      console.log('Base de datos no disponible: Ejecutando en el navegador');
    }
    return false;
  }
  
  // Verificar si las variables de entorno están disponibles
  const hasDbUrl = !!process.env.DATABASE_URL;
  const hasDirectUrl = !!process.env.DIRECT_URL;
  const isAvailable = hasDbUrl && hasDirectUrl;

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `Estado de la base de datos: ${
        isAvailable ? "Disponible" : "No disponible"
      }`
    );
    
    if (!isAvailable) {
      console.log(
        "Variables de entorno faltantes para la conexión a la base de datos"
      );
      if (!hasDbUrl) console.log("Falta DATABASE_URL");
      if (!hasDirectUrl) console.log("Falta DIRECT_URL");
    }
  }

  return isAvailable;
};
