// Opciones para el sorting
export const SORTING_OPTIONS = {
    asc: "Ascendente",
    desc: "Descendente",
} as const;

// ----------------------------------------------
// Opciones para el filtrado y los modals (add y edit)
// ----------------------------------------------

export const SUPPLIER_OPTIONS = [
    "Andet S.A.C",
    "Sigelec S.A.C",
    "AutoSolar Energía del Perú S.A.C",
    "Novum Solar S.A.C",
    "Caral Soluciones Energéticas S.A.C",
    "Felicitysolar Peru E.I.R.L",
    "RE & GE Import S.A.C",
    "Grupo Coinp S.A.C",
    "Proyect & Quality S.A.C",
]; // proveedores
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
export const SUPPLIER_CODE_OPTIONS = [
    "ANDE", 
    "SIGE", 
    "AUTO", 
    "NOVU", 
    "CARA", 
    "FELI", 
    "REGE", 
    "COIN", 
    "PROY"
]; // codigo de proveedor
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
    "LIVOLTEK",
    "GOODWE",
    "JA SOLAR",
    "INVT",
    "PYLONTECH",
    "VICTRON",
    "TELPERION",
    "JINKO",
    "SOLIS",
    "SOLUNA",
    "TRINA",
    "FELICITY",
    "SUNTREE",
    "TIBOX",
    "CHINT",
    "INDECO",
    "SCHNEIDER",
    "TENSITE",
    "ABB",
]; // marcas 
export const STATUS_OPTIONS = ["En stock", "En importación", "Descontinuado"] // estados
export const UNIT_OPTIONS = ["Unidad", "Metros"]; // unidades
export const CONNECTION_TYPE_OPTIONS = ["---", "1F 220V", "3F 220V", "3F 380V", "1F", "3F"]; // tipo de conexión 
export const POWER_SOURCE_OPTIONS = ["---", "DC", "AC", "DC/AC", "BAT"]; // fuentes de conexión
export const PRICE_CURRENCY_OPTIONS = ["USD", "PEN"] as const; // fuentes de divisas

// Codigos de definición 
export type CurrencyCode = "PEN" | "USD"; // tipo de cambio
export type ProductSortingOrder = "asc" | "desc" | null; // tipo de ordenamiento
export type FilterKey = "type" | "brand" | "supplier"; // forma de filtrado
