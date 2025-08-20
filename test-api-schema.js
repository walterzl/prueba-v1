/**
 * Script para probar APIs y capturar schemas de datos
 * Para generar documentación de filtros correctos
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

// APIs a probar por módulo
const APIS_TO_TEST = [
  // Módulo Inventario
  {
    module: "VistaInventario",
    endpoint: "/inventario",
    method: "GET",
    params: { limite: 5 },
  },

  // Módulo Trazabilidad
  {
    module: "VistaTrazabilidad",
    endpoint: "/trazabilidad",
    method: "GET",
    params: { limite: 5 },
  },

  // Módulo Recepción de Lotes
  {
    module: "VistaRecepcionLotes",
    endpoint: "/recepciones-lotes",
    method: "GET",
    params: { limite: 5 },
  },

  // Módulo Operaciones Frío y Despacho
  {
    module: "VistaOperacionesFrioDespacho",
    endpoint: "/operaciones-frio-despacho",
    method: "GET",
    params: { limite: 5 },
  },

  // Módulo Tarjas
  {
    module: "VistaTarjas",
    endpoint: "/tarjas",
    method: "GET",
    params: { limite: 5 },
  },
];

/**
 * Analiza un objeto y extrae su schema
 */
function analyzeSchema(obj, depth = 0) {
  if (depth > 3) return "..."; // Evitar recursión infinita

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
    return "String";
  }

  if (type === "number") {
    return Number.isInteger(obj) ? "Integer" : "Float";
  }

  return type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Prueba una API específica
 */
async function testAPI(apiConfig) {
  try {
    console.log(`\n🔍 Probando ${apiConfig.module} - ${apiConfig.endpoint}`);

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
      if (Array.isArray(data)) {
        sampleData = data.length > 0 ? data[0] : {};
      }

      const schema = analyzeSchema(sampleData);

      return {
        module: apiConfig.module,
        endpoint: apiConfig.endpoint,
        success: true,
        totalRecords: Array.isArray(data) ? data.length : 1,
        schema: schema,
        sampleData: sampleData,
      };
    } else {
      throw new Error(
        `Respuesta sin datos válidos: ${JSON.stringify(responseData)}`
      );
    }
  } catch (error) {
    return {
      module: apiConfig.module,
      endpoint: apiConfig.endpoint,
      success: false,
      error: error.message,
      status: error.status || "NETWORK_ERROR",
    };
  }
}

/**
 * Genera documentación en markdown
 */
function generateMarkdownDoc(results) {
  let markdown = `# Schema de APIs - WMS Ranco Cherries\n\n`;
  markdown += `*Documentación generada automáticamente el ${new Date().toLocaleString(
    "es-ES"
  )}*\n\n`;
  markdown += `## Resumen\n\n`;
  markdown += `Este documento contiene los schemas reales de datos devueltos por cada API del sistema WMS para crear filtros precisos en el frontend.\n\n`;

  results.forEach((result) => {
    markdown += `## ${result.module}\n\n`;
    markdown += `**Endpoint:** \`${result.endpoint}\`\n\n`;

    if (!result.success) {
      markdown += `❌ **Error:** ${result.error}\n\n`;
      if (result.status) {
        markdown += `**Status:** ${result.status}\n\n`;
      }
      return;
    }

    markdown += `✅ **Status:** Exitoso\n\n`;
    markdown += `**Total de registros:** ${result.totalRecords}\n\n`;

    markdown += `### Schema de Datos\n\n`;
    markdown += `\`\`\`json\n${JSON.stringify(
      result.schema,
      null,
      2
    )}\n\`\`\`\n\n`;

    markdown += `### Datos de Ejemplo\n\n`;
    markdown += `\`\`\`json\n${JSON.stringify(
      result.sampleData,
      null,
      2
    )}\n\`\`\`\n\n`;

    // Generar lista de campos para filtros
    markdown += `### Campos Disponibles para Filtros\n\n`;

    function extractFields(obj, prefix = "") {
      const fields = [];

      if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
        for (const [key, value] of Object.entries(obj)) {
          const fieldName = prefix ? `${prefix}.${key}` : key;

          if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
          ) {
            fields.push(...extractFields(value, fieldName));
          } else {
            fields.push({
              name: fieldName,
              type: value,
            });
          }
        }
      }

      return fields;
    }

    const fields = extractFields(result.schema);

    fields.forEach((field) => {
      markdown += `- **${field.name}** (${field.type})\n`;
    });

    markdown += `\n---\n\n`;
  });

  return markdown;
}

/**
 * Función principal
 */
async function main() {
  console.log("🚀 Iniciando pruebas de APIs para capturar schemas...\n");

  try {
    // Obtener token de autenticación
    await obtenerToken();
    console.log("");

    const results = [];

    for (const apiConfig of APIS_TO_TEST) {
      const result = await testAPI(apiConfig);
      results.push(result);

      // Pequeña pausa entre requests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Generar documentación
    const markdown = generateMarkdownDoc(results);
    const outputPath = path.join(__dirname, "API_SCHEMAS_DOCUMENTATION.md");

    fs.writeFileSync(outputPath, markdown, "utf8");

    console.log("\n✅ Documentación generada exitosamente!");
    console.log(`📁 Archivo: ${outputPath}`);

    // Mostrar resumen
    console.log("\n📊 Resumen de pruebas:");
    results.forEach((result) => {
      const status = result.success ? "✅" : "❌";
      console.log(
        `${status} ${result.module}: ${result.success ? "OK" : result.error}`
      );
    });
  } catch (error) {
    console.error("❌ Error durante la ejecución:", error.message);
    process.exit(1);
  }
} // Ejecutar script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testAPI, analyzeSchema, generateMarkdownDoc };
