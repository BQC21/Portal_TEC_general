"use client";

import { DeleteProjectModal } from "@/features/view/components/Modals/sizing/project/DeleteProjectModal";
import { TrashIcon } from "@/features/view/components/Icons/TrashIcon";
import { useState } from "react";
import { DeleteProjectModalProps } from "@/lib/types/components/buttons";

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
