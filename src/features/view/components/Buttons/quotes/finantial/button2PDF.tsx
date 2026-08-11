"use client";
import { useState } from "react";
import { useGenerateReportPdf } from "@/features/view/hooks/api/useGenerateReportPdf";
import { Button2PDFProps_FINANTIAL } from "@/lib/types/components/General/buttons";

export default function Button2PDF_FINANTIAL({ form }: Button2PDFProps_FINANTIAL) {
    const [requested, setRequested] = useState(false);
    const { loading, error, generate } = useGenerateReportPdf();

    async function handleGenerate() {
            setRequested(true);
            await generate({

                // reporte de finantial
                ...form
            });
    }
    
    return (
        <div>
            <button
                type="button"
                onClick={() => void handleGenerate()}
                disabled={loading || !form.cotizacion_id}
                className="rounded-xl bg-red-500 text-white border border-slate-300 px-6 py-3 text-lg font-semibold text-slate-700 transition hover:bg-red-300 disabled:opacity-50"
            >
                {loading ? "Generando PDF..." : "Generar PDF"}
            </button>

            {requested && error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}