<template>
  <div class="vista-operaciones-frio">
    <!-- Encabezado de la página -->
    <div class="encabezado-pagina">
      <div class="titulo-seccion">
        <h1 class="titulo-principal">
          <span class="icono-titulo">❄️</span>
          Operaciones Frío y Despacho
        </h1>
        <p class="subtitulo">
          Control de operaciones de cámara fría y preparación de despachos
        </p>
      </div>

      <div class="acciones-principales">
        <button
          type="button"
          class="boton boton-principal"
          @click="mostrarFormulario = true"
          :disabled="cargandoDatos"
        >
          <span class="icono-boton">🧊</span>
          Nueva Operación
        </button>
        <button
          type="button"
          class="boton boton-secundario"
          @click="cargarOperaciones"
          :disabled="cargandoDatos"
        >
          <span class="icono-boton">🔄</span>
          Actualizar
        </button>
        <button
          type="button"
          class="boton boton-secundario"
          @click="generarReporte"
          :disabled="cargandoDatos || operacionesFiltradas.length === 0"
        >
          <span class="icono-boton">📊</span>
          Reporte
        </button>
        <button
          type="button"
          class="boton boton-excel"
          @click="exportarAExcel"
          :disabled="
            cargandoDatos || operacionesFiltradas.length === 0 || exportando
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
    <div class="seccion-filtros vista-operaciones-frio">
      <div class="contenedor-filtros">
        <!-- Fila Principal: Búsqueda + Planta + Tipo Operación -->
        <div class="filtros-fila-principal">
          <div class="campo-busqueda-principal">
            <CampoEntrada
              v-model="filtros.busqueda"
              etiqueta="Búsqueda General"
              placeholder="Número de operación, material, cliente..."
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
              v-model="filtros.tipoOperacion"
              etiqueta="Tipo de Operación"
              tipo="select"
              :opciones="tiposOperacionDisponibles"
              :mostrar-etiqueta="true"
              @cambio="aplicarFiltros"
            />
          </div>
        </div>

        <!-- Fila Secundaria: Fechas + Estado -->
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
              v-model="filtros.estado"
              etiqueta="Estado"
              tipo="select"
              :opciones="estadosDisponibles"
              :mostrar-etiqueta="true"
              @cambio="aplicarFiltros"
            />
          </div>
        </div>

        <!-- Fila Avanzada: Filtros adicionales específicos -->
        <div class="filtros-fila-avanzada">
          <div class="campo-select">
            <CampoEntrada
              v-model="filtros.turno"
              etiqueta="Turno"
              tipo="select"
              :opciones="turnosRealesDisponibles"
              @cambio="aplicarFiltros"
            />
          </div>

          <div class="campo-texto">
            <CampoEntrada
              v-model="filtros.lote"
              etiqueta="Lote"
              placeholder="Filtrar por lote..."
              @cambio="aplicarFiltros"
            />
          </div>

          <div class="campo-select">
            <CampoEntrada
              v-model="filtros.material"
              etiqueta="Material"
              tipo="select"
              :opciones="materialesDisponibles"
              @cambio="aplicarFiltros"
            />
          </div>

          <div class="campo-texto">
            <CampoEntrada
              v-model="filtros.numeroEmbarque"
              etiqueta="Nº Embarque"
              placeholder="Filtrar por número de embarque..."
              @cambio="aplicarFiltros"
            />
          </div>

          <div class="campo-texto">
            <CampoEntrada
              v-model="filtros.patenteCamion"
              etiqueta="Patente Camión"
              placeholder="Filtrar por patente..."
              @cambio="aplicarFiltros"
            />
          </div>

          <div class="campo-select">
            <CampoEntrada
              v-model="filtros.ubicacionOrigen"
              etiqueta="Ubicación Origen"
              tipo="select"
              :opciones="ubicacionesOrigenDisponibles"
              @cambio="aplicarFiltros"
            />
          </div>
        </div>

        <!-- Fila de Acciones -->
        <div class="filtros-fila-acciones">
          <div class="indicadores-filtros">
            <span
              v-if="filtrosActivosOperaciones > 0"
              class="filtros-activos-badge"
            >
              <span class="icono">🔍</span>
              {{ filtrosActivosOperaciones }} filtro{{
                filtrosActivosOperaciones !== 1 ? "s" : ""
              }}
              activo{{ filtrosActivosOperaciones !== 1 ? "s" : "" }}
            </span>
          </div>

          <div class="grupo-acciones-filtros">
            <button
              type="button"
              class="boton boton-secundario boton-limpiar"
              @click="limpiarFiltros"
              title="Limpiar todos los filtros"
              :disabled="filtrosActivosOperaciones === 0"
            >
              <span class="icono-boton">🗑️</span>
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario de nueva operación -->
    <div v-if="mostrarFormulario" class="seccion-formulario">
      <div class="contenedor-formulario">
        <div class="encabezado-formulario">
          <h2 class="titulo-formulario">Registrar Nueva Operación</h2>
          <button type="button" class="boton-cerrar" @click="cerrarFormulario">
            ✕
          </button>
        </div>

        <FormularioFrioDespacho
          @enviar="manejarEnvioFrioDespacho"
          @cancelar="cerrarFormulario"
        />
      </div>
    </div>

    <!-- Tabla de operaciones -->
    <div class="seccion-tabla">
      <div class="encabezado-tabla">
        <h2 class="titulo-tabla">Registro de Operaciones</h2>
        <div class="info-tabla">
          <span class="contador-registros">
            {{ operacionesFiltradas.length }}
            {{
              operacionesFiltradas.length === 1 ? "operación" : "operaciones"
            }}
          </span>
        </div>
      </div>

      <!-- Tabla especializada de operaciones frío y despacho -->
      <TablaOperacionesFrioDespacho
        :operaciones="operacionesFiltradas"
        :cargando="cargandoDatos"
        :tiene-activos-filtros="Boolean(tieneActivosFiltros)"
        @ver-detalle="verDetalleOperacion"
        @editar="editarOperacion"
        @completar="completarOperacion"
        @imprimir-etiqueta="imprimirOperacion"
        @crear-operacion="mostrarFormulario = true"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { usarPaginacion } from "@/composables/usarPaginacion";
import { usarExportacionExcel } from "@/composables/usarExportacionExcel";
import { servicioOperacionesFrioDespacho } from "@/servicios/servicioOperacionesFrioDespacho";
import { servicioMantenedores } from "@/servicios/servicioMantenedores";
import CampoEntrada from "@/componentes/CampoEntrada.vue";
import MensajeEstado from "@/componentes/MensajeEstado.vue";
import TablaOperacionesFrioDespacho from "@/componentes/tablas/TablaOperacionesFrioDespacho.vue";
import FormularioFrioDespacho from "@/componentes/formularios/FormularioFrioDespacho.vue";
import {
  PLANTAS,
  TIPOS_OPERACION_FRIO,
  ESTADOS_OPERACION,
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
const operaciones = ref([]);
const ubicaciones = ref([]);
const operacionesFiltradas = ref([]);

// Estado de UI
const mostrarFormulario = ref(false);
const cargandoDatos = ref(false);
const mensajeExito = ref("");
const mensajeError = ref("");

// Filtros
const filtros = ref({
  busqueda: "",
  planta: "Rancagua",
  tipoOperacion: "",
  fechaDesde: "",
  fechaHasta: "",
  estado: "",
  turno: "",
  lote: "",
  material: "",
  numeroEmbarque: "",
  patenteCamion: "",
  ubicacionOrigen: "",
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
  prepararDatosOperaciones,
  obtenerConfiguracionColumnas,
} = usarExportacionExcel();

// Función para manejar el envío del formulario de frío y despacho
async function manejarEnvioFrioDespacho(datosFormulario) {
  try {
    cargandoDatos.value = true;

    // Preparar datos para la API
    const datosEnvio = {
      numero_operacion: datosFormulario.numeroOperacion,
      tipo_operacion: datosFormulario.tipoOperacion,
      fecha_operacion: datosFormulario.fechaOperacion,
      turno: datosFormulario.turno,
      codigo_material: datosFormulario.codigoMaterial,
      nombre_material: datosFormulario.nombreMaterial,
      lote: datosFormulario.lote,
      cantidad_operacion: parseFloat(datosFormulario.cantidad),
      ubicacion_origen: datosFormulario.ubicacionOrigen,
      ubicacion_destino: datosFormulario.ubicacionDestino,
      temperatura: datosFormulario.temperatura
        ? parseFloat(datosFormulario.temperatura)
        : null,
      cliente: datosFormulario.cliente,
      estado: datosFormulario.estado || "pendiente",
      responsable: datosFormulario.responsable || "Usuario",
      observaciones: datosFormulario.observaciones,
      planta: datosFormulario.planta,
    };

    // Llamar al servicio de operaciones de frío y despacho
    await servicioOperacionesFrioDespacho.crearOperacion(datosEnvio);

    mensajeExito.value = "Operación registrada exitosamente";
    mostrarFormulario.value = false;

    // Recargar datos
    await cargarOperaciones();
  } catch (error) {
    console.error("Error al guardar operación:", error);
    mensajeError.value = error.message || "Error al guardar la operación";
  } finally {
    cargandoDatos.value = false;
  }
}

// ============== COMPUTED PROPERTIES ==============

const plantasDisponibles = computed(() => obtenerOpcionesSelect(PLANTAS));

const tiposOperacionDisponibles = computed(() =>
  obtenerOpcionesSelect(TIPOS_OPERACION_FRIO)
);

const estadosDisponibles = computed(() =>
  obtenerOpcionesSelect(ESTADOS_OPERACION)
);

const turnosRealesDisponibles = computed(() => {
  const turnosUnicos = [
    ...new Set(operaciones.value.map((item) => item.turno).filter(Boolean)),
  ];

  return turnosUnicos.map((turno) => ({
    value: turno,
    label: turno,
  }));
});

const materialesDisponibles = computed(() => {
  const materialesUnicos = new Set();
  operaciones.value.forEach((operacion) => {
    if (operacion.material?.nombre) {
      materialesUnicos.add(operacion.material.nombre);
    }
  });
  return Array.from(materialesUnicos).map((material) => ({
    value: material,
    label: material,
  }));
});

const ubicacionesOrigenDisponibles = computed(() => {
  return ubicaciones.value
    .filter((u) => u.planta === filtros.value.planta)
    .map((u) => ({
      value: u.title,
      label: `${u.title} (${u.bodega_deposito})`,
    }));
});

const fechaActual = computed(() => fechaActualParaInput());

const tieneActivosFiltros = computed(() => {
  const filtrosActivos = [
    filtros.value.busqueda,
    filtros.value.tipoOperacion,
    filtros.value.fechaDesde,
    filtros.value.fechaHasta,
    filtros.value.estado,
    filtros.value.turno,
    filtros.value.lote,
    filtros.value.material,
    filtros.value.numeroEmbarque,
    filtros.value.patenteCamion,
    filtros.value.ubicacionOrigen,
  ].filter((filtro) => filtro && filtro.toString().trim() !== "");

  return filtrosActivos.length > 0;
});

const filtrosActivosOperaciones = computed(() => {
  return [
    filtros.value.busqueda,
    filtros.value.tipoOperacion,
    filtros.value.fechaDesde,
    filtros.value.fechaHasta,
    filtros.value.estado,
    filtros.value.turno,
    filtros.value.lote,
    filtros.value.material,
    filtros.value.numeroEmbarque,
    filtros.value.patenteCamion,
    filtros.value.ubicacionOrigen,
  ].filter((filtro) => filtro && filtro.toString().trim() !== "").length;
});

// ============== MÉTODOS ==============

async function cargarOperaciones() {
  cargandoDatos.value = true;
  mensajeError.value = "";

  try {
    const datos = await servicioOperacionesFrioDespacho.obtenerOperaciones({
      planta: filtros.value.planta,
    });

    operaciones.value = datos || [];
    aplicarFiltros();
    mensajeExito.value = "Operaciones actualizadas correctamente";
  } catch (error) {
    console.error("Error al cargar operaciones:", error);
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
  let datos = [...operaciones.value];

  // Aplicar filtro de búsqueda
  if (filtros.value.busqueda) {
    datos = filtrarPorTexto(datos, filtros.value.busqueda, [
      "numero_operacion",
      "codigo_material",
      "nombre_material",
      "lote",
      "cliente",
      "responsable",
      "numero_embarque",
      "patente_camion",
      "observaciones",
    ]);
  }

  // Aplicar filtro de tipo de operación
  if (filtros.value.tipoOperacion) {
    datos = datos.filter(
      (item) => item.tipo_operacion === filtros.value.tipoOperacion
    );
  }

  // Aplicar filtro de estado
  if (filtros.value.estado) {
    datos = datos.filter((item) => item.estado === filtros.value.estado);
  }

  // Aplicar filtro de turno
  if (filtros.value.turno) {
    datos = datos.filter((item) => item.turno === filtros.value.turno);
  }

  // Aplicar filtro de lote
  if (filtros.value.lote) {
    const lote = filtros.value.lote.toLowerCase();
    datos = datos.filter((item) => item.lote?.toLowerCase().includes(lote));
  }

  // Aplicar filtro de material
  if (filtros.value.material) {
    datos = datos.filter(
      (item) => item.material?.nombre === filtros.value.material
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
    datos = datos.filter((item) => {
      const ubicacionNombre =
        item.ubicacion_origen?.title ||
        item.ubicacion_origen?.nombre ||
        item.ubicacion_origen?.id;
      return ubicacionNombre === filtros.value.ubicacionOrigen;
    });
  }

  // Aplicar filtro de fechas
  if (filtros.value.fechaDesde || filtros.value.fechaHasta) {
    datos = filtrarPorRangoFechas(
      datos,
      "fecha_operacion",
      filtros.value.fechaDesde,
      filtros.value.fechaHasta
    );
  }

  operacionesFiltradas.value = datos;
  paginacion.totalRegistros.value = datos.length;
  paginacion.paginaActual.value = 1;
}

function limpiarFiltros() {
  filtros.value = {
    busqueda: "",
    planta: filtros.value.planta,
    tipoOperacion: "",
    fechaDesde: "",
    fechaHasta: "",
    estado: "",
    turno: "",
    lote: "",
    material: "",
    numeroEmbarque: "",
    patenteCamion: "",
    ubicacionOrigen: "",
  };
  aplicarFiltros();
}

function verDetalleOperacion(operacion) {
  // TODO: Implementar modal de detalle
  mensajeExito.value = `Detalle de operación ${operacion.numero_operacion} (en desarrollo)`;
}

function editarOperacion(operacion) {
  // TODO: Implementar edición
  mensajeExito.value = `Edición de operación ${operacion.numero_operacion} (en desarrollo)`;
}

function completarOperacion(operacion) {
  // TODO: Implementar completado de operación
  mensajeExito.value = `Completar operación ${operacion.numero_operacion} (en desarrollo)`;
}

function imprimirOperacion(operacion) {
  // TODO: Implementar impresión
  mensajeExito.value = `Impresión de operación ${operacion.numero_operacion} (en desarrollo)`;
}

function generarReporte() {
  // TODO: Implementar reporte
  mensajeExito.value = "Generación de reporte en desarrollo";
}

function cerrarFormulario() {
  mostrarFormulario.value = false;
}

async function exportarAExcel() {
  try {
    if (operacionesFiltradas.value.length === 0) {
      mensajeError.value = "No hay datos para exportar";
      return;
    }

    const datosExcel = prepararDatosOperaciones(operacionesFiltradas.value);
    const configuracionColumnas = obtenerConfiguracionColumnas("operaciones");

    const resultado = exportarExcel(
      datosExcel,
      "operaciones_frio_despacho_reporte",
      "Operaciones",
      { anchoColumnas: configuracionColumnas }
    );

    mensajeExito.value = `Reporte exportado exitosamente: ${resultado.nombreArchivo} (${resultado.registrosExportados} registros)`;
  } catch (error) {
    console.error("Error al exportar a Excel:", error);
    mensajeError.value = `Error al generar el reporte Excel: ${error.message}`;
  }
}

// ============== WATCHERS ==============

watch(
  () => [
    filtros.value.busqueda,
    filtros.value.tipoOperacion,
    filtros.value.fechaDesde,
    filtros.value.fechaHasta,
    filtros.value.estado,
  ],
  () => {
    aplicarFiltros();
  }
);

// ============== LIFECYCLE ==============

onMounted(async () => {
  await Promise.all([cargarOperaciones(), cargarUbicaciones()]);
});
</script>

<style scoped>
/* Importar estilos optimizados de filtros */
@import "../estilos/filtros-optimizados.css";

.vista-operaciones-frio {
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

/* Estilos específicos para VistaOperacionesFrioDespacho */
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

/* Optimización específica para el layout de operaciones frío */
.vista-operaciones-frio .filtros-fila-principal {
  grid-template-columns: 2.5fr 1fr 1fr;
}

.vista-operaciones-frio .filtros-fila-secundaria {
  grid-template-columns: repeat(3, minmax(140px, 1fr));
}

.vista-operaciones-frio .filtros-fila-avanzada {
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.vista-operaciones-frio .filtros-fila-acciones {
  justify-content: space-between;
  align-items: center;
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

.formulario-operacion {
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

/* Contenido de celdas específicas */
.numero-operacion {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.fecha-operacion {
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
  max-width: 160px;
}

.cantidad-operacion {
  display: flex;
  justify-content: flex-end;
}

.valor-cantidad {
  font-weight: 600;
  color: #1f2937;
}

.temperatura {
  text-align: center;
}

.valor-temperatura {
  font-weight: 600;
  color: #0369a1;
}

.temperatura-na {
  color: #9ca3af;
  font-style: italic;
}

/* Badges de tipo de operación */
.badge-tipo {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge-consumo {
  background: #fef3c7;
  color: #92400e;
}

.badge-despacho {
  background: #dbeafe;
  color: #1e40af;
}

.badge-preparacion {
  background: #e0e7ff;
  color: #3730a3;
}

.badge-almacenaje {
  background: #dcfce7;
  color: #166534;
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
  .vista-operaciones-frio {
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

  .formulario-operacion {
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

  .acciones-fila {
    flex-direction: column;
    gap: 0.25rem;
  }

  .nombre-material {
    max-width: 120px;
  }
}
</style>
