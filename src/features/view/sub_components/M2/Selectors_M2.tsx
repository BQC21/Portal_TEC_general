import { Materiales } from "@/lib/types/supabase/materiales-types";
import { SelectionRow } from "../../components/Form_fields/AddSelectionRow";
import { handlerSelector } from "../../hooks/modals/Sizing/useHandlerSelector";
import { Equipos } from "@/lib/types/supabase/equipos-types";
import { computedRequirements } from "@/lib/types/components/Sizing/computes";
import { SelectedEquipmentItem, SelectedMaterialItem } from "@/lib/types/supabase/product-types";
import { ProjectFormState } from "@/lib/types/supabase/project-types";

export type Selectors_M2Props = {
    equipmentRows: string[];
    materialRows: string[];
    selectedEquipmentTable: SelectedEquipmentItem[];
    selectedMaterialTable: SelectedMaterialItem[];
    form: ProjectFormState;
    computedRequirements: computedRequirements;
    equipos: Equipos[];
    materiales: Materiales[];
    selectedEquipmentByRow: Record<string, { equipoId: string; description: string }>;
    selectedMaterialByRow: Record<string, { materialId: string; description: string }>;
    isEquipmentTypeSelected: (label: string) => boolean;
    showModuleSelector: boolean;
    showInverterSelector: boolean;
    showBatterySelector: boolean;
    handle_onChange: (value: string, label: string, index: string | number, product_type: string) => void;
    handle_click: (label: string, index: string | number, product_type: string) => void;
}

export function Selectors_M2({ equipmentRows, materialRows, selectedEquipmentTable, selectedMaterialTable, 
    form, computedRequirements, equipos, materiales, selectedEquipmentByRow, selectedMaterialByRow, 
    isEquipmentTypeSelected, showModuleSelector, showInverterSelector, showBatterySelector,
    handle_onChange, handle_click,
}: Selectors_M2Props) {
    return (
        <>
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,2.0fr)_minmax(0,2.0fr)]">
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
                                    const material_filteredOptions = handlerSelector(label, "MATERIAL",
                                    selectedEquipmentTable, selectedMaterialTable, 
                                    form, computedRequirements, 
                                    equipos, materiales);

                                    return (
                                        <SelectionRow
                                            key={`material-row-${label}-${index}`}
                                            label={label}
                                            buttonLabel="Agregar"
                                            value={selectedMaterialByRow[`${label}-${index}`]?.materialId || ""}
                                            options={material_filteredOptions}
                                            onChange={(value) => {handle_onChange(value, label, index, "MATERIAL")}}
                                            onClick={() => handle_click(label, index, "MATERIAL")}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}