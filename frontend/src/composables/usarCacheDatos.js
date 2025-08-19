import { ref, computed } from "vue";

/**
 * Composable para gestión de cache de datos
 * Evita peticiones innecesarias manteniendo datos en memoria
 */

// Cache global de datos (compartido entre todas las instancias)
const cacheDatos = ref(new Map());
const tiemposCache = ref(new Map());

// Configuración de cache
const TIEMPO_EXPIRACION_MS = 5 * 60 * 1000; // 5 minutos
const TIEMPO_EXPIRACION_UBICACIONES_MS = 30 * 60 * 1000; // 30 minutos (más estables)

export function usarCacheDatos() {
  /**
   * Obtiene datos del cache si están disponibles y no han expirado
   * @param {string} clave - Clave del cache
   * @returns {any|null} Datos del cache o null si no existen o expiraron
   */
  function obtenerDelCache(clave) {
    const tiempoGuardado = tiemposCache.value.get(clave);
    const ahora = Date.now();

    // Determinar tiempo de expiración según el tipo de dato
    let tiempoExpiracion = TIEMPO_EXPIRACION_MS;
    if (clave.includes("ubicaciones") || clave.includes("mantenedores")) {
      tiempoExpiracion = TIEMPO_EXPIRACION_UBICACIONES_MS;
    }

    // Verificar si los datos han expirado
    if (!tiempoGuardado || ahora - tiempoGuardado > tiempoExpiracion) {
      // Limpiar datos expirados
      if (cacheDatos.value.has(clave)) {
        cacheDatos.value.delete(clave);
        tiemposCache.value.delete(clave);
      }
      return null;
    }

    return cacheDatos.value.get(clave) || null;
  }

  /**
   * Guarda datos en el cache
   * @param {string} clave - Clave del cache
   * @param {any} datos - Datos a guardar
   */
  function guardarEnCache(clave, datos) {
    cacheDatos.value.set(clave, datos);
    tiemposCache.value.set(clave, Date.now());
  }

  /**
   * Ejecuta una función de carga de datos con cache
   * @param {string} clave - Clave única para el cache
   * @param {Function} funcionCarga - Función que carga los datos
   * @returns {Promise<any>} Datos (del cache o cargados)
   */
  async function obtenerConCache(clave, funcionCarga) {
    // Intentar obtener del cache primero
    const datosCache = obtenerDelCache(clave);
    if (datosCache !== null) {
      console.log(`📦 Datos obtenidos del cache: ${clave}`);
      return datosCache;
    }

    // Si no están en cache, cargar y guardar
    try {
      console.log(`🌐 Cargando datos desde API: ${clave}`);
      const datos = await funcionCarga();
      guardarEnCache(clave, datos);
      return datos;
    } catch (error) {
      console.error(`❌ Error cargando datos para ${clave}:`, error);
      throw error;
    }
  }

  /**
   * Invalida (elimina) datos específicos del cache
   * @param {string} clave - Clave del cache a invalidar
   */
  function invalidarCache(clave) {
    cacheDatos.value.delete(clave);
    tiemposCache.value.delete(clave);
    console.log(`🗑️ Cache invalidado: ${clave}`);
  }

  /**
   * Invalida datos del cache que contengan un patrón
   * @param {string} patron - Patrón a buscar en las claves
   */
  function invalidarCachePorPatron(patron) {
    const clavesAEliminar = [];

    for (const clave of cacheDatos.value.keys()) {
      if (clave.includes(patron)) {
        clavesAEliminar.push(clave);
      }
    }

    clavesAEliminar.forEach((clave) => {
      cacheDatos.value.delete(clave);
      tiemposCache.value.delete(clave);
    });

    if (clavesAEliminar.length > 0) {
      console.log(
        `🗑️ Cache invalidado para patrón "${patron}": ${clavesAEliminar.length} entradas`
      );
    }
  }

  /**
   * Limpia todo el cache
   */
  function limpiarTodoElCache() {
    const cantidadEntradas = cacheDatos.value.size;
    cacheDatos.value.clear();
    tiemposCache.value.clear();
    console.log(
      `🧹 Cache completamente limpiado: ${cantidadEntradas} entradas eliminadas`
    );
  }

  /**
   * Genera una clave de cache basada en parámetros
   * @param {string} base - Base de la clave
   * @param {Object} parametros - Parámetros para la clave
   * @returns {string} Clave de cache generada
   */
  function generarClaveCache(base, parametros = {}) {
    if (!parametros || Object.keys(parametros).length === 0) {
      return base;
    }

    // Ordenar parámetros para consistencia
    const parametrosOrdenados = Object.keys(parametros)
      .sort()
      .reduce((resultado, clave) => {
        resultado[clave] = parametros[clave];
        return resultado;
      }, {});

    const cadenaParametros = JSON.stringify(parametrosOrdenados);
    return `${base}_${btoa(cadenaParametros)}`;
  }

  /**
   * Estadísticas del cache
   */
  const estadisticasCache = computed(() => {
    const ahora = Date.now();
    const entradas = [];

    for (const [clave, tiempo] of tiemposCache.value.entries()) {
      const tiempoExpiracion =
        clave.includes("ubicaciones") || clave.includes("mantenedores")
          ? TIEMPO_EXPIRACION_UBICACIONES_MS
          : TIEMPO_EXPIRACION_MS;

      const tiempoRestante = tiempoExpiracion - (ahora - tiempo);
      const vigente = tiempoRestante > 0;

      entradas.push({
        clave,
        vigente,
        tiempoRestante: vigente ? Math.round(tiempoRestante / 1000) : 0,
      });
    }

    return {
      totalEntradas: cacheDatos.value.size,
      entradasVigentes: entradas.filter((e) => e.vigente).length,
      entradasExpiradas: entradas.filter((e) => !e.vigente).length,
      entradas,
    };
  });

  /**
   * Limpia entradas expiradas del cache
   */
  function limpiarEntradasExpiradas() {
    const ahora = Date.now();
    const clavesAEliminar = [];

    for (const [clave, tiempo] of tiemposCache.value.entries()) {
      const tiempoExpiracion =
        clave.includes("ubicaciones") || clave.includes("mantenedores")
          ? TIEMPO_EXPIRACION_UBICACIONES_MS
          : TIEMPO_EXPIRACION_MS;

      if (ahora - tiempo > tiempoExpiracion) {
        clavesAEliminar.push(clave);
      }
    }

    clavesAEliminar.forEach((clave) => {
      cacheDatos.value.delete(clave);
      tiemposCache.value.delete(clave);
    });

    if (clavesAEliminar.length > 0) {
      console.log(
        `🧹 Entradas expiradas eliminadas: ${clavesAEliminar.length}`
      );
    }

    return clavesAEliminar.length;
  }

  return {
    // Métodos principales
    obtenerConCache,
    invalidarCache,
    invalidarCachePorPatron,
    limpiarTodoElCache,
    limpiarEntradasExpiradas,

    // Utilidades
    generarClaveCache,
    obtenerDelCache,
    guardarEnCache,

    // Estadísticas
    estadisticasCache,
  };
}
