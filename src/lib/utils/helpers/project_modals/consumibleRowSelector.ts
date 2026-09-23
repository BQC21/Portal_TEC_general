import { SelectOption } from "@/lib/types/components/General/form_fields"
import { Materiales } from "@/lib/types/supabase/materiales-types"
import {
    CableFvColor,
    ConsumibleAddableFamily,
    ConsumibleExtraFamily,
    ConsumibleFamily,
    ConsumibleLinkedFamily,
    ConsumibleRestorableFamily,
    ConsumibleSelectableFamily,
    FixedConsumibleFamily,
} from "@/lib/types/components/Quotes/consumible_tableRow"
import {
    AUTORROSCANTE_INCH,
    CABLE_FV_DEFAULT_CODE,
    CANALIZACION_FAMILY_ORDER,
    CONSUMIBLE_FAMILY_DEFAULT_CODE,
    CONSUMIBLE_FAMILY_LABEL,
    CONSUMIBLE_FAMILY_TIPO,
    DEFAULT_INSERTED_FAMILIES,
    GROUPED_CONSUMIBLE_FAMILIES,
    CONSUMIBLE_FAMILIES_WITH_CODE_LABEL,
    PRECINTOS_MM,
    SPACK_SIZES,
    TERMINAL_OJAL_MM2,
    TERMINAL_PIN_MM2,
    CONSUMIBLE_EXTRA_ADD_LABEL,
} from "@/lib/utils/consts/consumibles"
import { formatProductOptionLabel } from "@/lib/utils/helpers/project_modals/productOptions"

// -------------------
// Funciones
// -------------------

// Evalúa si es consumible extra
export function isExtraConsumibleFamily(
    family: ConsumibleFamily | null,
): family is ConsumibleExtraFamily {
    return family === "itm_ac"
        || family === "cable_tierra"
        || family === "tablero"
        || family === "canaleta"
        || family === "fusible"
}
export function isAddableConsumibleFamily(
    family: ConsumibleFamily | null,
): family is ConsumibleAddableFamily {
    return family !== null && family in CONSUMIBLE_EXTRA_ADD_LABEL
}

export function isFixedConsumibleFamily(
    family: ConsumibleFamily | null,
): family is FixedConsumibleFamily {
    return family === "mc4"
}

// Evalua si la descripcion corresponde a un ITM DC
export function isItmAcDescription(descripcion: string): boolean {
    const description = descripcion.toUpperCase()
    return description.includes("ITM") && !description.includes("VDC")
}

// Evalúa si es un componente restaurable (MC4, fusible)
export function isRestorableConsumibleFamily(
    family: ConsumibleFamily | null,
): family is ConsumibleRestorableFamily {
    return family === "fusible"
}

// Evalúa si necesita inserción por defecto
export function isDefaultInsertedFamily(
    family: ConsumibleFamily | null,
): family is ConsumibleSelectableFamily {
    return family != null && DEFAULT_INSERTED_FAMILIES.has(family as ConsumibleSelectableFamily)
}

// Evalúa si es un conjunto de 100
function isHundredPack(description: string): boolean {
    return (
        /\b100(\s*(und|unid|to|unidades?))?\b/.test(description)
        || description.includes("100to") || description.includes("precinto")
    )
}

// normaliza el texto
export function normalizeConsumibleText(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
}

// Ordenamiento de materiales tipo CANALIZACIÓN
export function getCanalizacionSortOrder(family: ConsumibleFamily | null): number | null {
    if (!family) return null
    return family in CANALIZACION_FAMILY_ORDER ? CANALIZACION_FAMILY_ORDER[family] : null
}

// Obtención de la familia del consumible
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
    if (description.includes("bornera") && description.includes("linea")) return "bornera_linea"
    if (description.includes("tirafon") || description.includes("tiraforn")) return "tirafon"

    const hundredPack = isHundredPack(description)
    const isPinTerminal = description.includes("terminal") && description.includes("pin")
    const isOjalTerminal = description.includes("terminal") && description.includes("ojal")

    if (hundredPack && isPinTerminal) return "terminal_pin_100"
    if (hundredPack && isOjalTerminal) return "terminal_ojal_100"
    if (isOjalTerminal) return "terminal_ojal"
    if (isPinTerminal) return "terminal_pin"

    if (description.includes("precinto") && !description.includes("sujeta")) {
        return "precintos"
    }
    if (hundredPack && description.includes("autorroscant")) {
        return "tornillos_autorroscantes_100"
    }
    if (description.includes("autorroscant")) return "tornillo_autorroscante"

    if (description.includes("tornillo") && description.includes("spack")) {
        return "tornillo_spack"
    }

    return null
}

////////
////////
////////
////////

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
    if (description.includes("verde")) return "verde"
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

function extractMeterSize(descripcion: string): string | null {
    const match = descripcion.match(/(\d+(?:[.,]\d+)?)\s*m\b/i)
    if (!match) return null
    return match[1].replace(",", ".")
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
    if (family === "precintos") {
        const mm = extractMmSize(descripcion) ?? extractMeterSize(descripcion)
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
        .filter((material) => family !== "itm_ac" || isItmAcDescription(material.descripcion))
        .filter((material) => !usedCodes?.has(material.cod_producto))

    const defaultCode = getDefaultCodeForFamily(family, color)
    return candidates.find((material) => material.cod_producto === defaultCode) ?? candidates[0]
}

export function buildConsumibleFamilyOptions(
    family: ConsumibleSelectableFamily,
    materiales: Materiales[],
    color?: CableFvColor | null,
): SelectOption[] {
    return filterMaterialsByFamily(materiales, family, color)
        .filter((material) => family !== "itm_ac" || isItmAcDescription(material.descripcion))
        .map((material) => ({
            value: String(material.id),
            label: CONSUMIBLE_FAMILIES_WITH_CODE_LABEL.has(family)
                ? formatProductOptionLabel(material.cod_producto, material.descripcion)
                : material.descripcion,
        }))
}

export function isQuoteConsumibleMaterial(material: Pick<Materiales, "descripcion" | "tipo_de_producto">): boolean {
    if (getConsumibleFamily(material.descripcion)) return true
    const tipo = (material.tipo_de_producto ?? "").toUpperCase()
    return tipo === "CONSUMIBLE"
        || tipo === "PROTECCIÓN"
        || tipo === "PROTECCION"
        || tipo === "CANALIZACIÓN"
        || tipo === "CANALIZACION"
        || tipo === "MC4"
        || tipo === "CABLE"
}

export function usesGroupedConsumibleSelector(family: ConsumibleFamily | null): boolean {
    return family != null && GROUPED_CONSUMIBLE_FAMILIES.has(family)
}

export function getExtraCatalogConsumibles(
    materiales: Materiales[],
    usedCodes: Set<string>,
): Materiales[] {
    return materiales.filter((material) => {
        if (!material.cod_producto || usedCodes.has(material.cod_producto)) return false
        if (!isQuoteConsumibleMaterial(material)) return false
        return !usesGroupedConsumibleSelector(getConsumibleFamily(material.descripcion))
    })
}
