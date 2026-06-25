"use client";

import { TrashIcon } from "@/features/view/components/Icons/TrashIcon";
import { useState } from "react";
import { DeleteMaterialModal } from "../../Modals/Materiales/DeleteMaterialModal";
import { DeleteMaterialModalProps } from "@/lib/types/components/buttons";

export function Button2Trash({ material, onDeleteMaterial }: DeleteMaterialModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="table-icon-button text-indigo-600"
            title="Eliminar material"
        >
            <TrashIcon />
        </button>

        {open && (
            <DeleteMaterialModal
                material={material}
                onDeleteMaterial={(materialId) => {
                    onDeleteMaterial(materialId);
                    setOpen(false);
                }}
                onClose={() => setOpen(false)}
            />
        )}
        </>
    );
}