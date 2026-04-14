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

export function shouldRenderArraysPerMppt(productType: string): boolean {
    return productType === "Inversor";
}

export function shouldRenderVocVmppIscImpp(productType: string): boolean {
    return productType === "Inversor" || productType === "Módulo" || productType === "Batería";
}

export function shouldRenderPowerSource(productType: string): boolean {
    return productType === "Cable" || productType === "Protección" || productType === "MC4";
}