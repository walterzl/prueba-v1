const prisma = require("../configuracion/prismaClient");
const CONSTANTES = require("../configuracion/constantes");
const ManejadorRespuestas = require("../utilidades/ManejadorRespuestas");
const ServicioBaseCRUD = require("../servicios/ServicioBaseCRUD");

/**
 * Controlador de Mantenedores - APIs Centralizadas
 * Maneja todas las operaciones relacionadas con datos maestros del sistema
 */
class ControladorMantenedores {
  /**
   * Obtiene todas las plantas del sistema
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerPlantas(req, res) {
    try {
      const plantas = Object.entries(CONSTANTES.PLANTAS).map(
        ([clave, valor]) => ({
          codigo: valor,
          nombre: valor,
          descripcion: `Planta ${valor}`,
        })
      );

      return ManejadorRespuestas.exito(
        res,
        plantas,
        "Plantas obtenidas exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener plantas:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener plantas",
        "ERROR_OBTENER_PLANTAS"
      );
    }
  }

  /**
   * Obtiene todos los materiales
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerMateriales(req, res) {
    try {
      const { activo = true } = req.query;

      const materiales = await prisma.materiales.findMany({
        where: {
          activo: activo === "true" || activo === true,
        },
        select: {
          id: true,
          codigo_ranco: true,
          nombre_material: true,
          unidad_medida: true,
          frio: true,
          activo: true,
        },
        orderBy: {
          nombre_material: "asc",
        },
      });

      // Formatear datos para mantener compatibilidad con frontend
      const materialesFormateados = materiales.map((material) => ({
        id: material.id,
        codigo: material.codigo_ranco,
        nombre: material.nombre_material,
        unidad_medida: material.unidad_medida,
        requiere_frio: material.frio === "Si" || material.frio === "Sí",
        activo: material.activo,
      }));

      return ManejadorRespuestas.exito(
        res,
        materialesFormateados,
        "Materiales obtenidos exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener materiales:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener materiales",
        "ERROR_OBTENER_MATERIALES"
      );
    }
  }

  /**
   * Obtiene un material por código
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerMaterialPorCodigo(req, res) {
    try {
      const { codigo } = req.params;

      const material = await prisma.materiales.findFirst({
        where: {
          codigo_ranco: codigo,
          activo: true,
        },
        select: {
          id: true,
          codigo_ranco: true,
          nombre_material: true,
          unidad_medida: true,
          frio: true,
          activo: true,
        },
      });

      if (!material) {
        return ManejadorRespuestas.noEncontrado(
          res,
          `Material con código ${codigo} no encontrado`
        );
      }

      const materialFormateado = {
        id: material.id,
        codigo: material.codigo_ranco,
        nombre: material.nombre_material,
        unidad_medida: material.unidad_medida,
        requiere_frio: material.frio === "Si" || material.frio === "Sí",
        activo: material.activo,
      };

      return ManejadorRespuestas.exito(
        res,
        materialFormateado,
        "Material obtenido exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener material por código:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener material",
        "ERROR_OBTENER_MATERIAL"
      );
    }
  }

  /**
   * Obtiene todos los proveedores
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerProveedores(req, res) {
    try {
      const { activo = true } = req.query;

      const proveedores = await prisma.proveedores.findMany({
        where: {
          activo: activo === "true" || activo === true,
        },
        select: {
          id: true,
          title: true,
          activo: true,
        },
        orderBy: {
          title: "asc",
        },
      });

      // Formatear datos para mantener compatibilidad con frontend
      const proveedoresFormateados = proveedores.map((proveedor) => ({
        id: proveedor.id,
        codigo: `PROV${proveedor.id.toString().padStart(3, "0")}`,
        nombre: proveedor.title,
        rut: null,
        contacto: null,
        telefono: null,
        email: null,
        activo: proveedor.activo,
      }));

      return ManejadorRespuestas.exito(
        res,
        proveedoresFormateados,
        "Proveedores obtenidos exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener proveedores",
        "ERROR_OBTENER_PROVEEDORES"
      );
    }
  }

  /**
   * Obtiene un proveedor por código
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerProveedorPorCodigo(req, res) {
    try {
      const { codigo } = req.params;

      if (!codigo) {
        return ManejadorRespuestas.validacionFallida(
          res,
          ["Código de proveedor requerido"],
          "Datos de entrada inválidos"
        );
      }

      // Buscar por ID si el código es numérico (extraer número del formato PROV###)
      let whereClause;
      if (codigo.startsWith("PROV")) {
        const id = parseInt(codigo.replace("PROV", ""));
        if (!isNaN(id)) {
          whereClause = { id: id, activo: true };
        } else {
          whereClause = {
            title: { contains: codigo, mode: "insensitive" },
            activo: true,
          };
        }
      } else {
        whereClause = {
          title: { contains: codigo, mode: "insensitive" },
          activo: true,
        };
      }

      const proveedor = await prisma.proveedores.findFirst({
        where: whereClause,
        select: {
          id: true,
          title: true,
          activo: true,
        },
      });

      if (!proveedor) {
        return ManejadorRespuestas.noEncontrado(
          res,
          `Proveedor con código ${codigo} no encontrado`
        );
      }

      const proveedorFormateado = {
        id: proveedor.id,
        codigo: `PROV${proveedor.id.toString().padStart(3, "0")}`,
        nombre: proveedor.title,
        rut: null,
        contacto: null,
        telefono: null,
        email: null,
        activo: proveedor.activo,
      };

      return ManejadorRespuestas.exito(
        res,
        proveedorFormateado,
        "Proveedor obtenido exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener proveedor por código:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener proveedor",
        "ERROR_OBTENER_PROVEEDOR"
      );
    }
  }

  /**
   * Obtiene todas las ubicaciones
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerUbicaciones(req, res) {
    try {
      const { activo = true } = req.query;

      const ubicaciones = await prisma.ubicacion.findMany({
        where: {
          activo: activo === "true" || activo === true,
        },
        select: {
          id: true,
          title: true,
          bodega_deposito: true,
          planta: true,
          activo: true,
        },
        orderBy: [
          { planta: "asc" },
          { bodega_deposito: "asc" },
          { title: "asc" },
        ],
      });

      // Formatear datos para mantener compatibilidad con frontend
      const ubicacionesFormateadas = ubicaciones.map((ubicacion) => ({
        id: ubicacion.id,
        codigo: `UB${ubicacion.id.toString().padStart(3, "0")}`,
        nombre: ubicacion.title,
        bodega: ubicacion.bodega_deposito,
        planta: ubicacion.planta,
        tipo: "bodega",
        activo: ubicacion.activo,
      }));

      return ManejadorRespuestas.exito(
        res,
        ubicacionesFormateadas,
        "Ubicaciones obtenidas exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener ubicaciones:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener ubicaciones",
        "ERROR_OBTENER_UBICACIONES"
      );
    }
  }

  /**
   * Obtiene ubicaciones por planta
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerUbicacionesPorPlanta(req, res) {
    try {
      const { planta } = req.params;
      const { activo = true } = req.query;

      if (!planta) {
        return ManejadorRespuestas.validacionFallida(
          res,
          ["Planta requerida"],
          "Datos de entrada inválidos"
        );
      }

      const ubicaciones = await prisma.ubicacion.findMany({
        where: {
          planta: {
            equals: planta,
            mode: "insensitive",
          },
          activo: activo === "true" || activo === true,
        },
        select: {
          id: true,
          title: true,
          bodega_deposito: true,
          planta: true,
          activo: true,
        },
        orderBy: [{ bodega_deposito: "asc" }, { title: "asc" }],
      });

      const ubicacionesFormateadas = ubicaciones.map((ubicacion) => ({
        id: ubicacion.id,
        codigo: `UB${ubicacion.id.toString().padStart(3, "0")}`,
        nombre: ubicacion.title,
        bodega: ubicacion.bodega_deposito,
        planta: ubicacion.planta,
        tipo: "bodega",
        activo: ubicacion.activo,
      }));

      return ManejadorRespuestas.exito(
        res,
        ubicacionesFormateadas,
        `Ubicaciones de planta ${planta.toUpperCase()} obtenidas exitosamente`
      );
    } catch (error) {
      console.error("Error al obtener ubicaciones por planta:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener ubicaciones por planta",
        "ERROR_OBTENER_UBICACIONES_PLANTA"
      );
    }
  }

  /**
   * Obtiene todas las temporadas
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerTemporadas(req, res) {
    try {
      const { activo = true } = req.query;

      const temporadas = await prisma.temporadas_app.findMany({
        where: {
          activo: activo === "true" || activo === true,
        },
        select: {
          id: true,
          title: true,
          fecha_inicio: true,
          fecha_fin: true,
          activo: true,
        },
        orderBy: {
          fecha_inicio: "desc",
        },
      });

      return ManejadorRespuestas.exito(
        res,
        temporadas,
        "Temporadas obtenidas exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener temporadas:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener temporadas",
        "ERROR_OBTENER_TEMPORADAS"
      );
    }
  }

  /**
   * Obtiene la temporada activa
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerTemporadaActiva(req, res) {
    try {
      const temporadaActiva = await prisma.temporadas_app.findFirst({
        where: {
          activo: true,
        },
        select: {
          id: true,
          title: true,
          fecha_inicio: true,
          fecha_fin: true,
          activo: true,
        },
      });

      if (!temporadaActiva) {
        return ManejadorRespuestas.noEncontrado(
          res,
          "No hay temporada activa configurada"
        );
      }

      const temporadaFormateada = {
        id: temporadaActiva.id,
        codigo: temporadaActiva.title,
        nombre: temporadaActiva.title,
        fecha_inicio: temporadaActiva.fecha_inicio,
        fecha_termino: temporadaActiva.fecha_fin,
        activa: temporadaActiva.activo,
      };

      return ManejadorRespuestas.exito(
        res,
        temporadaFormateada,
        "Temporada activa obtenida exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener temporada activa:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener temporada activa",
        "ERROR_OBTENER_TEMPORADA_ACTIVA"
      );
    }
  }

  /**
   * Obtiene todos los tipos de movimiento
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerTiposMovimiento(req, res) {
    try {
      const { activo = true } = req.query;

      const tiposMovimiento = await prisma.tipo_movimientos_app.findMany({
        where: {
          activo: activo === "true" || activo === true,
        },
        select: {
          id: true,
          title: true,
          descripcion: true,
          activo: true,
        },
        orderBy: {
          title: "asc",
        },
      });

      const tiposMovimientoFormateados = tiposMovimiento.map((tipo) => ({
        id: tipo.id,
        codigo: tipo.title,
        nombre: tipo.title,
        descripcion: tipo.descripcion,
        activo: tipo.activo,
      }));

      return ManejadorRespuestas.exito(
        res,
        tiposMovimientoFormateados,
        "Tipos de movimiento obtenidos exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener tipos de movimiento:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener tipos de movimiento",
        "ERROR_OBTENER_TIPOS_MOVIMIENTO"
      );
    }
  }

  /**
   * Obtiene todas las unidades de medida disponibles
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerUnidadesMedida(req, res) {
    try {
      const unidadesMedida = Object.entries(CONSTANTES.UNIDADES_MEDIDA).map(
        ([clave, valor]) => ({
          codigo: valor,
          nombre: clave.toLowerCase().replace(/_/g, " "),
          descripcion: valor,
        })
      );

      return ManejadorRespuestas.exito(
        res,
        unidadesMedida,
        "Unidades de medida obtenidas exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener unidades de medida:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener unidades de medida",
        "ERROR_OBTENER_UNIDADES_MEDIDA"
      );
    }
  }

  /**
   * Crea un nuevo material
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async crearMaterial(req, res) {
    try {
      const {
        codigo_ranco,
        nombre_material,
        clasificacion,
        unidad_medida,
        frio = "No",
        activo = true,
      } = req.body;

      // Validaciones básicas
      const erroresValidacion = [];
      if (!codigo_ranco) erroresValidacion.push("Código Ranco es requerido");
      if (!nombre_material)
        erroresValidacion.push("Nombre del material es requerido");
      if (!unidad_medida)
        erroresValidacion.push("Unidad de medida es requerida");

      if (erroresValidacion.length > 0) {
        return ManejadorRespuestas.validacionFallida(
          res,
          erroresValidacion,
          "Datos de entrada inválidos"
        );
      }

      // Verificar que no exista el código
      const materialExistente = await prisma.materiales.findFirst({
        where: {
          codigo_ranco: codigo_ranco.toUpperCase(),
        },
      });

      if (materialExistente) {
        return ManejadorRespuestas.conflicto(
          res,
          `Ya existe un material con código ${codigo_ranco}`,
          "MATERIAL_DUPLICADO"
        );
      }

      // Crear material
      const codNombre = `${codigo_ranco.toUpperCase()} - ${nombre_material}`;

      const nuevoMaterial = await prisma.materiales.create({
        data: {
          codigo_ranco: codigo_ranco.toUpperCase(),
          nombre_material,
          clasificacion: clasificacion || null,
          unidad_medida: unidad_medida || null,
          frio: frio === "Si" || frio === "Sí" || frio === true ? "Si" : "No",
          cod_nombre: codNombre,
          activo,
        },
      });

      const materialFormateado = {
        id: nuevoMaterial.id,
        codigo: nuevoMaterial.codigo_ranco,
        nombre: nuevoMaterial.nombre_material,
        clasificacion: nuevoMaterial.clasificacion,
        unidad_medida: nuevoMaterial.unidad_medida,
        requiere_frio: nuevoMaterial.frio === "Si",
        cod_nombre: nuevoMaterial.cod_nombre,
        activo: nuevoMaterial.activo,
        fecha_creacion: nuevoMaterial.fecha_creacion,
      };

      return ManejadorRespuestas.exito(
        res,
        materialFormateado,
        "Material creado exitosamente",
        201
      );
    } catch (error) {
      console.error("Error al crear material:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al crear material",
        "ERROR_CREAR_MATERIAL"
      );
    }
  }

  /**
   * Crea un nuevo proveedor
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async crearProveedor(req, res) {
    try {
      const {
        title,
        ingreso_proveedores_100 = 0,
        total_general = 0,
        activo = true,
      } = req.body;

      // Validaciones básicas
      const erroresValidacion = [];
      if (!title)
        erroresValidacion.push("Nombre del proveedor (title) es requerido");

      if (erroresValidacion.length > 0) {
        return ManejadorRespuestas.validacionFallida(
          res,
          erroresValidacion,
          "Datos de entrada inválidos"
        );
      }

      // Verificar que no exista el proveedor
      const proveedorExistente = await prisma.proveedores.findFirst({
        where: {
          title: title.toUpperCase(),
        },
      });

      if (proveedorExistente) {
        return ManejadorRespuestas.conflicto(
          res,
          `Ya existe un proveedor con nombre ${title}`,
          "PROVEEDOR_DUPLICADO"
        );
      }

      // Crear proveedor
      const nuevoProveedor = await prisma.proveedores.create({
        data: {
          title: title.toUpperCase(),
          ingreso_proveedores_100: parseFloat(ingreso_proveedores_100) || 0,
          total_general: parseFloat(total_general) || 0,
          activo,
        },
      });

      return ManejadorRespuestas.exito(
        res,
        nuevoProveedor,
        "Proveedor creado exitosamente",
        201
      );
    } catch (error) {
      console.error("Error al crear proveedor:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al crear proveedor",
        "ERROR_CREAR_PROVEEDOR"
      );
    }
  }

  /**
   * Crea una nueva ubicación
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async crearUbicacion(req, res) {
    try {
      const { title, bodega_deposito, planta, activo = true } = req.body;

      // Validaciones básicas
      const erroresValidacion = [];
      if (!title) erroresValidacion.push("Código de ubicación es requerido");
      if (!bodega_deposito)
        erroresValidacion.push("Bodega/Depósito es requerido");
      if (!planta) erroresValidacion.push("Planta es requerida");

      if (erroresValidacion.length > 0) {
        return ManejadorRespuestas.validacionFallida(
          res,
          erroresValidacion,
          "Datos de entrada inválidos"
        );
      }

      // Verificar que no exista la ubicación
      const ubicacionExistente = await prisma.ubicacion.findFirst({
        where: {
          title: title.toUpperCase(),
        },
      });

      if (ubicacionExistente) {
        return ManejadorRespuestas.conflicto(
          res,
          `Ya existe una ubicación con código ${title}`,
          "UBICACION_DUPLICADA"
        );
      }

      // Crear ubicación
      const nuevaUbicacion = await prisma.ubicacion.create({
        data: {
          title: title.toUpperCase(),
          bodega_deposito: bodega_deposito.toUpperCase(),
          planta: planta.toUpperCase(),
          activo,
        },
      });

      const ubicacionFormateada = {
        id: nuevaUbicacion.id,
        codigo: nuevaUbicacion.title,
        bodega: nuevaUbicacion.bodega_deposito,
        planta: nuevaUbicacion.planta,
        activo: nuevaUbicacion.activo,
        fecha_creacion: nuevaUbicacion.fecha_creacion,
      };

      return ManejadorRespuestas.exito(
        res,
        ubicacionFormateada,
        "Ubicación creada exitosamente",
        201
      );
    } catch (error) {
      console.error("Error al crear ubicación:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al crear ubicación",
        "ERROR_CREAR_UBICACION"
      );
    }
  }

  /**
   * Crea una nueva temporada
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async crearTemporada(req, res) {
    try {
      const { title, fecha_inicio, fecha_fin, activo = false } = req.body;

      // Validaciones básicas
      const erroresValidacion = [];
      if (!title) erroresValidacion.push("Nombre de temporada es requerido");
      if (!fecha_inicio) erroresValidacion.push("Fecha de inicio es requerida");
      if (!fecha_fin) erroresValidacion.push("Fecha de fin es requerida");

      if (erroresValidacion.length > 0) {
        return ManejadorRespuestas.validacionFallida(
          res,
          erroresValidacion,
          "Datos de entrada inválidos"
        );
      }

      // Validar fechas
      const fechaInicio = new Date(fecha_inicio);
      const fechaFin = new Date(fecha_fin);

      if (fechaInicio >= fechaFin) {
        return ManejadorRespuestas.validacionFallida(
          res,
          ["La fecha de inicio debe ser anterior a la fecha de fin"],
          "Fechas inválidas"
        );
      }

      // Si se marca como activa, desactivar otras temporadas
      if (activo) {
        await prisma.temporadas_app.updateMany({
          where: { activo: true },
          data: { activo: false },
        });
      }

      // Crear temporada
      const nuevaTemporada = await prisma.temporadas_app.create({
        data: {
          title,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          activo,
        },
      });

      return ManejadorRespuestas.exito(
        res,
        nuevaTemporada,
        "Temporada creada exitosamente",
        201
      );
    } catch (error) {
      console.error("Error al crear temporada:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al crear temporada",
        "ERROR_CREAR_TEMPORADA"
      );
    }
  }

  /**
   * Crea un nuevo tipo de movimiento
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async crearTipoMovimiento(req, res) {
    try {
      const { title, descripcion, activo = true } = req.body;

      // Validaciones básicas
      const erroresValidacion = [];
      if (!title)
        erroresValidacion.push("Nombre del tipo de movimiento es requerido");

      if (erroresValidacion.length > 0) {
        return ManejadorRespuestas.validacionFallida(
          res,
          erroresValidacion,
          "Datos de entrada inválidos"
        );
      }

      // Verificar que no exista el tipo
      const tipoExistente = await prisma.tipo_movimientos_app.findFirst({
        where: {
          title: title.toUpperCase(),
        },
      });

      if (tipoExistente) {
        return ManejadorRespuestas.conflicto(
          res,
          `Ya existe un tipo de movimiento con nombre ${title}`,
          "TIPO_MOVIMIENTO_DUPLICADO"
        );
      }

      // Crear tipo de movimiento
      const nuevoTipo = await prisma.tipo_movimientos_app.create({
        data: {
          title: title.toUpperCase(),
          descripcion,
          activo,
        },
      });

      const tipoFormateado = {
        id: nuevoTipo.id,
        codigo: nuevoTipo.title,
        nombre: nuevoTipo.title,
        descripcion: nuevoTipo.descripcion,
        activo: nuevoTipo.activo,
        fecha_creacion: nuevoTipo.fecha_creacion,
      };

      return ManejadorRespuestas.exito(
        res,
        tipoFormateado,
        "Tipo de movimiento creado exitosamente",
        201
      );
    } catch (error) {
      console.error("Error al crear tipo de movimiento:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al crear tipo de movimiento",
        "ERROR_CREAR_TIPO_MOVIMIENTO"
      );
    }
  }

  /**
   * Obtiene todos los tipos de tarja únicos del sistema
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerTiposTarja(req, res) {
    try {
      const tiposTarja = await prisma.tarjas.findMany({
        select: {
          tipo_tarja: true,
        },
        distinct: ["tipo_tarja"],
        orderBy: {
          tipo_tarja: "asc",
        },
      });

      const tiposFormateados = tiposTarja.map((item) => ({
        value: item.tipo_tarja,
        label: item.tipo_tarja,
        title: item.tipo_tarja,
      }));

      return ManejadorRespuestas.exito(
        res,
        tiposFormateados,
        "Tipos de tarja obtenidos exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener tipos de tarja:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener tipos de tarja",
        "ERROR_OBTENER_TIPOS_TARJA"
      );
    }
  }

  /**
   * Obtiene todos los tipos de operación únicos del sistema
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerTiposOperacion(req, res) {
    try {
      const tiposOperacion = await prisma.operaciones_frio_despacho.findMany({
        select: {
          tipo_operacion: true,
        },
        distinct: ["tipo_operacion"],
        orderBy: {
          tipo_operacion: "asc",
        },
      });

      const tiposFormateados = tiposOperacion.map((item) => ({
        value: item.tipo_operacion,
        label: item.tipo_operacion,
        title: item.tipo_operacion,
      }));

      return ManejadorRespuestas.exito(
        res,
        tiposFormateados,
        "Tipos de operación obtenidos exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener tipos de operación:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener tipos de operación",
        "ERROR_OBTENER_TIPOS_OPERACION"
      );
    }
  }

  /**
   * Obtiene todos los turnos únicos del sistema
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerTurnos(req, res) {
    try {
      const turnos = await prisma.operaciones_frio_despacho.findMany({
        select: {
          turno: true,
        },
        distinct: ["turno"],
        where: {
          turno: {
            not: null,
          },
        },
        orderBy: {
          turno: "asc",
        },
      });

      const turnosFormateados = turnos.map((item) => ({
        value: item.turno,
        label: item.turno,
        title: item.turno,
      }));

      return ManejadorRespuestas.exito(
        res,
        turnosFormateados,
        "Turnos obtenidos exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener turnos:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener turnos",
        "ERROR_OBTENER_TURNOS"
      );
    }
  }

  /**
   * Obtiene todas las bodegas únicas del sistema
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerBodegas(req, res) {
    try {
      const bodegas = await prisma.ubicacion.findMany({
        select: {
          bodega_deposito: true,
        },
        distinct: ["bodega_deposito"],
        where: {
          bodega_deposito: {
            not: null,
          },
          activo: true,
        },
        orderBy: {
          bodega_deposito: "asc",
        },
      });

      const bodegasFormateadas = bodegas.map((item) => ({
        value: item.bodega_deposito,
        label: item.bodega_deposito,
        title: item.bodega_deposito,
      }));

      return ManejadorRespuestas.exito(
        res,
        bodegasFormateadas,
        "Bodegas obtenidas exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener bodegas:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener bodegas",
        "ERROR_OBTENER_BODEGAS"
      );
    }
  }

  /**
   * Obtiene todos los estados de tarja únicos del sistema
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerEstadosTarja(req, res) {
    try {
      const estados = await prisma.tarjas.findMany({
        select: {
          estado: true,
        },
        distinct: ["estado"],
        where: {
          estado: {
            not: null,
          },
        },
        orderBy: {
          estado: "asc",
        },
      });

      const estadosFormateados = estados.map((item) => ({
        value: item.estado,
        label: item.estado,
        title: item.estado,
      }));

      return ManejadorRespuestas.exito(
        res,
        estadosFormateados,
        "Estados de tarja obtenidos exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener estados de tarja:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener estados de tarja",
        "ERROR_OBTENER_ESTADOS_TARJA"
      );
    }
  }

  /**
   * Obtiene certificaciones CAA predefinidas
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerCertificacionesCAA(req, res) {
    try {
      // Certificaciones CAA típicas del sector agrícola
      const certificaciones = [
        {
          value: "ORGÁNICO",
          label: "Orgánico",
          title: "Certificación Orgánica",
        },
        {
          value: "GAP",
          label: "Good Agricultural Practices",
          title: "Buenas Prácticas Agrícolas",
        },
        {
          value: "HACCP",
          label: "HACCP",
          title: "Análisis de Peligros y Puntos Críticos de Control",
        },
        { value: "BRC", label: "BRC", title: "British Retail Consortium" },
        {
          value: "IFS",
          label: "IFS",
          title: "International Featured Standards",
        },
        { value: "SQF", label: "SQF", title: "Safe Quality Food" },
        {
          value: "RAINFOREST",
          label: "Rainforest Alliance",
          title: "Rainforest Alliance",
        },
        { value: "FAIRTRADE", label: "Fair Trade", title: "Comercio Justo" },
        {
          value: "SIN_CERTIFICACION",
          label: "Sin Certificación",
          title: "Sin Certificación",
        },
      ];

      return ManejadorRespuestas.exito(
        res,
        certificaciones,
        "Certificaciones CAA obtenidas exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener certificaciones CAA:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener certificaciones CAA",
        "ERROR_OBTENER_CERTIFICACIONES_CAA"
      );
    }
  }

  /**
   * Obtiene prioridades predefinidas
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerPrioridades(req, res) {
    try {
      const prioridades = [
        { value: "ALTA", label: "Alta", title: "Prioridad Alta" },
        { value: "MEDIA", label: "Media", title: "Prioridad Media" },
        { value: "BAJA", label: "Baja", title: "Prioridad Baja" },
        { value: "URGENTE", label: "Urgente", title: "Prioridad Urgente" },
      ];

      return ManejadorRespuestas.exito(
        res,
        prioridades,
        "Prioridades obtenidas exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener prioridades:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener prioridades",
        "ERROR_OBTENER_PRIORIDADES"
      );
    }
  }

  /**
   * Obtiene todos los roles de usuario predefinidos
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerRoles(req, res) {
    try {
      const roles = [
        {
          value: "admin",
          label: "Administrador",
          descripcion: "Acceso total al sistema",
        },
        {
          value: "supervisor",
          label: "Supervisor",
          descripcion: "Supervisa operaciones y genera reportes",
        },
        {
          value: "operador",
          label: "Operador",
          descripcion: "Opera el sistema de inventario",
        },
        {
          value: "consulta",
          label: "Solo Consulta",
          descripcion: "Solo puede consultar información",
        },
      ];

      return ManejadorRespuestas.exito(
        res,
        roles,
        "Roles obtenidos exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener roles:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener roles",
        "ERROR_OBTENER_ROLES"
      );
    }
  }

  /**
   * Obtiene resumen de todos los mantenedores
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerResumenMantenedores(req, res) {
    try {
      const [
        totalMateriales,
        totalProveedores,
        totalUbicaciones,
        temporadaActiva,
        totalTiposMovimiento,
      ] = await Promise.all([
        prisma.materiales.count({ where: { activo: true } }),
        prisma.proveedores.count({ where: { activo: true } }),
        prisma.ubicacion.count({ where: { activo: true } }),
        prisma.temporadas_app.findFirst({ where: { activo: true } }),
        prisma.tipo_movimientos_app.count({ where: { activo: true } }),
      ]);

      const resumen = {
        materiales: totalMateriales,
        proveedores: totalProveedores,
        ubicaciones: totalUbicaciones,
        tiposMovimiento: totalTiposMovimiento,
        plantas: Object.keys(CONSTANTES.PLANTAS).length,
        unidadesMedida: Object.keys(CONSTANTES.UNIDADES_MEDIDA).length,
        temporadaActiva: temporadaActiva ? temporadaActiva.title : null,
      };

      return ManejadorRespuestas.exito(
        res,
        resumen,
        "Resumen de mantenedores obtenido exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener resumen de mantenedores:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener resumen de mantenedores",
        "ERROR_OBTENER_RESUMEN_MANTENEDORES"
      );
    }
  }
}

module.exports = ControladorMantenedores;
