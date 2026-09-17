"use client";

import { PortalShell } from "@/features/view/components/Shells/PortalShell";
import { ExcelWorkbook } from "@/features/view/components/Shells/ExcelWorkbook";

import { useProjects,
    useProjectMutations
} from "@/features/view/hooks/services/useRealtimeProjects";
import { useZone,
    useZoneMutations
} from "@/features/view/hooks/services/useRealtimeZonas";

import type { Project,
    ProjectFormData,
} from "@/lib/types/supabase/project-types";

import type { Zone,
    ZoneFormData,
} from "@/lib/types/supabase/zone-types";

import ProjectTable from "@/features/view/components/Tables/sizing/ProjectTable";
import ZoneTable from "@/features/view/components/Tables/sizing/ZoneTable";

import Button2Add from "@/features/view/components/Buttons/shared/button2Add";
import Button2MassiveClean from "@/features/view/components/Buttons/shared/button2MassiveClean";
import Button2MassiveDownload from "@/features/view/components/Buttons/shared/button2MassiveDownload";
import Button2MassiveUpload from "@/features/view/components/Buttons/shared/button2MassiveUpload";
import AddProjectModal from "@/features/view/components/Modals/sizing/project/AddProjectModal";
import AddZoneModal from "@/features/view/components/Modals/sizing/zone/AddZoneModal";
import { SelectedEquipmentItem, SelectedMaterialItem } from "@/lib/types/supabase/product-types";
import { useProjectEquipos, useProjectEquiposMutations } from "@/features/view/hooks/services/useRealtimeProjectsEquipos";
import { useProjectMateriales, useProjectMaterialesMutations } from "@/features/view/hooks/services/useRealtimeProjectsMateriales";
import { useMemo, useState } from "react";
import { sortZones } from "@/lib/utils/helpers/sorting/sorting";
import { SearchBar } from "@/features/view/components/Bars/SearchBar";
import { getNextCopyVersion, getVersionValue } from "@/lib/utils/helpers/manage_info/version";
import { formatDate } from "@/lib/utils/helpers/manage_info/date_manage";
import {
	insertProjectJoins,
	transformProjectRows,
	transformZoneRows,
} from "@/lib/utils/helpers/massive/massiveUpload";
import { ProjectExportRow } from "@/lib/types/components/Massive/download";
import {
	PROJECT_EXPORT_COLUMNS,
	ZONE_EXPORT_COLUMNS,
} from "@/lib/utils/helpers/templates/massiveDownload";
import {
	PROJECT_UPLOAD_COLUMNS,
	PROJECT_UPLOAD_HEADERS,
	ZONE_UPLOAD_COLUMNS,
	ZONE_UPLOAD_HEADERS,
} from "@/lib/utils/helpers/templates/massiveUpload";
import {
	PROJECTS_EQUIPOS_TABLE,
	PROJECTS_MATERIALES_TABLE,
	PROJECTS_TABLE,
	ZONE_TABLE,
} from "@/lib/utils/namingTolerance";


export default function ProjectsPage() {

    // ---------------------------------
    // ---- Usar Base de datos ---------
    // ---------------------------------    
    const { projects, refetch: refetch_project } = useProjects(); // obtener la lista de proyectos
    const { create: create_project, 
        update: update_project, 
        remove: remove_project } = useProjectMutations(); // obtener funciones de mutación

    const { zones, refetch: refetch_zone } = useZone(); // obtener la lista de zonas
    const { create: create_zone, 
        update: update_zone, 
        remove: remove_zone } = useZoneMutations(); // obtener funciones de mutación

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
    // ---- Filtrado -------------------
    // ---------------------------------
	const [searchProject, setSearchProject] = useState<string>("");
	const [searchZone, setSearchZone] = useState<string>("");

    const filteredProjects = projects.filter((project) => {
		const matchesDescription = !searchProject || 
                project.nombre.toLowerCase().includes(searchProject.toLowerCase());

		return matchesDescription;
	});

    // ---------------------------------
    // ---- Ordenamiento ---------------
    // ---------------------------------

    const sortedZones = useMemo(() => {
        return zones.length > 0 ? sortZones(zones, "zona") : [];
    }, [zones]);

    const filteredZones = sortedZones.filter((zone) => {
		const matchesDescription = !searchZone || 
            zone.zona?.toLowerCase().includes(searchZone.toLowerCase());

		return matchesDescription;
	});

    // ---------------------------------
    // ---- Lista de eventos ----
    // ---------------------------------

    //----- Agregar
    async function handleAddProject(
        project: ProjectFormData,
        selectedEquipos: SelectedEquipmentItem[] = [],
        selectedMateriales: SelectedMaterialItem[] = [],
    ) {
        const createdProject = await create_project(project);
        await Promise.all(
            selectedEquipos.map((equipo) =>
                create_project_equipos({
                    equipo_id: equipo.id,
                    proyecto_id: createdProject.id,
                    fecha_agregado: new Date(),
                    cantidad: String(equipo.cantidad ?? 1),
                }),
            ),
        );
        await Promise.all(
            selectedMateriales.map((material) =>
                create_project_material({
                    material_id: material.id,
                    proyecto_id: createdProject.id,
                    fecha_agregado: new Date(),
                    cantidad: String(material.cantidad ?? 1),
                }),
            ),
        );
        await refetch_project();
        await fetchProjectEquipos();
        await fetchProjectMateriales();
    }
    async function handleDuplicateProject(project: Project) {
        const now = new Date();
        const existingVersions = projects
            .filter((item) => item.nombre === project.nombre)
            .map((item) => getVersionValue(item.version));
        const nextVersion = getNextCopyVersion(
            getVersionValue(project.version),
            existingVersions,
        );
        const { id, created_at: _createdAt, updated_at: _updatedAt, version: _version, ...projectData } = project;

        const createdProject = await create_project({
            ...projectData,
            version: nextVersion,
            created_at: now,
            updated_at: now,
            demanda_mensual: [...(project.demanda_mensual ?? [])],
        });

        const sourceEquipos = project_equipos.filter((item) => item.proyecto_id === id);
        const sourceMateriales = project_materiales.filter((item) => item.proyecto_id === id);

        await Promise.all(
            sourceEquipos.map((equipo) =>
                create_project_equipos({
                    equipo_id: equipo.equipo_id,
                    proyecto_id: createdProject.id,
                    fecha_agregado: now,
                    cantidad: String(equipo.cantidad ?? 1),
                }),
            ),
        );
        await Promise.all(
            sourceMateriales.map((material) =>
                create_project_material({
                    material_id: material.material_id,
                    proyecto_id: createdProject.id,
                    fecha_agregado: now,
                    cantidad: String(material.cantidad ?? 1),
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
        selectedEquipos: SelectedEquipmentItem[] = [],
        selectedMateriales: SelectedMaterialItem[] = [],
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
                    cantidad: String(equipo.cantidad ?? 1),
                }),
            ),
        );
        await Promise.all(
            selectedMateriales.map((material) =>
                create_project_material({
                    material_id: material.id,
                    proyecto_id: id,
                    fecha_agregado: new Date(),
                    cantidad: String(material.cantidad ?? 1),
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

        <main className="min-h-screen bg-background text-foreground">
            <div className="flex w-full min-w-0 flex-col gap-6 py-5">
                <ExcelWorkbook
                    sheets={[
                        {
                            id: "Dimensionamientos",
                            label: "Dimensionamientos",
                            content: (
                                <>
                                    <section className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center">
                                        <div className="min-w-0 flex-1">
                                            <SearchBar
                                                value={searchProject}
                                                onChange={setSearchProject}
                                                placeholder="Buscar por nombre del proyecto..."
                                            />
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <Button2MassiveUpload
                                                title="Subida masiva de proyectos"
                                                description="Selecciona un archivo XLSX con la estructura de la hoja de proyectos."
                                                tableName={PROJECTS_TABLE}
                                                expectedHeaders={PROJECT_UPLOAD_HEADERS}
                                                columns={PROJECT_UPLOAD_COLUMNS}
                                                transformRows={transformProjectRows}
                                                relatedInserts={insertProjectJoins}
                                                onSuccess={async () => {
                                                    await refetch_project();
                                                    await fetchProjectEquipos();
                                                    await fetchProjectMateriales();
                                                }}
                                            />
                                            <Button2MassiveDownload
                                                title="Descarga masiva de proyectos"
                                                description="Exporta la lista de proyectos en XLSX o CSV."
                                                items={projects.map((project): ProjectExportRow => {
                                                    const equiposDescriptions = project_equipos
                                                        .filter((item) => item.proyecto_id === project.id)
                                                        .map((item) => item.equipo_info?.descripcion)
                                                        .filter((description): description is string => Boolean(description));
                                                    const materialesDescriptions = project_materiales
                                                        .filter((item) => item.proyecto_id === project.id)
                                                        .map((item) => item.material_info?.descripcion)
                                                        .filter((description): description is string => Boolean(description));

                                                    return {
                                                        nombre: project.nombre ?? "",
                                                        zona: project.zona_info?.zona ?? "",
                                                        angulo: project.angulo ?? "",
                                                        tipo_instalacion: project.tipo_instalacion ?? "",
                                                        configuracion: project.configuracion ?? "",
                                                        demanda_mensual: project.demanda_mensual ?? [],
                                                        demanda_electrica: Number(project.demanda_electrica) || 0,
                                                        equipos: equiposDescriptions.length > 0 ? equiposDescriptions.join("\n") : "-",
                                                        materiales: materialesDescriptions.length > 0 ? materialesDescriptions.join("\n") : "-",
                                                        enlace: project.enlace ?? "",
                                                        created_at: formatDate(project.created_at),
                                                        updated_at: formatDate(project.updated_at),
                                                        estado_proyecto: project.estado_proyecto ?? "",
                                                    };
                                                })}
                                                columns={PROJECT_EXPORT_COLUMNS}
                                                defaultFileName="proyectos"
                                            />
                                            <Button2MassiveClean
                                                currentCount={projects.length}
                                                onSuccess={refetch_project}
                                                tableName={PROJECTS_TABLE}
                                                relatedTableNames={[PROJECTS_EQUIPOS_TABLE, PROJECTS_MATERIALES_TABLE]}
                                                title="Limpieza masiva de proyectos"
                                                description="Esta acción elimina todas las filas de proyectos y sus equipos y materiales asociados."
                                                entityLabel="proyectos"
                                            />
                                            <Button2Add label="Añadir Proyecto">
                                                {(close) => (
                                                    <AddProjectModal
                                                        onAddProject={async (project, selectedEquipos, selectedMateriales) => {
                                                            await handleAddProject(project, selectedEquipos, selectedMateriales);
                                                            close();
                                                        }}
                                                        onClose={close}
                                                    />
                                                )}
                                            </Button2Add>
                                        </div>
                                    </section>
                                    <ProjectTable
                                        projects={filteredProjects}
                                        projects_equipos={project_equipos}
                                        projects_materiales={project_materiales}
                                        totalProjects={filteredProjects.length}
                                        onUpdateProject={handleUpdateProject}
                                        onDeleteProject={handleDeleteProject}
                                        onDeleteProjectEquipos={handleDeleteProjectEquipos}
                                        onDeleteProjectMateriales={handleDeleteProjectMateriales}
                                        onDuplicateProject={handleDuplicateProject}
                                    />
                                </>
                            ),
                        },
                        {
                            id: "zonas",
                            label: "Zonas",
                            content: (
                                <>
                                    <section className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center">
                                        <div className="min-w-0 flex-1">
                                            <SearchBar
                                                value={searchZone}
                                                onChange={setSearchZone}
                                                placeholder="Buscar por nombre de la zona..."
                                            />
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <Button2MassiveUpload
                                                title="Subida masiva de zonas"
                                                description="Selecciona un archivo XLSX con la estructura de la hoja de zonas."
                                                tableName={ZONE_TABLE}
                                                expectedHeaders={ZONE_UPLOAD_HEADERS}
                                                columns={ZONE_UPLOAD_COLUMNS}
                                                transformRows={transformZoneRows}
                                                onSuccess={refetch_zone}
                                            />
                                            <Button2MassiveDownload
                                                title="Descarga masiva de zonas"
                                                description="Exporta la lista de zonas en XLSX o CSV."
                                                items={zones.map((zone) => ({
                                                    zona: zone.zona ?? "",
                                                    latitude: zone.latitude ?? "",
                                                    longitude: zone.longitude ?? "",
                                                    gti_respaldo: zone.gti_respaldo ?? "",
                                                    gti_respaldo_diario: zone.gti_respaldo_diario ?? "",
                                                    ghi_respaldo: zone.ghi_respaldo ?? "",
                                                    ghi_respaldo_diario: zone.ghi_respaldo_diario ?? "",
                                                    hsp_peor_mes: zone.hsp_peor_mes ?? "",
                                                }))}
                                                columns={ZONE_EXPORT_COLUMNS}
                                                defaultFileName="zonas"
                                            />
                                            <Button2MassiveClean
                                                currentCount={zones.length}
                                                onSuccess={refetch_zone}
                                                tableName={ZONE_TABLE}
                                                title="Limpieza masiva de zonas"
                                                description="Esta acción elimina todas las filas de zonas."
                                                entityLabel="zonas"
                                            />
                                            <Button2Add label="Añadir Zona">
                                                {(close) => (
                                                    <AddZoneModal
                                                        onAddZone={async (zone) => {
                                                            await handleAddZone(zone);
                                                            close();
                                                        }}
                                                        onClose={close}
                                                    />
                                                )}
                                            </Button2Add>
                                        </div>
                                    </section>
                                    <ZoneTable
                                        zones={filteredZones}
                                        totalZones={filteredZones.length}
                                        onUpdateZone={handleUpdateZone}
                                        onDeleteZone={handleDeleteZone}
                                    />
                                </>
                            ),
                        },
                    ]}
                />
            </div>
        </main>

        </PortalShell>
    )
}
