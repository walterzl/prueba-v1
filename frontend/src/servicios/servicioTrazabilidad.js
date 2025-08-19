import clienteApi from "./api";

export const servicioTrazabilidad = {
  /**
   * Obtiene los movimientos de trazabilidad con filtros y paginación.
   * @param {object} params - Objeto con parámetros de filtro y paginación.
   * @returns {Promise<Array>} - Devuelve un array de movimientos.
   */
  async obtenerMovimientos(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const respuesta = await clienteApi(`/trazabilidad?${queryString}`);

      // Extraer los datos según la estructura de la API
      if (respuesta?.datos?.movimientos) {
        return respuesta.datos.movimientos;
      }

      // Fallback para otros formatos
      return Array.isArray(respuesta) ? respuesta : [];
    } catch (error) {
      console.error("Error al obtener movimientos de trazabilidad:", error);
      return [];
    }
  },

  /**
   * Crea un nuevo movimiento de trazabilidad
   * @param {Object} datosMovimiento - Datos del movimiento a crear
   * @returns {Promise<Object>} Movimiento creado
   */
  async crearMovimiento(datosMovimiento) {
    try {
      const datosNormalizados = this.normalizarDatosMovimiento(datosMovimiento);
      const respuesta = await clienteApi("/trazabilidad", {
        method: "POST",
        body: JSON.stringify(datosNormalizados),
      });

      return respuesta?.datos || respuesta;
    } catch (error) {
      console.error("Error al crear movimiento:", error);
      throw new Error("No se pudo crear el movimiento de trazabilidad");
    }
  },

  /**
   * Normaliza los datos del movimiento antes de enviarlos a la API
   * @param {Object} datos - Datos originales del formulario
   * @returns {Object} Datos normalizados para la API
   */
  normalizarDatosMovimiento(datos) {
    return {
      planta: datos.planta || "Rancagua",
      codigo_material: datos.codigo_material,
      lote: datos.lote,
      tarja: datos.tarja,
      tipo_movimiento: datos.tipo_movimiento,
      cantidad: parseFloat(datos.cantidad) || 0,
      ubicacion_origen: datos.ubicacion_origen,
      ubicacion_destino: datos.ubicacion_destino,
      turno: datos.turno,
      fecha_movimiento: datos.fecha_movimiento,
      observaciones: datos.observaciones,
    };
  },

  /**
   * Registra un nuevo movimiento de material (alias para compatibilidad)
   * @param {Object} datosMovimiento - Los datos del nuevo movimiento
   * @returns {Promise<Object>} El nuevo movimiento creado
   */
  async registrarMovimiento(datosMovimiento) {
    return this.crearMovimiento(datosMovimiento);
  },
};
