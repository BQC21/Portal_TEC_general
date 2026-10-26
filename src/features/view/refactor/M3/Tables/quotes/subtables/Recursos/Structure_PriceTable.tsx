"use client"

import { useEffect, useMemo, useState } from "react"
import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField"
import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField"
import { PlusIcon } from "@/features/view/components/Icons/PlusIcon"
import { TrashIcon } from "@/features/view/components/Icons/TrashIcon"
import { useEquipos } from "@/features/ViewModel/hooks/services/useRealtimeEquipos"
import { formatCurrency } from "@/lib/utils/normalization"
import { Structure_PriceTable_props } from "@/lib/types/components/Quotes/Quote_tables"
import { AddEquipoReadonlyField } from "@/features/view/components/Form_fields/AddEquipoReadOnlyField"
import { matchesStructureAngle, isDados } from "@/lib/utils/helpers/project_modals/structure_number_fnc"
import { resolveStructureRows } from "@/lib/utils/helpers/project_modals/structureQuantities"
import { withSelectableCount } from "@/lib/utils/helpers/project_modals/productOptions"
import { ANGLE_OPTIONS } from "@/lib/utils/options"

export function Structure_PriceTable({
        selected_equipos,
        projectAngle,
        orientacion,
        onOrientacionChange,
        cantidadManual = false,
        onCantidadManualChange,
        onUpdateCantidad,
        onAddEquipo,
        onRemoveEquipo,
    }: Structure_PriceTable_props){

    // ---------------
    // ESTADOS
    // ---------------

    const { equipos } = useEquipos()
    const [equipoToAdd, setEquipoToAdd] = useState("")
    const [dadosToAdd, setDadosToAdd] = useState("")

    

    // ---------------
    // ALMACENAMIENTO cantidad
    // ---------------

    const { rows: estructuraEquipos, dadosQuantity } = useMemo(
        () => resolveStructureRows(selected_equipos),
        [selected_equipos],
    )

    // ---------------
    // SINCRONIZACIÓN
    // ---------------


    // Sincronización de la cantidad de estructuras (sin dados)
    useEffect(() => {
        if (cantidadManual) return
        estructuraEquipos.forEach(({ item, perStructure, cantidad, isDados: dadosRow }) => {
            if (dadosRow || perStructure <= 0) return
            if (Number(item.cantidad) === cantidad) return
            onUpdateCantidad(item.id, cantidad)
        })
    }, [cantidadManual, estructuraEquipos, onUpdateCantidad])

    // Sincronización de dados: 8× estructuras de 4 módulos, 9× estructuras de 8 módulos
    useEffect(() => {
        if (cantidadManual) return
        const dadosItem = selected_equipos.find((item) =>
            item.equipo_info?.tipo_de_producto === "ESTRUCTURA"
            && isDados(item.equipo_info?.descripcion),
        )
        if (!dadosItem) return
        if (Number(dadosItem.cantidad) === dadosQuantity) return
        onUpdateCantidad(dadosItem.id, dadosQuantity)
    }, [cantidadManual, selected_equipos, dadosQuantity, onUpdateCantidad])

    // ---------------
    // ALMACENAMIENTO booleano
    // ---------------

    const hasSelectedStructures = useMemo(
        () => estructuraEquipos.some(({ isDados: dadosRow }) => !dadosRow),
        [estructuraEquipos],
    )

    const hasSelectedDados = useMemo(
        () => estructuraEquipos.some(({ isDados: dadosRow }) => dadosRow),
        [estructuraEquipos],
    )

    // ---------------
    // DISPONIBILIDAD
    // ---------------
    
    const availableEquipoOptions = useMemo(() => {
        const selectedIds = new Set(
            selected_equipos.map((item) => String(item.equipo_id)),
        )

        const selectableEquipos = equipos
                .filter((equipo) =>
                    equipo.tipo_de_producto === "ESTRUCTURA"
                    && !isDados(equipo.descripcion)
                    && matchesStructureAngle(equipo.descripcion, projectAngle)
                    && !selectedIds.has(String(equipo.id)),
                )
                .map((equipo) => ({
                    value: String(equipo.id),
                    label: `${equipo.cod_producto} — ${equipo.descripcion}`,
                }))

        return [
            { value: "", label: `Seleccione una estructura (${selectableEquipos.length})` },
            ...selectableEquipos,
        ]
    }, [equipos, selected_equipos, projectAngle])

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

    // ---------
    // HANDLERS
    // ---------

    function handleAddEquipo() {
        if (!equipoToAdd) return

        const equipo = equipos.find((item) => String(item.id) === equipoToAdd)
        if (!equipo || equipo.tipo_de_producto !== "ESTRUCTURA" || isDados(equipo.descripcion)) return
        if (!matchesStructureAngle(equipo.descripcion, projectAngle)) return

        onAddEquipo(equipo)
        setEquipoToAdd("")
    }

    function handleAddDados() {
        if (!dadosToAdd || !hasSelectedStructures) return

        const dados = equipos.find((item) => String(item.id) === dadosToAdd)
        if (!dados || !isDados(dados.descripcion)) return

        // La cantidad definitiva la fija el efecto de sincronización al
        // recalcular 8×/9× según las estructuras de 4/8 módulos.
        onAddEquipo(dados, Math.max(1, dadosQuantity))
        setDadosToAdd("")
    }

    return(
        <>
            <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                <section className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-2xl font-bold text-slate-900">Costos de Estructuras</h2>
                        <div className="flex flex-wrap items-end gap-3">
                            <div className="w-52">
                                <AddProductSelectField
                                    label="Orientación"
                                    options={ANGLE_OPTIONS}
                                    value={orientacion || "---"}
                                    onChange={(value) => onOrientacionChange?.(value)}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => onCantidadManualChange?.(false)}
                                className={`rounded-xl px-4 py-2 text-base font-semibold transition ${
                                    !cantidadManual
                                        ? "bg-brand-500 text-white hover:bg-brand-600"
                                        : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                Cantidad automática
                            </button>
                            <button
                                type="button"
                                onClick={() => onCantidadManualChange?.(true)}
                                className={`rounded-xl px-4 py-2 text-base font-semibold transition ${
                                    cantidadManual
                                        ? "bg-brand-500 text-white hover:bg-brand-600"
                                        : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                Cantidad manual
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500">
                        {cantidadManual
                            ? "Puede editar las cantidades de estructuras y dados de forma independiente a los módulos o baterías seleccionados."
                            : "Las cantidades se calculan automáticamente según los módulos FV o baterías seleccionados."}
                    </p>
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
                                        estructuraEquipos.map(({ item, cantidad, isDados: dadosRow }) => {
                                            const displayCantidad = cantidadManual
                                                ? Number(item.cantidad) || 0
                                                : (dadosRow ? dadosQuantity || cantidad : cantidad)

                                            return (
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
                                                    {cantidadManual ? (
                                                        <AddProductNumberField
                                                            label=""
                                                            value={Number.isFinite(displayCantidad) ? displayCantidad : ""}
                                                            min={0}
                                                            step={1}
                                                            onChange={(value) =>
                                                                onUpdateCantidad(
                                                                    item.id,
                                                                    Number.isFinite(value) ? value : 0,
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <AddEquipoReadonlyField
                                                            label=""
                                                            value={String(Math.ceil(displayCantidad))}
                                                        />
                                                    )}
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
                                                        Number(item.equipo_info?.precio_soles) * displayCantidad,
                                                        "PEN",
                                                    )}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(
                                                        Number(item.equipo_info?.precio_soles_igv) * displayCantidad,
                                                        "PEN",
                                                    )}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(
                                                        Number(item.equipo_info?.precio_dolares) * displayCantidad,
                                                        "USD",
                                                    )}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {formatCurrency(
                                                        Number(item.equipo_info?.precio_dolares_igv) * displayCantidad,
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
                                            );
                                        })
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
                                        label={withSelectableCount("Agregar estructura", availableEquipoOptions)}
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
                                    aria-label="Agregar estructura"
                                >
                                    <PlusIcon />
                                </button>
                            </div>
                            {hasSelectedStructures && !hasSelectedDados && (
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                    <div className="min-w-0 flex-1">
                                        <AddProductSelectField
                                            label="Agregar dados"
                                            value={dadosToAdd}
                                            options={availableDadosOptions}
                                            onChange={setDadosToAdd}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddDados}
                                        disabled={!dadosToAdd}
                                        className="table-icon-button"
                                        aria-label="Agregar dados"
                                    >
                                        <PlusIcon />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
