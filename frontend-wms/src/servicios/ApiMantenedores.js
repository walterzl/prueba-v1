/**
 * API de Mantenedores - Frontend
 * Servicio centralizado para acceder a los datos maestros del sistema
 * Incluye cache para optimizar rendimiento
 */

class ApiMantenedores {
  constructor() {
    this.cache = new Map();
    this.timeouts = new Map();
    this.configurarEventListeners();
  }

  /**
   * Configura los event listeners
   */
  configurarEventListeners() {
    // Limpiar cache cuando se cierre sesión
    window.addEventListener('sesion-cerrada', () => {
      this.limpiarCache();
    });

    // Limpiar cache cuando se renueve token
    window.addEventListener('token-renovado', () => {
      // Opcional: renovar datos críticos
      this.renovarDatosCriticos();
    });
  }

  /**
   * Obtiene datos del cache o del servidor
   * @param {string} clave - Clave del cache
   * @param {Function} fetchFunction - Función para obtener datos del servidor
   * @param {number} duracion - Duración del cache en ms
   * @returns {Promise} Promesa con los datos
   */
  async obtenerConCache(clave, fetchFunction, duracion = CONSTANTES_FRONTEND.CACHE.DURACION_MANTENEDORES) {
    // Verificar si existe en cache y no ha expirado
    const datosCache = this.cache.get(clave);
    if (datosCache && (Date.now() - datosCache.timestamp) < duracion) {
      console.log(`📦 Datos obtenidos del cache: ${clave}`);
      return datosCache.datos;
    }

    try {
      // Obtener datos del servidor
      console.log(`🌐 Obteniendo datos del servidor: ${clave}`);
      const datos = await fetchFunction();

      // Guardar en cache
      this.cache.set(clave, {
        datos: datos,
        timestamp: Date.now()
      });

      // Configurar limpieza automática
      this.configurarLimpiezaAutomatica(clave, duracion);

      return datos;

    } catch (error) {
      // Si hay error y existe cache (aunque esté expirado), usarlo
      if (datosCache) {
        console.warn(`⚠️ Error al obtener ${clave}, usando cache expirado`);
        return datosCache.datos;
      }

      throw error;
    }
  }

  /**
   * Configura la limpieza automática del cache
   * @param {string} clave - Clave del cache
   * @param {number} duracion - Duración del cache
   */
  configurarLimpiezaAutomatica(clave, duracion) {
    // Limpiar timeout anterior si existe
    const timeoutAnterior = this.timeouts.get(clave);
    if (timeoutAnterior) {
      clearTimeout(timeoutAnterior);
    }

    // Configurar nuevo timeout
    const timeout = setTimeout(() => {
      this.cache.delete(clave);
      this.timeouts.delete(clave);
      console.log(`🧹 Cache limpiado automáticamente: ${clave}`);
    }, duracion);

    this.timeouts.set(clave, timeout);
  }

  // ===========================================
  // PLANTAS
  // ===========================================

  /**
   * Obtiene todas las plantas
   * @param {boolean} forzarActualizacion - Si debe ignorar el cache
   * @returns {Promise<Array>} Lista de plantas
   */
  async obtenerPlantas(forzarActualizacion = false) {
    const clave = 'plantas';
    
    if (forzarActualizacion) {
      this.cache.delete(clave);
    }

    return await this.obtenerConCache(
      clave,
      () => servicioHttp.get(ENDPOINTS_FRONTEND.MANTENEDORES.PLANTAS)
    );
  }

  // ===========================================
  // MATERIALES
  // ===========================================

  /**
   * Obtiene todos los materiales
   * @param {boolean} activo - Filtrar por materiales activos
   * @param {boolean} forzarActualizacion - Si debe ignorar el cache
   * @returns {Promise<Array>} Lista de materiales
   */
  async obtenerMateriales(activo = true, forzarActualizacion = false) {
    const clave = `materiales_${activo}`;
    
    if (forzarActualizacion) {
      this.cache.delete(clave);
    }

    return await this.obtenerConCache(
      clave,
      () => servicioHttp.get(ENDPOINTS_FRONTEND.MANTENEDORES.MATERIALES, { activo })
    );
  }

  /**
   * Obtiene un material por código
   * @param {string} codigo - Código del material
   * @returns {Promise<Object>} Datos del material
   */
  async obtenerMaterialPorCodigo(codigo) {
    const clave = `material_${codigo}`;
    
    return await this.obtenerConCache(
      clave,
      () => servicioHttp.get(`${ENDPOINTS_FRONTEND.MANTENEDORES.MATERIAL_POR_CODIGO}/${codigo}`),
      CONSTANTES_FRONTEND.CACHE.DURACION_MANTENEDORES / 2 // Cache más corto para búsquedas específicas
    );
  }

  /**
   * Busca materiales por término
   * @param {string} termino - Término de búsqueda
   * @param {boolean} activo - Solo materiales activos
   * @returns {Promise<Array>} Materiales encontrados
   */
  async buscarMateriales(termino, activo = true) {
    const materiales = await this.obtenerMateriales(activo);
    
    if (!termino || termino.trim() === '') {
      return materiales.datos || [];
    }

    const terminoLower = termino.toLowerCase().trim();
    
    return (materiales.datos || []).filter(material => 
      material.codigo.toLowerCase().includes(terminoLower) ||
      material.nombre.toLowerCase().includes(terminoLower)
    );
  }

  // ===========================================
  // PROVEEDORES
  // ===========================================

  /**
   * Obtiene todos los proveedores
   * @param {boolean} activo - Filtrar por proveedores activos
   * @param {boolean} forzarActualizacion - Si debe ignorar el cache
   * @returns {Promise<Array>} Lista de proveedores
   */
  async obtenerProveedores(activo = true, forzarActualizacion = false) {
    const clave = `proveedores_${activo}`;
    
    if (forzarActualizacion) {
      this.cache.delete(clave);
    }

    return await this.obtenerConCache(
      clave,
      () => servicioHttp.get(ENDPOINTS_FRONTEND.MANTENEDORES.PROVEEDORES, { activo })
    );
  }

  /**
   * Obtiene un proveedor por código
   * @param {string} codigo - Código del proveedor
   * @returns {Promise<Object>} Datos del proveedor
   */
  async obtenerProveedorPorCodigo(codigo) {
    const clave = `proveedor_${codigo}`;
    
    return await this.obtenerConCache(
      clave,
      () => servicioHttp.get(`${ENDPOINTS_FRONTEND.MANTENEDORES.PROVEEDOR_POR_CODIGO}/${codigo}`),
      CONSTANTES_FRONTEND.CACHE.DURACION_MANTENEDORES / 2
    );
  }

  /**
   * Busca proveedores por término
   * @param {string} termino - Término de búsqueda
   * @param {boolean} activo - Solo proveedores activos
   * @returns {Promise<Array>} Proveedores encontrados
   */
  async buscarProveedores(termino, activo = true) {
    const proveedores = await this.obtenerProveedores(activo);
    
    if (!termino || termino.trim() === '') {
      return proveedores.datos || [];
    }

    const terminoLower = termino.toLowerCase().trim();
    
    return (proveedores.datos || []).filter(proveedor => 
      proveedor.codigo.toLowerCase().includes(terminoLower) ||
      proveedor.nombre.toLowerCase().includes(terminoLower) ||
      (proveedor.rut && proveedor.rut.includes(terminoLower))
    );
  }

  // ===========================================
  // UBICACIONES
  // ===========================================

  /**
   * Obtiene todas las ubicaciones
   * @param {boolean} activo - Filtrar por ubicaciones activas
   * @param {boolean} forzarActualizacion - Si debe ignorar el cache
   * @returns {Promise<Array>} Lista de ubicaciones
   */
  async obtenerUbicaciones(activo = true, forzarActualizacion = false) {
    const clave = `ubicaciones_${activo}`;
    
    if (forzarActualizacion) {
      this.cache.delete(clave);
    }

    return await this.obtenerConCache(
      clave,
      () => servicioHttp.get(ENDPOINTS_FRONTEND.MANTENEDORES.UBICACIONES, { activo })
    );
  }

  /**
   * Obtiene ubicaciones por planta
   * @param {string} planta - Código de la planta
   * @param {boolean} activo - Filtrar por ubicaciones activas
   * @param {boolean} forzarActualizacion - Si debe ignorar el cache
   * @returns {Promise<Array>} Lista de ubicaciones de la planta
   */
  async obtenerUbicacionesPorPlanta(planta, activo = true, forzarActualizacion = false) {
    const clave = `ubicaciones_planta_${planta}_${activo}`;
    
    if (forzarActualizacion) {
      this.cache.delete(clave);
    }

    return await this.obtenerConCache(
      clave,
      () => servicioHttp.get(`${ENDPOINTS_FRONTEND.MANTENEDORES.UBICACIONES_POR_PLANTA}/${planta}`, { activo })
    );
  }

  // ===========================================
  // TEMPORADAS
  // ===========================================

  /**
   * Obtiene todas las temporadas
   * @param {boolean} forzarActualizacion - Si debe ignorar el cache
   * @returns {Promise<Array>} Lista de temporadas
   */
  async obtenerTemporadas(forzarActualizacion = false) {
    const clave = 'temporadas';
    
    if (forzarActualizacion) {
      this.cache.delete(clave);
    }

    return await this.obtenerConCache(
      clave,
      () => servicioHttp.get(ENDPOINTS_FRONTEND.MANTENEDORES.TEMPORADAS)
    );
  }

  /**
   * Obtiene la temporada activa
   * @param {boolean} forzarActualizacion - Si debe ignorar el cache
   * @returns {Promise<Object>} Temporada activa
   */
  async obtenerTemporadaActiva(forzarActualizacion = false) {
    const clave = 'temporada_activa';
    
    if (forzarActualizacion) {
      this.cache.delete(clave);
    }

    return await this.obtenerConCache(
      clave,
      () => servicioHttp.get(ENDPOINTS_FRONTEND.MANTENEDORES.TEMPORADA_ACTIVA),
      CONSTANTES_FRONTEND.CACHE.DURACION_MANTENEDORES / 4 // Cache más corto para temporada activa
    );
  }

  // ===========================================
  // TIPOS DE MOVIMIENTO
  // ===========================================

  /**
   * Obtiene todos los tipos de movimiento
   * @param {boolean} activo - Filtrar por tipos activos
   * @param {boolean} forzarActualizacion - Si debe ignorar el cache
   * @returns {Promise<Array>} Lista de tipos de movimiento
   */
  async obtenerTiposMovimiento(activo = true, forzarActualizacion = false) {
    const clave = `tipos_movimiento_${activo}`;
    
    if (forzarActualizacion) {
      this.cache.delete(clave);
    }

    return await this.obtenerConCache(
      clave,
      () => servicioHttp.get(ENDPOINTS_FRONTEND.MANTENEDORES.TIPOS_MOVIMIENTO, { activo })
    );
  }

  // ===========================================
  // UNIDADES DE MEDIDA
  // ===========================================

  /**
   * Obtiene todas las unidades de medida
   * @param {boolean} forzarActualizacion - Si debe ignorar el cache
   * @returns {Promise<Array>} Lista de unidades de medida
   */
  async obtenerUnidadesMedida(forzarActualizacion = false) {
    const clave = 'unidades_medida';
    
    if (forzarActualizacion) {
      this.cache.delete(clave);
    }

    return await this.obtenerConCache(
      clave,
      () => servicioHttp.get(ENDPOINTS_FRONTEND.MANTENEDORES.UNIDADES_MEDIDA)
    );
  }

  // ===========================================
  // RESUMEN
  // ===========================================

  /**
   * Obtiene el resumen de todos los mantenedores
   * @param {boolean} forzarActualizacion - Si debe ignorar el cache
   * @returns {Promise<Object>} Resumen de mantenedores
   */
  async obtenerResumen(forzarActualizacion = false) {
    const clave = 'resumen_mantenedores';
    
    if (forzarActualizacion) {
      this.cache.delete(clave);
    }

    return await this.obtenerConCache(
      clave,
      () => servicioHttp.get(ENDPOINTS_FRONTEND.MANTENEDORES.RESUMEN),
      CONSTANTES_FRONTEND.CACHE.DURACION_MANTENEDORES / 2
    );
  }

  // ===========================================
  // MÉTODOS DE UTILIDAD
  // ===========================================

  /**
   * Precarga todos los datos maestros
   * @returns {Promise<Object>} Resultado de la precarga
   */
  async precargarDatos() {
    console.log('🚀 Precargando datos maestros...');
    
    const promesas = [
      this.obtenerPlantas(),
      this.obtenerMateriales(),
      this.obtenerProveedores(),
      this.obtenerUbicaciones(),
      this.obtenerTemporadas(),
      this.obtenerTiposMovimiento(),
      this.obtenerUnidadesMedida()
    ];

    try {
      await Promise.all(promesas);
      console.log('✅ Datos maestros precargados exitosamente');
      return { exito: true, mensaje: 'Datos precargados' };
    } catch (error) {
      console.error('❌ Error al precargar datos:', error);
      return { exito: false, mensaje: 'Error al precargar datos' };
    }
  }

  /**
   * Renueva los datos críticos
   */
  async renovarDatosCriticos() {
    console.log('🔄 Renovando datos críticos...');
    
    const datosCriticos = ['temporada_activa', 'plantas', 'resumen_mantenedores'];
    
    datosCriticos.forEach(clave => {
      this.cache.delete(clave);
    });

    // Precargar de nuevo
    try {
      await this.obtenerTemporadaActiva();
      await this.obtenerPlantas();
      await this.obtenerResumen();
      
      console.log('✅ Datos críticos renovados');
    } catch (error) {
      console.error('❌ Error al renovar datos críticos:', error);
    }
  }

  /**
   * Limpia todo el cache
   */
  limpiarCache() {
    console.log('🧹 Limpiando cache de mantenedores...');
    
    // Limpiar timeouts
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
    
    // Limpiar cache
    this.cache.clear();
  }

  /**
   * Limpia el cache de una clave específica
   * @param {string} clave - Clave a limpiar
   */
  limpiarCacheItem(clave) {
    const timeout = this.timeouts.get(clave);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(clave);
    }
    
    this.cache.delete(clave);
    console.log(`🧹 Cache limpiado: ${clave}`);
  }

  /**
   * Obtiene el estado del cache
   * @returns {Object} Estado del cache
   */
  obtenerEstadoCache() {
    return {
      tamaño: this.cache.size,
      items: Array.from(this.cache.keys()),
      timeouts: this.timeouts.size
    };
  }

  /**
   * Invalida todo el cache y fuerza actualización
   */
  async invalidarYActualizar() {
    this.limpiarCache();
    return await this.precargarDatos();
  }
}

// Crear instancia global del API de mantenedores
const apiMantenedores = new ApiMantenedores();