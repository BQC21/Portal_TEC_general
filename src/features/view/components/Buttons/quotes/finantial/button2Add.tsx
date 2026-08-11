"use client";

import { useState } from "react";
import { PlusIcon } from "../../../Icons/PlusIcon";
import { Button2ModalPropsReport_FINANTIAL } from "@/lib/types/components/General/buttons";
import AddFinantialModal from "../../../Modals/quotes/finantial/AddFinantialModal";

export default function Button2Add_finantial({
    onAddFinantial,
    project_equipos,
}: Button2ModalPropsReport_FINANTIAL){
    const [open, setOpen] = useState(false);

    return(
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                <PlusIcon />
                <span>Añadir Finanzas</span>
            </button>

            {open && (
                <AddFinantialModal
                    onAddFinantial={async (finantial) => {
                        await onAddFinantial(finantial);
                        setOpen(false);
                    }}
                    onClose={() => setOpen(false)}
                    existing_project_equipos={project_equipos}
                />
            )}
        </div>
    )
}
