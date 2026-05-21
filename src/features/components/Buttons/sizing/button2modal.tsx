"use client";

import { useState } from "react";
import { PlusIcon } from "@/features/components/Icons/PlusIcon";
import AddProjectModal  from "@/features/components/Modals/sizing/AddProjectModal";
import type { Project, ProjectFormData } from "@/lib/types/project-types";

type Button2ModalProps = {
    existingProjects: Project[];
    onAddProject: (project: ProjectFormData) => void;
};

// callable interface for the add-project handler
interface AddProjectHandler {
    (project: ProjectFormData): Promise<void>;
}

export default function Button2Modal({ existingProjects, onAddProject }: Button2ModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                <PlusIcon />
                <span>Añadir Producto</span> 
            </button>
            
            {open && (
                <AddProjectModal
                    existingProject={existingProjects}
                    onAddProject={async function (project: ProjectFormData) {
                        await onAddProject(project);
                        setOpen(false);
                    } as AddProjectHandler}
                    onClose={() => setOpen(false)}
                />
            )}
        </div>
    );
}