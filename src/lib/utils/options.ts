// Opciones para el sorting
export const SORTING_OPTIONS = {
    asc: "Ascendente",
    desc: "Descendente",
} as const;

// Codigos de definición 
export type CurrencyCode = "PEN" | "USD"; // tipo de cambio
export type FillOptions = "AUTOMÁTICO" | "MANUAL"; // tipo de llenado
export type ProductSortingOrder = "asc" | "desc" | "codigo" | null; // tipo de ordenamiento
export type FilterKey = "type" | "brand" | "supplier"; // forma de filtrado


export const RUC_OPTIONS = [
    "20601248647",
    "20268214527",
    "20602492118",
    "20601873894",
    "20603087675",
    "20611054069",
    "20502234693",
    "20548407991",
    "20611896116",
] // RUC

export const PRODUCT_TYPE_OPTIONS = [
    "Accesorio",
    "Batería",
    "Controlador",
    "Convertidor",
    "Datalogger",
    "Estructura",
    "Inversor",
    "Módulo",
    "Monitor",
    "Rack",
    "Smart Meter",
    "Cable",
    "Protección",
    "MC4",
    "Tablero",
    "CT",
    "Fusible",
    "Portafusible",
]; // tipo de producto

export const BRAND_OPTIONS = [
    "FELICITY",
    "GOODWE",
    "JA SOLAR",
    "JINKO",
    "LIVOLTEK",
    "SOLIS",
    "SOLUNA",
    "TELPERION",
]; // marcas 

export const SUPPLIER_OPTIONS = [
    "Andet S.A.C.",
    "Caral Soluciones Energéticas S.A.C.",
    "Felicitysolar Peru E.I.R.L.",
    "Sigelec S.A.C.",
    "Tienda Solar S.A.C.",
] // proveedores
// ------------------
// ------------------
// MÓDULO 1
// ------------------
// ------------------


// -- equipos principales

export const SUPPLIER_OPTIONS_EQUIPOS = [
    "Andet S.A.C.",
    "Caral Soluciones Energéticas S.A.C.",
    "Felicitysolar Peru E.I.R.L.",
    "Sigelec S.A.C.",
    "Tienda Solar S.A.C.",
] // proveedores

export const SUPPLIER_CODE_OPTIONS_EQUIPOS = [
    "ANDE", 
    "SIGE",
    "CARA",
    "FELI",
    "TISO",
]; // codigo de proveedor

export const BRAND_OPTIONS_EQUIPOS = [
    "FELICITY",
    "GOODWE",
    "JA SOLAR",
    "JINKO",
    "LIVOLTEK",
    "SOLIS",
    "SOLUNA",
    "TELPERION",
]; // marcas 

export const EQUIPOS_TYPE_OPTIONS = [
    "ACCESORIO",
    "BATERÍA",
    "ESTRUCTURA",
    "INVERSOR",
    "MÓDULO FV",
]; // tipo de equipos

// -- materiales eléctricos

export const SUPPLIER_OPTIONS_MATERIALES = [
    "Ferretería Choque",
    "FerroVoz",
    "Grupo Coinp S.A.C.",
    "Inversionas Cavasa S.A.C.",
    "Perú Solar",
    "Project & Quality",
    "Stof Grimme E.I.R.L.",
    "Tienda Solar S.A.C.",
]; // proveedores

export const SUPPLIER_CODE_OPTIONS_MATERIALES = [
    "PESO",
    "STOF",
    "CAVA",
    "PROJ",
    "COIN",
    "CHOQ",
    "FERR",
    "TISO",
]; // codigo de proveedor

export const BRAND_OPTIONS_MATERIALES = [
    "ABB",
    "EBASEE",
    "INDECO",
    "TELPERION",
    "TIBOX",
    "TRINA",
]; // marcas 


export const MATERIALES_TYPE_OPTIONS = [
    "CABLE",
    "PROTECCIÓN",
    "MC4",
    "CANALIZACIÓN",
    "CONSUMIBLE",
]; // tipo de material



// ------------------
// ------------------
// MÓDULO 2
// ------------------
// ------------------

export const STATUS_PROJECT_OPTIONS = [
    "---",
    "Dimensionamiento iniciado",
    "Dimensionamiento en proceso",
    "Dimensionamiento cancelado",
    "Dimensionamiento finalizado"
] // estados de proyecto

export const STATUS_OPTIONS = [
    "En stock", "En importación", "Descontinuado"
] // estados de producto

export const UNIT_OPTIONS = [
    "Unidad", "Metros"
]; // unidades
export const CONNECTION_TYPE_OPTIONS = [
    "---", "1F 220V", "3F 220V", "3F 380V", "1F", "3F"
]; // tipo de conexión 
export const INSTALL_TYPE_OPTIONS = [
    "---", "conexión HÍBRIDA", "conexión ON-GRID", "conexión OFF-GRID"
]; // tipo de instalación 
export const POWER_SOURCE_OPTIONS = [
    "---", "DC", "AC", "DC/AC", "BAT", "MOD"
]; // fuentes de conexión
export const PRICE_CURRENCY_OPTIONS = [
    "USD", "PEN"] as const; // fuentes de divisas
export const FormatFile_OPTIONS = [
    "---", "xlsx", "csv"]; // Formatos de descarga permitidos
export const ANGLE_OPTIONS = [
    "---", "Coplanar", "Inclinado"
] // Ángulos de orientación
export const FILL_OPTIONS = [
    "AUTOMÁTICO", "MANUAL"
]
