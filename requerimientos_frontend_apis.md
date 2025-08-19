# Sistema WMS Ranco Cherries - Guía Completa Frontend con APIs Backend

## Información del Proyecto

- **Cliente**: Ranco Cherries (Exportadora Rancagua S.A.)
- **Aplicación**: Bodega y Patio WMS - Trazabilidad de Materiales
- **Backend**: Node.js con Express.js y Prisma ORM
- **Frontend**: Vue.js 3 con Vite
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT
- **API Base URL**: `http://localhost:3001/api`

---

## 🔧 STACK TECNOLÓGICO IMPLEMENTADO

### Backend Funcional

- ✅ **Node.js 18+** con Express.js
- ✅ **Prisma ORM** para base de datos
- ✅ **PostgreSQL** como base de datos
- ✅ **JWT** para autenticación
- ✅ **69 endpoints** completamente implementados
- ✅ **Middleware** de autenticación y validación
- ✅ **Sistema de logs** y auditoría

### Frontend en Desarrollo

- ✅ **Vue.js 3** con Composition API
- ✅ **Vite** como bundler
- ✅ **Vue Router** para navegación
- ✅ **Pinia** para manejo de estado
- ✅ **Proxy configurado** para APIs
- ✅ **Tema moderno** implementado

---

## 🔐 AUTENTICACIÓN Y CONFIGURACIÓN

### 1. Sistema de Autenticación

**Credenciales de prueba disponibles:**

```json
{
  "usuario": "admin",
  "password": "1234567"
}
```

**Endpoint de Login:**

```javascript
// Servicio de Autenticación
const servicioAuth = {
  async login(credenciales) {
    const respuesta = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credenciales),
    });
    return respuesta.json();
  },
};
```

**Respuesta esperada:**

```json
{
  "exito": true,
  "mensaje": "Inicio de sesión exitoso",
  "datos": {
    "token": "jwt_token_aqui",
    "usuario": {
      "id": 1,
      "usuario": "admin",
      "nombre": "Administrador Sistema",
      "rol": "admin",
      "planta_asignada": "Ambas"
    }
  }
}
```

### 2. Configuración de Headers para APIs Autenticadas

```javascript
// Cliente API genérico
const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem("authToken");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  return response.json();
};
```

---

## 🏭 MÓDULOS FRONTEND CON APIS BACKEND

### 🏠 1. MÓDULO BIENVENIDA/INICIO

#### APIs Necesarias:

- `GET /api/mantenedores/plantas` - Obtener plantas disponibles
- `GET /api/reportes/dashboard` - Estadísticas del dashboard

#### Implementación Frontend:

```vue
<template>
  <div class="dashboard-container">
    <div class="stats-cards">
      <div class="stat-card" v-for="stat in estadisticas" :key="stat.label">
        <span class="stat-number">{{ stat.valor }}</span>
        <span class="stat-label">{{ stat.label }}</span>
      </div>
    </div>

    <div class="navigation-cards">
      <RouterLink
        v-for="modulo in modulos"
        :key="modulo.ruta"
        :to="modulo.ruta"
        class="nav-card"
      >
        <div class="card-icon">{{ modulo.icono }}</div>
        <h3>{{ modulo.titulo }}</h3>
        <p>{{ modulo.descripcion }}</p>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const estadisticas = ref([]);
const modulos = ref([
  {
    titulo: "Inventario",
    descripcion: "Gestión y control de stock en tiempo real",
    ruta: "/inventario",
    icono: "📦",
  },
  {
    titulo: "Trazabilidad",
    descripcion: "Seguimiento completo de movimientos",
    ruta: "/trazabilidad",
    icono: "📋",
  },
  {
    titulo: "Recepción Lotes",
    descripcion: "Registro de nuevos ingresos",
    ruta: "/recepcion-lotes",
    icono: "📥",
  },
  {
    titulo: "Frío y Despacho",
    descripcion: "Control de operaciones de frío",
    ruta: "/frio-despacho",
    icono: "❄️",
  },
  {
    titulo: "Tarjas",
    descripcion: "Gestión e impresión de tarjas",
    ruta: "/tarjas",
    icono: "🏷️",
  },
]);

onMounted(async () => {
  try {
    const response = await apiClient("/reportes/dashboard");
    if (response.exito) {
      estadisticas.value = [
        {
          label: "Materiales en Stock",
          valor: response.datos.total_materiales,
        },
        {
          label: "Ubicaciones Activas",
          valor: response.datos.total_ubicaciones,
        },
        { label: "Proveedores", valor: response.datos.total_proveedores },
        { label: "Movimientos Hoy", valor: response.datos.movimientos_hoy },
      ];
    }
  } catch (error) {
    console.error("Error al cargar dashboard:", error);
  }
});
</script>
```

---

### 📦 2. MÓDULO INVENTARIO

#### APIs Backend Disponibles:

```javascript
// Obtener inventario con filtros
GET /api/inventario
// Parámetros: ?planta=Rancagua&pagina=1&limite=50

// Obtener inventario por planta
GET /api/inventario/planta/:planta

// Crear nuevo registro de inventario
POST /api/inventario

// Buscar en inventario
GET /api/inventario/buscar?termino=MATERIAL

// Resumen de stock
GET /api/inventario/resumen-stock
```

#### Servicio Frontend:

```javascript
// servicios/servicioInventario.js
export const servicioInventario = {
  async obtenerInventario(filtros = {}) {
    const params = new URLSearchParams(filtros);
    const response = await apiClient(`/inventario?${params}`);
    return response;
  },

  async crearRegistroInventario(datos) {
    const response = await apiClient("/inventario", {
      method: "POST",
      body: JSON.stringify(datos),
    });
    return response;
  },

  async buscarMaterial(termino) {
    const response = await apiClient(`/inventario/buscar?termino=${termino}`);
    return response;
  },

  async obtenerResumenStock() {
    const response = await apiClient("/inventario/resumen-stock");
    return response;
  },
};
```

#### Componente Vue:

```vue
<template>
  <div class="inventario-container">
    <!-- Formulario de nuevo inventario -->
    <div class="card">
      <h2>Registrar Inventario</h2>
      <form @submit.prevent="registrarInventario">
        <div class="form-grid">
          <div class="form-group">
            <label>Código Material</label>
            <input
              v-model="formulario.title"
              @input="buscarMaterial"
              placeholder="Buscar por código"
            />
          </div>

          <div class="form-group">
            <label>Nombre Material</label>
            <input v-model="formulario.nombre_material" readonly />
          </div>

          <div class="form-group">
            <label>Stock</label>
            <input
              v-model="formulario.stock"
              type="number"
              min="0"
              step="0.1"
            />
          </div>

          <div class="form-group">
            <label>Pallets</label>
            <input v-model="formulario.pallets" type="number" min="0" />
          </div>

          <div class="form-group">
            <label>Bodega</label>
            <select v-model="formulario.bodega">
              <option value="">Seleccionar bodega</option>
              <option
                v-for="ubicacion in ubicaciones"
                :key="ubicacion.id"
                :value="ubicacion.bodega_deposito"
              >
                {{ ubicacion.bodega_deposito }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Ubicación</label>
            <select v-model="formulario.ubicacion">
              <option value="">Seleccionar ubicación</option>
              <option
                v-for="ubicacion in ubicacionesFiltradas"
                :key="ubicacion.id"
                :value="ubicacion.title"
              >
                {{ ubicacion.title }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Lote</label>
            <input v-model="formulario.lote" />
          </div>

          <div class="form-group">
            <label>Contado por</label>
            <input v-model="formulario.contado_por" required />
          </div>
        </div>

        <button type="submit" class="btn-primary">Guardar Inventario</button>
      </form>
    </div>

    <!-- Tabla de inventarios -->
    <div class="card">
      <h2>Inventario Actual</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Material</th>
              <th>Stock</th>
              <th>Pallets</th>
              <th>Ubicación</th>
              <th>Lote</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in inventario" :key="item.id">
              <td>{{ item.title }}</td>
              <td>{{ item.nombre_material }}</td>
              <td>{{ item.stock }} {{ item.unidad_medida }}</td>
              <td>{{ item.pallets }}</td>
              <td>{{ item.ubicacion }}</td>
              <td>{{ item.lote }}</td>
              <td>{{ formatearFecha(item.fecha_inventario) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { servicioInventario } from "@/servicios/servicioInventario";
import { servicioMantenedores } from "@/servicios/servicioMantenedores";

const formulario = ref({
  title: "",
  nombre_material: "",
  stock: 0,
  pallets: 0,
  bodega: "",
  ubicacion: "",
  lote: "",
  contado_por: "",
  planta: "Rancagua", // Obtener de sesión
});

const inventario = ref([]);
const materiales = ref([]);
const ubicaciones = ref([]);

const ubicacionesFiltradas = computed(() => {
  return ubicaciones.value.filter(
    (u) => u.bodega_deposito === formulario.value.bodega
  );
});

async function buscarMaterial() {
  if (formulario.value.title.length >= 2) {
    try {
      const response = await servicioInventario.buscarMaterial(
        formulario.value.title
      );
      if (response.exito && response.datos.length > 0) {
        const material = response.datos[0];
        formulario.value.nombre_material = material.nombre_material;
      }
    } catch (error) {
      console.error("Error al buscar material:", error);
    }
  }
}

async function registrarInventario() {
  try {
    const response = await servicioInventario.crearRegistroInventario(
      formulario.value
    );
    if (response.exito) {
      alert("Inventario registrado exitosamente");
      await cargarInventario();
      // Limpiar formulario
      Object.keys(formulario.value).forEach((key) => {
        if (key !== "planta") formulario.value[key] = "";
      });
    }
  } catch (error) {
    console.error("Error al registrar inventario:", error);
    alert("Error al registrar inventario");
  }
}

async function cargarInventario() {
  try {
    const response = await servicioInventario.obtenerInventario({
      planta: formulario.value.planta,
    });
    if (response.exito) {
      inventario.value = response.datos.inventario;
    }
  } catch (error) {
    console.error("Error al cargar inventario:", error);
  }
}

async function cargarUbicaciones() {
  try {
    const response = await servicioMantenedores.obtenerUbicaciones();
    if (response.exito) {
      ubicaciones.value = response.datos;
    }
  } catch (error) {
    console.error("Error al cargar ubicaciones:", error);
  }
}

onMounted(() => {
  cargarInventario();
  cargarUbicaciones();
});
</script>
```

---

### 🔄 3. MÓDULO TRAZABILIDAD

#### APIs Backend Disponibles:

```javascript
// Obtener movimientos de trazabilidad
GET /api/trazabilidad
// Parámetros: ?planta=Rancagua&fecha_desde=2024-01-01&tipo_movimiento=INGRESO

// Crear movimiento de trazabilidad
POST /api/trazabilidad

// Buscar movimientos
GET /api/trazabilidad/buscar?termino=MATERIAL

// Movimientos por material
GET /api/trazabilidad/material/:material_id

// Resumen de movimientos
GET /api/trazabilidad/resumen
```

#### Servicio Frontend:

```javascript
// servicios/servicioTrazabilidad.js
export const servicioTrazabilidad = {
  async obtenerMovimientos(filtros = {}) {
    const params = new URLSearchParams(filtros);
    return await apiClient(`/trazabilidad?${params}`);
  },

  async crearMovimiento(movimiento) {
    return await apiClient("/trazabilidad", {
      method: "POST",
      body: JSON.stringify(movimiento),
    });
  },

  async obtenerResumen() {
    return await apiClient("/trazabilidad/resumen");
  },

  async buscarMovimientos(termino) {
    return await apiClient(`/trazabilidad/buscar?termino=${termino}`);
  },
};
```

#### Datos de Ejemplo para Movimiento:

```javascript
const movimientoEjemplo = {
  tipo_movimiento: "INGRESO",
  planta: "Rancagua",
  guia_sii: "GR-2024-001",
  fecha: "2024-08-17T10:30:00.000Z",
  proveedor_id: 1,
  material_id: 1,
  lote: "L2024-001",
  cantidad: 1000,
  bodega_origen: "Patio",
  bodega_destino: "Bodega Principal",
  ubicacion_origen: "Recepción",
  ubicacion_destino: "A01-001",
  turno: "Turno 1",
  observaciones: "Recepción normal de material",
};
```

---

### 📥 4. MÓDULO RECEPCIÓN DE LOTES

#### APIs Backend Disponibles:

```javascript
// Obtener recepciones
GET /api/recepciones-lotes
// Parámetros: ?planta=Rancagua&estado=pendiente

// Crear nueva recepción
POST /api/recepciones-lotes

// Recepciones por proveedor
GET /api/recepciones-lotes/proveedor/:proveedor_id

// Buscar recepciones
GET /api/recepciones-lotes/buscar?termino=GR-2024

// Resumen de recepciones
GET /api/recepciones-lotes/resumen
```

#### Servicio Frontend:

```javascript
// servicios/servicioRecepcionLotes.js
export const servicioRecepcionLotes = {
  async crearRecepcion(recepcion) {
    return await apiClient("/recepciones-lotes", {
      method: "POST",
      body: JSON.stringify(recepcion),
    });
  },

  async obtenerRecepciones(filtros = {}) {
    const params = new URLSearchParams(filtros);
    return await apiClient(`/recepciones-lotes?${params}`);
  },

  async obtenerResumen() {
    return await apiClient("/recepciones-lotes/resumen");
  },
};
```

#### Ejemplo de Recepción:

```javascript
const recepcionEjemplo = {
  numero_guia: "GR-2024-001",
  material_id: 1,
  proveedor_id: 2,
  ubicacion_id: 3,
  planta: "Rancagua",
  cantidad_recibida: 500,
  lote: "L2024-001",
  fecha_recepcion: "2024-08-17T08:30:00.000Z",
  numero_factura: "FAC-001",
  observaciones: "Recepción normal",
  qr_code: "QR123456", // Opcional, se genera automáticamente
};
```

---

### ❄️ 5. MÓDULO FRÍO Y DESPACHO

#### APIs Backend Disponibles:

```javascript
// Obtener operaciones de frío
GET /api/operaciones-frio-despacho
// Parámetros: ?tipo_operacion=consumo&embarque=EMB-001

// Crear operación de frío
POST /api/operaciones-frio-despacho

// Operaciones por embarque
GET /api/operaciones-frio-despacho/embarque/:numero_embarque

// Resumen de operaciones
GET /api/operaciones-frio-despacho/resumen
```

#### Servicio Frontend:

```javascript
// servicios/servicioFrioDespacho.js
export const servicioFrioDespacho = {
  async crearOperacion(operacion) {
    return await apiClient("/operaciones-frio-despacho", {
      method: "POST",
      body: JSON.stringify(operacion),
    });
  },

  async obtenerOperaciones(filtros = {}) {
    const params = new URLSearchParams(filtros);
    return await apiClient(`/operaciones-frio-despacho?${params}`);
  },

  async obtenerPorEmbarque(numeroEmbarque) {
    return await apiClient(
      `/operaciones-frio-despacho/embarque/${numeroEmbarque}`
    );
  },
};
```

#### Ejemplo de Operación:

```javascript
const operacionEjemplo = {
  material_id: 1,
  ubicacion_origen_id: 3,
  ubicacion_destino_id: 4,
  tipo_operacion: "consumo", // o "despacho"
  planta: "Rancagua",
  cantidad: 50,
  lote: "L2024-001",
  embarque: "EMB-001",
  observaciones: "Operación de consumo para embarque especial",
};
```

---

### 🏷️ 6. MÓDULO TARJAS

#### APIs Backend Disponibles:

```javascript
// Obtener tarjas
GET /api/tarjas
// Parámetros: ?tipo_tarja=CAA&estado=pendiente

// Crear nueva tarja
POST /api/tarjas

// Marcar como impresa
PUT /api/tarjas/:id/imprimir

// Tarjas pendientes
GET /api/tarjas/pendientes

// Tarjas por tipo
GET /api/tarjas/tipo/:tipo_tarja
```

#### Servicio Frontend:

```javascript
// servicios/servicioTarjas.js
export const servicioTarjas = {
  async crearTarja(tarja) {
    return await apiClient("/tarjas", {
      method: "POST",
      body: JSON.stringify(tarja),
    });
  },

  async marcarComoImpresa(id) {
    return await apiClient(`/tarjas/${id}/imprimir`, {
      method: "PUT",
    });
  },

  async obtenerPendientes() {
    return await apiClient("/tarjas/pendientes");
  },

  async obtenerPorTipo(tipo) {
    return await apiClient(`/tarjas/tipo/${tipo}`);
  },
};
```

#### Ejemplo de Tarja:

```javascript
const tarjaEjemplo = {
  tipo_tarja: "CAA", // o "BODEGA"
  planta: "Rancagua",
  descripcion: "Tarja para certificación CAA proceso especial",
  observaciones: "Creada para lote especial de exportación",
};
```

---

### 🔧 7. MANTENEDORES (APIs DE SOPORTE)

#### APIs Disponibles:

```javascript
// Obtener materiales
GET /api/mantenedores/materiales
GET /api/mantenedores/materiales/codigo/:codigo

// Obtener proveedores
GET /api/mantenedores/proveedores
GET /api/mantenedores/proveedores/codigo/:codigo

// Obtener ubicaciones
GET /api/mantenedores/ubicaciones
GET /api/mantenedores/ubicaciones/planta/:planta

// Obtener plantas
GET /api/mantenedores/plantas

// Obtener temporadas
GET /api/mantenedores/temporadas
GET /api/mantenedores/temporadas/activa

// Obtener tipos de movimiento
GET /api/mantenedores/tipos-movimiento

// Crear nuevos mantenedores
POST /api/mantenedores/materiales
POST /api/mantenedores/proveedores
POST /api/mantenedores/ubicaciones
POST /api/mantenedores/temporadas
POST /api/mantenedores/tipos-movimiento
```

#### Servicio Frontend Centralizado:

```javascript
// servicios/servicioMantenedores.js
export const servicioMantenedores = {
  // Materiales
  async obtenerMateriales() {
    return await apiClient("/mantenedores/materiales");
  },

  async obtenerMaterialPorCodigo(codigo) {
    return await apiClient(`/mantenedores/materiales/codigo/${codigo}`);
  },

  async crearMaterial(material) {
    return await apiClient("/mantenedores/materiales", {
      method: "POST",
      body: JSON.stringify(material),
    });
  },

  // Proveedores
  async obtenerProveedores() {
    return await apiClient("/mantenedores/proveedores");
  },

  async crearProveedor(proveedor) {
    return await apiClient("/mantenedores/proveedores", {
      method: "POST",
      body: JSON.stringify(proveedor),
    });
  },

  // Ubicaciones
  async obtenerUbicaciones() {
    return await apiClient("/mantenedores/ubicaciones");
  },

  async obtenerUbicacionesPorPlanta(planta) {
    return await apiClient(`/mantenedores/ubicaciones/planta/${planta}`);
  },

  async crearUbicacion(ubicacion) {
    return await apiClient("/mantenedores/ubicaciones", {
      method: "POST",
      body: JSON.stringify(ubicacion),
    });
  },

  // Plantas
  async obtenerPlantas() {
    return await apiClient("/mantenedores/plantas");
  },

  // Temporadas
  async obtenerTemporadas() {
    return await apiClient("/mantenedores/temporadas");
  },

  async obtenerTemporadaActiva() {
    return await apiClient("/mantenedores/temporadas/activa");
  },

  // Tipos de Movimiento
  async obtenerTiposMovimiento() {
    return await apiClient("/mantenedores/tipos-movimiento");
  },
};
```

---

## 📊 REPORTES Y DASHBOARD

### APIs de Reportes:

```javascript
// Dashboard principal
GET /api/reportes/dashboard?planta=Rancagua

// Reporte de inventario por planta
GET /api/reportes/inventario/planta?planta=Rancagua&fecha_desde=2024-01-01

// Reporte de movimientos por período
GET /api/reportes/movimientos/periodo?fecha_desde=2024-01-01&fecha_fin=2024-01-31

// Reporte de stock por material
GET /api/reportes/stock/material?material=MAT001

// Reporte de auditoría
GET /api/reportes/auditoria?fecha_desde=2024-01-01&fecha_hasta=2024-01-31
```

### Servicio de Reportes:

```javascript
// servicios/servicioReportes.js
export const servicioReportes = {
  async obtenerDashboard(planta = "") {
    const params = planta ? `?planta=${planta}` : "";
    return await apiClient(`/reportes/dashboard${params}`);
  },

  async reporteInventarioPorPlanta(planta, fechaDesde, fechaHasta) {
    const params = new URLSearchParams({
      planta,
      ...(fechaDesde && { fecha_desde: fechaDesde }),
      ...(fechaHasta && { fecha_hasta: fechaHasta }),
    });
    return await apiClient(`/reportes/inventario/planta?${params}`);
  },

  async reporteMovimientosPorPeriodo(filtros) {
    const params = new URLSearchParams(filtros);
    return await apiClient(`/reportes/movimientos/periodo?${params}`);
  },
};
```

---

## 🛠️ UTILIDADES Y HELPERS

### APIs Utilitarias:

```javascript
// Health check
GET / api / utils / health;

// Información de versión
GET / api / utils / version;

// Generar código
POST / api / utils / generar - codigo;

// Validar código de barras
POST / api / utils / validar - codigo - barras;
```

### Funciones Helper Frontend:

```javascript
// utilidades/helpers.js
export const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString("es-CL");
};

export const formatearFechaHora = (fecha) => {
  return new Date(fecha).toLocaleString("es-CL");
};

export const formatearNumero = (numero, decimales = 2) => {
  return Number(numero).toFixed(decimales);
};

export const validarEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const generarIdTemporal = () => {
  return Date.now() + "-" + Math.random().toString(36).substr(2, 9);
};
```

---

## 🔐 MANEJO DE ERRORES Y VALIDACIONES

### Interceptor de Respuestas:

```javascript
// servicios/api.js
const apiClient = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`/api${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      // Manejar diferentes tipos de error
      switch (response.status) {
        case 401:
          // Token expirado o inválido
          logout();
          router.push("/login");
          throw new Error(
            "Sesión expirada. Por favor, inicie sesión nuevamente."
          );

        case 403:
          throw new Error("No tiene permisos para realizar esta acción.");

        case 404:
          throw new Error("Recurso no encontrado.");

        case 409:
          throw new Error(
            data.mensaje || "Conflicto con los datos existentes."
          );

        case 422:
          throw new Error(data.mensaje || "Datos de entrada inválidos.");

        case 500:
          throw new Error("Error interno del servidor. Intente nuevamente.");

        default:
          throw new Error(data.mensaje || "Error desconocido.");
      }
    }

    return data;
  } catch (error) {
    console.error(`Error en ${endpoint}:`, error);
    throw error;
  }
};
```

### Validaciones Frontend:

```javascript
// utilidades/validaciones.js
export const validarFormularioInventario = (datos) => {
  const errores = [];

  if (!datos.title) {
    errores.push("El código del material es requerido");
  }

  if (!datos.stock || datos.stock < 0) {
    errores.push("El stock debe ser un número mayor o igual a cero");
  }

  if (!datos.contado_por) {
    errores.push('El campo "Contado por" es requerido');
  }

  return errores;
};

export const validarFormularioTrazabilidad = (datos) => {
  const errores = [];

  if (!datos.tipo_movimiento) {
    errores.push("El tipo de movimiento es requerido");
  }

  if (!datos.material_id) {
    errores.push("El material es requerido");
  }

  if (!datos.cantidad || datos.cantidad <= 0) {
    errores.push("La cantidad debe ser mayor a cero");
  }

  return errores;
};
```

---

## 📱 ESTRUCTURA DE CARPETAS FRONTEND

```
src/
├── main.js                 # Punto de entrada
├── App.vue                 # Componente raíz
├── router/
│   └── index.js           # Configuración de rutas
├── almacen/
│   └── almacenAuth.js     # Store de autenticación (Pinia)
├── servicios/
│   ├── api.js             # Cliente API base
│   ├── servicioAuth.js    # Autenticación
│   ├── servicioInventario.js
│   ├── servicioTrazabilidad.js
│   ├── servicioRecepcionLotes.js
│   ├── servicioFrioDespacho.js
│   ├── servicioTarjas.js
│   ├── servicioMantenedores.js
│   └── servicioReportes.js
├── vistas/
│   ├── VistaLogin.vue
│   ├── VistaInicio.vue
│   ├── VistaInventario.vue
│   ├── VistaTrazabilidad.vue
│   ├── VistaRecepcionLotes.vue
│   ├── VistaFrioDespacho.vue
│   └── VistaTarjas.vue
├── componentes/
│   ├── FormularioInventario.vue
│   ├── TablaInventario.vue
│   ├── SelectorMaterial.vue
│   ├── SelectorUbicacion.vue
│   └── ModalConfirmacion.vue
└── utilidades/
    ├── helpers.js
    ├── validaciones.js
    └── constantes.js
```

---

## 🚀 PRÓXIMOS PASOS DE DESARROLLO

### Fase 1: Funcionalidad Básica (En Progreso)

- ✅ Configuración de proyecto Vue.js
- ✅ Sistema de autenticación
- ✅ Servicios API base
- ✅ Vista de inicio/dashboard
- 🔄 Módulo de inventario (en desarrollo)
- ⏳ Módulo de trazabilidad
- ⏳ Módulo de recepción de lotes

### Fase 2: Funcionalidades Avanzadas

- ⏳ Módulo de frío y despacho
- ⏳ Módulo de tarjas
- ⏳ Sistema de reportes completo
- ⏳ Validaciones avanzadas
- ⏳ Manejo de errores mejorado

### Fase 3: Optimización

- ⏳ Implementación de cache
- ⏳ Optimización de rendimiento
- ⏳ Pruebas automatizadas
- ⏳ Documentación completa

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### APIs Backend (✅ Completado)

- [x] 69 endpoints implementados y funcionales
- [x] Autenticación JWT
- [x] Validaciones de datos
- [x] Sistema de logs
- [x] Manejo de errores
- [x] Documentación completa

### Frontend Vue.js (🔄 En Progreso)

- [x] Configuración base de proyecto
- [x] Sistema de autenticación
- [x] Cliente API configurado
- [x] Store de estado (Pinia)
- [x] Enrutamiento (Vue Router)
- [x] Tema y estilos modernos
- [x] Vista de inicio/dashboard
- [ ] Módulo de inventario completo
- [ ] Módulo de trazabilidad
- [ ] Módulo de recepción lotes
- [ ] Módulo de frío y despacho
- [ ] Módulo de tarjas
- [ ] Sistema de reportes
- [ ] Validaciones frontend
- [ ] Manejo de errores robusto

---

## ⚡ COMANDOS DE DESARROLLO

### Backend:

```bash
# Iniciar servidor de desarrollo
npm run dev

# Ejecutar pruebas de APIs
node scripts/test-post-apis.js

# Resetear contraseñas (desarrollo)
npm run admin:reset-passwords
```

### Frontend:

```bash
# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

---

## 💡 NOTAS IMPORTANTES

1. **Todas las APIs están funcionalmente implementadas** en el backend
2. **El frontend está parcialmente implementado** con estructura base
3. **La autenticación funciona completamente** entre frontend y backend
4. **El proxy de Vite está configurado** para evitar problemas de CORS
5. **Las credenciales de prueba están disponibles** (usuario: admin, password: 1234567)
6. **Cada módulo frontend debe implementarse siguiendo los patrones establecidos**

Este documento sirve como guía completa para completar el desarrollo del frontend, aprovechando las 69 APIs completamente funcionales del backend.
