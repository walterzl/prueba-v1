<template>
  <div class="inicio-container">
    <div class="welcome-section">
      <h1>🍒 Bienvenido al Sistema WMS</h1>
      <h2>Ranco Cherries - Trazabilidad de Materiales</h2>
      <p>
        Sistema de gestión de inventario, trazabilidad y control de materiales
      </p>
    </div>

    <div class="modules-grid">
      <div class="module-card" @click="navegarA('/inventario')">
        <div class="module-icon">📦</div>
        <h3>Inventario</h3>
        <p>Control de stock en tiempo real</p>
      </div>

      <div class="module-card" @click="navegarA('/trazabilidad')">
        <div class="module-icon">📋</div>
        <h3>Trazabilidad</h3>
        <p>Seguimiento de productos</p>
      </div>

      <div class="module-card" @click="navegarA('/recepcion-lotes')">
        <div class="module-icon">📥</div>
        <h3>Recepción de Lotes</h3>
        <p>Registro de ingresos</p>
      </div>

      <div class="module-card" @click="navegarA('/operaciones-frio-despacho')">
        <div class="module-icon">❄️</div>
        <h3>Operaciones de Frío</h3>
        <p>Control de cámaras frías</p>
      </div>

      <div class="module-card" @click="navegarA('/tarjas')">
        <div class="module-icon">🏷️</div>
        <h3>Tarjas</h3>
        <p>Gestión de etiquetas</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function navegarA(ruta) {
  console.log("Navegando a:", ruta);
  router.push(ruta);
}
</script>

<style scoped>
.inicio-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.welcome-section h1 {
  color: #2d3748;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.welcome-section h2 {
  color: #4a5568;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.welcome-section p {
  color: #718096;
  font-size: 1.1rem;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.module-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.module-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: #4f46e5;
}

.module-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.module-card h3 {
  color: #2d3748;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.module-card p {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
}

@media (max-width: 768px) {
  .modules-grid {
    grid-template-columns: 1fr;
  }

  .welcome-section h1 {
    font-size: 2rem;
  }

  .welcome-section h2 {
    font-size: 1.25rem;
  }
}
</style>
