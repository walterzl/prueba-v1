<template>
  <div class="vista-container">
    <header class="vista-header">
      <h1>Módulo de Inventario</h1>
      <button @click="abrirFormulario" class="btn-primario">Registrar Inventario</button>
    </header>

    <!-- Aquí irían los filtros -->

    <div class="tabla-container">
      <table v-if="!cargando && inventario.length > 0">
        <thead>
          <tr>
            <th>Planta</th>
            <th>Material</th>
            <th>Ubicación</th>
            <th>Lote</th>
            <th>Stock</th>
            <th>Contado Por</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in inventario" :key="item.id">
            <td>{{ item.planta }}</td>
            <td>{{ item.nombre_material }} ({{ item.codigo_material }})</td>
            <td>{{ item.ubicacion }}</td>
            <td>{{ item.lote }}</td>
            <td>{{ item.stock }} {{ item.unidad_medida }}</td>
            <td>{{ item.contado_por }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="cargando">Cargando inventario...</p>
      <p v-if="!cargando && inventario.length === 0">No se encontraron registros de inventario.</p>
    </div>

    <div v-if="paginacion.total_paginas > 1" class="paginacion-container">
      <button @click="cambiarPagina(paginacion.pagina_actual - 1)" :disabled="paginacion.pagina_actual <= 1">Anterior</button>
      <span>Página {{ paginacion.pagina_actual }} de {{ paginacion.total_paginas }}</span>
      <button @click="cambiarPagina(paginacion.pagina_actual + 1)" :disabled="paginacion.pagina_actual >= paginacion.total_paginas">Siguiente</button>
    </div>

    <!-- El formulario modal se podría agregar aquí -->

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { servicioInventario } from '@/servicios/servicioInventario'

const inventario = ref([])
const paginacion = ref({
  pagina_actual: 1,
  total_paginas: 1,
  total_registros: 0
})
const cargando = ref(true)
const error = ref(null)

async function cargarInventario(pagina = 1) {
  cargando.value = true
  error.value = null
  try {
    const params = { pagina: pagina, limite: 15 } // Límite de 15 por página
    const datos = await servicioInventario.obtenerInventario(params)
    inventario.value = datos.inventario
    paginacion.value = datos.paginacion
  } catch (err) {
    error.value = 'No se pudo cargar el inventario.'
    console.error(err)
  } finally {
    cargando.value = false
  }
}

function cambiarPagina(nuevaPagina) {
  if (nuevaPagina > 0 && nuevaPagina <= paginacion.value.total_paginas) {
    cargarInventario(nuevaPagina)
  }
}

function abrirFormulario() {
  // Lógica para mostrar un modal o navegar a otra vista
  alert('Funcionalidad para registrar nuevo inventario aún no implementada.')
}

onMounted(() => {
  cargarInventario()
})
</script>

<style scoped>
.vista-container {
  padding: 1rem;
}
.vista-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.btn-primario {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}
.tabla-container {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
th {
  background-color: #f4f4f4;
}
.paginacion-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
}
.paginacion-container button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
}
</style>
