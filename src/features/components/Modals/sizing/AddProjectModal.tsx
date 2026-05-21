"use client";

import { useState } from "react";

import { PortalShell } from "@/app/components/PortalShell";

import { AddProductCloseIcon } from "../../Icons/AddProductCloseIcon";

import type { 
    Project, 
    ProjectFormState,
    ProjectFormData,
} from "@/lib/types/project-types"; 

import type { 
    Zone, 
    ZoneFormState,
    ZoneFormData,
} from "@/lib/types/zone-types"; // Tipados

import { AddProductSelectField } from "@/features/components/Form_fields/AddProductSelectField";
import { AddProductReadonlyField } from "@/features/components/Form_fields/AddProductReadonlyField"; 
import { AddProductTextAreaField } from "../../Form_fields/AddProductTextAreaField"; // campos

import { INITIAL_PROJECT_FORM, INITIAL_ZONE_FORM } from "@/lib/utils/initialValues";
import { NAME_ZONES_OPTIONS } from "@/lib/utils/options"; // opciones

import { createProjectFormStateFromProject } from "@/features/mapping/project_mapping";

// import { useConverterSolarcast } from "@/features/hooks/api/useConverterSolarcast";
// import { useConverterNasa } from "@/features/hooks/api/useConverterNasa";
import { useConverterNREL } from "@/features/hooks/api/useConverterNREL"
import { useZone } from "@/features/hooks/useRealtimeZones";


// --- Tipo de variables ---
type AddProductModalProps = {
    existingProject: Project[];
    onAddProject: (project: ProjectFormData) => void;
    onClose: () => void;
};

export default function AddProjectModal({ existingProject, onAddProject, onClose }: AddProductModalProps) {
    const today = new Date().toISOString().split('T')[0];
    
    const { zones } = useZone(); // obtener la lista de zonas

    const [form, setForm] = useState<ProjectFormState>(INITIAL_PROJECT_FORM);
    const [form_zone, setForm_zone] = useState<ZoneFormState>(INITIAL_ZONE_FORM);
    

    // ----------------------------
    // ------- NASA POWER API -----
    // ----------------------------

    // const { ghi, loading: nasaLoading, error: nasaError } = useConverterNasa({
    //     latitude:  form.zona_info?.latitude ?? "",
    //     longitude: form.zona_info?.longitude ?? "",
    // });


    // ----------------------------
    // ------- NREL API -----
    // ----------------------------
    const { ghi, 
        // hsp, 
        loading: NRELloading, error: NRELerror } = useConverterNREL({
        latitude:  form.zona_info?.latitude ?? "",
        longitude: form.zona_info?.longitude ?? "",
    })

    // Helper para el valor de un campo NREL
    const nrelValue = (val: number | null) => {
        if (NRELerror)       return `Error: ${NRELerror}`;
        if (NRELloading)     return "Cargando...";
        // if (nasaError)       return `Error: ${nasaError}`;
        // if (nasaLoading)     return "Cargando...";

        if (val !== null)    return `${val}`;
        return "Sin datos";
    };

    // Actualizar campos del formulario
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

    return(
        <PortalShell
            title="Ventana para el dimensionamiento de sistemas solares fotovoltaicos"
            subtitle="Gestión para la selección de equipos y materiales eléctricos"
            activePath="/sizing"
        >        
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
                            options={["Seleccione zona", ...(zones.length > 0 ? zones.map((p) => p.zona) : NAME_ZONES_OPTIONS)]}
                            onChange={(value) =>{ 
                                if (value === "Seleccione zona") {
                                    setForm_zone(INITIAL_ZONE_FORM);
                                } else {
                                    setForm_zone((current) => ({ ...current, zona: value }));
                                }
                            }}
                        />
                    </section>
                </div> 
            </div>
        </div>
        </PortalShell>
    )
}