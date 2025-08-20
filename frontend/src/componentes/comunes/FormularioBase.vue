<template>
  <div class="formulario-base">
    <!-- Header del formulario -->
    <div class="formulario-header" v-if="titulo || descripcion">
      <h2 v-if="titulo" class="formulario-titulo">{{ titulo }}</h2>
      <p v-if="descripcion" class="formulario-descripcion">{{ descripcion }}</p>
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

    <!-- Formulario -->
    <form @submit.prevent="manejarEnvio" class="formulario-contenido">
      <slot name="campos"></slot>

      <!-- Botones de acción -->
      <div class="formulario-acciones">
        <slot name="acciones" :enviando="enviando" :valido="formularioValido">
          <button
            type="submit"
            class="boton boton-principal"
            :disabled="!formularioValido || enviando"
          >
            <span v-if="enviando" class="spinner"></span>
            <span v-else>{{ textoBotonEnviar }}</span>
          </button>

          <button
            type="button"
            class="boton boton-secundario"
            @click="manejarCancelar"
            :disabled="enviando"
          >
            Cancelar
          </button>
        </slot>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import MensajeEstado from "@/componentes/MensajeEstado.vue";

// Props
const props = defineProps({
  titulo: {
    type: String,
    default: "",
  },
  descripcion: {
    type: String,
    default: "",
  },
  textoBotonEnviar: {
    type: String,
    default: "Guardar",
  },
  validaciones: {
    type: Object,
    default: () => ({}),
  },
  datosIniciales: {
    type: Object,
    default: () => ({}),
  },
});

// Emits
const emit = defineEmits([
  "enviar",
  "cancelar",
  "validacion-cambio",
  "datos-cambio",
]);

// Estado del formulario
const enviando = ref(false);
const mensajeExito = ref("");
const mensajeError = ref("");
const datosFormulario = ref({ ...props.datosIniciales });
const erroresValidacion = ref({});

// Computed
const formularioValido = computed(() => {
  return Object.keys(erroresValidacion.value).length === 0;
});

// Métodos
function validarCampo(nombre, valor) {
  const validacion = props.validaciones[nombre];
  if (!validacion) return null;

  // Validación requerida
  if (validacion.requerido && (!valor || valor.toString().trim() === "")) {
    return validacion.mensajeRequerido || "Este campo es requerido";
  }

  // Validación de longitud mínima
  if (
    validacion.minLength &&
    valor &&
    valor.toString().length < validacion.minLength
  ) {
    return (
      validacion.mensajeMinLength || `Mínimo ${validacion.minLength} caracteres`
    );
  }

  // Validación de longitud máxima
  if (
    validacion.maxLength &&
    valor &&
    valor.toString().length > validacion.maxLength
  ) {
    return (
      validacion.mensajeMaxLength || `Máximo ${validacion.maxLength} caracteres`
    );
  }

  // Validación de patrón
  if (validacion.patron && valor && !validacion.patron.test(valor.toString())) {
    return validacion.mensajePatron || "Formato inválido";
  }

  // Validación personalizada
  if (validacion.validar && typeof validacion.validar === "function") {
    const resultado = validacion.validar(valor, datosFormulario.value);
    if (resultado !== true) {
      return resultado;
    }
  }

  return null;
}

function validarFormulario() {
  const nuevosErrores = {};

  Object.keys(props.validaciones).forEach((nombre) => {
    const error = validarCampo(nombre, datosFormulario.value[nombre]);
    if (error) {
      nuevosErrores[nombre] = error;
    }
  });

  erroresValidacion.value = nuevosErrores;
  emit("validacion-cambio", nuevosErrores);

  return Object.keys(nuevosErrores).length === 0;
}

async function manejarEnvio() {
  if (!validarFormulario()) {
    return;
  }

  enviando.value = true;
  mensajeError.value = "";

  try {
    await emit("enviar", datosFormulario.value);
    mensajeExito.value = "Datos guardados correctamente";

    // Limpiar formulario después de éxito
    setTimeout(() => {
      limpiarFormulario();
    }, 2000);
  } catch (error) {
    mensajeError.value = error.message || "Error al guardar los datos";
  } finally {
    enviando.value = false;
  }
}

function manejarCancelar() {
  emit("cancelar");
}

function limpiarFormulario() {
  datosFormulario.value = { ...props.datosIniciales };
  erroresValidacion.value = {};
  mensajeExito.value = "";
  mensajeError.value = "";
}

function actualizarCampo(nombre, valor) {
  datosFormulario.value[nombre] = valor;

  // Validar campo individual
  const error = validarCampo(nombre, valor);
  if (error) {
    erroresValidacion.value[nombre] = error;
  } else {
    delete erroresValidacion.value[nombre];
  }

  emit("datos-cambio", { nombre, valor, datos: datosFormulario.value });
}

// Exponer métodos y estado
defineExpose({
  datosFormulario,
  erroresValidacion,
  formularioValido,
  validarFormulario,
  limpiarFormulario,
  actualizarCampo,
  mostrarExito: (mensaje) => (mensajeExito.value = mensaje),
  mostrarError: (mensaje) => (mensajeError.value = mensaje),
});

// Watchers
watch(
  () => props.datosIniciales,
  (nuevos) => {
    datosFormulario.value = { ...nuevos };
  },
  { deep: true }
);
</script>

<style scoped>
.formulario-base {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.formulario-header {
  margin-bottom: 24px;
  text-align: center;
}

.formulario-titulo {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.formulario-descripcion {
  color: #6c757d;
  margin: 0;
  font-size: 0.95rem;
}

.formulario-contenido {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.formulario-acciones {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.boton {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 100px;
  justify-content: center;
}

.boton-principal {
  background: #007bff;
  color: white;
}

.boton-principal:hover:not(:disabled) {
  background: #0056b3;
}

.boton-principal:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.boton-secundario {
  background: #6c757d;
  color: white;
}

.boton-secundario:hover:not(:disabled) {
  background: #545b62;
}

.boton:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

/* Responsive */
@media (max-width: 768px) {
  .formulario-base {
    padding: 16px;
  }

  .formulario-acciones {
    flex-direction: column;
  }

  .boton {
    width: 100%;
  }
}
</style>
