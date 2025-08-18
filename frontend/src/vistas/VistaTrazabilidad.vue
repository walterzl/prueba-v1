<template>
  <div class="vista-container">
    <header class="vista-header">
      <h1>Módulo de Trazabilidad</h1>
      <button @click="abrirFormulario" class="btn-primario">Agregar Movimiento</button>
    </header>

    <div class="tabla-container">
      <table v-if="!cargando && movimientos.length > 0">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo Movimiento</th>
            <th>Planta</th>
            <th>Material</th>
            <th>Cantidad</th>
            <th>Origen</th>
            <th>Destino</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in movimientos" :key="item.id">
            <td>{{ new Date(item.fecha).toLocaleDateString() }}</td>
            <td>{{ item.tipo_movimiento }}</td>
            <td>{{ item.planta }}</td>
            <td>{{ item.material }}</td>
            <td>{{ item.cantidad }} {{ item.unidad_medida }}</td>
            <td>{{ item.ubicacion_origen?.nombre || 'N/A' }}</td>
            <td>{{ item.ubicacion_destino?.nombre || 'N/A' }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="cargando">Cargando movimientos...</p>
      <p v-if="!cargando && movimientos.length === 0">No se encontraron movimientos.</p>
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
import { servicioTrazabilidad } from '@/servicios/servicioTrazabilidad'

const movimientos = ref([])
const paginacion = ref({
  pagina_actual: 1,
  total_paginas: 1,
  total_registros: 0
})
const cargando = ref(true)
const error = ref(null)

async function cargarMovimientos(pagina = 1) {
  cargando.value = true
  error.value = null
  try {
    const params = { pagina: pagina, limite: 15 }
    const datos = await servicioTrazabilidad.obtenerMovimientos(params)
    movimientos.value = datos.movimientos
    paginacion.value = datos.paginacion
  } catch (err) {
    error.value = 'No se pudo cargar los movimientos.'
    console.error(err)
  } finally {
    cargando.value = false
  }
}

function cambiarPagina(nuevaPagina) {
  if (nuevaPagina > 0 && nuevaPagina <= paginacion.value.total_paginas) {
    cargarMovimientos(nuevaPagina)
  }
}

function abrirFormulario() {
  alert('Funcionalidad para agregar nuevo movimiento aún no implementada.')
}

onMounted(() => {
  cargarMovimientos()
})
</script>

<style scoped>
/* Estilos son compartidos/similares a VistaInventario, se pueden abstraer a un CSS global */
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
  background-color: #28a745; /* Verde para diferenciar */
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
