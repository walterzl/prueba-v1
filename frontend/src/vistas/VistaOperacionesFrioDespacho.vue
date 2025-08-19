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
    <div class="seccion-filtros">
      <div class="contenedor-filtros">
        <div class="filtros-fila-principal">
          <CampoEntrada
            v-model="filtros.busqueda"
            etiqueta="Buscar"
            placeholder="Número de operación, material, cliente..."
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
            v-model="filtros.tipoOperacion"
            etiqueta="Tipo de Operación"
            tipo="select"
            :opciones="tiposOperacionDisponibles"
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
            v-model="filtros.estado"
            etiqueta="Estado"
            tipo="select"
            :opciones="estadosDisponibles"
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

    <!-- Formulario de nueva operación -->
    <div v-if="mostrarFormulario" class="seccion-formulario">
      <div class="contenedor-formulario">
        <div class="encabezado-formulario">
          <h2 class="titulo-formulario">Registrar Nueva Operación</h2>
          <button
            type="button"
            class="boton-cerrar"
            @click="cerrarFormulario"
            :disabled="formulario.cargandoEnvio"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="guardarOperacion" class="formulario-operacion">
          <div class="campos-formulario">
            <!-- Primera fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.numero_operacion"
                etiqueta="Número de Operación"
                placeholder="Se genera automáticamente"
                solo-lectura
                texto-ayuda="El número se asigna automáticamente al guardar"
              />

              <CampoEntrada
                v-model="formulario.formulario.tipo_operacion"
                etiqueta="Tipo de Operación"
                tipo="select"
                :opciones="tiposOperacionDisponibles"
                es-requerido
                :mensaje-error="formulario.obtenerErrorCampo('tipo_operacion')"
                @blur="formulario.marcarCampoComoTocado('tipo_operacion')"
              />
            </div>

            <!-- Segunda fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.fecha_operacion"
                etiqueta="Fecha de Operación"
                tipo="datetime-local"
                es-requerido
                :maximo="fechaHoraActual"
                :mensaje-error="formulario.obtenerErrorCampo('fecha_operacion')"
                @blur="formulario.marcarCampoComoTocado('fecha_operacion')"
              />

              <CampoEntrada
                v-model="formulario.formulario.turno"
                etiqueta="Turno"
                tipo="select"
                :opciones="turnosDisponibles"
                es-requerido
                :mensaje-error="formulario.obtenerErrorCampo('turno')"
                @blur="formulario.marcarCampoComoTocado('turno')"
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
                v-model="formulario.formulario.cantidad_operacion"
                etiqueta="Cantidad"
                tipo="number"
                placeholder="0"
                es-requerido
                minimo="0.01"
                paso="0.01"
                :mensaje-error="
                  formulario.obtenerErrorCampo('cantidad_operacion')
                "
                @blur="formulario.marcarCampoComoTocado('cantidad_operacion')"
              />
            </div>

            <!-- Quinta fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.ubicacion_origen"
                etiqueta="Ubicación de Origen"
                tipo="select"
                :opciones="ubicacionesDisponibles"
                es-requerido
                :mensaje-error="
                  formulario.obtenerErrorCampo('ubicacion_origen')
                "
                @blur="formulario.marcarCampoComoTocado('ubicacion_origen')"
              />

              <CampoEntrada
                v-model="formulario.formulario.ubicacion_destino"
                etiqueta="Ubicación de Destino"
                tipo="select"
                :opciones="ubicacionesDisponibles"
                texto-ayuda="Solo para operaciones de traslado"
              />
            </div>

            <!-- Sexta fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.temperatura"
                etiqueta="Temperatura (°C)"
                tipo="number"
                placeholder="0"
                paso="0.1"
                texto-ayuda="Temperatura de la cámara fría"
              />

              <CampoEntrada
                v-model="formulario.formulario.cliente"
                etiqueta="Cliente"
                placeholder="Nombre del cliente (si aplica)"
                texto-ayuda="Para operaciones de despacho"
              />
            </div>

            <!-- Séptima fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.estado"
                etiqueta="Estado"
                tipo="select"
                :opciones="estadosDisponibles"
                es-requerido
                :mensaje-error="formulario.obtenerErrorCampo('estado')"
                @blur="formulario.marcarCampoComoTocado('estado')"
              />

              <CampoEntrada
                v-model="formulario.formulario.responsable"
                etiqueta="Responsable"
                placeholder="Nombre del operador"
                es-requerido
                :mensaje-error="formulario.obtenerErrorCampo('responsable')"
                @blur="formulario.marcarCampoComoTocado('responsable')"
              />
            </div>

            <!-- Octava fila -->
            <div class="fila-campos fila-completa">
              <CampoEntrada
                v-model="formulario.formulario.observaciones"
                etiqueta="Observaciones"
                tipo="textarea"
                placeholder="Información adicional sobre la operación..."
                :filas="3"
                texto-ayuda="Opcional: condiciones especiales, incidencias, etc."
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
                formulario.cargandoEnvio ? "Guardando..." : "Guardar Operación"
              }}
            </button>
          </div>
        </form>
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
import { usarFormulario } from "@/composables/usarFormulario";
import { usarPaginacion } from "@/composables/usarPaginacion";
import { usarExportacionExcel } from "@/composables/usarExportacionExcel";
import { servicioOperacionesFrioDespacho } from "@/servicios/servicioOperacionesFrioDespacho";
import { servicioMantenedores } from "@/servicios/servicioMantenedores";
import CampoEntrada from "@/componentes/CampoEntrada.vue";
import MensajeEstado from "@/componentes/MensajeEstado.vue";
import TablaOperacionesFrioDespacho from "@/componentes/tablas/TablaOperacionesFrioDespacho.vue";
import {
  PLANTAS,
  TIPOS_OPERACION_FRIO,
  ESTADOS_OPERACION,
  TURNOS,
  MENSAJES,
  obtenerOpcionesSelect,
} from "@/utilidades/constantes";
import {
  fechaActualParaInput,
  fechaHoraActualParaInput,
  filtrarPorTexto,
  filtrarPorRangoFechas,
  generarId,
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

// Formulario de operación
const formulario = usarFormulario({
  datosIniciales: {
    numero_operacion: "",
    tipo_operacion: "",
    fecha_operacion: fechaHoraActualParaInput(),
    turno: "Turno 1",
    codigo_material: "",
    nombre_material: "",
    lote: "",
    cantidad_operacion: 0,
    ubicacion_origen: "",
    ubicacion_destino: "",
    temperatura: null,
    cliente: "",
    estado: "pendiente",
    responsable: "",
    observaciones: "",
    planta: "Rancagua",
  },
  tipoValidacion: "operacionesFrioDespacho",
  validarEnTiempoReal: true,
});

// ============== COMPUTED PROPERTIES ==============

const plantasDisponibles = computed(() => obtenerOpcionesSelect(PLANTAS));

const tiposOperacionDisponibles = computed(() =>
  obtenerOpcionesSelect(TIPOS_OPERACION_FRIO)
);

const estadosDisponibles = computed(() =>
  obtenerOpcionesSelect(ESTADOS_OPERACION)
);

const turnosDisponibles = computed(() => obtenerOpcionesSelect(TURNOS));

const ubicacionesDisponibles = computed(() => {
  return ubicaciones.value
    .filter((u) => u.planta === formulario.formulario.planta)
    .map((u) => ({
      value: u.title,
      label: `${u.title} (${u.bodega_deposito})`,
    }));
});

const fechaActual = computed(() => fechaActualParaInput());
const fechaHoraActual = computed(() => fechaHoraActualParaInput());

const tieneActivosFiltros = computed(() => {
  const filtrosActivos = [
    filtros.value.busqueda,
    filtros.value.tipoOperacion,
    filtros.value.fechaDesde,
    filtros.value.fechaHasta,
    filtros.value.estado,
  ].filter((filtro) => filtro && filtro.toString().trim() !== "");

  return filtrosActivos.length > 0;
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
    mostrarMensajeExito("Operaciones actualizadas correctamente");
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
    } else {
      formulario.formulario.nombre_material = "";
    }
  } catch (error) {
    console.error("Error al buscar material:", error);
    formulario.formulario.nombre_material = "";
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
  };
  aplicarFiltros();
}

function verDetalleOperacion(operacion) {
  // TODO: Implementar modal de detalle
  mostrarMensajeExito(
    `Detalle de operación ${operacion.numero_operacion} (en desarrollo)`
  );
}

function editarOperacion(operacion) {
  // TODO: Implementar edición
  mostrarMensajeExito(
    `Edición de operación ${operacion.numero_operacion} (en desarrollo)`
  );
}

function completarOperacion(operacion) {
  // TODO: Implementar completado de operación
  mostrarMensajeExito(
    `Completar operación ${operacion.numero_operacion} (en desarrollo)`
  );
}

function imprimirOperacion(operacion) {
  // TODO: Implementar impresión
  mostrarMensajeExito(
    `Impresión de operación ${operacion.numero_operacion} (en desarrollo)`
  );
}

function generarReporte() {
  // TODO: Implementar reporte
  mostrarMensajeExito("Generación de reporte en desarrollo");
}

async function guardarOperacion() {
  const exito = await formulario.manejarEnvio(async (datos) => {
    // Generar número de operación si no existe
    if (!datos.numero_operacion) {
      datos.numero_operacion = `OP-${new Date().getFullYear()}-${generarId(4)}`;
    }

    return await servicioOperacionesFrioDespacho.crearOperacion(datos);
  });

  if (exito) {
    mostrarMensajeExito(MENSAJES.EXITO_CREAR);
    cerrarFormulario();
    await cargarOperaciones();
  }
}

function cerrarFormulario() {
  mostrarFormulario.value = false;
  formulario.reiniciarFormulario();
  // Resetear valores por defecto
  formulario.formulario.fecha_operacion = fechaHoraActualParaInput();
  formulario.formulario.planta = filtros.value.planta;
  formulario.formulario.turno = "Turno 1";
  formulario.formulario.estado = "pendiente";
}

function mostrarMensajeExito(mensaje) {
  mensajeExito.value = mensaje;
  mensajeError.value = "";
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
    await cargarOperaciones();
  }
);

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

/* Filtros */
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
