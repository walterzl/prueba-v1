# Documentación APIs de Campos Anidados

*Generado automáticamente el 20-08-2025 a las 12:29:45 a. m.*

## Resumen

Esta documentación describe las APIs disponibles para el sistema de campos anidados del WMS Ranco Cherries.

### Estadísticas Generales

- **Total de APIs documentadas**: 21
- **Total de llamadas realizadas**: 27
- **Tasa de éxito general**: 81.5%

## Autenticación

Todas las APIs requieren autenticación mediante Bearer Token:

```
Authorization: Bearer {tu_token_jwt}
```

Para obtener un token, utiliza la API de login:

```javascript
POST /api/auth/login
{
  "usuario": "admin",
  "password": "1234567"
}
```

## APIs Disponibles


### GET /INVENTARIO/configuracion

Obtiene la configuración completa de campos para formularios de inventario

#### Parámetros

Esta API no requiere parámetros.

#### Respuesta Exitosa (200)

```json
{
  "exito": true,
  "mensaje": "Configuración de formulario INVENTARIO obtenida exitosamente",
  "datos": {
    "materiales": {
      "endpoint": "/api/mantenedores/materiales",
      "valueField": "id",
      "labelField": "nombre_material",
      "searchFields": [
        "codigo_ranco",
        "nombre_material",
        "cod_nombre"
      ],
      "displayTemplate": "{codigo_ranco} - {nombre_material}",
      "filters": {
        "activo": true
      },
      "dependsOn": null,
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "ubicaciones": {
      "endpoint": "/api/mantenedores/ubicaciones",
      "valueField": "id",
      "labelField": "nombre",
      "searchFields": [
        "codigo",
        "nombre",
        "bodega"
      ],
      "displayTemplate": "{bodega} / {nombre}",
      "filters": {
        "activo": true
      },
      "dependsOn": "planta",
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "plantas": {
      "endpoint": "/api/mantenedores/plantas",
      "valueField": "codigo",
      "labelField": "nombre",
      "searchFields": [
        "codigo",
        "nombre"
      ],
      "displayTemplate": "{nombre}",
      "filters": {},
      "dependsOn": null,
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    }
  }
}
```

#### Estructura del Schema

- **materiales** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/materiales"
  - **valueField** (string): "id"
  - **labelField** (string): "nombre_material"
  - **searchFields** (object): codigo_ranco,nombre_material,cod_nombre
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{codigo_ranco} - {nombre_material}"
  - **filters** (object): [object Object]
    - **activo** (boolean): true
  - **dependsOn** (object) *opcional*
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **ubicaciones** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/ubicaciones"
  - **valueField** (string): "id"
  - **labelField** (string): "nombre"
  - **searchFields** (object): codigo,nombre,bodega
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{bodega} / {nombre}"
  - **filters** (object): [object Object]
    - **activo** (boolean): true
  - **dependsOn** (string): "planta"
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **plantas** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/plantas"
  - **valueField** (string): "codigo"
  - **labelField** (string): "nombre"
  - **searchFields** (object): codigo,nombre
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{nombre}"
  - **filters** (object): [object Object]
  - **dependsOn** (object) *opcional*
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true


#### Ejemplo de Uso

```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/INVENTARIO/configuracion',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/INVENTARIO/configuracion"
```

---


### GET /INVENTARIO/materiales/opciones

Obtiene opciones disponibles para el campo materiales en inventario

#### Parámetros

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|----------|
| limite | string | Número máximo de resultados a retornar | 3 |
| busqueda | string | Término de búsqueda para filtrar resultados | A |

#### Respuesta Exitosa (200)

```json
{
  "exito": true,
  "mensaje": "Opciones para materiales obtenidas exitosamente",
  "datos": [
    {
      "value": 862,
      "label": "CTAB1209 - ABSORPAD 10 KG  UNILAMINAR MICROPERFORADO 360 x 56",
      "data": {
        "id": 862,
        "codigo_ranco": "CTAB1209",
        "nombre_material": "ABSORPAD 10 KG  UNILAMINAR MICROPERFORADO 360 x 56",
        "unidad_medida": null,
        "clasificacion": null,
        "frio": "No",
        "cod_nombre": "CTAB1209 ABSORPAD 10 KG  UNILAMINAR MICROPERFORADO 360 x 56",
        "activo": true
      }
    },
    {
      "value": 863,
      "label": "CTAB1208 - ABSORPAD 10 KG 36 X 46 MM BILAMINAR",
      "data": {
        "id": 863,
        "codigo_ranco": "CTAB1208",
        "nombre_material": "ABSORPAD 10 KG 36 X 46 MM BILAMINAR",
        "unidad_medida": null,
        "clasificacion": null,
        "frio": "No",
        "cod_nombre": "CTAB1208 ABSORPAD 10 KG 36 X 46 MM BILAMINAR",
        "activo": true
      }
    },
    {
      "value": 860,
      "label": "CTAB1211 - ABSORPAD 10 KG 360 MM X 560 MM BILAMINAR",
      "data": {
        "id": 860,
        "codigo_ranco": "CTAB1211",
        "nombre_material": "ABSORPAD 10 KG 360 MM X 560 MM BILAMINAR",
        "unidad_medida": null,
        "clasificacion": null,
        "frio": "No",
        "cod_nombre": "CTAB1211 ABSORPAD 10 KG 360 MM X 560 MM BILAMINAR",
        "activo": true
      }
    }
  ],
  "total": 3
}
```

#### Estructura del Schema

- **Array** de elementos:
  - **value** (number): 862
  - **label** (string): "CTAB1209 - ABSORPAD 10 KG  UNILAMINAR MICROPERFORADO 360 x 56"
  - **data** (object): [object Object]
    - **id** (number): 862
    - **codigo_ranco** (string): "CTAB1209"
    - **nombre_material** (string): "ABSORPAD 10 KG  UNILAMINAR MICROPERFORADO 360 x 56"
    - **unidad_medida** (object) *opcional*
    - **clasificacion** (object) *opcional*
    - **frio** (string): "No"
    - **cod_nombre** (string): "CTAB1209 ABSORPAD 10 KG  UNILAMINAR MICROPERFORADO 360 x 56"
    - **activo** (boolean): true


#### Ejemplo de Uso

```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/INVENTARIO/materiales/opciones',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/INVENTARIO/materiales/opciones"
```

---


### GET /INVENTARIO/materiales/opciones-paginadas

API para /INVENTARIO/materiales/opciones-paginadas

#### Parámetros

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|----------|
| pagina | string | Número de página para paginación | 1 |
| tamanoPagina | string | Cantidad de elementos por página | 3 |

#### Respuesta Exitosa (200)

```json
{
  "exito": true,
  "mensaje": "Opciones paginadas para materiales obtenidas exitosamente",
  "datos": {
    "opciones": [
      {
        "value": 862,
        "label": " - ",
        "data": {
          "id": 862,
          "codigo": "CTAB1209",
          "nombre": "ABSORPAD 10 KG  UNILAMINAR MICROPERFORADO 360 x 56",
          "unidad_medida": null,
          "clasificacion": null,
          "requiere_frio": false,
          "cod_nombre": "CTAB1209 ABSORPAD 10 KG  UNILAMINAR MICROPERFORADO 360 x 56",
          "activo": true
        }
      },
      {
        "value": 863,
        "label": " - ",
        "data": {
          "id": 863,
          "codigo": "CTAB1208",
          "nombre": "ABSORPAD 10 KG 36 X 46 MM BILAMINAR",
          "unidad_medida": null,
          "clasificacion": null,
          "requiere_frio": false,
          "cod_nombre": "CTAB1208 ABSORPAD 10 KG 36 X 46 MM BILAMINAR",
          "activo": true
        }
      },
      {
        "value": 860,
        "label": " - ",
        "data": {
          "id": 860,
          "codigo": "CTAB1211",
          "nombre": "ABSORPAD 10 KG 360 MM X 560 MM BILAMINAR",
          "unidad_medida": null,
          "clasificacion": null,
          "requiere_frio": false,
          "cod_nombre": "CTAB1211 ABSORPAD 10 KG 360 MM X 560 MM BILAMINAR",
          "activo": true
        }
      }
    ],
    "paginacion": {
      "pagina": 1,
      "tamanoPagina": 3,
      "total": 1341,
      "totalPaginas": 447,
      "hayMas": true
    }
  }
}
```

#### Estructura del Schema

- **opciones** (object): [object Object],[object Object],[object Object]
  - **Array** de elementos:
    - **value** (number): 862
    - **label** (string): " - "
    - **data** (object): [object Object]
      - **id** (number): 862
      - **codigo** (string): "CTAB1209"
      - **nombre** (string): "ABSORPAD 10 KG  UNILAMINAR MICROPERFORADO 360 x 56"
      - **unidad_medida** (object) *opcional*
      - **clasificacion** (object) *opcional*
      - **requiere_frio** (boolean): false
      - **cod_nombre** (string): "CTAB1209 ABSORPAD 10 KG  UNILAMINAR MICROPERFORADO 360 x 56"
      - **activo** (boolean): true
- **paginacion** (object): [object Object]
  - **pagina** (number): 1
  - **tamanoPagina** (number): 3
  - **total** (number): 1341
  - **totalPaginas** (number): 447
  - **hayMas** (boolean): true


#### Ejemplo de Uso

```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/INVENTARIO/materiales/opciones-paginadas',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/INVENTARIO/materiales/opciones-paginadas"
```

---


### GET /TRAZABILIDAD/configuracion

Obtiene la configuración completa de campos para formularios de trazabilidad

#### Parámetros

Esta API no requiere parámetros.

#### Respuesta Exitosa (200)

```json
{
  "exito": true,
  "mensaje": "Configuración de formulario TRAZABILIDAD obtenida exitosamente",
  "datos": {
    "materiales": {
      "endpoint": "/api/mantenedores/materiales",
      "valueField": "id",
      "labelField": "nombre_material",
      "searchFields": [
        "codigo_ranco",
        "nombre_material",
        "cod_nombre",
        "clasificacion"
      ],
      "displayTemplate": "{codigo_ranco} - {nombre_material}",
      "filters": {
        "activo": true
      },
      "dependsOn": null,
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "proveedores": {
      "endpoint": "/api/mantenedores/proveedores",
      "valueField": "id",
      "labelField": "title",
      "searchFields": [
        "title"
      ],
      "displayTemplate": "{title}",
      "filters": {
        "activo": true
      },
      "dependsOn": null,
      "required": false,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "ubicaciones_origen": {
      "endpoint": "/api/mantenedores/ubicaciones",
      "valueField": "id",
      "labelField": "nombre",
      "searchFields": [
        "codigo",
        "nombre",
        "bodega"
      ],
      "displayTemplate": "{bodega} / {nombre}",
      "filters": {
        "activo": true
      },
      "dependsOn": "planta",
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "ubicaciones_destino": {
      "endpoint": "/api/mantenedores/ubicaciones",
      "valueField": "id",
      "labelField": "nombre",
      "searchFields": [
        "codigo",
        "nombre",
        "bodega"
      ],
      "displayTemplate": "{bodega} / {nombre}",
      "filters": {
        "activo": true
      },
      "dependsOn": "planta",
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "temporadas": {
      "endpoint": "/api/mantenedores/temporadas",
      "valueField": "id",
      "labelField": "title",
      "searchFields": [
        "title"
      ],
      "displayTemplate": "{title}",
      "filters": {
        "activo": true
      },
      "dependsOn": null,
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "tipos_movimiento": {
      "endpoint": "/api/mantenedores/tipos-movimiento",
      "valueField": "id",
      "labelField": "nombre",
      "searchFields": [
        "codigo",
        "nombre",
        "descripcion"
      ],
      "displayTemplate": "{nombre}",
      "filters": {
        "activo": true
      },
      "dependsOn": null,
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "plantas": {
      "endpoint": "/api/mantenedores/plantas",
      "valueField": "codigo",
      "labelField": "nombre",
      "searchFields": [
        "codigo",
        "nombre"
      ],
      "displayTemplate": "{nombre}",
      "filters": {},
      "dependsOn": null,
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    }
  }
}
```

#### Estructura del Schema

- **materiales** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/materiales"
  - **valueField** (string): "id"
  - **labelField** (string): "nombre_material"
  - **searchFields** (object): codigo_ranco,nombre_material,cod_nombre,clasificacion
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{codigo_ranco} - {nombre_material}"
  - **filters** (object): [object Object]
    - **activo** (boolean): true
  - **dependsOn** (object) *opcional*
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **proveedores** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/proveedores"
  - **valueField** (string): "id"
  - **labelField** (string): "title"
  - **searchFields** (object): title
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{title}"
  - **filters** (object): [object Object]
    - **activo** (boolean): true
  - **dependsOn** (object) *opcional*
  - **required** (boolean): false
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **ubicaciones_origen** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/ubicaciones"
  - **valueField** (string): "id"
  - **labelField** (string): "nombre"
  - **searchFields** (object): codigo,nombre,bodega
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{bodega} / {nombre}"
  - **filters** (object): [object Object]
    - **activo** (boolean): true
  - **dependsOn** (string): "planta"
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **ubicaciones_destino** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/ubicaciones"
  - **valueField** (string): "id"
  - **labelField** (string): "nombre"
  - **searchFields** (object): codigo,nombre,bodega
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{bodega} / {nombre}"
  - **filters** (object): [object Object]
    - **activo** (boolean): true
  - **dependsOn** (string): "planta"
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **temporadas** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/temporadas"
  - **valueField** (string): "id"
  - **labelField** (string): "title"
  - **searchFields** (object): title
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{title}"
  - **filters** (object): [object Object]
    - **activo** (boolean): true
  - **dependsOn** (object) *opcional*
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **tipos_movimiento** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/tipos-movimiento"
  - **valueField** (string): "id"
  - **labelField** (string): "nombre"
  - **searchFields** (object): codigo,nombre,descripcion
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{nombre}"
  - **filters** (object): [object Object]
    - **activo** (boolean): true
  - **dependsOn** (object) *opcional*
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **plantas** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/plantas"
  - **valueField** (string): "codigo"
  - **labelField** (string): "nombre"
  - **searchFields** (object): codigo,nombre
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{nombre}"
  - **filters** (object): [object Object]
  - **dependsOn** (object) *opcional*
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true


#### Ejemplo de Uso

```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/TRAZABILIDAD/configuracion',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/TRAZABILIDAD/configuracion"
```

---


### GET /TRAZABILIDAD/proveedores/opciones

Obtiene opciones disponibles para el campo proveedores en trazabilidad

#### Parámetros

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|----------|
| limite | string | Número máximo de resultados a retornar | 3 |
| busqueda | string | Término de búsqueda para filtrar resultados | A |

#### Respuesta Exitosa (200)

```json
{
  "exito": true,
  "mensaje": "Opciones para proveedores obtenidas exitosamente",
  "datos": [
    {
      "value": 47,
      "label": "AGENCIA DE REPRESENTACIONES LTDA",
      "data": {
        "id": 47,
        "title": "AGENCIA DE REPRESENTACIONES LTDA",
        "activo": true
      }
    },
    {
      "value": 48,
      "label": "AGROFRESH CHILE COMERCIAL LIMITADA",
      "data": {
        "id": 48,
        "title": "AGROFRESH CHILE COMERCIAL LIMITADA",
        "activo": true
      }
    },
    {
      "value": 28,
      "label": "AGROINDUSTRIAL Y COMERCIAL SUPERFRUIT LIMITADA",
      "data": {
        "id": 28,
        "title": "AGROINDUSTRIAL Y COMERCIAL SUPERFRUIT LIMITADA",
        "activo": true
      }
    }
  ],
  "total": 3
}
```

#### Estructura del Schema

- **Array** de elementos:
  - **value** (number): 47
  - **label** (string): "AGENCIA DE REPRESENTACIONES LTDA"
  - **data** (object): [object Object]
    - **id** (number): 47
    - **title** (string): "AGENCIA DE REPRESENTACIONES LTDA"
    - **activo** (boolean): true


#### Ejemplo de Uso

```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/TRAZABILIDAD/proveedores/opciones',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/TRAZABILIDAD/proveedores/opciones"
```

---


### GET /TRAZABILIDAD/proveedores/opciones-paginadas

API para /TRAZABILIDAD/proveedores/opciones-paginadas

#### Parámetros

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|----------|
| pagina | string | Número de página para paginación | 1 |
| tamanoPagina | string | Cantidad de elementos por página | 3 |

#### Respuesta Exitosa (200)

```json
{
  "exito": true,
  "mensaje": "Opciones paginadas para proveedores obtenidas exitosamente",
  "datos": {
    "opciones": [],
    "paginacion": {
      "pagina": 1,
      "tamanoPagina": 3,
      "total": 0,
      "totalPaginas": 0,
      "hayMas": false
    }
  }
}
```

#### Estructura del Schema

- **opciones** (object): 
  - **Array** de elementos:
- **paginacion** (object): [object Object]
  - **pagina** (number): 1
  - **tamanoPagina** (number): 3
  - **total** (number): 0
  - **totalPaginas** (number): 0
  - **hayMas** (boolean): false


#### Ejemplo de Uso

```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/TRAZABILIDAD/proveedores/opciones-paginadas',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/TRAZABILIDAD/proveedores/opciones-paginadas"
```

---


### GET /RECEPCIONES_LOTES/configuracion

Obtiene la configuración completa de campos para formularios de recepciones de lotes

#### Parámetros

Esta API no requiere parámetros.

#### Respuesta Exitosa (200)

```json
{
  "exito": true,
  "mensaje": "Configuración de formulario RECEPCIONES_LOTES obtenida exitosamente",
  "datos": {
    "materiales": {
      "endpoint": "/api/mantenedores/materiales",
      "valueField": "id",
      "labelField": "nombre_material",
      "searchFields": [
        "codigo_ranco",
        "nombre_material",
        "cod_nombre"
      ],
      "displayTemplate": "{codigo_ranco} - {nombre_material}",
      "filters": {
        "activo": true
      },
      "dependsOn": null,
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "proveedores": {
      "endpoint": "/api/mantenedores/proveedores",
      "valueField": "id",
      "labelField": "title",
      "searchFields": [
        "title"
      ],
      "displayTemplate": "{title}",
      "filters": {
        "activo": true
      },
      "dependsOn": null,
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "ubicaciones_destino": {
      "endpoint": "/api/mantenedores/ubicaciones",
      "valueField": "id",
      "labelField": "title",
      "searchFields": [
        "title",
        "bodega_deposito",
        "planta"
      ],
      "displayTemplate": "{bodega_deposito} / {title}",
      "filters": {
        "activo": true
      },
      "dependsOn": null,
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "plantas": {
      "endpoint": "/api/mantenedores/plantas",
      "valueField": "codigo",
      "labelField": "nombre",
      "searchFields": [
        "codigo",
        "nombre"
      ],
      "displayTemplate": "{nombre}",
      "filters": {},
      "dependsOn": null,
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    }
  }
}
```

#### Estructura del Schema

- **materiales** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/materiales"
  - **valueField** (string): "id"
  - **labelField** (string): "nombre_material"
  - **searchFields** (object): codigo_ranco,nombre_material,cod_nombre
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{codigo_ranco} - {nombre_material}"
  - **filters** (object): [object Object]
    - **activo** (boolean): true
  - **dependsOn** (object) *opcional*
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **proveedores** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/proveedores"
  - **valueField** (string): "id"
  - **labelField** (string): "title"
  - **searchFields** (object): title
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{title}"
  - **filters** (object): [object Object]
    - **activo** (boolean): true
  - **dependsOn** (object) *opcional*
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **ubicaciones_destino** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/ubicaciones"
  - **valueField** (string): "id"
  - **labelField** (string): "title"
  - **searchFields** (object): title,bodega_deposito,planta
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{bodega_deposito} / {title}"
  - **filters** (object): [object Object]
    - **activo** (boolean): true
  - **dependsOn** (object) *opcional*
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **plantas** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/plantas"
  - **valueField** (string): "codigo"
  - **labelField** (string): "nombre"
  - **searchFields** (object): codigo,nombre
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{nombre}"
  - **filters** (object): [object Object]
  - **dependsOn** (object) *opcional*
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true


#### Ejemplo de Uso

```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/RECEPCIONES_LOTES/configuracion',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/RECEPCIONES_LOTES/configuracion"
```

---


### GET /RECEPCIONES_LOTES/ubicaciones_destino/opciones

API para /RECEPCIONES_LOTES/ubicaciones_destino/opciones

#### Parámetros

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|----------|
| limite | string | Número máximo de resultados a retornar | 3 |
| busqueda | string | Término de búsqueda para filtrar resultados | A |

#### Respuesta Exitosa (200)

```json
{
  "exito": true,
  "mensaje": "Opciones para ubicaciones_destino obtenidas exitosamente",
  "datos": [
    {
      "value": 10,
      "label": " / ",
      "data": {
        "id": 10,
        "codigo": "Bodega A",
        "nombre": "Bodega A",
        "bodega": "Almacén General",
        "planta": "Chimbarongo",
        "activo": true
      }
    },
    {
      "value": 11,
      "label": " / ",
      "data": {
        "id": 11,
        "codigo": "Bodega B",
        "nombre": "Bodega B",
        "bodega": "Almacén General",
        "planta": "Chimbarongo",
        "activo": true
      }
    },
    {
      "value": 30,
      "label": " / ",
      "data": {
        "id": 30,
        "codigo": "ALTILLO",
        "nombre": "ALTILLO",
        "bodega": "ALTILLO",
        "planta": "Chimbarongo",
        "activo": true
      }
    }
  ],
  "total": 3
}
```

#### Estructura del Schema

- **Array** de elementos:
  - **value** (number): 10
  - **label** (string): " / "
  - **data** (object): [object Object]
    - **id** (number): 10
    - **codigo** (string): "Bodega A"
    - **nombre** (string): "Bodega A"
    - **bodega** (string): "Almacén General"
    - **planta** (string): "Chimbarongo"
    - **activo** (boolean): true


#### Ejemplo de Uso

```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/RECEPCIONES_LOTES/ubicaciones_destino/opciones',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/RECEPCIONES_LOTES/ubicaciones_destino/opciones"
```

---


### GET /RECEPCIONES_LOTES/ubicaciones_destino/opciones-paginadas

API para /RECEPCIONES_LOTES/ubicaciones_destino/opciones-paginadas

#### Parámetros

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|----------|
| pagina | string | Número de página para paginación | 1 |
| tamanoPagina | string | Cantidad de elementos por página | 3 |

#### Respuesta Exitosa (200)

```json
{
  "exito": true,
  "mensaje": "Opciones paginadas para ubicaciones_destino obtenidas exitosamente",
  "datos": {
    "opciones": [],
    "paginacion": {
      "pagina": 1,
      "tamanoPagina": 3,
      "total": 0,
      "totalPaginas": 0,
      "hayMas": false
    }
  }
}
```

#### Estructura del Schema

- **opciones** (object): 
  - **Array** de elementos:
- **paginacion** (object): [object Object]
  - **pagina** (number): 1
  - **tamanoPagina** (number): 3
  - **total** (number): 0
  - **totalPaginas** (number): 0
  - **hayMas** (boolean): false


#### Ejemplo de Uso

```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/RECEPCIONES_LOTES/ubicaciones_destino/opciones-paginadas',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/RECEPCIONES_LOTES/ubicaciones_destino/opciones-paginadas"
```

---


### GET /INVENTARIO/buscar-multiples

API para /INVENTARIO/buscar-multiples

#### Parámetros

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|----------|
| campos | string | Lista de campos separados por coma | materiales,plantas |
| limite | string | Número máximo de resultados a retornar | 2 |

#### Respuesta Exitosa (200)

```json
{
  "exito": true,
  "mensaje": "Búsqueda múltiple completada para formulario INVENTARIO",
  "datos": {
    "materiales": {
      "opciones": [
        {
          "value": 862,
          "label": "CTAB1209 - ABSORPAD 10 KG  UNILAMINAR MICROPERFORADO 360 x 56",
          "data": {
            "id": 862,
            "codigo_ranco": "CTAB1209",
            "nombre_material": "ABSORPAD 10 KG  UNILAMINAR MICROPERFORADO 360 x 56",
            "unidad_medida": null,
            "clasificacion": null,
            "frio": "No",
            "cod_nombre": "CTAB1209 ABSORPAD 10 KG  UNILAMINAR MICROPERFORADO 360 x 56",
            "activo": true
          }
        },
        {
          "value": 863,
          "label": "CTAB1208 - ABSORPAD 10 KG 36 X 46 MM BILAMINAR",
          "data": {
            "id": 863,
            "codigo_ranco": "CTAB1208",
            "nombre_material": "ABSORPAD 10 KG 36 X 46 MM BILAMINAR",
            "unidad_medida": null,
            "clasificacion": null,
            "frio": "No",
            "cod_nombre": "CTAB1208 ABSORPAD 10 KG 36 X 46 MM BILAMINAR",
            "activo": true
          }
        }
      ],
      "error": null
    },
    "plantas": {
      "opciones": [],
      "error": null
    }
  }
}
```

#### Estructura del Schema

- **materiales** (object): [object Object]
  - **opciones** (object): [object Object],[object Object]
    - **Array** de elementos:
      - **value** (number): 862
      - **label** (string): "CTAB1209 - ABSORPAD 10 KG  UNILAMINAR MICROPERFORADO 360 x 56"
      - **data** (object): [object Object]
        - **id** (number): 862
        - **codigo_ranco** (string): "CTAB1209"
        - **nombre_material** (string): "ABSORPAD 10 KG  UNILAMINAR MICROPERFORADO 360 x 56"
        - **unidad_medida** (object) *opcional*
        - **clasificacion** (object) *opcional*
        - **frio** (string): "No"
        - **cod_nombre** (string): "CTAB1209 ABSORPAD 10 KG  UNILAMINAR MICROPERFORADO 360 x 56"
        - **activo** (boolean): true
  - **error** (object) *opcional*
- **plantas** (object): [object Object]
  - **opciones** (object): 
    - **Array** de elementos:
  - **error** (object) *opcional*


#### Ejemplo de Uso

```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/INVENTARIO/buscar-multiples',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/INVENTARIO/buscar-multiples"
```

---


### GET /INVENTARIO/materiales/validar/1

API para /INVENTARIO/materiales/validar/1

#### Parámetros

Esta API no requiere parámetros.

#### Respuesta Exitosa (200)

```json
{
  "exito": true,
  "mensaje": "Valor 1 es válido para materiales",
  "datos": {
    "valido": true,
    "valor": {
      "value": 1,
      "label": " - ",
      "data": {
        "id": 1,
        "codigo": "BOGR2062",
        "nombre": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
        "cod_nombre": "BOGR2062  BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
        "activo": true
      }
    }
  }
}
```

#### Estructura del Schema

- **valido** (boolean): true
- **valor** (object): [object Object]
  - **value** (number): 1
  - **label** (string): " - "
  - **data** (object): [object Object]
    - **id** (number): 1
    - **codigo** (string): "BOGR2062"
    - **nombre** (string): "BOLSA CE 2,5KG VF FLEX REGINA GENERICA"
    - **cod_nombre** (string): "BOGR2062  BOLSA CE 2,5KG VF FLEX REGINA GENERICA"
    - **activo** (boolean): true


#### Ejemplo de Uso

```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/INVENTARIO/materiales/validar/1',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/INVENTARIO/materiales/validar/1"
```

---


### GET /INVENTARIO/unidades_medida/opciones

API para /INVENTARIO/unidades_medida/opciones

#### Parámetros

Esta API no requiere parámetros.

#### Respuesta Exitosa (200)

```json
{
  "exito": true,
  "mensaje": "Opciones para unidades_medida obtenidas exitosamente",
  "datos": [],
  "total": 0
}
```

#### Estructura del Schema

- **Array** de elementos:


#### Ejemplo de Uso

```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/INVENTARIO/unidades_medida/opciones',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/INVENTARIO/unidades_medida/opciones"
```

---


### GET /INVENTARIO/certificaciones_caa/opciones

API para /INVENTARIO/certificaciones_caa/opciones

#### Parámetros

Esta API no requiere parámetros.

#### Respuesta Exitosa (200)

```json
{
  "exito": true,
  "mensaje": "Opciones para certificaciones_caa obtenidas exitosamente",
  "datos": [],
  "total": 0
}
```

#### Estructura del Schema

- **Array** de elementos:


#### Ejemplo de Uso

```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/INVENTARIO/certificaciones_caa/opciones',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/INVENTARIO/certificaciones_caa/opciones"
```

---


### GET /INVENTARIO/condiciones_armado/opciones

API para /INVENTARIO/condiciones_armado/opciones

#### Parámetros

Esta API no requiere parámetros.

#### Respuesta Exitosa (200)

```json
{
  "exito": true,
  "mensaje": "Opciones para condiciones_armado obtenidas exitosamente",
  "datos": [
    {
      "value": "ARMADO",
      "label": "Armado",
      "data": {
        "value": "ARMADO",
        "label": "Armado",
        "title": "Material Armado"
      }
    },
    {
      "value": "SUELTO",
      "label": "Suelto",
      "data": {
        "value": "SUELTO",
        "label": "Suelto",
        "title": "Material Suelto"
      }
    },
    {
      "value": "MIXTO",
      "label": "Mixto",
      "data": {
        "value": "MIXTO",
        "label": "Mixto",
        "title": "Material Mixto"
      }
    }
  ],
  "total": 3
}
```

#### Estructura del Schema

- **Array** de elementos:
  - **value** (string): "ARMADO"
  - **label** (string): "Armado"
  - **data** (object): [object Object]
    - **value** (string): "ARMADO"
    - **label** (string): "Armado"
    - **title** (string): "Material Armado"


#### Ejemplo de Uso

```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/INVENTARIO/condiciones_armado/opciones',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/INVENTARIO/condiciones_armado/opciones"
```

---


### GET /OPERACIONES_FRIO_DESPACHO/configuracion

API para /OPERACIONES_FRIO_DESPACHO/configuracion

#### Parámetros

Esta API no requiere parámetros.

#### Respuesta Exitosa (200)

```json
{
  "exito": true,
  "mensaje": "Configuración de formulario OPERACIONES_FRIO_DESPACHO obtenida exitosamente",
  "datos": {
    "materiales": {
      "endpoint": "/api/mantenedores/materiales",
      "valueField": "id",
      "labelField": "nombre",
      "searchFields": [
        "codigo",
        "nombre",
        "cod_nombre"
      ],
      "displayTemplate": "{codigo} - {nombre}",
      "filters": {
        "activo": true,
        "requiere_frio": true
      },
      "dependsOn": null,
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "ubicaciones_origen": {
      "endpoint": "/api/mantenedores/ubicaciones",
      "valueField": "id",
      "labelField": "nombre",
      "searchFields": [
        "codigo",
        "nombre",
        "bodega"
      ],
      "displayTemplate": "{bodega} / {nombre}",
      "filters": {
        "activo": true
      },
      "dependsOn": "planta",
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "ubicaciones_destino": {
      "endpoint": "/api/mantenedores/ubicaciones",
      "valueField": "id",
      "labelField": "nombre",
      "searchFields": [
        "codigo",
        "nombre",
        "bodega"
      ],
      "displayTemplate": "{bodega} / {nombre}",
      "filters": {
        "activo": true
      },
      "dependsOn": "planta",
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "tipos_operacion": {
      "endpoint": "/api/mantenedores/tipos-operacion",
      "valueField": "value",
      "labelField": "label",
      "searchFields": [
        "value",
        "label"
      ],
      "displayTemplate": "{label}",
      "filters": {},
      "dependsOn": null,
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "turnos": {
      "endpoint": "/api/mantenedores/turnos",
      "valueField": "value",
      "labelField": "label",
      "searchFields": [
        "value",
        "label"
      ],
      "displayTemplate": "{label}",
      "filters": {},
      "dependsOn": null,
      "required": false,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "plantas": {
      "endpoint": "/api/mantenedores/plantas",
      "valueField": "codigo",
      "labelField": "nombre",
      "searchFields": [
        "codigo",
        "nombre"
      ],
      "displayTemplate": "{nombre}",
      "filters": {},
      "dependsOn": null,
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    }
  }
}
```

#### Estructura del Schema

- **materiales** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/materiales"
  - **valueField** (string): "id"
  - **labelField** (string): "nombre"
  - **searchFields** (object): codigo,nombre,cod_nombre
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{codigo} - {nombre}"
  - **filters** (object): [object Object]
    - **activo** (boolean): true
    - **requiere_frio** (boolean): true
  - **dependsOn** (object) *opcional*
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **ubicaciones_origen** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/ubicaciones"
  - **valueField** (string): "id"
  - **labelField** (string): "nombre"
  - **searchFields** (object): codigo,nombre,bodega
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{bodega} / {nombre}"
  - **filters** (object): [object Object]
    - **activo** (boolean): true
  - **dependsOn** (string): "planta"
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **ubicaciones_destino** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/ubicaciones"
  - **valueField** (string): "id"
  - **labelField** (string): "nombre"
  - **searchFields** (object): codigo,nombre,bodega
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{bodega} / {nombre}"
  - **filters** (object): [object Object]
    - **activo** (boolean): true
  - **dependsOn** (string): "planta"
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **tipos_operacion** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/tipos-operacion"
  - **valueField** (string): "value"
  - **labelField** (string): "label"
  - **searchFields** (object): value,label
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{label}"
  - **filters** (object): [object Object]
  - **dependsOn** (object) *opcional*
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **turnos** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/turnos"
  - **valueField** (string): "value"
  - **labelField** (string): "label"
  - **searchFields** (object): value,label
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{label}"
  - **filters** (object): [object Object]
  - **dependsOn** (object) *opcional*
  - **required** (boolean): false
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **plantas** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/plantas"
  - **valueField** (string): "codigo"
  - **labelField** (string): "nombre"
  - **searchFields** (object): codigo,nombre
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{nombre}"
  - **filters** (object): [object Object]
  - **dependsOn** (object) *opcional*
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true


#### Ejemplo de Uso

```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/OPERACIONES_FRIO_DESPACHO/configuracion',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/OPERACIONES_FRIO_DESPACHO/configuracion"
```

---


### GET /OPERACIONES_FRIO_DESPACHO/materiales/validar/1

API para /OPERACIONES_FRIO_DESPACHO/materiales/validar/1

#### Parámetros

Esta API no requiere parámetros.

#### Respuesta Exitosa (200)

```json
{
  "exito": true,
  "mensaje": "Valor 1 es válido para materiales",
  "datos": {
    "valido": true,
    "valor": {
      "value": 1,
      "label": "BOGR2062 - BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
      "data": {
        "id": 1,
        "codigo": "BOGR2062",
        "nombre": "BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
        "cod_nombre": "BOGR2062  BOLSA CE 2,5KG VF FLEX REGINA GENERICA",
        "activo": true
      }
    }
  }
}
```

#### Estructura del Schema

- **valido** (boolean): true
- **valor** (object): [object Object]
  - **value** (number): 1
  - **label** (string): "BOGR2062 - BOLSA CE 2,5KG VF FLEX REGINA GENERICA"
  - **data** (object): [object Object]
    - **id** (number): 1
    - **codigo** (string): "BOGR2062"
    - **nombre** (string): "BOLSA CE 2,5KG VF FLEX REGINA GENERICA"
    - **cod_nombre** (string): "BOGR2062  BOLSA CE 2,5KG VF FLEX REGINA GENERICA"
    - **activo** (boolean): true


#### Ejemplo de Uso

```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/OPERACIONES_FRIO_DESPACHO/materiales/validar/1',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/OPERACIONES_FRIO_DESPACHO/materiales/validar/1"
```

---


### GET /STOCK_UBICACIONES/configuracion

API para /STOCK_UBICACIONES/configuracion

#### Parámetros

Esta API no requiere parámetros.

#### Respuesta Exitosa (200)

```json
{
  "exito": true,
  "mensaje": "Configuración de formulario STOCK_UBICACIONES obtenida exitosamente",
  "datos": {
    "materiales": {
      "endpoint": "/api/mantenedores/materiales",
      "valueField": "id",
      "labelField": "nombre",
      "searchFields": [
        "codigo",
        "nombre",
        "cod_nombre"
      ],
      "displayTemplate": "{codigo} - {nombre}",
      "filters": {
        "activo": true
      },
      "dependsOn": null,
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "ubicaciones": {
      "endpoint": "/api/mantenedores/ubicaciones",
      "valueField": "id",
      "labelField": "nombre",
      "searchFields": [
        "codigo",
        "nombre",
        "bodega"
      ],
      "displayTemplate": "{bodega} / {nombre}",
      "filters": {
        "activo": true
      },
      "dependsOn": "planta",
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "plantas": {
      "endpoint": "/api/mantenedores/plantas",
      "valueField": "codigo",
      "labelField": "nombre",
      "searchFields": [
        "codigo",
        "nombre"
      ],
      "displayTemplate": "{nombre}",
      "filters": {},
      "dependsOn": null,
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    }
  }
}
```

#### Estructura del Schema

- **materiales** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/materiales"
  - **valueField** (string): "id"
  - **labelField** (string): "nombre"
  - **searchFields** (object): codigo,nombre,cod_nombre
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{codigo} - {nombre}"
  - **filters** (object): [object Object]
    - **activo** (boolean): true
  - **dependsOn** (object) *opcional*
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **ubicaciones** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/ubicaciones"
  - **valueField** (string): "id"
  - **labelField** (string): "nombre"
  - **searchFields** (object): codigo,nombre,bodega
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{bodega} / {nombre}"
  - **filters** (object): [object Object]
    - **activo** (boolean): true
  - **dependsOn** (string): "planta"
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **plantas** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/plantas"
  - **valueField** (string): "codigo"
  - **labelField** (string): "nombre"
  - **searchFields** (object): codigo,nombre
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{nombre}"
  - **filters** (object): [object Object]
  - **dependsOn** (object) *opcional*
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true


#### Ejemplo de Uso

```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/STOCK_UBICACIONES/configuracion',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/STOCK_UBICACIONES/configuracion"
```

---


### GET /TARJAS/configuracion

API para /TARJAS/configuracion

#### Parámetros

Esta API no requiere parámetros.

#### Respuesta Exitosa (200)

```json
{
  "exito": true,
  "mensaje": "Configuración de formulario TARJAS obtenida exitosamente",
  "datos": {
    "materiales": {
      "endpoint": "/api/mantenedores/materiales",
      "valueField": "id",
      "labelField": "nombre",
      "searchFields": [
        "codigo",
        "nombre",
        "cod_nombre"
      ],
      "displayTemplate": "{codigo} - {nombre}",
      "filters": {
        "activo": true
      },
      "dependsOn": null,
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "proveedores": {
      "endpoint": "/api/mantenedores/proveedores",
      "valueField": "id",
      "labelField": "nombre",
      "searchFields": [
        "codigo",
        "nombre"
      ],
      "displayTemplate": "{codigo} - {nombre}",
      "filters": {
        "activo": true
      },
      "dependsOn": null,
      "required": false,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "tipos_tarja": {
      "endpoint": "/api/mantenedores/tipos-tarja",
      "valueField": "value",
      "labelField": "label",
      "searchFields": [
        "value",
        "label"
      ],
      "displayTemplate": "{label}",
      "filters": {},
      "dependsOn": null,
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "estados_tarja": {
      "endpoint": "/api/mantenedores/estados-tarja",
      "valueField": "value",
      "labelField": "label",
      "searchFields": [
        "value",
        "label"
      ],
      "displayTemplate": "{label}",
      "filters": {},
      "dependsOn": null,
      "required": false,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    },
    "plantas": {
      "endpoint": "/api/mantenedores/plantas",
      "valueField": "codigo",
      "labelField": "nombre",
      "searchFields": [
        "codigo",
        "nombre"
      ],
      "displayTemplate": "{nombre}",
      "filters": {},
      "dependsOn": null,
      "required": true,
      "hasStaticData": false,
      "isDynamic": true,
      "searchable": true,
      "hasTemplate": true
    }
  }
}
```

#### Estructura del Schema

- **materiales** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/materiales"
  - **valueField** (string): "id"
  - **labelField** (string): "nombre"
  - **searchFields** (object): codigo,nombre,cod_nombre
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{codigo} - {nombre}"
  - **filters** (object): [object Object]
    - **activo** (boolean): true
  - **dependsOn** (object) *opcional*
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **proveedores** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/proveedores"
  - **valueField** (string): "id"
  - **labelField** (string): "nombre"
  - **searchFields** (object): codigo,nombre
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{codigo} - {nombre}"
  - **filters** (object): [object Object]
    - **activo** (boolean): true
  - **dependsOn** (object) *opcional*
  - **required** (boolean): false
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **tipos_tarja** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/tipos-tarja"
  - **valueField** (string): "value"
  - **labelField** (string): "label"
  - **searchFields** (object): value,label
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{label}"
  - **filters** (object): [object Object]
  - **dependsOn** (object) *opcional*
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **estados_tarja** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/estados-tarja"
  - **valueField** (string): "value"
  - **labelField** (string): "label"
  - **searchFields** (object): value,label
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{label}"
  - **filters** (object): [object Object]
  - **dependsOn** (object) *opcional*
  - **required** (boolean): false
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true
- **plantas** (object): [object Object]
  - **endpoint** (string): "/api/mantenedores/plantas"
  - **valueField** (string): "codigo"
  - **labelField** (string): "nombre"
  - **searchFields** (object): codigo,nombre
    - **Array** de elementos:
      - Tipo: string
  - **displayTemplate** (string): "{nombre}"
  - **filters** (object): [object Object]
  - **dependsOn** (object) *opcional*
  - **required** (boolean): true
  - **hasStaticData** (boolean): false
  - **isDynamic** (boolean): true
  - **searchable** (boolean): true
  - **hasTemplate** (boolean): true


#### Ejemplo de Uso

```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/TARJAS/configuracion',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/TARJAS/configuracion"
```

---


### GET /TARJAS/proveedores/opciones

API para /TARJAS/proveedores/opciones

#### Parámetros

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|----------|
| limite | string | Número máximo de resultados a retornar | 5 |
| busqueda | string | Término de búsqueda para filtrar resultados | test |

#### Respuesta Exitosa (200)

```json
{
  "exito": true,
  "mensaje": "Opciones para proveedores obtenidas exitosamente",
  "datos": [
    {
      "value": 47,
      "label": " - ",
      "data": {
        "id": 47,
        "title": "AGENCIA DE REPRESENTACIONES LTDA",
        "activo": true
      }
    },
    {
      "value": 48,
      "label": " - ",
      "data": {
        "id": 48,
        "title": "AGROFRESH CHILE COMERCIAL LIMITADA",
        "activo": true
      }
    },
    {
      "value": 28,
      "label": " - ",
      "data": {
        "id": 28,
        "title": "AGROINDUSTRIAL Y COMERCIAL SUPERFRUIT LIMITADA",
        "activo": true
      }
    }
  ],
  "total": 3
}
```

#### Estructura del Schema

- **Array** de elementos:
  - **value** (number): 47
  - **label** (string): " - "
  - **data** (object): [object Object]
    - **id** (number): 47
    - **title** (string): "AGENCIA DE REPRESENTACIONES LTDA"
    - **activo** (boolean): true


#### Ejemplo de Uso

```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/TARJAS/proveedores/opciones',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/TARJAS/proveedores/opciones"
```

---


## Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| 400 | Solicitud incorrecta - Parámetros inválidos |
| 401 | No autorizado - Token inválido o faltante |
| 404 | No encontrado - Recurso no existe |
| 500 | Error interno del servidor |

## Formularios Disponibles

Los siguientes formularios están disponibles en el sistema:

- **INVENTARIO**: Gestión de inventario
- **TRAZABILIDAD**: Seguimiento de productos
- **RECEPCIONES_LOTES**: Recepción de lotes
- **OPERACIONES_FRIO_DESPACHO**: Operaciones de frío y despacho
- **STOCK_UBICACIONES**: Control de stock por ubicación
- **TARJAS**: Gestión de tarjas

## Campos Comunes

Los siguientes tipos de campos están disponibles en múltiples formularios:

- **materiales**: Lista de materiales del sistema
- **proveedores**: Lista de proveedores
- **ubicaciones**: Ubicaciones de almacenamiento
- **plantas**: Plantas de procesamiento

## Notas Técnicas

- Todas las respuestas incluyen un campo `exito` que indica el estado de la operación
- Los datos principales están en el campo `datos` de la respuesta
- La paginación se maneja automáticamente cuando hay muchos resultados
- Las búsquedas son case-insensitive
- Los filtros se pueden combinar para obtener resultados más específicos

---

*Documentación generada automáticamente por el sistema de pruebas*
