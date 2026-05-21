"use client";

import { useState } from "react";

import { PortalShell } from "@/app/components/PortalShell";

import { AddProductCloseIcon } from "../../Icons/AddProductCloseIcon";

import type { 
    Project, 
    ProjectFormState,
    ProjectFormData,
} from "@/lib/types/project-types"; // Tipados

import { AddProductSelectField } from "@/features/components/Form_fields/AddProductSelectField";
import { AddProductReadonlyField } from "@/features/components/Form_fields/AddProductReadonlyField"; // campos

import { INITIAL_PROJECT_FORM } from "@/lib/utils/initialValues";
import { NAME_ZONES_OPTIONS } from "@/lib/utils/options"; // opciones

import { createProjectFormStateFromProject } from "@/features/mapping/project_mapping";

// import { useConverterSolarcast } from "@/features/hooks/api/useConverterSolarcast";
// import { useConverterNasa } from "@/features/hooks/api/useConverterNasa";
import { useConverterNREL } from "@/features/hooks/api/useConverterNREL"

// --- Tipo de variables ---
type AddProductModalProps = {
    existingProject: Project[];
    onAddProject: (project: ProjectFormData) => void;
    onClose: () => void;
};

export default function AddProjectModal({ existingProject, onAddProject, onClose }: AddProductModalProps) {

    const [form, setForm] = useState<ProjectFormState>(INITIAL_PROJECT_FORM);

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
            </div>
        </div>
        </PortalShell>
    )
}