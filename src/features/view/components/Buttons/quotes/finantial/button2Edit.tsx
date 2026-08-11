"use client";

import { useState } from "react";
import { EditIcon } from "@/features/view/components/Icons/EditIcon";
import { EditFinantialModalProps } from "@/lib/types/components/General/buttons";
import { Finantial } from "@/lib/types/supabase/finantial-types";
import EditFinantialModal from "../../../Modals/quotes/finantial/EditFinantialModal";

export default function Button2Edit_finantial({
    finantial,
    onUpdateFinantial,
    project_equipos,
}: EditFinantialModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                <EditIcon />
                <span>Ver Finanzas</span> 
            </button>
            
            {open && (
                <EditFinantialModal
                    existingFinantial={finantial}
                    onUpdateFinantial={async (formData) => {
                        const updatedFinantial: Finantial = { ...finantial, ...formData };
                        await onUpdateFinantial(updatedFinantial);
                        setOpen(false);
                    }}
                    onClose={() => setOpen(false)}
                    existing_project_equipos={project_equipos}
                />
            )}
        </div>
    );
}
