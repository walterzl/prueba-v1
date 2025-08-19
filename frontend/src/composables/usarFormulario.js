import { ref, reactive, computed, readonly } from "vue";
import {
  validarDatos,
  formatearErroresValidacion,
} from "@/utilidades/validaciones";

/**
 * Composable para manejar formularios con validación y estado
 * Proporciona funcionalidades comunes para todos los formularios del sistema
 */
export function usarFormulario(configuracion = {}) {
  const {
    datosIniciales = {},
    tipoValidacion = null,
    funcionValidacionPersonalizada = null,
    validarEnTiempoReal = true,
  } = configuracion;

  // Estado reactivo del formulario
  const formulario = reactive({ ...datosIniciales });
  const erroresCampos = ref({});
  const erroresGenerales = ref([]);
  const cargandoEnvio = ref(false);
  const tocado = ref(new Set()); // Campos que han sido tocados por el usuario

  // Estado computado
  const tieneErrores = computed(() => {
    return (
      Object.keys(erroresCampos.value).length > 0 ||
      erroresGenerales.value.length > 0
    );
  });

  const formularioValido = computed(() => {
    return !tieneErrores.value;
  });

  const todosLosCamposTocados = computed(() => {
    const camposFormulario = Object.keys(datosIniciales);
    return camposFormulario.every((campo) => tocado.value.has(campo));
  });

  // ============== MÉTODOS PRINCIPALES ==============

  /**
   * Reinicia el formulario a sus valores iniciales
   */
  function reiniciarFormulario() {
    Object.keys(formulario).forEach((clave) => {
      formulario[clave] = datosIniciales[clave] ?? "";
    });
    limpiarErrores();
    tocado.value.clear();
  }

  /**
   * Valida todo el formulario
   */
  function validarFormulario() {
    limpiarErrores();

    try {
      let erroresValidacion = [];

      // Usar validación por tipo si está especificada
      if (tipoValidacion) {
        erroresValidacion = validarDatos(formulario, tipoValidacion);
      }
      // Usar función de validación personalizada
      else if (funcionValidacionPersonalizada) {
        erroresValidacion = funcionValidacionPersonalizada(formulario);
      }

      // Procesar errores
      if (erroresValidacion && erroresValidacion.length > 0) {
        erroresGenerales.value = erroresValidacion;
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error en validación:", error);
      erroresGenerales.value = ["Error en la validación del formulario"];
      return false;
    }
  }

  /**
   * Valida un campo específico
   */
  function validarCampo(nombreCampo) {
    if (!validarEnTiempoReal) return;

    // Solo validar si el campo ha sido tocado
    if (!tocado.value.has(nombreCampo)) return;

    try {
      // Para validación de campo individual, creamos un objeto temporal
      // solo con el campo a validar y ejecutamos validación completa
      const formularioTemporal = { ...formulario };

      let erroresValidacion = [];
      if (tipoValidacion) {
        erroresValidacion = validarDatos(formularioTemporal, tipoValidacion);
      } else if (funcionValidacionPersonalizada) {
        erroresValidacion = funcionValidacionPersonalizada(formularioTemporal);
      }

      // Limpiar error previo del campo
      if (erroresCampos.value[nombreCampo]) {
        delete erroresCampos.value[nombreCampo];
      }

      // Si hay errores, buscar los relacionados con este campo
      if (erroresValidacion.length > 0) {
        const errorDelCampo = erroresValidacion.find((error) =>
          error.toLowerCase().includes(nombreCampo.toLowerCase())
        );
        if (errorDelCampo) {
          erroresCampos.value[nombreCampo] = errorDelCampo;
        }
      }
    } catch (error) {
      console.error(`Error validando campo ${nombreCampo}:`, error);
    }
  }

  /**
   * Maneja el envío del formulario
   */
  async function manejarEnvio(funcionEnvio, opciones = {}) {
    const {
      mostrarConfirmacion = false,
      mensajeConfirmacion = "¿Está seguro que desea guardar los cambios?",
    } = opciones;

    // Mostrar confirmación si se solicita
    if (mostrarConfirmacion) {
      const confirmado = confirm(mensajeConfirmacion);
      if (!confirmado) return false;
    }

    // Validar formulario antes del envío
    if (!validarFormulario()) {
      return false;
    }

    cargandoEnvio.value = true;
    limpiarErrores();

    try {
      const resultado = await funcionEnvio({ ...formulario });
      return resultado;
    } catch (error) {
      const mensajeError = error.message || "Error al procesar el formulario";
      erroresGenerales.value = [mensajeError];
      console.error("Error en envío de formulario:", error);
      return false;
    } finally {
      cargandoEnvio.value = false;
    }
  }

  // ============== MÉTODOS DE MANIPULACIÓN DE DATOS ==============

  /**
   * Actualiza un campo específico del formulario
   */
  function actualizarCampo(nombreCampo, valor) {
    formulario[nombreCampo] = valor;
    marcarCampoComoTocado(nombreCampo);

    // Validar campo en tiempo real si está habilitado
    if (validarEnTiempoReal) {
      setTimeout(() => validarCampo(nombreCampo), 300); // Debounce de 300ms
    }
  }

  /**
   * Actualiza múltiples campos a la vez
   */
  function actualizarCampos(nuevosDatos) {
    Object.entries(nuevosDatos).forEach(([campo, valor]) => {
      actualizarCampo(campo, valor);
    });
  }

  /**
   * Obtiene el valor de un campo
   */
  function obtenerValorCampo(nombreCampo) {
    return formulario[nombreCampo];
  }

  /**
   * Marca un campo como tocado por el usuario
   */
  function marcarCampoComoTocado(nombreCampo) {
    tocado.value.add(nombreCampo);
  }

  // ============== MÉTODOS DE GESTIÓN DE ERRORES ==============

  /**
   * Limpia todos los errores
   */
  function limpiarErrores() {
    erroresCampos.value = {};
    erroresGenerales.value = [];
  }

  /**
   * Limpia el error de un campo específico
   */
  function limpiarErrorCampo(nombreCampo) {
    if (erroresCampos.value[nombreCampo]) {
      delete erroresCampos.value[nombreCampo];
    }
  }

  /**
   * Agrega un error personalizado
   */
  function agregarError(mensaje, nombreCampo = null) {
    if (nombreCampo) {
      erroresCampos.value[nombreCampo] = mensaje;
    } else {
      erroresGenerales.value.push(mensaje);
    }
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  function obtenerErrorCampo(nombreCampo) {
    return erroresCampos.value[nombreCampo] || null;
  }

  /**
   * Obtiene todos los errores formateados para mostrar al usuario
   */
  function obtenerErroresFormateados() {
    const errores = [...erroresGenerales.value];

    // Agregar errores de campos
    Object.values(erroresCampos.value).forEach((error) => {
      if (!errores.includes(error)) {
        errores.push(error);
      }
    });

    return formatearErroresValidacion(errores);
  }

  // ============== MÉTODOS DE UTILIDAD ==============

  /**
   * Establece valores por defecto para campos vacíos
   */
  function establecerValoresPorDefecto(valoresPorDefecto) {
    Object.entries(valoresPorDefecto).forEach(([campo, valor]) => {
      if (!formulario[campo] || formulario[campo] === "") {
        formulario[campo] = valor;
      }
    });
  }

  /**
   * Verifica si el formulario ha sido modificado
   */
  function formularioModificado() {
    return Object.keys(datosIniciales).some(
      (campo) => formulario[campo] !== datosIniciales[campo]
    );
  }

  /**
   * Obtiene solo los campos que han sido modificados
   */
  function obtenerCamposModificados() {
    const camposModificados = {};
    Object.keys(datosIniciales).forEach((campo) => {
      if (formulario[campo] !== datosIniciales[campo]) {
        camposModificados[campo] = formulario[campo];
      }
    });
    return camposModificados;
  }

  return {
    // Estado
    formulario,
    erroresCampos: readonly(erroresCampos),
    erroresGenerales: readonly(erroresGenerales),
    cargandoEnvio: readonly(cargandoEnvio),

    // Estado computado
    tieneErrores,
    formularioValido,
    todosLosCamposTocados,

    // Métodos principales
    reiniciarFormulario,
    validarFormulario,
    validarCampo,
    manejarEnvio,

    // Manipulación de datos
    actualizarCampo,
    actualizarCampos,
    obtenerValorCampo,
    marcarCampoComoTocado,

    // Gestión de errores
    limpiarErrores,
    limpiarErrorCampo,
    agregarError,
    obtenerErrorCampo,
    obtenerErroresFormateados,

    // Utilidades
    establecerValoresPorDefecto,
    formularioModificado,
    obtenerCamposModificados,
  };
}
