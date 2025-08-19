<template>
  <div class="inicio-container">
    <div class="header-section">
      <h1 class="page-title">
        <span class="emoji">🍒</span>
        Sistema WMS Ranco Cherries
      </h1>
      <p class="page-subtitle">
        Centro de Control de Trazabilidad y Gestión de Inventario
      </p>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-card">
        <div class="card-icon inventory">📦</div>
        <div class="card-content">
          <h3>Inventario</h3>
          <p>Gestión y control de stock en tiempo real</p>
          <RouterLink to="/inventario" class="card-action"
            >Ver Inventario</RouterLink
          >
        </div>
      </div>

      <div class="dashboard-card">
        <div class="card-icon traceability">📋</div>
        <div class="card-content">
          <h3>Trazabilidad</h3>
          <p>Seguimiento completo de productos</p>
          <RouterLink to="/trazabilidad" class="card-action"
            >Ver Trazabilidad</RouterLink
          >
        </div>
      </div>

      <div class="dashboard-card">
        <div class="card-icon reception">📥</div>
        <div class="card-content">
          <h3>Recepción de Lotes</h3>
          <p>Registro de nuevos ingresos</p>
          <RouterLink to="/recepcion-lotes" class="card-action"
            >Gestionar Recepciones</RouterLink
          >
        </div>
      </div>

      <div class="dashboard-card">
        <div class="card-icon cold">❄️</div>
        <div class="card-content">
          <h3>Frío y Despacho</h3>
          <p>Control de cámaras frías y despachos</p>
          <RouterLink to="/operaciones-frio-despacho" class="card-action"
            >Ver Operaciones</RouterLink
          >
        </div>
      </div>

      <div class="dashboard-card">
        <div class="card-icon tags">🏷️</div>
        <div class="card-content">
          <h3>Tarjas</h3>
          <p>Gestión de tarjas y etiquetado</p>
          <RouterLink to="/tarjas" class="card-action"
            >Gestionar Tarjas</RouterLink
          >
        </div>
      </div>

      <div class="dashboard-card stats">
        <div class="card-icon stats">📊</div>
        <div class="card-content">
          <h3>Estadísticas Rápidas</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-number">1,234</span>
              <span class="stat-label">Productos en Stock</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">56</span>
              <span class="stat-label">Lotes Activos</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="info-section">
      <div class="info-card">
        <h3>🚀 Funcionalidades Principales</h3>
        <ul>
          <li>Control de inventario en tiempo real</li>
          <li>Trazabilidad completa de productos</li>
          <li>Gestión de recepciones y despachos</li>
          <li>Control de cámaras frías</li>
          <li>Sistema de tarjas y etiquetado</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { usarAlmacenAutenticacion } from "@/almacen/almacenAuth";

const autenticacion = usarAlmacenAutenticacion();
</script>

<style scoped>
.inicio-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(
    135deg,
    rgba(79, 70, 229, 0.1) 0%,
    rgba(124, 58, 237, 0.1) 100%
  );
  border-radius: 20px;
  border: 1px solid rgba(79, 70, 229, 0.1);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0f172a !important;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.emoji {
  font-size: 3rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.page-subtitle {
  font-size: 1.2rem;
  color: #334155 !important;
  font-weight: 500;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.dashboard-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.dashboard-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}

.dashboard-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 4px 15px rgba(79, 70, 229, 0.2);
}

.dashboard-card.stats {
  grid-column: span 2;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.card-icon.inventory {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}
.card-icon.traceability {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
}
.card-icon.reception {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}
.card-icon.cold {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
}
.card-icon.tags {
  background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
}
.card-icon.stats {
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
}

.card-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a !important;
  margin-bottom: 0.75rem;
}

.card-content p {
  color: #334155 !important;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.card-action {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.2);
}

.card-action:hover {
  background: linear-gradient(135deg, #3730a3 0%, #6d28d9 100%);
  box-shadow: 0 4px 16px rgba(79, 70, 229, 0.3);
  transform: translateY(-2px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  color: #4f46e5;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #334155 !important;
  font-weight: 500;
}

.info-section {
  margin-top: 3rem;
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
}

.info-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a !important;
  margin-bottom: 1.5rem;
}

.info-card ul {
  list-style: none;
  padding: 0;
}

.info-card li {
  padding: 0.75rem 0;
  color: #334155 !important;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
  padding-left: 2rem;
}

.info-card li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: bold;
  font-size: 1.1rem;
}

.info-card li:last-child {
  border-bottom: none;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .dashboard-card.stats {
    grid-column: span 1;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
