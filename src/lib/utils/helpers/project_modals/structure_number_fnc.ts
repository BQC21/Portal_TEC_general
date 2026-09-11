function normalizeStructureText(value: string): string {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
}

function parsePositiveInt(value: string | undefined): number {
    const parsed = Number.parseInt(value ?? "", 10)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

// La descripción de la estructura indica cuántas unidades soporta, por ejemplo
// "Estructura coplanar Rupac para 4 módulos" o "RACK PARA 6 BATERIAS FLH48100R13G2".
export function unitsPerStructure(descripcion: string | undefined): number {
    const text = normalizeStructureText(descripcion ?? "")
    const qualified = text.match(/(\d+)\s*(?:modulos?|baterias?)/)
    if (qualified) return parsePositiveInt(qualified[1])
    return parsePositiveInt(text.match(/\d+/)?.[0])
}

// Las estructuras de baterías se dimensionan contra las baterías seleccionadas, no
// contra los módulos FV. Acepta "batería", "bateria", "baterías" y "baterias".
export function isBatteryStructure(descripcion: string | undefined): boolean {
    return normalizeStructureText(descripcion ?? "").includes("bateria")
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
// Sin ángulo (cotización independiente) se admiten todas las alternativas.
export function matchesStructureAngle(
    descripcion: string | undefined,
    angulo: string | undefined,
): boolean {
    if (!angulo?.trim()) return true // COTIZACIÓN INDEPENDIENTE
    if (isCoplanarStructure(descripcion)) return isCoplanar(angulo)
    if (isInclinedStructure(descripcion)) return isInclinado(angulo)
    return true
}
