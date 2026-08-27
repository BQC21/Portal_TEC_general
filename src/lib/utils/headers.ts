export const EQUIPOS_HEADERS = [
    // propiedades generales
    "COD PROV",
    "PROVEEDOR",
    "COD PRODUCTO",
    "TIPO DE PRODUCTO",
    "MARCA",
    "DESCRIPCIÓN",
    "UNIDAD",
    // propieades eléctricas
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
    "PRECIO S/",
    "PRECIO $",
    "IGV",
    "PRECIO + IGV S/",
    "PRECIO + IGV $",
    // eventos
    "Acciones",
];

export const MATERIALES_HEADERS = [
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
    "PRECIO S/",
    "PRECIO $",
    "IGV",
    "PRECIO + IGV S/",
    "PRECIO + IGV $",
    // eventos
    "Acciones",
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
    "Nombre del proyecto",
    // "Descripción del proyecto",
    "Zona seleccionada",
    "Tipo de instalación",
    "Equipos principales seleccionados",
    "Materiales eléctricos seleccionados",
    "Enlace del proyecto",
    "Fecha creada",
    "Fecha actualizada",
    "Estado del proyecto",
    "Acciones",
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
]

/////////////

export const TABLE_HEADERS_QUOTE = [
    "Código de cotización",
    "Proyecto asociado",
    "IGV",
    "Tasa de cambio",
    "Precio de venta ($)",
    "Creado",
    "Actualizado",
    "Acciones",
]

export const TABLE_HEADERS_REPORT = [
    "Cotización asociada",
    "Nombre del cliente",
    "(%) Eq y Mat",
    "(%) Instalación",
    "Precio de cotización",
    "Creado",
    "Actualizado",
    "Acciones",
    "Generar PDF"
]

export const TABLE_HEADERS_FINANTIAL = [
    "Cotización asociada",
    "Tiempo de recuperación",
    "LCOE",
    "Creado",
    "Actualizado",
    "Acciones",
]