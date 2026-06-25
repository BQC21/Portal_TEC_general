"use client";

import { EditIcon } from "@/features/view/components/Icons/EditIcon";
import { useState } from "react";
import { EditMaterialModal } from "../../Modals/Materiales/EditMaterialModal";
import { EditMaterialesModalProps } from "@/lib/types/components/buttons";

export function Button2Edit({ material, onUpdateMateriales }: EditMaterialesModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="table-icon-button text-indigo-600"
            title="Editar equipo"
        >
            <EditIcon />
        </button>

        {open && (
            <EditMaterialModal
                material={material}
                onUpdateMaterial={(material) => {
                    onUpdateMateriales(material);
                    setOpen(false);
                }}
                onClose={() => setOpen(false)}
            />
        )}
        </>
    );
}