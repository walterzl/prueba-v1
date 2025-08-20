# Schema Detallado de APIs - WMS Ranco Cherries

_Documentación generada automáticamente el 19/8/2025_

## Resumen

Este documento contiene los schemas reales de datos devueltos por cada API del sistema WMS, con campos detallados para crear filtros precisos en el frontend.

---

## 📦 VistaInventario (`/inventario`)

### Schema del Array `inventario[]`

| Campo                 | Tipo        | Descripción                           | Filtrable |
| --------------------- | ----------- | ------------------------------------- | --------- |
| `id`                  | Integer     | ID único del registro de inventario   | ✅        |
| `planta`              | String      | Planta donde se encuentra el material | ✅        |
| `codigo_material`     | String      | Código del material                   | ✅        |
| `nombre_material`     | String      | Nombre del material                   | ✅        |
| `unidad_medida`       | String      | Unidad de medida (KG, Unidad, etc.)   | ✅        |
| `cod_nombre`          | String/null | Código completo con nombre            | ✅        |
| `fecha_inventario`    | DateTime    | Fecha del inventario                  | ✅        |
| `pallets`             | Integer     | Cantidad de pallets                   | ✅        |
| `stock`               | Integer     | Cantidad en stock                     | ✅        |
| `bodega`              | String      | Bodega donde se encuentra             | ✅        |
| `ubicacion`           | String      | Ubicación específica                  | ✅        |
| `lote`                | String/null | Lote del material                     | ✅        |
| `condicion_armado`    | String/null | Condición de armado                   | ✅        |
| `contado_por`         | String      | Usuario que realizó el conteo         | ✅        |
| `fecha_creacion`      | DateTime    | Fecha de creación del registro        | ✅        |
| `fecha_actualizacion` | DateTime    | Fecha de última actualización         | ✅        |
| `material_completo`   | Object/null | Datos completos del material          | ❌        |
| `ubicacion_completa`  | Object/null | Datos completos de la ubicación       | ❌        |

### Campos para Filtros de Cabecera

- **Búsqueda texto**: `codigo_material`, `nombre_material`, `contado_por`, `bodega`, `ubicacion`
- **Fechas**: `fecha_inventario`, `fecha_creacion`, `fecha_actualizacion`
- **Selectores**: `planta`, `unidad_medida`, `condicion_armado`
- **Rangos numéricos**: `stock`, `pallets`

---

## 🔄 VistaTrazabilidad (`/trazabilidad`)

### Schema del Array `movimientos[]`

| Campo               | Tipo        | Descripción                | Filtrable |
| ------------------- | ----------- | -------------------------- | --------- |
| `id`                | Integer     | ID único del movimiento    | ✅        |
| `tipo_movimiento`   | String      | Tipo de movimiento         | ✅        |
| `planta`            | String      | Planta del movimiento      | ✅        |
| `guia_sii`          | String/null | Número de guía SII         | ✅        |
| `fecha`             | DateTime    | Fecha del movimiento       | ✅        |
| `mes`               | String      | Mes del movimiento         | ✅        |
| `id_movimiento`     | String      | ID único del movimiento    | ✅        |
| `proveedor`         | String/null | Proveedor relacionado      | ✅        |
| `lote`              | String      | Lote del material          | ✅        |
| `codigo_material`   | String      | Código del material        | ✅        |
| `nombre_material`   | String      | Nombre del material        | ✅        |
| `cod_nombre`        | String/null | Código completo con nombre | ✅        |
| `clasificacion`     | String      | Clasificación del material | ✅        |
| `total_pallet`      | Integer     | Total de pallets           | ✅        |
| `cantidad`          | Integer     | Cantidad movida            | ✅        |
| `unidad_medida`     | String      | Unidad de medida           | ✅        |
| `bodega_origen`     | String/null | Bodega de origen           | ✅        |
| `bodega_destino`    | String/null | Bodega de destino          | ✅        |
| `ubicacion_origen`  | String/null | Ubicación de origen        | ✅        |
| `ubicacion_destino` | String/null | Ubicación de destino       | ✅        |
| `turno`             | String/null | Turno de trabajo           | ✅        |
| `temporada`         | String/null | Temporada                  | ✅        |
| `observacion`       | String/null | Observaciones              | ✅        |
| `numero_embarque`   | String/null | Número de embarque         | ✅        |
| `patente_camion`    | String/null | Patente del camión         | ✅        |

### Campos para Filtros de Cabecera

- **Búsqueda texto**: `codigo_material`, `nombre_material`, `lote`, `proveedor`, `observacion`, `guia_sii`
- **Fechas**: `fecha`
- **Selectores**: `tipo_movimiento`, `planta`, `clasificacion`, `turno`, `temporada`, `unidad_medida`
- **Bodegas/Ubicaciones**: `bodega_origen`, `bodega_destino`, `ubicacion_origen`, `ubicacion_destino`

---

## 📥 VistaRecepcionLotes (`/recepciones-lotes`)

### Schema del Array `recepciones[]`

| Campo                         | Tipo        | Descripción                   | Filtrable |
| ----------------------------- | ----------- | ----------------------------- | --------- |
| `id`                          | Integer     | ID único de la recepción      | ✅        |
| `numero_recepcion`            | String      | Número de recepción           | ✅        |
| `planta`                      | String      | Planta de recepción           | ✅        |
| `fecha_recepcion`             | DateTime    | Fecha de recepción            | ✅        |
| `proveedor.nombre`            | String      | Nombre del proveedor          | ✅        |
| `proveedor.completo.title`    | String      | Título completo del proveedor | ✅        |
| `guia_sii`                    | String      | Número de guía SII            | ✅        |
| `material.codigo`             | String      | Código del material           | ✅        |
| `material.nombre`             | String      | Nombre del material           | ✅        |
| `material.unidad_medida`      | String      | Unidad de medida              | ✅        |
| `material.clasificacion`      | String      | Clasificación del material    | ✅        |
| `lote`                        | String      | Lote del material             | ✅        |
| `cantidad`                    | Integer     | Cantidad recibida             | ✅        |
| `pallets`                     | Integer     | Cantidad de pallets           | ✅        |
| `codigo_qr`                   | String/null | Código QR                     | ✅        |
| `ubicacion_destino.bodega`    | String      | Bodega de destino             | ✅        |
| `ubicacion_destino.ubicacion` | String      | Ubicación de destino          | ✅        |
| `estado`                      | String      | Estado de la recepción        | ✅        |
| `observaciones`               | String      | Observaciones                 | ✅        |
| `usuario.nombre_usuario`      | String      | Usuario responsable           | ✅        |
| `fecha_creacion`              | DateTime    | Fecha de creación             | ✅        |
| `fecha_procesamiento`         | DateTime    | Fecha de procesamiento        | ✅        |

### Campos para Filtros de Cabecera

- **Búsqueda texto**: `numero_recepcion`, `guia_sii`, `lote`, `observaciones`
- **Fechas**: `fecha_recepcion`, `fecha_creacion`, `fecha_procesamiento`
- **Selectores**: `planta`, `estado`, `proveedor.completo.title`, `material.clasificacion`, `material.unidad_medida`
- **Ubicaciones**: `ubicacion_destino.bodega`, `ubicacion_destino.ubicacion`
- **Rangos numéricos**: `cantidad`, `pallets`

---

## ❄️ VistaOperacionesFrioDespacho (`/operaciones-frio-despacho`)

### Schema del Array `operaciones[]`

| Campo                         | Tipo        | Descripción                           | Filtrable |
| ----------------------------- | ----------- | ------------------------------------- | --------- |
| `id`                          | Integer     | ID único de la operación              | ✅        |
| `numero_operacion`            | String      | Número de operación                   | ✅        |
| `planta`                      | String      | Planta de la operación                | ✅        |
| `fecha_operacion`             | DateTime    | Fecha de la operación                 | ✅        |
| `tipo_operacion`              | String      | Tipo de operación (consumo, despacho) | ✅        |
| `turno`                       | String      | Turno de trabajo                      | ✅        |
| `numero_embarque`             | String/null | Número de embarque                    | ✅        |
| `patente_camion`              | String/null | Patente del camión                    | ✅        |
| `material.codigo`             | String      | Código del material                   | ✅        |
| `material.nombre`             | String      | Nombre del material                   | ✅        |
| `material.unidad_medida`      | String      | Unidad de medida                      | ✅        |
| `material.clasificacion`      | String      | Clasificación del material            | ✅        |
| `lote`                        | String      | Lote del material                     | ✅        |
| `cantidad`                    | Integer     | Cantidad de la operación              | ✅        |
| `ubicacion_origen.bodega`     | String      | Bodega de origen                      | ✅        |
| `ubicacion_origen.ubicacion`  | String      | Ubicación de origen                   | ✅        |
| `ubicacion_destino.bodega`    | String/null | Bodega de destino                     | ✅        |
| `ubicacion_destino.ubicacion` | String/null | Ubicación de destino                  | ✅        |
| `estado`                      | String      | Estado de la operación                | ✅        |
| `observaciones`               | String      | Observaciones                         | ✅        |
| `usuario.nombre_usuario`      | String      | Usuario responsable                   | ✅        |
| `fecha_creacion`              | DateTime    | Fecha de creación                     | ✅        |
| `fecha_procesamiento`         | DateTime    | Fecha de procesamiento                | ✅        |

### Campos para Filtros de Cabecera

- **Búsqueda texto**: `numero_operacion`, `lote`, `numero_embarque`, `patente_camion`, `observaciones`
- **Fechas**: `fecha_operacion`, `fecha_creacion`, `fecha_procesamiento`
- **Selectores**: `planta`, `tipo_operacion`, `turno`, `estado`, `material.clasificacion`, `material.unidad_medida`
- **Ubicaciones**: `ubicacion_origen.bodega`, `ubicacion_origen.ubicacion`, `ubicacion_destino.bodega`, `ubicacion_destino.ubicacion`
- **Rangos numéricos**: `cantidad`

---

## 🏷️ VistaTarjas (`/tarjas`)

### Schema del Array `tarjas[]`

| Campo                      | Tipo          | Descripción                 | Filtrable |
| -------------------------- | ------------- | --------------------------- | --------- |
| `id`                       | Integer       | ID único de la tarja        | ✅        |
| `numero_tarja`             | String        | Número de tarja             | ✅        |
| `planta`                   | String        | Planta de la tarja          | ✅        |
| `fecha_generacion`         | DateTime      | Fecha de generación         | ✅        |
| `tipo_tarja`               | String        | Tipo de tarja (CAA, BODEGA) | ✅        |
| `descripcion`              | String        | Descripción de la tarja     | ✅        |
| `material.codigo`          | String        | Código del material         | ✅        |
| `material.nombre`          | String        | Nombre del material         | ✅        |
| `lote`                     | String        | Lote del material           | ✅        |
| `cantidad`                 | Integer       | Cantidad en la tarja        | ✅        |
| `numero_item`              | String/null   | Número de item              | ✅        |
| `fecha_item`               | DateTime/null | Fecha del item              | ✅        |
| `proveedor.completo.title` | String/null   | Título del proveedor        | ✅        |
| `guia`                     | String/null   | Número de guía              | ✅        |
| `estado`                   | String        | Estado de la tarja          | ✅        |
| `usuario.nombre_usuario`   | String        | Usuario responsable         | ✅        |
| `fecha_creacion`           | DateTime      | Fecha de creación           | ✅        |
| `fecha_impresion`          | DateTime      | Fecha de impresión          | ✅        |

### Campos para Filtros de Cabecera

- **Búsqueda texto**: `numero_tarja`, `descripcion`, `lote`, `guia`
- **Fechas**: `fecha_generacion`, `fecha_item`, `fecha_creacion`, `fecha_impresion`
- **Selectores**: `planta`, `tipo_tarja`, `estado`, `proveedor.completo.title`
- **Material**: `material.codigo`, `material.nombre`
- **Rangos numéricos**: `cantidad`

---

## 📋 Recomendaciones para Filtros

### Campos de Búsqueda Universal (aplicar a todos los módulos):

- **Texto libre**: Buscar en campos de código, nombre, lote, observaciones
- **Fechas**: Rango de fechas con desde/hasta
- **Estado**: Selector con opciones específicas del módulo
- **Planta**: Selector con plantas disponibles
- **Usuario**: Filtro por usuario responsable

### Filtros Específicos por Módulo:

#### Inventario:

- Stock (rango numérico), Condición de armado, Unidad de medida, Bodega/Ubicación

#### Trazabilidad:

- Tipo de movimiento, Clasificación, Turno, Bodega origen/destino, Proveedor

#### Recepción de Lotes:

- Proveedor, Clasificación material, Pallets (rango), Guía SII

#### Operaciones Frío/Despacho:

- Tipo operación, Turno, Número embarque, Patente camión, Ubicación origen/destino

#### Tarjas:

- Tipo tarja, Proveedor, Material, Guía

---

_Esta documentación permite crear filtros precisos basados en los campos reales de cada API del sistema WMS._
