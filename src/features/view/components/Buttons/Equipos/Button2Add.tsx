"use client";

import { useState } from "react";
import { PlusIcon } from "@/features/view/components/Icons/PlusIcon";
import { AddEquipoModal } from "../../Modals/Equipos/AddEquipoModal";
import { Button2ModalPropsEquipos } from "@/lib/types/components/buttons";

export default function Button2Modal({existingEquipos, onAddEquipos }: Button2ModalPropsEquipos) {
    const [open, setOpen] = useState(false);

    return (
    <div>
        <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
            <PlusIcon />
            <span>Añadir Equipo</span>
        </button>

        {open && (
            <AddEquipoModal
                existingEquipos={existingEquipos}
                onAddEquipos={async (equipo) => {
                    await onAddEquipos(equipo);
                    setOpen(false);
                }}
                onClose={() => setOpen(false)}
            />
        )}
    </div>
    );
}