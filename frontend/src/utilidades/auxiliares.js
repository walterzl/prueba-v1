/**
 * Funciones auxiliares reutilizables para todo el sistema
 * Evita duplicación de código y mantiene consistencia
 */

// ============== FORMATEO DE FECHAS ==============

/**
 * Formatea una fecha en formato chileno (DD/MM/YYYY)
 */
export function formatearFecha(fecha) {
  if (!fecha) return "";

  try {
    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) return "";

    return fechaObj.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    console.warn("Error al formatear fecha:", error);
    return "";
  }
}

/**
 * Formatea una fecha con hora en formato chileno
 */
export function formatearFechaHora(fecha) {
  if (!fecha) return "";

  try {
    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) return "";

    return fechaObj.toLocaleString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch (error) {
    console.warn("Error al formatear fecha y hora:", error);
    return "";
  }
}

/**
 * Formatea solo la hora en formato HH:MM
 */
export function formatearHora(fecha) {
  if (!fecha) return "";

  try {
    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) return "";

    return fechaObj.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.warn("Error al formatear hora:", error);
    return "";
  }
}

/**
 * Convierte una fecha a formato ISO para APIs (YYYY-MM-DD)
 */
export function fechaParaApi(fecha) {
  if (!fecha) return null;

  try {
    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) return null;

    return fechaObj.toISOString().split("T")[0];
  } catch (error) {
    console.warn("Error al convertir fecha para API:", error);
    return null;
  }
}

/**
 * Obtiene la fecha actual formateada para inputs de tipo date
 */
export function fechaActualParaInput() {
  return fechaParaApi(new Date());
}

/**
 * Obtiene la fecha y hora actual formateada para inputs de tipo datetime-local
 */
export function fechaHoraActualParaInput() {
  const ahora = new Date();
  // Ajustar a zona horaria local
  const offset = ahora.getTimezoneOffset() * 60000;
  const fechaLocal = new Date(ahora.getTime() - offset);

  // Formatear como YYYY-MM-DDTHH:MM
  return fechaLocal.toISOString().slice(0, 16);
}

// ============== FORMATEO DE NÚMEROS ==============

/**
 * Formatea un número con separadores de miles y decimales
 */
export function formatearNumero(numero, decimales = 0) {
  if (numero === null || numero === undefined || numero === "") return "";

  try {
    const numeroLimpio = Number(numero);
    if (isNaN(numeroLimpio)) return "";

    return numeroLimpio.toLocaleString("es-CL", {
      minimumFractionDigits: decimales,
      maximumFractionDigits: decimales,
    });
  } catch (error) {
    console.warn("Error al formatear número:", error);
    return "";
  }
}

/**
 * Formatea un número como moneda chilena
 */
export function formatearMoneda(monto) {
  if (monto === null || monto === undefined || monto === "") return "";

  try {
    const montoLimpio = Number(monto);
    if (isNaN(montoLimpio)) return "";

    return montoLimpio.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  } catch (error) {
    console.warn("Error al formatear moneda:", error);
    return "";
  }
}

// ============== MANIPULACIÓN DE STRINGS ==============

/**
 * Capitaliza la primera letra de cada palabra
 */
export function capitalizarPalabras(texto) {
  if (!texto || typeof texto !== "string") return "";

  return texto
    .toLowerCase()
    .split(" ")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

/**
 * Convierte texto a formato de código (mayúsculas, sin espacios)
 */
export function formatearCodigo(texto) {
  if (!texto || typeof texto !== "string") return "";

  return texto
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/[^A-Z0-9_]/g, "");
}

/**
 * Trunca un texto a una longitud específica con puntos suspensivos
 */
export function truncarTexto(texto, longitud = 50) {
  if (!texto || typeof texto !== "string") return "";

  if (texto.length <= longitud) return texto;

  return texto.substring(0, longitud).trim() + "...";
}

// ============== GENERADORES DE IDs ==============

/**
 * Genera un ID temporal único para uso en frontend
 */
export function generarIdTemporal() {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Genera un ID numérico de longitud específica
 */
export function generarId(longitud = 6) {
  let resultado = "";
  for (let i = 0; i < longitud; i++) {
    resultado += Math.floor(Math.random() * 10).toString();
  }
  return resultado;
}

/**
 * Genera un código de lote basado en fecha actual
 */
export function generarCodigoLote(prefijo = "L") {
  const ahora = new Date();
  const año = ahora.getFullYear();
  const mes = (ahora.getMonth() + 1).toString().padStart(2, "0");
  const dia = ahora.getDate().toString().padStart(2, "0");
  const hora = ahora.getHours().toString().padStart(2, "0");
  const minuto = ahora.getMinutes().toString().padStart(2, "0");

  return `${prefijo}${año}${mes}${dia}-${hora}${minuto}`;
}

// ============== UTILIDADES PARA ARRAYS Y OBJETOS ==============

/**
 * Filtra un array por múltiples propiedades de texto
 */
export function filtrarPorTexto(array, termino, propiedades = []) {
  if (!array || !Array.isArray(array)) return [];
  if (!termino || typeof termino !== "string") return array;

  const terminoLimpio = termino.toLowerCase().trim();
  if (!terminoLimpio) return array;

  return array.filter((item) => {
    // Si no se especifican propiedades, buscar en todas las propiedades string
    if (propiedades.length === 0) {
      return Object.values(item).some((valor) => {
        if (typeof valor === "string") {
          return valor.toLowerCase().includes(terminoLimpio);
        }
        return false;
      });
    }

    // Buscar en propiedades específicas
    return propiedades.some((propiedad) => {
      const valor = obtenerValorAnidado(item, propiedad);
      if (typeof valor === "string") {
        return valor.toLowerCase().includes(terminoLimpio);
      }
      return false;
    });
  });
}

/**
 * Ordena un array por una propiedad específica
 */
export function ordenarPor(array, propiedad, direccion = "asc") {
  if (!array || !Array.isArray(array)) return [];

  return [...array].sort((a, b) => {
    const valorA = obtenerValorAnidado(a, propiedad);
    const valorB = obtenerValorAnidado(b, propiedad);

    // Manejar valores null/undefined
    if (valorA == null && valorB == null) return 0;
    if (valorA == null) return direccion === "asc" ? 1 : -1;
    if (valorB == null) return direccion === "asc" ? -1 : 1;

    // Comparar valores
    let resultado;
    if (typeof valorA === "string" && typeof valorB === "string") {
      resultado = valorA.localeCompare(valorB, "es-CL");
    } else {
      resultado = valorA < valorB ? -1 : valorA > valorB ? 1 : 0;
    }

    return direccion === "desc" ? -resultado : resultado;
  });
}

/**
 * Obtiene un valor de un objeto usando notación de punto
 */
export function obtenerValorAnidado(objeto, ruta) {
  if (!objeto || typeof ruta !== "string") return undefined;

  return ruta.split(".").reduce((actual, clave) => {
    return actual && actual[clave] !== undefined ? actual[clave] : undefined;
  }, objeto);
}

/**
 * Agrupa un array por una propiedad específica
 */
export function agruparPor(array, propiedad) {
  if (!array || !Array.isArray(array)) return {};

  return array.reduce((grupos, item) => {
    const clave = obtenerValorAnidado(item, propiedad);
    const claveStr = clave?.toString() || "Sin clasificar";

    if (!grupos[claveStr]) {
      grupos[claveStr] = [];
    }

    grupos[claveStr].push(item);
    return grupos;
  }, {});
}

/**
 * Filtra un array por rango de fechas
 */
export function filtrarPorRangoFechas(
  array,
  propiedadFecha,
  fechaDesde,
  fechaHasta
) {
  if (!array || !Array.isArray(array)) return [];
  if (!propiedadFecha) return array;

  return array.filter((item) => {
    const fechaItem = obtenerValorAnidado(item, propiedadFecha);
    if (!fechaItem) return false;

    const fecha = new Date(fechaItem);
    if (isNaN(fecha.getTime())) return false;

    // Verificar fecha desde
    if (fechaDesde) {
      const desde = new Date(fechaDesde);
      desde.setHours(0, 0, 0, 0); // Inicio del día
      if (fecha < desde) return false;
    }

    // Verificar fecha hasta
    if (fechaHasta) {
      const hasta = new Date(fechaHasta);
      hasta.setHours(23, 59, 59, 999); // Final del día
      if (fecha > hasta) return false;
    }

    return true;
  });
}

// ============== UTILIDADES PARA VALIDACIONES ==============

/**
 * Verifica si un valor está vacío (null, undefined, string vacío, array vacío)
 */
export function estaVacio(valor) {
  if (valor === null || valor === undefined) return true;
  if (typeof valor === "string") return valor.trim() === "";
  if (Array.isArray(valor)) return valor.length === 0;
  if (typeof valor === "object") return Object.keys(valor).length === 0;
  return false;
}

/**
 * Verifica si un valor es un número válido
 */
export function esNumeroValido(valor) {
  if (valor === null || valor === undefined || valor === "") return false;
  const numero = Number(valor);
  return !isNaN(numero) && isFinite(numero);
}

// ============== UTILIDADES PARA ARCHIVOS ==============

/**
 * Convierte un archivo a base64
 */
export function archivoABase64(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.readAsDataURL(archivo);
    lector.onload = () => resolve(lector.result);
    lector.onerror = (error) => reject(error);
  });
}

/**
 * Valida el tipo y tamaño de un archivo
 */
export function validarArchivo(
  archivo,
  tiposPermitidos = [],
  tamañoMaximoMB = 5
) {
  const errores = [];

  if (!archivo) {
    errores.push("No se ha seleccionado ningún archivo");
    return errores;
  }

  // Validar tipo de archivo
  if (tiposPermitidos.length > 0) {
    const tipoValido = tiposPermitidos.some((tipo) =>
      archivo.type.includes(tipo)
    );
    if (!tipoValido) {
      errores.push(
        `Tipo de archivo no permitido. Tipos válidos: ${tiposPermitidos.join(
          ", "
        )}`
      );
    }
  }

  // Validar tamaño
  const tamañoMB = archivo.size / (1024 * 1024);
  if (tamañoMB > tamañoMaximoMB) {
    errores.push(
      `El archivo es demasiado grande. Tamaño máximo: ${tamañoMaximoMB}MB`
    );
  }

  return errores;
}

// ============== UTILIDADES PARA LOCAL STORAGE ==============

/**
 * Guarda un valor en localStorage con manejo de errores
 */
export function guardarEnLocalStorage(clave, valor) {
  try {
    const valorJson = JSON.stringify(valor);
    localStorage.setItem(clave, valorJson);
    return true;
  } catch (error) {
    console.error("Error al guardar en localStorage:", error);
    return false;
  }
}

/**
 * Obtiene un valor de localStorage con manejo de errores
 */
export function obtenerDeLocalStorage(clave, valorPorDefecto = null) {
  try {
    const valorJson = localStorage.getItem(clave);
    if (valorJson === null) return valorPorDefecto;
    return JSON.parse(valorJson);
  } catch (error) {
    console.error("Error al obtener de localStorage:", error);
    return valorPorDefecto;
  }
}

/**
 * Remueve un valor de localStorage
 */
export function removerDeLocalStorage(clave) {
  try {
    localStorage.removeItem(clave);
    return true;
  } catch (error) {
    console.error("Error al remover de localStorage:", error);
    return false;
  }
}

// ============== UTILIDADES PARA PERFORMANCE ==============

/**
 * Función debounce para limitar la frecuencia de ejecución
 */
export function debounce(funcion, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => funcion.apply(this, args), delay);
  };
}

/**
 * Función throttle para limitar la frecuencia de ejecución
 */
export function throttle(funcion, delay) {
  let ultimaEjecucion = 0;
  return function (...args) {
    const ahora = Date.now();
    if (ahora - ultimaEjecucion >= delay) {
      funcion.apply(this, args);
      ultimaEjecucion = ahora;
    }
  };
}

// ============== UTILIDADES PARA DEBUGGING ==============

/**
 * Log condicional que solo se ejecuta en desarrollo
 */
export function logDesarrollo(...argumentos) {
  if (import.meta.env.MODE === "development") {
    console.log(...argumentos);
  }
}

/**
 * Muestra información detallada de un objeto en desarrollo
 */
export function depurarObjeto(objeto, etiqueta = "Debug") {
  if (import.meta.env.MODE === "development") {
    console.group(etiqueta);
    console.table(objeto);
    console.log("Objeto completo:", objeto);
    console.groupEnd();
  }
}
