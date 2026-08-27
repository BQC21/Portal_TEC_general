import { ConsumibleSortableRow, ConsumibleTableRow } from "@/lib/types/components/Quotes/consumible_tableRow"
import { ConsumeItem } from "@/lib/types/components/Quotes/manual_resources"
import { Materiales } from "@/lib/types/supabase/materiales-types"
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join"
import {
    CableFvColor,
    ConsumibleFamily,
    getCableFvColor,
    getCanalizacionSortOrder,
    getConsumibleFamily,
    resolveConsumibleTipo,
} from "@/lib/utils/helpers/project_modals/consumibleRowSelector"

// Colorear grupo de material
export function getConsumibleGroup(tipo?: string) {
    if (tipo === "PROTECCIÓN") return { order: 0, rowClass: "bg-yellow-100" }
    if (tipo === "CANALIZACIÓN") return { order: 1, rowClass: "bg-blue-100" }
    return { order: 2, rowClass: "bg-green-100" }
}

// Comparar materiales 
export function compareConsumibleRows(
    a: ConsumibleSortableRow,
    b: ConsumibleSortableRow,
    templateOrder: Map<string, number>,
): number {
    const groupDelta =
        getConsumibleGroup(a.tipo_de_producto).order
        - getConsumibleGroup(b.tipo_de_producto).order
    if (groupDelta !== 0) return groupDelta

    const familyA = a.family ?? getConsumibleFamily(a.descripcion)
    const familyB = b.family ?? getConsumibleFamily(b.descripcion)
    const canalA = getCanalizacionSortOrder(familyA)
    const canalB = getCanalizacionSortOrder(familyB)
    if (canalA != null || canalB != null) {
        const orderA = canalA ?? 50
        const orderB = canalB ?? 50
        if (orderA !== orderB) return orderA - orderB
    }

    const colorA = a.cableColor ?? (familyA === "cable_fv" ? getCableFvColor(a.descripcion) : null)
    const colorB = b.cableColor ?? (familyB === "cable_fv" ? getCableFvColor(b.descripcion) : null)
    if (colorA && colorB && colorA !== colorB) {
        return colorA === "rojo" ? -1 : 1
    }

    const orderA = templateOrder.get(a.cod_producto) ?? Number.MAX_SAFE_INTEGER
    const orderB = templateOrder.get(b.cod_producto) ?? Number.MAX_SAFE_INTEGER
    if (orderA !== orderB) return orderA - orderB

    return a.cod_producto.localeCompare(b.cod_producto)
}

// Ordenar los materiales
export function buildSortedConsumibles(
    selected_materiales: Project_Materiales[],
    items: ConsumeItem[],
    materiales: Materiales[],
): ConsumibleTableRow[] {
    const selectedCodes = new Set(
        selected_materiales
            .map((item) => item.material_info?.cod_producto)
            .filter((code): code is string => Boolean(code)),
    )
    const templateOrder = new Map(items.map((item, index) => [item.cod_producto, index]))
    const materialesByCode = new Map(materiales.map((item) => [item.cod_producto, item]))

    const catalogRows: ConsumibleTableRow[] = selected_materiales.map((item) => ({
        key: `catalog-${item.id}`,
        source: "catalog",
        catalogId: item.id,
        cod_producto: item.material_info?.cod_producto ?? "",
        descripcion: item.material_info?.descripcion ?? "",
        tipo_de_producto: resolveConsumibleTipo(
            item.material_info?.descripcion ?? "",
            item.material_info?.tipo_de_producto,
        ),
        unidad: item.material_info?.unidad ?? "",
        cantidad: Number(item.cantidad),
        precio_soles: Number(item.material_info?.precio_soles),
        precio_soles_igv: Number(item.material_info?.precio_soles_igv),
        precio_dolares: Number(item.material_info?.precio_dolares),
        precio_dolares_igv: Number(item.material_info?.precio_dolares_igv),
    }))

    const templateRows: ConsumibleTableRow[] = items.flatMap((item, index) => {
        if (selectedCodes.has(item.cod_producto)) return []

        const catalogMaterial = materialesByCode.get(item.cod_producto)

        return [{
            key: `template-${item.id}`,
            source: "template" as const,
            templateIndex: index,
            cod_producto: item.cod_producto,
            descripcion: catalogMaterial?.descripcion ?? item.descripcion,
            tipo_de_producto: resolveConsumibleTipo(
                catalogMaterial?.descripcion ?? item.descripcion,
                item.tipo_de_producto || catalogMaterial?.tipo_de_producto,
            ),
            unidad: catalogMaterial?.unidad ?? "",
            cantidad: Number(item.cantidad),
            precio_soles: Number(catalogMaterial?.precio_soles ?? 0),
            precio_soles_igv: Number(catalogMaterial?.precio_soles_igv ?? 0),
            precio_dolares: Number(catalogMaterial?.precio_dolares ?? 0),
            precio_dolares_igv: Number(catalogMaterial?.precio_dolares_igv ?? 0),
        }]
    })

    return [...catalogRows, ...templateRows].sort((a, b) =>
        compareConsumibleRows(a, b, templateOrder),
    )
}
