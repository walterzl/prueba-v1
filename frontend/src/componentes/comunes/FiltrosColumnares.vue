<template>
  <div class="filtros-contenedor">
    <!-- Panel de Filtros -->
    <div class="panel-filtros" :class="{ mostrar: mostrarFiltros }">
      <div class="encabezado-filtros">
        <h3>
          <span class="icono-filtros">🔍</span>
          Filtros de Búsqueda
        </h3>
        <button type="button" class="btn-toggle-filtros" @click="toggleFiltros">
          {{ mostrarFiltros ? "▲" : "▼" }}
        </button>
      </div>

      <div v-show="mostrarFiltros" class="contenido-filtros">
        <!-- Búsqueda Global -->
        <div class="filtro-grupo filtro-busqueda-global">
          <label>Búsqueda Global:</label>
          <input
            v-model="filtros.busquedaGlobal"
            type="text"
            placeholder="Buscar en todas las columnas..."
            class="input-filtro"
            @input="aplicarFiltros"
          />
          <button
            v-if="filtros.busquedaGlobal"
            type="button"
            class="btn-limpiar-filtro"
            @click="limpiarFiltro('busquedaGlobal')"
          >
            ✕
          </button>
        </div>

        <!-- Filtros por Columnas -->
        <div class="filtros-grid">
          <div
            v-for="columna in columnasFiltrables"
            :key="columna.key"
            class="filtro-grupo"
          >
            <label>{{ columna.label }}:</label>

            <!-- Filtro de Texto -->
            <div v-if="columna.tipo === 'texto'" class="input-grupo">
              <input
                v-model="filtros.columnas[columna.key]"
                type="text"
                :placeholder="`Filtrar por ${columna.label.toLowerCase()}...`"
                class="input-filtro"
                @input="aplicarFiltros"
              />
              <button
                v-if="filtros.columnas[columna.key]"
                type="button"
                class="btn-limpiar-filtro"
                @click="limpiarFiltro('columnas', columna.key)"
              >
                ✕
              </button>
            </div>

            <!-- Filtro de Select -->
            <div v-else-if="columna.tipo === 'select'" class="input-grupo">
              <select
                v-model="filtros.columnas[columna.key]"
                class="select-filtro"
                @change="aplicarFiltros"
              >
                <option value="">Todos</option>
                <option
                  v-for="opcion in columna.opciones"
                  :key="opcion.valor"
                  :value="opcion.valor"
                >
                  {{ opcion.texto }}
                </option>
              </select>
            </div>

            <!-- Filtro de Rango de Fechas -->
            <div
              v-else-if="columna.tipo === 'fecha'"
              class="input-grupo fecha-rango"
            >
              <input
                v-model="filtros.columnas[`${columna.key}_desde`]"
                type="date"
                class="input-filtro input-fecha"
                @change="aplicarFiltros"
              />
              <span class="separador-fecha">hasta</span>
              <input
                v-model="filtros.columnas[`${columna.key}_hasta`]"
                type="date"
                class="input-filtro input-fecha"
                @change="aplicarFiltros"
              />
              <button
                v-if="
                  filtros.columnas[`${columna.key}_desde`] ||
                  filtros.columnas[`${columna.key}_hasta`]
                "
                type="button"
                class="btn-limpiar-filtro"
                @click="limpiarRangoFecha(columna.key)"
              >
                ✕
              </button>
            </div>

            <!-- Filtro de Rango Numérico -->
            <div
              v-else-if="columna.tipo === 'numero'"
              class="input-grupo numero-rango"
            >
              <input
                v-model.number="filtros.columnas[`${columna.key}_min`]"
                type="number"
                :placeholder="`Min ${columna.label.toLowerCase()}`"
                class="input-filtro input-numero"
                @input="aplicarFiltros"
              />
              <span class="separador-numero">-</span>
              <input
                v-model.number="filtros.columnas[`${columna.key}_max`]"
                type="number"
                :placeholder="`Max ${columna.label.toLowerCase()}`"
                class="input-filtro input-numero"
                @input="aplicarFiltros"
              />
              <button
                v-if="
                  filtros.columnas[`${columna.key}_min`] !== undefined ||
                  filtros.columnas[`${columna.key}_max`] !== undefined
                "
                type="button"
                class="btn-limpiar-filtro"
                @click="limpiarRangoNumerico(columna.key)"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- Acciones de Filtros -->
        <div class="acciones-filtros">
          <div class="estadisticas-filtros">
            <span class="total-registros">
              {{ totalFiltrados }} de {{ totalRegistros }} registros
            </span>
            <span v-if="tieneActivosFiltros" class="filtros-activos">
              ({{ contadorFiltrosActivos }} filtros activos)
            </span>
          </div>

          <div class="botones-acciones">
            <button
              v-if="tieneActivosFiltros"
              type="button"
              class="btn-limpiar-todos"
              @click="limpiarTodosFiltros"
            >
              Limpiar Filtros
            </button>
            <button
              type="button"
              class="btn-exportar"
              @click="$emit('exportar-filtrados')"
            >
              Exportar Filtrados
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros Rápidos (siempre visibles) -->
    <div class="filtros-rapidos">
      <div
        class="filtro-rapido"
        v-for="filtroRapido in filtrosRapidos"
        :key="filtroRapido.key"
      >
        <button
          type="button"
          class="btn-filtro-rapido"
          :class="{ activo: filtroRapidoActivo === filtroRapido.key }"
          @click="aplicarFiltroRapido(filtroRapido.key)"
        >
          <span class="icono-filtro-rapido">{{ filtroRapido.icono }}</span>
          <span class="texto-filtro-rapido">{{ filtroRapido.label }}</span>
          <span class="contador-filtro-rapido" v-if="filtroRapido.contador">
            ({{ filtroRapido.contador }})
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from "vue";

// Props
const props = defineProps({
  datos: {
    type: Array,
    required: true,
  },
  columnasFiltrables: {
    type: Array,
    required: true,
  },
  filtrosRapidos: {
    type: Array,
    default: () => [],
  },
});

// Emits
const emit = defineEmits(["datos-filtrados", "exportar-filtrados"]);

// Estado reactivo
const mostrarFiltros = ref(false);
const filtroRapidoActivo = ref(null);

// Estructura de filtros
const filtros = reactive({
  busquedaGlobal: "",
  columnas: {},
});

// Inicializar filtros de columnas
props.columnasFiltrables.forEach((columna) => {
  if (columna.tipo === "fecha") {
    filtros.columnas[`${columna.key}_desde`] = "";
    filtros.columnas[`${columna.key}_hasta`] = "";
  } else if (columna.tipo === "numero") {
    filtros.columnas[`${columna.key}_min`] = undefined;
    filtros.columnas[`${columna.key}_max`] = undefined;
  } else {
    filtros.columnas[columna.key] = "";
  }
});

// Computadas
const totalRegistros = computed(() => props.datos.length);

const datosFiltrados = computed(() => {
  let resultado = [...props.datos];

  // Aplicar búsqueda global
  if (filtros.busquedaGlobal.trim()) {
    const busqueda = filtros.busquedaGlobal.toLowerCase();
    resultado = resultado.filter((item) => {
      return Object.values(item).some((valor) => {
        if (valor === null || valor === undefined) return false;
        return String(valor).toLowerCase().includes(busqueda);
      });
    });
  }

  // Aplicar filtros por columnas
  props.columnasFiltrables.forEach((columna) => {
    const key = columna.key;

    if (columna.tipo === "texto" || columna.tipo === "select") {
      const filtroValor = filtros.columnas[key];
      if (filtroValor) {
        resultado = resultado.filter((item) => {
          const valor = obtenerValorAnidado(item, key);
          if (valor === null || valor === undefined) return false;
          return String(valor)
            .toLowerCase()
            .includes(filtroValor.toLowerCase());
        });
      }
    } else if (columna.tipo === "fecha") {
      const desde = filtros.columnas[`${key}_desde`];
      const hasta = filtros.columnas[`${key}_hasta`];

      if (desde || hasta) {
        resultado = resultado.filter((item) => {
          const valor = obtenerValorAnidado(item, key);
          if (!valor) return false;

          const fechaItem = new Date(valor).getTime();
          const fechaDesde = desde ? new Date(desde).getTime() : 0;
          const fechaHasta = hasta ? new Date(hasta).getTime() : Infinity;

          return fechaItem >= fechaDesde && fechaItem <= fechaHasta;
        });
      }
    } else if (columna.tipo === "numero") {
      const min = filtros.columnas[`${key}_min`];
      const max = filtros.columnas[`${key}_max`];

      if (min !== undefined || max !== undefined) {
        resultado = resultado.filter((item) => {
          const valor = parseFloat(obtenerValorAnidado(item, key));
          if (isNaN(valor)) return false;

          const minValido = min !== undefined ? valor >= min : true;
          const maxValido = max !== undefined ? valor <= max : true;

          return minValido && maxValido;
        });
      }
    }
  });

  return resultado;
});

const totalFiltrados = computed(() => datosFiltrados.value.length);

const tieneActivosFiltros = computed(() => {
  if (filtros.busquedaGlobal.trim()) return true;

  return Object.keys(filtros.columnas).some((key) => {
    const valor = filtros.columnas[key];
    return valor !== "" && valor !== undefined && valor !== null;
  });
});

const contadorFiltrosActivos = computed(() => {
  let contador = 0;

  if (filtros.busquedaGlobal.trim()) contador++;

  props.columnasFiltrables.forEach((columna) => {
    if (columna.tipo === "fecha") {
      if (
        filtros.columnas[`${columna.key}_desde`] ||
        filtros.columnas[`${columna.key}_hasta`]
      ) {
        contador++;
      }
    } else if (columna.tipo === "numero") {
      if (
        filtros.columnas[`${columna.key}_min`] !== undefined ||
        filtros.columnas[`${columna.key}_max`] !== undefined
      ) {
        contador++;
      }
    } else {
      if (filtros.columnas[columna.key]) {
        contador++;
      }
    }
  });

  return contador;
});

// Métodos
function obtenerValorAnidado(objeto, ruta) {
  return ruta.split(".").reduce((obj, key) => obj?.[key], objeto);
}

function toggleFiltros() {
  mostrarFiltros.value = !mostrarFiltros.value;
}

function aplicarFiltros() {
  emit("datos-filtrados", datosFiltrados.value);
}

function limpiarFiltro(tipo, key = null) {
  if (tipo === "busquedaGlobal") {
    filtros.busquedaGlobal = "";
  } else if (tipo === "columnas" && key) {
    filtros.columnas[key] = "";
  }
  aplicarFiltros();
}

function limpiarRangoFecha(key) {
  filtros.columnas[`${key}_desde`] = "";
  filtros.columnas[`${key}_hasta`] = "";
  aplicarFiltros();
}

function limpiarRangoNumerico(key) {
  filtros.columnas[`${key}_min`] = undefined;
  filtros.columnas[`${key}_max`] = undefined;
  aplicarFiltros();
}

function limpiarTodosFiltros() {
  filtros.busquedaGlobal = "";

  props.columnasFiltrables.forEach((columna) => {
    if (columna.tipo === "fecha") {
      filtros.columnas[`${columna.key}_desde`] = "";
      filtros.columnas[`${columna.key}_hasta`] = "";
    } else if (columna.tipo === "numero") {
      filtros.columnas[`${columna.key}_min`] = undefined;
      filtros.columnas[`${columna.key}_max`] = undefined;
    } else {
      filtros.columnas[columna.key] = "";
    }
  });

  filtroRapidoActivo.value = null;
  aplicarFiltros();
}

function aplicarFiltroRapido(key) {
  if (filtroRapidoActivo.value === key) {
    // Si ya está activo, desactivar
    filtroRapidoActivo.value = null;
    limpiarTodosFiltros();
  } else {
    // Activar nuevo filtro rápido
    filtroRapidoActivo.value = key;
    const filtroRapido = props.filtrosRapidos.find((f) => f.key === key);
    if (filtroRapido && filtroRapido.filtro) {
      // Aplicar la lógica del filtro rápido
      filtroRapido.filtro(filtros);
      aplicarFiltros();
    }
  }
}

// Watchers
watch(
  () => props.datos,
  () => {
    aplicarFiltros();
  },
  { immediate: true }
);
</script>

<style scoped>
.filtros-contenedor {
  margin-bottom: 1rem;
}

.panel-filtros {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.encabezado-filtros {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid #e5e7eb;
}

.encabezado-filtros h3 {
  margin: 0;
  color: #374151;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icono-filtros {
  font-size: 1.1rem;
}

.btn-toggle-filtros {
  background: transparent;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
}

.btn-toggle-filtros:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.contenido-filtros {
  padding: 1rem;
}

.filtro-busqueda-global {
  margin-bottom: 1.5rem;
}

.filtro-grupo {
  margin-bottom: 1rem;
}

.filtro-grupo label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

.filtros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.input-grupo {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-filtro {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.input-filtro:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-filtro {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
}

.fecha-rango,
.numero-rango {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-fecha,
.input-numero {
  flex: 1;
  min-width: 0;
}

.separador-fecha,
.separador-numero {
  font-size: 0.875rem;
  color: #6b7280;
  white-space: nowrap;
}

.btn-limpiar-filtro {
  background: #fee2e2;
  color: #991b1b;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s ease;
}

.btn-limpiar-filtro:hover {
  background: #fecaca;
}

.acciones-filtros {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.estadisticas-filtros {
  color: #6b7280;
  font-size: 0.875rem;
}

.filtros-activos {
  color: #3b82f6;
  font-weight: 500;
}

.botones-acciones {
  display: flex;
  gap: 0.5rem;
}

.btn-limpiar-todos,
.btn-exportar {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-limpiar-todos {
  background: white;
  color: #6b7280;
}

.btn-limpiar-todos:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-exportar {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.btn-exportar:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.filtros-rapidos {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.btn-filtro-rapido {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.btn-filtro-rapido:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-filtro-rapido.activo {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.icono-filtro-rapido {
  font-size: 1rem;
}

.contador-filtro-rapido {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.125rem 0.375rem;
  border-radius: 10px;
  font-size: 0.75rem;
}

.btn-filtro-rapido.activo .contador-filtro-rapido {
  background: rgba(255, 255, 255, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .filtros-grid {
    grid-template-columns: 1fr;
  }

  .acciones-filtros {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .botones-acciones {
    justify-content: center;
  }

  .fecha-rango,
  .numero-rango {
    flex-direction: column;
    align-items: stretch;
  }

  .separador-fecha,
  .separador-numero {
    text-align: center;
  }
}
</style>
