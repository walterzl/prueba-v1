<template>
  <div class="test-filtros">
    <h3>Prueba de Filtros</h3>

    <!-- Filtros de prueba -->
    <div class="seccion-filtros">
      <div class="contenedor-filtros">
        <div class="filtros-fila-principal">
          <CampoEntrada
            v-model="filtros.busqueda"
            etiqueta="Buscar material"
            placeholder="Código, nombre del material o lote..."
            tipo="search"
            :mostrar-etiqueta="false"
          />

          <CampoEntrada
            v-model="filtros.planta"
            etiqueta="Planta"
            tipo="select"
            :opciones="plantasDisponibles"
            :mostrar-etiqueta="false"
          />

          <CampoEntrada
            v-model="filtros.bodega"
            etiqueta="Bodega"
            tipo="select"
            :opciones="bodegasDisponibles"
            :mostrar-etiqueta="false"
          />
        </div>

        <div class="filtros-fila-secundaria">
          <CampoEntrada
            v-model="filtros.ubicacion"
            etiqueta="Ubicación"
            tipo="select"
            :opciones="ubicacionesDisponibles"
            :mostrar-etiqueta="false"
          />

          <CampoEntrada
            v-model="filtros.lote"
            etiqueta="Lote"
            placeholder="Buscar por lote..."
            tipo="text"
          />

          <CampoEntrada
            v-model="filtros.condicionArmado"
            etiqueta="Condición Armado"
            tipo="select"
            :opciones="condicionesArmadoDisponibles"
            :mostrar-etiqueta="false"
          />

          <CampoEntrada
            v-model="filtros.stockMinimo"
            etiqueta="Stock mínimo"
            placeholder="Stock mayor a..."
            tipo="number"
            minimo="0"
            paso="0.01"
          />
        </div>

        <div class="filtros-fila-tercera">
          <button
            type="button"
            class="boton boton-secundario boton-limpiar"
            @click="limpiarFiltros"
            title="Limpiar filtros"
          >
            <span class="icono-boton">🗑️</span>
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- Valores de los filtros -->
    <div class="valores-filtros">
      <h4>Valores de los Filtros:</h4>
      <pre>{{ JSON.stringify(filtros, null, 2) }}</pre>
    </div>

    <!-- Constantes disponibles -->
    <div class="constantes-disponibles">
      <h4>Constantes Disponibles:</h4>
      <p><strong>PLANTAS:</strong> {{ PLANTAS }}</p>
      <p><strong>CONDICIONES_ARMADO:</strong> {{ CONDICIONES_ARMADO }}</p>
      <p><strong>Plantas para Select:</strong> {{ plantasDisponibles }}</p>
      <p>
        <strong>Condiciones para Select:</strong>
        {{ condicionesArmadoDisponibles }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import CampoEntrada from "./CampoEntrada.vue";
import {
  PLANTAS,
  CONDICIONES_ARMADO,
  obtenerOpcionesSelect,
} from "@/utilidades/constantes";

const filtros = ref({
  busqueda: "",
  planta: "Rancagua",
  bodega: "",
  ubicacion: "",
  lote: "",
  condicionArmado: "",
  stockMinimo: "",
});

const plantasDisponibles = computed(() => obtenerOpcionesSelect(PLANTAS));
const bodegasDisponibles = computed(() => [
  { value: "BODEGA_A", label: "Bodega A" },
  { value: "BODEGA_B", label: "Bodega B" },
  { value: "BODEGA_C", label: "Bodega C" },
]);
const ubicacionesDisponibles = computed(() => [
  { value: "UBC001", label: "UBC001 - Bodega Test" },
  { value: "UBC002", label: "UBC002 - Bodega Test 2" },
]);
const condicionesArmadoDisponibles = computed(() =>
  obtenerOpcionesSelect(CONDICIONES_ARMADO)
);

function limpiarFiltros() {
  filtros.value = {
    busqueda: "",
    planta: filtros.value.planta,
    bodega: "",
    ubicacion: "",
    lote: "",
    condicionArmado: "",
    stockMinimo: "",
  };
}
</script>

<style scoped>
.test-filtros {
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 1rem;
}

.test-filtros h3 {
  margin-bottom: 1.5rem;
  color: #0f172a;
}

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

.filtros-fila-principal {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1rem;
}

.filtros-fila-secundaria {
  display: grid;
  grid-template-columns: auto auto auto auto;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1rem;
}

.filtros-fila-tercera {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  align-items: end;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

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
}

.boton-secundario {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.boton-secundario:hover {
  background: #f9fafb;
  border-color: #9ca3af;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.icono-boton {
  font-size: 1rem;
  line-height: 1;
}

.valores-filtros,
.constantes-disponibles {
  margin-top: 2rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.valores-filtros h4,
.constantes-disponibles h4 {
  margin-bottom: 1rem;
  color: #374151;
}

.valores-filtros pre {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-size: 0.875rem;
}

.constantes-disponibles p {
  margin: 0.5rem 0;
  color: #374151;
}
</style>
