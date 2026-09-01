import { useMemo } from "react"
import { consumible_template } from "@/features/view/sub_components/M3/Tables/quotes/templates/Prices"
import { ConsumeItem } from "@/lib/types/components/Quotes/manual_resources"
import { ConsumibleTableRow } from "@/lib/types/components/Quotes/consumible_tableRow"
import { Materiales } from "@/lib/types/supabase/materiales-types"
import { compareConsumibleRows } from "@/lib/utils/helpers/sorting/consumiblesSort"
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join"
import {
    buildConsumibleFamilyOptions,
    CableFvColor,
    CONSUMIBLE_FAMILY_LABEL,
    CONSUMIBLE_FAMILY_TIPO,
    ConsumibleAddableFamily,
    ConsumibleExtraFamily,
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
    getDefaultMaterialForFamily,
    isAddableConsumibleFamily,
    isDefaultInsertedFamily,
    isItmAcDescription,
    isExtraConsumibleFamily,
    isRestorableConsumibleFamily,
    isSelectableConsumibleFamily,
    matchesFamilySize,
    SELECTABLE_CONSUMIBLE_FAMILIES,
} from "@/lib/utils/helpers/project_modals/consumibleRowSelector"

function countSelectedInverters(equipos: Project_Equipos[]): number {
    return equipos.reduce((sum, item) => {
        const tipo = (item.equipo_info?.tipo_de_producto ?? "").toUpperCase()
        if (tipo !== "INVERSOR") return sum
        const qty = Number(item.cantidad)
        return sum + (Number.isFinite(qty) && qty > 0 ? qty : 1)
    }, 0)
}

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
    selectedEquipos?: Project_Equipos[]
    onAddMaterial: (material: Materiales, cantidad?: number) => void
    onReplaceMaterial: (id: string | number, material: Materiales) => void
    onAddConsumeItem?: (item: Omit<ConsumeItem, "id">) => void
    onUpdateItem: (index: number, field: keyof ConsumeItem, value: ConsumeItem[keyof ConsumeItem]) => void
}

function applyTemplateMaterial(
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

function rowFromMaterial(
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
    selectedEquipos = [],
    onAddMaterial,
    onReplaceMaterial,
    onAddConsumeItem,
    onUpdateItem,
}: UseConsumeRowSelectionArgs) {
    const inverterCount = countSelectedInverters(selectedEquipos)
    const templateOrder = useMemo(
        () => new Map(items.map((item, index) => [item.cod_producto, index])),
        [items],
    )

    const displayRows = useMemo<ConsumibleDisplayRow[]>(() => {
        const existingRows: ConsumibleDisplayRow[] = sortedMateriales.map((row) => {
            const family = getConsumibleFamily(row.descripcion)
            const cableColor = family === "cable_fv" ? getCableFvColor(row.descripcion) : null
            return {
                ...row,
                family,
                cableColor,
                tipo_de_producto: family ? CONSUMIBLE_FAMILY_TIPO[family] : row.tipo_de_producto,
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

        const usedCodes = new Set(
            existingRows.map((row) => row.cod_producto).filter(Boolean),
        )
        const placeholders: ConsumibleDisplayRow[] = []

        function pushPlaceholder(
            family: ConsumibleSelectableFamily,
            color?: CableFvColor,
        ) {
            const defaultMaterial = isDefaultInsertedFamily(family)
                ? getDefaultMaterialForFamily(materiales, family, color, usedCodes)
                : undefined

            if (defaultMaterial) {
                usedCodes.add(defaultMaterial.cod_producto)
                placeholders.push(rowFromMaterial(defaultMaterial, {
                    key: `placeholder-${family}${color ? `-${color}` : ""}`,
                    source: "template",
                    family,
                    cableColor: color ?? null,
                    selectable: true,
                    isPlaceholder: true,
                }))
                return
            }

            if (
                filterMaterialsByFamily(materiales, family, color)
                    .filter((material) => matchesFamilySize(family, material.descripcion))
                    .length === 0
            ) {
                return
            }

            const label = color
                ? `${CONSUMIBLE_FAMILY_LABEL[family]} ${color}`
                : CONSUMIBLE_FAMILY_LABEL[family]
            placeholders.push({
                key: `placeholder-${family}${color ? `-${color}` : ""}`,
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

            if (isExtraConsumibleFamily(family)) {
                if (!isRestorableConsumibleFamily(family) && !presentFamilies.has(family)) {
                    pushPlaceholder(family)
                }
                continue
            }

            if (!presentFamilies.has(family)) {
                pushPlaceholder(family)
            }
        }

        return [...existingRows, ...placeholders].sort((a, b) =>
            compareConsumibleRows(a, b, templateOrder),
        )
    }, [materiales, sortedMateriales, templateOrder])

    const materialIdByCode = useMemo(() => {
        const map = new Map<string, string>()
        for (const material of materiales) {
            map.set(material.cod_producto, String(material.id))
        }
        return map
    }, [materiales])

    function getAssignedMaterialId(row: ConsumibleDisplayRow): string {
        if (!row.cod_producto) return ""
        return materialIdByCode.get(row.cod_producto) ?? ""
    }

    function getCurrentMaterialId(row: ConsumibleDisplayRow): string {
        const assigned = getAssignedMaterialId(row)
        if (assigned) return assigned

        const family = row.family
        if (!isSelectableConsumibleFamily(family)) return ""

        const selectedIds = new Set(
            displayRows
                .filter((item) => item.key !== row.key)
                .map(getAssignedMaterialId)
                .filter(Boolean),
        )
        const usedCodes = new Set(
            displayRows
                .filter((item) => item.key !== row.key && item.cod_producto)
                .map((item) => item.cod_producto),
        )
        const color = family === "cable_fv" ? row.cableColor : null
        const defaultMaterial = getDefaultMaterialForFamily(materiales, family, color, usedCodes)
        if (defaultMaterial && !selectedIds.has(String(defaultMaterial.id))) {
            return String(defaultMaterial.id)
        }

        const firstAvailable = filterMaterialsByFamily(materiales, family, color).find((material) =>
            !selectedIds.has(String(material.id))
            && matchesFamilySize(family, material.descripcion),
        )

        return firstAvailable ? String(firstAvailable.id) : ""
    }

    function getRowOptions(row: ConsumibleDisplayRow) {
        if (!isSelectableConsumibleFamily(row.family)) return []

        const currentMaterialId = getCurrentMaterialId(row)
        const selectedIds = new Set(
            displayRows
                .filter((item) => item.key !== row.key)
                .map(getAssignedMaterialId)
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

        if (family === "conduit") {
            applyToRow(row, selected)
            const inchSize = extractInchSize(selected.descripcion)
            if (inchSize) {
                syncLinkedInchFamily("curva", inchSize)
                syncLinkedInchFamily("union", inchSize)
                syncLinkedInchFamily("conector", inchSize)
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
    }

    function unusedMaterialsForFamily(family: ConsumibleAddableFamily) {
        return filterMaterialsByFamily(materiales, family).filter((material) => {
            if (family === "itm_ac" && !isItmAcDescription(material.descripcion)) return false
            return !displayRows.some((row) =>
                row.family === family && row.cod_producto === material.cod_producto,
            )
        })
    }

    function unusedTemplateItemsForFamily(family: ConsumibleAddableFamily) {
        return consumible_template.filter((item) => {
            if (getConsumibleFamily(item.descripcion) !== family) return false
            if (family === "itm_ac" && !isItmAcDescription(item.descripcion)) return false
            return !displayRows.some((row) => row.cod_producto === item.cod_producto)
        })
    }

    function hasUnusedExtraFamilyItems(family: ConsumibleAddableFamily) {
        return unusedMaterialsForFamily(family).length > 0
            || unusedTemplateItemsForFamily(family).length > 0
    }

    function canAddExtraFamily(family: ConsumibleFamily | null): family is ConsumibleAddableFamily {
        if (!isAddableConsumibleFamily(family)) return false

        const visibleCount = displayRows.filter((row) => row.family === family).length
        if (family === "itm_ac") {
            return inverterCount > 1
                && visibleCount === 1
                && hasUnusedExtraFamilyItems(family)
        }

        return visibleCount >= 1 && hasUnusedExtraFamilyItems(family)
    }

    function canRestoreFamily(family: ConsumibleExtraFamily) {
        if (!isRestorableConsumibleFamily(family)) return false
        const visibleCount = displayRows.filter((row) =>
            row.family === family && !row.isPlaceholder,
        ).length
        return visibleCount === 0 && hasUnusedExtraFamilyItems(family)
    }

    function onAddExtraFamily(family: ConsumibleAddableFamily) {
        const usedCodes = new Set(
            displayRows
                .filter((row) => row.family === family && row.cod_producto)
                .map((row) => row.cod_producto),
        )
        const placeholder = displayRows.find((row) => row.family === family && row.isPlaceholder)
        if (placeholder) {
            const currentId = getCurrentMaterialId(placeholder)
            const current = materiales.find((item) => String(item.id) === currentId)
            if (current) {
                onAddMaterial(current)
                usedCodes.add(current.cod_producto)
            }
        }

        const nextMaterial = getDefaultMaterialForFamily(materiales, family, null, usedCodes)
        if (nextMaterial) {
            onAddMaterial(nextMaterial)
            return
        }

        const nextTemplate = unusedTemplateItemsForFamily(family)[0]
        if (nextTemplate && onAddConsumeItem) {
            onAddConsumeItem({
                cod_producto: nextTemplate.cod_producto,
                descripcion: nextTemplate.descripcion,
                tipo_de_producto: nextTemplate.tipo_de_producto,
                cantidad: nextTemplate.cantidad,
            })
        }
    }

    return {
        displayRows,
        getRowOptions,
        getCurrentMaterialId,
        handleRowMaterialChange,
        canAddExtraFamily,
        canRestoreFamily,
        onAddExtraFamily,
    }
}
