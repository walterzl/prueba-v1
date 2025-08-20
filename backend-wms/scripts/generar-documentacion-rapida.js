/**
 * Script simplificado para generar SOLO documentación de APIs
 * Versión ligera que se enfoca únicamente en la documentación
 */

const axios = require("axios");
const fs = require("fs");

// Configuración
const BASE_URL = "http://localhost:3001";
const API_BASE = `${BASE_URL}/api/campos-anidados`;

// Credenciales de usuario admin
const CREDENCIALES_ADMIN = {
  usuario: "admin",
  password: "1234567",
};

let TOKEN_AUTENTICACION = null;
let DOCUMENTACION_GENERADA = {
  fecha: new Date().toISOString(),
  usuario: "admin",
  apis: {},
  schemas: {},
  ejemplos: {},
  estadisticas: {},
};

/**
 * Función para autenticarse
 */
async function autenticarUsuario() {
  console.log("🔐 Autenticando usuario admin...");

  try {
    const respuesta = await axios.post(
      `${BASE_URL}/api/auth/login`,
      CREDENCIALES_ADMIN
    );

    if (respuesta.data && respuesta.data.datos && respuesta.data.datos.token) {
      TOKEN_AUTENTICACION = respuesta.data.datos.token;
      console.log("✅ Autenticación exitosa");
      return true;
    } else {
      console.log("❌ Error: No se recibió token de autenticación");
      return false;
    }
  } catch (error) {
    console.log(
      "❌ Error de autenticación:",
      error.response?.data?.mensaje || error.message
    );
    return false;
  }
}

/**
 * Función simplificada para documentar APIs clave
 */
async function documentarAPIsPrincipales() {
  console.log("📚 Documentando APIs principales...");

  const formularios = [
    "INVENTARIO",
    "TRAZABILIDAD",
    "RECEPCIONES_LOTES",
    "OPERACIONES_FRIO_DESPACHO",
    "STOCK_UBICACIONES",
    "TARJAS",
  ];

  const campos = ["materiales", "proveedores", "ubicaciones", "plantas"];

  for (const formulario of formularios) {
    console.log(`📋 Documentando ${formulario}...`);

    // Configuración del formulario
    await hacerRequestDocumentacion("GET", `/${formulario}/configuracion`);

    // Documentar algunos campos principales
    for (const campo of campos.slice(0, 2)) {
      // Solo 2 campos por formulario para ser rápido
      try {
        await hacerRequestDocumentacion(
          "GET",
          `/${formulario}/${campo}/opciones?limite=3`
        );
        await hacerRequestDocumentacion(
          "GET",
          `/${formulario}/${campo}/opciones-paginadas?pagina=1&tamanoPagina=3`
        );
      } catch (error) {
        // Ignorar errores de campos que no existen en ciertos formularios
      }
    }
  }

  // Documentar algunas APIs especiales
  await hacerRequestDocumentacion(
    "GET",
    "/INVENTARIO/buscar-multiples?campos=materiales,plantas&limite=2"
  );
  await hacerRequestDocumentacion("GET", "/INVENTARIO/materiales/validar/1");

  console.log("✅ Documentación de APIs completada");
}

/**
 * Función para hacer requests solo para documentación
 */
async function hacerRequestDocumentacion(metodo, url) {
  const tiempoInicio = Date.now();
  const parametros = extraerParametrosDeURL(url);

  try {
    const config = {
      method: metodo,
      url: `${API_BASE}${url}`,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${TOKEN_AUTENTICACION}`,
      },
    };

    const respuesta = await axios(config);
    const resultado = {
      exito: true,
      datos: respuesta.data,
      status: respuesta.status,
      tiempo: Date.now() - tiempoInicio,
    };

    documentarRespuestaAPI(
      url.split("?")[0],
      metodo,
      parametros,
      resultado,
      resultado.tiempo
    );
    return resultado;
  } catch (error) {
    const resultado = {
      exito: false,
      error:
        error.response?.data?.mensaje || error.response?.data || error.message,
      status: error.response?.status || 500,
      tiempo: Date.now() - tiempoInicio,
    };

    documentarRespuestaAPI(
      url.split("?")[0],
      metodo,
      parametros,
      resultado,
      resultado.tiempo
    );
    return resultado;
  }
}

// Incluir las funciones de documentación del script principal
function documentarRespuestaAPI(
  endpoint,
  metodo,
  parametros,
  respuesta,
  tiempo
) {
  const clave = `${metodo} ${endpoint}`;

  if (!DOCUMENTACION_GENERADA.apis[clave]) {
    DOCUMENTACION_GENERADA.apis[clave] = {
      endpoint,
      metodo,
      descripcion: "",
      parametros: {},
      respuestas: {},
      ejemplos: [],
      estadisticas: {
        totalLlamadas: 0,
        exitosas: 0,
        fallidas: 0,
        tiempoPromedio: 0,
      },
    };
  }

  const api = DOCUMENTACION_GENERADA.apis[clave];
  api.estadisticas.totalLlamadas++;

  if (respuesta.exito) {
    api.estadisticas.exitosas++;

    if (respuesta.datos && respuesta.datos.datos) {
      const schema = analizarEstructura(respuesta.datos.datos, clave);
      api.respuestas.exitosa = {
        status: respuesta.status,
        estructura: schema,
        ejemplo: respuesta.datos,
      };
    }
  } else {
    api.estadisticas.fallidas++;
    api.respuestas.error = {
      status: respuesta.status,
      mensaje: respuesta.error,
      ejemplo: respuesta,
    };
  }

  if (parametros) {
    Object.keys(parametros).forEach((param) => {
      api.parametros[param] = {
        tipo: typeof parametros[param],
        ejemplo: parametros[param],
        descripcion: inferirDescripcionParametro(param),
      };
    });
  }

  return api;
}

function analizarEstructura(datos, contexto = "") {
  if (Array.isArray(datos)) {
    if (datos.length > 0) {
      return {
        tipo: "array",
        elementos: analizarEstructura(datos[0], contexto),
        cantidad: datos.length,
      };
    }
    return { tipo: "array", elementos: null, cantidad: 0 };
  }

  if (typeof datos === "object" && datos !== null) {
    const estructura = {
      tipo: "object",
      propiedades: {},
    };

    Object.keys(datos).forEach((clave) => {
      estructura.propiedades[clave] = {
        tipo: typeof datos[clave],
        ejemplo: datos[clave],
        obligatorio: datos[clave] !== null && datos[clave] !== undefined,
      };

      if (typeof datos[clave] === "object" && datos[clave] !== null) {
        estructura.propiedades[clave].estructura = analizarEstructura(
          datos[clave],
          `${contexto}.${clave}`
        );
      }
    });

    return estructura;
  }

  return {
    tipo: typeof datos,
    ejemplo: datos,
  };
}

function inferirDescripcionParametro(param) {
  const descripciones = {
    limite: "Número máximo de resultados a retornar",
    busqueda: "Término de búsqueda para filtrar resultados",
    pagina: "Número de página para paginación",
    tamanoPagina: "Cantidad de elementos por página",
    campos: "Lista de campos separados por coma",
    filtros: "Filtros adicionales en formato JSON",
    ordenarPor: "Campo por el cual ordenar los resultados",
    direccion: "Dirección de ordenamiento (asc/desc)",
  };

  return descripciones[param] || `Parámetro ${param}`;
}

function extraerParametrosDeURL(url) {
  const parametros = {};
  const [, queryString] = url.split("?");

  if (queryString) {
    queryString.split("&").forEach((param) => {
      const [clave, valor] = param.split("=");
      parametros[decodeURIComponent(clave)] = decodeURIComponent(valor || "");
    });
  }

  return parametros;
}

function generarDocumentacionSchemas() {
  console.log("\n📚 Generando schemas de documentación...");

  const schemas = {};

  Object.keys(DOCUMENTACION_GENERADA.apis).forEach((clave) => {
    const api = DOCUMENTACION_GENERADA.apis[clave];

    if (api.respuestas.exitosa && api.respuestas.exitosa.estructura) {
      schemas[clave] = {
        descripcion: generarDescripcionAPI(clave),
        request: {
          metodo: api.metodo,
          endpoint: api.endpoint,
          parametros: api.parametros,
          headers: {
            Authorization: "Bearer {token}",
            "Content-Type": "application/json",
          },
        },
        response: {
          exitosa: api.respuestas.exitosa,
          error: api.respuestas.error || {
            status: 500,
            estructura: {
              tipo: "object",
              propiedades: {
                exito: { tipo: "boolean", ejemplo: false },
                mensaje: { tipo: "string", ejemplo: "Error message" },
                codigo: { tipo: "string", ejemplo: "ERROR_CODE" },
              },
            },
          },
        },
        ejemplos: generarEjemplosDeUso(clave, api),
      };
    }
  });

  DOCUMENTACION_GENERADA.schemas = schemas;
  return schemas;
}

function generarDescripcionAPI(clave) {
  const descripciones = {
    "/INVENTARIO/configuracion":
      "Obtiene la configuración completa de campos para formularios de inventario",
    "/INVENTARIO/materiales/opciones":
      "Obtiene opciones disponibles para el campo materiales en inventario",
    "/INVENTARIO/materiales/opciones-paginadas":
      "Obtiene opciones paginadas para el campo materiales en inventario",
    "/TRAZABILIDAD/configuracion":
      "Obtiene la configuración completa de campos para formularios de trazabilidad",
    "/TRAZABILIDAD/proveedores/opciones":
      "Obtiene opciones disponibles para el campo proveedores en trazabilidad",
    "/RECEPCIONES_LOTES/configuracion":
      "Obtiene la configuración completa de campos para formularios de recepciones de lotes",
  };

  const endpoint = clave.split(" ")[1];
  return descripciones[endpoint] || `API para ${endpoint}`;
}

function generarEjemplosDeUso(clave, api) {
  const ejemplos = [];
  const [metodo, endpoint] = clave.split(" ");

  ejemplos.push({
    titulo: "Uso básico",
    descripcion: `Llamada básica a ${endpoint}`,
    codigo: generarCodigoEjemplo(metodo, endpoint, {}),
    respuesta: api.respuestas.exitosa?.ejemplo,
  });

  if (Object.keys(api.parametros).length > 0) {
    ejemplos.push({
      titulo: "Con parámetros",
      descripcion: `Llamada a ${endpoint} con parámetros`,
      codigo: generarCodigoEjemplo(metodo, endpoint, api.parametros),
      respuesta: api.respuestas.exitosa?.ejemplo,
    });
  }

  return ejemplos;
}

function generarCodigoEjemplo(metodo, endpoint, parametros) {
  const params = Object.keys(parametros)
    .map((key) => `${key}=${parametros[key].ejemplo}`)
    .join("&");

  const url = params ? `${endpoint}?${params}` : endpoint;

  return `
// JavaScript/Axios
const respuesta = await axios({
  method: '${metodo}',
  url: '${BASE_URL}/api/campos-anidados${url}',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X ${metodo} \\
  -H "Authorization: Bearer {token}" \\
  "${BASE_URL}/api/campos-anidados${url}"
  `.trim();
}

function generarArchivoDocumentacion() {
  console.log("\n📄 Generando archivo de documentación...");

  const fecha = new Date().toLocaleDateString("es-CL");
  const hora = new Date().toLocaleTimeString("es-CL");

  let markdown = `# Documentación APIs de Campos Anidados - Resumen

*Generado automáticamente el ${fecha} a las ${hora}*

## Resumen Ejecutivo

Esta documentación proporciona un resumen conciso de las APIs principales del sistema de campos anidados del WMS Ranco Cherries.

### Estadísticas

- **APIs documentadas**: ${Object.keys(DOCUMENTACION_GENERADA.apis).length}
- **Llamadas realizadas**: ${Object.values(DOCUMENTACION_GENERADA.apis).reduce(
    (sum, api) => sum + api.estadisticas.totalLlamadas,
    0
  )}
- **Tasa de éxito**: ${calcularTasaExitoGeneral()}%

## Autenticación Requerida

\`\`\`javascript
POST /api/auth/login
{
  "usuario": "admin",
  "password": "1234567"
}
\`\`\`

## APIs Principales Documentadas

`;

  // Documentar solo las APIs más importantes
  const apisImportantes = Object.keys(DOCUMENTACION_GENERADA.schemas)
    .filter(
      (clave) =>
        clave.includes("/configuracion") ||
        clave.includes("/opciones") ||
        clave.includes("/validar")
    )
    .slice(0, 10); // Limitar a 10 APIs principales

  apisImportantes.forEach((clave) => {
    const schema = DOCUMENTACION_GENERADA.schemas[clave];
    const [metodo, endpoint] = clave.split(" ");

    markdown += `
### ${metodo} ${endpoint}

${schema.descripcion}

**Ejemplo:**
\`\`\`javascript
${
  schema.ejemplos[0]?.codigo?.split("\\n").slice(0, 6).join("\\n") ||
  "No disponible"
}
\`\`\`

---

`;
  });

  markdown += `
## Formularios Disponibles

- **INVENTARIO**: Gestión de inventario
- **TRAZABILIDAD**: Seguimiento de productos  
- **RECEPCIONES_LOTES**: Recepción de lotes
- **OPERACIONES_FRIO_DESPACHO**: Operaciones de frío y despacho
- **STOCK_UBICACIONES**: Control de stock por ubicación
- **TARJAS**: Gestión de tarjas

---

*Para documentación completa, ejecutar: \`node scripts/test-campos-anidados.js\`*
`;

  const nombreArchivo = `RESUMEN_APIS_CAMPOS_ANIDADOS_${
    new Date().toISOString().split("T")[0]
  }.md`;
  const rutaArchivo = `c:\\Users\\Walter Ranco\\Desktop\\WMS\\prueba-v1\\${nombreArchivo}`;

  fs.writeFileSync(rutaArchivo, markdown, "utf8");

  console.log(`✅ Resumen de documentación guardado en: ${nombreArchivo}`);
  return nombreArchivo;
}

function calcularTasaExitoGeneral() {
  const stats = Object.values(DOCUMENTACION_GENERADA.apis).reduce(
    (acc, api) => {
      acc.total += api.estadisticas.totalLlamadas;
      acc.exitosas += api.estadisticas.exitosas;
      return acc;
    },
    { total: 0, exitosas: 0 }
  );

  return stats.total > 0
    ? ((stats.exitosas / stats.total) * 100).toFixed(1)
    : 0;
}

// Ejecutar documentación rápida
if (require.main === module) {
  autenticarUsuario()
    .then((autenticado) => {
      if (!autenticado) {
        console.log("\n❌ No se pudo autenticar. Terminando.");
        process.exit(1);
      }
      return documentarAPIsPrincipales();
    })
    .then(() => {
      generarDocumentacionSchemas();
      const archivo = generarArchivoDocumentacion();

      console.log("\n" + "=".repeat(50));
      console.log("📊 DOCUMENTACIÓN RÁPIDA COMPLETADA");
      console.log("=".repeat(50));
      console.log(`📄 Archivo: ${archivo}`);
      console.log(
        `📋 APIs: ${Object.keys(DOCUMENTACION_GENERADA.apis).length}`
      );
      console.log(`🎯 Éxito: ${calcularTasaExitoGeneral()}%`);
      console.log(
        "\n💡 Para documentación completa usar: node scripts/test-campos-anidados.js"
      );

      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Error:", error);
      process.exit(1);
    });
}

module.exports = {
  documentarAPIsPrincipales,
  generarDocumentacionSchemas,
  generarArchivoDocumentacion,
  DOCUMENTACION_GENERADA,
};
