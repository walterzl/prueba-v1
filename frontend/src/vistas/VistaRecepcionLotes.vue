<template>
  <div class="vista-container">
    <header class="vista-header">
      <h1>Módulo de Recepción de Lotes</h1>
      <button @click="abrirFormulario" class="btn-primario">Registrar Recepción</button>
    </header>

    <div class="tabla-container">
      <table v-if="!cargando && recepciones.length > 0">
        <thead>
          <tr>
            <th>Nro. Recepción</th>
            <th>Planta</th>
            <th>Proveedor</th>
            <th>Material</th>
            <th>Lote</th>
            <th>Cantidad</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in recepciones" :key="item.id">
            <td>{{ item.numero_recepcion }}</td>
            <td>{{ item.planta }}</td>
            <td>{{ item.nombre_proveedor }}</td>
            <td>{{ item.codigo_material }}</td>
            <td>{{ item.lote }}</td>
            <td>{{ item.cantidad_total }}</td>
            <td><span :class="`estado--${item.estado}`">{{ item.estado }}</span></td>
          </tr>
        </tbody>
      </table>
      <p v-if="cargando">Cargando recepciones...</p>
      <p v-if="!cargando && recepciones.length === 0">No se encontraron recepciones de lotes.</p>
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
import { servicioRecepcionLotes } from '@/servicios/servicioRecepcionLotes'

const recepciones = ref([])
const paginacion = ref({
  pagina_actual: 1,
  total_paginas: 1,
  total_registros: 0
})
const cargando = ref(true)
const error = ref(null)

async function cargarRecepciones(pagina = 1) {
  cargando.value = true
  error.value = null
  try {
    const params = { pagina: pagina, limite: 15 }
    // Asumiendo que la API devuelve un objeto con { recepciones, paginacion }
    const datos = await servicioRecepcionLotes.obtenerRecepciones(params)
    recepciones.value = datos.recepciones
    paginacion.value = datos.paginacion
  } catch (err) {
    error.value = 'No se pudo cargar las recepciones.'
    console.error(err)
  } finally {
    cargando.value = false
  }
}

function cambiarPagina(nuevaPagina) {
  if (nuevaPagina > 0 && nuevaPagina <= paginacion.value.total_paginas) {
    cargarRecepciones(nuevaPagina)
  }
}

function abrirFormulario() {
  alert('Funcionalidad para registrar nueva recepción aún no implementada.')
}

onMounted(() => {
  cargarRecepciones()
})
</script>

<style scoped>
/* Estilos compartidos con los otros módulos */
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
  background-color: #17a2b8; /* Cian para diferenciar */
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
.estado--procesada {
  color: green;
  font-weight: bold;
}
.estado--pendiente {
  color: orange;
  font-weight: bold;
}
.estado--cancelada {
  color: red;
  font-weight: bold;
}
</style>
