<template>
  <div class="login-container">
    <div class="login-box">
      <h1>🍒 WMS Trazabilidad</h1>
      <p class="subtitle">Sistema de Trazabilidad de Materiales</p>

      <form @submit.prevent="manejarLogin" class="login-form">
        <div class="input-group">
          <label>Usuario:</label>
          <input
            v-model="credenciales.usuario"
            type="text"
            placeholder="Ingrese su usuario"
            required
          />
        </div>

        <div class="input-group">
          <label>Contraseña:</label>
          <input
            v-model="credenciales.password"
            type="password"
            placeholder="Ingrese su contraseña"
            required
          />
        </div>

        <button type="submit" :disabled="cargando" class="login-button">
          {{ cargando ? "Iniciando sesión..." : "Iniciar Sesión" }}
        </button>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { usarAlmacenAutenticacion } from "@/almacen/almacenAuthSimple";

const router = useRouter();
const autenticacion = usarAlmacenAutenticacion();

const credenciales = ref({
  usuario: "",
  password: "",
});

const cargando = ref(false);
const error = ref("");

async function manejarLogin() {
  cargando.value = true;
  error.value = "";

  try {
    console.log("Intentando login con:", credenciales.value.usuario);
    await autenticacion.iniciarSesion(credenciales.value);
    console.log("Login exitoso, redirigiendo...");
    router.push({ name: "inicio" });
  } catch (err) {
    console.error("Error en login:", err);
    error.value = err.message || "Error al iniciar sesión";
  } finally {
    cargando.value = false;
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.login-box {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-box h1 {
  margin-bottom: 0.5rem;
  color: #2d3748;
  font-size: 2rem;
}

.subtitle {
  color: #718096;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.login-form {
  text-align: left;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input-group input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.login-button {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 6px;
  font-size: 0.875rem;
}
</style>
