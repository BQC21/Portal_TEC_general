import { SelectOption } from "@/lib/types/components/General/form_fields"
import { Materiales } from "@/lib/types/supabase/materiales-types"
import { defaultSelectOption, toProductSelectOption } from "@/lib/utils/helpers/project_modals/productOptions"

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
    | "terminal_pin_100"
    | "terminal_ojal_100"
    | "terminal_ojal"
    | "terminal_pin"
    | "precintos_100"
    | "tornillos_autorroscantes_100"
    | "tornillo_spack"
    | "tirafon_1_4"

export type ConsumibleLinkedFamily = "abrazadera" | "prensaestopa" | "curva" | "union" | "conector"

export type ConsumibleFamily = ConsumibleSelectableFamily | ConsumibleLinkedFamily

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
    "terminal_pin_100",
    "terminal_ojal_100",
    "terminal_ojal",
    "terminal_pin",
    "precintos_100",
    "tornillos_autorroscantes_100",
    "tornillo_spack",
    "tirafon_1_4",
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
    terminal_pin_100: "100 und terminal tipo pin",
    terminal_ojal_100: "100 und terminal tipo ojal",
    terminal_ojal: "Terminal tipo ojal",
    terminal_pin: "Terminal tipo pin",
    precintos_100: "100 und precintos",
    tornillos_autorroscantes_100: "100 und tornillos autorroscantes",
    tornillo_spack: "Tornillo Spack",
    tirafon_1_4: "Tirafón 1/4\"",
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
    cable_ac: "CABLE",
    cable_fv: "CABLE",
    cable_tierra: "CABLE",
    tablero: "CONSUMIBLE",
    terminal_pin_100: "CONSUMIBLE",
    terminal_ojal_100: "CONSUMIBLE",
    terminal_ojal: "CONSUMIBLE",
    terminal_pin: "CONSUMIBLE",
    precintos_100: "CONSUMIBLE",
    tornillos_autorroscantes_100: "CONSUMIBLE",
    tornillo_spack: "CONSUMIBLE",
    tirafon_1_4: "CONSUMIBLE",
}

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

    if (description.includes("conduit") && description.includes("flexible")) {
        return "conduit_flexible"
    }
    if (description.includes("conduit")) return "spd"
    if (description.includes("abrazadera")) return "abrazadera"
    if (description.includes("prensaestopa")) return "prensaestopa"
    if (description.includes("curva")) return "curva"
    if (description.includes("union")) return "union"
    if (description.includes("conector")) return "conector"

    if (description.includes("cable ac")) return "cable_ac"
    if (description.includes("cable fv")) return "cable_fv"
    if (description.includes("cable de tierra") || description.includes("cable tierra")) {
        return "cable_tierra"
    }

    if (description.includes("tablero")) return "tablero"

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
    if (description.includes("tirafon") && /1\s*\/\s*4/.test(description)) {
        return "tirafon_1_4"
    }

    return null
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

export function buildConsumibleFamilyOptions(
    family: ConsumibleSelectableFamily,
    materiales: Materiales[],
    selectedIds: Set<string>,
    currentMaterialId?: string,
    color?: CableFvColor | null,
): SelectOption[] {
    const label = color
        ? `${CONSUMIBLE_FAMILY_LABEL[family]} ${color}`
        : CONSUMIBLE_FAMILY_LABEL[family]

    return [
        defaultSelectOption(label),
        ...filterMaterialsByFamily(materiales, family, color)
            .filter((material) => {
                const materialId = String(material.id)
                return materialId === currentMaterialId || !selectedIds.has(materialId)
            })
            .map(toProductSelectOption),
    ]
}
