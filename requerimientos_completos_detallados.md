# Sistema de Trazabilidad Ranco Cherries - Requerimientos Completos y Detalle de Funcionamiento

## Basado en Manual de Uso y Mantención v1.1 - Proyecto Trazabilidad

### Información del Proyecto

- **Cliente**: Ranco Cherries (Exportadora Rancagua S.A.)
- **Aplicación**: Bodega y Patio WMS - Trazabilidad de Materiales
- **Versión Manual**: 1.1 (22-11-2024)
- **Objetivo**: Simplificar el seguimiento de materiales en distintas etapas de la cadena de suministro

---

## 1. ARQUITECTURA Y STACK TECNOLÓGICO

### 1.1 Stack Recomendado

- **Base de Datos**: PostgreSQL 14+
- **Backend**: Node.js 18+ con Express.js
- **Frontend**: JavaScript (ES6+), HTML5, CSS3, Bootstrap 5
- **ORM**: Sequelize
- **Autenticación**: JWT
- **Escáner QR**: QuaggaJS o similar
- **Generación PDF**: jsPDF o Puppeteer

### 1.2 Principios de Desarrollo

- Nomenclatura completamente en español
- Código limpio y legible
- Evitar complejidad innecesaria
- Arquitectura simple y mantenible
- Separación clara de responsabilidades
- Código reutilizable

---

## 2. ESTRUCTURA DE DATOS (Basada en el Manual)

### 2.1 Tabla Principal: trazabilidad_materiales_r9

**Descripción**: Lista principal que registra todos los movimientos de materiales
**Campos según PDF**:

- tipo_movimiento (Despacho, Recepción Interna, Ingreso proveedor, etc.)
- planta (Rancagua - Chimbarongo)
- guia_sii
- fecha (formato: 22/10/2024)
- mes
- id_movimiento (identificador único del movimiento)
- proveedor
- lote
- title (código del material)
- nombre (del material)
- cod_nombre (Unión entre código del material y su nombre)
- clasificacion (Kit, Normal, Armado, Guagua, Por armar)
- total_pallet
- cantidad
- unidad_medida (Unidad, Litros, Rollo, etc.)
- bod_origen (Bodega de origen)
- bod_destino (Bodega de destino)
- ubicacion_origen
- ubicacion_destino
- turno (Turno 1 – Turno 2)
- temporada (R9 2024-2025)
- observacion
- bodega_stock (Bodega dónde se agrega o resta stock)
- ubicacion_stock (Ubicación dónde se agrega o resta stock)
- total_stock (Total agregado o restado de cierto stock)
- numero_embarque (Opcional, solo en pantalla Frio y Despacho)
- patente_camion (Opcional, solo en pantalla Frio y Despacho)

### 2.2 Tabla: materiales

**Campos según PDF**:

- codigo_ranco (Código del material: "BOGR2062")
- nombre_material (BOLSA CE 2,5KG VF FLEX REGINA GENERICA)
- clasificacion (Kit, Normal, Armado, Guagua, Por armar)
- unidad_medida (Unidad, Litros, Rollo, etc.)
- frio (Indica si el material se utiliza en Frio: Si – No)
- cod_nombre

### 2.3 Tabla: ubicacion

**Campos según PDF**:

- title (Ubicación: Altillo Packing, Carpa 1, Carpa 2, etc.)
- bodega_deposito (Chimbarongo, Centro Armado, Ranco, etc.)
- planta (Rancagua - Chimbarongo)

### 2.4 Tablas de Inventario

**inventario_rancagua** e **inventario_chimbarongo**:

- title (código del material)
- nombre_material
- unidad_medida (Unidad, Litros, Rollo, etc.)
- cod_nombre
- fecha_inventario
- pallets
- stock
- bodega
- ubicacion
- lote
- condicion_armado

### 2.5 Tablas de Configuración

**temporadas_app**:

- title (R8 2023-2024, R9 2024-2025, etc.)

**tipo_movimientos_app**:

- title (Recepción, Despacho, Consumo, etc.)

**proveedores**:

- title (nombre del proveedor)
- ingreso_proveedores_100
- total_general

---

## 3. MÓDULOS DETALLADOS (Según Manual PDF)

### 3.1 MÓDULO: BIENVENIDA

#### 3.1.1 Objetivo

Seleccionar planta de trabajo

#### 3.1.2 Funcionalidades

**Acción 1: Seleccionar planta de trabajo**

- **Paso 1.1**: Visualizar la planta a la que perteneces
- **Paso 1.2**: Presionar "Rancagua" o "Chimbarongo" para comenzar el registro de movimientos en la planta seleccionada

#### 3.1.3 Componentes de UI

- **Título**: "Bienvenido a Trazabilidad Ranco Cherries"
- **Botón Rancagua**: Selecciona planta Rancagua
- **Botón Chimbarongo**: Selecciona planta Chimbarongo
- **Indicador de usuario**: Muestra usuario actual

#### 3.1.4 Lógica de Negocio

```javascript
function seleccionarPlanta(plantaSeleccionada) {
    // Validar planta disponible
    if (!['Rancagua', 'Chimbarongo'].includes(plantaSeleccionada)) {
        throw new Error('Planta no válida');
    }

    // Crear/actualizar sesión de usuario
    const sesion = {
        usuario_id: usuarioActual.id,
        planta_seleccionada: plantaSeleccionada,
        fecha_inicio: new Date(),
        activa: true
    };

    // Guardar en base de datos
    await guardarSesion(sesion);

    // Redirigir a menú principal
    window.location.href = '/menu-principal';
}
```

#### 3.1.5 Validaciones

- Usuario debe estar autenticado
- Planta seleccionada debe ser válida
- Solo una sesión activa por usuario

---

### 3.2 MÓDULO: MENÚ PRINCIPAL

#### 3.2.1 Objetivo

Módulo principal donde se encuentran los accesos a los distintos módulos de la aplicación

#### 3.2.2 Funcionalidades

**Acción 2: Navegar dentro de los módulos disponibles**

- **Paso 2.1**: Presionar "Tutorial" para navegar al módulo
- **Paso 2.2**: Presionar "Inventario"
- **Paso 2.3**: Presionar "Prueba SCAN"
- **Paso 2.4**: Presionar "Trazabilidad"
- **Paso 2.5**: Presionar "Recepción Lotes"
- **Paso 2.6**: Presionar "Frío y Despacho"

#### 3.2.3 Componentes de UI

- **Header**: Muestra planta seleccionada y usuario
- **Botón Tutorial**: Acceso a tutorial
- **Botón Inventario**: Acceso a módulo inventario
- **Botón Prueba SCAN**: Acceso a prueba de escáner
- **Botón Trazabilidad**: Acceso a módulo trazabilidad
- **Botón Recepción Lotes**: Acceso a recepción de lotes
- **Botón Frío y Despacho**: Acceso a frío y despacho
- **Botón Tarjas**: Acceso a impresión de tarjas

#### 3.2.4 Lógica de Negocio

```javascript
function navegarAModulo(modulo) {
  // Validar sesión activa
  if (!sesionActiva()) {
    window.location.href = "/bienvenida";
    return;
  }

  // Validar permisos de usuario para el módulo
  if (!tienePermiso(usuarioActual, modulo)) {
    mostrarError("No tiene permisos para acceder a este módulo");
    return;
  }

  // Navegar al módulo
  window.location.href = `/${modulo}`;
}
```

---

### 3.3 MÓDULO: INVENTARIO

#### 3.3.1 Objetivo

Registrar inventario de los materiales seleccionados

#### 3.3.2 Funcionalidades

**Acción 1: Registrar inventario**

- **Paso 1.1**: Llenar campos indicados
- **Paso 1.2**: Revisar la información del nuevo registro añadido en la galería
- **Paso 1.3**: Llenar el campo "Contado por"
- **Paso 1.4**: Presionar el botón "Guardar"

#### 3.3.3 Componentes de UI

- **Formulario de Inventario**:
  - Campo: Código Material (title) - codigo desde materiales
  - Campo: Nombre Material (autocompletado) - nombre desde materiales
  - Campo: Fecha Inventario (date picker)
  - Campo: Stock (numérico)
  - Campo: Pallets (numérico)
  - Campo: Bodega (dropdown) - bodega desde ubicacion
  - Campo: Ubicación (dropdown) - ubicacion desde ubicacion
  - Campo: Lote (texto)
  - Campo: Condición de Armado (dropdown) - condicion_armado desde materiales
  - Campo: Contado por (texto, requerido)
- **Galería**: Muestra registros añadidos
- **Botón Guardar**: Confirma y guarda inventario

#### 3.3.4 Lógica de Negocio

```javascript
function registrarInventario(datosInventario) {
    // Validar campos requeridos
    const camposRequeridos = ['title', 'fecha_inventario', 'stock', 'bodega', 'ubicacion', 'contado_por'];
    validarCamposRequeridos(datosInventario, camposRequeridos);

    // Determinar tabla según planta
    const tablaInventario = plantaActual === 'Rancagua' ? 'inventario_rancagua' : 'inventario_chimbarongo';

    // Obtener información del material
    const material = await obtenerMaterial(datosInventario.title);
    if (!material) {
        throw new Error('Material no encontrado');
    }

    // Preparar datos para guardar
    const registroInventario = {
        ...datosInventario,
        nombre_material: material.nombre_material,
        unidad_medida: material.unidad_medida,
        cod_nombre: material.cod_nombre,
        fecha_creacion: new Date()
    };

    // Guardar en base de datos
    await guardarEnTabla(tablaInventario, registroInventario);

    // Actualizar galería
    actualizarGaleriaInventario();
}
```

#### 3.3.5 Validaciones

- Código de material debe existir en tabla materiales
- Stock debe ser numérico y mayor a 0
- Fecha inventario no puede ser futura
- Campo "Contado por" es obligatorio
- Bodega y ubicación deben existir para la planta actual

---

### 3.4 MÓDULO: TRAZABILIDAD

#### 3.4.1 Objetivo

Generar distintos movimientos de materiales que permitan llevar la trazabilidad de ellos por distintos sectores

#### 3.4.2 Funcionalidades

**Acción 1: Agregar movimientos**

- **Paso 1.1**: Llenar campos indicados en el encabezado
- **Paso 1.2**: Llenar campos sobre el material
- **Paso 1.3**: Presionar agregar una vez se esté seguro de los datos
- **Paso 1.4**: En caso de querer ver el resumen de los movimientos generados, presionar "Ver resumen"

**Acción 2: Guardar movimientos**

- **Paso 2.1**: Una vez dentro de la pantalla "Resumen Trazabilidad", verificar datos encabezado y movimientos generados en la galería
- **Paso 2.2**: Cuando el usuario termine de ingresar movimientos, presionar el botón guardar y seguir los pasos indicados en los mensajes para guardar la información

#### 3.4.3 Componentes de UI

**Sección Encabezado**:

- Campo: Tipo de Movimiento (dropdown)
- Campo: Planta (readonly, basado en sesión)
- Campo: Guía SII (texto)
- Campo: Fecha (date picker)
- Campo: Proveedor (dropdown)
- Campo: Turno (dropdown: Turno 1, Turno 2)
- Campo: Temporada (dropdown)

**Sección Material**:

- Campo: Código Material (title)
- Campo: Nombre Material (autocompletado)
- Campo: Lote (texto)
- Campo: Cantidad (numérico)
- Campo: Unidad de Medida (readonly)
- Campo: Clasificación (readonly)
- Campo: Bodega Origen (dropdown)
- Campo: Bodega Destino (dropdown)
- Campo: Ubicación Origen (dropdown)
- Campo: Ubicación Destino (dropdown)
- Campo: Observación (textarea)

**Controles**:

- Botón: Agregar Material
- Botón: Ver Resumen
- Galería: Movimientos agregados
- Botón: Guardar Movimientos

#### 3.4.4 Lógica de Negocio

```javascript
function agregarMovimiento(datosEncabezado, datosMaterial) {
    // Validar campos requeridos del encabezado
    const camposEncabezado = ['tipo_movimiento', 'planta', 'fecha'];
    validarCamposRequeridos(datosEncabezado, camposEncabezado);

    // Validar campos requeridos del material
    const camposMaterial = ['title', 'cantidad'];
    validarCamposRequeridos(datosMaterial, camposMaterial);

    // Obtener información del material
    const material = await obtenerMaterial(datosMaterial.title);
    if (!material) {
        throw new Error('Material no encontrado');
    }

    // Generar ID único del movimiento
    const idMovimiento = generarIdMovimiento();

    // Calcular stock según tipo de movimiento
    const totalStock = calcularStock(datosEncabezado.tipo_movimiento, datosMaterial.cantidad);

    // Preparar registro completo
    const movimiento = {
        ...datosEncabezado,
        ...datosMaterial,
        id_movimiento: idMovimiento,
        nombre: material.nombre_material,
        cod_nombre: material.cod_nombre,
        clasificacion: material.clasificacion,
        unidad_medida: material.unidad_medida,
        mes: obtenerMes(datosEncabezado.fecha),
        total_stock: totalStock,
        bodega_stock: determinarBodegaStock(datosEncabezado.tipo_movimiento, datosMaterial),
        ubicacion_stock: determinarUbicacionStock(datosEncabezado.tipo_movimiento, datosMaterial),
        fecha_creacion: new Date()
    };

    // Agregar a lista temporal
    movimientosTemporales.push(movimiento);

    // Actualizar galería
    actualizarGaleriaMovimientos();
}

function calcularStock(tipoMovimiento, cantidad) {
    const tiposPositivos = ['Recepción', 'Recepción Interna', 'Ingreso proveedor'];
    const tiposNegativos = ['Despacho', 'Consumo', 'Frío y Despacho'];

    if (tiposPositivos.includes(tipoMovimiento)) {
        return cantidad;
    } else if (tiposNegativos.includes(tipoMovimiento)) {
        return -cantidad;
    }
    return 0;
}

function guardarMovimientos() {
    if (movimientosTemporales.length === 0) {
        throw new Error('No hay movimientos para guardar');
    }

    // Validar todos los movimientos
    movimientosTemporales.forEach(movimiento => {
        validarMovimientoCompleto(movimiento);
    });

    // Guardar en base de datos usando transacción
    await database.transaction(async (t) => {
        for (const movimiento of movimientosTemporales) {
            await trazabilidad_materiales_r9.create(movimiento, { transaction: t });
        }
    });

    // Limpiar lista temporal
    movimientosTemporales = [];

    // Mostrar confirmación
    mostrarMensaje('Movimientos guardados exitosamente');
}
```

#### 3.4.5 Validaciones

- Tipo de movimiento debe existir en tipo_movimientos_app
- Fecha no puede ser futura
- Cantidad debe ser numérica y mayor a 0
- Bodegas y ubicaciones deben existir para la planta
- Material debe existir en tabla materiales
- Proveedor debe existir si el tipo de movimiento lo requiere

---

### 3.5 MÓDULO: RECEPCIÓN LOTES

#### 3.5.1 Objetivo

Agilizar la recepción interna de materiales

#### 3.5.2 Funcionalidades

**Acción 1: Generar recepciones de materiales**

- **Paso 1.1**: Llenar campos correspondientes
- **Paso 1.2**: Escanear código QR
- **Paso 1.3**: Verificar materiales en galería
- **Paso 1.4**: Añadir materiales

**Acción 2: Guardar recepciones generadas**

- **Paso 2.1**: Presionar "Ver resumen"
- **Paso 2.2**: En la pantalla "Resumen recepción lotes" el usuario podrá visualizar los materiales agregados

#### 3.5.3 Componentes de UI

- **Escáner QR**: Componente para escanear códigos
- **Campos de Recepción**:
  - Campo: Proveedor (dropdown)
  - Campo: Guía SII (texto)
  - Campo: Fecha (date picker)
  - Campo: Lote (texto)
  - Campo: Cantidad (numérico)
  - Campo: Bodega Destino (dropdown)
  - Campo: Ubicación Destino (dropdown)
- **Botón**: Escanear QR
- **Botón**: Añadir Material
- **Galería**: Materiales añadidos
- **Botón**: Ver Resumen
- **Pantalla Resumen**: Lista de materiales para confirmar

#### 3.5.4 Lógica de Negocio

```javascript
function escanearCodigoQR(codigoEscaneado) {
    // Validar formato del código
    if (!validarFormatoQR(codigoEscaneado)) {
        throw new Error('Código QR no válido');
    }

    // Buscar material por código
    const material = await obtenerMaterial(codigoEscaneado);
    if (!material) {
        throw new Error('Material no encontrado');
    }

    // Autocompletar campos
    document.getElementById('codigo_material').value = material.codigo_ranco;
    document.getElementById('nombre_material').value = material.nombre_material;
    document.getElementById('unidad_medida').value = material.unidad_medida;
    document.getElementById('clasificacion').value = material.clasificacion;
}

function añadirMaterialRecepcion(datosRecepcion) {
    // Validar campos requeridos
    const camposRequeridos = ['proveedor', 'guia_sii', 'fecha', 'title', 'cantidad', 'lote'];
    validarCamposRequeridos(datosRecepcion, camposRequeridos);

    // Crear movimiento de recepción
    const movimientoRecepcion = {
        tipo_movimiento: 'Recepción Interna',
        planta: plantaActual,
        ...datosRecepcion,
        turno: obtenerTurnoActual(),
        temporada: obtenerTemporadaActiva(),
        id_movimiento: generarIdMovimiento(),
        fecha_creacion: new Date()
    };

    // Agregar a lista temporal
    recepcionesTemporales.push(movimientoRecepcion);

    // Actualizar galería
    actualizarGaleriaRecepciones();
}

function guardarRecepciones() {
    if (recepcionesTemporales.length === 0) {
        throw new Error('No hay recepciones para guardar');
    }

    // Guardar como movimientos de trazabilidad
    await database.transaction(async (t) => {
        for (const recepcion of recepcionesTemporales) {
            await trazabilidad_materiales_r9.create(recepcion, { transaction: t });
        }
    });

    // Limpiar lista temporal
    recepcionesTemporales = [];

    mostrarMensaje('Recepciones guardadas exitosamente');
}
```

#### 3.5.5 Validaciones

- Código QR debe ser válido y existir en materiales
- Proveedor debe existir en tabla proveedores
- Cantidad debe ser numérica y mayor a 0
- Fecha no puede ser futura
- Bodega y ubicación destino deben existir

---

### 3.6 MÓDULO: FRÍO Y DESPACHO

#### 3.6.1 Objetivo

Mantener trazabilidad de materiales a consumir en el sector Frío y Despacho

#### 3.6.2 Funcionalidades

**Acción 1: Consumir materiales**

- **Paso 1.1**: Llenar campos indicados
- **Paso 1.2**: Una vez los campos estén con los datos correctos, presionar agregar
- **Paso 1.3**: Al agregar el material a consumir, se puede verificar el registro en la galería
- **Paso 1.4**: En caso de querer agregar más materiales, seguir pasos indicados anteriormente
- **Paso 1.5**: Una vez se agregaron todos los materiales deseados, presionar guardar para confirmar la acción y subir la información

#### 3.6.3 Componentes de UI

- **Campos Específicos de Frío y Despacho**:
  - Campo: Código Material (title)
  - Campo: Nombre Material (autocompletado)
  - Campo: Cantidad (numérico)
  - Campo: Lote (texto)
  - Campo: Bodega Origen (dropdown)
  - Campo: Ubicación Origen (dropdown)
  - Campo: Número Embarque (texto, opcional)
  - Campo: Patente Camión (texto, opcional)
  - Campo: Fecha (date picker)
  - Campo: Turno (dropdown)
- **Botón**: Agregar Material
- **Galería**: Materiales agregados
- **Botón**: Guardar

#### 3.6.4 Lógica de Negocio

```javascript
function agregarMaterialFrioDespacho(datosFrio) {
    // Validar campos requeridos
    const camposRequeridos = ['title', 'cantidad', 'bodega_origen', 'ubicacion_origen'];
    validarCamposRequeridos(datosFrio, camposRequeridos);

    // Validar que el material sea apto para frío
    const material = await obtenerMaterial(datosFrio.title);
    if (!material) {
        throw new Error('Material no encontrado');
    }

    if (material.frio !== 'Si') {
        mostrarAdvertencia('Este material no está marcado como apto para frío');
    }

    // Crear movimiento de frío y despacho
    const movimientoFrio = {
        tipo_movimiento: 'Frío y Despacho',
        planta: plantaActual,
        fecha: datosFrio.fecha || new Date(),
        title: datosFrio.title,
        nombre: material.nombre_material,
        cod_nombre: material.cod_nombre,
        clasificacion: material.clasificacion,
        cantidad: datosFrio.cantidad,
        unidad_medida: material.unidad_medida,
        lote: datosFrio.lote,
        bod_origen: datosFrio.bodega_origen,
        ubicacion_origen: datosFrio.ubicacion_origen,
        turno: datosFrio.turno,
        temporada: obtenerTemporadaActiva(),
        numero_embarque: datosFrio.numero_embarque, // Campo específico de frío
        patente_camion: datosFrio.patente_camion,   // Campo específico de frío
        total_stock: -datosFrio.cantidad, // Negativo porque es consumo
        bodega_stock: datosFrio.bodega_origen,
        ubicacion_stock: datosFrio.ubicacion_origen,
        id_movimiento: generarIdMovimiento(),
        fecha_creacion: new Date()
    };

    // Agregar a lista temporal
    frioDespachoTemporales.push(movimientoFrio);

    // Actualizar galería
    actualizarGaleriaFrioDespacho();
}

function guardarMovimientosFrioDespacho() {
    if (frioDespachoTemporales.length === 0) {
        throw new Error('No hay movimientos para guardar');
    }

    // Guardar en trazabilidad_materiales_r9
    await database.transaction(async (t) => {
        for (const movimiento of frioDespachoTemporales) {
            await trazabilidad_materiales_r9.create(movimiento, { transaction: t });
        }
    });

    // Limpiar lista temporal
    frioDespachoTemporales = [];

    mostrarMensaje('Movimientos de Frío y Despacho guardados exitosamente');
}
```

#### 3.6.5 Validaciones

- Material debe existir y preferiblemente estar marcado para frío
- Cantidad debe ser numérica y mayor a 0
- Bodega y ubicación origen deben existir
- Número de embarque debe ser único si se proporciona
- Patente de camión debe tener formato válido si se proporciona

---

### 3.7 MÓDULO: TARJAS CAA

#### 3.7.1 Objetivo

Imprimir tarjas CAA

#### 3.7.2 Funcionalidades

**Acción 2: Consumir materiales** (según PDF)

- **Paso 2.1**: Indicar descripción de la tarja
- **Paso 2.2**: Seleccionar los materiales correspondientes
- **Paso 2.3**: Indicar: Lote, Cantidad, N° y Fecha
- **Paso 2.4**: Presionar ícono de impresora
- **Paso 2.5**: Verificar datos antes de imprimir

#### 3.7.3 Componentes de UI

- **Campo**: Descripción de la Tarja (textarea)
- **Selector**: Materiales (multi-select)
- **Campos por Material**:
  - Campo: Lote (texto)
  - Campo: Cantidad (numérico)
  - Campo: Número (texto)
  - Campo: Fecha (date picker)
- **Botón**: Ícono de Impresora
- **Modal**: Vista previa de la tarja
- **Botón**: Confirmar Impresión

#### 3.7.4 Lógica de Negocio

```javascript
function generarTarjaCAA(datosTarja) {
    // Validar campos requeridos
    const camposRequeridos = ['descripcion', 'materiales'];
    validarCamposRequeridos(datosTarja, camposRequeridos);

    // Validar que cada material tenga los datos requeridos
    datosTarja.materiales.forEach(material => {
        const camposMaterial = ['codigo', 'lote', 'cantidad', 'numero', 'fecha'];
        validarCamposRequeridos(material, camposMaterial);
    });

    // Generar estructura de la tarja
    const tarjaCAA = {
        id: generarIdTarja(),
        tipo: 'CAA',
        descripcion: datosTarja.descripcion,
        fecha_generacion: new Date(),
        planta: plantaActual,
        usuario: usuarioActual.nombre,
        materiales: datosTarja.materiales.map(material => ({
            ...material,
            nombre_material: obtenerNombreMaterial(material.codigo),
            unidad_medida: obtenerUnidadMedida(material.codigo)
        }))
    };

    // Generar PDF
    const pdfTarja = await generarPDFTarja(tarjaCAA);

    // Guardar registro de la tarja
    await guardarRegistroTarja(tarjaCAA);

    return pdfTarja;
}

function generarPDFTarja(datosCompletos) {
    // Usar jsPDF o similar para generar el PDF
    const doc = new jsPDF();

    // Header de la tarja
    doc.setFontSize(16);
    doc.text('TARJA CAA - RANCO CHERRIES', 20, 20);
    doc.setFontSize(12);
    doc.text(`Planta: ${datosCompletos.planta}`, 20, 35);
    doc.text(`Fecha: ${formatearFecha(datosCompletos.fecha_generacion)}`, 20, 45);
    doc.text(`Usuario: ${datosCompletos.usuario}`, 20, 55);

    // Descripción
    doc.text(`Descripción: ${datosCompletos.descripcion}`, 20, 70);

    // Tabla de materiales
    let yPosition = 90;
    doc.text('MATERIALES:', 20, yPosition);
    yPosition += 15;

    // Headers de tabla
    doc.text('Código', 20, yPosition);
    doc.text('Material', 60, yPosition);
    doc.text('Lote', 120, yPosition);
    doc.text('Cantidad', 150, yPosition);
    doc.text('N°', 180, yPosition);
    yPosition += 10;

    // Datos de materiales
    datosCompletos.materiales.forEach(material => {
        doc.text(material.codigo, 20, yPosition);
        doc.text(material.nombre_material.substring(0, 25), 60, yPosition);
        doc.text(material.lote, 120, yPosition);
        doc.text(material.cantidad.toString(), 150, yPosition);
        doc.text(material.numero, 180, yPosition);
        yPosition += 10;
    });

    return doc;
}
```

#### 3.7.5 Validaciones

- Descripción de tarja es obligatoria
- Debe seleccionar al menos un material
- Cada material debe tener lote, cantidad, número y fecha
- Cantidad debe ser numérica y mayor a 0
- Fecha no puede ser futura

---

### 3.8 MÓDULO: TARJAS BODEGA

#### 3.8.1 Objetivo

Imprimir tarjas bodega

#### 3.8.2 Funcionalidades

**Acción 3: Consumir materiales** (según PDF)

- **Paso 3.1**: Indicar descripción de la tarja
- **Paso 3.2**: Seleccionar los materiales correspondientes
- **Paso 3.3**: Indicar: Proveedor, Guía, Lote, Cantidad, N° y Fecha
- **Paso 3.4**: Presionar ícono de impresora
- **Paso 3.5**: Verificar datos antes de imprimir

#### 3.8.3 Componentes de UI

- **Campo**: Descripción de la Tarja (textarea)
- **Selector**: Materiales (multi-select)
- **Campos por Material**:
  - Campo: Proveedor (dropdown)
  - Campo: Guía (texto)
  - Campo: Lote (texto)
  - Campo: Cantidad (numérico)
  - Campo: Número (texto)
  - Campo: Fecha (date picker)
- **Botón**: Ícono de Impresora
- **Modal**: Vista previa de la tarja
- **Botón**: Confirmar Impresión

#### 3.8.4 Lógica de Negocio

```javascript
function generarTarjaBodega(datosTarja) {
    // Validar campos requeridos
    const camposRequeridos = ['descripcion', 'materiales'];
    validarCamposRequeridos(datosTarja, camposRequeridos);

    // Validar que cada material tenga los datos requeridos para bodega
    datosTarja.materiales.forEach(material => {
        const camposMaterial = ['codigo', 'proveedor', 'guia', 'lote', 'cantidad', 'numero', 'fecha'];
        validarCamposRequeridos(material, camposMaterial);
    });

    // Generar estructura de la tarja bodega
    const tarjaBodega = {
        id: generarIdTarja(),
        tipo: 'BODEGA',
        descripcion: datosTarja.descripcion,
        fecha_generacion: new Date(),
        planta: plantaActual,
        usuario: usuarioActual.nombre,
        materiales: datosTarja.materiales.map(material => ({
            ...material,
            nombre_material: obtenerNombreMaterial(material.codigo),
            unidad_medida: obtenerUnidadMedida(material.codigo),
            nombre_proveedor: obtenerNombreProveedor(material.proveedor)
        }))
    };

    // Generar PDF específico para bodega
    const pdfTarja = await generarPDFTarjaBodega(tarjaBodega);

    // Guardar registro de la tarja
    await guardarRegistroTarja(tarjaBodega);

    return pdfTarja;
}

function generarPDFTarjaBodega(datosCompletos) {
    const doc = new jsPDF();

    // Header de la tarja bodega
    doc.setFontSize(16);
    doc.text('TARJA BODEGA - RANCO CHERRIES', 20, 20);
    doc.setFontSize(12);
    doc.text(`Planta: ${datosCompletos.planta}`, 20, 35);
    doc.text(`Fecha: ${formatearFecha(datosCompletos.fecha_generacion)}`, 20, 45);
    doc.text(`Usuario: ${datosCompletos.usuario}`, 20, 55);

    // Descripción
    doc.text(`Descripción: ${datosCompletos.descripcion}`, 20, 70);

    // Tabla de materiales con campos específicos de bodega
    let yPosition = 90;
    doc.text('MATERIALES:', 20, yPosition);
    yPosition += 15;

    // Headers de tabla (más campos que CAA)
    doc.setFontSize(10);
    doc.text('Código', 10, yPosition);
    doc.text('Material', 40, yPosition);
    doc.text('Proveedor', 80, yPosition);
    doc.text('Guía', 110, yPosition);
    doc.text('Lote', 130, yPosition);
    doc.text('Cant.', 150, yPosition);
    doc.text('N°', 170, yPosition);
    doc.text('Fecha', 185, yPosition);
    yPosition += 10;

    // Datos de materiales
    datosCompletos.materiales.forEach(material => {
        doc.text(material.codigo, 10, yPosition);
        doc.text(material.nombre_material.substring(0, 15), 40, yPosition);
        doc.text(material.nombre_proveedor.substring(0, 12), 80, yPosition);
        doc.text(material.guia, 110, yPosition);
        doc.text(material.lote, 130, yPosition);
        doc.text(material.cantidad.toString(), 150, yPosition);
        doc.text(material.numero, 170, yPosition);
        doc.text(formatearFecha(material.fecha), 185, yPosition);
        yPosition += 8;
    });

    return doc;
}
```

#### 3.8.5 Validaciones

- Descripción de tarja es obligatoria
- Debe seleccionar al menos un material
- Cada material debe tener proveedor, guía, lote, cantidad, número y fecha
- Proveedor debe existir en tabla proveedores
- Cantidad debe ser numérica y mayor a 0
- Fecha no puede ser futura
- Guía debe tener formato válido

---

## 4. FUNCIONALIDADES TÉCNICAS TRANSVERSALES

### 4.1 Escáner QR

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

### 4.2 Validaciones Generales

```javascript
function validarCamposRequeridos(datos, camposRequeridos) {
  const camposFaltantes = camposRequeridos.filter((campo) => !datos[campo]);
  if (camposFaltantes.length > 0) {
    throw new Error(
      `Campos requeridos faltantes: ${camposFaltantes.join(", ")}`
    );
  }
}

function validarFormatoFecha(fecha) {
  const fechaObj = new Date(fecha);
  return fechaObj instanceof Date && !isNaN(fechaObj);
}

function validarCantidadNumerica(cantidad) {
  return !isNaN(cantidad) && parseFloat(cantidad) > 0;
}
```

### 4.3 Utilidades de Datos

```javascript
function generarIdMovimiento() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `MOV-${timestamp}-${random}`;
}

function obtenerMes(fecha) {
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return meses[new Date(fecha).getMonth()];
}

function obtenerTurnoActual() {
  const hora = new Date().getHours();
  return hora < 14 ? "Turno 1" : "Turno 2";
}

function obtenerTemporadaActiva() {
  // Obtener de configuración o calcular basado en fecha
  return "R9 2024-2025";
}
```

---

## 5. APIS Y ENDPOINTS

### 5.1 Autenticación y Sesión

```
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/verificar-sesion
POST /api/sesion/seleccionar-planta
GET /api/sesion/planta-actual
```

### 5.2 Configuración

```
GET /api/plantas
GET /api/temporadas
GET /api/tipos-movimiento
GET /api/proveedores
GET /api/ubicaciones/:planta
```

### 5.3 Materiales

```
GET /api/materiales
GET /api/materiales/:codigo
GET /api/materiales/buscar/:termino
POST /api/materiales/validar-qr
```

### 5.4 Inventario

```
GET /api/inventario/:planta
POST /api/inventario/:planta
GET /api/inventario/:planta/fecha/:fecha
PUT /api/inventario/:planta/:id
```

### 5.5 Trazabilidad

```
GET /api/trazabilidad
POST /api/trazabilidad/movimiento
POST /api/trazabilidad/guardar-lote
GET /api/trazabilidad/resumen
GET /api/trazabilidad/por-lote/:lote
```

### 5.6 Recepción Lotes

```
POST /api/recepcion-lotes/agregar
POST /api/recepcion-lotes/guardar
GET /api/recepcion-lotes/resumen
```

### 5.7 Frío y Despacho

```
POST /api/frio-despacho/agregar
POST /api/frio-despacho/guardar
GET /api/frio-despacho/embarques
```

### 5.8 Tarjas

```
POST /api/tarjas/caa/generar
POST /api/tarjas/bodega/generar
GET /api/tarjas/:id/pdf
GET /api/tarjas/historial
```

---

## 6. CONSIDERACIONES DE IMPLEMENTACIÓN

### 6.1 Seguridad

- Autenticación JWT
- Validación de permisos por planta
- Sanitización de inputs
- Logs de auditoría

### 6.2 Performance

- Índices en campos de búsqueda frecuente
- Paginación en listados
- Cache para datos de configuración
- Optimización de consultas

### 6.3 Usabilidad

- Interfaz responsive
- Autocompletado en campos de material
- Validaciones en tiempo real
- Mensajes de error claros

### 6.4 Mantenibilidad

- Código documentado en español
- Separación clara de responsabilidades
- Funciones reutilizables
- Configuración centralizada

---

## CONCLUSIÓN

Este documento detalla completamente todos los requerimientos, lógica y funcionamiento de cada módulo basado exactamente en el Manual PDF v1.1. La implementación debe seguir estos lineamientos para asegurar compatibilidad total con las especificaciones originales del sistema PowerApps de Ranco Cherries.

**Puntos Clave**:

- Nomenclatura completamente en español
- Respeto total a los flujos del manual
- Campos exactos según especificaciones PDF
- Lógica de negocio específica para cada módulo
- Validaciones apropiadas para cada caso de uso
- Funcionalidades técnicas requeridas (QR, PDF, etc.)
