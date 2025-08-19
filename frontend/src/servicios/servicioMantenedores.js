import clienteApi from "@/servicios/api";
import { usarCacheDatos } from "@/composables/usarCacheDatos";

/**
 * Servicio optimizado para gestionar todos los mantenedores del sistema
 * Utiliza cache para reducir peticiones innecesarias
 */

// Instancia del composable de cache
const { obtenerConCache, invalidarCachePorPatron, generarClaveCache } =
  usarCacheDatos();

export const servicioMantenedores = {
  // ============== MATERIALES ==============
  /**
   * Obtiene todos los materiales disponibles (con cache)
   */
  async obtenerMateriales() {
    return obtenerConCache("mantenedores_materiales", async () => {
      try {
        const respuesta = await clienteApi("/mantenedores/materiales");
        return respuesta?.datos || respuesta || [];
      } catch (error) {
        console.error("Error al obtener materiales:", error);
        return [];
      }
    });
  },

  /**
   * Busca un material por su código
   */
  async obtenerMaterialPorCodigo(codigo) {
    if (!codigo?.trim()) {
      throw new Error("El código del material es requerido");
    }
    try {
      const respuesta = await clienteApi(
        `/mantenedores/materiales/codigo/${codigo}`
      );
      return respuesta?.datos || respuesta;
    } catch (error) {
      console.error("Error al obtener material por código:", error);
      return null;
    }
  },

  /**
   * Busca materiales que contengan el término de búsqueda
   */
  async buscarMateriales(termino) {
    if (!termino?.trim()) {
      return [];
    }
    try {
      const queryString = new URLSearchParams({ buscar: termino }).toString();
      const respuesta = await clienteApi(
        `/mantenedores/materiales?${queryString}`
      );
      return respuesta?.datos || respuesta || [];
    } catch (error) {
      console.error("Error al buscar materiales:", error);
      return [];
    }
  },

  /**
   * Crea un nuevo material
   */
  async crearMaterial(datosMaterial) {
    this._validarDatosMaterial(datosMaterial);
    try {
      const respuesta = await clienteApi("/mantenedores/materiales", {
        method: "POST",
        body: JSON.stringify(datosMaterial),
      });

      // Invalidar cache de materiales
      invalidarCachePorPatron("mantenedores_materiales");

      return respuesta?.datos || respuesta;
    } catch (error) {
      console.error("Error al crear material:", error);
      throw error;
    }
  },

  /**
   * Actualiza un material existente
   */
  async actualizarMaterial(id, datosMaterial) {
    this._validarDatosMaterial(datosMaterial);
    try {
      const respuesta = await clienteApi(`/mantenedores/materiales/${id}`, {
        method: "PUT",
        body: JSON.stringify(datosMaterial),
      });
      return respuesta?.datos || respuesta;
    } catch (error) {
      console.error("Error al actualizar material:", error);
      throw error;
    }
  },

  // ============== PROVEEDORES ==============
  /**
   * Obtiene todos los proveedores (con cache)
   */
  async obtenerProveedores() {
    return obtenerConCache("mantenedores_proveedores", async () => {
      try {
        const respuesta = await clienteApi("/mantenedores/proveedores");
        return respuesta?.datos || respuesta || [];
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
        return [];
      }
    });
  },

  /**
   * Busca un proveedor por código
   */
  async obtenerProveedorPorCodigo(codigo) {
    if (!codigo?.trim()) {
      throw new Error("El código del proveedor es requerido");
    }
    try {
      const respuesta = await clienteApi(
        `/mantenedores/proveedores/codigo/${codigo}`
      );
      return respuesta?.datos || respuesta;
    } catch (error) {
      console.error("Error al obtener proveedor por código:", error);
      return null;
    }
  },

  /**
   * Crea un nuevo proveedor
   */
  async crearProveedor(datosProveedor) {
    this._validarDatosProveedor(datosProveedor);
    try {
      const respuesta = await clienteApi("/mantenedores/proveedores", {
        method: "POST",
        body: JSON.stringify(datosProveedor),
      });

      // Invalidar cache de proveedores
      invalidarCachePorPatron("mantenedores_proveedores");

      return respuesta?.datos || respuesta;
    } catch (error) {
      console.error("Error al crear proveedor:", error);
      throw error;
    }
  },

  // ============== UBICACIONES ==============
  /**
   * Obtiene todas las ubicaciones del sistema (con cache)
   */
  async obtenerUbicaciones() {
    return obtenerConCache("mantenedores_ubicaciones", async () => {
      try {
        const respuesta = await clienteApi("/mantenedores/ubicaciones");
        return respuesta?.datos || respuesta || [];
      } catch (error) {
        console.error("Error al obtener ubicaciones:", error);
        return [];
      }
    });
  },

  /**
   * Obtiene ubicaciones filtradas por planta (con cache)
   */
  async obtenerUbicacionesPorPlanta(planta) {
    if (!planta?.trim()) {
      throw new Error("La planta es requerida");
    }

    const claveCache = generarClaveCache("mantenedores_ubicaciones_planta", {
      planta,
    });

    return obtenerConCache(claveCache, async () => {
      try {
        const respuesta = await clienteApi(
          `/mantenedores/ubicaciones/planta/${planta}`
        );
        return respuesta?.datos || respuesta || [];
      } catch (error) {
        console.error("Error al obtener ubicaciones por planta:", error);
        return [];
      }
    });
  },

  /**
   * Crea una nueva ubicación
   */
  async crearUbicacion(datosUbicacion) {
    this._validarDatosUbicacion(datosUbicacion);
    try {
      const respuesta = await clienteApi("/mantenedores/ubicaciones", {
        method: "POST",
        body: JSON.stringify(datosUbicacion),
      });

      // Invalidar cache de ubicaciones
      invalidarCachePorPatron("mantenedores_ubicaciones");

      return respuesta?.datos || respuesta;
    } catch (error) {
      console.error("Error al crear ubicación:", error);
      throw error;
    }
  },

  // ============== PLANTAS ==============
  /**
   * Obtiene todas las plantas disponibles
   */
  async obtenerPlantas() {
    try {
      const respuesta = await clienteApi("/mantenedores/plantas");
      return respuesta?.datos || respuesta || [];
    } catch (error) {
      console.error("Error al obtener plantas:", error);
      return [];
    }
  },

  // ============== TEMPORADAS ==============
  /**
   * Obtiene todas las temporadas
   */
  async obtenerTemporadas() {
    try {
      const respuesta = await clienteApi("/mantenedores/temporadas");
      return respuesta?.datos || respuesta || [];
    } catch (error) {
      console.error("Error al obtener temporadas:", error);
      return [];
    }
  },

  /**
   * Obtiene la temporada activa actual
   */
  async obtenerTemporadaActiva() {
    try {
      const respuesta = await clienteApi("/mantenedores/temporadas/activa");
      return respuesta?.datos || respuesta;
    } catch (error) {
      console.error("Error al obtener temporada activa:", error);
      return null;
    }
  },

  /**
   * Crea una nueva temporada
   */
  async crearTemporada(datosTemporada) {
    this._validarDatosTemporada(datosTemporada);
    try {
      const respuesta = await clienteApi("/mantenedores/temporadas", {
        method: "POST",
        body: JSON.stringify(datosTemporada),
      });
      return respuesta?.datos || respuesta;
    } catch (error) {
      console.error("Error al crear temporada:", error);
      throw error;
    }
  },

  // ============== TIPOS DE MOVIMIENTO ==============
  /**
   * Obtiene todos los tipos de movimiento
   */
  async obtenerTiposMovimiento() {
    try {
      const respuesta = await clienteApi("/mantenedores/tipos-movimiento");
      return respuesta?.datos || respuesta || [];
    } catch (error) {
      console.error("Error al obtener tipos de movimiento:", error);
      return [];
    }
  },

  /**
   * Crea un nuevo tipo de movimiento
   */
  async crearTipoMovimiento(datosTipoMovimiento) {
    this._validarDatosTipoMovimiento(datosTipoMovimiento);
    try {
      const respuesta = await clienteApi("/mantenedores/tipos-movimiento", {
        method: "POST",
        body: JSON.stringify(datosTipoMovimiento),
      });
      return respuesta?.datos || respuesta;
    } catch (error) {
      console.error("Error al crear tipo de movimiento:", error);
      throw error;
    }
  },

  // ============== MÉTODOS DE VALIDACIÓN PRIVADOS ==============
  /**
   * Valida los datos de un material antes de enviarlo al servidor
   */
  _validarDatosMaterial(datos) {
    const errores = [];

    if (!datos.codigo_ranco?.trim()) {
      errores.push("El código del material es requerido");
    }

    if (!datos.nombre_material?.trim()) {
      errores.push("El nombre del material es requerido");
    }

    if (!datos.clasificacion?.trim()) {
      errores.push("La clasificación del material es requerida");
    }

    if (!datos.unidad_medida?.trim()) {
      errores.push("La unidad de medida es requerida");
    }

    if (errores.length > 0) {
      throw new Error(`Errores de validación: ${errores.join(", ")}`);
    }
  },

  /**
   * Valida los datos de un proveedor
   */
  _validarDatosProveedor(datos) {
    const errores = [];

    if (!datos.title?.trim()) {
      errores.push("El nombre del proveedor es requerido");
    }

    if (errores.length > 0) {
      throw new Error(`Errores de validación: ${errores.join(", ")}`);
    }
  },

  /**
   * Valida los datos de una ubicación
   */
  _validarDatosUbicacion(datos) {
    const errores = [];

    if (!datos.title?.trim()) {
      errores.push("El nombre de la ubicación es requerido");
    }

    if (!datos.bodega_deposito?.trim()) {
      errores.push("La bodega/depósito es requerida");
    }

    if (!datos.planta?.trim()) {
      errores.push("La planta es requerida");
    }

    if (errores.length > 0) {
      throw new Error(`Errores de validación: ${errores.join(", ")}`);
    }
  },

  /**
   * Valida los datos de una temporada
   */
  _validarDatosTemporada(datos) {
    const errores = [];

    if (!datos.title?.trim()) {
      errores.push("El nombre de la temporada es requerido");
    }

    if (errores.length > 0) {
      throw new Error(`Errores de validación: ${errores.join(", ")}`);
    }
  },

  /**
   * Valida los datos de un tipo de movimiento
   */
  _validarDatosTipoMovimiento(datos) {
    const errores = [];

    if (!datos.title?.trim()) {
      errores.push("El nombre del tipo de movimiento es requerido");
    }

    if (errores.length > 0) {
      throw new Error(`Errores de validación: ${errores.join(", ")}`);
    }
  },
};

export default servicioMantenedores;
