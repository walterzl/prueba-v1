import clienteApi from "./api";

export const servicioRecepcionLotes = {
  /**
   * Obtiene las recepciones de lotes con filtros y paginación.
   * @param {object} params - Objeto con parámetros de filtro y paginación.
   * @returns {Promise<Array>} - Devuelve un array de recepciones.
   */
  async obtenerRecepciones(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const respuesta = await clienteApi(`/recepciones-lotes?${queryString}`);

      // Extraer los datos según la estructura de la API
      if (respuesta?.datos?.recepciones) {
        return respuesta.datos.recepciones;
      }

      // Fallback para otros formatos
      return Array.isArray(respuesta?.datos)
        ? respuesta.datos
        : Array.isArray(respuesta)
        ? respuesta
        : [];
    } catch (error) {
      console.error("Error al obtener recepciones de lotes:", error);
      return [];
    }
  },

  /**
   * Registra una nueva recepción de lote.
   * @param {object} datosRecepcion - Los datos de la nueva recepción.
   * @returns {Promise<object>} - La nueva recepción creada.
   */
  async crearRecepcion(datosRecepcion) {
    try {
      const respuesta = await clienteApi("/recepciones-lotes", {
        method: "POST",
        body: JSON.stringify(datosRecepcion),
      });
      return respuesta?.datos || respuesta;
    } catch (error) {
      console.error("Error al crear recepción:", error);
      throw error;
    }
  },

  /**
   * Actualiza una recepción existente.
   * @param {string} id - ID de la recepción a actualizar.
   * @param {object} datosRecepcion - Los datos actualizados.
   * @returns {Promise<object>} - La recepción actualizada.
   */
  async actualizarRecepcion(id, datosRecepcion) {
    try {
      const respuesta = await clienteApi(`/recepciones-lotes/${id}`, {
        method: "PUT",
        body: JSON.stringify(datosRecepcion),
      });
      return respuesta?.datos || respuesta;
    } catch (error) {
      console.error("Error al actualizar recepción:", error);
      throw error;
    }
  },

  /**
   * Obtiene una recepción específica por ID.
   * @param {string} id - ID de la recepción.
   * @returns {Promise<object>} - Los datos de la recepción.
   */
  async obtenerRecepcionPorId(id) {
    try {
      const respuesta = await clienteApi(`/recepciones-lotes/${id}`);
      return respuesta?.datos || respuesta;
    } catch (error) {
      console.error("Error al obtener recepción por ID:", error);
      return null;
    }
  },

  /**
   * Elimina una recepción.
   * @param {string} id - ID de la recepción a eliminar.
   * @returns {Promise<boolean>} - True si se eliminó correctamente.
   */
  async eliminarRecepcion(id) {
    try {
      await clienteApi(`/recepciones-lotes/${id}`, {
        method: "DELETE",
      });
      return true;
    } catch (error) {
      console.error("Error al eliminar recepción:", error);
      throw error;
    }
  },
};
