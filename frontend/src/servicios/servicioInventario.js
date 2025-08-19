import clienteApi from "./api";

export const servicioInventario = {
  /**
   * Obtiene la lista de inventario con filtros opcionales
   * @param {Object} parametros - Parámetros de consulta
   * @param {string} parametros.planta - Planta a filtrar
   * @param {string} parametros.busqueda - Texto de búsqueda
   * @param {number} parametros.limite - Cantidad máxima de registros
   * @returns {Promise<Array>} Lista de registros de inventario
   */
  async obtenerInventario(parametros = {}) {
    try {
      const datosConsulta = new URLSearchParams(parametros).toString();
      const respuesta = await clienteApi(`/inventario?${datosConsulta}`);

      // Simplificar extracción de datos
      return this.extraerDatosInventario(respuesta);
    } catch (error) {
      console.error("Error al obtener inventario:", error);
      throw new Error("No se pudo cargar el inventario");
    }
  },

  /**
   * Extrae los datos de inventario de la respuesta de la API
   * @param {Object} respuesta - Respuesta de la API
   * @returns {Array} Lista de inventario normalizada
   */
  extraerDatosInventario(respuesta) {
    // Estructura principal de la API
    if (respuesta?.exito && respuesta?.datos?.inventario) {
      return respuesta.datos.inventario;
    }

    // Estructura alternativa
    if (respuesta?.datos && Array.isArray(respuesta.datos)) {
      return respuesta.datos;
    }

    // Respuesta directa como array
    if (Array.isArray(respuesta)) {
      return respuesta;
    }

    return [];
  },

  /**
   * Obtiene un registro específico de inventario por ID
   * @param {number} id - ID del registro de inventario
   * @returns {Promise<Object>} - Datos del registro de inventario
   */
  async obtenerInventarioPorId(id) {
    return clienteApi(`/inventario/${id}`);
  },

  /**
   * Crea un nuevo registro de inventario
   * @param {Object} datosInventario - Información del inventario a crear
   * @returns {Promise<Object>} Registro de inventario creado
   */
  async crearRegistroInventario(datosInventario) {
    try {
      const datosNormalizados = this.normalizarDatosInventario(datosInventario);
      const respuesta = await clienteApi("/inventario", {
        method: "POST",
        body: JSON.stringify(datosNormalizados),
      });

      return respuesta?.datos || respuesta;
    } catch (error) {
      console.error("Error al crear inventario:", error);
      throw new Error("No se pudo crear el registro de inventario");
    }
  },

  /**
   * Normaliza los datos de inventario antes de enviarlos a la API
   * @param {Object} datos - Datos originales del formulario
   * @returns {Object} Datos normalizados para la API
   */
  normalizarDatosInventario(datos) {
    return {
      planta: datos.planta || "Rancagua",
      codigo_material: datos.title || datos.codigo_material,
      ubicacion: datos.ubicacion,
      lote: datos.lote,
      stock: parseFloat(datos.stock) || 0,
      pallets: parseInt(datos.pallets) || 0,
      bodega: datos.bodega,
      fecha_inventario: datos.fecha_inventario,
      condicion_armado: datos.condicion_armado,
      contado_por: datos.contado_por,
    };
  },

  /**
   * Actualiza un registro de inventario existente
   * @param {number} id - ID del registro a actualizar
   * @param {Object} datosActualizados - Datos a actualizar
   * @returns {Promise<Object>} - Registro de inventario actualizado
   */
  async actualizarInventario(id, datosActualizados) {
    return clienteApi(`/inventario/${id}`, {
      method: "PUT",
      body: JSON.stringify(datosActualizados),
    });
  },

  /**
   * Elimina un registro de inventario
   * @param {number} id - ID del registro a eliminar
   * @returns {Promise<void>}
   */
  async eliminarInventario(id) {
    return clienteApi(`/inventario/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Obtiene estadísticas generales del inventario
   * @param {string} planta - Planta específica (opcional)
   * @returns {Promise<Object>} - Estadísticas del inventario
   */
  async obtenerEstadisticasInventario(planta = null) {
    const parametros = planta ? { planta } : {};
    const cadenaConsulta = new URLSearchParams(parametros).toString();
    const url = cadenaConsulta
      ? `/inventario/estadisticas?${cadenaConsulta}`
      : "/inventario/estadisticas";
    return clienteApi(url);
  },
};
