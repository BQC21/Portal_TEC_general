"use client";

import { Button2ModalPropsQuote } from "@/lib/types/components/buttons";
import { useState } from "react";
import { PlusIcon } from "../../../Icons/PlusIcon";
import AddQuoteModal from "../../../Modals/quotes/quote/AddQuoteModal";

export default function Button2Add_quote({onAddQuote, project_equipos, project_materiales}: Button2ModalPropsQuote){
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
                    onAddQuote={async (quote) => {
                        await onAddQuote(quote);
                        setOpen(false);
                    }}
                    onClose={() => setOpen(false)}
                    existing_project_equipos={project_equipos}
                    existing_project_materiales={project_materiales}
                />
            )}
        </div>
    )
}