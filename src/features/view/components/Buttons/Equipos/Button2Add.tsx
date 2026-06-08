"use client";

import { useState } from "react";
import { PlusIcon } from "@/features/view/components/Icons/PlusIcon";
import { Equipos, EquiposFormData } from "@/lib/types/equipos-types";
import { AddEquipoModal } from "../../Modals/Equipos/AddEquipoModal";

type Button2ModalProps = {
    existingEquipos: Equipos[];
    onAddEquipos: (equipo: EquiposFormData) => void;
};

export default function Button2Modal({existingEquipos, onAddEquipos }: Button2ModalProps) {
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