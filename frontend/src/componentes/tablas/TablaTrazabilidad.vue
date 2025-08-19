<template>
  <div class="tabla-trazabilidad-contenedor">
    <!-- Estado de carga -->
    <div v-if="cargando" class="estado-carga">
      <div class="spinner"></div>
      <p>Cargando movimientos de trazabilidad...</p>
    </div>

    <!-- Tabla con datos -->
    <div v-else-if="movimientos.length > 0" class="tabla-scroll">
      <table class="tabla-trazabilidad">
        <thead>
          <tr>
            <th class="col-id">ID</th>
            <th class="col-fecha">Fecha</th>
            <th class="col-mes">Mes</th>
            <th class="col-tipo">Tipo Movimiento</th>
            <th class="col-planta">Planta</th>
            <th class="col-guia">Guía SII</th>
            <th class="col-id-movimiento">ID Movimiento</th>
            <th class="col-material">Material</th>
            <th class="col-cod-nombre">Cod. Nombre</th>
            <th class="col-clasificacion">Clasificación</th>
            <th class="col-lote">Lote</th>
            <th class="col-cantidad">Cantidad</th>
            <th class="col-pallets">Pallets</th>
            <th class="col-unidad">Unidad</th>
            <th class="col-ubicacion-origen">Ubicación Origen</th>
            <th class="col-ubicacion-destino">Ubicación Destino</th>
            <th class="col-turno">Turno</th>
            <th class="col-observacion">Observación</th>
            <th class="col-stock">Stock Info</th>
            <th class="col-embarque">Embarque</th>
            <th class="col-patente">Patente</th>
            <th class="col-fechas">Fechas Sistema</th>
            <th class="col-material-completo">Material Completo</th>
            <th class="col-ubicaciones-completas">Ubicaciones Completas</th>
            <th class="col-acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="movimiento in movimientos"
            :key="movimiento.id"
            class="fila-movimiento"
          >
            <!-- ID -->
            <td class="col-id">
              <span class="id-numero">{{ movimiento.id }}</span>
            </td>

            <!-- Fecha -->
            <td class="col-fecha">
              <div class="fecha-completa">
                <span class="fecha-principal">{{
                  formatearFecha(movimiento.fecha)
                }}</span>
                <span class="hora">{{ formatearHora(movimiento.fecha) }}</span>
              </div>
            </td>

            <!-- Mes -->
            <td class="col-mes">
              <span class="mes-texto">{{ movimiento.mes || "N/A" }}</span>
            </td>

            <!-- Tipo de Movimiento -->
            <td class="col-tipo">
              <span
                class="badge-tipo"
                :class="obtenerClaseTipo(movimiento.tipo_movimiento)"
              >
                {{ movimiento.tipo_movimiento }}
              </span>
            </td>

            <!-- Planta -->
            <td class="col-planta">
              <span class="planta-nombre">{{
                movimiento.planta || "N/A"
              }}</span>
            </td>

            <!-- Guía SII -->
            <td class="col-guia">
              <span class="guia-numero">{{
                movimiento.guia_sii || "N/A"
              }}</span>
            </td>

            <!-- ID Movimiento -->
            <td class="col-id-movimiento">
              <span class="id-movimiento-codigo">{{
                movimiento.id_movimiento || "N/A"
              }}</span>
            </td>

            <!-- Material -->
            <td class="col-material">
              <div class="info-material">
                <span class="codigo-material">{{
                  movimiento.codigo_material
                }}</span>
                <span class="nombre-material">{{
                  movimiento.nombre_material || "Sin nombre"
                }}</span>
              </div>
            </td>

            <!-- Cod. Nombre -->
            <td class="col-cod-nombre">
              <span class="cod-nombre-texto">{{
                movimiento.cod_nombre || "N/A"
              }}</span>
            </td>

            <!-- Clasificación -->
            <td class="col-clasificacion">
              <span class="clasificacion-texto">{{
                movimiento.clasificacion || "N/A"
              }}</span>
            </td>

            <!-- Lote -->
            <td class="col-lote">
              <span class="lote-codigo">{{ movimiento.lote || "N/A" }}</span>
            </td>

            <!-- Cantidad -->
            <td class="col-cantidad">
              <div class="cantidad-info">
                <span class="valor-cantidad">{{
                  formatearCantidad(movimiento.cantidad)
                }}</span>
              </div>
            </td>

            <!-- Total Pallets -->
            <td class="col-pallets">
              <span class="pallets-numero">{{
                formatearCantidad(movimiento.total_pallet)
              }}</span>
            </td>

            <!-- Unidad de Medida -->
            <td class="col-unidad">
              <span class="unidad-texto">{{
                movimiento.unidad_medida || "N/A"
              }}</span>
            </td>

            <!-- Ubicación Origen -->
            <td class="col-ubicacion-origen">
              <div class="ubicacion-info">
                <span class="ubicacion-nombre">{{
                  movimiento.ubicacion_origen || "N/A"
                }}</span>
                <span class="bodega-info">{{
                  movimiento.bodega_origen || "N/A"
                }}</span>
              </div>
            </td>

            <!-- Ubicación Destino -->
            <td class="col-ubicacion-destino">
              <div class="ubicacion-info">
                <span class="ubicacion-nombre">{{
                  movimiento.ubicacion_destino || "N/A"
                }}</span>
                <span class="bodega-info">{{
                  movimiento.bodega_destino || "N/A"
                }}</span>
              </div>
            </td>

            <!-- Turno -->
            <td class="col-turno">
              <span class="turno-info">{{ movimiento.turno || "N/A" }}</span>
            </td>

            <!-- Observación -->
            <td class="col-observacion">
              <span class="observacion-texto">{{
                movimiento.observacion || "N/A"
              }}</span>
            </td>

            <!-- Stock Info -->
            <td class="col-stock">
              <div class="stock-info">
                <span class="bodega-stock">{{
                  movimiento.bodega_stock || "N/A"
                }}</span>
                <span class="ubicacion-stock">{{
                  movimiento.ubicacion_stock || "N/A"
                }}</span>
                <span class="total-stock">{{
                  formatearCantidad(movimiento.total_stock)
                }}</span>
              </div>
            </td>

            <!-- Embarque -->
            <td class="col-embarque">
              <span class="numero-embarque">{{
                movimiento.numero_embarque || "N/A"
              }}</span>
            </td>

            <!-- Patente -->
            <td class="col-patente">
              <span class="patente-camion">{{
                movimiento.patente_camion || "N/A"
              }}</span>
            </td>

            <!-- Fechas Sistema -->
            <td class="col-fechas">
              <div class="fechas-sistema">
                <span class="fecha-creacion"
                  >Creado: {{ formatearFecha(movimiento.fecha_creacion) }}</span
                >
                <span class="fecha-actualizacion"
                  >Actualizado:
                  {{ formatearFecha(movimiento.fecha_actualizacion) }}</span
                >
              </div>
            </td>

            <!-- Material Completo -->
            <td class="col-material-completo">
              <div
                class="material-completo-info"
                v-if="movimiento.material_completo"
              >
                <span class="codigo-ranco">{{
                  movimiento.material_completo.codigo_ranco
                }}</span>
                <span class="nombre-completo">{{
                  movimiento.material_completo.nombre_material
                }}</span>
                <span class="unidad-completa">{{
                  movimiento.material_completo.unidad_medida
                }}</span>
                <span class="clasificacion-completa">{{
                  movimiento.material_completo.clasificacion
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Ubicaciones Completas -->
            <td class="col-ubicaciones-completas">
              <div class="ubicaciones-completas-info">
                <div
                  v-if="movimiento.ubicacion_origen_completa"
                  class="ubicacion-origen-completa"
                >
                  <strong>Origen:</strong>
                  <span>{{ movimiento.ubicacion_origen_completa.title }}</span>
                  <span>{{
                    movimiento.ubicacion_origen_completa.bodega_deposito
                  }}</span>
                </div>
                <div
                  v-if="movimiento.ubicacion_destino_completa"
                  class="ubicacion-destino-completa"
                >
                  <strong>Destino:</strong>
                  <span>{{ movimiento.ubicacion_destino_completa.title }}</span>
                  <span>{{
                    movimiento.ubicacion_destino_completa.bodega_deposito
                  }}</span>
                </div>
                <span
                  v-if="
                    !movimiento.ubicacion_origen_completa &&
                    !movimiento.ubicacion_destino_completa
                  "
                  class="no-data"
                  >N/A</span
                >
              </div>
            </td>

            <!-- Acciones -->
            <td class="col-acciones">
              <div class="acciones-grupo">
                <button
                  type="button"
                  class="btn-accion btn-ver"
                  @click="$emit('ver-detalle', movimiento)"
                  title="Ver detalle completo"
                >
                  👁️
                </button>
                <button
                  v-if="puedeEditar(movimiento)"
                  type="button"
                  class="btn-accion btn-editar"
                  @click="$emit('editar', movimiento)"
                  title="Editar movimiento"
                >
                  ✏️
                </button>
                <button
                  type="button"
                  class="btn-accion btn-imprimir"
                  @click="$emit('imprimir', movimiento)"
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
      <h3>No hay movimientos de trazabilidad</h3>
      <p>{{ obtenerMensajeVacio() }}</p>
      <button
        v-if="!tieneActivosFiltros"
        type="button"
        class="btn-primario"
        @click="$emit('crear-movimiento')"
      >
        <span class="icono-btn">➕</span>
        Crear Primer Movimiento
      </button>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  movimientos: {
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
    validator: (value) => typeof value === "boolean",
  },
});

// Emits
defineEmits(["ver-detalle", "editar", "imprimir", "crear-movimiento"]);

// Métodos de formateo
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

function formatearCantidad(cantidad) {
  if (!cantidad) return "0";
  return parseFloat(cantidad).toLocaleString("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function puedeEditar(movimiento) {
  // Lógica para determinar si el movimiento puede ser editado
  // Por ejemplo, solo movimientos recientes o con cierto estado
  return movimiento && movimiento.estado !== "completado";
}

function obtenerClaseTipo(tipoMovimiento) {
  const mapaTipos = {
    ENTRADA: "entrada",
    SALIDA: "salida",
    TRASLADO: "traslado",
    AJUSTE: "ajuste",
    CONSUMO: "consumo",
    PRODUCCION: "produccion",
  };
  return mapaTipos[tipoMovimiento?.toUpperCase()] || "neutral";
}

function obtenerMensajeVacio() {
  if (props.tieneActivosFiltros) {
    return "No se encontraron movimientos que coincidan con los filtros aplicados.";
  }
  return "Comience registrando el primer movimiento de trazabilidad del sistema.";
}
</script>

<style scoped>
.tabla-trazabilidad-contenedor {
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
  border-top: 3px solid #3b82f6;
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

.tabla-trazabilidad {
  width: 100%;
  min-width: 3000px; /* Ancho mínimo para mostrar todas las columnas */
  border-collapse: collapse;
  font-size: 0.875rem;
}

.tabla-trazabilidad thead {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: sticky;
  top: 0;
  z-index: 10;
}

.tabla-trazabilidad th {
  padding: 10px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e2e8f0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.tabla-trazabilidad td {
  padding: 10px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.fila-movimiento:hover {
  background-color: #f8fafc;
}

/* Anchos específicos para cada columna */
.col-id {
  width: 60px;
  min-width: 60px;
}
.col-fecha {
  width: 120px;
  min-width: 120px;
}
.col-mes {
  width: 80px;
  min-width: 80px;
}
.col-tipo {
  width: 120px;
  min-width: 120px;
}
.col-planta {
  width: 90px;
  min-width: 90px;
}
.col-guia {
  width: 100px;
  min-width: 100px;
}
.col-id-movimiento {
  width: 200px;
  min-width: 200px;
}
.col-material {
  width: 150px;
  min-width: 150px;
}
.col-cod-nombre {
  width: 150px;
  min-width: 150px;
}
.col-clasificacion {
  width: 120px;
  min-width: 120px;
}
.col-lote {
  width: 150px;
  min-width: 150px;
}
.col-cantidad {
  width: 100px;
  min-width: 100px;
}
.col-pallets {
  width: 80px;
  min-width: 80px;
}
.col-unidad {
  width: 80px;
  min-width: 80px;
}
.col-ubicacion-origen {
  width: 140px;
  min-width: 140px;
}
.col-ubicacion-destino {
  width: 140px;
  min-width: 140px;
}
.col-turno {
  width: 80px;
  min-width: 80px;
}
.col-observacion {
  width: 150px;
  min-width: 150px;
}
.col-stock {
  width: 120px;
  min-width: 120px;
}
.col-embarque {
  width: 120px;
  min-width: 120px;
}
.col-patente {
  width: 100px;
  min-width: 100px;
}
.col-fechas {
  width: 180px;
  min-width: 180px;
}
.col-material-completo {
  width: 200px;
  min-width: 200px;
}
.col-ubicaciones-completas {
  width: 220px;
  min-width: 220px;
}
.col-acciones {
  width: 120px;
  min-width: 120px;
}

/* Estilos de contenido */
.fecha-completa {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.fecha-principal {
  font-weight: 600;
  color: #1f2937;
}

.hora {
  font-size: 0.75rem;
  color: #6b7280;
}

.badge-tipo {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  white-space: nowrap;
}

.badge-entrada {
  background: #dcfce7;
  color: #166534;
}
.badge-salida {
  background: #fee2e2;
  color: #991b1b;
}
.badge-traslado {
  background: #dbeafe;
  color: #1e40af;
}
.badge-ajuste {
  background: #fef3c7;
  color: #92400e;
}
.badge-consumo {
  background: #e0e7ff;
  color: #3730a3;
}
.badge-produccion {
  background: #f3e8ff;
  color: #7c2d12;
}
.badge-neutral {
  background: #f3f4f6;
  color: #374151;
}

.planta-nombre {
  font-weight: 500;
  color: #1f2937;
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
  max-width: 160px;
}

.lote-codigo {
  font-weight: 500;
  color: #1f2937;
  font-family: "Courier New", monospace;
}

.cantidad-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
}

.valor-cantidad {
  font-weight: 600;
  color: #1f2937;
}

.unidad-medida {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
}

.proveedor-nombre {
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 120px;
  display: block;
}

.ubicacion-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.ubicacion-nombre {
  font-weight: 500;
  color: #1f2937;
}

.bodega-info {
  font-size: 0.75rem;
  color: #6b7280;
}

.turno-info,
.temporada-info {
  color: #1f2937;
}

.acciones-grupo {
  display: flex;
  gap: 0.25rem;
  justify-content: center;
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

.btn-ver {
  background: #f3f4f6;
  color: #374151;
}

.btn-ver:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.btn-editar {
  background: #fef3c7;
  color: #92400e;
}

.btn-editar:hover {
  background: #fde68a;
  color: #78350f;
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
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primario:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.icono-btn {
  font-size: 1rem;
}

/* Estilos para nuevos campos */
.id-numero {
  font-weight: 600;
  color: #6b7280;
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
}

.mes-texto {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: capitalize;
}

.guia-numero {
  font-weight: 500;
  color: #1f2937;
  font-family: "Courier New", monospace;
}

.id-movimiento-codigo {
  font-weight: 500;
  color: #1f2937;
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
}

.cod-nombre-texto {
  font-size: 0.75rem;
  color: #374151;
  line-height: 1.3;
}

.clasificacion-texto {
  font-size: 0.75rem;
  color: #059669;
  font-weight: 500;
  text-transform: uppercase;
}

.pallets-numero {
  font-weight: 600;
  color: #1f2937;
}

.unidad-texto {
  font-weight: 600;
  color: #059669;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.observacion-texto {
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
}

.stock-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.bodega-stock,
.ubicacion-stock,
.total-stock {
  font-size: 0.7rem;
  color: #6b7280;
}

.numero-embarque,
.patente-camion {
  font-weight: 500;
  color: #1f2937;
  font-family: "Courier New", monospace;
}

.fechas-sistema {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.fecha-creacion,
.fecha-actualizacion {
  font-size: 0.7rem;
  color: #6b7280;
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

.unidad-completa,
.clasificacion-completa {
  font-size: 0.7rem;
  color: #059669;
  font-weight: 500;
}

.ubicaciones-completas-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ubicacion-origen-completa,
.ubicacion-destino-completa {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.25rem;
  background: #f9fafb;
  border-radius: 4px;
}

.ubicacion-origen-completa strong,
.ubicacion-destino-completa strong {
  font-size: 0.7rem;
  color: #374151;
  font-weight: 600;
}

.ubicacion-origen-completa span,
.ubicacion-destino-completa span {
  font-size: 0.7rem;
  color: #6b7280;
}

.no-data {
  color: #9ca3af;
  font-style: italic;
  font-size: 0.75rem;
}

/* Responsive */
@media (max-width: 1200px) {
  .tabla-scroll {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }
}

@media (max-width: 768px) {
  .tabla-trazabilidad {
    font-size: 0.8rem;
  }

  .tabla-trazabilidad th,
  .tabla-trazabilidad td {
    padding: 0.5rem 0.375rem;
  }

  .nombre-material {
    max-width: 120px;
  }

  .proveedor-nombre {
    max-width: 100px;
  }
}
</style>
