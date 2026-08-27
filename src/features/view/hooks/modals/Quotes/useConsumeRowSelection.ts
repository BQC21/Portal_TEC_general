import { useMemo, useState } from "react"
import { ConsumeItem } from "@/lib/types/components/Quotes/manual_resources"
import { Materiales } from "@/lib/types/supabase/materiales-types"
import { ConsumibleTableRow, getConsumibleGroup } from "@/lib/utils/helpers/sorting/consumiblesSort"
import {
    buildConsumibleFamilyOptions,
    CableFvColor,
    CONSUMIBLE_FAMILY_LABEL,
    CONSUMIBLE_FAMILY_TIPO,
    ConsumibleFamily,
    ConsumibleLinkedFamily,
    ConsumibleSelectableFamily,
    extractCableFvDimension,
    extractInchSize,
    filterMaterialsByFamily,
    findCableFvMaterial,
    findMaterialByFamilyAndInch,
    getCableFvColor,
    getConsumibleFamily,
    isSelectableConsumibleFamily,
    SELECTABLE_CONSUMIBLE_FAMILIES,
} from "@/lib/utils/helpers/project_modals/consumibleRowSelector"

export type ConsumibleDisplayRow = ConsumibleTableRow & {
    family: ConsumibleFamily | null
    cableColor?: CableFvColor | null
    isPlaceholder?: boolean
    selectable: boolean
}

type UseConsumeRowSelectionArgs = {
    items: ConsumeItem[]
    sortedMateriales: ConsumibleTableRow[]
    materiales: Materiales[]
    onAddMaterial: (material: Materiales) => void
    onReplaceMaterial: (id: string | number, material: Materiales) => void
    onUpdateItem: (index: number, field: keyof ConsumeItem, value: ConsumeItem[keyof ConsumeItem]) => void
}

function applyTemplateMaterial(
    onUpdateItem: UseConsumeRowSelectionArgs["onUpdateItem"],
    index: number,
    material: Materiales,
) {
    onUpdateItem(index, "cod_producto", material.cod_producto)
    onUpdateItem(index, "descripcion", material.descripcion)
    onUpdateItem(index, "tipo_de_producto", material.tipo_de_producto)
}

function matchesFamilyRow(
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

export function useConsumeRowSelection({
    items,
    sortedMateriales,
    materiales,
    onAddMaterial,
    onReplaceMaterial,
    onUpdateItem,
}: UseConsumeRowSelectionArgs) {
    const [showExtraCableTierra, setShowExtraCableTierra] = useState(false)

    const displayRows = useMemo<ConsumibleDisplayRow[]>(() => {
        const existingRows: ConsumibleDisplayRow[] = sortedMateriales.map((row) => {
            const family = getConsumibleFamily(row.descripcion)
            const cableColor = family === "cable_fv" ? getCableFvColor(row.descripcion) : null
            return {
                ...row,
                family,
                cableColor,
                selectable: isSelectableConsumibleFamily(family),
            }
        })

        const presentFamilies = new Set(
            existingRows
                .map((row) => row.family)
                .filter((family): family is ConsumibleFamily => family !== null),
        )
        const hasCableFvColor = (color: CableFvColor) =>
            existingRows.some((row) => row.family === "cable_fv" && row.cableColor === color)

        const cableTierraCount = existingRows.filter((row) => row.family === "cable_tierra").length
        const placeholders: ConsumibleDisplayRow[] = []

        function pushPlaceholder(
            family: ConsumibleSelectableFamily,
            color?: CableFvColor,
            extraKey?: string,
        ) {
            if (filterMaterialsByFamily(materiales, family, color).length === 0) return

            const label = color
                ? `${CONSUMIBLE_FAMILY_LABEL[family]} ${color}`
                : CONSUMIBLE_FAMILY_LABEL[family]
            placeholders.push({
                key: `placeholder-${family}${color ? `-${color}` : ""}${extraKey ? `-${extraKey}` : ""}`,
                source: "template",
                family,
                cableColor: color ?? null,
                selectable: true,
                isPlaceholder: true,
                descripcion: label,
                tipo_de_producto: CONSUMIBLE_FAMILY_TIPO[family],
                cod_producto: "",
                unidad: "",
                cantidad: 0,
                precio_soles: 0,
                precio_soles_igv: 0,
                precio_dolares: 0,
                precio_dolares_igv: 0,
            })
        }

        for (const family of SELECTABLE_CONSUMIBLE_FAMILIES) {
            if (family === "cable_fv") {
                if (!hasCableFvColor("rojo")) pushPlaceholder(family, "rojo")
                if (!hasCableFvColor("negro")) pushPlaceholder(family, "negro")
                continue
            }

            if (family === "cable_tierra") {
                if (cableTierraCount === 0) pushPlaceholder(family)
                if (cableTierraCount < 2 && showExtraCableTierra) {
                    pushPlaceholder(family, undefined, "extra")
                }
                continue
            }

            if (!presentFamilies.has(family)) {
                pushPlaceholder(family)
            }
        }

        const groupedRows = [...existingRows]
        for (const placeholder of placeholders) {
            const placeholderOrder = getConsumibleGroup(placeholder.tipo_de_producto).order
            let insertAt = groupedRows.length
            for (let index = groupedRows.length - 1; index >= 0; index -= 1) {
                if (getConsumibleGroup(groupedRows[index].tipo_de_producto).order <= placeholderOrder) {
                    insertAt = index + 1
                    break
                }
                insertAt = 0
            }
            groupedRows.splice(insertAt, 0, placeholder)
        }

        return groupedRows
    }, [materiales, showExtraCableTierra, sortedMateriales])

    const materialIdByCode = useMemo(() => {
        const map = new Map<string, string>()
        for (const material of materiales) {
            map.set(material.cod_producto, String(material.id))
        }
        return map
    }, [materiales])

    function getCurrentMaterialId(row: ConsumibleDisplayRow): string {
        if (!row.cod_producto) return ""
        return materialIdByCode.get(row.cod_producto) ?? ""
    }

    function getRowOptions(row: ConsumibleDisplayRow) {
        if (!isSelectableConsumibleFamily(row.family)) return []

        const currentMaterialId = getCurrentMaterialId(row)
        const selectedIds = new Set(
            displayRows
                .filter((item) => item.key !== row.key)
                .map((item) => getCurrentMaterialId(item))
                .filter(Boolean),
        )

        return buildConsumibleFamilyOptions(
            row.family,
            materiales,
            selectedIds,
            currentMaterialId,
            row.family === "cable_fv" ? row.cableColor : null,
        )
    }

    function applyToRow(row: ConsumibleDisplayRow, material: Materiales) {
        if (row.isPlaceholder) {
            onAddMaterial(material)
            return
        }

        if (row.source === "catalog" && row.catalogId != null) {
            onReplaceMaterial(row.catalogId, material)
            const templateIndex = items.findIndex((item) => item.cod_producto === row.cod_producto)
            if (templateIndex >= 0) {
                applyTemplateMaterial(onUpdateItem, templateIndex, material)
            }
            return
        }

        if (row.templateIndex != null) {
            applyTemplateMaterial(onUpdateItem, row.templateIndex, material)
        }
    }

    function applyToFamilyRows(
        family: ConsumibleFamily,
        material: Materiales,
        color?: CableFvColor | null,
    ) {
        const matchingRows = displayRows.filter((row) => matchesFamilyRow(row, family, color))
        if (matchingRows.length === 0) {
            onAddMaterial(material)
            return
        }
        matchingRows.forEach((row) => applyToRow(row, material))
    }

    function syncLinkedInchFamily(family: ConsumibleLinkedFamily, inchSize: string) {
        const linkedMaterial = findMaterialByFamilyAndInch(materiales, family, inchSize)
        if (!linkedMaterial) return
        applyToFamilyRows(family, linkedMaterial)
    }

    function syncCableFvDimension(dimension: string) {
        ;(["rojo", "negro"] as const).forEach((color) => {
            const linkedMaterial = findCableFvMaterial(materiales, dimension, color)
            if (!linkedMaterial) return
            applyToFamilyRows("cable_fv", linkedMaterial, color)
        })
    }

    function handleRowMaterialChange(row: ConsumibleDisplayRow, materialId: string) {
        if (!materialId) return

        const selected = materiales.find((item) => String(item.id) === materialId)
        if (!selected) return

        const family = row.family ?? getConsumibleFamily(selected.descripcion)

        if (family === "conduit_flexible") {
            applyToRow(row, selected)
            const inchSize = extractInchSize(selected.descripcion)
            if (inchSize) {
                syncLinkedInchFamily("abrazadera", inchSize)
                syncLinkedInchFamily("prensaestopa", inchSize)
            }
            return
        }

        if (family === "cable_fv") {
            const dimension = extractCableFvDimension(selected.descripcion)
            if (dimension) {
                syncCableFvDimension(dimension)
                return
            }
        }

        applyToRow(row, selected)
        if (row.family === "cable_tierra" && row.isPlaceholder) {
            setShowExtraCableTierra(false)
        }
    }

    const cableTierraCount = displayRows.filter((row) =>
        row.family === "cable_tierra" && !row.isPlaceholder,
    ).length
    const unusedCableTierra = filterMaterialsByFamily(materiales, "cable_tierra")
        .filter((material) => {
            const used = displayRows.some((row) =>
                row.family === "cable_tierra" && row.cod_producto === material.cod_producto,
            )
            return !used
        })
    const canAddCableTierra = cableTierraCount === 1 && !showExtraCableTierra && unusedCableTierra.length > 0

    return {
        displayRows,
        getRowOptions,
        getCurrentMaterialId,
        handleRowMaterialChange,
        canAddCableTierra,
        onAddCableTierra: () => setShowExtraCableTierra(true),
    }
}
