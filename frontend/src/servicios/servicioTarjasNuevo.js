/**
 * Servicio simplificado para gestión de tarjas
 * Maneja las operaciones básicas usando clienteApi directamente
 */

import clienteApi from "./api";

export class ServicioTarjas {
  constructor() {
    this.rutaBase = "/tarjas";
  }

  /**
   * Obtiene la lista de tarjas con filtros opcionales
   * @param {Object} filtros - Filtros para la consulta
   * @returns {Promise<Array>} Lista de tarjas
   */
  async obtenerTarjas(filtros = {}) {
    try {
      const parametros = new URLSearchParams();

      if (filtros.planta) {
        parametros.append("planta", filtros.planta);
      }

      if (filtros.tipoTarja) {
        parametros.append("tipo_tarja", filtros.tipoTarja);
      }

      if (filtros.fechaDesde) {
        parametros.append("fechaDesde", filtros.fechaDesde);
      }

      if (filtros.fechaHasta) {
        parametros.append("fechaHasta", filtros.fechaHasta);
      }

      if (filtros.estado) {
        parametros.append("estado", filtros.estado);
      }

      const url = parametros.toString()
        ? `${this.rutaBase}?${parametros.toString()}`
        : this.rutaBase;

      const respuesta = await clienteApi(url);
      return respuesta || [];
    } catch (error) {
      console.error("Error al obtener tarjas:", error);
      throw error;
    }
  }

  /**
   * Crea una nueva tarja
   * @param {Object} datosTarja - Datos de la tarja
   * @returns {Promise<Object>} Tarja creada
   */
  async crearTarja(datosTarja) {
    try {
      const respuesta = await clienteApi(this.rutaBase, {
        method: "POST",
        body: JSON.stringify(datosTarja),
      });
      return respuesta;
    } catch (error) {
      console.error("Error al crear tarja:", error);
      throw error;
    }
  }

  /**
   * Actualiza una tarja existente
   * @param {string|number} id - ID de la tarja
   * @param {Object} datosTarja - Datos actualizados
   * @returns {Promise<Object>} Tarja actualizada
   */
  async actualizarTarja(id, datosTarja) {
    if (!id) {
      throw new Error("ID de tarja es requerido");
    }

    try {
      const respuesta = await clienteApi(`${this.rutaBase}/${id}`, {
        method: "PUT",
        body: JSON.stringify(datosTarja),
      });
      return respuesta;
    } catch (error) {
      console.error(`Error al actualizar tarja ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina una tarja
   * @param {string|number} id - ID de la tarja
   * @returns {Promise<void>}
   */
  async eliminarTarja(id) {
    if (!id) {
      throw new Error("ID de tarja es requerido");
    }

    try {
      await clienteApi(`${this.rutaBase}/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(`Error al eliminar tarja ${id}:`, error);
      throw error;
    }
  }
}

// Exportar instancia única del servicio
export const servicioTarjas = new ServicioTarjas();
