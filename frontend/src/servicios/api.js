import { usarAlmacenAutenticacion } from "@/almacen/almacenAuth";

const URL_BASE_API = "/api";

/**
 * Cliente HTTP genérico para realizar peticiones a la API
 * Maneja automáticamente la autenticación y errores comunes
 */
const clienteApi = async (puntoFinal, opciones = {}) => {
  const almacenAuth = usarAlmacenAutenticacion();

  // Configurar cabeceras por defecto
  const cabeceras = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...opciones.headers,
  };

  // Agregar token de autenticación si está disponible
  if (almacenAuth.token) {
    cabeceras["Authorization"] = `Bearer ${almacenAuth.token}`;
  }

  const configuracion = {
    mode: "cors",
    credentials: "include",
    ...opciones,
    headers: cabeceras,
  };

  try {
    const urlCompleta = `${URL_BASE_API}${puntoFinal}`;
    console.log(
      `Realizando petición ${configuracion.method || "GET"} a:`,
      urlCompleta
    );

    const respuesta = await fetch(urlCompleta, configuracion);

    // Intentar obtener datos JSON
    let datos = null;
    const tipoContenido = respuesta.headers.get("content-type");

    if (tipoContenido && tipoContenido.includes("application/json")) {
      datos = await respuesta.json();
    }

    // Manejar respuestas no exitosas
    if (!respuesta.ok) {
      // Sesión expirada o no autorizada
      if (respuesta.status === 401 || respuesta.status === 403) {
        console.warn("Sesión expirada, redirigiendo al login...");
        almacenAuth.limpiarSesion();
        window.location.replace("/login");
        return;
      }

      // Error del servidor
      const mensajeError =
        datos?.mensaje ||
        datos?.error ||
        `Error ${respuesta.status}: ${respuesta.statusText}`;

      throw new Error(mensajeError);
    }

    // Retornar la respuesta completa para que cada servicio maneje su propia extracción
    return datos || { success: true };
  } catch (error) {
    // Error de red o conexión
    if (error instanceof TypeError) {
      console.error(`Error de conexión al endpoint ${puntoFinal}:`, error);
      throw new Error(
        "Error de conexión con el servidor. Verifique su conexión a internet."
      );
    }

    console.error(`Error en petición a ${puntoFinal}:`, error.message);
    throw error;
  }
};

/**
 * Métodos de conveniencia para diferentes tipos de peticiones HTTP
 */
export const api = {
  /**
   * Realiza una petición GET
   */
  obtener: (puntoFinal, parametros = {}) => {
    const cadenaConsulta = new URLSearchParams(parametros).toString();
    const url = cadenaConsulta ? `${puntoFinal}?${cadenaConsulta}` : puntoFinal;
    return clienteApi(url);
  },

  /**
   * Realiza una petición POST
   */
  crear: (puntoFinal, datos) => {
    return clienteApi(puntoFinal, {
      method: "POST",
      body: JSON.stringify(datos),
    });
  },

  /**
   * Realiza una petición PUT
   */
  actualizar: (puntoFinal, datos) => {
    return clienteApi(puntoFinal, {
      method: "PUT",
      body: JSON.stringify(datos),
    });
  },

  /**
   * Realiza una petición PATCH
   */
  actualizarParcial: (puntoFinal, datos) => {
    return clienteApi(puntoFinal, {
      method: "PATCH",
      body: JSON.stringify(datos),
    });
  },

  /**
   * Realiza una petición DELETE
   */
  eliminar: (puntoFinal) => {
    return clienteApi(puntoFinal, {
      method: "DELETE",
    });
  },
};

export default clienteApi;
