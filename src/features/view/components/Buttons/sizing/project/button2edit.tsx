"use client";

import { useState } from "react";
import { EditIcon } from "@/features/view/components/Icons/EditIcon";
import EditProjectModal  from "@/features/view/components/Modals/sizing/project/EditProjectModal";
import type { Project, ProjectFormData } from "@/lib/types/project-types";

type EditProjectModalProps = {
    project: Project;
    onUpdateProject: (project: Project) => void;
};

export default function Button2Edit({ project, onUpdateProject }: EditProjectModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                <EditIcon />
                <span>Actualizar Proyecto</span> 
            </button>
            
            {open && (
                <EditProjectModal
                    existingProject={project}
                    onUpdateProject={async function (formData: ProjectFormData) {
                        // merge the existing project's required fields (like id) with the form data
                        const updatedProject: Project = { ...project, ...formData } as Project;
                        await onUpdateProject(updatedProject);
                        setOpen(false);
                    }}
                    onClose={() => setOpen(false)}
                />
            )}
        </div>
    );
}