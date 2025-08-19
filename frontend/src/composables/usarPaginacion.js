import { ref, computed } from "vue";

/**
 * Composable para manejar paginación de forma reutilizable
 */
export function usarPaginacion(configuracion = 15) {
  // Normalizar configuración - puede ser un número o un objeto
  const config =
    typeof configuracion === "number"
      ? { elementosPorPagina: configuracion, paginaActual: 1 }
      : { elementosPorPagina: 15, paginaActual: 1, ...configuracion };

  // Estados reactivos
  const paginaActual = ref(config.paginaActual);
  const totalRegistros = ref(0);
  const limite = ref(config.elementosPorPagina);

  // Alias para compatibilidad
  const elementosPorPagina = limite;

  // Computadas
  const totalPaginas = computed(() =>
    Math.ceil(totalRegistros.value / limite.value)
  );
  const inicio = computed(() => (paginaActual.value - 1) * limite.value + 1);
  const fin = computed(() =>
    Math.min(paginaActual.value * limite.value, totalRegistros.value)
  );

  // Verificar si se puede ir a la página anterior
  const puedeAnterior = computed(() => paginaActual.value > 1);

  // Verificar si se puede ir a la página siguiente
  const puedeSiguiente = computed(
    () => paginaActual.value < totalPaginas.value
  );

  // Métodos
  function irAPagina(numeroPagina) {
    if (numeroPagina >= 1 && numeroPagina <= totalPaginas.value) {
      paginaActual.value = numeroPagina;
    }
  }

  function paginaAnterior() {
    if (puedeAnterior.value) {
      paginaActual.value--;
    }
  }

  function paginaSiguiente() {
    if (puedeSiguiente.value) {
      paginaActual.value++;
    }
  }

  function establecerDatosPaginacion(datosPaginacion) {
    if (datosPaginacion.pagina_actual) {
      paginaActual.value = datosPaginacion.pagina_actual;
    }
    if (datosPaginacion.total_registros) {
      totalRegistros.value = datosPaginacion.total_registros;
    }
    if (datosPaginacion.limite) {
      limite.value = datosPaginacion.limite;
    }
  }

  function reiniciarPaginacion() {
    paginaActual.value = 1;
    totalRegistros.value = 0;
  }

  // Obtener parámetros para la consulta
  function obtenerParametrosPaginacion() {
    return {
      pagina: paginaActual.value,
      limite: limite.value,
    };
  }

  return {
    // Estados
    paginaActual,
    totalRegistros,
    limite,
    elementosPorPagina, // Alias para compatibilidad

    // Computadas
    totalPaginas,
    inicio,
    fin,
    puedeAnterior,
    puedeSiguiente,

    // Métodos
    irAPagina,
    paginaAnterior,
    paginaSiguiente,
    establecerDatosPaginacion,
    reiniciarPaginacion,
    obtenerParametrosPaginacion,
  };
}
