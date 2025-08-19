<template>
  <div class="vista-tarjas">
    <!-- Encabezado de la página -->
    <div class="encabezado-pagina">
      <div class="titulo-seccion">
        <h1 class="titulo-principal">
          <span class="icono-titulo">🏷️</span>
          Gestión de Tarjas
        </h1>
        <p class="subtitulo">Control y seguimiento de etiquetas CAA y bodega</p>
      </div>

      <div class="acciones-principales">
        <button
          type="button"
          class="boton boton-principal"
          @click="mostrarFormulario = true"
          :disabled="cargandoDatos"
        >
          <span class="icono-boton">🏷️</span>
          Nueva Tarja
        </button>
        <button
          type="button"
          class="boton boton-secundario"
          @click="cargarTarjas"
          :disabled="cargandoDatos"
        >
          <span class="icono-boton">🔄</span>
          Actualizar
        </button>
        <button
          type="button"
          class="boton boton-secundario"
          @click="imprimirTarjas"
          :disabled="cargandoDatos || tarjasFiltradas.length === 0"
        >
          <span class="icono-boton">🖨️</span>
          Imprimir
        </button>
        <button
          type="button"
          class="boton boton-excel"
          @click="exportarAExcel"
          :disabled="
            cargandoDatos || tarjasFiltradas.length === 0 || exportando
          "
        >
          <span class="icono-boton">📊</span>
          {{ exportando ? "Exportando..." : "Excel" }}
        </button>
        <div class="grupo-botones-qr">
          <button
            type="button"
            class="boton boton-qr"
            @click="abrirModalQR('escanear')"
            :disabled="cargandoDatos"
          >
            <span class="icono-boton">📱</span>
            Escanear QR
          </button>
          <button
            type="button"
            class="boton boton-qr-secundario"
            @click="mostrarMenuQR = !mostrarMenuQR"
            :disabled="cargandoDatos || tarjasFiltradas.length === 0"
            title="Generar códigos QR"
          >
            <span class="icono-boton">⚙️</span>
          </button>

          <!-- Menú desplegable QR -->
          <div v-if="mostrarMenuQR" class="menu-qr-desplegable" @click.stop>
            <button
              type="button"
              class="item-menu-qr"
              @click="generarQRParaPrimera()"
              :disabled="tarjasFiltradas.length === 0"
            >
              <span class="icono-menu">🏷️</span>
              QR Primera Tarja
            </button>
            <button
              type="button"
              class="item-menu-qr"
              @click="generarQRMasivo()"
              :disabled="tarjasFiltradas.length === 0"
            >
              <span class="icono-menu">📦</span>
              QR Masivo ({{ tarjasFiltradas.length }})
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensajes de estado -->
    <MensajeEstado
      v-if="mensajeExito && mensajeExito.length > 0"
      tipo="exito"
      :mensaje="mensajeExito"
      :visible="true"
      @cerrar="mensajeExito = ''"
      auto-cerrar
      :tiempo-auto-cierre="3000"
    />

    <MensajeEstado
      v-if="mensajeError && mensajeError.length > 0"
      tipo="error"
      :mensaje="mensajeError"
      :visible="true"
      @cerrar="mensajeError = ''"
    />

    <!-- Filtros de búsqueda -->
    <div class="seccion-filtros">
      <div class="contenedor-filtros">
        <div class="filtros-fila-principal">
          <CampoEntrada
            v-model="filtros.busqueda"
            etiqueta="Buscar"
            placeholder="Número de tarja, material, lote..."
            tipo="search"
            :mostrar-etiqueta="false"
          />

          <CampoEntrada
            v-model="filtros.planta"
            etiqueta="Planta"
            tipo="select"
            :opciones="plantasDisponibles"
            :mostrar-etiqueta="false"
          />

          <CampoEntrada
            v-model="filtros.tipoTarja"
            etiqueta="Tipo de Tarja"
            tipo="select"
            :opciones="tiposTarjaDisponibles"
            :mostrar-etiqueta="false"
          />
        </div>

        <div class="filtros-fila-secundaria">
          <CampoEntrada
            v-model="filtros.fechaDesde"
            etiqueta="Desde"
            tipo="date"
            :maximo="filtros.fechaHasta || fechaActual"
          />

          <CampoEntrada
            v-model="filtros.fechaHasta"
            etiqueta="Hasta"
            tipo="date"
            :minimo="filtros.fechaDesde"
            :maximo="fechaActual"
          />

          <CampoEntrada
            v-model="filtros.estado"
            etiqueta="Estado"
            tipo="select"
            :opciones="estadosDisponibles"
            :mostrar-etiqueta="false"
          />

          <CampoEntrada
            v-model="filtros.proveedor"
            etiqueta="Proveedor"
            tipo="select"
            :opciones="proveedoresDisponibles"
            :mostrar-etiqueta="false"
          />
        </div>

        <div class="filtros-fila-tercera">
          <CampoEntrada
            v-model="filtros.lote"
            etiqueta="Lote"
            placeholder="Buscar por lote..."
            tipo="text"
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

    <!-- Formulario de nueva tarja -->
    <div v-if="mostrarFormulario" class="seccion-formulario">
      <div class="contenedor-formulario">
        <div class="encabezado-formulario">
          <h2 class="titulo-formulario">Registrar Nueva Tarja</h2>
          <button
            type="button"
            class="boton-cerrar"
            @click="cerrarFormulario"
            :disabled="formulario.cargandoEnvio"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="guardarTarja" class="formulario-tarja">
          <div class="campos-formulario">
            <!-- Primera fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.numero_tarja"
                etiqueta="Número de Tarja"
                placeholder="Se genera automáticamente"
                solo-lectura
                texto-ayuda="El número se asigna automáticamente al guardar"
              />

              <CampoEntrada
                v-model="formulario.formulario.tipo_tarja"
                etiqueta="Tipo de Tarja"
                tipo="select"
                :opciones="tiposTarjaDisponibles"
                es-requerido
                :mensaje-error="formulario.obtenerErrorCampo('tipo_tarja')"
                @blur="formulario.marcarCampoComoTocado('tipo_tarja')"
              />
            </div>

            <!-- Segunda fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.fecha_tarja"
                etiqueta="Fecha de Tarja"
                tipo="date"
                es-requerido
                :maximo="fechaActual"
                :mensaje-error="formulario.obtenerErrorCampo('fecha_tarja')"
                @blur="formulario.marcarCampoComoTocado('fecha_tarja')"
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
                v-model="formulario.formulario.proveedor"
                etiqueta="Proveedor"
                tipo="select"
                :opciones="proveedoresDisponibles"
                es-requerido
                :mensaje-error="formulario.obtenerErrorCampo('proveedor')"
                @blur="formulario.marcarCampoComoTocado('proveedor')"
              />
            </div>

            <!-- Quinta fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.cantidad_total"
                etiqueta="Cantidad Total"
                tipo="number"
                placeholder="0"
                es-requerido
                minimo="0.01"
                paso="0.01"
                :mensaje-error="formulario.obtenerErrorCampo('cantidad_total')"
                @blur="formulario.marcarCampoComoTocado('cantidad_total')"
              />

              <CampoEntrada
                v-model="formulario.formulario.cantidad_disponible"
                etiqueta="Cantidad Disponible"
                tipo="number"
                placeholder="0"
                es-requerido
                minimo="0"
                paso="0.01"
                :maximo="formulario.formulario.cantidad_total"
                :mensaje-error="
                  formulario.obtenerErrorCampo('cantidad_disponible')
                "
                @blur="formulario.marcarCampoComoTocado('cantidad_disponible')"
              />
            </div>

            <!-- Sexta fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.ubicacion_almacenaje"
                etiqueta="Ubicación de Almacenaje"
                tipo="select"
                :opciones="ubicacionesDisponibles"
                es-requerido
                :mensaje-error="
                  formulario.obtenerErrorCampo('ubicacion_almacenaje')
                "
                @blur="formulario.marcarCampoComoTocado('ubicacion_almacenaje')"
              />

              <CampoEntrada
                v-model="formulario.formulario.condicion_armado"
                etiqueta="Condición de Armado"
                tipo="select"
                :opciones="condicionesArmadoDisponibles"
                es-requerido
                :mensaje-error="
                  formulario.obtenerErrorCampo('condicion_armado')
                "
                @blur="formulario.marcarCampoComoTocado('condicion_armado')"
              />
            </div>

            <!-- Séptima fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.fecha_vencimiento"
                etiqueta="Fecha de Vencimiento"
                tipo="date"
                :minimo="fechaActual"
                texto-ayuda="Opcional: fecha de caducidad del material"
              />

              <CampoEntrada
                v-model="formulario.formulario.estado"
                etiqueta="Estado"
                tipo="select"
                :opciones="estadosDisponibles"
                es-requerido
                :mensaje-error="formulario.obtenerErrorCampo('estado')"
                @blur="formulario.marcarCampoComoTocado('estado')"
              />
            </div>

            <!-- Octava fila -->
            <div class="fila-campos fila-completa">
              <CampoEntrada
                v-model="formulario.formulario.observaciones"
                etiqueta="Observaciones"
                tipo="textarea"
                placeholder="Información adicional sobre la tarja..."
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
              {{ formulario.cargandoEnvio ? "Guardando..." : "Guardar Tarja" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tabla de tarjas -->
    <div class="seccion-tabla">
      <div class="encabezado-tabla">
        <h2 class="titulo-tabla">Registro de Tarjas</h2>
        <div class="info-tabla">
          <span class="contador-registros">
            {{ tarjasFiltradas.length }}
            {{ tarjasFiltradas.length === 1 ? "tarja" : "tarjas" }}
          </span>
        </div>
      </div>

      <!-- Estado de carga -->
      <div v-if="cargandoDatos" class="estado-carga">
        <div class="spinner-grande"></div>
        <p>Cargando tarjas...</p>
      </div>

      <!-- Tabla especializada de tarjas -->
      <TablaTarjas
        :tarjas="tarjasFiltradas"
        :cargando="cargandoDatos"
        :tiene-activos-filtros="Boolean(tieneActivosFiltros)"
        @ver-detalle="verDetalleTarja"
        @editar="editarTarja"
        @cerrar="cerrarTarja"
        @duplicar="duplicarTarja"
        @imprimir="imprimirTarja"
        @crear-tarja="mostrarFormulario = true"
      />
    </div>

    <!-- Modal de código QR -->
    <ModalCodigoQR
      :visible="modalQRVisible"
      :datos-tarja="tarjaSeleccionadaQR"
      :modo="modoQR"
      @cerrar="cerrarModalQR"
      @qr-generado="manejarQRGenerado"
      @qr-escaneado="manejarQREscaneado"
      @datos-procesados="manejarDatosProcesados"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { usarFormulario } from "@/composables/usarFormulario";
import { usarPaginacion } from "@/composables/usarPaginacion";
import { usarExportacionExcel } from "@/composables/usarExportacionExcel";
import { servicioTarjas } from "@/servicios/servicioTarjas";
import { servicioMantenedores } from "@/servicios/servicioMantenedores";
import CampoEntrada from "@/componentes/CampoEntrada.vue";
import MensajeEstado from "@/componentes/MensajeEstado.vue";
import TablaTarjas from "@/componentes/tablas/TablaTarjas.vue";
import ModalCodigoQR from "@/componentes/ModalCodigoQR.vue";
import {
  PLANTAS,
  TIPOS_TARJA,
  ESTADOS_TARJA,
  CONDICIONES_ARMADO,
  TEMPORADAS,
  MENSAJES,
  obtenerOpcionesSelect,
} from "@/utilidades/constantes";
import { fechaActualParaInput, generarId } from "@/utilidades/auxiliares";

// ============== ESTADO REACTIVO ==============

// Estado de datos
const tarjas = ref([]);
const proveedores = ref([]);
const ubicaciones = ref([]);
const tarjasFiltradas = ref([]);

// Estado de UI
const mostrarFormulario = ref(false);
const cargandoDatos = ref(false);
const mensajeExito = ref("");
const mensajeError = ref("");

// Modal QR
const modalQRVisible = ref(false);
const tarjaSeleccionadaQR = ref(null);
const modoQR = ref("escanear"); // 'generar' | 'escanear'
const mostrarMenuQR = ref(false);

// Filtros basados en campos reales de la API
const filtros = ref({
  busqueda: "", // Busca en numero_tarja, codigo_material, nombre_material, lote, nombre_proveedor
  planta: "Rancagua", // Campo real: planta
  tipoTarja: "", // Campo real: tipo_tarja
  fechaDesde: "", // Campo real: fecha_generacion (desde)
  fechaHasta: "", // Campo real: fecha_generacion (hasta)
  estado: "", // Campo real: estado
  proveedor: "", // Campo real: nombre_proveedor
  lote: "", // Campo real: lote
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
  prepararDatosTarjas,
  obtenerConfiguracionColumnas,
} = usarExportacionExcel();

// Formulario de tarja
const formulario = usarFormulario({
  datosIniciales: {
    numero_tarja: "",
    tipo_tarja: "CAA",
    fecha_tarja: fechaActualParaInput(),
    temporada: "2024",
    codigo_material: "",
    nombre_material: "",
    lote: "",
    proveedor: "",
    cantidad_total: 0,
    cantidad_disponible: 0,
    ubicacion_almacenaje: "",
    condicion_armado: "Por Armar",
    fecha_vencimiento: "",
    estado: "activo",
    observaciones: "",
    planta: "Rancagua",
  },
  tipoValidacion: "tarjas",
  validarEnTiempoReal: true,
});

// ============== COMPUTED PROPERTIES ==============

const plantasDisponibles = computed(() => obtenerOpcionesSelect(PLANTAS));

const tiposTarjaDisponibles = computed(() =>
  obtenerOpcionesSelect(TIPOS_TARJA)
);

const estadosDisponibles = computed(() => obtenerOpcionesSelect(ESTADOS_TARJA));

const condicionesArmadoDisponibles = computed(() =>
  obtenerOpcionesSelect(CONDICIONES_ARMADO)
);

const temporadasDisponibles = computed(() => obtenerOpcionesSelect(TEMPORADAS));

const proveedoresDisponibles = computed(() => {
  return proveedores.value.map((p) => ({
    value: p.nombre_proveedor,
    label: p.nombre_proveedor,
  }));
});

const ubicacionesDisponibles = computed(() => {
  return ubicaciones.value
    .filter((u) => u.planta === formulario.formulario.planta)
    .map((u) => ({
      value: u.title,
      label: `${u.title} (${u.bodega_deposito})`,
    }));
});

const fechaActual = computed(() => fechaActualParaInput());

const tieneActivosFiltros = computed(() => {
  const filtrosActivos = [
    filtros.value.busqueda,
    filtros.value.tipoTarja,
    filtros.value.fechaDesde,
    filtros.value.fechaHasta,
    filtros.value.estado,
    filtros.value.proveedor,
    filtros.value.lote,
  ].filter((filtro) => filtro && filtro.toString().trim() !== "");

  return filtrosActivos.length > 0;
});

// columnasTabla eliminada por ESLint cleanup
/*const columnasTabla = computed(() => [
  {
    clave: "numero_tarja",
    titulo: "Nº Tarja",
    ordenable: true,
    ancho: "140px",
  },
  {
    clave: "tipo_tarja",
    titulo: "Tipo",
    ordenable: true,
    ancho: "100px",
    alineacion: "centro",
  },
  {
    clave: "material",
    titulo: "Material",
    ordenable: true,
    ancho: "180px",
  },
  {
    clave: "lote",
    titulo: "Lote",
    ordenable: true,
    ancho: "120px",
  },
  {
    clave: "proveedor",
    titulo: "Proveedor",
    ordenable: true,
    ancho: "140px",
  },
  {
    clave: "cantidades",
    titulo: "Cantidades",
    ordenable: false,
    ancho: "120px",
    alineacion: "derecha",
  },
  {
    clave: "ubicacion_almacenaje",
    titulo: "Ubicación",
    ordenable: true,
    ancho: "120px",
  },
  {
    clave: "condicion_armado",
    titulo: "Condición",
    ordenable: true,
    ancho: "120px",
    alineacion: "centro",
  },
  {
    clave: "estado",
    titulo: "Estado",
    ordenable: true,
    ancho: "100px",
    alineacion: "centro",
  },
  {
    clave: "acciones",
    titulo: "Acciones",
    ordenable: false,
    ancho: "140px",
    alineacion: "centro",
  },
]);*/

// ============== MÉTODOS ==============

async function cargarTarjas() {
  cargandoDatos.value = true;
  mensajeError.value = "";

  try {
    const datos = await servicioTarjas.obtenerTarjas({
      planta: filtros.value.planta,
    });

    tarjas.value = datos || [];
    aplicarFiltros();
    mostrarMensajeExito("Tarjas actualizadas correctamente");
  } catch (error) {
    console.error("Error al cargar tarjas:", error);
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
    } else {
      formulario.formulario.nombre_material = "";
    }
  } catch (error) {
    console.error("Error al buscar material:", error);
    formulario.formulario.nombre_material = "";
  }
}

function aplicarFiltros() {
  let datos = [...tarjas.value];

  // Aplicar filtro de búsqueda (en campos reales)
  if (filtros.value.busqueda) {
    const busqueda = filtros.value.busqueda.toLowerCase();
    datos = datos.filter((item) => {
      return (
        item.numero_tarja?.toLowerCase().includes(busqueda) ||
        item.material?.codigo?.toLowerCase().includes(busqueda) ||
        item.material?.nombre?.toLowerCase().includes(busqueda) ||
        item.lote?.toLowerCase().includes(busqueda) ||
        item.proveedor?.nombre?.toLowerCase().includes(busqueda)
      );
    });
  }

  // Aplicar filtro de tipo de tarja (campo real)
  if (filtros.value.tipoTarja) {
    datos = datos.filter((item) => item.tipo_tarja === filtros.value.tipoTarja);
  }

  // Aplicar filtro de estado (campo real)
  if (filtros.value.estado) {
    datos = datos.filter((item) => item.estado === filtros.value.estado);
  }

  // Aplicar filtro de proveedor (campo real)
  if (filtros.value.proveedor) {
    datos = datos.filter(
      (item) => item.proveedor?.nombre === filtros.value.proveedor
    );
  }

  // Aplicar filtro de lote (campo real)
  if (filtros.value.lote) {
    const lote = filtros.value.lote.toLowerCase();
    datos = datos.filter((item) => item.lote?.toLowerCase().includes(lote));
  }

  // Aplicar filtro de fechas (campo real: fecha_generacion)
  if (filtros.value.fechaDesde || filtros.value.fechaHasta) {
    datos = datos.filter((item) => {
      const fechaItem = new Date(item.fecha_generacion);
      const cumpleFechaDesde =
        !filtros.value.fechaDesde ||
        fechaItem >= new Date(filtros.value.fechaDesde);
      const cumpleFechaHasta =
        !filtros.value.fechaHasta ||
        fechaItem <= new Date(filtros.value.fechaHasta);
      return cumpleFechaDesde && cumpleFechaHasta;
    });
  }

  tarjasFiltradas.value = datos;
  paginacion.totalRegistros.value = datos.length;
  paginacion.paginaActual.value = 1;
}

function limpiarFiltros() {
  filtros.value = {
    busqueda: "",
    planta: filtros.value.planta, // Mantener la planta seleccionada
    tipoTarja: "",
    fechaDesde: "",
    fechaHasta: "",
    estado: "",
    proveedor: "",
    lote: "",
  };
  aplicarFiltros();
}

function verDetalleTarja(tarja) {
  // TODO: Implementar modal de detalle
  mostrarMensajeExito(`Detalle de tarja ${tarja.numero_tarja} (en desarrollo)`);
}

function editarTarja(tarja) {
  // TODO: Implementar edición
  mostrarMensajeExito(`Edición de tarja ${tarja.numero_tarja} (en desarrollo)`);
}

function imprimirTarja(tarja) {
  // TODO: Implementar impresión individual
  mostrarMensajeExito(
    `Impresión de tarja ${tarja.numero_tarja} (en desarrollo)`
  );
}

function imprimirTarjas() {
  // TODO: Implementar impresión masiva
  mostrarMensajeExito("Impresión masiva de tarjas en desarrollo");
}

function cerrarTarja(tarja) {
  // TODO: Implementar cierre de tarja
  mostrarMensajeExito(`Cierre de tarja ${tarja.numero_tarja} (en desarrollo)`);
}

function duplicarTarja(tarja) {
  // TODO: Implementar duplicado de tarja
  mostrarMensajeExito(`Duplicar tarja ${tarja.numero_tarja} (en desarrollo)`);
}

async function guardarTarja() {
  const exito = await formulario.manejarEnvio(async (datos) => {
    // Generar número de tarja si no existe
    if (!datos.numero_tarja) {
      datos.numero_tarja = `${
        datos.tipo_tarja
      }-${new Date().getFullYear()}-${generarId(4)}`;
    }

    // Si no se especifica cantidad disponible, usar cantidad total
    if (!datos.cantidad_disponible && datos.cantidad_total) {
      datos.cantidad_disponible = datos.cantidad_total;
    }

    return await servicioTarjas.crearTarja(datos);
  });

  if (exito) {
    mostrarMensajeExito(MENSAJES.EXITO_CREAR);
    cerrarFormulario();
    await cargarTarjas();
  }
}

function cerrarFormulario() {
  mostrarFormulario.value = false;
  formulario.reiniciarFormulario();
  // Resetear valores por defecto
  formulario.formulario.fecha_tarja = fechaActualParaInput();
  formulario.formulario.planta = filtros.value.planta;
  formulario.formulario.tipo_tarja = "CAA";
  formulario.formulario.estado = "activo";
  formulario.formulario.condicion_armado = "Por Armar";
}

function mostrarMensajeExito(mensaje) {
  mensajeExito.value = mensaje;
  mensajeError.value = "";
}

async function exportarAExcel() {
  try {
    if (tarjasFiltradas.value.length === 0) {
      mensajeError.value = "No hay datos para exportar";
      return;
    }

    const datosExcel = prepararDatosTarjas(tarjasFiltradas.value);
    const configuracionColumnas = obtenerConfiguracionColumnas("tarjas");

    const resultado = exportarExcel(datosExcel, "tarjas_reporte", "Tarjas", {
      anchoColumnas: configuracionColumnas,
    });

    mostrarMensajeExito(
      `Reporte exportado exitosamente: ${resultado.nombreArchivo} (${resultado.registrosExportados} registros)`
    );
  } catch (error) {
    console.error("Error al exportar a Excel:", error);
    mensajeError.value = `Error al generar el reporte Excel: ${error.message}`;
  }
}

// ============== FUNCIONES QR ==============

function abrirModalQR(modo, tarja = null) {
  modoQR.value = modo;
  tarjaSeleccionadaQR.value = tarja;
  modalQRVisible.value = true;
}

function cerrarModalQR() {
  modalQRVisible.value = false;
  tarjaSeleccionadaQR.value = null;
  modoQR.value = "escanear";
  mostrarMenuQR.value = false;
}

function manejarQRGenerado(evento) {
  const { tarja } = evento;
  console.log("QR generado para tarja:", tarja.numero_tarja);
  mostrarMensajeExito(
    `Código QR generado exitosamente para la tarja ${tarja.numero_tarja}`
  );
}

function manejarQREscaneado(evento) {
  const { datos, textoOriginal } = evento;
  console.log("QR escaneado:", datos);

  if (typeof datos === "object" && datos.numeroTarja) {
    mostrarMensajeExito(`QR escaneado: Tarja ${datos.numeroTarja} detectada`);

    // Buscar la tarja en la lista actual
    const tarjaEncontrada = tarjas.value.find(
      (t) => t.numero_tarja === datos.numeroTarja || t.id === datos.id
    );

    if (tarjaEncontrada) {
      // Mostrar información de la tarja encontrada
      console.log("Tarja encontrada en el sistema:", tarjaEncontrada);
      mostrarMensajeExito(
        `Tarja ${datos.numeroTarja} encontrada en el sistema`
      );
    } else {
      mostrarMensajeExito(
        `Tarja ${datos.numeroTarja} escaneada (no encontrada en la vista actual)`
      );
    }
  } else {
    mostrarMensajeExito("Código QR escaneado exitosamente");
    console.log("Datos QR no estructurados:", textoOriginal);
  }
}

function manejarDatosProcesados(evento) {
  const { datos, esObjetoTarja } = evento;

  if (esObjetoTarja && datos.numeroTarja) {
    // Procesar datos de tarja
    console.log("Procesando datos de tarja:", datos);

    // Buscar la tarja en el sistema
    const tarjaEncontrada = tarjas.value.find(
      (t) => t.numero_tarja === datos.numeroTarja || t.id === datos.id
    );

    if (tarjaEncontrada) {
      // Abrir detalles de la tarja encontrada
      verDetalleTarja(tarjaEncontrada);
      mostrarMensajeExito(
        `Mostrando detalles de la tarja ${datos.numeroTarja}`
      );
    } else {
      // Mostrar información disponible
      console.log("Información de tarja escaneada:", datos);
      mostrarMensajeExito(
        `Datos de tarja ${datos.numeroTarja} procesados correctamente`
      );
    }
  } else {
    // Procesar datos genéricos
    console.log("Datos procesados:", datos);
    mostrarMensajeExito("Datos del código QR procesados correctamente");
  }

  cerrarModalQR();
}

function generarQRParaPrimera() {
  if (tarjasFiltradas.value.length === 0) return;

  const primeraTarja = tarjasFiltradas.value[0];
  abrirModalQR("generar", primeraTarja);
  mostrarMenuQR.value = false;
}

function generarQRMasivo() {
  // Para QR masivo, podríamos generar QRs para todas las tarjas
  // Por ahora, mostraremos una funcionalidad de ejemplo
  mostrarMenuQR.value = false;

  if (tarjasFiltradas.value.length === 0) return;

  // Generar QR para las primeras tarjas o mostrar modal de selección
  const confirmacion = confirm(
    `¿Generar códigos QR para ${tarjasFiltradas.value.length} tarjas? Esto puede tomar tiempo.`
  );

  if (confirmacion) {
    mostrarMensajeExito(
      `Iniciando generación masiva de ${tarjasFiltradas.value.length} códigos QR...`
    );
    // Aquí podrías implementar la lógica de generación masiva
    console.log(
      "Generando QR masivo para tarjas:",
      tarjasFiltradas.value.map((t) => t.numero_tarja)
    );
  }
}

// Cerrar menú QR al hacer clic fuera
function cerrarMenuQR(evento) {
  if (!evento.target.closest(".grupo-botones-qr")) {
    mostrarMenuQR.value = false;
  }
}

// ============== WATCHERS ==============

watch(
  () => filtros.value.planta,
  async (nuevaPlanta) => {
    formulario.formulario.planta = nuevaPlanta;
    await cargarTarjas();
  }
);

watch(
  () => [
    filtros.value.busqueda,
    filtros.value.tipoTarja,
    filtros.value.fechaDesde,
    filtros.value.fechaHasta,
    filtros.value.estado,
    filtros.value.proveedor,
    filtros.value.lote,
  ],
  () => {
    aplicarFiltros();
  }
);

// ============== LIFECYCLE ==============

onMounted(async () => {
  await Promise.all([cargarTarjas(), cargarProveedores(), cargarUbicaciones()]);

  // Event listener para cerrar menú QR
  document.addEventListener("click", cerrarMenuQR);
});

// Limpiar event listener
onUnmounted(() => {
  document.removeEventListener("click", cerrarMenuQR);
});
</script>

<style scoped>
.vista-tarjas {
  padding: 1.5rem;
  max-width: 100%;
  margin: 0 auto;
}

/* Reutilizar estilos base del patrón establecido */
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

.boton-qr {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);
}

.boton-qr:hover:not(:disabled) {
  background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
  box-shadow: 0 4px 16px rgba(220, 38, 38, 0.3);
  transform: translateY(-1px);
}

.grupo-botones-qr {
  position: relative;
  display: flex;
  gap: 0;
  flex-shrink: 0;
  min-width: 0;
}

.boton-qr-secundario {
  background: linear-gradient(135deg, #991b1b 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0 0.5rem 0.5rem 0;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(153, 27, 27, 0.2);
  margin-left: -1px;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.boton-qr {
  border-radius: 0.5rem 0 0 0.5rem;
}

.boton-qr-secundario:hover:not(:disabled) {
  background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
  box-shadow: 0 4px 16px rgba(153, 27, 27, 0.3);
  transform: translateY(-1px);
}

.menu-qr-desplegable {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 200px;
  padding: 0.5rem 0;
  margin-top: 0.25rem;
}

.item-menu-qr {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  color: #374151;
  font-size: 0.875rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-menu-qr:hover:not(:disabled) {
  background: #f3f4f6;
  color: #7c3aed;
}

.item-menu-qr:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icono-menu {
  font-size: 1rem;
  width: 1.2rem;
  text-align: center;
}

.icono-boton {
  font-size: 1rem;
  line-height: 1;
}

/* Filtros - usando mismo patrón */
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

.filtros-fila-tercera {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.boton-limpiar {
  justify-self: end;
}

/* Formulario - usando mismo patrón */
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

.formulario-tarja {
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

/* Tabla - usando mismo patrón */
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

/* Contenido de celdas específicas para tarjas */
.numero-tarja {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.fecha-tarja {
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

.cantidades-tarja {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  align-items: flex-end;
}

.cantidad-total,
.cantidad-disponible {
  font-size: 0.75rem;
}

.cantidad-total {
  color: #374151;
}

.cantidad-disponible {
  color: #059669;
}

/* Badges específicos para tarjas */
.badge-tipo {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge-caa {
  background: #dbeafe;
  color: #1e40af;
}

.badge-bodega {
  background: #dcfce7;
  color: #166534;
}

.badge-condicion {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge-armado {
  background: #dcfce7;
  color: #166534;
}

.badge-por-armar {
  background: #fef3c7;
  color: #92400e;
}

.badge-semi-armado {
  background: #e0e7ff;
  color: #3730a3;
}

.badge-no-aplica {
  background: #f3f4f6;
  color: #374151;
}

.badge-estado {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge-activo {
  background: #dcfce7;
  color: #166534;
}

.badge-agotado {
  background: #fef3c7;
  color: #92400e;
}

.badge-cerrado {
  background: #f3f4f6;
  color: #374151;
}

.badge-vencido {
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

.boton-cerrar {
  background: #fee2e2;
  color: #991b1b;
}

.boton-cerrar:hover {
  background: #fecaca;
  color: #7f1d1d;
}

/* Estados - reutilizando patrón */
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

/* Responsive - siguiendo mismo patrón */
@media (max-width: 1024px) {
  .vista-tarjas {
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
  .filtros-fila-secundaria,
  .filtros-fila-tercera {
    grid-template-columns: 1fr;
  }

  .fila-campos {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .encabezado-formulario {
    padding: 1rem 1.5rem;
  }

  .formulario-tarja {
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
    gap: 0.75rem;
  }

  .grupo-botones-qr {
    order: -1;
    align-self: stretch;
  }

  .boton-qr,
  .boton-qr-secundario {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }

  .menu-qr-desplegable {
    right: auto;
    left: 0;
    width: 100%;
    min-width: auto;
  }

  .encabezado-tabla {
    padding: 1rem 1.5rem;
  }

  .titulo-tabla {
    font-size: 1rem;
  }

  .acciones-fila {
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .nombre-material {
    max-width: 120px;
  }
}

@media (max-width: 480px) {
  .acciones-principales {
    gap: 0.5rem;
  }

  .boton {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }

  .boton-qr,
  .boton-qr-secundario {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
  }

  .icono-boton {
    font-size: 0.875rem;
  }
}
</style>
