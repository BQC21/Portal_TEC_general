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
                        <div className="mt-6 grid gap-6 md:grid-cols-2">
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
                        </div>
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