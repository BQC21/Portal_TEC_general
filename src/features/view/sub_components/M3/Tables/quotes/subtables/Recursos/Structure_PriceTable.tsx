"use client"

import { useEffect, useMemo, useState } from "react"
import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField"
import { PlusIcon } from "@/features/view/components/Icons/PlusIcon"
import { TrashIcon } from "@/features/view/components/Icons/TrashIcon"
import { useEquipos } from "@/features/view/hooks/services/useRealtimeEquipos"
import { formatCurrency } from "@/lib/utils/normalization"
import { Structure_PriceTable_props } from "@/lib/types/components/Quotes/Quote_tables"
import { AddEquipoReadonlyField } from "@/features/view/components/Form_fields/AddEquipoReadOnlyField"
import { bestStructureCombination, StructureOption } from "@/lib/utils/helpers/computes/best_structure_arrays"
import { dadosPerStructure, isBatteryStructure, isDados, unitsPerStructure } from "@/lib/utils/helpers/project_modals/structure_number_fnc"

export function Structure_PriceTable({
        selected_equipos,
        onUpdateCantidad,
        onAddEquipo,
        onRemoveEquipo,
    }: Structure_PriceTable_props){
    const { equipos } = useEquipos()
    const [equipoToAdd, setEquipoToAdd] = useState("")
    const [dadosToAdd, setDadosToAdd] = useState("")

    // La cantidad de estructuras de módulos sigue a los MÓDULO FV seleccionados
    // (no al strings estático del proyecto), para que cambie al editar la cotización.
    const panelCount = useMemo(
        () => selected_equipos
            .filter((item) => item.equipo_info?.tipo_de_producto === "MÓDULO FV")
            .reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0),
        [selected_equipos],
    )

    const batteryCount = useMemo(
        () => selected_equipos
            .filter((item) => item.equipo_info?.tipo_de_producto === "BATERÍA")
            .reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0),
        [selected_equipos],
    )

    // La cantidad no se edita: es el total de unidades a soportar (módulos FV o baterías)
    // entre las que admite cada estructura. Con varias estructuras de módulos el reparto
    // se resuelve como combinación en lugar de dividir el total en cada fila.
    const estructuraEquipos = useMemo(() => {
        const structures = selected_equipos
            .filter((item) => item.equipo_info?.tipo_de_producto === "ESTRUCTURA")

        const moduleOptions: StructureOption[] = structures
            .filter((item) =>
                !isBatteryStructure(item.equipo_info?.descripcion)
                && !isDados(item.equipo_info?.descripcion),
            )
            .map((item) => ({
                id: String(item.id),
                capacity: unitsPerStructure(item.equipo_info?.descripcion),
                unitCost: Number(item.equipo_info?.precio_soles) || 0,
            }))
            .filter((option) => option.capacity > 0)

        const combination = moduleOptions.length > 1
            ? bestStructureCombination(panelCount, moduleOptions)
            : null

        return structures.map((item) => {
            const descripcion = item.equipo_info?.descripcion
            if (isDados(descripcion)) {
                return { item, perStructure: 0, cantidad: Number(item.cantidad) || 0, isDados: true }
            }

            const perStructure = unitsPerStructure(descripcion)
            if (perStructure <= 0) {
                return { item, perStructure, cantidad: Number(item.cantidad), isDados: false }
            }

            const isBattery = isBatteryStructure(descripcion)
            if (combination && !isBattery) {
                return {
                    item,
                    perStructure,
                    cantidad: combination.get(String(item.id)) ?? 0,
                    isDados: false,
                }
            }

            const totalUnits = isBattery ? batteryCount : panelCount
            return { item, perStructure, cantidad: totalUnits / perStructure, isDados: false }
        })
    }, [selected_equipos, panelCount, batteryCount])

    const dadosQuantity = useMemo(
        () => estructuraEquipos
            .filter(({ isDados: dadosRow }) => !dadosRow)
            .reduce((sum, { perStructure, cantidad }) => {
                const factor = dadosPerStructure(perStructure)
                if (factor <= 0) return sum
                return sum + factor * Math.ceil(cantidad)
            }, 0),
        [estructuraEquipos],
    )

    // Sincronización de la cantidad de estructuras (sin dados)
    useEffect(() => {
        estructuraEquipos.forEach(({ item, perStructure, cantidad, isDados: dadosRow }) => {
            if (dadosRow || perStructure <= 0) return
            if (Number(item.cantidad) === cantidad) return
            onUpdateCantidad(item.id, cantidad)
        })
    }, [estructuraEquipos, onUpdateCantidad])

    // Sincronización de dados: 8× estructuras de 4 módulos, 9× estructuras de 8 módulos
    useEffect(() => {
        const dadosItem = selected_equipos.find((item) =>
            item.equipo_info?.tipo_de_producto === "ESTRUCTURA"
            && isDados(item.equipo_info?.descripcion),
        )
        if (!dadosItem) return
        if (Number(dadosItem.cantidad) === dadosQuantity) return
        onUpdateCantidad(dadosItem.id, dadosQuantity)
    }, [selected_equipos, dadosQuantity, onUpdateCantidad])

    const selectedStructure = useMemo(
        () => equipos.find((item) => String(item.id) === equipoToAdd),
        [equipos, equipoToAdd],
    )

    // Estructuras disponibles (sin dados: esos van en el selector secundario)
    const availableEquipoOptions = useMemo(() => {
        const selectedIds = new Set(
            selected_equipos.map((item) => String(item.equipo_id)),
        )

        return [
            { value: "", label: "Seleccione una estructura" },
            ...equipos
                .filter((equipo) =>
                    equipo.tipo_de_producto === "ESTRUCTURA"
                    && !isDados(equipo.descripcion)
                    && !selectedIds.has(String(equipo.id)),
                )
                .map((equipo) => ({
                    value: String(equipo.id),
                    label: `${equipo.cod_producto} — ${equipo.descripcion}`,
                })),
        ]
    }, [equipos, selected_equipos])

    const availableDadosOptions = useMemo(() => {
        const selectedIds = new Set(
            selected_equipos.map((item) => String(item.equipo_id)),
        )

        return [
            { value: "", label: "Seleccione dados" },
            ...equipos
                .filter((equipo) =>
                    isDados(equipo.descripcion)
                    && !selectedIds.has(String(equipo.id)),
                )
                .map((equipo) => ({
                    value: String(equipo.id),
                    label: `${equipo.cod_producto} — ${equipo.descripcion}`,
                })),
        ]
    }, [equipos, selected_equipos])

    // Añadir estructura y, si hay selección, los dados con su cantidad calculada
    function handleAddEquipo() {
        if (!equipoToAdd) return

        const equipo = equipos.find((item) => String(item.id) === equipoToAdd)
        if (!equipo || equipo.tipo_de_producto !== "ESTRUCTURA" || isDados(equipo.descripcion)) return

        onAddEquipo(equipo)

        if (dadosToAdd) {
            const dados = equipos.find((item) => String(item.id) === dadosToAdd)
            if (dados && isDados(dados.descripcion)) {
                // La cantidad definitiva la fija el efecto de sincronización al
                // recalcular 8×/9× según las estructuras de 4/8 módulos.
                onAddEquipo(dados, Math.max(1, dadosQuantity))
            }
        }

        setEquipoToAdd("")
        setDadosToAdd("")
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
                                        estructuraEquipos.map(({ item, cantidad, isDados: dadosRow }) => (
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
                                                    <AddEquipoReadonlyField
                                                        label=""
                                                        value={String(
                                                            dadosRow
                                                                ? Math.ceil(dadosQuantity || cantidad)
                                                                : Math.ceil(cantidad),
                                                        )}
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
                                                    {formatCurrency(
                                                        Number(item.equipo_info?.precio_soles)
                                                            * (dadosRow ? dadosQuantity || cantidad : cantidad),
                                                        "PEN",
                                                    )}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(
                                                        Number(item.equipo_info?.precio_soles_igv)
                                                            * (dadosRow ? dadosQuantity || cantidad : cantidad),
                                                        "PEN",
                                                    )}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(
                                                        Number(item.equipo_info?.precio_dolares)
                                                            * (dadosRow ? dadosQuantity || cantidad : cantidad),
                                                        "USD",
                                                    )}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(
                                                        Number(item.equipo_info?.precio_dolares_igv)
                                                            * (dadosRow ? dadosQuantity || cantidad : cantidad),
                                                        "USD",
                                                    )}
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
                        <div className="flex flex-col gap-3 px-4 py-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                <div className="min-w-0 flex-1">
                                    <AddProductSelectField
                                        label="Agregar estructura"
                                        value={equipoToAdd}
                                        options={availableEquipoOptions}
                                        onChange={(value) => {
                                            setEquipoToAdd(value)
                                            setDadosToAdd("")
                                        }}
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
                            {selectedStructure && (
                                <div className="min-w-0 sm:pr-14">
                                    <AddProductSelectField
                                        label="Agregar dados"
                                        value={dadosToAdd}
                                        options={availableDadosOptions}
                                        onChange={setDadosToAdd}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
