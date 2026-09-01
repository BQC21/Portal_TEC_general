"use client"

import { AddProductCloseIcon } from "../../../Icons/AddCloseIcon";
import { useEffect, useState } from "react";
import { INITIAL_QUOTE_FORM } from "@/lib/utils/initialValues";
import { AddProductSelectField } from "../../../Form_fields/AddSelectField";
import { QuoteSelection } from "@/features/view/hooks/modals/Reports/useQuoteSelection";
import { EditFinantialModalProps } from "@/lib/types/components/General/modals";
import { FinantialFormState } from "@/lib/types/supabase/finantial-types";
import { QuoteFormState } from "@/lib/types/supabase/quote-types";
import { createFinantialFormStateFromFinantial } from "@/lib/mapping/mapping_finantial";
import Button2PDF_FINANTIAL from "../../../Buttons/quotes/finantial/button2PDF";
import { useQuotes } from "@/features/view/hooks/services/useRealtimeQuotes";
import { FinantialData } from "@/features/view/sub_components/M3/refactor/finantial/finantial_data";
import { FinantialDetails } from "@/features/view/sub_components/M3/refactor/finantial/finantial_details";
import { EnergyTable } from "@/features/view/sub_components/M3/refactor/finantial/energy_table";
import { FlowTable } from "@/features/view/sub_components/M3/refactor/finantial/flow_table";
import { useFinantialComputes } from "@/features/view/hooks/modals/Finantial/useFinantialComputes";

export default function EditFinantialModal({
    existingFinantial,
    onUpdateFinantial,
    onClose,
    existing_project_equipos,
}: EditFinantialModalProps){
    const { quotes } = useQuotes();

    const [form, setForm] = useState<FinantialFormState>(() => createFinantialFormStateFromFinantial(existingFinantial))
    const [form_quotes, setForm_quote] = useState<QuoteFormState>(() => 
        existingFinantial.cotizacion_info ? {
            ...INITIAL_QUOTE_FORM,
            ...existingFinantial.cotizacion_info,
        } : INITIAL_QUOTE_FORM
    );

    const hasSelectedQuote = Boolean(form.cotizacion_id);

    const projectEquipos = hasSelectedQuote
        ? existing_project_equipos.filter(
            (item) => item.proyecto_id === form.cotizacion_info?.proyecto_id
        )
        : [];

    const { analysis, maxYear, addYear, removeYear } = useFinantialComputes(
        form,
        projectEquipos
    );

    useEffect(() => {
        setForm((current) => ({
            ...current,
            lcoe: analysis.lcoe === null ? "" : String(analysis.lcoe.toFixed(4)),
            tiempo_retorno: analysis.tiempo_retorno ?? "",
        }));
    }, [analysis.lcoe, analysis.tiempo_retorno]);

    function updateField<K extends keyof FinantialFormState>(field: K, value: FinantialFormState[K]) {
        setForm((current) => {
            const updated = { ...current, [field]: value};
            return updated;
        });
    }
    
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await onUpdateFinantial({
            ...form,
            lcoe: analysis.lcoe === null ? "" : String(analysis.lcoe.toFixed(4)),
            tiempo_retorno: analysis.tiempo_retorno ?? "",
            updated_at: new Date(),
        });
    }

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-2">
            <div className="flex h-[96vh] max-h-[96vh] w-[96vw] max-w-[1800px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Actualizar análisis financiero</h2>
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
                        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(280px,0.9fr)_minmax(320px,1.1fr)_minmax(420px,1.4fr)]">
                            <div className="grid gap-6 content-start">
                                <FinantialData
                                    form={form}
                                    updateField={updateField}
                                    analysis={analysis}
                                />
                                <FinantialDetails analysis={analysis} />
                            </div>
                            <div className="grid gap-6 content-start">
                                <EnergyTable
                                    energyRows={analysis.energyRows}
                                    maxYear={maxYear}
                                    onAddYear={addYear}
                                    onRemoveYear={removeYear}
                                />
                            </div>
                            <div className="grid gap-6 content-start">
                                <FlowTable flowRows={analysis.flowRows} />
                            </div>
                        </div>
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
                        <Button2PDF_FINANTIAL form={form} analysis={analysis} />
                        <button
                            type="submit"
                            className="rounded-xl bg-brand-500 px-6 py-3 text-lg font-semibold text-white transition hover:bg-brand-600"
                        >
                            Actualizar análisis financiero
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
