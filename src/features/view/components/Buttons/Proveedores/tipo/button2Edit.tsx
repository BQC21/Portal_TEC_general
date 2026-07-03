"use client";

import { EditTypeModalProps } from "@/lib/types/components/buttons";
import { Type, TypeFormData } from "@/lib/types/supabase/type-types";
import { useState } from "react";
import { EditIcon } from "../../../Icons/EditIcon";
import EditTypeModal from "../../../Modals/Proveedores/tipo/EditTypeModal";

export default function Button2Edit_Type({ type, onUpdateType }: EditTypeModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                <EditIcon />
                <span>Actualizar Tipo de producto</span> 
            </button>
            
            {open && (
                <EditTypeModal
                    existingType={type}
                    onUpdateType={async function (formData: TypeFormData) {
                        const updatedType: Type = { ...type, ...formData };
                        await onUpdateType(updatedType);
                        setOpen(false);
                    }}
                    onClose={() => setOpen(false)}
                />
            )}
        </div>
    );
}