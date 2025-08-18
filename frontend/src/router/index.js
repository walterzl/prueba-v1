import { createRouter, createWebHistory } from 'vue-router'
import { useAlmacenAuth } from '@/almacen/almacenAuth'
import VistaLogin from '../vistas/VistaLogin.vue'
import VistaInicio from '../vistas/VistaInicio.vue'
import VistaInventario from '../vistas/VistaInventario.vue'
import VistaTrazabilidad from '../vistas/VistaTrazabilidad.vue'
import VistaRecepcionLotes from '../vistas/VistaRecepcionLotes.vue'
import VistaFrioDespacho from '../vistas/VistaFrioDespacho.vue'
import VistaTarjas from '../vistas/VistaTarjas.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: VistaLogin
    },
    {
      path: '/',
      name: 'inicio',
      component: VistaInicio,
      meta: { requiresAuth: true }
    },
    {
      path: '/inventario',
      name: 'inventario',
      component: VistaInventario,
      meta: { requiresAuth: true }
    },
    {
      path: '/trazabilidad',
      name: 'trazabilidad',
      component: VistaTrazabilidad,
      meta: { requiresAuth: true }
    },
    {
      path: '/recepcion-lotes',
      name: 'recepcion-lotes',
      component: VistaRecepcionLotes,
      meta: { requiresAuth: true }
    },
    {
      path: '/frio-despacho',
      name: 'frio-despacho',
      component: VistaFrioDespacho,
      meta: { requiresAuth: true }
    },
    {
      path: '/tarjas',
      name: 'tarjas',
      component: VistaTarjas,
      meta: { requiresAuth: true }
    }
  ]
})

// Guardia de navegación global
router.beforeEach((to, from, next) => {
  const almacenAuth = useAlmacenAuth()
  const necesitaAutenticacion = to.meta.requiresAuth

  if (necesitaAutenticacion && !almacenAuth.estaAutenticado) {
    // Si la ruta requiere autenticación y el usuario no está logueado,
    // redirigir a la página de login.
    next({ name: 'login' })
  } else if (to.name === 'login' && almacenAuth.estaAutenticado) {
    // Si el usuario ya está logueado e intenta acceder a la página de login,
    -    next({ name: 'inicio' })
+    next({ name: 'inicio' }) // Evita que un usuario logueado vea el login
  } else {
    // En cualquier otro caso, permitir la navegación.
    next()
  }
})

export default router
