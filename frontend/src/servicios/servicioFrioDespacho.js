import apiClient from './api'

export const servicioFrioDespacho = {
  /**
   * Obtiene las operaciones de frío y despacho.
   * @param {object} params - Objeto con parámetros de filtro y paginación.
   * @returns {Promise<object>} - Devuelve un objeto con { operaciones, paginacion }.
   */
  async obtenerOperaciones(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return apiClient(`/operaciones-frio-despacho?${queryString}`)
  },

  /**
   * Registra una nueva operación de frío o despacho.
   * @param {object} datosOperacion - Los datos de la nueva operación.
   * @returns {Promise<object>} - La nueva operación creada.
   */
  async registrarOperacion(datosOperacion) {
    return apiClient('/operaciones-frio-despacho', {
      method: 'POST',
      body: JSON.stringify(datosOperacion)
    })
  }
}
