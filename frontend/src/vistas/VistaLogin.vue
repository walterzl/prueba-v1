<template>
  <div class="login-container">
    <div class="login-box">
      <h1>WMS Trazabilidad</h1>
      <form @submit.prevent="manejarInicioSesion">
        <div class="grupo-entrada">
          <label for="usuario" class="etiqueta">Usuario</label>
          <input
            type="text"
            id="usuario"
            v-model="credenciales.usuario"
            class="entrada"
            :class="{ 'entrada-error': errores.usuario }"
            placeholder="Ingrese su usuario"
            required
          />
          <span v-if="errores.usuario" class="mensaje-error">{{
            errores.usuario
          }}</span>
        </div>

        <div class="grupo-entrada">
          <label for="password" class="etiqueta">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="credenciales.password"
            class="entrada"
            :class="{ 'entrada-error': errores.password }"
            placeholder="Ingrese su contraseña"
            required
          />
          <span v-if="errores.password" class="mensaje-error">{{
            errores.password
          }}</span>
        </div>

        <button type="submit" :disabled="cargando" class="boton boton-primario">
          {{ cargando ? "Iniciando sesión..." : "Iniciar Sesión" }}
        </button>

        <div v-if="error" class="mensaje mensaje-error">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { usarAlmacenAutenticacion } from "@/almacen/almacenAuth";
import { usarFormulario } from "@/composables/usarFormulario";
import { validadores } from "@/utilidades/validaciones";

const router = useRouter();
const almacenAuth = usarAlmacenAutenticacion();

// Configurar formulario con validaciones
const datosIniciales = {
  usuario: "",
  password: "",
};

// Función de validación personalizada para login
function validarCredenciales(datos) {
  const errores = [];

  // Validar usuario
  const errorUsuario = validadores.requerido(datos.usuario);
  if (errorUsuario) {
    errores.push("Usuario: " + errorUsuario);
  }

  // Validar password
  const errorPassword = validadores.requerido(datos.password);
  if (errorPassword) {
    errores.push("Contraseña: " + errorPassword);
  } else {
    const errorLongitud = validadores.longitudMinima(3)(datos.password);
    if (errorLongitud) {
      errores.push("Contraseña: " + errorLongitud);
    }
  }

  return errores;
}

const {
  formulario: credenciales,
  erroresCampos: errores,
  cargandoEnvio: cargando,
  manejarEnvio,
} = usarFormulario({
  datosIniciales,
  funcionValidacionPersonalizada: validarCredenciales,
});

const error = ref(null);

async function manejarInicioSesion() {
  error.value = null;

  try {
    const resultado = await manejarEnvio(async (datosFormulario) => {
      await almacenAuth.iniciarSesion(datosFormulario);
      router.push({ name: "inicio" });
      return true;
    });

    if (!resultado) {
      error.value = "Por favor, corrija los errores en el formulario";
    }
  } catch (err) {
    error.value = err.message || "Error inesperado al iniciar sesión";
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 1px,
    transparent 1px
  );
  background-size: 50px 50px;
  animation: float 20s ease-in-out infinite;
  pointer-events: none;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.login-box {
  padding: 3rem 2.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 15px 12px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  width: 100%;
  max-width: 420px;
  text-align: center;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.login-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 0 20px 20px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

h1 {
  margin-bottom: 2rem;
  color: #1e293b;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
}

/* Estilos de formulario */
.grupo-entrada {
  margin-bottom: 1.5rem;
  text-align: left;
}

.etiqueta {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

.entrada {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.entrada:focus {
  outline: none;
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.entrada-error {
  border-color: #ef4444 !important;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.04),
    0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.mensaje-error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
}

.boton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.boton:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
}

.boton:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.boton-primario {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
}

.mensaje {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-top: 1rem;
  font-size: 0.875rem;
}

.mensaje-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

/* Estilos específicos del formulario de login */
form .boton {
  width: 100%;
  margin-top: 1.5rem;
  font-size: 1.1rem;
  padding: 1rem 1.5rem;
}

/* Responsive */
@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }

  .login-box {
    padding: 2rem 1.5rem;
    border-radius: 16px;
  }

  h1 {
    font-size: 1.75rem;
  }
}
</style>
