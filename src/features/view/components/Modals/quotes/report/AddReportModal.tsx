"use client"

import { AddReportModalProps } from "@/lib/types/components/modals";
import { AddProductCloseIcon } from "../../../Icons/AddCloseIcon";
import { useQuotes } from "@/features/view/hooks/services/useRealtimeQuotes";
import { useState } from "react";
import { ReportFormState } from "@/lib/types/supabase/report-types";
import { INITIAL_QUOTE_FORM, INITIAL_REPORT_FORM } from "@/lib/utils/initialValues";
import { QuoteFormState } from "@/lib/types/supabase/quote-types";

export default function AddReportModal({onAddReport, onClose}: AddReportModalProps){
    // ----------------------------
    // ------- Estados ------------
    // ----------------------------

    // usar información de otras tabla
    const { quotes } = useQuotes();

    // valores iniciales
    const [form, setForm] = useState<ReportFormState>(INITIAL_REPORT_FORM);
    const [form_quotes, setForm_quote] = useState<QuoteFormState>(INITIAL_QUOTE_FORM);

    // ----------------------------------------
    // ------- INFORMACIÓN SELECTA ------------
    // ----------------------------------------
    // proyecto seleccionado
    const selectedQuote = form_quotes.proyecto_info?.nombre;

    // ----------------------------------------
    // ------- EVENTOS ------------------------
    // ----------------------------------------

    // Actualizar Form
    function updatedField<K extends keyof ReportFormState>(field: K, value: ReportFormState[K]){
        setForm((current) => {
            const updated = { ...current, [field]: value };
            return updated;
        })
    }
    
    // Aceptar inserción
    async function handleSubmit(event:React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await onAddReport({
            ...form
        })
    }



    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Añadir Nuevo Reporte</h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            aria-label="Cerrar modal"
                        >
                            <AddProductCloseIcon />
                        </button>
                </div>

                
                <form onSubmit={handleSubmit} className="max-h-[calc(95vh-88px)] overflow-y-auto px-6 py-6">



                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-300 px-6 py-3 text-lg font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="rounded-xl bg-brand-500 px-6 py-3 text-lg font-semibold text-white transition hover:bg-brand-600"
                        >
                            Añadir Reporte
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}