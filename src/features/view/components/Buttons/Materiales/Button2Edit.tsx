"use client";

import { EditIcon } from "@/features/view/components/Icons/EditIcon";
import { Materiales } from "@/lib/types/supabase/materiales-types";
import { useState } from "react";
import { EditMaterialModal } from "../../Modals/Materiales/EditMaterialModal";

type EditMaterialesModalProps = {
    material: Materiales;
    onUpdateMateriales: (material: Materiales) => void;
};

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