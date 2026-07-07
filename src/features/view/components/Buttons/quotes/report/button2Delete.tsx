"use client";

import { TrashIcon } from "@/features/view/components/Icons/TrashIcon";
import { DeleteReportModalProps } from "@/lib/types/components/buttons";
import { useState } from "react";
import { DeleteReportModal } from "../../../Modals/quotes/report/DeleteReportModal";

export function Button2Trash_report({ report, onDeleteReport }: DeleteReportModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="table-icon-button text-brand-500"
            title="Eliminar reporte"
        >
            <TrashIcon />
        </button>

        {open && (
            <DeleteReportModal
                report={report}
                onDeleteReport={(reportId: string) => {
                    onDeleteReport(reportId);
                    setOpen(false);
                }}
                onClose={() => setOpen(false)}
            />
        )}
        </>
    );
}
