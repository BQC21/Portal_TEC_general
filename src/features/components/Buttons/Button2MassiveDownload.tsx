"use client";

import { MassiveDownloadModal } from "@/features/components/Modals/MassiveDownloadModal";
import { MassiveDownloadIcon } from "@/features/components/Icons/MassiveDownloadIcon";
import type { Product } from "@/lib/types/product-types";
import { useState } from "react";

type MassiveDownloadModalProps = {
    productsToDownload?: Product[];
    exchangeRate: number;
    defaultFileName?: string;
};

export default function Button2MassiveDownload({ productsToDownload, exchangeRate, defaultFileName }: MassiveDownloadModalProps) {
    const [open, setOpen] = useState(false);
    
    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-indigo-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
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