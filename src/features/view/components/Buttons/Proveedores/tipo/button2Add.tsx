"use client";

import { Button2ModalPropsType } from "@/lib/types/components/buttons";
import { useState } from "react";
import { PlusIcon } from "../../../Icons/PlusIcon";
import { TypeFormData } from "@/lib/types/supabase/type-types";
import AddTypeModal from "../../../Modals/Proveedores/tipo/AddTypeModal";

export default function Button2Modal_type({ onAddType }: Button2ModalPropsType) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                <PlusIcon />
                <span>Añadir Tipo de producto</span> 
            </button>
            
            {open && (
                <AddTypeModal
                    onAddType={async (type: TypeFormData) => {
                        await onAddType(type);
                        setOpen(false);
                    }}
                    onClose={() => setOpen(false)}
                />
            )}
        </div>
    );
}