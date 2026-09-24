"use client"

import { AddReportModalProps } from "@/lib/types/components/General/modals";
import { AddProductCloseIcon } from "../../../Icons/AddCloseIcon";
import { useQuotes } from "@/features/ViewModel/hooks/services/useRealtimeQuotes";
import { useReports } from "@/features/ViewModel/hooks/services/useRealtimeReports";
import { useEffect, useMemo, useState } from "react";
import { ReportFormState } from "@/lib/types/supabase/report-types";
import { INITIAL_QUOTE_FORM, INITIAL_REPORT_FORM } from "@/lib/utils/initialValues";
import { QuoteFormState } from "@/lib/types/supabase/quote-types";
import { QuoteSelection } from "@/features/ViewModel/hooks/modals/Reports/useQuoteSelection";
import { ReportDataInput } from "@/features/view/refactor/M3/refactor/reports/ReportDataInput";
import { QuoteReportTable } from "@/features/view/refactor/M3/Tables/reports/QuoteReportTable";
import { Eq_Mat_Content } from "@/features/view/refactor/M3/refactor/reports/Eq_Mat_Content";
import { createInitialMOActivities, createInitialPdfVisibility } from "@/lib/utils/helpers/computes/report_computes";
import { normalizePdfVisibility } from "@/lib/utils/normalization";
import { MO_Content } from "@/features/view/refactor/M3/refactor/reports/MO_Content";
import Button2PDF from "../../../Buttons/shared/button2PDF";
import { buildReportPdfPayload } from "@/lib/utils/helpers/quotes/pdfPayload";
import { AddProductSearchableSelectField } from "../../../Form_fields/AddSearchableSelectField";
import { percentMO } from "@/lib/utils/helpers/computes/report_computes";
import { isQuoteLinkedToProject, quoteHeadingLabel, quoteOptionLabel } from "@/lib/utils/helpers/quotes/linkQuote2Project";
import { resolveQuoteDisplayResources } from "@/lib/utils/helpers/project_modals/quoteResourceSnapshot";
import { isUnitedQuote } from "@/lib/utils/helpers/quotes/unitedQuotes";

export default function AddReportModal({onAddReport, onClose,
    existing_project_equipos, existing_project_materiales
}: AddReportModalProps){
    // ----------------------------
    // ------- Estados ------------
    // ----------------------------

    // usar información de otras tabla
    const { quotes } = useQuotes();
    const { reports } = useReports();
    const reportedQuoteIds = useMemo(
        () => new Set(reports.map((report) => String(report.cotizacion_id))),
        [reports],
    );
    const availableQuotes = useMemo(
        () => quotes.filter((quote) => !reportedQuoteIds.has(String(quote.id))),
        [quotes, reportedQuoteIds],
    );

    // valores iniciales
    const [form, setForm] = useState<ReportFormState>(INITIAL_REPORT_FORM);
    const [form_quotes, setForm_quote] = useState<QuoteFormState>(INITIAL_QUOTE_FORM);

    const [hiddenEquipoIds, setHiddenEquipoIds] = useState<string[]>([]);
    const [hiddenMaterialIds, setHiddenMaterialIds] = useState<string[]>([]);
    
    const [showEquipmentsInPdf, setShowEquipmentsInPdf] = useState(false);
    const [showElectricalMaterialsInPdf, setShowElectricalMaterialsInPdf] = useState(false);
    const [showCanalizationMaterialsInPdf, setShowCanalizationMaterialsInPdf] = useState(false);
    const [showMOInPdf, setShowMOInPdf] = useState(false);
    
    const [moActivities, setMoActivities] = useState(createInitialMOActivities);

    // Porcentaje de mano de obra calculado automáticamente
    const MO_percent = percentMO(Number(form.porcentaje_eqmt))

    // ----------------------------------------
    // ------- INFORMACIÓN SELECTA ------------
    // ----------------------------------------
    // proyecto seleccionado
    const hasSelectedQuote = Boolean(form.cotizacion_id);
    const selectedQuote = form.cotizacion_info ?? form_quotes;
    const isUnited = hasSelectedQuote && isUnitedQuote(selectedQuote);
    const isIndependent = hasSelectedQuote && !isQuoteLinkedToProject(selectedQuote) && !isUnited;
    const showReportBody = hasSelectedQuote || isIndependent || isUnited;

    const precioUsd =
        Number(form.cotizacion_info?.precio_dolares || form.precio_cotizacion || form_quotes.precio_dolares) || 0;
    const igvRate = Number(form.cotizacion_info?.igv || form_quotes.igv) || 0;

    const { equipos: projectEquipos, materiales: projectMateriales } = resolveQuoteDisplayResources({
        hasSelectedQuote,
        isIndependent: isIndependent || isUnited,
        quote: selectedQuote,
        existingEquipos: existing_project_equipos,
        existingMateriales: existing_project_materiales,
    });

    // -----------------------------------
    // Sincronizar setters de visibilidad
    // -----------------------------------

    useEffect(() => {
        const next = createInitialPdfVisibility(); // Persiste la visibilidad
        setHiddenEquipoIds(next.hiddenEquipoIds);
        setHiddenMaterialIds(next.hiddenMaterialIds);
        setShowEquipmentsInPdf(next.showEquipmentsInPdf);
        setShowElectricalMaterialsInPdf(next.showElectricalMaterialsInPdf);
        setShowCanalizationMaterialsInPdf(next.showCanalizationMaterialsInPdf);
        setShowMOInPdf(next.showMOInPdf);
        setMoActivities(next.moActivities);
    }, [form.cotizacion_id]);

    // --------------------
    // ---- Togglers ------
    // --------------------

    function toggleId(current: string[], id: string) {
        return current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    }

    function toggleEquipoVisibility(id: string) {
        setHiddenEquipoIds((current) => toggleId(current, id));
    }

    function toggleMaterialVisibility(id: string) {
        setHiddenMaterialIds((current) => toggleId(current, id));
    }

    function toggleMOVisibility(id: string) {
        setMoActivities((current) =>
            current.map((item) =>
                item.id === id ? { ...item, visible: !item.visible } : item,
            ),
        );
    }

    // -------------------
    // --- CRUD MO -------
    // -------------------

    function addMOActivity() {
        setMoActivities((current) => [
            ...current,
            {
                id: crypto.randomUUID(),
                descripcion: "Nueva actividad",
                visible: true,
            },
        ]);
    }

    function updateMOActivity(id: string, descripcion: string) {
        setMoActivities((current) =>
            current.map((item) => (item.id === id ? { ...item, descripcion } : item)),
        );
    }

    function removeMOActivity(id: string) {
        setMoActivities((current) => current.filter((item) => item.id !== id));
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
    function updatedField<K extends keyof ReportFormState>(field: K, value: ReportFormState[K]){
        setForm((current) => {
            const updated = { ...current, [field]: value,
                    precio_cotizacion: String(Number(form_quotes.precio_dolares).toFixed(2)),
            };
            if (field === "porcentaje_eqmt") {
                updated.porcentaje_inst = String(percentMO(Number(value)));
            }
            return updated;
        })
    }
    
    // Aceptar inserción
    async function handleSubmit(event:React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await onAddReport({
            ...form,
            precio_cotizacion: form.precio_cotizacion || String(precioUsd.toFixed(2)),
            porcentaje_inst: String(MO_percent),
            // Considera la visibilidad a persistirse
            visibilidad_pdf: normalizePdfVisibility({
                hiddenEquipoIds,
                hiddenMaterialIds,
                showEquipmentsInPdf,
                showElectricalMaterialsInPdf,
                showCanalizationMaterialsInPdf,
                showMOInPdf,
                moActivities,
            }),
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
                    
                    <AddProductSearchableSelectField
                        label="Seleccionar Cotización"
                        required
                        value={form_quotes.cod_cotizacion ? quoteOptionLabel(form_quotes) : ""}
                        options={[
                            "Seleccione cotización",
                            ...availableQuotes.map((quote) => quoteOptionLabel(quote)),
                        ]}
                        searchPlaceholder="Buscar cotización..."
                        emptyMessage="No hay cotizaciones sin reporte con ese nombre"
                        onChange={(value) => QuoteSelection(value, availableQuotes, setForm_quote, setForm)}
                    />

                    {showReportBody && (
                        <>
                            <div className="mt-6 grid gap-6 grid-cols-[0.5fr_1fr]">

                                <div className="grid gap-6">
                                    <h1 className="text-2xl font-bold text-slate-500">
                                        {quoteHeadingLabel(form_quotes)}
                                    </h1>

                                    {/* Inputación de datos */}
                                    <ReportDataInput
                                        form={form}
                                        updateField={updatedField}
                                        MO_percent={MO_percent}
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
                                        hiddenMaterialIds={hiddenMaterialIds}
                                        onToggleMaterialVisibility={toggleMaterialVisibility}
                                        showEquipmentsInPdf={showEquipmentsInPdf}
                                        onToggleEquipmentsTable={setShowEquipmentsInPdf}
                                        showElectricalMaterialsInPdf={showElectricalMaterialsInPdf}
                                        onToggleElectricalMaterialsTable={setShowElectricalMaterialsInPdf}
                                        showCanalizationMaterialsInPdf={showCanalizationMaterialsInPdf}
                                        onToggleCanalizationMaterialsTable={setShowCanalizationMaterialsInPdf}
                                    />
                                    {/* Contenido de Mano de Obra */}
                                    <MO_Content
                                        title={"PUESTA EN MARCHA"}
                                        precioFinal={precioUsd}
                                        MO={MO_percent}
                                        activities={moActivities}
                                        showMOInPdf={showMOInPdf}
                                        onToggleMOTable={setShowMOInPdf}
                                        onToggleActivityVisibility={toggleMOVisibility}
                                        onAddActivity={addMOActivity}
                                        onUpdateActivity={updateMOActivity}
                                        onRemoveActivity={removeMOActivity}
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
                            disabled={!form.cotizacion_id}
                            getPayload={() =>
                                buildReportPdfPayload({
                                    form,
                                    equipos: projectEquipos,
                                    materiales: projectMateriales,
                                    hiddenEquipoIds,
                                    hiddenMaterialIds,
                                    showEquipmentsInPdf,
                                    showElectricalMaterialsInPdf,
                                    showCanalizationMaterialsInPdf,
                                    showMOInPdf,
                                    moActivities,
                                })
                            }
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