"use client"

import { useMemo, useState } from "react"
import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField"
import { TrashIcon } from "@/features/view/components/Icons/TrashIcon"
import { useMateriales } from "@/features/view/hooks/services/useRealtimeMateriales"
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join"
import { Materiales } from "@/lib/types/supabase/materiales-types"
import { formatCurrency } from "@/lib/utils/normalization"
import { buildSortedConsumibles, getConsumibleGroup } from "@/lib/utils/helpers/sorting/consumiblesSort"
import { SelectionRow } from "@/features/view/components/Form_fields/AddSelectionRow"
import { ConsumeSelector } from "@/features/view/hooks/modals/Quotes/useConsumeSelector"
import { materialRows } from "@/lib/utils/helpers/project_modals/rows"
import { ConsumeItem } from "@/lib/types/components/Quotes/manual_resources"


export type Consume_PriceTable_props = {
    items: ConsumeItem[]
    selected_materiales: Project_Materiales[]
    onUpdateCantidad: (id: string | number, cantidad: number) => void
    onAddMaterial: (material: Materiales) => void
    onRemoveMaterial: (id: string | number) => void
    onUpdateItem: (index: number, field: keyof ConsumeItem, value: ConsumeItem[keyof ConsumeItem]) => void
    onRemoveItem: (index: number) => void
}

export function Consume_PriceTable({
        items,
        selected_materiales,
        onUpdateCantidad,
        onAddMaterial,
        onRemoveMaterial,
        onUpdateItem,
        onRemoveItem,
    }: Consume_PriceTable_props){
    const { materiales } = useMateriales()
    const [selectedMaterialByRow, setSelectedMaterialByRow] = useState<
        Record<string, { materialId: string }>
    >({})

    function handleMaterialChange(value: string, label: string, index: number) {
        const key = `${label}-${index}`
        if (!value) {
            setSelectedMaterialByRow((prev) => {
                const next = { ...prev }
                delete next[key]
                return next
            })
            return
        }
        setSelectedMaterialByRow((prev) => ({
            ...prev,
            [key]: { materialId: value },
        }))
    }

    function handleMaterialAdd(label: string, index: number) {
        const selectedId = selectedMaterialByRow[`${label}-${index}`]?.materialId
        if (!selectedId) return

        const material = materiales.find((item) => String(item.id) === selectedId)
        if (!material) return

        onAddMaterial(material)
        setSelectedMaterialByRow((prev) => {
            const next = { ...prev }
            delete next[`${label}-${index}`]
            return next
        })
    }

    // -----------------------------
    // ORDENAMIENTO DE CONSUMIBLES
    // -----------------------------
    const sortedMateriales = useMemo(
        () => buildSortedConsumibles(selected_materiales, items, materiales),
        [selected_materiales, items, materiales],
    );

    return(
        <>
            <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Costos de Consumibles</h2>
                    {/* <p className="text-2xl font-bold text-slate-900">¡No olvidar el cable a tierra! ⚠️ </p> */}
                    <div>
                        <h2 className="mt-10 mb-10 text-2xl font-bold text-slate-900">Selección de materiales</h2>
                        <div className="flex flex-col gap-4">
                            {materialRows.map((label, index) => {
                                const material_filteredOptions = ConsumeSelector(
                                    label,
                                    selected_materiales,
                                    materiales,
                                );

                                return (
                                    <SelectionRow
                                        key={`material-row-${label}-${index}`}
                                        label={label}
                                        buttonLabel="Agregar"
                                        value={selectedMaterialByRow[`${label}-${index}`]?.materialId || ""}
                                        options={material_filteredOptions}
                                        onChange={(value) => handleMaterialChange(value, label, index)}
                                        onClick={() => handleMaterialAdd(label, index)}
                                    />
                                );
                            })}
                        </div>
                    </div>
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
                                    {sortedMateriales.length > 0 ? (
                                        sortedMateriales.map((item) => (
                                            <tr
                                                key={item.key}
                                                className={getConsumibleGroup(item.tipo_de_producto).rowClass}
                                            >
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {item.cod_producto}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {item.descripcion}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {item.unidad}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    <AddProductNumberField
                                                        label="Cantidad"
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
                                                {/* Cálculo automático */}
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
                                                </td>
                                            </tr>
                                        ))
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
