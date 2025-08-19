<template>
  <div class="tabla-inventario-contenedor">
    <!-- Estado de carga -->
    <div v-if="cargando" class="estado-carga">
      <div class="spinner"></div>
      <p>Cargando inventario...</p>
    </div>

    <!-- Tabla con datos -->
    <div v-else-if="inventario.length > 0" class="tabla-scroll">
      <table class="tabla-inventario">
        <thead>
          <tr>
            <th class="col-id">ID</th>
            <th class="col-planta">Planta</th>
            <th class="col-material">Material</th>
            <th class="col-unidad">Unidad</th>
            <th class="col-cod-nombre">Cod. Nombre</th>
            <th class="col-ubicacion">Ubicación</th>
            <th class="col-lote">Lote</th>
            <th class="col-stock">Stock</th>
            <th class="col-pallets">Pallets</th>
            <th class="col-condicion">Condición</th>
            <th class="col-fecha">Fecha Inventario</th>
            <th class="col-responsable">Contado Por</th>
            <th class="col-creacion">Fecha Creación</th>
            <th class="col-actualizacion">Fecha Actualización</th>
            <th class="col-material-completo">Material Completo</th>
            <th class="col-ubicacion-completa">Ubicación Completa</th>
            <th class="col-acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in inventario" :key="item.id" class="fila-inventario">
            <!-- ID -->
            <td class="col-id">
              <span class="id-numero">{{ item.id }}</span>
            </td>

            <!-- Planta -->
            <td class="col-planta">
              <span
                class="planta-badge"
                :class="obtenerClasePlanta(item.planta)"
              >
                {{ item.planta }}
              </span>
            </td>

            <!-- Material -->
            <td class="col-material">
              <div class="info-material">
                <span class="codigo-material">{{ item.codigo_material }}</span>
                <span class="nombre-material">{{
                  item.nombre_material || "Sin nombre"
                }}</span>
              </div>
            </td>

            <!-- Unidad de Medida -->
            <td class="col-unidad">
              <span class="unidad-texto">{{
                item.unidad_medida || "N/A"
              }}</span>
            </td>

            <!-- Código Nombre -->
            <td class="col-cod-nombre">
              <span class="cod-nombre-texto">{{
                item.cod_nombre || "N/A"
              }}</span>
            </td>

            <!-- Ubicación -->
            <td class="col-ubicacion">
              <div class="info-ubicacion">
                <span class="nombre-ubicacion">{{
                  item.ubicacion || "N/A"
                }}</span>
                <span class="bodega-deposito">{{ item.bodega || "N/A" }}</span>
              </div>
            </td>

            <!-- Lote -->
            <td class="col-lote">
              <span class="lote-codigo">{{ item.lote || "N/A" }}</span>
            </td>

            <!-- Stock -->
            <td class="col-stock">
              <div class="stock-info">
                <span class="valor-stock">{{
                  formatearCantidad(item.stock)
                }}</span>
                <span class="unidad-medida">{{
                  item.unidad_medida || "UN"
                }}</span>
              </div>
            </td>

            <!-- Pallets -->
            <td class="col-pallets">
              <div class="stock-info">
                <span class="valor-stock">{{
                  formatearCantidad(item.pallets)
                }}</span>
              </div>
            </td>

            <!-- Condición de Armado -->
            <td class="col-condicion">
              <span class="condicion-texto">{{
                item.condicion_armado || "N/A"
              }}</span>
            </td>

            <!-- Fecha Inventario -->
            <td class="col-fecha">
              <div class="fecha-conteo">
                <span class="fecha-principal">{{
                  formatearFecha(item.fecha_inventario)
                }}</span>
                <span class="hora">{{
                  formatearHora(item.fecha_inventario)
                }}</span>
              </div>
            </td>

            <!-- Contado Por -->
            <td class="col-responsable">
              <div class="responsable-info">
                <span class="nombre-responsable">{{
                  item.contado_por || "N/A"
                }}</span>
              </div>
            </td>

            <!-- Fecha Creación -->
            <td class="col-creacion">
              <div class="fecha-conteo">
                <span class="fecha-principal">{{
                  formatearFecha(item.fecha_creacion)
                }}</span>
                <span class="hora">{{
                  formatearHora(item.fecha_creacion)
                }}</span>
              </div>
            </td>

            <!-- Fecha Actualización -->
            <td class="col-actualizacion">
              <div class="fecha-conteo">
                <span class="fecha-principal">{{
                  formatearFecha(item.fecha_actualizacion)
                }}</span>
                <span class="hora">{{
                  formatearHora(item.fecha_actualizacion)
                }}</span>
              </div>
            </td>

            <!-- Material Completo -->
            <td class="col-material-completo">
              <div class="material-completo-info" v-if="item.material_completo">
                <span class="codigo-ranco">{{
                  item.material_completo.codigo_ranco
                }}</span>
                <span class="nombre-completo">{{
                  item.material_completo.nombre_material
                }}</span>
                <span class="unidad-completa">{{
                  item.material_completo.unidad_medida
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Ubicación Completa -->
            <td class="col-ubicacion-completa">
              <div
                class="ubicacion-completa-info"
                v-if="item.ubicacion_completa"
              >
                <span class="title-ubicacion">{{
                  item.ubicacion_completa.title
                }}</span>
                <span class="bodega-deposito-completa">{{
                  item.ubicacion_completa.bodega_deposito
                }}</span>
                <span class="planta-completa">{{
                  item.ubicacion_completa.planta
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Acciones -->
            <td class="col-acciones">
              <div class="acciones-grupo">
                <button
                  type="button"
                  class="btn-accion btn-contar"
                  @click="$emit('contar', item)"
                  title="Realizar conteo"
                  :disabled="!puedeContar(item)"
                >
                  📊
                </button>
                <button
                  type="button"
                  class="btn-accion btn-ajustar"
                  @click="$emit('ajustar-stock', item)"
                  title="Ajustar stock"
                  :disabled="!puedeAjustar(item)"
                >
                  ⚖️
                </button>
                <button
                  type="button"
                  class="btn-accion btn-historial"
                  @click="$emit('ver-historial', item)"
                  title="Ver historial"
                >
                  📋
                </button>
                <button
                  type="button"
                  class="btn-accion btn-imprimir"
                  @click="$emit('imprimir-etiqueta', item)"
                  title="Imprimir etiqueta"
                >
                  🖨️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Estado vacío -->
    <div v-else class="estado-vacio">
      <div class="icono-vacio">📦</div>
      <h3>No hay registros de inventario</h3>
      <p>{{ obtenerMensajeVacio() }}</p>
      <button
        v-if="!tieneActivosFiltros"
        type="button"
        class="btn-primario"
        @click="$emit('crear-registro')"
      >
        <span class="icono-btn">➕</span>
        Iniciar Inventario
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

// Props
const props = defineProps({
  inventario: {
    type: Array,
    default: () => [],
  },
  cargando: {
    type: Boolean,
    default: false,
  },
  tieneActivosFiltros: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits([
  "contar",
  "ajustar-stock",
  "ver-historial",
  "imprimir-etiqueta",
  "crear-registro",
]);

// Métodos de formateo
function formatearCantidad(cantidad) {
  if (cantidad === null || cantidad === undefined) return "0";
  return parseFloat(cantidad).toLocaleString("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function formatearFecha(fecha) {
  if (!fecha) return "N/A";
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatearHora(fecha) {
  if (!fecha) return "";
  return new Date(fecha).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function obtenerClasePlanta(planta) {
  if (!planta) return "default";

  const plantaNormalizada = planta.toLowerCase().trim();
  const mapasPlantas = {
    rancagua: "rancagua",
    "san fernando": "san-fernando",
    linares: "linares",
  };
  return mapasPlantas[plantaNormalizada] || "default";
}

function puedeContar(item) {
  return true; // Siempre permitir contar por ahora
}

function puedeAjustar(item) {
  return true; // Siempre permitir ajustar por ahora
}

function obtenerMensajeVacio() {
  if (props.tieneActivosFiltros) {
    return "No se encontraron registros de inventario que coincidan con los filtros aplicados.";
  }
  return "Comience registrando el primer inventario del sistema.";
}
</script>

<style scoped>
.tabla-inventario-contenedor {
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.estado-carga {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.tabla-scroll {
  overflow-x: auto;
  max-width: 100%;
}

.tabla-inventario {
  width: 100%;
  min-width: 2200px; /* Ancho mínimo para mostrar todas las columnas */
  border-collapse: collapse;
  font-size: 0.875rem;
}

.tabla-inventario thead {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  position: sticky;
  top: 0;
  z-index: 10;
}

.tabla-inventario th {
  padding: 10px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #d1fae5;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.tabla-inventario td {
  padding: 10px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.fila-inventario:hover {
  background-color: #f0fdf4;
}

/* Anchos específicos para cada columna */
.col-id {
  width: 60px;
  min-width: 60px;
}
.col-planta {
  width: 100px;
  min-width: 100px;
}
.col-material {
  width: 150px;
  min-width: 150px;
}
.col-unidad {
  width: 80px;
  min-width: 80px;
}
.col-cod-nombre {
  width: 200px;
  min-width: 200px;
}
.col-ubicacion {
  width: 120px;
  min-width: 120px;
}
.col-lote {
  width: 120px;
  min-width: 120px;
}
.col-stock {
  width: 120px;
  min-width: 120px;
}
.col-pallets {
  width: 100px;
  min-width: 100px;
}
.col-condicion {
  width: 120px;
  min-width: 120px;
}
.col-fecha {
  width: 130px;
  min-width: 130px;
}
.col-creacion {
  width: 130px;
  min-width: 130px;
}
.col-actualizacion {
  width: 130px;
  min-width: 130px;
}
.col-material-completo {
  width: 200px;
  min-width: 200px;
}
.col-ubicacion-completa {
  width: 180px;
  min-width: 180px;
}
.col-responsable {
  width: 140px;
  min-width: 140px;
}
.col-acciones {
  width: 160px;
  min-width: 160px;
}

/* Estilos de contenido */
.planta-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.planta-badge.rancagua {
  background: #dbeafe;
  color: #1e40af;
}
.planta-badge.san-fernando {
  background: #fef3c7;
  color: #92400e;
}
.planta-badge.linares {
  background: #e0e7ff;
  color: #3730a3;
}
.planta-badge.default {
  background: #f3f4f6;
  color: #374151;
}

.info-material {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.codigo-material {
  font-weight: 600;
  color: #1f2937;
  font-family: "Courier New", monospace;
}

.nombre-material {
  font-size: 0.75rem;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px;
}

.clasificacion {
  font-size: 0.7rem;
  color: #9ca3af;
  font-style: italic;
}

.info-ubicacion {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.nombre-ubicacion {
  font-weight: 500;
  color: #1f2937;
}

.bodega-deposito {
  font-size: 0.75rem;
  color: #6b7280;
}

.lote-codigo {
  font-weight: 500;
  color: #1f2937;
  font-family: "Courier New", monospace;
}

.id-numero {
  font-weight: 600;
  color: #6b7280;
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
}

.condicion-texto {
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
}

.unidad-texto {
  font-weight: 600;
  color: #059669;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.cod-nombre-texto {
  font-size: 0.75rem;
  color: #374151;
  line-height: 1.3;
}

.material-completo-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.codigo-ranco {
  font-weight: 600;
  color: #1f2937;
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
}

.nombre-completo {
  font-size: 0.7rem;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unidad-completa {
  font-size: 0.7rem;
  color: #059669;
  font-weight: 500;
}

.ubicacion-completa-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.title-ubicacion {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.75rem;
}

.bodega-deposito-completa {
  font-size: 0.7rem;
  color: #6b7280;
}

.planta-completa {
  font-size: 0.7rem;
  color: #9ca3af;
  font-style: italic;
}

.no-data {
  color: #9ca3af;
  font-style: italic;
  font-size: 0.75rem;
}

.stock-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
}

.valor-stock {
  font-weight: 600;
  color: #1f2937;
}

.valor-stock.stock-exceso {
  color: #059669;
}
.valor-stock.stock-faltante {
  color: #dc2626;
}
.valor-stock.stock-correcto {
  color: #1f2937;
}

.unidad-medida {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
}

.diferencia-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
}

.valor-diferencia {
  font-weight: 600;
  font-size: 0.875rem;
}

.porcentaje-diferencia {
  font-size: 0.75rem;
  font-weight: 500;
}

.diferencia-positiva {
  color: #059669;
}
.diferencia-negativa {
  color: #dc2626;
}
.diferencia-neutral {
  color: #6b7280;
}

.fecha-conteo {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.fecha-principal {
  font-weight: 500;
  color: #1f2937;
}

.hora {
  font-size: 0.75rem;
  color: #6b7280;
}

.responsable-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.nombre-responsable {
  font-weight: 500;
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 120px;
}

.turno {
  font-size: 0.75rem;
  color: #6b7280;
}

.badge-estado {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  white-space: nowrap;
}

.badge-pendiente {
  background: #fef3c7;
  color: #92400e;
}
.badge-proceso {
  background: #dbeafe;
  color: #1e40af;
}
.badge-completado {
  background: #dcfce7;
  color: #166534;
}
.badge-revisado {
  background: #e0e7ff;
  color: #3730a3;
}
.badge-ajustado {
  background: #f3e8ff;
  color: #7c2d12;
}
.badge-neutral {
  background: #f3f4f6;
  color: #374151;
}

.acciones-grupo {
  display: flex;
  gap: 0.25rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-accion {
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-accion:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-contar {
  background: #dcfce7;
  color: #166534;
}

.btn-contar:hover:not(:disabled) {
  background: #bbf7d0;
  color: #14532d;
}

.btn-ajustar {
  background: #fef3c7;
  color: #92400e;
}

.btn-ajustar:hover:not(:disabled) {
  background: #fde68a;
  color: #78350f;
}

.btn-historial {
  background: #e0e7ff;
  color: #3730a3;
}

.btn-historial:hover {
  background: #c7d2fe;
  color: #312e81;
}

.btn-imprimir {
  background: #dbeafe;
  color: #1e40af;
}

.btn-imprimir:hover {
  background: #bfdbfe;
  color: #1e3a8a;
}

.estado-vacio {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.icono-vacio {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.estado-vacio h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.estado-vacio p {
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.btn-primario {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primario:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
}

.icono-btn {
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 1200px) {
  .tabla-scroll {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }
}

@media (max-width: 768px) {
  .tabla-inventario {
    font-size: 0.8rem;
  }

  .tabla-inventario th,
  .tabla-inventario td {
    padding: 0.5rem 0.375rem;
  }

  .nombre-material {
    max-width: 140px;
  }

  .nombre-responsable {
    max-width: 100px;
  }

  .acciones-grupo {
    gap: 0.125rem;
  }

  .btn-accion {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.75rem;
  }
}
</style>
