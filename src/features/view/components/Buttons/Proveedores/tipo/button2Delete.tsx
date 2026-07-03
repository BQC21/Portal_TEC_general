"use client";

import { useState } from "react";
import { TrashIcon } from "../../../Icons/TrashIcon";
import { DeleteTypeModalProps } from "@/lib/types/components/buttons";
import { DeleteTypeModal } from "../../../Modals/Proveedores/tipo/DeleteTypeModal";

export function Button2Trash_Type({ type, onDeleteType }: DeleteTypeModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="table-icon-button text-brand-500"
            title="Eliminar tipo de producto"
        >
            <TrashIcon />
        </button>

        {open && (
            <DeleteTypeModal
            type={type}
            onDeleteType={(typeId: string) => {
                    onDeleteType(typeId);
                    setOpen(false);
                }}
                onClose={() => setOpen(false)}
            />
        )}
        </>
    );
}