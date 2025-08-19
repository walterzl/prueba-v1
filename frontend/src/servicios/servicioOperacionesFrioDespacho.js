/**
 * Servicio simplificado para gestión de operaciones de frío y despacho
 * Maneja las operaciones básicas usando clienteApi directamente
 */

import clienteApi from "./api";

export class ServicioOperacionesFrioDespacho {
  constructor() {
    this.rutaBase = "/operaciones-frio-despacho";
  }

  /**
   * Obtiene la lista de operaciones con filtros opcionales
   * @param {Object} filtros - Filtros para la consulta
   * @returns {Promise<Array>} Lista de operaciones
   */
  async obtenerOperaciones(filtros = {}) {
    try {
      const parametros = new URLSearchParams();

      if (filtros.planta) {
        parametros.append("planta", filtros.planta);
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

      if (filtros.tipoOperacion) {
        parametros.append("tipoOperacion", filtros.tipoOperacion);
      }

      const url = parametros.toString()
        ? `${this.rutaBase}?${parametros.toString()}`
        : this.rutaBase;

      const respuesta = await clienteApi(url);

      // Extraer los datos según la estructura de la API
      if (respuesta?.datos?.operaciones) {
        return respuesta.datos.operaciones;
      }

      // Fallback para otros formatos
      return Array.isArray(respuesta) ? respuesta : [];
    } catch (error) {
      console.error("Error al obtener operaciones:", error);
      throw error;
    }
  }

  /**
   * Crea una nueva operación
   * @param {Object} datosOperacion - Datos de la operación
   * @returns {Promise<Object>} Operación creada
   */
  async crearOperacion(datosOperacion) {
    try {
      const respuesta = await clienteApi(this.rutaBase, {
        method: "POST",
        body: JSON.stringify(datosOperacion),
      });
      return respuesta;
    } catch (error) {
      console.error("Error al crear operación:", error);
      throw error;
    }
  }

  /**
   * Actualiza una operación existente
   * @param {string|number} id - ID de la operación
   * @param {Object} datosOperacion - Datos actualizados
   * @returns {Promise<Object>} Operación actualizada
   */
  async actualizarOperacion(id, datosOperacion) {
    if (!id) {
      throw new Error("ID de operación es requerido");
    }

    try {
      const respuesta = await clienteApi(`${this.rutaBase}/${id}`, {
        method: "PUT",
        body: JSON.stringify(datosOperacion),
      });
      return respuesta;
    } catch (error) {
      console.error(`Error al actualizar operación ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina una operación
   * @param {string|number} id - ID de la operación
   * @returns {Promise<void>}
   */
  async eliminarOperacion(id) {
    if (!id) {
      throw new Error("ID de operación es requerido");
    }

    try {
      await clienteApi(`${this.rutaBase}/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(`Error al eliminar operación ${id}:`, error);
      throw error;
    }
  }
}

// Exportar instancia única del servicio
export const servicioOperacionesFrioDespacho =
  new ServicioOperacionesFrioDespacho();
