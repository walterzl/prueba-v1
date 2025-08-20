const express = require("express");
const ControladorConsultasAnidadas = require("../controladores/ControladorConsultasAnidadas");

const router = express.Router();

/**
 * Rutas de Consultas Anidadas
 * Maneja las consultas dinámicas para campos anidados en formularios
 */

/**
 * @route GET /api/campos-anidados/:formulario/:campo/opciones
 * @desc Obtiene las opciones para un campo anidado específico
 * @access Privado
 * @param {string} formulario - Nombre del formulario
 * @param {string} campo - Nombre del campo
 * @query {string} filtros - Filtros en formato JSON
 * @query {string} busqueda - Término de búsqueda
 * @query {number} limite - Límite de resultados (default: 50)
 */
router.get(
  "/:formulario/:campo/opciones",
  ControladorConsultasAnidadas.obtenerOpcionesCampo
);

/**
 * @route GET /api/campos-anidados/:formulario/:campo/opciones-paginadas
 * @desc Obtiene las opciones para un campo anidado con paginación
 * @access Privado
 * @param {string} formulario - Nombre del formulario
 * @param {string} campo - Nombre del campo
 * @query {string} filtros - Filtros en formato JSON
 * @query {string} busqueda - Término de búsqueda
 * @query {number} pagina - Número de página (default: 1)
 * @query {number} tamanoPagina - Tamaño de página (default: 25)
 * @query {string} ordenarPor - Campo por el que ordenar (default: 'nombre')
 * @query {string} direccion - Dirección de ordenamiento asc/desc (default: 'asc')
 */
router.get(
  "/:formulario/:campo/opciones-paginadas",
  ControladorConsultasAnidadas.obtenerOpcionesPaginadas
);

/**
 * @route GET /api/campos-anidados/:formulario/configuracion
 * @desc Obtiene la configuración completa de campos para un formulario
 * @access Privado
 * @param {string} formulario - Nombre del formulario
 */
router.get(
  "/:formulario/configuracion",
  ControladorConsultasAnidadas.obtenerConfiguracionFormulario
);

/**
 * @route GET /api/campos-anidados/:formulario/buscar-multiples
 * @desc Busca opciones en múltiples campos de forma simultánea
 * @access Privado
 * @param {string} formulario - Nombre del formulario
 * @query {string} campos - Lista de campos separados por coma
 * @query {string} busqueda - Término de búsqueda
 * @query {number} limite - Límite de resultados por campo (default: 20)
 */
router.get(
  "/:formulario/buscar-multiples",
  ControladorConsultasAnidadas.buscarOpcionesMultiples
);

/**
 * @route GET /api/campos-anidados/:formulario/:campo/validar/:valor
 * @desc Valida un valor específico para un campo
 * @access Privado
 * @param {string} formulario - Nombre del formulario
 * @param {string} campo - Nombre del campo
 * @param {string} valor - Valor a validar
 */
router.get(
  "/:formulario/:campo/validar/:valor",
  ControladorConsultasAnidadas.validarValorCampo
);

module.exports = router;
