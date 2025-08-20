import { defineStore } from "pinia";
import { ref, computed, readonly } from "vue";
import { servicioAutenticacion } from "@/servicios/servicioAuth";

// Cache para verificaciones de sesión
let verificacionEnCurso = null;

/**
 * Almacén simplificado de autenticación con API real
 */
export const usarAlmacenAutenticacion = defineStore("autenticacion", () => {
  // Estado
  const token = ref(localStorage.getItem("tokenAutenticacion") || null);
  const datosUsuario = ref(
    JSON.parse(localStorage.getItem("datosUsuario") || "null") || null
  );
  const cargandoAutenticacion = ref(false);

  // Getters computados
  const estaAutenticado = computed(() => !!token.value);
  const nombreUsuario = computed(
    () =>
      datosUsuario.value?.nombreCompleto ||
      datosUsuario.value?.usuario ||
      "Usuario Demo"
  );

  // Acciones
  function establecerSesion(nuevoToken, nuevoDatosUsuario) {
    token.value = nuevoToken;
    datosUsuario.value = nuevoDatosUsuario;

    localStorage.setItem("tokenAutenticacion", nuevoToken);
    localStorage.setItem("datosUsuario", JSON.stringify(nuevoDatosUsuario));

    console.log("Sesión establecida:", {
      token: nuevoToken,
      usuario: nuevoDatosUsuario,
    });
  }

  function limpiarSesion() {
    token.value = null;
    datosUsuario.value = null;
    verificacionEnCurso = null;

    localStorage.removeItem("tokenAutenticacion");
    localStorage.removeItem("datosUsuario");

    console.log("Sesión limpiada completamente");
  }

  async function iniciarSesion(credenciales) {
    cargandoAutenticacion.value = true;

    try {
      console.log("Iniciando sesión con:", credenciales);

      // Usar el servicio de autenticación real
      const { token: nuevoToken, usuario: nuevoUsuario } =
        await servicioAutenticacion.iniciarSesion(credenciales);

      establecerSesion(nuevoToken, nuevoUsuario);
      console.log("Login exitoso:", nuevoUsuario);
      return nuevoUsuario;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    } finally {
      cargandoAutenticacion.value = false;
    }
  }

  async function cerrarSesion() {
    console.log("Cerrando sesión...");

    try {
      // Llamar al servicio real de cierre de sesión
      await servicioAutenticacion.cerrarSesion();
    } catch (error) {
      console.warn("Error al cerrar sesión en el servidor:", error);
    } finally {
      limpiarSesion();
    }
  }

  async function verificarSesion() {
    if (!token.value) {
      verificacionEnCurso = null;
      return false;
    }

    // Si ya hay una verificación en curso, esperar su resultado
    if (verificacionEnCurso) {
      console.log("Verificación ya en curso, esperando resultado...");
      return verificacionEnCurso;
    }

    // Iniciar nueva verificación
    verificacionEnCurso = (async () => {
      try {
        console.log("Iniciando verificación de sesión...");
        const resultado = await servicioAutenticacion.verificarToken(
          token.value
        );

        if (!resultado) {
          console.log("Token inválido, limpiando sesión local");
          limpiarSesion();
        }

        return resultado;
      } catch (error) {
        console.error("Error al verificar sesión:", error);
        limpiarSesion();
        return false;
      } finally {
        // Limpiar la verificación después de un pequeño retraso
        setTimeout(() => {
          verificacionEnCurso = null;
        }, 1000);
      }
    })();

    return verificacionEnCurso;
  }

  return {
    // Estado
    token: readonly(token),
    datosUsuario: readonly(datosUsuario),
    cargandoAutenticacion: readonly(cargandoAutenticacion),

    // Getters
    estaAutenticado,
    nombreUsuario,

    // Acciones
    establecerSesion,
    limpiarSesion,
    iniciarSesion,
    cerrarSesion,
    verificarSesion,
  };
});
