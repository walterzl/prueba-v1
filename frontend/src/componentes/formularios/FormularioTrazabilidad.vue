<template>
  <FormularioBase
    ref="formularioRef"
    titulo="Movimiento de Trazabilidad"
    descripcion="Registre el movimiento de materiales entre ubicaciones"
    texto-boton-enviar="Registrar Movimiento"
    :validaciones="validaciones"
    :datos-iniciales="datosIniciales"
    @enviar="manejarEnvio"
    @cancelar="manejarCancelar"
  >
    <template #campos>
      <!-- Sección Encabezado -->
      <div class="seccion-formulario">
        <h3 class="seccion-titulo">📋 Información del Movimiento</h3>

        <div class="campos-fila">
          <CampoFormulario
            v-model="datos.tipoMovimiento"
            etiqueta="Tipo de Movimiento"
            tipo="select"
            :opciones="tiposMovimiento"
            :requerido="true"
            :error="errores.tipoMovimiento"
            @change="manejarCambioTipoMovimiento"
          />

          <CampoFormulario
            v-model="datos.planta"
            etiqueta="Planta"
            tipo="select"
            :opciones="plantasDisponibles"
            :requerido="true"
            :error="errores.planta"
            @change="manejarCambioPlanta"
          />
        </div>

        <div class="campos-fila">
          <CampoFormulario
            v-model="datos.guiaSii"
            etiqueta="Guía SII"
            tipo="text"
            :max-length="50"
            ayuda="Número de guía SII (opcional)"
          />

          <CampoFormulario
            v-model="datos.fecha"
            etiqueta="Fecha del Movimiento"
            tipo="date"
            :requerido="true"
            :error="errores.fecha"
            :max="fechaMaxima"
          />
        </div>

        <div class="campos-fila">
          <CampoFormulario
            v-model="datos.proveedor"
            etiqueta="Proveedor"
            tipo="select"
            :opciones="proveedoresDisponibles"
            :opcion-vacia="'Seleccione proveedor'"
            :mostrar-opcion-vacia="mostrarCampoProveedor"
            ayuda="Proveedor del material (requerido para recepciones)"
          />

          <CampoFormulario
            v-model="datos.turno"
            etiqueta="Turno"
            tipo="select"
            :opciones="turnosDisponibles"
            :requerido="true"
            :error="errores.turno"
          />
        </div>

        <div class="campos-fila">
          <CampoFormulario
            v-model="datos.temporada"
            etiqueta="Temporada"
            tipo="select"
            :opciones="temporadasDisponibles"
            :requerido="true"
            :error="errores.temporada"
          />
        </div>
      </div>

      <!-- Sección Material -->
      <div class="seccion-formulario">
        <h3 class="seccion-titulo">📦 Información del Material</h3>

        <div class="campos-fila">
          <BuscadorMaterial
            v-model="datos.codigoMaterial"
            etiqueta="Código del Material"
            placeholder="Buscar material por código o nombre..."
            :requerido="true"
            :error="errores.codigoMaterial"
            @seleccion="manejarSeleccionMaterial"
          />

          <CampoFormulario
            v-model="datos.nombreMaterial"
            etiqueta="Nombre del Material"
            tipo="text"
            :solo-lectura="true"
            :deshabilitado="true"
            ayuda="Se completa automáticamente al seleccionar el material"
          />
        </div>

        <div class="campos-fila">
          <CampoFormulario
            v-model="datos.clasificacion"
            etiqueta="Clasificación"
            tipo="text"
            :solo-lectura="true"
            :deshabilitado="true"
          />

          <CampoFormulario
            v-model="datos.unidadMedida"
            etiqueta="Unidad de Medida"
            tipo="text"
            :solo-lectura="true"
            :deshabilitado="true"
          />
        </div>

        <div class="campos-fila">
          <CampoFormulario
            v-model="datos.lote"
            etiqueta="Lote"
            tipo="text"
            :max-length="100"
            :requerido="true"
            :error="errores.lote"
            ayuda="Número de lote del material"
          />

          <CampoFormulario
            v-model="datos.cantidad"
            etiqueta="Cantidad"
            tipo="number"
            :requerido="true"
            :min="0.01"
            :step="0.01"
            :error="errores.cantidad"
            ayuda="Cantidad del movimiento"
          />
        </div>

        <div class="campos-fila">
          <CampoFormulario
            v-model="datos.totalPallet"
            etiqueta="Total de Pallets"
            tipo="number"
            :min="0"
            :step="1"
            ayuda="Número total de pallets (opcional)"
          />
        </div>
      </div>

      <!-- Sección Ubicaciones -->
      <div class="seccion-formulario">
        <h3 class="seccion-titulo">📍 Ubicaciones</h3>

        <div class="campos-fila">
          <CampoFormulario
            v-model="datos.bodegaOrigen"
            etiqueta="Bodega de Origen"
            tipo="select"
            :opciones="bodegasDisponibles"
            :requerido="mostrarBodegaOrigen"
            :error="errores.bodegaOrigen"
            @change="manejarCambioBodegaOrigen"
          />

          <CampoFormulario
            v-model="datos.ubicacionOrigen"
            etiqueta="Ubicación de Origen"
            tipo="select"
            :opciones="ubicacionesOrigenDisponibles"
            :requerido="mostrarUbicacionOrigen"
            :error="errores.ubicacionOrigen"
          />
        </div>

        <div class="campos-fila">
          <CampoFormulario
            v-model="datos.bodegaDestino"
            etiqueta="Bodega de Destino"
            tipo="select"
            :opciones="bodegasDisponibles"
            :requerido="mostrarBodegaDestino"
            :error="errores.bodegaDestino"
            @change="manejarCambioBodegaDestino"
          />

          <CampoFormulario
            v-model="datos.ubicacionDestino"
            etiqueta="Ubicación de Destino"
            tipo="select"
            :opciones="ubicacionesDestinoDisponibles"
            :requerido="mostrarUbicacionDestino"
            :error="errores.ubicacionDestino"
          />
        </div>
      </div>

      <!-- Sección Observaciones -->
      <div class="seccion-formulario">
        <h3 class="seccion-titulo">📝 Observaciones</h3>

        <div class="campos-fila">
          <CampoFormulario
            v-model="datos.observacion"
            etiqueta="Observaciones"
            tipo="textarea"
            :filas="3"
            :max-length="500"
            ayuda="Observaciones adicionales del movimiento"
          />
        </div>
      </div>
    </template>
  </FormularioBase>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  usarFormulario,
  validacionesComunes,
} from "@/composables/usarFormulario";
import { servicioMantenedores } from "@/servicios/servicioMantenedores";
import FormularioBase from "@/componentes/comunes/FormularioBase.vue";
import CampoFormulario from "@/componentes/comunes/CampoFormulario.vue";
import BuscadorMaterial from "@/componentes/comunes/BuscadorMaterial.vue";

// Props
const props = defineProps({
  datosIniciales: {
    type: Object,
    default: () => ({}),
  },
  plantaActual: {
    type: String,
    default: "",
  },
});

// Emits
const emit = defineEmits(["enviar", "cancelar", "material-seleccionado"]);

// Estado del formulario
const { datos, errores, validaciones, limpiarFormulario, mostrarError } =
  usarFormulario({
    datosIniciales: {
      tipoMovimiento: "",
      planta: props.plantaActual || "",
      guiaSii: "",
      fecha: "",
      proveedor: "",
      turno: "",
      temporada: "",
      codigoMaterial: "",
      nombreMaterial: "",
      clasificacion: "",
      unidadMedida: "",
      lote: "",
      cantidad: "",
      totalPallet: 0,
      bodegaOrigen: "",
      bodegaDestino: "",
      ubicacionOrigen: "",
      ubicacionDestino: "",
      observacion: "",
      ...props.datosIniciales,
    },
    validaciones: {
      tipoMovimiento: validacionesComunes.requerido,
      planta: validacionesComunes.requerido,
      fecha: validacionesComunes.fecha,
      proveedor: { requerido: false }, // Se valida condicionalmente
      turno: validacionesComunes.requerido,
      temporada: validacionesComunes.requerido,
      codigoMaterial: validacionesComunes.requerido,
      lote: validacionesComunes.requerido,
      cantidad: validacionesComunes.cantidad,
      bodegaOrigen: { requerido: false }, // Se valida condicionalmente
      bodegaDestino: { requerido: false }, // Se valida condicionalmente
      ubicacionOrigen: { requerido: false }, // Se valida condicionalmente
      ubicacionDestino: { requerido: false }, // Se valida condicionalmente
    },
  });

// Referencias
const formularioRef = ref(null);

// Estado local
const tiposMovimiento = ref([]);
const plantasDisponibles = ref([]);
const proveedoresDisponibles = ref([]);
const turnosDisponibles = ref([]);
const temporadasDisponibles = ref([]);
const bodegasDisponibles = ref([]);
const ubicacionesOrigenDisponibles = ref([]);
const ubicacionesDestinoDisponibles = ref([]);
const materialSeleccionado = ref(null);

// Computed
const fechaMaxima = computed(() => {
  const hoy = new Date();
  return hoy.toISOString().split("T")[0];
});

const mostrarCampoProveedor = computed(() => {
  return ["Recepción", "Ingreso proveedor"].includes(
    datos.value.tipoMovimiento
  );
});

const mostrarBodegaOrigen = computed(() => {
  return ["Despacho", "Consumo", "Frío y Despacho"].includes(
    datos.value.tipoMovimiento
  );
});

const mostrarUbicacionOrigen = computed(() => {
  return mostrarBodegaOrigen.value;
});

const mostrarBodegaDestino = computed(() => {
  return ["Recepción", "Recepción Interna", "Ingreso proveedor"].includes(
    datos.value.tipoMovimiento
  );
});

const mostrarUbicacionDestino = computed(() => {
  return mostrarBodegaDestino.value;
});

// Métodos
async function cargarDatosMaestros() {
  try {
    // Cargar tipos de movimiento
    const tipos = await servicioMantenedores.obtenerTiposMovimiento();
    tiposMovimiento.value = tipos.map((t) => ({
      valor: t.title,
      etiqueta: t.title,
    }));

    // Cargar plantas
    const plantas = await servicioMantenedores.obtenerPlantas();
    plantasDisponibles.value = plantas.map((p) => ({
      valor: p.title,
      etiqueta: p.title,
    }));

    // Cargar proveedores
    const proveedores = await servicioMantenedores.obtenerProveedores();
    proveedoresDisponibles.value = proveedores.map((p) => ({
      valor: p.title,
      etiqueta: p.title,
    }));

    // Cargar turnos
    turnosDisponibles.value = [
      { valor: "Turno 1", etiqueta: "Turno 1" },
      { valor: "Turno 2", etiqueta: "Turno 2" },
    ];

    // Cargar temporadas
    const temporadas = await servicioMantenedores.obtenerTemporadas();
    temporadasDisponibles.value = temporadas.map((t) => ({
      valor: t.title,
      etiqueta: t.title,
    }));

    // Si hay planta actual, cargar bodegas y ubicaciones
    if (datos.value.planta) {
      await cargarBodegasPorPlanta(datos.value.planta);
    }
  } catch (error) {
    console.error("Error cargando datos maestros:", error);
    mostrarError("Error al cargar datos del sistema");
  }
}

async function cargarBodegasPorPlanta(planta) {
  try {
    const ubicaciones = await servicioMantenedores.obtenerUbicacionesPorPlanta(
      planta
    );

    // Extraer bodegas únicas
    const bodegas = [
      ...new Set(ubicaciones.map((u) => u.bodega_deposito)),
    ].filter(Boolean);
    bodegasDisponibles.value = bodegas.map((b) => ({ valor: b, etiqueta: b }));

    // Guardar ubicaciones para filtrado posterior
    ubicacionesOrigenDisponibles.value = ubicaciones.map((u) => ({
      valor: u.title,
      etiqueta: u.title,
      bodega: u.bodega_deposito,
    }));

    ubicacionesDestinoDisponibles.value = [
      ...ubicacionesOrigenDisponibles.value,
    ];
  } catch (error) {
    console.error("Error cargando bodegas:", error);
    mostrarError("Error al cargar bodegas de la planta");
  }
}

function manejarCambioTipoMovimiento(tipo) {
  // Limpiar campos que no aplican para el nuevo tipo
  if (!mostrarCampoProveedor.value) {
    datos.value.proveedor = "";
  }

  if (!mostrarBodegaOrigen.value) {
    datos.value.bodegaOrigen = "";
    datos.value.ubicacionOrigen = "";
  }

  if (!mostrarBodegaDestino.value) {
    datos.value.bodegaDestino = "";
    datos.value.ubicacionDestino = "";
  }

  // Validar campos requeridos según el tipo
  validarCamposCondicionales();

  // Log para debugging (opcional)
  console.log(`Tipo de movimiento cambiado a: ${tipo}`);
}

function manejarCambioPlanta(planta) {
  datos.value.bodegaOrigen = "";
  datos.value.bodegaDestino = "";
  datos.value.ubicacionOrigen = "";
  datos.value.ubicacionDestino = "";

  if (planta) {
    cargarBodegasPorPlanta(planta);
  } else {
    bodegasDisponibles.value = [];
    ubicacionesOrigenDisponibles.value = [];
    ubicacionesDestinoDisponibles.value = [];
  }
}

function manejarCambioBodegaOrigen(bodega) {
  datos.value.ubicacionOrigen = "";

  if (bodega) {
    const ubicaciones = ubicacionesOrigenDisponibles.value.filter(
      (u) => u.bodega === bodega
    );
    // Filtrar ubicaciones por bodega seleccionada
    // Aquí se podrían actualizar las opciones disponibles si es necesario
    console.log(
      `Ubicaciones disponibles para bodega ${bodega}:`,
      ubicaciones.length
    );
  }
}

function manejarCambioBodegaDestino(bodega) {
  datos.value.ubicacionDestino = "";

  if (bodega) {
    const ubicaciones = ubicacionesDestinoDisponibles.value.filter(
      (u) => u.bodega === bodega
    );
    // Filtrar ubicaciones por bodega seleccionada
    // Aquí se podrían actualizar las opciones disponibles si es necesario
    console.log(
      `Ubicaciones disponibles para bodega ${bodega}:`,
      ubicaciones.length
    );
  }
}

function manejarSeleccionMaterial(material) {
  if (!material) return;

  materialSeleccionado.value = material;

  // Actualizar campos del formulario
  datos.value.nombreMaterial = material.nombre_material;
  datos.value.clasificacion = material.clasificacion;
  datos.value.unidadMedida = material.unidad_medida;

  emit("material-seleccionado", material);
}

function validarCamposCondicionales() {
  // Validar proveedor si es requerido
  if (mostrarCampoProveedor.value && !datos.value.proveedor) {
    errores.value.proveedor =
      "El proveedor es requerido para este tipo de movimiento";
  } else {
    delete errores.value.proveedor;
  }

  // Validar bodega y ubicación de origen si es requerido
  if (mostrarBodegaOrigen.value) {
    if (!datos.value.bodegaOrigen) {
      errores.value.bodegaOrigen =
        "La bodega de origen es requerida para este tipo de movimiento";
    } else {
      delete errores.value.bodegaOrigen;
    }

    if (!datos.value.ubicacionOrigen) {
      errores.value.ubicacionOrigen =
        "La ubicación de origen es requerida para este tipo de movimiento";
    } else {
      delete errores.value.ubicacionOrigen;
    }
  }

  // Validar bodega y ubicación de destino si es requerido
  if (mostrarBodegaDestino.value) {
    if (!datos.value.bodegaDestino) {
      errores.value.bodegaDestino =
        "La bodega de destino es requerida para este tipo de movimiento";
    } else {
      delete errores.value.bodegaDestino;
    }

    if (!datos.value.ubicacionDestino) {
      errores.value.ubicacionDestino =
        "La ubicación de destino es requerida para este tipo de movimiento";
    } else {
      delete errores.value.ubicacionDestino;
    }
  }
}

async function manejarEnvio(datosFormulario) {
  try {
    // Validar que el material esté seleccionado
    if (!materialSeleccionado.value) {
      throw new Error("Debe seleccionar un material válido");
    }

    // Validar campos condicionales
    validarCamposCondicionales();

    if (Object.keys(errores.value).length > 0) {
      throw new Error("Por favor complete todos los campos requeridos");
    }

    // Preparar datos para envío
    const datosEnvio = {
      ...datosFormulario,
      title: datosFormulario.codigoMaterial,
      nombre: datosFormulario.nombreMaterial,
      cod_nombre: `${datosFormulario.codigoMaterial} - ${datosFormulario.nombreMaterial}`,
      material_id: materialSeleccionado.value.id,
      id_movimiento: generarIdMovimiento(),
      mes: obtenerMes(datosFormulario.fecha),
      // Calcular impacto en stock
      total_stock: calcularImpactoStock(
        datosFormulario.tipoMovimiento,
        datosFormulario.cantidad
      ),
      bodega_stock: obtenerBodegaStock(datosFormulario),
      ubicacion_stock: obtenerUbicacionStock(datosFormulario),
    };

    // Emitir evento de envío
    await emit("enviar", datosEnvio);

    // Limpiar formulario después de éxito
    limpiarFormulario();
    materialSeleccionado.value = null;

    return true;
  } catch (error) {
    console.error("Error en envío:", error);
    throw error;
  }
}

function manejarCancelar() {
  emit("cancelar");
}

// Funciones auxiliares
function generarIdMovimiento() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 5);
  return `MOV_${timestamp}_${random}`;
}

function obtenerMes(fecha) {
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const mes = new Date(fecha).getMonth();
  return meses[mes];
}

function calcularImpactoStock(tipoMovimiento, cantidad) {
  const tiposPositivos = [
    "Recepción",
    "Recepción Interna",
    "Ingreso proveedor",
  ];
  const tiposNegativos = ["Despacho", "Consumo", "Frío y Despacho"];

  if (tiposPositivos.includes(tipoMovimiento)) {
    return Number(cantidad); // Suma al stock
  } else if (tiposNegativos.includes(tipoMovimiento)) {
    return -Number(cantidad); // Resta del stock
  }
  return 0; // Sin impacto en stock
}

function obtenerBodegaStock(datos) {
  if (
    ["Recepción", "Recepción Interna", "Ingreso proveedor"].includes(
      datos.tipoMovimiento
    )
  ) {
    return datos.bodegaDestino;
  } else if (
    ["Despacho", "Consumo", "Frío y Despacho"].includes(datos.tipoMovimiento)
  ) {
    return datos.bodegaOrigen;
  }
  return "";
}

function obtenerUbicacionStock(datos) {
  if (
    ["Recepción", "Recepción Interna", "Ingreso proveedor"].includes(
      datos.tipoMovimiento
    )
  ) {
    return datos.ubicacionDestino;
  } else if (
    ["Despacho", "Consumo", "Frío y Despacho"].includes(datos.tipoMovimiento)
  ) {
    return datos.ubicacionOrigen;
  }
  return "";
}

// Lifecycle
onMounted(async () => {
  await cargarDatosMaestros();

  // Establecer fecha actual por defecto
  if (!datos.value.fecha) {
    datos.value.fecha = fechaMaxima.value;
  }
});

// Watchers
watch(
  () => props.plantaActual,
  (nuevaPlanta) => {
    if (nuevaPlanta && nuevaPlanta !== datos.value.planta) {
      datos.value.planta = nuevaPlanta;
      manejarCambioPlanta(nuevaPlanta);
    }
  }
);

// Exponer métodos
defineExpose({
  limpiar: limpiarFormulario,
  validar: () => formularioRef.value?.validarFormulario(),
  obtenerDatos: () => datos.value,
  establecerMaterial: (material) => {
    if (material) {
      manejarSeleccionMaterial(material);
    }
  },
});
</script>

<style scoped>
.seccion-formulario {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background: #f8f9fa;
}

.seccion-titulo {
  margin: 0 0 20px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.campos-fila {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.campos-fila:last-child {
  margin-bottom: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .campos-fila {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .seccion-formulario {
    padding: 16px;
  }
}
</style>
