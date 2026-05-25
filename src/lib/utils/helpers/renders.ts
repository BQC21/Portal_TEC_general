import { getProductTypeCode, getSupplierInfo } from "./getInfo";



// -----------------------------
// --- Funciones auxiliares para renderizar tipo de conexión ---
// -----------------------------

export function shouldRenderConnectionTypeBattery(productType: string): boolean {
    return productType === "Batería" 
} // bateria
export function shouldRenderConnectionTypeInversor(productType: string): boolean {
    return productType === "Inversor" 
} // inversor
export function shouldRenderConnectionTypeSmartMeter(productType: string): boolean {
    return productType === "Smart Meter";
} // smart meter

// -----------------------------
// --- Funciones auxiliares para renderizar propiedades de los equipos eléctricos ---
// -----------------------------

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