// --------------------------
// ---- Tolerancias de nomenclatura para las tablas que se asocian con la info del DB
// --------------------------

export const EQUIPOS_TABLE = "equipo_principales";
export const MATERIALES_TABLE = "materiales_electricos";
export const PROJECTS_TABLE = "proyectos";
export const ZONE_TABLE = "zonas";
export const PROJECTS_EQUIPOS_TABLE = "join_proyecto_equipos";
export const PROJECTS_MATERIALES_TABLE = "join_proyecto_materiales";
export const SUPPLIER_TABLE = "proveedores";
export const BRAND_TABLE = "marcas";
export const TYPE_TABLE = "tipo";
export const QUOTE_TABLE = "cotizacion";
export const REPORT_TABLE = "reporte";
export const FINANTIAL_TABLE = "finanzas";

// --------------------------
// ---- Tolerancias de nomenclatura para el atributo de fuente de divisas
// --------------------------

export const CURRENCY_COLUMN_CANDIDATES = [
    "priceInputCurrency",
    "price_input_currency",
    "fuente_divisas",
    "fuente_divisa",
    "currency_source",
    "moneda",
] as const;