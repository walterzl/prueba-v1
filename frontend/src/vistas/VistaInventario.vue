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
        <div class="filtros-fila">
          <CampoEntrada
            v-model="filtros.busqueda"
            etiqueta="Buscar material"
            placeholder="Código o nombre del material..."
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
            v-model="filtros.bodega"
            etiqueta="Bodega"
            tipo="select"
            :opciones="bodegasDisponibles"
            :mostrar-etiqueta="false"
            @cambio="aplicarFiltros"
          />
        </div>
      </div>
    </div>

    <!-- Formulario de nuevo inventario -->
    <div v-if="mostrarFormulario" class="seccion-formulario">
      <div class="contenedor-formulario">
        <div class="encabezado-formulario">
          <h2 class="titulo-formulario">Registrar Nuevo Inventario</h2>
          <button
            type="button"
            class="boton-cerrar"
            @click="cerrarFormulario"
            :disabled="formulario.cargandoEnvio"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="guardarInventario" class="formulario-inventario">
          <div class="campos-formulario">
            <!-- Primera fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.title"
                etiqueta="Código del Material"
                placeholder="Ej: BOGR2062"
                es-requerido
                :mensaje-error="formulario.obtenerErrorCampo('title')"
                @cambio="buscarMaterial"
                @blur="formulario.marcarCampoComoTocado('title')"
              />

              <CampoEntrada
                v-model="formulario.formulario.nombre_material"
                etiqueta="Nombre del Material"
                placeholder="Se completará automáticamente"
                solo-lectura
              />
            </div>

            <!-- Segunda fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.stock"
                etiqueta="Stock"
                tipo="number"
                placeholder="0"
                es-requerido
                minimo="0"
                paso="0.01"
                :mensaje-error="formulario.obtenerErrorCampo('stock')"
                @blur="formulario.marcarCampoComoTocado('stock')"
              />

              <CampoEntrada
                v-model="formulario.formulario.pallets"
                etiqueta="Cantidad de Pallets"
                tipo="number"
                placeholder="0"
                es-requerido
                minimo="0"
                :mensaje-error="formulario.obtenerErrorCampo('pallets')"
                @blur="formulario.marcarCampoComoTocado('pallets')"
              />
            </div>

            <!-- Tercera fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.bodega"
                etiqueta="Bodega"
                tipo="select"
                :opciones="bodegasDisponibles"
                es-requerido
                :mensaje-error="formulario.obtenerErrorCampo('bodega')"
                @cambio="cargarUbicacionesPorBodega"
                @blur="formulario.marcarCampoComoTocado('bodega')"
              />

              <CampoEntrada
                v-model="formulario.formulario.ubicacion"
                etiqueta="Ubicación"
                tipo="select"
                :opciones="ubicacionesFiltradas"
                es-requerido
                :mensaje-error="formulario.obtenerErrorCampo('ubicacion')"
                :cargando="cargandoUbicaciones"
                @blur="formulario.marcarCampoComoTocado('ubicacion')"
              />
            </div>

            <!-- Cuarta fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.lote"
                etiqueta="Lote"
                placeholder="Ej: L2024-001"
                texto-ayuda="Identificador único del lote"
              />

              <CampoEntrada
                v-model="formulario.formulario.fecha_inventario"
                etiqueta="Fecha de Inventario"
                tipo="date"
                es-requerido
                :maximo="fechaActual"
                :mensaje-error="
                  formulario.obtenerErrorCampo('fecha_inventario')
                "
                @blur="formulario.marcarCampoComoTocado('fecha_inventario')"
              />
            </div>

            <!-- Quinta fila -->
            <div class="fila-campos">
              <CampoEntrada
                v-model="formulario.formulario.condicion_armado"
                etiqueta="Condición de Armado"
                tipo="select"
                :opciones="condicionesArmado"
                texto-ayuda="Estado del material en inventario"
              />

              <CampoEntrada
                v-model="formulario.formulario.contado_por"
                etiqueta="Contado por"
                placeholder="Nombre de quien realizó el conteo"
                es-requerido
                :mensaje-error="formulario.obtenerErrorCampo('contado_por')"
                @blur="formulario.marcarCampoComoTocado('contado_por')"
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
                formulario.cargandoEnvio ? "Guardando..." : "Guardar Inventario"
              }}
            </button>
          </div>
        </form>
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
        :tiene-activos-filtros="Boolean(filtros.busqueda)"
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
import { usarFormulario } from "@/composables/usarFormulario";
import { usarPaginacion } from "@/composables/usarPaginacion";
import { servicioInventario } from "@/servicios/servicioInventario";
import { servicioMantenedores } from "@/servicios/servicioMantenedores";
import CampoEntrada from "@/componentes/CampoEntrada.vue";
import MensajeEstado from "@/componentes/MensajeEstado.vue";
import TablaInventario from "@/componentes/tablas/TablaInventario.vue";
import {
  PLANTAS,
  CONDICIONES_ARMADO,
  MENSAJES,
  obtenerOpcionesSelect,
} from "@/utilidades/constantes";
import {
  fechaActualParaInput,
  formatearFecha,
  formatearNumero,
  filtrarPorTexto,
  ordenarPor,
} from "@/utilidades/auxiliares";

// ============== ESTADO REACTIVO ==============

// Estado de datos
const inventario = ref([]);
const materiales = ref([]);
const ubicaciones = ref([]);
const inventarioFiltrado = ref([]);

// Estado de UI
const mostrarFormulario = ref(false);
const cargandoDatos = ref(false);
const cargandoUbicaciones = ref(false);
const mensajeExito = ref("");
const mensajeError = ref("");

// Filtros
const filtros = ref({
  busqueda: "",
  planta: "Rancagua", // Valor por defecto
  bodega: "",
});

// Paginación
const paginacion = usarPaginacion({
  elementosPorPagina: 50,
  paginaActual: 1,
});

// Formulario de inventario
const formulario = usarFormulario({
  datosIniciales: {
    title: "",
    nombre_material: "",
    stock: 0,
    pallets: 0,
    bodega: "",
    ubicacion: "",
    lote: "",
    fecha_inventario: fechaActualParaInput(),
    condicion_armado: "No Aplica",
    contado_por: "",
    planta: "Rancagua",
  },
  tipoValidacion: "inventario",
  validarEnTiempoReal: true,
});

// ============== COMPUTED PROPERTIES ==============

const plantasDisponibles = computed(() => obtenerOpcionesSelect(PLANTAS));

const condicionesArmado = computed(() =>
  obtenerOpcionesSelect(CONDICIONES_ARMADO)
);

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

const ubicacionesFiltradas = computed(() => {
  return ubicaciones.value
    .filter(
      (u) =>
        u.planta === formulario.formulario.planta &&
        u.bodega_deposito === formulario.formulario.bodega
    )
    .map((u) => ({
      value: u.title,
      label: u.title,
    }));
});

const fechaActual = computed(() => fechaActualParaInput());

const columnasTabla = computed(() => [
  {
    clave: "title",
    titulo: "Código",
    ordenable: true,
    ancho: "120px",
  },
  {
    clave: "nombre_material",
    titulo: "Material",
    ordenable: true,
    ancho: "250px",
  },
  {
    clave: "stock",
    titulo: "Stock",
    ordenable: true,
    formato: (valor) => formatearNumero(valor, 2),
    alineacion: "derecha",
    ancho: "100px",
  },
  {
    clave: "pallets",
    titulo: "Pallets",
    ordenable: true,
    formato: (valor) => formatearNumero(valor, 0),
    alineacion: "derecha",
    ancho: "80px",
  },
  {
    clave: "bodega",
    titulo: "Bodega",
    ordenable: true,
    ancho: "150px",
  },
  {
    clave: "ubicacion",
    titulo: "Ubicación",
    ordenable: true,
    ancho: "150px",
  },
  {
    clave: "lote",
    titulo: "Lote",
    ordenable: true,
    ancho: "120px",
  },
  {
    clave: "fecha_inventario",
    titulo: "Fecha",
    ordenable: true,
    formato: (valor) => formatearFecha(valor),
    ancho: "110px",
  },
  {
    clave: "contado_por",
    titulo: "Contado por",
    ordenable: true,
    ancho: "150px",
  },
]);

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
    mostrarMensajeExito(
      `Inventario cargado: ${datosNormalizados.length} registros`
    );
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

async function buscarMaterial() {
  const codigo = formulario.formulario.title?.trim();
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

async function cargarUbicacionesPorBodega() {
  // Este método se ejecuta cuando cambia la bodega seleccionada
  formulario.formulario.ubicacion = ""; // Limpiar ubicación
}

function aplicarFiltros() {
  let datos = [...inventario.value];

  // Aplicar filtro de búsqueda
  if (filtros.value.busqueda) {
    datos = filtrarPorTexto(datos, filtros.value.busqueda, [
      "codigo_material",
      "nombre_material",
      "lote",
      "contado_por",
    ]);
  }

  // Aplicar filtro de bodega
  if (filtros.value.bodega) {
    datos = datos.filter((item) => item.bodega === filtros.value.bodega);
  }

  inventarioFiltrado.value = datos;
  paginacion.totalRegistros.value = datos.length;
  paginacion.paginaActual.value = 1; // Resetear a primera página
}

function manejarOrdenamiento({ campo, direccion }) {
  inventarioFiltrado.value = ordenarPor(
    inventarioFiltrado.value,
    campo,
    direccion
  );
}

async function guardarInventario() {
  const exito = await formulario.manejarEnvio(async (datos) => {
    return await servicioInventario.crearRegistroInventario(datos);
  });

  if (exito) {
    mostrarMensajeExito(MENSAJES.EXITO_CREAR);
    cerrarFormulario();
    await cargarInventario();
  }
}

function cerrarFormulario() {
  mostrarFormulario.value = false;
  formulario.reiniciarFormulario();
  // Resetear valores por defecto
  formulario.formulario.fecha_inventario = fechaActualParaInput();
  formulario.formulario.planta = filtros.value.planta;
  formulario.formulario.condicion_armado = "No Aplica";
}

function mostrarMensajeExito(mensaje) {
  mensajeExito.value = mensaje;
  mensajeError.value = "";
}

// Métodos específicos para la tabla de inventario
function realizarConteo(item) {
  // TODO: Implementar modal de conteo
  mostrarMensajeExito(
    `Conteo de ${item.codigo_material} iniciado (funcionalidad en desarrollo)`
  );
}

function ajustarStock(item) {
  // TODO: Implementar modal de ajuste de stock
  mostrarMensajeExito(
    `Ajuste de stock para ${item.codigo_material} (funcionalidad en desarrollo)`
  );
}

function verHistorialInventario(item) {
  // TODO: Implementar modal de historial
  mostrarMensajeExito(
    `Historial de ${item.codigo_material} (funcionalidad en desarrollo)`
  );
}

function imprimirEtiquetaInventario(item) {
  // TODO: Implementar impresión de etiquetas
  mostrarMensajeExito(
    `Impresión de etiqueta para ${item.codigo_material} (funcionalidad en desarrollo)`
  );
}

// ============== WATCHERS ==============

watch(
  () => filtros.value.planta,
  async (nuevaPlanta) => {
    formulario.formulario.planta = nuevaPlanta;
    await cargarInventario();
  }
);

watch(
  () => [filtros.value.busqueda, filtros.value.bodega],
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

.contenedor-filtros {
  max-width: 100%;
}

.filtros-fila {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: end;
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

  .filtros-fila {
    grid-template-columns: 1fr;
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
