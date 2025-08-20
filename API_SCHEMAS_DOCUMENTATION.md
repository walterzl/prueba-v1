# Schema de APIs - WMS Ranco Cherries

*Documentación generada automáticamente el 19/8/2025, 20:50:28*

## Resumen

Este documento contiene los schemas reales de datos devueltos por cada API del sistema WMS para crear filtros precisos en el frontend.

## VistaInventario

**Endpoint:** `/inventario`

✅ **Status:** Exitoso

**Total de registros:** 1

### Schema de Datos

```json
{
  "inventario": "Array[[object Object]]",
  "paginacion": {
    "pagina_actual": "Integer",
    "total_paginas": "Integer",
    "total_registros": "Integer",
    "registros_por_pagina": "Integer"
  }
}
```

### Datos de Ejemplo

```json
{
  "inventario": [
    {
      "id": 20,
      "planta": "RANCAGUA",
      "codigo_material": "TEST_DEBUG",
      "nombre_material": "Material Debug",
      "unidad_medida": "KG",
      "cod_nombre": "BOGR2062 - BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
      "fecha_inventario": "2025-08-18T00:00:00.000Z",
      "pallets": 0,
      "stock": 100,
      "bodega": "BODEGA_TEST",
      "ubicacion": "UBC001",
      "lote": null,
      "condicion_armado": null,
      "contado_por": "Usuario Test",
      "fecha_creacion": "2025-08-18T05:07:58.205Z",
      "fecha_actualizacion": "2025-08-18T05:07:58.205Z",
      "material_completo": {
        "id": 1,
        "codigo_ranco": "BOGR2062",
        "nombre_material": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
        "unidad_medida": "Unidad"
      },
      "ubicacion_completa": {
        "id": 10,
        "title": "Bodega A",
        "bodega_deposito": "Almacén General",
        "planta": "Chimbarongo"
      }
    },
    {
      "id": 15,
      "planta": "RANCAGUA",
      "codigo_material": "TEST001",
      "nombre_material": "Material de Prueba",
      "unidad_medida": "KG",
      "cod_nombre": null,
      "fecha_inventario": "2025-08-18T00:00:00.000Z",
      "pallets": 0,
      "stock": 100,
      "bodega": "BODEGA_TEST",
      "ubicacion": "UBC001",
      "lote": null,
      "condicion_armado": null,
      "contado_por": "Usuario Test",
      "fecha_creacion": "2025-08-18T04:44:42.278Z",
      "fecha_actualizacion": "2025-08-18T04:44:42.278Z",
      "material_completo": null,
      "ubicacion_completa": null
    },
    {
      "id": 14,
      "planta": "RANCAGUA",
      "codigo_material": "TEST001",
      "nombre_material": "Material de Prueba",
      "unidad_medida": "KG",
      "cod_nombre": null,
      "fecha_inventario": "2025-08-18T00:00:00.000Z",
      "pallets": 0,
      "stock": 100,
      "bodega": "BODEGA_TEST",
      "ubicacion": "UBC001",
      "lote": null,
      "condicion_armado": null,
      "contado_por": "Usuario Test",
      "fecha_creacion": "2025-08-18T04:41:19.178Z",
      "fecha_actualizacion": "2025-08-18T04:41:19.178Z",
      "material_completo": null,
      "ubicacion_completa": null
    },
    {
      "id": 13,
      "planta": "RANCAGUA",
      "codigo_material": "TEST001",
      "nombre_material": "Material de Prueba",
      "unidad_medida": "KG",
      "cod_nombre": null,
      "fecha_inventario": "2025-08-18T00:00:00.000Z",
      "pallets": 0,
      "stock": 100,
      "bodega": "BODEGA_TEST",
      "ubicacion": "UBC001",
      "lote": null,
      "condicion_armado": null,
      "contado_por": "Usuario Test",
      "fecha_creacion": "2025-08-18T04:36:56.560Z",
      "fecha_actualizacion": "2025-08-18T04:36:56.560Z",
      "material_completo": null,
      "ubicacion_completa": null
    },
    {
      "id": 21,
      "planta": "RANCAGUA",
      "codigo_material": "TEST001",
      "nombre_material": "Material de Prueba",
      "unidad_medida": "KG",
      "cod_nombre": "BOGR2062 - BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
      "fecha_inventario": "2025-08-18T00:00:00.000Z",
      "pallets": 0,
      "stock": 100,
      "bodega": "BODEGA_TEST",
      "ubicacion": "UBC001",
      "lote": null,
      "condicion_armado": null,
      "contado_por": "Usuario Test",
      "fecha_creacion": "2025-08-18T05:25:28.229Z",
      "fecha_actualizacion": "2025-08-18T05:25:28.229Z",
      "material_completo": {
        "id": 1,
        "codigo_ranco": "BOGR2062",
        "nombre_material": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
        "unidad_medida": "Unidad"
      },
      "ubicacion_completa": {
        "id": 10,
        "title": "Bodega A",
        "bodega_deposito": "Almacén General",
        "planta": "Chimbarongo"
      }
    }
  ],
  "paginacion": {
    "pagina_actual": 1,
    "total_paginas": 4,
    "total_registros": 17,
    "registros_por_pagina": 5
  }
}
```

### Campos Disponibles para Filtros

- **inventario** (Array[[object Object]])
- **paginacion.pagina_actual** (Integer)
- **paginacion.total_paginas** (Integer)
- **paginacion.total_registros** (Integer)
- **paginacion.registros_por_pagina** (Integer)

---

## VistaTrazabilidad

**Endpoint:** `/trazabilidad`

✅ **Status:** Exitoso

**Total de registros:** 1

### Schema de Datos

```json
{
  "movimientos": "Array[[object Object]]",
  "paginacion": {
    "pagina_actual": "Integer",
    "total_paginas": "Integer",
    "total_registros": "Integer",
    "registros_por_pagina": "Integer"
  }
}
```

### Datos de Ejemplo

```json
{
  "movimientos": [
    {
      "id": 18,
      "tipo_movimiento": "consumo Frío",
      "planta": "RANCAGUA",
      "guia_sii": null,
      "fecha": "2025-08-18T00:00:00.000Z",
      "mes": "agosto",
      "id_movimiento": "FRIO_FRIO_RANCAGUA_20250818_003",
      "lote": "LOTE-FRIO-1755494728900",
      "codigo_material": "TEST001",
      "nombre_material": "Material Test Frío",
      "cod_nombre": null,
      "clasificacion": "MATERIA_PRIMA",
      "total_pallet": 0,
      "cantidad": 25,
      "unidad_medida": "KG",
      "bodega_origen": "BODEGA_01",
      "bodega_destino": "BODEGA_02",
      "ubicacion_origen": "UBC_01",
      "ubicacion_destino": "UBC_02",
      "turno": "MAÑANA",
      "observacion": null,
      "bodega_stock": "BODEGA_01",
      "ubicacion_stock": "UBC_01",
      "total_stock": null,
      "numero_embarque": null,
      "patente_camion": null,
      "fecha_creacion": "2025-08-18T05:25:29.133Z",
      "fecha_actualizacion": "2025-08-18T05:25:29.133Z",
      "material_completo": {
        "id": 1,
        "codigo_ranco": "BOGR2062",
        "nombre_material": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
        "unidad_medida": "Unidad",
        "clasificacion": "Normal"
      },
      "proveedor_completo": null,
      "temporada_completa": null,
      "tipo_movimiento_completo": null,
      "ubicacion_origen_completa": {
        "id": 10,
        "title": "Bodega A",
        "bodega_deposito": "Almacén General",
        "planta": "Chimbarongo"
      },
      "ubicacion_destino_completa": {
        "id": 11,
        "title": "Bodega B",
        "bodega_deposito": "Almacén General",
        "planta": "Chimbarongo"
      }
    },
    {
      "id": 17,
      "tipo_movimiento": "RECEPCION",
      "planta": "RANCAGUA",
      "guia_sii": null,
      "fecha": "2025-08-18T00:00:00.000Z",
      "mes": "Agosto",
      "id_movimiento": "RANCAGUA_RECEPCION_20250818_007",
      "lote": "LOTE-FRIO-1755494728900",
      "codigo_material": "TEST001",
      "nombre_material": "Material Test Frío",
      "cod_nombre": "TEST001 - Material Test Frío",
      "clasificacion": "Normal",
      "total_pallet": 0,
      "cantidad": 100,
      "unidad_medida": "Unidad",
      "bodega_origen": null,
      "bodega_destino": "Almacén General",
      "ubicacion_origen": null,
      "ubicacion_destino": "Bodega A",
      "turno": "MAÑANA",
      "temporada": "R9 2024-2025",
      "observacion": "Stock inicial para prueba de operación frío",
      "bodega_stock": "Almacén General",
      "ubicacion_stock": "Bodega A",
      "total_stock": 100,
      "numero_embarque": null,
      "patente_camion": null,
      "fecha_creacion": "2025-08-18T05:25:28.916Z",
      "fecha_actualizacion": "2025-08-18T05:25:28.916Z",
      "material_completo": {
        "id": 1,
        "codigo_ranco": "BOGR2062",
        "nombre_material": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
        "unidad_medida": "Unidad",
        "clasificacion": "Normal"
      },
      "proveedor_completo": null,
      "temporada_completa": {
        "id": 2,
        "title": "R9 2024-2025"
      },
      "tipo_movimiento_completo": {
        "id": 6,
        "title": "Ajuste Inventario",
        "descripcion": "Ajuste por diferencias de inventario"
      },
      "ubicacion_origen_completa": null,
      "ubicacion_destino_completa": {
        "id": 10,
        "title": "Bodega A",
        "bodega_deposito": "Almacén General",
        "planta": "Chimbarongo"
      }
    },
    {
      "id": 16,
      "tipo_movimiento": "RECEPCION",
      "planta": "RANCAGUA",
      "guia_sii": null,
      "fecha": "2025-08-18T00:00:00.000Z",
      "mes": "Agosto",
      "id_movimiento": "RANCAGUA_RECEPCION_20250818_006",
      "lote": "LOTE-TRAZ-1755494728806",
      "codigo_material": "TEST001",
      "nombre_material": "Material Test",
      "cod_nombre": "TEST001 - Material Test",
      "clasificacion": "Normal",
      "total_pallet": 0,
      "cantidad": 25,
      "unidad_medida": "Unidad",
      "bodega_origen": null,
      "bodega_destino": "Almacén General",
      "ubicacion_origen": null,
      "ubicacion_destino": "Bodega A",
      "turno": "TARDE",
      "temporada": "R9 2024-2025",
      "observacion": "Movimiento manual de prueba desde script",
      "bodega_stock": "Almacén General",
      "ubicacion_stock": "Bodega A",
      "total_stock": 25,
      "numero_embarque": null,
      "patente_camion": null,
      "fecha_creacion": "2025-08-18T05:25:28.888Z",
      "fecha_actualizacion": "2025-08-18T05:25:28.888Z",
      "material_completo": {
        "id": 1,
        "codigo_ranco": "BOGR2062",
        "nombre_material": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
        "unidad_medida": "Unidad",
        "clasificacion": "Normal"
      },
      "proveedor_completo": null,
      "temporada_completa": {
        "id": 2,
        "title": "R9 2024-2025"
      },
      "tipo_movimiento_completo": {
        "id": 6,
        "title": "Ajuste Inventario",
        "descripcion": "Ajuste por diferencias de inventario"
      },
      "ubicacion_origen_completa": null,
      "ubicacion_destino_completa": {
        "id": 10,
        "title": "Bodega A",
        "bodega_deposito": "Almacén General",
        "planta": "Chimbarongo"
      }
    },
    {
      "id": 15,
      "tipo_movimiento": "Recepción Lotes",
      "planta": "RANCAGUA",
      "guia_sii": "GUIA-1755494728713",
      "fecha": "2025-08-18T00:00:00.000Z",
      "mes": "agosto",
      "id_movimiento": "REC_REC_RANCAGUA_20250818_008",
      "proveedor": "Proveedor Test",
      "lote": "LOTE-1755494728713",
      "codigo_material": "TEST001",
      "nombre_material": "Material Test",
      "cod_nombre": null,
      "clasificacion": "MATERIA_PRIMA",
      "total_pallet": 10,
      "cantidad": 500,
      "unidad_medida": "KG",
      "bodega_origen": null,
      "bodega_destino": "BODEGA_01",
      "ubicacion_origen": null,
      "ubicacion_destino": "UBC_01",
      "turno": null,
      "observacion": null,
      "bodega_stock": "BODEGA_01",
      "ubicacion_stock": "UBC_01",
      "total_stock": 500,
      "numero_embarque": null,
      "patente_camion": null,
      "fecha_creacion": "2025-08-18T05:25:28.797Z",
      "fecha_actualizacion": "2025-08-18T05:25:28.797Z",
      "material_completo": {
        "id": 1,
        "codigo_ranco": "BOGR2062",
        "nombre_material": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
        "unidad_medida": "Unidad",
        "clasificacion": "Normal"
      },
      "proveedor_completo": {
        "id": 2,
        "title": "EMBALAJES RANCO"
      },
      "temporada_completa": null,
      "tipo_movimiento_completo": null,
      "ubicacion_origen_completa": null,
      "ubicacion_destino_completa": {
        "id": 10,
        "title": "Bodega A",
        "bodega_deposito": "Almacén General",
        "planta": "Chimbarongo"
      }
    },
    {
      "id": 14,
      "tipo_movimiento": "consumo Frío",
      "planta": "RANCAGUA",
      "guia_sii": null,
      "fecha": "2025-08-18T00:00:00.000Z",
      "mes": "agosto",
      "id_movimiento": "FRIO_FRIO_RANCAGUA_20250818_002",
      "lote": "LOTE-FRIO-1755493344995",
      "codigo_material": "TEST001",
      "nombre_material": "Material Test Frío",
      "cod_nombre": null,
      "clasificacion": "MATERIA_PRIMA",
      "total_pallet": 0,
      "cantidad": 25,
      "unidad_medida": "KG",
      "bodega_origen": "BODEGA_01",
      "bodega_destino": "BODEGA_02",
      "ubicacion_origen": "UBC_01",
      "ubicacion_destino": "UBC_02",
      "turno": "MAÑANA",
      "observacion": null,
      "bodega_stock": "BODEGA_01",
      "ubicacion_stock": "UBC_01",
      "total_stock": null,
      "numero_embarque": null,
      "patente_camion": null,
      "fecha_creacion": "2025-08-18T05:02:25.097Z",
      "fecha_actualizacion": "2025-08-18T05:02:25.097Z",
      "material_completo": {
        "id": 1,
        "codigo_ranco": "BOGR2062",
        "nombre_material": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
        "unidad_medida": "Unidad",
        "clasificacion": "Normal"
      },
      "proveedor_completo": null,
      "temporada_completa": null,
      "tipo_movimiento_completo": null,
      "ubicacion_origen_completa": {
        "id": 10,
        "title": "Bodega A",
        "bodega_deposito": "Almacén General",
        "planta": "Chimbarongo"
      },
      "ubicacion_destino_completa": {
        "id": 11,
        "title": "Bodega B",
        "bodega_deposito": "Almacén General",
        "planta": "Chimbarongo"
      }
    }
  ],
  "paginacion": {
    "pagina_actual": 1,
    "total_paginas": 4,
    "total_registros": 18,
    "registros_por_pagina": 5
  }
}
```

### Campos Disponibles para Filtros

- **movimientos** (Array[[object Object]])
- **paginacion.pagina_actual** (Integer)
- **paginacion.total_paginas** (Integer)
- **paginacion.total_registros** (Integer)
- **paginacion.registros_por_pagina** (Integer)

---

## VistaRecepcionLotes

**Endpoint:** `/recepciones-lotes`

✅ **Status:** Exitoso

**Total de registros:** 1

### Schema de Datos

```json
{
  "recepciones": "Array[[object Object]]",
  "paginacion": {
    "pagina_actual": "Integer",
    "total_paginas": "Integer",
    "total_registros": "Integer",
    "registros_por_pagina": "Integer"
  }
}
```

### Datos de Ejemplo

```json
{
  "recepciones": [
    {
      "id": 1,
      "numero_recepcion": "REC_RANCAGUA_20250818_001",
      "planta": "RANCAGUA",
      "fecha_recepcion": "2025-08-18T00:00:00.000Z",
      "proveedor": {
        "id": 2,
        "nombre": "Proveedor Test",
        "completo": {
          "id": 2,
          "title": "EMBALAJES RANCO",
          "activo": true
        }
      },
      "guia_sii": "GUIA-1755491352371",
      "material": {
        "id": 1,
        "codigo": "BOGR2062",
        "nombre": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
        "cod_nombre": null,
        "unidad_medida": "KG",
        "clasificacion": "MATERIA_PRIMA",
        "completo": {
          "id": 1,
          "codigo_ranco": "BOGR2062",
          "nombre_material": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
          "unidad_medida": "Unidad",
          "clasificacion": "Normal"
        }
      },
      "lote": "LOTE-1755491352371",
      "cantidad": 500,
      "pallets": 10,
      "codigo_qr": null,
      "ubicacion_destino": {
        "id": 10,
        "bodega": "Almacén General",
        "ubicacion": "UB010",
        "completo": {
          "id": 10,
          "title": "Bodega A",
          "bodega_deposito": "Almacén General",
          "planta": "Chimbarongo"
        }
      },
      "estado": "procesada",
      "observaciones": "Recepción de prueba desde script",
      "usuario": {
        "id": 1,
        "nombre_usuario": "admin",
        "nombre_completo": "Administrador Sistema"
      },
      "fecha_creacion": "2025-08-18T04:29:12.444Z",
      "fecha_procesamiento": "2025-08-18T04:29:12.443Z"
    },
    {
      "id": 2,
      "numero_recepcion": "REC_RANCAGUA_20250818_002",
      "planta": "RANCAGUA",
      "fecha_recepcion": "2025-08-18T00:00:00.000Z",
      "proveedor": {
        "id": 2,
        "nombre": "Proveedor Test",
        "completo": {
          "id": 2,
          "title": "EMBALAJES RANCO",
          "activo": true
        }
      },
      "guia_sii": "GUIA-1755491393863",
      "material": {
        "id": 1,
        "codigo": "BOGR2062",
        "nombre": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
        "cod_nombre": null,
        "unidad_medida": "KG",
        "clasificacion": "MATERIA_PRIMA",
        "completo": {
          "id": 1,
          "codigo_ranco": "BOGR2062",
          "nombre_material": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
          "unidad_medida": "Unidad",
          "clasificacion": "Normal"
        }
      },
      "lote": "LOTE-1755491393863",
      "cantidad": 500,
      "pallets": 10,
      "codigo_qr": null,
      "ubicacion_destino": {
        "id": 10,
        "bodega": "Almacén General",
        "ubicacion": "UB010",
        "completo": {
          "id": 10,
          "title": "Bodega A",
          "bodega_deposito": "Almacén General",
          "planta": "Chimbarongo"
        }
      },
      "estado": "procesada",
      "observaciones": "Recepción de prueba desde script",
      "usuario": {
        "id": 1,
        "nombre_usuario": "admin",
        "nombre_completo": "Administrador Sistema"
      },
      "fecha_creacion": "2025-08-18T04:29:53.933Z",
      "fecha_procesamiento": "2025-08-18T04:29:53.932Z"
    },
    {
      "id": 3,
      "numero_recepcion": "REC_RANCAGUA_20250818_003",
      "planta": "RANCAGUA",
      "fecha_recepcion": "2025-08-18T00:00:00.000Z",
      "proveedor": {
        "id": 2,
        "nombre": "Proveedor Test",
        "completo": {
          "id": 2,
          "title": "EMBALAJES RANCO",
          "activo": true
        }
      },
      "guia_sii": "GUIA-1755491544189",
      "material": {
        "id": 1,
        "codigo": "BOGR2062",
        "nombre": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
        "cod_nombre": null,
        "unidad_medida": "KG",
        "clasificacion": "MATERIA_PRIMA",
        "completo": {
          "id": 1,
          "codigo_ranco": "BOGR2062",
          "nombre_material": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
          "unidad_medida": "Unidad",
          "clasificacion": "Normal"
        }
      },
      "lote": "LOTE-1755491544189",
      "cantidad": 500,
      "pallets": 10,
      "codigo_qr": null,
      "ubicacion_destino": {
        "id": 10,
        "bodega": "Almacén General",
        "ubicacion": "UB010",
        "completo": {
          "id": 10,
          "title": "Bodega A",
          "bodega_deposito": "Almacén General",
          "planta": "Chimbarongo"
        }
      },
      "estado": "procesada",
      "observaciones": "Recepción de prueba desde script",
      "usuario": {
        "id": 1,
        "nombre_usuario": "admin",
        "nombre_completo": "Administrador Sistema"
      },
      "fecha_creacion": "2025-08-18T04:32:24.367Z",
      "fecha_procesamiento": "2025-08-18T04:32:24.366Z"
    },
    {
      "id": 4,
      "numero_recepcion": "REC_RANCAGUA_20250818_004",
      "planta": "RANCAGUA",
      "fecha_recepcion": "2025-08-18T00:00:00.000Z",
      "proveedor": {
        "id": 2,
        "nombre": "Proveedor Test",
        "completo": {
          "id": 2,
          "title": "EMBALAJES RANCO",
          "activo": true
        }
      },
      "guia_sii": "GUIA-1755491816766",
      "material": {
        "id": 1,
        "codigo": "BOGR2062",
        "nombre": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
        "cod_nombre": null,
        "unidad_medida": "KG",
        "clasificacion": "MATERIA_PRIMA",
        "completo": {
          "id": 1,
          "codigo_ranco": "BOGR2062",
          "nombre_material": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
          "unidad_medida": "Unidad",
          "clasificacion": "Normal"
        }
      },
      "lote": "LOTE-1755491816766",
      "cantidad": 500,
      "pallets": 10,
      "codigo_qr": null,
      "ubicacion_destino": {
        "id": 10,
        "bodega": "Almacén General",
        "ubicacion": "UB010",
        "completo": {
          "id": 10,
          "title": "Bodega A",
          "bodega_deposito": "Almacén General",
          "planta": "Chimbarongo"
        }
      },
      "estado": "procesada",
      "observaciones": "Recepción de prueba desde script",
      "usuario": {
        "id": 1,
        "nombre_usuario": "admin",
        "nombre_completo": "Administrador Sistema"
      },
      "fecha_creacion": "2025-08-18T04:36:56.835Z",
      "fecha_procesamiento": "2025-08-18T04:36:56.834Z"
    },
    {
      "id": 5,
      "numero_recepcion": "REC_RANCAGUA_20250818_005",
      "planta": "RANCAGUA",
      "fecha_recepcion": "2025-08-18T00:00:00.000Z",
      "proveedor": {
        "id": 2,
        "nombre": "Proveedor Test",
        "completo": {
          "id": 2,
          "title": "EMBALAJES RANCO",
          "activo": true
        }
      },
      "guia_sii": "GUIA-1755492079411",
      "material": {
        "id": 1,
        "codigo": "BOGR2062",
        "nombre": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
        "cod_nombre": null,
        "unidad_medida": "KG",
        "clasificacion": "MATERIA_PRIMA",
        "completo": {
          "id": 1,
          "codigo_ranco": "BOGR2062",
          "nombre_material": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
          "unidad_medida": "Unidad",
          "clasificacion": "Normal"
        }
      },
      "lote": "LOTE-1755492079411",
      "cantidad": 500,
      "pallets": 10,
      "codigo_qr": null,
      "ubicacion_destino": {
        "id": 10,
        "bodega": "Almacén General",
        "ubicacion": "UB010",
        "completo": {
          "id": 10,
          "title": "Bodega A",
          "bodega_deposito": "Almacén General",
          "planta": "Chimbarongo"
        }
      },
      "estado": "procesada",
      "observaciones": "Recepción de prueba desde script",
      "usuario": {
        "id": 1,
        "nombre_usuario": "admin",
        "nombre_completo": "Administrador Sistema"
      },
      "fecha_creacion": "2025-08-18T04:41:19.486Z",
      "fecha_procesamiento": "2025-08-18T04:41:19.484Z"
    }
  ],
  "paginacion": {
    "pagina_actual": 1,
    "total_paginas": 2,
    "total_registros": 8,
    "registros_por_pagina": 5
  }
}
```

### Campos Disponibles para Filtros

- **recepciones** (Array[[object Object]])
- **paginacion.pagina_actual** (Integer)
- **paginacion.total_paginas** (Integer)
- **paginacion.total_registros** (Integer)
- **paginacion.registros_por_pagina** (Integer)

---

## VistaOperacionesFrioDespacho

**Endpoint:** `/operaciones-frio-despacho`

✅ **Status:** Exitoso

**Total de registros:** 1

### Schema de Datos

```json
{
  "operaciones": "Array[[object Object]]",
  "paginacion": {
    "pagina_actual": "Integer",
    "total_paginas": "Integer",
    "total_registros": "Integer",
    "registros_por_pagina": "Integer"
  }
}
```

### Datos de Ejemplo

```json
{
  "operaciones": [
    {
      "id": 1,
      "numero_operacion": "FRIO_RANCAGUA_20250818_001",
      "planta": "RANCAGUA",
      "fecha_operacion": "2025-08-18T00:00:00.000Z",
      "tipo_operacion": "consumo",
      "turno": "MAÑANA",
      "numero_embarque": null,
      "patente_camion": null,
      "material": {
        "id": 1,
        "codigo": "BOGR2062",
        "nombre": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
        "cod_nombre": null,
        "unidad_medida": "KG",
        "clasificacion": "MATERIA_PRIMA",
        "completo": {
          "id": 1,
          "codigo_ranco": "BOGR2062",
          "nombre_material": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
          "unidad_medida": "Unidad",
          "clasificacion": "Normal"
        }
      },
      "lote": "LOTE-FRIO-1755492282722",
      "cantidad": 25,
      "ubicacion_origen": {
        "id": 10,
        "bodega": "Almacén General",
        "ubicacion": "UB010",
        "completo": {
          "id": 10,
          "title": "Bodega A",
          "bodega_deposito": "Almacén General",
          "planta": "Chimbarongo"
        }
      },
      "ubicacion_destino": {
        "id": 11,
        "bodega": "Almacén General",
        "ubicacion": "UB011",
        "completo": {
          "id": 11,
          "title": "Bodega B",
          "bodega_deposito": "Almacén General",
          "planta": "Chimbarongo"
        }
      },
      "estado": "procesada",
      "observaciones": "Operación de prueba desde script con stock previo",
      "usuario": {
        "id": 1,
        "nombre_usuario": "admin",
        "nombre_completo": "Administrador Sistema"
      },
      "fecha_creacion": "2025-08-18T04:44:42.806Z",
      "fecha_procesamiento": "2025-08-18T04:44:42.805Z"
    },
    {
      "id": 2,
      "numero_operacion": "FRIO_RANCAGUA_20250818_002",
      "planta": "RANCAGUA",
      "fecha_operacion": "2025-08-18T00:00:00.000Z",
      "tipo_operacion": "consumo",
      "turno": "MAÑANA",
      "numero_embarque": null,
      "patente_camion": null,
      "material": {
        "id": 1,
        "codigo": "TEST001",
        "nombre": "Material Test Frío",
        "cod_nombre": null,
        "unidad_medida": "KG",
        "clasificacion": "MATERIA_PRIMA",
        "completo": {
          "id": 1,
          "codigo_ranco": "BOGR2062",
          "nombre_material": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
          "unidad_medida": "Unidad",
          "clasificacion": "Normal"
        }
      },
      "lote": "LOTE-FRIO-1755493344995",
      "cantidad": 25,
      "ubicacion_origen": {
        "id": 10,
        "bodega": "BODEGA_01",
        "ubicacion": "UBC_01",
        "completo": {
          "id": 10,
          "title": "Bodega A",
          "bodega_deposito": "Almacén General",
          "planta": "Chimbarongo"
        }
      },
      "ubicacion_destino": {
        "id": 11,
        "bodega": "BODEGA_02",
        "ubicacion": "UBC_02",
        "completo": {
          "id": 11,
          "title": "Bodega B",
          "bodega_deposito": "Almacén General",
          "planta": "Chimbarongo"
        }
      },
      "estado": "procesada",
      "observaciones": "Operación de prueba desde script con stock previo",
      "usuario": {
        "id": 1,
        "nombre_usuario": "admin",
        "nombre_completo": "Administrador Sistema"
      },
      "fecha_creacion": "2025-08-18T05:02:25.088Z",
      "fecha_procesamiento": "2025-08-18T05:02:25.087Z"
    },
    {
      "id": 3,
      "numero_operacion": "FRIO_RANCAGUA_20250818_003",
      "planta": "RANCAGUA",
      "fecha_operacion": "2025-08-18T00:00:00.000Z",
      "tipo_operacion": "consumo",
      "turno": "MAÑANA",
      "numero_embarque": null,
      "patente_camion": null,
      "material": {
        "id": 1,
        "codigo": "TEST001",
        "nombre": "Material Test Frío",
        "cod_nombre": null,
        "unidad_medida": "KG",
        "clasificacion": "MATERIA_PRIMA",
        "completo": {
          "id": 1,
          "codigo_ranco": "BOGR2062",
          "nombre_material": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
          "unidad_medida": "Unidad",
          "clasificacion": "Normal"
        }
      },
      "lote": "LOTE-FRIO-1755494728900",
      "cantidad": 25,
      "ubicacion_origen": {
        "id": 10,
        "bodega": "BODEGA_01",
        "ubicacion": "UBC_01",
        "completo": {
          "id": 10,
          "title": "Bodega A",
          "bodega_deposito": "Almacén General",
          "planta": "Chimbarongo"
        }
      },
      "ubicacion_destino": {
        "id": 11,
        "bodega": "BODEGA_02",
        "ubicacion": "UBC_02",
        "completo": {
          "id": 11,
          "title": "Bodega B",
          "bodega_deposito": "Almacén General",
          "planta": "Chimbarongo"
        }
      },
      "estado": "procesada",
      "observaciones": "Operación de prueba desde script con stock previo",
      "usuario": {
        "id": 1,
        "nombre_usuario": "admin",
        "nombre_completo": "Administrador Sistema"
      },
      "fecha_creacion": "2025-08-18T05:25:29.124Z",
      "fecha_procesamiento": "2025-08-18T05:25:29.123Z"
    }
  ],
  "paginacion": {
    "pagina_actual": 1,
    "total_paginas": 1,
    "total_registros": 3,
    "registros_por_pagina": 5
  }
}
```

### Campos Disponibles para Filtros

- **operaciones** (Array[[object Object]])
- **paginacion.pagina_actual** (Integer)
- **paginacion.total_paginas** (Integer)
- **paginacion.total_registros** (Integer)
- **paginacion.registros_por_pagina** (Integer)

---

## VistaTarjas

**Endpoint:** `/tarjas`

✅ **Status:** Exitoso

**Total de registros:** 1

### Schema de Datos

```json
{
  "tarjas": "Array[[object Object]]",
  "paginacion": {
    "pagina_actual": "Integer",
    "total_paginas": "Integer",
    "total_registros": "Integer",
    "registros_por_pagina": "Integer"
  }
}
```

### Datos de Ejemplo

```json
{
  "tarjas": [
    {
      "id": 7,
      "numero_tarja": "BOD_RANCAGUA_20250818_000001",
      "planta": "RANCAGUA",
      "fecha_generacion": "2025-08-18T00:00:00.000Z",
      "tipo_tarja": "BODEGA",
      "descripcion": "Tarja de prueba desde script",
      "material": {
        "id": 1,
        "codigo": "TEST001",
        "nombre": "Material de Prueba Para Tarja",
        "completo": {
          "id": 1,
          "codigo_ranco": "BOGR2062",
          "nombre_material": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
          "unidad_medida": "Unidad",
          "clasificacion": "Normal"
        }
      },
      "lote": "LOTE-TARJA-1755493344734",
      "cantidad": 100,
      "numero_item": null,
      "fecha_item": null,
      "proveedor": {
        "id": 2,
        "nombre": null,
        "completo": {
          "id": 2,
          "title": "EMBALAJES RANCO",
          "activo": true
        }
      },
      "guia": null,
      "estado": "impresa",
      "usuario": {
        "id": 1,
        "nombre_usuario": "admin",
        "nombre_completo": "Administrador Sistema"
      },
      "fecha_creacion": "2025-08-18T05:02:24.803Z",
      "fecha_impresion": "2025-08-18T05:02:24.825Z"
    },
    {
      "id": 8,
      "numero_tarja": "BOD_RANCAGUA_20250818_000002",
      "planta": "RANCAGUA",
      "fecha_generacion": "2025-08-18T00:00:00.000Z",
      "tipo_tarja": "BODEGA",
      "descripcion": "Tarja de prueba desde script",
      "material": {
        "id": 1,
        "codigo": "TEST001",
        "nombre": "Material de Prueba Para Tarja",
        "completo": {
          "id": 1,
          "codigo_ranco": "BOGR2062",
          "nombre_material": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
          "unidad_medida": "Unidad",
          "clasificacion": "Normal"
        }
      },
      "lote": "LOTE-TARJA-1755494728541",
      "cantidad": 100,
      "numero_item": null,
      "fecha_item": null,
      "proveedor": {
        "id": 2,
        "nombre": null,
        "completo": {
          "id": 2,
          "title": "EMBALAJES RANCO",
          "activo": true
        }
      },
      "guia": null,
      "estado": "impresa",
      "usuario": {
        "id": 1,
        "nombre_usuario": "admin",
        "nombre_completo": "Administrador Sistema"
      },
      "fecha_creacion": "2025-08-18T05:25:28.613Z",
      "fecha_impresion": "2025-08-18T05:25:28.707Z"
    },
    {
      "id": 1,
      "numero_tarja": "CAA_RANCAGUA_20250818_000001",
      "planta": "RANCAGUA",
      "fecha_generacion": "2025-08-18T00:00:00.000Z",
      "tipo_tarja": "CAA",
      "descripcion": "Tarja de prueba desde script",
      "material": {
        "id": null,
        "codigo": "TEST001",
        "nombre": "Material de Prueba Para Tarja",
        "completo": null
      },
      "lote": "LOTE-TARJA-1755491352258",
      "cantidad": 100,
      "numero_item": null,
      "fecha_item": null,
      "proveedor": {
        "id": null,
        "nombre": null,
        "completo": null
      },
      "guia": null,
      "estado": "impresa",
      "usuario": {
        "id": 1,
        "nombre_usuario": "admin",
        "nombre_completo": "Administrador Sistema"
      },
      "fecha_creacion": "2025-08-18T04:29:12.320Z",
      "fecha_impresion": "2025-08-18T04:29:12.343Z"
    },
    {
      "id": 2,
      "numero_tarja": "CAA_RANCAGUA_20250818_000002",
      "planta": "RANCAGUA",
      "fecha_generacion": "2025-08-18T00:00:00.000Z",
      "tipo_tarja": "CAA",
      "descripcion": "Tarja de prueba desde script",
      "material": {
        "id": null,
        "codigo": "TEST001",
        "nombre": "Material de Prueba Para Tarja",
        "completo": null
      },
      "lote": "LOTE-TARJA-1755491393759",
      "cantidad": 100,
      "numero_item": null,
      "fecha_item": null,
      "proveedor": {
        "id": null,
        "nombre": null,
        "completo": null
      },
      "guia": null,
      "estado": "impresa",
      "usuario": {
        "id": 1,
        "nombre_usuario": "admin",
        "nombre_completo": "Administrador Sistema"
      },
      "fecha_creacion": "2025-08-18T04:29:53.824Z",
      "fecha_impresion": "2025-08-18T04:29:53.844Z"
    },
    {
      "id": 3,
      "numero_tarja": "CAA_RANCAGUA_20250818_000003",
      "planta": "RANCAGUA",
      "fecha_generacion": "2025-08-18T00:00:00.000Z",
      "tipo_tarja": "CAA",
      "descripcion": "Tarja de prueba desde script",
      "material": {
        "id": null,
        "codigo": "TEST001",
        "nombre": "Material de Prueba Para Tarja",
        "completo": null
      },
      "lote": "LOTE-TARJA-1755491544079",
      "cantidad": 100,
      "numero_item": null,
      "fecha_item": null,
      "proveedor": {
        "id": null,
        "nombre": null,
        "completo": null
      },
      "guia": null,
      "estado": "impresa",
      "usuario": {
        "id": 1,
        "nombre_usuario": "admin",
        "nombre_completo": "Administrador Sistema"
      },
      "fecha_creacion": "2025-08-18T04:32:24.146Z",
      "fecha_impresion": "2025-08-18T04:32:24.169Z"
    }
  ],
  "paginacion": {
    "pagina_actual": 1,
    "total_paginas": 2,
    "total_registros": 8,
    "registros_por_pagina": 5
  }
}
```

### Campos Disponibles para Filtros

- **tarjas** (Array[[object Object]])
- **paginacion.pagina_actual** (Integer)
- **paginacion.total_paginas** (Integer)
- **paginacion.total_registros** (Integer)
- **paginacion.registros_por_pagina** (Integer)

---

