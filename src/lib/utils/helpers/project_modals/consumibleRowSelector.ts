import { SelectOption } from "@/lib/types/components/General/form_fields"
import { Materiales } from "@/lib/types/supabase/materiales-types"

export type ConsumibleSelectableFamily =
    | "itm_ac"
    | "spd"
    | "itm_dc"
    | "conduit_flexible"
    | "conduit"
    | "cable_ac"
    | "cable_fv"
    | "cable_tierra"
    | "tablero"
    | "bornera"
    | "terminal_pin_100"
    | "terminal_ojal_100"
    | "terminal_ojal"
    | "terminal_pin"
    | "precintos_100"
    | "tornillos_autorroscantes_100"
    | "tornillo_spack"
    | "mc4"
    | "fusible"

export type ConsumibleLinkedFamily = "abrazadera" | "prensaestopa" | "curva" | "union" | "conector"

export type ConsumibleFamily = ConsumibleSelectableFamily | ConsumibleLinkedFamily | "canaleta"

export const EXTRA_CONSUMIBLE_FAMILIES = ["cable_tierra", "tablero", "mc4", "fusible"] as const
export type ConsumibleExtraFamily = (typeof EXTRA_CONSUMIBLE_FAMILIES)[number]

export const RESTORABLE_CONSUMIBLE_FAMILIES = ["mc4", "fusible"] as const
export type ConsumibleRestorableFamily = (typeof RESTORABLE_CONSUMIBLE_FAMILIES)[number]

export function isExtraConsumibleFamily(
    family: ConsumibleFamily | null,
): family is ConsumibleExtraFamily {
    return family === "cable_tierra"
        || family === "tablero"
        || family === "mc4"
        || family === "fusible"
}

export function isRestorableConsumibleFamily(
    family: ConsumibleFamily | null,
): family is ConsumibleRestorableFamily {
    return family === "mc4" || family === "fusible"
}

export type CableFvColor = "rojo" | "negro"

export const SELECTABLE_CONSUMIBLE_FAMILIES: ConsumibleSelectableFamily[] = [
    "itm_ac",
    "spd",
    "itm_dc",
    "conduit_flexible",
    "conduit",
    "cable_ac",
    "cable_fv",
    "cable_tierra",
    "tablero",
    "bornera",
    "terminal_pin_100",
    "terminal_ojal_100",
    "terminal_ojal",
    "terminal_pin",
    "precintos_100",
    "tornillos_autorroscantes_100",
    "tornillo_spack",
    "mc4",
    "fusible",
]

export const CONSUMIBLE_FAMILY_LABEL: Record<ConsumibleSelectableFamily, string> = {
    itm_ac: "Protección ITM AC",
    spd: "Voltaje SPD",
    itm_dc: "Protección ITM DC",
    conduit_flexible: "Conduit flexible",
    conduit: "Conduit",
    cable_ac: "Cable AC",
    cable_fv: "Cable FV",
    cable_tierra: "Cable de tierra",
    tablero: "Tablero",
    bornera: "Bornera",
    terminal_pin_100: "100to terminal tipo pin",
    terminal_ojal_100: "100to terminal tipo ojal",
    terminal_ojal: "Terminal tipo ojal",
    terminal_pin: "Terminal tipo pin",
    precintos_100: "100to precintos",
    tornillos_autorroscantes_100: "100to tornillos autorroscantes",
    tornillo_spack: "Tornillo Spack",
    mc4: "MC4",
    fusible: "Fusible + Portafusible",
}

export const CONSUMIBLE_EXTRA_ADD_LABEL: Record<ConsumibleExtraFamily, string> = {
    cable_tierra: "Agregar otro cable de tierra",
    tablero: "Agregar otro tablero",
    mc4: "Agregar otro MC4",
    fusible: "Agregar otro fusible + portafusible",
}

export const CONSUMIBLE_RESTORE_LABEL: Record<ConsumibleRestorableFamily, string> = {
    mc4: "Agregar MC4",
    fusible: "Agregar fusible + portafusible",
}

export const CONSUMIBLE_FAMILY_TIPO: Record<ConsumibleFamily, string> = {
    itm_ac: "PROTECCIÓN",
    spd: "PROTECCIÓN",
    itm_dc: "PROTECCIÓN",
    conduit_flexible: "CANALIZACIÓN",
    abrazadera: "CANALIZACIÓN",
    prensaestopa: "CANALIZACIÓN",
    conduit: "CANALIZACIÓN",
    curva: "CANALIZACIÓN",
    union: "CANALIZACIÓN",
    conector: "CANALIZACIÓN",
    canaleta: "CANALIZACIÓN",
    cable_ac: "CANALIZACIÓN",
    cable_fv: "CANALIZACIÓN",
    cable_tierra: "CANALIZACIÓN",
    tablero: "CONSUMIBLE",
    bornera: "CONSUMIBLE",
    terminal_pin_100: "CONSUMIBLE",
    terminal_ojal_100: "CONSUMIBLE",
    terminal_ojal: "CONSUMIBLE",
    terminal_pin: "CONSUMIBLE",
    precintos_100: "CONSUMIBLE",
    tornillos_autorroscantes_100: "CONSUMIBLE",
    tornillo_spack: "CONSUMIBLE",
    mc4: "MC4",
    fusible: "PROTECCIÓN",
}

const CANALIZACION_FAMILY_ORDER: Record<string, number> = {
    conduit_flexible: 0,
    abrazadera: 1,
    prensaestopa: 2,
    conduit: 3,
    curva: 4,
    union: 5,
    conector: 6,
    canaleta: 7,
    cable_ac: 8,
    cable_fv: 9,
    cable_tierra: 10,
}

export const CONSUMIBLE_FAMILY_DEFAULT_CODE: Partial<Record<ConsumibleSelectableFamily, string>> = {
    itm_ac: "MSTOF00001",
    spd: "MPESO00005",
    itm_dc: "MPESO00001",
    cable_ac: "MPROJ00001",
    cable_tierra: "MCAVA00022",
    tablero: "MCOIN00003",
}

export const CABLE_FV_DEFAULT_CODE: Record<CableFvColor, string> = {
    rojo: "MELSI00001",
    negro: "MELSI00002",
}

const DEFAULT_INSERTED_FAMILIES = new Set<ConsumibleSelectableFamily>([
    "itm_ac",
    "spd",
    "itm_dc",
    "cable_ac",
    "cable_fv",
    "cable_tierra",
    "tablero",
])

export function isDefaultInsertedFamily(
    family: ConsumibleFamily | null,
): family is ConsumibleSelectableFamily {
    return family != null && DEFAULT_INSERTED_FAMILIES.has(family as ConsumibleSelectableFamily)
}

export function getCanalizacionSortOrder(family: ConsumibleFamily | null): number | null {
    if (!family) return null
    return family in CANALIZACION_FAMILY_ORDER ? CANALIZACION_FAMILY_ORDER[family] : null
}

const TERMINAL_PIN_MM2 = new Set(["10", "16", "25", "35"])
const TERMINAL_OJAL_MM2 = new Set(["10", "16", "25", "35", "50"])
const PRECINTOS_MM = new Set(["100", "200", "300"])
const SPACK_SIZES = new Set(["4x30", "4x50"])
const AUTORROSCANTE_INCH = new Set(["2", "3", "4"])

export function normalizeConsumibleText(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
}

function isHundredPack(description: string): boolean {
    return (
        /\b100(\s*(und|unid|to|unidades?))?\b/.test(description)
        || description.includes("100to")
    )
}

export function getConsumibleFamily(descripcion: string): ConsumibleFamily | null {
    const description = normalizeConsumibleText(descripcion)
    if (!description) return null

    if (description.includes("itm") && description.includes("vdc")) return "itm_dc"
    if (description.includes("itm")) return "itm_ac"
    if (description.includes("spd")) return "spd"
    if (description.includes("fusible") || description.includes("portafusible")) return "fusible"

    if (description.includes("conduit") && description.includes("flexible")) {
        return "conduit_flexible"
    }
    if (description.includes("conduit")) return "conduit"
    if (description.includes("abrazadera")) return "abrazadera"
    if (description.includes("prensaestopa")) return "prensaestopa"
    if (description.includes("curva")) return "curva"
    if (description.includes("union")) return "union"
    if (description.includes("mc4")) return "mc4"
    if (description.includes("conector")) return "conector"
    if (description.includes("canaleta")) return "canaleta"

    if (description.includes("cable ac")) return "cable_ac"
    if (description.includes("cable fv")) return "cable_fv"
    if (description.includes("cable de tierra") || description.includes("cable tierra")) {
        return "cable_tierra"
    }

    if (description.includes("tablero")) return "tablero"
    if (description.includes("bornera")) return "bornera"

    const hundredPack = isHundredPack(description)
    const isPinTerminal = description.includes("terminal") && description.includes("pin")
    const isOjalTerminal = description.includes("terminal") && description.includes("ojal")

    if (hundredPack && isPinTerminal) return "terminal_pin_100"
    if (hundredPack && isOjalTerminal) return "terminal_ojal_100"
    if (isOjalTerminal) return "terminal_ojal"
    if (isPinTerminal) return "terminal_pin"

    if (hundredPack && description.includes("precinto")) return "precintos_100"
    if (hundredPack && description.includes("autorroscant")) {
        return "tornillos_autorroscantes_100"
    }

    if (description.includes("tornillo") && description.includes("spack")) {
        return "tornillo_spack"
    }

    return null
}

export function resolveConsumibleTipo(
    descripcion: string,
    fallback?: string,
): string | undefined {
    const family = getConsumibleFamily(descripcion)
    if (family) return CONSUMIBLE_FAMILY_TIPO[family]
    return fallback
}

export function isSelectableConsumibleFamily(
    family: ConsumibleFamily | null,
): family is ConsumibleSelectableFamily {
    return family !== null && family in CONSUMIBLE_FAMILY_LABEL
}

export function getCableFvColor(descripcion: string): CableFvColor | null {
    const description = normalizeConsumibleText(descripcion)
    if (description.includes("rojo")) return "rojo"
    if (description.includes("negro")) return "negro"
    return null
}

export function extractInchSize(descripcion: string): string | null {
    const normalized = descripcion
        .replace(/[”'']/g, '"')
        .replace(/pulgadas?/gi, '"')
    const match = normalized.match(
        /(\d+\s+\d+\s*\/\s*\d+|\d+\s*\/\s*\d+|\d+(?:[.,]\d+)?)\s*"/,
    )
    if (!match) return null
    return match[1].replace(/\s+/g, " ").trim().replace(",", ".")
}

export function extractCableFvDimension(descripcion: string): string | null {
    const match = descripcion.match(/(\d+(?:[.,]\d+)?)\s*mm/i)
    if (!match) return null
    return match[1].replace(",", ".")
}

export function extractMm2(descripcion: string): string | null {
    const match = descripcion.match(/(\d+(?:[.,]\d+)?)\s*mm\s*(?:2|²)/i)
    if (!match) return null
    return match[1].replace(",", ".")
}

export function extractMmSize(descripcion: string): string | null {
    const matches = [...descripcion.matchAll(/(\d+(?:[.,]\d+)?)\s*mm(?!\s*(?:2|²))/gi)]
    if (matches.length === 0) return null
    return matches[matches.length - 1][1].replace(",", ".")
}

export function extractSpackSize(descripcion: string): string | null {
    const match = descripcion.match(/(\d+\s*x\s*\d+)/i)
    if (!match) return null
    return match[1].replace(/\s+/g, "").toLowerCase()
}

export function matchesFamilySize(family: ConsumibleFamily, descripcion: string): boolean {
    if (family === "terminal_pin") {
        const mm2 = extractMm2(descripcion)
        return mm2 != null && TERMINAL_PIN_MM2.has(mm2)
    }
    if (family === "terminal_ojal") {
        const mm2 = extractMm2(descripcion)
        return mm2 != null && TERMINAL_OJAL_MM2.has(mm2)
    }
    if (family === "precintos_100") {
        const mm = extractMmSize(descripcion)
        return mm != null && PRECINTOS_MM.has(mm)
    }
    if (family === "tornillo_spack") {
        const size = extractSpackSize(descripcion)
        return size != null && SPACK_SIZES.has(size)
    }
    if (family === "tornillos_autorroscantes_100") {
        const inch = extractInchSize(descripcion)
        return inch != null && AUTORROSCANTE_INCH.has(inch)
    }
    return true
}

export function filterMaterialsByFamily(
    materiales: Materiales[],
    family: ConsumibleFamily,
    color?: CableFvColor | null,
): Materiales[] {
    return materiales.filter((material) => {
        if (getConsumibleFamily(material.descripcion) !== family) return false
        if (family === "cable_fv" && color) {
            return getCableFvColor(material.descripcion) === color
        }
        return true
    })
}

export function findMaterialByFamilyAndInch(
    materiales: Materiales[],
    family: ConsumibleLinkedFamily | "conduit_flexible",
    inchSize: string,
): Materiales | undefined {
    return filterMaterialsByFamily(materiales, family).find(
        (material) => extractInchSize(material.descripcion) === inchSize,
    )
}

export function findCableFvMaterial(
    materiales: Materiales[],
    dimension: string,
    color: CableFvColor,
): Materiales | undefined {
    return filterMaterialsByFamily(materiales, "cable_fv", color).find(
        (material) => extractCableFvDimension(material.descripcion) === dimension,
    )
}

export function getDefaultCodeForFamily(
    family: ConsumibleSelectableFamily,
    color?: CableFvColor | null,
): string | undefined {
    if (family === "cable_fv" && color) return CABLE_FV_DEFAULT_CODE[color]
    return CONSUMIBLE_FAMILY_DEFAULT_CODE[family]
}

export function getDefaultMaterialForFamily(
    materiales: Materiales[],
    family: ConsumibleSelectableFamily,
    color?: CableFvColor | null,
    usedCodes?: Set<string>,
): Materiales | undefined {
    const candidates = filterMaterialsByFamily(materiales, family, color)
        .filter((material) => matchesFamilySize(family, material.descripcion))
        .filter((material) => !usedCodes?.has(material.cod_producto))

    const defaultCode = getDefaultCodeForFamily(family, color)
    return candidates.find((material) => material.cod_producto === defaultCode) ?? candidates[0]
}

export function buildConsumibleFamilyOptions(
    family: ConsumibleSelectableFamily,
    materiales: Materiales[],
    selectedIds: Set<string>,
    currentMaterialId?: string,
    color?: CableFvColor | null,
): SelectOption[] {
    return filterMaterialsByFamily(materiales, family, color)
        .filter((material) => {
            const materialId = String(material.id)
            if (materialId === currentMaterialId) return true
            if (selectedIds.has(materialId)) return false
            return matchesFamilySize(family, material.descripcion)
        })
        .map((material) => ({
            value: String(material.id),
            label: material.descripcion,
        }))
}
