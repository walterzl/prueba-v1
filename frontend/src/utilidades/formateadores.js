/**
 * Utilidades para formatear datos
 * Funciones comunes para formatear fechas, números, texto, etc.
 */

/**
 * Formatea una fecha en formato legible
 * @param {Date|string|number} fecha - La fecha a formatear
 * @param {Object} opciones - Opciones de formateo
 * @returns {string} Fecha formateada
 */
export function formatearFecha(fecha, opciones = {}) {
  if (!fecha) return "N/A";

  try {
    const fechaObj = new Date(fecha);

    // Verificar si la fecha es válida
    if (isNaN(fechaObj.getTime())) {
      return "Fecha inválida";
    }

    const opcionesDefecto = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Santiago",
      ...opciones,
    };

    // Si solo queremos la fecha sin hora
    if (opciones.soloFecha) {
      return fechaObj.toLocaleDateString("es-CL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "America/Santiago",
      });
    }

    // Si solo queremos la hora
    if (opciones.soloHora) {
      return fechaObj.toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Santiago",
      });
    }

    // Formato completo por defecto
    return fechaObj.toLocaleString("es-CL", opcionesDefecto);
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return "Error en fecha";
  }
}

/**
 * Formatea un número con separadores de miles y decimales
 * @param {number|string} numero - El número a formatear
 * @param {Object} opciones - Opciones de formateo
 * @returns {string} Número formateado
 */
export function formatearNumero(numero, opciones = {}) {
  if (numero === null || numero === undefined || numero === "") {
    return "N/A";
  }

  try {
    const numeroFloat = parseFloat(numero);

    if (isNaN(numeroFloat)) {
      return "N/A";
    }

    const opcionesDefecto = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      ...opciones,
    };

    return numeroFloat.toLocaleString("es-CL", opcionesDefecto);
  } catch (error) {
    console.error("Error al formatear número:", error);
    return "Error";
  }
}

/**
 * Formatea un número como moneda chilena
 * @param {number|string} valor - El valor a formatear
 * @param {Object} opciones - Opciones adicionales
 * @returns {string} Valor formateado como moneda
 */
export function formatearMoneda(valor, opciones = {}) {
  if (valor === null || valor === undefined || valor === "") {
    return "N/A";
  }

  try {
    const numeroFloat = parseFloat(valor);

    if (isNaN(numeroFloat)) {
      return "N/A";
    }

    const opcionesDefecto = {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      ...opciones,
    };

    return numeroFloat.toLocaleString("es-CL", opcionesDefecto);
  } catch (error) {
    console.error("Error al formatear moneda:", error);
    return "Error";
  }
}

/**
 * Formatea un porcentaje
 * @param {number|string} valor - El valor a formatear (0-1 o 0-100)
 * @param {Object} opciones - Opciones de formateo
 * @returns {string} Porcentaje formateado
 */
export function formatearPorcentaje(valor, opciones = {}) {
  if (valor === null || valor === undefined || valor === "") {
    return "N/A";
  }

  try {
    let numeroFloat = parseFloat(valor);

    if (isNaN(numeroFloat)) {
      return "N/A";
    }

    // Si el valor es mayor a 1, asumimos que está en formato 0-100
    if (numeroFloat > 1 && !opciones.esDecimal) {
      numeroFloat = numeroFloat / 100;
    }

    const opcionesDefecto = {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
      ...opciones,
    };

    return numeroFloat.toLocaleString("es-CL", opcionesDefecto);
  } catch (error) {
    console.error("Error al formatear porcentaje:", error);
    return "Error";
  }
}

/**
 * Formatea texto limitando la longitud y agregando puntos suspensivos
 * @param {string} texto - El texto a formatear
 * @param {number} longitudMaxima - Longitud máxima del texto
 * @param {string} sufijo - Sufijo a agregar cuando se trunca (por defecto '...')
 * @returns {string} Texto formateado
 */
export function formatearTexto(texto, longitudMaxima = 50, sufijo = "...") {
  if (!texto || typeof texto !== "string") {
    return "N/A";
  }

  if (texto.length <= longitudMaxima) {
    return texto;
  }

  return texto.substring(0, longitudMaxima - sufijo.length) + sufijo;
}

/**
 * Formatea un nombre completo (capitaliza cada palabra)
 * @param {string} nombre - El nombre a formatear
 * @returns {string} Nombre formateado
 */
export function formatearNombre(nombre) {
  if (!nombre || typeof nombre !== "string") {
    return "N/A";
  }

  return nombre
    .toLowerCase()
    .split(" ")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

/**
 * Formatea un RUT chileno
 * @param {string} rut - El RUT a formatear
 * @returns {string} RUT formateado
 */
export function formatearRUT(rut) {
  if (!rut) return "N/A";

  try {
    // Limpiar el RUT de caracteres no numéricos excepto K
    const rutLimpio = rut.toString().replace(/[^0-9Kk]/g, "");

    if (rutLimpio.length < 2) return rut;

    // Separar número y dígito verificador
    const numero = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();

    // Formatear con puntos
    const numeroFormateado = numero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `${numeroFormateado}-${dv}`;
  } catch (error) {
    console.error("Error al formatear RUT:", error);
    return rut;
  }
}

/**
 * Formatea un número de teléfono chileno
 * @param {string} telefono - El teléfono a formatear
 * @returns {string} Teléfono formateado
 */
export function formatearTelefono(telefono) {
  if (!telefono) return "N/A";

  try {
    // Limpiar solo números
    const telefonoLimpio = telefono.toString().replace(/\D/g, "");

    if (telefonoLimpio.length === 9) {
      // Formato móvil: +56 9 XXXX XXXX
      return `+56 9 ${telefonoLimpio.substring(
        1,
        5
      )} ${telefonoLimpio.substring(5)}`;
    } else if (telefonoLimpio.length === 8) {
      // Formato fijo: +56 XX XXX XXXX
      return `+56 ${telefonoLimpio.substring(0, 2)} ${telefonoLimpio.substring(
        2,
        5
      )} ${telefonoLimpio.substring(5)}`;
    }

    return telefono;
  } catch (error) {
    console.error("Error al formatear teléfono:", error);
    return telefono;
  }
}

/**
 * Formatea el tamaño de archivo en bytes a formato legible
 * @param {number} bytes - Tamaño en bytes
 * @param {number} decimales - Número de decimales
 * @returns {string} Tamaño formateado
 */
export function formatearTamanoArchivo(bytes, decimales = 2) {
  if (!bytes || bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimales < 0 ? 0 : decimales;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Formatea duración en minutos a formato HH:MM
 * @param {number} minutos - Duración en minutos
 * @returns {string} Duración formateada
 */
export function formatearDuracion(minutos) {
  if (!minutos || minutos < 0) return "N/A";

  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;

  return `${horas.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Formatea una fecha relativa (hace X tiempo)
 * @param {Date|string} fecha - La fecha a comparar
 * @returns {string} Tiempo relativo
 */
export function formatearTiempoRelativo(fecha) {
  if (!fecha) return "N/A";

  try {
    const fechaObj = new Date(fecha);
    const ahora = new Date();
    const diferencia = ahora - fechaObj;

    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    const meses = Math.floor(dias / 30);
    const años = Math.floor(dias / 365);

    if (años > 0) return `hace ${años} ${años === 1 ? "año" : "años"}`;
    if (meses > 0) return `hace ${meses} ${meses === 1 ? "mes" : "meses"}`;
    if (dias > 0) return `hace ${dias} ${dias === 1 ? "día" : "días"}`;
    if (horas > 0) return `hace ${horas} ${horas === 1 ? "hora" : "horas"}`;
    if (minutos > 0)
      return `hace ${minutos} ${minutos === 1 ? "minuto" : "minutos"}`;

    return "hace un momento";
  } catch (error) {
    console.error("Error al formatear tiempo relativo:", error);
    return "Error";
  }
}

/**
 * Capitaliza la primera letra de un texto
 * @param {string} texto - Texto a capitalizar
 * @returns {string} Texto capitalizado
 */
export function capitalizar(texto) {
  if (!texto || typeof texto !== "string") return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

/**
 * Formatea un estado con color
 * @param {string} estado - Estado a formatear
 * @returns {Object} Objeto con texto y clase CSS
 */
export function formatearEstado(estado) {
  if (!estado) return { texto: "N/A", clase: "estado-sin-definir" };

  const estadosMap = {
    ACTIVA: { texto: "Activa", clase: "estado-activo" },
    INACTIVA: { texto: "Inactiva", clase: "estado-inactivo" },
    PENDIENTE: { texto: "Pendiente", clase: "estado-pendiente" },
    COMPLETADO: { texto: "Completado", clase: "estado-completado" },
    EN_PROCESO: { texto: "En Proceso", clase: "estado-proceso" },
    CANCELADO: { texto: "Cancelado", clase: "estado-cancelado" },
    APROBADO: { texto: "Aprobado", clase: "estado-aprobado" },
    RECHAZADO: { texto: "Rechazado", clase: "estado-rechazado" },
  };

  const estadoNormalizado = estado.toString().toUpperCase();
  return (
    estadosMap[estadoNormalizado] || {
      texto: capitalizar(estado),
      clase: "estado-generico",
    }
  );
}

// Exportación por defecto para compatibilidad
export default {
  formatearFecha,
  formatearNumero,
  formatearMoneda,
  formatearPorcentaje,
  formatearTexto,
  formatearNombre,
  formatearRUT,
  formatearTelefono,
  formatearTamanoArchivo,
  formatearDuracion,
  formatearTiempoRelativo,
  capitalizar,
  formatearEstado,
};
