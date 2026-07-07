"use client";

import { useState } from "react";
import { PlusIcon } from "../../../Icons/PlusIcon";
import { Button2ModalPropsReport } from "@/lib/types/components/buttons";
import AddReportModal from "../../../Modals/quotes/report/AddReportModal";

export default function Button2Add_report({onAddReport}: Button2ModalPropsReport){
    const [open, setOpen] = useState(false);

    return(
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                <PlusIcon />
                <span>Añadir Reporte</span>
            </button>

            {open && (
                <AddReportModal
                    onAddReport={async (report) => {
                        await onAddReport(report);
                        setOpen(false);
                    }}
                    onClose={() => setOpen(false)}
                />
            )}
        </div>
    )
}