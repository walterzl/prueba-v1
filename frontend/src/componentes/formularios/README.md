# Formularios del Sistema WMS

Este directorio contiene todos los formularios de ingreso de datos para el sistema WMS de Ranco Cherries.

## Componentes Disponibles

### 1. FormularioBase.vue

Componente base que proporciona la estructura común para todos los formularios:

- Header con título y descripción
- Manejo de mensajes de estado (éxito/error)
- Botones de acción estándar
- Sistema de validaciones integrado
- Estructura responsive

### 2. CampoFormulario.vue

Componente de campo de entrada con validaciones:

- Soporte para múltiples tipos de input (text, select, date, number, etc.)
- Validaciones en tiempo real
- Manejo de errores visual
- Soporte para campos requeridos y opcionales
- Responsive y accesible

### 3. BuscadorMaterial.vue

Componente de búsqueda de materiales con autocompletado:

- Búsqueda en tiempo real con debounce
- Lista de resultados con navegación por teclado
- Selección de material con información completa
- Validaciones integradas
- Cache de resultados para mejor performance

### 4. FormularioInventario.vue

Formulario completo para registro de inventario:

- Selección de material con búsqueda automática
- Campos de stock, pallets y fecha
- Selección de planta, bodega y ubicación
- Validaciones específicas del módulo
- Integración con APIs de mantenedores

### 5. FormularioTrazabilidad.vue

Formulario para movimientos de trazabilidad:

- Selección de tipo de movimiento
- Campos condicionales según el tipo
- Cálculo automático de impacto en stock
- Validaciones complejas y dinámicas
- Generación automática de ID de movimiento

### 6. FormularioRecepcionLotes.vue

Formulario para recepción de lotes con escáner QR:

- Escaneo de códigos QR integrado
- Entrada manual de códigos como alternativa
- Lista dinámica de materiales escaneados
- Validaciones por material individual
- Integración con cámara del dispositivo

## Uso Básico

### Importar un formulario

```javascript
import { FormularioInventario } from "@/componentes/formularios";
```

### Usar en un componente

```vue
<template>
  <FormularioInventario
    :datos-iniciales="datosIniciales"
    :planta-actual="plantaActual"
    @enviar="manejarEnvio"
    @cancelar="manejarCancelar"
  />
</template>
```

### Manejar eventos

```javascript
async function manejarEnvio(datos) {
  try {
    // Procesar datos del formulario
    await servicioInventario.crearInventario(datos);
    // Mostrar mensaje de éxito
  } catch (error) {
    // Manejar error
  }
}

function manejarCancelar() {
  // Navegar de vuelta o cerrar modal
}
```

## Validaciones

Todos los formularios incluyen validaciones automáticas:

- **Campos requeridos**: Se validan automáticamente
- **Formatos**: Fechas, números, códigos con patrones específicos
- **Validaciones personalizadas**: Lógica de negocio específica por módulo
- **Validación en tiempo real**: Los errores se muestran mientras el usuario escribe

## Estilos y Responsive

Los formularios están diseñados para ser:

- **Responsive**: Se adaptan a diferentes tamaños de pantalla
- **Accesibles**: Navegación por teclado y lectores de pantalla
- **Consistentes**: Mismo estilo visual en toda la aplicación
- **Modernos**: Diseño limpio y profesional

## Integración con APIs

Los formularios se integran automáticamente con:

- **Servicio de Mantenedores**: Para datos maestros (plantas, bodegas, etc.)
- **Servicios específicos**: Cada módulo tiene su servicio correspondiente
- **Cache de datos**: Para mejorar la performance y reducir llamadas a la API

## Personalización

Los formularios pueden personalizarse mediante:

- **Props**: Para pasar datos iniciales y configuración
- **Slots**: Para personalizar botones y contenido adicional
- **Eventos**: Para manejar acciones personalizadas
- **CSS**: Para ajustar estilos específicos

## Dependencias

Los formularios requieren:

- Vue 3 con Composition API
- Librería html5-qrcode para escaneo QR
- Servicios de API del sistema
- Composable usarFormulario para estado y validaciones

## Ejemplos de Uso

### Formulario de Inventario

```vue
<FormularioInventario
  titulo="Nuevo Inventario"
  :planta-actual="'Rancagua'"
  @enviar="guardarInventario"
/>
```

### Formulario de Trazabilidad

```vue
<FormularioTrazabilidad
  :datos-iniciales="{ planta: 'Chimbarongo' }"
  @enviar="crearMovimiento"
  @material-seleccionado="manejarMaterial"
/>
```

### Formulario de Recepción

```vue
<FormularioRecepcionLotes
  :planta-actual="plantaSeleccionada"
  @enviar="procesarRecepcion"
  @material-escaneado="mostrarMaterial"
/>
```

## Notas de Desarrollo

- Todos los formularios siguen el patrón de diseño establecido
- Las validaciones son consistentes entre módulos
- El código está completamente en español según las especificaciones
- Se incluyen comentarios y documentación en el código
- Los formularios son reutilizables y modulares
