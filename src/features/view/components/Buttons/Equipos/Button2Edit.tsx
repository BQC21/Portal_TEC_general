"use client";

import { EditIcon } from "@/features/view/components/Icons/EditIcon";
import { useState } from "react";
import { EditEquipoModal } from "../../Modals/Equipos/EditEquipoModal";
import { EditEquiposModalProps } from "@/lib/types/components/buttons";

export function Button2Edit({ equipo, onUpdateEquipo }: EditEquiposModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="table-icon-button text-brand-500"
            title="Editar equipo"
        >
            <EditIcon />
        </button>

        {open && (
            <EditEquipoModal
                equipo={equipo}
                onUpdateEquipo={(equipo) => {
                    onUpdateEquipo(equipo);
                    setOpen(false);
                }}
                onClose={() => setOpen(false)}
            />
        )}
        </>
    );
}