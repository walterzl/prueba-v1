/**
 * Servicio para gestión de tarjas
 * Maneja las operaciones CRUD y funcionalidades específicas del módulo
 */

import clienteApi from "./api";
import { validarTarja } from "@/utilidades/validaciones";
import { MENSAJES } from "@/utilidades/constantes";

class ServicioTarjas {
  constructor() {
    this.rutaBase = "/tarjas";
  }

  /**
   * Obtiene la lista de tarjas con filtros opcionales
   * @param {Object} filtros - Filtros para la consulta
   * @param {string} filtros.planta - Planta a filtrar
   * @param {string} filtros.tipoTarja - Tipo de tarja (CAA | BODEGA)
   * @param {string} filtros.fechaDesde - Fecha inicial (opcional)
   * @param {string} filtros.fechaHasta - Fecha final (opcional)
   * @param {string} filtros.estado - Estado a filtrar (opcional)
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
      throw new Error(
        error.response?.data?.message || MENSAJES.ERROR_OBTENER_DATOS
      );
    }
  }

  /**
   * Obtiene una tarja específica por ID
   * @param {string|number} id - ID de la tarja
   * @returns {Promise<Object>} Datos de la tarja
   */
  async obtenerTarjaPorId(id) {
    if (!id) {
      throw new Error("ID de tarja es requerido");
    }

    try {
      const respuesta = await clienteApi(`${this.rutaBase}/${id}`);
      return respuesta;
    } catch (error) {
      console.error(`Error al obtener tarja ${id}:`, error);
      throw new Error(
        error.response?.data?.message || MENSAJES.ERROR_OBTENER_DATOS
      );
    }
  }

  /**
   * Obtiene una tarja por su número
   * @param {string} numeroTarja - Número de tarja
   * @returns {Promise<Object>} Datos de la tarja
   */
  async obtenerTarjaPorNumero(numeroTarja) {
    if (!numeroTarja) {
      throw new Error("Número de tarja es requerido");
    }

    try {
      const respuesta = await clienteApi(
        `${this.rutaBase}/numero/${numeroTarja}`
      );
      return respuesta;
    } catch (error) {
      console.error(`Error al obtener tarja ${numeroTarja}:`, error);
      throw new Error(
        error.response?.data?.message || MENSAJES.ERROR_OBTENER_DATOS
      );
    }
  }

  /**
   * Crea una nueva tarja
   * @param {Object} datosTarja - Datos de la tarja
   * @returns {Promise<Object>} Tarja creada
   */
  async crearTarja(datosTarja) {
    // Validar datos antes de enviar
    const erroresValidacion = await validarTarja(datosTarja);
    if (erroresValidacion.length > 0) {
      throw new Error(`Datos inválidos: ${erroresValidacion.join(", ")}`);
    }

    try {
      // Preparar datos para envío
      const datosLimpios = this._prepararDatosTarja(datosTarja);

      const respuesta = await clienteApi(this.rutaBase, {
        method: "POST",
        body: JSON.stringify(datosLimpios),
      });
      return respuesta;
    } catch (error) {
      console.error("Error al crear tarja:", error);
      throw new Error(error.response?.data?.message || MENSAJES.ERROR_CREAR);
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

    // Validar datos antes de enviar
    const erroresValidacion = await validarTarja(datosTarja);
    if (erroresValidacion.length > 0) {
      throw new Error(`Datos inválidos: ${erroresValidacion.join(", ")}`);
    }

    try {
      // Preparar datos para envío
      const datosLimpios = this._prepararDatosTarja(datosTarja);

      const respuesta = await clienteApi(`${this.rutaBase}/${id}`, {
        method: "PUT",
        body: JSON.stringify(datosLimpios),
      });
      return respuesta;
    } catch (error) {
      console.error(`Error al actualizar tarja ${id}:`, error);
      throw new Error(
        error.response?.data?.message || MENSAJES.ERROR_ACTUALIZAR
      );
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
      throw new Error(error.response?.data?.message || MENSAJES.ERROR_ELIMINAR);
    }
  }

  /**
   * Cambia el estado de una tarja
   * @param {string|number} id - ID de la tarja
   * @param {string} nuevoEstado - Nuevo estado
   * @param {string} observaciones - Observaciones del cambio (opcional)
   * @returns {Promise<Object>} Tarja actualizada
   */
  async cambiarEstadoTarja(id, nuevoEstado, observaciones = "") {
    if (!id || !nuevoEstado) {
      throw new Error("ID de tarja y nuevo estado son requeridos");
    }

    try {
      const datosEstado = {
        estado: nuevoEstado,
        observaciones_cambio_estado: observaciones,
        fecha_cambio_estado: new Date().toISOString(),
      };

      const respuesta = await clienteApi(`${this.rutaBase}/${id}/estado`, {
        method: "PATCH",
        body: JSON.stringify(datosEstado),
      });
      return respuesta;
    } catch (error) {
      console.error(`Error al cambiar estado de tarja ${id}:`, error);
      throw new Error(
        error.response?.data?.message || "Error al cambiar estado de la tarja"
      );
    }
  }

  /**
   * Actualiza la cantidad disponible de una tarja
   * @param {string|number} id - ID de la tarja
   * @param {number} nuevaCantidad - Nueva cantidad disponible
   * @param {string} motivo - Motivo del cambio
   * @returns {Promise<Object>} Tarja actualizada
   */
  async actualizarCantidadTarja(id, nuevaCantidad, motivo = "") {
    if (!id || nuevaCantidad < 0) {
      throw new Error("ID de tarja y cantidad válida son requeridos");
    }

    try {
      const datosCantidad = {
        cantidad_disponible: nuevaCantidad,
        motivo_cambio_cantidad: motivo,
        fecha_cambio_cantidad: new Date().toISOString(),
      };

      const respuesta = await clienteApi(`${this.rutaBase}/${id}/cantidad`, {
        method: "PATCH",
        body: JSON.stringify(datosCantidad),
      });
      return respuesta;
    } catch (error) {
      console.error(`Error al actualizar cantidad de tarja ${id}:`, error);
      throw new Error(
        error.response?.data?.message ||
          "Error al actualizar cantidad de la tarja"
      );
    }
  }

  /**
   * Obtiene el historial de movimientos de una tarja
   * @param {string|number} id - ID de la tarja
   * @returns {Promise<Array>} Historial de movimientos
   */
  async obtenerHistorialTarja(id) {
    if (!id) {
      throw new Error("ID de tarja es requerido");
    }

    try {
      const respuesta = await clienteApi(`${this.rutaBase}/${id}/historial`);
      return respuesta || [];
    } catch (error) {
      console.error(`Error al obtener historial de tarja ${id}:`, error);
      throw new Error(
        error.response?.data?.message ||
          "Error al obtener historial de la tarja"
      );
    }
  }

  /**
   * Obtiene tarjas por material y lote
   * @param {string} codigoMaterial - Código del material
   * @param {string} lote - Número de lote (opcional)
   * @returns {Promise<Array>} Lista de tarjas
   */
  async obtenerTarjasPorMaterial(codigoMaterial, lote = null) {
    if (!codigoMaterial) {
      throw new Error("Código de material es requerido");
    }

    try {
      const parametros = new URLSearchParams({
        codigoMaterial: codigoMaterial,
      });

      if (lote) {
        parametros.append("lote", lote);
      }

      const respuesta = await clienteApi(
        `${this.rutaBase}/por-material?${parametros.toString()}`
      );
      return respuesta || [];
    } catch (error) {
      console.error("Error al obtener tarjas por material:", error);
      throw new Error(
        error.response?.data?.message || "Error al obtener tarjas por material"
      );
    }
  }

  /**
   * Obtiene tarjas por proveedor
   * @param {string} proveedor - Nombre del proveedor
   * @returns {Promise<Array>} Lista de tarjas
   */
  async obtenerTarjasPorProveedor(proveedor) {
    if (!proveedor) {
      throw new Error("Proveedor es requerido");
    }

    try {
      const parametros = new URLSearchParams({
        proveedor: proveedor,
      });

      const respuesta = await clienteApi(
        `${this.rutaBase}/por-proveedor?${parametros.toString()}`
      );
      return respuesta || [];
    } catch (error) {
      console.error("Error al obtener tarjas por proveedor:", error);
      throw new Error(
        error.response?.data?.message || "Error al obtener tarjas por proveedor"
      );
    }
  }

  /**
   * Imprime una o varias tarjas
   * @param {Array<string|number>} ids - IDs de las tarjas a imprimir
   * @param {string} formato - Formato de impresión ('pdf' | 'etiqueta')
   * @returns {Promise<Blob>} Archivo de impresión
   */
  async imprimirTarjas(ids, formato = "pdf") {
    if (!ids || ids.length === 0) {
      throw new Error("Se requiere al menos una tarja para imprimir");
    }

    try {
      const parametros = new URLSearchParams({
        ids: ids.join(","),
        formato: formato,
      });

      const respuesta = await clienteApi(
        `${this.rutaBase}/imprimir?${parametros.toString()}`,
        {
          headers: {
            Accept: "application/octet-stream",
          },
        }
      );

      return respuesta;
    } catch (error) {
      console.error("Error al imprimir tarjas:", error);
      throw new Error(
        error.response?.data?.message || "Error al generar la impresión"
      );
    }
  }

  /**
   * Genera un reporte de tarjas
   * @param {Object} filtros - Filtros para el reporte
   * @param {string} formato - Formato del reporte ('pdf' | 'excel' | 'csv')
   * @returns {Promise<Blob>} Archivo del reporte
   */
  async generarReporte(filtros = {}, formato = "pdf") {
    try {
      const parametros = new URLSearchParams(filtros);
      parametros.append("formato", formato);

      const respuesta = await clienteApi(
        `${this.rutaBase}/reporte?${parametros.toString()}`,
        {
          headers: {
            Accept: "application/octet-stream",
          },
        }
      );

      return respuesta;
    } catch (error) {
      console.error("Error al generar reporte:", error);
      throw new Error(
        error.response?.data?.message || "Error al generar el reporte"
      );
    }
  }

  /**
   * Valida si una tarja puede ser modificada
   * @param {Object} tarja - Datos de la tarja
   * @returns {Object} Resultado de la validación
   */
  validarModificacionTarja(tarja) {
    const estadosNoModificables = ["cerrado", "anulado", "agotado"];

    if (!tarja) {
      return {
        puedeModificar: false,
        razon: "Tarja no encontrada",
      };
    }

    if (estadosNoModificables.includes(tarja.estado)) {
      return {
        puedeModificar: false,
        razon: `Las tarjas con estado '${tarja.estado}' no pueden modificarse`,
      };
    }

    // Verificar si hay movimientos asociados
    if (tarja.tiene_movimientos) {
      return {
        puedeModificar: false,
        razon: "No se pueden modificar tarjas con movimientos asociados",
      };
    }

    return {
      puedeModificar: true,
      razon: null,
    };
  }

  /**
   * Obtiene estadísticas de tarjas
   * @param {Object} filtros - Filtros para las estadísticas
   * @returns {Promise<Object>} Estadísticas de tarjas
   */
  async obtenerEstadisticas(filtros = {}) {
    try {
      const parametros = new URLSearchParams(filtros);
      const respuesta = await clienteApi(
        `${this.rutaBase}/estadisticas?${parametros.toString()}`
      );
      return respuesta;
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      throw new Error(
        error.response?.data?.message ||
          "Error al obtener estadísticas de tarjas"
      );
    }
  }

  // ============== MÉTODOS PRIVADOS ==============

  /**
   * Prepara los datos de tarja para envío al backend
   * @param {Object} datos - Datos originales
   * @returns {Object} Datos preparados
   * @private
   */
  _prepararDatosTarja(datos) {
    const datosLimpios = { ...datos };

    // Convertir strings vacíos a null para campos opcionales
    const camposOpcionales = ["fecha_vencimiento", "observaciones"];

    camposOpcionales.forEach((campo) => {
      if (datosLimpios[campo] === "" || datosLimpios[campo] === undefined) {
        datosLimpios[campo] = null;
      }
    });

    // Convertir cantidades a números
    const camposNumericos = ["cantidad_total", "cantidad_disponible"];
    camposNumericos.forEach((campo) => {
      if (datosLimpios[campo] !== null && datosLimpios[campo] !== undefined) {
        const valor = parseFloat(datosLimpios[campo]);
        datosLimpios[campo] = isNaN(valor) ? 0 : valor;
      }
    });

    // Asegurar que las fechas estén en formato ISO
    const camposFecha = ["fecha_tarja", "fecha_vencimiento"];
    camposFecha.forEach((campo) => {
      if (datosLimpios[campo]) {
        datosLimpios[campo] = new Date(datosLimpios[campo]).toISOString();
      }
    });

    // Remover campos computados o que no se deben enviar
    const camposComputados = [
      "id",
      "fecha_creacion",
      "fecha_actualizacion",
      "nombre_material", // Este se obtiene del material
      "tiene_movimientos",
    ];

    camposComputados.forEach((campo) => {
      delete datosLimpios[campo];
    });

    return datosLimpios;
  }

  /**
   * Formatea datos de respuesta del backend
   * @param {Object} datos - Datos del backend
   * @returns {Object} Datos formateados
   * @private
   */
  _formatearRespuesta(datos) {
    if (!datos) return datos;

    // Formatear fechas si existen
    const camposFecha = [
      "fecha_tarja",
      "fecha_vencimiento",
      "fecha_creacion",
      "fecha_actualizacion",
    ];

    camposFecha.forEach((campo) => {
      if (datos[campo]) {
        datos[campo] = new Date(datos[campo]).toISOString();
      }
    });

    return datos;
  }
}

// Exportar instancia única del servicio
export const servicioTarjas = new ServicioTarjas();
