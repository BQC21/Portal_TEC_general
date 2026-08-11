"use client";

import { TrashIcon } from "@/features/view/components/Icons/TrashIcon";
import { DeleteFinantialModalProps } from "@/lib/types/components/General/buttons";
import { useState } from "react";
import { DeleteFinantialModal } from "../../../Modals/quotes/finantial/TrashFinantialModal";

export function Button2Trash_finantial({ finantial, onDeleteFinantial }: DeleteFinantialModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="table-icon-button text-brand-500"
            title="Eliminar finanzas"
        >
            <TrashIcon />
        </button>

        {open && (
            <DeleteFinantialModal
                finantial={finantial}
                onDeleteFinantial={(finantialId: string) => {
                    onDeleteFinantial(finantialId);
                    setOpen(false);
                }}
                onClose={() => setOpen(false)}
            />
        )}
        </>
    );
}
