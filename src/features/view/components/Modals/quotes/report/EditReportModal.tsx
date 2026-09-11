"use client"

import { useQuotes } from "@/features/view/hooks/services/useRealtimeQuotes";
import { AddProductCloseIcon } from "../../../Icons/AddCloseIcon";
import { EditReportModalProps } from "@/lib/types/components/General/modals";
import { useEffect, useState } from "react";
import { ReportFormState } from "@/lib/types/supabase/report-types";
import { createReportFormStateFromReport } from "@/lib/mapping/mapping_reports";
import { INITIAL_QUOTE_FORM } from "@/lib/utils/initialValues";
import { AddProductSelectField } from "../../../Form_fields/AddSelectField";
import { QuoteFormState } from "@/lib/types/supabase/quote-types";
import { QuoteSelection } from "@/features/view/hooks/modals/Reports/useQuoteSelection";
import { ReportDataInput } from "@/features/view/sub_components/M3/refactor/reports/ReportDataInput";
import { QuoteReportTable } from "@/features/view/sub_components/M3/Tables/reports/QuoteReportTable";
import { Eq_Mat_Content } from "@/features/view/sub_components/M3/refactor/reports/Eq_Mat_Content";
import { MO_Content } from "@/features/view/sub_components/M3/refactor/reports/MO_Content";
import Button2PDF from "../../../Buttons/quotes/report/button2PDF";
import { AddProductSearchableSelectField } from "../../../Form_fields/AddSearchableSelectField";
import { percentMO } from "@/lib/utils/helpers/computes/report_computes";
import { isQuoteLinkedToProject, quoteAssociatedLabel } from "@/lib/utils/helpers/quotes/linkQuote2Project";
import { AddProductTextField } from "../../../Form_fields/AddTextField";

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

    const MO_percent = percentMO(Number(form.porcentaje_eqmt))

    // Equipos a no mostrarse en el PDF
    const [hiddenEquipoIds, setHiddenEquipoIds] = useState<string[]>([]);

    // Puesta en marcha a ocultarse en el PDF
    const [hiddenMOIds, setHiddenMOIds] = useState<string[]>([]);

    // ----------------------------------------
    // ------- INFORMACIÓN SELECTA ------------
    // ----------------------------------------
    // proyecto seleccionado
    const hasSelectedQuote = Boolean(form.cotizacion_id);
    
    const isIndependent = !isQuoteLinkedToProject(form.cotizacion_info ?? form_quotes);
    const showReportBody = hasSelectedQuote || isIndependent;

    const precioUsd =
        Number(form.cotizacion_info?.precio_dolares || form.precio_cotizacion || form_quotes.precio_dolares) || 0;
    const igvRate = Number(form.cotizacion_info?.igv || form_quotes.igv) || 0;

    const projectEquipos = hasSelectedQuote
        ? existing_project_equipos.filter((item) => item.proyecto_id === form.cotizacion_info?.proyecto_id)
        : [];

    const projectMateriales = hasSelectedQuote
        ? existing_project_materiales.filter((item) => item.proyecto_id === form.cotizacion_info?.proyecto_id)
        : [];

    // Sincronizar el ocultamiento de equipos a no mostrarse en PDF
    useEffect(() => {
        setHiddenEquipoIds([]);
    }, [form.cotizacion_id]);

    function toggleEquipoVisibility(id: string) {
        setHiddenEquipoIds((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
        );
    }

    // Sincronizar el ocultamiento de equipos a no mostrarse en PDF
    useEffect(() => {
        setHiddenMOIds([]);
    }, [form.cotizacion_id]);

    function toggleMOVisibility(id: string) {
        setHiddenMOIds((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
        );
    }

    // ----------------------------------------
    // ------- EVENTOS ------------------------
    // ----------------------------------------

    useEffect(() => {
        const nextInst = Number.isFinite(MO_percent) ? String(MO_percent) : "";
        if (form.porcentaje_inst !== nextInst) {
            setForm((current) => ({ ...current, porcentaje_inst: nextInst }));
        }
    }, [MO_percent, form.porcentaje_inst]);

    // Actualizar Form
    function updateField<K extends keyof ReportFormState>(field: K, value: ReportFormState[K]) {
        setForm((current) => {
            const updated = { ...current, [field]: value,
                precio_cotizacion: String(Number(form_quotes.precio_dolares).toFixed(2)),
            };
            if (field === "porcentaje_eqmt") {
                updated.porcentaje_inst = String(percentMO(Number(value)));
            }
            return updated;
        });
    }
    
    // Aceptar inserción
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await onUpdateReport({
            ...form,
            cotizacion_info: form.cotizacion_info
                ? {
                    ...form.cotizacion_info,
                    nombre_cotizacion: form_quotes.nombre_cotizacion,
                }
                : form.cotizacion_info,
            precio_cotizacion: form.precio_cotizacion || String(precioUsd.toFixed(2)),
            porcentaje_inst: String(MO_percent),
            updated_at: new Date(),
        });
    }

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-2">
            <div className="flex h-[96vh] max-h-[96vh] w-[96vw] max-w-[1800px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5">
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

                <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                    <div className="modal-scroll min-h-0 flex-1 px-6 py-6">

                    {isIndependent && (
                        <div className="mb-6 space-y-4">
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-slate-700">
                                <p className="text-lg font-medium">
                                    Esta cotización no está asociada a un proyecto de dimensionamiento.
                                </p>
                                <p className="mt-1 text-base">
                                    Se sugiere asignarle un nombre para identificarla en el listado.
                                </p>
                            </div>
                            <AddProductTextField
                                label="Nombre de la cotización independiente"
                                value={form.cotizacion_info?.nombre_cotizacion ?? form_quotes.nombre_cotizacion ?? ""}
                                onChange={(value) => {
                                    setForm_quote((current) => ({ ...current, nombre_cotizacion: value }))
                                    setForm((current) =>
                                        current.cotizacion_info
                                            ? {
                                                ...current,
                                                cotizacion_info: {
                                                    ...current.cotizacion_info,
                                                    nombre_cotizacion: value,
                                                },
                                            }
                                            : current,
                                    )
                                }}
                                placeholder="Ej. Consulta libre"
                            />
                        </div>
                    )}

                    {showReportBody && (
                        <>
                            <div className="mt-6 grid gap-6 grid-cols-[0.5fr_1fr]">

                                <div className="grid gap-6">
                                <h1 className="text-2xl font-bold text-slate-500">
                                    {isIndependent
                                        ? form_quotes.nombre_cotizacion?.trim()
                                            ? `Cotización independiente --- ${quoteAssociatedLabel(form.cotizacion_info ?? form_quotes)}`
                                            : "Cotización independiente"
                                        : `Proyecto --- ${quoteAssociatedLabel(form.cotizacion_info ?? form_quotes)}`}
                                </h1>


                                    {/* Inputación de datos */}
                                    <ReportDataInput
                                        form={form}
                                        updateField={updateField}
                                        MO_percent={MO_percent}
                                    />

                                </div>
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
                                        MO={MO_percent}
                                        hiddenMOIds={hiddenMOIds}
                                        onToggleMOVisibility={toggleMOVisibility}
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
                        {/* Añadir botón para generar PDF*/}
                        <Button2PDF
                            form={form}
                            equipos={projectEquipos}
                            materiales={projectMateriales}
                            hiddenEquipoIds={hiddenEquipoIds}
                            hiddenMOIds={hiddenMOIds}
                        />
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