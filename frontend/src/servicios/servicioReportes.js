import { api } from "@/servicios/api";

/**
 * Servicio para gestionar reportes y estadísticas del sistema
 * Proporciona datos para dashboard y reportes específicos
 */
export const servicioReportes = {
  // ============== DASHBOARD ==============
  /**
   * Obtiene datos para el dashboard principal
   */
  async obtenerDashboard(planta = "") {
    const parametros = planta ? { planta } : {};
    return await api.obtener("/reportes/dashboard", parametros);
  },

  /**
   * Obtiene estadísticas generales del sistema
   */
  async obtenerEstadisticasGenerales() {
    return await api.obtener("/reportes/estadisticas-generales");
  },

  // ============== REPORTES DE INVENTARIO ==============
  /**
   * Obtiene reporte de inventario por planta
   */
  async reporteInventarioPorPlanta(
    planta,
    fechaDesde = null,
    fechaHasta = null
  ) {
    if (!planta?.trim()) {
      throw new Error("La planta es requerida para el reporte");
    }

    const parametros = { planta };
    if (fechaDesde) parametros.fecha_desde = fechaDesde;
    if (fechaHasta) parametros.fecha_hasta = fechaHasta;

    return await api.obtener("/reportes/inventario/planta", parametros);
  },

  /**
   * Obtiene reporte de stock por material
   */
  async reporteStockPorMaterial(codigoMaterial, planta = null) {
    if (!codigoMaterial?.trim()) {
      throw new Error("El código del material es requerido");
    }

    const parametros = { material: codigoMaterial };
    if (planta) parametros.planta = planta;

    return await api.obtener("/reportes/stock/material", parametros);
  },

  /**
   * Obtiene resumen de stock actual
   */
  async obtenerResumenStock(planta = null) {
    const parametros = planta ? { planta } : {};
    return await api.obtener("/reportes/stock/resumen", parametros);
  },

  // ============== REPORTES DE MOVIMIENTOS ==============
  /**
   * Obtiene reporte de movimientos por período
   */
  async reporteMovimientosPorPeriodo(filtros = {}) {
    const parametrosValidos = this._validarFiltrosPeriodo(filtros);
    return await api.obtener(
      "/reportes/movimientos/periodo",
      parametrosValidos
    );
  },

  /**
   * Obtiene movimientos por tipo específico
   */
  async reporteMovimientosPorTipo(
    tipoMovimiento,
    fechaDesde = null,
    fechaHasta = null
  ) {
    if (!tipoMovimiento?.trim()) {
      throw new Error("El tipo de movimiento es requerido");
    }

    const parametros = { tipo_movimiento: tipoMovimiento };
    if (fechaDesde) parametros.fecha_desde = fechaDesde;
    if (fechaHasta) parametros.fecha_hasta = fechaHasta;

    return await api.obtener("/reportes/movimientos/tipo", parametros);
  },

  /**
   * Obtiene trazabilidad completa de un material
   */
  async reporteTrazabilidadMaterial(codigoMaterial, lote = null) {
    if (!codigoMaterial?.trim()) {
      throw new Error("El código del material es requerido");
    }

    const parametros = { material: codigoMaterial };
    if (lote) parametros.lote = lote;

    return await api.obtener("/reportes/trazabilidad/material", parametros);
  },

  // ============== REPORTES DE RECEPCIONES ==============
  /**
   * Obtiene reporte de recepciones por período
   */
  async reporteRecepcionesPorPeriodo(fechaDesde, fechaHasta, planta = null) {
    if (!fechaDesde || !fechaHasta) {
      throw new Error("Las fechas de inicio y fin son requeridas");
    }

    const parametros = { fecha_desde: fechaDesde, fecha_hasta: fechaHasta };
    if (planta) parametros.planta = planta;

    return await api.obtener("/reportes/recepciones/periodo", parametros);
  },

  /**
   * Obtiene recepciones por proveedor
   */
  async reporteRecepcionesPorProveedor(
    codigoProveedor,
    fechaDesde = null,
    fechaHasta = null
  ) {
    if (!codigoProveedor?.trim()) {
      throw new Error("El código del proveedor es requerido");
    }

    const parametros = { proveedor: codigoProveedor };
    if (fechaDesde) parametros.fecha_desde = fechaDesde;
    if (fechaHasta) parametros.fecha_hasta = fechaHasta;

    return await api.obtener("/reportes/recepciones/proveedor", parametros);
  },

  // ============== REPORTES DE OPERACIONES FRÍO Y DESPACHO ==============
  /**
   * Obtiene reporte de operaciones de frío y despacho
   */
  async reporteOperacionesFrioDespacho(filtros = {}) {
    const parametrosValidos = this._validarFiltrosOperaciones(filtros);
    return await api.obtener(
      "/reportes/operaciones-frio-despacho",
      parametrosValidos
    );
  },

  /**
   * Obtiene operaciones por embarque
   */
  async reporteOperacionesPorEmbarque(numeroEmbarque) {
    if (!numeroEmbarque?.trim()) {
      throw new Error("El número de embarque es requerido");
    }

    return await api.obtener("/reportes/operaciones/embarque", {
      embarque: numeroEmbarque,
    });
  },

  // ============== REPORTES DE TARJAS ==============
  /**
   * Obtiene reporte de tarjas por período
   */
  async reporteTarjasPorPeriodo(fechaDesde, fechaHasta, tipoTarja = null) {
    if (!fechaDesde || !fechaHasta) {
      throw new Error("Las fechas de inicio y fin son requeridas");
    }

    const parametros = { fecha_desde: fechaDesde, fecha_hasta: fechaHasta };
    if (tipoTarja) parametros.tipo_tarja = tipoTarja;

    return await api.obtener("/reportes/tarjas/periodo", parametros);
  },

  // ============== REPORTES DE AUDITORÍA ==============
  /**
   * Obtiene reporte de auditoría por período
   */
  async reporteAuditoria(fechaDesde, fechaHasta, usuario = null) {
    if (!fechaDesde || !fechaHasta) {
      throw new Error("Las fechas de inicio y fin son requeridas");
    }

    const parametros = { fecha_desde: fechaDesde, fecha_hasta: fechaHasta };
    if (usuario) parametros.usuario = usuario;

    return await api.obtener("/reportes/auditoria", parametros);
  },

  // ============== EXPORTACIÓN DE REPORTES ==============
  /**
   * Exporta un reporte a formato específico (PDF, Excel, etc.)
   */
  async exportarReporte(tipoReporte, formato, parametros = {}) {
    if (!tipoReporte?.trim()) {
      throw new Error("El tipo de reporte es requerido");
    }

    if (!formato?.trim()) {
      throw new Error("El formato de exportación es requerido");
    }

    const datosExportacion = {
      tipo_reporte: tipoReporte,
      formato: formato,
      parametros: parametros,
    };

    return await api.crear("/reportes/exportar", datosExportacion);
  },

  // ============== MÉTODOS DE VALIDACIÓN PRIVADOS ==============
  /**
   * Valida los filtros para reportes de período
   */
  _validarFiltrosPeriodo(filtros) {
    const parametrosValidos = {};

    // Validar fechas requeridas
    if (filtros.fecha_desde) {
      parametrosValidos.fecha_desde = filtros.fecha_desde;
    }

    if (filtros.fecha_hasta) {
      parametrosValidos.fecha_hasta = filtros.fecha_hasta;
    }

    // Parámetros opcionales
    if (filtros.planta?.trim()) {
      parametrosValidos.planta = filtros.planta;
    }

    if (filtros.tipo_movimiento?.trim()) {
      parametrosValidos.tipo_movimiento = filtros.tipo_movimiento;
    }

    if (filtros.material?.trim()) {
      parametrosValidos.material = filtros.material;
    }

    if (filtros.proveedor?.trim()) {
      parametrosValidos.proveedor = filtros.proveedor;
    }

    return parametrosValidos;
  },

  /**
   * Valida los filtros para reportes de operaciones
   */
  _validarFiltrosOperaciones(filtros) {
    const parametrosValidos = {};

    // Parámetros opcionales
    if (filtros.tipo_operacion?.trim()) {
      parametrosValidos.tipo_operacion = filtros.tipo_operacion;
    }

    if (filtros.planta?.trim()) {
      parametrosValidos.planta = filtros.planta;
    }

    if (filtros.embarque?.trim()) {
      parametrosValidos.embarque = filtros.embarque;
    }

    if (filtros.fecha_desde) {
      parametrosValidos.fecha_desde = filtros.fecha_desde;
    }

    if (filtros.fecha_hasta) {
      parametrosValidos.fecha_hasta = filtros.fecha_hasta;
    }

    return parametrosValidos;
  },

  // ============== UTILIDADES ==============
  /**
   * Formatea fechas para reportes
   */
  formatearFechaParaReporte(fecha) {
    if (!fecha) return null;

    if (typeof fecha === "string") {
      return fecha;
    }

    if (fecha instanceof Date) {
      return fecha.toISOString().split("T")[0];
    }

    return null;
  },

  /**
   * Genera nombre de archivo para exportación
   */
  generarNombreArchivo(tipoReporte, formato, fecha = new Date()) {
    const fechaFormateada = fecha.toISOString().split("T")[0];
    return `${tipoReporte}_${fechaFormateada}.${formato.toLowerCase()}`;
  },
};

export default servicioReportes;
