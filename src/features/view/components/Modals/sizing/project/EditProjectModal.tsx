"use client";

import { useState } from "react";
import { AddProductCloseIcon } from "@/features/view/components/Icons/AddCloseIcon";

import type {
    ProjectFormState,
} from "@/lib/types/supabase/project-types";

import type {
    ZoneFormState,
} from "@/lib/types/supabase/zone-types"; // Tipados

import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";

import {
    INITIAL_ZONE_FORM } from "@/lib/utils/initialValues";

import { ANGLE_OPTIONS, CONNECTION_TYPE_OPTIONS, FillOptions, INSTALL_TYPE_OPTIONS, STATUS_PROJECT_OPTIONS } from "@/lib/utils/options"; // opciones

// import { useConverterNREL } from "@/features/view/hooks/api/useConverterNREL"
import { useZone } from "@/features/view/hooks/services/useRealtimeZonas";
import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";

import { useEquipos } from "@/features/view/hooks/services/useRealtimeEquipos";
import { useMateriales } from "@/features/view/hooks/services/useRealtimeMateriales";
import { createProjectFormStateFromProject } from "@/lib/mapping/project_mapping";
import { AddProductUrlField } from "../../../Form_fields/AddUrlField";
import { AddProductTextField } from "../../../Form_fields/AddTextField";
import { AddEquipoReadonlyField } from "../../../Form_fields/AddEquipoReadOnlyField";
import { SelectedEquipmentItem, SelectedMaterialItem } from "@/lib/types/supabase/product-types";
import { shouldRender_M2_battery_properties, shouldRender_M2_configuration } from "@/lib/utils/helpers/render/render_modals";
import { AddProductRadioField } from "../../../Form_fields/AddRadioField";
import { EditProjectModalProps } from "@/lib/types/components/modals";
import { useComputedRequirements } from "@/features/view/hooks/modals/Sizing/useComputedRequirements";
import { useSyncQuantities } from "@/features/view/hooks/modals/Sizing/useSyncQuantities";
import { useSelectionHandlers } from "@/features/view/hooks/modals/Sizing/useSelectionHandlers";
import { ZoneSelection } from "@/features/view/hooks/modals/Sizing/useZoneSelection";
import { getFieldValueDarkClass, getFieldValueLightClass } from "@/lib/utils/helpers/fieldValueState";
import { equipmentRows, materialRows } from "@/lib/utils/helpers/project_modals/rows";
import { handlerSelector } from "@/features/view/hooks/modals/Sizing/useHandlerSelector";
import { SelectionRow } from "../../../Form_fields/AddSelectionRow";
import { General_info_M2 } from "@/features/view/sub_components/M2/General_info_M2";
import { Tables_M2 } from "@/features/view/sub_components/M2/Tables_M2";
import { Data_info_M2 } from "@/features/view/sub_components/M2/Data_info_M2";
import { Selectors_M2 } from "@/features/view/sub_components/M2/Selectors_M2";

export default function EditProjectModal({
    existingProject,
    existingProjectEquipos,
    existingProjectMateriales,
    onUpdateProject,
    onClose,
}: EditProjectModalProps) {

    // ----------------------------
    // ------- Estados ------------
    // ----------------------------
    // usar información de la tabla
    const { zones } = useZone();
    const { equipos } = useEquipos();
    const { materiales } = useMateriales();

    // valores iniciales
    const [form, setForm] = useState<ProjectFormState>(() => createProjectFormStateFromProject(existingProject));
    const [form_zone, setForm_zone] = useState<ZoneFormState>(() =>
        existingProject.zona_info
            ? {
                zona: existingProject.zona_info.zona,
                latitude: existingProject.zona_info.latitude,
                longitude: existingProject.zona_info.longitude,
                ghi_respaldo: existingProject.zona_info.ghi_respaldo,
                ghi_respaldo_diario: existingProject.zona_info.ghi_respaldo_diario,
                gti_respaldo: existingProject.zona_info.gti_respaldo,
                gti_respaldo_diario: existingProject.zona_info.gti_respaldo_diario,
                created_at: existingProject.zona_info.created_at,
                updated_at: existingProject.zona_info.updated_at,
            }
            : INITIAL_ZONE_FORM // en caso no haya zona existente o no tenga zona_info
    );

    // ----------------------------------------
    // ------- INFORMACIÓN SELECTA ------------
    // ----------------------------------------
    
    // datos seleccionados
    const [selectedMaterialByRow, setSelectedMaterialByRow] = useState<Record<string, { materialId: string; description: string }>>(() => {
        const map: Record<string, { materialId: string; description: string }> = {};
        const rows = ["CABLE", "PROTECCIÓN", "MC4", "CANALIZACIÓN", "CONSUMIBLE"];
        rows.forEach((label, idx) => {
            const found = existingProjectMateriales.find(
                (item) => item.material_info?.tipo_de_producto === label && item.material_info?.descripcion
            );
            if (found) {
                map[`${label}-${idx}`] = {
                    materialId: String(found.material_id),
                    description: found.material_info!.descripcion,
                };
            }
        });
        return map;
    });
    const [selectedEquipmentByRow, setSelectedEquipmentByRow] = useState<Record<string, { equipoId: string; description: string }>>(() =>
        Object.fromEntries(
            existingProjectEquipos
                .filter((item) => item.equipo_info?.tipo_de_producto && item.equipo_info?.descripcion)
                .map((item) => [
                    item.equipo_info!.tipo_de_producto,
                    {
                        equipoId: String(item.equipo_id),
                        description: item.equipo_info!.descripcion,
                    },
                ]),
        ),
    );
    const [selectedEquipmentTable, setSelectedEquipmentTable] = useState<SelectedEquipmentItem[]>(() =>
        existingProjectEquipos
            .filter((item) => item.equipo_info?.tipo_de_producto && item.equipo_info?.descripcion)
            .map((item) => ({
                row: item.equipo_info!.tipo_de_producto,
                id: item.equipo_id,
                description: item.equipo_info!.descripcion,
                codigo: item.equipo_info!.cod_producto,
                marca: item.equipo_info!.marca,
                potencia_maxima: item.equipo_info!.potencia_maxima,
                mppt: item.equipo_info!.mppt,
                dod: item.equipo_info!.dod,
                potencia_ac: item.equipo_info!.potencia_ac,
                voc_vmax: item.equipo_info!.voc_vmax,
                vmpp_vmin: item.equipo_info!.vmpp_vmin,
                isc_i_out: item.equipo_info!.isc_i_out,
                impp_i_in: item.equipo_info!.impp_i_in,
                cantidad: Number(item.cantidad),
                unidad: item.equipo_info!.unidad,
                precio_soles: item.equipo_info!.precio_soles,
                precio_dolares: item.equipo_info!.precio_dolares,
                precio_soles_igv: item.equipo_info!.precio_soles_igv,
                precio_dolares_igv: item.equipo_info!.precio_dolares_igv,
            })),
    );
    const [selectedMaterialTable, setSelectedMaterialTable] = useState<SelectedMaterialItem[]>(() =>
        existingProjectMateriales
            .filter((item) => item.material_info?.tipo_de_producto && item.material_info?.descripcion)
            .map((item) => ({
                row: item.material_info!.tipo_de_producto,
                id: item.material_id,
                description: item.material_info!.descripcion,
                cantidad: Number(item.cantidad),
                codigo: item.material_info!.cod_producto,
                unidad: item.material_info!.unidad,
                precio_soles: item.material_info!.precio_soles,
                precio_dolares: item.material_info!.precio_dolares,
                precio_soles_igv: item.material_info!.precio_soles_igv,
                precio_dolares_igv: item.material_info!.precio_dolares_igv,
            })),
    );

    // zona seleccionada
    const selectedZone = form_zone.zona;

    // ángulo seleccionado
    const selectedAngle = form.angulo;

    // // ----------------------------
    // // ------- NREL API -----
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

    const computedRequirements = useComputedRequirements(form, form_zone, 
        selectedEquipmentTable, selectedAngle)

    // ------------------------------------------------
    // ------- EFECTO PARA SINCRONIZAR CANTIDADES -----
    // ------------------------------------------------

    useSyncQuantities(form, computedRequirements.computedRequirements, 
            setSelectedEquipmentTable, setSelectedMaterialTable)
    

    // ----------------------------------------
    // ------- Condicionar renderizado de selectores ------------------------
    // ----------------------------------------

    const showModuleSelector = Number(computedRequirements.computedRequirements.potenciaDC) > 0 && computedRequirements.computedRequirements.potenciaDC != "Infinity";
    const showInverterSelector = Number(computedRequirements.computedRequirements.potenciaAC) > 0 && computedRequirements.computedRequirements.potenciaDC != "Infinity";
    const isNotOnGrid = form.tipo_instalacion !== "conexión ON-GRID";
    const showBatterySelector = isNotOnGrid

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

    // Aceptar actualización
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await onUpdateProject({
            ...form,
            updated_at: new Date(),
            rendimiento_modulo_porcentaje: String(80),
            energia_requerida: computedRequirements.computedRequirements.energia ?? form.opcion_llenado == "AUTOMÁTICO",
            potencia_ac_requerida: computedRequirements.computedRequirements.potenciaAC ?? form.opcion_llenado == "AUTOMÁTICO",
            potencia_dc_requerida: computedRequirements.computedRequirements.potenciaDC ?? form.opcion_llenado == "AUTOMÁTICO",
            strings_min: computedRequirements.computedRequirements.strings_minimos,
            strings_max: computedRequirements.computedRequirements.strings_maximos,
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
        setSelectedEquipmentByRow,
        setSelectedMaterialByRow,
        setSelectedEquipmentTable,
        setSelectedMaterialTable,
    });


    // Handler para cambiar la opción de llenado (AUTOMÁTICO | MANUAL)
    function handleOpcionLlenadoChange(value: FillOptions) {
        updateField("opcion_llenado", value);
    }

    const isEquipmentTypeSelected = (type: string) => {
        return selectedEquipmentTable.some(item => item.row === type);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Editar Proyecto</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        aria-label="Cerrar modal"
                    >
                        <AddProductCloseIcon />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="max-h-[calc(95vh-88px)] overflow-y-auto px-6 py-6">
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

                    <Data_info_M2 
                        form={form} 
                        updateField={(field, value) => updateField(field as keyof ProjectFormState, value)} 
                        handleOpcionLlenadoChange={(value) => handleOpcionLlenadoChange(value as FillOptions)} 
                        computedRequirements={computedRequirements.computedRequirements} 
                        getFieldValueLightClass={getFieldValueLightClass} 
                        getFieldValueDarkClass={getFieldValueDarkClass} 
                        shouldRender_M2_battery_properties={(value) => shouldRender_M2_battery_properties(value as string)} 
                        shouldRender_M2_configuration={(value) => shouldRender_M2_configuration(value as string)} 
                        CONNECTION_TYPE_OPTIONS={CONNECTION_TYPE_OPTIONS} 
                        selectedEquipment={computedRequirements.computedRequirements.selectedEquipment ?? {
                            id: "",
                            description: "",
                            codigo: "",
                            marca: "",
                            potencia_maxima: 0,
                            mppt: 0,
                            dod: 0,
                            potencia_ac: 0,
                            voc_vmax: 0,
                            vmpp_vmin: 0,
                            isc_i_out: 0,
                            impp_i_in: "",
                            cantidad: 0,
                            row: "",
                            unidad: "",
                            precio_soles: 0,
                            precio_dolares: 0,
                            precio_soles_igv: 0,
                            precio_dolares_igv: 0,
                        }} 
                        selectedInverter={computedRequirements.computedRequirements.selectedInverter ?? {
                            id: "",
                            description: "",
                            codigo: "",
                            marca: "",
                            potencia_maxima: 0,
                            mppt: 0,
                            dod: 0,
                            potencia_ac: 0,
                            voc_vmax: 0,
                            vmpp_vmin: 0,
                            isc_i_out: 0,
                            impp_i_in: "",
                            cantidad: 0,
                            row: "",
                            unidad: "",
                            precio_soles: 0,
                            precio_dolares: 0,
                            precio_soles_igv: 0,
                            precio_dolares_igv: 0,
                        }} 
                        selectedBattery={computedRequirements.computedRequirements.selectedBattery ?? {
                            id: "",
                            description: "",
                            codigo: "",
                            marca: "",
                            potencia_maxima: 0,
                            mppt: 0,
                            dod: 0,
                            potencia_ac: 0,
                            voc_vmax: 0,
                            vmpp_vmin: 0,
                            isc_i_out: 0,
                            impp_i_in: "",
                            cantidad: 0,
                            row: "",
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
                        computedRequirements={computedRequirements.computedRequirements}
                        form={form}
                        equipos={equipos}
                        materiales={materiales}
                        selectedEquipmentByRow={selectedEquipmentByRow}
                        selectedMaterialByRow={selectedMaterialByRow}
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
                    />

                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
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
                            Actualizar Proyecto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
