import apiClient from './api'

export const servicioTarjas = {
  /**
   * Obtiene las tarjas con filtros y paginación.
   * @param {object} params - Objeto con filtros (ej. tipo_tarja: 'CAA').
   * @returns {Promise<object>} - Devuelve un objeto con { tarjas, paginacion }.
   */
  async obtenerTarjas(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return apiClient(`/tarjas?${queryString}`)
  },

  /**
   * Registra una nueva tarja.
   * @param {object} datosTarja - Los datos de la nueva tarja.
   * @returns {Promise<object>} - La nueva tarja creada.
   */
  async registrarTarja(datosTarja) {
    return apiClient('/tarjas', {
      method: 'POST',
      body: JSON.stringify(datosTarja)
    })
  }
}
