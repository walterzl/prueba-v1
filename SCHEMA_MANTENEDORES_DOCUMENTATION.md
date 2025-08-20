# Schema de APIs de Mantenedores - WMS Ranco Cherries

*Documentación generada automáticamente el 19/8/2025, 23:33:30*

## Resumen Ejecutivo

Este documento contiene los schemas completos de todas las APIs de mantenedores del sistema WMS.
Los mantenedores son datos maestros fundamentales que alimentan todo el sistema operativo.

### Estadísticas

- **Total de APIs probadas:** 16
- **APIs exitosas:** 16
- **APIs con errores:** 0

## Tabla de Contenidos

1. [ResumenMantenedores](#resumenmantenedores)
2. [Plantas](#plantas)
3. [Materiales](#materiales)
4. [Proveedores](#proveedores)
5. [Ubicaciones](#ubicaciones)
6. [Temporadas](#temporadas)
7. [TemporadaActiva](#temporadaactiva)
8. [TiposMovimiento](#tiposmovimiento)
9. [UnidadesMedida](#unidadesmedida)
10. [TiposTarja](#tipostarja)
11. [TiposOperacion](#tiposoperacion)
12. [Turnos](#turnos)
13. [Bodegas](#bodegas)
14. [EstadosTarja](#estadostarja)
15. [CertificacionesCAA](#certificacionescaa)
16. [Prioridades](#prioridades)

## ResumenMantenedores

**Descripción:** Resumen de todos los mantenedores del sistema

**Endpoint:** `/mantenedores`

**Tipo de datos:** Objeto único

**Total de registros:** 1

### 📋 Schema de Datos

```json
{
  "materiales": "Integer",
  "proveedores": "Integer",
  "ubicaciones": "Integer",
  "tiposMovimiento": "Integer",
  "plantas": "Integer",
  "unidadesMedida": "Integer",
  "temporadaActiva": "String"
}
```

### 🔍 Campos Disponibles para Filtros

| Campo | Tipo | Filtros Sugeridos |
|-------|------|------------------|
| `materiales` | Integer | rango numérico, mayor que, menor que, igual |
| `proveedores` | Integer | rango numérico, mayor que, menor que, igual |
| `ubicaciones` | Integer | rango numérico, mayor que, menor que, igual |
| `tiposMovimiento` | Integer | rango numérico, mayor que, menor que, igual |
| `plantas` | Integer | rango numérico, mayor que, menor que, igual |
| `unidadesMedida` | Integer | rango numérico, mayor que, menor que, igual |
| `temporadaActiva` | String | texto, contiene, igual |

### 📄 Datos de Ejemplo

```json
{
  "materiales": 1341,
  "proveedores": 76,
  "ubicaciones": 56,
  "tiposMovimiento": 26,
  "plantas": 2,
  "unidadesMedida": 7,
  "temporadaActiva": "R9 2024-2025"
}
```

### 💡 Casos de Uso Sugeridos

- Selección en formularios dropdown
- Filtros de búsqueda avanzada
- Validación de datos de entrada

---

## Plantas

**Descripción:** Listado de todas las plantas del sistema

**Endpoint:** `/mantenedores/plantas`

**Tipo de datos:** Array

**Total de registros:** 2

### 📋 Schema de Datos

```json
{
  "codigo": "String (Código)",
  "nombre": "String (Código)",
  "descripcion": "String"
}
```

### 🔍 Campos Disponibles para Filtros

| Campo | Tipo | Filtros Sugeridos |
|-------|------|------------------|
| `codigo` | String (Código) | código exacto, lista de códigos |
| `nombre` | String (Código) | código exacto, lista de códigos |
| `descripcion` | String | texto, contiene, igual |

### 📄 Datos de Ejemplo

```json
[
  {
    "codigo": "RANCAGUA",
    "nombre": "RANCAGUA",
    "descripcion": "Planta RANCAGUA"
  },
  {
    "codigo": "CHIMBARONGO",
    "nombre": "CHIMBARONGO",
    "descripcion": "Planta CHIMBARONGO"
  }
]
```

### 💡 Casos de Uso Sugeridos

- Selección en formularios dropdown
- Filtros de búsqueda avanzada
- Validación de datos de entrada

---

## Materiales

**Descripción:** Listado de materiales activos

**Endpoint:** `/mantenedores/materiales`

**Tipo de datos:** Array

**Total de registros:** 1341

### 📋 Schema de Datos

```json
{
  "id": "Integer",
  "codigo": "String (Código)",
  "nombre": "String",
  "unidad_medida": "null",
  "requiere_frio": "Boolean",
  "activo": "Boolean"
}
```

### 🔍 Campos Disponibles para Filtros

| Campo | Tipo | Filtros Sugeridos |
|-------|------|------------------|
| `id` | Integer | rango numérico, mayor que, menor que, igual |
| `codigo` | String (Código) | código exacto, lista de códigos |
| `nombre` | String | texto, contiene, igual |
| `unidad_medida` | null |  |
| `requiere_frio` | Boolean | verdadero/falso |
| `activo` | Boolean | verdadero/falso |

### 📄 Datos de Ejemplo

```json
[
  {
    "id": 862,
    "codigo": "CTAB1209",
    "nombre": "ABSORPAD 10 KG  UNILAMINAR MICROPERFORADO 360 x 56",
    "unidad_medida": null,
    "requiere_frio": false,
    "activo": true
  },
  {
    "id": 863,
    "codigo": "CTAB1208",
    "nombre": "ABSORPAD 10 KG 36 X 46 MM BILAMINAR",
    "unidad_medida": null,
    "requiere_frio": false,
    "activo": true
  },
  {
    "id": 860,
    "codigo": "CTAB1211",
    "nombre": "ABSORPAD 10 KG 360 MM X 560 MM BILAMINAR",
    "unidad_medida": null,
    "requiere_frio": false,
    "activo": true
  }
]
```

### 💡 Casos de Uso Sugeridos

- Selector de materiales para recepciones
- Filtros de materiales por tipo o estado
- Búsqueda de materiales por código

---

## Proveedores

**Descripción:** Listado de proveedores activos

**Endpoint:** `/mantenedores/proveedores`

**Tipo de datos:** Array

**Total de registros:** 76

### 📋 Schema de Datos

```json
{
  "id": "Integer",
  "codigo": "String (Código)",
  "nombre": "String",
  "rut": "null",
  "contacto": "null",
  "telefono": "null",
  "email": "null",
  "activo": "Boolean"
}
```

### 🔍 Campos Disponibles para Filtros

| Campo | Tipo | Filtros Sugeridos |
|-------|------|------------------|
| `id` | Integer | rango numérico, mayor que, menor que, igual |
| `codigo` | String (Código) | código exacto, lista de códigos |
| `nombre` | String | texto, contiene, igual |
| `rut` | null |  |
| `contacto` | null |  |
| `telefono` | null |  |
| `email` | null |  |
| `activo` | Boolean | verdadero/falso |

### 📄 Datos de Ejemplo

```json
[
  {
    "id": 47,
    "codigo": "PROV047",
    "nombre": "AGENCIA DE REPRESENTACIONES LTDA",
    "rut": null,
    "contacto": null,
    "telefono": null,
    "email": null,
    "activo": true
  },
  {
    "id": 48,
    "codigo": "PROV048",
    "nombre": "AGROFRESH CHILE COMERCIAL LIMITADA",
    "rut": null,
    "contacto": null,
    "telefono": null,
    "email": null,
    "activo": true
  },
  {
    "id": 28,
    "codigo": "PROV028",
    "nombre": "AGROINDUSTRIAL Y COMERCIAL SUPERFRUIT LIMITADA",
    "rut": null,
    "contacto": null,
    "telefono": null,
    "email": null,
    "activo": true
  }
]
```

### 💡 Casos de Uso Sugeridos

- Selector de proveedores en formularios
- Filtros por estado activo/inactivo
- Búsqueda por código de proveedor

---

## Ubicaciones

**Descripción:** Listado de ubicaciones activas

**Endpoint:** `/mantenedores/ubicaciones`

**Tipo de datos:** Array

**Total de registros:** 56

### 📋 Schema de Datos

```json
{
  "id": "Integer",
  "codigo": "String (Código)",
  "nombre": "String",
  "bodega": "String",
  "planta": "String",
  "tipo": "String",
  "activo": "Boolean"
}
```

### 🔍 Campos Disponibles para Filtros

| Campo | Tipo | Filtros Sugeridos |
|-------|------|------------------|
| `id` | Integer | rango numérico, mayor que, menor que, igual |
| `codigo` | String (Código) | código exacto, lista de códigos |
| `nombre` | String | texto, contiene, igual |
| `bodega` | String | texto, contiene, igual |
| `planta` | String | texto, contiene, igual |
| `tipo` | String | texto, contiene, igual |
| `activo` | Boolean | verdadero/falso |

### 📄 Datos de Ejemplo

```json
[
  {
    "id": 10,
    "codigo": "UB010",
    "nombre": "Bodega A",
    "bodega": "Almacén General",
    "planta": "Chimbarongo",
    "tipo": "bodega",
    "activo": true
  },
  {
    "id": 11,
    "codigo": "UB011",
    "nombre": "Bodega B",
    "bodega": "Almacén General",
    "planta": "Chimbarongo",
    "tipo": "bodega",
    "activo": true
  },
  {
    "id": 30,
    "codigo": "UB030",
    "nombre": "ALTILLO",
    "bodega": "ALTILLO",
    "planta": "Chimbarongo",
    "tipo": "bodega",
    "activo": true
  }
]
```

### 💡 Casos de Uso Sugeridos

- Selector de ubicaciones por planta
- Mapas de ubicaciones disponibles
- Filtros de capacidad y disponibilidad

---

## Temporadas

**Descripción:** Listado de todas las temporadas

**Endpoint:** `/mantenedores/temporadas`

**Tipo de datos:** Array

**Total de registros:** 1

### 📋 Schema de Datos

```json
{
  "id": "Integer",
  "title": "String",
  "fecha_inicio": "DateTime (ISO)",
  "fecha_fin": "DateTime (ISO)",
  "activo": "Boolean"
}
```

### 🔍 Campos Disponibles para Filtros

| Campo | Tipo | Filtros Sugeridos |
|-------|------|------------------|
| `id` | Integer | rango numérico, mayor que, menor que, igual |
| `title` | String | texto, contiene, igual |
| `fecha_inicio` | DateTime (ISO) | rango de fechas, mayor que, menor que |
| `fecha_fin` | DateTime (ISO) | rango de fechas, mayor que, menor que |
| `activo` | Boolean | verdadero/falso |

### 📄 Datos de Ejemplo

```json
[
  {
    "id": 2,
    "title": "R9 2024-2025",
    "fecha_inicio": "2024-10-01T00:00:00.000Z",
    "fecha_fin": "2025-09-30T00:00:00.000Z",
    "activo": true
  }
]
```

### 💡 Casos de Uso Sugeridos

- Selector de temporada en reportes
- Configuración de temporada activa
- Filtros históricos por temporada

---

## TemporadaActiva

**Descripción:** Temporada actualmente activa

**Endpoint:** `/mantenedores/temporadas/activa`

**Tipo de datos:** Objeto único

**Total de registros:** 1

### 📋 Schema de Datos

```json
{
  "id": "Integer",
  "codigo": "String",
  "nombre": "String",
  "fecha_inicio": "DateTime (ISO)",
  "fecha_termino": "DateTime (ISO)",
  "activa": "Boolean"
}
```

### 🔍 Campos Disponibles para Filtros

| Campo | Tipo | Filtros Sugeridos |
|-------|------|------------------|
| `id` | Integer | rango numérico, mayor que, menor que, igual |
| `codigo` | String | texto, contiene, igual |
| `nombre` | String | texto, contiene, igual |
| `fecha_inicio` | DateTime (ISO) | rango de fechas, mayor que, menor que |
| `fecha_termino` | DateTime (ISO) | rango de fechas, mayor que, menor que |
| `activa` | Boolean | verdadero/falso |

### 📄 Datos de Ejemplo

```json
{
  "id": 2,
  "codigo": "R9 2024-2025",
  "nombre": "R9 2024-2025",
  "fecha_inicio": "2024-10-01T00:00:00.000Z",
  "fecha_termino": "2025-09-30T00:00:00.000Z",
  "activa": true
}
```

### 💡 Casos de Uso Sugeridos

- Selector de temporada en reportes
- Configuración de temporada activa
- Filtros históricos por temporada

---

## TiposMovimiento

**Descripción:** Tipos de movimiento de inventario

**Endpoint:** `/mantenedores/tipos-movimiento`

**Tipo de datos:** Array

**Total de registros:** 26

### 📋 Schema de Datos

```json
{
  "id": "Integer",
  "codigo": "String",
  "nombre": "String",
  "descripcion": "String",
  "activo": "Boolean"
}
```

### 🔍 Campos Disponibles para Filtros

| Campo | Tipo | Filtros Sugeridos |
|-------|------|------------------|
| `id` | Integer | rango numérico, mayor que, menor que, igual |
| `codigo` | String | texto, contiene, igual |
| `nombre` | String | texto, contiene, igual |
| `descripcion` | String | texto, contiene, igual |
| `activo` | Boolean | verdadero/falso |

### 📄 Datos de Ejemplo

```json
[
  {
    "id": 6,
    "codigo": "Ajuste Inventario",
    "nombre": "Ajuste Inventario",
    "descripcion": "Ajuste por diferencias de inventario",
    "activo": true
  },
  {
    "id": 5,
    "codigo": "Consumo",
    "nombre": "Consumo",
    "descripcion": "Consumo de materiales en proceso",
    "activo": true
  },
  {
    "id": 20,
    "codigo": "Consumo Packing",
    "nombre": "Consumo Packing",
    "descripcion": null,
    "activo": true
  }
]
```

### 💡 Casos de Uso Sugeridos

- Selección en formularios dropdown
- Filtros de búsqueda avanzada
- Validación de datos de entrada

---

## UnidadesMedida

**Descripción:** Unidades de medida disponibles

**Endpoint:** `/mantenedores/unidades-medida`

**Tipo de datos:** Array

**Total de registros:** 7

### 📋 Schema de Datos

```json
{
  "codigo": "String",
  "nombre": "String",
  "descripcion": "String"
}
```

### 🔍 Campos Disponibles para Filtros

| Campo | Tipo | Filtros Sugeridos |
|-------|------|------------------|
| `codigo` | String | texto, contiene, igual |
| `nombre` | String | texto, contiene, igual |
| `descripcion` | String | texto, contiene, igual |

### 📄 Datos de Ejemplo

```json
[
  {
    "codigo": "kg",
    "nombre": "kilogramo",
    "descripcion": "kg"
  },
  {
    "codigo": "g",
    "nombre": "gramo",
    "descripcion": "g"
  },
  {
    "codigo": "l",
    "nombre": "litro",
    "descripcion": "l"
  }
]
```

### 💡 Casos de Uso Sugeridos

- Selección en formularios dropdown
- Filtros de búsqueda avanzada
- Validación de datos de entrada

---

## TiposTarja

**Descripción:** Tipos de tarja únicos del sistema

**Endpoint:** `/mantenedores/tipos-tarja`

**Tipo de datos:** Array

**Total de registros:** 2

### 📋 Schema de Datos

```json
{
  "value": "String (Código)",
  "label": "String (Código)",
  "title": "String (Código)"
}
```

### 🔍 Campos Disponibles para Filtros

| Campo | Tipo | Filtros Sugeridos |
|-------|------|------------------|
| `value` | String (Código) | código exacto, lista de códigos |
| `label` | String (Código) | código exacto, lista de códigos |
| `title` | String (Código) | código exacto, lista de códigos |

### 📄 Datos de Ejemplo

```json
[
  {
    "value": "BODEGA",
    "label": "BODEGA",
    "title": "BODEGA"
  },
  {
    "value": "CAA",
    "label": "CAA",
    "title": "CAA"
  }
]
```

### 💡 Casos de Uso Sugeridos

- Selección en formularios dropdown
- Filtros de búsqueda avanzada
- Validación de datos de entrada

---

## TiposOperacion

**Descripción:** Tipos de operación únicos

**Endpoint:** `/mantenedores/tipos-operacion`

**Tipo de datos:** Array

**Total de registros:** 1

### 📋 Schema de Datos

```json
{
  "value": "String",
  "label": "String",
  "title": "String"
}
```

### 🔍 Campos Disponibles para Filtros

| Campo | Tipo | Filtros Sugeridos |
|-------|------|------------------|
| `value` | String | texto, contiene, igual |
| `label` | String | texto, contiene, igual |
| `title` | String | texto, contiene, igual |

### 📄 Datos de Ejemplo

```json
[
  {
    "value": "consumo",
    "label": "consumo",
    "title": "consumo"
  }
]
```

### 💡 Casos de Uso Sugeridos

- Selección en formularios dropdown
- Filtros de búsqueda avanzada
- Validación de datos de entrada

---

## Turnos

**Descripción:** Turnos de trabajo disponibles

**Endpoint:** `/mantenedores/turnos`

**Tipo de datos:** Array

**Total de registros:** 1

### 📋 Schema de Datos

```json
{
  "value": "String",
  "label": "String",
  "title": "String"
}
```

### 🔍 Campos Disponibles para Filtros

| Campo | Tipo | Filtros Sugeridos |
|-------|------|------------------|
| `value` | String | texto, contiene, igual |
| `label` | String | texto, contiene, igual |
| `title` | String | texto, contiene, igual |

### 📄 Datos de Ejemplo

```json
[
  {
    "value": "MAÑANA",
    "label": "MAÑANA",
    "title": "MAÑANA"
  }
]
```

### 💡 Casos de Uso Sugeridos

- Selección en formularios dropdown
- Filtros de búsqueda avanzada
- Validación de datos de entrada

---

## Bodegas

**Descripción:** Bodegas únicas del sistema

**Endpoint:** `/mantenedores/bodegas`

**Tipo de datos:** Array

**Total de registros:** 17

### 📋 Schema de Datos

```json
{
  "value": "String",
  "label": "String",
  "title": "String"
}
```

### 🔍 Campos Disponibles para Filtros

| Campo | Tipo | Filtros Sugeridos |
|-------|------|------------------|
| `value` | String | texto, contiene, igual |
| `label` | String | texto, contiene, igual |
| `title` | String | texto, contiene, igual |

### 📄 Datos de Ejemplo

```json
[
  {
    "value": "Almacén General",
    "label": "Almacén General",
    "title": "Almacén General"
  },
  {
    "value": "ALTILLO",
    "label": "ALTILLO",
    "title": "ALTILLO"
  },
  {
    "value": "Área Administrativa",
    "label": "Área Administrativa",
    "title": "Área Administrativa"
  }
]
```

### 💡 Casos de Uso Sugeridos

- Selección en formularios dropdown
- Filtros de búsqueda avanzada
- Validación de datos de entrada

---

## EstadosTarja

**Descripción:** Estados posibles de las tarjas

**Endpoint:** `/mantenedores/estados-tarja`

**Tipo de datos:** Array

**Total de registros:** 1

### 📋 Schema de Datos

```json
{
  "value": "String",
  "label": "String",
  "title": "String"
}
```

### 🔍 Campos Disponibles para Filtros

| Campo | Tipo | Filtros Sugeridos |
|-------|------|------------------|
| `value` | String | texto, contiene, igual |
| `label` | String | texto, contiene, igual |
| `title` | String | texto, contiene, igual |

### 📄 Datos de Ejemplo

```json
[
  {
    "value": "impresa",
    "label": "impresa",
    "title": "impresa"
  }
]
```

### 💡 Casos de Uso Sugeridos

- Selección en formularios dropdown
- Filtros de búsqueda avanzada
- Validación de datos de entrada

---

## CertificacionesCAA

**Descripción:** Certificaciones CAA predefinidas

**Endpoint:** `/mantenedores/certificaciones-caa`

**Tipo de datos:** Array

**Total de registros:** 9

### 📋 Schema de Datos

```json
{
  "value": "String",
  "label": "String",
  "title": "String"
}
```

### 🔍 Campos Disponibles para Filtros

| Campo | Tipo | Filtros Sugeridos |
|-------|------|------------------|
| `value` | String | texto, contiene, igual |
| `label` | String | texto, contiene, igual |
| `title` | String | texto, contiene, igual |

### 📄 Datos de Ejemplo

```json
[
  {
    "value": "ORGÁNICO",
    "label": "Orgánico",
    "title": "Certificación Orgánica"
  },
  {
    "value": "GAP",
    "label": "Good Agricultural Practices",
    "title": "Buenas Prácticas Agrícolas"
  },
  {
    "value": "HACCP",
    "label": "HACCP",
    "title": "Análisis de Peligros y Puntos Críticos de Control"
  }
]
```

### 💡 Casos de Uso Sugeridos

- Selección en formularios dropdown
- Filtros de búsqueda avanzada
- Validación de datos de entrada

---

## Prioridades

**Descripción:** Prioridades predefinidas del sistema

**Endpoint:** `/mantenedores/prioridades`

**Tipo de datos:** Array

**Total de registros:** 4

### 📋 Schema de Datos

```json
{
  "value": "String (Código)",
  "label": "String",
  "title": "String"
}
```

### 🔍 Campos Disponibles para Filtros

| Campo | Tipo | Filtros Sugeridos |
|-------|------|------------------|
| `value` | String (Código) | código exacto, lista de códigos |
| `label` | String | texto, contiene, igual |
| `title` | String | texto, contiene, igual |

### 📄 Datos de Ejemplo

```json
[
  {
    "value": "ALTA",
    "label": "Alta",
    "title": "Prioridad Alta"
  },
  {
    "value": "MEDIA",
    "label": "Media",
    "title": "Prioridad Media"
  },
  {
    "value": "BAJA",
    "label": "Baja",
    "title": "Prioridad Baja"
  }
]
```

### 💡 Casos de Uso Sugeridos

- Selección en formularios dropdown
- Filtros de búsqueda avanzada
- Validación de datos de entrada

---

## 🛠️ Guía de Implementación Frontend

### Patrón de Uso Recomendado

```javascript
// Ejemplo de uso en composable
import { ref, onMounted } from 'vue'
import { useMantenedores } from '@/composables/useMantenedores'

export function useMantenedor(tipo) {
  const { obtenerMantenedor } = useMantenedores()
  const datos = ref([])
  const cargando = ref(false)

  const cargar = async () => {
    cargando.value = true
    try {
      datos.value = await obtenerMantenedor(tipo)
    } catch (error) {
      console.error('Error cargando mantenedor:', error)
    } finally {
      cargando.value = false
    }
  }

  onMounted(cargar)

  return {
    datos,
    cargando,
    cargar
  }
}
```

