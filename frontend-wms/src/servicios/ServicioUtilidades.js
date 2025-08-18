/**
 * Servicio de Utilidades - Frontend
 * Funciones utilitarias comunes para la aplicación frontend
 */

class ServicioUtilidades {

  // ===========================================
  // FORMATEO DE FECHAS
  // ===========================================

  /**
   * Formatea una fecha para mostrar en la UI
   * @param {Date|string} fecha - Fecha a formatear
   * @param {string} formato - Formato deseado
   * @returns {string} Fecha formateada
   */
  static formatearFecha(fecha, formato = CONSTANTES_FRONTEND.REPORTES.FORMATO_FECHA) {
    if (!fecha) return '-';
    
    try {
      return moment(fecha).format(formato);
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return fecha.toString();
    }
  }

  /**
   * Formatea fecha y hora para la UI
   * @param {Date|string} fecha - Fecha a formatear
   * @returns {string} Fecha y hora formateada
   */
  static formatearFechaHora(fecha) {
    return this.formatearFecha(fecha, CONSTANTES_FRONTEND.REPORTES.FORMATO_FECHA_HORA);
  }

  /**
   * Obtiene fecha actual en formato ISO
   * @returns {string} Fecha actual
   */
  static obtenerFechaActual() {
    return moment().format('YYYY-MM-DD');
  }

  /**
   * Obtiene fecha y hora actual
   * @returns {string} Fecha y hora actual
   */
  static obtenerFechaHoraActual() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }

  /**
   * Calcula días entre dos fechas
   * @param {Date|string} fechaInicio - Fecha inicial
   * @param {Date|string} fechaFin - Fecha final
   * @returns {number} Días de diferencia
   */
  static calcularDiasDiferencia(fechaInicio, fechaFin) {
    return moment(fechaFin).diff(moment(fechaInicio), 'days');
  }

  /**
   * Verifica si una fecha es válida
   * @param {string} fecha - Fecha a validar
   * @returns {boolean} True si es válida
   */
  static esFechaValida(fecha) {
    return moment(fecha, 'YYYY-MM-DD', true).isValid();
  }

  // ===========================================
  // FORMATEO DE NÚMEROS
  // ===========================================

  /**
   * Formatea un número con separadores de miles
   * @param {number} numero - Número a formatear
   * @param {number} decimales - Cantidad de decimales
   * @returns {string} Número formateado
   */
  static formatearNumero(numero, decimales = 2) {
    if (numero === null || numero === undefined || isNaN(numero)) {
      return '-';
    }

    return new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: decimales,
      maximumFractionDigits: decimales
    }).format(numero);
  }

  /**
   * Formatea cantidad con unidad de medida
   * @param {number} cantidad - Cantidad
   * @param {string} unidad - Unidad de medida
   * @returns {string} Cantidad formateada con unidad
   */
  static formatearCantidad(cantidad, unidad) {
    const cantidadFormateada = this.formatearNumero(cantidad);
    return `${cantidadFormateada} ${unidad}`;
  }

  /**
   * Convierte string a número
   * @param {string} valor - Valor a convertir
   * @returns {number} Número convertido o 0
   */
  static convertirANumero(valor) {
    if (valor === null || valor === undefined || valor === '') {
      return 0;
    }

    const numero = parseFloat(valor.toString().replace(/,/g, ''));
    return isNaN(numero) ? 0 : numero;
  }

  // ===========================================
  // FORMATEO DE TEXTO
  // ===========================================

  /**
   * Capitaliza la primera letra de cada palabra
   * @param {string} texto - Texto a capitalizar
   * @returns {string} Texto capitalizado
   */
  static capitalizarTexto(texto) {
    if (!texto) return '';
    
    return texto
      .toLowerCase()
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');
  }

  /**
   * Trunca texto a una longitud específica
   * @param {string} texto - Texto a truncar
   * @param {number} longitud - Longitud máxima
   * @returns {string} Texto truncado
   */
  static truncarTexto(texto, longitud = 50) {
    if (!texto) return '';
    
    if (texto.length <= longitud) {
      return texto;
    }
    
    return texto.substring(0, longitud) + '...';
  }

  /**
   * Limpia texto removiendo caracteres especiales
   * @param {string} texto - Texto a limpiar
   * @returns {string} Texto limpio
   */
  static limpiarTexto(texto) {
    if (!texto) return '';
    
    return texto
      .replace(/[^\w\s-]/gi, '')
      .trim();
  }

  /**
   * Genera slug a partir de texto
   * @param {string} texto - Texto base
   * @returns {string} Slug generado
   */
  static generarSlug(texto) {
    if (!texto) return '';
    
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/-+/g, '-') // Múltiples guiones a uno
      .trim('-');
  }

  // ===========================================
  // VALIDACIONES
  // ===========================================

  /**
   * Valida email
   * @param {string} email - Email a validar
   * @returns {boolean} True si es válido
   */
  static validarEmail(email) {
    if (!email) return false;
    return CONSTANTES_FRONTEND.VALIDACIONES.EMAIL_PATTERN.test(email);
  }

  /**
   * Valida RUT chileno
   * @param {string} rut - RUT a validar
   * @returns {boolean} True si es válido
   */
  static validarRut(rut) {
    if (!rut) return false;
    
    // Limpiar RUT
    const rutLimpio = rut.replace(/[.-]/g, '');
    
    if (rutLimpio.length < 8 || rutLimpio.length > 9) {
      return false;
    }
    
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toLowerCase();
    
    if (!/^\d+$/.test(cuerpo)) {
      return false;
    }
    
    // Calcular dígito verificador
    let suma = 0;
    let multiplicador = 2;
    
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    const dvCalculado = 11 - (suma % 11);
    const dvFinal = dvCalculado === 11 ? '0' : dvCalculado === 10 ? 'k' : dvCalculado.toString();
    
    return dv === dvFinal;
  }

  /**
   * Formatea RUT agregando puntos y guión
   * @param {string} rut - RUT sin formato
   * @returns {string} RUT formateado
   */
  static formatearRut(rut) {
    if (!rut) return '';
    
    const rutLimpio = rut.replace(/[.-]/g, '');
    
    if (rutLimpio.length < 8) {
      return rutLimpio;
    }
    
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);
    
    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return `${cuerpoFormateado}-${dv}`;
  }

  /**
   * Valida longitud de contraseña
   * @param {string} password - Contraseña a validar
   * @returns {boolean} True si cumple requisitos
   */
  static validarPassword(password) {
    if (!password) return false;
    
    return password.length >= CONSTANTES_FRONTEND.VALIDACIONES.MIN_PASSWORD_LENGTH &&
           password.length <= CONSTANTES_FRONTEND.VALIDACIONES.MAX_PASSWORD_LENGTH;
  }

  // ===========================================
  // GENERADORES
  // ===========================================

  /**
   * Genera ID único
   * @returns {string} ID único
   */
  static generarId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Genera código único con prefijo
   * @param {string} prefijo - Prefijo del código
   * @param {number} longitud - Longitud del sufijo aleatorio
   * @returns {string} Código único
   */
  static generarCodigo(prefijo = 'WMS', longitud = 6) {
    const timestamp = Date.now().toString().slice(-6);
    const aleatorio = Math.random().toString(36).substring(2, longitud + 2).toUpperCase();
    
    return `${prefijo}-${timestamp}-${aleatorio}`;
  }

  // ===========================================
  // MANIPULACIÓN DE ARCHIVOS
  // ===========================================

  /**
   * Valida archivo antes de subir
   * @param {File} archivo - Archivo a validar
   * @returns {Object} Resultado de la validación
   */
  static validarArchivo(archivo) {
    if (!archivo) {
      return {
        valido: false,
        mensaje: 'No se ha seleccionado ningún archivo'
      };
    }

    // Validar tamaño
    if (archivo.size > CONSTANTES_FRONTEND.FORMULARIO.MAX_FILE_SIZE) {
      return {
        valido: false,
        mensaje: `El archivo es demasiado grande. Máximo ${this.formatearTamaño(CONSTANTES_FRONTEND.FORMULARIO.MAX_FILE_SIZE)}`
      };
    }

    // Validar tipo
    if (!CONSTANTES_FRONTEND.FORMULARIO.ALLOWED_FILE_TYPES.includes(archivo.type)) {
      return {
        valido: false,
        mensaje: 'Tipo de archivo no permitido'
      };
    }

    return {
      valido: true,
      mensaje: 'Archivo válido'
    };
  }

  /**
   * Formatea tamaño de archivo
   * @param {number} bytes - Bytes del archivo
   * @returns {string} Tamaño formateado
   */
  static formatearTamaño(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // ===========================================
  // UTILIDADES DOM
  // ===========================================

  /**
   * Crea elemento HTML
   * @param {string} tag - Etiqueta HTML
   * @param {Object} atributos - Atributos del elemento
   * @param {string} contenido - Contenido del elemento
   * @returns {HTMLElement} Elemento creado
   */
  static crearElemento(tag, atributos = {}, contenido = '') {
    const elemento = document.createElement(tag);
    
    Object.keys(atributos).forEach(attr => {
      elemento.setAttribute(attr, atributos[attr]);
    });
    
    if (contenido) {
      elemento.innerHTML = contenido;
    }
    
    return elemento;
  }

  /**
   * Obtiene parámetros de la URL
   * @returns {Object} Parámetros de la URL
   */
  static obtenerParametrosUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    
    for (const [key, value] of urlParams) {
      params[key] = value;
    }
    
    return params;
  }

  /**
   * Actualiza parámetro en la URL
   * @param {string} nombre - Nombre del parámetro
   * @param {string} valor - Valor del parámetro
   */
  static actualizarParametroUrl(nombre, valor) {
    const url = new URL(window.location.href);
    
    if (valor) {
      url.searchParams.set(nombre, valor);
    } else {
      url.searchParams.delete(nombre);
    }
    
    window.history.replaceState({}, '', url);
  }

  // ===========================================
  // UTILIDADES DE ESTADO
  // ===========================================

  /**
   * Determina estado de stock basado en cantidad
   * @param {number} cantidad - Cantidad actual
   * @returns {string} Estado del stock
   */
  static determinarEstadoStock(cantidad) {
    if (cantidad <= CONSTANTES_FRONTEND.LIMITES_STOCK.CRITICO) {
      return CONSTANTES_FRONTEND.ESTADOS_STOCK.CRITICO;
    } else if (cantidad <= CONSTANTES_FRONTEND.LIMITES_STOCK.BAJO) {
      return CONSTANTES_FRONTEND.ESTADOS_STOCK.BAJO;
    } else if (cantidad >= CONSTANTES_FRONTEND.LIMITES_STOCK.ALTO) {
      return CONSTANTES_FRONTEND.ESTADOS_STOCK.ALTO;
    }
    
    return CONSTANTES_FRONTEND.ESTADOS_STOCK.NORMAL;
  }

  /**
   * Obtiene clase CSS según estado de stock
   * @param {number} cantidad - Cantidad actual
   * @returns {string} Clase CSS
   */
  static obtenerClaseStock(cantidad) {
    const estado = this.determinarEstadoStock(cantidad);
    
    switch (estado) {
      case CONSTANTES_FRONTEND.ESTADOS_STOCK.CRITICO:
        return 'text-danger fw-bold';
      case CONSTANTES_FRONTEND.ESTADOS_STOCK.BAJO:
        return 'text-warning fw-bold';
      case CONSTANTES_FRONTEND.ESTADOS_STOCK.ALTO:
        return 'text-info fw-bold';
      default:
        return 'text-success fw-bold';
    }
  }

  // ===========================================
  // UTILIDADES DE TIEMPO
  // ===========================================

  /**
   * Pausa ejecución por tiempo determinado
   * @param {number} ms - Milisegundos a esperar
   * @returns {Promise} Promesa que se resuelve tras la pausa
   */
  static async esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Debounce para funciones
   * @param {Function} func - Función a debounce
   * @param {number} delay - Delay en ms
   * @returns {Function} Función con debounce aplicado
   */
  static debounce(func, delay = CONSTANTES_FRONTEND.FORMULARIO.TIEMPO_DEBOUNCE) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  /**
   * Throttle para funciones
   * @param {Function} func - Función a throttle
   * @param {number} delay - Delay en ms
   * @returns {Function} Función con throttle aplicado
   */
  static throttle(func, delay = 1000) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, delay);
      }
    };
  }

  // ===========================================
  // UTILIDADES DE OBJETO
  // ===========================================

  /**
   * Clona objeto profundamente
   * @param {Object} obj - Objeto a clonar
   * @returns {Object} Objeto clonado
   */
  static clonarObjeto(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
      return obj.map(item => this.clonarObjeto(item));
    }
    
    const clonado = {};
    Object.keys(obj).forEach(key => {
      clonado[key] = this.clonarObjeto(obj[key]);
    });
    
    return clonado;
  }

  /**
   * Verifica si un objeto está vacío
   * @param {Object} obj - Objeto a verificar
   * @returns {boolean} True si está vacío
   */
  static objetoVacio(obj) {
    return Object.keys(obj || {}).length === 0;
  }

  /**
   * Filtra propiedades nulas/undefined de un objeto
   * @param {Object} obj - Objeto a filtrar
   * @returns {Object} Objeto filtrado
   */
  static filtrarNulos(obj) {
    const filtrado = {};
    
    Object.keys(obj || {}).forEach(key => {
      if (obj[key] !== null && obj[key] !== undefined) {
        filtrado[key] = obj[key];
      }
    });
    
    return filtrado;
  }

  // ===========================================
  // UTILIDADES DE LOGGING
  // ===========================================

  /**
   * Log con estilo para desarrollo
   * @param {string} nivel - Nivel del log (info, warn, error)
   * @param {string} mensaje - Mensaje a loguear
   * @param {*} datos - Datos adicionales
   */
  static log(nivel, mensaje, datos = null) {
    if (!CONSTANTES_FRONTEND.DEBUG.ENABLED) return;
    
    const color = CONSTANTES_FRONTEND.DEBUG.CONSOLE_COLORS[nivel] || '#000000';
    const timestamp = moment().format('HH:mm:ss.SSS');
    
    console.log(
      `%c[${timestamp}] ${nivel.toUpperCase()}: ${mensaje}`,
      `color: ${color}; font-weight: bold;`,
      datos || ''
    );
  }
}

// Crear alias globales para funciones más usadas
window.formatearFecha = ServicioUtilidades.formatearFecha.bind(ServicioUtilidades);
window.formatearNumero = ServicioUtilidades.formatearNumero.bind(ServicioUtilidades);
window.validarEmail = ServicioUtilidades.validarEmail.bind(ServicioUtilidades);
window.debounce = ServicioUtilidades.debounce.bind(ServicioUtilidades);