export const EQUIPOS_HEADERS = [
    "Acciones",
    // eventos
    "Fecha creada",
    "Fecha actualizada",
    // propiedades generales
    "COD PROV",
    "PROVEEDOR",
    "COD PRODUCTO",
    "TIPO DE PRODUCTO",
    "MARCA",
    "DESCRIPCIÓN",
    "UNIDAD",
    // propieades eléctricas
    "PANELES POR PALET",
    "TIPO DE CONEXIÓN",
    "POTENCIA MÁXIMA",
    "# DE MPPT",
    "# DE CADENAS",
    "POTENCIA AC",
    "DoD",
    "VMPP/VMIN",
    "VOC/VMAX",
    "V NOMINAL INVERSOR",
    "IMPP/I IN",
    "ISC/I OUT",
    // precios
    // "UNIDAD",
    "Tasa de cambio",
    "PRECIO S/",
    "PRECIO $",
    "IGV",
    "PRECIO + IGV S/",
    "PRECIO + IGV $",
    // // eventos
    // "Fecha creada",
    // "Fecha actualizada",
];

export const MATERIALES_HEADERS = [
    "Acciones",
    // eventos
    "Fecha creada",
    "Fecha actualizada",
    // propiedades generales
    "COD PROV",
    "PROVEEDOR",
    "COD PRODUCTO",
    "TIPO DE PRODUCTO",
    "MARCA",
    "DESCRIPCIÓN",
    // propiedades eléctricas
    "PARTE ELÉCTRICA",
    // precios
    "UNIDAD",
    "Tasa de cambio",
    "PRECIO S/",
    "PRECIO $",
    "IGV",
    "PRECIO + IGV S/",
    "PRECIO + IGV $",
    // // eventos
    // "Fecha creada",
    // "Fecha actualizada",
];

export const TABLE_HEADERS_SUPPLIER = [
    "Nombre del proveedor",
    "Código del proveedor",
    "RUC",
    "Nombre del contacto",
    "Teléfono",
    "Categoría",
    "Acciones",
]

export const TABLE_HEADERS_BRAND = [
    "Nombre de la marca",
    "Categoría",
    "Proveedores asociados",
    "Acciones",
]

export const TABLE_HEADERS_TYPE = [
    "Nombre del tipo de producto",
    "Categoría",
    "Marcas asociadas",
    "Acciones",
]

/////////////

export const TABLE_HEADERS_PROJECT = [
    "Acciones",
    "Fecha creada",
    "Fecha actualizada",
    "Nombre del proyecto",
    "Versión del dimensionamiento",
    // "Descripción del proyecto",
    "Zona seleccionada",
    "Orientación del panel",
    "Tipo de instalación",
    "Configuración eléctrica",
    "Demanda eléctrica mensual",
    "Demanda eléctrica anual",
    "Equipos principales seleccionados",
    "Materiales eléctricos seleccionados",
    "Enlace del proyecto",
    "Estado del proyecto",
]

export const TABLE_HEADERS_ZONE = [
    "Nombre de la zona",
    "Latitud",
    "Longitud",
    "GTI Anual (Inclinado)",
    "GTI Diario (Inclinado)",
    "GHI Anual (Coplanar)",
    "GHI Diario (Coplanar)",
    "HSP (Peor mes)",
    "Acciones",
    // eventos
    "Fecha creada",
    "Fecha actualizada",
]

/////////////

export const TABLE_HEADERS_QUOTE = [
    "Acciones",
    "Creado",
    "Actualizado",
    "Código de cotización",
    "Proyecto asociado",
    "Versión de cotización",
    "IGV",
    "Tasa de cambio",
    "Precio de venta ($)",
    "Gross Margin",
    "Depreciación por herramientas",
]

export const TABLE_HEADERS_REPORT = [
    "Acciones",
    "Creado",
    "Actualizado",
    "Cotización asociada",
    "Proyecto asociado",
    "Nombre del cliente",
    "RUC del cliente",
    "Lugar de atención",
    "Encargado de atención",
    "(%) Eq y Mat",
    "(%) Instalación",
    "Precio de cotización",
    // "Generar PDF"
]

export const TABLE_HEADERS_FINANTIAL = [
    "Acciones",
    "Creado",
    "Actualizado",
    "Cotización asociada",
    "Proyecto asociado",
    "Energía de la planta",
    "Generación 1er año",
    "Tarifa red ($)",
    "Degradación 1° año (%)",
    "Degradación 2° año (%)",
    "Incremento tarifa (%)",
    "Tasa descuento (%)",
    "Tiempo de recuperación",
    "LCOE",
]