/**
 * Composable para manejo de códigos QR
 * Genera y escanea códigos QR con nomenclatura en español
 */

import QRCode from "qrcode";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { ref, nextTick } from "vue";

export function usarCodigoQR() {
  // Estados reactivos
  const generandoQR = ref(false);
  const escaneandoQR = ref(false);
  const escaner = ref(null);
  const codigoQRGenerado = ref("");
  const datosEscaneados = ref("");
  const errorQR = ref("");

  /**
   * Genera un código QR basado en los datos de la tarja
   * @param {Object} datosTarja - Datos de la tarja para generar el QR
   * @returns {Promise<string>} URL del código QR generado
   */
  const generarCodigoQR = async (datosTarja) => {
    if (!datosTarja) {
      throw new Error("Datos de tarja son requeridos para generar QR");
    }

    generandoQR.value = true;
    errorQR.value = "";

    try {
      // Crear objeto con datos esenciales de la tarja para el QR
      const datosQR = {
        id: datosTarja.id,
        numeroTarja: datosTarja.numero_tarja,
        planta: datosTarja.planta,
        codigoMaterial:
          datosTarja.codigo_material || datosTarja.material?.codigo,
        nombreMaterial:
          datosTarja.nombre_material || datosTarja.material?.nombre,
        lote: datosTarja.lote,
        cantidad: datosTarja.cantidad,
        fechaGeneracion: datosTarja.fecha_generacion,
        tipoTarja: datosTarja.tipo_tarja,
        estado: datosTarja.estado,
      };

      // Convertir a JSON string para el QR
      const contenidoQR = JSON.stringify(datosQR);

      // Generar código QR como DataURL
      const urlQR = await QRCode.toDataURL(contenidoQR, {
        errorCorrectionLevel: "M",
        type: "image/png",
        quality: 0.92,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        width: 256,
      });

      codigoQRGenerado.value = urlQR;
      return urlQR;
    } catch (error) {
      console.error("Error al generar código QR:", error);
      errorQR.value = "Error al generar el código QR";
      throw error;
    } finally {
      generandoQR.value = false;
    }
  };

  /**
   * Genera código QR como canvas para impresión
   * @param {Object} datosTarja - Datos de la tarja
   * @param {HTMLCanvasElement} canvas - Elemento canvas donde dibujar
   * @returns {Promise<void>}
   */
  const generarQREnCanvas = async (datosTarja, canvas) => {
    if (!datosTarja || !canvas) {
      throw new Error("Datos de tarja y canvas son requeridos");
    }

    try {
      const datosQR = {
        id: datosTarja.id,
        numeroTarja: datosTarja.numero_tarja,
        planta: datosTarja.planta,
        codigoMaterial:
          datosTarja.codigo_material || datosTarja.material?.codigo,
        lote: datosTarja.lote,
        cantidad: datosTarja.cantidad,
      };

      const contenidoQR = JSON.stringify(datosQR);

      await QRCode.toCanvas(canvas, contenidoQR, {
        errorCorrectionLevel: "M",
        margin: 2,
        width: 200,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
    } catch (error) {
      console.error("Error al generar QR en canvas:", error);
      throw error;
    }
  };

  /**
   * Inicia el escáner de códigos QR
   * @param {string} elementoId - ID del elemento HTML donde mostrar el escáner
   * @param {Function} onExito - Callback cuando se escanea exitosamente
   * @param {Function} onError - Callback cuando hay error
   */
  const iniciarEscanerQR = async (elementoId, onExito, onError) => {
    if (escaneandoQR.value) {
      detenerEscanerQR();
    }

    try {
      escaneandoQR.value = true;
      errorQR.value = "";

      // Configuración del escáner
      const configuracionEscaner = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        disableFlip: false,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true,
        },
      };

      // Crear instancia del escáner
      escaner.value = new Html5QrcodeScanner(
        elementoId,
        configuracionEscaner,
        false
      );

      // Callback para éxito en escaneo
      const onEscaneoExitoso = (codigoEscaneado) => {
        try {
          // Intentar parsear como JSON
          const datosParseados = JSON.parse(codigoEscaneado);
          datosEscaneados.value = datosParseados;

          if (onExito) {
            onExito(datosParseados, codigoEscaneado);
          }
        } catch {
          // Si no es JSON válido, devolver el texto crudo
          datosEscaneados.value = codigoEscaneado;

          if (onExito) {
            onExito(codigoEscaneado, codigoEscaneado);
          }
        }
      };

      // Callback para errores en escaneo
      const onErrorEscaneo = (mensaje) => {
        // Ignorar errores comunes de no encontrar QR
        if (
          mensaje.includes("No QR code found") ||
          mensaje.includes("QR code parse error")
        ) {
          return;
        }

        console.warn("Error en escaneo QR:", mensaje);
        if (onError) {
          onError(mensaje, null);
        }
      };

      // Iniciar el escáner
      await nextTick();
      escaner.value.render(onEscaneoExitoso, onErrorEscaneo);
    } catch (error) {
      console.error("Error al iniciar escáner QR:", error);
      errorQR.value = "Error al iniciar el escáner de QR";
      escaneandoQR.value = false;

      if (onError) {
        onError("Error al iniciar escáner", error);
      }
    }
  };

  /**
   * Detiene el escáner de códigos QR
   */
  const detenerEscanerQR = async () => {
    if (escaner.value && escaneandoQR.value) {
      try {
        await escaner.value.clear();
        escaner.value = null;
        escaneandoQR.value = false;
        datosEscaneados.value = "";
      } catch (error) {
        console.error("Error al detener escáner QR:", error);
      }
    }
  };

  /**
   * Escanea QR desde archivo de imagen
   * @param {File} archivo - Archivo de imagen con QR
   * @param {Function} onExito - Callback de éxito
   * @param {Function} onError - Callback de error
   */
  const escanearQRDesdeArchivo = async (archivo, onExito, onError) => {
    if (!archivo) {
      const error = "Archivo es requerido";
      errorQR.value = error;
      if (onError) onError(error);
      return;
    }

    try {
      const html5QrCode = new Html5Qrcode("temp-qr-reader");

      const resultado = await html5QrCode.scanFile(archivo, true);

      try {
        // Intentar parsear como JSON
        const datosParseados = JSON.parse(resultado);
        datosEscaneados.value = datosParseados;

        if (onExito) {
          onExito(datosParseados, resultado);
        }
      } catch {
        // Si no es JSON, devolver texto crudo
        datosEscaneados.value = resultado;

        if (onExito) {
          onExito(resultado, resultado);
        }
      }
    } catch (error) {
      console.error("Error al escanear QR desde archivo:", error);
      const mensajeError = "Error al leer el código QR del archivo";
      errorQR.value = mensajeError;

      if (onError) {
        onError(mensajeError, error);
      }
    }
  };

  /**
   * Descargar código QR como imagen
   * @param {string} urlQR - URL del código QR
   * @param {string} nombreArchivo - Nombre del archivo de descarga
   */
  const descargarCodigoQR = (urlQR, nombreArchivo = "codigo-qr-tarja") => {
    if (!urlQR) {
      throw new Error("URL del código QR es requerida");
    }

    try {
      const enlace = document.createElement("a");
      enlace.href = urlQR;
      enlace.download = `${nombreArchivo}.png`;
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);
    } catch (error) {
      console.error("Error al descargar código QR:", error);
      throw error;
    }
  };

  /**
   * Validar datos escaneados de tarja
   * @param {Object} datosEscaneados - Datos del QR escaneado
   * @returns {Object} Resultado de validación
   */
  const validarDatosTarjaQR = (datosEscaneados) => {
    const camposRequeridos = ["id", "numeroTarja", "planta"];
    const camposOpcionales = [
      "codigoMaterial",
      "lote",
      "cantidad",
      "tipoTarja",
    ];

    const errores = [];
    const advertencias = [];

    // Validar campos requeridos
    camposRequeridos.forEach((campo) => {
      if (!datosEscaneados[campo]) {
        errores.push(`Campo requerido faltante: ${campo}`);
      }
    });

    // Validar campos opcionales
    camposOpcionales.forEach((campo) => {
      if (!datosEscaneados[campo]) {
        advertencias.push(`Campo opcional faltante: ${campo}`);
      }
    });

    return {
      valido: errores.length === 0,
      errores,
      advertencias,
      datos: datosEscaneados,
    };
  };

  /**
   * Limpiar estados del composable
   */
  const limpiarEstados = () => {
    codigoQRGenerado.value = "";
    datosEscaneados.value = "";
    errorQR.value = "";
    if (escaneandoQR.value) {
      detenerEscanerQR();
    }
  };

  return {
    // Estados reactivos
    generandoQR,
    escaneandoQR,
    codigoQRGenerado,
    datosEscaneados,
    errorQR,

    // Métodos de generación
    generarCodigoQR,
    generarQREnCanvas,
    descargarCodigoQR,

    // Métodos de escaneo
    iniciarEscanerQR,
    detenerEscanerQR,
    escanearQRDesdeArchivo,

    // Utilidades
    validarDatosTarjaQR,
    limpiarEstados,
  };
}
