<template>
  <div class="tabla-recepciones-contenedor">
    <!-- Estado de carga -->
    <div v-if="cargando" class="estado-carga">
      <div class="spinner"></div>
      <p>Cargando recepciones de lotes...</p>
    </div>

    <!-- Tabla con datos -->
    <div v-else-if="recepciones.length > 0" class="tabla-scroll">
      <table class="tabla-recepciones">
        <thead>
          <tr>
            <th class="col-id">ID</th>
            <th class="col-numero">Nº Recepción</th>
            <th class="col-planta">Planta</th>
            <th class="col-fecha">Fecha Recepción</th>
            <th class="col-proveedor">Proveedor</th>
            <th class="col-proveedor-completo">Proveedor Completo</th>
            <th class="col-guia">Guía SII</th>
            <th class="col-material">Material</th>
            <th class="col-material-completo">Material Completo</th>
            <th class="col-lote">Lote</th>
            <th class="col-cantidad">Cantidad</th>
            <th class="col-pallets">Pallets</th>
            <th class="col-qr">Código QR</th>
            <th class="col-ubicacion">Ubicación Destino</th>
            <th class="col-ubicacion-completa">Ubicación Completa</th>
            <th class="col-estado">Estado</th>
            <th class="col-observaciones">Observaciones</th>
            <th class="col-usuario">Usuario</th>
            <th class="col-fechas-sistema">Fechas Sistema</th>
            <th class="col-acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="recepcion in recepciones"
            :key="recepcion.id"
            class="fila-recepcion"
          >
            <!-- ID -->
            <td class="col-id">
              <span class="id-numero">{{ recepcion.id }}</span>
            </td>

            <!-- Número de Recepción -->
            <td class="col-numero">
              <span class="numero-principal">{{
                recepcion.numero_recepcion
              }}</span>
            </td>

            <!-- Planta -->
            <td class="col-planta">
              <span class="planta-nombre">{{ recepcion.planta }}</span>
            </td>

            <!-- Fecha de Recepción -->
            <td class="col-fecha">
              <div class="fecha-completa">
                <span class="fecha-principal">{{
                  formatearFecha(recepcion.fecha_recepcion)
                }}</span>
                <span class="hora">{{
                  formatearHora(recepcion.fecha_recepcion)
                }}</span>
              </div>
            </td>

            <!-- Proveedor -->
            <td class="col-proveedor">
              <div class="info-proveedor" v-if="recepcion.proveedor">
                <span class="proveedor-id"
                  >ID: {{ recepcion.proveedor.id }}</span
                >
                <span class="proveedor-nombre">{{
                  recepcion.proveedor.nombre
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Proveedor Completo -->
            <td class="col-proveedor-completo">
              <div
                class="proveedor-completo-info"
                v-if="recepcion.proveedor?.completo"
              >
                <span class="proveedor-title">{{
                  recepcion.proveedor.completo.title
                }}</span>
                <span class="proveedor-activo">{{
                  recepcion.proveedor.completo.activo ? "Activo" : "Inactivo"
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Guía SII -->
            <td class="col-guia">
              <span class="guia-numero">{{ recepcion.guia_sii || "N/A" }}</span>
            </td>

            <!-- Material -->
            <td class="col-material">
              <div class="info-material" v-if="recepcion.material">
                <span class="material-id">ID: {{ recepcion.material.id }}</span>
                <span class="material-codigo">{{
                  recepcion.material.codigo
                }}</span>
                <span class="material-nombre">{{
                  recepcion.material.nombre
                }}</span>
                <span class="material-unidad">{{
                  recepcion.material.unidad_medida
                }}</span>
                <span class="material-clasificacion">{{
                  recepcion.material.clasificacion
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Material Completo -->
            <td class="col-material-completo">
              <div
                class="material-completo-info"
                v-if="recepcion.material?.completo"
              >
                <span class="codigo-ranco">{{
                  recepcion.material.completo.codigo_ranco
                }}</span>
                <span class="nombre-completo">{{
                  recepcion.material.completo.nombre_material
                }}</span>
                <span class="unidad-completa">{{
                  recepcion.material.completo.unidad_medida
                }}</span>
                <span class="clasificacion-completa">{{
                  recepcion.material.completo.clasificacion
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Lote -->
            <td class="col-lote">
              <span class="lote-codigo">{{ recepcion.lote || "N/A" }}</span>
            </td>

            <!-- Cantidad -->
            <td class="col-cantidad">
              <div class="cantidad-info">
                <span class="valor-cantidad">{{
                  formatearCantidad(recepcion.cantidad)
                }}</span>
                <span class="unidad-medida">{{
                  recepcion.material?.unidad_medida || "UN"
                }}</span>
              </div>
            </td>

            <!-- Pallets -->
            <td class="col-pallets">
              <span class="pallets-numero">{{
                formatearCantidad(recepcion.pallets)
              }}</span>
            </td>

            <!-- Código QR -->
            <td class="col-qr">
              <span class="codigo-qr">{{ recepcion.codigo_qr || "N/A" }}</span>
            </td>

            <!-- Calidad -->
            <td class="col-calidad">
              <div class="info-calidad">
                <span
                  class="calificacion-calidad"
                  :class="obtenerClaseCalidad(recepcion.calificacion_calidad)"
                >
                  {{ recepcion.calificacion_calidad || "N/A" }}
                </span>
                <div
                  v-if="recepcion.temperatura_recepcion"
                  class="temperatura-recepcion"
                >
                  <span class="valor-temperatura"
                    >{{ recepcion.temperatura_recepcion }}°C</span
                  >
                </div>
              </div>
            </td>

            <!-- Ubicación Destino -->
            <td class="col-ubicacion-destino">
              <div
                class="ubicacion-destino-info"
                v-if="recepcion.ubicacion_destino"
              >
                <span class="ubicacion-id"
                  >ID: {{ recepcion.ubicacion_destino.id }}</span
                >
                <span class="ubicacion-codigo">{{
                  recepcion.ubicacion_destino.codigo
                }}</span>
                <span class="ubicacion-alias">{{
                  recepcion.ubicacion_destino.alias
                }}</span>
                <span class="ubicacion-planta">{{
                  recepcion.ubicacion_destino.planta
                }}</span>
                <span class="ubicacion-zona">{{
                  recepcion.ubicacion_destino.zona_ubicacion
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Ubicación Destino Completa -->
            <td class="col-ubicacion-completa">
              <div
                class="ubicacion-completa-info"
                v-if="recepcion.ubicacion_destino?.completo"
              >
                <span class="codigo-completo">{{
                  recepcion.ubicacion_destino.completo.codigo
                }}</span>
                <span class="alias-completo">{{
                  recepcion.ubicacion_destino.completo.alias
                }}</span>
                <span class="planta-completa">{{
                  recepcion.ubicacion_destino.completo.planta
                }}</span>
                <span class="zona-completa">{{
                  recepcion.ubicacion_destino.completo.zona_ubicacion
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Usuario -->
            <td class="col-usuario">
              <div class="usuario-info" v-if="recepcion.usuario">
                <span class="usuario-id">ID: {{ recepcion.usuario.id }}</span>
                <span class="usuario-nombre">{{
                  recepcion.usuario.nombre
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Usuario Completo -->
            <td class="col-usuario-completo">
              <div
                class="usuario-completo-info"
                v-if="recepcion.usuario?.completo"
              >
                <span class="usuario-completo-nombre">{{
                  recepcion.usuario.completo.nombre
                }}</span>
                <span class="usuario-rut">{{
                  recepcion.usuario.completo.rut
                }}</span>
                <span class="usuario-email">{{
                  recepcion.usuario.completo.email
                }}</span>
                <span class="usuario-planta">{{
                  recepcion.usuario.completo.planta
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Estado -->
            <td class="col-estado">
              <span
                class="estado-badge"
                :class="`estado-${recepcion.estado?.toLowerCase()}`"
              >
                {{ recepcion.estado || "N/D" }}
              </span>
            </td>

            <!-- Fecha Sistema -->
            <td class="col-fecha-sistema">
              <div class="fecha-sistema-info" v-if="recepcion.fechas_sistema">
                <span class="fecha-creacion">{{
                  formatearFecha(recepcion.fechas_sistema.creacion)
                }}</span>
                <span class="fecha-actualizacion">{{
                  formatearFecha(recepcion.fechas_sistema.actualizacion)
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Observaciones -->
            <td class="col-observaciones">
              <span class="texto-observacion">{{
                recepcion.observaciones || "Sin observaciones"
              }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Estado vacío -->
    <div v-else class="estado-vacio">
      <div class="icono-vacio">📦</div>
      <h3>No hay recepciones registradas</h3>
      <p>{{ obtenerMensajeVacio() }}</p>
      <button
        v-if="!tieneActivosFiltros"
        type="button"
        class="btn-primario"
        @click="$emit('crear-recepcion')"
      >
        <span class="icono-btn">📥</span>
        Nueva Recepción
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

// Props
const props = defineProps({
  recepciones: {
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
  "ver-detalle",
  "editar",
  "confirmar",
  "imprimir-etiqueta",
  "crear-recepcion",
]);

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

function truncarTexto(texto, longitud) {
  if (!texto) return "N/A";
  if (texto.length <= longitud) return texto;
  return texto.substring(0, longitud) + "...";
}

function obtenerClaseCalidad(calidad) {
  const mapaCalidades = {
    EXCELENTE: "excelente",
    BUENA: "buena",
    REGULAR: "regular",
    MALA: "mala",
    RECHAZADA: "rechazada",
  };
  return mapaCalidades[calidad?.toUpperCase()] || "neutral";
}

function obtenerClaseEstado(estado) {
  const mapaEstados = {
    pendiente: "pendiente",
    en_proceso: "proceso",
    recibida: "recibida",
    confirmada: "confirmada",
    ubicada: "ubicada",
    rechazada: "rechazada",
  };
  return mapaEstados[estado] || "neutral";
}

function obtenerTextoEstado(estado) {
  const mapaTextos = {
    pendiente: "Pendiente",
    en_proceso: "En Proceso",
    recibida: "Recibida",
    confirmada: "Confirmada",
    ubicada: "Ubicada",
    rechazada: "Rechazada",
  };
  return mapaTextos[estado] || estado;
}

function puedeEditar(recepcion) {
  return ["pendiente", "en_proceso", "recibida"].includes(recepcion.estado);
}

function puedeConfirmar(recepcion) {
  return ["recibida"].includes(recepcion.estado);
}

function obtenerMensajeVacio() {
  if (props.tieneActivosFiltros) {
    return "No se encontraron recepciones que coincidan con los filtros aplicados.";
  }
  return "Comience registrando la primera recepción de lotes.";
}
</script>

<style scoped>
.tabla-recepciones-contenedor {
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
  border-top: 3px solid #f59e0b;
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

.tabla-recepciones {
  width: 100%;
  min-width: 3000px; /* Ancho mínimo para mostrar todas las 20 columnas */
  border-collapse: collapse;
  font-size: 0.875rem;
}

.tabla-recepciones thead {
  background: linear-gradient(135deg, #fffbeb 0%, #fde68a 100%);
  position: sticky;
  top: 0;
  z-index: 10;
}

.tabla-recepciones th {
  padding: 10px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #fde68a;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.tabla-recepciones td {
  padding: 10px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.fila-recepcion:hover {
  background-color: #fffbeb;
}

/* Anchos específicos para cada columna */
.col-numero {
  width: 140px;
  min-width: 140px;
}
/* Estilos de columnas actualizados para estructura completa */
.col-id {
  width: 80px;
  min-width: 80px;
}
.col-numero {
  width: 120px;
  min-width: 120px;
}
.col-planta {
  width: 100px;
  min-width: 100px;
}
.col-fecha {
  width: 130px;
  min-width: 130px;
}
.col-proveedor {
  width: 160px;
  min-width: 160px;
}
.col-proveedor-completo {
  width: 180px;
  min-width: 180px;
}
.col-guia {
  width: 120px;
  min-width: 120px;
}
.col-material {
  width: 200px;
  min-width: 200px;
}
.col-material-completo {
  width: 220px;
  min-width: 220px;
}
.col-lote {
  width: 120px;
  min-width: 120px;
}
.col-cantidad {
  width: 120px;
  min-width: 120px;
}
.col-pallets {
  width: 100px;
  min-width: 100px;
}
.col-qr {
  width: 140px;
  min-width: 140px;
}
.col-ubicacion-destino {
  width: 200px;
  min-width: 200px;
}
.col-ubicacion-completa {
  width: 220px;
  min-width: 220px;
}
.col-usuario {
  width: 140px;
  min-width: 140px;
}
.col-usuario-completo {
  width: 200px;
  min-width: 200px;
}
.col-estado {
  width: 110px;
  min-width: 110px;
}
.col-fecha-sistema {
  width: 180px;
  min-width: 180px;
}
.col-observaciones {
  width: 180px;
  min-width: 180px;
}

/* Estilos de contenido */
.numero-recepcion {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.numero-principal {
  font-weight: 600;
  color: #1f2937;
  font-family: "Courier New", monospace;
}

.planta-info {
  font-size: 0.75rem;
  color: #6b7280;
}

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

.turno {
  font-size: 0.7rem;
  color: #9ca3af;
}

.info-proveedor {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.nombre-proveedor {
  font-weight: 500;
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 140px;
}

.rut-proveedor {
  font-size: 0.75rem;
  color: #6b7280;
  font-family: "Courier New", monospace;
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

.clasificacion {
  font-size: 0.7rem;
  color: #9ca3af;
  font-style: italic;
}

.info-lote {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.lote-codigo {
  font-weight: 500;
  color: #1f2937;
  font-family: "Courier New", monospace;
}

.guia-sii {
  font-size: 0.75rem;
  color: #6b7280;
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

.cantidad-esperada {
  display: flex;
  gap: 0.25rem;
  font-size: 0.75rem;
}

.etiqueta {
  color: #9ca3af;
}

.valor {
  color: #6b7280;
  font-weight: 500;
}

.info-calidad {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.calificacion-calidad {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.calificacion-calidad.excelente {
  background: #dcfce7;
  color: #166534;
}
.calificacion-calidad.buena {
  background: #dbeafe;
  color: #1e40af;
}
.calificacion-calidad.regular {
  background: #fef3c7;
  color: #92400e;
}
.calificacion-calidad.mala {
  background: #fed7d7;
  color: #c53030;
}
.calificacion-calidad.rechazada {
  background: #fee2e2;
  color: #991b1b;
}
.calificacion-calidad.neutral {
  background: #f3f4f6;
  color: #374151;
}

.temperatura-recepcion {
  font-size: 0.75rem;
}

.valor-temperatura {
  color: #0369a1;
  font-weight: 500;
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

.cargo {
  font-size: 0.75rem;
  color: #6b7280;
}

.observaciones-contenido {
  max-width: 160px;
}

.texto-observaciones {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.4;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
.badge-recibida {
  background: #e0e7ff;
  color: #3730a3;
}
.badge-confirmada {
  background: #dcfce7;
  color: #166534;
}
.badge-ubicada {
  background: #f3e8ff;
  color: #7c2d12;
}
.badge-rechazada {
  background: #fee2e2;
  color: #991b1b;
}
.badge-neutral {
  background: #f3f4f6;
  color: #374151;
}

/* Estilos para nueva estructura de datos */
.info-proveedor {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.proveedor-id,
.material-id,
.ubicacion-id,
.usuario-id {
  font-size: 0.7rem;
  color: #6b7280;
  font-family: "Courier New", monospace;
}

.proveedor-nombre,
.material-nombre,
.ubicacion-codigo,
.usuario-nombre {
  font-weight: 500;
  color: #1f2937;
}

.proveedor-completo-info,
.material-completo-info,
.ubicacion-completa-info,
.usuario-completo-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  font-size: 0.75rem;
}

.material-codigo,
.material-unidad,
.material-clasificacion,
.ubicacion-alias,
.ubicacion-planta,
.ubicacion-zona,
.usuario-rut,
.usuario-email,
.usuario-planta {
  color: #6b7280;
}

.codigo-completo,
.nombre-completo,
.codigo-qr,
.fecha-creacion,
.fecha-actualizacion {
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
}

.fecha-sistema-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.fecha-creacion {
  color: #1f2937;
  font-weight: 500;
}

.fecha-actualizacion {
  color: #6b7280;
}

.no-data {
  color: #9ca3af;
  font-style: italic;
  font-size: 0.75rem;
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

.btn-confirmar {
  background: #dcfce7;
  color: #166534;
}

.btn-confirmar:hover {
  background: #bbf7d0;
  color: #14532d;
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
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primario:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
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
  .tabla-recepciones {
    font-size: 0.8rem;
  }

  .tabla-recepciones th,
  .tabla-recepciones td {
    padding: 0.5rem 0.375rem;
  }

  .nombre-material,
  .nombre-proveedor,
  .nombre-responsable,
  .observaciones-contenido {
    max-width: 120px;
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
