"use client";

import { TrashIcon } from "@/features/view/components/Icons/TrashIcon";
import { Equipos } from "@/lib/types/supabase/equipos-types";
import { useState } from "react";
import { DeleteEquipoModal } from "../../Modals/Equipos/DeleteEquipoModal";

type DeleteEquipoModalProps = {
    equipo: Equipos;
    onDeleteEquipo: (equipoId: string) => void;
};

export function Button2Trash({ equipo, onDeleteEquipo }: DeleteEquipoModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="table-icon-button text-indigo-600"
            title="Eliminar producto"
        >
            <TrashIcon />
        </button>

        {open && (
            <DeleteEquipoModal
                equipo={equipo}
                onDeleteEquipo={(equipoId) => {
                    onDeleteEquipo(equipoId);
                    setOpen(false);
                }}
                onClose={() => setOpen(false)}
            />
        )}
        </>
    );
}