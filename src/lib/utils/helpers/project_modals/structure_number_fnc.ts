// La descripción de la estructura indica cuántas unidades soporta, por ejemplo
// "Estructura coplanar Rupac para 4 módulos" o "Rack para 4 baterías".
export function unitsPerStructure(descripcion: string | undefined): number {
    const parsed = Number.parseInt(descripcion?.match(/\d+/)?.[0] ?? "", 10)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

// Las estructuras de baterías se dimensionan contra las baterías seleccionadas, no
// contra los módulos FV.
export function isBatteryStructure(descripcion: string | undefined): boolean {
    return (descripcion ?? "").toLowerCase().includes("batería")
}

export function isDados(descripcion: string | undefined): boolean {
    return (descripcion ?? "").toLowerCase().includes("dados")
}

// Dados por estructura según la capacidad de módulos: 4 → 8, 8 → 9.
export function dadosPerStructure(modulesPerStructure: number): number {
    if (modulesPerStructure === 4) return 8
    if (modulesPerStructure === 8) return 9
    return 0
}

export function isCoplanar(angulo: string | undefined): boolean {
    return angulo === "Coplanar"
}

export function isInclinado(angulo: string | undefined): boolean {
    return angulo === "Inclinado"
}

function isCoplanarStructure(descripcion: string | undefined): boolean {
    return (descripcion ?? "").toLowerCase().includes("coplanar")
}

function isInclinedStructure(descripcion: string | undefined): boolean {
    return (descripcion ?? "").toLowerCase().includes("regulable")
}

// Filtra estructuras según la orientación del proyecto (coplanar / inclinado).
export function matchesStructureAngle(
    descripcion: string | undefined,
    angulo: string | undefined,
): boolean {
    if (isCoplanarStructure(descripcion)) return isCoplanar(angulo)
    if (isInclinedStructure(descripcion)) return isInclinado(angulo)
    return true
}
