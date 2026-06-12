"use client";

import { useState } from "react";
import { EditIcon } from "@/features/view/components/Icons/EditIcon";
import EditProjectModal from "@/features/view/components/Modals/sizing/project/EditProjectModal";
import type { Project, ProjectFormData } from "@/lib/types/project-types";
import { Project_Equipos } from "@/lib/types/project_equipos_join";
import { Project_Materiales } from "@/lib/types/project_materiales_join";
import { SelectedEquipmentItem, SelectedMaterialItem } from "@/lib/types/product-types";

type EditProjectModalProps = {
    project: Project;
    project_equipos: Project_Equipos[];
    project_materiales: Project_Materiales[];
    onUpdateProject: (
        project: Project,
        selectedEquipos: SelectedEquipmentItem[],
        selectedMateriales: SelectedMaterialItem[],
    ) => Promise<void> | void;
};

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
