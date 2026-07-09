"use client"

import { EditQuoteModalProps } from "@/lib/types/components/modals";
import { AddProductCloseIcon } from "../../../Icons/AddCloseIcon";
import { useProjects } from "@/features/view/hooks/services/useRealtimeProjects";
import { useState } from "react";
import { QuoteFormState } from "@/lib/types/supabase/quote-types";
import { createQuoteFormStateFromQuote } from "@/lib/mapping/mapping_quotes";
import { INITIAL_PROJECT_FORM } from "@/lib/utils/initialValues";
import { ProjectFormState } from "@/lib/types/supabase/project-types";
import { AddProductSelectField } from "../../../Form_fields/AddSelectField";
import { ProjectSelection } from "@/features/view/hooks/modals/useProjectSelection";
import { AddProductNumberField } from "../../../Form_fields/AddNumberField";
import { AddProductReadonlyField } from "../../../Form_fields/AddReadonlyField";
import { SummaryCostTable1 } from "@/features/view/sub_components/M3/Tables/quotes/SummaryCostTable1";
import { SummaryCostTable2 } from "@/features/view/sub_components/M3/Tables/quotes/SummaryCostTable2";
import { SummaryCostTable } from "@/features/view/sub_components/M3/Tables/quotes/SummaryCostTable";
import { EP_PriceTable } from "@/features/view/sub_components/M3/Tables/quotes/subtables/EP_PriceTable";
import { Structure_PriceTable } from "@/features/view/sub_components/M3/Tables/quotes/subtables/Structure_PriceTable";
import { Consume_PriceTable } from "@/features/view/sub_components/M3/Tables/quotes/subtables/Consume_PriceTable";
import { EPP_PriceTable } from "@/features/view/sub_components/M3/Tables/quotes/subtables/EPP_PriceTable";
import { Tooling_PriceTable } from "@/features/view/sub_components/M3/Tables/quotes/subtables/Tooling_PriceTable";
import { Hotel_PriceTable } from "@/features/view/sub_components/M3/Tables/quotes/subtables/Hotel_PriceTable";
import { Personal_PriceTable } from "@/features/view/sub_components/M3/Tables/quotes/subtables/Personal_PriceTable";
import { SCTR_PriceTable } from "@/features/view/sub_components/M3/Tables/quotes/subtables/SCTR_PriceTable";
import { Courier_PriceTable } from "@/features/view/sub_components/M3/Tables/quotes/subtables/Courier_PriceTable";
import { Eating_PriceTable } from "@/features/view/sub_components/M3/Tables/quotes/subtables/Eating_PriceTable";
import { Traveling_PriceTable } from "@/features/view/sub_components/M3/Tables/quotes/subtables/Traveling_PriceTable";
import { AddProductTextField } from "../../../Form_fields/AddTextField";

export default function EditQuoteModal({existingQuote, onUpdateQuote, onClose, 
    existing_project_equipos, existing_project_materiales}: EditQuoteModalProps){
    // ----------------------------
    // ------- Estados ------------
    // ----------------------------

    // usar información de otras tabla
    const { projects } = useProjects();

    // valores iniciales
    const [form, setForm] = useState<QuoteFormState>(() => createQuoteFormStateFromQuote(existingQuote))
    const [form_project, setForm_project] = useState<ProjectFormState>(() => 
        existingQuote.proyecto_info ? {
            ...INITIAL_PROJECT_FORM,
            ...existingQuote.proyecto_info,
        } : INITIAL_PROJECT_FORM
    );

    // ----------------------------------------
    // ------- INFORMACIÓN SELECTA ------------
    // ----------------------------------------
    // condicionador de proyecto seleccionado
    const hasSelectedProject = Boolean(form.proyecto_id);


    // Equipos y materiales relacionados al proyecto seleccionado
    const projectEquipos = hasSelectedProject
        ? existing_project_equipos.filter((item) => item.proyecto_id === form.proyecto_id)
        : [];
    const equiposDescriptions = projectEquipos
        .map((item) => item.equipo_info?.descripcion)
        .filter((description): description is string => Boolean(description));


    const projectMateriales = hasSelectedProject
        ? existing_project_materiales.filter((item) => item.proyecto_id === form.proyecto_id)
        : [];
    const materialesDescriptions = projectMateriales
        .map((item) => item.material_info?.descripcion)
        .filter((description): description is string => Boolean(description));


    // ----------------------------------------
    // ------- EVENTOS ------------------------
    // ----------------------------------------

    // Actualizar Form
    function updateField<K extends keyof QuoteFormState>(field: K, value: QuoteFormState[K]) {
        setForm((current) => {
            const updated = { ...current, [field]: value };
            return updated;
        });
    }
    
    // Aceptar inserción
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await onUpdateQuote({
            ...form,
        });
    }


    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Actualizar Cotización</h2>
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
                        label="Seleccionar Proyecto"
                        required
                        value={form_project.nombre}
                        options={["Seleccione proyecto", 
                            ...projects.map((project) => project.nombre)]}
                        onChange={(value) => ProjectSelection(value, projects, 
                            setForm_project, setForm)}
                    />

                    {hasSelectedProject && (
                        <>
                        <div className="mt-6 grid gap-6 grid-cols-[2fr_2fr_1fr_1fr]">
                            <div className="rounded-2xl border border-slate-200 p-4">
                                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                                    Equipos seleccionados
                                </h3>
                                <p className="max-h-48 overflow-y-auto whitespace-pre-line text-slate-700">
                                    {equiposDescriptions.length > 0
                                        ? equiposDescriptions.join("\n")
                                        : "No hay equipos registrados para este proyecto."}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 p-4">
                                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                                    Materiales seleccionados
                                </h3>
                                <p className="max-h-48 overflow-y-auto whitespace-pre-line text-slate-700">
                                    {materialesDescriptions.length > 0
                                        ? materialesDescriptions.join("\n")
                                        : "No hay materiales registrados para este proyecto."}
                                </p>
                            </div>
                            <div className="grid gap-6">
                                <h2 className="mt-2 mb-2 text-1xl font-bold text-red-900">Márgenes financieros</h2>
                                <AddProductNumberField
                                    label="Porcentaje de MarkUp (%)"
                                    required
                                    value={Number(form.markup) > 0 ? Number(form.markup) : ""}
                                    onChange={(value) => updateField("markup", String(value))}
                                    step={1}   min={30}   max={50}
                                />
                                <AddProductNumberField
                                    label="Porcentaje del margen de riesgos para la tabla de recursos (%)"
                                    required
                                    value={Number(form.gm_general) > 0 ? Number(form.gm_general) : ""}
                                    onChange={(value) => updateField("gm_general", String(value))}
                                    step={1}   min={1}   max={10}
                                />
                                <AddProductNumberField
                                    label="Porcentaje del margen de riesgos para la tabla de viáticos (%)"
                                    required
                                    value={Number(form.gm_viaticos) > 0 ? Number(form.gm_viaticos) : ""}
                                    onChange={(value) => updateField("gm_viaticos", String(value))}
                                    step={1}   min={1}   max={10}
                                />
                                <AddProductReadonlyField
                                    label="Gross Margin"
                                    value={Number(form.gm) > 0 ? String(Number(form.gm)) : ""}
                                />
                            </div>

                            <div className="grid gap-6">
                                <h2 className="mt-2 mb-2 text-1xl font-bold text-red-900">Parámetros financieros</h2>
                                <AddProductNumberField
                                    label="IGV (Impuesto General a la Venta)"
                                    required
                                    value={Number(form.igv) > 0 ? Number(form.igv) : ""}
                                    onChange={(value) => updateField("igv", String(value))}
                                    step={0.01}   min={0.1}   max={0.2}
                                />
                                <AddProductNumberField
                                    label="Tasa de cambio"
                                    required
                                    value={Number(form.tasa_cambio) > 0 ? Number(form.tasa_cambio) : ""}
                                    onChange={(value) => updateField("tasa_cambio", String(value))}
                                    step={0.01}   min={3.00}   max={4.50}
                                />
                                <AddProductTextField
                                    label="Código de cotización"
                                    placeholder="C001-202607009"
                                    value={form.cod_cotizacion ?? ""}
                                    onChange={(value) => updateField("cod_cotizacion", value)}
                                />
                            </div>
                        </div>

                        <div className="mt-6 grid gap-6 grid-cols-[2fr_2fr]">
                            <div className="rounded-2xl border border-slate-200 p-4">
                                <SummaryCostTable1/>
                            </div>
                            <div className="rounded-2xl border border-slate-200 p-4">
                                <EP_PriceTable/>
                                <Structure_PriceTable/>
                                <Consume_PriceTable/>
                                <EPP_PriceTable/>
                                <Tooling_PriceTable/>
                                <Hotel_PriceTable/>
                                <Personal_PriceTable/>
                                <SCTR_PriceTable/>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-6 grid-cols-[2fr_2fr]">
                            <div className="rounded-2xl border border-slate-200 p-4">
                                <SummaryCostTable2/>
                            </div>
                            <div className="rounded-2xl border border-slate-200 p-4">
                                <Courier_PriceTable/>
                                <Eating_PriceTable/>
                                <Traveling_PriceTable/>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-6 grid-cols">
                            <SummaryCostTable/>
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
                            Actualizar Cotización
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}