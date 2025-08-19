<!--
  Componente Modal para generar y escanear códigos QR
  Nomenclatura en español y arquitectura limpia
-->

<template>
  <div v-if="visible" class="modal-overlay" @click.self="cerrarModal">
    <div class="modal-qr">
      <!-- Cabecera del modal -->
      <div class="modal-cabecera">
        <h3 class="modal-titulo">
          <i :class="iconoModo" class="icono-titulo"></i>
          {{ tituloModal }}
        </h3>
        <button @click="cerrarModal" class="boton-cerrar" type="button">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Contenido del modal -->
      <div class="modal-contenido">
        <!-- Navegación por pestañas -->
        <div class="pestanas-navegacion">
          <button
            @click="cambiarPestana('generar')"
            :class="{ 'pestana-activa': pestanaActiva === 'generar' }"
            class="pestana-boton"
            type="button"
          >
            <i class="fas fa-qrcode"></i>
            Generar QR
          </button>
          <button
            @click="cambiarPestana('escanear')"
            :class="{ 'pestana-activa': pestanaActiva === 'escanear' }"
            class="pestana-boton"
            type="button"
          >
            <i class="fas fa-camera"></i>
            Escanear QR
          </button>
        </div>

        <!-- Contenido de generar QR -->
        <div v-if="pestanaActiva === 'generar'" class="seccion-contenido">
          <!-- Información de la tarja -->
          <div v-if="datosTarja" class="informacion-tarja">
            <h4>Información de la Tarja</h4>
            <div class="grid-informacion">
              <div class="campo-informacion">
                <span class="etiqueta">Número Tarja:</span>
                <span class="valor">{{ datosTarja.numero_tarja }}</span>
              </div>
              <div class="campo-informacion">
                <span class="etiqueta">Planta:</span>
                <span class="valor">{{ datosTarja.planta }}</span>
              </div>
              <div class="campo-informacion">
                <span class="etiqueta">Material:</span>
                <span class="valor">{{
                  obtenerNombreMaterial(datosTarja)
                }}</span>
              </div>
              <div class="campo-informacion">
                <span class="etiqueta">Lote:</span>
                <span class="valor">{{ datosTarja.lote || "N/A" }}</span>
              </div>
              <div class="campo-informacion">
                <span class="etiqueta">Cantidad:</span>
                <span class="valor">{{
                  formatearCantidad(datosTarja.cantidad)
                }}</span>
              </div>
              <div class="campo-informacion">
                <span class="etiqueta">Estado:</span>
                <span
                  class="valor estado-badge"
                  :class="`estado-${datosTarja.estado?.toLowerCase()}`"
                >
                  {{ datosTarja.estado }}
                </span>
              </div>
            </div>
          </div>

          <!-- Área de generación QR -->
          <div class="area-generacion">
            <button
              @click="generar"
              :disabled="generandoQR || !datosTarja"
              class="boton-generar-qr"
              type="button"
            >
              <i v-if="generandoQR" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-qrcode"></i>
              {{ generandoQR ? "Generando..." : "Generar Código QR" }}
            </button>
          </div>

          <!-- Código QR generado -->
          <div v-if="codigoQRGenerado" class="qr-generado">
            <div class="contenedor-qr">
              <img
                :src="codigoQRGenerado"
                alt="Código QR de la tarja"
                class="imagen-qr"
              />
            </div>
            <div class="acciones-qr">
              <button
                @click="descargarQR"
                class="boton-descargar"
                type="button"
              >
                <i class="fas fa-download"></i>
                Descargar QR
              </button>
              <button @click="imprimirQR" class="boton-imprimir" type="button">
                <i class="fas fa-print"></i>
                Imprimir QR
              </button>
            </div>
          </div>
        </div>

        <!-- Contenido de escanear QR -->
        <div v-if="pestanaActiva === 'escanear'" class="seccion-contenido">
          <!-- Opciones de escaneo -->
          <div class="opciones-escaneo">
            <button
              @click="iniciarEscaneoCamera"
              :disabled="escaneandoQR"
              class="boton-escaneo"
              type="button"
            >
              <i class="fas fa-camera"></i>
              {{ escaneandoQR ? "Escaneando..." : "Usar Cámara" }}
            </button>

            <div class="separador-o">o</div>

            <div class="subida-archivo">
              <input
                ref="inputArchivo"
                @change="manejarArchivoSubido"
                type="file"
                accept="image/*"
                class="input-archivo-oculto"
              />
              <button
                @click="$refs.inputArchivo.click()"
                class="boton-archivo"
                type="button"
              >
                <i class="fas fa-image"></i>
                Subir Imagen
              </button>
            </div>
          </div>

          <!-- Área del escáner -->
          <div v-if="escaneandoQR" class="area-escaner">
            <div id="qr-reader" class="qr-reader-contenedor"></div>
            <button
              @click="detenerEscaneo"
              class="boton-detener-escaneo"
              type="button"
            >
              <i class="fas fa-stop"></i>
              Detener Escáner
            </button>
          </div>

          <!-- Resultado del escaneo -->
          <div v-if="datosEscaneados" class="resultado-escaneo">
            <h4>Datos Escaneados</h4>
            <div
              v-if="typeof datosEscaneados === 'object'"
              class="datos-estructurados"
            >
              <div class="grid-informacion">
                <div
                  v-for="(valor, clave) in datosEscaneados"
                  :key="clave"
                  class="campo-informacion"
                >
                  <span class="etiqueta"
                    >{{ formatearEtiquetaCampo(clave) }}:</span
                  >
                  <span class="valor">{{
                    formatearValorCampo(clave, valor)
                  }}</span>
                </div>
              </div>
            </div>
            <div v-else class="datos-texto">
              <pre class="texto-crudo">{{ datosEscaneados }}</pre>
            </div>

            <div class="acciones-resultado">
              <button
                @click="procesarDatosEscaneados"
                class="boton-procesar"
                type="button"
              >
                <i class="fas fa-check"></i>
                Procesar Datos
              </button>
              <button
                @click="limpiarResultados"
                class="boton-limpiar"
                type="button"
              >
                <i class="fas fa-trash"></i>
                Limpiar
              </button>
            </div>
          </div>
        </div>

        <!-- Área de errores -->
        <div v-if="errorQR" class="area-error">
          <div class="mensaje-error">
            <i class="fas fa-exclamation-triangle"></i>
            {{ errorQR }}
          </div>
        </div>
      </div>

      <!-- Pie del modal -->
      <div class="modal-pie">
        <button @click="cerrarModal" class="boton-cancelar" type="button">
          <i class="fas fa-times"></i>
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { usarCodigoQR } from "@/composables/usarCodigoQR";
import { formatearFecha, formatearNumero } from "@/utilidades/formateadores";

export default {
  name: "ModalCodigoQR",

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    datosTarja: {
      type: Object,
      default: null,
    },
    modo: {
      type: String,
      default: "generar", // 'generar' | 'escanear'
      validator: (valor) => ["generar", "escanear"].includes(valor),
    },
  },

  emits: ["cerrar", "qr-generado", "qr-escaneado", "datos-procesados"],

  setup(props, { emit }) {
    // Composable de códigos QR
    const {
      generandoQR,
      escaneandoQR,
      codigoQRGenerado,
      datosEscaneados,
      errorQR,
      generarCodigoQR,
      iniciarEscanerQR,
      detenerEscanerQR,
      escanearQRDesdeArchivo,
      descargarCodigoQR,
      limpiarEstados,
    } = usarCodigoQR();

    // Estados locales
    const pestanaActiva = ref(props.modo);
    const inputArchivo = ref(null);

    // Computadas
    const tituloModal = computed(() => {
      return pestanaActiva.value === "generar"
        ? "Generar Código QR"
        : "Escanear Código QR";
    });

    const iconoModo = computed(() => {
      return pestanaActiva.value === "generar"
        ? "fas fa-qrcode"
        : "fas fa-camera";
    });

    // Métodos
    const cambiarPestana = (nuevaPestana) => {
      if (escaneandoQR.value) {
        detenerEscanerQR();
      }
      limpiarEstados();
      pestanaActiva.value = nuevaPestana;
    };

    const cerrarModal = () => {
      if (escaneandoQR.value) {
        detenerEscanerQR();
      }
      limpiarEstados();
      emit("cerrar");
    };

    const obtenerNombreMaterial = (tarja) => {
      if (tarja.nombre_material) return tarja.nombre_material;
      if (tarja.material?.nombre) return tarja.material.nombre;
      if (tarja.codigo_material) return tarja.codigo_material;
      if (tarja.material?.codigo) return tarja.material.codigo;
      return "N/A";
    };

    const formatearCantidad = (cantidad) => {
      if (!cantidad) return "N/A";
      return formatearNumero(cantidad);
    };

    const generar = async () => {
      if (!props.datosTarja) return;

      try {
        const urlQR = await generarCodigoQR(props.datosTarja);
        emit("qr-generado", {
          url: urlQR,
          tarja: props.datosTarja,
        });
      } catch (error) {
        console.error("Error al generar QR:", error);
      }
    };

    const descargarQR = () => {
      if (!codigoQRGenerado.value || !props.datosTarja) return;

      const nombreArchivo = `qr-tarja-${props.datosTarja.numero_tarja}`;
      descargarCodigoQR(codigoQRGenerado.value, nombreArchivo);
    };

    const imprimirQR = () => {
      if (!codigoQRGenerado.value) return;

      const ventanaImpresion = window.open("", "_blank");
      ventanaImpresion.document.write(`
        <html>
          <head>
            <title>Código QR - Tarja ${props.datosTarja?.numero_tarja}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px; 
              }
              .qr-container { margin: 20px 0; }
              .info-tarja { margin: 10px 0; font-size: 14px; }
            </style>
          </head>
          <body>
            <h2>Código QR - Tarja ${props.datosTarja?.numero_tarja}</h2>
            <div class="info-tarja">
              <p>Planta: ${props.datosTarja?.planta}</p>
              <p>Material: ${obtenerNombreMaterial(props.datosTarja)}</p>
              <p>Lote: ${props.datosTarja?.lote || "N/A"}</p>
            </div>
            <div class="qr-container">
              <img src="${
                codigoQRGenerado.value
              }" alt="Código QR" style="max-width: 200px;">
            </div>
            <p style="font-size: 12px; color: #666;">
              Generado el ${formatearFecha(new Date())}
            </p>
          </body>
        </html>
      `);
      ventanaImpresion.document.close();
      ventanaImpresion.print();
    };

    const iniciarEscaneoCamera = async () => {
      try {
        await iniciarEscanerQR(
          "qr-reader",
          (datos, textoOriginal) => {
            emit("qr-escaneado", { datos, textoOriginal });
          },
          (error) => {
            console.error("Error en escaneo:", error);
          }
        );
      } catch (error) {
        console.error("Error al iniciar escáner:", error);
      }
    };

    const detenerEscaneo = async () => {
      await detenerEscanerQR();
    };

    const manejarArchivoSubido = async (evento) => {
      const archivo = evento.target.files[0];
      if (!archivo) return;

      try {
        await escanearQRDesdeArchivo(
          archivo,
          (datos, textoOriginal) => {
            emit("qr-escaneado", { datos, textoOriginal });
          },
          (error) => {
            console.error("Error al escanear archivo:", error);
          }
        );
      } catch (error) {
        console.error("Error al procesar archivo:", error);
      }

      // Limpiar input
      if (inputArchivo.value) {
        inputArchivo.value.value = "";
      }
    };

    const formatearEtiquetaCampo = (clave) => {
      const etiquetas = {
        id: "ID",
        numeroTarja: "Número Tarja",
        planta: "Planta",
        codigoMaterial: "Código Material",
        nombreMaterial: "Nombre Material",
        lote: "Lote",
        cantidad: "Cantidad",
        fechaGeneracion: "Fecha Generación",
        tipoTarja: "Tipo Tarja",
        estado: "Estado",
      };
      return etiquetas[clave] || clave;
    };

    const formatearValorCampo = (clave, valor) => {
      if (!valor) return "N/A";

      if (clave === "cantidad") return formatearNumero(valor);
      if (clave === "fechaGeneracion") return formatearFecha(valor);

      return valor.toString();
    };

    const procesarDatosEscaneados = () => {
      if (!datosEscaneados.value) return;

      emit("datos-procesados", {
        datos: datosEscaneados.value,
        esObjetoTarja: typeof datosEscaneados.value === "object",
      });

      cerrarModal();
    };

    const limpiarResultados = () => {
      limpiarEstados();
    };

    // Watchers
    watch(
      () => props.modo,
      (nuevoModo) => {
        pestanaActiva.value = nuevoModo;
      }
    );

    watch(
      () => props.visible,
      (visible) => {
        if (!visible && escaneandoQR.value) {
          detenerEscanerQR();
        }
      }
    );

    return {
      // Estados reactivos
      generandoQR,
      escaneandoQR,
      codigoQRGenerado,
      datosEscaneados,
      errorQR,
      pestanaActiva,
      inputArchivo,

      // Computadas
      tituloModal,
      iconoModo,

      // Métodos
      cambiarPestana,
      cerrarModal,
      obtenerNombreMaterial,
      formatearCantidad,
      generar,
      descargarQR,
      imprimirQR,
      iniciarEscaneoCamera,
      detenerEscaneo,
      manejarArchivoSubido,
      formatearEtiquetaCampo,
      formatearValorCampo,
      procesarDatosEscaneados,
      limpiarResultados,
    };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-qr {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-cabecera {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.modal-titulo {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.icono-titulo {
  color: #007bff;
}

.boton-cerrar {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.boton-cerrar:hover {
  background: #e9ecef;
  color: #333;
}

.modal-contenido {
  padding: 0;
  max-height: calc(90vh - 120px);
  overflow-y: auto;
}

.pestanas-navegacion {
  display: flex;
  border-bottom: 1px solid #dee2e6;
  background: #f8f9fa;
}

.pestana-boton {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 500;
  color: #6c757d;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.pestana-boton:hover {
  background: #e9ecef;
}

.pestana-boton.pestana-activa {
  color: #007bff;
  background: white;
  border-bottom: 2px solid #007bff;
}

.seccion-contenido {
  padding: 24px;
}

.informacion-tarja {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.informacion-tarja h4 {
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 1rem;
}

.grid-informacion {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.campo-informacion {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.etiqueta {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6c757d;
}

.valor {
  font-size: 0.9rem;
  color: #333;
}

.estado-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  max-width: fit-content;
}

.estado-activa {
  background: #d4edda;
  color: #155724;
}
.estado-inactiva {
  background: #f8d7da;
  color: #721c24;
}
.estado-pendiente {
  background: #fff3cd;
  color: #856404;
}

.area-generacion {
  text-align: center;
  margin-bottom: 20px;
}

.boton-generar-qr {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.boton-generar-qr:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.boton-generar-qr:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.qr-generado {
  text-align: center;
}

.contenedor-qr {
  background: white;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  display: inline-block;
}

.imagen-qr {
  max-width: 200px;
  height: auto;
}

.acciones-qr {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.boton-descargar,
.boton-imprimir {
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  background: white;
  color: #495057;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.boton-descargar:hover,
.boton-imprimir:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.opciones-escaneo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.boton-escaneo,
.boton-archivo {
  background: linear-gradient(135deg, #28a745, #1e7e34);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.boton-archivo {
  background: linear-gradient(135deg, #6f42c1, #563d7c);
}

.boton-escaneo:hover:not(:disabled),
.boton-archivo:hover {
  transform: translateY(-1px);
}

.boton-escaneo:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.separador-o {
  color: #6c757d;
  font-weight: 500;
  position: relative;
}

.separador-o::before,
.separador-o::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 60px;
  height: 1px;
  background: #dee2e6;
}

.separador-o::before {
  left: -70px;
}
.separador-o::after {
  right: -70px;
}

.input-archivo-oculto {
  display: none;
}

.area-escaner {
  text-align: center;
}

.qr-reader-contenedor {
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
}

.boton-detener-escaneo {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 auto;
}

.resultado-escaneo {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
}

.resultado-escaneo h4 {
  margin: 0 0 12px 0;
  color: #495057;
}

.datos-estructurados {
  margin-bottom: 16px;
}

.datos-texto {
  margin-bottom: 16px;
}

.texto-crudo {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 12px;
  font-family: "Courier New", monospace;
  font-size: 0.875rem;
  white-space: pre-wrap;
  word-break: break-all;
}

.acciones-resultado {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.boton-procesar {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.boton-limpiar {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.area-error {
  padding: 16px 24px;
  background: #f8d7da;
  border-top: 1px solid #f5c6cb;
}

.mensaje-error {
  color: #721c24;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.modal-pie {
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
  text-align: right;
}

.boton-cancelar {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.boton-cancelar:hover {
  background: #5a6268;
}

@media (max-width: 640px) {
  .modal-qr {
    width: 95%;
    margin: 10px;
  }

  .grid-informacion {
    grid-template-columns: 1fr;
  }

  .acciones-qr,
  .acciones-resultado {
    flex-direction: column;
  }

  .opciones-escaneo {
    gap: 12px;
  }
}
</style>
