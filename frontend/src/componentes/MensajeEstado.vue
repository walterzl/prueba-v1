<template>
  <Transition
    name="mensaje-estado"
    enter-active-class="entrada-activa"
    leave-active-class="salida-activa"
    enter-from-class="entrada-desde"
    leave-to-class="salida-hacia"
  >
    <div
      v-if="visible"
      :class="clasesMensaje"
      role="alert"
      :aria-live="tipo === 'error' ? 'assertive' : 'polite'"
    >
      <!-- Icono del mensaje -->
      <div class="mensaje-icono">
        <span v-if="icono" class="icono-personalizado">{{ icono }}</span>
        <span v-else class="icono-por-defecto">{{ iconoPorDefecto }}</span>
      </div>

      <!-- Contenido del mensaje -->
      <div class="mensaje-contenido">
        <div v-if="titulo" class="mensaje-titulo">
          {{ titulo }}
        </div>

        <div class="mensaje-texto">
          <!-- Mensaje simple -->
          <p v-if="typeof mensaje === 'string'" class="mensaje-parrafo">
            {{ mensaje }}
          </p>

          <!-- Lista de mensajes -->
          <ul v-else-if="Array.isArray(mensaje)" class="mensaje-lista">
            <li
              v-for="(item, indice) in mensaje"
              :key="indice"
              class="mensaje-item"
            >
              {{ item }}
            </li>
          </ul>

          <!-- Slot para contenido personalizado -->
          <div v-else>
            <slot>{{ mensaje }}</slot>
          </div>
        </div>
      </div>

      <!-- Botón de cerrar -->
      <button
        v-if="puedeSerCerrado"
        type="button"
        class="mensaje-boton-cerrar"
        :aria-label="'Cerrar ' + tipo"
        @click="cerrarMensaje"
      >
        <span class="sr-only">Cerrar</span>
        <svg class="icono-cerrar" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { UI_CONFIG } from "@/utilidades/constantes";

// Props del componente
const props = defineProps({
  // Tipo de mensaje
  tipo: {
    type: String,
    default: "info",
    validator: (valor) =>
      ["exito", "error", "advertencia", "info"].includes(valor),
  },

  // Contenido del mensaje
  mensaje: {
    type: [String, Array, Object],
    required: true,
  },

  titulo: {
    type: String,
    default: "",
  },

  // Configuración de visualización
  visible: {
    type: Boolean,
    default: true,
  },

  icono: {
    type: String,
    default: "",
  },

  // Configuración de comportamiento
  puedeSerCerrado: {
    type: Boolean,
    default: true,
  },

  autoCerrar: {
    type: Boolean,
    default: false,
  },

  tiempoAutoCierre: {
    type: Number,
    default: 5000, // 5 segundos
  },

  // Configuración de estilo
  variante: {
    type: String,
    default: "solido",
    validator: (valor) => ["solido", "bordeado", "suave"].includes(valor),
  },

  tamaño: {
    type: String,
    default: "mediano",
    validator: (valor) => ["pequeño", "mediano", "grande"].includes(valor),
  },

  posicion: {
    type: String,
    default: "relativo",
    validator: (valor) =>
      ["relativo", "fijo-superior", "fijo-inferior", "flotante"].includes(
        valor
      ),
  },

  // Clases personalizadas
  clasesPersonalizadas: {
    type: String,
    default: "",
  },
});

// Emits del componente
const emit = defineEmits(["cerrar", "auto-cerrar"]);

// Estado interno
const tiempoRestante = ref(0);
let intervaloCierre = null;

// Computed properties
const iconoPorDefecto = computed(() => {
  const iconos = {
    exito: UI_CONFIG.ICONOS.EXITO,
    error: UI_CONFIG.ICONOS.ERROR,
    advertencia: UI_CONFIG.ICONOS.ADVERTENCIA,
    info: UI_CONFIG.ICONOS.INFO,
  };
  return iconos[props.tipo] || UI_CONFIG.ICONOS.INFO;
});

const clasesMensaje = computed(() => {
  const clases = ["mensaje-estado"];

  // Tipo de mensaje
  clases.push(`tipo-${props.tipo}`);

  // Variante de estilo
  clases.push(`variante-${props.variante}`);

  // Tamaño
  clases.push(`tamaño-${props.tamaño}`);

  // Posición
  clases.push(`posicion-${props.posicion}`);

  // Clases personalizadas
  if (props.clasesPersonalizadas) {
    clases.push(props.clasesPersonalizadas);
  }

  return clases.join(" ");
});

// Métodos del componente
function cerrarMensaje() {
  emit("cerrar");
}

function iniciarAutoCierre() {
  if (!props.autoCerrar || props.tiempoAutoCierre <= 0) return;

  tiempoRestante.value = props.tiempoAutoCierre;

  intervaloCierre = setInterval(() => {
    tiempoRestante.value -= 100;

    if (tiempoRestante.value <= 0) {
      clearInterval(intervaloCierre);
      emit("auto-cerrar");
    }
  }, 100);
}

function detenerAutoCierre() {
  if (intervaloCierre) {
    clearInterval(intervaloCierre);
    intervaloCierre = null;
  }
}

// Watchers
watch(
  () => props.visible,
  (nuevoValor) => {
    if (nuevoValor && props.autoCerrar) {
      iniciarAutoCierre();
    } else {
      detenerAutoCierre();
    }
  }
);

// Lifecycle
onMounted(() => {
  if (props.visible && props.autoCerrar) {
    iniciarAutoCierre();
  }
});
</script>

<style scoped>
.mensaje-estado {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  position: relative;
  overflow: hidden;
}

/* Tamaños */
.mensaje-estado.tamaño-pequeño {
  padding: 0.75rem;
  font-size: 0.75rem;
}

.mensaje-estado.tamaño-mediano {
  padding: 1rem;
  font-size: 0.875rem;
}

.mensaje-estado.tamaño-grande {
  padding: 1.25rem;
  font-size: 1rem;
}

/* Posiciones */
.mensaje-estado.posicion-relativo {
  position: relative;
  width: 100%;
}

.mensaje-estado.posicion-fijo-superior {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  max-width: 32rem;
  width: calc(100% - 2rem);
}

.mensaje-estado.posicion-fijo-inferior {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  max-width: 32rem;
  width: calc(100% - 2rem);
}

.mensaje-estado.posicion-flotante {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  max-width: 24rem;
  width: calc(100% - 2rem);
}

/* Tipos - Variante Sólida */
.mensaje-estado.tipo-exito.variante-solido {
  background-color: #10b981;
  color: white;
  border: 1px solid #059669;
}

.mensaje-estado.tipo-error.variante-solido {
  background-color: #ef4444;
  color: white;
  border: 1px solid #dc2626;
}

.mensaje-estado.tipo-advertencia.variante-solido {
  background-color: #f59e0b;
  color: white;
  border: 1px solid #d97706;
}

.mensaje-estado.tipo-info.variante-solido {
  background-color: #3b82f6;
  color: white;
  border: 1px solid #2563eb;
}

/* Tipos - Variante Bordeada */
.mensaje-estado.tipo-exito.variante-bordeado {
  background-color: #f0fdf4;
  color: #065f46;
  border: 1px solid #10b981;
}

.mensaje-estado.tipo-error.variante-bordeado {
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #ef4444;
}

.mensaje-estado.tipo-advertencia.variante-bordeado {
  background-color: #fffbeb;
  color: #92400e;
  border: 1px solid #f59e0b;
}

.mensaje-estado.tipo-info.variante-bordeado {
  background-color: #eff6ff;
  color: #1e40af;
  border: 1px solid #3b82f6;
}

/* Tipos - Variante Suave */
.mensaje-estado.tipo-exito.variante-suave {
  background-color: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.mensaje-estado.tipo-error.variante-suave {
  background-color: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fca5a5;
}

.mensaje-estado.tipo-advertencia.variante-suave {
  background-color: #fffbeb;
  color: #b45309;
  border: 1px solid #fcd34d;
}

.mensaje-estado.tipo-info.variante-suave {
  background-color: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #93c5fd;
}

/* Componentes internos */
.mensaje-icono {
  flex-shrink: 0;
  font-size: 1.25rem;
  line-height: 1;
}

.mensaje-contenido {
  flex-grow: 1;
  min-width: 0;
}

.mensaje-titulo {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.mensaje-texto {
  line-height: 1.5;
}

.mensaje-parrafo {
  margin: 0;
}

.mensaje-lista {
  margin: 0;
  padding-left: 1.25rem;
  list-style-type: disc;
}

.mensaje-item {
  margin-bottom: 0.25rem;
}

.mensaje-item:last-child {
  margin-bottom: 0;
}

/* Botón de cerrar */
.mensaje-boton-cerrar {
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.2s ease-in-out;
  opacity: 0.7;
}

.mensaje-boton-cerrar:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.1);
}

.mensaje-boton-cerrar:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.icono-cerrar {
  width: 1.25rem;
  height: 1.25rem;
}

/* Utilidad para screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Animaciones de transición */
.entrada-activa {
  transition: all 0.3s ease-out;
}

.salida-activa {
  transition: all 0.3s ease-in;
}

.entrada-desde {
  opacity: 0;
  transform: translateY(-1rem) scale(0.95);
}

.salida-hacia {
  opacity: 0;
  transform: translateY(-1rem) scale(0.95);
}

/* Responsive */
@media (max-width: 640px) {
  .mensaje-estado.posicion-fijo-superior,
  .mensaje-estado.posicion-fijo-inferior,
  .mensaje-estado.posicion-flotante {
    left: 0.5rem;
    right: 0.5rem;
    transform: none;
    width: auto;
    max-width: none;
  }

  .mensaje-estado.posicion-flotante {
    top: 0.5rem;
    right: 0.5rem;
    left: 0.5rem;
  }
}

/* Estados especiales para accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .entrada-activa,
  .salida-activa {
    transition: none;
  }

  .entrada-desde,
  .salida-hacia {
    transform: none;
  }
}
</style>
