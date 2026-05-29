"use client";

import { DeleteProjectModal } from "@/features/view/components/Modals/sizing/project/DeleteProjectModal";
import { TrashIcon } from "@/features/view/components/Icons/TrashIcon";
import { useState } from "react";
import { Project } from "@/lib/types/project-types";

type DeleteProjectModalProps = {
    project: Project;
    onDeleteProject: (projectId: string) => void;
};

export function Button2Trash({ project, onDeleteProject }: DeleteProjectModalProps) {
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
                onDeleteProject={(projectId: string) => {
                    onDeleteProject(projectId);
                    setOpen(false);
                }}
                onClose={() => setOpen(false)}
            />
        )}
        </>
    );
}