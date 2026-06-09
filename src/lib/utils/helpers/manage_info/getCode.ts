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
    const EquiposTypes = new Set([
        "ACCESORIO",
        "BATERÍA",
        "ESTRUCTURA",
        "INVERSOR",
        "MÓDULO FV",
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
    const MaterialesTypes = new Set([
        "CABLE",
        "CANALIZACIÓN",
        "CONSUMIBLE",
        "MC4",
        "PROTECCIÓN",
    ]);

    // 1er dígito del código
    if (equipmentTypes.has(productType) || EquiposTypes.has(productType)) return "E";
    if (materialTypes.has(productType) || MaterialesTypes.has(productType)) return "M";
    return "";
}