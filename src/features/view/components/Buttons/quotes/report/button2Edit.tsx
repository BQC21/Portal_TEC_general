"use client";

import { useState } from "react";
import { EditIcon } from "@/features/view/components/Icons/EditIcon";
import { EditReportModalProps } from "@/lib/types/components/buttons";

export default function Button2Edit_report({ report,
    onUpdateReport }: EditReportModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                <EditIcon />
                <span>Ver Reporte</span> 
            </button>
            
            {open && (
                <EditReportModal
                />
            )}
        </div>
    );
}
