"use client";

import { useState } from "react";
import { PlusIcon } from "@/features/view/components/Icons/PlusIcon";
import { AddMaterialModal } from "../../Modals/Materiales/AddMaterialModal";
import { Button2ModalPropsMateriales } from "@/lib/types/components/buttons";


export default function Button2Modal({existingMateriales, onAddMateriales }: Button2ModalPropsMateriales) {
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