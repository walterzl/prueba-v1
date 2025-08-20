<template>
  <div class="campo-formulario" :class="{ 'con-error': tieneError }">
    <!-- Etiqueta del campo -->
    <label v-if="etiqueta" :for="id" class="campo-etiqueta">
      {{ etiqueta }}
      <span v-if="requerido" class="campo-requerido">*</span>
    </label>

    <!-- Campo de entrada -->
    <div class="campo-contenedor">
      <!-- Input de texto -->
      <input
        v-if="
          tipo === 'text' ||
          tipo === 'email' ||
          tipo === 'password' ||
          tipo === 'search'
        "
        :id="id"
        :type="tipo"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="deshabilitado"
        :readonly="soloLectura"
        :maxlength="maxLength"
        :minlength="minLength"
        class="campo-input"
        :class="clasesInput"
        @input="manejarInput"
        @blur="manejarBlur"
        @focus="manejarFocus"
        @keyup="manejarKeyup"
      />

      <!-- Textarea -->
      <textarea
        v-else-if="tipo === 'textarea'"
        :id="id"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="deshabilitado"
        :readonly="soloLectura"
        :rows="filas"
        :maxlength="maxLength"
        :minlength="minLength"
        class="campo-textarea"
        :class="clasesInput"
        @input="manejarInput"
        @blur="manejarBlur"
        @focus="manejarFocus"
      ></textarea>

      <!-- Select -->
      <select
        v-else-if="tipo === 'select'"
        :id="id"
        :value="modelValue"
        :disabled="deshabilitado"
        class="campo-select"
        :class="clasesInput"
        @change="manejarChange"
        @blur="manejarBlur"
        @focus="manejarFocus"
      >
        <option v-if="opcionVacia" value="">{{ opcionVacia }}</option>
        <option
          v-for="opcion in opciones"
          :key="opcion.valor || opcion"
          :value="opcion.valor || opcion"
        >
          {{ opcion.etiqueta || opcion }}
        </option>
      </select>

      <!-- Input de número -->
      <input
        v-else-if="tipo === 'number'"
        :id="id"
        type="number"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="deshabilitado"
        :readonly="soloLectura"
        :min="min"
        :max="max"
        :step="step"
        class="campo-input"
        :class="clasesInput"
        @input="manejarInput"
        @blur="manejarBlur"
        @focus="manejarFocus"
      />

      <!-- Input de fecha -->
      <input
        v-else-if="tipo === 'date'"
        :id="id"
        type="date"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="deshabilitado"
        :readonly="soloLectura"
        :min="min"
        :max="max"
        class="campo-input"
        :class="clasesInput"
        @input="manejarInput"
        @blur="manejarBlur"
        @focus="manejarFocus"
      />

      <!-- Input de tiempo -->
      <input
        v-else-if="tipo === 'time'"
        :id="id"
        type="time"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="deshabilitado"
        :readonly="soloLectura"
        class="campo-input"
        :class="clasesInput"
        @input="manejarInput"
        @blur="manejarBlur"
        @focus="manejarFocus"
      />

      <!-- Checkbox -->
      <div v-else-if="tipo === 'checkbox'" class="campo-checkbox">
        <input
          :id="id"
          type="checkbox"
          :checked="modelValue"
          :disabled="deshabilitado"
          :readonly="soloLectura"
          class="campo-checkbox-input"
          @change="manejarChange"
        />
        <label :for="id" class="campo-checkbox-etiqueta">
          {{ etiqueta }}
        </label>
      </div>

      <!-- Radio buttons -->
      <div v-else-if="tipo === 'radio'" class="campo-radio">
        <div
          v-for="opcion in opciones"
          :key="opcion.valor || opcion"
          class="opcion-radio"
        >
          <input
            :id="`${id}_${opcion.valor || opcion}`"
            type="radio"
            :name="id"
            :value="opcion.valor || opcion"
            :checked="modelValue === (opcion.valor || opcion)"
            :disabled="deshabilitado"
            :readonly="soloLectura"
            class="campo-radio-input"
            @change="manejarChange"
          />
          <label
            :for="`${id}_${opcion.valor || opcion}`"
            class="campo-radio-etiqueta"
          >
            {{ opcion.etiqueta || opcion }}
          </label>
        </div>
      </div>

      <!-- Campo de archivo -->
      <input
        v-else-if="tipo === 'file'"
        :id="id"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="deshabilitado"
        class="campo-file"
        :class="clasesInput"
        @change="manejarChange"
      />

      <!-- Icono de ayuda -->
      <div v-if="ayuda" class="campo-ayuda" :title="ayuda">
        <span class="icono-ayuda">?</span>
      </div>
    </div>

    <!-- Mensaje de error -->
    <div v-if="tieneError" class="campo-error">
      <span class="icono-error">⚠️</span>
      {{ mensajeError }}
    </div>

    <!-- Mensaje de ayuda -->
    <div v-if="ayuda && !tieneError" class="campo-ayuda-texto">
      {{ ayuda }}
    </div>

    <!-- Contador de caracteres -->
    <div v-if="mostrarContador && maxLength" class="campo-contador">
      {{ (modelValue || "").toString().length }} / {{ maxLength }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

// Props
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array, Date],
    default: "",
  },
  tipo: {
    type: String,
    default: "text",
  },
  etiqueta: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
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
  maxLength: {
    type: Number,
    default: null,
  },
  minLength: {
    type: Number,
    default: null,
  },
  min: {
    type: [Number, String],
    default: null,
  },
  max: {
    type: [Number, String],
    default: null,
  },
  step: {
    type: [Number, String],
    default: 1,
  },
  filas: {
    type: Number,
    default: 3,
  },
  opciones: {
    type: Array,
    default: () => [],
  },
  opcionVacia: {
    type: String,
    default: "Seleccione una opción",
  },
  ayuda: {
    type: String,
    default: "",
  },
  mostrarContador: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
  validacion: {
    type: Object,
    default: () => ({}),
  },
});

// Emits
const emit = defineEmits([
  "update:modelValue",
  "input",
  "change",
  "blur",
  "focus",
  "keyup",
  "validacion",
]);

// Estado local
const enfocado = ref(false);
const tocado = ref(false);

// Computed
const tieneError = computed(() => {
  return (
    Boolean(props.error) ||
    (tocado.value && props.validacion.requerido && !props.modelValue)
  );
});

const mensajeError = computed(() => {
  if (props.error) return props.error;

  if (tocado.value && props.validacion.requerido && !props.modelValue) {
    return props.validacion.mensajeRequerido || "Este campo es requerido";
  }

  return "";
});

const clasesInput = computed(() => {
  return {
    "campo-enfocado": enfocado.value,
    "campo-deshabilitado": props.deshabilitado,
    "campo-solo-lectura": props.soloLectura,
  };
});

// Métodos
function manejarInput(event) {
  const valor = event.target.value;
  emit("update:modelValue", valor);
  emit("input", valor);
  validarCampo(valor);
}

function manejarChange(event) {
  let valor;

  if (props.tipo === "checkbox") {
    valor = event.target.checked;
  } else if (props.tipo === "file") {
    valor = event.target.files;
  } else {
    valor = event.target.value;
  }

  emit("update:modelValue", valor);
  emit("change", valor);
  validarCampo(valor);
}

function manejarBlur(event) {
  enfocado.value = false;
  tocado.value = true;
  emit("blur", event);
  validarCampo(props.modelValue);
}

function manejarFocus(event) {
  enfocado.value = true;
  emit("focus", event);
}

function manejarKeyup(event) {
  emit("keyup", event);
}

function validarCampo(valor) {
  if (!props.validacion) return;

  let error = null;

  // Validación requerida
  if (
    props.validacion.requerido &&
    (!valor || valor.toString().trim() === "")
  ) {
    error = props.validacion.mensajeRequerido || "Este campo es requerido";
  }

  // Validación de longitud mínima
  if (
    props.validacion.minLength &&
    valor &&
    valor.toString().length < props.validacion.minLength
  ) {
    error =
      props.validacion.mensajeMinLength ||
      `Mínimo ${props.validacion.minLength} caracteres`;
  }

  // Validación de longitud máxima
  if (
    props.validacion.maxLength &&
    valor &&
    valor.toString().length > props.validacion.maxLength
  ) {
    error =
      props.validacion.mensajeMaxLength ||
      `Máximo ${props.validacion.maxLength} caracteres`;
  }

  // Validación de patrón
  if (
    props.validacion.patron &&
    valor &&
    !props.validacion.patron.test(valor.toString())
  ) {
    error = props.validacion.mensajePatron || "Formato inválido";
  }

  // Validación personalizada
  if (
    props.validacion.validar &&
    typeof props.validacion.validar === "function"
  ) {
    const resultado = props.validacion.validar(valor);
    if (resultado !== true) {
      error = resultado;
    }
  }

  emit("validacion", { campo: props.id, error, valor });
}

// Generar ID único si no se proporciona
const idUnico = computed(() => {
  return props.id || `campo_${Math.random().toString(36).substr(2, 9)}`;
});

// Exponer métodos
defineExpose({
  enfocar: () => {
    const elemento = document.getElementById(idUnico.value);
    if (elemento) elemento.focus();
  },
  validar: () => {
    tocado.value = true;
    validarCampo(props.modelValue);
  },
});
</script>

<style scoped>
.campo-formulario {
  margin-bottom: 20px;
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

.campo-contenedor {
  position: relative;
  display: flex;
  align-items: center;
}

.campo-input,
.campo-textarea,
.campo-select {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  background: white;
}

.campo-input:focus,
.campo-textarea:focus,
.campo-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.campo-textarea {
  resize: vertical;
  min-height: 80px;
}

.campo-select {
  cursor: pointer;
}

.campo-checkbox,
.campo-radio {
  display: flex;
  align-items: center;
  gap: 8px;
}

.campo-checkbox-input,
.campo-radio-input {
  margin: 0;
  cursor: pointer;
}

.campo-checkbox-etiqueta,
.campo-radio-etiqueta {
  cursor: pointer;
  user-select: none;
}

.opcion-radio {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.campo-file {
  padding: 8px;
  border: 2px dashed #e9ecef;
  border-radius: 6px;
  cursor: pointer;
}

.campo-file:hover {
  border-color: #007bff;
}

.campo-ayuda {
  margin-left: 8px;
  cursor: help;
}

.icono-ayuda {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #6c757d;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
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

.campo-ayuda-texto {
  margin-top: 6px;
  color: #6c757d;
  font-size: 0.8rem;
  font-style: italic;
}

.campo-contador {
  margin-top: 4px;
  text-align: right;
  color: #6c757d;
  font-size: 0.75rem;
}

/* Estados */
.campo-enfocado {
  border-color: #007bff;
}

.campo-deshabilitado {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.campo-solo-lectura {
  background: #f8f9fa;
  cursor: default;
}

.con-error .campo-input,
.con-error .campo-textarea,
.con-error .campo-select {
  border-color: #e74c3c;
}

.con-error .campo-input:focus,
.con-error .campo-textarea:focus,
.con-error .campo-select:focus {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .campo-input,
  .campo-textarea,
  .campo-select {
    font-size: 16px; /* Evita zoom en iOS */
  }

  .campo-checkbox,
  .campo-radio {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
