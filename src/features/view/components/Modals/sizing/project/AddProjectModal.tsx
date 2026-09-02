"use client";

import { useState  } from "react";
import { AddProductCloseIcon } from "@/features/view/components/Icons/AddCloseIcon";

import type {
    ProjectFormState,
} from "@/lib/types/supabase/project-types";

import type {
    ZoneFormState,
} from "@/lib/types/supabase/zone-types"; // Tipados

import { INITIAL_PROJECT_FORM, INITIAL_ZONE_FORM } from "@/lib/utils/initialValues";

import { ANGLE_OPTIONS, CONNECTION_TYPE_OPTIONS, FillOptions, INSTALL_TYPE_OPTIONS, STATUS_PROJECT_OPTIONS } from "@/lib/utils/options"; // opciones

// import { useConverterNREL } from "@/features/view/hooks/api/useConverterNREL"
import { useZone } from "@/features/view/hooks/services/useRealtimeZonas";
import { useEquipos } from "@/features/view/hooks/services/useRealtimeEquipos";
import { useMateriales } from "@/features/view/hooks/services/useRealtimeMateriales";
import { SelectedEquipmentItem, SelectedMaterialItem } from "@/lib/types/supabase/product-types";
import { shouldRender_M2_battery_properties, shouldRender_M2_configuration } from "@/lib/utils/helpers/render/render_modals";
import { AddMProjectodalProps } from "@/lib/types/components/General/modals";
import { useComputedRequirements } from "@/features/view/hooks/modals/Sizing/useComputedRequirements";
import { useSyncQuantities } from "@/features/view/hooks/modals/Sizing/useSyncQuantities";
import { useSelectionHandlers } from "@/features/view/hooks/modals/Sizing/useSelectionHandlers";
import { getFieldValueDarkClass, getFieldValueLightClass } from "@/lib/utils/helpers/fieldValueState";
import { equipmentRows, materialRows } from "@/lib/utils/helpers/project_modals/rows";
import { General_info_M2 } from "@/features/view/sub_components/M2/refactor/General_info_M2";
import { Data_info_M2 } from "@/features/view/sub_components/M2/refactor/Data_info_M2";
import { Selectors_M2 } from "@/features/view/sub_components/M2/refactor/Selectors_M2";
import { Tables_M2 } from "@/features/view/sub_components/M2/refactor/Tables_M2";
import { Formulas_M2 } from "@/features/view/sub_components/M2/refactor/formulas_M2";

export default function AddProjectModal({ onAddProject, onClose }: AddMProjectodalProps) {

    // ----------------------------
    // ------- Estados ------------
    // ----------------------------
    // usar información de la tabla
    const { zones } = useZone();
    const { equipos } = useEquipos();
    const { materiales } = useMateriales();

    // valores iniciales
    const [form, setForm] = useState<ProjectFormState>(INITIAL_PROJECT_FORM);
    const [form_zone, setForm_zone] = useState<ZoneFormState>(INITIAL_ZONE_FORM);

    // ----------------------------------------
    // ------- INFORMACIÓN SELECTA ------------
    // ----------------------------------------
    // datos seleccionados
    const [selectedMaterialByRow, setSelectedMaterialByRow] = useState<Record<string, { materialId: string; description: string }>>({});
    const [selectedEquipmentByRow, setSelectedEquipmentByRow] = useState<Record<string, { equipoId: string; description: string }>>({});
    const [selectedEquipmentTable, setSelectedEquipmentTable] = useState<SelectedEquipmentItem[]>([]);
    const [selectedMaterialTable, setSelectedMaterialTable] = useState<SelectedMaterialItem[]>([]);

    // inversores considerados para dimensionar el cable AC
    const [invertersToConsider, setInvertersToConsider] = useState<string>("");

    // zona seleccionada
    const selectedZone = form_zone.zona;

    // ángulo seleccionado
    const selectedAngle = form.angulo;

    // // ----------------------------
    // // ------- NREL API -----------
    // // ----------------------------
    // const { ghi_nrel,
    //     // hsp,
    //     loading: NRELloading, error: NRELerror } = useConverterNREL({
    //     latitude:  form_zone.latitude ?? "",
    //     longitude: form_zone.longitude ?? "",
    // })
    // console.log("Datos de radiación obtenidos de NREL API:", { ghi_nrel, NRELloading, NRELerror });

    // // Helper para el valor de un campo NREL
    // const nrelValue = (val: number | null) => {
    //     if (NRELerror)       return `Error: ${NRELerror}`;
    //     if (NRELloading)     return "Cargando...";

    //     if (val !== null)    return `${val}`;
    //     return "Sin datos";
    // };

    // ----------------------------------------
    // ------- Cálculos de requerimientos -----
    // ----------------------------------------

    const computedRequirements = useComputedRequirements(form, form_zone, selectedEquipmentTable, selectedAngle)

    // ------------------------------------------------
    // ------- EFECTO PARA SINCRONIZAR CANTIDADES -----
    // ------------------------------------------------

    useSyncQuantities(form, computedRequirements.computedRequirements, 
        selectedEquipmentTable, setSelectedEquipmentTable, setSelectedMaterialTable)

    // ----------------------------------------
    // ------- Condicionar renderizado de selectores ------------------------
    // ----------------------------------------

    const showModuleSelector = Number(computedRequirements.computedRequirements.potenciaDC) > 0 && computedRequirements.computedRequirements.potenciaDC != "Infinity";
    const showInverterSelector = Number(computedRequirements.computedRequirements.potenciaAC) > 0 && computedRequirements.computedRequirements.potenciaDC != "Infinity";
    const isNotOnGrid = form.tipo_instalacion !== "conexión ON-GRID";
    const showBatterySelector = isNotOnGrid
    // const showStructureSelector = Boolean(form.strings) && Number(form.strings) > 0;

    // ----------------------------------------
    // ------- EVENTOS ------------------------
    // ----------------------------------------

    // Form
    function updateField<K extends keyof ProjectFormState>(field: K, value: ProjectFormState[K]) {
        setForm((current) => {
            const updated = { ...current, [field]: value };
            return updated;
        });
    }

    // Aceptar inserción
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const isAutoEnergy = form.opcion_llenado === "AUTOMÁTICO";
        const isAutoPanels = form.opcion_llenado_paneles !== "MANUAL";

        await onAddProject({
            ...form,
            rendimiento_modulo_porcentaje: String(80),
            opcion_llenado_paneles: isAutoPanels ? "AUTOMÁTICO" : "MANUAL",
            energia_requerida: isAutoEnergy
                ? computedRequirements.computedRequirements.energia
                : form.energia_requerida,
            potencia_ac_requerida: isAutoEnergy
                ? computedRequirements.computedRequirements.potenciaAC
                : form.potencia_ac_requerida,
            potencia_dc_requerida: isAutoEnergy
                ? computedRequirements.computedRequirements.potenciaDC
                : form.potencia_dc_requerida,
            strings_min: isAutoPanels
                ? computedRequirements.computedRequirements.strings_minimos
                : form.strings_min,
            strings_max: isAutoPanels
                ? computedRequirements.computedRequirements.strings_maximos
                : form.strings_max,
            itm_ac_min: computedRequirements.computedRequirements.itm_ac_min,
            itm_dc_min: computedRequirements.computedRequirements.itm_dc_min,
            spd_voltage: computedRequirements.computedRequirements.spd_min,
            ah_sistema: computedRequirements.computedRequirements.ah_sistema,
            num_baterias: computedRequirements.computedRequirements.num_baterias,
        }, selectedEquipmentTable, selectedMaterialTable);
    }

    // Dentro del componente, después de los otros hooks, agrega:
    const { handle_onChange, handle_click } = useSelectionHandlers({
        equipos,
        materiales,
        form,
        computedRequirements: computedRequirements.computedRequirements,
        selectedEquipmentByRow,
        selectedMaterialByRow,
        selectedEquipmentTable,
        selectedMaterialTable,
        invertersToConsider: Number(invertersToConsider) || 0,
        setSelectedEquipmentByRow,
        setSelectedMaterialByRow,
        setSelectedEquipmentTable,
        setSelectedMaterialTable,
    });


    // Handler para cambiar la opción de llenado (AUTOMÁTICO | MANUAL)
    function handleOpcionLlenadoChange(value: FillOptions) {
        updateField("opcion_llenado", value);
    }

    // Handler para cambiar la opción de llenado para la cantidad de paneles (AUTOMÁTICO | MANUAL)
    function handleOpcionLlenadoChangePANELES(value: FillOptions) {
        updateField("opcion_llenado_paneles", value);
    }

    // Condicionar el estado de la visualización del selector de EQUIPOS
    const isEquipmentTypeSelected = (type: string) => {
        if (type === "MÓDULO FV") {
            return selectedEquipmentTable.filter((item) => item.row === type).length >= 2;
        }
        return selectedEquipmentTable.some(item => item.row === type);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-2">
            <div className="flex h-[96vh] max-h-[96vh] w-[96vw] max-w-[1800px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Añadir Nuevo Proyecto</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        aria-label="Cerrar modal"
                    >
                        <AddProductCloseIcon />
                    </button>
                </div>

                <form noValidate onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                    <div className="modal-scroll min-h-0 flex-1 px-6 py-6">
                    <General_info_M2 
                        form={form} 
                        updateField={(field, value) => updateField(field as keyof ProjectFormState, value)} 
                        form_zone={form_zone} 
                        zones={zones} 
                        setForm_zone={setForm_zone} 
                        setForm={setForm} 
                        ANGLE_OPTIONS={ANGLE_OPTIONS} 
                        selectedZone={selectedZone} 
                        selectedAngle={String(selectedAngle)} />

                    <Formulas_M2 />

                    <Data_info_M2 
                        form={form} 
                        updateField={(field, value) => updateField(field as keyof ProjectFormState, value)} 
                        handleOpcionLlenadoChange={(value) => handleOpcionLlenadoChange(value as FillOptions)}
                        handleOpcionLlenadoChangePANELES={(value) => handleOpcionLlenadoChangePANELES(value as FillOptions)} 
                        computedRequirements={computedRequirements.computedRequirements} 
                        getFieldValueLightClass={getFieldValueLightClass} 
                        getFieldValueDarkClass={getFieldValueDarkClass} 
                        shouldRender_M2_battery_properties={(value) => shouldRender_M2_battery_properties(value as string)} 
                        shouldRender_M2_configuration={(value) => shouldRender_M2_configuration(value as string)} 
                        CONNECTION_TYPE_OPTIONS={CONNECTION_TYPE_OPTIONS} 
                        selectedEquipment={computedRequirements.computedRequirements.selectedEquipment ?? {
                            row: "",
                            id: "",
                            description: "",
                            marca: "",
                            codigo: "",
                            potencia_maxima: 0,
                            mppt: 0,
                            cadenas:0,
                            dod: 0,
                            potencia_ac: 0,
                            voc_vmax: 0,
                            vmpp_vmin: 0,
                            isc_i_out: 0,
                            impp_i_in: "",
                            cantidad: 0,
                            unidad: "",
                            precio_soles: 0,
                            precio_dolares: 0,
                            precio_soles_igv: 0,
                            precio_dolares_igv: 0,
                        }} 
                        selectedInverter={computedRequirements.computedRequirements.selectedInverter ?? {
                            row: "",
                            id: "",
                            description: "",
                            marca: "",
                            codigo: "",
                            potencia_maxima: 0,
                            mppt: 0,
                            cadenas: 0,
                            dod: 0,
                            potencia_ac: 0,
                            voc_vmax: 0,
                            vmpp_vmin: 0,
                            isc_i_out: 0,
                            impp_i_in: "",
                            cantidad: 0,
                            unidad: "",
                            precio_soles: 0,
                            precio_dolares: 0,
                            precio_soles_igv: 0,
                            precio_dolares_igv: 0,
                        }} 
                        selectedBattery={computedRequirements.computedRequirements.selectedBattery ?? {
                            row: "",
                            id: "",
                            description: "",
                            marca: "",
                            codigo: "",
                            potencia_maxima: 0,
                            mppt: 0,
                            cadenas: 0,
                            dod: 0,
                            potencia_ac: 0,
                            voc_vmax: 0,
                            vmpp_vmin: 0,
                            isc_i_out: 0,
                            impp_i_in: "",
                            cantidad: 0,
                            unidad: "",
                            precio_soles: 0,
                            precio_dolares: 0,
                            precio_soles_igv: 0,
                            precio_dolares_igv: 0,
                        }} />

                    <Selectors_M2
                        equipmentRows={equipmentRows}
                        materialRows={materialRows}
                        selectedEquipmentTable={selectedEquipmentTable}
                        selectedMaterialTable={selectedMaterialTable}
                        form={form}
                        updateField={(field, value) => updateField(field as keyof ProjectFormState, value)}
                        computedRequirements={computedRequirements.computedRequirements}
                        equipos={equipos}
                        materiales={materiales}
                        selectedEquipmentByRow={selectedEquipmentByRow}
                        selectedMaterialByRow={selectedMaterialByRow}
                        invertersToConsider={invertersToConsider}
                        setInvertersToConsider={setInvertersToConsider}
                        isEquipmentTypeSelected={isEquipmentTypeSelected}
                        showModuleSelector={showModuleSelector}
                        showInverterSelector={showInverterSelector}
                        showBatterySelector={showBatterySelector}
                        handle_onChange={handle_onChange}
                        handle_click={handle_click}
                    />
                    <Tables_M2
                        selectedEquipmentTable={selectedEquipmentTable}
                        setSelectedEquipmentTable={setSelectedEquipmentTable}
                        selectedMaterialTable={selectedMaterialTable}
                        setSelectedMaterialTable={setSelectedMaterialTable}
                        computedRequirements={computedRequirements.computedRequirements}
                        form={form}
                        equipos={equipos}
                    />
                    </div>
                    <div className="flex shrink-0 items-center justify-between border-t border-slate-200 px-6 py-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-300 px-6 py-3 text-lg font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="rounded-xl bg-brand-500 px-6 py-3 text-lg font-semibold text-white transition hover:bg-brand-600"
                        >
                            Añadir Proyecto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}