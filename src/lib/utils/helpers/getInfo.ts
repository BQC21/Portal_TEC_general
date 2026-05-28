// --- Funciones auxiliares para mostrar campos según proveedor ---
export function getSupplierInfo(productSupplier: string) {
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

        // backup en caso de que el nombre del proveedor no coincida exactamente, se puede buscar por RUC
        "20601248647": { RUC: "20601248647", supplierCode: "ANDE" },
        "20268214527": { RUC: "20268214527", supplierCode: "SIGE" },
        "20602492118": { RUC: "20602492118", supplierCode: "AUTO" },
        "20601873894": { RUC: "20601873894", supplierCode: "NOVU" },
        "20603087675": { RUC: "20603087675", supplierCode: "CARA" },
        "20611054069": { RUC: "20611054069", supplierCode: "FELI" },
        "20502234693": { RUC: "20502234693", supplierCode: "REGE" },
        "20548407991": { RUC: "20548407991", supplierCode: "COIN" },
        "20611896116": { RUC: "20611896116", supplierCode: "PROY" },
    };

    return supplierMap[productSupplier] || { RUC: "", supplierCode: "" };
}

// --- Funciones auxiliares para mostrar primer digito de la codificación según tipo de producto ---
export function getProductTypeCode(productType: string) {
    // Equipos eléctricos
    const equipmentTypes = new Set([
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
    ]);
    // Materiales eléctricos
    const materialTypes = new Set([
        "Cable",
        "Protección",
        "MC4",
        "Tablero",
        "CT",
        "Fusible",
        "Portafusible",
    ]);

    // 1er dígito del código
    if (equipmentTypes.has(productType)) return "E";
    if (materialTypes.has(productType)) return "M";
    return "";
}