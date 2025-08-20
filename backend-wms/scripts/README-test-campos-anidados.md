# Script de Pruebas y Documentación - Campos Anidados

Este script actualizado no solo ejecuta pruebas completas del sistema de campos anidados, sino que también **genera automáticamente documentación completa de schemas y APIs**.

## Características

### 🧪 **Pruebas Automatizadas**

- Autenticación automática con usuario admin
- Pruebas de configuración de formularios
- Pruebas de opciones básicas y con búsqueda
- Pruebas de paginación
- Validación de valores
- Campos especiales (unidades de medida, certificaciones, etc.)

### 📚 **Generación Automática de Documentación**

- **Schema detallado** de cada API
- **Ejemplos de uso** en JavaScript/Axios y cURL
- **Análisis de estructura** de respuestas
- **Parámetros documentados** con tipos y descripciones
- **Códigos de error** y manejo
- **Estadísticas de rendimiento**

## Uso

### Ejecutar Pruebas y Generar Documentación

```bash
cd backend-wms
node scripts/test-campos-anidados.js
```

### Salida del Script

El script genera:

1. **Pruebas en consola**: Resultados detallados de cada prueba
2. **Archivo de documentación**: `DOCUMENTACION_CAMPOS_ANIDADOS_YYYY-MM-DD.md`
3. **Estadísticas finales**: Resumen completo del análisis

## Archivo de Documentación Generado

El archivo generado incluye:

### 📋 **Información General**

- Estadísticas de APIs documentadas
- Tasa de éxito general
- Información de autenticación

### 🔧 **Por cada API documentada:**

- Descripción detallada
- Parámetros con tipos y ejemplos
- Schema de respuesta exitosa
- Schema de respuesta de error
- Ejemplos de código (JavaScript/cURL)
- Estructura de datos analizada

### 📖 **Secciones Adicionales**

- Códigos de error comunes
- Formularios disponibles
- Campos comunes
- Notas técnicas

## APIs Documentadas

El script documenta automáticamente:

### **Endpoints de Configuración**

- `GET /{formulario}/configuracion`

### **Endpoints de Opciones**

- `GET /{formulario}/{campo}/opciones`
- `GET /{formulario}/{campo}/opciones-paginadas`

### **Endpoints de Búsqueda**

- `GET /{formulario}/buscar-multiples`

### **Endpoints de Validación**

- `GET /{formulario}/{campo}/validar/{valor}`

### **Formularios Cubiertos**

- INVENTARIO
- TRAZABILIDAD
- RECEPCIONES_LOTES
- OPERACIONES_FRIO_DESPACHO
- STOCK_UBICACIONES
- TARJAS

## Características Técnicas

### **Análisis Automático**

- Detecta estructura de datos automáticamente
- Infiere tipos de parámetros
- Genera descripciones contextuales
- Analiza patrones de respuesta

### **Documentación Rich**

- Markdown con formato profesional
- Ejemplos de código listos para usar
- Tablas organizadas
- Secciones bien estructuradas

### **Estadísticas en Tiempo Real**

- Tiempo de respuesta por API
- Tasa de éxito/fallo
- Número total de llamadas
- Rendimiento promedio

## Ejemplo de Salida

```
🚀 Iniciando pruebas de APIs de Campos Anidados
==================================================
🔐 Usuario autenticado: admin
🌐 API Base: http://localhost:3001/api/campos-anidados
==================================================

📋 Probando configuración para formulario: INVENTARIO
✅ Configuración obtenida exitosamente
   - Campos encontrados: 3
   - Campos: materiales, ubicaciones, plantas

📚 Generando documentación completa...
✅ Documentación guardada en: DOCUMENTACION_CAMPOS_ANIDADOS_2025-08-20.md

============================================================
📊 RESUMEN FINAL
============================================================
📋 APIs documentadas: 21
📄 Archivo generado: DOCUMENTACION_CAMPOS_ANIDADOS_2025-08-20.md
🎯 Tasa de éxito: 81.5%
⏱️  Total de llamadas: 27
```

## Uso Programático

También puedes usar las funciones individualmente:

```javascript
const {
  autenticarUsuario,
  generarDocumentacionSchemas,
  generarArchivoDocumentacion,
  DOCUMENTACION_GENERADA,
} = require("./scripts/test-campos-anidados");

// Generar solo documentación
await autenticarUsuario();
// ... hacer llamadas a APIs ...
generarDocumentacionSchemas();
const archivo = generarArchivoDocumentacion();
```

## Beneficios

### ✅ **Para Desarrolladores**

- Documentación siempre actualizada
- Ejemplos de código listos para usar
- Schemas detallados para validación
- Tiempo de desarrollo reducido

### ✅ **Para QA/Testing**

- Cobertura completa de APIs
- Verificación automática de schemas
- Detección de cambios en APIs
- Reportes de rendimiento

### ✅ **Para Documentación**

- Genera documentación profesional
- Mantiene consistencia en formatos
- Actualización automática
- Ejemplos reales y funcionales

---

_Este script es parte del sistema WMS Ranco Cherries y se actualiza automáticamente con cada ejecución._
