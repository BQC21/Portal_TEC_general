"use client";

import { useEffect, useMemo } from "react";
import { SelectionRow } from "../../../components/Form_fields/AddSelectionRow";
import { AddProductSelectField } from "../../../components/Form_fields/AddSelectField";
import { AddProductReadonlyField } from "../../../components/Form_fields/AddReadonlyField";
import { handlerSelector } from "../../../hooks/modals/Sizing/useHandlerSelector";
import { Selectors_M2Props } from "@/lib/types/components/sub_components/module_render";
import {
    AWG_COLOR,
    AWG_MATRIX,
    AWG_ORDER,
    AWG_TO_MM2,
    CURRENT_RANGES,
    DISTANCE_RANGES,
    awgTextColor,
    findCurrentRangeIndex,
    findDistanceRangeIndex,
    getAwgForSelection,
    getMm2ForAwg,
} from "@/lib/utils/helpers/project_modals/cableMatrix";
import { extractMm2 } from "@/lib/utils/helpers/project_modals/consumibleRowSelector";
import { defaultSelectOption, toProductSelectOption } from "@/lib/utils/helpers/project_modals/productOptions";

const matrixCellStyles = "border border-black px-1 py-[3px] text-center text-[10px] font-bold leading-tight whitespace-nowrap";
const matrixHeaderStyles = "border border-black bg-white px-1 py-[3px] text-center text-[10px] font-bold leading-tight text-slate-900 whitespace-nowrap";

export function Selectors_M2({ equipmentRows, materialRows, selectedEquipmentTable, selectedMaterialTable, 
    form, updateField, computedRequirements, equipos, materiales, selectedEquipmentByRow, selectedMaterialByRow, 
    isEquipmentTypeSelected, showModuleSelector, showInverterSelector, showBatterySelector,
    handle_onChange, handle_click,
}: Selectors_M2Props) {
    // Corriente de diseño: ITM AC mínimo por la cantidad de inversores seleccionados
    const inverterQuantity = Number(
        selectedEquipmentTable.find((item) => item.row === "INVERSOR")?.cantidad ?? 0,
    );
    const designCurrent = Number(computedRequirements.itm_ac_min) * inverterQuantity;

    const currentIndex = findCurrentRangeIndex(designCurrent);
    const distanceIndex = findDistanceRangeIndex(form.rango_distancia);
    const selectedAwg = getAwgForSelection(currentIndex, distanceIndex);
    const targetMm2 = getMm2ForAwg(selectedAwg);

    // Cable AC del catálogo cuya sección coincide exactamente con el mm2 de la matriz
    const autoCable = useMemo(() => {
        if (targetMm2 === null) return null;
        return (
            materiales.find(
                (material) =>
                    material.tipo_de_producto === "CABLE" &&
                    material.descripcion.includes("AC") &&
                    extractMm2(material.descripcion) === String(targetMm2),
            ) ?? null
        );
    }, [materiales, targetMm2]);

    const cableRowIndex = materialRows.indexOf("CABLE");
    const autoCableId = autoCable ? String(autoCable.id) : "";
    const storedCableId = cableRowIndex >= 0
        ? selectedMaterialByRow[`CABLE-${cableRowIndex}`]?.materialId ?? ""
        : "";

    // La fila de CABLE es de solo lectura, así que el estado del padre siempre se lleva al
    // cable que dicta la matriz. Al comparar contra lo ya guardado la sincronización se
    // autocorrige: si "Agregar" limpia la fila, vuelve a quedar con el cable correcto.
    useEffect(() => {
        if (cableRowIndex < 0 || !autoCableId) return;
        if (storedCableId === autoCableId) return;
        handle_onChange(autoCableId, "CABLE", cableRowIndex, "MATERIAL");
    }, [autoCableId, storedCableId, cableRowIndex, handle_onChange]);

    const showMissingCableWarning = targetMm2 !== null && !autoCable;

    // Las opciones del CABLE se arman con el cable asignado, no con handlerSelector: ese
    // filtro descarta los materiales ya presentes en la tabla y dejaría al selector sin la
    // opción que debe mostrar.
    const cableOptions = autoCable
        ? [toProductSelectOption(autoCable)]
        : [defaultSelectOption("CABLE")];

    const distanceRangeOptions = [
        { value: "", label: "Seleccionar - RANGO DE DISTANCIA" },
        ...DISTANCE_RANGES.map((range) => ({ value: range.label, label: range.label })),
    ];

    return (
        <>
            <div className="flex w-full flex-col gap-6 p-0">
                <section className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2.3fr)_minmax(0,3.5fr)_minmax(0,1.2fr)_minmax(0,1.0fr)] w-full">
                        <div>
                            <h2 className="mb-10 text-2xl font-bold text-slate-900">Selección de equipos</h2>
                            <div className="flex flex-col gap-4">
                            {equipmentRows.map((label, index) => {
                                const equipment_filteredOptions = handlerSelector(label, "EQUIPO", 
                                    selectedEquipmentTable, selectedMaterialTable, 
                                    form, computedRequirements, 
                                    equipos, materiales);
                                const isSelected = isEquipmentTypeSelected(label);
                                const customSelectClass = isSelected && (label !== "ACCESORIO" && label !== "ESTRUCTURA")
                                    ? "field-row-selected"
                                    : "";

                                const shouldRender =
                                    label === "MÓDULO FV" ? showModuleSelector :
                                    label === "INVERSOR" ? showInverterSelector :
                                    // label === "ESTRUCTURA" ? (showStructureSelector && isNotOnGrid) :
                                    label === "BATERÍA" ? showBatterySelector:
                                    true; // other rows (ACCESORIO, etc.) always show

                                if (!shouldRender) return null;

                                return (
                                    <SelectionRow
                                        key={`equipment-${label}-${index}`}
                                        label={label}
                                        buttonLabel="Agregar"
                                        value={selectedEquipmentByRow[`${label}-${index}`]?.equipoId || ""}
                                        options={equipment_filteredOptions}
                                        customSelectClass={customSelectClass}
                                        onChange={(value) => handle_onChange(value, label, index, "EQUIPO")}
                                        onClick={() => handle_click(label, index, "EQUIPO")}
                                    />
                                );
                                })}
                            </div>
                        </div>

                        <div>
                            <h2 className="mt-10 mb-10 text-2xl font-bold text-slate-900">Selección de materiales</h2>
                            <div className="flex flex-col gap-4">
                                {materialRows.map((label, index) => {
                                    // El CABLE no lo elige el usuario: se asigna desde la matriz
                                    // según el rango de distancia seleccionado.
                                    const isReadOnlyRow = label === "CABLE";

                                    const material_filteredOptions = isReadOnlyRow
                                        ? cableOptions
                                        : handlerSelector(label, "MATERIAL",
                                            selectedEquipmentTable, selectedMaterialTable,
                                            form, computedRequirements,
                                            equipos, materiales);

                                    return (
                                        <div key={`material-row-${label}-${index}`} className="flex flex-col gap-2">
                                            <SelectionRow
                                                label={label}
                                                buttonLabel="Agregar"
                                                value={isReadOnlyRow
                                                    ? autoCableId
                                                    : selectedMaterialByRow[`${label}-${index}`]?.materialId || ""}
                                                options={material_filteredOptions}
                                                disabled={isReadOnlyRow}
                                                onChange={(value) => {handle_onChange(value, label, index, "MATERIAL")}}
                                                onClick={() => handle_click(label, index, "MATERIAL")}
                                            />
                                            {label === "CABLE" && showMissingCableWarning && (
                                                <p className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
                                                    No existe un &quot;Cable AC&quot; de {targetMm2} mm2 ({selectedAwg} AWG) en el catálogo. Selecciónelo manualmente.
                                                </p>
                                            )}
                                        </div>
                                    );  
                                })}
                            </div>
                        </div>

                        {/* Matriz de equivalencia de cables (I vs m)*/}
                        <div>
                            <h2 className="mt-10 mb-10 text-2xl font-bold text-slate-900">Matriz de equivalencia de cables</h2>
                            <div className="overflow-x-auto w-full">
                                <table className="border-collapse border-2 border-black bg-white min-w-full">
                                    <tbody>
                                        {CURRENT_RANGES.map((currentRange, rowIndex) => (
                                            <tr key={currentRange.label}>
                                                {rowIndex === 0 && (
                                                    <td
                                                        rowSpan={CURRENT_RANGES.length}
                                                        className="border border-black bg-white px-1 text-center align-middle text-[10px] font-bold leading-[1.05] text-red-600"
                                                    >
                                                        {"CORRIENTE".split("").map((letter, letterIndex) => (
                                                            <span key={`corriente-${letterIndex}`} className="block">
                                                                {letter}
                                                            </span>
                                                        ))}
                                                    </td>
                                                )}
                                                <td className={matrixHeaderStyles}>{currentRange.label}</td>
                                                {AWG_MATRIX[rowIndex].map((awg, columnIndex) => {
                                                    const isActive = rowIndex === currentIndex && columnIndex === distanceIndex;
                                                    return (
                                                        <td
                                                            key={`${currentRange.label}-${DISTANCE_RANGES[columnIndex].label}`}
                                                            style={{ backgroundColor: AWG_COLOR[awg], color: awgTextColor(awg) }}
                                                            className={`${matrixCellStyles} ${isActive ? "outline outline-[3px] -outline-offset-[3px] outline-black" : ""}`}
                                                        >
                                                            {awg} AWG
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                        <tr>
                                            {/* Dos celdas vacías: la columna "CORRIENTE" y la de rangos de
                                                corriente, para que cada etiqueta de distancia quede alineada
                                                bajo su columna de datos. */}
                                            <td className={matrixHeaderStyles} />
                                            <td className={matrixHeaderStyles} />
                                            {DISTANCE_RANGES.map((distanceRange) => (
                                                <td key={distanceRange.label} className={matrixHeaderStyles}>
                                                    {distanceRange.label}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td
                                                colSpan={DISTANCE_RANGES.length + 2}
                                                className="border border-black bg-white px-1 py-[3px] text-center text-[11px] font-bold text-slate-900"
                                            >
                                                DISTANCIA EN METROS
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Tabla AWG vs mm2*/}
                        <div>
                            <h2 className="mt-10 mb-10 text-2xl font-bold text-slate-900">AWG vs mm2</h2>
                            <div className="overflow-x-auto w-full rounded-2xl border border-slate-200">
                                <table className="min-w-full border-separate border-spacing-0">
                                    <thead className="bg-slate-100">
                                        <tr className="bg-slate-100 text-left">
                                            <th className="border-b border-slate-200 px-4 py-3 text-sm font-bold text-slate-900">
                                                AWG
                                            </th>
                                            <th className="border-b border-slate-200 px-4 py-3 text-sm font-bold text-slate-900">
                                                mm2
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {AWG_ORDER.map((awg) => {
                                            const isActive = awg === selectedAwg;
                                            return (
                                                <tr key={`awg-mm2-${awg}`} className="bg-white">
                                                    <td
                                                        style={{ backgroundColor: AWG_COLOR[awg], color: awgTextColor(awg) }}
                                                        className={`border-b border-slate-200 px-4 py-2 text-sm font-bold ${isActive ? "outline outline-[3px] -outline-offset-[3px] outline-black" : ""}`}
                                                    >
                                                        {awg} AWG
                                                    </td>
                                                    <td className={`border-b border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 ${isActive ? "bg-slate-100 font-bold" : ""}`}>
                                                        {AWG_TO_MM2[awg]} mm2
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* selector (rango de corriente) + selector (rango de distancia) */}
                        <div>
                            <h2 className="mt-10 mb-10 text-2xl font-bold text-slate-900">Rangos de dimensionamiento</h2>
                            <div className="flex flex-col gap-4">
                                <AddProductReadonlyField
                                    label="Corriente de diseño (ITM AC mín. × N° inversores)"
                                    value={currentIndex >= 0 ? `${designCurrent} A` : "—"}
                                />
                                <AddProductReadonlyField
                                    label="RANGO DE CORRIENTE"
                                    value={currentIndex >= 0 ? CURRENT_RANGES[currentIndex].label : "—"}
                                />
                                <AddProductSelectField
                                    label="RANGO DE DISTANCIA"
                                    value={form.rango_distancia || ""}
                                    options={distanceRangeOptions}
                                    onChange={(value) => updateField("rango_distancia", value)}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
