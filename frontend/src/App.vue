<template>
  <div v-if="auth.estaAutenticado" class="app-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>WMS Trazabilidad</h2>
      </div>
      <nav class="sidebar-nav">
        <RouterLink to="/" class="nav-link">Inicio</RouterLink>
        <!-- Las rutas a los módulos se agregarán aquí -->
        <RouterLink to="/inventario" class="nav-link">Inventario</RouterLink>
        <RouterLink to="/trazabilidad" class="nav-link">Trazabilidad</RouterLink>
        <RouterLink to="/recepcion-lotes" class="nav-link">Recepción Lotes</RouterLink>
        <RouterLink to="/frio-despacho" class="nav-link">Frío y Despacho</RouterLink>
        <RouterLink to="/tarjas" class="nav-link">Tarjas</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <div class="user-info">
          <span>{{ auth.nombreUsuario }}</span>
        </div>
        <button @click="manejarLogout" class="logout-button">Cerrar Sesión</button>
      </div>
    </aside>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
  <div v-else class="login-wrapper">
    <!-- Muestra solo la vista de login si no está autenticado -->
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAlmacenAuth } from '@/almacen/almacenAuth'

const auth = useAlmacenAuth()
const router = useRouter()

function manejarLogout() {
  auth.limpiarSesion()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}
.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}
.sidebar-header h2 {
  text-align: center;
  margin-bottom: 2rem;
}
.sidebar-nav {
  flex-grow: 1;
}
.nav-link {
  display: block;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.nav-link:hover, .router-link-exact-active {
  background-color: #34495e;
}
.sidebar-footer {
  border-top: 1px solid #4a627a;
  padding-top: 1rem;
}
.user-info {
  text-align: center;
  margin-bottom: 1rem;
  font-weight: bold;
}
.logout-button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: #e74c3c;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}
.logout-button:hover {
  background-color: #c0392b;
}
.main-content {
  flex-grow: 1;
  padding: 2rem;
  overflow-y: auto;
  background-color: #ecf0f1;
}
.login-wrapper {
  height: 100vh;
}
</style>
