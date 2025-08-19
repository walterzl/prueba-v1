/**
 * Utilidades para validaciones de formularios y datos
 * Centraliza las reglas de validación para mantener consistencia
 */

// ============== VALIDACIONES DE CAMPOS BÁSICOS ==============

/**
 * Valida que un campo no esté vacío
 */
export function validarCampoRequerido(valor, nombreCampo) {
  if (!valor || (typeof valor === "string" && !valor.trim())) {
    return `${nombreCampo} es requerido`;
  }
  return null;
}

/**
 * Valida que un valor numérico sea válido y positivo
 */
export function validarNumeroPositivo(valor, nombreCampo) {
  if (valor === null || valor === undefined || valor === "") {
    return `${nombreCampo} es requerido`;
  }

  const numero = Number(valor);
  if (isNaN(numero)) {
    return `${nombreCampo} debe ser un número válido`;
  }

  if (numero < 0) {
    return `${nombreCampo} debe ser mayor o igual a cero`;
  }

  return null;
}

/**
 * Valida que un valor numérico sea mayor que cero
 */
export function validarNumeroMayorQueCero(valor, nombreCampo) {
  const errorNumero = validarNumeroPositivo(valor, nombreCampo);
  if (errorNumero) return errorNumero;

  if (Number(valor) <= 0) {
    return `${nombreCampo} debe ser mayor que cero`;
  }

  return null;
}

/**
 * Valida formato de fecha
 */
export function validarFecha(fecha, nombreCampo) {
  if (!fecha) {
    return `${nombreCampo} es requerida`;
  }

  const fechaObj = new Date(fecha);
  if (isNaN(fechaObj.getTime())) {
    return `${nombreCampo} debe tener un formato de fecha válido`;
  }

  return null;
}

/**
 * Valida que la fecha no sea futura
 */
export function validarFechaNoFutura(fecha, nombreCampo) {
  const errorFecha = validarFecha(fecha, nombreCampo);
  if (errorFecha) return errorFecha;

  const fechaObj = new Date(fecha);
  const hoy = new Date();
  hoy.setHours(23, 59, 59, 999); // Permitir fechas de hoy

  if (fechaObj > hoy) {
    return `${nombreCampo} no puede ser una fecha futura`;
  }

  return null;
}

/**
 * Valida formato de email
 */
export function validarEmail(email, nombreCampo = "Email") {
  if (!email?.trim()) {
    return `${nombreCampo} es requerido`;
  }

  const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!patronEmail.test(email)) {
    return `${nombreCampo} debe tener un formato válido`;
  }

  return null;
}

// ============== VALIDACIONES ESPECÍFICAS DEL NEGOCIO ==============

/**
 * Valida datos de inventario
 */
export function validarDatosInventario(datos) {
  const errores = [];

  // Validaciones requeridas
  const errorCodigo = validarCampoRequerido(datos.title, "Código de material");
  if (errorCodigo) errores.push(errorCodigo);

  const errorStock = validarNumeroPositivo(datos.stock, "Stock");
  if (errorStock) errores.push(errorStock);

  const errorPallets = validarNumeroPositivo(
    datos.pallets,
    "Cantidad de pallets"
  );
  if (errorPallets) errores.push(errorPallets);

  const errorBodega = validarCampoRequerido(datos.bodega, "Bodega");
  if (errorBodega) errores.push(errorBodega);

  const errorUbicacion = validarCampoRequerido(datos.ubicacion, "Ubicación");
  if (errorUbicacion) errores.push(errorUbicacion);

  const errorContadoPor = validarCampoRequerido(
    datos.contado_por,
    "Contado por"
  );
  if (errorContadoPor) errores.push(errorContadoPor);

  const errorFecha = validarFechaNoFutura(
    datos.fecha_inventario,
    "Fecha de inventario"
  );
  if (errorFecha) errores.push(errorFecha);

  return errores;
}

/**
 * Valida datos de trazabilidad/movimiento
 */
export function validarDatosTrazabilidad(datos) {
  const errores = [];

  // Validaciones de encabezado
  const errorTipoMovimiento = validarCampoRequerido(
    datos.tipo_movimiento,
    "Tipo de movimiento"
  );
  if (errorTipoMovimiento) errores.push(errorTipoMovimiento);

  const errorPlanta = validarCampoRequerido(datos.planta, "Planta");
  if (errorPlanta) errores.push(errorPlanta);

  const errorFecha = validarFechaNoFutura(datos.fecha, "Fecha");
  if (errorFecha) errores.push(errorFecha);

  // Validaciones de material
  const errorMaterial = validarCampoRequerido(datos.material_id, "Material");
  if (errorMaterial) errores.push(errorMaterial);

  const errorCantidad = validarNumeroMayorQueCero(datos.cantidad, "Cantidad");
  if (errorCantidad) errores.push(errorCantidad);

  const errorLote = validarCampoRequerido(datos.lote, "Lote");
  if (errorLote) errores.push(errorLote);

  // Validar bodegas según tipo de movimiento
  if (requiereBodegaOrigen(datos.tipo_movimiento)) {
    const errorBodegaOrigen = validarCampoRequerido(
      datos.bodega_origen,
      "Bodega origen"
    );
    if (errorBodegaOrigen) errores.push(errorBodegaOrigen);
  }

  if (requiereBodegaDestino(datos.tipo_movimiento)) {
    const errorBodegaDestino = validarCampoRequerido(
      datos.bodega_destino,
      "Bodega destino"
    );
    if (errorBodegaDestino) errores.push(errorBodegaDestino);
  }

  return errores;
}

/**
 * Valida datos de recepción de lotes
 */
export function validarDatosRecepcionLotes(datos) {
  const errores = [];

  const errorGuia = validarCampoRequerido(datos.numero_guia, "Número de guía");
  if (errorGuia) errores.push(errorGuia);

  const errorMaterial = validarCampoRequerido(datos.material_id, "Material");
  if (errorMaterial) errores.push(errorMaterial);

  const errorProveedor = validarCampoRequerido(datos.proveedor_id, "Proveedor");
  if (errorProveedor) errores.push(errorProveedor);

  const errorUbicacion = validarCampoRequerido(datos.ubicacion_id, "Ubicación");
  if (errorUbicacion) errores.push(errorUbicacion);

  const errorCantidad = validarNumeroMayorQueCero(
    datos.cantidad_recibida,
    "Cantidad recibida"
  );
  if (errorCantidad) errores.push(errorCantidad);

  const errorLote = validarCampoRequerido(datos.lote, "Lote");
  if (errorLote) errores.push(errorLote);

  const errorFecha = validarFechaNoFutura(
    datos.fecha_recepcion,
    "Fecha de recepción"
  );
  if (errorFecha) errores.push(errorFecha);

  return errores;
}

/**
 * Valida datos de operaciones de frío y despacho
 */
export function validarDatosOperacionesFrioDespacho(datos) {
  const errores = [];

  const errorMaterial = validarCampoRequerido(datos.material_id, "Material");
  if (errorMaterial) errores.push(errorMaterial);

  const errorTipoOperacion = validarCampoRequerido(
    datos.tipo_operacion,
    "Tipo de operación"
  );
  if (errorTipoOperacion) errores.push(errorTipoOperacion);

  const errorCantidad = validarNumeroMayorQueCero(datos.cantidad, "Cantidad");
  if (errorCantidad) errores.push(errorCantidad);

  const errorLote = validarCampoRequerido(datos.lote, "Lote");
  if (errorLote) errores.push(errorLote);

  // Validar ubicaciones según tipo de operación
  if (datos.tipo_operacion === "despacho") {
    const errorUbicacionOrigen = validarCampoRequerido(
      datos.ubicacion_origen_id,
      "Ubicación origen"
    );
    if (errorUbicacionOrigen) errores.push(errorUbicacionOrigen);
  }

  if (datos.tipo_operacion === "consumo") {
    const errorUbicacionDestino = validarCampoRequerido(
      datos.ubicacion_destino_id,
      "Ubicación destino"
    );
    if (errorUbicacionDestino) errores.push(errorUbicacionDestino);
  }

  return errores;
}

/**
 * Valida datos de tarjas
 */
export function validarDatosTarjas(datos) {
  const errores = [];

  const errorTipoTarja = validarCampoRequerido(
    datos.tipo_tarja,
    "Tipo de tarja"
  );
  if (errorTipoTarja) errores.push(errorTipoTarja);

  const errorDescripcion = validarCampoRequerido(
    datos.descripcion,
    "Descripción"
  );
  if (errorDescripcion) errores.push(errorDescripcion);

  const errorPlanta = validarCampoRequerido(datos.planta, "Planta");
  if (errorPlanta) errores.push(errorPlanta);

  return errores;
}

// ============== FUNCIONES AUXILIARES ==============

/**
 * Determina si un tipo de movimiento requiere bodega origen
 */
function requiereBodegaOrigen(tipoMovimiento) {
  const tiposQueRequierenOrigen = [
    "DESPACHO",
    "TRASLADO",
    "CONSUMO",
    "TRANSFERENCIA",
    "SALIDA",
  ];
  return tiposQueRequierenOrigen.includes(tipoMovimiento?.toUpperCase());
}

/**
 * Determina si un tipo de movimiento requiere bodega destino
 */
function requiereBodegaDestino(tipoMovimiento) {
  const tiposQueRequierenDestino = [
    "INGRESO",
    "RECEPCION",
    "TRASLADO",
    "TRANSFERENCIA",
    "ENTRADA",
  ];
  return tiposQueRequierenDestino.includes(tipoMovimiento?.toUpperCase());
}

/**
 * Valida los datos de una operación de frío y despacho
 */
export function validarOperacionFrioDespacho(datos) {
  const errores = [];

  // Validaciones requeridas
  if (!datos.tipo_operacion?.trim()) {
    errores.push("El tipo de operación es requerido");
  }

  if (!datos.fecha_operacion) {
    errores.push("La fecha de operación es requerida");
  } else {
    const fechaOperacion = new Date(datos.fecha_operacion);
    const ahora = new Date();
    if (fechaOperacion > ahora) {
      errores.push("La fecha de operación no puede ser futura");
    }
  }

  if (!datos.turno?.trim()) {
    errores.push("El turno es requerido");
  }

  if (!datos.codigo_material?.trim()) {
    errores.push("El código del material es requerido");
  } else if (datos.codigo_material.length < 4) {
    errores.push("El código del material debe tener al menos 4 caracteres");
  }

  if (!datos.lote?.trim()) {
    errores.push("El lote es requerido");
  }

  if (!datos.cantidad_operacion || datos.cantidad_operacion <= 0) {
    errores.push("La cantidad debe ser mayor a 0");
  }

  if (!datos.ubicacion_origen?.trim()) {
    errores.push("La ubicación de origen es requerida");
  }

  if (!datos.estado?.trim()) {
    errores.push("El estado es requerido");
  }

  if (!datos.responsable?.trim()) {
    errores.push("El responsable es requerido");
  }

  // Validaciones específicas por tipo de operación
  if (datos.tipo_operacion === "despacho" && !datos.cliente?.trim()) {
    errores.push("El cliente es requerido para operaciones de despacho");
  }

  if (datos.tipo_operacion === "traslado" && !datos.ubicacion_destino?.trim()) {
    errores.push("La ubicación de destino es requerida para traslados");
  }

  // Validación de temperatura
  if (
    datos.temperatura !== null &&
    datos.temperatura !== undefined &&
    datos.temperatura !== ""
  ) {
    const temp = parseFloat(datos.temperatura);
    if (isNaN(temp)) {
      errores.push("La temperatura debe ser un número válido");
    } else if (temp < -50 || temp > 50) {
      errores.push("La temperatura debe estar entre -50°C y 50°C");
    }
  }

  return errores;
}

/**
 * Valida los datos de una tarja
 */
export function validarTarja(datos) {
  const errores = [];

  // Validaciones requeridas
  if (!datos.tipo_tarja?.trim()) {
    errores.push("El tipo de tarja es requerido");
  }

  if (!datos.fecha_tarja) {
    errores.push("La fecha de tarja es requerida");
  } else {
    const fechaTarja = new Date(datos.fecha_tarja);
    const ahora = new Date();
    if (fechaTarja > ahora) {
      errores.push("La fecha de tarja no puede ser futura");
    }
  }

  if (!datos.temporada?.trim()) {
    errores.push("La temporada es requerida");
  }

  if (!datos.codigo_material?.trim()) {
    errores.push("El código del material es requerido");
  } else if (datos.codigo_material.length < 4) {
    errores.push("El código del material debe tener al menos 4 caracteres");
  }

  if (!datos.lote?.trim()) {
    errores.push("El lote es requerido");
  }

  if (!datos.proveedor?.trim()) {
    errores.push("El proveedor es requerido");
  }

  if (!datos.cantidad_total || datos.cantidad_total <= 0) {
    errores.push("La cantidad total debe ser mayor a 0");
  }

  if (datos.cantidad_disponible < 0) {
    errores.push("La cantidad disponible no puede ser negativa");
  }

  if (datos.cantidad_disponible > datos.cantidad_total) {
    errores.push(
      "La cantidad disponible no puede ser mayor a la cantidad total"
    );
  }

  if (!datos.ubicacion_almacenaje?.trim()) {
    errores.push("La ubicación de almacenaje es requerida");
  }

  if (!datos.condicion_armado?.trim()) {
    errores.push("La condición de armado es requerida");
  }

  if (!datos.estado?.trim()) {
    errores.push("El estado es requerido");
  }

  // Validación de fecha de vencimiento
  if (datos.fecha_vencimiento) {
    const fechaVencimiento = new Date(datos.fecha_vencimiento);
    const fechaTarja = new Date(datos.fecha_tarja);

    if (fechaVencimiento <= fechaTarja) {
      errores.push(
        "La fecha de vencimiento debe ser posterior a la fecha de tarja"
      );
    }
  }

  return errores;
}

/**
 * Valida un conjunto de datos usando un validador específico
 */
export function validarDatos(datos, tipoValidacion) {
  switch (tipoValidacion) {
    case "inventario":
      return validarDatosInventario(datos);
    case "trazabilidad":
      return validarDatosTrazabilidad(datos);
    case "recepcion-lotes":
      return validarDatosRecepcionLotes(datos);
    case "operaciones-frio-despacho":
      return validarDatosOperacionesFrioDespacho(datos);
    case "operacionesFrioDespacho":
      return validarOperacionFrioDespacho(datos);
    case "tarjas":
      return validarTarja(datos);
    default:
      throw new Error(`Tipo de validación no reconocido: ${tipoValidacion}`);
  }
}

/**
 * Formatea errores de validación para mostrar al usuario
 */
export function formatearErroresValidacion(errores) {
  if (!errores || errores.length === 0) {
    return null;
  }

  if (errores.length === 1) {
    return errores[0];
  }

  return `Se encontraron los siguientes errores:\n• ${errores.join("\n• ")}`;
}

// ============== VALIDADORES PARA FORMULARIOS ==============

/**
 * Objeto con validadores predefinidos para usar en formularios
 * Compatible con el composable usarFormulario
 */
export const validadores = {
  /**
   * Validador para campos requeridos
   */
  requerido: (valor) => {
    if (!valor || (typeof valor === "string" && !valor.trim())) {
      return "Este campo es requerido";
    }
    return null;
  },

  /**
   * Validador para longitud mínima
   */
  longitudMinima: (minimo) => (valor) => {
    if (!valor) return null; // Si no hay valor, que lo maneje el validador requerido
    if (valor.length < minimo) {
      return `Debe tener al menos ${minimo} caracteres`;
    }
    return null;
  },

  /**
   * Validador para longitud máxima
   */
  longitudMaxima: (maximo) => (valor) => {
    if (!valor) return null;
    if (valor.length > maximo) {
      return `No puede tener más de ${maximo} caracteres`;
    }
    return null;
  },

  /**
   * Validador para email
   */
  email: (valor) => {
    if (!valor) return null;
    const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!patronEmail.test(valor)) {
      return "Debe ser un email válido";
    }
    return null;
  },

  /**
   * Validador para números
   */
  numero: (valor) => {
    if (!valor) return null;
    if (isNaN(Number(valor))) {
      return "Debe ser un número válido";
    }
    return null;
  },

  /**
   * Validador para números positivos
   */
  numeroPositivo: (valor) => {
    if (!valor) return null;
    const numero = Number(valor);
    if (isNaN(numero)) {
      return "Debe ser un número válido";
    }
    if (numero < 0) {
      return "Debe ser un número positivo";
    }
    return null;
  },

  /**
   * Validador para rangos numéricos
   */
  rango: (minimo, maximo) => (valor) => {
    if (!valor) return null;
    const numero = Number(valor);
    if (isNaN(numero)) {
      return "Debe ser un número válido";
    }
    if (numero < minimo || numero > maximo) {
      return `Debe estar entre ${minimo} y ${maximo}`;
    }
    return null;
  },

  /**
   * Validador personalizado que recibe una función
   */
  personalizado: (funcionValidacion) => (valor) => {
    return funcionValidacion(valor);
  },
};
