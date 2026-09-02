"use client"

import { useEffect, useMemo, useState } from "react"
import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField"
import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField"
import { PlusIcon } from "@/features/view/components/Icons/PlusIcon"
import { TrashIcon } from "@/features/view/components/Icons/TrashIcon"
import { useEquipos } from "@/features/view/hooks/services/useRealtimeEquipos"
import { formatCurrency } from "@/lib/utils/normalization"
import { Structure_PriceTable_props } from "@/lib/types/components/Quotes/Quote_tables"

// La descripción de la estructura indica cuántos paneles soporta, por ejemplo
// "Estructura para 4 módulos".
function panelsPerStructure(descripcion: string | undefined): number {
    const parsed = Number.parseInt(descripcion?.match(/\d+/)?.[0] ?? "", 10)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

export function Structure_PriceTable({
        selected_equipos,
        panelCount,
        onUpdateCantidad,
        onAddEquipo,
        onRemoveEquipo,
    }: Structure_PriceTable_props){
    const { equipos } = useEquipos()
    const [equipoToAdd, setEquipoToAdd] = useState("")

    // La cantidad no se edita: es el número de paneles entre los paneles por estructura.
    const estructuraEquipos = useMemo(
        () => selected_equipos
            .filter((item) => item.equipo_info?.tipo_de_producto === "ESTRUCTURA")
            .map((item) => {
                const perStructure = panelsPerStructure(item.equipo_info?.descripcion)
                return {
                    item,
                    perStructure,
                    cantidad: perStructure > 0 ? panelCount / perStructure : Number(item.cantidad),
                }
            }),
        [selected_equipos, panelCount],
    )

    // Sincronización de la cantidad de estructuras
    useEffect(() => {
        estructuraEquipos.forEach(({ item, perStructure, cantidad }) => {
            if (perStructure <= 0) return
            if (Number(item.cantidad) === cantidad) return
            onUpdateCantidad(item.id, cantidad)
        })
    }, [estructuraEquipos, onUpdateCantidad])

    // Estructuras disponibles
    const availableEquipoOptions = useMemo(() => {
        const selectedIds = new Set(
            selected_equipos.map((item) => String(item.equipo_id)),
        )

        return [
            { value: "", label: "Seleccione una estructura" },
            ...equipos
                .filter((equipo) =>
                    equipo.tipo_de_producto === "ESTRUCTURA"
                    && !selectedIds.has(String(equipo.id)),
                )
                .map((equipo) => ({
                    value: String(equipo.id),
                    label: `${equipo.cod_producto} — ${equipo.descripcion}`,
                })),
        ]
    }, [equipos, selected_equipos])

    // Añadir equipo
    function handleAddEquipo() {
        if (!equipoToAdd) return

        const equipo = equipos.find((item) => String(item.id) === equipoToAdd)
        if (!equipo || equipo.tipo_de_producto !== "ESTRUCTURA") return

        onAddEquipo(equipo)
        setEquipoToAdd("")
    }

    return(
        <>
            <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Costos de Estructuras</h2>
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
                                    {estructuraEquipos.length > 0 ? (
                                        estructuraEquipos.map(({ item, cantidad }) => (
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
                                                        value={cantidad}
                                                        min={0}
                                                        step={0.01}
                                                        disabled
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
                                                    {formatCurrency(Number(item.equipo_info?.precio_soles)*cantidad, "PEN")}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(Number(item.equipo_info?.precio_soles_igv)*cantidad, "PEN")}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(Number(item.equipo_info?.precio_dolares)*cantidad, "USD")}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(Number(item.equipo_info?.precio_dolares_igv)*cantidad, "USD")}
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
                                                No hay estructuras seleccionadas todavía.
                                            </td>
                                        </tr>
                                    )}

                            </tbody>
                        </table>
                        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-end">
                            <div className="min-w-0 flex-1">
                                <AddProductSelectField
                                    label="Agregar estructura"
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
