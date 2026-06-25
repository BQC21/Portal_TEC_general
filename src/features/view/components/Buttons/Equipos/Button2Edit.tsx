"use client";

import { EditIcon } from "@/features/view/components/Icons/EditIcon";
import { Equipos } from "@/lib/types/supabase/equipos-types";
import { useState } from "react";
import { EditEquipoModal } from "../../Modals/Equipos/EditEquipoModal";

type EditEquiposModalProps = {
    equipo: Equipos;
    onUpdateEquipo: (equipo: Equipos) => void;
};

export function Button2Edit({ equipo, onUpdateEquipo }: EditEquiposModalProps) {
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