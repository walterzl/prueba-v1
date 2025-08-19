<template>
  <div v-if="totalPaginas > 1" class="paginacion">
    <!-- Botón anterior -->
    <button
      @click="$emit('pagina-anterior')"
      :disabled="!puedeAnterior"
      class="boton boton-secundario paginacion-boton"
    >
      ← Anterior
    </button>

    <!-- Números de página -->
    <div class="numeros-pagina">
      <button
        v-for="numero in paginasVisibles"
        :key="numero"
        @click="$emit('ir-pagina', numero)"
        :class="[
          'boton',
          numero === paginaActual ? 'boton-primario' : 'boton-secundario',
        ]"
        class="paginacion-numero"
      >
        {{ numero }}
      </button>
    </div>

    <!-- Botón siguiente -->
    <button
      @click="$emit('pagina-siguiente')"
      :disabled="!puedeSiguiente"
      class="boton boton-secundario paginacion-boton"
    >
      Siguiente →
    </button>

    <!-- Información de registros -->
    <div class="info-registros">
      <span class="texto-pequeno">
        Mostrando {{ inicio }}-{{ fin }} de {{ totalRegistros }} registros
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

// Props
const props = defineProps({
  paginaActual: {
    type: Number,
    required: true,
  },
  totalPaginas: {
    type: Number,
    required: true,
  },
  totalRegistros: {
    type: Number,
    required: true,
  },
  inicio: {
    type: Number,
    required: true,
  },
  fin: {
    type: Number,
    required: true,
  },
  puedeAnterior: {
    type: Boolean,
    default: false,
  },
  puedeSiguiente: {
    type: Boolean,
    default: false,
  },
});

// Emits
defineEmits(["pagina-anterior", "pagina-siguiente", "ir-pagina"]);

// Computadas
const paginasVisibles = computed(() => {
  const paginas = [];
  const total = props.totalPaginas;
  const actual = props.paginaActual;

  // Mostrar máximo 5 páginas
  let inicio = Math.max(1, actual - 2);
  let fin = Math.min(total, inicio + 4);

  // Ajustar si estamos cerca del final
  if (fin - inicio < 4) {
    inicio = Math.max(1, fin - 4);
  }

  for (let i = inicio; i <= fin; i++) {
    paginas.push(i);
  }

  return paginas;
});
</script>

<style scoped>
.paginacion {
  display: flex;
  flex-direction: column;
  gap: var(--espaciado-md);
  align-items: center;
  margin-top: var(--espaciado-xl);
  padding: var(--espaciado-lg);
  background: var(--fondo-claro);
  border-radius: var(--radio-medio);
  box-shadow: var(--sombra-pequena);
}

.numeros-pagina {
  display: flex;
  gap: var(--espaciado-sm);
  align-items: center;
}

.paginacion-boton,
.paginacion-numero {
  padding: var(--espaciado-sm) var(--espaciado-md);
  font-size: 0.9rem;
  min-width: 40px;
}

.info-registros {
  color: var(--texto-secundario);
  font-size: 0.875rem;
}

@media (min-width: 768px) {
  .paginacion {
    flex-direction: row;
    justify-content: space-between;
  }

  .numeros-pagina {
    flex: 1;
    justify-content: center;
  }
}
</style>
