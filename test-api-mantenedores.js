/**
 * Script para probar APIs de Mantenedores y capturar schemas de datos
 * Para generar documentación específica de mantenedores del sistema WMS
 */

const fs = require("fs");
const path = require("path");

// Configuración del servidor backend
const BASE_URL = "http://localhost:3001/api";
const LOGIN_CREDENTIALS = {
  usuario: "admin",
  password: "1234567",
};

// Variable para el token (se obtendrá dinámicamente)
let authToken = null;

/**
 * Obtiene un token válido mediante login
 */
async function obtenerToken() {
  try {
    console.log("🔐 Obteniendo token de autenticación...");

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(LOGIN_CREDENTIALS),
    });

    const data = await response.json();

    if (data.exito && data.datos && data.datos.token) {
      authToken = data.datos.token;
      console.log("✅ Token obtenido exitosamente");
      console.log(`👤 Usuario: ${data.datos.usuario.nombre_usuario}`);
      console.log(`🏢 Planta: ${data.datos.usuario.planta_asignada}`);
      return authToken;
    } else {
      throw new Error(
        `Login fallido: ${data.mensaje || "Credenciales inválidas"}`
      );
    }
  } catch (error) {
    throw new Error(`Error obteniendo token: ${error.message}`);
  }
}

// APIs de Mantenedores a probar
const APIS_MANTENEDORES_TO_TEST = [
  // Resumen general
  {
    module: "ResumenMantenedores",
    endpoint: "/mantenedores",
    method: "GET",
    description: "Resumen de todos los mantenedores del sistema",
  },

  // Plantas
  {
    module: "Plantas",
    endpoint: "/mantenedores/plantas",
    method: "GET",
    description: "Listado de todas las plantas del sistema",
  },

  // Materiales
  {
    module: "Materiales",
    endpoint: "/mantenedores/materiales",
    method: "GET",
    params: { activo: true },
    description: "Listado de materiales activos",
  },

  // Proveedores
  {
    module: "Proveedores",
    endpoint: "/mantenedores/proveedores",
    method: "GET",
    params: { activo: true },
    description: "Listado de proveedores activos",
  },

  // Ubicaciones
  {
    module: "Ubicaciones",
    endpoint: "/mantenedores/ubicaciones",
    method: "GET",
    params: { activo: true },
    description: "Listado de ubicaciones activas",
  },

  // Temporadas
  {
    module: "Temporadas",
    endpoint: "/mantenedores/temporadas",
    method: "GET",
    description: "Listado de todas las temporadas",
  },

  // Temporada Activa
  {
    module: "TemporadaActiva",
    endpoint: "/mantenedores/temporadas/activa",
    method: "GET",
    description: "Temporada actualmente activa",
  },

  // Tipos de Movimiento
  {
    module: "TiposMovimiento",
    endpoint: "/mantenedores/tipos-movimiento",
    method: "GET",
    params: { activo: true },
    description: "Tipos de movimiento de inventario",
  },

  // Unidades de Medida
  {
    module: "UnidadesMedida",
    endpoint: "/mantenedores/unidades-medida",
    method: "GET",
    description: "Unidades de medida disponibles",
  },

  // Tipos de Tarja
  {
    module: "TiposTarja",
    endpoint: "/mantenedores/tipos-tarja",
    method: "GET",
    description: "Tipos de tarja únicos del sistema",
  },

  // Tipos de Operación
  {
    module: "TiposOperacion",
    endpoint: "/mantenedores/tipos-operacion",
    method: "GET",
    description: "Tipos de operación únicos",
  },

  // Turnos
  {
    module: "Turnos",
    endpoint: "/mantenedores/turnos",
    method: "GET",
    description: "Turnos de trabajo disponibles",
  },

  // Bodegas
  {
    module: "Bodegas",
    endpoint: "/mantenedores/bodegas",
    method: "GET",
    description: "Bodegas únicas del sistema",
  },

  // Estados de Tarja
  {
    module: "EstadosTarja",
    endpoint: "/mantenedores/estados-tarja",
    method: "GET",
    description: "Estados posibles de las tarjas",
  },

  // Certificaciones CAA
  {
    module: "CertificacionesCAA",
    endpoint: "/mantenedores/certificaciones-caa",
    method: "GET",
    description: "Certificaciones CAA predefinidas",
  },

  // Prioridades
  {
    module: "Prioridades",
    endpoint: "/mantenedores/prioridades",
    method: "GET",
    description: "Prioridades predefinidas del sistema",
  },
];

/**
 * Analiza un objeto y extrae su schema con información detallada
 */
function analyzeSchema(obj, depth = 0) {
  if (depth > 4) return "..."; // Evitar recursión infinita

  if (obj === null) return "null";
  if (obj === undefined) return "undefined";

  const type = typeof obj;

  if (type === "object") {
    if (Array.isArray(obj)) {
      if (obj.length === 0) return "Array[]";
      return `Array[${analyzeSchema(obj[0], depth + 1)}]`;
    }

    const schema = {};
    for (const [key, value] of Object.entries(obj)) {
      schema[key] = analyzeSchema(value, depth + 1);
    }
    return schema;
  }

  if (type === "string") {
    // Detectar tipos de fecha
    if (obj.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
      return "DateTime (ISO)";
    }
    if (obj.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return "Date (YYYY-MM-DD)";
    }
    // Detectar códigos
    if (obj.match(/^[A-Z0-9]{2,10}$/)) {
      return "String (Código)";
    }
    return "String";
  }

  if (type === "number") {
    return Number.isInteger(obj) ? "Integer" : "Float";
  }

  if (type === "boolean") {
    return "Boolean";
  }

  return type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Prueba una API específica de mantenedores
 */
async function testMantenedorAPI(apiConfig) {
  try {
    console.log(`\n🔍 Probando ${apiConfig.module} - ${apiConfig.endpoint}`);
    console.log(`   📝 ${apiConfig.description}`);

    // Construir URL con parámetros
    const url = new URL(`${BASE_URL}${apiConfig.endpoint}`);
    if (apiConfig.params) {
      Object.keys(apiConfig.params).forEach((key) => {
        url.searchParams.append(key, apiConfig.params[key]);
      });
    }

    const headers = {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(url.toString(), {
      method: apiConfig.method,
      headers,
    });

    const responseData = await response.json();

    if (responseData && responseData.exito) {
      const data = responseData.datos;

      let sampleData = data;
      let totalRecords = 1;

      if (Array.isArray(data)) {
        totalRecords = data.length;
        sampleData = data.length > 0 ? data[0] : {};
      }

      const schema = analyzeSchema(sampleData);

      console.log(`   ✅ ${totalRecords} registros encontrados`);

      return {
        module: apiConfig.module,
        endpoint: apiConfig.endpoint,
        description: apiConfig.description,
        success: true,
        totalRecords: totalRecords,
        isArray: Array.isArray(data),
        schema: schema,
        sampleData: sampleData,
        fullData: Array.isArray(data) ? data.slice(0, 3) : data, // Primeros 3 registros
      };
    } else {
      throw new Error(
        `Respuesta sin datos válidos: ${JSON.stringify(responseData)}`
      );
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return {
      module: apiConfig.module,
      endpoint: apiConfig.endpoint,
      description: apiConfig.description,
      success: false,
      error: error.message,
      status: error.status || "NETWORK_ERROR",
    };
  }
}

/**
 * Extrae campos únicos para filtros
 */
function extractFilterFields(obj, prefix = "") {
  const fields = [];

  if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
    for (const [key, value] of Object.entries(obj)) {
      const fieldName = prefix ? `${prefix}.${key}` : key;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        fields.push(...extractFilterFields(value, fieldName));
      } else {
        let fieldType = value;
        let filterSuggestions = [];

        // Sugerir tipos de filtros basados en el tipo de campo
        if (fieldType === "String") {
          filterSuggestions = ["texto", "contiene", "igual"];
        } else if (fieldType === "String (Código)") {
          filterSuggestions = ["código exacto", "lista de códigos"];
        } else if (fieldType.includes("Date")) {
          filterSuggestions = ["rango de fechas", "mayor que", "menor que"];
        } else if (fieldType === "Integer" || fieldType === "Float") {
          filterSuggestions = [
            "rango numérico",
            "mayor que",
            "menor que",
            "igual",
          ];
        } else if (fieldType === "Boolean") {
          filterSuggestions = ["verdadero/falso"];
        }

        fields.push({
          name: fieldName,
          type: fieldType,
          filterSuggestions: filterSuggestions,
        });
      }
    }
  }

  return fields;
}

/**
 * Genera documentación completa en markdown para mantenedores
 */
function generateMantenedoresMarkdownDoc(results) {
  let markdown = `# Schema de APIs de Mantenedores - WMS Ranco Cherries\n\n`;
  markdown += `*Documentación generada automáticamente el ${new Date().toLocaleString(
    "es-ES"
  )}*\n\n`;

  markdown += `## Resumen Ejecutivo\n\n`;
  markdown += `Este documento contiene los schemas completos de todas las APIs de mantenedores del sistema WMS.\n`;
  markdown += `Los mantenedores son datos maestros fundamentales que alimentan todo el sistema operativo.\n\n`;

  // Estadísticas generales
  const successfulAPIs = results.filter((r) => r.success);
  const failedAPIs = results.filter((r) => !r.success);

  markdown += `### Estadísticas\n\n`;
  markdown += `- **Total de APIs probadas:** ${results.length}\n`;
  markdown += `- **APIs exitosas:** ${successfulAPIs.length}\n`;
  markdown += `- **APIs con errores:** ${failedAPIs.length}\n\n`;

  // Tabla de contenidos
  markdown += `## Tabla de Contenidos\n\n`;
  successfulAPIs.forEach((result, index) => {
    markdown += `${index + 1}. [${result.module}](#${result.module
      .toLowerCase()
      .replace(/\s/g, "-")})\n`;
  });
  markdown += `\n`;

  // Documentación detallada de cada API
  successfulAPIs.forEach((result) => {
    markdown += `## ${result.module}\n\n`;
    markdown += `**Descripción:** ${result.description}\n\n`;
    markdown += `**Endpoint:** \`${result.endpoint}\`\n\n`;
    markdown += `**Tipo de datos:** ${
      result.isArray ? "Array" : "Objeto único"
    }\n\n`;
    markdown += `**Total de registros:** ${result.totalRecords}\n\n`;

    // Schema de datos
    markdown += `### 📋 Schema de Datos\n\n`;
    markdown += `\`\`\`json\n${JSON.stringify(
      result.schema,
      null,
      2
    )}\n\`\`\`\n\n`;

    // Campos para filtros
    const fields = extractFilterFields(result.schema);
    if (fields.length > 0) {
      markdown += `### 🔍 Campos Disponibles para Filtros\n\n`;
      markdown += `| Campo | Tipo | Filtros Sugeridos |\n`;
      markdown += `|-------|------|------------------|\n`;

      fields.forEach((field) => {
        markdown += `| \`${field.name}\` | ${
          field.type
        } | ${field.filterSuggestions.join(", ")} |\n`;
      });
      markdown += `\n`;
    }

    // Datos de ejemplo
    markdown += `### 📄 Datos de Ejemplo\n\n`;
    markdown += `\`\`\`json\n${JSON.stringify(
      result.fullData,
      null,
      2
    )}\n\`\`\`\n\n`;

    // Casos de uso sugeridos
    markdown += `### 💡 Casos de Uso Sugeridos\n\n`;

    const moduleName = result.module.toLowerCase();
    if (moduleName.includes("material")) {
      markdown += `- Selector de materiales para recepciones\n`;
      markdown += `- Filtros de materiales por tipo o estado\n`;
      markdown += `- Búsqueda de materiales por código\n`;
    } else if (moduleName.includes("proveedor")) {
      markdown += `- Selector de proveedores en formularios\n`;
      markdown += `- Filtros por estado activo/inactivo\n`;
      markdown += `- Búsqueda por código de proveedor\n`;
    } else if (moduleName.includes("ubicac")) {
      markdown += `- Selector de ubicaciones por planta\n`;
      markdown += `- Mapas de ubicaciones disponibles\n`;
      markdown += `- Filtros de capacidad y disponibilidad\n`;
    } else if (moduleName.includes("temporada")) {
      markdown += `- Selector de temporada en reportes\n`;
      markdown += `- Configuración de temporada activa\n`;
      markdown += `- Filtros históricos por temporada\n`;
    } else {
      markdown += `- Selección en formularios dropdown\n`;
      markdown += `- Filtros de búsqueda avanzada\n`;
      markdown += `- Validación de datos de entrada\n`;
    }

    markdown += `\n---\n\n`;
  });

  // Sección de errores si las hay
  if (failedAPIs.length > 0) {
    markdown += `## ❌ APIs con Errores\n\n`;
    failedAPIs.forEach((result) => {
      markdown += `### ${result.module}\n\n`;
      markdown += `**Endpoint:** \`${result.endpoint}\`\n\n`;
      markdown += `**Error:** ${result.error}\n\n`;
      markdown += `**Status:** ${result.status}\n\n`;
    });
    markdown += `\n`;
  }

  // Guía de implementación
  markdown += `## 🛠️ Guía de Implementación Frontend\n\n`;
  markdown += `### Patrón de Uso Recomendado\n\n`;
  markdown += `\`\`\`javascript\n`;
  markdown += `// Ejemplo de uso en composable\n`;
  markdown += `import { ref, onMounted } from 'vue'\n`;
  markdown += `import { useMantenedores } from '@/composables/useMantenedores'\n\n`;
  markdown += `export function useMantenedor(tipo) {\n`;
  markdown += `  const { obtenerMantenedor } = useMantenedores()\n`;
  markdown += `  const datos = ref([])\n`;
  markdown += `  const cargando = ref(false)\n\n`;
  markdown += `  const cargar = async () => {\n`;
  markdown += `    cargando.value = true\n`;
  markdown += `    try {\n`;
  markdown += `      datos.value = await obtenerMantenedor(tipo)\n`;
  markdown += `    } catch (error) {\n`;
  markdown += `      console.error('Error cargando mantenedor:', error)\n`;
  markdown += `    } finally {\n`;
  markdown += `      cargando.value = false\n`;
  markdown += `    }\n`;
  markdown += `  }\n\n`;
  markdown += `  onMounted(cargar)\n\n`;
  markdown += `  return {\n`;
  markdown += `    datos,\n`;
  markdown += `    cargando,\n`;
  markdown += `    cargar\n`;
  markdown += `  }\n`;
  markdown += `}\n`;
  markdown += `\`\`\`\n\n`;

  return markdown;
}

/**
 * Función principal
 */
async function main() {
  console.log("🚀 Iniciando pruebas de APIs de Mantenedores...\n");
  console.log("📋 Se probarán todas las APIs de datos maestros del sistema\n");

  try {
    // Obtener token de autenticación
    await obtenerToken();
    console.log("");

    const results = [];

    // Probar todas las APIs de mantenedores
    for (const apiConfig of APIS_MANTENEDORES_TO_TEST) {
      const result = await testMantenedorAPI(apiConfig);
      results.push(result);

      // Pequeña pausa entre requests para no sobrecargar el servidor
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // Generar documentación específica de mantenedores
    const markdown = generateMantenedoresMarkdownDoc(results);
    const outputPath = path.join(
      __dirname,
      "SCHEMA_MANTENEDORES_DOCUMENTATION.md"
    );

    fs.writeFileSync(outputPath, markdown, "utf8");

    console.log("\n✅ Documentación de Mantenedores generada exitosamente!");
    console.log(`📁 Archivo: ${outputPath}`);

    // Mostrar resumen detallado
    console.log("\n📊 Resumen de pruebas de Mantenedores:");
    console.log("=".repeat(60));

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    console.log(`✅ APIs exitosas: ${successful.length}/${results.length}`);
    console.log(`❌ APIs con errores: ${failed.length}/${results.length}`);

    if (successful.length > 0) {
      console.log("\n🎯 Mantenedores disponibles:");
      successful.forEach((result) => {
        console.log(`   ✅ ${result.module}: ${result.totalRecords} registros`);
      });
    }

    if (failed.length > 0) {
      console.log("\n⚠️  Mantenedores con problemas:");
      failed.forEach((result) => {
        console.log(`   ❌ ${result.module}: ${result.error}`);
      });
    }

    console.log("\n🎉 ¡Documentación completa lista para usar en el frontend!");
  } catch (error) {
    console.error("❌ Error durante la ejecución:", error.message);
    process.exit(1);
  }
}

// Ejecutar script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testMantenedorAPI,
  analyzeSchema,
  generateMantenedoresMarkdownDoc,
  APIS_MANTENEDORES_TO_TEST,
};
