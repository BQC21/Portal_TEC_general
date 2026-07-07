"use client";

import { TrashIcon } from "@/features/view/components/Icons/TrashIcon";
import { useState } from "react";
import { DeleteQuoteModalProps } from "@/lib/types/components/buttons";

export function Button2Trash_quote({ quote, onDeleteQuote }: DeleteQuoteModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="table-icon-button text-brand-500"
            title="Eliminar cotización"
        >
            <TrashIcon />
        </button>

        {open && (
            <DeleteQuoteModal
            />
        )}
        </>
    );
}
