import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Por convención, los stores de Pinia se nombran con el prefijo "use"
export const useAlmacenAuth = defineStore('auth', () => {
  // --- STATE ---
  const token = ref(localStorage.getItem('authToken') || null)
  const usuario = ref(JSON.parse(localStorage.getItem('authUser')) || null)

  // --- GETTERS ---
  const estaAutenticado = computed(() => !!token.value)
  const nombreUsuario = computed(() => usuario.value?.nombre || 'Invitado')

  // --- ACTIONS ---
  function guardarSesion(newToken, nuevoUsuario) {
    token.value = newToken
    usuario.value = nuevoUsuario
    localStorage.setItem('authToken', newToken)
    localStorage.setItem('authUser', JSON.stringify(nuevoUsuario))
  }

  function limpiarSesion() {
    token.value = null
    usuario.value = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
  }

  // Se podría añadir una acción de login que llame al servicio api
  // y luego llame a guardarSesion con la respuesta.

  return {
    token,
    usuario,
    estaAutenticado,
    nombreUsuario,
    guardarSesion,
    limpiarSesion
  }
})
