"use client";

import { useState } from "react";
import { EditIcon } from "@/features/view/components/Icons/EditIcon";
import EditProjectModal from "@/features/view/components/Modals/sizing/project/EditProjectModal";
import type { Project, ProjectFormData } from "@/lib/types/supabase/project-types";
import { EditProjectModalProps } from "@/lib/types/components/buttons";

export default function Button2Edit({ project, project_equipos, project_materiales,
    onUpdateProject }: EditProjectModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                <EditIcon />
                <span>Ver Proyecto</span> 
            </button>
            
            {open && (
                <EditProjectModal
                    existingProject={project}
                    existingProjectEquipos={project_equipos}
                    existingProjectMateriales={project_materiales}
                    onUpdateProject={async function (formData: ProjectFormData, selectedEquipos, selectedMateriales) {
                        const updatedProject: Project = { ...project, ...formData } as Project;
                        await onUpdateProject(updatedProject, selectedEquipos, selectedMateriales);
                        setOpen(false);
                    }}
                    onClose={() => setOpen(false)}
                />
            )}
        </div>
    );
}
