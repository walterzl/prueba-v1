<template>
  <div id="app">
    <!-- Versión simplificada para debugging -->
    <div v-if="cargandoAuth" class="loading-screen">
      <div class="loading-content">
        <h2>🍒 WMS Trazabilidad</h2>
        <p>Cargando aplicación...</p>
      </div>
    </div>

    <div
      v-else-if="autenticacion && autenticacion.estaAutenticado"
      class="app-container"
    >
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>WMS Trazabilidad</h2>
        </div>
        <nav class="sidebar-nav">
          <RouterLink to="/" class="nav-link">🏠 Inicio</RouterLink>
          <RouterLink to="/inventario" class="nav-link"
            >📦 Inventario</RouterLink
          >
          <RouterLink to="/trazabilidad" class="nav-link"
            >📋 Trazabilidad</RouterLink
          >
          <RouterLink to="/recepcion-lotes" class="nav-link"
            >📥 Recepción Lotes</RouterLink
          >
          <RouterLink to="/operaciones-frio-despacho" class="nav-link"
            >❄️ Operaciones Frío</RouterLink
          >
          <RouterLink to="/tarjas" class="nav-link">🏷️ Tarjas</RouterLink>
        </nav>
        <div class="sidebar-footer">
          <div class="user-info">
            <span>{{ autenticacion.nombreUsuario || "Usuario" }}</span>
          </div>
          <button @click="manejarCierreSesion" class="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </aside>
      <main class="main-content">
        <RouterView />
      </main>
    </div>

    <div v-else class="login-wrapper">
      <!-- Vista de login cuando no está autenticado -->
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { usarAlmacenAutenticacion } from "@/almacen/almacenAuthSimple";

const cargandoAuth = ref(true);
const autenticacion = ref(null);
const enrutador = useRouter();

onMounted(async () => {
  try {
    console.log("Inicializando aplicación...");
    autenticacion.value = usarAlmacenAutenticacion();
    console.log(
      "Almacén de autenticación inicializado:",
      !!autenticacion.value
    );
    console.log(
      "Estado de autenticación:",
      autenticacion.value?.estaAutenticado
    );
  } catch (error) {
    console.error("Error inicializando autenticación:", error);
  } finally {
    cargandoAuth.value = false;
  }
});

async function manejarCierreSesion() {
  try {
    await autenticacion.value.cerrarSesion();
    enrutador.push({ name: "login" });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    enrutador.push({ name: "login" });
  }
}
</script>

<style scoped>
/* Pantalla de carga */
.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.loading-content {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.loading-content h2 {
  margin-bottom: 1rem;
  font-size: 2rem;
}

.loading-content p {
  margin: 0;
  opacity: 0.8;
}

.app-container {
  display: flex;
  height: 100vh;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.sidebar {
  width: 280px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  color: #0f172a;
  display: flex;
  flex-direction: column;
  padding: 0;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.08);
  border-right: 1px solid #e2e8f0;
}

.sidebar-header {
  padding: 2rem 1.5rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}

.sidebar-header h2 {
  text-align: center;
  margin: 0;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sidebar-nav {
  flex-grow: 1;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  color: #334155;
  text-decoration: none;
  padding: 1rem 1.25rem;
  margin: 0;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  position: relative;
  background: transparent;
}

.nav-link:hover {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #0f172a;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.nav-link.router-link-exact-active {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(79, 70, 229, 0.3);
  transform: translateX(4px);
}

.nav-link.router-link-exact-active::before {
  content: "";
  position: absolute;
  left: -1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: linear-gradient(180deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 0 4px 4px 0;
}

.sidebar-footer {
  border-top: 1px solid #e2e8f0;
  padding: 1.5rem;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

.user-info {
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.user-info span {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.9rem;
}

.logout-button {
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
}

.logout-button:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
  transform: translateY(-1px);
}

.main-content {
  flex-grow: 1;
  padding: 2rem;
  overflow-y: auto;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  position: relative;
}

.main-content::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 20% 50%,
      rgba(79, 70, 229, 0.03) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(124, 58, 237, 0.03) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 80%,
      rgba(239, 68, 68, 0.02) 0%,
      transparent 50%
    );
  pointer-events: none;
}

.login-wrapper {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .sidebar {
    width: 260px;
  }
}

@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    max-height: 200px;
    overflow-y: auto;
  }

  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
    gap: 0.25rem;
    padding: 1rem;
  }

  .nav-link {
    min-width: 120px;
    text-align: center;
    padding: 0.75rem 1rem;
  }
}
</style>
