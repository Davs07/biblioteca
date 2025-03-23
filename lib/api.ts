/**
 * Utilidades para realizar peticiones a la API
 */

/**
 * Realiza una petición GET a la API
 * @param endpoint - Ruta de la API sin la barra inicial
 * @param params - Parámetros de consulta opcionales
 */
export async function fetchAPI<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  let url = `/api/${endpoint}`;
  
  // Añadir parámetros de consulta si existen
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Error en la petición API: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Realiza una petición POST a la API
 * @param endpoint - Ruta de la API sin la barra inicial
 * @param data - Datos a enviar en el cuerpo de la petición
 */
export async function postAPI<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`/api/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Error en la petición API: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Realiza una petición PUT a la API
 * @param endpoint - Ruta de la API sin la barra inicial
 * @param data - Datos a enviar en el cuerpo de la petición
 */
export async function putAPI<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`/api/${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Error en la petición API: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Realiza una petición DELETE a la API
 * @param endpoint - Ruta de la API sin la barra inicial
 * @param params - Parámetros de consulta opcionales
 */
export async function deleteAPI<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  let url = `/api/${endpoint}`;
  
  // Añadir parámetros de consulta si existen
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Error en la petición API: ${response.statusText}`);
  }
  
  return response.json();
}