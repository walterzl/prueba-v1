<template>
  <div class="login-container">
    <div class="login-box">
      <h1>WMS Trazabilidad</h1>
      <form @submit.prevent="manejarLogin">
        <div class="input-group">
          <label for="usuario">Usuario</label>
          <input type="text" id="usuario" v-model="credenciales.usuario" required />
        </div>
        <div class="input-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="credenciales.password" required />
        </div>
        <button type="submit" :disabled="cargando">
          {{ cargando ? 'Ingresando...' : 'Ingresar' }}
        </button>
        <p v-if="error" class="error-mensaje">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAlmacenAuth } from '@/almacen/almacenAuth'
import { servicioAuth } from '@/servicios/servicioAuth'

const credenciales = ref({
  usuario: '',
  password: ''
})
const cargando = ref(false)
const error = ref(null)

const router = useRouter()
const almacenAuth = useAlmacenAuth()

async function manejarLogin() {
  cargando.value = true
  error.value = null
  try {
    const { token, usuario } = await servicioAuth.login(credenciales.value)
    almacenAuth.guardarSesion(token, usuario)
    router.push({ name: 'inicio' }) // Redirigir a una ruta 'inicio' que crearé
  } catch (err) {
    error.value = err.message || 'Ocurrió un error inesperado.'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}
.login-box {
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}
h1 {
  margin-bottom: 1.5rem;
}
.input-group {
  margin-bottom: 1rem;
  text-align: left;
}
label {
  display: block;
  margin-bottom: 0.5rem;
}
input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}
button:disabled {
  background-color: #aaa;
}
button:not(:disabled):hover {
  background-color: #0056b3;
}
.error-mensaje {
  color: red;
  margin-top: 1rem;
}
</style>
