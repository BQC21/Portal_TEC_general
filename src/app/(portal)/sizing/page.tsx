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

import { createProjectFormStateFromProject } from "@/features/mapping/project_mapping";

export default function ProjectsPage() {

    const { projects } = useProjects(); // obtener la lista de proyectos
    // const { create, update, remove } = useProjectMutations(); // obtener funciones de mutación

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
        
        <main>
            <div>
                <section>
                    <AddProductSelectField
                        label="Proyecto"
                        required
                        value={form.nombre}
                        options={projects.map((p) => p.nombre)}
                        onChange={(value) =>{ 
                            const project = projects.find((p) => p.nombre === value) ?? null;
                            setSelectedProject(project);
                        }}
                    />
                    <p>{form.descripcion}</p>
                    <AddProductReadonlyField
                        label="zona del proyecto"
                        value={form.zona_info?.zona ?? ""}
                    />
                    <span>
                        <AddProductReadonlyField
                            label="Latitud de la zona"
                            value={form.zona_info?.latitude ?? ""}
                        />
                    </span>
                    <span>
                        <AddProductReadonlyField
                            label="Longitud de la zona"
                            value={form.zona_info?.longitude ?? ""}
                        />
                    </span>
                    <AddProductReadonlyField
                        label="Radiación solar anual"
                        value={form.zona_info?.ghi_respaldo ?? ""}
                    />
                </section>
            </div>
        </main>

        </PortalShell>
    )
}