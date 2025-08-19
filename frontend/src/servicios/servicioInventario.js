import clienteApi from "./api";

export const servicioInventario = {
  /**
   * Obtiene el inventario con filtros y paginación.
   * @param {object} params - Objeto con parámetros de filtro y paginación.
   * @returns {Promise<Array>} - Devuelve un array de registros de inventario.
   */
  async obtenerInventario(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const respuesta = await clienteApi(`/inventario?${queryString}`);

      console.log("Respuesta completa del inventario:", respuesta);

      // Extraer los datos según la nueva estructura de la API
      if (respuesta?.exito && respuesta?.datos?.inventario) {
        return respuesta.datos.inventario;
      }

      // Fallback para otros formatos
      if (respuesta?.datos && Array.isArray(respuesta.datos)) {
        return respuesta.datos;
      }

      return Array.isArray(respuesta) ? respuesta : [];
    } catch (error) {
      console.error("Error al obtener inventario:", error);
      return [];
    }
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
   * Registra un nuevo elemento de inventario
   * @param {Object} datosInventario - Datos del nuevo inventario
   * @param {string} datosInventario.planta - Planta donde se encuentra el inventario
   * @param {string} datosInventario.codigo_material - Código del material
   * @param {string} datosInventario.ubicacion - Ubicación del material
   * @param {string} datosInventario.lote - Lote del material
   * @param {number} datosInventario.stock - Cantidad en stock
   * @param {string} datosInventario.unidad_medida - Unidad de medida
   * @returns {Promise<Object>} - Registro de inventario creado
   */
  async crearInventario(datosInventario) {
    return clienteApi("/inventario", {
      method: "POST",
      body: JSON.stringify(datosInventario),
    });
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
