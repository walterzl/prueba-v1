# Documentación APIs de Campos Anidados - Resumen

*Generado automáticamente el 20-08-2025 a las 12:32:38 a. m.*

## Resumen Ejecutivo

Esta documentación proporciona un resumen conciso de las APIs principales del sistema de campos anidados del WMS Ranco Cherries.

### Estadísticas

- **APIs documentadas**: 32
- **Llamadas realizadas**: 32
- **Tasa de éxito**: 78.1%

## Autenticación Requerida

```javascript
POST /api/auth/login
{
  "usuario": "admin",
  "password": "1234567"
}
```

## APIs Principales Documentadas


### GET /INVENTARIO/configuracion

Obtiene la configuración completa de campos para formularios de inventario

**Ejemplo:**
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

**Ejemplo:**
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

Obtiene opciones paginadas para el campo materiales en inventario

**Ejemplo:**
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

**Ejemplo:**
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


### GET /TRAZABILIDAD/materiales/opciones

API para /TRAZABILIDAD/materiales/opciones

**Ejemplo:**
```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/TRAZABILIDAD/materiales/opciones',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/TRAZABILIDAD/materiales/opciones"
```

---


### GET /TRAZABILIDAD/materiales/opciones-paginadas

API para /TRAZABILIDAD/materiales/opciones-paginadas

**Ejemplo:**
```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/TRAZABILIDAD/materiales/opciones-paginadas',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/TRAZABILIDAD/materiales/opciones-paginadas"
```

---


### GET /TRAZABILIDAD/proveedores/opciones

Obtiene opciones disponibles para el campo proveedores en trazabilidad

**Ejemplo:**
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

**Ejemplo:**
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

**Ejemplo:**
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


### GET /RECEPCIONES_LOTES/materiales/opciones

API para /RECEPCIONES_LOTES/materiales/opciones

**Ejemplo:**
```javascript
// JavaScript/Axios
const respuesta = await axios({
  method: 'GET',
  url: 'http://localhost:3001/api/campos-anidados/RECEPCIONES_LOTES/materiales/opciones',
  headers: {
    'Authorization': 'Bearer {token}'
  }
});

// cURL
curl -X GET \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3001/api/campos-anidados/RECEPCIONES_LOTES/materiales/opciones"
```

---


## Formularios Disponibles

- **INVENTARIO**: Gestión de inventario
- **TRAZABILIDAD**: Seguimiento de productos  
- **RECEPCIONES_LOTES**: Recepción de lotes
- **OPERACIONES_FRIO_DESPACHO**: Operaciones de frío y despacho
- **STOCK_UBICACIONES**: Control de stock por ubicación
- **TARJAS**: Gestión de tarjas

---

*Para documentación completa, ejecutar: `node scripts/test-campos-anidados.js`*
