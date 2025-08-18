import apiClient from './api'

export const servicioInventario = {
  /**
   * Obtiene el inventario con filtros y paginación.
   * @param {object} params - Objeto con parámetros de filtro y paginación.
   * @param {string} params.planta - Filtrar por planta.
   * @param {number} params.pagina - Número de página.
   * @param {number} params.limite - Registros por página.
   * @returns {Promise<object>} - Devuelve un objeto con { inventario, paginacion }.
   */
  async obtenerInventario(params = {}) {
    // Construir la cadena de consulta (query string) a partir de los parámetros
    const queryString = new URLSearchParams(params).toString()
    return apiClient(`/inventario?${queryString}`)
  },

  /**
   * Registra un nuevo item de inventario.
   * @param {object} datosInventario - Los datos del nuevo inventario.
   * @returns {Promise<object>} - El nuevo registro de inventario creado.
   */
  async registrarInventario(datosInventario) {
    return apiClient('/inventario', {
      method: 'POST',
      body: JSON.stringify(datosInventario)
    })
  }
}
