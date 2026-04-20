// --- Funciones auxiliares para mostrar campos según tipo de producto ---
export function shouldRenderConnectionType(productType: string): boolean {
    return productType === "Inversor" || productType === "Batería";
}

export function shouldRenderMaxPower(productType: string): boolean {
    return productType === "Inversor" || productType === "Módulo";
}

export function shouldRenderMppt(productType: string): boolean {
    return productType === "Inversor";
}

export function shouldRenderDod(productType: string): boolean {
    return productType === "Batería";
}

export function shouldRenderBeta(productType: string): boolean {
    return productType === "Módulo";
}

export function shouldRenderArraysPerMppt(productType: string): boolean {
    return productType === "Inversor";
}

export function shouldRenderVocVmppIscImpp(productType: string): boolean {
    return productType === "Inversor" || productType === "Módulo" || productType === "Batería";
}

export function shouldRenderPowerSource(productType: string): boolean {
    return productType === "Cable" || productType === "Protección" || productType === "MC4";
}

export function shouldRenderImportDate(productStatus: string): boolean {
    return productStatus === "En importación"
}


// --- Funciones auxiliares para mostrar opciones de selección ---

export function shouldRender_SupplyInfoSelection(productSupplier: string) {
    const supplierMap: { [key: string]: { RUC: string; supplierCode: string } } = {
        "Andet S.A.C": { RUC: "20601248647", supplierCode: "ANDE" },
        "Sigelec S.A.C": { RUC: "20268214527", supplierCode: "SIGE" },
        "AutoSolar Energía del Perú S.A.C": { RUC: "20602492118", supplierCode: "AUTO" },
        "Novum Solar S.A.C": { RUC: "20601873894", supplierCode: "NOVU" },
        "Caral Soluciones Energéticas S.A.C": { RUC: "20603087675", supplierCode: "CARA" },
        "Felicitysolar Peru E.I.R.L": { RUC: "20611054069", supplierCode: "FELI" },
        "RE & GE Import S.A.C": { RUC: "20502234693", supplierCode: "REGE" },
        "Grupo Coinp S.A.C": { RUC: "20548407991", supplierCode: "COIN" },
        "Proyect & Quality S.A.C": { RUC: "20611896116", supplierCode: "PROY" },

        // Backward compatibility if the function is called with RUC as key.
        "20601248647": { RUC: "20601248647", supplierCode: "ANDE" },
        "20268214527": { RUC: "20268214527", supplierCode: "SIGE" },
        "20602492118": { RUC: "20602492118", supplierCode: "AUTO" },
        "20601873894": { RUC: "20601873894", supplierCode: "NOVU" },
        "20603087675": { RUC: "20603087675", supplierCode: "CARA" },
        "20611054069": { RUC: "20611054069", supplierCode: "FELI" },
        "20502234693": { RUC: "20502234693", supplierCode: "REGE" },
        "20548407991": { RUC: "20548407991", supplierCode: "COIN" },
        "20611896116": { RUC: "20611896116", supplierCode: "PROY" }
    };

    return supplierMap[productSupplier] || { RUC: "", supplierCode: "" };
}

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