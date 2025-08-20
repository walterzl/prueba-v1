/**
 * Script de prueba y documentación para APIs de Campos Anidados
 * Prueba todas las funcionalidades de consultas dinámicas para formularios
 * y genera documentación automática de los schemas y uso de las APIs
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

// Variable global para almacenar el token
let TOKEN_AUTENTICACION = null;

// Variable para almacenar toda la documentación generada
let DOCUMENTACION_GENERADA = {
  fecha: new Date().toISOString(),
  usuario: "admin",
  apis: {},
  schemas: {},
  ejemplos: {},
  estadisticas: {},
};

// Datos de prueba
const FORMULARIOS_PRUEBA = [
  "INVENTARIO",
  "TRAZABILIDAD",
  "RECEPCIONES_LOTES",
  "OPERACIONES_FRIO_DESPACHO",
  "STOCK_UBICACIONES",
  "TARJAS",
];

const CAMPOS_PRUEBA = [
  "materiales",
  "proveedores",
  "ubicaciones",
  "plantas",
  "temporadas",
];

/**
 * Función para autenticarse y obtener token
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
 * Función para documentar una respuesta de API
 */
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

    // Documentar estructura de respuesta exitosa
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

  // Documentar parámetros
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

/**
 * Función para analizar estructura de datos
 */
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

/**
 * Función para inferir descripción de parámetros
 */
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

/**
 * Función para hacer request con manejo de errores
 */
async function hacerRequest(metodo, url, datos = null, documentar = true) {
  const tiempoInicio = Date.now();
  const parametros = extraerParametrosDeURL(url);

  try {
    const config = {
      method: metodo,
      url: `${API_BASE}${url}`,
      timeout: 10000,
      headers: {},
    };

    // Añadir token de autenticación si está disponible
    if (TOKEN_AUTENTICACION) {
      config.headers["Authorization"] = `Bearer ${TOKEN_AUTENTICACION}`;
    }

    if (datos) {
      config.data = datos;
    }

    const respuesta = await axios(config);
    const resultado = {
      exito: true,
      datos: respuesta.data,
      status: respuesta.status,
      tiempo: Date.now() - tiempoInicio,
    };

    // Documentar automáticamente
    if (documentar) {
      documentarRespuestaAPI(
        url.split("?")[0],
        metodo,
        parametros,
        resultado,
        resultado.tiempo
      );
    }

    return resultado;
  } catch (error) {
    const resultado = {
      exito: false,
      error:
        error.response?.data?.mensaje || error.response?.data || error.message,
      status: error.response?.status || 500,
      detalle: error.response?.data?.detalle || null,
      tiempo: Date.now() - tiempoInicio,
    };

    // Documentar errores también
    if (documentar) {
      documentarRespuestaAPI(
        url.split("?")[0],
        metodo,
        parametros,
        resultado,
        resultado.tiempo
      );
    }

    return resultado;
  }
}

/**
 * Función para extraer parámetros de URL
 */
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

/**
 * Prueba obtener configuración de formulario
 */
async function probarConfiguracionFormulario(formulario) {
  console.log(`\n📋 Probando configuración para formulario: ${formulario}`);

  const resultado = await hacerRequest("GET", `/${formulario}/configuracion`);

  if (resultado.exito) {
    console.log(`✅ Configuración obtenida exitosamente`);
    console.log(
      `   - Campos encontrados: ${
        Object.keys(resultado.datos.datos || {}).length
      }`
    );

    // Mostrar algunos campos
    const campos = Object.keys(resultado.datos.datos || {});
    if (campos.length > 0) {
      console.log(
        `   - Campos: ${campos.slice(0, 3).join(", ")}${
          campos.length > 3 ? "..." : ""
        }`
      );
    }
  } else {
    console.log(`❌ Error: ${resultado.error}`);
    if (resultado.detalle) {
      console.log(`   Detalle: ${resultado.detalle}`);
    }
    console.log(`   Status: ${resultado.status}`);
  }

  return resultado;
}

/**
 * Prueba obtener opciones de campo
 */
async function probarOpcionesCampo(formulario, campo) {
  console.log(`\n🔍 Probando opciones para ${formulario}/${campo}`);

  const resultado = await hacerRequest(
    "GET",
    `/${formulario}/${campo}/opciones?limite=5`
  );

  if (resultado.exito) {
    console.log(`✅ Opciones obtenidas exitosamente`);
    console.log(`   - Total opciones: ${resultado.datos.datos?.length || 0}`);

    // Mostrar algunas opciones
    const opciones = resultado.datos.datos || [];
    if (opciones.length > 0) {
      console.log(`   - Primeras opciones:`);
      opciones.slice(0, 2).forEach((opcion) => {
        console.log(`     * ${opcion.label} (${opcion.value})`);
      });
    }
  } else {
    console.log(`❌ Error: ${resultado.error}`);
    if (resultado.detalle) {
      console.log(`   Detalle: ${resultado.detalle}`);
    }
    console.log(`   Status: ${resultado.status}`);
  }

  return resultado;
}

/**
 * Prueba opciones con búsqueda
 */
async function probarOpcionesConBusqueda(formulario, campo, busqueda) {
  console.log(
    `\n🔎 Probando búsqueda en ${formulario}/${campo} con término: "${busqueda}"`
  );

  const resultado = await hacerRequest(
    "GET",
    `/${formulario}/${campo}/opciones?busqueda=${busqueda}&limite=3`
  );

  if (resultado.exito) {
    console.log(`✅ Búsqueda completada exitosamente`);
    console.log(
      `   - Resultados encontrados: ${resultado.datos.datos?.length || 0}`
    );

    const opciones = resultado.datos.datos || [];
    opciones.forEach((opcion) => {
      console.log(`     * ${opcion.label}`);
    });
  } else {
    console.log(`❌ Error: ${resultado.error.mensaje || resultado.error}`);
  }

  return resultado;
}

/**
 * Prueba opciones paginadas
 */
async function probarOpcionesPaginadas(formulario, campo) {
  console.log(`\n📄 Probando opciones paginadas para ${formulario}/${campo}`);

  const resultado = await hacerRequest(
    "GET",
    `/${formulario}/${campo}/opciones-paginadas?pagina=1&tamanoPagina=3`
  );

  if (resultado.exito) {
    console.log(`✅ Paginación funcionando correctamente`);
    console.log(
      `   - Página: ${resultado.datos.datos?.paginacion?.pagina || "N/A"}`
    );
    console.log(
      `   - Total: ${resultado.datos.datos?.paginacion?.total || "N/A"}`
    );
    console.log(
      `   - Hay más: ${resultado.datos.datos?.paginacion?.hayMas ? "Sí" : "No"}`
    );
  } else {
    console.log(`❌ Error: ${resultado.error.mensaje || resultado.error}`);
  }

  return resultado;
}

/**
 * Prueba búsqueda múltiple
 */
async function probarBusquedaMultiple(formulario, campos) {
  console.log(`\n🔍📊 Probando búsqueda múltiple en ${formulario}`);
  console.log(`   Campos: ${campos.join(", ")}`);

  const resultado = await hacerRequest(
    "GET",
    `/${formulario}/buscar-multiples?campos=${campos.join(",")}&limite=2`
  );

  if (resultado.exito) {
    console.log(`✅ Búsqueda múltiple completada`);
    const datos = resultado.datos.datos || {};

    Object.keys(datos).forEach((campo) => {
      const info = datos[campo];
      console.log(
        `   - ${campo}: ${info.opciones?.length || 0} opciones${
          info.error ? ` (Error: ${info.error})` : ""
        }`
      );
    });
  } else {
    console.log(`❌ Error: ${resultado.error.mensaje || resultado.error}`);
  }

  return resultado;
}

/**
 * Prueba validación de valor
 */
async function probarValidacionValor(formulario, campo, valor) {
  console.log(
    `\n✅ Probando validación de valor "${valor}" en ${formulario}/${campo}`
  );

  const resultado = await hacerRequest(
    "GET",
    `/${formulario}/${campo}/validar/${valor}`
  );

  if (resultado.exito) {
    const esValido = resultado.datos.datos?.valido;
    console.log(
      `${esValido ? "✅" : "❌"} Valor es ${esValido ? "válido" : "inválido"}`
    );

    if (esValido && resultado.datos.datos?.valor) {
      console.log(`   - Label: ${resultado.datos.datos.valor.label}`);
    }
  } else {
    console.log(`❌ Error: ${resultado.error.mensaje || resultado.error}`);
  }

  return resultado;
}

/**
 * Función principal de pruebas
 */
async function ejecutarPruebas() {
  console.log("🚀 Iniciando pruebas de APIs de Campos Anidados");
  console.log("=".repeat(50));
  console.log(`🔐 Usuario autenticado: ${CREDENCIALES_ADMIN.usuario}`);
  console.log(`🌐 API Base: ${API_BASE}`);
  console.log("=".repeat(50));

  let exitosas = 0;
  let fallidas = 0;

  // Probar algunos formularios y campos
  const pruebasBasicas = [
    ["INVENTARIO", "materiales"],
    ["TRAZABILIDAD", "proveedores"],
    ["RECEPCIONES_LOTES", "ubicaciones_destino"],
  ];

  for (const [formulario, campo] of pruebasBasicas) {
    // 1. Configuración del formulario
    const configResult = await probarConfiguracionFormulario(formulario);
    configResult.exito ? exitosas++ : fallidas++;

    // 2. Opciones básicas
    const opcionesResult = await probarOpcionesCampo(formulario, campo);
    opcionesResult.exito ? exitosas++ : fallidas++;

    // 3. Opciones con búsqueda
    const busquedaResult = await probarOpcionesConBusqueda(
      formulario,
      campo,
      "A"
    );
    busquedaResult.exito ? exitosas++ : fallidas++;

    // 4. Opciones paginadas
    const paginadasResult = await probarOpcionesPaginadas(formulario, campo);
    paginadasResult.exito ? exitosas++ : fallidas++;

    console.log("\n" + "-".repeat(30));
  }

  // Pruebas adicionales
  console.log("\n🔧 Pruebas adicionales");

  // Búsqueda múltiple
  const multipleResult = await probarBusquedaMultiple("INVENTARIO", [
    "materiales",
    "plantas",
  ]);
  multipleResult.exito ? exitosas++ : fallidas++;

  // Validación de valores (usando valores que probablemente existan)
  const validacionResult = await probarValidacionValor(
    "INVENTARIO",
    "materiales",
    "1"
  );
  validacionResult.exito ? exitosas++ : fallidas++;

  // Resumen final
  console.log("\n" + "=".repeat(50));
  console.log("📊 RESUMEN DE PRUEBAS");
  console.log("=".repeat(50));
  console.log(`✅ Pruebas exitosas: ${exitosas}`);
  console.log(`❌ Pruebas fallidas: ${fallidas}`);
  console.log(
    `📈 Tasa de éxito: ${((exitosas / (exitosas + fallidas)) * 100).toFixed(
      1
    )}%`
  );

  if (fallidas === 0) {
    console.log("\n🎉 ¡Todas las pruebas pasaron exitosamente!");
  } else {
    console.log("\n⚠️  Algunas pruebas fallaron. Revisar los logs arriba.");
  }
}

/**
 * Función para documentar APIs adicionales
 */
async function documentarAPIsAdicionales() {
  console.log("\n📚 Documentando APIs adicionales...");

  const apisAdicionales = [
    { formulario: "OPERACIONES_FRIO_DESPACHO", campo: "materiales" },
    { formulario: "STOCK_UBICACIONES", campo: "ubicaciones" },
    { formulario: "TARJAS", campo: "proveedores" },
  ];

  for (const { formulario, campo } of apisAdicionales) {
    console.log(`📋 Documentando ${formulario}/${campo}...`);

    // Configuración
    await hacerRequest("GET", `/${formulario}/configuracion`);

    // Opciones básicas
    await hacerRequest("GET", `/${formulario}/${campo}/opciones?limite=3`);

    // Con parámetros
    await hacerRequest(
      "GET",
      `/${formulario}/${campo}/opciones?limite=5&busqueda=test`
    );

    // Validación
    if (campo === "materiales") {
      await hacerRequest("GET", `/${formulario}/${campo}/validar/1`);
    }
  }

  console.log("✅ APIs adicionales documentadas");
}

/**
 * Función para probar configuración específica
 */
async function probarConfiguracionEspecifica() {
  console.log("\n🔧 Probando configuraciones específicas");

  // Probar campos especiales
  const camposEspeciales = [
    "unidades_medida",
    "certificaciones_caa",
    "condiciones_armado",
  ];

  for (const campo of camposEspeciales) {
    console.log(`\n📋 Probando campo especial: ${campo}`);
    const resultado = await hacerRequest(
      "GET",
      `/INVENTARIO/${campo}/opciones`
    );

    if (resultado.exito) {
      console.log(
        `✅ Campo especial funcionando: ${
          resultado.datos.datos?.length || 0
        } opciones`
      );
    } else {
      console.log(
        `❌ Error en campo especial: ${
          resultado.error.mensaje || resultado.error
        }`
      );
    }
  }
}

/**
 * Función para generar documentación de schemas
 */
function generarDocumentacionSchemas() {
  console.log("\n📚 Generando documentación de schemas...");

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

/**
 * Función para generar descripción de API
 */
function generarDescripcionAPI(clave) {
  const descripciones = {
    "/INVENTARIO/configuracion":
      "Obtiene la configuración completa de campos para formularios de inventario",
    "/INVENTARIO/materiales/opciones":
      "Obtiene opciones disponibles para el campo materiales en inventario",
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

/**
 * Función para generar ejemplos de uso
 */
function generarEjemplosDeUso(clave, api) {
  const ejemplos = [];
  const [metodo, endpoint] = clave.split(" ");

  // Ejemplo básico
  ejemplos.push({
    titulo: "Uso básico",
    descripcion: `Llamada básica a ${endpoint}`,
    codigo: generarCodigoEjemplo(metodo, endpoint, {}),
    respuesta: api.respuestas.exitosa?.ejemplo,
  });

  // Ejemplo con parámetros
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

/**
 * Función para generar código de ejemplo
 */
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

/**
 * Función para generar archivo de documentación
 */
function generarArchivoDocumentacion() {
  console.log("\n📄 Generando archivo de documentación...");

  const fecha = new Date().toLocaleDateString("es-CL");
  const hora = new Date().toLocaleTimeString("es-CL");

  let markdown = `# Documentación APIs de Campos Anidados

*Generado automáticamente el ${fecha} a las ${hora}*

## Resumen

Esta documentación describe las APIs disponibles para el sistema de campos anidados del WMS Ranco Cherries.

### Estadísticas Generales

- **Total de APIs documentadas**: ${
    Object.keys(DOCUMENTACION_GENERADA.apis).length
  }
- **Total de llamadas realizadas**: ${Object.values(
    DOCUMENTACION_GENERADA.apis
  ).reduce((sum, api) => sum + api.estadisticas.totalLlamadas, 0)}
- **Tasa de éxito general**: ${calcularTasaExitoGeneral()}%

## Autenticación

Todas las APIs requieren autenticación mediante Bearer Token:

\`\`\`
Authorization: Bearer {tu_token_jwt}
\`\`\`

Para obtener un token, utiliza la API de login:

\`\`\`javascript
POST /api/auth/login
{
  "usuario": "admin",
  "password": "1234567"
}
\`\`\`

## APIs Disponibles

`;

  // Documentar cada API
  Object.keys(DOCUMENTACION_GENERADA.schemas).forEach((clave) => {
    const schema = DOCUMENTACION_GENERADA.schemas[clave];
    const [metodo, endpoint] = clave.split(" ");

    markdown += `
### ${metodo} ${endpoint}

${schema.descripcion}

#### Parámetros

`;

    if (Object.keys(schema.request.parametros).length > 0) {
      markdown += `| Parámetro | Tipo | Descripción | Ejemplo |\n|-----------|------|-------------|----------|\n`;

      Object.keys(schema.request.parametros).forEach((param) => {
        const p = schema.request.parametros[param];
        markdown += `| ${param} | ${p.tipo} | ${p.descripcion} | ${p.ejemplo} |\n`;
      });
    } else {
      markdown += "Esta API no requiere parámetros.\n";
    }

    markdown += `
#### Respuesta Exitosa (${schema.response.exitosa.status})

\`\`\`json
${JSON.stringify(schema.response.exitosa.ejemplo, null, 2)}
\`\`\`

#### Estructura del Schema

${generarDocumentacionSchema(schema.response.exitosa.estructura)}

#### Ejemplo de Uso

\`\`\`javascript
${schema.ejemplos[0]?.codigo || "No disponible"}
\`\`\`

---

`;
  });

  // Añadir sección de códigos de error
  markdown += `
## Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| 400 | Solicitud incorrecta - Parámetros inválidos |
| 401 | No autorizado - Token inválido o faltante |
| 404 | No encontrado - Recurso no existe |
| 500 | Error interno del servidor |

## Formularios Disponibles

Los siguientes formularios están disponibles en el sistema:

- **INVENTARIO**: Gestión de inventario
- **TRAZABILIDAD**: Seguimiento de productos
- **RECEPCIONES_LOTES**: Recepción de lotes
- **OPERACIONES_FRIO_DESPACHO**: Operaciones de frío y despacho
- **STOCK_UBICACIONES**: Control de stock por ubicación
- **TARJAS**: Gestión de tarjas

## Campos Comunes

Los siguientes tipos de campos están disponibles en múltiples formularios:

- **materiales**: Lista de materiales del sistema
- **proveedores**: Lista de proveedores
- **ubicaciones**: Ubicaciones de almacenamiento
- **plantas**: Plantas de procesamiento

## Notas Técnicas

- Todas las respuestas incluyen un campo \`exito\` que indica el estado de la operación
- Los datos principales están en el campo \`datos\` de la respuesta
- La paginación se maneja automáticamente cuando hay muchos resultados
- Las búsquedas son case-insensitive
- Los filtros se pueden combinar para obtener resultados más específicos

---

*Documentación generada automáticamente por el sistema de pruebas*
`;

  // Guardar archivo
  const nombreArchivo = `DOCUMENTACION_CAMPOS_ANIDADOS_${
    new Date().toISOString().split("T")[0]
  }.md`;
  const rutaArchivo = `c:\\Users\\Walter Ranco\\Desktop\\WMS\\prueba-v1\\${nombreArchivo}`;

  fs.writeFileSync(rutaArchivo, markdown, "utf8");

  console.log(`✅ Documentación guardada en: ${nombreArchivo}`);
  return nombreArchivo;
}

/**
 * Función auxiliar para calcular tasa de éxito general
 */
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

/**
 * Función para generar documentación de schema
 */
function generarDocumentacionSchema(estructura, nivel = 0) {
  if (!estructura) return "No disponible";

  const indent = "  ".repeat(nivel);
  let doc = "";

  if (estructura.tipo === "array") {
    doc += `${indent}- **Array** de elementos:\n`;
    if (estructura.elementos) {
      doc += generarDocumentacionSchema(estructura.elementos, nivel + 1);
    }
  } else if (estructura.tipo === "object" && estructura.propiedades) {
    Object.keys(estructura.propiedades).forEach((prop) => {
      const p = estructura.propiedades[prop];
      doc += `${indent}- **${prop}** (${p.tipo})`;

      if (p.obligatorio === false) {
        doc += " *opcional*";
      }

      if (p.ejemplo !== null && p.ejemplo !== undefined) {
        doc += `: ${
          typeof p.ejemplo === "string" ? `"${p.ejemplo}"` : p.ejemplo
        }`;
      }

      doc += "\n";

      if (p.estructura) {
        doc += generarDocumentacionSchema(p.estructura, nivel + 1);
      }
    });
  } else {
    doc += `${indent}- Tipo: ${estructura.tipo}\n`;
  }

  return doc;
}

// Ejecutar pruebas
if (require.main === module) {
  // Primero autenticar, luego ejecutar pruebas y generar documentación
  autenticarUsuario()
    .then((autenticado) => {
      if (!autenticado) {
        console.log("\n❌ No se pudo autenticar. Terminando pruebas.");
        process.exit(1);
      }
      return ejecutarPruebas();
    })
    .then(() => probarConfiguracionEspecifica())
    .then(() => documentarAPIsAdicionales())
    .then(() => {
      console.log("\n✨ Pruebas completadas");

      // Generar documentación
      console.log("\n📚 Generando documentación completa...");
      generarDocumentacionSchemas();
      const archivoGenerado = generarArchivoDocumentacion();

      // Mostrar resumen final
      console.log("\n" + "=".repeat(60));
      console.log("📊 RESUMEN FINAL");
      console.log("=".repeat(60));
      console.log(
        `📋 APIs documentadas: ${
          Object.keys(DOCUMENTACION_GENERADA.apis).length
        }`
      );
      console.log(`📄 Archivo generado: ${archivoGenerado}`);
      console.log(`🎯 Tasa de éxito: ${calcularTasaExitoGeneral()}%`);
      console.log(
        `⏱️  Total de llamadas: ${Object.values(
          DOCUMENTACION_GENERADA.apis
        ).reduce((sum, api) => sum + api.estadisticas.totalLlamadas, 0)}`
      );

      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Error crítico:", error);
      process.exit(1);
    });
}

module.exports = {
  autenticarUsuario,
  probarConfiguracionFormulario,
  probarOpcionesCampo,
  probarOpcionesConBusqueda,
  probarOpcionesPaginadas,
  probarBusquedaMultiple,
  probarValidacionValor,
  documentarAPIsAdicionales,
  generarDocumentacionSchemas,
  generarArchivoDocumentacion,
  documentarRespuestaAPI,
  DOCUMENTACION_GENERADA,
};
