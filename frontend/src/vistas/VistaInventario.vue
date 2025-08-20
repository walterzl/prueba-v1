<template>
  <div class="vista-inventario">
    <!-- Encabezado de la página -->
    <div class="encabezado-pagina">
      <div class="titulo-seccion">
        <h1 class="titulo-principal">
          <span class="icono-titulo">📦</span>
          Gestión de Inventario
        </h1>
        <p class="subtitulo">Control y registro de inventario por planta</p>
      </div>

      <div class="acciones-principales">
        <button
          type="button"
          class="boton boton-principal"
          @click="mostrarFormulario = true"
          :disabled="cargandoDatos"
        >
          <span class="icono-boton">📝</span>
          Nuevo Inventario
        </button>
        <button
          type="button"
          class="boton boton-secundario"
          @click="cargarInventario"
          :disabled="cargandoDatos"
        >
          <span class="icono-boton">🔄</span>
          Actualizar
        </button>
        <button
          type="button"
          class="boton boton-excel"
          @click="exportarAExcel"
          :disabled="
            cargandoDatos || inventarioFiltrado.length === 0 || exportando
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
    <div class="seccion-filtros vista-inventario">
      <div class="contenedor-filtros">
        <!-- Fila Principal: Búsqueda + Planta + Bodega -->
        <div class="filtros-fila-principal">
          <div class="campo-busqueda-principal">
            <CampoEntrada
              v-model="filtros.busqueda"
              etiqueta="Búsqueda General"
              placeholder="Código, nombre del material o lote..."
              tipo="search"
              :mostrar-etiqueta="true"
            />
          </div>

          <div class="campo-select">
            <CampoEntrada
              v-model="filtros.planta"
              etiqueta="Planta"
              tipo="select"
              :opciones="plantasDisponibles"
              :mostrar-etiqueta="true"
            />
          </div>

          <div class="campo-select">
            <CampoEntrada
              v-model="filtros.bodega"
              etiqueta="Bodega"
              tipo="select"
              :opciones="bodegasDisponibles"
              :mostrar-etiqueta="true"
            />
          </div>
        </div>

        <!-- Fila Secundaria: Ubicación + Lote + Condición + Stock Mínimo -->
        <div class="filtros-fila-secundaria">
          <div class="campo-select">
            <CampoEntrada
              v-model="filtros.ubicacion"
              etiqueta="Ubicación"
              tipo="select"
              :opciones="ubicacionesDisponibles"
              :mostrar-etiqueta="true"
            />
          </div>

          <div class="campo-texto">
            <CampoEntrada
              v-model="filtros.lote"
              etiqueta="Lote"
              placeholder="Buscar por lote..."
              tipo="text"
              :mostrar-etiqueta="true"
            />
          </div>

          <div class="campo-select">
            <CampoEntrada
              v-model="filtros.condicionArmado"
              etiqueta="Condición Armado"
              tipo="select"
              :opciones="condicionesArmadoDisponibles"
              :mostrar-etiqueta="true"
            />
          </div>

          <div class="campo-numero">
            <CampoEntrada
              v-model="filtros.stockMinimo"
              etiqueta="Stock Mínimo"
              placeholder="Stock mayor a..."
              tipo="number"
              minimo="0"
              paso="0.01"
              :mostrar-etiqueta="true"
            />
          </div>
        </div>

        <!-- Fila Avanzada: Stock Máximo + Unidad + Responsable + Fechas -->
        <div class="filtros-fila-avanzada">
          <div class="campo-numero">
            <CampoEntrada
              v-model="filtros.stockMaximo"
              etiqueta="Stock Máximo"
              placeholder="Stock menor a..."
              tipo="number"
              minimo="0"
              paso="0.01"
              :mostrar-etiqueta="true"
            />
          </div>

          <div class="campo-select">
            <CampoEntrada
              v-model="filtros.unidadMedida"
              etiqueta="Unidad Medida"
              tipo="select"
              :opciones="unidadesMedidaDisponibles"
              :mostrar-etiqueta="true"
            />
          </div>

          <div class="campo-texto">
            <CampoEntrada
              v-model="filtros.contadoPor"
              etiqueta="Contado por"
              placeholder="Buscar por responsable..."
              tipo="text"
            />
          </div>

          <div class="campo-fecha">
            <CampoEntrada
              v-model="filtros.fechaInventarioDesde"
              etiqueta="Fecha desde"
              tipo="date"
              :maximo="filtros.fechaInventarioHasta || fechaActual"
            />
          </div>

          <div class="campo-fecha">
            <CampoEntrada
              v-model="filtros.fechaInventarioHasta"
              etiqueta="Fecha hasta"
              tipo="date"
              :minimo="filtros.fechaInventarioDesde"
              :maximo="fechaActual"
            />
          </div>
        </div>

        <!-- Fila de Acciones -->
        <div class="filtros-fila-acciones">
          <div class="indicadores-filtros">
            <span
              v-if="filtrosActivosInventario > 0"
              class="filtros-activos-badge"
            >
              <span class="icono">🔍</span>
              {{ filtrosActivosInventario }} filtro{{
                filtrosActivosInventario !== 1 ? "s" : ""
              }}
              activo{{ filtrosActivosInventario !== 1 ? "s" : "" }}
            </span>
          </div>

          <div class="grupo-acciones-filtros">
            <button
              type="button"
              class="boton boton-secundario boton-limpiar"
              @click="limpiarFiltros"
              title="Limpiar todos los filtros"
              :disabled="filtrosActivosInventario === 0"
            >
              <span class="icono-boton">🗑️</span>
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario de nuevo inventario -->
    <div v-if="mostrarFormulario" class="seccion-formulario">
      <div class="contenedor-formulario">
        <div class="encabezado-formulario">
          <h2 class="titulo-formulario">Registrar Nuevo Inventario</h2>
          <button type="button" class="boton-cerrar" @click="cerrarFormulario">
            ✕
          </button>
        </div>

        <FormularioInventario
          @enviar="manejarEnvioInventario"
          @cancelar="cerrarFormulario"
        />
      </div>
    </div>

    <!-- Tabla de inventario -->
    <div class="seccion-tabla">
      <div class="encabezado-tabla">
        <h2 class="titulo-tabla">Registros de Inventario</h2>
        <div class="info-tabla">
          <span class="contador-registros">
            {{ inventarioFiltrado.length }}
            {{ inventarioFiltrado.length === 1 ? "registro" : "registros" }}
          </span>
        </div>
      </div>

      <!-- Tabla especializada de inventario -->
      <TablaInventario
        :inventario="inventarioFiltrado"
        :cargando="cargandoDatos"
        :tiene-activos-filtros="Boolean(tieneActivosFiltros)"
        @contar="realizarConteo"
        @ajustar-stock="ajustarStock"
        @ver-historial="verHistorialInventario"
        @imprimir-etiqueta="imprimirEtiquetaInventario"
        @crear-registro="mostrarFormulario = true"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { usarPaginacion } from "@/composables/usarPaginacion";
import { usarExportacionExcel } from "@/composables/usarExportacionExcel";
import { servicioInventario } from "@/servicios/servicioInventario";
import { servicioMantenedores } from "@/servicios/servicioMantenedores";
import CampoEntrada from "@/componentes/CampoEntrada.vue";
import MensajeEstado from "@/componentes/MensajeEstado.vue";
import TablaInventario from "@/componentes/tablas/TablaInventario.vue";
import FormularioInventario from "@/componentes/formularios/FormularioInventario.vue";
import {
  PLANTAS,
  CONDICIONES_ARMADO,
  obtenerOpcionesSelect,
} from "@/utilidades/constantes";
import { fechaActualParaInput } from "@/utilidades/auxiliares";

// ============== ESTADO REACTIVO ==============

// Estado de datos
const inventario = ref([]);
const ubicaciones = ref([]);
const inventarioFiltrado = ref([]);

// Estado de UI
const mostrarFormulario = ref(false);
const cargandoDatos = ref(false);
const mensajeExito = ref("");
const mensajeError = ref("");

// Filtros
// Filtros basados en campos reales de la API de inventario
const filtros = ref({
  busqueda: "", // Busca en codigo_material, nombre_material, lote, contado_por
  planta: "Rancagua", // Campo real: planta
  bodega: "", // Campo real: bodega
  ubicacion: "", // Campo real: ubicacion
  lote: "", // Campo real: lote
  condicionArmado: "", // Campo real: condicion_armado
  stockMinimo: "", // Filtro para stock > valor
  stockMaximo: "", // Filtro para stock < valor
  fechaInventarioDesde: "", // Campo real: fecha_inventario (desde)
  fechaInventarioHasta: "", // Campo real: fecha_inventario (hasta)
  unidadMedida: "", // Campo real: unidad_medida
  contadoPor: "", // Campo real: contado_por
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
  prepararDatosInventario,
  obtenerConfiguracionColumnas,
} = usarExportacionExcel();

// Función para manejar el envío del formulario de inventario
async function manejarEnvioInventario(datosFormulario) {
  try {
    cargandoDatos.value = true;

    // Preparar datos para la API
    const datosEnvio = {
      codigo_material: datosFormulario.codigoMaterial,
      nombre_material: datosFormulario.nombreMaterial,
      stock: parseFloat(datosFormulario.stock),
      pallets: parseInt(datosFormulario.pallets) || 0,
      bodega: datosFormulario.bodega,
      ubicacion: datosFormulario.ubicacion,
      lote: datosFormulario.lote,
      fecha_inventario: datosFormulario.fechaInventario,
      condicion_armado: datosFormulario.condicionArmado,
      contado_por: datosFormulario.contadoPor,
      planta: datosFormulario.planta,
    };

    // Llamar al servicio de inventario
    await servicioInventario.crearInventario(datosEnvio);

    mensajeExito.value = "Inventario registrado exitosamente";
    mostrarFormulario.value = false;

    // Recargar datos
    await cargarInventario();
  } catch (error) {
    console.error("Error al guardar inventario:", error);
    mensajeError.value = error.message || "Error al guardar el inventario";
  } finally {
    cargandoDatos.value = false;
  }
}

// ============== COMPUTED PROPERTIES ==============

const plantasDisponibles = computed(() => obtenerOpcionesSelect(PLANTAS));

const unidadesMedidaDisponibles = computed(() => {
  const unidadesUnicas = [
    ...new Set(
      inventario.value.map((item) => item.unidad_medida).filter(Boolean)
    ),
  ];

  return unidadesUnicas.map((unidad) => ({
    value: unidad,
    label: unidad,
  }));
});

const bodegasDisponibles = computed(() => {
  const bodegasUnicas = [
    ...new Set(
      inventario.value
        .filter((item) => item.planta === filtros.value.planta)
        .map((item) => item.bodega)
        .filter(Boolean) // Filtrar valores null/undefined
    ),
  ];

  return bodegasUnicas.map((bodega) => ({
    value: bodega,
    label: bodega,
  }));
});

const ubicacionesDisponibles = computed(() => {
  const ubicacionesUnicas = [
    ...new Set(
      inventario.value
        .filter(
          (item) =>
            item.planta === filtros.value.planta &&
            (!filtros.value.bodega || item.bodega === filtros.value.bodega)
        )
        .map((item) => item.ubicacion)
        .filter(Boolean)
    ),
  ];

  return ubicacionesUnicas.map((ubicacion) => ({
    value: ubicacion,
    label: ubicacion,
  }));
});

const condicionesArmadoDisponibles = computed(() =>
  obtenerOpcionesSelect(CONDICIONES_ARMADO)
);

const fechaActual = computed(() => fechaActualParaInput());

const tieneActivosFiltros = computed(() => {
  const filtrosActivos = [
    filtros.value.busqueda,
    filtros.value.bodega,
    filtros.value.ubicacion,
    filtros.value.lote,
    filtros.value.condicionArmado,
    filtros.value.stockMinimo,
    filtros.value.stockMaximo,
    filtros.value.fechaInventarioDesde,
    filtros.value.fechaInventarioHasta,
    filtros.value.unidadMedida,
    filtros.value.contadoPor,
  ].filter((filtro) => filtro && filtro.toString().trim() !== "");

  return filtrosActivos.length > 0;
});

const filtrosActivosInventario = computed(() => {
  return [
    filtros.value.busqueda,
    filtros.value.bodega,
    filtros.value.ubicacion,
    filtros.value.lote,
    filtros.value.condicionArmado,
    filtros.value.stockMinimo,
    filtros.value.stockMaximo,
    filtros.value.fechaInventarioDesde,
    filtros.value.fechaInventarioHasta,
    filtros.value.unidadMedida,
    filtros.value.contadoPor,
  ].filter((filtro) => filtro && filtro.toString().trim() !== "").length;
});

// ============== MÉTODOS ==============

function normalizarDatosInventario(datosAPI) {
  return datosAPI.map((item) => ({
    // CAMPOS EXACTOS DE LA API - SIN INVENTAR NADA
    id: item.id,
    planta: item.planta,
    codigo_material: item.codigo_material,
    nombre_material: item.nombre_material,
    unidad_medida: item.unidad_medida,
    cod_nombre: item.cod_nombre,
    fecha_inventario: item.fecha_inventario,
    pallets: item.pallets,
    stock: item.stock,
    bodega: item.bodega,
    ubicacion: item.ubicacion,
    lote: item.lote,
    condicion_armado: item.condicion_armado,
    contado_por: item.contado_por,
    fecha_creacion: item.fecha_creacion,
    fecha_actualizacion: item.fecha_actualizacion,
    // OBJETOS ANIDADOS
    material_completo: item.material_completo,
    ubicacion_completa: item.ubicacion_completa,
  }));
}

async function cargarInventario() {
  cargandoDatos.value = true;
  mensajeError.value = "";

  try {
    const datos = await servicioInventario.obtenerInventario({
      planta: filtros.value.planta,
      limite: 1000, // Cargar más registros para el inventario
    });

    console.log("Datos de inventario recibidos:", datos);

    const datosNormalizados = normalizarDatosInventario(datos || []);
    inventario.value = datosNormalizados;
    aplicarFiltros();
    mensajeExito.value = `Inventario cargado: ${datosNormalizados.length} registros`;
  } catch (error) {
    console.error("Error al cargar inventario:", error);
    mensajeError.value = error.message || "Error al cargar el inventario";
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
  let datos = [...inventario.value];

  // Aplicar filtro de búsqueda (campos reales)
  if (filtros.value.busqueda) {
    const busqueda = filtros.value.busqueda.toLowerCase();
    datos = datos.filter((item) => {
      return (
        item.codigo_material?.toLowerCase().includes(busqueda) ||
        item.nombre_material?.toLowerCase().includes(busqueda) ||
        item.cod_nombre?.toLowerCase().includes(busqueda) ||
        item.lote?.toLowerCase().includes(busqueda) ||
        item.contado_por?.toLowerCase().includes(busqueda)
      );
    });
  }

  // Aplicar filtro de bodega (campo real)
  if (filtros.value.bodega) {
    datos = datos.filter((item) => item.bodega === filtros.value.bodega);
  }

  // Aplicar filtro de ubicación (campo real)
  if (filtros.value.ubicacion) {
    datos = datos.filter((item) => item.ubicacion === filtros.value.ubicacion);
  }

  // Aplicar filtro de lote (campo real)
  if (filtros.value.lote) {
    const lote = filtros.value.lote.toLowerCase();
    datos = datos.filter((item) => item.lote?.toLowerCase().includes(lote));
  }

  // Aplicar filtro de condición de armado (campo real)
  if (filtros.value.condicionArmado) {
    datos = datos.filter(
      (item) => item.condicion_armado === filtros.value.condicionArmado
    );
  }

  // Aplicar filtro de stock mínimo (campo real)
  if (
    filtros.value.stockMinimo &&
    !isNaN(parseFloat(filtros.value.stockMinimo))
  ) {
    const stockMin = parseFloat(filtros.value.stockMinimo);
    datos = datos.filter((item) => parseFloat(item.stock) >= stockMin);
  }

  // Aplicar filtro de stock máximo (campo real)
  if (
    filtros.value.stockMaximo &&
    !isNaN(parseFloat(filtros.value.stockMaximo))
  ) {
    const stockMax = parseFloat(filtros.value.stockMaximo);
    datos = datos.filter((item) => parseFloat(item.stock) <= stockMax);
  }

  // Aplicar filtro de unidad de medida (campo real)
  if (filtros.value.unidadMedida) {
    datos = datos.filter(
      (item) => item.unidad_medida === filtros.value.unidadMedida
    );
  }

  // Aplicar filtro de contado por (campo real)
  if (filtros.value.contadoPor) {
    const contadoPor = filtros.value.contadoPor.toLowerCase();
    datos = datos.filter((item) =>
      item.contado_por?.toLowerCase().includes(contadoPor)
    );
  }

  // Aplicar filtro de fechas de inventario (campo real)
  if (
    filtros.value.fechaInventarioDesde ||
    filtros.value.fechaInventarioHasta
  ) {
    datos = datos.filter((item) => {
      const fechaItem = new Date(item.fecha_inventario);
      const cumpleFechaDesde =
        !filtros.value.fechaInventarioDesde ||
        fechaItem >= new Date(filtros.value.fechaInventarioDesde);
      const cumpleFechaHasta =
        !filtros.value.fechaInventarioHasta ||
        fechaItem <= new Date(filtros.value.fechaInventarioHasta);
      return cumpleFechaDesde && cumpleFechaHasta;
    });
  }

  inventarioFiltrado.value = datos;
  paginacion.totalRegistros.value = datos.length;
  paginacion.paginaActual.value = 1; // Resetear a primera página
}

function limpiarFiltros() {
  filtros.value = {
    busqueda: "",
    planta: filtros.value.planta, // Mantener la planta seleccionada
    bodega: "",
    ubicacion: "",
    lote: "",
    condicionArmado: "",
    stockMinimo: "",
    stockMaximo: "",
    fechaInventarioDesde: "",
    fechaInventarioHasta: "",
    unidadMedida: "",
    contadoPor: "",
  };
  aplicarFiltros();
}

function cerrarFormulario() {
  mostrarFormulario.value = false;
}

async function exportarAExcel() {
  try {
    if (inventarioFiltrado.value.length === 0) {
      mensajeError.value = "No hay datos para exportar";
      return;
    }

    const datosExcel = prepararDatosInventario(inventarioFiltrado.value);
    const configuracionColumnas = obtenerConfiguracionColumnas("inventario");

    const resultado = exportarExcel(
      datosExcel,
      "inventario_reporte",
      "Inventario",
      { anchoColumnas: configuracionColumnas }
    );

    mensajeExito.value = `Reporte exportado exitosamente: ${resultado.nombreArchivo} (${resultado.registrosExportados} registros)`;
  } catch (error) {
    console.error("Error al exportar a Excel:", error);
    mensajeError.value = `Error al generar el reporte Excel: ${error.message}`;
  }
}

// Métodos específicos para la tabla de inventario
function realizarConteo(item) {
  // TODO: Implementar modal de conteo
  mensajeExito.value = `Conteo de ${item.codigo_material} iniciado (funcionalidad en desarrollo)`;
}

function ajustarStock(item) {
  // TODO: Implementar modal de ajuste de stock
  mensajeExito.value = `Ajuste de stock para ${item.codigo_material} (funcionalidad en desarrollo)`;
}

function verHistorialInventario(item) {
  // TODO: Implementar modal de historial
  mensajeExito.value = `Historial de ${item.codigo_material} (funcionalidad en desarrollo)`;
}

function imprimirEtiquetaInventario(item) {
  // TODO: Implementar impresión de etiquetas
  mensajeExito.value = `Impresión de etiqueta para ${item.codigo_material} (funcionalidad en desarrollo)`;
}

// ============== WATCHERS ==============

watch(
  () => [
    filtros.value.busqueda,
    filtros.value.bodega,
    filtros.value.ubicacion,
    filtros.value.lote,
    filtros.value.condicionArmado,
    filtros.value.stockMinimo,
    filtros.value.stockMaximo,
    filtros.value.fechaInventarioDesde,
    filtros.value.fechaInventarioHasta,
    filtros.value.unidadMedida,
    filtros.value.contadoPor,
  ],
  () => {
    aplicarFiltros();
  }
);

// ============== LIFECYCLE ==============

onMounted(async () => {
  await Promise.all([cargarInventario(), cargarUbicaciones()]);
});
</script>

<style scoped>
/* Importar estilos optimizados de filtros */
@import "../estilos/filtros-optimizados.css";

.vista-inventario {
  padding: 1.5rem;
  max-width: 100%;
  margin: 0 auto;
}

/* Encabezado de página */
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

/* Botones */
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

/* Estilos específicos para VistaInventario */
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

.campo-numero {
  min-width: 120px;
  max-width: 160px;
}

/* Optimización específica para el layout de inventario */
.vista-inventario .filtros-fila-principal {
  grid-template-columns: 2.5fr 1fr 1fr;
}

.vista-inventario .filtros-fila-secundaria {
  grid-template-columns: repeat(4, minmax(140px, 1fr));
}

.vista-inventario .filtros-fila-avanzada {
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.vista-inventario .filtros-fila-acciones {
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

.formulario-inventario {
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

/* Spinner pequeño */
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
  .vista-inventario {
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

  .filtros-fila-tercera {
    justify-content: center;
  }

  .fila-campos {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .encabezado-formulario {
    padding: 1rem 1.5rem;
  }

  .formulario-inventario {
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
