"use client"

import { Fragment, useMemo, useState } from "react"
import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField"
import { PlusIcon } from "@/features/view/components/Icons/PlusIcon"
import { TrashIcon } from "@/features/view/components/Icons/TrashIcon"
import { useMateriales } from "@/features/view/hooks/services/useRealtimeMateriales"
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join"
import { Materiales } from "@/lib/types/supabase/materiales-types"
import { formatCurrency } from "@/lib/utils/normalization"
import {
    buildSortedConsumibles,
    ConsumibleGroupKey,
    getConsumibleGroup,
    groupConsumibleRows,
} from "@/lib/utils/helpers/sorting/consumiblesSort"
import { ConsumeItem } from "@/lib/types/components/Quotes/manual_resources"
import {
    ConsumibleDisplayRow,
    useConsumeRowSelection,
} from "@/features/view/hooks/modals/Quotes/useConsumeRowSelection"
import {
    CONSUMIBLE_EXTRA_ADD_LABEL,
    CONSUMIBLE_FAMILY_LABEL,
    CONSUMIBLE_FAMILY_TIPO,
    CONSUMIBLE_RESTORE_LABEL,
    ConsumibleRestorableFamily,
    isExtraConsumibleFamily,
    isSelectableConsumibleFamily,
    RESTORABLE_CONSUMIBLE_FAMILIES,
} from "@/lib/utils/helpers/project_modals/consumibleRowSelector"


export type Consume_PriceTable_props = {
    items: ConsumeItem[]
    selected_materiales: Project_Materiales[]
    onUpdateCantidad: (id: string | number, cantidad: number) => void
    onAddMaterial: (material: Materiales) => void
    onReplaceMaterial: (id: string | number, material: Materiales) => void
    onRemoveMaterial: (id: string | number) => void
    onAddConsumeItem: (item: Omit<ConsumeItem, "id">) => void
    onUpdateItem: (index: number, field: keyof ConsumeItem, value: ConsumeItem[keyof ConsumeItem]) => void
    onRemoveItem: (index: number) => void
}

function restoreFamiliesForGroup(groupKey: ConsumibleGroupKey): ConsumibleRestorableFamily[] {
    return RESTORABLE_CONSUMIBLE_FAMILIES.filter(
        (family) => getConsumibleGroup(CONSUMIBLE_FAMILY_TIPO[family]).key === groupKey,
    )
}

function GroupChevron({ collapsed }: { collapsed: boolean }) {
    return (
        <svg
            className={`h-5 w-5 shrink-0 text-slate-700 transition-transform ${collapsed ? "" : "rotate-180"}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
        >
            <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
            />
        </svg>
    )
}

function ConsumibleFamilySelect({
    row,
    options,
    value,
    onChange,
}: {
    row: ConsumibleDisplayRow
    options: { value: string; label: string }[]
    value: string
    onChange: (value: string) => void
}) {
    const familyLabel = isSelectableConsumibleFamily(row.family)
        ? CONSUMIBLE_FAMILY_LABEL[row.family]
        : "Consumible"
    const colorSuffix = row.cableColor ? ` ${row.cableColor}` : ""
    const resolvedValue = options.some((option) => option.value === value)
        ? value
        : (options[0]?.value ?? "")

    return (
        <select
            aria-label={`Seleccionar ${familyLabel}${colorSuffix}`}
            value={resolvedValue}
            onChange={(event) => onChange(event.target.value)}
            className="input-focus w-full min-w-[16rem] rounded-xl border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 transition"
        >
            {options.map((option) => (
                <option key={option.value || option.label} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}

export function Consume_PriceTable({
        items,
        selected_materiales,
        onUpdateCantidad,
        onAddMaterial,
        onReplaceMaterial,
        onRemoveMaterial,
        onAddConsumeItem,
        onUpdateItem,
        onRemoveItem,
    }: Consume_PriceTable_props){
    const { materiales } = useMateriales()
    const [collapsedGroups, setCollapsedGroups] = useState<Set<ConsumibleGroupKey>>(new Set())

    const sortedMateriales = useMemo(
        () => buildSortedConsumibles(selected_materiales, items, materiales),
        [selected_materiales, items, materiales],
    )

    const {
        displayRows,
        getRowOptions,
        getCurrentMaterialId,
        handleRowMaterialChange,
        canAddExtraFamily,
        canRestoreFamily,
        onAddExtraFamily,
    } = useConsumeRowSelection({
        items,
        sortedMateriales,
        materiales,
        onAddMaterial,
        onReplaceMaterial,
        onAddConsumeItem,
        onUpdateItem,
    })

    const groupedRows = useMemo(() => groupConsumibleRows(displayRows), [displayRows])

    function toggleGroup(key: ConsumibleGroupKey) {
        setCollapsedGroups((current) => {
            const next = new Set(current)
            if (next.has(key)) next.delete(key)
            else next.add(key)
            return next
        })
    }

    return(
        <>
            <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Costos de Consumibles</h2>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10 bg-slate-100">
                                <tr className="bg-slate-400 text-left">
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        COD PROD
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Descripción
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Unidad
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.2rem] font-bold text-slate-900">
                                        Cantidad
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio Unidad (s/.)
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio Unidad (s/.) + IGV
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio Unidad ($)
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio Unidad ($) + IGV
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio Total (s/.)
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio Total (s/.) + IGV
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio Total ($)
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio Total ($) + IGV
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                    {groupedRows.length > 0 ? (
                                        groupedRows.map(({ meta, rows }) => {
                                            const collapsed = collapsedGroups.has(meta.key)
                                            const restoreFamilies = restoreFamiliesForGroup(meta.key)
                                                .filter((family) => canRestoreFamily(family))

                                            return (
                                                <Fragment key={`group-${meta.key}`}>
                                                    <tr key={`group-${meta.key}`} className={meta.headerClass}>
                                                        <td
                                                            colSpan={13}
                                                            className="border-b border-slate-200 px-4 py-3"
                                                        >
                                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleGroup(meta.key)}
                                                                    aria-expanded={!collapsed}
                                                                    className="inline-flex items-center gap-2 text-left text-base font-bold text-slate-900"
                                                                >
                                                                    <GroupChevron collapsed={collapsed} />
                                                                    <span>
                                                                        {meta.label} ({rows.length})
                                                                    </span>
                                                                </button>
                                                                {restoreFamilies.length > 0 ? (
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        {restoreFamilies.map((family) => (
                                                                            <button
                                                                                key={family}
                                                                                type="button"
                                                                                onClick={() => onAddExtraFamily(family)}
                                                                                className="inline-flex items-center gap-1 rounded-lg border border-slate-400 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                                                                            >
                                                                                <PlusIcon />
                                                                                {CONSUMIBLE_RESTORE_LABEL[family]}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {collapsed ? null : rows.map((item) => (
                                            <tr
                                                key={item.key}
                                                className={getConsumibleGroup(item.tipo_de_producto).rowClass}
                                            >
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {item.cod_producto || "—"}
                                                </td>
                                                <td className="border-b border-slate-200 px-5 py-5 font-medium">
                                                    {item.selectable ? (
                                                        <div className="flex min-w-[16rem] items-end gap-2">
                                                            <div className="min-w-0 flex-1">
                                                                <ConsumibleFamilySelect
                                                                    row={item}
                                                                    options={getRowOptions(item)}
                                                                    value={getCurrentMaterialId(item)}
                                                                    onChange={(value) =>
                                                                        handleRowMaterialChange(item, value)
                                                                    }
                                                                />
                                                            </div>
                                                            {isExtraConsumibleFamily(item.family)
                                                                && canAddExtraFamily(item.family) ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        if (isExtraConsumibleFamily(item.family)) {
                                                                            onAddExtraFamily(item.family)
                                                                        }
                                                                    }}
                                                                    className="table-icon-button"
                                                                    aria-label={
                                                                        CONSUMIBLE_EXTRA_ADD_LABEL[item.family]
                                                                    }
                                                                >
                                                                    <PlusIcon />
                                                                </button>
                                                            ) : null}
                                                        </div>
                                                    ) : (
                                                        item.descripcion
                                                    )}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {item.unidad || "—"}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {item.isPlaceholder && !item.cod_producto ? (
                                                        "—"
                                                    ) : (
                                                        <AddProductNumberField
                                                            label=""
                                                            value={Number(item.cantidad)}
                                                            min={0}
                                                            step={0.01}
                                                            onChange={(value) => {
                                                                if (item.source === "catalog" && item.catalogId != null) {
                                                                    onUpdateCantidad(item.catalogId, value)
                                                                    return
                                                                }
                                                                if (item.templateIndex != null) {
                                                                    onUpdateItem(item.templateIndex, "cantidad", value)
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(Number(item.precio_soles), "PEN")}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(Number(item.precio_soles_igv), "PEN")}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(Number(item.precio_dolares), "USD")}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(Number(item.precio_dolares_igv), "USD")}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(Number(item.precio_soles)*Number(item.cantidad), "PEN")}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(Number(item.precio_soles_igv)*Number(item.cantidad), "PEN")}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(Number(item.precio_dolares)*Number(item.cantidad), "USD")}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(Number(item.precio_dolares_igv)*Number(item.cantidad), "USD")}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {item.isPlaceholder ? null : (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (item.source === "catalog" && item.catalogId != null) {
                                                                    onRemoveMaterial(item.catalogId)
                                                                    return
                                                                }
                                                                if (item.templateIndex != null) {
                                                                    onRemoveItem(item.templateIndex)
                                                                }
                                                            }}
                                                            className="table-icon-button"
                                                            aria-label="Eliminar ítem"
                                                        >
                                                            <TrashIcon />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                                    ))}
                                                </Fragment>
                                            )
                                        })
                                    ) : (
                                        <tr className="bg-white">
                                            <td colSpan={13} className="px-4 py-10 text-center text-slate-500">
                                                No hay consumibles seleccionados todavía.
                                            </td>
                                        </tr>
                                    )}

                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </>
    )
}
