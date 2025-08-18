import apiClient from './api'

export const servicioRecepcionLotes = {
  /**
   * Obtiene las recepciones de lotes con filtros y paginación.
   * @param {object} params - Objeto con parámetros de filtro y paginación.
   * @returns {Promise<object>} - Devuelve un objeto con { recepciones, paginacion }.
   */
  async obtenerRecepciones(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    // El endpoint es /api/recepciones-lotes según la documentación
    return apiClient(`/recepciones-lotes?${queryString}`)
  },

  /**
   * Registra una nueva recepción de lote.
   * @param {object} datosRecepcion - Los datos de la nueva recepción.
   * @returns {Promise<object>} - La nueva recepción creada.
   */
  async registrarRecepcion(datosRecepcion) {
    return apiClient('/recepciones-lotes', {
      method: 'POST',
      body: JSON.stringify(datosRecepcion)
    })
  }
}
