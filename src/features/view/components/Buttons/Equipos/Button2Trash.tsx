"use client";

import { TrashIcon } from "@/features/view/components/Icons/TrashIcon";
import { useState } from "react";
import { DeleteEquipoModal } from "../../Modals/Equipos/DeleteEquipoModal";
import { DeleteEquipoModalProps } from "@/lib/types/components/buttons";

export function Button2Trash({ equipo, onDeleteEquipo }: DeleteEquipoModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="table-icon-button text-brand-500"
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