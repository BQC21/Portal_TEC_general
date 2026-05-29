"use client";

import { useState, useMemo } from "react";

import { AddProductCloseIcon } from "@/features/view/components/Icons/AddCloseIcon";

import type { 
    ProjectFormState,
    ProjectFormData,
} from "@/lib/types/project-types"; 

import type { 
    ZoneFormState,
} from "@/lib/types/zone-types"; // Tipados

import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField"; 
import { AddProductTextAreaField } from "@/features/view/components//Form_fields/AddTextAreaField"; // campos

import { INITIAL_PROJECT_FORM, INITIAL_ZONE_FORM } from "@/lib/utils/initialValues";
import { CONNECTION_TYPE_OPTIONS } from "@/lib/utils/options"; // opciones
import { STATUS_PROJECT_OPTIONS } from "@/lib/utils/options";

// import { useConverterSolarcast } from "@/features/hooks/api/useConverterSolarcast";
// import { useConverterNasa } from "@/features/hooks/api/useConverterNasa";
import { useConverterNREL } from "@/features/view/hooks/api/useConverterNREL"
import { useZone } from "@/features/view/hooks/services/useRealtimeZonas";
import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";

import {
    computeEnergy,
    compute_DC_Power,
    compute_AC_Power
} from "@/lib/utils/helpers/energy_requirements"

// --- Tipo de variables ---
type AddProductModalProps = {
    onAddProject: (project: ProjectFormData) => void;
    onClose: () => void;
};

export default function AddProjectModal({ onAddProject, onClose }: AddProductModalProps) {
    const { zones } = useZone(); // obtener la lista de zonas

    const [form, setForm] = useState<ProjectFormState>(INITIAL_PROJECT_FORM);
    const [form_zone, setForm_zone] = useState<ZoneFormState>(INITIAL_ZONE_FORM);
    const selectedZone = form_zone.zona;

    // ----------------------------
    // ------- NREL API -----
    // ----------------------------
    const { ghi_nrel, 
        // hsp, 
        loading: NRELloading, error: NRELerror } = useConverterNREL({
        latitude:  form_zone.latitude ?? "",
        longitude: form_zone.longitude ?? "",
    })
    console.log("Datos de radiación obtenidos de NREL API:", { ghi_nrel, NRELloading, NRELerror });

    // Helper para el valor de un campo NREL
    const nrelValue = (val: number | null) => {
        if (NRELerror)       return `Error: ${NRELerror}`;
        if (NRELloading)     return "Cargando...";

        if (val !== null)    return `${val}`;
        return "Sin datos";
    };


    // ----------------------------------------
    // ------- Cálculos de requerimientos -----
    // ----------------------------------------
    
    const computedRequirements = useMemo(() => {
        
        const ghi = form.ghi ? Number(form.ghi) : form_zone.ghi_respaldo ? Number(form_zone.ghi_respaldo) : null;

        const energia = String(computeEnergy(Number(form.demanda_electrica), Number(form.cobertura_porcentaje)));
        const potenciaDC = String(compute_DC_Power(Number(energia), Number(ghi), Number(form.rendimiento_modulo_porcentaje)));
        const potenciaAC = String(compute_AC_Power(Number(potenciaDC), Number(form.relacion_dc_ac)));  
    
        return { energia, potenciaDC, potenciaAC };
    }, [form.demanda_electrica, form.cobertura_porcentaje, form.ghi, 
        form.rendimiento_modulo_porcentaje, form.relacion_dc_ac, form_zone.ghi_respaldo]);

    function updateField<K extends keyof ProjectFormState>(field: K, value: ProjectFormState[K]) {
        setForm((current) => {
            const updated = { ...current, [field]: value };
            return updated;
        });
    }

    // Aceptar insercion
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        onAddProject({
            ...form,

        });
    }

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
                    {/* Campos geográficos del proyecto */}
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            {/* Nombre y descripción del proyecto */}
                            <AddProductTextAreaField
                                label="Nombre del proyecto"
                                required
                                placeholder=" "
                                value={form.nombre}
                                onChange={(value) => updateField("nombre", value)}
                            />
                            <AddProductTextAreaField
                                label="Descripción del proyecto"
                                required
                                placeholder=" "
                                value={form.descripcion}
                                onChange={(value) => updateField("descripcion", value)}
                            />
                            {/* Selector de zonas */}
                            <AddProductSelectField
                                label="Zona"
                                required
                                value={form_zone.zona ?? ""}
                                options={["Seleccione zona", ...(zones.length > 0 ? zones.map((p) => p.zona) : zones.map((p) => p.zona))]}
                                onChange={(value) =>{ 
                                    if (value === "Seleccione zona") {
                                        setForm_zone(INITIAL_ZONE_FORM);
                                        updateField("zona_id", "");
                                        updateField("zona_info", undefined);
                                        updateField("hsp", "");
                                        updateField("ghi", "");
                                        return;
                                    } 
                                    // buscar zona seleccionada
                                    const selected = zones.find((zone) => zone.zona === value);

                                    if (selected) {
                                        setForm_zone({
                                            zona: selected.zona,
                                            latitude: selected.latitude,
                                            longitude: selected.longitude,
                                            ghi_respaldo: selected.ghi_respaldo,
                                            created_at: selected.created_at,
                                            updated_at: selected.updated_at,
                                        });
                                        updateField("zona_id", selected.id);
                                        updateField("zona_info", selected);
                                    }
                                }}
                            />

                            {/* Campos visibles solo cuando hay zona seleccionada */}
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
                                    {/* Datos de radiación: se muestran solo si la consulta devuelve un valor válido. */}
                                    {!NRELerror && ghi_nrel !== null ? (
                                        <>
                                            <span>
                                                <AddProductReadonlyField
                                                        label="GHI (NREL) - kWh/m²/año"
                                                        value={nrelValue(ghi_nrel)}
                                                />
                                            </span>
                                        </>                                
                                    ) : (
                                        <>
                                            <span>
                                                <AddProductReadonlyField
                                                    label="GHI anual de la zona"
                                                    value={form_zone.ghi_respaldo ?? "---"}
                                                />
                                            </span>
                                            <p className="text-sm text-yellow-600 w-50">
                                                En caso haya problemas con la API, los datos han sido
                                                registrados según Global Solar ATLAS.
                                            </p>
                                        </>  
                                    )}   
                                </>
                            )}
                            <AddProductSelectField
                                label="Estado del proyecto"
                                required
                                value={form.estado_proyecto}
                                options={STATUS_PROJECT_OPTIONS}
                                onChange={(value) => updateField("estado_proyecto", value)}
                            />
                        </section>
                    </div> 
                    {/* Cálculo de potencia DC y AC requerida */}
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    {/* columna 1: campos de entrada */}
                                    <AddProductNumberField 
                                        label="Demanda eléctrica anual (kWh)"
                                        required
                                        value={Number(form.demanda_electrica) > 0 ? Number(form.demanda_electrica) : ""}
                                        onChange={(value) => updateField("demanda_electrica", String(value))}
                                    />
                                    <AddProductSelectField 
                                        label="Tipo de instalación"
                                        required
                                        value={form.tipo_conexion}
                                        options={CONNECTION_TYPE_OPTIONS}
                                        onChange={(value) => updateField("tipo_conexion", value)}
                                    />
                                    <AddProductNumberField 
                                        label="Porcentaje de cobertura (%)"
                                        required
                                        value={Number(form.cobertura_porcentaje) > 0 ? Number(form.cobertura_porcentaje) : ""}
                                        onChange={(value) => updateField("cobertura_porcentaje", String(value))}
                                    />
                                    <AddProductNumberField 
                                        label="Porcentaje de rendimiento del módulo (%)"
                                        required
                                        value={Number(form.rendimiento_modulo_porcentaje) > 0 ? Number(form.rendimiento_modulo_porcentaje) : ""}
                                        onChange={(value) => updateField("rendimiento_modulo_porcentaje", String(value))}
                                    />
                                    <AddProductNumberField 
                                        label="Relación DC/AC (%)"
                                        required
                                        value={Number(form.relacion_dc_ac) > 0 ? Number(form.relacion_dc_ac) : ""}
                                        onChange={(value) => updateField("relacion_dc_ac", String(value))}
                                    />
                                </div>
                                <div>
                                    {/* columna 2: campos de salida */}
                                    <AddProductReadonlyField
                                        label="Energía requerida"
                                        value={computedRequirements.energia}
                                    />
                                    <AddProductReadonlyField
                                        label="Potencia DC requerida (KW)"
                                        value={String(Number(computedRequirements.potenciaDC).toFixed(2))}
                                    />
                                    <AddProductReadonlyField
                                        label="Potencia AC requerida (KW)"
                                        value={String(Number(computedRequirements.potenciaAC).toFixed(2))}
                                    />
                                </div>
                            </div>                            
                        </section>
                    </div>
                    <div className="mt-8 flex justify-end gap-4 border-t border-slate-200 pt-6">
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
    )
}