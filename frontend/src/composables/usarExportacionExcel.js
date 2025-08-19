/**
 * Composable para exportación de datos a Excel usando SheetJS
 */

import * as XLSX from "xlsx";
import { ref } from "vue";
import { formatearFecha, formatearNumero } from "@/utilidades/auxiliares";

export function usarExportacionExcel() {
  const exportando = ref(false);

  /**
   * Exporta datos a Excel
   * @param {Array} datos - Array de objetos con los datos a exportar
   * @param {String} nombreArchivo - Nombre del archivo (sin extensión)
   * @param {String} nombreHoja - Nombre de la hoja de cálculo
   * @param {Object} opciones - Opciones adicionales
   */
  const exportarAExcel = (
    datos,
    nombreArchivo = "reporte",
    nombreHoja = "Datos",
    opciones = {}
  ) => {
    if (!datos || datos.length === 0) {
      throw new Error("No hay datos para exportar");
    }

    exportando.value = true;

    try {
      // Crear un nuevo libro de trabajo
      const libro = XLSX.utils.book_new();

      // Convertir datos a hoja de cálculo
      const hoja = XLSX.utils.json_to_sheet(datos);

      // Aplicar opciones de formato si se proporcionan
      if (opciones.anchoColumnas) {
        hoja["!cols"] = opciones.anchoColumnas;
      }

      // Agregar la hoja al libro
      XLSX.utils.book_append_sheet(libro, hoja, nombreHoja);

      // Generar nombre de archivo con timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      const nombreCompleto = `${nombreArchivo}_${timestamp}.xlsx`;

      // Escribir y descargar el archivo
      XLSX.writeFile(libro, nombreCompleto);

      return {
        exito: true,
        nombreArchivo: nombreCompleto,
        registrosExportados: datos.length,
      };
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      throw error;
    } finally {
      exportando.value = false;
    }
  };

  /**
   * Prepara datos de tarjas para exportación
   * @param {Array} tarjas - Array de tarjas
   */
  const prepararDatosTarjas = (tarjas) => {
    return tarjas.map((tarja) => ({
      ID: tarja.id,
      "Número Tarja": tarja.numero_tarja,
      Planta: tarja.planta,
      "Fecha Generación": formatearFecha(tarja.fecha_generacion),
      "Tipo Tarja": tarja.tipo_tarja,
      Descripción: tarja.descripcion || "Sin descripción",

      // Material básico
      "Material ID": tarja.material?.id || "N/A",
      "Código Material":
        tarja.material?.codigo || tarja.codigo_material || "N/A",
      "Nombre Material":
        tarja.material?.nombre || tarja.nombre_material || "N/A",

      // Material completo (datos anidados)
      "Código Ranco": tarja.material?.completo?.codigo_ranco || "N/A",
      "Material Completo": tarja.material?.completo?.nombre_material || "N/A",
      "Unidad Medida": tarja.material?.completo?.unidad_medida || "N/A",
      Clasificación: tarja.material?.completo?.clasificacion || "N/A",

      Lote: tarja.lote || "N/A",
      Cantidad: formatearNumero(tarja.cantidad),
      "Número Item": tarja.numero_item || "N/A",
      "Fecha Item": tarja.fecha_item ? formatearFecha(tarja.fecha_item) : "N/A",

      // Proveedor básico
      "Proveedor ID": tarja.proveedor?.id || "N/A",
      "Proveedor Nombre":
        tarja.proveedor?.nombre || tarja.nombre_proveedor || "N/A",

      // Proveedor completo (datos anidados)
      "Proveedor Title": tarja.proveedor?.completo?.title || "N/A",
      "Proveedor Estado": tarja.proveedor?.completo?.activo
        ? "Activo"
        : "Inactivo",

      Guía: tarja.guia || "N/A",
      Estado: tarja.estado,

      // Usuario (datos anidados)
      "Usuario ID": tarja.usuario?.id || "N/A",
      "Usuario Login": tarja.usuario?.nombre_usuario || "N/A",
      "Usuario Completo": tarja.usuario?.nombre_completo || "N/A",

      "Fecha Creación": formatearFecha(tarja.fecha_creacion),
      "Fecha Impresión": tarja.fecha_impresion
        ? formatearFecha(tarja.fecha_impresion)
        : "N/A",
    }));
  };

  /**
   * Prepara datos de inventario para exportación
   * @param {Array} inventario - Array de items de inventario
   */
  const prepararDatosInventario = (inventario) => {
    return inventario.map((item) => ({
      ID: item.id,
      Planta: item.planta,

      // Material básico
      "Código Material": item.codigo_material,
      "Nombre Material": item.nombre_material,
      "Unidad Medida": item.unidad_medida || "N/A",
      "Código Nombre": item.cod_nombre || "N/A",

      // Material completo (datos anidados)
      "Código Ranco": item.material_completo?.codigo_ranco || "N/A",
      "Material Completo": item.material_completo?.nombre_material || "N/A",
      "Unidad Completa": item.material_completo?.unidad_medida || "N/A",

      // Ubicación básica
      Ubicación: item.ubicacion || "N/A",
      Bodega: item.bodega || "N/A",

      // Ubicación completa (datos anidados)
      "Ubicación Title": item.ubicacion_completa?.title || "N/A",
      "Bodega Depósito": item.ubicacion_completa?.bodega_deposito || "N/A",
      "Planta Ubicación": item.ubicacion_completa?.planta || "N/A",

      Lote: item.lote || "N/A",
      Stock: formatearNumero(item.stock),
      Pallets: item.pallets || 0,
      "Condición Armado": item.condicion_armado || "N/A",
      "Contado Por": item.contado_por || "N/A",
      "Fecha Inventario": formatearFecha(item.fecha_inventario),
      "Fecha Creación": formatearFecha(item.fecha_creacion),
      "Fecha Actualización": item.fecha_actualizacion
        ? formatearFecha(item.fecha_actualizacion)
        : "N/A",
    }));
  };

  /**
   * Prepara datos de recepciones para exportación
   * @param {Array} recepciones - Array de recepciones
   */
  const prepararDatosRecepciones = (recepciones) => {
    return recepciones.map((recepcion) => ({
      ID: recepcion.id,
      "Número Recepción": recepcion.numero_recepcion,
      Planta: recepcion.planta,
      "Fecha Recepción": formatearFecha(recepcion.fecha_recepcion),

      // Proveedor básico
      "Proveedor ID": recepcion.proveedor?.id || "N/A",
      "Proveedor Nombre":
        recepcion.proveedor?.nombre || recepcion.nombre_proveedor || "N/A",

      // Proveedor completo (datos anidados)
      "Proveedor Title": recepcion.proveedor?.completo?.title || "N/A",
      "Proveedor Estado": recepcion.proveedor?.completo?.activo
        ? "Activo"
        : "Inactivo",

      "Guía SII": recepcion.guia_sii || recepcion.numero_guia || "N/A",

      // Material básico
      "Material ID": recepcion.material?.id || "N/A",
      "Código Material":
        recepcion.material?.codigo || recepcion.codigo_material || "N/A",
      "Nombre Material":
        recepcion.material?.nombre || recepcion.nombre_material || "N/A",
      "Unidad Medida":
        recepcion.material?.unidad_medida || recepcion.unidad_medida || "N/A",
      Clasificación: recepcion.material?.clasificacion || "N/A",

      // Material completo (datos anidados)
      "Código Ranco": recepcion.material?.completo?.codigo_ranco || "N/A",
      "Material Completo":
        recepcion.material?.completo?.nombre_material || "N/A",
      "Unidad Completa": recepcion.material?.completo?.unidad_medida || "N/A",
      "Clasificación Completa":
        recepcion.material?.completo?.clasificacion || "N/A",

      Lote: recepcion.lote || recepcion.numero_lote || "N/A",
      Cantidad: formatearNumero(
        recepcion.cantidad || recepcion.cantidad_recibida
      ),
      Pallets: formatearNumero(recepcion.pallets),
      "Código QR": recepcion.codigo_qr || "N/A",
      "Calificación Calidad": recepcion.calificacion_calidad || "N/A",
      "Temperatura Recepción": recepcion.temperatura_recepcion
        ? `${recepcion.temperatura_recepcion}°C`
        : "N/A",

      // Ubicación destino básica
      "Ubicación ID": recepcion.ubicacion_destino?.id || "N/A",
      "Ubicación Código": recepcion.ubicacion_destino?.codigo || "N/A",
      "Ubicación Alias": recepcion.ubicacion_destino?.alias || "N/A",
      "Ubicación Planta": recepcion.ubicacion_destino?.planta || "N/A",
      "Zona Ubicación": recepcion.ubicacion_destino?.zona_ubicacion || "N/A",

      // Ubicación destino completa (datos anidados)
      "Ubicación Código Completo":
        recepcion.ubicacion_destino?.completo?.codigo || "N/A",
      "Ubicación Alias Completo":
        recepcion.ubicacion_destino?.completo?.alias || "N/A",
      "Ubicación Planta Completa":
        recepcion.ubicacion_destino?.completo?.planta || "N/A",
      "Zona Completa":
        recepcion.ubicacion_destino?.completo?.zona_ubicacion || "N/A",

      // Usuario básico
      "Usuario ID": recepcion.usuario?.id || "N/A",
      "Usuario Nombre":
        recepcion.usuario?.nombre || recepcion.usuario_recepcion || "N/A",

      // Usuario completo (datos anidados)
      "Usuario Completo": recepcion.usuario?.completo?.nombre || "N/A",
      "Usuario RUT": recepcion.usuario?.completo?.rut || "N/A",
      "Usuario Email": recepcion.usuario?.completo?.email || "N/A",
      "Usuario Planta": recepcion.usuario?.completo?.planta || "N/A",

      Estado: recepcion.estado,
      Observaciones: recepcion.observaciones || "Sin observaciones",
      "Fecha Vencimiento": recepcion.fecha_vencimiento
        ? formatearFecha(recepcion.fecha_vencimiento)
        : "N/A",
      "Fecha Creación": recepcion.fechas_sistema?.creacion
        ? formatearFecha(recepcion.fechas_sistema.creacion)
        : formatearFecha(recepcion.fecha_creacion),
      "Fecha Actualización": recepcion.fechas_sistema?.actualizacion
        ? formatearFecha(recepcion.fechas_sistema.actualizacion)
        : "N/A",
    }));
  };

  /**
   * Prepara datos de operaciones frío/despacho para exportación
   * @param {Array} operaciones - Array de operaciones
   */
  const prepararDatosOperaciones = (operaciones) => {
    return operaciones.map((operacion) => ({
      ID: operacion.id,
      "Número Operación": operacion.numero_operacion,
      Planta: operacion.planta,
      "Fecha Operación": formatearFecha(operacion.fecha_operacion),
      "Tipo Operación": operacion.tipo_operacion,
      Turno: operacion.turno || "N/A",
      "Número Embarque": operacion.numero_embarque || "N/A",
      "Patente Camión": operacion.patente_camion || "N/A",

      // Material básico
      "Material ID": operacion.material?.id || "N/A",
      "Código Material":
        operacion.material?.codigo || operacion.codigo_material || "N/A",
      "Nombre Material":
        operacion.material?.nombre || operacion.nombre_material || "N/A",
      "Unidad Medida":
        operacion.material?.unidad_medida || operacion.unidad_medida || "N/A",
      Clasificación: operacion.material?.clasificacion || "N/A",

      // Material completo (datos anidados)
      "Código Ranco": operacion.material?.completo?.codigo_ranco || "N/A",
      "Material Completo":
        operacion.material?.completo?.nombre_material || "N/A",
      "Unidad Completa": operacion.material?.completo?.unidad_medida || "N/A",
      "Clasificación Completa":
        operacion.material?.completo?.clasificacion || "N/A",

      Lote: operacion.lote || "N/A",
      Cantidad: formatearNumero(operacion.cantidad),

      // Ubicación origen básica
      "Ubicación Origen ID": operacion.ubicacion_origen?.id || "N/A",
      "Ubicación Origen Bodega": operacion.ubicacion_origen?.bodega || "N/A",
      "Ubicación Origen Código":
        operacion.ubicacion_origen?.ubicacion ||
        operacion.ubicacion_origen ||
        "N/A",

      // Ubicación origen completa (datos anidados)
      "Ubicación Origen Title":
        operacion.ubicacion_origen?.completo?.title || "N/A",
      "Ubicación Origen Bodega Depósito":
        operacion.ubicacion_origen?.completo?.bodega_deposito || "N/A",
      "Ubicación Origen Planta":
        operacion.ubicacion_origen?.completo?.planta || "N/A",

      // Ubicación destino básica
      "Ubicación Destino ID": operacion.ubicacion_destino?.id || "N/A",
      "Ubicación Destino Bodega": operacion.ubicacion_destino?.bodega || "N/A",
      "Ubicación Destino Código":
        operacion.ubicacion_destino?.ubicacion ||
        operacion.ubicacion_destino ||
        "N/A",

      // Ubicación destino completa (datos anidados)
      "Ubicación Destino Title":
        operacion.ubicacion_destino?.completo?.title || "N/A",
      "Ubicación Destino Bodega Depósito":
        operacion.ubicacion_destino?.completo?.bodega_deposito || "N/A",
      "Ubicación Destino Planta":
        operacion.ubicacion_destino?.completo?.planta || "N/A",

      Estado: operacion.estado,
      Observaciones: operacion.observaciones || "Sin observaciones",

      // Usuario (datos anidados)
      "Usuario ID": operacion.usuario?.id || "N/A",
      "Usuario Login":
        operacion.usuario?.nombre_usuario || operacion.operador || "N/A",
      "Usuario Completo":
        operacion.usuario?.nombre_completo || operacion.supervisor || "N/A",

      "Fecha Inicio": operacion.fecha_inicio
        ? formatearFecha(operacion.fecha_inicio)
        : "N/A",
      "Fecha Fin": operacion.fecha_fin
        ? formatearFecha(operacion.fecha_fin)
        : "N/A",
      "Fecha Creación": formatearFecha(operacion.fecha_creacion),
      "Fecha Procesamiento": operacion.fecha_procesamiento
        ? formatearFecha(operacion.fecha_procesamiento)
        : "N/A",
    }));
  };

  /**
   * Prepara datos de trazabilidad para exportación
   * @param {Array} movimientos - Array de movimientos de trazabilidad
   */
  const prepararDatosTrazabilidad = (movimientos) => {
    return movimientos.map((movimiento) => ({
      ID: movimiento.id,
      Fecha: formatearFecha(movimiento.fecha || movimiento.fecha_movimiento),
      Mes: movimiento.mes || "N/A",
      "Tipo Movimiento": movimiento.tipo_movimiento,
      Planta: movimiento.planta || "N/A",
      "Guía SII": movimiento.guia_sii || "N/A",
      "ID Movimiento": movimiento.id_movimiento || "N/A",

      // Material básico
      "Código Material": movimiento.codigo_material,
      "Nombre Material": movimiento.nombre_material || "Sin nombre",
      "Código Nombre": movimiento.cod_nombre || "N/A",
      Clasificación: movimiento.clasificacion || "N/A",

      // Material completo (datos anidados)
      "Código Ranco": movimiento.material_completo?.codigo_ranco || "N/A",
      "Material Completo":
        movimiento.material_completo?.nombre_material || "N/A",
      "Unidad Completa": movimiento.material_completo?.unidad_medida || "N/A",
      "Clasificación Completa":
        movimiento.material_completo?.clasificacion || "N/A",

      Lote: movimiento.lote || "N/A",
      Cantidad: formatearNumero(movimiento.cantidad),
      "Total Pallets": formatearNumero(movimiento.total_pallet),
      "Unidad Medida": movimiento.unidad_medida || "N/A",

      // Ubicaciones básicas
      "Ubicación Origen": movimiento.ubicacion_origen || "N/A",
      "Bodega Origen": movimiento.bodega_origen || "N/A",
      "Ubicación Destino": movimiento.ubicacion_destino || "N/A",
      "Bodega Destino": movimiento.bodega_destino || "N/A",

      // Ubicaciones completas (datos anidados)
      "Ubicación Origen Title":
        movimiento.ubicacion_origen_completa?.title || "N/A",
      "Ubicación Origen Bodega Depósito":
        movimiento.ubicacion_origen_completa?.bodega_deposito || "N/A",
      "Ubicación Destino Title":
        movimiento.ubicacion_destino_completa?.title || "N/A",
      "Ubicación Destino Bodega Depósito":
        movimiento.ubicacion_destino_completa?.bodega_deposito || "N/A",

      Turno: movimiento.turno || "N/A",
      Observación: movimiento.observacion || movimiento.observaciones || "N/A",

      // Stock info
      "Bodega Stock": movimiento.bodega_stock || "N/A",
      "Ubicación Stock": movimiento.ubicacion_stock || "N/A",
      "Total Stock": formatearNumero(movimiento.total_stock),

      "Número Embarque": movimiento.numero_embarque || "N/A",
      "Patente Camión": movimiento.patente_camion || "N/A",

      Usuario: movimiento.usuario || "N/A",
      Referencia: movimiento.referencia || "N/A",
      "Fecha Creación": formatearFecha(movimiento.fecha_creacion),
      "Fecha Actualización": movimiento.fecha_actualizacion
        ? formatearFecha(movimiento.fecha_actualizacion)
        : "N/A",
    }));
  };

  /**
   * Configuración de ancho de columnas para Excel
   */
  const obtenerConfiguracionColumnas = (tipo) => {
    const configuraciones = {
      tarjas: [
        { wch: 8 }, // ID
        { wch: 15 }, // Número Tarja
        { wch: 12 }, // Planta
        { wch: 12 }, // Fecha Generación
        { wch: 12 }, // Tipo Tarja
        { wch: 20 }, // Descripción
        { wch: 10 }, // Material ID
        { wch: 15 }, // Código Material
        { wch: 25 }, // Nombre Material
        { wch: 15 }, // Código Ranco
        { wch: 25 }, // Material Completo
        { wch: 12 }, // Unidad Medida
        { wch: 15 }, // Clasificación
        { wch: 12 }, // Lote
        { wch: 10 }, // Cantidad
        { wch: 12 }, // Número Item
        { wch: 12 }, // Fecha Item
        { wch: 10 }, // Proveedor ID
        { wch: 20 }, // Proveedor Nombre
        { wch: 25 }, // Proveedor Title
        { wch: 12 }, // Proveedor Estado
        { wch: 12 }, // Guía
        { wch: 12 }, // Estado
        { wch: 10 }, // Usuario ID
        { wch: 15 }, // Usuario Login
        { wch: 20 }, // Usuario Completo
        { wch: 12 }, // Fecha Creación
        { wch: 12 }, // Fecha Impresión
      ],
      inventario: [
        { wch: 8 }, // ID
        { wch: 12 }, // Planta
        { wch: 15 }, // Código Material
        { wch: 25 }, // Nombre Material
        { wch: 12 }, // Unidad Medida
        { wch: 15 }, // Código Nombre
        { wch: 15 }, // Código Ranco
        { wch: 25 }, // Material Completo
        { wch: 12 }, // Unidad Completa
        { wch: 15 }, // Ubicación
        { wch: 15 }, // Bodega
        { wch: 20 }, // Ubicación Title
        { wch: 20 }, // Bodega Depósito
        { wch: 15 }, // Planta Ubicación
        { wch: 12 }, // Lote
        { wch: 10 }, // Stock
        { wch: 8 }, // Pallets
        { wch: 15 }, // Condición Armado
        { wch: 15 }, // Contado Por
        { wch: 12 }, // Fecha Inventario
        { wch: 12 }, // Fecha Creación
        { wch: 12 }, // Fecha Actualización
      ],
      recepciones: [
        { wch: 8 }, // ID
        { wch: 15 }, // Número Recepción
        { wch: 12 }, // Planta
        { wch: 12 }, // Fecha Recepción
        { wch: 10 }, // Proveedor ID
        { wch: 20 }, // Proveedor Nombre
        { wch: 25 }, // Proveedor Title
        { wch: 12 }, // Proveedor Estado
        { wch: 15 }, // Guía SII
        { wch: 10 }, // Material ID
        { wch: 15 }, // Código Material
        { wch: 25 }, // Nombre Material
        { wch: 12 }, // Unidad Medida
        { wch: 15 }, // Clasificación
        { wch: 15 }, // Código Ranco
        { wch: 25 }, // Material Completo
        { wch: 12 }, // Unidad Completa
        { wch: 15 }, // Clasificación Completa
        { wch: 12 }, // Lote
        { wch: 10 }, // Cantidad
        { wch: 8 }, // Pallets
        { wch: 15 }, // Código QR
        { wch: 15 }, // Calificación Calidad
        { wch: 12 }, // Temperatura Recepción
        { wch: 10 }, // Ubicación ID
        { wch: 15 }, // Ubicación Código
        { wch: 15 }, // Ubicación Alias
        { wch: 12 }, // Ubicación Planta
        { wch: 15 }, // Zona Ubicación
        { wch: 20 }, // Ubicación Código Completo
        { wch: 20 }, // Ubicación Alias Completo
        { wch: 15 }, // Ubicación Planta Completa
        { wch: 15 }, // Zona Completa
        { wch: 10 }, // Usuario ID
        { wch: 15 }, // Usuario Nombre
        { wch: 20 }, // Usuario Completo
        { wch: 15 }, // Usuario RUT
        { wch: 20 }, // Usuario Email
        { wch: 12 }, // Usuario Planta
        { wch: 12 }, // Estado
        { wch: 25 }, // Observaciones
        { wch: 12 }, // Fecha Vencimiento
        { wch: 12 }, // Fecha Creación
        { wch: 12 }, // Fecha Actualización
      ],
      operaciones: [
        { wch: 8 }, // ID
        { wch: 15 }, // Número Operación
        { wch: 12 }, // Planta
        { wch: 12 }, // Fecha Operación
        { wch: 15 }, // Tipo Operación
        { wch: 12 }, // Turno
        { wch: 15 }, // Número Embarque
        { wch: 15 }, // Patente Camión
        { wch: 10 }, // Material ID
        { wch: 15 }, // Código Material
        { wch: 25 }, // Nombre Material
        { wch: 12 }, // Unidad Medida
        { wch: 15 }, // Clasificación
        { wch: 15 }, // Código Ranco
        { wch: 25 }, // Material Completo
        { wch: 12 }, // Unidad Completa
        { wch: 15 }, // Clasificación Completa
        { wch: 12 }, // Lote
        { wch: 10 }, // Cantidad
        { wch: 10 }, // Ubicación Origen ID
        { wch: 15 }, // Ubicación Origen Bodega
        { wch: 15 }, // Ubicación Origen Código
        { wch: 20 }, // Ubicación Origen Title
        { wch: 20 }, // Ubicación Origen Bodega Depósito
        { wch: 15 }, // Ubicación Origen Planta
        { wch: 10 }, // Ubicación Destino ID
        { wch: 15 }, // Ubicación Destino Bodega
        { wch: 15 }, // Ubicación Destino Código
        { wch: 20 }, // Ubicación Destino Title
        { wch: 20 }, // Ubicación Destino Bodega Depósito
        { wch: 15 }, // Ubicación Destino Planta
        { wch: 12 }, // Estado
        { wch: 25 }, // Observaciones
        { wch: 10 }, // Usuario ID
        { wch: 15 }, // Usuario Login
        { wch: 20 }, // Usuario Completo
        { wch: 12 }, // Fecha Inicio
        { wch: 12 }, // Fecha Fin
        { wch: 12 }, // Fecha Creación
        { wch: 12 }, // Fecha Procesamiento
      ],
      trazabilidad: [
        { wch: 8 }, // ID
        { wch: 12 }, // Fecha
        { wch: 10 }, // Mes
        { wch: 15 }, // Tipo Movimiento
        { wch: 12 }, // Planta
        { wch: 15 }, // Guía SII
        { wch: 15 }, // ID Movimiento
        { wch: 15 }, // Código Material
        { wch: 25 }, // Nombre Material
        { wch: 15 }, // Código Nombre
        { wch: 15 }, // Clasificación
        { wch: 15 }, // Código Ranco
        { wch: 25 }, // Material Completo
        { wch: 12 }, // Unidad Completa
        { wch: 15 }, // Clasificación Completa
        { wch: 12 }, // Lote
        { wch: 10 }, // Cantidad
        { wch: 8 }, // Total Pallets
        { wch: 12 }, // Unidad Medida
        { wch: 15 }, // Ubicación Origen
        { wch: 15 }, // Bodega Origen
        { wch: 15 }, // Ubicación Destino
        { wch: 15 }, // Bodega Destino
        { wch: 20 }, // Ubicación Origen Title
        { wch: 20 }, // Ubicación Origen Bodega Depósito
        { wch: 20 }, // Ubicación Destino Title
        { wch: 20 }, // Ubicación Destino Bodega Depósito
        { wch: 12 }, // Turno
        { wch: 20 }, // Observación
        { wch: 15 }, // Bodega Stock
        { wch: 15 }, // Ubicación Stock
        { wch: 10 }, // Total Stock
        { wch: 15 }, // Número Embarque
        { wch: 15 }, // Patente Camión
        { wch: 15 }, // Usuario
        { wch: 15 }, // Referencia
        { wch: 12 }, // Fecha Creación
        { wch: 12 }, // Fecha Actualización
      ],
    };

    return configuraciones[tipo] || [];
  };

  return {
    exportando,
    exportarAExcel,
    prepararDatosTarjas,
    prepararDatosInventario,
    prepararDatosRecepciones,
    prepararDatosOperaciones,
    prepararDatosTrazabilidad,
    obtenerConfiguracionColumnas,
  };
}
