<template>
  <div class="vista-recepcion-lotes">
    <!-- Encabezado de la página -->
    <div class="encabezado-pagina">
      <div class="titulo-seccion">
        <h1 class="titulo-principal">
          <span class="icono-titulo">📥</span>
          Recepción de Lotes
        </h1>
        <p class="subtitulo">Control y registro de recepciones de materiales</p>
      </div>

      <div class="acciones-principales">
        <button
          type="button"
          class="boton boton-principal"
          @click="mostrarFormulario = true"
          :disabled="cargandoDatos"
        >
          <span class="icono-boton">📋</span>
          Nueva Recepción
        </button>
        <button
          type="button"
          class="boton boton-secundario"
          @click="cargarRecepciones"
          :disabled="cargandoDatos"
        >
          <span class="icono-boton">🔄</span>
          Actualizar
        </button>
        <button
          type="button"
          class="boton boton-secundario"
          @click="imprimirEtiquetas"
          :disabled="cargandoDatos || recepcionSeleccionadas.length === 0"
        >
          <span class="icono-boton">🖨️</span>
          Imprimir Etiquetas
        </button>
        <button
          type="button"
          class="boton boton-excel"
          @click="exportarAExcel"
          :disabled="
            cargandoDatos || recepcionesFiltradas.length === 0 || exportando
          "
        >
          <span class="icono-boton">📊</span>
          {{ exportando ? "Exportando..." : "Excel" }}
        </button>
      </div>
    </div>

    <!-- Mensajes de estado -->
    <MensajeEstado
      v-if="mensajeExito"
      tipo="exito"
      :mensaje="mensajeExito"
      :visible="Boolean(mensajeExito)"
      @cerrar="mensajeExito = ''"
      auto-cerrar
      :tiempo-auto-cierre="3000"
    />

    <MensajeEstado
      v-if="mensajeError"
      tipo="error"
      :mensaje="mensajeError"
      :visible="Boolean(mensajeError)"
      @cerrar="mensajeError = ''"
    />

    <!-- Filtros de búsqueda -->
    <div class="seccion-filtros">
      <div class="contenedor-filtros">
        <div class="filtros-fila-principal">
          <CampoEntrada
            v-model="filtros.busqueda"
            etiqueta="Buscar"
            placeholder="Número de recepción, proveedor, material..."
            tipo="search"
            :mostrar-etiqueta="false"
            @cambio="aplicarFiltros"
          />

          <CampoEntrada
            v-model="filtros.planta"
            etiqueta="Planta"
            tipo="select"
            :opciones="plantasDisponibles"
            :mostrar-etiqueta="false"
            @cambio="aplicarFiltros"
          />

          <CampoEntrada
            v-model="filtros.estado"
            etiqueta="Estado"
            tipo="select"
            :opciones="estadosDisponibles"
            :mostrar-etiqueta="false"
            @cambio="aplicarFiltros"
          />
        </div>

        <div class="filtros-fila-secundaria">
          <CampoEntrada
            v-model="filtros.fechaDesde"
            etiqueta="Desde"
            tipo="date"
            :maximo="filtros.fechaHasta || fechaActual"
            @cambio="aplicarFiltros"
          />

          <CampoEntrada
            v-model="filtros.fechaHasta"
            etiqueta="Hasta"
            tipo="date"
            :minimo="filtros.fechaDesde"
            :maximo="fechaActual"
            @cambio="aplicarFiltros"
          />

          <CampoEntrada
            v-model="filtros.proveedor"
            etiqueta="Proveedor"
            tipo="select"
            :opciones="proveedoresDisponibles"
            :mostrar-etiqueta="false"
            @cambio="aplicarFiltros"
          />

          <button
            type="button"
            class="boton boton-secundario boton-limpiar"
            @click="limpiarFiltros"
            title="Limpiar filtros"
          >
            <span class="icono-boton">🗑️</span>
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- Formulario de nueva recepción -->
    <div v-if="mostrarFormulario" class="seccion-formulario">
      <div class="contenedor-formulario">
        <div class="encabezado-formulario">
          <h2 class="titulo-formulario">Registrar Nueva Recepción</h2>
          <button
            type="button"
            class="boton-cerrar"
            @click="cerrarFormulario"
            :disabled="formulario.cargandoEnvio"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="guardarRecepcion" class="formulario-recepcion">
          <div class="campos-formulario">
            <!-- Primera fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.numero_recepcion"
                etiqueta="Número de Recepción"
                placeholder="Se genera automáticamente"
                solo-lectura
                texto-ayuda="El número se asigna automáticamente al guardar"
              />

              <CampoEntrada
                v-model="formulario.formulario.fecha_recepcion"
                etiqueta="Fecha de Recepción"
                tipo="datetime-local"
                es-requerido
                :maximo="fechaHoraActual"
                :mensaje-error="formulario.obtenerErrorCampo('fecha_recepcion')"
                @blur="formulario.marcarCampoComoTocado('fecha_recepcion')"
              />
            </div>

            <!-- Segunda fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.proveedor"
                etiqueta="Proveedor"
                tipo="select"
                :opciones="proveedoresDisponibles"
                es-requerido
                :mensaje-error="formulario.obtenerErrorCampo('proveedor')"
                @blur="formulario.marcarCampoComoTocado('proveedor')"
              />

              <CampoEntrada
                v-model="formulario.formulario.numero_guia"
                etiqueta="Número de Guía"
                placeholder="Ej: GR-2024-001"
                es-requerido
                :mensaje-error="formulario.obtenerErrorCampo('numero_guia')"
                @blur="formulario.marcarCampoComoTocado('numero_guia')"
              />
            </div>

            <!-- Tercera fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.codigo_material"
                etiqueta="Código del Material"
                placeholder="Ej: BOGR2062"
                es-requerido
                :mensaje-error="formulario.obtenerErrorCampo('codigo_material')"
                @cambio="buscarMaterial"
                @blur="formulario.marcarCampoComoTocado('codigo_material')"
              />

              <CampoEntrada
                v-model="formulario.formulario.nombre_material"
                etiqueta="Nombre del Material"
                placeholder="Se completará automáticamente"
                solo-lectura
              />
            </div>

            <!-- Cuarta fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.lote"
                etiqueta="Lote"
                placeholder="Ej: L2024-001"
                es-requerido
                :mensaje-error="formulario.obtenerErrorCampo('lote')"
                @blur="formulario.marcarCampoComoTocado('lote')"
              />

              <CampoEntrada
                v-model="formulario.formulario.temporada"
                etiqueta="Temporada"
                tipo="select"
                :opciones="temporadasDisponibles"
                es-requerido
                :mensaje-error="formulario.obtenerErrorCampo('temporada')"
                @blur="formulario.marcarCampoComoTocado('temporada')"
              />
            </div>

            <!-- Quinta fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.cantidad_recibida"
                etiqueta="Cantidad Recibida"
                tipo="number"
                placeholder="0"
                es-requerido
                minimo="0.01"
                paso="0.01"
                :mensaje-error="
                  formulario.obtenerErrorCampo('cantidad_recibida')
                "
                @blur="formulario.marcarCampoComoTocado('cantidad_recibida')"
              />

              <CampoEntrada
                v-model="formulario.formulario.unidad_medida"
                etiqueta="Unidad de Medida"
                tipo="select"
                :opciones="unidadesMedidaDisponibles"
                es-requerido
                :mensaje-error="formulario.obtenerErrorCampo('unidad_medida')"
                @blur="formulario.marcarCampoComoTocado('unidad_medida')"
              />
            </div>

            <!-- Sexta fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.ubicacion_destino"
                etiqueta="Ubicación de Destino"
                tipo="select"
                :opciones="ubicacionesDisponibles"
                es-requerido
                :mensaje-error="
                  formulario.obtenerErrorCampo('ubicacion_destino')
                "
                @blur="formulario.marcarCampoComoTocado('ubicacion_destino')"
              />

              <CampoEntrada
                v-model="formulario.formulario.estado"
                etiqueta="Estado de Recepción"
                tipo="select"
                :opciones="estadosDisponibles"
                es-requerido
                :mensaje-error="formulario.obtenerErrorCampo('estado')"
                @blur="formulario.marcarCampoComoTocado('estado')"
              />
            </div>

            <!-- Séptima fila -->
            <div class="fila-campos fila-completa">
              <CampoEntrada
                v-model="formulario.formulario.observaciones"
                etiqueta="Observaciones"
                tipo="textarea"
                placeholder="Información adicional sobre la recepción..."
                :filas="3"
                texto-ayuda="Opcional: condiciones de la recepción, incidencias, etc."
              />
            </div>
          </div>

          <!-- Errores generales del formulario -->
          <MensajeEstado
            v-if="formulario.tieneErrores"
            tipo="error"
            :mensaje="formulario.obtenerErroresFormateados()"
            :visible="formulario.tieneErrores"
            :puede-ser-cerrado="false"
          />

          <!-- Botones del formulario -->
          <div class="botones-formulario">
            <button
              type="button"
              class="boton boton-secundario"
              @click="cerrarFormulario"
              :disabled="formulario.cargandoEnvio"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="boton boton-principal"
              :disabled="
                !formulario.formularioValido || formulario.cargandoEnvio
              "
            >
              <span
                v-if="formulario.cargandoEnvio"
                class="icono-boton spinner"
              ></span>
              <span v-else class="icono-boton">💾</span>
              {{
                formulario.cargandoEnvio ? "Guardando..." : "Guardar Recepción"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Encabezado de tabla -->
    <div class="encabezado-tabla">
      <h2 class="titulo-tabla">Registro de Recepciones</h2>
      <div class="info-tabla">
        <span class="contador-registros">
          {{ recepcionesFiltradas.length }}
          {{ recepcionesFiltradas.length === 1 ? "recepción" : "recepciones" }}
        </span>
        <span
          v-if="recepcionSeleccionadas.length > 0"
          class="contador-seleccionadas"
        >
          ({{ recepcionSeleccionadas.length }} seleccionadas)
        </span>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="cargandoDatos" class="estado-carga">
      <div class="spinner-grande"></div>
      <p>Cargando recepciones...</p>
    </div>

    <!-- Tabla especializada de recepción de lotes -->
    <TablaRecepcionLotes
      :recepciones="recepcionesFiltradas"
      :cargando="cargandoDatos"
      :tiene-activos-filtros="Boolean(tieneActivosFiltros)"
      @ver-detalle="verDetalleRecepcion"
      @editar="editarRecepcion"
      @completar="completarRecepcion"
      @imprimir-etiqueta="imprimirEtiquetaRecepcion"
      @crear-recepcion="mostrarFormulario = true"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { usarFormulario } from "@/composables/usarFormulario";
import { usarPaginacion } from "@/composables/usarPaginacion";
import { usarExportacionExcel } from "@/composables/usarExportacionExcel";
import { servicioRecepcionLotes } from "@/servicios/servicioRecepcionLotes";
import { servicioMantenedores } from "@/servicios/servicioMantenedores";
import CampoEntrada from "@/componentes/CampoEntrada.vue";
import MensajeEstado from "@/componentes/MensajeEstado.vue";
import TablaRecepcionLotes from "@/componentes/tablas/TablaRecepcionLotes.vue";
import {
  PLANTAS,
  ESTADOS_OPERACION,
  TEMPORADAS,
  UNIDADES_MEDIDA,
  MENSAJES,
  obtenerOpcionesSelect,
} from "@/utilidades/constantes";
import {
  fechaActualParaInput,
  fechaHoraActualParaInput,
  filtrarPorTexto,
  ordenarPor,
  filtrarPorRangoFechas,
  generarId,
} from "@/utilidades/auxiliares";

// ============== ESTADO REACTIVO ==============

// Estado de datos
const recepciones = ref([]);
const proveedores = ref([]);
const ubicaciones = ref([]);
// Computed para datos transformados con campos anidados aplanados
const recepcionesFiltradas = computed(() => {
  let datos = recepciones.value.map((recepcion) => ({
    ...recepcion,
    // Campos de proveedor
    proveedor_nombre:
      recepcion.proveedor?.nombre ||
      recepcion.proveedor?.completo?.title ||
      recepcion.proveedor?.title ||
      "N/A",
    proveedor_activo:
      recepcion.proveedor?.completo?.activo !== undefined
        ? recepcion.proveedor.completo.activo
        : null,

    // Campos de material
    material_codigo:
      recepcion.material?.codigo ||
      recepcion.material?.completo?.codigo_ranco ||
      recepcion.codigo_material ||
      "N/A",
    material_nombre:
      recepcion.material?.nombre ||
      recepcion.material?.cod_nombre ||
      recepcion.material?.completo?.nombre_material ||
      recepcion.nombre_material ||
      "N/A",
    material_unidad:
      recepcion.material?.unidad_medida ||
      recepcion.material?.completo?.unidad_medida ||
      "N/A",
    material_clasificacion:
      recepcion.material?.clasificacion ||
      recepcion.material?.completo?.clasificacion ||
      "N/A",

    // Campos de ubicación destino
    ubicacion_nombre:
      recepcion.ubicacion_destino?.ubicacion ||
      recepcion.ubicacion_destino?.completo?.title ||
      recepcion.ubicacion_destino?.title ||
      "N/A",
    ubicacion_bodega:
      recepcion.ubicacion_destino?.bodega ||
      recepcion.ubicacion_destino?.completo?.bodega_deposito ||
      "N/A",
    ubicacion_planta:
      recepcion.ubicacion_destino?.completo?.planta ||
      recepcion.planta ||
      "N/A",

    // Campo de usuario
    usuario_completo:
      recepcion.usuario?.nombre_completo ||
      recepcion.usuario?.nombre_usuario ||
      recepcion.usuario ||
      "N/A",
  }));

  // Aplicar filtros si hay texto de filtro
  if (filtroTexto.value) {
    const texto = filtroTexto.value.toLowerCase();
    datos = datos.filter((item) =>
      Object.values(item).some((valor) =>
        String(valor).toLowerCase().includes(texto)
      )
    );
  }

  // Aplicar ordenamiento si está definido
  if (ordenCampo.value) {
    datos = ordenarPor(datos, ordenCampo.value, ordenDireccion.value);
  }

  return datos;
});
const recepcionSeleccionadas = ref([]);

// Estado de UI
const mostrarFormulario = ref(false);
const cargandoDatos = ref(false);
const mensajeExito = ref("");
const mensajeError = ref("");

// Estado de filtros y ordenamiento
const filtroTexto = ref("");
const ordenCampo = ref("");
const ordenDireccion = ref("asc");

// Filtros
const filtros = ref({
  busqueda: "",
  planta: "Rancagua",
  estado: "",
  fechaDesde: "",
  fechaHasta: "",
  proveedor: "",
});

// Paginación
const paginacion = usarPaginacion({
  elementosPorPagina: 25,
  paginaActual: 1,
});

// Exportación Excel
const {
  exportando,
  exportarAExcel: exportarExcel,
  prepararDatosRecepciones,
  obtenerConfiguracionColumnas,
} = usarExportacionExcel();

// Formulario de recepción
const formulario = usarFormulario({
  datosIniciales: {
    numero_recepcion: "",
    fecha_recepcion: fechaHoraActualParaInput(),
    proveedor: "",
    numero_guia: "",
    codigo_material: "",
    nombre_material: "",
    lote: "",
    temporada: "R9 2024-2025",
    cantidad_recibida: 0,
    unidad_medida: "Unidad",
    ubicacion_destino: "",
    estado: "pendiente",
    observaciones: "",
    planta: "Rancagua",
  },
  tipoValidacion: "recepcionLotes",
  validarEnTiempoReal: true,
});

// ============== COMPUTED PROPERTIES ==============

const plantasDisponibles = computed(() => obtenerOpcionesSelect(PLANTAS));

const estadosDisponibles = computed(() =>
  obtenerOpcionesSelect(ESTADOS_OPERACION)
);

const temporadasDisponibles = computed(() => obtenerOpcionesSelect(TEMPORADAS));

const unidadesMedidaDisponibles = computed(() =>
  obtenerOpcionesSelect(UNIDADES_MEDIDA)
);

const proveedoresDisponibles = computed(() => {
  if (!Array.isArray(proveedores.value)) {
    return [];
  }
  return proveedores.value.map((p) => ({
    value: p.title || p.nombre || p.id,
    label: p.title || p.nombre || p.id,
  }));
});

const ubicacionesDisponibles = computed(() => {
  if (!Array.isArray(ubicaciones.value)) {
    return [];
  }
  return ubicaciones.value
    .filter((u) => u.planta === formulario.formulario.planta)
    .map((u) => ({
      value: u.title || u.nombre || u.id,
      label: `${u.title || u.nombre || u.id} (${
        u.bodega_deposito || u.bodega || ""
      })`,
    }));
});

const fechaActual = computed(() => fechaActualParaInput());
const fechaHoraActual = computed(() => fechaHoraActualParaInput());

const tieneActivosFiltros = computed(() => {
  const filtrosActivos = [
    filtros.value.busqueda,
    filtros.value.estado,
    filtros.value.fechaDesde,
    filtros.value.fechaHasta,
    filtros.value.proveedor,
  ].filter((filtro) => filtro && filtro.toString().trim() !== "");

  return filtrosActivos.length > 0;
});

// columnasTabla eliminada por ESLint cleanup

// ============== MÉTODOS ==============

async function cargarRecepciones() {
  cargandoDatos.value = true;
  mensajeError.value = "";

  try {
    const datos = await servicioRecepcionLotes.obtenerRecepciones({
      planta: filtros.value.planta,
    });

    recepciones.value = datos || [];
    aplicarFiltros();
    mostrarMensajeExito("Recepciones actualizadas correctamente");
  } catch (error) {
    console.error("Error al cargar recepciones:", error);
    mensajeError.value = error.message || MENSAJES.ERROR_GENERICO;
  } finally {
    cargandoDatos.value = false;
  }
}

async function cargarProveedores() {
  try {
    const datos = await servicioMantenedores.obtenerProveedores();
    proveedores.value = datos || [];
  } catch (error) {
    console.error("Error al cargar proveedores:", error);
    mensajeError.value = "Error al cargar proveedores";
  }
}

async function cargarUbicaciones() {
  try {
    const datos = await servicioMantenedores.obtenerUbicaciones();
    ubicaciones.value = datos || [];
  } catch (error) {
    console.error("Error al cargar ubicaciones:", error);
    mensajeError.value = "Error al cargar ubicaciones";
  }
}

async function buscarMaterial() {
  const codigo = formulario.formulario.codigo_material?.trim();
  if (!codigo || codigo.length < 2) {
    formulario.formulario.nombre_material = "";
    return;
  }

  try {
    const material = await servicioMantenedores.obtenerMaterialPorCodigo(
      codigo
    );
    if (material) {
      formulario.formulario.nombre_material = material.nombre_material || "";
      formulario.formulario.unidad_medida = material.unidad_medida || "Unidad";
    } else {
      formulario.formulario.nombre_material = "";
    }
  } catch (error) {
    console.error("Error al buscar material:", error);
    formulario.formulario.nombre_material = "";
  }
}

function aplicarFiltros() {
  let datos = [...recepciones.value];

  // Aplicar filtro de búsqueda
  if (filtros.value.busqueda) {
    datos = filtrarPorTexto(datos, filtros.value.busqueda, [
      "numero_recepcion",
      "guia_sii",
      "lote",
      "codigo_qr",
      "observaciones",
      "planta",
      // Búsqueda en objetos anidados
      "proveedor.nombre",
      "proveedor.title",
      "material.codigo",
      "material.nombre",
      "material.cod_nombre",
      "ubicacion_destino.title",
      "ubicacion_destino.bodega",
      "ubicacion_destino.ubicacion",
      "usuario.nombre_usuario",
      "usuario.nombre_completo",
    ]);
  }

  // Aplicar filtro de estado
  if (filtros.value.estado) {
    datos = datos.filter((item) => item.estado === filtros.value.estado);
  }

  // Aplicar filtro de proveedor
  if (filtros.value.proveedor) {
    datos = datos.filter((item) => {
      const proveedorNombre =
        item.proveedor?.nombre || item.proveedor?.title || item.proveedor;
      return proveedorNombre === filtros.value.proveedor;
    });
  }

  // Aplicar filtro de fechas
  if (filtros.value.fechaDesde || filtros.value.fechaHasta) {
    filtrarPorRangoFechas(
      datos,
      "fecha_recepcion",
      filtros.value.fechaDesde,
      filtros.value.fechaHasta
    );
  }

  // Los datos se actualizan automáticamente a través del computed
  paginacion.totalRegistros.value = recepcionesFiltradas.value.length;
  paginacion.paginaActual.value = 1;
}

function limpiarFiltros() {
  filtros.value = {
    busqueda: "",
    planta: filtros.value.planta,
    estado: "",
    fechaDesde: "",
    fechaHasta: "",
    proveedor: "",
  };
  aplicarFiltros();
}

function verDetalleRecepcion(recepcion) {
  // TODO: Implementar modal de detalle
  mostrarMensajeExito(
    `Detalle de recepción ${recepcion.numero_recepcion} (en desarrollo)`
  );
}

function editarRecepcion(recepcion) {
  // TODO: Implementar edición
  mostrarMensajeExito(
    `Edición de recepción ${recepcion.numero_recepcion} (en desarrollo)`
  );
}

function completarRecepcion(recepcion) {
  // TODO: Implementar completado de recepción
  mostrarMensajeExito(
    `Completar recepción ${recepcion.numero_recepcion} (en desarrollo)`
  );
}

function imprimirEtiquetaRecepcion(recepcion) {
  // TODO: Implementar impresión individual
  mostrarMensajeExito(
    `Impresión de etiqueta para ${recepcion.numero_recepcion} (en desarrollo)`
  );
}

function imprimirEtiquetas() {
  if (recepcionSeleccionadas.value.length === 0) {
    mensajeError.value = "Seleccione al menos una recepción para imprimir";
    return;
  }

  // TODO: Implementar impresión masiva
  mostrarMensajeExito(
    `Imprimiendo ${recepcionSeleccionadas.value.length} etiquetas (en desarrollo)`
  );
}

async function guardarRecepcion() {
  const exito = await formulario.manejarEnvio(async (datos) => {
    // Generar número de recepción si no existe
    if (!datos.numero_recepcion) {
      datos.numero_recepcion = `REC-${new Date().getFullYear()}-${generarId(
        4
      )}`;
    }

    return await servicioRecepcionLotes.crearRecepcion(datos);
  });

  if (exito) {
    mostrarMensajeExito(MENSAJES.EXITO_CREAR);
    cerrarFormulario();
    await cargarRecepciones();
  }
}

function cerrarFormulario() {
  mostrarFormulario.value = false;
  formulario.reiniciarFormulario();
  // Resetear valores por defecto
  formulario.formulario.fecha_recepcion = fechaHoraActualParaInput();
  formulario.formulario.planta = filtros.value.planta;
  formulario.formulario.temporada = "R9 2024-2025";
  formulario.formulario.estado = "pendiente";
  formulario.formulario.unidad_medida = "Unidad";
}

function mostrarMensajeExito(mensaje) {
  mensajeExito.value = mensaje;
  mensajeError.value = "";
}

async function exportarAExcel() {
  try {
    if (recepcionesFiltradas.value.length === 0) {
      mensajeError.value = "No hay datos para exportar";
      return;
    }

    const datosExcel = prepararDatosRecepciones(recepcionesFiltradas.value);
    const configuracionColumnas = obtenerConfiguracionColumnas("recepciones");

    const resultado = exportarExcel(
      datosExcel,
      "recepciones_reporte",
      "Recepciones",
      { anchoColumnas: configuracionColumnas }
    );

    mostrarMensajeExito(
      `Reporte exportado exitosamente: ${resultado.nombreArchivo} (${resultado.registrosExportados} registros)`
    );
  } catch (error) {
    console.error("Error al exportar a Excel:", error);
    mensajeError.value = `Error al generar el reporte Excel: ${error.message}`;
  }
}

// ============== WATCHERS ==============

watch(
  () => filtros.value.planta,
  async (nuevaPlanta) => {
    formulario.formulario.planta = nuevaPlanta;
    await cargarRecepciones();
  }
);

watch(
  () => [
    filtros.value.busqueda,
    filtros.value.estado,
    filtros.value.fechaDesde,
    filtros.value.fechaHasta,
    filtros.value.proveedor,
  ],
  () => {
    aplicarFiltros();
  }
);

// ============== LIFECYCLE ==============

onMounted(async () => {
  await Promise.all([
    cargarRecepciones(),
    cargarProveedores(),
    cargarUbicaciones(),
  ]);
});
</script>

<style scoped>
.vista-recepcion-lotes {
  padding: 1.5rem;
  max-width: 100%;
  margin: 0 auto;
}

/* Reutilizar estilos base */
.encabezado-pagina {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.titulo-seccion {
  flex: 1;
}

.titulo-principal {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}

.icono-titulo {
  font-size: 2.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.subtitulo {
  color: #64748b;
  font-size: 1.125rem;
  margin: 0;
}

.acciones-principales {
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
}

.boton {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
}

.boton:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.boton-principal {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.2);
}

.boton-principal:hover:not(:disabled) {
  background: linear-gradient(135deg, #3730a3 0%, #6d28d9 100%);
  box-shadow: 0 4px 16px rgba(79, 70, 229, 0.3);
  transform: translateY(-1px);
}

.boton-secundario {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.boton-secundario:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.boton-excel {
  background: linear-gradient(135deg, #059669 0%, #16a34a 100%);
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(5, 150, 105, 0.2);
}

.boton-excel:hover:not(:disabled) {
  background: linear-gradient(135deg, #047857 0%, #15803d 100%);
  box-shadow: 0 4px 16px rgba(5, 150, 105, 0.3);
  transform: translateY(-1px);
}

.icono-boton {
  font-size: 1rem;
  line-height: 1;
}

/* Filtros específicos */
.seccion-filtros {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
}

.filtros-fila-principal {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1rem;
}

.filtros-fila-secundaria {
  display: grid;
  grid-template-columns: auto auto auto auto;
  gap: 1rem;
  align-items: end;
}

.boton-limpiar {
  justify-self: end;
}

/* Formulario */
.seccion-formulario {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  margin-bottom: 2rem;
}

.contenedor-formulario {
  padding: 0;
}

.encabezado-formulario {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 1rem 1rem 0 0;
}

.titulo-formulario {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.boton-cerrar {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 0.375rem;
  color: #6b7280;
  font-size: 1.25rem;
  line-height: 1;
  transition: all 0.2s ease-in-out;
}

.boton-cerrar:hover {
  background: #f3f4f6;
  color: #374151;
}

.formulario-recepcion {
  padding: 2rem;
}

.campos-formulario {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.fila-campos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.fila-completa {
  grid-template-columns: 1fr;
}

.botones-formulario {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f5f9;
}

/* Tabla de recepciones extendida (patrón de trazabilidad) */
.seccion-tabla {
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  border-radius: 1rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  position: relative;
}

.seccion-tabla :deep(.tabla-reutilizable) {
  min-width: 3800px; /* Ancho mínimo para todas las columnas (23 columnas × ~165px promedio) */
  width: 100%;
}

.seccion-tabla :deep(.tabla-reutilizable table) {
  min-width: 3800px;
  width: 100%;
}

/* Estilos para el scrollbar horizontal */
.seccion-tabla::-webkit-scrollbar {
  height: 12px;
}

.seccion-tabla::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 6px;
}

.seccion-tabla::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 6px;
  border: 2px solid #f1f5f9;
}

.seccion-tabla::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Indicador visual de scroll */
.seccion-tabla::after {
  content: "← Desliza para ver más columnas →";
  position: absolute;
  bottom: -25px;
  right: 0;
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
  opacity: 0.8;
  pointer-events: none;
}

/* Optimización para columnas con scroll horizontal */
.seccion-tabla :deep(.tabla-reutilizable th),
.seccion-tabla :deep(.tabla-reutilizable td) {
  white-space: nowrap;
  padding: 0.75rem 0.5rem;
  min-width: 0;
}

.seccion-tabla :deep(.tabla-reutilizable th:first-child),
.seccion-tabla :deep(.tabla-reutilizable td:first-child) {
  position: sticky;
  left: 0;
  background: inherit;
  z-index: 10;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.seccion-tabla :deep(.tabla-reutilizable thead th) {
  background: #f8fafc;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.seccion-tabla :deep(.tabla-reutilizable tbody tr:hover) {
  background-color: #f9fafb;
}

/* Responsive para el scroll */
@media (max-width: 1024px) {
  .seccion-tabla {
    border-radius: 0.5rem;
  }

  .seccion-tabla::after {
    bottom: -30px;
    font-size: 0.7rem;
  }

  .seccion-tabla :deep(.tabla-reutilizable th),
  .seccion-tabla :deep(.tabla-reutilizable td) {
    padding: 0.5rem 0.375rem;
    font-size: 0.875rem;
  }
}

.encabezado-tabla {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 1rem 1rem 0 0;
}

.titulo-tabla {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.info-tabla {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.contador-registros {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.contador-seleccionadas {
  color: #4f46e5;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Contenido de celdas específicas */
.numero-recepcion {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.fecha-numero {
  font-size: 0.75rem;
  color: #6b7280;
}

.info-material {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.nombre-material {
  font-size: 0.75rem;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px;
}

.cantidad-recibida {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
}

.valor-cantidad {
  font-weight: 600;
  color: #1f2937;
}

.unidad-cantidad {
  font-size: 0.75rem;
  color: #6b7280;
}

.pallets-cantidad {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
}

.valor-pallets {
  font-weight: 600;
  color: #059669;
  font-size: 0.875rem;
}

.unidad-pallets {
  font-size: 0.75rem;
  color: #6b7280;
}

.codigo-qr {
  font-family: monospace;
  font-size: 0.75rem;
}

.codigo-valor {
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  color: #374151;
}

.unidad-material {
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
}

.clasificacion-material {
  font-size: 0.75rem;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  display: inline-block;
  margin-top: 0.125rem;
}

/* Información de proveedor */
.info-proveedor {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.estado-proveedor {
  margin-top: 0.25rem;
}

.badge-mini {
  font-size: 0.625rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-activo {
  background: #dcfce7;
  color: #166534;
}

.badge-inactivo {
  background: #fee2e2;
  color: #991b1b;
}

/* Información de ubicación */
.info-ubicacion {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.detalle-ubicacion {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.bodega {
  font-size: 0.75rem;
  color: #6b7280;
}

.planta {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
}

/* Información de usuario */
.info-usuario {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.username {
  font-size: 0.75rem;
  color: #6b7280;
  font-family: "Courier New", monospace;
}

/* Observaciones */
.observaciones-celda {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.4;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: help;
}

/* Fecha de creación */
.fecha-creacion {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  text-align: center;
}

.fecha {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.hora {
  font-size: 0.75rem;
  color: #6b7280;
  font-family: "Courier New", monospace;
}

/* Responsividad para tabla completa */
.seccion-tabla {
  overflow-x: auto;
}

/* Hacer la tabla horizontalmente scrollable */
.seccion-tabla :deep(.tabla-container) {
  overflow-x: auto;
  max-width: 100%;
}

.seccion-tabla :deep(.tabla-reutilizable) {
  min-width: 2400px; /* Ancho mínimo para acomodar todas las columnas */
}

.seccion-tabla :deep(.tabla-reutilizable th),
.seccion-tabla :deep(.tabla-reutilizable td) {
  white-space: nowrap;
  padding: 0.75rem 0.5rem;
}

/* Ajustar ancho de columnas específicas */
.seccion-tabla :deep(.tabla-reutilizable th:first-child),
.seccion-tabla :deep(.tabla-reutilizable td:first-child) {
  position: sticky;
  left: 0;
  background: white;
  z-index: 1;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

/* Badges de estado */
.badge-estado {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge-pendiente {
  background: #fef3c7;
  color: #92400e;
}

.badge-proceso {
  background: #dbeafe;
  color: #1e40af;
}

.badge-completado {
  background: #dcfce7;
  color: #166534;
}

.badge-cancelado {
  background: #fee2e2;
  color: #991b1b;
}

.badge-neutral {
  background: #f3f4f6;
  color: #374151;
}

/* Acciones de fila */
.acciones-fila {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.boton-accion {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.boton-ver {
  background: #f3f4f6;
  color: #374151;
}

.boton-ver:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.boton-editar {
  background: #fef3c7;
  color: #92400e;
}

.boton-editar:hover {
  background: #fde68a;
  color: #78350f;
}

.boton-imprimir {
  background: #dbeafe;
  color: #1e40af;
}

.boton-imprimir:hover {
  background: #bfdbfe;
  color: #1e3a8a;
}

/* Estados */
.estado-carga {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.spinner-grande {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.estado-vacio {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.icono-vacio {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.estado-vacio h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.estado-vacio p {
  color: #6b7280;
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid #e5e7eb;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .vista-recepcion-lotes {
    padding: 1rem;
  }

  .encabezado-pagina {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .acciones-principales {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .titulo-principal {
    font-size: 1.75rem;
  }

  .filtros-fila-principal,
  .filtros-fila-secundaria {
    grid-template-columns: 1fr;
  }

  .fila-campos {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .encabezado-formulario {
    padding: 1rem 1.5rem;
  }

  .formulario-recepcion {
    padding: 1.5rem;
  }

  .botones-formulario {
    flex-direction: column-reverse;
  }

  .boton {
    width: 100%;
    justify-content: center;
  }
}

/* Estilos del scrollbar para la tabla */
.seccion-tabla::-webkit-scrollbar {
  height: 8px;
}

.seccion-tabla::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.seccion-tabla::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.seccion-tabla::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Estilos específicos para componentes de información */
.info-proveedor {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 160px;
  max-width: 180px;
}

.estado-proveedor {
  font-size: 0.75rem;
}

.badge-mini {
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge-activo {
  background: #dcfce7;
  color: #166534;
}

.badge-inactivo {
  background: #fee2e2;
  color: #991b1b;
}

.info-material {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 180px;
  max-width: 200px;
}

.nombre-material {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unidad-material {
  font-size: 0.7rem;
  color: #9ca3af;
  font-style: italic;
}

.clasificacion-material {
  font-size: 0.65rem;
  color: #7c3aed;
  font-weight: 600;
  background: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  display: inline-block;
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.info-ubicacion {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 160px;
}

.detalle-ubicacion {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.bodega {
  font-weight: 500;
  color: #4f46e5;
}

.planta {
  color: #059669;
}

.info-usuario {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 140px;
}

.username {
  font-size: 0.75rem;
  color: #6b7280;
  font-family: "Courier New", monospace;
}

.observaciones-celda {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: help;
}

.fecha-creacion {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 140px;
}

.fecha-creacion .fecha {
  font-weight: 600;
  color: #1f2937;
}

.fecha-creacion .hora {
  font-size: 0.75rem;
  color: #6b7280;
  font-family: "Courier New", monospace;
}

/* Fecha completa (patrón de trazabilidad) */
.fecha-completa {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 140px;
}

.fecha-valor {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.hora-valor {
  font-size: 0.75rem;
  color: #6b7280;
  font-family: "Courier New", monospace;
}

/* Estilos para componentes específicos */
.proveedor-info,
.material-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.proveedor-nombre,
.material-nombre,
.usuario-nombre {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.material-codigo {
  font-weight: 700;
  color: #4f46e5;
  font-family: "Courier New", monospace;
}

.material-unidad {
  font-size: 0.8rem;
  color: #6b7280;
  font-style: italic;
}

.ubicacion-nombre,
.ubicacion-bodega,
.ubicacion-planta {
  font-size: 0.875rem;
  color: #374151;
}

.texto-na {
  color: #9ca3af;
  font-style: italic;
  font-size: 0.8rem;
}

@media (max-width: 640px) {
  .acciones-principales {
    flex-direction: column;
  }

  .encabezado-tabla {
    padding: 1rem 1.5rem;
  }

  .titulo-tabla {
    font-size: 1rem;
  }

  .acciones-fila {
    flex-direction: column;
    gap: 0.25rem;
  }

  .nombre-material {
    max-width: 120px;
  }

  /* Ajustes responsive para componentes de información */
  .info-proveedor,
  .info-material,
  .info-ubicacion,
  .info-usuario {
    min-width: auto;
    max-width: 140px;
  }

  .observaciones-celda {
    max-width: 100px;
  }

  .fecha-creacion {
    min-width: auto;
    max-width: 120px;
  }
}
</style>
