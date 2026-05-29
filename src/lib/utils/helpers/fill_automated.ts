// -----------------------------
// --- Automatizar el llenado de información de proveedor (RUC, codigo del proveedor) ---
// -----------------------------

import { getSupplierInfo } from "./getInfo";

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