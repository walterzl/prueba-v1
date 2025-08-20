<template>
  <div class="vista-trazabilidad">
    <!-- Encabezado de la página -->
    <div class="encabezado-pagina">
      <div class="titulo-seccion">
        <h1 class="titulo-principal">
          <span class="icono-titulo">📋</span>
          Trazabilidad de Materiales
        </h1>
        <p class="subtitulo">
          Seguimiento y control de movimientos de inventario
        </p>
      </div>

      <div class="acciones-principales">
        <button
          type="button"
          class="boton boton-principal"
          @click="mostrarFormulario = true"
          :disabled="cargandoDatos"
        >
          <span class="icono-boton">➕</span>
          Nuevo Movimiento
        </button>
        <button
          type="button"
          class="boton boton-secundario"
          @click="cargarTrazabilidad"
          :disabled="cargandoDatos"
        >
          <span class="icono-boton">🔄</span>
          Actualizar
        </button>
        <button
          type="button"
          class="boton boton-secundario"
          @click="exportarDatos"
          :disabled="cargandoDatos || trazabilidadFiltrada.length === 0"
        >
          <span class="icono-boton">📊</span>
          Exportar
        </button>
        <button
          type="button"
          class="boton boton-excel"
          @click="exportarAExcel"
          :disabled="
            cargandoDatos || trazabilidadFiltrada.length === 0 || exportando
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
    <div class="seccion-filtros vista-trazabilidad">
      <div class="contenedor-filtros">
        <!-- Fila Principal: Búsqueda + Planta + Tipo Movimiento -->
        <div class="filtros-fila-principal">
          <div class="campo-busqueda-principal">
            <CampoEntrada
              v-model="filtros.busqueda"
              etiqueta="Búsqueda General"
              placeholder="Material, lote, tarja o usuario..."
              tipo="search"
              :mostrar-etiqueta="true"
              @cambio="aplicarFiltros"
            />
          </div>

          <div class="campo-select">
            <CampoEntrada
              v-model="filtros.planta"
              etiqueta="Planta"
              tipo="select"
              :opciones="plantasDisponibles"
              :mostrar-etiqueta="true"
              @cambio="aplicarFiltros"
            />
          </div>

          <div class="campo-select">
            <CampoEntrada
              v-model="filtros.tipoMovimiento"
              etiqueta="Tipo de Movimiento"
              tipo="select"
              :opciones="tiposMovimientoDisponibles"
              :mostrar-etiqueta="true"
              @cambio="aplicarFiltros"
            />
          </div>
        </div>

        <!-- Fila Secundaria: Fechas + Proveedor + Lote -->
        <div class="filtros-fila-secundaria">
          <div class="campo-fecha">
            <CampoEntrada
              v-model="filtros.fechaDesde"
              etiqueta="Fecha Desde"
              tipo="date"
              :maximo="filtros.fechaHasta || fechaActual"
              :mostrar-etiqueta="true"
              @cambio="aplicarFiltros"
            />
          </div>

          <div class="campo-fecha">
            <CampoEntrada
              v-model="filtros.fechaHasta"
              etiqueta="Fecha Hasta"
              tipo="date"
              :minimo="filtros.fechaDesde"
              :maximo="fechaActual"
              :mostrar-etiqueta="true"
              @cambio="aplicarFiltros"
            />
          </div>

          <div class="campo-select">
            <CampoEntrada
              v-model="filtros.proveedor"
              etiqueta="Proveedor"
              tipo="select"
              :opciones="proveedoresDisponibles"
              :mostrar-etiqueta="true"
              @cambio="aplicarFiltros"
            />
          </div>

          <div class="campo-texto">
            <CampoEntrada
              v-model="filtros.lote"
              etiqueta="Lote"
              placeholder="Buscar por lote..."
              tipo="text"
              :mostrar-etiqueta="true"
              @cambio="aplicarFiltros"
            />
          </div>
        </div>

        <!-- Fila Avanzada: Clasificación + Bodegas + Turno + Guías + Transporte -->
        <div class="filtros-fila-avanzada">
          <div class="campo-select">
            <CampoEntrada
              v-model="filtros.clasificacion"
              etiqueta="Clasificación"
              tipo="select"
              :opciones="clasificacionesDisponibles"
              :mostrar-etiqueta="true"
              @cambio="aplicarFiltros"
            />
          </div>

          <div class="campo-select">
            <CampoEntrada
              v-model="filtros.bodegaOrigen"
              etiqueta="Bodega Origen"
              tipo="select"
              :opciones="bodegasOrigenDisponibles"
              :mostrar-etiqueta="true"
              @cambio="aplicarFiltros"
            />
          </div>

          <div class="campo-select">
            <CampoEntrada
              v-model="filtros.bodegaDestino"
              etiqueta="Bodega Destino"
              tipo="select"
              :opciones="bodegasDestinoDisponibles"
              :mostrar-etiqueta="true"
              @cambio="aplicarFiltros"
            />
          </div>

          <div class="campo-select">
            <CampoEntrada
              v-model="filtros.turno"
              etiqueta="Turno"
              tipo="select"
              :opciones="turnosRealesDisponibles"
              :mostrar-etiqueta="true"
              @cambio="aplicarFiltros"
            />
          </div>

          <div class="campo-texto">
            <CampoEntrada
              v-model="filtros.guiaSII"
              etiqueta="Guía SII"
              placeholder="Buscar por guía SII..."
              tipo="text"
              @cambio="aplicarFiltros"
            />
          </div>

          <div class="campo-texto">
            <CampoEntrada
              v-model="filtros.numeroEmbarque"
              etiqueta="N° Embarque"
              placeholder="Buscar por embarque..."
              tipo="text"
              @cambio="aplicarFiltros"
            />
          </div>

          <div class="campo-texto">
            <CampoEntrada
              v-model="filtros.patenteCamion"
              etiqueta="Patente Camión"
              placeholder="Buscar por patente..."
              tipo="text"
              @cambio="aplicarFiltros"
            />
          </div>
        </div>

        <!-- Fila Extra: Ubicaciones + Temporada + Observación + Acciones -->
        <div class="filtros-fila-extra">
          <div class="campo-texto">
            <CampoEntrada
              v-model="filtros.ubicacionOrigen"
              etiqueta="Ubicación Origen"
              placeholder="Buscar ubicación origen..."
              tipo="text"
              @cambio="aplicarFiltros"
            />
          </div>

          <div class="campo-texto">
            <CampoEntrada
              v-model="filtros.ubicacionDestino"
              etiqueta="Ubicación Destino"
              placeholder="Buscar ubicación destino..."
              tipo="text"
              @cambio="aplicarFiltros"
            />
          </div>

          <div class="campo-select">
            <CampoEntrada
              v-model="filtros.temporada"
              etiqueta="Temporada"
              tipo="select"
              :opciones="temporadasDisponibles"
              :mostrar-etiqueta="true"
              @cambio="aplicarFiltros"
            />
          </div>

          <div class="campo-texto">
            <CampoEntrada
              v-model="filtros.observacion"
              etiqueta="Observación"
              placeholder="Buscar en observaciones..."
              tipo="text"
              @cambio="aplicarFiltros"
            />
          </div>
        </div>

        <!-- Fila de Acciones -->
        <div class="filtros-fila-acciones">
          <div class="indicadores-filtros">
            <span
              v-if="filtrosActivosTrazabilidad > 0"
              class="filtros-activos-badge"
            >
              <span class="icono">🔍</span>
              {{ filtrosActivosTrazabilidad }} filtro{{
                filtrosActivosTrazabilidad !== 1 ? "s" : ""
              }}
              activo{{ filtrosActivosTrazabilidad !== 1 ? "s" : "" }}
            </span>
          </div>

          <div class="grupo-acciones-filtros">
            <button
              type="button"
              class="boton boton-secundario boton-limpiar"
              @click="limpiarFiltros"
              title="Limpiar todos los filtros"
              :disabled="filtrosActivosTrazabilidad === 0"
            >
              <span class="icono-boton">🗑️</span>
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario de nuevo movimiento -->
    <div v-if="mostrarFormulario" class="seccion-formulario">
      <div class="contenedor-formulario">
        <div class="encabezado-formulario">
          <h2 class="titulo-formulario">Registrar Nuevo Movimiento</h2>
          <button type="button" class="boton-cerrar" @click="cerrarFormulario">
            ✕
          </button>
        </div>

        <FormularioTrazabilidad
          @enviar="manejarEnvioTrazabilidad"
          @cancelar="cerrarFormulario"
        />
      </div>
    </div>

    <!-- Tabla de trazabilidad -->
    <div class="seccion-tabla">
      <div class="encabezado-tabla">
        <h2 class="titulo-tabla">Historial de Movimientos</h2>
        <div class="info-tabla">
          <span class="contador-registros">
            {{ trazabilidadFiltrada.length }}
            {{
              trazabilidadFiltrada.length === 1 ? "movimiento" : "movimientos"
            }}
          </span>
        </div>
      </div>

      <!-- Tabla especializada de trazabilidad -->
      <TablaTrazabilidad
        :movimientos="trazabilidadFiltrada"
        :cargando="cargandoDatos"
        :tiene-activos-filtros="Boolean(tieneActivosFiltros)"
        @ver-detalle="verDetalleMovimiento"
        @editar="editarMovimiento"
        @imprimir="imprimirEtiqueta"
        @crear-movimiento="mostrarFormulario = true"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { usarPaginacion } from "@/composables/usarPaginacion";
import { usarExportacionExcel } from "@/composables/usarExportacionExcel";
import { servicioTrazabilidad } from "@/servicios/servicioTrazabilidad";
import { servicioMantenedores } from "@/servicios/servicioMantenedores";
import CampoEntrada from "@/componentes/CampoEntrada.vue";
import MensajeEstado from "@/componentes/MensajeEstado.vue";
import TablaTrazabilidad from "@/componentes/tablas/TablaTrazabilidad.vue";
import FormularioTrazabilidad from "@/componentes/formularios/FormularioTrazabilidad.vue";
import {
  PLANTAS,
  TIPOS_MOVIMIENTO,
  MENSAJES,
  obtenerOpcionesSelect,
} from "@/utilidades/constantes";
import {
  fechaActualParaInput,
  filtrarPorTexto,
  filtrarPorRangoFechas,
} from "@/utilidades/auxiliares";

// ============== ESTADO REACTIVO ==============

// Estado de datos
const trazabilidad = ref([]);
const ubicaciones = ref([]);
const trazabilidadFiltrada = ref([]);

// Estado de UI
const mostrarFormulario = ref(false);
const cargandoDatos = ref(false);
const mensajeExito = ref("");
const mensajeError = ref("");

// Filtros
const filtros = ref({
  busqueda: "", // Busca en múltiples campos
  planta: "Rancagua", // Campo real: planta
  tipoMovimiento: "", // Campo real: tipo_movimiento
  fechaDesde: "", // Campo real: fecha (desde)
  fechaHasta: "", // Campo real: fecha (hasta)
  proveedor: "", // Campo real: proveedor
  lote: "", // Campo real: lote
  clasificacion: "", // Campo real: clasificacion
  bodegaOrigen: "", // Campo real: bodega_origen
  bodegaDestino: "", // Campo real: bodega_destino
  turno: "", // Campo real: turno
  guiaSII: "", // Campo real: guia_sii
  numeroEmbarque: "", // Campo real: numero_embarque
  patenteCamion: "", // Campo real: patente_camion
  ubicacionOrigen: "", // Campo real: ubicacion_origen
  ubicacionDestino: "", // Campo real: ubicacion_destino
  temporada: "", // Campo real: temporada
  observacion: "", // Campo real: observacion
});

// Paginación
const paginacion = usarPaginacion({
  elementosPorPagina: 50,
  paginaActual: 1,
});

// Exportación Excel
const {
  exportando,
  exportarAExcel: exportarExcel,
  prepararDatosTrazabilidad,
  obtenerConfiguracionColumnas,
} = usarExportacionExcel();

// Función para manejar el envío del formulario de trazabilidad
async function manejarEnvioTrazabilidad(datosFormulario) {
  try {
    cargandoDatos.value = true;

    // Preparar datos para la API
    const datosEnvio = {
      codigo_material: datosFormulario.codigoMaterial,
      nombre_material: datosFormulario.nombreMaterial,
      lote: datosFormulario.lote,
      tarja: datosFormulario.tarja,
      tipo_movimiento: datosFormulario.tipoMovimiento,
      cantidad: parseFloat(datosFormulario.cantidad),
      ubicacion_origen: datosFormulario.ubicacionOrigen,
      ubicacion_destino: datosFormulario.ubicacionDestino,
      turno: datosFormulario.turno,
      fecha_movimiento: datosFormulario.fecha,
      observaciones: datosFormulario.observaciones,
      planta: datosFormulario.planta,
    };

    // Llamar al servicio de trazabilidad
    await servicioTrazabilidad.crearMovimiento(datosEnvio);

    mensajeExito.value = "Movimiento registrado exitosamente";
    mostrarFormulario.value = false;

    // Recargar datos
    await cargarTrazabilidad();
  } catch (error) {
    console.error("Error al guardar movimiento:", error);
    mensajeError.value = error.message || "Error al guardar el movimiento";
  } finally {
    cargandoDatos.value = false;
  }
}

// ============== COMPUTED PROPERTIES ==============

const plantasDisponibles = computed(() => obtenerOpcionesSelect(PLANTAS));

const tiposMovimientoDisponibles = computed(() =>
  obtenerOpcionesSelect(TIPOS_MOVIMIENTO)
);

const turnosRealesDisponibles = computed(() => {
  const turnosUnicos = [
    ...new Set(trazabilidad.value.map((item) => item.turno).filter(Boolean)),
  ];

  return turnosUnicos.map((turno) => ({
    value: turno,
    label: turno,
  }));
});

const clasificacionesDisponibles = computed(() => {
  const clasificacionesUnicas = [
    ...new Set(
      trazabilidad.value.map((item) => item.clasificacion).filter(Boolean)
    ),
  ];

  return clasificacionesUnicas.map((clasificacion) => ({
    value: clasificacion,
    label: clasificacion,
  }));
});

const proveedoresDisponibles = computed(() => {
  const proveedoresUnicos = [
    ...new Set(
      trazabilidad.value.map((item) => item.proveedor).filter(Boolean)
    ),
  ];

  return proveedoresUnicos.map((proveedor) => ({
    value: proveedor,
    label: proveedor,
  }));
});

const bodegasOrigenDisponibles = computed(() => {
  const bodegasUnicas = [
    ...new Set(
      trazabilidad.value.map((item) => item.bodega_origen).filter(Boolean)
    ),
  ];

  return bodegasUnicas.map((bodega) => ({
    value: bodega,
    label: bodega,
  }));
});

const bodegasDestinoDisponibles = computed(() => {
  const bodegasUnicas = [
    ...new Set(
      trazabilidad.value.map((item) => item.bodega_destino).filter(Boolean)
    ),
  ];

  return bodegasUnicas.map((bodega) => ({
    value: bodega,
    label: bodega,
  }));
});

const temporadasDisponibles = computed(() => {
  const temporadasUnicas = [
    ...new Set(
      trazabilidad.value.map((item) => item.temporada).filter(Boolean)
    ),
  ];

  return temporadasUnicas.map((temporada) => ({
    value: temporada,
    label: temporada,
  }));
});

const fechaActual = computed(() => fechaActualParaInput());

const tieneActivosFiltros = computed(() => {
  const filtrosActivos = [
    filtros.value.busqueda,
    filtros.value.tipoMovimiento,
    filtros.value.fechaDesde,
    filtros.value.fechaHasta,
    filtros.value.proveedor,
    filtros.value.lote,
    filtros.value.clasificacion,
    filtros.value.bodegaOrigen,
    filtros.value.bodegaDestino,
    filtros.value.turno,
    filtros.value.guiaSII,
    filtros.value.numeroEmbarque,
    filtros.value.patenteCamion,
    filtros.value.ubicacionOrigen,
    filtros.value.ubicacionDestino,
    filtros.value.temporada,
    filtros.value.observacion,
  ].filter((filtro) => filtro && filtro.toString().trim() !== "");

  return filtrosActivos.length > 0;
});

const filtrosActivosTrazabilidad = computed(() => {
  return [
    filtros.value.busqueda,
    filtros.value.tipoMovimiento,
    filtros.value.fechaDesde,
    filtros.value.fechaHasta,
    filtros.value.proveedor,
    filtros.value.lote,
    filtros.value.clasificacion,
    filtros.value.bodegaOrigen,
    filtros.value.bodegaDestino,
    filtros.value.turno,
    filtros.value.guiaSII,
    filtros.value.numeroEmbarque,
    filtros.value.patenteCamion,
    filtros.value.ubicacionOrigen,
    filtros.value.ubicacionDestino,
    filtros.value.temporada,
    filtros.value.observacion,
  ].filter((filtro) => filtro && filtro.toString().trim() !== "").length;
});

// ============== MÉTODOS ==============

async function cargarTrazabilidad() {
  cargandoDatos.value = true;
  mensajeError.value = "";

  try {
    const datos = await servicioTrazabilidad.obtenerMovimientos({
      planta: filtros.value.planta,
      limite: 1000, // Cargar más registros para el historial
    });

    trazabilidad.value = datos || [];
    aplicarFiltros();
    mensajeExito.value = "Historial actualizado correctamente";
  } catch (error) {
    console.error("Error al cargar trazabilidad:", error);
    mensajeError.value = error.message || MENSAJES.ERROR_GENERICO;
  } finally {
    cargandoDatos.value = false;
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

function aplicarFiltros() {
  let datos = [...trazabilidad.value];

  // Aplicar filtro de búsqueda
  if (filtros.value.busqueda) {
    datos = filtrarPorTexto(datos, filtros.value.busqueda, [
      "codigo_material",
      "nombre_material",
      "lote",
      "id_movimiento",
      "proveedor",
      "observacion",
      "guia_sii",
      "clasificacion",
      "bodega_origen",
      "bodega_destino",
      "ubicacion_origen",
      "ubicacion_destino",
      "numero_embarque",
      "patente_camion",
    ]);
  }

  // Aplicar filtro de tipo de movimiento
  if (filtros.value.tipoMovimiento) {
    datos = datos.filter(
      (item) => item.tipo_movimiento === filtros.value.tipoMovimiento
    );
  }

  // Aplicar filtro de proveedor (selector exacto)
  if (filtros.value.proveedor) {
    datos = datos.filter((item) => item.proveedor === filtros.value.proveedor);
  }

  // Aplicar filtro de lote
  if (filtros.value.lote) {
    const lote = filtros.value.lote.toLowerCase();
    datos = datos.filter((item) => item.lote?.toLowerCase().includes(lote));
  }

  // Aplicar filtro de clasificación
  if (filtros.value.clasificacion) {
    datos = datos.filter(
      (item) => item.clasificacion === filtros.value.clasificacion
    );
  }

  // Aplicar filtro de bodega origen (selector exacto)
  if (filtros.value.bodegaOrigen) {
    datos = datos.filter(
      (item) => item.bodega_origen === filtros.value.bodegaOrigen
    );
  }

  // Aplicar filtro de bodega destino (selector exacto)
  if (filtros.value.bodegaDestino) {
    datos = datos.filter(
      (item) => item.bodega_destino === filtros.value.bodegaDestino
    );
  }

  // Aplicar filtro de turno
  if (filtros.value.turno) {
    datos = datos.filter((item) => item.turno === filtros.value.turno);
  }

  // Aplicar filtro de guía SII
  if (filtros.value.guiaSII) {
    const guiaSII = filtros.value.guiaSII.toLowerCase();
    datos = datos.filter((item) =>
      item.guia_sii?.toLowerCase().includes(guiaSII)
    );
  }

  // Aplicar filtro de número de embarque
  if (filtros.value.numeroEmbarque) {
    const numeroEmbarque = filtros.value.numeroEmbarque.toLowerCase();
    datos = datos.filter((item) =>
      item.numero_embarque?.toLowerCase().includes(numeroEmbarque)
    );
  }

  // Aplicar filtro de patente de camión
  if (filtros.value.patenteCamion) {
    const patenteCamion = filtros.value.patenteCamion.toLowerCase();
    datos = datos.filter((item) =>
      item.patente_camion?.toLowerCase().includes(patenteCamion)
    );
  }

  // Aplicar filtro de ubicación origen
  if (filtros.value.ubicacionOrigen) {
    const ubicacionOrigen = filtros.value.ubicacionOrigen.toLowerCase();
    datos = datos.filter((item) =>
      item.ubicacion_origen?.toLowerCase().includes(ubicacionOrigen)
    );
  }

  // Aplicar filtro de ubicación destino
  if (filtros.value.ubicacionDestino) {
    const ubicacionDestino = filtros.value.ubicacionDestino.toLowerCase();
    datos = datos.filter((item) =>
      item.ubicacion_destino?.toLowerCase().includes(ubicacionDestino)
    );
  }

  // Aplicar filtro de temporada
  if (filtros.value.temporada) {
    datos = datos.filter((item) => item.temporada === filtros.value.temporada);
  }

  // Aplicar filtro de observación
  if (filtros.value.observacion) {
    const observacion = filtros.value.observacion.toLowerCase();
    datos = datos.filter((item) =>
      item.observacion?.toLowerCase().includes(observacion)
    );
  }

  // Aplicar filtro de fechas
  if (filtros.value.fechaDesde || filtros.value.fechaHasta) {
    datos = filtrarPorRangoFechas(
      datos,
      "fecha",
      filtros.value.fechaDesde,
      filtros.value.fechaHasta
    );
  }

  trazabilidadFiltrada.value = datos;
  paginacion.totalRegistros.value = datos.length;
  paginacion.paginaActual.value = 1; // Resetear a primera página
}

function limpiarFiltros() {
  filtros.value = {
    busqueda: "",
    planta: filtros.value.planta, // Mantener la planta seleccionada
    tipoMovimiento: "",
    fechaDesde: "",
    fechaHasta: "",
    proveedor: "",
    lote: "",
    clasificacion: "",
    bodegaOrigen: "",
    bodegaDestino: "",
    turno: "",
    guiaSII: "",
    numeroEmbarque: "",
    patenteCamion: "",
    ubicacionOrigen: "",
    ubicacionDestino: "",
    temporada: "",
    observacion: "",
  };
  aplicarFiltros();
}

async function exportarDatos() {
  try {
    // TODO: Implementar exportación
    mensajeExito.value = "Funcionalidad de exportación en desarrollo";
  } catch {
    mensajeError.value = "Error al exportar datos";
  }
}

function cerrarFormulario() {
  mostrarFormulario.value = false;
}

async function exportarAExcel() {
  try {
    if (trazabilidadFiltrada.value.length === 0) {
      mensajeError.value = "No hay datos para exportar";
      return;
    }

    const datosExcel = prepararDatosTrazabilidad(trazabilidadFiltrada.value);
    const configuracionColumnas = obtenerConfiguracionColumnas("trazabilidad");

    const resultado = exportarExcel(
      datosExcel,
      "trazabilidad_reporte",
      "Trazabilidad",
      { anchoColumnas: configuracionColumnas }
    );

    mensajeExito.value = `Reporte exportado exitosamente: ${resultado.nombreArchivo} (${resultado.registrosExportados} registros)`;
  } catch (error) {
    console.error("Error al exportar a Excel:", error);
    mensajeError.value = `Error al generar el reporte Excel: ${error.message}`;
  }
}

// Métodos específicos para la tabla de trazabilidad
function verDetalleMovimiento(movimiento) {
  // TODO: Implementar modal de detalle de movimiento
  mensajeExito.value = `Detalle del movimiento ${movimiento.id_movimiento} (funcionalidad en desarrollo)`;
}

function editarMovimiento(movimiento) {
  // TODO: Implementar edición de movimiento
  mensajeExito.value = `Edición del movimiento ${movimiento.id_movimiento} (funcionalidad en desarrollo)`;
}

function imprimirEtiqueta(movimiento) {
  // TODO: Implementar impresión de etiquetas
  mensajeExito.value = `Impresión de etiqueta para ${movimiento.id_movimiento} (funcionalidad en desarrollo)`;
}

// ============== WATCHERS ==============

watch(
  () => [
    filtros.value.busqueda,
    filtros.value.tipoMovimiento,
    filtros.value.fechaDesde,
    filtros.value.fechaHasta,
  ],
  () => {
    aplicarFiltros();
  }
);

// ============== LIFECYCLE ==============

onMounted(async () => {
  await Promise.all([cargarTrazabilidad(), cargarUbicaciones()]);
});
</script>

<style scoped>
/* Importar estilos optimizados de filtros */
@import "../estilos/filtros-optimizados.css";

.vista-trazabilidad {
  padding: 1.5rem;
  max-width: 100%;
  margin: 0 auto;
  overflow-x: auto;
}

/* Reutilizar estilos base de VistaInventario */
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

/* Estilos específicos para VistaTrazabilidad */
.indicadores-filtros {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.grupo-acciones-filtros {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: flex-end;
}

/* Optimización específica para el layout de trazabilidad */
.vista-trazabilidad .filtros-fila-principal {
  grid-template-columns: 2.5fr 1fr 1fr;
}

.vista-trazabilidad .filtros-fila-secundaria {
  grid-template-columns: repeat(4, minmax(140px, 1fr));
}

.vista-trazabilidad .filtros-fila-avanzada {
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}

.vista-trazabilidad .filtros-fila-extra {
  grid-template-columns: repeat(4, minmax(140px, 1fr));
}

.vista-trazabilidad .filtros-fila-acciones {
  justify-content: space-between;
  align-items: center;
}

/* Badges para tipos de movimiento */
.badge-movimiento {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge-ingreso {
  background: #dcfce7;
  color: #166534;
}

.badge-salida {
  background: #fee2e2;
  color: #991b1b;
}

.badge-movimiento {
  background: #dbeafe;
  color: #1e40af;
}

.badge-neutral {
  background: #f3f4f6;
  color: #374151;
}

/* Formateo de material */
.material-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.material-nombre {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
  line-height: 1.2;
}

.material-detalle {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.material-codigo {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.material-clasificacion {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 400;
  text-transform: capitalize;
}

/* Formateo de cantidad */
.cantidad-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
}

.cantidad-valor {
  font-weight: 600;
  color: #1f2937;
}

.cantidad-unidad {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
}

/* Formateo de fecha/hora */
.fecha-completa {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.fecha-valor {
  font-weight: 500;
  color: #1f2937;
}

.hora-valor {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Formateo de proveedor */
.proveedor-info {
  display: flex;
  align-items: center;
}

.proveedor-nombre {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
}

/* Formateo de observación */
.observacion-info {
  max-width: 200px;
}

.observacion-texto {
  font-size: 0.875rem;
  color: #1f2937;
  line-height: 1.3;
  word-break: break-word;
}

/* Texto N/A */
.texto-na {
  font-size: 0.875rem;
  color: #9ca3af;
  font-style: italic;
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

.formulario-trazabilidad {
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

/* Tabla */
.seccion-tabla {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
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

.contador-registros {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
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

/* Tabla de trazabilidad extendida */
.seccion-tabla {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 1rem;
}

.seccion-tabla table {
  min-width: 2000px; /* Ancho mínimo para todas las columnas */
}

/* Responsive */
@media (max-width: 1024px) {
  .vista-trazabilidad {
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

  .formulario-trazabilidad {
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
}
</style>
