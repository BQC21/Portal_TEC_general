"use client"

import { useMemo, useState } from "react"
import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField"
import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField"
import { PlusIcon } from "@/features/view/components/Icons/PlusIcon"
import { TrashIcon } from "@/features/view/components/Icons/TrashIcon"
import { useEquipos } from "@/features/view/hooks/services/useRealtimeEquipos"
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join"
import { Equipos } from "@/lib/types/supabase/equipos-types"
import { formatCurrency } from "@/lib/utils/normalization"

export type EP_PriceTable_props = {
    selected_equipos: Project_Equipos[]
    onUpdateCantidad: (id: string | number, cantidad: number) => void
    onAddEquipo: (equipo: Equipos) => void
    onRemoveEquipo: (id: string | number) => void
}

export function EP_PriceTable({
    selected_equipos,
    onUpdateCantidad,
    onAddEquipo,
    onRemoveEquipo,
    }: EP_PriceTable_props){
    const { equipos } = useEquipos()
    const [equipoToAdd, setEquipoToAdd] = useState("")

    const principalEquipos = useMemo(
        () => selected_equipos.filter((item) => item.equipo_info?.tipo_de_producto !== "ESTRUCTURA"),
        [selected_equipos],
    )

    const availableEquipoOptions = useMemo(() => {
        const selectedIds = new Set(
            selected_equipos.map((item) => String(item.equipo_id)),
        )

        return [
            { value: "", label: "Seleccione un equipo" },
            ...equipos
                .filter((equipo) =>
                    equipo.tipo_de_producto !== "ESTRUCTURA"
                    && !selectedIds.has(String(equipo.id)),
                )
                .map((equipo) => ({
                    value: String(equipo.id),
                    label: `${equipo.cod_producto} — ${equipo.descripcion}`,
                })),
        ]
    }, [equipos, selected_equipos])

    function handleAddEquipo() {
        if (!equipoToAdd) return

        const equipo = equipos.find((item) => String(item.id) === equipoToAdd)
        if (!equipo || equipo.tipo_de_producto === "ESTRUCTURA") return

        onAddEquipo(equipo)
        setEquipoToAdd("")
    }

    return(
        <>
            <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Costos de Equipos Principales</h2>
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
                                    {/* Cálculo automático */}
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
                                {principalEquipos.length > 0 ? (
                                    principalEquipos.map((item) => (
                                        <tr key={`${item.id}`} className="bg-white">
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                {item.equipo_info?.cod_producto}
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                {item.equipo_info?.descripcion}
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                {item.equipo_info?.unidad}
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                <AddProductNumberField
                                                    label=""
                                                    value={Number(item.cantidad)}
                                                    min={0}
                                                    step={0.01}
                                                    onChange={(value) => onUpdateCantidad(item.id, value)}
                                                />
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                {formatCurrency(Number(item.equipo_info?.precio_soles), "PEN")}
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                {formatCurrency(Number(item.equipo_info?.precio_soles_igv), "PEN")}
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                {formatCurrency(Number(item.equipo_info?.precio_dolares), "USD")}
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                {formatCurrency(Number(item.equipo_info?.precio_dolares_igv), "USD")}
                                            </td>
                                            {/* Cálculo automático */}
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                {formatCurrency(Number(item.equipo_info?.precio_soles)*Number(item.cantidad), "PEN")}
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                {formatCurrency(Number(item.equipo_info?.precio_soles_igv)*Number(item.cantidad), "PEN")}
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                {formatCurrency(Number(item.equipo_info?.precio_dolares)*Number(item.cantidad), "USD")}
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                {formatCurrency(Number(item.equipo_info?.precio_dolares_igv)*Number(item.cantidad), "USD")}
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                <button
                                                    type="button"
                                                    onClick={() => onRemoveEquipo(item.id)}
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
                                            No hay equipos seleccionados todavía.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-end">
                            <div className="min-w-0 flex-1">
                                <AddProductSelectField
                                    label="Agregar equipo"
                                    value={equipoToAdd}
                                    options={availableEquipoOptions}
                                    onChange={setEquipoToAdd}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAddEquipo}
                                disabled={!equipoToAdd}
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
