import apiClient from './api'

export const servicioTrazabilidad = {
  /**
   * Obtiene los movimientos de trazabilidad con filtros y paginación.
   * @param {object} params - Objeto con parámetros de filtro y paginación.
   * @returns {Promise<object>} - Devuelve un objeto con { movimientos, paginacion }.
   */
  async obtenerMovimientos(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return apiClient(`/trazabilidad?${queryString}`)
  },

  /**
   * Registra un nuevo movimiento de material.
   * @param {object} datosMovimiento - Los datos del nuevo movimiento.
   * @returns {Promise<object>} - El nuevo movimiento creado.
   */
  async registrarMovimiento(datosMovimiento) {
    return apiClient('/trazabilidad', {
      method: 'POST',
      body: JSON.stringify(datosMovimiento)
    })
  }
}
