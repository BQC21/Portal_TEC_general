"use client";

import { useEffect, useState } from "react";
import { AddProductNumberField } from "../../../components/Form_fields/AddNumberField";
import { Tables_M2_props } from "@/lib/types/components/sub_components/module_render";
import { cantidadModuloFVEnTabla } from "@/lib/utils/helpers/computes/PanelNumber";
import { syncSolisAutoAccessories } from "@/lib/utils/helpers/project_modals/solisAccessories";
import { allowsQuantityOverride, followsCadenaNumber, isAcBreaker, isVisibleEquipment, isVisibleMaterial, materialRowKey, structureQuantityMax } from "@/lib/utils/helpers/project_modals/tables_M2_fnc";

export function Tables_M2({selectedEquipmentTable, setSelectedEquipmentTable,
    selectedMaterialTable, setSelectedMaterialTable, computedRequirements, form, equipos}: Tables_M2_props){
    
    // VISIBILIDAD
    const visibleEquipmentTable = selectedEquipmentTable.filter(isVisibleEquipment);
    const visibleMaterialTable = selectedMaterialTable.filter(isVisibleMaterial);

    // SELECCIÓN
    const selectedModules = visibleEquipmentTable.filter((row) => row.row === "MÓDULO FV");
    const selectedInverter = selectedEquipmentTable.find((item) => item.row === "INVERSOR");
    const inverterKey = `${selectedInverter?.id ?? ""}:${selectedInverter?.marca ?? ""}`;

    // Sincronizar automáticamente si el inversor es SOLÍS
    // para agregar su datalogger y smart meter
    useEffect(() => {
        setSelectedEquipmentTable((curr) =>
            syncSolisAutoAccessories(curr, equipos, form.tipo_instalacion),
        );
    }, [inverterKey, form.tipo_instalacion, equipos, setSelectedEquipmentTable]);

    // Cantidades liberadas por el usuario: quedan fuera de la sincronización automática.
    const [overriddenQuantities, setOverriddenQuantities] = useState<string[]>([]);

    function toggleQuantityOverride(key: string) {
        setOverriddenQuantities((curr) =>
            curr.includes(key) ? curr.filter((item) => item !== key) : [...curr, key],
        );
    }

    // sincronizar cantidad de ITM DC y SPD con la cantidad de cadenas
    useEffect(() => {
        const cadenas = Number(form.cadena_number) || 0;
        setSelectedMaterialTable((curr) => {
            let changed = false;
            const next = curr.map((item) => {
                if (!followsCadenaNumber(item)) return item;
                if (overriddenQuantities.includes(materialRowKey(item))) return item;
                if (item.cantidad === cadenas) return item;
                changed = true;
                return { ...item, cantidad: cadenas };
            });
            return changed ? next : curr;
        });
    }, [form.cadena_number, overriddenQuantities, setSelectedMaterialTable]);

    return(
        <>
            <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Equipos principales seleccionados</h2>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10 bg-slate-100">
                                <tr className="bg-slate-100 text-left">
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Equipo seleccionado
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Cantidad
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleEquipmentTable.length > 0 ? (
                                    visibleEquipmentTable.map((item) => (
                                        <tr key={`${item.row}-${item.id}`} className="bg-white">
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                {item.row === "MÓDULO FV" && item.unidad
                                                    ? `${item.description} (${item.unidad})`
                                                    : item.description}
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                <AddProductNumberField
                                                    label="ingrese cantidad"
                                                    required
                                                    value={item.row === "MÓDULO FV"
                                                        ? cantidadModuloFVEnTabla(
                                                            Number(form.strings) || Number(item.cantidad ?? 0),
                                                            item.unidad,
                                                            selectedModules,
                                                        )
                                                        : Number(item.cantidad ?? 0)}
                                                    onChange={(value) =>
                                                        setSelectedEquipmentTable((curr) =>
                                                            curr.map((r) =>
                                                                r.row === item.row && r.id === item.id ? 
                                                                    { ...r, cantidad: Number(value.toFixed(0)) } : r,
                                                            ),
                                                        )
                                                    }
                                                    step={1} min={0} max={structureQuantityMax(item, form, computedRequirements)}
                                                    disabled={
                                                        // item.row === "INVERSOR" || 
                                                        item.row === "MÓDULO FV" || item.row === "BATERÍA"}
                                                />
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedEquipmentTable((current) =>
                                                            current.filter((row) => !(row.row === item.row && row.id === item.id)),
                                                        );
                                                    }}
                                                    className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="bg-white">
                                        <td colSpan={2} className="px-4 py-10 text-center text-slate-500">
                                            No hay equipos seleccionados todavía.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Materiales eléctricos seleccionados</h2>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10 bg-slate-100">
                                <tr className="bg-slate-100 text-left">
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Material seleccionado
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Cantidad
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleMaterialTable.length > 0 ? (
                                    visibleMaterialTable.map((item) => {
                                        const rowKey = materialRowKey(item);
                                        const isOverridden = overriddenQuantities.includes(rowKey);
                                        const isAutoQuantity = followsCadenaNumber(item) || isAcBreaker(item);

                                        return (
                                        <tr key={rowKey} className="bg-white">
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                {item.description}
                                                {item.description.includes("Cable AC") && (
                                                    <span className="mt-1 block text-sm font-normal text-slate-500">
                                                        {item.inversores_considerados
                                                            ? `Dimensionado para ${item.inversores_considerados} ${item.inversores_considerados === 1 ? "inversor" : "inversores"}`
                                                            : "Sin cantidad de inversores registrada"}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                <AddProductNumberField
                                                    label="ingrese cantidad"
                                                    required
                                                    value={Number(item.cantidad ?? 0)}
                                                    onChange={(value) => 
                                                        setSelectedMaterialTable((curr) => 
                                                            curr.map((r) => 
                                                                r.row === item.row && r.id === item.id ?
                                                                    { ...r, cantidad: Number(value) } : r
                                                            ),
                                                        )
                                                    }
                                                    step={1} min={0}
                                                    disabled={(isAutoQuantity && !isOverridden)
                                                        || (item.row === "MC4" && item.description.includes("MC4"))}
                                                />
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {allowsQuantityOverride(item) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleQuantityOverride(rowKey)}
                                                            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                                        >
                                                            {isOverridden ? "Fijar cantidad" : "Cambiar cantidad"}
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedMaterialTable((current) =>
                                                                current.filter((row) => row.id !== item.id),
                                                            );
                                                        }}
                                                        className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        );
                                    })
                                ) : (
                                    <tr className="bg-white">
                                        <td colSpan={2} className="px-4 py-10 text-center text-slate-500">
                                            No hay materiales seleccionados todavía.
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