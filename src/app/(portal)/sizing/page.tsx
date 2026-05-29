"use client";

import { PortalShell } from "@/features/view/components/PortalShell";

import { useProjects, 
    useProjectMutations
} from "@/features/view/hooks/services/useRealtimeProjects"; 
import { useZone, 
    useZoneMutations
} from "@/features/view/hooks/services/useRealtimeZonas"; 

import type { Project, 
    ProjectFormData, 
} from "@/lib/types/project-types";

import type { Zone, 
    ZoneFormData, 
} from "@/lib/types/zone-types";

import ProjectTable from "@/features/view/components/Tables/sizing/ProjectTable";
import ZoneTable from "@/features/view/components/Tables/sizing/ZoneTable";

import Button2Modal_project from "@/features/viewcomponents/Buttons/sizing/zone/button2modal";
import Button2Modal_zone from "@/features/viewcomponents/Buttons/sizing/project/button2modal";


export default function ProjectsPage() {

    const { projects, refetch: refetch_project } = useProjects(); // obtener la lista de proyectos
    const { create: create_project, update: update_project, remove: remove_project } = useProjectMutations(); // obtener funciones de mutación

    const { zones, refetch: refetch_zone } = useZone(); // obtener la lista de zonas
    const { create: create_zone, update: update_zone, remove: remove_zone } = useZoneMutations(); // obtener funciones de mutación

    // ---------------------------------
    // ---- Lista de eventos ----
    // ---------------------------------

    async function handleAddProject(project: ProjectFormData) {
        await create_project(project);
        await refetch_project();
    } 
    async function handleAddZone(zone: ZoneFormData) {
        await create_zone(zone);
        await refetch_zone();
    } 
    async function handleUpdateProject(updatedProject: Project) {
        const { id, ...projectData } = updatedProject;
        await update_project(id, projectData);
        await refetch_project();    
    } 
    async function handleUpdateZone(updatedZone: Zone) {
        const { id, ...zoneData } = updatedZone;
        await update_zone(id, zoneData);
        await refetch_zone();    
    } 
    async function handleDeleteProject(projectId: string) {
        await remove_project(projectId);
        await refetch_project();
    }
    async function handleDeleteZone(zoneId: string) {
        await remove_zone(zoneId);
        await refetch_zone();
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
                        <Button2Modal_project onAddProject={handleAddProject} />
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

        <main className="min-h-screen bg-[var(--page-bg)] text-[var(--foreground)]">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Button2Modal_zone onAddZone={handleAddZone} />
                    </div>
                </section>
                <ZoneTable 
                    zones={zones}
                    totalZones={zones.length}
                    onUpdateZone={handleUpdateZone}
                    onDeleteZone={handleDeleteZone}
                />
            </div>
        </main>

        </PortalShell>
    )
}