export type TypeProperty = {
    etiqueta: string;
    columna: string;
};

// PROPIEDADES

const BATTERY_PROPERTIES: TypeProperty[] = [
    { etiqueta: "TIPO DE CONEXIÓN", columna: "tipo_conexion" },
    { etiqueta: "DOD", columna: "dod" },
    { etiqueta: "VMPP/VMIN", columna: "vmpp_vmin" },
    { etiqueta: "IMPP/I IN", columna: "impp_i_in" },
];

const MODULE_PROPERTIES: TypeProperty[] = [
    { etiqueta: "TIPO DE CONEXIÓN", columna: "tipo_conexion" },
    { etiqueta: "PANELES POR PALET", columna: "paneles_palet" },
    { etiqueta: "POTENCIA MÁXIMA", columna: "potencia_maxima" },
    { etiqueta: "VMPP/VMIN", columna: "vmpp_vmin" },
    { etiqueta: "VOC/VMAX", columna: "voc_vmax" },
    { etiqueta: "IMPP/I IN", columna: "impp_i_in" },
    { etiqueta: "ISC/I OUT", columna: "isc_i_out" },
];

const INVERTER_PROPERTIES: TypeProperty[] = [
    { etiqueta: "TIPO DE CONEXIÓN", columna: "tipo_conexion" },
    { etiqueta: "POTENCIA MÁXIMA", columna: "potencia_maxima" },
    { etiqueta: "# DE MPPT", columna: "mppt" },
    { etiqueta: "# DE CADENAS", columna: "cadenas" },
    { etiqueta: "POTENCIA AC", columna: "potencia_ac" },
    { etiqueta: "VMPP/VMIN", columna: "vmpp_vmin" },
    { etiqueta: "VOC/VMAX", columna: "voc_vmax" },
    { etiqueta: "V NOMINAL INVERSOR", columna: "voltaje_nominal_inversor" },
    { etiqueta: "IMPP/I IN", columna: "impp_i_in" },
    { etiqueta: "ISC/I OUT", columna: "isc_i_out" },
];

const ELECTRICAL_PART_PROPERTY: TypeProperty[] = [
    { etiqueta: "PARTE ELÉCTRICA", columna: "parte_electrica" },
];

// EQUIPOS PRINCIPALES

export const EQUIPOS_DEFAULTS: Record<string, TypeProperty[]> = {
    ACCESORIO: [],
    "VARIADOR DE VELOCIDAD": [],
    "CONTROLADOR DE CARGA": [],
    ELECTROBOMBA: [],
    ESTRUCTURA: [],
    "BATERÍA": BATTERY_PROPERTIES,
    BATERIA: BATTERY_PROPERTIES,
    "MÓDULO FV": MODULE_PROPERTIES,
    "MODULO FV": MODULE_PROPERTIES,
    INVERSOR: INVERTER_PROPERTIES,
};

export const KNOWN_EQUIPO_COLUMNS = new Set([
    "paneles_palet",
    "tipo_conexion",
    "potencia_maxima",
    "mppt",
    "cadenas",
    "potencia_ac",
    "dod",
    "vmpp_vmin",
    "voc_vmax",
    "voltaje_nominal_inversor",
    "impp_i_in",
    "isc_i_out",
    "unidad",
    "parte_electrica",
]);

export const MAPPED_EQUIPO_COLUMNS = new Set([
    "id",
    "cod_prov",
    "proveedor",
    "cod_producto",
    "tipo_de_producto",
    "marca",
    "descripcion",
    "paneles_palet",
    "tipo_de_conexion",
    "tipo_conexion",
    "potencia_maxima",
    "mppt",
    "cadenas",
    "dod",
    "potencia_ac",
    "vmpp_vmin",
    "voc_vmax",
    "voltaje_nominal_inversor",
    "isc_i_out",
    "impp_i_in",
    "unidad",
    "precio_soles",
    "precio_dolares",
    "igv",
    "precio_soles_igv",
    "precio_dolares_igv",
    "priceInputCurrency",
    "created_at",
    "updated_at",
    "tipo_id",
    "tipo_info",
    "tipos",
    "marca_id",
    "marca_info",
    "marcas",
    "proveedor_id",
    "proveedor_info",
    "proveedores",
    "user_uuid",
]);

// Materiales eléctricos

export const MATERIALES_DEFAULTS: Record<string, TypeProperty[]> = {
    CABLE: ELECTRICAL_PART_PROPERTY,
    "CANALIZACIÓN": ELECTRICAL_PART_PROPERTY,
    CANALIZACION: ELECTRICAL_PART_PROPERTY,
    CONSUMIBLE: ELECTRICAL_PART_PROPERTY,
    "PROTECCIÓN": ELECTRICAL_PART_PROPERTY,
    PROTECCION: ELECTRICAL_PART_PROPERTY,
};

export const KNOWN_MATERIAL_COLUMNS = new Set([
    "parte_electrica",
    "unidad",
]);

export const MAPPED_MATERIAL_COLUMNS = new Set([
    "id",
    "cod_prov",
    "proveedor",
    "cod_producto",
    "tipo_de_producto",
    "marca",
    "descripcion",
    "parte_electrica",
    "unidad",
    "precio_soles",
    "precio_dolares",
    "igv",
    "precio_soles_igv",
    "precio_dolares_igv",
    "priceInputCurrency",
    "created_at",
    "updated_at",
    "tipo_id",
    "tipo_info",
    "tipos",
    "marca_id",
    "marca_info",
    "marcas",
    "proveedor_id",
    "proveedor_info",
    "proveedores",
    "user_uuid",
]);