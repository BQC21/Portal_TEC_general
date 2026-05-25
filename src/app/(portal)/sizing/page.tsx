"use client";

import { PortalShell } from "@/app/components/PortalShell";

import { useProjects, 
    useProjectMutations
} from "@/features/hooks/useRealtimeProjects"; // Supabase

import type { Project, 
    ProjectFormData, 
} from "@/lib/types/project-types"; // Tipados

import ProjectTable from "@/features/components/Tables/sizing/ProjectTable";

import Button2Modal from "@/features/components/Buttons/sizing/button2modal";

export default function ProjectsPage() {

    const { projects, refetch } = useProjects(); // obtener la lista de proyectos
    const { create, update, remove } = useProjectMutations(); // obtener funciones de mutación

    // ---------------------------------
    // ---- Lista de eventos ----
    // ---------------------------------

    async function handleAddProject(project: ProjectFormData) {
        await create(project);
        await refetch();
    } 
    async function handleUpdateProject(updatedProject: Project) {
        const { id, ...projectData } = updatedProject;
        await update(id, projectData);
        await refetch();    
    } 
    async function handleDeleteProject(projectId: string) {
        await remove(projectId);
        await refetch();
    }

    return(
        <PortalShell
            title="Dimensionamiento de sistemas solares fotovoltaicos"
            subtitle="Gestión para la selección de equipos y materiales eléctricos"
            activePath="/sizing"
        >        
        
        <main className="min-h-screen bg-[var(--page-bg)] text-[var(--foreground)]">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Button2Modal onAddProject={handleAddProject} />
                    </div>
                </section>
                <ProjectTable 
                    projects={projects}
                    totalProjects={projects.length}
                    onUpdateProject={handleUpdateProject}
                    onDeleteProject={handleDeleteProject}
                />
            </div>
        </main>

        </PortalShell>
    )
}