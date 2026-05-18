"use client";

import { useState } from "react";

import { PortalShell } from "@/app/components/PortalShell";
// import Button2ViewProject from "@/features/components/Buttons/button2modal";
// import Button2UpdateProject from "@/features/components/Buttons/button2modal";

import { useProjects, 
    // useProjectMutations
} from "@/features/hooks/useRealtimeProjects"; // Supabase

import type { Project, 
    // ProjectFormData, 
    ProjectFormState } from "@/lib/types/project-types"; // Tipados

import { AddProductSelectField } from "@/features/components/Form_fields/AddProductSelectField";
import { AddProductReadonlyField } from "@/features/components/Form_fields/AddProductReadonlyField";

import { INITIAL_PROJECT_FORM } from "@/lib/utils/initialValues";
import { NAME_PROJECT_OPTIONS } from "@/lib/utils/options";

import { createProjectFormStateFromProject } from "@/features/mapping/project_mapping";

// import { useConverterSolarcast } from "@/features/hooks/api/useConverterSolarcast";
// import { useConverterNasa } from "@/features/hooks/api/useConverterNasa";
import { useConverterNREL } from "@/features/hooks/api/useConverterNREL"

export default function ProjectsPage() {

    const { projects } = useProjects(); // obtener la lista de proyectos

    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const form: ProjectFormState = selectedProject
        ? createProjectFormStateFromProject(selectedProject)
        : INITIAL_PROJECT_FORM;

    // // ----------------------------
    // // ------- NASA POWER API -----
    // // ----------------------------

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

    // // ----------------------------
    // // ------- SolarCast API -----
    // // ----------------------------
    // const { ghi, 
    //     // hsp, 
    //     loading: SolarCastloading, error: SolarCasterror } = useConverterSolarcast({
    //     latitude:  form.zona_info?.latitude ?? "",
    //     longitude: form.zona_info?.longitude ?? "",
    // })
    
    // Helper para el valor de un campo NREL
    const nrelValue = (val: number | null, unit: string) => {
        if (NRELerror)       return `Error: ${NRELerror}`;
        if (NRELloading)     return "Cargando...";
        // if (nasaError)       return `Error: ${nasaError}`;
        // if (nasaLoading)     return "Cargando...";
        // if (SolarCasterror)       return `Error: ${SolarCasterror}`;
        // if (SolarCastloading)     return "Cargando...";
        if (val !== null)    return `${val} ${unit}`;
        return "Sin datos";
    };
    
    return(
        <PortalShell
            title="Ventana para el dimensionamiento de sistemas solares fotovoltaicos"
            subtitle="Gestión para la selección de equipos y materiales eléctricos"
            activePath="/sizing"
        >        
        
        <main className="min-h-screen bg-[var(--page-bg)] text-[var(--foreground)]">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                    {/* Selector de proyecto */}
                    <AddProductSelectField
                        label="Proyecto"
                        required
                        value={selectedProject?.nombre ?? ""}
                        options={["Seleccione proyecto", ...(projects.length > 0 ? projects.map((p) => p.nombre) : NAME_PROJECT_OPTIONS)]}
                        onChange={(value) =>{ 
                            if (value === "Seleccione proyecto") {
                                setSelectedProject(null);
                            } else {
                                const project = projects.find((p) => p.nombre === value) ?? null;
                                setSelectedProject(project);
                            }
                        }}
                    />

                    {/* Campos visibles solo cuando hay proyecto seleccionado */}
                    {selectedProject && (
                        <>
                            <AddProductReadonlyField
                                label="Descripción del proyecto"
                                value={form.descripcion ?? "---"}
                            />
                            <AddProductReadonlyField
                                label="Zona del proyecto"
                                value={form.zona_info?.zona ?? "---"}
                            />
                            <span>
                                <AddProductReadonlyField
                                    label="Latitud de la zona"
                                    value={form.zona_info?.latitude ?? "---"}
                                />
                            </span>
                            <span>
                                <AddProductReadonlyField
                                    label="Longitud de la zona"
                                    value={form.zona_info?.longitude ?? "---"}
                                />
                            </span>

                            {/* Datos NREL: se muestran siempre que haya proyecto,
                            independientemente del valor de ghi (evita falsy con 0) */}
                            {!NRELerror ?  ( // cambiar dependiendo de la API
                                <>
                                    {/* <span>
                                        <AddProductReadonlyField
                                                label="HSP (NREL)"
                                                value={nrelValue(hsp, "kWh/m²/día")}
                                            />
                                    </span> */}
                                    <span>
                                            <AddProductReadonlyField
                                                label="GHI estimado (NREL)"
                                                value={nrelValue(ghi, "kWh/m²")}
                                            />
                                    </span>
                                </>
                            ): (
                                <>
                                    <span>
                                        <AddProductReadonlyField
                                            label="GHI anual de la zona"
                                            value={form.zona_info?.ghi_respaldo ?? "---"}
                                        />
                                    </span>
                                    <p className="text-sm text-yellow-600">
                                        En caso haya problemas con la API, los datos han sido
                                        registrados según Global Solar ATLAS.
                                    </p>
                                </>                                
                            )}     
                        </>
                    )}
                </section>
            </div>
        </main>

        </PortalShell>
    )
}