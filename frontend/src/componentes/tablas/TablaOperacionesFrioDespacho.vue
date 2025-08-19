<template>
  <div class="tabla-operaciones-contenedor">
    <!-- Estado de carga -->
    <div v-if="cargando" class="estado-carga">
      <div class="spinner"></div>
      <p>Cargando operaciones de frío y despacho...</p>
    </div>

    <!-- Tabla con datos -->
    <div v-else-if="operaciones.length > 0" class="tabla-scroll">
      <table class="tabla-operaciones">
        <thead>
          <tr>
            <th class="col-id">ID</th>
            <th class="col-numero">Nº Operación</th>
            <th class="col-planta">Planta</th>
            <th class="col-fecha">Fecha Operación</th>
            <th class="col-tipo">Tipo Operación</th>
            <th class="col-turno">Turno</th>
            <th class="col-embarque">Nº Embarque</th>
            <th class="col-patente">Patente Camión</th>
            <th class="col-material">Material</th>
            <th class="col-material-completo">Material Completo</th>
            <th class="col-lote">Lote</th>
            <th class="col-cantidad">Cantidad</th>
            <th class="col-ubicacion-origen">Ubicación Origen</th>
            <th class="col-ubicacion-origen-completa">
              Ubicación Origen Completa
            </th>
            <th class="col-ubicacion-destino">Ubicación Destino</th>
            <th class="col-ubicacion-destino-completa">
              Ubicación Destino Completa
            </th>
            <th class="col-estado">Estado</th>
            <th class="col-observaciones">Observaciones</th>
            <th class="col-usuario">Usuario</th>
            <th class="col-fecha-creacion">Fecha Creación</th>
            <th class="col-fecha-procesamiento">Fecha Procesamiento</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="operacion in operaciones"
            :key="operacion.id"
            class="fila-operacion"
          >
            <!-- ID -->
            <td class="col-id">
              <span class="id-numero">{{ operacion.id }}</span>
            </td>

            <!-- Número de Operación -->
            <td class="col-numero">
              <span class="numero-principal">{{
                operacion.numero_operacion
              }}</span>
            </td>

            <!-- Planta -->
            <td class="col-planta">
              <span class="planta-nombre">{{ operacion.planta }}</span>
            </td>

            <!-- Fecha de Operación -->
            <td class="col-fecha">
              <div class="fecha-completa">
                <span class="fecha-principal">{{
                  formatearFecha(operacion.fecha_operacion)
                }}</span>
                <span class="hora">{{
                  formatearHora(operacion.fecha_operacion)
                }}</span>
              </div>
            </td>

            <!-- Tipo de Operación -->
            <td class="col-tipo">
              <span
                class="badge-tipo"
                :class="obtenerClaseTipo(operacion.tipo_operacion)"
              >
                {{ operacion.tipo_operacion }}
              </span>
            </td>

            <!-- Turno -->
            <td class="col-turno">
              <span class="turno-info">{{ operacion.turno }}</span>
            </td>

            <!-- Número de Embarque -->
            <td class="col-embarque">
              <span class="numero-embarque">{{
                operacion.numero_embarque || "N/A"
              }}</span>
            </td>

            <!-- Patente Camión -->
            <td class="col-patente">
              <span class="patente-camion">{{
                operacion.patente_camion || "N/A"
              }}</span>
            </td>

            <!-- Material -->
            <td class="col-material">
              <div class="info-material" v-if="operacion.material">
                <span class="material-id">ID: {{ operacion.material.id }}</span>
                <span class="material-codigo">{{
                  operacion.material.codigo
                }}</span>
                <span class="material-nombre">{{
                  operacion.material.nombre
                }}</span>
                <span class="material-unidad">{{
                  operacion.material.unidad_medida
                }}</span>
                <span class="material-clasificacion">{{
                  operacion.material.clasificacion
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Material Completo -->
            <td class="col-material-completo">
              <div
                class="material-completo-info"
                v-if="operacion.material?.completo"
              >
                <span class="codigo-ranco">{{
                  operacion.material.completo.codigo_ranco
                }}</span>
                <span class="nombre-completo">{{
                  operacion.material.completo.nombre_material
                }}</span>
                <span class="unidad-completa">{{
                  operacion.material.completo.unidad_medida
                }}</span>
                <span class="clasificacion-completa">{{
                  operacion.material.completo.clasificacion
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Lote -->
            <td class="col-lote">
              <span class="lote-codigo">{{ operacion.lote || "N/A" }}</span>
            </td>

            <!-- Cantidad -->
            <td class="col-cantidad">
              <div class="cantidad-info">
                <span class="valor-cantidad">{{
                  formatearCantidad(operacion.cantidad)
                }}</span>
                <span class="unidad-medida">{{
                  operacion.material?.unidad_medida || "UN"
                }}</span>
              </div>
            </td>

            <!-- Ubicación Origen -->
            <td class="col-ubicacion-origen">
              <div
                class="ubicacion-origen-info"
                v-if="operacion.ubicacion_origen"
              >
                <span class="ubicacion-id"
                  >ID: {{ operacion.ubicacion_origen.id }}</span
                >
                <span class="ubicacion-bodega">{{
                  operacion.ubicacion_origen.bodega
                }}</span>
                <span class="ubicacion-codigo">{{
                  operacion.ubicacion_origen.ubicacion
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Ubicación Origen Completa -->
            <td class="col-ubicacion-origen-completa">
              <div
                class="ubicacion-completa-info"
                v-if="operacion.ubicacion_origen?.completo"
              >
                <span class="title-completo">{{
                  operacion.ubicacion_origen.completo.title
                }}</span>
                <span class="bodega-deposito">{{
                  operacion.ubicacion_origen.completo.bodega_deposito
                }}</span>
                <span class="planta-completa">{{
                  operacion.ubicacion_origen.completo.planta
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Ubicación Destino -->
            <td class="col-ubicacion-destino">
              <div
                class="ubicacion-destino-info"
                v-if="operacion.ubicacion_destino"
              >
                <span class="ubicacion-id"
                  >ID: {{ operacion.ubicacion_destino.id }}</span
                >
                <span class="ubicacion-bodega">{{
                  operacion.ubicacion_destino.bodega
                }}</span>
                <span class="ubicacion-codigo">{{
                  operacion.ubicacion_destino.ubicacion
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Ubicación Destino Completa -->
            <td class="col-ubicacion-destino-completa">
              <div
                class="ubicacion-completa-info"
                v-if="operacion.ubicacion_destino?.completo"
              >
                <span class="title-completo">{{
                  operacion.ubicacion_destino.completo.title
                }}</span>
                <span class="bodega-deposito">{{
                  operacion.ubicacion_destino.completo.bodega_deposito
                }}</span>
                <span class="planta-completa">{{
                  operacion.ubicacion_destino.completo.planta
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Estado -->
            <td class="col-estado">
              <span
                class="badge-estado"
                :class="obtenerClaseEstado(operacion.estado)"
              >
                {{ obtenerTextoEstado(operacion.estado) }}
              </span>
            </td>

            <!-- Observaciones -->
            <td class="col-observaciones">
              <span class="texto-observacion">{{
                operacion.observaciones || "Sin observaciones"
              }}</span>
            </td>

            <!-- Usuario -->
            <td class="col-usuario">
              <div class="usuario-info" v-if="operacion.usuario">
                <span class="usuario-id">ID: {{ operacion.usuario.id }}</span>
                <span class="usuario-nombre">{{
                  operacion.usuario.nombre_usuario
                }}</span>
                <span class="nombre-completo">{{
                  operacion.usuario.nombre_completo
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Fecha Creación -->
            <td class="col-fecha-creacion">
              <div class="fecha-creacion-info">
                <span class="fecha-creacion">{{
                  formatearFecha(operacion.fecha_creacion)
                }}</span>
                <span class="hora-creacion">{{
                  formatearHora(operacion.fecha_creacion)
                }}</span>
              </div>
            </td>

            <!-- Fecha Procesamiento -->
            <td class="col-fecha-procesamiento">
              <div class="fecha-procesamiento-info">
                <span class="fecha-procesamiento">{{
                  formatearFecha(operacion.fecha_procesamiento)
                }}</span>
                <span class="hora-procesamiento">{{
                  formatearHora(operacion.fecha_procesamiento)
                }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Estado vacío -->
    <div v-else class="estado-vacio">
      <div class="icono-vacio">❄️</div>
      <h3>No hay operaciones registradas</h3>
      <p>{{ obtenerMensajeVacio() }}</p>
      <button
        v-if="!tieneActivosFiltros"
        type="button"
        class="btn-primario"
        @click="$emit('crear-operacion')"
      >
        <span class="icono-btn">🧊</span>
        Nueva Operación
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

// Props
const props = defineProps({
  operaciones: {
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
  "completar",
  "imprimir-etiqueta",
  "crear-operacion",
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

function obtenerClaseTipo(tipoOperacion) {
  const mapaTipos = {
    consumo: "consumo",
    despacho: "despacho",
    preparacion: "preparacion",
    almacenaje: "almacenaje",
    enfriamiento: "enfriamiento",
    congelacion: "congelacion",
  };
  return mapaTipos[tipoOperacion?.toLowerCase()] || "neutral";
}

function obtenerClaseEstado(estado) {
  const mapaEstados = {
    pendiente: "pendiente",
    en_proceso: "proceso",
    procesada: "completado",
    completado: "completado",
    cancelado: "cancelado",
    pausado: "pausado",
  };
  return mapaEstados[estado] || "neutral";
}

function obtenerTextoEstado(estado) {
  const mapaTextos = {
    pendiente: "Pendiente",
    en_proceso: "En Proceso",
    procesada: "Procesada",
    completado: "Completado",
    cancelado: "Cancelado",
    pausado: "Pausado",
  };
  return mapaTextos[estado] || estado;
}

function obtenerClaseTemperatura(temperatura) {
  const temp = parseFloat(temperatura);
  if (temp >= 10) return "temperatura-alta";
  if (temp >= 0) return "temperatura-media";
  if (temp >= -10) return "temperatura-baja";
  return "temperatura-congelacion";
}

function puedeEditar(operacion) {
  return ["pendiente", "en_proceso", "pausado"].includes(operacion.estado);
}

function puedeCompletar(operacion) {
  return ["en_proceso"].includes(operacion.estado);
}

function obtenerMensajeVacio() {
  if (props.tieneActivosFiltros) {
    return "No se encontraron operaciones que coincidan con los filtros aplicados.";
  }
  return "Comience registrando la primera operación de frío y despacho.";
}
</script>

<style scoped>
.tabla-operaciones-contenedor {
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

.tabla-operaciones {
  width: 100%;
  min-width: 3200px; /* Ancho mínimo para mostrar todas las 21 columnas */
  border-collapse: collapse;
  font-size: 0.875rem;
}

.tabla-operaciones thead {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  position: sticky;
  top: 0;
  z-index: 10;
}

.tabla-operaciones th {
  padding: 10px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #bfdbfe;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.tabla-operaciones td {
  padding: 10px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.fila-operacion:hover {
  background-color: #f8fafc;
}

/* Anchos específicos para cada columna actualizada */
.col-id {
  width: 80px;
  min-width: 80px;
}
.col-numero {
  width: 180px;
  min-width: 180px;
}
.col-planta {
  width: 100px;
  min-width: 100px;
}
.col-fecha {
  width: 130px;
  min-width: 130px;
}
.col-tipo {
  width: 120px;
  min-width: 120px;
}
.col-turno {
  width: 100px;
  min-width: 100px;
}
.col-embarque {
  width: 120px;
  min-width: 120px;
}
.col-patente {
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
  width: 140px;
  min-width: 140px;
}
.col-cantidad {
  width: 110px;
  min-width: 110px;
}
.col-ubicacion-origen {
  width: 180px;
  min-width: 180px;
}
.col-ubicacion-origen-completa {
  width: 200px;
  min-width: 200px;
}
.col-ubicacion-destino {
  width: 180px;
  min-width: 180px;
}
.col-ubicacion-destino-completa {
  width: 200px;
  min-width: 200px;
}
.col-estado {
  width: 110px;
  min-width: 110px;
}
.col-observaciones {
  width: 180px;
  min-width: 180px;
}
.col-usuario {
  width: 160px;
  min-width: 160px;
}
.col-fecha-creacion {
  width: 140px;
  min-width: 140px;
}
.col-fecha-procesamiento {
  width: 140px;
  min-width: 140px;
}

/* Estilos de contenido */
.numero-operacion {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.numero-principal {
  font-weight: 600;
  color: #1f2937;
  font-family: "Courier New", monospace;
}

.turno-info {
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

.badge-consumo {
  background: #fef3c7;
  color: #92400e;
}
.badge-despacho {
  background: #dbeafe;
  color: #1e40af;
}
.badge-preparacion {
  background: #e0e7ff;
  color: #3730a3;
}
.badge-almacenaje {
  background: #dcfce7;
  color: #166534;
}
.badge-enfriamiento {
  background: #ecfdf5;
  color: #047857;
}
.badge-congelacion {
  background: #f0f9ff;
  color: #0369a1;
}
.badge-neutral {
  background: #f3f4f6;
  color: #374151;
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

.ubicaciones-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ubicacion-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.etiqueta-ubicacion {
  font-size: 0.7rem;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 500;
}

.nombre-ubicacion {
  font-size: 0.8rem;
  color: #1f2937;
  font-weight: 500;
}

.temperatura-info {
  text-align: center;
}

.valor-temperatura {
  font-weight: 600;
  font-size: 0.875rem;
}

.temperatura-alta {
  color: #dc2626;
}
.temperatura-media {
  color: #059669;
}
.temperatura-baja {
  color: #0369a1;
}
.temperatura-congelacion {
  color: #7c3aed;
}

.temperatura-na {
  color: #9ca3af;
  font-style: italic;
}

.cliente-nombre {
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 120px;
  display: block;
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

.planta {
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
.badge-procesada {
  background: #dcfce7;
  color: #166534;
}
.badge-cancelado {
  background: #fee2e2;
  color: #991b1b;
}
.badge-pausado {
  background: #e0e7ff;
  color: #3730a3;
}
.badge-neutral {
  background: #f3f4f6;
  color: #374151;
}

/* Estilos para nueva estructura de datos completa */
.id-numero {
  font-family: "Courier New", monospace;
  font-weight: 600;
  color: #6b7280;
}

.planta-nombre {
  font-weight: 600;
  color: #1f2937;
  text-transform: uppercase;
}

.turno-info {
  font-weight: 500;
  color: #1f2937;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.numero-embarque,
.patente-camion {
  font-family: "Courier New", monospace;
  font-weight: 500;
  color: #1f2937;
}

.info-material {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.material-id,
.ubicacion-id,
.usuario-id {
  font-size: 0.7rem;
  color: #6b7280;
  font-family: "Courier New", monospace;
}

.material-codigo,
.material-nombre,
.material-unidad,
.material-clasificacion,
.ubicacion-bodega,
.ubicacion-codigo {
  color: #1f2937;
  font-size: 0.75rem;
}

.material-completo-info,
.ubicacion-completa-info,
.usuario-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.codigo-ranco,
.nombre-completo,
.unidad-completa,
.clasificacion-completa {
  font-size: 0.75rem;
  color: #1f2937;
}

.title-completo,
.bodega-deposito,
.planta-completa {
  font-size: 0.75rem;
  color: #6b7280;
}

.ubicacion-origen-info,
.ubicacion-destino-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.usuario-nombre,
.nombre-completo {
  font-weight: 500;
  color: #1f2937;
}

.fecha-creacion-info,
.fecha-procesamiento-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.fecha-creacion,
.fecha-procesamiento {
  font-weight: 500;
  color: #1f2937;
}

.hora-creacion,
.hora-procesamiento {
  font-size: 0.7rem;
  color: #6b7280;
}

.texto-observacion {
  font-size: 0.75rem;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 160px;
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

.btn-completar {
  background: #dcfce7;
  color: #166534;
}

.btn-completar:hover {
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

/* Responsive */
@media (max-width: 1200px) {
  .tabla-scroll {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }
}

@media (max-width: 768px) {
  .tabla-operaciones {
    font-size: 0.8rem;
  }

  .tabla-operaciones th,
  .tabla-operaciones td {
    padding: 0.5rem 0.375rem;
  }

  .nombre-material,
  .cliente-nombre,
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
