import { ref, computed, watch } from "vue";

/**
 * Composable para manejo de formularios
 * Proporciona estado, validaciones y métodos para formularios
 */
export function usarFormulario(configuracion = {}) {
  // Estado del formulario
  const datos = ref({ ...configuracion.datosIniciales });
  const errores = ref({});
  const enviando = ref(false);
  const modificado = ref(false);
  const mensajeExito = ref("");
  const mensajeError = ref("");

  // Configuración
  const validaciones = configuracion.validaciones || {};
  const transformarDatos = configuracion.transformarDatos || ((d) => d);
  const validarAntesEnvio = configuracion.validarAntesEnvio || (() => true);

  // Computed
  const formularioValido = computed(() => {
    return Object.keys(errores.value).length === 0;
  });

  const hayCambios = computed(() => {
    return modificado.value;
  });

  // Métodos de validación
  function validarCampo(nombre, valor) {
    const validacion = validaciones[nombre];
    if (!validacion) return null;

    // Validación requerida
    if (validacion.requerido && (!valor || valor.toString().trim() === "")) {
      return validacion.mensajeRequerido || "Este campo es requerido";
    }

    // Validación de longitud mínima
    if (
      validacion.minLength &&
      valor &&
      valor.toString().length < validacion.minLength
    ) {
      return (
        validacion.mensajeMinLength ||
        `Mínimo ${validacion.minLength} caracteres`
      );
    }

    // Validación de longitud máxima
    if (
      validacion.maxLength &&
      valor &&
      valor.toString().length > validacion.maxLength
    ) {
      return (
        validacion.mensajeMaxLength ||
        `Máximo ${validacion.maxLength} caracteres`
      );
    }

    // Validación de patrón
    if (
      validacion.patron &&
      valor &&
      !validacion.patron.test(valor.toString())
    ) {
      return validacion.mensajePatron || "Formato inválido";
    }

    // Validación numérica
    if (validacion.tipo === "numero") {
      const numero = Number(valor);
      if (isNaN(numero)) {
        return validacion.mensajeNumero || "Debe ser un número válido";
      }
      if (validacion.min !== undefined && numero < validacion.min) {
        return validacion.mensajeMin || `Mínimo ${validacion.min}`;
      }
      if (validacion.max !== undefined && numero > validacion.max) {
        return validacion.mensajeMax || `Máximo ${validacion.max}`;
      }
    }

    // Validación de fecha
    if (validacion.tipo === "fecha") {
      const fecha = new Date(valor);
      if (isNaN(fecha.getTime())) {
        return validacion.mensajeFecha || "Fecha inválida";
      }
      if (validacion.noFutura && fecha > new Date()) {
        return validacion.mensajeNoFutura || "La fecha no puede ser futura";
      }
    }

    // Validación personalizada
    if (validacion.validar && typeof validacion.validar === "function") {
      const resultado = validacion.validar(valor, datos.value);
      if (resultado !== true) {
        return resultado;
      }
    }

    return null;
  }

  function validarFormulario() {
    const nuevosErrores = {};

    Object.keys(validaciones).forEach((nombre) => {
      const error = validarCampo(nombre, datos.value[nombre]);
      if (error) {
        nuevosErrores[nombre] = error;
      }
    });

    errores.value = nuevosErrores;
    return Object.keys(nuevosErrores).length === 0;
  }

  // Métodos de manejo de datos
  function actualizarCampo(nombre, valor) {
    datos.value[nombre] = valor;
    modificado.value = true;

    // Validar campo individual
    const error = validarCampo(nombre, valor);
    if (error) {
      errores.value[nombre] = error;
    } else {
      delete errores.value[nombre];
    }
  }

  function actualizarMultiplesCampos(campos) {
    Object.entries(campos).forEach(([nombre, valor]) => {
      actualizarCampo(nombre, valor);
    });
  }

  function obtenerCampo(nombre) {
    return datos.value[nombre];
  }

  function obtenerDatos() {
    return { ...datos.value };
  }

  // Métodos de estado
  function mostrarExito(mensaje) {
    mensajeExito.value = mensaje;
    mensajeError.value = "";
  }

  function mostrarError(mensaje) {
    mensajeError.value = mensaje;
    mensajeExito.value = "";
  }

  function limpiarMensajes() {
    mensajeExito.value = "";
    mensajeError.value = "";
  }

  function limpiarErrores() {
    errores.value = {};
  }

  function limpiarFormulario() {
    datos.value = { ...configuracion.datosIniciales };
    errores.value = {};
    modificado.value = false;
    limpiarMensajes();
  }

  function resetearFormulario() {
    limpiarFormulario();
  }

  // Métodos de envío
  async function enviarFormulario(callback) {
    if (!validarFormulario()) {
      return false;
    }

    if (!validarAntesEnvio()) {
      return false;
    }

    enviando.value = true;
    limpiarMensajes();

    try {
      const datosTransformados = transformarDatos(datos.value);
      const resultado = await callback(datosTransformados);

      mostrarExito("Datos guardados correctamente");
      modificado.value = false;

      return resultado;
    } catch (error) {
      const mensaje = error.message || "Error al procesar el formulario";
      mostrarError(mensaje);
      return false;
    } finally {
      enviando.value = false;
    }
  }

  // Métodos de utilidad
  function marcarComoModificado() {
    modificado.value = true;
  }

  function obtenerErrores() {
    return { ...errores.value };
  }

  function tieneError(nombre) {
    return Boolean(errores.value[nombre]);
  }

  function obtenerError(nombre) {
    return errores.value[nombre] || "";
  }

  // Watchers
  watch(
    datos,
    () => {
      modificado.value = true;
    },
    { deep: true }
  );

  // Retornar API del composable
  return {
    // Estado
    datos,
    errores,
    enviando,
    modificado,
    mensajeExito,
    mensajeError,

    // Configuración
    validaciones,

    // Computed
    formularioValido,
    hayCambios,

    // Métodos de validación
    validarCampo,
    validarFormulario,

    // Métodos de datos
    actualizarCampo,
    actualizarMultiplesCampos,
    obtenerCampo,
    obtenerDatos,

    // Métodos de estado
    mostrarExito,
    mostrarError,
    limpiarMensajes,
    limpiarErrores,
    limpiarFormulario,
    resetearFormulario,

    // Métodos de envío
    enviarFormulario,

    // Métodos de utilidad
    marcarComoModificado,
    obtenerErrores,
    tieneError,
    obtenerError,
  };
}

/**
 * Validaciones predefinidas comunes
 */
export const validacionesComunes = {
  requerido: {
    requerido: true,
    mensajeRequerido: "Este campo es requerido",
  },

  codigoMaterial: {
    requerido: true,
    minLength: 3,
    maxLength: 50,
    patron: /^[A-Z0-9\-_]+$/,
    mensajePatron: "Solo letras mayúsculas, números, guiones y guiones bajos",
  },

  nombreMaterial: {
    requerido: true,
    minLength: 3,
    maxLength: 300,
  },

  cantidad: {
    requerido: true,
    tipo: "numero",
    min: 0,
    mensajeMin: "La cantidad debe ser mayor o igual a 0",
  },

  pallets: {
    tipo: "numero",
    min: 0,
    mensajeMin: "Los pallets deben ser mayor o igual a 0",
  },

  fecha: {
    requerido: true,
    tipo: "fecha",
    noFutura: true,
    mensajeNoFutura: "La fecha no puede ser futura",
  },

  email: {
    requerido: true,
    patron: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    mensajePatron: "Formato de email inválido",
  },

  patenteCamion: {
    patron: /^[A-Z]{2}-[0-9]{4}|[0-9]{4}-[A-Z]{2}$/,
    mensajePatron: "Formato: XX-XXXX o XXXX-XX",
  },
};
