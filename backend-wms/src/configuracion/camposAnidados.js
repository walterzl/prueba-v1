/**
 * Configuración de Campos Anidados para Formularios Dinámicos      dependsOn: null,
      required: false,
    },
    proveedores: {
      endpoint: ENDPOINTS.MANTENEDORES.PROVEEDORES,
      valueField: "id",
      labelField: "title",
      searchFields: ["title"],
      displayTemplate: "{title}",
      filters: {
        activo: true,
      },
      dependsOn: null,
      required: false,
    },el esquema de Prisma y endpoints del sistema WMS
 */

const { ENDPOINTS } = require("./endpoints");

/**
 * Configuración de campos anidados por modelo/formulario
 * Estructura:
 * - endpoint: endpoint para obtener datos
 * - valueField: campo que se usa como valor
 * - labelField: campo que se muestra al usuario
 * - searchFields: campos por los que se puede buscar
 * - dependsOn: campos de los que depende este combo
 * - filters: filtros adicionales que se pueden aplicar
 */
const CAMPOS_ANIDADOS = {
  // Campos para Inventario
  INVENTARIO: {
    materiales: {
      endpoint: ENDPOINTS.MANTENEDORES.MATERIALES,
      valueField: "id",
      labelField: "nombre_material",
      searchFields: ["codigo_ranco", "nombre_material", "cod_nombre"],
      displayTemplate: "{codigo_ranco} - {nombre_material}",
      filters: {
        activo: true,
      },
      dependsOn: null,
      required: true,
    },
    ubicaciones: {
      endpoint: ENDPOINTS.MANTENEDORES.UBICACIONES,
      valueField: "id",
      labelField: "nombre",
      searchFields: ["codigo", "nombre", "bodega"],
      displayTemplate: "{bodega} / {nombre}",
      filters: {
        activo: true,
      },
      dependsOn: "planta",
      required: true,
    },
    plantas: {
      endpoint: ENDPOINTS.MANTENEDORES.PLANTAS,
      valueField: "codigo",
      labelField: "nombre",
      searchFields: ["codigo", "nombre"],
      displayTemplate: "{nombre}",
      filters: {},
      dependsOn: null,
      required: true,
    },
  },

  // Campos para Trazabilidad
  TRAZABILIDAD: {
    materiales: {
      endpoint: ENDPOINTS.MANTENEDORES.MATERIALES,
      valueField: "id",
      labelField: "nombre_material",
      searchFields: [
        "codigo_ranco",
        "nombre_material",
        "cod_nombre",
        "clasificacion",
      ],
      displayTemplate: "{codigo_ranco} - {nombre_material}",
      filters: {
        activo: true,
      },
      dependsOn: null,
      required: true,
    },
    proveedores: {
      endpoint: ENDPOINTS.MANTENEDORES.PROVEEDORES,
      valueField: "id",
      labelField: "title",
      searchFields: ["title"],
      displayTemplate: "{title}",
      filters: {
        activo: true,
      },
      dependsOn: null,
      required: false,
    },
    ubicaciones_origen: {
      endpoint: ENDPOINTS.MANTENEDORES.UBICACIONES,
      valueField: "id",
      labelField: "nombre",
      searchFields: ["codigo", "nombre", "bodega"],
      displayTemplate: "{bodega} / {nombre}",
      filters: {
        activo: true,
      },
      dependsOn: "planta",
      required: true,
    },
    ubicaciones_destino: {
      endpoint: ENDPOINTS.MANTENEDORES.UBICACIONES,
      valueField: "id",
      labelField: "nombre",
      searchFields: ["codigo", "nombre", "bodega"],
      displayTemplate: "{bodega} / {nombre}",
      filters: {
        activo: true,
      },
      dependsOn: "planta",
      required: true,
    },
    temporadas: {
      endpoint: ENDPOINTS.MANTENEDORES.TEMPORADAS,
      valueField: "id",
      labelField: "title",
      searchFields: ["title"],
      displayTemplate: "{title}",
      filters: {
        activo: true,
      },
      dependsOn: null,
      required: true,
    },
    tipos_movimiento: {
      endpoint: ENDPOINTS.MANTENEDORES.TIPOS_MOVIMIENTO,
      valueField: "id",
      labelField: "nombre",
      searchFields: ["codigo", "nombre", "descripcion"],
      displayTemplate: "{nombre}",
      filters: {
        activo: true,
      },
      dependsOn: null,
      required: true,
    },
    plantas: {
      endpoint: ENDPOINTS.MANTENEDORES.PLANTAS,
      valueField: "codigo",
      labelField: "nombre",
      searchFields: ["codigo", "nombre"],
      displayTemplate: "{nombre}",
      filters: {},
      dependsOn: null,
      required: true,
    },
  },

  // Campos para Recepciones de Lotes
  RECEPCIONES_LOTES: {
    materiales: {
      endpoint: ENDPOINTS.MANTENEDORES.MATERIALES,
      valueField: "id",
      labelField: "nombre_material",
      searchFields: ["codigo_ranco", "nombre_material", "cod_nombre"],
      displayTemplate: "{codigo_ranco} - {nombre_material}",
      filters: {
        activo: true,
      },
      dependsOn: null,
      required: true,
    },
    proveedores: {
      endpoint: ENDPOINTS.MANTENEDORES.PROVEEDORES,
      valueField: "id",
      labelField: "title",
      searchFields: ["title"],
      displayTemplate: "{title}",
      filters: {
        activo: true,
      },
      dependsOn: null,
      required: true,
    },
    ubicaciones_destino: {
      endpoint: ENDPOINTS.MANTENEDORES.UBICACIONES,
      valueField: "id",
      labelField: "title",
      searchFields: ["title", "bodega_deposito", "planta"],
      displayTemplate: "{bodega_deposito} / {title}",
      filters: {
        activo: true,
      },
      dependsOn: null, // Removemos la dependencia para las pruebas
      required: true,
    },
    plantas: {
      endpoint: ENDPOINTS.MANTENEDORES.PLANTAS,
      valueField: "codigo",
      labelField: "nombre",
      searchFields: ["codigo", "nombre"],
      displayTemplate: "{nombre}",
      filters: {},
      dependsOn: null,
      required: true,
    },
  },

  // Campos para Operaciones Frío y Despacho
  OPERACIONES_FRIO_DESPACHO: {
    materiales: {
      endpoint: ENDPOINTS.MANTENEDORES.MATERIALES,
      valueField: "id",
      labelField: "nombre",
      searchFields: ["codigo", "nombre", "cod_nombre"],
      displayTemplate: "{codigo} - {nombre}",
      filters: {
        activo: true,
        requiere_frio: true, // Solo materiales que requieren frío
      },
      dependsOn: null,
      required: true,
    },
    ubicaciones_origen: {
      endpoint: ENDPOINTS.MANTENEDORES.UBICACIONES,
      valueField: "id",
      labelField: "nombre",
      searchFields: ["codigo", "nombre", "bodega"],
      displayTemplate: "{bodega} / {nombre}",
      filters: {
        activo: true,
      },
      dependsOn: "planta",
      required: true,
    },
    ubicaciones_destino: {
      endpoint: ENDPOINTS.MANTENEDORES.UBICACIONES,
      valueField: "id",
      labelField: "nombre",
      searchFields: ["codigo", "nombre", "bodega"],
      displayTemplate: "{bodega} / {nombre}",
      filters: {
        activo: true,
      },
      dependsOn: "planta",
      required: true,
    },
    tipos_operacion: {
      endpoint: "/api/mantenedores/tipos-operacion",
      valueField: "value",
      labelField: "label",
      searchFields: ["value", "label"],
      displayTemplate: "{label}",
      filters: {},
      dependsOn: null,
      required: true,
    },
    turnos: {
      endpoint: "/api/mantenedores/turnos",
      valueField: "value",
      labelField: "label",
      searchFields: ["value", "label"],
      displayTemplate: "{label}",
      filters: {},
      dependsOn: null,
      required: false,
    },
    plantas: {
      endpoint: ENDPOINTS.MANTENEDORES.PLANTAS,
      valueField: "codigo",
      labelField: "nombre",
      searchFields: ["codigo", "nombre"],
      displayTemplate: "{nombre}",
      filters: {},
      dependsOn: null,
      required: true,
    },
  },

  // Campos para Stock por Ubicaciones
  STOCK_UBICACIONES: {
    materiales: {
      endpoint: ENDPOINTS.MANTENEDORES.MATERIALES,
      valueField: "id",
      labelField: "nombre",
      searchFields: ["codigo", "nombre", "cod_nombre"],
      displayTemplate: "{codigo} - {nombre}",
      filters: {
        activo: true,
      },
      dependsOn: null,
      required: true,
    },
    ubicaciones: {
      endpoint: ENDPOINTS.MANTENEDORES.UBICACIONES,
      valueField: "id",
      labelField: "nombre",
      searchFields: ["codigo", "nombre", "bodega"],
      displayTemplate: "{bodega} / {nombre}",
      filters: {
        activo: true,
      },
      dependsOn: "planta",
      required: true,
    },
    plantas: {
      endpoint: ENDPOINTS.MANTENEDORES.PLANTAS,
      valueField: "codigo",
      labelField: "nombre",
      searchFields: ["codigo", "nombre"],
      displayTemplate: "{nombre}",
      filters: {},
      dependsOn: null,
      required: true,
    },
  },

  // Campos para Tarjas
  TARJAS: {
    materiales: {
      endpoint: ENDPOINTS.MANTENEDORES.MATERIALES,
      valueField: "id",
      labelField: "nombre",
      searchFields: ["codigo", "nombre", "cod_nombre"],
      displayTemplate: "{codigo} - {nombre}",
      filters: {
        activo: true,
      },
      dependsOn: null,
      required: true,
    },
    proveedores: {
      endpoint: ENDPOINTS.MANTENEDORES.PROVEEDORES,
      valueField: "id",
      labelField: "nombre",
      searchFields: ["codigo", "nombre"],
      displayTemplate: "{codigo} - {nombre}",
      filters: {
        activo: true,
      },
      dependsOn: null,
      required: false,
    },
    tipos_tarja: {
      endpoint: "/api/mantenedores/tipos-tarja",
      valueField: "value",
      labelField: "label",
      searchFields: ["value", "label"],
      displayTemplate: "{label}",
      filters: {},
      dependsOn: null,
      required: true,
    },
    estados_tarja: {
      endpoint: "/api/mantenedores/estados-tarja",
      valueField: "value",
      labelField: "label",
      searchFields: ["value", "label"],
      displayTemplate: "{label}",
      filters: {},
      dependsOn: null,
      required: false,
    },
    plantas: {
      endpoint: ENDPOINTS.MANTENEDORES.PLANTAS,
      valueField: "codigo",
      labelField: "nombre",
      searchFields: ["codigo", "nombre"],
      displayTemplate: "{nombre}",
      filters: {},
      dependsOn: null,
      required: true,
    },
  },

  // Campos para Usuarios
  USUARIOS: {
    plantas: {
      endpoint: ENDPOINTS.MANTENEDORES.PLANTAS,
      valueField: "codigo",
      labelField: "nombre",
      searchFields: ["codigo", "nombre"],
      displayTemplate: "{nombre}",
      filters: {},
      dependsOn: null,
      required: true,
    },
    roles: {
      endpoint: "/api/mantenedores/roles",
      valueField: "value",
      labelField: "label",
      searchFields: ["value", "label"],
      displayTemplate: "{label}",
      filters: {},
      dependsOn: null,
      required: true,
    },
  },
};

/**
 * Configuración de campos especiales (no de base de datos)
 */
const CAMPOS_ESPECIALES = {
  // Unidades de medida
  unidades_medida: {
    endpoint: ENDPOINTS.MANTENEDORES.UNIDADES_MEDIDA,
    valueField: "codigo",
    labelField: "nombre",
    searchFields: ["codigo", "nombre"],
    displayTemplate: "{codigo} - {nombre}",
    filters: {},
    dependsOn: null,
    required: false,
  },

  // Bodegas
  bodegas: {
    endpoint: "/api/mantenedores/bodegas",
    valueField: "value",
    labelField: "label",
    searchFields: ["value", "label"],
    displayTemplate: "{label}",
    filters: {},
    dependsOn: null,
    required: false,
  },

  // Certificaciones CAA
  certificaciones_caa: {
    endpoint: "/api/mantenedores/certificaciones-caa",
    valueField: "value",
    labelField: "label",
    searchFields: ["value", "label", "title"],
    displayTemplate: "{label}",
    filters: {},
    dependsOn: null,
    required: false,
  },

  // Prioridades
  prioridades: {
    endpoint: "/api/mantenedores/prioridades",
    valueField: "value",
    labelField: "label",
    searchFields: ["value", "label"],
    displayTemplate: "{label}",
    filters: {},
    dependsOn: null,
    required: false,
  },

  // Condiciones de armado
  condiciones_armado: {
    data: [
      { value: "ARMADO", label: "Armado", title: "Material Armado" },
      { value: "SUELTO", label: "Suelto", title: "Material Suelto" },
      { value: "MIXTO", label: "Mixto", title: "Material Mixto" },
    ],
    valueField: "value",
    labelField: "label",
    searchFields: ["value", "label"],
    displayTemplate: "{label}",
    filters: {},
    dependsOn: null,
    required: false,
  },

  // Estados generales
  estados: {
    data: [
      { value: "pendiente", label: "Pendiente", title: "Estado Pendiente" },
      { value: "en_proceso", label: "En Proceso", title: "Estado En Proceso" },
      { value: "completado", label: "Completado", title: "Estado Completado" },
      { value: "cancelado", label: "Cancelado", title: "Estado Cancelado" },
    ],
    valueField: "value",
    labelField: "label",
    searchFields: ["value", "label"],
    displayTemplate: "{label}",
    filters: {},
    dependsOn: null,
    required: false,
  },

  // Clasificaciones de materiales
  clasificaciones: {
    data: [
      {
        value: "MATERIA_PRIMA",
        label: "Materia Prima",
        title: "Materia Prima",
      },
      { value: "INSUMO", label: "Insumo", title: "Insumo" },
      {
        value: "PRODUCTO_TERMINADO",
        label: "Producto Terminado",
        title: "Producto Terminado",
      },
      { value: "EMPAQUE", label: "Empaque", title: "Material de Empaque" },
      { value: "HERRAMIENTA", label: "Herramienta", title: "Herramienta" },
      { value: "QUIMICO", label: "Químico", title: "Producto Químico" },
    ],
    valueField: "value",
    labelField: "label",
    searchFields: ["value", "label"],
    displayTemplate: "{label}",
    filters: {},
    dependsOn: null,
    required: false,
  },
};

/**
 * Función para obtener configuración de campo anidado
 * @param {string} formulario - Nombre del formulario
 * @param {string} campo - Nombre del campo
 * @returns {object|null} Configuración del campo
 */
function obtenerConfiguracionCampo(formulario, campo) {
  const formularioUpper = formulario.toUpperCase();

  // Buscar en campos del formulario específico
  if (
    CAMPOS_ANIDADOS[formularioUpper] &&
    CAMPOS_ANIDADOS[formularioUpper][campo]
  ) {
    return CAMPOS_ANIDADOS[formularioUpper][campo];
  }

  // Buscar en campos especiales
  if (CAMPOS_ESPECIALES[campo]) {
    return CAMPOS_ESPECIALES[campo];
  }

  return null;
}

/**
 * Función para obtener todos los campos de un formulario
 * @param {string} formulario - Nombre del formulario
 * @returns {object} Configuración de todos los campos del formulario
 */
function obtenerCamposFormulario(formulario) {
  const formularioUpper = formulario.toUpperCase();
  return CAMPOS_ANIDADOS[formularioUpper] || {};
}

/**
 * Función para validar dependencias de campos
 * @param {string} formulario - Nombre del formulario
 * @param {string} campo - Nombre del campo
 * @param {object} datos - Datos del formulario
 * @returns {boolean} True si las dependencias están satisfechas
 */
function validarDependencias(formulario, campo, datos) {
  const config = obtenerConfiguracionCampo(formulario, campo);
  if (!config || !config.dependsOn) {
    return true;
  }

  const dependencia = config.dependsOn;
  return (
    datos &&
    datos[dependencia] !== null &&
    datos[dependencia] !== undefined &&
    datos[dependencia] !== ""
  );
}

/**
 * Función para construir filtros dinámicos
 * @param {string} formulario - Nombre del formulario
 * @param {string} campo - Nombre del campo
 * @param {object} datos - Datos del formulario para filtros dinámicos
 * @returns {object} Filtros a aplicar
 */
function construirFiltros(formulario, campo, datos = {}) {
  const config = obtenerConfiguracionCampo(formulario, campo);
  if (!config) {
    return {};
  }

  let filtros = { ...config.filters };

  // Aplicar filtros basados en dependencias
  if (config.dependsOn && datos[config.dependsOn]) {
    const dependencia = config.dependsOn;
    const valorDependencia = datos[dependencia];

    // Filtros específicos por dependencia
    if (dependencia === "planta" && campo.includes("ubicacion")) {
      filtros.planta = valorDependencia;
    }
  }

  return filtros;
}

/**
 * Función para formatear display de opciones
 * @param {object} item - Item a formatear
 * @param {string} template - Template de display
 * @returns {string} String formateado
 */
function formatearDisplay(item, template) {
  if (!template || !item) {
    return item?.label || item?.nombre || item?.title || "";
  }

  let resultado = template;
  const campos = template.match(/\{([^}]+)\}/g);

  if (campos) {
    campos.forEach((campo) => {
      const nombreCampo = campo.replace(/[{}]/g, "");
      const valor = item[nombreCampo] || "";
      resultado = resultado.replace(campo, valor);
    });
  }

  return resultado;
}

module.exports = {
  CAMPOS_ANIDADOS,
  CAMPOS_ESPECIALES,
  obtenerConfiguracionCampo,
  obtenerCamposFormulario,
  validarDependencias,
  construirFiltros,
  formatearDisplay,
};
