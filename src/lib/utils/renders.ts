import { getProductTypeCode, getSupplierInfo } from "./getInfo";



// -----------------------------
// --- Funciones auxiliares para mostrar campos según tipo de producto ---
// -----------------------------

// --- renderizar tipo de conexióón ---
export function shouldRenderConnectionTypeBattery(productType: string): boolean {
    return productType === "Batería" 
} // bateria
export function shouldRenderConnectionTypeInversor(productType: string): boolean {
    return productType === "Inversor" 
} // inversor
export function shouldRenderConnectionTypeSmartMeter(productType: string): boolean {
    return productType === "Smart Meter";
} // smart meter

// --- propiedades bateria ---
export function shouldRenderBatteryProp(productType: string): boolean {
    return productType === "Batería";
} // renderizar propiedades batería

// --- propiedades inversor ---
export function shouldRenderInversorProp(productType: string): boolean {
    return productType === "Inversor" 
} // renderizar propiedades del inversor

// --- propiedades modulo ---
export function shouldRenderModuloProp(productType: string): boolean {
    return productType === "Módulo" 
} // renderizar propiedades del modulo

// --- propiedades cableado ---
export function shouldRenderPowerSource(productType: string): boolean {
    return productType === "Cable" || productType === "Protección" || productType === "MC4";
} // renderizar fuente de energía

// --- propiedades estructura ---
export function  shouldRenderPanelArray(productType: string): boolean {
    return productType === "Estructura";
} // renderizar número de paneles por arreglo


// -----------------------------
// renderizar fecha de importación solo para productos en importación
// -----------------------------

export function shouldRenderImportDate(productStatus: string): boolean {
    return productStatus === "En importación"
} 
// -----------------------------
// renderizar el código del producto solo si se tiene el tipo de producto y proveedor para asignación automática
// -----------------------------

// Confirma si se necesita la asignacion automatica del codigo del producto
export function shouldRender_CodeProduct(productType: string, supplier: string) {
    const productCode = getProductTypeCode(productType);
    const { supplierCode } = getSupplierInfo(supplier);

    return Boolean(productCode && supplierCode);
}
// construye el código del producto a partir del tipo de producto, proveedor y número de fila
export function buildProductCode(productType: string, supplier: string, rowNumber: number) {
    const productCode = getProductTypeCode(productType);
    const { supplierCode } = getSupplierInfo(supplier);

    if (!productCode || !supplierCode || rowNumber < 1) {
        return "";
    }

    return `${productCode}${supplierCode}${String(rowNumber).padStart(5, "0")}`;
}

// -----------------------------
// --- Automatizar el llenado de información de proveedor (RUC, codigo del proveedor) ---
// -----------------------------

export function shouldRender_SupplyInfoSelection(productSupplier: string) {
    return getSupplierInfo(productSupplier);
}

// filtrado
export function shouldRender_ProductInfoSelection(productType: string) {
    const productMap: { [key: string]: { brand_options: string[]; unit: string } } = {
        "Accesorio": { brand_options: ["LIVOLTEK"], unit: "Unidad" },
        "Batería": { brand_options: ["LIVOLTEK", "TENSITE", "PYLONTECH", "SOLUNA", "FELICITY"], unit: "Unidad" },
        "Controlador": { brand_options: ["VICTRON", "FELICITY"], unit: "Unidad" },
        "Convertidor": { brand_options: ["VICTRON"], unit: "Unidad" },
        "Datalogger": { brand_options: ["VICTRON", "SOLIS"], unit: "Unidad" },
        "Estructura": { brand_options: ["TELPERION"], unit: "Unidad" },
        "Inversor": { brand_options: ["LIVOLTEK", "GOODWE", "INVT", "VICTRON", "SOLIS", "FELICITY"], unit: "Unidad" },
        "Módulo": { brand_options: ["JA SOLAR", "JINKO", "TRINA"], unit: "Unidad" },
        "Monitor": { brand_options: ["VICTRON"], unit: "Unidad" },
        "Rack": { brand_options: ["FELICITY"], unit: "Unidad" },
        "Smart Meter": { brand_options: ["LIVOLTEK", "GOODWE", "SOLIS"], unit: "Unidad" },
        "Cable": { brand_options: ["TELPERION", "PYLONTECH", "INDECO"], unit: "Metros" },
        "Protección": { brand_options: ["SUNTREE", "ABB", "SCHNEIDER"], unit: "Unidad" },
        "MC4": { brand_options: ["TRINA"], unit: "Unidad" },
        "Tablero": { brand_options: ["TIBOX"], unit: "Unidad" },
        "CT": { brand_options: ["CHINT"], unit: "Unidad" },
        "Fusible": { brand_options: ["CHINT"], unit: "Unidad" },
        "Portafusible": { brand_options: ["CHINT"], unit: "Unidad" },
    };

    return productMap[productType] || { brand_options: [], unit: "" };
}

// ordenamiento
export function shouldRender_ProductSortingSelection(currentOrder: "asc" | "desc" | null) {
    if (currentOrder === "asc") {
        return { label: "Orden ascendente", nextOrder: "desc" as const };
    }

    if (currentOrder === "desc") {
        return { label: "Orden descendente", nextOrder: "asc" as const };
    }

    return { label: "Ordenar por precio", nextOrder: "asc" as const };
}