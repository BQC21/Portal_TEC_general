import {
    CableFvColor,
    ConsumibleDisplayRow,
    ConsumibleFamily,
    UseConsumeRowSelectionArgs,
} from "@/lib/types/components/Quotes/consumible_tableRow"
import { Materiales } from "@/lib/types/supabase/materiales-types"
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join"
import {
    CONSUMIBLE_FAMILY_TIPO,
    getConsumibleFamily,
} from "@/lib/utils/helpers/project_modals/consumibleRowSelector"

export function countSelectedInverters(equipos: Project_Equipos[]): number {
    return equipos.reduce((sum, item) => {
        const tipo = (item.equipo_info?.tipo_de_producto ?? "").toUpperCase()
        if (tipo !== "INVERSOR") return sum
        const qty = Number(item.cantidad)
        return sum + (Number.isFinite(qty) && qty > 0 ? qty : 1)
    }, 0)
}

export function applyTemplateMaterial(
    onUpdateItem: UseConsumeRowSelectionArgs["onUpdateItem"],
    index: number,
    material: Materiales,
) {
    const family = getConsumibleFamily(material.descripcion)
    onUpdateItem(index, "cod_producto", material.cod_producto)
    onUpdateItem(index, "descripcion", material.descripcion)
    onUpdateItem(
        index,
        "tipo_de_producto",
        family ? CONSUMIBLE_FAMILY_TIPO[family] : material.tipo_de_producto,
    )
}

export function rowFromMaterial(
    material: Materiales,
    extras: Pick<ConsumibleDisplayRow, "key" | "source" | "family" | "cableColor" | "selectable" | "isPlaceholder">,
): ConsumibleDisplayRow {
    return {
        ...extras,
        descripcion: material.descripcion,
        tipo_de_producto: extras.family
            ? CONSUMIBLE_FAMILY_TIPO[extras.family]
            : material.tipo_de_producto,
        cod_producto: material.cod_producto,
        unidad: material.unidad,
        cantidad: 1,
        precio_soles: Number(material.precio_soles),
        precio_soles_igv: Number(material.precio_soles_igv),
        precio_dolares: Number(material.precio_dolares),
        precio_dolares_igv: Number(material.precio_dolares_igv),
    }
}

export function matchesFamilyRow(
    row: ConsumibleDisplayRow,
    family: ConsumibleFamily,
    color?: CableFvColor | null,
) {
    if (row.family !== family) return false
    if (family === "cable_fv" && color) {
        return (row.cableColor ?? null) === color
    }
    return true
}
