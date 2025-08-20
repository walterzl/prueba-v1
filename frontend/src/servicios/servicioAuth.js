const URL_API = "/api";

// Cache para evitar múltiples verificaciones simultáneas
let verificandoToken = null;
let ultimaVerificacion = 0;
const TIEMPO_CACHE_VERIFICACION = 5000; // 5 segundos

/**
 * Servicio de autenticación
 * Maneja el inicio y cierre de sesión de usuarios
 */
export const servicioAutenticacion = {
  /**
   * Realiza el inicio de sesión del usuario
   * @param {Object} credenciales - Objeto con usuario y contraseña
   * @param {string} credenciales.usuario - Nombre de usuario
   * @param {string} credenciales.password - Contraseña del usuario
   * @returns {Promise<Object>} - Datos del usuario autenticado y token
   */
  async iniciarSesion(credenciales) {
    console.log("Intentando iniciar sesión con usuario:", credenciales.usuario);

    try {
      const respuesta = await fetch(`${URL_API}/auth/login`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(credenciales),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "Error en el inicio de sesión");
      }

      console.log("Inicio de sesión exitoso para:", credenciales.usuario);
      return datos.datos; // Devuelve { token, usuario }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      throw new Error(error.message || "Error de conexión al servidor");
    }
  },

  /**
   * Realiza el cierre de sesión del usuario
   * @returns {Promise<void>}
   */
  async cerrarSesion() {
    try {
      // Llamar al endpoint de logout en el servidor para invalidar el token
      await fetch(`${URL_API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      console.log("Sesión cerrada exitosamente");
    } catch (error) {
      console.warn("Error al cerrar sesión en el servidor:", error.message);
      // No lanzamos error aquí porque el cierre local de sesión debe proceder
    }
  },

  /**
   * Verifica si el token actual es válido
   * @param {string} token - Token a verificar
   * @returns {Promise<boolean>} - True si el token es válido
   */
  async verificarToken(token) {
    if (!token) return false;

    // Evitar múltiples verificaciones simultáneas
    const ahora = Date.now();
    if (
      verificandoToken &&
      ahora - ultimaVerificacion < TIEMPO_CACHE_VERIFICACION
    ) {
      console.log("Verificación de token en cache, reutilizando resultado...");
      return verificandoToken;
    }

    // Si ya hay una verificación en curso, esperarla
    if (verificandoToken instanceof Promise) {
      console.log("Verificación ya en curso, esperando resultado...");
      return verificandoToken;
    }

    ultimaVerificacion = ahora;
    verificandoToken = this._verificarTokenEnServidor(token);

    try {
      const resultado = await verificandoToken;
      // Mantener el resultado en cache por un tiempo
      setTimeout(() => {
        verificandoToken = null;
      }, TIEMPO_CACHE_VERIFICACION);

      return resultado;
    } catch (error) {
      verificandoToken = null;
      throw error;
    }
  },

  /**
   * Función interna para verificar token en el servidor
   * @param {string} token - Token a verificar
   * @returns {Promise<boolean>} - True si el token es válido
   */
  async _verificarTokenEnServidor(token) {
    try {
      const respuesta = await fetch(`${URL_API}/auth/validate`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return respuesta.ok;
    } catch (error) {
      console.warn("Error al verificar token:", error.message);
      return false;
    }
  },
};
