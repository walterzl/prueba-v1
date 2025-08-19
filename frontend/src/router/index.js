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
  const almacenAutenticacion = usarAlmacenAutenticacion();
  const requiereAutenticacion = hacia.meta.requiresAuth;

  // Si la ruta requiere autenticación
  if (requiereAutenticacion) {
    // Verificar si hay una sesión válida
    if (!almacenAutenticacion.estaAutenticado) {
      console.log("Redirigiendo al login: usuario no autenticado");
      siguiente({ name: "login" });
      return;
    }

    // Solo verificar el token en el servidor si es la primera navegación
    // o si viene de la página de login (para evitar verificaciones innecesarias)
    if (desde.name === "login" || !desde.name) {
      console.log("Verificando validez del token con el servidor...");
      const sesionValida = await almacenAutenticacion.verificarSesion();
      if (!sesionValida) {
        console.log("Redirigiendo al login: token inválido en servidor");
        siguiente({ name: "login" });
        return;
      }
    }
  }

  // Si el usuario autenticado intenta acceder al login, redirigir al inicio
  if (hacia.name === "login" && almacenAutenticacion.estaAutenticado) {
    console.log("Usuario ya autenticado, redirigiendo al inicio");
    siguiente({ name: "inicio" });
    return;
  }

  // Permitir la navegación
  siguiente();
});

export default router;
