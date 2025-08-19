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
   * Registra un nuevo movimiento de material.
   * @param {object} datosMovimiento - Los datos del nuevo movimiento.
   * @returns {Promise<object>} - El nuevo movimiento creado.
   */
  async registrarMovimiento(datosMovimiento) {
    return clienteApi("/trazabilidad", {
      method: "POST",
      body: JSON.stringify(datosMovimiento),
    });
  },
};
