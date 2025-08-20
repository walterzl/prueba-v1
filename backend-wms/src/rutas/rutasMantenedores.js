const express = require("express");
const ControladorMantenedores = require("../controladores/ControladorMantenedores");

const router = express.Router();

/**
 * Rutas de Mantenedores - APIs Centralizadas
 * Proporciona acceso a todos los datos maestros del sistema
 */

/**
 * @route GET /api/mantenedores
 * @desc Obtiene resumen de todos los mantenedores
 * @access Privado
 */
router.get("/", ControladorMantenedores.obtenerResumenMantenedores);

/**
 * @route GET /api/mantenedores/plantas
 * @desc Obtiene todas las plantas
 * @access Privado
 */
router.get("/plantas", ControladorMantenedores.obtenerPlantas);

/**
 * @route GET /api/mantenedores/materiales
 * @desc Obtiene todos los materiales
 * @access Privado
 * @query {boolean} activo - Filtrar por estado activo (default: true)
 */
router.get("/materiales", ControladorMantenedores.obtenerMateriales);

/**
 * @route GET /api/mantenedores/materiales/codigo/:codigo
 * @desc Obtiene un material por código
 * @access Privado
 * @param {string} codigo - Código del material
 */
router.get(
  "/materiales/codigo/:codigo",
  ControladorMantenedores.obtenerMaterialPorCodigo
);

/**
 * @route GET /api/mantenedores/proveedores
 * @desc Obtiene todos los proveedores
 * @access Privado
 * @query {boolean} activo - Filtrar por estado activo (default: true)
 */
router.get("/proveedores", ControladorMantenedores.obtenerProveedores);

/**
 * @route GET /api/mantenedores/proveedores/codigo/:codigo
 * @desc Obtiene un proveedor por código
 * @access Privado
 * @param {string} codigo - Código del proveedor
 */
router.get(
  "/proveedores/codigo/:codigo",
  ControladorMantenedores.obtenerProveedorPorCodigo
);

/**
 * @route GET /api/mantenedores/ubicaciones
 * @desc Obtiene todas las ubicaciones
 * @access Privado
 * @query {boolean} activo - Filtrar por estado activo (default: true)
 */
router.get("/ubicaciones", ControladorMantenedores.obtenerUbicaciones);

/**
 * @route GET /api/mantenedores/ubicaciones/planta/:planta
 * @desc Obtiene ubicaciones por planta
 * @access Privado
 * @param {string} planta - Código de la planta
 * @query {boolean} activo - Filtrar por estado activo (default: true)
 */
router.get(
  "/ubicaciones/planta/:planta",
  ControladorMantenedores.obtenerUbicacionesPorPlanta
);

/**
 * @route GET /api/mantenedores/temporadas
 * @desc Obtiene todas las temporadas
 * @access Privado
 */
router.get("/temporadas", ControladorMantenedores.obtenerTemporadas);

/**
 * @route GET /api/mantenedores/temporadas/activa
 * @desc Obtiene la temporada activa
 * @access Privado
 */
router.get(
  "/temporadas/activa",
  ControladorMantenedores.obtenerTemporadaActiva
);

/**
 * @route GET /api/mantenedores/tipos-movimiento
 * @desc Obtiene todos los tipos de movimiento
 * @access Privado
 * @query {boolean} activo - Filtrar por estado activo (default: true)
 */
router.get("/tipos-movimiento", ControladorMantenedores.obtenerTiposMovimiento);

/**
 * @route GET /api/mantenedores/unidades-medida
 * @desc Obtiene todas las unidades de medida
 * @access Privado
 */
router.get("/unidades-medida", ControladorMantenedores.obtenerUnidadesMedida);

/**
 * @route GET /api/mantenedores/tipos-tarja
 * @desc Obtiene todos los tipos de tarja únicos
 * @access Privado
 */
router.get("/tipos-tarja", ControladorMantenedores.obtenerTiposTarja);

/**
 * @route GET /api/mantenedores/tipos-operacion
 * @desc Obtiene todos los tipos de operación únicos
 * @access Privado
 */
router.get("/tipos-operacion", ControladorMantenedores.obtenerTiposOperacion);

/**
 * @route GET /api/mantenedores/turnos
 * @desc Obtiene todos los turnos únicos
 * @access Privado
 */
router.get("/turnos", ControladorMantenedores.obtenerTurnos);

/**
 * @route GET /api/mantenedores/bodegas
 * @desc Obtiene todas las bodegas únicas
 * @access Privado
 */
router.get("/bodegas", ControladorMantenedores.obtenerBodegas);

/**
 * @route GET /api/mantenedores/estados-tarja
 * @desc Obtiene todos los estados de tarja únicos
 * @access Privado
 */
router.get("/estados-tarja", ControladorMantenedores.obtenerEstadosTarja);

/**
 * @route GET /api/mantenedores/certificaciones-caa
 * @desc Obtiene certificaciones CAA predefinidas
 * @access Privado
 */
router.get(
  "/certificaciones-caa",
  ControladorMantenedores.obtenerCertificacionesCAA
);

/**
 * @route GET /api/mantenedores/prioridades
 * @desc Obtiene prioridades predefinidas
 * @access Privado
 */
router.get("/prioridades", ControladorMantenedores.obtenerPrioridades);

/**
 * @route GET /api/mantenedores/roles
 * @desc Obtiene roles de usuario predefinidos
 * @access Privado
 */
router.get("/roles", ControladorMantenedores.obtenerRoles);

// ========================================
// RUTAS POST PARA CREAR MANTENEDORES
// ========================================

/**
 * @route POST /api/mantenedores/materiales
 * @desc Crea un nuevo material
 * @access Privado
 */
router.post("/materiales", ControladorMantenedores.crearMaterial);

/**
 * @route POST /api/mantenedores/proveedores
 * @desc Crea un nuevo proveedor
 * @access Privado
 */
router.post("/proveedores", ControladorMantenedores.crearProveedor);

/**
 * @route POST /api/mantenedores/ubicaciones
 * @desc Crea una nueva ubicación
 * @access Privado
 */
router.post("/ubicaciones", ControladorMantenedores.crearUbicacion);

/**
 * @route POST /api/mantenedores/temporadas
 * @desc Crea una nueva temporada
 * @access Privado
 */
router.post("/temporadas", ControladorMantenedores.crearTemporada);

/**
 * @route POST /api/mantenedores/tipos-movimiento
 * @desc Crea un nuevo tipo de movimiento
 * @access Privado
 */
router.post("/tipos-movimiento", ControladorMantenedores.crearTipoMovimiento);

module.exports = router;
