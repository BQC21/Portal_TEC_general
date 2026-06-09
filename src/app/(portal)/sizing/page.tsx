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

import Button2Modal_zone from "@/features/view/components/Buttons/sizing/zone/button2modal";
import Button2Modal_project from "@/features/view/components/Buttons/sizing/project/button2modal";
import type { ProjectSelectionItem } from "@/features/view/components/Modals/sizing/project/AddProjectModal";
import { useProjectEquipos, useProjectEquiposMutations } from "@/features/view/hooks/services/useRealtimeProjectsEquipos";
import { useProjectMateriales, useProjectMaterialesMutations } from "@/features/view/hooks/services/useRealtimeProjectsMateriales";


export default function ProjectsPage() {

    // ---------------------------------
    // ---- Usar Base de datos ---------
    // ---------------------------------    
    const { projects, refetch: refetch_project } = useProjects(); // obtener la lista de proyectos
    const { create: create_project, update: update_project, remove: remove_project } = useProjectMutations(); // obtener funciones de mutación

    const { zones, refetch: refetch_zone } = useZone(); // obtener la lista de zonas
    const { create: create_zone, update: update_zone, remove: remove_zone } = useZoneMutations(); // obtener funciones de mutación

    // JOIN EQUIPOS <---> PROYECTOS
    const { projects_equipos: project_equipos,
        refetch: fetchProjectEquipos } = useProjectEquipos();
    const { create: create_project_equipos,
        remove: remove_project_equipos
    } = useProjectEquiposMutations();

    // JOIN MATERIALES <---> PROYECTOS    
    const { projects_materiales: project_materiales,
        refetch: fetchProjectMateriales
    } = useProjectMateriales();
    const {create: create_project_material,
        remove: remove_project_material
    } = useProjectMaterialesMutations();

    // ---------------------------------
    // ---- Lista de eventos ----
    // ---------------------------------

    //----- Agregar
    async function handleAddProject(
        project: ProjectFormData,
        selectedEquipos: ProjectSelectionItem[] = [],
        selectedMateriales: ProjectSelectionItem[] = [],
    ) {
        const createdProject = await create_project(project);
        await Promise.all(
            selectedEquipos.map((equipo) =>
                create_project_equipos({
                    equipo_id: equipo.id,
                    proyecto_id: createdProject.id,
                    fecha_agregado: new Date(),
                    cantidad: "1",
                }),
            ),
        );
        await Promise.all(
            selectedMateriales.map((material) =>
                create_project_material({
                    material_id: material.id,
                    proyecto_id: createdProject.id,
                    fecha_agregado: new Date(),
                    cantidad: "1",
                }),
            ),
        );
        await refetch_project();
        await fetchProjectEquipos();
        await fetchProjectMateriales();
    }
    async function handleAddZone(zone: ZoneFormData) {
        await create_zone(zone);
        await refetch_zone();
    }

    //----- Actualizar
    async function handleUpdateProject(
        updatedProject: Project,
        selectedEquipos: ProjectSelectionItem[] = [],
        selectedMateriales: ProjectSelectionItem[] = [],
    ) {
        // actualiza base de datos
        const { id, ...projectData } = updatedProject;
        await update_project(id, projectData);

        // obtiene relaciones
        const existingEquipos = project_equipos.filter((item) => item.proyecto_id === id); 
        const existingMateriales = project_materiales.filter((item) => item.proyecto_id === id);
        
        // remueve relaciones
        await Promise.all(existingEquipos.map((item) => remove_project_equipos(String(item.id))));
        await Promise.all(existingMateriales.map((item) => remove_project_material(String(item.id))));

        // recrea relaciones
        await Promise.all(
            selectedEquipos.map((equipo) =>
                create_project_equipos({
                    equipo_id: equipo.id,
                    proyecto_id: id,
                    fecha_agregado: new Date(),
                    cantidad: "1",
                }),
            ),
        );
        await Promise.all(
            selectedMateriales.map((material) =>
                create_project_material({
                    material_id: material.id,
                    proyecto_id: id,
                    fecha_agregado: new Date(),
                    cantidad: "1",
                }),
            ),
        );

        // sincronización con UI
        await refetch_project();
        await fetchProjectEquipos();
        await fetchProjectMateriales();
    }
    async function handleUpdateZone(updatedZone: Zone) {
        const { id, ...zoneData } = updatedZone;
        await update_zone(id, zoneData);
        await refetch_zone();
    }

    //------ Eliminar
    async function handleDeleteProject(projectId: string) {
        const existingEquipos = project_equipos.filter((item) => item.proyecto_id === projectId);
        const existingMateriales = project_materiales.filter((item) => item.proyecto_id === projectId);
        await Promise.all(existingEquipos.map((item) => remove_project_equipos(String(item.id))));
        await Promise.all(existingMateriales.map((item) => remove_project_material(String(item.id))));
        await remove_project(projectId);
        
        await refetch_project();
        await fetchProjectEquipos();
        await fetchProjectMateriales();
    }
    async function handleDeleteZone(zoneId: string) {
        await remove_zone(zoneId);
        await refetch_zone();
    }
    async function handleDeleteProjectEquipos(projectEquipoId: string) {
        await remove_project_equipos(projectEquipoId);
        await fetchProjectEquipos();
    }
    async function handleDeleteProjectMateriales(projectMaterialId: string) {
        await remove_project_material(projectMaterialId);
        await fetchProjectMateriales();
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
                        <Button2Modal_project
                            onAddProject={handleAddProject}
                        />
                    </div>
                </section>
                <ProjectTable
                    projects={projects}
                    projects_equipos={project_equipos}
                    projects_materiales={project_materiales}
                    totalProjects={projects.length}
                    onUpdateProject={handleUpdateProject}
                    onDeleteProject={handleDeleteProject}
                    onDeleteProjectEquipos={handleDeleteProjectEquipos}
                    onDeleteProjectMateriales={handleDeleteProjectMateriales}
                />
            </div>
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Button2Modal_zone
                            onAddZone={handleAddZone}
                        />
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
