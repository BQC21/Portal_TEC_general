"use client"

import { AddReportModalProps } from "@/lib/types/components/modals";
import { AddProductCloseIcon } from "../../../Icons/AddCloseIcon";
import { useQuotes } from "@/features/view/hooks/services/useRealtimeQuotes";
import { useEffect, useState } from "react";
import { ReportFormState } from "@/lib/types/supabase/report-types";
import { INITIAL_QUOTE_FORM, INITIAL_REPORT_FORM } from "@/lib/utils/initialValues";
import { QuoteFormState } from "@/lib/types/supabase/quote-types";
import { AddProductSelectField } from "../../../Form_fields/AddSelectField";
import { QuoteSelection } from "@/features/view/hooks/modals/Reports/useQuoteSelection";
import { ReportDataInput } from "@/features/view/sub_components/M3/refactor/reports/ReportDataInput";
import { QuoteReportTable } from "@/features/view/sub_components/M3/Tables/reports/QuoteReportTable";
import { Eq_Mat_Content } from "@/features/view/sub_components/M3/refactor/reports/Eq_Mat_Content";
import { MO_Content } from "@/features/view/sub_components/M3/refactor/reports/MO_Content";
import { getQuoteCode } from "@/lib/utils/helpers/manage_info/getQuoteCode";

export default function AddReportModal({onAddReport, onClose,
    existing_project_equipos, existing_project_materiales
}: AddReportModalProps){
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
    const hasSelectedQuote = Boolean(form.cotizacion_id);

    const projectEquipos = hasSelectedQuote
        ? existing_project_equipos.filter((item) => item.proyecto_id === form.cotizacion_info?.proyecto_id)
        : [];

    const projectMateriales = hasSelectedQuote
        ? existing_project_materiales.filter((item) => item.proyecto_id === form.cotizacion_info?.proyecto_id)
        : [];

    // ----------------------------------------
    // ------- EVENTOS ------------------------
    // ----------------------------------------

    // Actualizar Form
    function updatedField<K extends keyof ReportFormState>(field: K, value: ReportFormState[K]){
        setForm((current) => {
            const updated = { ...current, [field]: value,
                precio_cotizacion: String(Number(form_quotes.precio_dolares).toFixed(2),
                ) 
            };
            return updated;
        })
    }
    
    // Aceptar inserción
    async function handleSubmit(event:React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await onAddReport({
            ...form,
        })
    }

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-2">
            <div className="max-h-[96vh] w-[96vw] max-w-[1800px]     overflow-hidden rounded-3xl bg-white shadow-2xl">
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

                
                <form onSubmit={handleSubmit} className="max-h-[calc(96vh-88px)] overflow-y-auto px-6 py-6">
                    <AddProductSelectField
                        label="Seleccionar Cotización"
                        required
                        value={form_quotes.cod_cotizacion}
                        options={["Seleccione cotización", ...quotes.map((quote) => quote.cod_cotizacion)]}
                        onChange={(value) => QuoteSelection(value, quotes, setForm_quote, setForm)}
                    />

                    {hasSelectedQuote && (
                        <>
                            <div className="mt-6 grid gap-6 grid-cols-[1fr_1fr_1fr]">
                                <div className="grid gap-6">
                                    {/* Inputación de datos */}
                                    <ReportDataInput
                                        form={form}
                                        updateField={updatedField}
                                    />

                                    {/* Quote Report Table */}
                                    <QuoteReportTable
                                        precioFinal={Number(form.cotizacion_info?.precio_dolares)}
                                        igv={Number(form.cotizacion_info?.igv)}
                                    />
                                </div>
                                <div className="grid gap-6">
                                    {/* Contenido de Equipos y Materiales */}
                                    <Eq_Mat_Content
                                        title={"EQUIPOS Y MATERIALES"}
                                        precioFinal={Number(form.cotizacion_info?.precio_dolares)}
                                        Eq_Mt={Number(form.porcentaje_eqmt)}
                                        selectedEquipos={projectEquipos}
                                        selectedMateriales={projectMateriales}
                                    />
                                </div>
                                <div className="grid gap-6">
                                    {/* Contenido de Mano de Obra */}
                                    <MO_Content
                                        title={"PUESTA EN MARCHA"}
                                        precioFinal={Number(form.cotizacion_info?.precio_dolares)}
                                        MO={Number(form.porcentaje_inst)}
                                    />
                                </div>
                            </div>
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
                            Añadir Reporte
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}