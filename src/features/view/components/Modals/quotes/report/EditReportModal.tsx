"use client"

import { useQuotes } from "@/features/view/hooks/services/useRealtimeQuotes";
import { AddProductCloseIcon } from "../../../Icons/AddCloseIcon";
import { EditReportModalProps } from "@/lib/types/components/modals";
import { useState } from "react";
import { ReportFormState } from "@/lib/types/supabase/report-types";
import { createReportFormStateFromReport } from "@/lib/mapping/mapping_reports";
import { INITIAL_QUOTE_FORM } from "@/lib/utils/initialValues";
import { AddProductSelectField } from "../../../Form_fields/AddSelectField";
import { QuoteFormState } from "@/lib/types/supabase/quote-types";

export default function EditReportModal({existingReport, onUpdateReport, onClose,
    existing_project_equipos, existing_project_materiales
}: EditReportModalProps){
    // ----------------------------
    // ------- Estados ------------
    // ----------------------------

    // usar información de la tabla
    const { quotes } = useQuotes();

    // valores iniciales
    const [form, setForm] = useState<ReportFormState>(() => createReportFormStateFromReport(existingReport))
    const [form_quotes, setForm_quote] = useState<QuoteFormState>(() => 
        existingReport.cotizacion_info ? {
            ...INITIAL_QUOTE_FORM,
            ...existingReport.cotizacion_info,
        } : INITIAL_QUOTE_FORM
    );


    // ----------------------------------------
    // ------- INFORMACIÓN SELECTA ------------
    // ----------------------------------------
    // proyecto seleccionado
    const hasSelectedQuote = Boolean(form.cotizacion_id);

    const projectEquipos = hasSelectedQuote
    ? existing_project_equipos.filter((item) => item.proyecto_id === form.proyecto_id)
    : [];

    const projectMateriales = hasSelectedQuote
        ? existing_project_materiales.filter((item) => item.proyecto_id === form.proyecto_id)
        : [];

    // ----------------------------------------
    // ------- EVENTOS ------------------------
    // ----------------------------------------

    // Actualizar Form
    function updateField<K extends keyof ReportFormState>(field: K, value: ReportFormState[K]) {
        setForm((current) => {
            const updated = { ...current, [field]: value };
            return updated;
        });
    }
    
    // Aceptar inserción
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await onUpdateReport({
            ...form,
        });
    }
    
    // Aceptar inserción


    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Actualizar Reporte</h2>
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
                    <AddProductSelectField
                        label="Seleccionar Cotización"
                        required
                        value={form_quotes.cod_cotizacion}
                        options={["Seleccione cotización", ...quotes.map((quote) => quote.cod_cotizacion)]}
                        onChange={(value) => QuoteSelection(value, quotes, setForm_quote, setForm)}
                    />

                    {hasSelectedQuote && (
                        <>
                        {/* Inputación de datos */}

                        {/* Quote Report Table */}

                        {/* Contenido de Equipos y Materiales */}

                        {/* Contenido de Mano de Obra */}

                        </>
                    )}


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
                            Actualizar Reporte
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}