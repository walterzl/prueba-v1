<template>
  <div class="vista-container">
    <header class="vista-header">
      <h1>Módulo de Tarjas</h1>
      <button @click="abrirFormulario" class="btn-primario">Generar Tarja</button>
    </header>

    <div class="filtros-container">
      <span>Filtrar por tipo:</span>
      <button @click="filtrarTarjas(null)" :class="{ 'activo': filtroActivo === null }">Todas</button>
      <button @click="filtrarTarjas('CAA')" :class="{ 'activo': filtroActivo === 'CAA' }">CAA</button>
      <button @click="filtrarTarjas('BODEGA')" :class="{ 'activo': filtroActivo === 'BODEGA' }">Bodega</button>
    </div>

    <div class="tabla-container">
      <table v-if="!cargando && tarjas.length > 0">
        <thead>
          <tr>
            <th>Nro. Tarja</th>
            <th>Tipo</th>
            <th>Planta</th>
            <th>Descripción</th>
            <th>Proveedor</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tarjas" :key="item.id">
            <td>{{ item.numero_tarja }}</td>
            <td>{{ item.tipo_tarja }}</td>
            <td>{{ item.planta }}</td>
            <td>{{ item.descripcion }}</td>
            <td>{{ item.nombre_proveedor || 'N/A' }}</td>
            <td><span :class="`estado--${item.estado}`">{{ item.estado }}</span></td>
          </tr>
        </tbody>
      </table>
      <p v-if="cargando">Cargando tarjas...</p>
      <p v-if="!cargando && tarjas.length === 0">No se encontraron tarjas.</p>
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
import { servicioTarjas } from '@/servicios/servicioTarjas'

const tarjas = ref([])
const paginacion = ref({ pagina_actual: 1, total_paginas: 1 })
const cargando = ref(true)
const error = ref(null)
const filtroActivo = ref(null)

async function cargarTarjas(pagina = 1) {
  cargando.value = true
  error.value = null
  try {
    const params = { pagina: pagina, limite: 15 }
    if (filtroActivo.value) {
      params.tipo_tarja = filtroActivo.value
    }
    const datos = await servicioTarjas.obtenerTarjas(params)
    tarjas.value = datos.tarjas
    paginacion.value = datos.paginacion
  } catch (err) {
    error.value = 'No se pudo cargar las tarjas.'
    console.error(err)
  } finally {
    cargando.value = false
  }
}

function cambiarPagina(nuevaPagina) {
  if (nuevaPagina > 0 && nuevaPagina <= paginacion.value.total_paginas) {
    cargarTarjas(nuevaPagina)
  }
}

function filtrarTarjas(tipo) {
  filtroActivo.value = tipo
  cargarTarjas(1) // Resetear a la primera página al cambiar de filtro
}

function abrirFormulario() {
  alert('Funcionalidad para generar nueva tarja aún no implementada.')
}

onMounted(() => {
  cargarTarjas()
})
</script>

<style scoped>
/* Estilos compartidos */
.vista-container { padding: 1rem; }
.vista-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.filtros-container { margin-bottom: 2rem; }
.filtros-container button { margin-right: 0.5rem; padding: 0.5rem 1rem; cursor: pointer; border: 1px solid #ccc; background: #f0f0f0; }
.filtros-container button.activo { background: #007bff; color: white; border-color: #007bff; }
.btn-primario { background-color: #6f42c1; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer; }
.tabla-container { background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #ddd; }
th { background-color: #f4f4f4; }
.paginacion-container { display: flex; justify-content: center; align-items: center; margin-top: 1.5rem; }
.paginacion-container button { margin: 0 0.5rem; padding: 0.5rem 1rem; }
.estado--impresa { color: green; font-weight: bold; }
.estado--generada { color: orange; font-weight: bold; }
.estado--anulada { color: red; font-weight: bold; }
</style>
