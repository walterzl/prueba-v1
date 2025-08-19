<template>
  <div class="tabla-contenedor">
    <!-- Estado de carga -->
    <div v-if="cargando" class="cargando">
      {{ mensajeCarga }}
    </div>

    <!-- Tabla con datos -->
    <table v-else-if="datos.length > 0" class="tabla tabla-reutilizable">
      <thead>
        <tr>
          <th
            v-for="columna in columnas"
            :key="columna.clave"
            :class="[
              columna.claseEncabezado,
              columna.alineacion === 'centro' ? 'texto-centrado' : '',
              columna.alineacion === 'derecha' ? 'texto-derecha' : '',
            ]"
            :style="columna.ancho ? { width: columna.ancho } : {}"
          >
            {{ columna.titulo }}
          </th>
          <th v-if="$slots.acciones" class="texto-centrado">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="fila in datos" :key="obtenerClaveUnica(fila)">
          <td
            v-for="columna in columnas"
            :key="columna.clave"
            :class="[
              columna.claseCelda,
              columna.alineacion === 'centro' ? 'texto-centrado' : '',
              columna.alineacion === 'derecha' ? 'texto-derecha' : '',
            ]"
          >
            <!-- Slot personalizado para la columna si existe -->
            <slot
              :name="`columna-${columna.clave}`"
              :fila="fila"
              :valor="obtenerValorColumna(fila, columna.clave)"
            >
              <!-- Valor por defecto -->
              {{
                formatearValor(
                  obtenerValorColumna(fila, columna.clave),
                  columna
                )
              }}
            </slot>
          </td>

          <!-- Columna de acciones si se proporciona -->
          <td v-if="$slots.acciones" class="texto-centrado">
            <slot
              name="acciones"
              :fila="fila"
              :indice="datos.indexOf(fila)"
            ></slot>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Estado vacío -->
    <div v-else class="estado-vacio">
      <div class="icono-vacio">📦</div>
      <h3>{{ tituloVacio }}</h3>
      <p>{{ mensajeVacio }}</p>
      <slot name="accion-vacio"></slot>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  datos: {
    type: Array,
    default: () => [],
  },
  columnas: {
    type: Array,
    required: true,
    validator: (columnas) => {
      return columnas.every((col) => col.clave && col.titulo);
    },
  },
  cargando: {
    type: Boolean,
    default: false,
  },
  mensajeCarga: {
    type: String,
    default: "Cargando datos...",
  },
  tituloVacio: {
    type: String,
    default: "No hay datos disponibles",
  },
  mensajeVacio: {
    type: String,
    default: "No se encontraron registros que mostrar",
  },
  claveUnica: {
    type: String,
    default: "id",
  },
});

// Métodos de utilidad
function obtenerClaveUnica(fila) {
  return fila[props.claveUnica] || Math.random();
}

function obtenerValorColumna(fila, clave) {
  // Soporte para claves anidadas como 'usuario.nombre'
  return clave.split(".").reduce((obj, key) => obj?.[key], fila);
}

function formatearValor(valor, columna) {
  if (valor === null || valor === undefined) {
    return "-";
  }

  // Aplicar formato específico de la columna si existe
  if (columna.formato) {
    return columna.formato(valor);
  }

  // Formatos por tipo
  switch (columna.tipo) {
    case "fecha":
      return new Date(valor).toLocaleDateString("es-ES");
    case "fechaHora":
      return new Date(valor).toLocaleString("es-ES");
    case "numero":
      return Number(valor).toLocaleString("es-ES");
    case "moneda":
      return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "CLP",
      }).format(valor);
    case "porcentaje":
      return `${Number(valor)}%`;
    default:
      return String(valor);
  }
}
</script>

<style scoped>
.tabla-contenedor {
  width: 100%;
}

.cargando {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #6b7280;
  font-size: 1rem;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tabla thead {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.tabla th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tabla td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  color: #1f2937;
  font-size: 0.875rem;
  vertical-align: middle;
}

.tabla tbody tr:hover {
  background: #f9fafb;
}

.tabla tbody tr:last-child td {
  border-bottom: none;
}

.texto-centrado {
  text-align: center;
}

.texto-derecha {
  text-align: right;
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
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}
</style>
