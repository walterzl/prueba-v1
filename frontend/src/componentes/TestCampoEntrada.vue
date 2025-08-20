<template>
  <div class="test-campo-entrada">
    <h3>Prueba de CampoEntrada</h3>

    <!-- Campo de texto -->
    <CampoEntrada
      v-model="valorTexto"
      etiqueta="Campo de Texto"
      placeholder="Escribe algo..."
      tipo="text"
    />

    <!-- Campo de selección -->
    <CampoEntrada
      v-model="valorSelect"
      etiqueta="Campo de Selección"
      tipo="select"
      :opciones="opciones"
    />

    <!-- Campo de fecha -->
    <CampoEntrada v-model="valorFecha" etiqueta="Campo de Fecha" tipo="date" />

    <!-- Valores actuales -->
    <div class="valores-actuales">
      <p><strong>Texto:</strong> {{ valorTexto }}</p>
      <p><strong>Select:</strong> {{ valorSelect }}</p>
      <p><strong>Fecha:</strong> {{ valorFecha }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CampoEntrada from "./CampoEntrada.vue";

const valorTexto = ref("");
const valorSelect = ref("");
const valorFecha = ref("");

const opciones = [
  { value: "opcion1", label: "Opción 1" },
  { value: "opcion2", label: "Opción 2" },
  { value: "opcion3", label: "Opción 3" },
];
</script>

<style scoped>
.test-campo-entrada {
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 1rem;
}

.test-campo-entrada h3 {
  margin-bottom: 1.5rem;
  color: #0f172a;
}

.test-campo-entrada > * {
  margin-bottom: 1rem;
}

.valores-actuales {
  margin-top: 2rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.valores-actuales p {
  margin: 0.5rem 0;
  color: #374151;
}
</style>
