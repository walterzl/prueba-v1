/**
 * Constantes centralizadas del sistema WMS
 * Evita duplicación y facilita mantenimiento
 */

// ============== CONFIGURACIÓN GENERAL ==============

export const CONFIGURACION_SISTEMA = {
  NOMBRE_APLICACION: "Sistema WMS Ranco Cherries",
  VERSION: "1.0.0",
  EMPRESA: "Exportadora Rancagua S.A.",
  DESCRIPCION: "Sistema de Trazabilidad de Materiales - Bodega y Patio WMS",
};

// ============== PLANTAS DISPONIBLES ==============

export const PLANTAS = {
  RANCAGUA: "Rancagua",
  CHIMBARONGO: "Chimbarongo",
};

export const LISTA_PLANTAS = Object.values(PLANTAS);

// ============== TIPOS DE MOVIMIENTO ==============

export const TIPOS_MOVIMIENTO = {
  INGRESO: "INGRESO",
  DESPACHO: "DESPACHO",
  RECEPCION_INTERNA: "RECEPCION_INTERNA",
  INGRESO_PROVEEDOR: "INGRESO_PROVEEDOR",
  TRASLADO: "TRASLADO",
  CONSUMO: "CONSUMO",
  TRANSFERENCIA: "TRANSFERENCIA",
  SALIDA: "SALIDA",
  ENTRADA: "ENTRADA",
  AJUSTE_POSITIVO: "AJUSTE_POSITIVO",
  AJUSTE_NEGATIVO: "AJUSTE_NEGATIVO",
};

export const LISTA_TIPOS_MOVIMIENTO = Object.values(TIPOS_MOVIMIENTO);

// ============== TURNOS ==============

export const TURNOS = ["Turno 1", "Turno 2", "Turno 3"];

export const LISTA_TURNOS = TURNOS;

// ============== CLASIFICACIONES DE MATERIAL ==============

export const CLASIFICACIONES_MATERIAL = {
  KIT: "Kit",
  NORMAL: "Normal",
  ARMADO: "Armado",
  GUAGUA: "Guagua",
  POR_ARMAR: "Por armar",
};

export const LISTA_CLASIFICACIONES = Object.values(CLASIFICACIONES_MATERIAL);

// ============== UNIDADES DE MEDIDA ==============

export const UNIDADES_MEDIDA = {
  UNIDAD: "Unidad",
  LITROS: "Litros",
  ROLLO: "Rollo",
  KILOS: "Kilos",
  METROS: "Metros",
  CAJAS: "Cajas",
  PALLET: "Pallet",
  BOLSAS: "Bolsas",
};

export const LISTA_UNIDADES_MEDIDA = Object.values(UNIDADES_MEDIDA);

// ============== TIPOS DE TARJA ==============

export const TIPOS_TARJA = {
  CAA: "CAA",
  BODEGA: "BODEGA",
};

export const LISTA_TIPOS_TARJA = Object.values(TIPOS_TARJA);

// ============== ESTADOS DE TARJA ==============

export const ESTADOS_TARJA = {
  ACTIVO: "activo",
  AGOTADO: "agotado",
  CERRADO: "cerrado",
  VENCIDO: "vencido",
  IMPRESA: "impresa",
  PENDIENTE: "pendiente",
  EN_PROCESO: "en_proceso",
  COMPLETADA: "completada",
};

export const LISTA_ESTADOS_TARJA = Object.values(ESTADOS_TARJA);

// ============== ESTADOS DE OPERACIÓN ==============

export const ESTADOS_OPERACION = [
  "PLANIFICADA",
  "EN_PROCESO",
  "COMPLETADA",
  "CANCELADA",
];

export const LISTA_ESTADOS_OPERACION = ESTADOS_OPERACION;

// ============== TIPOS DE OPERACIÓN FRÍO Y DESPACHO ==============

export const TIPOS_OPERACION_FRIO = [
  "CONSUMO",
  "DESPACHO",
  "PREPARACION",
  "ALMACENAJE",
];

export const LISTA_TIPOS_OPERACION_FRIO = TIPOS_OPERACION_FRIO;

// ============== CONDICIONES DE ARMADO ==============

export const CONDICIONES_ARMADO = {
  ARMADO: "Armado",
  POR_ARMAR: "Por Armar",
  SEMI_ARMADO: "Semi Armado",
  NO_APLICA: "No Aplica",
};

export const LISTA_CONDICIONES_ARMADO = Object.values(CONDICIONES_ARMADO);

// ============== CONFIGURACIÓN DE PAGINACIÓN ==============

export const PAGINACION = {
  TAMAÑO_PAGINA_DEFECTO: 50,
  OPCIONES_TAMAÑO: [25, 50, 100, 200],
  PAGINA_INICIAL: 1,
};

// ============== CONFIGURACIÓN DE VALIDACIONES ==============

export const VALIDACIONES = {
  // Longitudes mínimas y máximas
  LONGITUD_MINIMA_CODIGO: 3,
  LONGITUD_MAXIMA_CODIGO: 20,
  LONGITUD_MINIMA_NOMBRE: 2,
  LONGITUD_MAXIMA_NOMBRE: 200,
  LONGITUD_MAXIMA_OBSERVACIONES: 500,
  LONGITUD_MAXIMA_DESCRIPCION: 1000,

  // Valores numéricos
  CANTIDAD_MINIMA: 0,
  CANTIDAD_MAXIMA: 999999999,
  STOCK_MINIMO: 0,
  STOCK_MAXIMO: 999999999,
  PALLETS_MINIMOS: 0,
  PALLETS_MAXIMOS: 99999,

  // Archivos
  TAMAÑO_MAXIMO_ARCHIVO_MB: 5,
  TIPOS_ARCHIVO_PERMITIDOS: ["image/jpeg", "image/png", "application/pdf"],
};

// ============== MENSAJES DE USUARIO ==============

export const MENSAJES = {
  // Éxito
  EXITO_CREAR: "Registro creado exitosamente",
  EXITO_ACTUALIZAR: "Registro actualizado exitosamente",
  EXITO_ELIMINAR: "Registro eliminado exitosamente",
  EXITO_GUARDAR: "Datos guardados exitosamente",
  EXITO_IMPRIMIR: "Documento generado exitosamente",

  // Errores generales
  ERROR_GENERICO: "Ha ocurrido un error inesperado",
  ERROR_CONEXION: "Error de conexión con el servidor",
  ERROR_SIN_DATOS: "No se encontraron datos",
  ERROR_DATOS_INVALIDOS: "Los datos ingresados no son válidos",
  ERROR_SESION_EXPIRADA:
    "Su sesión ha expirado, por favor inicie sesión nuevamente",

  // Errores específicos
  ERROR_CODIGO_DUPLICADO: "El código ingresado ya existe",
  ERROR_MATERIAL_NO_ENCONTRADO: "Material no encontrado",
  ERROR_PROVEEDOR_NO_ENCONTRADO: "Proveedor no encontrado",
  ERROR_UBICACION_NO_ENCONTRADA: "Ubicación no encontrada",
  ERROR_STOCK_INSUFICIENTE: "Stock insuficiente para la operación",

  // Confirmaciones
  CONFIRMAR_ELIMINAR: "¿Está seguro que desea eliminar este registro?",
  CONFIRMAR_GUARDAR: "¿Está seguro que desea guardar los cambios?",
  CONFIRMAR_CANCELAR:
    "¿Está seguro que desea cancelar? Se perderán los cambios no guardados",

  // Información
  INFO_CARGANDO: "Cargando datos...",
  INFO_GUARDANDO: "Guardando cambios...",
  INFO_PROCESANDO: "Procesando solicitud...",
  INFO_SIN_RESULTADOS: "No se encontraron resultados para la búsqueda",
};

// ============== CONFIGURACIÓN DE FECHAS ==============

export const FECHAS = {
  FORMATO_DISPLAY: "DD/MM/YYYY",
  FORMATO_DISPLAY_HORA: "DD/MM/YYYY HH:mm:ss",
  FORMATO_API: "YYYY-MM-DD",
  FORMATO_API_HORA: "YYYY-MM-DDTHH:mm:ss.sssZ",
  ZONA_HORARIA: "America/Santiago",
};

// ============== CONFIGURACIÓN DE API ==============

export const API_CONFIG = {
  TIMEOUT_DEFECTO: 30000, // 30 segundos
  REINTENTOS_MAXIMOS: 3,
  DELAY_ENTRE_REINTENTOS: 1000, // 1 segundo
};

// ============== CÓDIGOS DE RESPUESTA HTTP ==============

export const CODIGOS_HTTP = {
  OK: 200,
  CREADO: 201,
  SIN_CONTENIDO: 204,
  BAD_REQUEST: 400,
  NO_AUTORIZADO: 401,
  PROHIBIDO: 403,
  NO_ENCONTRADO: 404,
  CONFLICTO: 409,
  ERROR_SERVIDOR: 500,
};

// ============== CONFIGURACIÓN DE INTERFAZ ==============

export const UI_CONFIG = {
  // Colores del tema
  COLORES: {
    PRIMARIO: "#4f46e5",
    SECUNDARIO: "#7c3aed",
    EXITO: "#10b981",
    ADVERTENCIA: "#f59e0b",
    ERROR: "#ef4444",
    INFO: "#3b82f6",
  },

  // Íconos
  ICONOS: {
    INVENTARIO: "📦",
    TRAZABILIDAD: "📋",
    RECEPCION: "📥",
    FRIO_DESPACHO: "❄️",
    TARJAS: "🏷️",
    REPORTES: "📊",
    USUARIOS: "👥",
    CONFIGURACION: "⚙️",
    EXITO: "✅",
    ERROR: "❌",
    ADVERTENCIA: "⚠️",
    INFO: "ℹ️",
    BUSCAR: "🔍",
    IMPRIMIR: "🖨️",
    DESCARGAR: "⬇️",
    SUBIR: "⬆️",
    EDITAR: "✏️",
    ELIMINAR: "🗑️",
    GUARDAR: "💾",
    CANCELAR: "❌",
  },

  // Tamaños de modal
  TAMAÑOS_MODAL: {
    PEQUEÑO: "sm",
    MEDIANO: "md",
    GRANDE: "lg",
    EXTRA_GRANDE: "xl",
  },
};

// ============== RUTAS DE NAVEGACIÓN ==============

export const RUTAS = {
  INICIO: "/",
  LOGIN: "/login",
  INVENTARIO: "/inventario",
  TRAZABILIDAD: "/trazabilidad",
  RECEPCION_LOTES: "/recepcion-lotes",
  FRIO_DESPACHO: "/frio-despacho",
  TARJAS: "/tarjas",
  REPORTES: "/reportes",
  CONFIGURACION: "/configuracion",
  PERFIL: "/perfil",
};

// ============== CONFIGURACIÓN DE ALMACENAMIENTO LOCAL ==============

export const LOCAL_STORAGE_KEYS = {
  TOKEN_AUTH: "wms_auth_token",
  USUARIO_ACTUAL: "wms_usuario_actual",
  PLANTA_SELECCIONADA: "wms_planta_seleccionada",
  CONFIGURACION_USUARIO: "wms_config_usuario",
  FILTROS_INVENTARIO: "wms_filtros_inventario",
  FILTROS_TRAZABILIDAD: "wms_filtros_trazabilidad",
};

// ============== CONFIGURACIÓN DE EXPORTACIÓN ==============

export const FORMATOS_EXPORTACION = {
  PDF: "pdf",
  EXCEL: "xlsx",
  CSV: "csv",
  JSON: "json",
};

export const LISTA_FORMATOS_EXPORTACION = Object.values(FORMATOS_EXPORTACION);

// ============== TEMPORADAS ==============

export const TEMPORADAS = {
  R8_2023_2024: "R8 2023-2024",
  R9_2024_2025: "R9 2024-2025",
  R10_2025_2026: "R10 2025-2026",
};

export const LISTA_TEMPORADAS = Object.values(TEMPORADAS);

// ============== UTILIDADES PARA CONSTANTES ==============

/**
 * Obtiene las opciones para un select a partir de un objeto de constantes
 */
export function obtenerOpcionesSelect(objetoConstantes) {
  return Object.entries(objetoConstantes).map(([clave, valor]) => ({
    value: valor,
    label: valor,
    key: clave,
  }));
}

/**
 * Valida si un valor está dentro de las constantes permitidas
 */
export function esValorValido(valor, objetoConstantes) {
  return Object.values(objetoConstantes).includes(valor);
}

/**
 * Obtiene la clave de una constante por su valor
 */
export function obtenerClavePorValor(valor, objetoConstantes) {
  const entrada = Object.entries(objetoConstantes).find(
    ([, val]) => val === valor
  );
  return entrada ? entrada[0] : null;
}
