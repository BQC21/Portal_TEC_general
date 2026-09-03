"use client"

import { AddReportModalProps } from "@/lib/types/components/General/modals";
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
import Button2PDF from "../../../Buttons/quotes/report/button2PDF";

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
    const [hiddenEquipoIds, setHiddenEquipoIds] = useState<string[]>([]);

    // ----------------------------------------
    // ------- INFORMACIÓN SELECTA ------------
    // ----------------------------------------
    // proyecto seleccionado
    const hasSelectedQuote = Boolean(form.cotizacion_id);
    const precioUsd =
        Number(form.cotizacion_info?.precio_dolares || form.precio_cotizacion || form_quotes.precio_dolares) || 0;
    const igvRate = Number(form.cotizacion_info?.igv || form_quotes.igv) || 0;

    const projectEquipos = hasSelectedQuote
        ? existing_project_equipos.filter((item) => item.proyecto_id === form.cotizacion_info?.proyecto_id)
        : [];

    const projectMateriales = hasSelectedQuote
        ? existing_project_materiales.filter((item) => item.proyecto_id === form.cotizacion_info?.proyecto_id)
        : [];

    useEffect(() => {
        setHiddenEquipoIds([]);
    }, [form.cotizacion_id]);

    function toggleEquipoVisibility(id: string) {
        setHiddenEquipoIds((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
        );
    }

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
            precio_cotizacion: form.precio_cotizacion || String(precioUsd.toFixed(2)),
        })
    }

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-2">
            <div className="flex h-[96vh] max-h-[96vh] w-[96vw] max-w-[1800px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5">
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

                
                <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                    <div className="modal-scroll min-h-0 flex-1 px-6 py-6">
                    <AddProductSelectField
                        label="Seleccionar Cotización"
                        required
                        value={form_quotes.cod_cotizacion
                            ? `(${form_quotes.cod_cotizacion}) - ${form_quotes.proyecto_info?.nombre ?? ""}` : ""
                        }
                        options={[
                            "Seleccione cotización",
                            ...quotes.map(
                                (quote) =>
                                    `(${quote.cod_cotizacion}) - ${quote.proyecto_info?.nombre ?? ""}`
                            ),
                        ]}
                        onChange={(value) => QuoteSelection(value, quotes, setForm_quote, setForm)}
                    />

                    {hasSelectedQuote && (
                        <>
                            <div className="mt-6 grid gap-6 grid-cols-[0.5fr_1fr]">
                                <div className="grid gap-6">
                                    {/* Inputación de datos */}
                                    <ReportDataInput
                                        form={form}
                                        updateField={updatedField}
                                    />
                                </div>
                                {/* <div className="grid gap-6">
                                    <Eq_Mat_Content
                                        title={"EQUIPOS Y MATERIALES"}
                                        precioFinal={precioUsd}
                                        Eq_Mt={Number(form.porcentaje_eqmt)}
                                        selectedEquipos={projectEquipos}
                                        selectedMateriales={projectMateriales}
                                    />
                                </div> */}
                                <div className="grid gap-6">
                                    <Eq_Mat_Content
                                        title={"EQUIPOS Y MATERIALES"}
                                        precioFinal={precioUsd}
                                        Eq_Mt={Number(form.porcentaje_eqmt)}
                                        selectedEquipos={projectEquipos}
                                        selectedMateriales={projectMateriales}
                                        hiddenEquipoIds={hiddenEquipoIds}
                                        onToggleEquipoVisibility={toggleEquipoVisibility}
                                    />
                                    {/* Contenido de Mano de Obra */}
                                    <MO_Content
                                        title={"PUESTA EN MARCHA"}
                                        precioFinal={precioUsd}
                                        MO={Number(form.porcentaje_inst)}
                                    />
                                    {/* Quote Report Table */}
                                    <QuoteReportTable
                                        precioFinal={precioUsd}
                                        igv={igvRate}
                                        opcion_dscto={form.opcion_dscto}
                                        formato_dscto={form.formato_dscto}
                                        tasa_dscto={form.tasa_dscto}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    </div>
                    <div className="flex shrink-0 items-center justify-between border-t border-slate-200 px-6 py-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-300 px-6 py-3 text-lg font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <Button2PDF
                            form={form}
                            equipos={projectEquipos}
                            materiales={projectMateriales}
                            hiddenEquipoIds={hiddenEquipoIds}
                        />
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