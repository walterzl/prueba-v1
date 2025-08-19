<template>
  <div class="contenedor-vista">
    <!-- Encabezado -->
    <div class="encabezado-vista">
      <div class="titulo-seccion">
        <h1>Operaciones de Frío y Despacho</h1>
        <p class="subtitulo">
          Gestión y control de operaciones de cámara fría y despachos
        </p>
      </div>
      <div class="acciones-principales">
        <button @click="alternarFormulario" class="boton boton-primario">
          <i class="icono">➕</i>
          Nueva Operación
        </button>
      </div>
    </div>

    <!-- Filtros y Búsqueda -->
    <div class="seccion-filtros">
      <div class="contenedor-busqueda">
        <CampoEntrada
          v-model="filtros.busqueda"
          tipo="text"
          placeholder="Buscar por número de operación, tipo o planta..."
          icono="🔍"
          @input="buscarConRetraso"
        />
      </div>

      <div class="filtros-avanzados">
        <CampoEntrada
          v-model="filtros.tipo_operacion"
          tipo="select"
          etiqueta="Tipo Operación"
          :opciones="tiposOperacion"
          placeholder="Todos los tipos"
        />

        <CampoEntrada
          v-model="filtros.estado"
          tipo="select"
          etiqueta="Estado"
          :opciones="estadosOperacion"
          placeholder="Todos los estados"
        />

        <CampoEntrada
          v-model="filtros.fecha_desde"
          tipo="date"
          etiqueta="Desde"
        />

        <CampoEntrada
          v-model="filtros.fecha_hasta"
          tipo="date"
          etiqueta="Hasta"
        />

        <button @click="limpiarFiltros" class="boton boton-secundario">
          <i class="icono">🗑️</i>
          Limpiar
        </button>
      </div>
    </div>

    <!-- Mensaje de Estado -->
    <MensajeEstado
      v-if="mensaje.texto"
      :tipo="mensaje.tipo"
      :mensaje="mensaje.texto"
      @cerrar="limpiarMensaje"
    />

    <!-- Tabla de Operaciones -->
    <div class="seccion-tabla">
      <TablaReutilizable
        :columnas="columnas"
        :datos="operaciones"
        :cargando="cargando"
        :error="error"
        mensaje-vacio="No se encontraron operaciones de frío y despacho"
        @accion="manejarAccion"
      />
    </div>

    <!-- Paginación -->
    <ComponentePaginacion
      v-if="paginacion.totalPaginas > 1"
      :pagina-actual="paginacion.paginaActual"
      :total-paginas="paginacion.totalPaginas"
      :total-registros="paginacion.totalRegistros"
      @cambiar-pagina="cambiarPagina"
    />

    <!-- Modal de Formulario -->
    <div
      v-if="mostrarFormulario"
      class="modal-overlay"
      @click="cerrarFormulario"
    >
      <div class="modal-contenido" @click.stop>
        <div class="modal-header">
          <h2>{{ operacionEditando ? "Editar" : "Nueva" }} Operación</h2>
          <button @click="cerrarFormulario" class="boton-cerrar">
            &times;
          </button>
        </div>

        <form @submit.prevent="guardarOperacion" class="formulario-modal">
          <div class="campos-formulario">
            <CampoEntrada
              v-model="formulario.tipo_operacion"
              tipo="select"
              etiqueta="Tipo de Operación *"
              :opciones="tiposOperacion"
              :error="errores.tipo_operacion"
              requerido
            />

            <CampoEntrada
              v-model="formulario.planta"
              tipo="select"
              etiqueta="Planta *"
              :opciones="plantas"
              :error="errores.planta"
              requerido
            />

            <CampoEntrada
              v-model="formulario.turno"
              tipo="select"
              etiqueta="Turno *"
              :opciones="turnos"
              :error="errores.turno"
              requerido
            />

            <CampoEntrada
              v-if="formulario.tipo_operacion === 'DESPACHO'"
              v-model="formulario.numero_embarque"
              tipo="text"
              etiqueta="Número de Embarque"
              :error="errores.numero_embarque"
            />

            <CampoEntrada
              v-if="formulario.tipo_operacion === 'DESPACHO'"
              v-model="formulario.patente_camion"
              tipo="text"
              etiqueta="Patente del Camión"
              :error="errores.patente_camion"
            />

            <CampoEntrada
              v-model="formulario.observaciones"
              tipo="textarea"
              etiqueta="Observaciones"
              :error="errores.observaciones"
            />
          </div>

          <div class="acciones-formulario">
            <button
              type="button"
              @click="cerrarFormulario"
              class="boton boton-secundario"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="guardando"
              class="boton boton-primario"
            >
              {{
                guardando
                  ? "Guardando..."
                  : operacionEditando
                  ? "Actualizar"
                  : "Crear"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { servicioOperacionesFrioDespacho } from "@/servicios/servicioOperacionesFrioDespacho";
import { servicioMantenedores } from "@/servicios/servicioMantenedores";
import { validarDatos } from "@/utilidades/validaciones";
import {
  TIPOS_OPERACION_FRIO,
  TURNOS,
  ESTADOS_OPERACION,
} from "@/utilidades/constantes";
import { debounce } from "@/utilidades/auxiliares";

// Componentes
import CampoEntrada from "@/componentes/CampoEntrada.vue";
import MensajeEstado from "@/componentes/MensajeEstado.vue";
import TablaReutilizable from "@/componentes/TablaReutilizable.vue";
import ComponentePaginacion from "@/componentes/ComponentePaginacion.vue";

// Estado principal
const operaciones = ref([]);
const cargando = ref(false);
const error = ref(null);
const mensaje = ref({ tipo: "", texto: "" });

// Paginación
const paginacion = ref({
  paginaActual: 1,
  totalPaginas: 1,
  totalRegistros: 0,
  registrosPorPagina: 15,
});

// Filtros
const filtros = ref({
  busqueda: "",
  tipo_operacion: "",
  estado: "",
  fecha_desde: "",
  fecha_hasta: "",
});

// Formulario
const mostrarFormulario = ref(false);
const guardando = ref(false);
const operacionEditando = ref(null);
const errores = ref({});

const formulario = ref({
  tipo_operacion: "",
  planta: "",
  turno: "",
  numero_embarque: "",
  patente_camion: "",
  observaciones: "",
  estado: "PLANIFICADA",
});

// Datos de mantenedores
const plantas = ref([]);

// Opciones computadas
const tiposOperacion = computed(() =>
  TIPOS_OPERACION_FRIO.map((tipo) => ({ valor: tipo, etiqueta: tipo }))
);

const turnos = computed(() =>
  TURNOS.map((turno) => ({ valor: turno, etiqueta: turno }))
);

const estadosOperacion = computed(() =>
  ESTADOS_OPERACION.map((estado) => ({ valor: estado, etiqueta: estado }))
);

// Configuración de tabla
const columnas = [
  {
    clave: "numero_operacion",
    titulo: "Número",
    ancho: "120px",
    ordenable: true,
  },
  {
    clave: "tipo_operacion",
    titulo: "Tipo",
    ancho: "130px",
  },
  {
    clave: "planta",
    titulo: "Planta",
    ancho: "120px",
  },
  {
    clave: "turno",
    titulo: "Turno",
    ancho: "100px",
  },
  {
    clave: "numero_embarque",
    titulo: "Embarque",
    ancho: "120px",
    formato: (valor) => valor || "N/A",
  },
  {
    clave: "patente_camion",
    titulo: "Patente",
    ancho: "120px",
    formato: (valor) => valor || "N/A",
  },
  {
    clave: "estado",
    titulo: "Estado",
    ancho: "120px",
    componente: "estado",
  },
  {
    clave: "acciones",
    titulo: "Acciones",
    ancho: "120px",
    componente: "acciones",
  },
];

// Métodos
const cargarOperaciones = async (pagina = 1) => {
  cargando.value = true;
  error.value = null;

  try {
    const parametros = {
      pagina,
      limite: paginacion.value.registrosPorPagina,
      ...filtros.value,
    };

    const respuesta = await servicioOperacionesFrioDespacho.obtenerTodos(
      parametros
    );

    operaciones.value = respuesta.datos || [];
    paginacion.value = {
      paginaActual: respuesta.paginacion?.paginaActual || 1,
      totalPaginas: respuesta.paginacion?.totalPaginas || 1,
      totalRegistros: respuesta.paginacion?.totalRegistros || 0,
      registrosPorPagina: respuesta.paginacion?.registrosPorPagina || 15,
    };
  } catch (err) {
    error.value = "Error al cargar las operaciones";
    console.error("Error cargando operaciones:", err);
    mostrarMensaje("error", "Error al cargar las operaciones");
  } finally {
    cargando.value = false;
  }
};

const cargarPlantas = async () => {
  try {
    const respuesta = await servicioMantenedores.obtener("plantas");
    plantas.value =
      respuesta.datos?.map((planta) => ({
        valor: planta.codigo,
        etiqueta: `${planta.codigo} - ${planta.nombre}`,
      })) || [];
  } catch (err) {
    console.error("Error cargando plantas:", err);
  }
};

const buscarConRetraso = debounce(() => {
  paginacion.value.paginaActual = 1;
  cargarOperaciones(1);
}, 500);

const limpiarFiltros = () => {
  filtros.value = {
    busqueda: "",
    tipo_operacion: "",
    estado: "",
    fecha_desde: "",
    fecha_hasta: "",
  };
  cargarOperaciones(1);
};

const alternarFormulario = () => {
  if (mostrarFormulario.value) {
    cerrarFormulario();
  } else {
    abrirFormulario();
  }
};

const abrirFormulario = (operacion = null) => {
  operacionEditando.value = operacion;

  if (operacion) {
    formulario.value = { ...operacion };
  } else {
    reiniciarFormulario();
  }

  errores.value = {};
  mostrarFormulario.value = true;
};

const cerrarFormulario = () => {
  mostrarFormulario.value = false;
  operacionEditando.value = null;
  reiniciarFormulario();
  errores.value = {};
};

const reiniciarFormulario = () => {
  formulario.value = {
    tipo_operacion: "",
    planta: "",
    turno: "",
    numero_embarque: "",
    patente_camion: "",
    observaciones: "",
    estado: "PLANIFICADA",
  };
};

const guardarOperacion = async () => {
  errores.value = {};

  // Validar datos
  const erroresValidacion = validarDatos(
    formulario.value,
    "operacionesFrioDespacho"
  );
  if (erroresValidacion.length > 0) {
    erroresValidacion.forEach((error) => {
      const campo = error.toLowerCase().includes("tipo")
        ? "tipo_operacion"
        : error.toLowerCase().includes("planta")
        ? "planta"
        : error.toLowerCase().includes("turno")
        ? "turno"
        : "general";
      errores.value[campo] = error;
    });
    return;
  }

  guardando.value = true;

  try {
    if (operacionEditando.value) {
      await servicioOperacionesFrioDespacho.actualizar(
        operacionEditando.value.id,
        formulario.value
      );
      mostrarMensaje("exito", "Operación actualizada correctamente");
    } else {
      await servicioOperacionesFrioDespacho.crear(formulario.value);
      mostrarMensaje("exito", "Operación creada correctamente");
    }

    cerrarFormulario();
    await cargarOperaciones(paginacion.value.paginaActual);
  } catch (err) {
    console.error("Error guardando operación:", err);
    mostrarMensaje("error", "Error al guardar la operación");
  } finally {
    guardando.value = false;
  }
};

const eliminarOperacion = async (id) => {
  if (!confirm("¿Está seguro de eliminar esta operación?")) return;

  try {
    await servicioOperacionesFrioDespacho.eliminar(id);
    mostrarMensaje("exito", "Operación eliminada correctamente");
    await cargarOperaciones(paginacion.value.paginaActual);
  } catch (err) {
    console.error("Error eliminando operación:", err);
    mostrarMensaje("error", "Error al eliminar la operación");
  }
};

const cambiarPagina = (nuevaPagina) => {
  paginacion.value.paginaActual = nuevaPagina;
  cargarOperaciones(nuevaPagina);
};

const manejarAccion = (accion, operacion) => {
  switch (accion) {
    case "editar":
      abrirFormulario(operacion);
      break;
    case "eliminar":
      eliminarOperacion(operacion.id);
      break;
    default:
      console.warn("Acción no reconocida:", accion);
  }
};

const mostrarMensaje = (tipo, texto) => {
  mensaje.value = { tipo, texto };
};

const limpiarMensaje = () => {
  mensaje.value = { tipo: "", texto: "" };
};

// Watchers
watch(
  () => filtros.value.tipo_operacion,
  () => {
    paginacion.value.paginaActual = 1;
    cargarOperaciones(1);
  }
);

watch(
  () => filtros.value.estado,
  () => {
    paginacion.value.paginaActual = 1;
    cargarOperaciones(1);
  }
);

watch(
  [() => filtros.value.fecha_desde, () => filtros.value.fecha_hasta],
  () => {
    paginacion.value.paginaActual = 1;
    cargarOperaciones(1);
  }
);

// Inicialización
onMounted(async () => {
  await Promise.all([cargarOperaciones(), cargarPlantas()]);
});
</script>

<style scoped>
.contenedor-vista {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.encabezado-vista {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.titulo-seccion h1 {
  color: #2d3748;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.subtitulo {
  color: #718096;
  font-size: 1rem;
  margin: 0;
}

.acciones-principales {
  display: flex;
  gap: 1rem;
}

.seccion-filtros {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.contenedor-busqueda {
  margin-bottom: 1rem;
}

.filtros-avanzados {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end;
}

.seccion-tabla {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.boton {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.boton-primario {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.boton-primario:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.boton-secundario {
  background: #e2e8f0;
  color: #4a5568;
}

.boton-secundario:hover {
  background: #cbd5e0;
}

.icono {
  font-size: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-contenido {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  margin: 0;
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
}

.boton-cerrar {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  padding: 0.25rem;
  border-radius: 4px;
}

.boton-cerrar:hover {
  background: #f7fafc;
  color: #2d3748;
}

.formulario-modal {
  padding: 1.5rem;
}

.campos-formulario {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.acciones-formulario {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.boton:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.boton:disabled:hover {
  transform: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .contenedor-vista {
    padding: 1rem;
  }

  .encabezado-vista {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .filtros-avanzados {
    grid-template-columns: 1fr;
  }

  .campos-formulario {
    grid-template-columns: 1fr;
  }

  .acciones-formulario {
    flex-direction: column;
  }
}
</style>
