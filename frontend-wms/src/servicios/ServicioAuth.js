/**
 * Servicio de Autenticación - Frontend
 * Maneja la autenticación de usuarios y gestión de sesiones
 */

class ServicioAuth {
  constructor() {
    this.usuario = null;
    this.token = null;
    this.configurarEventListeners();
    this.verificarSesionAlIniciar();
  }

  /**
   * Configura los event listeners para la autenticación
   */
  configurarEventListeners() {
    // Escuchar cuando se cierre la sesión
    window.addEventListener('sesion-cerrada', () => {
      this.limpiarSesion();
    });

    // Escuchar cuando se renueve el token
    window.addEventListener('token-renovado', () => {
      console.log('🔄 Token renovado automáticamente');
    });

    // Escuchar cambios en localStorage (para múltiples pestañas)
    window.addEventListener('storage', (e) => {
      if (e.key === CONSTANTES_FRONTEND.STORAGE.TOKEN_KEY && !e.newValue) {
        // Token eliminado en otra pestaña
        this.limpiarSesion();
        window.dispatchEvent(new CustomEvent('sesion-cerrada'));
      }
    });

    // Detectar cuando la ventana pierde foco (opcional)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.estaAutenticado()) {
        this.validarSesion();
      }
    });
  }

  /**
   * Verifica si hay una sesión activa al iniciar la aplicación
   */
  verificarSesionAlIniciar() {
    const token = localStorage.getItem(CONSTANTES_FRONTEND.STORAGE.TOKEN_KEY);
    const userData = localStorage.getItem(CONSTANTES_FRONTEND.STORAGE.USER_KEY);

    if (token && userData) {
      try {
        this.token = token;
        this.usuario = JSON.parse(userData);
        
        // Validar que la sesión siga siendo válida
        this.validarSesion().catch(() => {
          console.warn('🔒 Sesión inválida detectada al iniciar');
          this.limpiarSesion();
        });
      } catch (error) {
        console.error('❌ Error al verificar sesión inicial:', error);
        this.limpiarSesion();
      }
    }
  }

  /**
   * Realiza el login de un usuario
   * @param {string} usuario - Usuario o email
   * @param {string} password - Contraseña
   * @param {boolean} recordarme - Si debe recordar la sesión
   * @returns {Promise<Object>} Resultado del login
   */
  async login(usuario, password, recordarme = false) {
    try {
      const response = await servicioHttp.post(ENDPOINTS_FRONTEND.AUTH.LOGIN, {
        usuario: usuario.trim(),
        password: password
      });

      if (response.exito) {
        const { usuario: datosUsuario, token, expiracion } = response.datos;

        // Guardar datos en localStorage
        localStorage.setItem(CONSTANTES_FRONTEND.STORAGE.TOKEN_KEY, token);
        localStorage.setItem(CONSTANTES_FRONTEND.STORAGE.USER_KEY, JSON.stringify(datosUsuario));
        
        if (recordarme) {
          localStorage.setItem(CONSTANTES_FRONTEND.STORAGE.REMEMBER_KEY, 'true');
        }

        // Actualizar propiedades de la clase
        this.token = token;
        this.usuario = datosUsuario;

        // Configurar expiración automática
        this.configurarExpiracionAutomatica(expiracion);

        // Disparar evento de login exitoso
        window.dispatchEvent(new CustomEvent('login-exitoso', {
          detail: { usuario: datosUsuario }
        }));

        return {
          exito: true,
          mensaje: 'Login exitoso',
          usuario: datosUsuario
        };
      }

      return response;

    } catch (error) {
      console.error('❌ Error en login:', error);
      return {
        exito: false,
        mensaje: error.mensaje || 'Error al iniciar sesión',
        codigo: error.codigo || 'ERROR_LOGIN'
      };
    }
  }

  /**
   * Cierra la sesión del usuario
   * @returns {Promise<Object>} Resultado del logout
   */
  async logout() {
    try {
      // Intentar cerrar sesión en el servidor
      if (this.token) {
        await servicioHttp.post(ENDPOINTS_FRONTEND.AUTH.LOGOUT);
      }
    } catch (error) {
      console.warn('⚠️ Error al cerrar sesión en servidor:', error);
      // Continuar con el logout local aunque falle el servidor
    } finally {
      // Limpiar sesión local
      this.limpiarSesion();
      
      // Disparar evento de logout
      window.dispatchEvent(new CustomEvent('logout-exitoso'));

      return {
        exito: true,
        mensaje: 'Sesión cerrada exitosamente'
      };
    }
  }

  /**
   * Cambia la contraseña del usuario actual
   * @param {string} passwordActual - Contraseña actual
   * @param {string} passwordNueva - Nueva contraseña
   * @returns {Promise<Object>} Resultado del cambio
   */
  async cambiarPassword(passwordActual, passwordNueva) {
    try {
      const response = await servicioHttp.put(ENDPOINTS_FRONTEND.AUTH.CAMBIAR_PASSWORD, {
        passwordActual,
        passwordNueva
      });

      if (response.exito) {
        // Disparar evento de contraseña cambiada
        window.dispatchEvent(new CustomEvent('password-cambiada'));
      }

      return response;

    } catch (error) {
      console.error('❌ Error al cambiar contraseña:', error);
      return {
        exito: false,
        mensaje: error.mensaje || 'Error al cambiar contraseña',
        codigo: error.codigo || 'ERROR_CAMBIAR_PASSWORD'
      };
    }
  }

  /**
   * Valida la sesión actual con el servidor
   * @returns {Promise<boolean>} True si la sesión es válida
   */
  async validarSesion() {
    try {
      if (!this.token) {
        return false;
      }

      const response = await servicioHttp.get(ENDPOINTS_FRONTEND.AUTH.VALIDATE);
      
      if (response.exito) {
        // Actualizar datos del usuario si han cambiado
        this.usuario = response.datos.usuario;
        localStorage.setItem(CONSTANTES_FRONTEND.STORAGE.USER_KEY, JSON.stringify(this.usuario));
        return true;
      }

      return false;

    } catch (error) {
      console.error('❌ Error al validar sesión:', error);
      return false;
    }
  }

  /**
   * Renueva el token de acceso
   * @returns {Promise<boolean>} True si se renovó exitosamente
   */
  async renovarToken() {
    try {
      const response = await servicioHttp.post(ENDPOINTS_FRONTEND.AUTH.REFRESH);

      if (response.exito) {
        const { token, expiracion } = response.datos;
        
        // Actualizar token
        this.token = token;
        localStorage.setItem(CONSTANTES_FRONTEND.STORAGE.TOKEN_KEY, token);
        
        // Configurar nueva expiración
        this.configurarExpiracionAutomatica(expiracion);

        return true;
      }

      return false;

    } catch (error) {
      console.error('❌ Error al renovar token:', error);
      return false;
    }
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} True si está autenticado
   */
  estaAutenticado() {
    return !!(this.token && this.usuario);
  }

  /**
   * Obtiene el usuario actual
   * @returns {Object|null} Datos del usuario o null
   */
  obtenerUsuario() {
    return this.usuario;
  }

  /**
   * Obtiene el token actual
   * @returns {string|null} Token o null
   */
  obtenerToken() {
    return this.token;
  }

  /**
   * Verifica si el usuario tiene un rol específico
   * @param {string|Array} roles - Rol o array de roles a verificar
   * @returns {boolean} True si tiene el rol
   */
  tieneRol(roles) {
    if (!this.usuario) return false;

    const rolesArray = Array.isArray(roles) ? roles : [roles];
    return rolesArray.includes(this.usuario.rol);
  }

  /**
   * Verifica si el usuario tiene acceso a una planta específica
   * @param {string} planta - Código de la planta
   * @returns {boolean} True si tiene acceso
   */
  tieneAccesoPlanta(planta) {
    if (!this.usuario) return false;

    // Los administradores tienen acceso a todas las plantas
    if (this.usuario.rol === CONSTANTES_FRONTEND.ROLES.ADMINISTRADOR) {
      return true;
    }

    // Verificar planta asignada
    return this.usuario.plantaAsignada === planta;
  }

  /**
   * Obtiene la planta asignada al usuario
   * @returns {string|null} Código de la planta o null
   */
  obtenerPlantaAsignada() {
    return this.usuario?.plantaAsignada || null;
  }

  /**
   * Limpia todos los datos de la sesión
   */
  limpiarSesion() {
    // Limpiar propiedades
    this.usuario = null;
    this.token = null;

    // Limpiar localStorage
    localStorage.removeItem(CONSTANTES_FRONTEND.STORAGE.TOKEN_KEY);
    localStorage.removeItem(CONSTANTES_FRONTEND.STORAGE.USER_KEY);
    localStorage.removeItem(CONSTANTES_FRONTEND.STORAGE.PLANT_KEY);
    
    // Solo limpiar recordarme si no está marcado
    if (!localStorage.getItem(CONSTANTES_FRONTEND.STORAGE.REMEMBER_KEY)) {
      localStorage.removeItem(CONSTANTES_FRONTEND.STORAGE.REMEMBER_KEY);
    }

    // Limpiar timers
    if (this.timerExpiracion) {
      clearTimeout(this.timerExpiracion);
      this.timerExpiracion = null;
    }
  }

  /**
   * Configura la expiración automática del token
   * @param {string} fechaExpiracion - Fecha de expiración del token
   */
  configurarExpiracionAutomatica(fechaExpiracion) {
    if (this.timerExpiracion) {
      clearTimeout(this.timerExpiracion);
    }

    const ahora = new Date();
    const expiracion = new Date(fechaExpiracion);
    const tiempoRestante = expiracion.getTime() - ahora.getTime();

    // Configurar renovación automática 5 minutos antes de expirar
    const tiempoRenovacion = tiempoRestante - (5 * 60 * 1000);

    if (tiempoRenovacion > 0) {
      this.timerExpiracion = setTimeout(async () => {
        console.log('🔄 Intentando renovar token automáticamente...');
        const renovado = await this.renovarToken();
        
        if (!renovado) {
          console.warn('⚠️ No se pudo renovar el token, cerrando sesión...');
          await this.logout();
        }
      }, tiempoRenovacion);
    } else if (tiempoRestante > 0) {
      // Si quedan menos de 5 minutos, intentar renovar ahora
      setTimeout(async () => {
        await this.renovarToken();
      }, 1000);
    } else {
      // Token ya expirado
      console.warn('⚠️ Token expirado detectado');
      this.limpiarSesion();
    }
  }

  /**
   * Verifica si debe recordar la sesión
   * @returns {boolean} True si debe recordar
   */
  debeRecordar() {
    return localStorage.getItem(CONSTANTES_FRONTEND.STORAGE.REMEMBER_KEY) === 'true';
  }

  /**
   * Obtiene información completa del estado de autenticación
   * @returns {Object} Estado de autenticación
   */
  obtenerEstadoAuth() {
    return {
      autenticado: this.estaAutenticado(),
      usuario: this.usuario,
      token: this.token ? 'presente' : null,
      plantaAsignada: this.obtenerPlantaAsignada(),
      recordarme: this.debeRecordar(),
      timestamp: new Date().toISOString()
    };
  }
}

// Crear instancia global del servicio de autenticación
const servicioAuth = new ServicioAuth();