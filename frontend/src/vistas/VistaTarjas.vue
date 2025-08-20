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
    <div class="seccion-filtros vista-tarjas">
      <div class="contenedor-filtros">
        <!-- Fila Principal: Búsqueda + 3 filtros clave -->
        <div class="filtros-fila-principal">
          <div class="campo-busqueda-principal">
            <CampoEntrada
              v-model="filtros.busqueda"
              etiqueta="Búsqueda General"
              placeholder="Número de tarja, material, lote..."
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
              v-model="filtros.tipoTarja"
              etiqueta="Tipo de Tarja"
              tipo="select"
              :opciones="tiposTarjaDisponibles"
              :mostrar-etiqueta="true"
            />
          </div>

          <div class="campo-select">
            <CampoEntrada
              v-model="filtros.material"
              etiqueta="Material"
              tipo="select"
              :opciones="materialesDisponibles"
              :mostrar-etiqueta="true"
            />
          </div>
        </div>

        <!-- Fila Secundaria: Fechas, Estado, Proveedor, Guía, Usuario -->
        <div class="filtros-fila-secundaria">
          <div class="campo-fecha">
            <CampoEntrada
              v-model="filtros.fechaDesde"
              etiqueta="Fecha Desde"
              tipo="date"
              :maximo="filtros.fechaHasta || fechaActual"
              :mostrar-etiqueta="true"
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
            />
          </div>

          <div class="campo-select">
            <CampoEntrada
              v-model="filtros.estado"
              etiqueta="Estado"
              tipo="select"
              :opciones="estadosDisponibles"
              :mostrar-etiqueta="true"
            />
          </div>

          <div class="campo-select">
            <CampoEntrada
              v-model="filtros.proveedor"
              etiqueta="Proveedor"
              tipo="select"
              :opciones="proveedoresDisponibles"
              :mostrar-etiqueta="true"
            />
          </div>

          <div class="campo-texto">
            <CampoEntrada
              v-model="filtros.guia"
              etiqueta="Guía"
              placeholder="Buscar por guía..."
              tipo="text"
              :mostrar-etiqueta="true"
            />
          </div>

          <div class="campo-texto">
            <CampoEntrada
              v-model="filtros.usuario"
              etiqueta="Usuario"
              placeholder="Buscar por usuario..."
              tipo="text"
              :mostrar-etiqueta="true"
            />
          </div>
        </div>

        <!-- Fila de Acciones: Lote + Botón Limpiar -->
        <div class="filtros-fila-acciones">
          <div class="campo-texto">
            <CampoEntrada
              v-model="filtros.lote"
              etiqueta="Lote"
              placeholder="Buscar por lote..."
              tipo="text"
              :mostrar-etiqueta="true"
            />
          </div>

          <div class="grupo-acciones-filtros">
            <span v-if="filtrosActivos > 0" class="filtros-activos-badge">
              <span class="icono">🔍</span>
              {{ filtrosActivos }} filtro{{
                filtrosActivos !== 1 ? "s" : ""
              }}
              activo{{ filtrosActivos !== 1 ? "s" : "" }}
            </span>

            <button
              type="button"
              class="boton boton-secundario boton-limpiar"
              @click="limpiarFiltros"
              title="Limpiar todos los filtros"
              :disabled="filtrosActivos === 0"
            >
              <span class="icono-boton">🗑️</span>
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario de nueva tarja -->
    <FormularioTarjas
      v-if="mostrarFormulario"
      @enviar="manejarEnvioTarjas"
      @cancelar="cerrarFormulario"
    />

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
import { usarPaginacion } from "@/composables/usarPaginacion";
import { usarExportacionExcel } from "@/composables/usarExportacionExcel";
import { servicioTarjas } from "@/servicios/servicioTarjas";
import { servicioMantenedores } from "@/servicios/servicioMantenedores";
import CampoEntrada from "@/componentes/CampoEntrada.vue";
import MensajeEstado from "@/componentes/MensajeEstado.vue";
import TablaTarjas from "@/componentes/tablas/TablaTarjas.vue";
import ModalCodigoQR from "@/componentes/ModalCodigoQR.vue";
import FormularioTarjas from "@/componentes/formularios/FormularioTarjas.vue";
import {
  PLANTAS,
  TIPOS_TARJA,
  ESTADOS_TARJA,
  MENSAJES,
  obtenerOpcionesSelect,
} from "@/utilidades/constantes";
import { generarId } from "@/utilidades/auxiliares";

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

// Filtros basados en campos reales de la tabla
const filtros = ref({
  busqueda: "", // Busca en numero_tarja, material, lote, proveedor
  planta: "Rancagua", // Campo real: planta
  tipoTarja: "", // Campo real: tipo_tarja
  fechaDesde: "", // Campo real: fecha_generacion (desde)
  fechaHasta: "", // Campo real: fecha_generacion (hasta)
  estado: "", // Campo real: estado
  proveedor: "", // Campo real: proveedor
  lote: "", // Campo real: lote
  material: "", // Campo real: material
  guia: "", // Campo real: guia
  usuario: "", // Campo real: usuario
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

// ============== COMPUTED PROPERTIES ==============

const plantasDisponibles = computed(() => obtenerOpcionesSelect(PLANTAS));

const tiposTarjaDisponibles = computed(() =>
  obtenerOpcionesSelect(TIPOS_TARJA)
);

const estadosDisponibles = computed(() => obtenerOpcionesSelect(ESTADOS_TARJA));

const fechaActual = computed(() => {
  const hoy = new Date();
  return hoy.toISOString().split("T")[0];
});

const proveedoresDisponibles = computed(() => {
  // Extraer proveedores únicos directamente de las tarjas cargadas
  const proveedoresUnicos = [
    ...new Set(
      tarjas.value
        .map((tarja) => tarja.proveedor?.completo?.title)
        .filter(Boolean) // Solo valores no nulos/undefined
    ),
  ];

  return proveedoresUnicos.map((proveedor) => ({
    value: proveedor,
    label: proveedor,
  }));
});

const materialesDisponibles = computed(() => {
  // Extraer materiales únicos directamente de las tarjas cargadas
  const materialesUnicos = [
    ...new Set(
      tarjas.value
        .map((tarja) => `${tarja.material?.codigo} - ${tarja.material?.nombre}`)
        .filter((material) => material && material !== "undefined - undefined")
    ),
  ];

  return materialesUnicos.map((material) => ({
    value: material,
    label: material,
  }));
});

const tieneActivosFiltros = computed(() => {
  const filtrosActivos = [
    filtros.value.busqueda,
    filtros.value.tipoTarja,
    filtros.value.fechaDesde,
    filtros.value.fechaHasta,
    filtros.value.estado,
    filtros.value.proveedor,
    filtros.value.lote,
    filtros.value.material,
    filtros.value.guia,
    filtros.value.usuario,
  ].filter((filtro) => filtro && filtro.toString().trim() !== "");

  return filtrosActivos.length > 0;
});

const filtrosActivos = computed(() => {
  return [
    filtros.value.busqueda,
    filtros.value.tipoTarja,
    filtros.value.fechaDesde,
    filtros.value.fechaHasta,
    filtros.value.estado,
    filtros.value.proveedor,
    filtros.value.lote,
    filtros.value.material,
    filtros.value.guia,
    filtros.value.usuario,
  ].filter((filtro) => filtro && filtro.toString().trim() !== "").length;
});

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
    mensajeExito.value = "Tarjas actualizadas correctamente";
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

function aplicarFiltros() {
  let datos = [...tarjas.value];

  // Aplicar filtro de búsqueda (en campos reales de la API)
  if (filtros.value.busqueda) {
    const busqueda = filtros.value.busqueda.toLowerCase();
    datos = datos.filter((item) => {
      return (
        item.numero_tarja?.toLowerCase().includes(busqueda) ||
        item.material?.codigo?.toLowerCase().includes(busqueda) ||
        item.material?.nombre?.toLowerCase().includes(busqueda) ||
        item.lote?.toLowerCase().includes(busqueda) ||
        item.proveedor?.completo?.title?.toLowerCase().includes(busqueda) ||
        (item.guia && item.guia.toLowerCase().includes(busqueda)) ||
        item.usuario?.nombre_usuario?.toLowerCase().includes(busqueda)
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

  // Aplicar filtro de proveedor (campo real: proveedor.completo.title)
  if (filtros.value.proveedor) {
    datos = datos.filter(
      (item) => item.proveedor?.completo?.title === filtros.value.proveedor
    );
  }

  // Aplicar filtro de lote (campo real)
  if (filtros.value.lote) {
    const lote = filtros.value.lote.toLowerCase();
    datos = datos.filter((item) => item.lote?.toLowerCase().includes(lote));
  }

  // Aplicar filtro de material (selector exacto basado en formato "codigo - nombre")
  if (filtros.value.material) {
    datos = datos.filter((item) => {
      const materialCompleto = `${item.material?.codigo} - ${item.material?.nombre}`;
      return materialCompleto === filtros.value.material;
    });
  }

  // Aplicar filtro de guía (campo real: guia puede ser null)
  if (filtros.value.guia) {
    const guia = filtros.value.guia.toLowerCase();
    datos = datos.filter(
      (item) => item.guia && item.guia.toLowerCase().includes(guia)
    );
  }

  // Aplicar filtro de usuario (campo real: usuario.nombre_usuario)
  if (filtros.value.usuario) {
    const usuario = filtros.value.usuario.toLowerCase();
    datos = datos.filter((item) =>
      item.usuario?.nombre_usuario?.toLowerCase().includes(usuario)
    );
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
    material: "",
    guia: "",
    usuario: "",
  };
  aplicarFiltros();
}

function verDetalleTarja(tarja) {
  // Mostrar información detallada de la tarja
  const detalles = [
    `Número: ${tarja.numero_tarja}`,
    `Tipo: ${tarja.tipo_tarja}`,
    `Material: ${tarja.material?.codigo} - ${tarja.material?.nombre}`,
    `Lote: ${tarja.lote}`,
    `Cantidad: ${tarja.cantidad}`,
    `Proveedor: ${tarja.proveedor?.completo?.title || "N/A"}`,
    `Estado: ${tarja.estado}`,
    `Fecha Generación: ${new Date(
      tarja.fecha_generacion
    ).toLocaleDateString()}`,
    `Usuario: ${tarja.usuario?.nombre_usuario || "N/A"}`,
  ].join("\n");

  alert(`Detalles de la Tarja:\n\n${detalles}`);
  console.log("Detalle completo de tarja:", tarja);
}

function editarTarja(tarja) {
  // Mostrar formulario de edición (funcionalidad simplificada)
  const nuevoEstado = prompt(
    `Editar Tarja ${tarja.numero_tarja}\nEstado actual: ${tarja.estado}\n\nNuevo estado (activo/inactivo/procesando/completado):`,
    tarja.estado
  );

  if (nuevoEstado && nuevoEstado !== tarja.estado) {
    // Simular actualización del estado
    tarja.estado = nuevoEstado;
    mensajeExito.value = `Estado de tarja ${tarja.numero_tarja} actualizado a: ${nuevoEstado}`;
    aplicarFiltros(); // Refrescar la vista
  }
}

function imprimirTarja(tarja) {
  // Abrir ventana de impresión con datos de la tarja
  const contenidoImpresion = `
    <html>
      <head>
        <title>Tarja ${tarja.numero_tarja}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .info { margin: 5px 0; }
          .label { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>TARJA ${tarja.numero_tarja}</h1>
          <p>Tipo: ${tarja.tipo_tarja} | Estado: ${tarja.estado}</p>
        </div>
        <div class="info"><span class="label">Material:</span> ${
          tarja.material?.codigo
        } - ${tarja.material?.nombre}</div>
        <div class="info"><span class="label">Lote:</span> ${tarja.lote}</div>
        <div class="info"><span class="label">Cantidad:</span> ${
          tarja.cantidad
        }</div>
        <div class="info"><span class="label">Proveedor:</span> ${
          tarja.proveedor?.completo?.title || "N/A"
        }</div>
        <div class="info"><span class="label">Fecha:</span> ${new Date(
          tarja.fecha_generacion
        ).toLocaleDateString()}</div>
        <div class="info"><span class="label">Usuario:</span> ${
          tarja.usuario?.nombre_usuario || "N/A"
        }</div>
      </body>
    </html>
  `;

  const ventanaImpresion = window.open("", "_blank");
  ventanaImpresion.document.write(contenidoImpresion);
  ventanaImpresion.document.close();
  ventanaImpresion.print();

  mensajeExito.value = `Enviando tarja ${tarja.numero_tarja} a impresión`;
}

function imprimirTarjas() {
  if (tarjasFiltradas.value.length === 0) {
    mensajeError.value = "No hay tarjas para imprimir";
    return;
  }

  const confirmacion = confirm(
    `¿Imprimir ${tarjasFiltradas.value.length} tarjas? Esto abrirá una ventana de impresión.`
  );

  if (confirmacion) {
    let contenidoCompleto = `
      <html>
        <head>
          <title>Tarjas - Impresión Masiva</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 10px; }
            .tarja { border: 1px solid #333; margin: 10px 0; padding: 15px; page-break-inside: avoid; }
            .header { font-weight: bold; font-size: 16px; border-bottom: 1px solid #666; padding-bottom: 5px; }
            .info { margin: 3px 0; font-size: 12px; }
            @media print { .tarja { page-break-inside: avoid; } }
          </style>
        </head>
        <body>
    `;

    tarjasFiltradas.value.forEach((tarja) => {
      contenidoCompleto += `
        <div class="tarja">
          <div class="header">TARJA ${tarja.numero_tarja} - ${
        tarja.tipo_tarja
      }</div>
          <div class="info">Material: ${tarja.material?.codigo} - ${
        tarja.material?.nombre
      }</div>
          <div class="info">Lote: ${tarja.lote} | Cantidad: ${
        tarja.cantidad
      }</div>
          <div class="info">Proveedor: ${
            tarja.proveedor?.completo?.title || "N/A"
          }</div>
          <div class="info">Estado: ${tarja.estado} | Fecha: ${new Date(
        tarja.fecha_generacion
      ).toLocaleDateString()}</div>
        </div>
      `;
    });

    contenidoCompleto += "</body></html>";

    const ventanaImpresion = window.open("", "_blank");
    ventanaImpresion.document.write(contenidoCompleto);
    ventanaImpresion.document.close();
    ventanaImpresion.print();

    mensajeExito.value = `Enviando ${tarjasFiltradas.value.length} tarjas a impresión masiva`;
  }
}

function cerrarTarja(tarja) {
  const confirmacion = confirm(
    `¿Cerrar la tarja ${tarja.numero_tarja}?\n\nEsta acción cambiará el estado a "cerrado" y la tarja no podrá ser modificada.`
  );

  if (confirmacion) {
    // Actualizar estado de la tarja
    tarja.estado = "cerrado";
    tarja.fecha_cierre = new Date().toISOString();

    mensajeExito.value = `Tarja ${tarja.numero_tarja} cerrada exitosamente`;
    aplicarFiltros(); // Refrescar la vista
  }
}

function duplicarTarja(tarja) {
  const confirmacion = confirm(
    `¿Duplicar la tarja ${tarja.numero_tarja}?\n\nSe creará una nueva tarja con los mismos datos pero un número diferente.`
  );

  if (confirmacion) {
    // Crear una copia de la tarja con nuevo número
    const nuevaTarja = {
      ...tarja,
      id: Date.now(), // ID temporal
      numero_tarja: `${
        tarja.tipo_tarja
      }-${new Date().getFullYear()}-${generarId(4)}`,
      estado: "activo",
      fecha_generacion: new Date().toISOString(),
      fecha_creacion: new Date().toISOString(),
      usuario: tarja.usuario, // Mantener usuario original o usar actual
    };

    // Agregar la nueva tarja a la lista (simulación)
    tarjas.value.unshift(nuevaTarja);

    mensajeExito.value = `Tarja duplicada exitosamente. Nueva tarja: ${nuevaTarja.numero_tarja}`;
    aplicarFiltros(); // Refrescar la vista
  }
}

async function manejarEnvioTarjas(datosFormulario) {
  try {
    // Mapear los datos del formulario al formato esperado por la API
    const datosTarja = {
      numero_tarja: datosFormulario.numeroTarja,
      tipo_tarja: datosFormulario.tipoTarja,
      fecha_tarja: datosFormulario.fechaCreacion,
      temporada: new Date().getFullYear().toString(),
      codigo_material: datosFormulario.codigoMaterial,
      nombre_material: datosFormulario.nombreMaterial,
      lote: datosFormulario.lote,
      proveedor: datosFormulario.proveedor || "N/A",
      cantidad_total: parseFloat(datosFormulario.cantidad),
      cantidad_disponible: parseFloat(datosFormulario.cantidad),
      ubicacion_almacenaje: datosFormulario.ubicacion,
      condicion_armado: "Por Armar",
      fecha_vencimiento: datosFormulario.fechaVencimiento || null,
      estado: datosFormulario.estadoTarja || "activo",
      observaciones: datosFormulario.observaciones,
      planta: datosFormulario.planta,
      // Campos específicos según el tipo de tarja
      certificacion_caa: datosFormulario.certificacionCAA || null,
      prioridad: datosFormulario.prioridad || "Normal",
    };

    // Generar número de tarja si no existe
    if (!datosTarja.numero_tarja) {
      datosTarja.numero_tarja = `${
        datosTarja.tipo_tarja
      }-${new Date().getFullYear()}-${generarId(4)}`;
    }

    const resultado = await servicioTarjas.crearTarja(datosTarja);

    if (resultado) {
      mensajeExito.value = "Tarja creada exitosamente";
      cerrarFormulario();
      await cargarTarjas();
    }
  } catch (error) {
    console.error("Error al crear tarja:", error);
    mensajeError.value = error.message || "Error al crear la tarja";
  }
}

function cerrarFormulario() {
  mostrarFormulario.value = false;
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

    mensajeExito.value = `Reporte exportado exitosamente: ${resultado.nombreArchivo} (${resultado.registrosExportados} registros)`;
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
  mensajeExito.value = `Código QR generado exitosamente para la tarja ${tarja.numero_tarja}`;
}

function manejarQREscaneado(evento) {
  const { datos, textoOriginal } = evento;
  console.log("QR escaneado:", datos);

  if (typeof datos === "object" && datos.numeroTarja) {
    mensajeExito.value = `QR escaneado: Tarja ${datos.numeroTarja} detectada`;

    // Buscar la tarja en la lista actual
    const tarjaEncontrada = tarjas.value.find(
      (t) => t.numero_tarja === datos.numeroTarja || t.id === datos.id
    );

    if (tarjaEncontrada) {
      // Mostrar información de la tarja encontrada
      console.log("Tarja encontrada en el sistema:", tarjaEncontrada);
      mensajeExito.value = `Tarja ${datos.numeroTarja} encontrada en el sistema`;
    } else {
      mensajeExito.value = `Tarja ${datos.numeroTarja} escaneada (no encontrada en la vista actual)`;
    }
  } else {
    mensajeExito.value = "Código QR escaneado exitosamente";
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
      mensajeExito.value = `Mostrando detalles de la tarja ${datos.numeroTarja}`;
    } else {
      // Mostrar información disponible
      console.log("Información de tarja escaneada:", datos);
      mensajeExito.value = `Datos de tarja ${datos.numeroTarja} procesados correctamente`;
    }
  } else {
    // Procesar datos genéricos
    console.log("Datos procesados:", datos);
    mensajeExito.value = "Datos del código QR procesados correctamente";
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
    mensajeExito.value = `Iniciando generación masiva de ${tarjasFiltradas.value.length} códigos QR...`;
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
  async () => {
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
    filtros.value.material,
    filtros.value.guia,
    filtros.value.usuario,
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
/* Importar estilos optimizados de filtros */
@import "../estilos/filtros-optimizados.css";

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
/* Estilos específicos para VistaTarjas */
.grupo-acciones-filtros {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: flex-end;
}

.filtros-activos-badge {
  white-space: nowrap;
}

/* Optimización específica para el layout de tarjas */
.vista-tarjas .filtros-fila-principal {
  grid-template-columns: 2.5fr 1fr 1fr 1fr;
}

.vista-tarjas .filtros-fila-secundaria {
  grid-template-columns: repeat(6, minmax(140px, 1fr));
}

.vista-tarjas .filtros-fila-acciones {
  grid-template-columns: 2fr auto;
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
