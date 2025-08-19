import { ref } from "vue";
import { api } from "@/servicios/api";

/**
 * Composable simplificado para operaciones CRUD
 * Proporciona funcionalidad común para crear, leer, actualizar y eliminar datos
 */
export function usarOperacionesCrud() {
  // Estados reactivos
  const cargando = ref(false);
  const error = ref(null);
  const exito = ref(false);

  /**
   * Obtiene datos de un endpoint con parámetros opcionales
   * @param {string} puntoFinal - Endpoint de la API
   * @param {Object} parametros - Parámetros de consulta
   * @returns {Promise<any>} Datos obtenidos
   */
  async function obtenerDatos(puntoFinal, parametros = {}) {
    return await ejecutarOperacion(async () => {
      return await api.obtener(puntoFinal, parametros);
    });
  }

  /**
   * Crea un nuevo registro
   * @param {string} puntoFinal - Endpoint de la API
   * @param {Object} datosRegistro - Datos del registro a crear
   * @returns {Promise<any>} Registro creado
   */
  async function crearRegistro(puntoFinal, datosRegistro) {
    return await ejecutarOperacion(async () => {
      const resultado = await api.crear(puntoFinal, datosRegistro);
      exito.value = true;
      return resultado;
    });
  }

  /**
   * Actualiza un registro existente
   * @param {string} puntoFinal - Endpoint base de la API
   * @param {string|number} id - ID del registro a actualizar
   * @param {Object} datosActualizados - Datos actualizados
   * @returns {Promise<any>} Registro actualizado
   */
  async function actualizarRegistro(puntoFinal, id, datosActualizados) {
    return await ejecutarOperacion(async () => {
      const resultado = await api.actualizar(
        `${puntoFinal}/${id}`,
        datosActualizados
      );
      exito.value = true;
      return resultado;
    });
  }

  /**
   * Elimina un registro
   * @param {string} puntoFinal - Endpoint base de la API
   * @param {string|number} id - ID del registro a eliminar
   * @returns {Promise<boolean>} True si se eliminó correctamente
   */
  async function eliminarRegistro(puntoFinal, id) {
    return await ejecutarOperacion(async () => {
      await api.eliminar(`${puntoFinal}/${id}`);
      exito.value = true;
      return true;
    });
  }

  /**
   * Ejecuta una operación con manejo de estado común
   * @param {Function} operacion - Función asíncrona a ejecutar
   * @returns {Promise<any>} Resultado de la operación
   */
  async function ejecutarOperacion(operacion) {
    cargando.value = true;
    error.value = null;
    exito.value = false;

    try {
      return await operacion();
    } catch (err) {
      error.value = err.message || "Error en la operación";
      throw err;
    } finally {
      cargando.value = false;
    }
  }

  /**
   * Limpia los mensajes de error y éxito
   */
  function limpiarMensajes() {
    error.value = null;
    exito.value = false;
  }

  /**
   * Reinicia todos los estados a sus valores iniciales
   */
  function reiniciarEstados() {
    cargando.value = false;
    error.value = null;
    exito.value = false;
  }

  // Interfaz pública del composable
  return {
    // Estados reactivos
    cargando,
    error,
    exito,

    // Operaciones CRUD
    obtenerDatos,
    crearRegistro,
    actualizarRegistro,
    eliminarRegistro,

    // Utilidades
    limpiarMensajes,
    reiniciarEstados,
  };
}
