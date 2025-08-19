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
            placeholder="Número de tarja, material, lote..."
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
            v-model="filtros.tipoTarja"
            etiqueta="Tipo de Tarja"
            tipo="select"
            :opciones="tiposTarjaDisponibles"
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
        :tiene-activos-filtros="tieneActivosFiltros"
        @ver-detalle="verDetalleTarja"
        @editar="editarTarja"
        @cerrar="cerrarTarja"
        @duplicar="duplicarTarja"
        @imprimir="imprimirTarja"
        @crear-tarja="mostrarFormulario = true"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { usarFormulario } from "@/composables/usarFormulario";
import { usarPaginacion } from "@/composables/usarPaginacion";
import { servicioTarjas } from "@/servicios/servicioTarjas";
import { servicioMantenedores } from "@/servicios/servicioMantenedores";
import CampoEntrada from "@/componentes/CampoEntrada.vue";
import MensajeEstado from "@/componentes/MensajeEstado.vue";
import TablaTarjas from "@/componentes/tablas/TablaTarjas.vue";
import {
  PLANTAS,
  TIPOS_TARJA,
  ESTADOS_TARJA,
  CONDICIONES_ARMADO,
  TEMPORADAS,
  MENSAJES,
  obtenerOpcionesSelect,
} from "@/utilidades/constantes";
import {
  fechaActualParaInput,
  formatearFecha,
  formatearNumero,
  filtrarPorTexto,
  ordenarPor,
  filtrarPorRangoFechas,
  generarId,
} from "@/utilidades/auxiliares";

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

// Filtros
const filtros = ref({
  busqueda: "",
  planta: "Rancagua",
  tipoTarja: "",
  fechaDesde: "",
  fechaHasta: "",
  estado: "",
});

// Paginación
const paginacion = usarPaginacion({
  elementosPorPagina: 25,
  paginaActual: 1,
});

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
  return (
    filtros.value.busqueda ||
    filtros.value.tipoTarja ||
    filtros.value.fechaDesde ||
    filtros.value.fechaHasta ||
    filtros.value.estado
  );
});

const columnasTabla = computed(() => [
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
]);

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

  // Aplicar filtro de búsqueda
  if (filtros.value.busqueda) {
    datos = filtrarPorTexto(datos, filtros.value.busqueda, [
      "numero_tarja",
      "codigo_material",
      "nombre_material",
      "lote",
      "proveedor",
    ]);
  }

  // Aplicar filtro de tipo de tarja
  if (filtros.value.tipoTarja) {
    datos = datos.filter((item) => item.tipo_tarja === filtros.value.tipoTarja);
  }

  // Aplicar filtro de estado
  if (filtros.value.estado) {
    datos = datos.filter((item) => item.estado === filtros.value.estado);
  }

  // Aplicar filtro de fechas
  if (filtros.value.fechaDesde || filtros.value.fechaHasta) {
    datos = filtrarPorRangoFechas(
      datos,
      "fecha_tarja",
      filtros.value.fechaDesde,
      filtros.value.fechaHasta
    );
  }

  tarjasFiltradas.value = datos;
  paginacion.totalRegistros.value = datos.length;
  paginacion.paginaActual.value = 1;
}

function manejarOrdenamiento({ campo, direccion }) {
  tarjasFiltradas.value = ordenarPor(tarjasFiltradas.value, campo, direccion);
}

function obtenerClaseTipoTarja(tipo) {
  const mapaTipos = {
    CAA: "caa",
    BODEGA: "bodega",
  };

  return mapaTipos[tipo] || "neutral";
}

function obtenerClaseCondicion(condicion) {
  const mapaCondiciones = {
    Armado: "armado",
    "Por Armar": "por-armar",
    "Semi Armado": "semi-armado",
    "No Aplica": "no-aplica",
  };

  return mapaCondiciones[condicion] || "neutral";
}

function obtenerClaseEstado(estado) {
  const mapaEstados = {
    activo: "activo",
    agotado: "agotado",
    cerrado: "cerrado",
    vencido: "vencido",
  };

  return mapaEstados[estado] || "neutral";
}

function obtenerMensajeVacio() {
  if (tieneActivosFiltros.value) {
    return "No se encontraron tarjas que coincidan con los filtros aplicados.";
  }
  return "Comience registrando la primera tarja del sistema.";
}

function limpiarFiltros() {
  filtros.value = {
    busqueda: "",
    planta: filtros.value.planta,
    tipoTarja: "",
    fechaDesde: "",
    fechaHasta: "",
    estado: "",
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
  ],
  () => {
    aplicarFiltros();
  }
);

// ============== LIFECYCLE ==============

onMounted(async () => {
  await Promise.all([cargarTarjas(), cargarProveedores(), cargarUbicaciones()]);
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
</style>
