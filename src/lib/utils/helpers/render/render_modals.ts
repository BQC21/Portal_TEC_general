import { SupplierFormstate } from "@/lib/types/supabase/supplier-types";
import { getSupplierInfo } from "../manage_info/getInfo";

// MODULO 1

// -----------------------------
// --- Triggers para renderizar tipo de conexión ---
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
// --- Triggers para renderizar propiedades ---
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
// --- Triggers para llenado de información de 
//     proveedor (RUC, codigo del proveedor) ---
// -----------------------------

export function shouldRender_SupplyInfoSelection(proveedor: SupplierFormstate) {
    return Boolean(getSupplierInfo(proveedor).supplierCode);
}

// MODULO 2

// -----------------------------
// renderizar la visión de campos en las ventanas de dimensionamiento
// -----------------------------

export function shouldRender_M2_configuration(tipo_instalacion: string){
    return tipo_instalacion != "conexión OFF-GRID"
}

export function shouldRender_M2_battery_properties(tipo_instalacion: string){
    return tipo_instalacion != "conexión ON-GRID"
}