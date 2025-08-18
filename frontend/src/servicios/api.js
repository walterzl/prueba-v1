import { useAlmacenAuth } from '@/almacen/almacenAuth'

const API_URL = 'http://localhost:3001/api'

// Un cliente de API genérico que maneja la autenticación
const apiClient = async (endpoint, options = {}) => {
  const almacenAuth = useAlmacenAuth()
  const token = almacenAuth.token

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers
  }

  try {
    const respuesta = await fetch(`${API_URL}${endpoint}`, config)
    const datos = await respuesta.json()

    if (!respuesta.ok) {
      // Si la respuesta es 401 o 403, podría ser una sesión expirada.
      if (respuesta.status === 401 || respuesta.status === 403) {
        almacenAuth.limpiarSesion()
        // Recargamos la página para forzar la redirección al login.
        window.location.reload()
      }
      throw new Error(datos.mensaje || `Error en la petición a ${endpoint}`)
    }

    return datos.datos // La mayoría de las respuestas del backend envuelven los datos en una propiedad "datos"
  } catch (error) {
    console.error(`Error en apiClient para el endpoint ${endpoint}:`, error)
    throw error
  }
}

export default apiClient
