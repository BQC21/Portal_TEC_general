"use client";

import { TrashIcon } from "@/features/view/components/Icons/TrashIcon";
import { useState } from "react";
import { DeleteQuoteModalProps } from "@/lib/types/components/buttons";
import { DeleteQuoteModal } from "../../../Modals/quotes/quote/DeleteQuoteModal";

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
                quote={quote}
                onDeleteQuote={(quoteId: string) => {
                    onDeleteQuote(quoteId);
                    setOpen(false);
                }}
                onClose={() => setOpen(false)}
            />
        )}
        </>
    );
}
