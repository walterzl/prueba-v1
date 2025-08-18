/**
 * WMS Ranco Cherries - Aplicación Principal
 * Sistema de Trazabilidad de Materiales
 * 
 * Inicializa y gestiona toda la aplicación frontend
 */

class AplicacionWMS {
  constructor() {
    this.moduloActual = null;
    this.usuario = null;
    this.plantaActiva = null;
    this.configurarEventListeners();
    this.inicializar();
  }

  /**
   * Inicializa la aplicación
   */
  async inicializar() {
    try {
      console.log('🚀 Iniciando WMS Ranco Cherries...');
      
      // Configurar moment.js en español
      moment.locale('es');
      
      // Mostrar loader inicial
      this.mostrarLoader(true);
      
      // Verificar si hay sesión activa
      if (servicioAuth.estaAutenticado()) {
        console.log('✅ Sesión activa detectada');
        
        // Validar sesión con servidor
        const sesionValida = await servicioAuth.validarSesion();
        
        if (sesionValida) {
          this.usuario = servicioAuth.obtenerUsuario();
          await this.iniciarAplicacion();
        } else {
          console.warn('⚠️ Sesión inválida, mostrando login');
          this.mostrarLogin();
        }
      } else {
        console.log('🔑 No hay sesión activa, mostrando login');
        this.mostrarLogin();
      }
      
      // Precargar datos maestros en background
      this.precargarDatos();
      
    } catch (error) {
      console.error('❌ Error al inicializar aplicación:', error);
      this.mostrarError('Error al inicializar la aplicación');
    } finally {
      this.mostrarLoader(false);
    }
  }

  /**
   * Configura los event listeners globales
   */
  configurarEventListeners() {
    // Login exitoso
    window.addEventListener('login-exitoso', (e) => {
      this.usuario = e.detail.usuario;
      this.iniciarAplicacion();
    });

    // Logout
    window.addEventListener('logout-exitoso', () => {
      this.cerrarAplicacion();
      this.mostrarLogin();
    });

    // Error de red
    window.addEventListener('offline', () => {
      this.mostrarNotificacion('Sin conexión a internet', 'warning', false);
    });

    window.addEventListener('online', () => {
      this.mostrarNotificacion('Conexión restaurada', 'success');
    });

    // Configurar navegación
    this.configurarNavegacion();
    
    // Configurar formulario de login
    this.configurarFormularioLogin();
    
    // Configurar selección de planta
    this.configurarSeleccionPlanta();
  }

  /**
   * Configura la navegación del sistema
   */
  configurarNavegacion() {
    // Navegación principal
    document.getElementById('nav-inicio')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.navegarA('bienvenida');
    });

    document.getElementById('nav-inventario')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.navegarA('inventario');
    });

    document.getElementById('nav-trazabilidad')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.navegarA('trazabilidad');
    });

    // Logout
    document.getElementById('nav-logout')?.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const confirmacion = await Swal.fire({
        title: '¿Cerrar sesión?',
        text: '¿Está seguro que desea cerrar sesión?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar',
        cancelButtonText: 'Cancelar'
      });

      if (confirmacion.isConfirmed) {
        await servicioAuth.logout();
      }
    });
  }

  /**
   * Configura el formulario de login
   */
  configurarFormularioLogin() {
    const formLogin = document.getElementById('form-login');
    const btnLogin = document.getElementById('btn-login');
    const btnTogglePassword = document.getElementById('btn-toggle-password');

    if (formLogin) {
      formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.procesarLogin();
      });
    }

    if (btnLogin) {
      btnLogin.addEventListener('click', async () => {
        await this.procesarLogin();
      });
    }

    // Toggle password visibility
    if (btnTogglePassword) {
      btnTogglePassword.addEventListener('click', () => {
        const inputPassword = document.getElementById('input-password');
        const icon = btnTogglePassword.querySelector('i');
        
        if (inputPassword.type === 'password') {
          inputPassword.type = 'text';
          icon.className = 'bi bi-eye-slash';
        } else {
          inputPassword.type = 'password';
          icon.className = 'bi bi-eye';
        }
      });
    }
  }

  /**
   * Configura la selección de planta
   */
  configurarSeleccionPlanta() {
    const botonesPlanta = document.querySelectorAll('.btn-planta');
    
    botonesPlanta.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const planta = e.currentTarget.dataset.planta;
        this.seleccionarPlanta(planta);
      });
    });
  }

  /**
   * Procesa el login del usuario
   */
  async procesarLogin() {
    const usuario = document.getElementById('input-usuario')?.value;
    const password = document.getElementById('input-password')?.value;
    const recordarme = document.getElementById('recordarme')?.checked;

    if (!usuario || !password) {
      this.mostrarNotificacion('Por favor ingrese usuario y contraseña', 'error');
      return;
    }

    try {
      this.mostrarLoader(true, 'Verificando credenciales...');
      
      const resultado = await servicioAuth.login(usuario, password, recordarme);
      
      if (resultado.exito) {
        this.mostrarNotificacion('¡Bienvenido al sistema!', 'success');
        // El event listener se encargará del resto
      } else {
        this.mostrarNotificacion(resultado.mensaje, 'error');
      }
      
    } catch (error) {
      console.error('❌ Error en login:', error);
      this.mostrarNotificacion('Error al iniciar sesión', 'error');
    } finally {
      this.mostrarLoader(false);
    }
  }

  /**
   * Muestra el modal de login
   */
  mostrarLogin() {
    this.ocultarElementos();
    
    const modalLogin = new bootstrap.Modal(document.getElementById('modalLogin'));
    modalLogin.show();
    
    // Limpiar formulario
    document.getElementById('form-login')?.reset();
  }

  /**
   * Inicia la aplicación después del login exitoso
   */
  async iniciarAplicacion() {
    try {
      console.log('🏠 Iniciando aplicación para usuario:', this.usuario.usuario);
      
      // Cerrar modal de login si está abierto
      const modalLogin = bootstrap.Modal.getInstance(document.getElementById('modalLogin'));
      modalLogin?.hide();
      
      // Mostrar elementos de la aplicación
      this.mostrarElementos();
      
      // Actualizar navbar con datos del usuario
      this.actualizarNavbar();
      
      // Verificar si necesita seleccionar planta
      if (this.necesitaSeleccionarPlanta()) {
        this.mostrarSeleccionPlanta();
      } else {
        // Ir a módulo de bienvenida
        await this.navegarA('bienvenida');
      }
      
    } catch (error) {
      console.error('❌ Error al iniciar aplicación:', error);
      this.mostrarError('Error al iniciar la aplicación');
    }
  }

  /**
   * Cierra la aplicación
   */
  cerrarAplicacion() {
    console.log('🔒 Cerrando aplicación...');
    
    this.usuario = null;
    this.plantaActiva = null;
    this.moduloActual = null;
    
    // Limpiar contenido
    this.limpiarContenido();
    
    // Ocultar elementos
    this.ocultarElementos();
  }

  /**
   * Navega a un módulo específico
   */
  async navegarA(modulo) {
    try {
      console.log(`📍 Navegando a módulo: ${modulo}`);
      
      this.mostrarLoader(true, `Cargando ${modulo}...`);
      
      // Actualizar navegación activa
      this.actualizarNavegacionActiva(modulo);
      
      // Cargar módulo
      switch (modulo) {
        case 'bienvenida':
          await this.cargarModuloBienvenida();
          break;
        case 'inventario':
          await this.cargarModuloInventario();
          break;
        case 'trazabilidad':
          await this.cargarModuloTrazabilidad();
          break;
        default:
          throw new Error(`Módulo desconocido: ${modulo}`);
      }
      
      this.moduloActual = modulo;
      
    } catch (error) {
      console.error(`❌ Error al navegar a ${modulo}:`, error);
      this.mostrarError(`Error al cargar ${modulo}`);
    } finally {
      this.mostrarLoader(false);
    }
  }

  /**
   * Carga el módulo de bienvenida
   */
  async cargarModuloBienvenida() {
    if (typeof ControladorBienvenida !== 'undefined') {
      const controlador = new ControladorBienvenida();
      await controlador.inicializar();
    } else {
      this.mostrarContenidoBasico('bienvenida');
    }
  }

  /**
   * Carga el módulo de inventario
   */
  async cargarModuloInventario() {
    if (typeof ControladorInventario !== 'undefined') {
      const controlador = new ControladorInventario();
      await controlador.inicializar();
    } else {
      this.mostrarContenidoBasico('inventario');
    }
  }

  /**
   * Carga el módulo de trazabilidad
   */
  async cargarModuloTrazabilidad() {
    if (typeof ControladorTrazabilidad !== 'undefined') {
      const controlador = new ControladorTrazabilidad();
      await controlador.inicializar();
    } else {
      this.mostrarContenidoBasico('trazabilidad');
    }
  }

  /**
   * Muestra contenido básico cuando no hay controlador específico
   */
  mostrarContenidoBasico(modulo) {
    const contenido = `
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="bi bi-gear"></i>
                  ${this.capitalizarTexto(modulo)}
                </h5>
              </div>
              <div class="card-body text-center py-5">
                <div class="mb-4">
                  <i class="bi bi-wrench display-1 text-muted"></i>
                </div>
                <h4>Módulo en Desarrollo</h4>
                <p class="text-muted mb-4">
                  El módulo de ${modulo} está siendo desarrollado.<br>
                  Pronto estará disponible con todas sus funcionalidades.
                </p>
                <button class="btn btn-primary" onclick="app.navegarA('bienvenida')">
                  <i class="bi bi-house"></i>
                  Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.establecerContenido(contenido);
  }

  /**
   * Utilities y métodos auxiliares
   */
  
  mostrarLoader(mostrar, mensaje = 'Cargando...') {
    const loader = document.getElementById('loader-inicial');
    if (loader) {
      loader.style.display = mostrar ? 'flex' : 'none';
      const texto = loader.querySelector('p');
      if (texto && mensaje) {
        texto.textContent = mensaje;
      }
    }
  }

  mostrarElementos() {
    document.getElementById('navbar-principal').style.display = 'block';
    document.getElementById('footer').style.display = 'block';
  }

  ocultarElementos() {
    document.getElementById('navbar-principal').style.display = 'none';
    document.getElementById('footer').style.display = 'none';
  }

  establecerContenido(html) {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.innerHTML = html;
    }
  }

  limpiarContenido() {
    this.establecerContenido('');
  }

  actualizarNavbar() {
    const spanUsuario = document.getElementById('usuario-navbar');
    const spanFooter = document.getElementById('usuario-activo-footer');
    
    if (spanUsuario) {
      spanUsuario.textContent = this.usuario.nombreCompleto || this.usuario.usuario;
    }
    
    if (spanFooter) {
      spanFooter.textContent = this.usuario.usuario;
    }
  }

  mostrarNotificacion(mensaje, tipo = 'info', autoClose = true) {
    const config = {
      text: mensaje,
      icon: tipo,
      position: CONSTANTES_FRONTEND.NOTIFICACIONES.POSICION,
      showConfirmButton: !autoClose,
      timer: autoClose ? CONSTANTES_FRONTEND.NOTIFICACIONES.DURACION_EXITO : null,
      toast: true
    };

    return Swal.fire(config);
  }

  mostrarError(mensaje) {
    return Swal.fire({
      title: 'Error',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Entendido'
    });
  }

  capitalizarTexto(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  // Métodos placeholder para funcionalidades futuras
  necesitaSeleccionarPlanta() {
    return false; // Por ahora no requerimos selección de planta
  }

  mostrarSeleccionPlanta() {
    // Implementar en el futuro
  }

  seleccionarPlanta(planta) {
    this.plantaActiva = planta;
    localStorage.setItem(CONSTANTES_FRONTEND.STORAGE.PLANT_KEY, planta);
  }

  actualizarNavegacionActiva(modulo) {
    // Remover active de todos
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
      link.classList.remove('active');
    });

    // Agregar active al módulo actual
    const linkActivo = document.getElementById(`nav-${modulo}`);
    if (linkActivo) {
      linkActivo.classList.add('active');
    }
  }

  async precargarDatos() {
    try {
      console.log('📦 Precargando datos maestros...');
      await apiMantenedores.precargarDatos();
    } catch (error) {
      console.warn('⚠️ Error al precargar datos:', error);
    }
  }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌟 DOM listo, iniciando WMS Ranco Cherries');
  window.app = new AplicacionWMS();
});

// Manejar errores no capturados
window.addEventListener('error', (e) => {
  console.error('❌ Error no capturado:', e.error);
  
  if (window.app) {
    window.app.mostrarNotificacion(
      'Ha ocurrido un error inesperado', 
      'error'
    );
  }
});

// Manejar promesas rechazadas
window.addEventListener('unhandledrejection', (e) => {
  console.error('❌ Promesa rechazada no manejada:', e.reason);
  
  if (window.app) {
    window.app.mostrarNotificación(
      'Error de conexión o procesamiento', 
      'warning'
    );
  }
});