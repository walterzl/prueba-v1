<template>
  <FormularioBase
    ref="formularioRef"
    titulo="Registro de Inventario"
    descripcion="Complete los datos para registrar el inventario de materiales"
    texto-boton-enviar="Registrar Inventario"
    :validaciones="validaciones"
    :datos-iniciales="datosIniciales"
    @enviar="manejarEnvio"
    @cancelar="manejarCancelar"
  >
    <template #campos>
      <!-- Sección de Material -->
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
      </div>

      <!-- Sección de Inventario -->
      <div class="seccion-formulario">
        <h3 class="seccion-titulo">📊 Datos del Inventario</h3>

        <div class="campos-fila">
          <CampoFormulario
            v-model="datos.stock"
            etiqueta="Stock Actual"
            tipo="number"
            :requerido="true"
            :min="0"
            :step="0.01"
            :error="errores.stock"
            ayuda="Cantidad actual en inventario"
          />

          <CampoFormulario
            v-model="datos.pallets"
            etiqueta="Total de Pallets"
            tipo="number"
            :min="0"
            :step="1"
            ayuda="Número total de pallets (opcional)"
          />
        </div>

        <div class="campos-fila">
          <CampoFormulario
            v-model="datos.fechaInventario"
            etiqueta="Fecha de Inventario"
            tipo="date"
            :requerido="true"
            :error="errores.fechaInventario"
            :max="fechaMaxima"
            ayuda="Fecha en que se realizó el conteo"
          />

          <CampoFormulario
            v-model="datos.lote"
            etiqueta="Lote"
            tipo="text"
            :max-length="100"
            ayuda="Número de lote del material (opcional)"
          />
        </div>
      </div>

      <!-- Sección de Ubicación -->
      <div class="seccion-formulario">
        <h3 class="seccion-titulo">📍 Ubicación</h3>

        <div class="campos-fila">
          <CampoFormulario
            v-model="datos.planta"
            etiqueta="Planta"
            tipo="select"
            :opciones="plantasDisponibles"
            :requerido="true"
            :error="errores.planta"
            @change="manejarCambioPlanta"
          />

          <CampoFormulario
            v-model="datos.bodega"
            etiqueta="Bodega"
            tipo="select"
            :opciones="bodegasDisponibles"
            :requerido="true"
            :error="errores.bodega"
            @change="manejarCambioBodega"
          />
        </div>

        <div class="campos-fila">
          <CampoFormulario
            v-model="datos.ubicacion"
            etiqueta="Ubicación"
            tipo="select"
            :opciones="ubicacionesDisponibles"
            :requerido="true"
            :error="errores.ubicacion"
          />

          <CampoFormulario
            v-model="datos.condicionArmado"
            etiqueta="Condición de Armado"
            tipo="select"
            :opciones="condicionesArmado"
            ayuda="Estado del material (opcional)"
          />
        </div>
      </div>

      <!-- Sección de Responsable -->
      <div class="seccion-formulario">
        <h3 class="seccion-titulo">👤 Responsable</h3>

        <div class="campos-fila">
          <CampoFormulario
            v-model="datos.contadoPor"
            etiqueta="Contado por"
            tipo="text"
            :requerido="true"
            :max-length="100"
            :error="errores.contadoPor"
            ayuda="Nombre de la persona que realizó el conteo"
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
      codigoMaterial: "",
      nombreMaterial: "",
      clasificacion: "",
      unidadMedida: "",
      stock: "",
      pallets: 0,
      fechaInventario: "",
      lote: "",
      planta: props.plantaActual || "",
      bodega: "",
      ubicacion: "",
      condicionArmado: "",
      contadoPor: "",
      ...props.datosIniciales,
    },
    validaciones: {
      codigoMaterial: validacionesComunes.requerido,
      stock: validacionesComunes.cantidad,
      fechaInventario: validacionesComunes.fecha,
      planta: validacionesComunes.requerido,
      bodega: validacionesComunes.requerido,
      ubicacion: validacionesComunes.requerido,
      contadoPor: validacionesComunes.requerido,
    },
  });

// Referencias
const formularioRef = ref(null);

// Estado local
const plantasDisponibles = ref([]);
const bodegasDisponibles = ref([]);
const ubicacionesDisponibles = ref([]);
const materialSeleccionado = ref(null);

// Opciones predefinidas
const condicionesArmado = [
  { valor: "Bueno", etiqueta: "Bueno" },
  { valor: "Regular", etiqueta: "Regular" },
  { valor: "Malo", etiqueta: "Malo" },
  { valor: "Nuevo", etiqueta: "Nuevo" },
  { valor: "Usado", etiqueta: "Usado" },
];

// Computed
const fechaMaxima = computed(() => {
  const hoy = new Date();
  return hoy.toISOString().split("T")[0];
});

// Métodos
async function cargarDatosMaestros() {
  try {
    // Cargar plantas
    const plantas = await servicioMantenedores.obtenerPlantas();
    plantasDisponibles.value = plantas.map((p) => ({
      valor: p.title,
      etiqueta: p.title,
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
    ubicacionesDisponibles.value = ubicaciones.map((u) => ({
      valor: u.title,
      etiqueta: u.title,
      bodega: u.bodega_deposito,
    }));
  } catch (error) {
    console.error("Error cargando bodegas:", error);
    mostrarError("Error al cargar bodegas de la planta");
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

function manejarCambioPlanta(planta) {
  datos.value.bodega = "";
  datos.value.ubicacion = "";

  if (planta) {
    cargarBodegasPorPlanta(planta);
  } else {
    bodegasDisponibles.value = [];
    ubicacionesDisponibles.value = [];
  }
}

function manejarCambioBodega() {
  datos.value.ubicacion = "";
  // No necesitamos filtrar aquí, solo limpiar la selección
}

async function manejarEnvio(datosFormulario) {
  try {
    // Validar que el material esté seleccionado
    if (!materialSeleccionado.value) {
      throw new Error("Debe seleccionar un material válido");
    }

    // Preparar datos para envío
    const datosEnvio = {
      ...datosFormulario,
      title: datosFormulario.codigoMaterial,
      nombre_material: datosFormulario.nombreMaterial,
      cod_nombre: `${datosFormulario.codigoMaterial} - ${datosFormulario.nombreMaterial}`,
      material_id: materialSeleccionado.value.id,
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

// Lifecycle
onMounted(async () => {
  await cargarDatosMaestros();

  // Establecer fecha actual por defecto
  if (!datos.value.fechaInventario) {
    datos.value.fechaInventario = fechaMaxima.value;
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
