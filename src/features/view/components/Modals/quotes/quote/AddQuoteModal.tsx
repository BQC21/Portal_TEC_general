"use client"

import { AddQuoteModalProps } from "@/lib/types/components/modals";
import { AddProductCloseIcon } from "../../../Icons/AddCloseIcon";
import { useProjects } from "@/features/view/hooks/services/useRealtimeProjects";
import { useState } from "react";
import { QuoteFormState } from "@/lib/types/supabase/quote-types";
import { INITIAL_PROJECT_FORM, INITIAL_QUOTE_FORM } from "@/lib/utils/initialValues";
import { ProjectFormState } from "@/lib/types/supabase/project-types";
import { AddProductSelectField } from "../../../Form_fields/AddSelectField";
import { ProjectSelection } from "@/features/view/hooks/modals/useProjectSelection";
import { AddProductNumberField } from "../../../Form_fields/AddNumberField";

export default function AddQuoteModal({
    onAddQuote,
    onClose,
    existing_project_equipos,
    existing_project_materiales,
}: AddQuoteModalProps) {

    // ESTADOS
    const { projects } = useProjects();

    const [form, setForm] = useState<QuoteFormState>(INITIAL_QUOTE_FORM);
    const [form_project, setForm_project] = useState<ProjectFormState>(INITIAL_PROJECT_FORM);

    // SELECCIONADOS
    const hasSelectedProject = Boolean(form.proyecto_id);

    const projectEquipos = hasSelectedProject
        ? existing_project_equipos.filter((item) => item.proyecto_id === form.proyecto_id)
        : [];

    const projectMateriales = hasSelectedProject
        ? existing_project_materiales.filter((item) => item.proyecto_id === form.proyecto_id)
        : [];

    const equiposDescriptions = projectEquipos
        .map((item) => item.equipo_info?.descripcion)
        .filter((description): description is string => Boolean(description));

    const materialesDescriptions = projectMateriales
        .map((item) => item.material_info?.descripcion)
        .filter((description): description is string => Boolean(description));

    // EVENTOS
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await onAddQuote({ ...form });
    }

    function updateField<K extends keyof QuoteFormState>(field: K, value: QuoteFormState[K]) {
        setForm((current) => {
            const updated = { ...current, [field]: value };
            return updated;
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Añadir Nueva Cotización</h2>
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
                        options={["Seleccione proyecto", ...projects.map((project) => project.nombre)]}
                        onChange={(value) => ProjectSelection(value, projects, setForm_project, setForm)}
                    />

                    {hasSelectedProject && (
                        <>
                        <div className="mt-6 grid gap-6 grid-cols-[2fr_2fr_2fr]">
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
                            
                            <div className="mt-6 grid gap-6">
                                <h2 className="mt-10 mb-10 text-1xl font-bold text-red-900">Márgenes financieros</h2>
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

                    <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
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
                            Añadir Cotización
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
