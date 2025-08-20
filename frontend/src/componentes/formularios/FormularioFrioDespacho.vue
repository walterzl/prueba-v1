<template>
  <FormularioBase
    titulo="Operación de Frío y Despacho"
    descripcion="Registrar nueva operación de cámara fría o despacho"
    @enviar="manejarEnvio"
    @cancelar="$emit('cancelar')"
  >
    <template #campos>
      <div class="campos-formulario">
        <!-- Primera fila -->
        <div class="fila-campos">
          <CampoFormulario
            v-model="datos.tipoOperacion"
            tipo="select"
            etiqueta="Tipo de Operación"
            :opciones="tiposOperacion"
            :validacion="validaciones.tipoOperacion"
            :error="errores.tipoOperacion"
            @validacion="validarCampo"
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
            v-model="datos.fechaOperacion"
            tipo="date"
            etiqueta="Fecha de Operación"
            :validacion="validaciones.fechaOperacion"
            :error="errores.fechaOperacion"
            @validacion="validarCampo"
            requerido
          />

          <CampoFormulario
            v-model="datos.horaOperacion"
            tipo="time"
            etiqueta="Hora de Operación"
            :validacion="validaciones.horaOperacion"
            :error="errores.horaOperacion"
            @validacion="validarCampo"
            requerido
          />
        </div>

        <!-- Tercera fila -->
        <div class="fila-campos">
          <CampoFormulario
            v-model="datos.turno"
            tipo="select"
            etiqueta="Turno"
            :opciones="turnosDisponibles"
            :validacion="validaciones.turno"
            :error="errores.turno"
            @validacion="validarCampo"
            requerido
          />

          <CampoFormulario
            v-model="datos.temperatura"
            tipo="number"
            etiqueta="Temperatura (°C)"
            placeholder="Ej: -18"
            paso="0.1"
            :validacion="validaciones.temperatura"
            :error="errores.temperatura"
            @validacion="validarCampo"
            requerido
          />
        </div>

        <!-- Cuarta fila -->
        <div class="fila-campos">
          <CampoFormulario
            v-model="datos.humedad"
            tipo="number"
            etiqueta="Humedad (%)"
            placeholder="Ej: 85"
            paso="1"
            minimo="0"
            maximo="100"
            :validacion="validaciones.humedad"
            :error="errores.humedad"
            @validacion="validarCampo"
          />

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
        </div>

        <!-- Cuarta fila -->
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

        <!-- Quinta fila -->
        <div class="fila-campos">
          <CampoFormulario
            v-model="datos.nombreMaterial"
            tipo="text"
            etiqueta="Nombre del Material"
            placeholder="Se completará automáticamente"
            solo-lectura
          />

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
        </div>

        <!-- Sexta fila -->
        <div class="fila-campos">
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
        </div>

        <!-- Séptima fila -->
        <div class="fila-campos">
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

          <CampoFormulario
            v-model="datos.cliente"
            tipo="text"
            etiqueta="Cliente"
            placeholder="Nombre del cliente"
            :validacion="validaciones.cliente"
            :error="errores.cliente"
            @validacion="validarCampo"
            v-if="mostrarCampoCliente"
          />
        </div>

        <!-- Octava fila -->
        <div class="fila-campos">
          <CampoFormulario
            v-model="datos.numeroEmbarque"
            tipo="text"
            etiqueta="Número de Embarque"
            placeholder="Ej: EMB-2024-001"
            :validacion="validaciones.numeroEmbarque"
            :error="errores.numeroEmbarque"
            @validacion="validarCampo"
            v-if="mostrarCampoEmbarque"
          />

          <CampoFormulario
            v-model="datos.observaciones"
            tipo="textarea"
            etiqueta="Observaciones"
            placeholder="Información adicional sobre la operación..."
            :filas="3"
            texto-ayuda="Opcional: detalles adicionales de la operación"
          />
        </div>
      </div>
    </template>

    <template #acciones="{ enviando, formularioValido }">
      <button
        type="submit"
        class="boton boton-principal"
        :disabled="!formularioValido || enviando"
      >
        <span v-if="enviando" class="spinner"></span>
        <span v-else>💾 Guardar Operación</span>
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
const { datos, errores, validaciones, validarCampo, enviarFormulario } =
  usarFormulario({
    datosIniciales: {
      tipoOperacion: "",
      planta: "Rancagua",
      fechaOperacion: new Date().toISOString().slice(0, 10),
      horaOperacion: new Date().toTimeString().slice(0, 5),
      turno: "Turno 1",
      temperatura: "",
      humedad: "",
      codigoMaterial: "",
      nombreMaterial: "",
      lote: "",
      cantidad: "",
      bodega: "",
      ubicacion: "",
      cliente: "",
      numeroEmbarque: "",
      observaciones: "",
    },
    validaciones: {
      tipoOperacion: validacionesComunes.requerido,
      planta: validacionesComunes.requerido,
      fechaOperacion: validacionesComunes.fecha,
      horaOperacion: validacionesComunes.requerido,
      turno: validacionesComunes.requerido,
      temperatura: { ...validacionesComunes.numero, minimo: -50, maximo: 50 },
      humedad: { ...validacionesComunes.numero, minimo: 0, maximo: 100 },
      codigoMaterial: validacionesComunes.requerido,
      lote: validacionesComunes.requerido,
      cantidad: validacionesComunes.cantidad,
      bodega: validacionesComunes.requerido,
      ubicacion: validacionesComunes.requerido,
      cliente: { ...validacionesComunes.texto, requerido: false },
      numeroEmbarque: { ...validacionesComunes.texto, requerido: false },
    },
  });

// Datos maestros
const plantasDisponibles = ref([]);
const tiposOperacion = ref([]);
const turnosDisponibles = ref([]);
const bodegasDisponibles = ref([]);
const ubicacionesDisponibles = ref([]);

// Computed properties
const mostrarCampoCliente = computed(() =>
  ["Despacho", "Embarque"].includes(datos.value.tipoOperacion)
);
const mostrarCampoEmbarque = computed(() =>
  ["Embarque"].includes(datos.value.tipoOperacion)
);

// Métodos
async function cargarDatosMaestros() {
  try {
    const [plantas, tipos, turnos, bodegas, ubicaciones] = await Promise.all([
      servicioMantenedores.obtenerPlantas(),
      servicioMantenedores.obtenerTiposOperacion(),
      servicioMantenedores.obtenerTurnos(),
      servicioMantenedores.obtenerBodegas(),
      servicioMantenedores.obtenerUbicaciones(),
    ]);

    plantasDisponibles.value = plantas || [];
    tiposOperacion.value = tipos || [];
    turnosDisponibles.value = turnos || [];
    bodegasDisponibles.value = bodegas || [];
    ubicacionesDisponibles.value = ubicaciones || [];
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

async function manejarEnvio() {
  try {
    await enviarFormulario(async () => {
      // Preparar datos para la API
      const datosEnvio = {
        tipo_operacion: datos.value.tipoOperacion,
        planta: datos.value.planta,
        fecha_operacion: `${datos.value.fechaOperacion}T${datos.value.horaOperacion}`,
        turno: datos.value.turno,
        temperatura: parseFloat(datos.value.temperatura),
        humedad: datos.value.humedad ? parseInt(datos.value.humedad) : null,
        codigo_material: datos.value.codigoMaterial,
        nombre_material: datos.value.nombreMaterial,
        lote: datos.value.lote,
        cantidad: parseFloat(datos.value.cantidad),
        bodega: datos.value.bodega,
        ubicacion: datos.value.ubicacion,
        cliente: datos.value.cliente,
        numero_embarque: datos.value.numeroEmbarque,
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
