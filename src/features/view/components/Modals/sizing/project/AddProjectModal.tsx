"use client";

import { useState  } from "react";
import { AddProductCloseIcon } from "@/features/view/components/Icons/AddCloseIcon";

import type {
    ProjectFormState,
} from "@/lib/types/supabase/project-types";

import type {
    ZoneFormState,
} from "@/lib/types/supabase/zone-types"; // Tipados

import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { AddProductUrlField } from "@/features/view/components/Form_fields/AddUrlField"; // campos

import { INITIAL_PROJECT_FORM, INITIAL_ZONE_FORM } from "@/lib/utils/initialValues";

import { ANGLE_OPTIONS, CONNECTION_TYPE_OPTIONS, FillOptions, INSTALL_TYPE_OPTIONS, STATUS_PROJECT_OPTIONS } from "@/lib/utils/options"; // opciones

// import { useConverterNREL } from "@/features/view/hooks/api/useConverterNREL"
import { useZone } from "@/features/view/hooks/services/useRealtimeZonas";
import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";

import { useEquipos } from "@/features/view/hooks/services/useRealtimeEquipos";
import { useMateriales } from "@/features/view/hooks/services/useRealtimeMateriales";
import { AddProductTextField } from "../../../Form_fields/AddTextField";
import { AddEquipoReadonlyField } from "../../../Form_fields/AddEquipoReadOnlyField";
import { SelectedEquipmentItem, SelectedMaterialItem } from "@/lib/types/supabase/product-types";
import { shouldRender_M2_battery_properties, shouldRender_M2_configuration } from "@/lib/utils/helpers/render/render_modals";
import { AddProductRadioField } from "../../../Form_fields/AddRadioField";
import { AddMProjectodalProps } from "@/lib/types/components/modals";
import { useComputedRequirements } from "@/features/view/hooks/modals/useComputedRequirements";
import { useSyncQuantities } from "@/features/view/hooks/modals/useSyncQuantities";
import { ZoneSelection } from "@/features/view/hooks/modals/useZoneSelection";
import { handlerSelector } from "@/features/view/hooks/modals/useHandlerSelector";
import { useSelectionHandlers } from "@/features/view/hooks/modals/useSelectionHandlers";

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
        setSelectedEquipmentTable, setSelectedMaterialTable)

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

        await onAddProject({
            ...form,
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

    // -------------------------------------------------------------------------------------------

    // ---------------------------------------
    // ----- Condicionar coloreado -----------
    // ---------------------------------------
    const getDarkSilverColorClass = (value: string | number | null | undefined) => {
        if (value === "NaN" || value === "Infinity" || value === null || 
                value === undefined || value === "" || value === "0" || value === 0) return "bg-[#BFAC7E]"; 
        return "bg-slate-400"; // Default color
    };

    const getLightSilverColorClass = (value: string | number | null | undefined) => {
        if (value === "NaN" || value === "Infinity" || value === null || 
                value === undefined || value === "" || value === 0 || value === "0") return "bg-[#F0B746]"; 
        return "bg-slate-200"; // Default color
    };

    const isEquipmentTypeSelected = (type: string) => {
        return selectedEquipmentTable.some(item => item.row === type);
    };


    // --------------------------------------------------
    // ------- SELECTOR DE FILAS ------------------------
    // --------------------------------------------------

    const selectionRowStyles = "grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.35fr)_auto] lg:items-end";
    const actionButtonStyles = "shrink-0 whitespace-nowrap rounded-xl border border-slate-300 px-4 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50";

    type SelectionRowProps = {
        label: string;
        buttonLabel: string;
        value: string;
        options: string[];
        onChange: (value: string) => void;
        onClick?: () => void;
        customSelectClass?: string; // Optional custom class for select styling
    };

    function SelectionRow({ label, buttonLabel, value, options, onChange, onClick, customSelectClass }: SelectionRowProps) {
        return (
            <div className={selectionRowStyles}>
                <div className="min-w-0">
                    <AddProductSelectField
                        label={label}
                        required
                        value={value}
                        options={options}
                        onChange={onChange}
                        customClass={customSelectClass}
                    />
                </div>
                <button type="button" className={actionButtonStyles} onClick={onClick}>
                    {buttonLabel}
                </button>
            </div>
        );
    }

    const equipmentRows = [
        "ACCESORIO",
        "BATERÍA",
        "ESTRUCTURA",
        "INVERSOR",
        "MÓDULO FV",
    ];

    const materialRows = [
        "CABLE",
        "PROTECCIÓN",
        "MC4",
        "CANALIZACIÓN",
        "CONSUMIBLE",
    ];
    
    // -------------------------------------------------------------------------------------------


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
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

                <form onSubmit={handleSubmit} className="max-h-[calc(95vh-88px)] overflow-y-auto px-6 py-6">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <AddProductTextField
                                label="Nombre del proyecto"
                                required
                                placeholder=" "
                                value={form.nombre}
                                onChange={(value) => updateField("nombre", value)}
                            />
                            <AddProductSelectField
                                label="Estado del proyecto"
                                required
                                value={form.estado_proyecto}
                                options={STATUS_PROJECT_OPTIONS}
                                onChange={(value) => updateField("estado_proyecto", value)}
                            />
                            <AddProductSelectField
                                label="Tipo de instalación"
                                required
                                value={form.tipo_instalacion}
                                options={INSTALL_TYPE_OPTIONS}
                                onChange={(value) => updateField("tipo_instalacion", value)}
                            />
                            <AddProductUrlField
                                label="Enlace al proyecto"
                                placeholder=" "
                                value={form.enlace}
                                onChange={(value) => updateField("enlace", value)}
                            />
                        </section>
                    </div>
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <AddProductSelectField
                                label="Zona"
                                required
                                value={form_zone.zona ?? ""}
                                options={["Seleccione zona", ...zones.map((zone) => zone.zona)]}
                                onChange={(value) => ZoneSelection(value, zones, 
                                    setForm_zone, setForm)}
                            />
                            <AddProductSelectField
                                label="Orientación de la radiación"
                                required
                                value={String(form.angulo)}
                                options={ANGLE_OPTIONS}
                                onChange={(value) => updateField("angulo", value)}
                            />

                            {selectedZone && (
                                <>
                                    <span>
                                        <AddProductReadonlyField
                                            label="Latitud de la zona"
                                            value={form_zone.latitude ?? "---"}
                                        />
                                    </span>
                                    <span>
                                        <AddProductReadonlyField
                                            label="Longitud de la zona"
                                            value={form_zone.longitude ?? "---"}
                                        />
                                    </span>
                                    {selectedAngle == "Coplanar" ? (
                                            <span>
                                            <AddProductReadonlyField
                                                label="GHI anual de la zona"
                                                value={form_zone.ghi_respaldo ?? "---"}
                                            />
                                        </span>
                                        ) : selectedAngle == "Inclinado" ? (
                                        <span>
                                            <AddProductReadonlyField
                                                label="GTI anual de la zona"
                                                value={form_zone.gti_respaldo ?? "---"}
                                            />
                                        </span>
                                        ) : 
                                        <span>
                                            <p>Seleccione la orientación de los módulos</p>
                                        </span>
                                    }
                                    {/* <span>
                                    {!NRELerror && ghi_nrel !== null ? (
                                        <span>
                                            <AddProductReadonlyField
                                                label="GHI (NREL) - kWh/m²/año"
                                                value={nrelValue(ghi_nrel)}
                                            />
                                        </span>
                                    ) : (
                                        <>
                                            <span>
                                                <AddProductReadonlyField
                                                    label="GHI anual de la zona"
                                                    value={form_zone.ghi_respaldo ?? "---"}
                                                />
                                            </span>
                                            <p className="w-50 text-sm text-yellow-600">
                                                En caso haya problemas con la API, los datos han sido registrados según Global Solar ATLAS.
                                            </p>
                                        </>
                                    )}
                                    </span> */}
                                </>
                            )}
                        </section>
                    </div>

                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="grid grid-cols-1 gap-40 md:grid-cols-[minmax(0,2.5fr)_minmax(0,2.5fr)_minmax(0,2.5fr)_minmax(0,2.5fr)]">
                                <div>
                                    <h2 className="mb-10 text-2xl font-bold text-slate-900">Datos de entrada del sistema</h2>
                                    <AddProductNumberField
                                        label="Demanda eléctrica anual (kWh)"
                                        required
                                        value={Number(form.demanda_electrica) > 0 ? Number(form.demanda_electrica) : ""}
                                        onChange={(value) => updateField("demanda_electrica", String(value))}
                                        step={1}
                                        min={0}
                                    />
                                    {shouldRender_M2_configuration(form.tipo_instalacion) && (
                                        <AddProductSelectField
                                            label="Configuración"
                                            required
                                            value={form.configuracion}
                                            options={CONNECTION_TYPE_OPTIONS}
                                            onChange={(value) => updateField("configuracion", value)}
                                        />
                                    )}
                                    <AddProductNumberField
                                        label="Porcentaje de cobertura (%)"
                                        required
                                        value={Number(form.cobertura_porcentaje) > 0 ? Number(form.cobertura_porcentaje) : ""}
                                        onChange={(value) => updateField("cobertura_porcentaje", String(value))}
                                        step={5}
                                        min={30}
                                        max={40}
                                    />
                                    <AddProductReadonlyField
                                        label="Porcentaje de rendimiento del módulo (%)"
                                        value="80"
                                    />




                                    <h2 className="mt-10 mb-10 text-2xl font-bold text-slate-900">Requerimientos energéticos</h2>
                                    {/* Handlers */}
                                    <AddProductRadioField
                                        label="Llenado automático"  checked={form.opcion_llenado == "AUTOMÁTICO"}
                                        onChange={() => handleOpcionLlenadoChange("AUTOMÁTICO")}
                                    />
                                    <AddProductRadioField
                                        label="Llenado manual"  checked={form.opcion_llenado == "MANUAL"}
                                        onChange={() => handleOpcionLlenadoChange("MANUAL")}
                                    />
                                    {form.opcion_llenado == "AUTOMÁTICO" ? (
                                        <>
                                            <AddEquipoReadonlyField
                                                label="Energía requerida"
                                                value={computedRequirements.computedRequirements.energia}
                                                colorClass={getLightSilverColorClass(computedRequirements.computedRequirements.energia)}
                                            />
                                            <AddEquipoReadonlyField
                                                label="Potencia DC requerida (KW)"
                                                value={String(Number(computedRequirements.computedRequirements.potenciaDC).toFixed(2))}
                                                colorClass={getLightSilverColorClass(computedRequirements.computedRequirements.potenciaDC)}
                                            />
                                            <AddEquipoReadonlyField
                                                label="Potencia AC requerida (KW)"
                                                value={String(Number(computedRequirements.computedRequirements.potenciaAC).toFixed(2))}
                                                colorClass={getLightSilverColorClass(computedRequirements.computedRequirements.potenciaAC)}
                                            />
                                        </>
                                        ) : (
                                            <>
                                                <AddProductNumberField
                                                    label="Energía requerida"    required
                                                    value={Number(form.energia_requerida) > 0 ? Number(form.energia_requerida) : ""}
                                                    onChange={(value) => updateField("energia_requerida", String(value))}
                                                    step={1} min={0}
                                                />
                                                <AddProductNumberField
                                                    label="Potencia DC requerida (KW)"    required
                                                    value={Number(form.potencia_dc_requerida) > 0 ? Number(form.potencia_dc_requerida) : ""}
                                                    onChange={(value) => updateField("potencia_dc_requerida", String(value))}
                                                    step={1} min={0} 
                                                />
                                                <AddProductNumberField
                                                    label="Potencia AC requerida (KW)"    required
                                                    value={Number(form.potencia_ac_requerida) > 0 ? Number(form.potencia_ac_requerida) : ""}
                                                    onChange={(value) => updateField("potencia_ac_requerida", String(value))}
                                                    step={1} min={0} 
                                                />
                                            </>                                            
                                        )
                                    }
                                </div>





                                
                                <div>
                                    {computedRequirements.computedRequirements.selectedEquipment && (
                                        <>
                                        <h2 className="mt-10 mb-10 text-2xl font-bold text-slate-900">Módulo seleccionado</h2>
                                        <AddEquipoReadonlyField
                                            label="Código del módulo seleccionado"
                                            value={computedRequirements.computedRequirements.selectedEquipment?.codigo ?? ""}
                                            colorClass={"bg-[#7CC3CC]"}
                                        />
                                        <AddEquipoReadonlyField
                                            label="Marca del módulo seleccionado"
                                            value={computedRequirements.computedRequirements.selectedEquipment?.marca ?? ""}
                                            colorClass={"bg-[#7CC3CC]"}
                                        />
                                        <AddEquipoReadonlyField
                                            label="VMPP del módulo seleccionado"
                                            value={String(Number(computedRequirements.computedRequirements.selectedEquipment?.vmpp_vmin).toFixed(2))}
                                            colorClass={getDarkSilverColorClass(computedRequirements.computedRequirements.selectedEquipment?.vmpp_vmin)}
                                        />
                                        <AddEquipoReadonlyField
                                            label="IMPP del módulo seleccionado"
                                            value={String(Number(computedRequirements.computedRequirements.selectedEquipment?.impp_i_in).toFixed(2))}
                                            colorClass={getDarkSilverColorClass(computedRequirements.computedRequirements.selectedEquipment?.impp_i_in)}
                                        />
                                        <AddEquipoReadonlyField
                                            label="VOC del módulo seleccionado"
                                            value={String(Number(computedRequirements.computedRequirements.selectedEquipment?.voc_vmax).toFixed(2))}
                                            colorClass={getDarkSilverColorClass(computedRequirements.computedRequirements.selectedEquipment?.voc_vmax)}
                                        />
                                        <AddEquipoReadonlyField
                                            label="ISC del módulo seleccionado"
                                            value={String(Number(computedRequirements.computedRequirements.selectedEquipment?.isc_i_out).toFixed(2))}
                                            colorClass={getDarkSilverColorClass(computedRequirements.computedRequirements.selectedEquipment?.isc_i_out)}
                                        />  
                                        <AddEquipoReadonlyField
                                            label="Potencia del módulo seleccionado"
                                            value={String(Number(computedRequirements.computedRequirements.selectedEquipment?.potencia_maxima).toFixed(2))}
                                            colorClass={getDarkSilverColorClass(computedRequirements.computedRequirements.selectedEquipment?.potencia_maxima)}
                                        />
                                        <AddEquipoReadonlyField
                                            label="Mínimo de Strings"
                                            value={String(Number(computedRequirements.computedRequirements.strings_minimos).toFixed(0))}
                                            colorClass={getLightSilverColorClass(computedRequirements.computedRequirements.strings_minimos)}
                                        />
                                        <AddEquipoReadonlyField
                                            label="Máximo de Strings"
                                            value={String(Number(computedRequirements.computedRequirements.strings_maximos).toFixed(0))}
                                            colorClass={getLightSilverColorClass(computedRequirements.computedRequirements.strings_maximos)}
                                        />
                                        <AddProductNumberField
                                            label="Número exacto de Strings"
                                            required
                                            value={Number(form.strings) > 0 ? Number(form.strings) : ""}
                                            onChange={(value) => updateField("strings", String(value))}
                                            min={Math.floor(Number(computedRequirements.computedRequirements.strings_minimos)) > 0 ?
                                                    Math.floor(Number(computedRequirements.computedRequirements.strings_minimos)) : 0
                                            }
                                            step={1}
                                            max={Math.floor(Number(computedRequirements.computedRequirements.strings_maximos)) > 0 ?
                                                    Math.floor(Number(computedRequirements.computedRequirements.strings_maximos)) : 0
                                            }
                                        />
                                    </>
                                    )}
                                </div>






                                <div>
                                    {computedRequirements.computedRequirements.selectedInverter && (
                                        <>
                                        <h2 className="mt-10 mb-10 text-2xl font-bold text-slate-900">Inversor seleccionado</h2>
                                        <AddEquipoReadonlyField
                                            label="Código del inversor seleccionado"
                                            value={computedRequirements.computedRequirements.selectedInverter?.codigo ?? ""}
                                            colorClass={"bg-[#7CC3CC]"}
                                        />
                                        <AddEquipoReadonlyField
                                            label="Marca del inversor seleccionado"
                                            value={computedRequirements.computedRequirements.selectedInverter?.marca ?? ""}
                                            colorClass={"bg-[#7CC3CC]"}
                                        />
                                        <AddEquipoReadonlyField
                                            label="Potencia DC máxima del inversor seleccionado"
                                            value={String(Number(computedRequirements.computedRequirements.selectedInverter?.potencia_maxima).toFixed(0))}
                                            colorClass={getDarkSilverColorClass(computedRequirements.computedRequirements.selectedInverter?.potencia_maxima)}
                                        />
                                        <AddEquipoReadonlyField
                                            label="Potencia AC del inversor seleccionado"
                                            value={String(Number(computedRequirements.computedRequirements.selectedInverter?.potencia_ac).toFixed(0))}
                                            colorClass={getDarkSilverColorClass(computedRequirements.computedRequirements.selectedInverter?.potencia_ac)}
                                        />
                                        <AddEquipoReadonlyField
                                            label="Corriente de entrada del inversor"
                                            value={String(Number(computedRequirements.computedRequirements.selectedInverter?.impp_i_in).toFixed(0))}
                                            colorClass={getDarkSilverColorClass(computedRequirements.computedRequirements.selectedInverter?.impp_i_in)}
                                        />
                                        <AddEquipoReadonlyField
                                            label="Corriente de salida del inversor"
                                            value={String(Number(computedRequirements.computedRequirements.selectedInverter?.isc_i_out).toFixed(0))}
                                            colorClass={getDarkSilverColorClass(computedRequirements.computedRequirements.selectedInverter?.isc_i_out)}
                                        />
                                        <AddEquipoReadonlyField
                                            label="Voltaje máximo del inversor por MPPT"
                                            value={String(Number(computedRequirements.computedRequirements.selectedInverter?.voc_vmax).toFixed(0))}
                                            colorClass={getDarkSilverColorClass(computedRequirements.computedRequirements.selectedInverter?.voc_vmax)}
                                        />
                                        <AddEquipoReadonlyField
                                            label="Número máximo de MPPTs a usarse"
                                            value={String(Number(computedRequirements.computedRequirements.selectedInverter?.mppt).toFixed(0))}
                                            colorClass={getDarkSilverColorClass(computedRequirements.computedRequirements.selectedInverter?.mppt ?? 0)}
                                        />
                                        <AddProductNumberField
                                            label="Número de MPPTs a usarse"
                                            required
                                            value={Number(form.mppt_number) > 0 ? Number(form.mppt_number) : ""}
                                            onChange={(value) => updateField("mppt_number", String(value))}
                                            min={0}  step={1}
                                            max={Math.floor(Number(computedRequirements.computedRequirements.selectedInverter?.mppt)) > 0 ? 
                                                    Math.floor(Number(computedRequirements.computedRequirements.selectedInverter?.mppt)) : 0}
                                        />




                                        <h2 className="mt-10 mb-10 text-2xl font-bold text-slate-900">Protecciones eléctricas</h2>
                                        <AddProductReadonlyField
                                            label="Protección ITM AC mínima"
                                            value={String(Number(computedRequirements.computedRequirements.itm_ac_min).toFixed(0))}
                                            colorClass={getLightSilverColorClass(computedRequirements.computedRequirements.itm_ac_min)}
                                        />
                                        <AddProductReadonlyField
                                            label="Protección ITM DC mínima"
                                            value={String(Number(computedRequirements.computedRequirements.itm_dc_min).toFixed(0))}
                                            colorClass={getLightSilverColorClass(computedRequirements.computedRequirements.itm_dc_min)}
                                        />
                                        <AddProductReadonlyField
                                            label="Protección SPD"
                                            value={String(Number(computedRequirements.computedRequirements.spd_min).toFixed(0))}
                                            colorClass={getLightSilverColorClass(computedRequirements.computedRequirements.spd_min)}
                                        />
                                    </>
                                    )}
                                </div>




                                <div>
                                    {shouldRender_M2_battery_properties(form.tipo_instalacion) && (
                                        <>
                                            {computedRequirements.computedRequirements.selectedBattery && (
                                                <>
                                                    <h2 className="mt-10 mb-10 text-2xl font-bold text-slate-900">Características de la batería seleccionada</h2>
                                                    <AddEquipoReadonlyField
                                                        label="Código de la batería seleccionada"
                                                        value={computedRequirements.computedRequirements.selectedBattery?.codigo ?? ""}
                                                        colorClass={"bg-[#7CC3CC]"}
                                                    />
                                                    <AddEquipoReadonlyField
                                                        label="Marca de la batería seleccionado"
                                                        value={computedRequirements.computedRequirements.selectedBattery?.marca ?? ""}
                                                        colorClass={"bg-[#7CC3CC]"}
                                                    />
                                                    <AddEquipoReadonlyField
                                                        label="Capacidad de la batería seleccionada"
                                                        value={String(Number(computedRequirements.computedRequirements.selectedBattery?.impp_i_in).toFixed(0))}
                                                        colorClass={getDarkSilverColorClass(computedRequirements.computedRequirements.selectedBattery?.impp_i_in)}
                                                    />
                                                    <AddEquipoReadonlyField
                                                        label="Voltaje de la batería seleccionada"
                                                        value={String(Number(computedRequirements.computedRequirements.selectedBattery?.vmpp_vmin).toFixed(1))}
                                                        colorClass={getDarkSilverColorClass(computedRequirements.computedRequirements.selectedBattery?.vmpp_vmin)}
                                                    />
                                                    <AddEquipoReadonlyField
                                                        label="DoD de la batería seleccionada"
                                                        value={String(Number(computedRequirements.computedRequirements.selectedBattery?.dod).toFixed(0))}
                                                        colorClass={getDarkSilverColorClass(computedRequirements.computedRequirements.selectedBattery?.dod)}
                                                    />




                                                    <h2 className="mt-10 mb-10 text-2xl font-bold text-slate-900">Almacenamiento energético</h2>
                                                    <AddProductNumberField
                                                        label="Días de autonomía"
                                                        value={Number(form.autonomia) > 0 ? Number(form.autonomia) : ""}
                                                        onChange={(value) => updateField("autonomia", String(value))}
                                                        min={0}
                                                        step={1}
                                                        max={2}
                                                    />
                                                    <AddProductReadonlyField
                                                        label="Capacidad (Ah) del sistema"
                                                        value={String(Number(computedRequirements.computedRequirements.ah_sistema).toFixed(2))}
                                                        colorClass={getLightSilverColorClass(computedRequirements.computedRequirements.ah_sistema)}
                                                    />
                                                    <AddProductReadonlyField
                                                        label="Número de baterías necesarias"
                                                        value={String(Number(computedRequirements.computedRequirements.num_baterias).toFixed(0))}
                                                        colorClass={getLightSilverColorClass(computedRequirements.computedRequirements.num_baterias)}
                                                    />
                                                </>
                                            )}
                                    </>
                                )}
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="grid grid-cols-1 gap-40 md:grid-cols-[minmax(0,2.0fr)_minmax(0,2.0fr)]">
                                <div>
                                    <h2 className="mb-10 text-2xl font-bold text-slate-900">Selección de equipos</h2>
                                    <div className="flex flex-col gap-4">
                                    {equipmentRows.map((label, index) => {
                                        const equipment_filteredOptions = handlerSelector(label, "EQUIPO", 
                                            selectedEquipmentTable, selectedMaterialTable, 
                                            form, computedRequirements.computedRequirements, 
                                            equipos, materiales);
                                        const isSelected = isEquipmentTypeSelected(label);
                                        const customSelectClass = isSelected && (label !== "ACCESORIO" && label !== "ESTRUCTURA")
                                            ? "bg-[#B5D18A] border-[#DE8BFC] text-black"
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
                                                value={selectedEquipmentByRow[`${label}-${index}`]?.description || `Seleccionar - ${label}`}
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
                                            form, computedRequirements.computedRequirements, 
                                            equipos, materiales);

                                            return (
                                                <SelectionRow
                                                    key={`material-row-${label}-${index}`}
                                                    label={label}
                                                    buttonLabel="Agregar"
                                                    value={selectedMaterialByRow[`${label}-${index}`]?.description || `Seleccionar - ${label}`}
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
                                        {selectedEquipmentTable.length > 0 ? (
                                            selectedEquipmentTable.map((item) => (
                                                <tr key={`${item.row}-${item.id}`} className="bg-white">
                                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                        {item.description}
                                                    </td>
                                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                        <AddProductNumberField
                                                            label="ingrese cantidad"
                                                            required
                                                            value={Number(item.cantidad ?? 0)}
                                                            onChange={(value) =>
                                                                setSelectedEquipmentTable((curr) =>
                                                                    curr.map((r) =>
                                                                        r.row === item.row && r.id === item.id ? 
                                                                            { ...r, cantidad: Number(value.toFixed(0)) } : r,
                                                                    ),
                                                                )
                                                            }
                                                            step={1} min={0} max={item.row === "ESTRUCTURA" && item.description.includes("baterías") ?
                                                                Math.floor(Number(computedRequirements.computedRequirements.num_baterias)/
                                                                    parseInt(item.description.match(/\d+/)?.[0] || "0" || ""))  :
                                                                item.row === "ESTRUCTURA" && item.description.includes("módulos") ? 
                                                                Math.floor(Number((form.strings))/parseInt(item.description.match(/\d+/)?.[0] || "0" || "")) :
                                                                100000}
                                                            disabled={item.row === "INVERSOR" || item.row === "MÓDULO FV" ||
                                                                item.row === "BATERÍA"}
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
                                                            className="rounded-xl bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-800"
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
                                        {selectedMaterialTable.length > 0 ? (
                                            selectedMaterialTable.map((item) => (
                                                <tr key={`${item.row}-${item.id}`} className="bg-white">
                                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                        {item.description}
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
                                                            disabled={item.row === "MC4" && item.description.includes("MC4")}
                                                        />
                                                    </td>
                                                    <td className="border-b border-slate-200 px-4 py-5">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedMaterialTable((current) =>
                                                                    current.filter((row) => row.id !== item.id),
                                                                );
                                                            }}
                                                            className="rounded-xl bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-800"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
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
                            className="rounded-xl bg-indigo-700 px-6 py-3 text-lg font-semibold text-white transition hover:bg-indigo-800"
                        >
                            Añadir Proyecto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}