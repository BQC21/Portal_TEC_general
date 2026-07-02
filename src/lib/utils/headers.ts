export const TABLE_HEADERS = [
    // propiedades generales
    "COD PROV",
    "PROVEEDOR",
    "COD PRODUCTO",
    "TIPO DE PRODUCTO",
    "MARCA",
    "DESCRIPCIÓN",
    // RUC
    "RUC",
    // propieades bateria
    "Tipo de conexión de la batería",
    "DoD (%)",
    "Amperaje de la batería",
    "Voltaje de la batería",
    // propiedades estructura
    "Nro. paneles por estructura",
    // propiedades inversor
    "Tipo de Conexión del inversor",
    "Potencia DC Máxima del inversor (KW)",
    "Potencia AC por inversor (KW)",
    "Número de MPPT",
    "Corriente de entrada del inversor (A)",
    "Corriente de salida del inversor (A)",
    "Voltaje mínimo del inversor (V)",
    "Voltaje máximo del inversor (V)",
    // propiedades modulo
    "Potencia del módulo fotovoltaico",
    "VOC (V)",
    "VMPP (V)",
    "ISC (A)",
    "IMPP (A)",
    "Área por módulo",
    // propieades smart meter
    "Tipo de conexión del smart meter",
    // propiedades de cableado (cable, protección, mc4)
    "Fuente eléctrica",
    // precios
    "UNIDAD",
    "PRECIO S/",
    "PRECIO $",
    "IGV",
    "PRECIO + IGV S/",
    "PRECIO + IGV $",
    // fechas
    "Fecha creada",
    "Fecha actualizada",
    // estados
    "Estado del equipo",
    "Fecha estimada de importación",
    // eventos
    "Acciones",
];

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
