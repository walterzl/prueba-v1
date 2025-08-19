<template>
  <div class="tabla-tarjas-contenedor">
    <!-- Estado de carga -->
    <div v-if="cargando" class="estado-carga">
      <div class="spinner"></div>
      <p>Cargando tarjas...</p>
    </div>

    <!-- Tabla con datos -->
    <div v-else-if="tarjas.length > 0" class="tabla-scroll">
      <table class="tabla-tarjas">
        <thead>
          <tr>
            <th class="col-id">ID</th>
            <th class="col-numero">Nº Tarja</th>
            <th class="col-planta">Planta</th>
            <th class="col-fecha">Fecha Generación</th>
            <th class="col-tipo">Tipo Tarja</th>
            <th class="col-descripcion">Descripción</th>
            <th class="col-material">Material</th>
            <th class="col-material-completo">Material Completo</th>
            <th class="col-lote">Lote</th>
            <th class="col-cantidad">Cantidad</th>
            <th class="col-numero-item">Nº Item</th>
            <th class="col-fecha-item">Fecha Item</th>
            <th class="col-proveedor">Proveedor</th>
            <th class="col-proveedor-completo">Proveedor Completo</th>
            <th class="col-guia">Guía</th>
            <th class="col-estado">Estado</th>
            <th class="col-usuario">Usuario</th>
            <th class="col-fecha-creacion">Fecha Creación</th>
            <th class="col-fecha-impresion">Fecha Impresión</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tarja in tarjas" :key="tarja.id" class="fila-tarja">
            <!-- ID -->
            <td class="col-id">
              <span class="id-numero">{{ tarja.id }}</span>
            </td>

            <!-- Número de Tarja -->
            <td class="col-numero">
              <span class="numero-principal">{{ tarja.numero_tarja }}</span>
            </td>

            <!-- Planta -->
            <td class="col-planta">
              <span
                class="planta-badge"
                :class="obtenerClasePlanta(tarja.planta)"
              >
                {{ tarja.planta }}
              </span>
            </td>

            <!-- Fecha de Generación -->
            <td class="col-fecha">
              <div class="fecha-completa">
                <span class="fecha-principal">{{
                  formatearFecha(tarja.fecha_generacion)
                }}</span>
                <span class="hora">{{
                  formatearHora(tarja.fecha_generacion)
                }}</span>
              </div>
            </td>

            <!-- Tipo de Tarja -->
            <td class="col-tipo">
              <span
                class="badge-tipo"
                :class="obtenerClaseTipo(tarja.tipo_tarja)"
              >
                {{ tarja.tipo_tarja }}
              </span>
            </td>

            <!-- Descripción -->
            <td class="col-descripcion">
              <span class="texto-descripcion">{{
                tarja.descripcion || "Sin descripción"
              }}</span>
            </td>

            <!-- Material -->
            <td class="col-material">
              <div class="info-material" v-if="tarja.material">
                <span class="material-id" v-if="tarja.material.id"
                  >ID: {{ tarja.material.id }}</span
                >
                <span class="material-codigo">{{ tarja.material.codigo }}</span>
                <span class="material-nombre">{{ tarja.material.nombre }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Material Completo -->
            <td class="col-material-completo">
              <div
                class="material-completo-info"
                v-if="tarja.material?.completo"
              >
                <span class="codigo-ranco">{{
                  tarja.material.completo.codigo_ranco
                }}</span>
                <span class="nombre-completo">{{
                  tarja.material.completo.nombre_material
                }}</span>
                <span class="unidad-completa">{{
                  tarja.material.completo.unidad_medida
                }}</span>
                <span class="clasificacion-completa">{{
                  tarja.material.completo.clasificacion
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Lote -->
            <td class="col-lote">
              <span class="lote-codigo">{{ tarja.lote || "N/A" }}</span>
            </td>

            <!-- Cantidad -->
            <td class="col-cantidad">
              <span class="valor-cantidad">{{
                formatearCantidad(tarja.cantidad)
              }}</span>
            </td>

            <!-- Número Item -->
            <td class="col-numero-item">
              <span class="numero-item">{{ tarja.numero_item || "N/A" }}</span>
            </td>

            <!-- Fecha Item -->
            <td class="col-fecha-item">
              <div class="fecha-item-info" v-if="tarja.fecha_item">
                <span class="fecha-item">{{
                  formatearFecha(tarja.fecha_item)
                }}</span>
                <span class="hora-item">{{
                  formatearHora(tarja.fecha_item)
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Proveedor -->
            <td class="col-proveedor">
              <div
                class="info-proveedor"
                v-if="
                  tarja.proveedor &&
                  (tarja.proveedor.id || tarja.proveedor.nombre)
                "
              >
                <span class="proveedor-id" v-if="tarja.proveedor.id"
                  >ID: {{ tarja.proveedor.id }}</span
                >
                <span class="proveedor-nombre">{{
                  tarja.proveedor.nombre
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Proveedor Completo -->
            <td class="col-proveedor-completo">
              <div
                class="proveedor-completo-info"
                v-if="tarja.proveedor?.completo"
              >
                <span class="proveedor-title">{{
                  tarja.proveedor.completo.title
                }}</span>
                <span class="proveedor-activo">{{
                  tarja.proveedor.completo.activo ? "Activo" : "Inactivo"
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Guía -->
            <td class="col-guia">
              <span class="numero-guia">{{ tarja.guia || "N/A" }}</span>
            </td>

            <!-- Estado -->
            <td class="col-estado">
              <span
                class="badge-estado"
                :class="obtenerClaseEstado(tarja.estado)"
              >
                {{ obtenerTextoEstado(tarja.estado) }}
              </span>
            </td>

            <!-- Usuario -->
            <td class="col-usuario">
              <div class="usuario-info" v-if="tarja.usuario">
                <span class="usuario-id">ID: {{ tarja.usuario.id }}</span>
                <span class="usuario-nombre">{{
                  tarja.usuario.nombre_usuario
                }}</span>
                <span class="nombre-completo">{{
                  tarja.usuario.nombre_completo
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>

            <!-- Fecha Creación -->
            <td class="col-fecha-creacion">
              <div class="fecha-creacion-info">
                <span class="fecha-creacion">{{
                  formatearFecha(tarja.fecha_creacion)
                }}</span>
                <span class="hora-creacion">{{
                  formatearHora(tarja.fecha_creacion)
                }}</span>
              </div>
            </td>

            <!-- Fecha Impresión -->
            <td class="col-fecha-impresion">
              <div class="fecha-impresion-info" v-if="tarja.fecha_impresion">
                <span class="fecha-impresion">{{
                  formatearFecha(tarja.fecha_impresion)
                }}</span>
                <span class="hora-impresion">{{
                  formatearHora(tarja.fecha_impresion)
                }}</span>
              </div>
              <span v-else class="no-data">N/A</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Estado vacío -->
    <div v-else class="estado-vacio">
      <div class="icono-vacio">🏷️</div>
      <h3>No hay tarjas registradas</h3>
      <p>{{ obtenerMensajeVacio() }}</p>
      <button
        v-if="!tieneActivosFiltros"
        type="button"
        class="btn-primario"
        @click="$emit('generar-tarja')"
      >
        <span class="icono-btn">🏷️</span>
        Generar Primera Tarja
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

// Props
const props = defineProps({
  tarjas: {
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
  "imprimir",
  "anular",
  "duplicar",
  "generar-tarja",
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

function obtenerClaseTipo(tipoTarja) {
  const mapaTipos = {
    CAA: "caa",
    BODEGA: "bodega",
    DESPACHO: "despacho",
    PRODUCCION: "produccion",
    CONTROL: "control",
    ESPECIAL: "especial",
  };
  return mapaTipos[tipoTarja?.toUpperCase()] || "neutral";
}

function obtenerClasePlanta(planta) {
  const mapasPlantas = {
    Rancagua: "rancagua",
    "San Fernando": "san-fernando",
    Linares: "linares",
  };
  return mapasPlantas[planta] || "default";
}

function obtenerClaseEstado(estado) {
  const mapaEstados = {
    generada: "generada",
    impresa: "impresa",
    en_uso: "en-uso",
    completada: "completada",
    anulada: "anulada",
    vencida: "vencida",
  };
  return mapaEstados[estado] || "neutral";
}

function obtenerTextoEstado(estado) {
  const mapaTextos = {
    generada: "Generada",
    impresa: "Impresa",
    en_uso: "En Uso",
    completada: "Completada",
    anulada: "Anulada",
    vencida: "Vencida",
  };
  return mapaTextos[estado] || estado;
}

function puedeEditar(tarja) {
  return ["generada"].includes(tarja.estado);
}

function puedeImprimir(tarja) {
  return ["generada", "impresa"].includes(tarja.estado);
}

function puedeAnular(tarja) {
  return ["generada", "impresa", "en_uso"].includes(tarja.estado);
}

function obtenerMensajeVacio() {
  if (props.tieneActivosFiltros) {
    return "No se encontraron tarjas que coincidan con los filtros aplicados.";
  }
  return "Comience generando la primera tarja del sistema.";
}
</script>

<style scoped>
.tabla-tarjas-contenedor {
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
  border-top: 3px solid #8b5cf6;
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

.tabla-tarjas {
  width: 100%;
  min-width: 2800px; /* Ancho mínimo para mostrar todas las 19 columnas */
  border-collapse: collapse;
  font-size: 0.875rem;
}

.tabla-tarjas thead {
  background: linear-gradient(135deg, #faf5ff 0%, #e9d5ff 100%);
  position: sticky;
  top: 0;
  z-index: 10;
}

.tabla-tarjas th {
  padding: 10px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #d8b4fe;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.tabla-tarjas td {
  padding: 10px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.fila-tarja:hover {
  background-color: #faf5ff;
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
  width: 100px;
  min-width: 100px;
}
.col-descripcion {
  width: 160px;
  min-width: 160px;
}
.col-material {
  width: 180px;
  min-width: 180px;
}
.col-material-completo {
  width: 200px;
  min-width: 200px;
}
.col-lote {
  width: 140px;
  min-width: 140px;
}
.col-cantidad {
  width: 100px;
  min-width: 100px;
}
.col-numero-item {
  width: 100px;
  min-width: 100px;
}
.col-fecha-item {
  width: 130px;
  min-width: 130px;
}
.col-proveedor {
  width: 140px;
  min-width: 140px;
}
.col-proveedor-completo {
  width: 160px;
  min-width: 160px;
}
.col-guia {
  width: 100px;
  min-width: 100px;
}
.col-estado {
  width: 110px;
  min-width: 110px;
}
.col-usuario {
  width: 160px;
  min-width: 160px;
}
.col-fecha-creacion {
  width: 140px;
  min-width: 140px;
}
.col-fecha-impresion {
  width: 140px;
  min-width: 140px;
}

/* Estilos de contenido */
.numero-tarja {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.numero-principal {
  font-weight: 600;
  color: #1f2937;
  font-family: "Courier New", monospace;
}

.codigo-barras {
  font-size: 0.75rem;
  color: #6b7280;
  font-family: "Courier New", monospace;
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

.badge-caa {
  background: #fef3c7;
  color: #92400e;
}
.badge-bodega {
  background: #dbeafe;
  color: #1e40af;
}
.badge-despacho {
  background: #dcfce7;
  color: #166534;
}
.badge-produccion {
  background: #e0e7ff;
  color: #3730a3;
}
.badge-control {
  background: #fee2e2;
  color: #991b1b;
}
.badge-especial {
  background: #f3e8ff;
  color: #7c2d12;
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

.turno {
  font-size: 0.7rem;
  color: #9ca3af;
}

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
  max-width: 160px;
}

.lote {
  font-size: 0.7rem;
  color: #9ca3af;
  font-style: italic;
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
  max-width: 130px;
}

.codigo-proveedor {
  font-size: 0.75rem;
  color: #6b7280;
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

.peso-neto {
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

.sector {
  font-size: 0.7rem;
  color: #9ca3af;
  font-style: italic;
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

.operador {
  font-size: 0.75rem;
  color: #6b7280;
}

.observaciones-contenido {
  max-width: 180px;
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

.incidencias {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.etiqueta-incidencia {
  font-size: 0.75rem;
}

.texto-incidencia {
  font-size: 0.75rem;
  color: #dc2626;
  font-weight: 500;
}

.estado-completo {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
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

.badge-generada {
  background: #fef3c7;
  color: #92400e;
}
.badge-impresa {
  background: #dbeafe;
  color: #1e40af;
}
.badge-en-uso {
  background: #e0e7ff;
  color: #3730a3;
}
.badge-completada {
  background: #dcfce7;
  color: #166534;
}
.badge-anulada {
  background: #fee2e2;
  color: #991b1b;
}
.badge-vencida {
  background: #f3f4f6;
  color: #6b7280;
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

.numero-principal {
  font-weight: 600;
  color: #1f2937;
  font-family: "Courier New", monospace;
}

.texto-descripcion {
  font-size: 0.75rem;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 140px;
}

.info-material {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.material-id,
.proveedor-id,
.usuario-id {
  font-size: 0.7rem;
  color: #6b7280;
  font-family: "Courier New", monospace;
}

.material-codigo,
.material-nombre,
.proveedor-nombre,
.usuario-nombre,
.nombre-completo {
  color: #1f2937;
  font-size: 0.75rem;
}

.material-completo-info,
.proveedor-completo-info,
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

.proveedor-title,
.proveedor-activo {
  font-size: 0.75rem;
  color: #6b7280;
}

.lote-codigo {
  font-weight: 500;
  color: #1f2937;
  font-family: "Courier New", monospace;
}

.valor-cantidad {
  font-weight: 600;
  color: #1f2937;
  text-align: right;
}

.numero-item,
.numero-guia {
  font-family: "Courier New", monospace;
  font-weight: 500;
  color: #1f2937;
}

.fecha-item-info,
.fecha-creacion-info,
.fecha-impresion-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.fecha-item,
.fecha-creacion,
.fecha-impresion {
  font-weight: 500;
  color: #1f2937;
}

.hora-item,
.hora-creacion,
.hora-impresion {
  font-size: 0.7rem;
  color: #6b7280;
}

.info-proveedor {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.no-data {
  color: #9ca3af;
  font-style: italic;
  font-size: 0.75rem;
}

.fecha-impresion {
  font-size: 0.7rem;
  color: #9ca3af;
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

.btn-imprimir {
  background: #dbeafe;
  color: #1e40af;
}

.btn-imprimir:hover {
  background: #bfdbfe;
  color: #1e3a8a;
}

.btn-anular {
  background: #fee2e2;
  color: #991b1b;
}

.btn-anular:hover {
  background: #fecaca;
  color: #7f1d1d;
}

.btn-duplicar {
  background: #e0e7ff;
  color: #3730a3;
}

.btn-duplicar:hover {
  background: #c7d2fe;
  color: #312e81;
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
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primario:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(139, 92, 246, 0.3);
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
  .tabla-tarjas {
    font-size: 0.8rem;
  }

  .tabla-tarjas th,
  .tabla-tarjas td {
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
