const prisma = require("../configuracion/prismaClient");
const ManejadorRespuestas = require("../utilidades/ManejadorRespuestas");
const {
  obtenerConfiguracionCampo,
  obtenerCamposFormulario,
  validarDependencias,
  construirFiltros,
  formatearDisplay,
  CAMPOS_ESPECIALES,
} = require("../configuracion/camposAnidados");

/**
 * Controlador de Consultas Anidadas
 * Maneja las consultas dinámicas para campos anidados en formularios
 */
class ControladorConsultasAnidadas {
  /**
   * Obtiene las opciones para un campo anidado específico
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerOpcionesCampo(req, res) {
    try {
      const { formulario, campo } = req.params;
      const { filtros = {}, busqueda = "", limite = 50 } = req.query;

      // Obtener configuración del campo
      const config = obtenerConfiguracionCampo(formulario, campo);
      if (!config) {
        return ManejadorRespuestas.noEncontrado(
          res,
          `Campo ${campo} no encontrado para formulario ${formulario}`
        );
      }

      // Validar dependencias
      const datos = req.query;
      if (!validarDependencias(formulario, campo, datos)) {
        return ManejadorRespuestas.validacionFallida(
          res,
          [
            `Campo ${campo} requiere que se complete ${config.dependsOn} primero`,
          ],
          "Dependencias no satisfechas"
        );
      }

      let opciones = [];

      // Si el campo tiene datos estáticos
      if (config.data) {
        opciones = config.data;
      } else {
        // Construir filtros dinámicos
        const filtrosDinamicos = construirFiltros(formulario, campo, datos);

        // Parsear filtros solo si es una cadena
        let filtrosParsed = {};
        if (filtros) {
          if (typeof filtros === "string") {
            try {
              filtrosParsed = JSON.parse(filtros);
            } catch (e) {
              console.warn("Error parsing filtros:", e);
              filtrosParsed = {};
            }
          } else {
            filtrosParsed = filtros;
          }
        }

        const filtrosCompletos = {
          ...filtrosDinamicos,
          ...filtrosParsed,
        };

        // Obtener datos según el tipo de campo
        opciones = await ControladorConsultasAnidadas.obtenerDatosSegunTipo(
          campo,
          config,
          filtrosCompletos,
          busqueda,
          parseInt(limite)
        );
      }

      // Aplicar búsqueda si se proporciona
      if (busqueda && config.searchFields) {
        const busquedaLower = busqueda.toLowerCase();
        opciones = opciones.filter((item) => {
          return config.searchFields.some((field) => {
            const valor = item[field];
            return (
              valor && valor.toString().toLowerCase().includes(busquedaLower)
            );
          });
        });
      }

      // Formatear opciones para el frontend
      const opcionesFormateadas = opciones.map((item) => ({
        value: item[config.valueField],
        label:
          formatearDisplay(item, config.displayTemplate) ||
          item[config.labelField],
        data: item, // Datos completos para uso adicional
      }));

      return ManejadorRespuestas.exito(
        res,
        opcionesFormateadas,
        `Opciones para ${campo} obtenidas exitosamente`
      );
    } catch (error) {
      console.error("Error al obtener opciones de campo:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener opciones de campo",
        "ERROR_OBTENER_OPCIONES_CAMPO"
      );
    }
  }

  /**
   * Obtiene la configuración completa de campos para un formulario
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerConfiguracionFormulario(req, res) {
    try {
      const { formulario } = req.params;

      const configuracion = obtenerCamposFormulario(formulario);
      if (!configuracion || Object.keys(configuracion).length === 0) {
        return ManejadorRespuestas.noEncontrado(
          res,
          `Configuración no encontrada para formulario ${formulario}`
        );
      }

      // Enriquecer configuración con información adicional
      const configuracionEnriquecida = {};
      for (const [campo, config] of Object.entries(configuracion)) {
        configuracionEnriquecida[campo] = {
          ...config,
          hasStaticData: !!config.data,
          isDynamic: !config.data,
          searchable: !!(config.searchFields && config.searchFields.length > 0),
          hasTemplate: !!config.displayTemplate,
        };
      }

      return ManejadorRespuestas.exito(
        res,
        configuracionEnriquecida,
        `Configuración de formulario ${formulario} obtenida exitosamente`
      );
    } catch (error) {
      console.error("Error al obtener configuración de formulario:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener configuración de formulario",
        "ERROR_OBTENER_CONFIGURACION_FORMULARIO"
      );
    }
  }

  /**
   * Busca opciones en múltiples campos de forma simultánea
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async buscarOpcionesMultiples(req, res) {
    try {
      const { formulario } = req.params;
      const { campos, busqueda = "", limite = 20 } = req.query;

      if (!campos) {
        return ManejadorRespuestas.validacionFallida(
          res,
          ["Parámetro 'campos' es requerido"],
          "Datos de entrada inválidos"
        );
      }

      const listaCampos = campos.split(",");
      const resultados = {};

      // Procesar cada campo de forma paralela
      const promesas = listaCampos.map(async (campo) => {
        try {
          const config = obtenerConfiguracionCampo(formulario, campo);
          if (!config) {
            return { campo, opciones: [], error: "Campo no encontrado" };
          }

          let opciones = [];
          if (config.data) {
            opciones = config.data;
          } else {
            opciones = await ControladorConsultasAnidadas.obtenerDatosSegunTipo(
              campo,
              config,
              {},
              busqueda,
              parseInt(limite)
            );
          }

          // Aplicar búsqueda
          if (busqueda && config.searchFields) {
            const busquedaLower = busqueda.toLowerCase();
            opciones = opciones.filter((item) => {
              return config.searchFields.some((field) => {
                const valor = item[field];
                return (
                  valor &&
                  valor.toString().toLowerCase().includes(busquedaLower)
                );
              });
            });
          }

          // Formatear opciones
          const opcionesFormateadas = opciones
            .slice(0, parseInt(limite))
            .map((item) => ({
              value: item[config.valueField],
              label:
                formatearDisplay(item, config.displayTemplate) ||
                item[config.labelField],
              data: item,
            }));

          return { campo, opciones: opcionesFormateadas };
        } catch (error) {
          console.error(`Error procesando campo ${campo}:`, error);
          return { campo, opciones: [], error: error.message };
        }
      });

      const resultadosArray = await Promise.all(promesas);

      // Convertir array a objeto
      resultadosArray.forEach((resultado) => {
        resultados[resultado.campo] = {
          opciones: resultado.opciones,
          error: resultado.error || null,
        };
      });

      return ManejadorRespuestas.exito(
        res,
        resultados,
        `Búsqueda múltiple completada para formulario ${formulario}`
      );
    } catch (error) {
      console.error("Error en búsqueda múltiple:", error);
      return ManejadorRespuestas.error(
        res,
        "Error en búsqueda múltiple",
        "ERROR_BUSQUEDA_MULTIPLE"
      );
    }
  }

  /**
   * Valida un valor específico para un campo
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async validarValorCampo(req, res) {
    try {
      const { formulario, campo, valor } = req.params;

      const config = obtenerConfiguracionCampo(formulario, campo);
      if (!config) {
        return ManejadorRespuestas.noEncontrado(
          res,
          `Campo ${campo} no encontrado para formulario ${formulario}`
        );
      }

      let valido = false;
      let datosItem = null;

      if (config.data) {
        // Buscar en datos estáticos
        const item = config.data.find(
          (item) => item[config.valueField].toString() === valor.toString()
        );
        valido = !!item;
        datosItem = item;
      } else {
        // Validar en base de datos
        const resultado = await ControladorConsultasAnidadas.validarEnBaseDatos(
          campo,
          config,
          valor
        );
        valido = resultado.valido;
        datosItem = resultado.datos;
      }

      return ManejadorRespuestas.exito(
        res,
        {
          valido,
          valor: datosItem
            ? {
                value: datosItem[config.valueField],
                label:
                  formatearDisplay(datosItem, config.displayTemplate) ||
                  datosItem[config.labelField],
                data: datosItem,
              }
            : null,
        },
        valido
          ? `Valor ${valor} es válido para ${campo}`
          : `Valor ${valor} no es válido para ${campo}`
      );
    } catch (error) {
      console.error("Error al validar valor de campo:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al validar valor de campo",
        "ERROR_VALIDAR_VALOR_CAMPO"
      );
    }
  }

  /**
   * Obtiene datos según el tipo de campo
   * @private
   */
  static async obtenerDatosSegunTipo(campo, config, filtros, busqueda, limite) {
    const busquedaCondition =
      busqueda && config.searchFields
        ? {
            OR: config.searchFields.map((field) => ({
              [field]: {
                contains: busqueda,
                mode: "insensitive",
              },
            })),
          }
        : {};

    switch (campo) {
      case "materiales":
        return await prisma.materiales.findMany({
          where: {
            ...filtros,
            ...busquedaCondition,
          },
          select: {
            id: true,
            codigo_ranco: true,
            nombre_material: true,
            unidad_medida: true,
            clasificacion: true,
            frio: true,
            cod_nombre: true,
            activo: true,
          },
          take: limite,
          orderBy: { nombre_material: "asc" },
        });

      case "proveedores":
        return await prisma.proveedores.findMany({
          where: {
            ...filtros,
            ...busquedaCondition,
          },
          select: {
            id: true,
            title: true,
            activo: true,
          },
          take: limite,
          orderBy: { title: "asc" },
        });

      case "ubicaciones":
      case "ubicaciones_origen":
      case "ubicaciones_destino":
        return await prisma.ubicacion
          .findMany({
            where: {
              ...filtros,
              ...busquedaCondition,
            },
            select: {
              id: true,
              title: true,
              bodega_deposito: true,
              planta: true,
              activo: true,
            },
            take: limite,
            orderBy: [
              { planta: "asc" },
              { bodega_deposito: "asc" },
              { title: "asc" },
            ],
          })
          .then((items) =>
            items.map((item) => ({
              id: item.id,
              codigo: item.title,
              nombre: item.title,
              bodega: item.bodega_deposito,
              planta: item.planta,
              activo: item.activo,
            }))
          );

      case "temporadas":
        return await prisma.temporadas_app.findMany({
          where: {
            ...filtros,
            ...busquedaCondition,
          },
          select: {
            id: true,
            title: true,
            fecha_inicio: true,
            fecha_fin: true,
            activo: true,
          },
          take: limite,
          orderBy: { fecha_inicio: "desc" },
        });

      case "tipos_movimiento":
        return await prisma.tipo_movimientos_app
          .findMany({
            where: {
              ...filtros,
              ...busquedaCondition,
            },
            select: {
              id: true,
              title: true,
              descripcion: true,
              activo: true,
            },
            take: limite,
            orderBy: { title: "asc" },
          })
          .then((items) =>
            items.map((item) => ({
              id: item.id,
              codigo: item.title,
              nombre: item.title,
              descripcion: item.descripcion,
              activo: item.activo,
            }))
          );

      default:
        return [];
    }
  }

  /**
   * Valida un valor en base de datos
   * @private
   */
  static async validarEnBaseDatos(campo, config, valor) {
    try {
      let item = null;

      switch (campo) {
        case "materiales":
          item = await prisma.materiales.findFirst({
            where: {
              OR: [
                { id: isNaN(valor) ? undefined : parseInt(valor) },
                { codigo_ranco: valor },
              ],
            },
            select: {
              id: true,
              codigo_ranco: true,
              nombre_material: true,
              cod_nombre: true,
              activo: true,
            },
          });
          if (item) {
            item = {
              id: item.id,
              codigo: item.codigo_ranco,
              nombre: item.nombre_material,
              cod_nombre: item.cod_nombre,
              activo: item.activo,
            };
          }
          break;

        case "proveedores":
          item = await prisma.proveedores.findFirst({
            where: {
              OR: [
                { id: isNaN(valor) ? undefined : parseInt(valor) },
                { title: { contains: valor, mode: "insensitive" } },
              ],
            },
            select: {
              id: true,
              title: true,
              activo: true,
            },
          });
          if (item) {
            item = {
              id: item.id,
              codigo: `PROV${item.id.toString().padStart(3, "0")}`,
              nombre: item.title,
              activo: item.activo,
            };
          }
          break;

        case "ubicaciones":
        case "ubicaciones_origen":
        case "ubicaciones_destino":
          item = await prisma.ubicacion.findFirst({
            where: {
              OR: [
                { id: isNaN(valor) ? undefined : parseInt(valor) },
                { title: valor },
              ],
            },
            select: {
              id: true,
              title: true,
              bodega_deposito: true,
              planta: true,
              activo: true,
            },
          });
          if (item) {
            item = {
              id: item.id,
              codigo: item.title,
              nombre: item.title,
              bodega: item.bodega_deposito,
              planta: item.planta,
              activo: item.activo,
            };
          }
          break;

        default:
          break;
      }

      return {
        valido: !!item,
        datos: item,
      };
    } catch (error) {
      console.error(`Error validando ${campo}:`, error);
      return {
        valido: false,
        datos: null,
      };
    }
  }

  /**
   * Obtiene opciones con paginación
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   */
  static async obtenerOpcionesPaginadas(req, res) {
    try {
      const { formulario, campo } = req.params;
      const {
        filtros = {},
        busqueda = "",
        pagina = 1,
        tamanoPagina = 25,
        ordenarPor = "nombre",
        direccion = "asc",
      } = req.query;

      const config = obtenerConfiguracionCampo(formulario, campo);
      if (!config) {
        return ManejadorRespuestas.noEncontrado(
          res,
          `Campo ${campo} no encontrado para formulario ${formulario}`
        );
      }

      const paginaNum = parseInt(pagina);
      const tamano = parseInt(tamanoPagina);
      const saltar = (paginaNum - 1) * tamano;

      let opciones = [];
      let total = 0;

      if (config.data) {
        // Datos estáticos
        let datosStaticos = config.data;

        // Aplicar búsqueda
        if (busqueda && config.searchFields) {
          const busquedaLower = busqueda.toLowerCase();
          datosStaticos = datosStaticos.filter((item) => {
            return config.searchFields.some((field) => {
              const valor = item[field];
              return (
                valor && valor.toString().toLowerCase().includes(busquedaLower)
              );
            });
          });
        }

        total = datosStaticos.length;
        opciones = datosStaticos.slice(saltar, saltar + tamano);
      } else {
        // Datos dinámicos con paginación en base de datos
        // Parsear filtros solo si es una cadena
        let filtrosParsed = {};
        if (filtros) {
          if (typeof filtros === "string") {
            try {
              filtrosParsed = JSON.parse(filtros);
            } catch (e) {
              console.warn("Error parsing filtros en paginadas:", e);
              filtrosParsed = {};
            }
          } else {
            filtrosParsed = filtros;
          }
        }

        const resultado =
          await ControladorConsultasAnidadas.obtenerDatosPaginados(
            campo,
            config,
            filtrosParsed,
            busqueda,
            saltar,
            tamano,
            ordenarPor,
            direccion
          );
        opciones = resultado.datos;
        total = resultado.total;
      }

      // Formatear opciones
      const opcionesFormateadas = opciones.map((item) => ({
        value: item[config.valueField],
        label:
          formatearDisplay(item, config.displayTemplate) ||
          item[config.labelField],
        data: item,
      }));

      const respuesta = {
        opciones: opcionesFormateadas,
        paginacion: {
          pagina: paginaNum,
          tamanoPagina: tamano,
          total,
          totalPaginas: Math.ceil(total / tamano),
          hayMas: saltar + tamano < total,
        },
      };

      return ManejadorRespuestas.exito(
        res,
        respuesta,
        `Opciones paginadas para ${campo} obtenidas exitosamente`
      );
    } catch (error) {
      console.error("Error al obtener opciones paginadas:", error);
      return ManejadorRespuestas.error(
        res,
        "Error al obtener opciones paginadas",
        "ERROR_OBTENER_OPCIONES_PAGINADAS"
      );
    }
  }

  /**
   * Obtiene datos paginados de base de datos
   * @private
   */
  static async obtenerDatosPaginados(
    campo,
    config,
    filtros,
    busqueda,
    saltar,
    tamano,
    ordenarPor,
    direccion
  ) {
    const busquedaCondition =
      busqueda && config.searchFields
        ? {
            OR: config.searchFields.map((field) => ({
              [field]: {
                contains: busqueda,
                mode: "insensitive",
              },
            })),
          }
        : {};

    const whereClause = {
      ...filtros,
      ...busquedaCondition,
    };

    switch (campo) {
      case "materiales":
        const [materiales, totalMateriales] = await Promise.all([
          prisma.materiales.findMany({
            where: whereClause,
            select: {
              id: true,
              codigo_ranco: true,
              nombre_material: true,
              unidad_medida: true,
              clasificacion: true,
              frio: true,
              cod_nombre: true,
              activo: true,
            },
            skip: saltar,
            take: tamano,
            orderBy: {
              [ordenarPor === "codigo" ? "codigo_ranco" : "nombre_material"]:
                direccion,
            },
          }),
          prisma.materiales.count({ where: whereClause }),
        ]);

        return {
          datos: materiales.map((item) => ({
            id: item.id,
            codigo: item.codigo_ranco,
            nombre: item.nombre_material,
            unidad_medida: item.unidad_medida,
            clasificacion: item.clasificacion,
            requiere_frio: item.frio === "Si",
            cod_nombre: item.cod_nombre,
            activo: item.activo,
          })),
          total: totalMateriales,
        };

      default:
        return { datos: [], total: 0 };
    }
  }
}

module.exports = ControladorConsultasAnidadas;
