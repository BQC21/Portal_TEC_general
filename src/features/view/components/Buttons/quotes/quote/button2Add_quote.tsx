"use client";

import { Button2ModalPropsQuote } from "@/lib/types/components/buttons";
import { useState } from "react";
import { PlusIcon } from "../../../Icons/PlusIcon";

export default function Button2Add_quote({onAddQuote}: Button2ModalPropsQuote){
    const [open, setOpen] = useState(false);

    return(
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                <PlusIcon />
                <span>Añadir Cotización</span>
            </button>

            {open && (
                <AddQuoteModal
                />
            )}
        </div>
    )
}