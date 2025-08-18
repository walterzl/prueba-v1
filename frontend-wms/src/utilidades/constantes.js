/**
 * Constantes del Frontend - WMS Ranco Cherries
 * Centraliza todas las constantes utilizadas en el frontend
 */

const CONSTANTES_FRONTEND = {
  // Configuración de la aplicación
  APP: {
    NOMBRE: 'WMS Ranco Cherries',
    VERSION: '1.0.0',
    DESCRIPCION: 'Sistema de Trazabilidad de Materiales'
  },

  // URLs base del API
  API: {
    BASE_URL: 'http://localhost:3001',
    TIMEOUT: 30000, // 30 segundos
    RETRY_ATTEMPTS: 3
  },

  // Roles de usuario
  ROLES: {
    ADMINISTRADOR: 'administrador',
    OPERADOR_RANCAGUA: 'operador_rancagua',
    OPERADOR_CHIMBARONGO: 'operador_chimbarongo',
    SUPERVISOR: 'supervisor'
  },

  // Plantas
  PLANTAS: {
    RANCAGUA: 'RANCAGUA',
    CHIMBARONGO: 'CHIMBARONGO'
  },

  // Tipos de movimiento
  TIPOS_MOVIMIENTO: {
    RECEPCION: 'RECEPCION',
    DESPACHO: 'DESPACHO',
    TRANSFERENCIA: 'TRANSFERENCIA',
    AJUSTE_INVENTARIO: 'AJUSTE_INVENTARIO',
    MERMA: 'MERMA',
    DEVOLUCION: 'DEVOLUCION'
  },

  // Estados
  ESTADOS: {
    PENDIENTE: 'pendiente',
    COMPLETADO: 'completado',
    CANCELADO: 'cancelado'
  },

  // Unidades de medida
  UNIDADES_MEDIDA: {
    KILOGRAMO: 'kg',
    GRAMO: 'g',
    LITRO: 'l',
    MILILITRO: 'ml',
    UNIDAD: 'un',
    CAJA: 'caja',
    BANDEJA: 'bdj'
  },

  // Configuración de localStorage
  STORAGE: {
    TOKEN_KEY: 'wms_token',
    USER_KEY: 'wms_user',
    PLANT_KEY: 'wms_plant',
    SETTINGS_KEY: 'wms_settings',
    REMEMBER_KEY: 'wms_remember'
  },

  // Configuración de paginación
  PAGINACION: {
    ITEMS_POR_PAGINA: 25,
    ITEMS_POR_PAGINA_OPCIONES: [10, 25, 50, 100],
    PAGINA_INICIAL: 1
  },

  // Configuración de validaciones
  VALIDACIONES: {
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 128,
    MAX_CODIGO_LENGTH: 50,
    MAX_NOMBRE_LENGTH: 255,
    MAX_OBSERVACIONES_LENGTH: 1000,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    RUT_PATTERN: /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/
  },

  // Configuración de notificaciones
  NOTIFICACIONES: {
    DURACION_EXITO: 3000,
    DURACION_ADVERTENCIA: 5000,
    DURACION_ERROR: 8000,
    POSICION: 'top-end'
  },

  // Configuración de modales
  MODALES: {
    FADE_DURATION: 300,
    BACKDROP_STATIC: true
  },

  // Configuración del escáner QR
  ESCANER_QR: {
    WIDTH: 320,
    HEIGHT: 240,
    FPS: 30,
    TIMEOUT: 30000, // 30 segundos
    FORMATOS: ['code_128', 'ean', 'ean_8', 'ean_13', 'code_39', 'code_93', 'codabar']
  },

  // Configuración de reportes
  REPORTES: {
    FORMATO_FECHA: 'DD/MM/YYYY',
    FORMATO_FECHA_HORA: 'DD/MM/YYYY HH:mm',
    MAX_REGISTROS_EXPORTACION: 5000,
    FORMATOS_EXPORTACION: ['pdf', 'excel', 'csv']
  },

  // Estados de stock
  ESTADOS_STOCK: {
    CRITICO: 'critico',
    BAJO: 'bajo',
    NORMAL: 'normal',
    ALTO: 'alto'
  },

  // Límites de stock
  LIMITES_STOCK: {
    CRITICO: 10,
    BAJO: 50,
    ALTO: 1000
  },

  // Tipos de alertas
  TIPOS_ALERTA: {
    EXITO: 'success',
    ADVERTENCIA: 'warning',
    ERROR: 'error',
    INFO: 'info'
  },

  // Iconos Bootstrap
  ICONOS: {
    EXITO: 'bi-check-circle',
    ADVERTENCIA: 'bi-exclamation-triangle',
    ERROR: 'bi-x-circle',
    INFO: 'bi-info-circle',
    CARGANDO: 'bi-arrow-clockwise',
    BUSCAR: 'bi-search',
    FILTRAR: 'bi-funnel',
    EXPORTAR: 'bi-download',
    IMPRIMIR: 'bi-printer',
    EDITAR: 'bi-pencil',
    ELIMINAR: 'bi-trash',
    VER: 'bi-eye',
    AGREGAR: 'bi-plus-circle',
    GUARDAR: 'bi-floppy',
    CANCELAR: 'bi-x-circle'
  },

  // Configuración de tablas
  TABLA: {
    ORDENAR_ASC: 'asc',
    ORDENAR_DESC: 'desc',
    COLUMNAS_VISIBLES_DEFAULT: ['codigo', 'nombre', 'cantidad', 'fecha'],
    MAX_FILAS_SIN_PAGINACION: 100
  },

  // Configuración de formularios
  FORMULARIO: {
    TIEMPO_DEBOUNCE: 300, // ms para validaciones
    AUTO_SAVE_INTERVAL: 30000, // 30 segundos
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: ['application/pdf', 'image/jpeg', 'image/png', 'text/csv']
  },

  // Estados de conexión
  CONEXION: {
    ONLINE: 'online',
    OFFLINE: 'offline',
    RECONECTANDO: 'reconectando'
  },

  // Configuración de cache
  CACHE: {
    DURACION_MANTENEDORES: 5 * 60 * 1000, // 5 minutos
    DURACION_INVENTARIO: 2 * 60 * 1000, // 2 minutos
    DURACION_REPORTES: 10 * 60 * 1000, // 10 minutos
    MAX_SIZE: 50 // Máximo 50 elementos en cache
  },

  // Configuración de PWA
  PWA: {
    THEME_COLOR: '#28a745',
    BACKGROUND_COLOR: '#ffffff',
    DISPLAY: 'standalone',
    ORIENTATION: 'portrait'
  },

  // Configuración de debug
  DEBUG: {
    ENABLED: window.location.hostname === 'localhost',
    LOG_LEVEL: 'info', // error, warn, info, debug
    CONSOLE_COLORS: {
      error: '#dc3545',
      warn: '#ffc107',
      info: '#17a2b8',
      debug: '#6c757d'
    }
  },

  // Mensajes predeterminados
  MENSAJES: {
    CARGANDO: 'Cargando...',
    SIN_DATOS: 'No hay datos disponibles',
    ERROR_CONEXION: 'Error de conexión. Verifique su conexión a internet.',
    ERROR_INESPERADO: 'Ha ocurrido un error inesperado',
    OPERACION_EXITOSA: 'Operación realizada exitosamente',
    CONFIRMAR_ELIMINACION: '¿Está seguro que desea eliminar este elemento?',
    SESION_EXPIRADA: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
    ACCESO_DENEGADO: 'No tiene permisos para realizar esta acción',
    DATOS_GUARDADOS: 'Datos guardados correctamente',
    CAMPOS_REQUERIDOS: 'Por favor complete todos los campos requeridos'
  },

  // Configuración de animaciones
  ANIMACIONES: {
    FADE_IN: 'fade-in',
    SLIDE_IN: 'slide-in',
    DURACION_CORTA: 300,
    DURACION_MEDIA: 500,
    DURACION_LARGA: 800
  },

  // Configuración de shortcuts/atajos de teclado
  SHORTCUTS: {
    BUSCAR: 'Ctrl+F',
    GUARDAR: 'Ctrl+S',
    NUEVO: 'Ctrl+N',
    ESCAPE: 'Escape',
    ENTER: 'Enter'
  }
};

// Configuración específica por entorno
if (window.location.hostname === 'localhost') {
  CONSTANTES_FRONTEND.API.BASE_URL = 'http://localhost:3001';
} else {
  CONSTANTES_FRONTEND.API.BASE_URL = 'https://api.wmsranco.com'; // Cambiar en producción
}

// Congelar el objeto para evitar modificaciones
Object.freeze(CONSTANTES_FRONTEND);