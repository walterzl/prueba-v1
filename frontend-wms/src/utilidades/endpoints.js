/**
 * Endpoints del Frontend - WMS Ranco Cherries
 * Centraliza todas las URLs de la API utilizadas en el frontend
 */

const ENDPOINTS_FRONTEND = {
  // Base URL del API
  BASE: CONSTANTES_FRONTEND.API.BASE_URL,

  // Endpoints de autenticación
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    VALIDATE: '/api/auth/validate',
    CAMBIAR_PASSWORD: '/api/auth/cambiar-password'
  },

  // Endpoints de mantenedores (APIs centralizadas)
  MANTENEDORES: {
    BASE: '/api/mantenedores',
    RESUMEN: '/api/mantenedores',
    
    // Plantas
    PLANTAS: '/api/mantenedores/plantas',
    
    // Materiales
    MATERIALES: '/api/mantenedores/materiales',
    MATERIAL_POR_CODIGO: '/api/mantenedores/materiales/codigo',
    
    // Proveedores
    PROVEEDORES: '/api/mantenedores/proveedores',
    PROVEEDOR_POR_CODIGO: '/api/mantenedores/proveedores/codigo',
    
    // Ubicaciones
    UBICACIONES: '/api/mantenedores/ubicaciones',
    UBICACIONES_POR_PLANTA: '/api/mantenedores/ubicaciones/planta',
    
    // Temporadas
    TEMPORADAS: '/api/mantenedores/temporadas',
    TEMPORADA_ACTIVA: '/api/mantenedores/temporadas/activa',
    
    // Tipos de Movimiento
    TIPOS_MOVIMIENTO: '/api/mantenedores/tipos-movimiento',
    
    // Unidades de Medida
    UNIDADES_MEDIDA: '/api/mantenedores/unidades-medida'
  },

  // Endpoints de trazabilidad
  TRAZABILIDAD: {
    BASE: '/api/trazabilidad',
    LISTAR: '/api/trazabilidad',
    OBTENER: '/api/trazabilidad',
    CREAR: '/api/trazabilidad',
    ACTUALIZAR: '/api/trazabilidad',
    ELIMINAR: '/api/trazabilidad',
    POR_FOLIO: '/api/trazabilidad/folio',
    POR_MATERIAL: '/api/trazabilidad/material',
    POR_FECHA: '/api/trazabilidad/fecha',
    REPORTE: '/api/trazabilidad/reporte'
  },

  // Endpoints de inventario
  INVENTARIO: {
    BASE: '/api/inventario',
    
    // Inventario consolidado
    CONSOLIDADO: '/api/inventario/consolidado',
    
    // Por planta
    RANCAGUA: '/api/inventario/rancagua',
    CHIMBARONGO: '/api/inventario/chimbarongo',
    
    // Operaciones
    AJUSTAR: '/api/inventario/ajustar',
    TRANSFERIR: '/api/inventario/transferir',
    
    // Reportes
    REPORTE_STOCK: '/api/inventario/reporte/stock',
    REPORTE_MOVIMIENTOS: '/api/inventario/reporte/movimientos',
    
    // Por ubicación y material
    POR_UBICACION: '/api/inventario/ubicacion',
    POR_MATERIAL: '/api/inventario/material'
  },

  // Endpoints de reportes
  REPORTES: {
    BASE: '/api/reportes',
    TRAZABILIDAD: '/api/reportes/trazabilidad',
    INVENTARIO: '/api/reportes/inventario',
    MOVIMIENTOS: '/api/reportes/movimientos',
    STOCK_CRITICO: '/api/reportes/stock-critico',
    EXPORTAR_PDF: '/api/reportes/exportar/pdf',
    EXPORTAR_EXCEL: '/api/reportes/exportar/excel'
  },

  // Endpoints de usuarios
  USUARIOS: {
    BASE: '/api/usuarios',
    LISTAR: '/api/usuarios',
    OBTENER: '/api/usuarios',
    CREAR: '/api/usuarios',
    ACTUALIZAR: '/api/usuarios',
    ELIMINAR: '/api/usuarios',
    PERFIL: '/api/usuarios/perfil'
  },

  // Endpoints utilitarios
  UTILS: {
    BASE: '/api/utils',
    HEALTH: '/api/utils/health',
    VERSION: '/api/utils/version',
    GENERAR_CODIGO: '/api/utils/generar-codigo',
    VALIDAR_CODIGO_BARRAS: '/api/utils/validar-codigo-barras'
  },

  // Endpoints de logs (solo para administradores)
  LOGS: {
    BASE: '/api/logs',
    LISTAR: '/api/logs',
    POR_USUARIO: '/api/logs/usuario',
    POR_FECHA: '/api/logs/fecha',
    POR_NIVEL: '/api/logs/nivel'
  }
};

/**
 * Clase utilitaria para construir URLs de endpoints
 */
class ConstructorEndpoints {

  /**
   * Construye URL completa para un endpoint
   * @param {string} endpoint - Endpoint relativo
   * @returns {string} URL completa
   */
  static construirUrl(endpoint) {
    return `${ENDPOINTS_FRONTEND.BASE}${endpoint}`;
  }

  /**
   * Reemplaza parámetros en un endpoint
   * @param {string} endpoint - Endpoint con parámetros
   * @param {Object} parametros - Objeto con los parámetros
   * @returns {string} Endpoint con parámetros reemplazados
   */
  static reemplazarParametros(endpoint, parametros = {}) {
    let url = endpoint;
    Object.keys(parametros).forEach(key => {
      url = url.replace(`:${key}`, encodeURIComponent(parametros[key]));
    });
    return url;
  }

  /**
   * Construye URL con query parameters
   * @param {string} endpoint - Endpoint base
   * @param {Object} params - Parámetros de consulta
   * @returns {string} URL con query parameters
   */
  static construirUrlConParams(endpoint, params = {}) {
    const url = new URL(this.construirUrl(endpoint));
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });
    return url.toString();
  }

  /**
   * Endpoints específicos para materiales
   */
  static materiales = {
    listar: (activo = true) => 
      this.construirUrlConParams(ENDPOINTS_FRONTEND.MANTENEDORES.MATERIALES, { activo }),
    
    porCodigo: (codigo) => 
      this.construirUrl(`${ENDPOINTS_FRONTEND.MANTENEDORES.MATERIAL_POR_CODIGO}/${encodeURIComponent(codigo)}`)
  };

  /**
   * Endpoints específicos para proveedores
   */
  static proveedores = {
    listar: (activo = true) => 
      this.construirUrlConParams(ENDPOINTS_FRONTEND.MANTENEDORES.PROVEEDORES, { activo }),
    
    porCodigo: (codigo) => 
      this.construirUrl(`${ENDPOINTS_FRONTEND.MANTENEDORES.PROVEEDOR_POR_CODIGO}/${encodeURIComponent(codigo)}`)
  };

  /**
   * Endpoints específicos para ubicaciones
   */
  static ubicaciones = {
    listar: (activo = true) => 
      this.construirUrlConParams(ENDPOINTS_FRONTEND.MANTENEDORES.UBICACIONES, { activo }),
    
    porPlanta: (planta, activo = true) => 
      this.construirUrlConParams(`${ENDPOINTS_FRONTEND.MANTENEDORES.UBICACIONES_POR_PLANTA}/${planta}`, { activo })
  };

  /**
   * Endpoints específicos para trazabilidad
   */
  static trazabilidad = {
    listar: (params = {}) => 
      this.construirUrlConParams(ENDPOINTS_FRONTEND.TRAZABILIDAD.LISTAR, params),
    
    obtener: (id) => 
      this.construirUrl(`${ENDPOINTS_FRONTEND.TRAZABILIDAD.OBTENER}/${id}`),
    
    porFolio: (folio) => 
      this.construirUrl(`${ENDPOINTS_FRONTEND.TRAZABILIDAD.POR_FOLIO}/${encodeURIComponent(folio)}`),
    
    porMaterial: (materialId) => 
      this.construirUrl(`${ENDPOINTS_FRONTEND.TRAZABILIDAD.POR_MATERIAL}/${materialId}`),
    
    porFecha: (fechaInicio, fechaFin) => 
      this.construirUrl(`${ENDPOINTS_FRONTEND.TRAZABILIDAD.POR_FECHA}/${fechaInicio}/${fechaFin}`)
  };

  /**
   * Endpoints específicos para inventario
   */
  static inventario = {
    consolidado: (params = {}) => 
      this.construirUrlConParams(ENDPOINTS_FRONTEND.INVENTARIO.CONSOLIDADO, params),
    
    porPlanta: (planta, params = {}) => 
      this.construirUrlConParams(`${ENDPOINTS_FRONTEND.INVENTARIO.BASE}/${planta.toLowerCase()}`, params),
    
    porUbicacion: (ubicacionId) => 
      this.construirUrl(`${ENDPOINTS_FRONTEND.INVENTARIO.POR_UBICACION}/${ubicacionId}`),
    
    porMaterial: (materialId) => 
      this.construirUrl(`${ENDPOINTS_FRONTEND.INVENTARIO.POR_MATERIAL}/${materialId}`)
  };

  /**
   * Endpoints específicos para usuarios
   */
  static usuarios = {
    listar: (params = {}) => 
      this.construirUrlConParams(ENDPOINTS_FRONTEND.USUARIOS.LISTAR, params),
    
    obtener: (id) => 
      this.construirUrl(`${ENDPOINTS_FRONTEND.USUARIOS.OBTENER}/${id}`),
    
    actualizar: (id) => 
      this.construirUrl(`${ENDPOINTS_FRONTEND.USUARIOS.ACTUALIZAR}/${id}`),
    
    eliminar: (id) => 
      this.construirUrl(`${ENDPOINTS_FRONTEND.USUARIOS.ELIMINAR}/${id}`)
  };

  /**
   * Endpoints específicos para reportes
   */
  static reportes = {
    trazabilidad: (formato, params = {}) => 
      this.construirUrlConParams(`${ENDPOINTS_FRONTEND.REPORTES.TRAZABILIDAD}?formato=${formato}`, params),
    
    inventario: (formato, params = {}) => 
      this.construirUrlConParams(`${ENDPOINTS_FRONTEND.REPORTES.INVENTARIO}?formato=${formato}`, params),
    
    stockCritico: (formato = 'pdf') => 
      this.construirUrl(`${ENDPOINTS_FRONTEND.REPORTES.STOCK_CRITICO}?formato=${formato}`)
  };

  /**
   * Endpoints específicos para logs
   */
  static logs = {
    listar: (params = {}) => 
      this.construirUrlConParams(ENDPOINTS_FRONTEND.LOGS.LISTAR, params),
    
    porUsuario: (usuarioId, params = {}) => 
      this.construirUrlConParams(`${ENDPOINTS_FRONTEND.LOGS.POR_USUARIO}/${usuarioId}`, params),
    
    porFecha: (fechaInicio, fechaFin, params = {}) => 
      this.construirUrlConParams(`${ENDPOINTS_FRONTEND.LOGS.POR_FECHA}/${fechaInicio}/${fechaFin}`, params)
  };
}

// Congelar los objetos para evitar modificaciones
Object.freeze(ENDPOINTS_FRONTEND);
Object.freeze(ConstructorEndpoints);