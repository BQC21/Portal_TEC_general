"use client";

import { useState } from "react";
import { EditIcon } from "@/features/view/components/Icons/EditIcon";
import { EditQuoteModalProps } from "@/lib/types/components/buttons";

export default function Button2Edit_quote({ quote,
    onUpdateQuote }: EditQuoteModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                <EditIcon />
                <span>Ver Cotización</span> 
            </button>
            
            {open && (
                <EditQuoteModal
                />
            )}
        </div>
    );
}
