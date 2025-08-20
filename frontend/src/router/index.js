import { createRouter, createWebHistory } from "vue-router";
import { usarAlmacenAutenticacion } from "@/almacen/almacenAuthSimple";
import VistaLoginSimple from "../vistas/VistaLoginSimple.vue";
import VistaInicioSimple from "../vistas/VistaInicioSimple.vue";
import VistaInventario from "../vistas/VistaInventario.vue";
import VistaTrazabilidad from "../vistas/VistaTrazabilidad.vue";
import VistaRecepcionLotes from "../vistas/VistaRecepcionLotes.vue";
import VistaFrioDespacho from "../vistas/VistaFrioDespacho.vue";
import VistaOperacionesFrioDespacho from "../vistas/VistaOperacionesFrioDespacho.vue";
import VistaTarjas from "../vistas/VistaTarjas.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: VistaLoginSimple,
    },
    {
      path: "/",
      name: "inicio",
      component: VistaInicioSimple,
      meta: { requiresAuth: true },
    },
    {
      path: "/inventario",
      name: "inventario",
      component: VistaInventario,
      meta: { requiresAuth: true },
    },
    {
      path: "/trazabilidad",
      name: "trazabilidad",
      component: VistaTrazabilidad,
      meta: { requiresAuth: true },
    },
    {
      path: "/recepcion-lotes",
      name: "recepcion-lotes",
      component: VistaRecepcionLotes,
      meta: { requiresAuth: true },
    },
    {
      path: "/frio-despacho",
      name: "frio-despacho",
      component: VistaFrioDespacho,
      meta: { requiresAuth: true },
    },
    {
      path: "/operaciones-frio-despacho",
      name: "operaciones-frio-despacho",
      component: VistaOperacionesFrioDespacho,
      meta: { requiresAuth: true },
    },
    {
      path: "/tarjas",
      name: "tarjas",
      component: VistaTarjas,
      meta: { requiresAuth: true },
    },
  ],
});

// Guardia de navegación global para proteger rutas
router.beforeEach(async (hacia, desde, siguiente) => {
  try {
    const almacenAutenticacion = usarAlmacenAutenticacion();
    const requiereAutenticacion = hacia.meta.requiresAuth;

    console.log(`Navegando de "${desde.name || "inicio"}" a "${hacia.name}"`);

    // Si la ruta requiere autenticación
    if (requiereAutenticacion) {
      // Verificar si hay token en localStorage
      if (!almacenAutenticacion.estaAutenticado) {
        console.log("Redirigiendo al login: no hay token");
        return siguiente({ name: "login" });
      }

      // Verificar si el token es válido en el servidor
      console.log("Verificando validez del token con el servidor...");
      const sesionValida = await almacenAutenticacion.verificarSesion();
      if (!sesionValida) {
        console.log("Token inválido, limpiando sesión y redirigiendo al login");
        almacenAutenticacion.limpiarSesion();
        return siguiente({ name: "login" });
      }
    }

    // Si intenta ir al login pero tiene token válido, redirigir al inicio
    if (hacia.name === "login" && almacenAutenticacion.estaAutenticado) {
      console.log("Verificando token antes de determinar redirección...");
      const sesionValida = await almacenAutenticacion.verificarSesion();
      if (sesionValida) {
        console.log(
          "Usuario ya autenticado con token válido, redirigiendo al inicio"
        );
        return siguiente({ name: "inicio" });
      } else {
        console.log("Token inválido, permitiendo acceso al login");
        almacenAutenticacion.limpiarSesion();
      }
    }

    // Permitir la navegación
    siguiente();
  } catch (error) {
    console.error("Error en guardia de navegación:", error);
    siguiente({ name: "login" });
  }
});

export default router;
