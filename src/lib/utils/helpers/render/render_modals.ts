import { getSupplierInfo } from "../manage_info/getInfo";


// -----------------------------
// --- Triggers auxiliares para renderizar tipo de conexión ---
// -----------------------------

export function shouldRenderConnectionTypeBattery(type: string): boolean {
    return type === "Batería" || type === "BATERÍA";
} // bateria
export function shouldRenderConnectionTypeInversor(type: string): boolean {
    return type === "Inversor" || type === "INVERSOR"; 
} // inversor
export function shouldRenderConnectionTypeSmartMeter(type: string): boolean {
    return type === "Smart Meter";
} // smart meter
export function shouldRenderConnectionTypeAccesories(type: string): boolean{
    return type === "ACCESORIO";
}

// -----------------------------
// --- Triggers auxiliares para renderizar propiedades ---
// -----------------------------

// --- propiedades bateria ---
export function shouldRenderBatteryProp(type: string): boolean {
    return type === "Batería" || type === "BATERÍA";
} // renderizar propiedades batería

// --- propiedades inversor ---
export function shouldRenderInversorProp(type: string): boolean {
    return type === "Inversor" || type === "INVERSOR"; 
} // renderizar propiedades del inversor

// --- propiedades modulo ---
export function shouldRenderModuloProp(type: string): boolean {
    return type === "Módulo" || type === "MÓDULO FV"; 
} // renderizar propiedades del modulo

// --- propiedades cableado ---
export function shouldRenderPowerSource(type: string): boolean {
    return type === "Cable" || type === "Protección" || type === "MC4";
} // renderizar fuente de energía

// --- propiedades estructura ---
export function  shouldRenderPanelArray(type: string): boolean {
    return type === "Estructura";
} // renderizar número de paneles por arreglo


// -----------------------------
// renderizar fecha de importación solo para productos en importación
// -----------------------------

export function shouldRenderImportDate(productStatus: string): boolean {
    return productStatus === "En importación"
} 

// -----------------------------
// --- Automatizar el llenado de información de proveedor (RUC, codigo del proveedor) ---
// -----------------------------

export function shouldRender_SupplyInfoSelection(supplier: string) {
    return getSupplierInfo(supplier);
}