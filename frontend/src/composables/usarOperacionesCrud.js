import { ref } from "vue";
import clienteApi from "@/servicios/api";

/**
 * Composable para manejar operaciones CRUD de forma reutilizable
 * Proporciona estado de carga, error y funciones comunes
 */
export function usarOperacionesCrud() {
  // Estados reactivos
  const cargando = ref(false);
  const error = ref(null);
  const exito = ref(false);

  // Función genérica para obtener datos
  async function obtenerDatos(endpoint, parametros = {}) {
    cargando.value = true;
    error.value = null;

    try {
      const cadenaConsulta = new URLSearchParams(parametros).toString();
      const url = cadenaConsulta ? `${endpoint}?${cadenaConsulta}` : endpoint;

      const datos = await clienteApi(url);
      return datos;
    } catch (err) {
      error.value = err.message || "Error al obtener los datos";
      throw err;
    } finally {
      cargando.value = false;
    }
  }

  // Función genérica para crear registros
  async function crearRegistro(endpoint, datosRegistro) {
    cargando.value = true;
    error.value = null;
    exito.value = false;

    try {
      const datosCreados = await clienteApi(endpoint, {
        method: "POST",
        body: JSON.stringify(datosRegistro),
      });

      exito.value = true;
      return datosCreados;
    } catch (err) {
      error.value = err.message || "Error al crear el registro";
      throw err;
    } finally {
      cargando.value = false;
    }
  }

  // Función genérica para actualizar registros
  async function actualizarRegistro(endpoint, id, datosActualizados) {
    cargando.value = true;
    error.value = null;
    exito.value = false;

    try {
      const datosActualizadosRespuesta = await clienteApi(`${endpoint}/${id}`, {
        method: "PUT",
        body: JSON.stringify(datosActualizados),
      });

      exito.value = true;
      return datosActualizadosRespuesta;
    } catch (err) {
      error.value = err.message || "Error al actualizar el registro";
      throw err;
    } finally {
      cargando.value = false;
    }
  }

  // Función genérica para eliminar registros
  async function eliminarRegistro(endpoint, id) {
    cargando.value = true;
    error.value = null;
    exito.value = false;

    try {
      await clienteApi(`${endpoint}/${id}`, {
        method: "DELETE",
      });

      exito.value = true;
      return true;
    } catch (err) {
      error.value = err.message || "Error al eliminar el registro";
      throw err;
    } finally {
      cargando.value = false;
    }
  }

  // Función para limpiar mensajes
  function limpiarMensajes() {
    error.value = null;
    exito.value = false;
  }

  return {
    // Estados
    cargando,
    error,
    exito,

    // Métodos
    obtenerDatos,
    crearRegistro,
    actualizarRegistro,
    eliminarRegistro,
    limpiarMensajes,
  };
}
