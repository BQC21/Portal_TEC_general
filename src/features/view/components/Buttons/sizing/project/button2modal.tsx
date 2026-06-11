"use client";

import { useState } from "react";
import { PlusIcon } from "@/features/view/components/Icons/PlusIcon";
import AddProjectModal, { SelectedEquipmentItem, SelectedMaterialItem } from "@/features/view/components/Modals/sizing/project/AddProjectModal";
import type { ProjectFormData } from "@/lib/types/project-types";

type Button2ModalProps = {
    onAddProject: (
        project: ProjectFormData,
        selectedEquipos: SelectedEquipmentItem[],
        selectedMateriales: SelectedMaterialItem[],
    ) => Promise<void> | void;
};

export default function Button2Modal({ onAddProject }: Button2ModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                <PlusIcon />
                <span>Añadir Proyecto</span> 
            </button>
            
            {open && (
                <AddProjectModal
                    onAddProject={async (project, selectedEquipos, selectedMateriales) => {
                        await onAddProject(project, selectedEquipos, selectedMateriales);
                        setOpen(false);
                    }}
                    onClose={() => setOpen(false)}
                />
            )}
        </div>
    );
}
