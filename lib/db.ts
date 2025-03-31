// Este archivo contiene funciones de utilidad para la base de datos
// y manejo mejorado de errores para la conexión a PostgreSQL

/**
 * Verifica si la base de datos está disponible para su uso
 * Comprueba si estamos en un entorno de navegador y si las variables de entorno necesarias están configuradas
 * @returns {boolean} true si la base de datos está disponible, false en caso contrario
 */
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
      `Estado de la base de datos: ${isAvailable ? "Disponible" : "No disponible"}`
    );
    
    if (!isAvailable) {
      console.log(
        "Variables de entorno faltantes para la conexión a la base de datos"
      );
      if (!hasDbUrl) console.log("Falta DATABASE_URL - Verifica el archivo .env.local");
      if (!hasDirectUrl) console.log("Falta DIRECT_URL - Verifica el archivo .env.local");
      console.log("Asegúrate de que el archivo .env.local contiene las variables correctas para Supabase o PostgreSQL");
    }
  }

  return isAvailable;
};

/**
 * Función auxiliar para manejar errores de base de datos de manera consistente
 * @param {any} error - El error capturado
 * @param {string} operacion - Descripción de la operación que falló
 * @returns {string} Mensaje de error formateado
 */
export const handleDatabaseError = (error: any, operacion: string): string => {
  // Errores específicos de conexión a PostgreSQL/Supabase
  if (error?.message?.includes('FATAL: Tenant or user not found')) {
    console.error(`Error de autenticación en ${operacion}: Verifica las credenciales en el archivo .env.local`);
    return "Error de autenticación con la base de datos. Verifica las credenciales en el archivo .env.local";
  }
  
  if (error?.message?.includes('connect ECONNREFUSED')) {
    console.error(`Error de conexión en ${operacion}: No se puede conectar al servidor de base de datos`);
    return "No se puede conectar al servidor de base de datos. Verifica que el servidor esté en ejecución.";
  }
  
  // Error genérico
  console.error(`Error en ${operacion}:`, error);
  return `Error al realizar la operación: ${operacion}`;
};
