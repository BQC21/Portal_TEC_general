"use client";

import { MassiveDownloadModal } from "@/features/view/components/Modals/Products/MassiveDownloadModal";
import { MassiveDownloadIcon } from "@/features/view/components/Icons/MassiveDownloadIcon";
import { useState } from "react";
import { MassiveDownloadModalProps } from "@/lib/types/components/buttons";

export default function Button2MassiveDownload({ productsToDownload, exchangeRate, defaultFileName }: 
    MassiveDownloadModalProps) {
    const [open, setOpen] = useState(false);
    
    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-brand-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            title="Descarga masiva"
        >
            <MassiveDownloadIcon />
            <span>Descarga masiva</span>
        </button>

        {open && (
            <MassiveDownloadModal
                productsToDownload={productsToDownload}
                exchangeRate={exchangeRate}
                defaultFileName={defaultFileName}
                onClose={() => setOpen(false)}
            />
        )}
        </>
    );
}