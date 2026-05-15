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

export default function ProjectsPage() {

    const { projects } = useProjects(); // obtener la lista de proyectos

    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const form: ProjectFormState = selectedProject
        ? createProjectFormStateFromProject(selectedProject)
        : INITIAL_PROJECT_FORM;

    return(
        <PortalShell
            title="Ventana para el dimensionamiento de sistemas solares fotovoltaicos"
            subtitle="Gestión para la selección de equipos y materiales eléctricos"
            activePath="/sizing"
        >        
        
        <main className="min-h-screen bg-[var(--page-bg)] text-[var(--foreground)]">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
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
                            <AddProductReadonlyField
                                label="Radiación solar anual"
                                value={form.zona_info?.ghi_respaldo ?? "---"}
                            />
                        </>
                    )}
                </section>
            </div>
        </main>

        </PortalShell>
    )
}