<template>
  <FormularioBase
    titulo="Gestión de Tarjas"
    descripcion="Registrar nueva tarja CAA o de bodega"
    @enviar="manejarEnvio"
    @cancelar="$emit('cancelar')"
  >
    <template #campos>
      <div class="campos-formulario">
        <!-- Primera fila -->
        <div class="fila-campos">
          <CampoFormulario
            v-model="datos.tipoTarja"
            tipo="select"
            etiqueta="Tipo de Tarja"
            :opciones="tiposTarja"
            :validacion="validaciones.tipoTarja"
            :error="errores.tipoTarja"
            @validacion="validarCampo"
            @cambio="manejarCambioTipoTarja"
            requerido
          />

          <CampoFormulario
            v-model="datos.planta"
            tipo="select"
            etiqueta="Planta"
            :opciones="plantasDisponibles"
            :validacion="validaciones.planta"
            :error="errores.planta"
            @validacion="validarCampo"
            @cambio="manejarCambioPlanta"
            requerido
          />
        </div>

        <!-- Segunda fila -->
        <div class="fila-campos">
          <CampoFormulario
            v-model="datos.numeroTarja"
            tipo="text"
            etiqueta="Número de Tarja"
            placeholder="Se genera automáticamente"
            solo-lectura
            texto-ayuda="El número se asigna automáticamente al guardar"
          />

          <CampoFormulario
            v-model="datos.fechaCreacion"
            tipo="datetime-local"
            etiqueta="Fecha de Creación"
            :validacion="validaciones.fechaCreacion"
            :error="errores.fechaCreacion"
            @validacion="validarCampo"
            requerido
          />
        </div>

        <!-- Tercera fila -->
        <div class="fila-campos">
          <CampoFormulario
            v-model="datos.codigoMaterial"
            tipo="text"
            etiqueta="Código del Material"
            placeholder="Ej: BOGR2062"
            :validacion="validaciones.codigoMaterial"
            :error="errores.codigoMaterial"
            @validacion="validarCampo"
            @cambio="buscarMaterial"
            requerido
          />

          <CampoFormulario
            v-model="datos.nombreMaterial"
            tipo="text"
            etiqueta="Nombre del Material"
            placeholder="Se completará automáticamente"
            solo-lectura
          />
        </div>

        <!-- Cuarta fila -->
        <div class="fila-campos">
          <CampoFormulario
            v-model="datos.lote"
            tipo="text"
            etiqueta="Lote"
            placeholder="Ej: L2024-001"
            :validacion="validaciones.lote"
            :error="errores.lote"
            @validacion="validarCampo"
            requerido
          />

          <CampoFormulario
            v-model="datos.cantidad"
            tipo="number"
            etiqueta="Cantidad"
            placeholder="0"
            paso="0.01"
            minimo="0"
            :validacion="validaciones.cantidad"
            :error="errores.cantidad"
            @validacion="validarCampo"
            requerido
          />
        </div>

        <!-- Quinta fila -->
        <div class="fila-campos">
          <CampoFormulario
            v-model="datos.bodega"
            tipo="select"
            etiqueta="Bodega"
            :opciones="bodegasDisponibles"
            :validacion="validaciones.bodega"
            :error="errores.bodega"
            @validacion="validarCampo"
            @cambio="manejarCambioBodega"
            requerido
          />

          <CampoFormulario
            v-model="datos.ubicacion"
            tipo="select"
            etiqueta="Ubicación"
            :opciones="ubicacionesDisponibles"
            :validacion="validaciones.ubicacion"
            :error="errores.ubicacion"
            @validacion="validarCampo"
            requerido
          />
        </div>

        <!-- Sexta fila - Campos específicos de tarja CAA -->
        <div class="fila-campos" v-if="mostrarCamposCAA">
          <CampoFormulario
            v-model="datos.certificacionCAA"
            tipo="select"
            etiqueta="Certificación CAA"
            :opciones="certificacionesCAA"
            :validacion="validaciones.certificacionCAA"
            :error="errores.certificacionCAA"
            @validacion="validarCampo"
            requerido
          />

          <CampoFormulario
            v-model="datos.fechaVencimiento"
            tipo="date"
            etiqueta="Fecha de Vencimiento"
            :validacion="validaciones.fechaVencimiento"
            :error="errores.fechaVencimiento"
            @validacion="validarCampo"
            requerido
          />
        </div>

        <!-- Séptima fila - Campos específicos de tarja de bodega -->
        <div class="fila-campos" v-if="mostrarCamposBodega">
          <CampoFormulario
            v-model="datos.estadoTarja"
            tipo="select"
            etiqueta="Estado de Tarja"
            :opciones="estadosTarja"
            :validacion="validaciones.estadoTarja"
            :error="errores.estadoTarja"
            @validacion="validarCampo"
            requerido
          />

          <CampoFormulario
            v-model="datos.prioridad"
            tipo="select"
            etiqueta="Prioridad"
            :opciones="prioridades"
            :validacion="validaciones.prioridad"
            :error="errores.prioridad"
            @validacion="validarCampo"
          />
        </div>

        <!-- Octava fila -->
        <div class="fila-campos fila-completa">
          <CampoFormulario
            v-model="datos.observaciones"
            tipo="textarea"
            etiqueta="Observaciones"
            placeholder="Información adicional sobre la tarja..."
            :filas="3"
            texto-ayuda="Opcional: detalles adicionales de la tarja"
          />
        </div>
      </div>
    </template>

    <template #acciones="{ valido }">
      <button
        type="submit"
        class="boton boton-principal"
        :disabled="!valido || enviando"
      >
        <span v-if="enviando" class="spinner"></span>
        <span v-else>🏷️ Guardar Tarja</span>
      </button>
      <button
        type="button"
        class="boton boton-secundario"
        @click="$emit('cancelar')"
        :disabled="enviando"
      >
        Cancelar
      </button>
    </template>
  </FormularioBase>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  usarFormulario,
  validacionesComunes,
} from "@/composables/usarFormulario";
import { servicioMantenedores } from "@/servicios/servicioMantenedores";
import FormularioBase from "@/componentes/comunes/FormularioBase.vue";
import CampoFormulario from "@/componentes/comunes/CampoFormulario.vue";

const emit = defineEmits(["enviar", "cancelar"]);

// Configuración del formulario
const {
  datos,
  errores,
  enviando,
  validaciones,
  validarCampo,
  enviarFormulario,
} = usarFormulario({
  datosIniciales: {
    tipoTarja: "",
    planta: "Rancagua",
    numeroTarja: "",
    fechaCreacion: new Date().toISOString().slice(0, 16),
    codigoMaterial: "",
    nombreMaterial: "",
    lote: "",
    cantidad: "",
    bodega: "",
    ubicacion: "",
    certificacionCAA: "",
    fechaVencimiento: "",
    estadoTarja: "Activa",
    prioridad: "Normal",
    observaciones: "",
  },
  validaciones: {
    tipoTarja: validacionesComunes.requerido,
    planta: validacionesComunes.requerido,
    fechaCreacion: validacionesComunes.fecha,
    codigoMaterial: validacionesComunes.requerido,
    lote: validacionesComunes.requerido,
    cantidad: validacionesComunes.cantidad,
    bodega: validacionesComunes.requerido,
    ubicacion: validacionesComunes.requerido,
    certificacionCAA: { ...validacionesComunes.requerido, requerido: false },
    fechaVencimiento: { ...validacionesComunes.fecha, requerido: false },
    estadoTarja: { ...validacionesComunes.requerido, requerido: false },
    prioridad: { ...validacionesComunes.requerido, requerido: false },
  },
});

// Datos maestros
const plantasDisponibles = ref([]);
const tiposTarja = ref([]);
const bodegasDisponibles = ref([]);
const ubicacionesDisponibles = ref([]);
const certificacionesCAA = ref([]);
const estadosTarja = ref([]);
const prioridades = ref([]);

// Computed properties
const mostrarCamposCAA = computed(() => datos.value.tipoTarja === "CAA");
const mostrarCamposBodega = computed(() => datos.value.tipoTarja === "Bodega");

// Métodos
async function cargarDatosMaestros() {
  try {
    const [
      plantas,
      tipos,
      bodegas,
      ubicaciones,
      certificaciones,
      estados,
      prioridadesList,
    ] = await Promise.all([
      servicioMantenedores.obtenerPlantas(),
      servicioMantenedores.obtenerTiposTarja(),
      servicioMantenedores.obtenerBodegas(),
      servicioMantenedores.obtenerUbicaciones(),
      servicioMantenedores.obtenerCertificacionesCAA(),
      servicioMantenedores.obtenerEstadosTarja(),
      servicioMantenedores.obtenerPrioridades(),
    ]);

    plantasDisponibles.value = plantas || [];
    tiposTarja.value = tipos || [];
    bodegasDisponibles.value = bodegas || [];
    ubicacionesDisponibles.value = ubicaciones || [];
    certificacionesCAA.value = certificaciones || [];
    estadosTarja.value = estados || [];
    prioridades.value = prioridadesList || [];
  } catch (error) {
    console.error("Error al cargar datos maestros:", error);
  }
}

async function buscarMaterial() {
  const codigo = datos.value.codigoMaterial?.trim();
  if (!codigo || codigo.length < 2) {
    datos.value.nombreMaterial = "";
    return;
  }

  try {
    const material = await servicioMantenedores.obtenerMaterialPorCodigo(
      codigo
    );
    if (material) {
      datos.value.nombreMaterial = material.nombre_material || "";
    } else {
      datos.value.nombreMaterial = "";
    }
  } catch (error) {
    console.error("Error al buscar material:", error);
    datos.value.nombreMaterial = "";
  }
}

function manejarCambioTipoTarja(tipo) {
  // Limpiar campos específicos cuando cambia el tipo
  if (tipo === "CAA") {
    datos.value.estadoTarja = "";
    datos.value.prioridad = "";
  } else if (tipo === "Bodega") {
    datos.value.certificacionCAA = "";
    datos.value.fechaVencimiento = "";
  }
}

function manejarCambioPlanta(planta) {
  datos.value.bodega = "";
  datos.value.ubicacion = "";
  // Filtrar bodegas por planta
  bodegasDisponibles.value = bodegasDisponibles.value.filter(
    (b) => b.planta === planta
  );
}

function manejarCambioBodega(bodega) {
  datos.value.ubicacion = "";
  // Filtrar ubicaciones por bodega
  ubicacionesDisponibles.value = ubicacionesDisponibles.value.filter(
    (u) => u.bodega === bodega
  );
}

function generarNumeroTarja() {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const tipo = datos.value.tipoTarja === "CAA" ? "CAA" : "BOD";
  const numero = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${tipo}-${año}-${numero}`;
}

async function manejarEnvio() {
  try {
    await enviarFormulario(async () => {
      // Generar número de tarja si no existe
      if (!datos.value.numeroTarja) {
        datos.value.numeroTarja = generarNumeroTarja();
      }

      // Preparar datos para la API
      const datosEnvio = {
        tipo_tarja: datos.value.tipoTarja,
        planta: datos.value.planta,
        numero_tarja: datos.value.numeroTarja,
        fecha_creacion: datos.value.fechaCreacion,
        codigo_material: datos.value.codigoMaterial,
        nombre_material: datos.value.nombreMaterial,
        lote: datos.value.lote,
        cantidad: parseFloat(datos.value.cantidad),
        bodega: datos.value.bodega,
        ubicacion: datos.value.ubicacion,
        certificacion_caa: datos.value.certificacionCAA,
        fecha_vencimiento: datos.value.fechaVencimiento,
        estado_tarja: datos.value.estadoTarja,
        prioridad: datos.value.prioridad,
        observaciones: datos.value.observaciones,
      };

      // Emitir evento con los datos
      emit("enviar", datosEnvio);
    });
  } catch (error) {
    console.error("Error en el formulario:", error);
  }
}

// Lifecycle
onMounted(async () => {
  await cargarDatosMaestros();
});

// Watchers
watch(() => datos.value.planta, manejarCambioPlanta);
watch(() => datos.value.bodega, manejarCambioBodega);
</script>

<style scoped>
.campos-formulario {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.fila-campos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.fila-completa {
  grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .fila-campos {
    grid-template-columns: 1fr;
  }
}
</style>
