# MANUAL TÉCNICO DE IMPLEMENTACIÓN

## SISTEMA WMS RANCO CHERRIES

**Cliente:** Ranco Cherries (Exportadora Rancagua S.A.)  
**Sistema:** Bodega y Patio WMS - Trazabilidad de Materiales  
**Versión:** 1.0 - Manual Técnico de Implementación  
**Fecha:** Agosto 2024

---

## TABLA DE CONTENIDOS

1. [ARQUITECTURA Y TECNOLOGÍAS](#1-arquitectura-y-tecnologías)
2. [ESTRUCTURA DE BASE DE DATOS](#2-estructura-de-base-de-datos)
3. [MÓDULO BIENVENIDA/INICIO](#3-módulo-bienvenidainicio)
4. [MÓDULO INVENTARIO](#4-módulo-inventario)
5. [MÓDULO TRAZABILIDAD](#5-módulo-trazabilidad)
6. [MÓDULO RECEPCIÓN DE LOTES](#6-módulo-recepción-de-lotes)
7. [MÓDULO FRÍO Y DESPACHO](#7-módulo-frío-y-despacho)
8. [MÓDULO TARJAS CAA](#8-módulo-tarjas-caa)
9. [MÓDULO TARJAS BODEGA](#9-módulo-tarjas-bodega)
10. [APIS Y ENDPOINTS](#10-apis-y-endpoints)
11. [VALIDACIONES Y SEGURIDAD](#11-validaciones-y-seguridad)
12. [CONSIDERACIONES DE IMPLEMENTACIÓN](#12-consideraciones-de-implementación)

---

## 1. ARQUITECTURA Y TECNOLOGÍAS

### 1.1 Stack Tecnológico Recomendado

- **Base de Datos:** PostgreSQL 14+
- **Backend:** Node.js 18+ con Express.js
- **ORM:** Prisma
- **Frontend:** Vue.js 3 con Composition API
- **Bundler:** Vite
- **Autenticación:** JWT (JSON Web Tokens)
- **Escáner QR:** qrcode y html5-qrcode
- **Generación PDF:** jsPDF
- **Generación Excel:** xlsx
- **Estado Global:** Pinia (Vue)
- **Estilos:** CSS3 + Bootstrap 5 o Tailwind CSS

### 1.2 Principios de Desarrollo

- Nomenclatura completamente en español
- Código limpio y legible
- Arquitectura simple y mantenible
- Fomentar la reutilización de código
- Separación clara de responsabilidades
- Validaciones tanto en frontend como backend
- Manejo robusto de errores
- Logs de auditoría completos

---

## 2. ESTRUCTURA DE BASE DE DATOS

### 2.1 Tabla Principal: trazabilidad_materiales_r9

Registra todos los movimientos de materiales del sistema.

| Campo             | Tipo          | Descripción                                    |
| ----------------- | ------------- | ---------------------------------------------- |
| tipo_movimiento   | VARCHAR(50)   | Tipo de movimiento (Despacho, Recepción, etc.) |
| planta            | VARCHAR(20)   | Planta (Rancagua, Chimbarongo)                 |
| guia_sii          | VARCHAR(50)   | Número de guía SII                             |
| fecha             | TIMESTAMP     | Fecha del movimiento                           |
| mes               | VARCHAR(20)   | Mes del movimiento                             |
| id_movimiento     | VARCHAR(100)  | Identificador único del movimiento             |
| proveedor         | VARCHAR(100)  | Nombre del proveedor                           |
| lote              | VARCHAR(50)   | Lote del material                              |
| title             | VARCHAR(50)   | Código del material                            |
| nombre            | VARCHAR(200)  | Nombre del material                            |
| cod_nombre        | VARCHAR(250)  | Código + Nombre                                |
| clasificacion     | VARCHAR(50)   | Clasificación del material                     |
| total_pallet      | INTEGER       | Total de pallets                               |
| cantidad          | DECIMAL(10,2) | Cantidad del movimiento                        |
| unidad_medida     | VARCHAR(20)   | Unidad de medida                               |
| bod_origen        | VARCHAR(100)  | Bodega de origen                               |
| bod_destino       | VARCHAR(100)  | Bodega de destino                              |
| ubicacion_origen  | VARCHAR(100)  | Ubicación de origen                            |
| ubicacion_destino | VARCHAR(100)  | Ubicación de destino                           |
| turno             | VARCHAR(20)   | Turno (Turno 1, Turno 2)                       |
| temporada         | VARCHAR(20)   | Temporada (R9 2024-2025)                       |
| observacion       | TEXT          | Observaciones del movimiento                   |
| bodega_stock      | VARCHAR(100)  | Bodega donde se modifica stock                 |
| ubicacion_stock   | VARCHAR(100)  | Ubicación donde se modifica stock              |
| total_stock       | DECIMAL(10,2) | Total agregado/restado al stock                |
| numero_embarque   | VARCHAR(50)   | Número de embarque (opcional)                  |
| patente_camion    | VARCHAR(20)   | Patente del camión (opcional)                  |

### 2.2 Tabla: materiales

Contiene información de todos los materiales del sistema.

| Campo           | Tipo         | Descripción                               |
| --------------- | ------------ | ----------------------------------------- |
| codigo_ranco    | VARCHAR(50)  | Código único del material                 |
| nombre_material | VARCHAR(200) | Nombre descriptivo del material           |
| clasificacion   | VARCHAR(50)  | Clasificación (Kit, Normal, Armado, etc.) |
| unidad_medida   | VARCHAR(20)  | Unidad de medida (Unidad, Litros, etc.)   |
| frio            | VARCHAR(5)   | Indica si se usa en frío (Si/No)          |
| cod_nombre      | VARCHAR(250) | Código + Nombre concatenado               |

---

## 3. MÓDULO BIENVENIDA/INICIO

### 3.1 Objetivo

Permitir al usuario seleccionar la planta de trabajo y mostrar dashboard con estadísticas principales.

### 3.2 Componentes de UI

- Header con logo de Ranco Cherries
- Selector de planta (Rancagua/Chimbarongo)
- Cards de estadísticas (materiales, ubicaciones, movimientos)
- Grid de navegación a módulos principales
- Información del usuario logueado

### 3.3 Lógica de Negocio

```javascript
function seleccionarPlanta(plantaSeleccionada) {
    // Validar planta disponible
    if (!['Rancagua', 'Chimbarongo'].includes(plantaSeleccionada)) {
        throw new Error('Planta no válida');
    }

    // Crear sesión de usuario
    const sesion = {
        usuario_id: usuarioActual.id,
        planta_seleccionada: plantaSeleccionada,
        fecha_inicio: new Date(),
        activa: true
    };

    // Guardar en localStorage y base de datos
    localStorage.setItem('planta_actual', plantaSeleccionada);
    await guardarSesion(sesion);

    // Redirigir a dashboard
    window.location.href = '/dashboard';
}
```

### 3.4 APIs Necesarias

- `GET /api/plantas` - Obtener plantas disponibles
- `GET /api/reportes/dashboard` - Estadísticas del dashboard
- `POST /api/sesion/seleccionar-planta` - Guardar planta seleccionada
- `GET /api/auth/usuario-actual` - Información del usuario

---

## 4. MÓDULO INVENTARIO

### 4.1 Objetivo

Registrar inventario de materiales por ubicación y bodega, permitiendo control de stock en tiempo real.

### 4.2 Funcionalidades Principales

- Registro de nuevo inventario con validaciones
- Búsqueda automática de materiales por código
- Selección de bodega y ubicación según planta
- Visualización de inventario actual en tabla
- Filtros por fecha, material, ubicación
- Exportación de reportes de inventario

### 4.3 Campos del Formulario

| Campo           | Tipo                                      | Validación |
| --------------- | ----------------------------------------- | ---------- |
| Código Material | Autocompletado con búsqueda               | Requerido  |
| Nombre Material | Solo lectura, se completa automáticamente | Automático |
| Stock           | Numérico con decimales                    | Requerido  |
| Pallets         | Numérico entero                           | Opcional   |
| Bodega          | Dropdown filtrado por planta              | Requerido  |
| Ubicación       | Dropdown filtrado por bodega              | Requerido  |
| Lote            | Texto libre                               | Opcional   |
| Contado por     | Texto libre                               | Requerido  |

### 4.4 Validaciones

- Código de material debe existir en tabla materiales
- Stock debe ser numérico y mayor o igual a 0
- Campo 'Contado por' es obligatorio
- Bodega y ubicación deben existir para la planta actual
- Fecha de inventario no puede ser futura

### 4.5 APIs del Módulo

- `GET /api/inventario?planta=Rancagua` - Obtener inventario
- `POST /api/inventario` - Crear registro de inventario
- `GET /api/inventario/buscar?termino=MATERIAL` - Buscar material
- `GET /api/mantenedores/ubicaciones/planta/:planta` - Ubicaciones por planta
- `GET /api/inventario/resumen-stock` - Resumen de stock actual

---

## 5. MÓDULO TRAZABILIDAD

### 5.1 Objetivo

Generar y registrar movimientos de materiales entre ubicaciones, manteniendo trazabilidad completa de todos los materiales.

### 5.2 Tipos de Movimiento

- **Recepción** - Entrada de materiales (suma stock)
- **Despacho** - Salida de materiales (resta stock)
- **Recepción Interna** - Movimiento entre ubicaciones internas
- **Consumo** - Uso de materiales en procesos
- **Frío y Despacho** - Movimientos específicos de área fría
- **Ingreso Proveedor** - Entrada desde proveedores externos

### 5.3 Estructura del Formulario

El formulario se divide en dos secciones principales:

#### 5.3.1 Sección Encabezado

- Tipo de Movimiento (dropdown)
- Planta (readonly, basado en sesión)
- Guía SII (texto)
- Fecha (date picker)
- Proveedor (dropdown, condicional)
- Turno (dropdown: Turno 1, Turno 2)
- Temporada (dropdown)

#### 5.3.2 Sección Material

- Código Material (autocompletado)
- Nombre Material (readonly, automático)
- Lote (texto libre)
- Cantidad (numérico con decimales)
- Unidad de Medida (readonly, automático)
- Clasificación (readonly, automático)
- Bodega Origen (dropdown)
- Bodega Destino (dropdown)
- Ubicación Origen (dropdown)
- Ubicación Destino (dropdown)
- Observaciones (textarea)

### 5.4 Lógica de Cálculo de Stock

```javascript
function calcularStock(tipoMovimiento, cantidad) {
  const tiposPositivos = [
    "Recepción",
    "Recepción Interna",
    "Ingreso proveedor",
  ];
  const tiposNegativos = ["Despacho", "Consumo", "Frío y Despacho"];

  if (tiposPositivos.includes(tipoMovimiento)) {
    return cantidad; // Suma al stock
  } else if (tiposNegativos.includes(tipoMovimiento)) {
    return -cantidad; // Resta del stock
  }
  return 0; // Sin impacto en stock
}
```

---

## 6. MÓDULO RECEPCIÓN DE LOTES

### 6.1 Objetivo

Agilizar la recepción interna de materiales mediante escaneo de códigos QR y registro automatizado.

### 6.2 Funcionalidades Principales

- Escaneo de códigos QR para identificación automática
- Autocompletado de información del material
- Registro rápido de recepciones múltiples
- Validación en tiempo real de códigos
- Generación automática de movimientos de trazabilidad
- Resumen de recepciones antes de confirmar

### 6.3 Flujo de Trabajo

1. Llenar campos básicos (proveedor, guía, fecha)
2. Escanear código QR del material
3. Verificar información autocompletada
4. Ingresar cantidad y lote
5. Seleccionar ubicación de destino
6. Añadir material a la lista
7. Repetir para materiales adicionales
8. Revisar resumen de recepciones
9. Confirmar y guardar todas las recepciones

### 6.4 Implementación del Escáner QR

```javascript
function inicializarEscanerQR() {
  Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector("#scanner-container"),
      },
      decoder: {
        readers: [
          "code_128_reader",
          "ean_reader",
          "ean_8_reader",
          "code_39_reader",
        ],
      },
    },
    function (err) {
      if (err) {
        console.log(err);
        return;
      }
      Quagga.start();
    }
  );

  Quagga.onDetected(function (data) {
    const codigo = data.codeResult.code;
    procesarCodigoEscaneado(codigo);
    Quagga.stop();
  });
}
```

---

## 7. MÓDULO FRÍO Y DESPACHO

### 7.1 Objetivo

Mantener trazabilidad específica de materiales utilizados en el sector de Frío y Despacho, con campos adicionales para embarques y transporte.

### 7.2 Campos Específicos

Además de los campos estándar de trazabilidad, este módulo incluye:

- Número de Embarque (texto, opcional)
- Patente de Camión (texto, opcional)
- Temporada de Material (dropdown)
- Guía SII específica para el embarque
- Turno de operación (Turno 1/Turno 2)
- Producto específico (dropdown con búsqueda)
- Total de Unidades por embarque

### 7.3 Validaciones Específicas

- Material debe estar marcado como apto para frío (campo 'frio' = 'Si')
- Número de embarque debe ser único si se proporciona
- Patente debe tener formato válido (XX-XXXX o XXXX-XX)
- Cantidad debe ser positiva para consumos
- Ubicación origen debe existir y tener stock disponible

### 7.4 Lógica de Negocio

```javascript
function validarMaterialFrio(materialId) {
    const material = await obtenerMaterial(materialId);

    if (!material) {
        throw new Error('Material no encontrado');
    }

    if (material.frio !== 'Si') {
        mostrarAdvertencia('Este material no está marcado como apto para frío');
        return false;
    }

    return true;
}

function crearMovimientoFrio(datos) {
    const movimiento = {
        tipo_movimiento: 'Frío y Despacho',
        planta: plantaActual,
        ...datos,
        total_stock: -datos.cantidad, // Negativo porque es consumo
        bodega_stock: datos.bodega_origen,
        ubicacion_stock: datos.ubicacion_origen,
        id_movimiento: generarIdMovimiento()
    };

    return movimiento;
}
```

---

## 8. MÓDULO TARJAS CAA

### 8.1 Objetivo

Generar e imprimir tarjas CAA (Certificación de Calidad) con información específica de materiales para procesos de certificación.

### 8.2 Estructura de la Tarja CAA

- Header con logo y datos de la empresa
- Información de la planta y fecha
- Descripción de la tarja
- Usuario que genera la tarja
- Tabla de materiales con:
  - Código del material
  - Nombre del material
  - Lote
  - Cantidad
  - Número de identificación
  - Fecha específica

### 8.3 Campos del Formulario

| Campo       | Tipo                     | Descripción                      |
| ----------- | ------------------------ | -------------------------------- |
| Descripción | Textarea                 | Descripción general de la tarja  |
| Materiales  | Multi-select             | Selección múltiple de materiales |
| Lote        | Texto por material       | Lote específico de cada material |
| Cantidad    | Numérico por material    | Cantidad de cada material        |
| Número      | Texto por material       | Número de identificación         |
| Fecha       | Date picker por material | Fecha específica del material    |

### 8.4 Generación de PDF

```javascript
function generarPDFTarjaCAA(datosTarja) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(16);
  doc.text("TARJA CAA - RANCO CHERRIES", 20, 20);

  // Información general
  doc.setFontSize(12);
  doc.text(`Planta: ${datosTarja.planta}`, 20, 35);
  doc.text(`Fecha: ${formatearFecha(datosTarja.fecha)}`, 20, 45);
  doc.text(`Usuario: ${datosTarja.usuario}`, 20, 55);

  // Descripción
  doc.text(`Descripción: ${datosTarja.descripcion}`, 20, 70);

  // Tabla de materiales
  let yPosition = 90;
  doc.text("MATERIALES:", 20, yPosition);
  yPosition += 15;

  // Headers
  doc.text("Código", 20, yPosition);
  doc.text("Material", 60, yPosition);
  doc.text("Lote", 120, yPosition);
  doc.text("Cantidad", 150, yPosition);
  doc.text("N°", 180, yPosition);
  yPosition += 10;

  // Datos
  datosTarja.materiales.forEach((material) => {
    doc.text(material.codigo, 20, yPosition);
    doc.text(material.nombre.substring(0, 25), 60, yPosition);
    doc.text(material.lote, 120, yPosition);
    doc.text(material.cantidad.toString(), 150, yPosition);
    doc.text(material.numero, 180, yPosition);
    yPosition += 10;
  });

  return doc;
}
```

---

## 9. MÓDULO TARJAS BODEGA

### 9.1 Objetivo

Generar e imprimir tarjas de bodega con información completa incluyendo proveedores y guías para control interno.

### 9.2 Diferencias con Tarja CAA

- Incluye información de proveedor por material
- Campo adicional de guía por material
- Formato de tabla más amplio
- Información más detallada para control interno
- Campos específicos para trazabilidad de bodega

### 9.3 Campos Adicionales

| Campo              | Tipo                  | Descripción                                     |
| ------------------ | --------------------- | ----------------------------------------------- |
| Proveedor          | Dropdown por material | Proveedor específico del material               |
| Guía               | Texto por material    | Número de guía del material                     |
| Fecha de Recepción | Date picker           | Fecha de recepción del material                 |
| Estado             | Dropdown              | Estado del material (Recibido, Procesado, etc.) |

---

## 10. APIS Y ENDPOINTS

### 10.1 Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/verificar-sesion` - Verificar token
- `POST /api/auth/refresh-token` - Renovar token

### 10.2 Mantenedores

- `GET /api/mantenedores/materiales` - Obtener materiales
- `GET /api/mantenedores/materiales/codigo/:codigo` - Material por código
- `GET /api/mantenedores/proveedores` - Obtener proveedores
- `GET /api/mantenedores/ubicaciones` - Obtener ubicaciones
- `GET /api/mantenedores/ubicaciones/planta/:planta` - Ubicaciones por planta
- `GET /api/mantenedores/plantas` - Obtener plantas
- `GET /api/mantenedores/temporadas` - Obtener temporadas
- `GET /api/mantenedores/tipos-movimiento` - Tipos de movimiento

### 10.3 Inventario

- `GET /api/inventario` - Obtener inventario con filtros
- `POST /api/inventario` - Crear registro de inventario
- `GET /api/inventario/planta/:planta` - Inventario por planta
- `GET /api/inventario/buscar?termino=X` - Buscar en inventario
- `GET /api/inventario/resumen-stock` - Resumen de stock

### 10.4 Trazabilidad

- `GET /api/trazabilidad` - Obtener movimientos
- `POST /api/trazabilidad` - Crear movimiento
- `GET /api/trazabilidad/buscar?termino=X` - Buscar movimientos
- `GET /api/trazabilidad/material/:id` - Movimientos por material
- `GET /api/trazabilidad/resumen` - Resumen de movimientos

### 10.5 Recepción de Lotes

- `GET /api/recepciones-lotes` - Obtener recepciones
- `POST /api/recepciones-lotes` - Crear recepción
- `GET /api/recepciones-lotes/proveedor/:id` - Por proveedor
- `GET /api/recepciones-lotes/resumen` - Resumen de recepciones

### 10.6 Frío y Despacho

- `GET /api/operaciones-frio-despacho` - Obtener operaciones
- `POST /api/operaciones-frio-despacho` - Crear operación
- `GET /api/operaciones-frio-despacho/embarque/:numero` - Por embarque
- `GET /api/operaciones-frio-despacho/resumen` - Resumen

### 10.7 Tarjas

- `GET /api/tarjas` - Obtener tarjas
- `POST /api/tarjas` - Crear tarja
- `PUT /api/tarjas/:id/imprimir` - Marcar como impresa
- `GET /api/tarjas/pendientes` - Tarjas pendientes
- `GET /api/tarjas/tipo/:tipo` - Tarjas por tipo

---

## 11. VALIDACIONES Y SEGURIDAD

### 11.1 Validaciones Frontend

- Validación de campos requeridos en tiempo real
- Formato de fechas (no futuras)
- Validación numérica para cantidades y stocks
- Validación de códigos de material existentes
- Validación de selección de ubicaciones válidas
- Validación de formato de patentes de camión
- Validación de unicidad de números de embarque

### 11.2 Validaciones Backend

- Autenticación JWT en todos los endpoints protegidos
- Validación de permisos por planta
- Sanitización de inputs para prevenir SQL injection
- Validación de integridad referencial
- Validación de rangos numéricos
- Validación de formatos de fecha
- Logs de auditoría para todas las operaciones

### 11.3 Seguridad

- Tokens JWT con expiración configurable
- Encriptación de contraseñas con bcrypt
- Rate limiting en endpoints críticos
- Validación de CORS para requests del frontend

---

## 12. CONSIDERACIONES DE IMPLEMENTACIÓN

### 12.1 Performance

- Índices en campos de búsqueda frecuente (title, codigo_ranco)
- Paginación en listados de inventario y trazabilidad
- Cache para datos de configuración (materiales, ubicaciones)
- Optimización de consultas con JOINs eficientes
- Compresión de respuestas HTTP
- Lazy loading en componentes Vue.js
- Debounce en campos de búsqueda automática

### 12.2 Usabilidad

- Interfaz responsive para tablets y móviles
- Autocompletado en campos de material
- Validaciones en tiempo real con mensajes claros
- Confirmaciones antes de operaciones críticas
- Indicadores de carga durante operaciones
- Shortcuts de teclado para operaciones frecuentes
- Modo offline básico para consultas

### 12.3 Mantenibilidad

- Código documentado completamente en español
- Separación clara entre lógica de negocio y presentación
- Funciones reutilizables y modulares
- Configuración centralizada en archivos de entorno
- Tests unitarios para funciones críticas
- Documentación de APIs con Swagger/OpenAPI
- Versionado semántico de releases

### 12.4 Escalabilidad

- Arquitectura modular que permite agregar nuevos módulos
- Base de datos diseñada para crecimiento de datos
- APIs RESTful que permiten integración con otros sistemas
- Separación de frontend y backend para deploy independiente
- Configuración para múltiples plantas
- Sistema de roles y permisos extensible
- Logs estructurados para análisis posterior

---

## CONCLUSIÓN

Este manual técnico proporciona una guía completa para la implementación del Sistema WMS de Ranco Cherries, basado exactamente en las especificaciones del Manual de Uso v1.1 y los requerimientos técnicos detallados.

La implementación debe seguir estrictamente estos lineamientos para asegurar:

- Compatibilidad total con los procesos operativos actuales
- Mantenimiento de la nomenclatura en español
- Funcionalidades exactas según el manual original
- Arquitectura escalable y mantenible
- Seguridad y validaciones robustas

El sistema está diseñado para ser una migración directa desde PowerApps a una solución web moderna, manteniendo toda la funcionalidad existente mientras mejora la performance, usabilidad y capacidades de integración.

Para cualquier duda durante la implementación, referirse a los documentos originales y este manual técnico como fuente de verdad para todas las especificaciones.

---

**Documento generado:** Agosto 2024  
**Versión:** 1.0 - Manual Técnico de Implementación  
**Cliente:** Ranco Cherries (Exportadora Rancagua S.A.)
