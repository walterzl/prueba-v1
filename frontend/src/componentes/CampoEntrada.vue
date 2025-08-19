<template>
  <div class="campo-entrada">
    <label
      v-if="mostrarEtiqueta"
      :for="idCampo"
      class="campo-etiqueta"
      :class="{ requerido: esRequerido }"
    >
      {{ etiqueta }}
      <span v-if="esRequerido" class="indicador-requerido">*</span>
    </label>

    <!-- Campo de entrada normal -->
    <input
      v-if="!esTextarea && !esSelect"
      :id="idCampo"
      :type="tipoCampo"
      :value="valorModelo"
      :placeholder="placeholder"
      :disabled="deshabilitado"
      :readonly="soloLectura"
      :min="minimo"
      :max="maximo"
      :step="paso"
      :maxlength="longitudMaxima"
      :class="clasesCampo"
      @input="manejarCambio"
      @blur="manejarBlur"
      @focus="manejarFoco"
    />

    <!-- Campo de texto largo -->
    <textarea
      v-else-if="esTextarea"
      :id="idCampo"
      :value="valorModelo"
      :placeholder="placeholder"
      :disabled="deshabilitado"
      :readonly="soloLectura"
      :rows="filas"
      :maxlength="longitudMaxima"
      :class="clasesCampo"
      @input="manejarCambio"
      @blur="manejarBlur"
      @focus="manejarFoco"
    ></textarea>

    <!-- Campo de selección -->
    <select
      v-else-if="esSelect"
      :id="idCampo"
      :value="valorModelo"
      :disabled="deshabilitado"
      :class="clasesCampo"
      @change="manejarCambio"
      @blur="manejarBlur"
      @focus="manejarFoco"
    >
      <option value="" v-if="permitirOpcionVacia">
        {{ textoOpcionVacia }}
      </option>
      <option
        v-for="opcion in opciones"
        :key="opcion.value || opcion"
        :value="opcion.value || opcion"
      >
        {{ opcion.label || opcion }}
      </option>
    </select>

    <!-- Texto de ayuda -->
    <div v-if="textoAyuda && !tieneError" class="campo-ayuda">
      {{ textoAyuda }}
    </div>

    <!-- Mensaje de error -->
    <div v-if="tieneError" class="campo-error">
      {{ mensajeError }}
    </div>

    <!-- Indicador de carga -->
    <div v-if="cargando" class="campo-cargando">
      <span class="spinner"></span>
      Cargando...
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { generarIdTemporal } from "@/utilidades/auxiliares";

// Props del componente
const props = defineProps({
  // Valor del campo
  modelValue: {
    type: [String, Number, Boolean],
    default: "",
  },

  // Configuración básica
  etiqueta: {
    type: String,
    default: "",
  },

  placeholder: {
    type: String,
    default: "",
  },

  tipo: {
    type: String,
    default: "text",
    validator: (valor) =>
      [
        "text",
        "email",
        "password",
        "number",
        "tel",
        "url",
        "date",
        "datetime-local",
        "time",
        "search",
        "textarea",
        "select",
      ].includes(valor),
  },

  // Opciones para select
  opciones: {
    type: Array,
    default: () => [],
  },

  permitirOpcionVacia: {
    type: Boolean,
    default: true,
  },

  textoOpcionVacia: {
    type: String,
    default: "Seleccione una opción",
  },

  // Validación y estado
  esRequerido: {
    type: Boolean,
    default: false,
  },

  mensajeError: {
    type: String,
    default: "",
  },

  deshabilitado: {
    type: Boolean,
    default: false,
  },

  soloLectura: {
    type: Boolean,
    default: false,
  },

  cargando: {
    type: Boolean,
    default: false,
  },

  // Configuraciones específicas
  longitudMaxima: {
    type: Number,
    default: null,
  },

  minimo: {
    type: [String, Number],
    default: null,
  },

  maximo: {
    type: [String, Number],
    default: null,
  },

  paso: {
    type: [String, Number],
    default: null,
  },

  filas: {
    type: Number,
    default: 3,
  },

  textoAyuda: {
    type: String,
    default: "",
  },

  // Configuración de UI
  mostrarEtiqueta: {
    type: Boolean,
    default: true,
  },

  tamaño: {
    type: String,
    default: "mediano",
    validator: (valor) => ["pequeño", "mediano", "grande"].includes(valor),
  },

  // Clases personalizadas
  clasesPersonalizadas: {
    type: String,
    default: "",
  },
});

// Emits del componente
const emit = defineEmits(["update:modelValue", "cambio", "blur", "focus"]);

// Estado interno
const enfocado = ref(false);
const idCampo = computed(() => `campo-${generarIdTemporal()}`);

// Computed properties
const valorModelo = computed({
  get: () => props.modelValue,
  set: (valor) => emit("update:modelValue", valor),
});

const tipoCampo = computed(() => {
  if (props.tipo === "textarea" || props.tipo === "select") {
    return "text";
  }
  return props.tipo;
});

const esTextarea = computed(() => props.tipo === "textarea");
const esSelect = computed(() => props.tipo === "select");
const tieneError = computed(() => Boolean(props.mensajeError));

const clasesCampo = computed(() => {
  const clases = ["campo-input"];

  // Tamaño
  clases.push(`tamaño-${props.tamaño}`);

  // Estados
  if (tieneError.value) clases.push("con-error");
  if (props.deshabilitado) clases.push("deshabilitado");
  if (props.soloLectura) clases.push("solo-lectura");
  if (enfocado.value) clases.push("enfocado");
  if (props.cargando) clases.push("cargando");

  // Clases personalizadas
  if (props.clasesPersonalizadas) {
    clases.push(props.clasesPersonalizadas);
  }

  return clases.join(" ");
});

// Métodos del componente
function manejarCambio(evento) {
  const valor = evento.target.value;
  emit("update:modelValue", valor);
  emit("cambio", valor);
}

function manejarBlur(evento) {
  enfocado.value = false;
  emit("blur", evento.target.value);
}

function manejarFoco(evento) {
  enfocado.value = true;
  emit("focus", evento.target.value);
}
</script>

<style scoped>
.campo-entrada {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.campo-etiqueta {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.campo-etiqueta.requerido {
  color: #111827;
}

.indicador-requerido {
  color: #ef4444;
  margin-left: 0.25rem;
}

.campo-input {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
  background-color: #ffffff;
  color: #111827;
  outline: none;
}

/* Tamaños */
.campo-input.tamaño-pequeño {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
}

.campo-input.tamaño-mediano {
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
}

.campo-input.tamaño-grande {
  padding: 0.75rem 1rem;
  font-size: 1rem;
}

/* Estados de focus y hover */
.campo-input:hover:not(.deshabilitado):not(.solo-lectura) {
  border-color: #9ca3af;
}

.campo-input:focus,
.campo-input.enfocado {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

/* Estado de error */
.campo-input.con-error {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.campo-input.con-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Estados deshabilitado y solo lectura */
.campo-input.deshabilitado {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.campo-input.solo-lectura {
  background-color: #f8fafc;
  cursor: default;
}

/* Estado de carga */
.campo-input.cargando {
  opacity: 0.7;
  cursor: wait;
}

/* Textarea específico */
textarea.campo-input {
  resize: vertical;
  min-height: 3rem;
  line-height: 1.5;
}

/* Select específico */
select.campo-input {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  cursor: pointer;
}

select.campo-input.deshabilitado {
  cursor: not-allowed;
}

/* Texto de ayuda */
.campo-ayuda {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.25rem;
}

/* Mensaje de error */
.campo-error {
  font-size: 0.75rem;
  color: #ef4444;
  line-height: 1.25rem;
  font-weight: 500;
}

/* Indicador de carga */
.campo-cargando {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #4f46e5;
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

/* Placeholder */
.campo-input::placeholder {
  color: #9ca3af;
  opacity: 1;
}

/* Responsive */
@media (max-width: 640px) {
  .campo-entrada {
    margin-bottom: 0.75rem;
  }

  .campo-input {
    font-size: 1rem; /* Evita zoom en iOS */
  }
}
</style>
