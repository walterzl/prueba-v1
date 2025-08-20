<template>
  <div class="buscador-material">
    <!-- Campo de búsqueda -->
    <div class="campo-busqueda">
      <label v-if="etiqueta" :for="id" class="campo-etiqueta">
        {{ etiqueta }}
        <span v-if="requerido" class="campo-requerido">*</span>
      </label>

      <div class="contenedor-busqueda">
        <input
          :id="id"
          ref="inputBusqueda"
          v-model="terminoBusqueda"
          type="text"
          :placeholder="placeholder"
          :disabled="deshabilitado"
          :readonly="soloLectura"
          class="campo-busqueda-input"
          :class="{ 'con-error': tieneError }"
          @input="manejarInput"
          @focus="manejarFocus"
          @blur="manejarBlur"
          @keydown="manejarKeydown"
        />

        <!-- Icono de búsqueda -->
        <div class="icono-busqueda">
          <span v-if="!cargando">🔍</span>
          <span v-else class="spinner"></span>
        </div>
      </div>
    </div>

    <!-- Lista de resultados -->
    <div
      v-if="mostrarResultados && resultados.length > 0"
      class="lista-resultados"
    >
      <div
        v-for="(material, index) in resultados"
        :key="material.id || material.codigo_ranco"
        class="resultado-item"
        :class="{ seleccionado: index === indiceSeleccionado }"
        @click="seleccionarMaterial(material)"
        @mouseenter="indiceSeleccionado = index"
      >
        <div class="resultado-codigo">{{ material.codigo_ranco }}</div>
        <div class="resultado-nombre">{{ material.nombre_material }}</div>
        <div class="resultado-clasificacion">{{ material.clasificacion }}</div>
      </div>
    </div>

    <!-- Mensaje de no resultados -->
    <div
      v-if="
        mostrarResultados &&
        resultados.length === 0 &&
        terminoBusqueda &&
        !cargando
      "
      class="sin-resultados"
    >
      No se encontraron materiales con "{{ terminoBusqueda }}"
    </div>

    <!-- Material seleccionado -->
    <div v-if="materialSeleccionado" class="material-seleccionado">
      <div class="material-info">
        <div class="material-codigo">
          {{ materialSeleccionado.codigo_ranco }}
        </div>
        <div class="material-nombre">
          {{ materialSeleccionado.nombre_material }}
        </div>
        <div class="material-detalles">
          <span class="material-clasificacion">{{
            materialSeleccionado.clasificacion
          }}</span>
          <span class="material-unidad">{{
            materialSeleccionado.unidad_medida
          }}</span>
          <span v-if="materialSeleccionado.frio === 'Si'" class="material-frio"
            >❄️ Frío</span
          >
        </div>
      </div>

      <button
        v-if="!soloLectura"
        type="button"
        class="boton-limpiar"
        @click="limpiarSeleccion"
        title="Limpiar selección"
      >
        ✕
      </button>
    </div>

    <!-- Mensaje de error -->
    <div v-if="tieneError" class="campo-error">
      <span class="icono-error">⚠️</span>
      {{ mensajeError }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import { servicioMantenedores } from "@/servicios/servicioMantenedores";

// Props
const props = defineProps({
  modelValue: {
    type: [String, Object],
    default: "",
  },
  etiqueta: {
    type: String,
    default: "Buscar Material",
  },
  placeholder: {
    type: String,
    default: "Ingrese código o nombre del material...",
  },
  id: {
    type: String,
    default: "",
  },
  requerido: {
    type: Boolean,
    default: false,
  },
  deshabilitado: {
    type: Boolean,
    default: false,
  },
  soloLectura: {
    type: Boolean,
    default: false,
  },
  validacion: {
    type: Object,
    default: () => ({}),
  },
  error: {
    type: String,
    default: "",
  },
});

// Emits
const emit = defineEmits([
  "update:modelValue",
  "seleccion",
  "cambio",
  "validacion",
]);

// Estado local
const terminoBusqueda = ref("");
const resultados = ref([]);
const materialSeleccionado = ref(null);
const cargando = ref(false);
const mostrarResultados = ref(false);
const indiceSeleccionado = ref(-1);
const enfocado = ref(false);
const inputBusqueda = ref(null);

// Timeout para búsqueda con debounce
let timeoutBusqueda = null;

// Computed
const tieneError = computed(() => {
  return (
    Boolean(props.error) ||
    (enfocado.value &&
      props.validacion.requerido &&
      !materialSeleccionado.value)
  );
});

const mensajeError = computed(() => {
  if (props.error) return props.error;

  if (
    enfocado.value &&
    props.validacion.requerido &&
    !materialSeleccionado.value
  ) {
    return props.validacion.mensajeRequerido || "Debe seleccionar un material";
  }

  return "";
});

// Métodos
async function buscarMateriales(termino) {
  if (!termino || termino.trim().length < 2) {
    resultados.value = [];
    return;
  }

  cargando.value = true;

  try {
    const materiales = await servicioMantenedores.buscarMateriales(termino);
    resultados.value = materiales.slice(0, 10); // Limitar a 10 resultados
    mostrarResultados.value = true;
  } catch (error) {
    console.error("Error buscando materiales:", error);
    resultados.value = [];
  } finally {
    cargando.value = false;
  }
}

function manejarInput(event) {
  const valor = event.target.value;
  terminoBusqueda.value = valor;

  // Limpiar selección si se cambia el término de búsqueda
  if (materialSeleccionado.value) {
    limpiarSeleccion();
  }

  // Búsqueda con debounce
  clearTimeout(timeoutBusqueda);
  timeoutBusqueda = setTimeout(() => {
    buscarMateriales(valor);
  }, 300);

  emit("cambio", valor);
}

function manejarFocus() {
  enfocado.value = true;
  if (terminoBusqueda.value && !materialSeleccionado.value) {
    mostrarResultados.value = true;
  }
}

function manejarBlur() {
  enfocado.value = false;

  // Ocultar resultados después de un pequeño delay para permitir clicks
  setTimeout(() => {
    mostrarResultados.value = false;
    indiceSeleccionado.value = -1;
  }, 200);
}

function manejarKeydown(event) {
  if (!mostrarResultados.value || resultados.value.length === 0) return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      indiceSeleccionado.value = Math.min(
        indiceSeleccionado.value + 1,
        resultados.value.length - 1
      );
      break;

    case "ArrowUp":
      event.preventDefault();
      indiceSeleccionado.value = Math.max(indiceSeleccionado.value - 1, 0);
      break;

    case "Enter":
      event.preventDefault();
      if (indiceSeleccionado.value >= 0) {
        seleccionarMaterial(resultados.value[indiceSeleccionado.value]);
      }
      break;

    case "Escape":
      mostrarResultados.value = false;
      indiceSeleccionado.value = -1;
      break;
  }
}

function seleccionarMaterial(material) {
  materialSeleccionado.value = material;
  terminoBusqueda.value = material.codigo_ranco;
  mostrarResultados.value = false;
  indiceSeleccionado.value = -1;

  // Emitir eventos
  emit("update:modelValue", material.codigo_ranco);
  emit("seleccion", material);

  // Validar campo
  validarCampo();
}

function limpiarSeleccion() {
  materialSeleccionado.value = null;
  terminoBusqueda.value = "";
  resultados.value = [];
  mostrarResultados.value = false;
  indiceSeleccionado.value = -1;

  // Emitir eventos
  emit("update:modelValue", "");
  emit("seleccion", null);

  // Enfocar input
  nextTick(() => {
    if (inputBusqueda.value) {
      inputBusqueda.value.focus();
    }
  });

  // Validar campo
  validarCampo();
}

function validarCampo() {
  let error = null;

  // Validación requerida
  if (props.validacion.requerido && !materialSeleccionado.value) {
    error = props.validacion.mensajeRequerido || "Debe seleccionar un material";
  }

  // Validación personalizada
  if (
    props.validacion.validar &&
    typeof props.validacion.validar === "function"
  ) {
    const resultado = props.validacion.validar(materialSeleccionado.value);
    if (resultado !== true) {
      error = resultado;
    }
  }

  emit("validacion", {
    campo: props.id,
    error,
    valor: materialSeleccionado.value,
  });
}

// Watchers
watch(
  () => props.modelValue,
  (nuevoValor) => {
    if (
      typeof nuevoValor === "string" &&
      nuevoValor !== terminoBusqueda.value
    ) {
      terminoBusqueda.value = nuevoValor;
      if (nuevoValor) {
        buscarMateriales(nuevoValor);
      }
    }
  },
  { immediate: true }
);

// Lifecycle
onMounted(() => {
  // Inicializar con valor si se proporciona
  if (props.modelValue && typeof props.modelValue === "string") {
    terminoBusqueda.value = props.modelValue;
    buscarMateriales(props.modelValue);
  }
});

onUnmounted(() => {
  clearTimeout(timeoutBusqueda);
});

// Exponer métodos
defineExpose({
  enfocar: () => {
    if (inputBusqueda.value) {
      inputBusqueda.value.focus();
    }
  },
  limpiar: limpiarSeleccion,
  validar: validarCampo,
  obtenerMaterial: () => materialSeleccionado.value,
});
</script>

<style scoped>
.buscador-material {
  position: relative;
  width: 100%;
}

.campo-busqueda {
  margin-bottom: 16px;
}

.campo-etiqueta {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
}

.campo-requerido {
  color: #e74c3c;
  margin-left: 4px;
}

.contenedor-busqueda {
  position: relative;
  display: flex;
  align-items: center;
}

.campo-busqueda-input {
  width: 100%;
  padding: 10px 12px;
  padding-right: 40px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  background: white;
}

.campo-busqueda-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.campo-busqueda-input.con-error {
  border-color: #e74c3c;
}

.icono-busqueda {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 16px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
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

.lista-resultados {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e9ecef;
  border-top: none;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}

.resultado-item {
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #f8f9fa;
  transition: background-color 0.2s ease;
}

.resultado-item:hover,
.resultado-item.seleccionado {
  background-color: #f8f9fa;
}

.resultado-item:last-child {
  border-bottom: none;
}

.resultado-codigo {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.resultado-nombre {
  color: #495057;
  font-size: 0.85rem;
  margin-bottom: 2px;
}

.resultado-clasificacion {
  color: #6c757d;
  font-size: 0.8rem;
}

.sin-resultados {
  padding: 16px;
  text-align: center;
  color: #6c757d;
  font-style: italic;
  background: #f8f9fa;
  border-radius: 6px;
  margin-top: 8px;
}

.material-seleccionado {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #e8f5e8;
  border: 2px solid #28a745;
  border-radius: 6px;
  margin-top: 8px;
}

.material-info {
  flex: 1;
}

.material-codigo {
  font-weight: 600;
  color: #155724;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.material-nombre {
  color: #155724;
  font-size: 0.85rem;
  margin-bottom: 4px;
}

.material-detalles {
  display: flex;
  gap: 12px;
  font-size: 0.8rem;
  color: #155724;
}

.material-clasificacion,
.material-unidad {
  background: rgba(40, 167, 69, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.material-frio {
  background: rgba(0, 123, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.boton-limpiar {
  background: none;
  border: none;
  color: #6c757d;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.boton-limpiar:hover {
  background: rgba(108, 117, 125, 0.1);
  color: #495057;
}

.campo-error {
  margin-top: 6px;
  color: #e74c3c;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.icono-error {
  font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .campo-busqueda-input {
    font-size: 16px; /* Evita zoom en iOS */
  }

  .material-detalles {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
