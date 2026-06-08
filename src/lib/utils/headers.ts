export const TABLE_HEADERS = [
    // propiedades generales
    "COD PROV",
    "PROVEEDOR",
    "COD PRODUCTO",
    "TIPO DE PRODUCTO",
    "MARCA",
    "DESCRIPCIÓN",
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
    // RUC
    "RUC",
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
];

export const TABLE_HEADERS_PROJECT = [
    "Nombre del proyecto",
    "Descripción del proyecto",
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
    "Radiación horizontal (GHI) anual - (kwh/m²/año)",
    "Radiación horizontal (GHI) diaria - (kwh/m²/día)",
    "Radiación inclinada (GTI) anual - (kwh/m²/año)",
    "Radiación inclinada (GTI) diaria - (kwh/m²/día)",
    "Acciones",
]
