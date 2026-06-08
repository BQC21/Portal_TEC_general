"use client";

import { useState } from "react";
import { PlusIcon } from "@/features/view/components/Icons/PlusIcon";
import { Materiales, MaterialesFormData } from "@/lib/types/materiales-types";
import { AddMaterialModal } from "../../Modals/Materiales/AddMaterialModal";

type Button2ModalProps = {
    existingMateriales: Materiales[];
    onAddMateriales: (equipo: MaterialesFormData) => void;
};

export default function Button2Modal({existingMateriales, onAddMateriales }: Button2ModalProps) {
    const [open, setOpen] = useState(false);

    return (
    <div>
        <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
            <PlusIcon />
            <span>Añadir Material</span>
        </button>

        {open && (
            <AddMaterialModal
                existingMateriales={existingMateriales}
                onAddMateriales={async (material) => {
                    await onAddMateriales(material);
                    setOpen(false);
                }}
                onClose={() => setOpen(false)}
            />
        )}
    </div>
    );
}