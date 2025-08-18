/**
 * Servicio HTTP - Cliente HTTP centralizado para el frontend
 * Maneja todas las comunicaciones con el backend usando Axios
 */

class ServicioHttp {
  constructor() {
    this.baseURL = CONSTANTES_FRONTEND.API.BASE_URL;
    this.timeout = CONSTANTES_FRONTEND.API.TIMEOUT;
    this.reintentos = CONSTANTES_FRONTEND.API.RETRY_ATTEMPTS;
    
    this.configurarAxios();
    this.configurarInterceptores();
  }

  /**
   * Configura la instancia de Axios
   */
  configurarAxios() {
    // Crear instancia de Axios con configuración base
    this.axios = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Configura los interceptores de request y response
   */
  configurarInterceptores() {
    // Interceptor de request - agregar token de autenticación
    this.axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(CONSTANTES_FRONTEND.STORAGE.TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Agregar timestamp para evitar cache
        if (config.method === 'get') {
          config.params = {
            ...config.params,
            _t: Date.now()
          };
        }

        // Log de request en desarrollo
        if (CONSTANTES_FRONTEND.DEBUG.ENABLED) {
          console.log(`🚀 ${config.method.toUpperCase()} ${config.url}`, config);
        }

        return config;
      },
      (error) => {
        console.error('❌ Error en request:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor de response - manejo de errores y tokens
    this.axios.interceptors.response.use(
      (response) => {
        // Verificar si hay un nuevo token en el header
        const nuevoToken = response.headers['x-new-token'];
        if (nuevoToken) {
          localStorage.setItem(CONSTANTES_FRONTEND.STORAGE.TOKEN_KEY, nuevoToken);
          this.notificarRenovacionToken();
        }

        // Log de response exitoso en desarrollo
        if (CONSTANTES_FRONTEND.DEBUG.ENABLED) {
          console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
        }

        return response;
      },
      async (error) => {
        const config = error.config;

        // Log de error en desarrollo
        if (CONSTANTES_FRONTEND.DEBUG.ENABLED) {
          console.error(`❌ ${config?.method?.toUpperCase()} ${config?.url}`, error);
        }

        // Manejo específico de errores de autenticación
        if (error.response?.status === 401) {
          await this.manejarErrorAutenticacion(error);
          return Promise.reject(error);
        }

        // Reintentar en caso de errores de red
        if (this.debeReintentar(error) && !config._retry) {
          config._retry = true;
          config._retryCount = (config._retryCount || 0) + 1;

          if (config._retryCount <= this.reintentos) {
            console.warn(`🔄 Reintentando request (${config._retryCount}/${this.reintentos}):`, config.url);
            
            // Esperar antes de reintentar (backoff exponencial)
            await this.esperar(Math.pow(2, config._retryCount) * 1000);
            
            return this.axios(config);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Verifica si un error debe ser reintentado
   * @param {Error} error - Error de Axios
   * @returns {boolean} True si debe reintentarse
   */
  debeReintentar(error) {
    return (
      !error.response || // Error de red
      error.response.status >= 500 || // Error del servidor
      error.code === 'ECONNABORTED' || // Timeout
      error.code === 'ENOTFOUND' || // DNS error
      error.code === 'ECONNREFUSED' // Conexión rechazada
    );
  }

  /**
   * Maneja errores de autenticación
   * @param {Error} error - Error de autenticación
   */
  async manejarErrorAutenticacion(error) {
    const codigoError = error.response?.data?.codigo;

    switch (codigoError) {
      case 'TOKEN_EXPIRADO':
        console.warn('🔒 Token expirado, intentando renovar...');
        await this.intentarRenovarToken();
        break;

      case 'TOKEN_INVALIDO':
      case 'SESION_INVALIDA':
      case 'USUARIO_DESACTIVADO':
        console.warn('🔒 Sesión inválida, cerrando sesión...');
        await this.cerrarSesion();
        break;

      default:
        console.warn('🔒 Error de autenticación no manejado:', codigoError);
        await this.cerrarSesion();
    }
  }

  /**
   * Intenta renovar el token de acceso
   */
  async intentarRenovarToken() {
    try {
      const response = await axios.post(
        `${this.baseURL}${ENDPOINTS_FRONTEND.AUTH.REFRESH}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(CONSTANTES_FRONTEND.STORAGE.TOKEN_KEY)}`
          }
        }
      );

      const { token } = response.data.datos;
      localStorage.setItem(CONSTANTES_FRONTEND.STORAGE.TOKEN_KEY, token);
      
      console.log('✅ Token renovado exitosamente');
      this.notificarRenovacionToken();
      
    } catch (error) {
      console.error('❌ Error al renovar token:', error);
      await this.cerrarSesion();
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  async cerrarSesion() {
    // Limpiar localStorage
    localStorage.removeItem(CONSTANTES_FRONTEND.STORAGE.TOKEN_KEY);
    localStorage.removeItem(CONSTANTES_FRONTEND.STORAGE.USER_KEY);
    localStorage.removeItem(CONSTANTES_FRONTEND.STORAGE.PLANT_KEY);

    // Notificar cierre de sesión
    window.dispatchEvent(new CustomEvent('sesion-cerrada'));

    // Redirigir al login
    if (window.app && window.app.mostrarLogin) {
      window.app.mostrarLogin();
    }
  }

  /**
   * Notifica que el token ha sido renovado
   */
  notificarRenovacionToken() {
    window.dispatchEvent(new CustomEvent('token-renovado'));
  }

  /**
   * Realiza una petición GET
   * @param {string} url - URL del endpoint
   * @param {Object} params - Parámetros de consulta
   * @param {Object} options - Opciones adicionales
   * @returns {Promise} Promesa con la respuesta
   */
  async get(url, params = {}, options = {}) {
    try {
      const response = await this.axios.get(url, {
        params,
        ...options
      });
      return response.data;
    } catch (error) {
      throw this.procesarError(error);
    }
  }

  /**
   * Realiza una petición POST
   * @param {string} url - URL del endpoint
   * @param {Object} data - Datos a enviar
   * @param {Object} options - Opciones adicionales
   * @returns {Promise} Promesa con la respuesta
   */
  async post(url, data = {}, options = {}) {
    try {
      const response = await this.axios.post(url, data, options);
      return response.data;
    } catch (error) {
      throw this.procesarError(error);
    }
  }

  /**
   * Realiza una petición PUT
   * @param {string} url - URL del endpoint
   * @param {Object} data - Datos a enviar
   * @param {Object} options - Opciones adicionales
   * @returns {Promise} Promesa con la respuesta
   */
  async put(url, data = {}, options = {}) {
    try {
      const response = await this.axios.put(url, data, options);
      return response.data;
    } catch (error) {
      throw this.procesarError(error);
    }
  }

  /**
   * Realiza una petición DELETE
   * @param {string} url - URL del endpoint
   * @param {Object} options - Opciones adicionales
   * @returns {Promise} Promesa con la respuesta
   */
  async delete(url, options = {}) {
    try {
      const response = await this.axios.delete(url, options);
      return response.data;
    } catch (error) {
      throw this.procesarError(error);
    }
  }

  /**
   * Realiza una petición PATCH
   * @param {string} url - URL del endpoint
   * @param {Object} data - Datos a enviar
   * @param {Object} options - Opciones adicionales
   * @returns {Promise} Promesa con la respuesta
   */
  async patch(url, data = {}, options = {}) {
    try {
      const response = await this.axios.patch(url, data, options);
      return response.data;
    } catch (error) {
      throw this.procesarError(error);
    }
  }

  /**
   * Descarga un archivo
   * @param {string} url - URL del archivo
   * @param {string} nombreArchivo - Nombre del archivo
   * @param {Object} options - Opciones adicionales
   * @returns {Promise} Promesa con la descarga
   */
  async descargar(url, nombreArchivo, options = {}) {
    try {
      const response = await this.axios.get(url, {
        responseType: 'blob',
        ...options
      });

      // Crear enlace de descarga
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const enlace = document.createElement('a');
      enlace.href = urlBlob;
      enlace.setAttribute('download', nombreArchivo);
      
      document.body.appendChild(enlace);
      enlace.click();
      
      document.body.removeChild(enlace);
      window.URL.revokeObjectURL(urlBlob);

      return { exito: true, mensaje: 'Archivo descargado exitosamente' };
    } catch (error) {
      throw this.procesarError(error);
    }
  }

  /**
   * Sube un archivo
   * @param {string} url - URL del endpoint
   * @param {File} archivo - Archivo a subir
   * @param {Function} onProgress - Callback de progreso
   * @param {Object} options - Opciones adicionales
   * @returns {Promise} Promesa con la respuesta
   */
  async subirArchivo(url, archivo, onProgress = null, options = {}) {
    try {
      const formData = new FormData();
      formData.append('archivo', archivo);

      const response = await this.axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const porcentaje = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(porcentaje);
          }
        },
        ...options
      });

      return response.data;
    } catch (error) {
      throw this.procesarError(error);
    }
  }

  /**
   * Procesa errores de las peticiones HTTP
   * @param {Error} error - Error de Axios
   * @returns {Object} Error procesado
   */
  procesarError(error) {
    if (error.response) {
      // Error con respuesta del servidor
      const { data, status, statusText } = error.response;
      return {
        exito: false,
        mensaje: data?.mensaje || statusText || 'Error del servidor',
        codigo: data?.codigo || `HTTP_${status}`,
        errores: data?.errores || null,
        status: status,
        detalles: CONSTANTES_FRONTEND.DEBUG.ENABLED ? data : null
      };
    } else if (error.request) {
      // Error de red o timeout
      return {
        exito: false,
        mensaje: CONSTANTES_FRONTEND.MENSAJES.ERROR_CONEXION,
        codigo: 'ERROR_CONEXION',
        errores: null,
        status: 0
      };
    } else {
      // Error de configuración o desconocido
      return {
        exito: false,
        mensaje: CONSTANTES_FRONTEND.MENSAJES.ERROR_INESPERADO,
        codigo: 'ERROR_DESCONOCIDO',
        errores: null,
        status: 0,
        detalles: CONSTANTES_FRONTEND.DEBUG.ENABLED ? error.message : null
      };
    }
  }

  /**
   * Espera un tiempo determinado
   * @param {number} ms - Milisegundos a esperar
   * @returns {Promise} Promesa que se resuelve después del tiempo especificado
   */
  esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Verifica si hay conexión a internet
   * @returns {Promise<boolean>} True si hay conexión
   */
  async verificarConexion() {
    try {
      await this.axios.get('/api/utils/health', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Cancela todas las peticiones pendientes
   */
  cancelarPeticionesPendientes() {
    // Axios no tiene un método directo para esto, pero podemos
    // crear un source de cancelación para futuras implementaciones
    console.log('🚫 Cancelando peticiones pendientes...');
  }
}

// Crear instancia global del servicio HTTP
const servicioHttp = new ServicioHttp();