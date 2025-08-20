<template>
  <FormularioBase
    ref="formularioRef"
    titulo="Recepción de Lotes"
    descripcion="Registre la recepción de materiales mediante escaneo de códigos QR"
    texto-boton-enviar="Registrar Recepción"
    :validaciones="validaciones"
    :datos-iniciales="datosIniciales"
    @enviar="manejarEnvio"
    @cancelar="manejarCancelar"
  >
    <template #campos>
      <!-- Sección de Información General -->
      <div class="seccion-formulario">
        <h3 class="seccion-titulo">📋 Información General</h3>

        <div class="campos-fila">
          <CampoFormulario
            v-model="datos.planta"
            etiqueta="Planta"
            tipo="select"
            :opciones="plantasDisponibles"
            :requerido="true"
            :error="errores.planta"
            @change="manejarCambioPlanta"
          />

          <CampoFormulario
            v-model="datos.fechaRecepcion"
            etiqueta="Fecha de Recepción"
            tipo="date"
            :requerido="true"
            :error="errores.fechaRecepcion"
            :max="fechaMaxima"
          />
        </div>

        <div class="campos-fila">
          <CampoFormulario
            v-model="datos.proveedor"
            etiqueta="Proveedor"
            tipo="select"
            :opciones="proveedoresDisponibles"
            :requerido="true"
            :error="errores.proveedor"
          />

          <CampoFormulario
            v-model="datos.guiaSii"
            etiqueta="Guía SII"
            tipo="text"
            :max-length="50"
            ayuda="Número de guía SII (opcional)"
          />
        </div>
      </div>

      <!-- Sección de Escaneo QR -->
      <div class="seccion-formulario">
        <h3 class="seccion-titulo">📱 Escaneo de Código QR</h3>

        <div class="campos-fila">
          <div class="campo-escaner">
            <label class="campo-etiqueta">Escanear Código QR</label>
            <div class="contenedor-escaner">
              <div
                ref="contenedorEscaner"
                class="escaner-qr"
                :class="{ 'escaner-activo': escanerActivo }"
              ></div>

              <div v-if="!escanerActivo" class="escaner-inactivo">
                <button
                  type="button"
                  class="boton boton-principal"
                  @click="iniciarEscaner"
                  :disabled="cargandoEscaner"
                >
                  <span v-if="cargandoEscaner" class="spinner"></span>
                  <span v-else>🔍 Iniciar Escáner</span>
                </button>
              </div>

              <div v-else class="escaner-controls">
                <button
                  type="button"
                  class="boton boton-secundario"
                  @click="detenerEscaner"
                >
                  ⏹️ Detener Escáner
                </button>
              </div>
            </div>

            <div v-if="ultimoCodigoEscaneado" class="codigo-escaneado">
              <span class="icono-exito">✅</span>
              Código escaneado: <strong>{{ ultimoCodigoEscaneado }}</strong>
            </div>
          </div>

          <div class="campo-manual">
            <CampoFormulario
              v-model="codigoManual"
              etiqueta="Código Manual"
              tipo="text"
              placeholder="Ingrese código manualmente si es necesario"
              :max-length="100"
              ayuda="Alternativa al escaneo QR"
            />
            <button
              type="button"
              class="boton boton-secundario"
              @click="agregarCodigoManual"
              :disabled="!codigoManual"
            >
              ➕ Agregar
            </button>
          </div>
        </div>
      </div>

      <!-- Sección de Materiales Escaneados -->
      <div class="seccion-formulario">
        <h3 class="seccion-titulo">📦 Materiales Escaneados</h3>

        <div v-if="materialesEscaneados.length === 0" class="sin-materiales">
          <p>
            No hay materiales escaneados. Use el escáner QR o ingrese códigos
            manualmente.
          </p>
        </div>

        <div v-else class="lista-materiales">
          <div
            v-for="(material, index) in materialesEscaneados"
            :key="`${material.codigo}_${index}`"
            class="material-item"
          >
            <div class="material-info">
              <div class="material-codigo">{{ material.codigo }}</div>
              <div class="material-nombre">{{ material.nombre }}</div>
              <div class="material-detalles">
                <span class="material-clasificacion">{{
                  material.clasificacion
                }}</span>
                <span class="material-unidad">{{ material.unidadMedida }}</span>
              </div>
            </div>

            <div class="material-campos">
              <CampoFormulario
                v-model="material.lote"
                etiqueta="Lote"
                tipo="text"
                :max-length="100"
                :requerido="true"
                :error="material.errores?.lote"
                @update:modelValue="validarMaterial(index)"
              />

              <CampoFormulario
                v-model="material.cantidad"
                etiqueta="Cantidad"
                tipo="number"
                :requerido="true"
                :min="0.01"
                :step="0.01"
                :error="material.errores?.cantidad"
                @update:modelValue="validarMaterial(index)"
              />

              <CampoFormulario
                v-model="material.pallets"
                etiqueta="Pallets"
                tipo="number"
                :min="0"
                :step="1"
                ayuda="Opcional"
              />
            </div>

            <div class="material-acciones">
              <button
                type="button"
                class="boton boton-eliminar"
                @click="eliminarMaterial(index)"
                title="Eliminar material"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        <div class="resumen-materiales">
          <div class="resumen-item">
            <strong>Total de Materiales:</strong>
            {{ materialesEscaneados.length }}
          </div>
          <div class="resumen-item">
            <strong>Total de Pallets:</strong> {{ totalPallets }}
          </div>
        </div>
      </div>

      <!-- Sección de Ubicación de Destino -->
      <div class="seccion-formulario">
        <h3 class="seccion-titulo">📍 Ubicación de Destino</h3>

        <div class="campos-fila">
          <CampoFormulario
            v-model="datos.bodegaDestino"
            etiqueta="Bodega de Destino"
            tipo="select"
            :opciones="bodegasDisponibles"
            :requerido="true"
            :error="errores.bodegaDestino"
            @change="manejarCambioBodegaDestino"
          />

          <CampoFormulario
            v-model="datos.ubicacionDestino"
            etiqueta="Ubicación de Destino"
            tipo="select"
            :opciones="ubicacionesDisponibles"
            :requerido="true"
            :error="errores.ubicacionDestino"
          />
        </div>
      </div>

      <!-- Sección de Observaciones -->
      <div class="seccion-formulario">
        <h3 class="seccion-titulo">📝 Observaciones</h3>

        <div class="campos-fila">
          <CampoFormulario
            v-model="datos.observaciones"
            etiqueta="Observaciones"
            tipo="textarea"
            :filas="3"
            :max-length="500"
            ayuda="Observaciones adicionales de la recepción"
          />
        </div>
      </div>
    </template>
  </FormularioBase>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import {
  usarFormulario,
  validacionesComunes,
} from "@/composables/usarFormulario";
import { servicioMantenedores } from "@/servicios/servicioMantenedores";
import FormularioBase from "@/componentes/comunes/FormularioBase.vue";
import CampoFormulario from "@/componentes/comunes/CampoFormulario.vue";

// Importar Html5Qrcode si está disponible
let Html5Qrcode;
if (typeof window !== "undefined") {
  try {
    Html5Qrcode = window.Html5Qrcode;
  } catch {
    console.warn("Html5Qrcode no está disponible globalmente");
  }
}

// Props
const props = defineProps({
  datosIniciales: {
    type: Object,
    default: () => ({}),
  },
  plantaActual: {
    type: String,
    default: "",
  },
});

// Emits
const emit = defineEmits(["enviar", "cancelar", "material-escaneado"]);

// Estado del formulario
const {
  datos,
  errores,
  validaciones,
  limpiarFormulario,
  mostrarExito,
  mostrarError,
} = usarFormulario({
  datosIniciales: {
    planta: props.plantaActual || "",
    fechaRecepcion: "",
    proveedor: "",
    guiaSii: "",
    bodegaDestino: "",
    ubicacionDestino: "",
    observaciones: "",
    ...props.datosIniciales,
  },
  validaciones: {
    planta: validacionesComunes.requerido,
    fechaRecepcion: validacionesComunes.fecha,
    proveedor: validacionesComunes.requerido,
    bodegaDestino: validacionesComunes.requerido,
    ubicacionDestino: validacionesComunes.requerido,
  },
});

// Referencias
const formularioRef = ref(null);
const contenedorEscaner = ref(null);

// Estado local
const plantasDisponibles = ref([]);
const proveedoresDisponibles = ref([]);
const bodegasDisponibles = ref([]);
const ubicacionesDisponibles = ref([]);
const materialesEscaneados = ref([]);
const codigoManual = ref("");
const escanerActivo = ref(false);
const cargandoEscaner = ref(false);
const ultimoCodigoEscaneado = ref("");

// Variables del escáner
let escaner = null;
let timeoutEscaner = null;

// Computed
const fechaMaxima = computed(() => {
  const hoy = new Date();
  return hoy.toISOString().split("T")[0];
});

const totalPallets = computed(() => {
  return materialesEscaneados.value.reduce((total, material) => {
    return total + (Number(material.pallets) || 0);
  }, 0);
});

// Métodos
async function cargarDatosMaestros() {
  try {
    // Cargar plantas
    const plantas = await servicioMantenedores.obtenerPlantas();
    plantasDisponibles.value = plantas.map((p) => ({
      valor: p.title,
      etiqueta: p.title,
    }));

    // Cargar proveedores
    const proveedores = await servicioMantenedores.obtenerProveedores();
    proveedoresDisponibles.value = proveedores.map((p) => ({
      valor: p.title,
      etiqueta: p.title,
    }));

    // Si hay planta actual, cargar bodegas y ubicaciones
    if (datos.value.planta) {
      await cargarBodegasPorPlanta(datos.value.planta);
    }
  } catch (error) {
    console.error("Error cargando datos maestros:", error);
    mostrarError("Error al cargar datos del sistema");
  }
}

async function cargarBodegasPorPlanta(planta) {
  try {
    const ubicaciones = await servicioMantenedores.obtenerUbicacionesPorPlanta(
      planta
    );

    // Extraer bodegas únicas
    const bodegas = [
      ...new Set(ubicaciones.map((u) => u.bodega_deposito)),
    ].filter(Boolean);
    bodegasDisponibles.value = bodegas.map((b) => ({ valor: b, etiqueta: b }));

    // Guardar ubicaciones para filtrado posterior
    ubicacionesDisponibles.value = ubicaciones.map((u) => ({
      valor: u.title,
      etiqueta: u.title,
      bodega: u.bodega_deposito,
    }));
  } catch (error) {
    console.error("Error cargando bodegas:", error);
    mostrarError("Error al cargar bodegas de la planta");
  }
}

function manejarCambioPlanta(planta) {
  datos.value.bodegaDestino = "";
  datos.value.ubicacionDestino = "";

  if (planta) {
    cargarBodegasPorPlanta(planta);
  } else {
    bodegasDisponibles.value = [];
    ubicacionesDisponibles.value = [];
  }
}

function manejarCambioBodegaDestino(bodega) {
  datos.value.ubicacionDestino = "";

  if (bodega) {
    const ubicaciones = ubicacionesDisponibles.value.filter(
      (u) => u.bodega === bodega
    );
    // Filtrar ubicaciones por bodega seleccionada
    ubicacionesDisponibles.value = ubicaciones;
  }
}

async function iniciarEscaner() {
  if (!contenedorEscaner.value) return;

  cargandoEscaner.value = true;

  try {
    // Verificar si html5-qrcode está disponible
    if (typeof Html5Qrcode === "undefined") {
      throw new Error("Librería de escaneo QR no disponible");
    }

    escaner = new Html5Qrcode("contenedor-escaner");

    const configuracion = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    await escaner.start(
      { facingMode: "environment" },
      configuracion,
      manejarCodigoEscaneado,
      manejarErrorEscaner
    );

    escanerActivo.value = true;
    ultimoCodigoEscaneado.value = "";
  } catch (error) {
    console.error("Error iniciando escáner:", error);
    mostrarError("Error al iniciar el escáner QR");
  } finally {
    cargandoEscaner.value = false;
  }
}

function detenerEscaner() {
  if (escaner) {
    escaner
      .stop()
      .then(() => {
        escanerActivo.value = false;
        escaner = null;
      })
      .catch((error) => {
        console.error("Error deteniendo escáner:", error);
      });
  }
}

function manejarCodigoEscaneado(codigoDecodificado, resultado) {
  const codigo = resultado.text;
  ultimoCodigoEscaneado.value = codigo;

  // Detener escáner después de escanear
  setTimeout(() => {
    detenerEscaner();
  }, 1000);

  // Procesar código escaneado
  procesarCodigoEscaneado(codigo);
}

function manejarErrorEscaner(error) {
  console.error("Error en escaneo:", error);
  // No mostrar error al usuario para evitar spam
}

async function procesarCodigoEscaneado(codigo) {
  try {
    // Buscar material por código
    const material = await servicioMantenedores.obtenerMaterialPorCodigo(
      codigo
    );

    if (!material) {
      mostrarError(`Material no encontrado con código: ${codigo}`);
      return;
    }

    // Verificar si ya existe en la lista
    const existe = materialesEscaneados.value.find((m) => m.codigo === codigo);
    if (existe) {
      mostrarError(`El material ${codigo} ya fue escaneado`);
      return;
    }

    // Agregar material a la lista
    const nuevoMaterial = {
      codigo: material.codigo_ranco,
      nombre: material.nombre_material,
      clasificacion: material.clasificacion,
      unidadMedida: material.unidad_medida,
      lote: "",
      cantidad: "",
      pallets: 0,
      material_id: material.id,
      errores: {},
    };

    materialesEscaneados.value.push(nuevoMaterial);

    emit("material-escaneado", material);

    // Mostrar mensaje de éxito
    mostrarExito(`Material ${codigo} agregado correctamente`);
  } catch (error) {
    console.error("Error procesando código:", error);
    mostrarError("Error al procesar el código escaneado");
  }
}

function agregarCodigoManual() {
  if (!codigoManual.value.trim()) return;

  const codigo = codigoManual.value.trim();
  codigoManual.value = "";

  procesarCodigoEscaneado(codigo);
}

function eliminarMaterial(index) {
  materialesEscaneados.value.splice(index, 1);
}

function validarMaterial(index) {
  const material = materialesEscaneados.value[index];
  if (!material) return;

  const errores = {};

  // Validar lote
  if (!material.lote || material.lote.trim() === "") {
    errores.lote = "El lote es requerido";
  }

  // Validar cantidad
  if (!material.cantidad || Number(material.cantidad) <= 0) {
    errores.cantidad = "La cantidad debe ser mayor a 0";
  }

  material.errores = errores;
}

function validarMaterialesEscaneados() {
  if (materialesEscaneados.value.length === 0) {
    throw new Error("Debe escanear al menos un material");
  }

  let hayErrores = false;

  materialesEscaneados.value.forEach((material, index) => {
    validarMaterial(index);
    if (Object.keys(material.errores).length > 0) {
      hayErrores = true;
    }
  });

  if (hayErrores) {
    throw new Error(
      "Por favor complete todos los campos requeridos de los materiales"
    );
  }
}

async function manejarEnvio(datosFormulario) {
  try {
    // Validar materiales escaneados
    validarMaterialesEscaneados();

    // Preparar datos para envío
    const datosEnvio = {
      ...datosFormulario,
      materiales: materialesEscaneados.value.map((material) => ({
        codigo_material: material.codigo,
        nombre_material: material.nombre,
        lote: material.lote,
        cantidad: Number(material.cantidad),
        pallets: Number(material.pallets) || 0,
        material_id: material.material_id,
      })),
    };

    // Emitir evento de envío
    await emit("enviar", datosEnvio);

    // Limpiar formulario después de éxito
    limpiarFormulario();
    materialesEscaneados.value = [];
    ultimoCodigoEscaneado.value = "";

    return true;
  } catch (error) {
    console.error("Error en envío:", error);
    throw error;
  }
}

function manejarCancelar() {
  // Detener escáner si está activo
  if (escanerActivo.value) {
    detenerEscaner();
  }

  emit("cancelar");
}

// Lifecycle
onMounted(async () => {
  await cargarDatosMaestros();

  // Establecer fecha actual por defecto
  if (!datos.value.fechaRecepcion) {
    datos.value.fechaRecepcion = fechaMaxima.value;
  }
});

onUnmounted(() => {
  // Limpiar timeout y escáner
  if (timeoutEscaner) {
    clearTimeout(timeoutEscaner);
  }

  if (escanerActivo.value) {
    detenerEscaner();
  }
});

// Watchers
watch(
  () => props.plantaActual,
  (nuevaPlanta) => {
    if (nuevaPlanta && nuevaPlanta !== datos.value.planta) {
      datos.value.planta = nuevaPlanta;
      manejarCambioPlanta(nuevaPlanta);
    }
  }
);

// Exponer métodos
defineExpose({
  limpiar: limpiarFormulario,
  validar: () => formularioRef.value?.validarFormulario(),
  obtenerDatos: () => datos.value,
  obtenerMateriales: () => materialesEscaneados.value,
  agregarMaterial: (material) => {
    if (material) {
      const nuevoMaterial = {
        codigo: material.codigo_ranco,
        nombre: material.nombre_material,
        clasificacion: material.clasificacion,
        unidadMedida: material.unidad_medida,
        lote: "",
        cantidad: "",
        pallets: 0,
        material_id: material.id,
        errores: {},
      };
      materialesEscaneados.value.push(nuevoMaterial);
    }
  },
});
</script>

<style scoped>
.seccion-formulario {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background: #f8f9fa;
}

.seccion-titulo {
  margin: 0 0 20px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.campos-fila {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.campos-fila:last-child {
  margin-bottom: 0;
}

.campo-escaner {
  display: flex;
  flex-direction: column;
}

.campo-etiqueta {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
}

.contenedor-escaner {
  position: relative;
  min-height: 200px;
  border: 2px dashed #e9ecef;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.escaner-qr {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.escaner-inactivo,
.escaner-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.codigo-escaneado {
  margin-top: 8px;
  padding: 8px 12px;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  color: #155724;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.icono-exito {
  font-size: 16px;
}

.campo-manual {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sin-materiales {
  text-align: center;
  padding: 40px;
  color: #6c757d;
  font-style: italic;
}

.lista-materiales {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.material-item {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  background: white;
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: 16px;
  align-items: start;
}

.material-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.material-codigo {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.material-nombre {
  color: #495057;
  font-size: 0.85rem;
}

.material-detalles {
  display: flex;
  gap: 8px;
  font-size: 0.8rem;
}

.material-clasificacion,
.material-unidad {
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
  color: #6c757d;
}

.material-campos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.material-acciones {
  display: flex;
  align-items: center;
}

.boton-eliminar {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.boton-eliminar:hover {
  background: #c82333;
}

.resumen-materiales {
  margin-top: 20px;
  padding: 16px;
  background: #e9ecef;
  border-radius: 6px;
  display: flex;
  gap: 24px;
}

.resumen-item {
  font-size: 0.9rem;
  color: #495057;
}

.boton {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.boton-principal {
  background: #007bff;
  color: white;
}

.boton-principal:hover:not(:disabled) {
  background: #0056b3;
}

.boton-secundario {
  background: #6c757d;
  color: white;
}

.boton-secundario:hover:not(:disabled) {
  background: #545b62;
}

.boton:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .campos-fila {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .seccion-formulario {
    padding: 16px;
  }

  .material-item {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .material-campos {
    grid-template-columns: 1fr;
  }

  .resumen-materiales {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
