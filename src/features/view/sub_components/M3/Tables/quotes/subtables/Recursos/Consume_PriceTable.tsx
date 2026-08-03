"use client"

import { useMemo, useState } from "react"
import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField"
import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField"
import { PlusIcon } from "@/features/view/components/Icons/PlusIcon"
import { TrashIcon } from "@/features/view/components/Icons/TrashIcon"
import { useMateriales } from "@/features/view/hooks/services/useRealtimeMateriales"
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join"
import { Materiales } from "@/lib/types/supabase/materiales-types"
import { formatCurrency } from "@/lib/utils/normalization"

export type Consume_PriceTable_props = {
    selected_materiales: Project_Materiales[]
    onUpdateCantidad: (id: string | number, cantidad: number) => void
    onAddMaterial: (material: Materiales) => void
    onRemoveMaterial: (id: string | number) => void
}

export function Consume_PriceTable({
        selected_materiales,
        onUpdateCantidad,
        onAddMaterial,
        onRemoveMaterial,
    }: Consume_PriceTable_props){
    const { materiales } = useMateriales()
    const [materialToAdd, setMaterialToAdd] = useState("")

    const availableMaterialOptions = useMemo(() => {
        const selectedIds = new Set(
            selected_materiales.map((item) => String(item.material_id)),
        )

        return [
            { value: "", label: "Seleccione un material" },
            ...materiales
                .filter((material) => !selectedIds.has(String(material.id)))
                .map((material) => ({
                    value: String(material.id),
                    label: `${material.cod_producto} — ${material.descripcion}`,
                })),
        ]
    }, [materiales, selected_materiales])

    function handleAddMaterial() {
        if (!materialToAdd) return

        const material = materiales.find((item) => String(item.id) === materialToAdd)
        if (!material) return

        onAddMaterial(material)
        setMaterialToAdd("")
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
                                    {selected_materiales.length > 0 ? (
                                        selected_materiales.map((item) => (
                                            <tr key={`${item.id}`} className="bg-white">
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {item.material_info?.cod_producto}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {item.material_info?.descripcion}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {item.material_info?.unidad}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    <AddProductNumberField
                                                        label="Cantidad"
                                                        value={Number(item.cantidad)}
                                                        min={0}
                                                        step={0.01}
                                                        onChange={(value) => onUpdateCantidad(item.id, value)}
                                                    />
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(Number(item.material_info?.precio_soles), "PEN")}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(Number(item.material_info?.precio_soles_igv), "PEN")}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(Number(item.material_info?.precio_dolares), "USD")}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(Number(item.material_info?.precio_dolares_igv), "USD")}
                                                </td>
                                                {/* Cálculo automático */}
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(Number(item.material_info?.precio_soles)*Number(item.cantidad), "PEN")}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(Number(item.material_info?.precio_soles_igv)*Number(item.cantidad), "PEN")}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(Number(item.material_info?.precio_dolares)*Number(item.cantidad), "USD")}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(Number(item.material_info?.precio_dolares_igv)*Number(item.cantidad), "USD")}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    <button
                                                        type="button"
                                                        onClick={() => onRemoveMaterial(item.id)}
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
                        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-end">
                            <div className="min-w-0 flex-1">
                                <AddProductSelectField
                                    label="Agregar material"
                                    value={materialToAdd}
                                    options={availableMaterialOptions}
                                    onChange={setMaterialToAdd}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAddMaterial}
                                disabled={!materialToAdd}
                                className="table-icon-button"
                                aria-label="Agregar ítem"
                            >
                                <PlusIcon />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
