export const EQUIPOS_HEADERS = [
    // propiedades generales
    "COD PROV",
    "PROVEEDOR",
    "COD PRODUCTO",
    "TIPO DE PRODUCTO",
    "MARCA",
    "DESCRIPCIÓN",
    // propieades eléctricas
    "TIPO DE CONEXIÓN",
    "POTENCIA MÁXIMA",
    "# DE MPPT",
    "POTENCIA AC",
    "DoD",
    "VMPP/VMIN",
    "VOC/VMAX",
    "IMPP/I IN",
    "ISC/I OUT",
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
    "Acciones",
]


export const TABLE_HEADERS_TYPE = [
    "Nombre del tipo de producto",
    "Categoría",
    "Acciones",
]
