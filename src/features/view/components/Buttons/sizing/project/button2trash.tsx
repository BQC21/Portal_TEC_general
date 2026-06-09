"use client";

import { DeleteProjectModal } from "@/features/view/components/Modals/sizing/project/DeleteProjectModal";
import { TrashIcon } from "@/features/view/components/Icons/TrashIcon";
import { useState } from "react";
import { Project } from "@/lib/types/project-types";
import { Project_Equipos } from "@/lib/types/project_equipos_join";
import { Project_Materiales } from "@/lib/types/project_materiales_join";

type DeleteProjectModalProps = {
    project: Project;
    project_equipos: Project_Equipos[];
    project_materiales: Project_Materiales[];
    onDeleteProject: (projectId: string) => void;
    onDeleteProjectEquipos: (projectsEquiposId: string) => void;
    onDeleteProjectMateriales: (projectMaterialesId: string) => void;
};

export function Button2Trash({ project, project_equipos, project_materiales,
    onDeleteProject, onDeleteProjectEquipos, onDeleteProjectMateriales }: DeleteProjectModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="table-icon-button text-indigo-600"
            title="Eliminar proyecto"
        >
            <TrashIcon />
        </button>

        {open && (
            <DeleteProjectModal
                project={project}
                project_equipos={project_equipos}
                project_materiales={project_materiales}
                onDeleteProject={(projectId: string) => {
                    onDeleteProject(projectId);
                    setOpen(false);
                }}
                onDeleteProjectEquipos={(projectsEquiposId: string) => {
                    onDeleteProjectEquipos(projectsEquiposId);
                    setOpen(false);
                }}
                onDeleteProjectMateriales={(projectMaterialesId: string) => {
                    onDeleteProjectMateriales(projectMaterialesId);
                    setOpen(false);
                }}
                onClose={() => setOpen(false)}
            />
        )}
        </>
    );
}
