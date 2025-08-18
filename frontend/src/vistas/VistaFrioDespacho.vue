<template>
  <div class="vista-container">
    <header class="vista-header">
      <h1>Módulo de Frío y Despacho</h1>
      <button @click="abrirFormulario" class="btn-primario">Registrar Operación</button>
    </header>

    <div class="tabla-container">
      <table v-if="!cargando && operaciones.length > 0">
        <thead>
          <tr>
            <th>Nro. Operación</th>
            <th>Tipo</th>
            <th>Planta</th>
            <th>Turno</th>
            <th>Nro. Embarque</th>
            <th>Patente Camión</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in operaciones" :key="item.id">
            <td>{{ item.numero_operacion }}</td>
            <td>{{ item.tipo_operacion }}</td>
            <td>{{ item.planta }}</td>
            <td>{{ item.turno }}</td>
            <td>{{ item.numero_embarque || 'N/A' }}</td>
            <td>{{ item.patente_camion || 'N/A' }}</td>
            <td><span :class="`estado--${item.estado}`">{{ item.estado }}</span></td>
          </tr>
        </tbody>
      </table>
      <p v-if="cargando">Cargando operaciones...</p>
      <p v-if="!cargando && operaciones.length === 0">No se encontraron operaciones de frío y despacho.</p>
    </div>

    <div v-if="paginacion.total_paginas > 1" class="paginacion-container">
      <button @click="cambiarPagina(paginacion.pagina_actual - 1)" :disabled="paginacion.pagina_actual <= 1">Anterior</button>
      <span>Página {{ paginacion.pagina_actual }} de {{ paginacion.total_paginas }}</span>
      <button @click="cambiarPagina(paginacion.pagina_actual + 1)" :disabled="paginacion.pagina_actual >= paginacion.total_paginas">Siguiente</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { servicioFrioDespacho } from '@/servicios/servicioFrioDespacho'

const operaciones = ref([])
const paginacion = ref({
  pagina_actual: 1,
  total_paginas: 1,
  total_registros: 0
})
const cargando = ref(true)
const error = ref(null)

async function cargarOperaciones(pagina = 1) {
  cargando.value = true
  error.value = null
  try {
    const params = { pagina: pagina, limite: 15 }
    const datos = await servicioFrioDespacho.obtenerOperaciones(params)
    operaciones.value = datos.operaciones
    paginacion.value = datos.paginacion
  } catch (err) {
    error.value = 'No se pudo cargar las operaciones.'
    console.error(err)
  } finally {
    cargando.value = false
  }
}

function cambiarPagina(nuevaPagina) {
  if (nuevaPagina > 0 && nuevaPagina <= paginacion.value.total_paginas) {
    cargarOperaciones(nuevaPagina)
  }
}

function abrirFormulario() {
  alert('Funcionalidad para registrar nueva operación aún no implementada.')
}

onMounted(() => {
  cargarOperaciones()
})
</script>

<style scoped>
/* Estilos compartidos */
.vista-container { padding: 1rem; }
.vista-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.btn-primario { background-color: #ffc107; color: black; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer; }
.tabla-container { background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #ddd; }
th { background-color: #f4f4f4; }
.paginacion-container { display: flex; justify-content: center; align-items: center; margin-top: 1.5rem; }
.paginacion-container button { margin: 0 0.5rem; padding: 0.5rem 1rem; }
.estado--procesada { color: green; font-weight: bold; }
.estado--pendiente { color: orange; font-weight: bold; }
.estado--cancelada { color: red; font-weight: bold; }
</style>
