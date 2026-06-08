"use client";

import { TrashIcon } from "@/features/view/components/Icons/TrashIcon";
import { Materiales } from "@/lib/types/materiales-types";
import { useState } from "react";

type DeleteMaterialModalProps = {
    material: Materiales;
    onDeleteMaterial: (materialId: string) => void;
};

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
            <DeleteProductModal
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