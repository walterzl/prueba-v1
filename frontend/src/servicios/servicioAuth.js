const API_URL = 'http://localhost:3001/api'

export const servicioAuth = {
  async login(credenciales) {
    try {
      const respuesta = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credenciales)
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error en el inicio de sesión')
      }

      return datos.datos // Devuelve { token, usuario }
    } catch (error) {
      console.error('Error en servicioAuth.login:', error)
      // Re-lanzamos el error para que el componente que lo llama pueda manejarlo
      throw error
    }
  },

  async logout() {
    // Aunque el backend tiene un endpoint de logout, para el frontend
    // a menudo es suficiente con limpiar los datos de sesión locales.
    // Se podría añadir una llamada a /api/auth/logout si se quiere invalidar el token en el servidor.
    console.log('Cerrando sesión...')
    return Promise.resolve()
  }
}
